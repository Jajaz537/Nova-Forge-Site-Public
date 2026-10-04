import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9249;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-touch-matrix-"+process.pid,"about:blank"
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
async function openMenu(){
  const ok=await evaluate(`(async()=>{
    const nav=document.querySelector('.global-nav'),menu=document.querySelector('.mobile-menu');
    if(!nav||!menu) return false;
    const r=nav.getBoundingClientRect(),s=getComputedStyle(nav);
    if(s.display!=='none'&&r.width>0&&r.height>0) return true;
    menu.click(); await new Promise(resolve=>setTimeout(resolve,180));
    const nr=nav.getBoundingClientRect(),ns=getComputedStyle(nav);
    return ns.display!=='none'&&nr.width>0&&nr.height>0;
  })()`);
  if(!ok) throw new Error("mobile menu unavailable");
}
async function clickPrimary(text){
  await openMenu();
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('.global-nav button')].find(x=>x.textContent.trim()===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click primary "+text);
  await sleep(230);
}
async function clickUtility(text){
  const direct=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('.mobile-search,.top-actions button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(direct){await sleep(230);return;}
  await openMenu();
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('.global-nav .mobile-nav-utility')].find(x=>x.textContent.trim()===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click utility "+text);
  await sleep(230);
}
async function clickExact(selector,text){
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.trim()===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(230);
}
async function assertTargets(label){
  const result=await evaluate(`(()=>{
    const selector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[role="button"]';
    const targets=[...document.querySelectorAll(selector)].filter(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    });
    const small=targets.filter(el=>{
      const r=el.getBoundingClientRect();
      return r.width<44||r.height<44;
    }).map(el=>{
      const r=el.getBoundingClientRect();
      return {tag:el.tagName,label:el.getAttribute('aria-label')||el.textContent.trim().slice(0,70),width:Math.round(r.width*10)/10,height:Math.round(r.height*10)/10,cls:(el.className||'').toString().slice(0,90)};
    });
    return {count:targets.length,small};
  })()`);
  if(result.small.length) throw new Error(label+" mobile targets below 44x44: "+JSON.stringify(result.small.slice(0,12)));
  console.log("TOUCH_MATRIX_SURFACE",label,result.count);
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
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<100;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await sleep(220);

  let count=0;
  await assertTargets("game-hub"); count++;

  const detailOpened=await evaluate(`(()=>{const b=document.querySelector('.content-card .card-hit');if(!b)return false;b.click();return true;})()`);
  if(!detailOpened) throw new Error("content detail entry unavailable");
  await sleep(230);
  await assertTargets("content-detail"); count++;
  await clickExact(".back","← Retour aux contenus");

  await clickPrimary("Jeux"); await assertTargets("games-index"); count++;
  await clickUtility("Recherche globale"); await assertTargets("global-search"); count++;
  await clickPrimary("Mods & contenus"); await assertTargets("catalog"); count++;
  await clickPrimary("Collections"); await assertTargets("collections"); count++;
  await clickPrimary("Créateurs"); await assertTargets("creators"); count++;
  await clickPrimary("Communauté"); await assertTargets("community"); count++;
  await clickPrimary("Créer"); await assertTargets("creator-studio"); count++;
  await clickUtility("Bibliothèque"); await assertTargets("library"); count++;
  await clickUtility("Notifications"); await assertTargets("notifications"); count++;
  await clickUtility("Compte"); await assertTargets("account"); count++;
  await clickUtility("MODARYX IA"); await assertTargets("modaryx-ai"); count++;
  await clickExact("footer button","Droits jeux · démo admin"); await assertTargets("rights-dashboard"); count++;
  await clickExact("footer button","Confiance & légal"); await assertTargets("public-trust"); count++;
  await clickExact("footer button","Aide & documentation"); await assertTargets("help-docs"); count++;
  await clickExact("footer button","Droits jeux · démo admin");

  await clickExact(".support-triage-actions button","Accepter la baseline sûre");
  await clickExact(".publisher-contact-actions button","Vérifier le canal de démonstration");
  await clickExact(".publisher-contact-actions button","Préparer la demande structurée");
  await assertTargets("rights-expanded"); count++;

  console.log("TOUCH_MATRIX_SURFACE_COUNT",count);
  console.log("PASS_V2_MOBILE_TOUCH_TARGET_MATRIX");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
