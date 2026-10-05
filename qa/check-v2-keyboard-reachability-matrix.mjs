import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9248;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-keyboard-matrix-"+process.pid,"about:blank"
],{stdio:"ignore"});

let ws;
let nextId=1;
const pending=new Map();
function send(method,params={}){
  const id=nextId++;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function evaluate(expression){
  const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error(r.exceptionDetails.text||"Runtime.evaluate failed");
  return r.result?.result?.value;
}
async function waitJson(path){
  let last;
  for(let i=0;i<180;i++){
    try{
      const r=await fetch("http://127.0.0.1:"+port+path);
      if(r.ok) return await r.json();
      last=new Error("HTTP "+r.status);
    }catch(e){last=e}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable");
}
async function clickExact(selector,text){
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.trim()===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(230);
}
async function clickAria(label){
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(label)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click aria "+label);
  await sleep(230);
}
async function pressTab(){
  const common={key:"Tab",code:"Tab",windowsVirtualKeyCode:9,nativeVirtualKeyCode:9};
  await send("Input.dispatchKeyEvent",{type:"keyDown",...common});
  await send("Input.dispatchKeyEvent",{type:"keyUp",...common});
}
async function assertKeyboardSurface(label){
  const setup=await evaluate(`(()=>{
    const selector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const visible=el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    };
    document.querySelectorAll('[data-qa-kb-id]').forEach(el=>el.removeAttribute('data-qa-kb-id'));
    const list=[...document.querySelectorAll(selector)].filter(visible);
    list.forEach((el,i)=>el.dataset.qaKbId=String(i));
    document.body.setAttribute('tabindex','-1');
    document.body.focus();
    return {count:list.length,labels:list.map(el=>el.getAttribute('aria-label')||el.textContent.trim().slice(0,60)||el.tagName)};
  })()`);
  if(!setup.count) throw new Error(label+" has no visible focusable controls");
  const reached=new Set();
  const noFocusIndicator=[];
  for(let i=0;i<setup.count;i++){
    await pressTab();
    const state=await evaluate(`(()=>{
      const el=document.activeElement;
      const id=el?.dataset?.qaKbId??null;
      if(id===null) return {id:null};
      const s=getComputedStyle(el);
      const outline=parseFloat(s.outlineWidth)||0;
      const visibleIndicator=(s.outlineStyle!=='none'&&outline>=2.5)||s.boxShadow!=='none';
      return {id:Number(id),visibleIndicator,outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,boxShadow:s.boxShadow};
    })()`);
    if(state.id!==null){
      reached.add(state.id);
      if(!state.visibleIndicator) noFocusIndicator.push({id:state.id,label:setup.labels[state.id],outlineStyle:state.outlineStyle,outlineWidth:state.outlineWidth,boxShadow:state.boxShadow});
    }
  }
  if(reached.size!==setup.count){
    const missing=setup.labels.map((name,i)=>({i,name})).filter(x=>!reached.has(x.i));
    throw new Error(label+" keyboard reachability "+reached.size+"/"+setup.count+" missing "+JSON.stringify(missing.slice(0,10)));
  }
  if(noFocusIndicator.length) throw new Error(label+" focused controls without strong visible indicator "+JSON.stringify(noFocusIndicator.slice(0,10)));
  console.log("KEYBOARD_MATRIX_SURFACE",label,reached.size,"/",setup.count,"FOCUS_INDICATORS",setup.count);
}

try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const target=targets.find(x=>x.type==="page");
  if(!target?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    ws.addEventListener("open",resolve,{once:true});
    ws.addEventListener("error",reject,{once:true});
  });
  ws.addEventListener("message",event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id)) return;
    const p=pending.get(msg.id); pending.delete(msg.id);
    msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg);
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1024,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<100;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await sleep(220);

  let count=0;
  await assertKeyboardSurface("game-hub"); count++;

  const detailOpened=await evaluate(`(()=>{const b=document.querySelector('.content-card .card-hit');if(!b)return false;b.click();return true;})()`);
  if(!detailOpened) throw new Error("content detail entry unavailable");
  await sleep(230);
  await assertKeyboardSurface("content-detail"); count++;
  await clickExact(".back","← Retour aux contenus");

  await clickExact(".global-nav button","Jeux"); await assertKeyboardSurface("games-index"); count++;
  await clickAria("Recherche globale"); await assertKeyboardSurface("global-search"); count++;
  await clickExact(".global-nav button","Mods & contenus"); await assertKeyboardSurface("catalog"); count++;
  await clickExact(".global-nav button","Collections"); await assertKeyboardSurface("collections"); count++;
  await clickExact(".global-nav button","Créateurs"); await assertKeyboardSurface("creators"); count++;
  await clickExact(".global-nav button","Communauté"); await assertKeyboardSurface("community"); count++;
  await clickExact(".global-nav button","Créer"); await assertKeyboardSurface("creator-studio"); count++;
  await clickAria("Bibliothèque"); await assertKeyboardSurface("library"); count++;
  await clickAria("Notifications"); await assertKeyboardSurface("notifications"); count++;
  await clickAria("Compte"); await assertKeyboardSurface("account"); count++;
  await clickAria("MODARYX IA"); await assertKeyboardSurface("modaryx-ai"); count++;
  await clickExact("footer button","Confiance & légal"); await assertKeyboardSurface("public-trust"); count++;
  await clickExact("footer button","Aide & documentation"); await assertKeyboardSurface("help-docs"); count++;
  await clickExact("footer button","Modération · démo admin"); await assertKeyboardSurface("moderation-center"); count++;
  await clickExact("footer button","Droits jeux · démo admin"); await assertKeyboardSurface("rights-dashboard"); count++;

  await clickExact(".support-triage-actions button","Accepter la baseline sûre");
  await clickExact(".publisher-contact-actions button","Vérifier le canal de démonstration");
  await clickExact(".publisher-contact-actions button","Préparer la demande structurée");
  await assertKeyboardSurface("rights-expanded"); count++;

  console.log("KEYBOARD_MATRIX_SURFACE_COUNT",count);
  console.log("PASS_V2_KEYBOARD_REACHABILITY_MATRIX");
  console.log("PASS_V2_FOCUS_VISIBLE_MATRIX");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
