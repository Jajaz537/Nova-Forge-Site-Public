import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9243;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-a11y-structure-matrix","about:blank"
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
  for(let i=0;i<160;i++){
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
  const ok=await evaluate(`(() => {
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.trim()===${JSON.stringify(text)} && getComputedStyle(x).display!=='none');
    if(!el||el.disabled||el.getBoundingClientRect().width===0) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(220);
}
async function clickAria(label){
  const ok=await evaluate(`(() => {
    const el=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(label)} && getComputedStyle(x).display!=='none' && x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click aria "+label);
  await sleep(220);
}
async function assertSurface(label){
  const dom=await evaluate(`(() => {
    const visible=el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    };
    const mains=[...document.querySelectorAll('main#main-content')];
    const headings=mains[0]?[...mains[0].querySelectorAll('h1')]:[];
    const ids=[...document.querySelectorAll('[id]')].map(el=>el.id).filter(Boolean);
    const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
    const positiveTab=[...document.querySelectorAll('[tabindex]')].filter(el=>Number(el.getAttribute('tabindex'))>0).map(el=>({tag:el.tagName,tabindex:el.getAttribute('tabindex')}));
    const interactives=[...document.querySelectorAll('button,a[href],input,select,textarea')].filter(visible);
    const unnamed=interactives.filter(el=>{
      if(el.matches('input,select,textarea')){
        return !(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.getAttribute('title')||el.labels?.length);
      }
      return !(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.getAttribute('title')||el.textContent.trim());
    }).map(el=>({tag:el.tagName,cls:el.className?.toString?.().slice(0,80)||'',type:el.getAttribute('type')||'',html:el.outerHTML.slice(0,180)}));
    return {
      mainCount:mains.length,
      h1Count:headings.length,
      h1Text:headings[0]?.textContent?.trim()||'',
      duplicates,
      positiveTab,
      unnamed,
      visibleInteractiveCount:interactives.length
    };
  })()`);
  if(dom.mainCount!==1) throw new Error(label+" expected one main#main-content: "+JSON.stringify(dom));
  if(dom.h1Count!==1||!dom.h1Text) throw new Error(label+" expected exactly one named h1: "+JSON.stringify(dom));
  if(dom.duplicates.length) throw new Error(label+" duplicate ids: "+JSON.stringify(dom.duplicates));
  if(dom.positiveTab.length) throw new Error(label+" positive tabindex: "+JSON.stringify(dom.positiveTab));
  if(dom.unnamed.length) throw new Error(label+" unnamed visible controls: "+JSON.stringify(dom.unnamed));

  const ax=await send("Accessibility.getFullAXTree");
  const nodes=ax.result?.nodes||[];
  const roles=new Set(["button","link","textbox","combobox","checkbox","radio","switch","menuitem","tab"]);
  const unnamedAx=nodes.filter(node=>!node.ignored&&roles.has(node.role?.value||"")&&!(node.name?.value||"").trim())
    .map(node=>({role:node.role?.value||"",nodeId:node.nodeId||""})).slice(0,10);
  if(unnamedAx.length) throw new Error(label+" AX unnamed interactive roles: "+JSON.stringify(unnamedAx));
  console.log("A11Y_STRUCTURE_SURFACE",label,dom.visibleInteractiveCount,dom.h1Text);
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
  await send("Accessibility.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1024,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await sleep(220);

  let count=0;
  await assertSurface("game-hub"); count++;

  const detailOpened=await evaluate(`(() => {
    const b=document.querySelector('.content-card .card-hit');
    if(!b) return false; b.click(); return true;
  })()`);
  if(!detailOpened) throw new Error("content detail entry unavailable");
  await sleep(220);
  await assertSurface("content-detail"); count++;
  await clickExact(".back","← Retour aux contenus");
  await assertSurface("game-hub-return"); count++;

  await clickExact(".global-nav button","Jeux");
  await assertSurface("games-index"); count++;

  await clickAria("Recherche globale");
  await assertSurface("global-search"); count++;

  await clickExact(".global-nav button","Mods & contenus");
  await assertSurface("catalog"); count++;

  await clickExact(".global-nav button","Collections");
  await assertSurface("collections"); count++;

  await clickExact(".global-nav button","Créateurs");
  await assertSurface("creators"); count++;

  await clickExact(".global-nav button","Communauté");
  await assertSurface("community"); count++;

  await clickExact(".global-nav button","Créer");
  await assertSurface("creator-studio"); count++;

  await clickAria("Bibliothèque");
  await assertSurface("library"); count++;

  await clickAria("Notifications");
  await assertSurface("notifications"); count++;

  await clickAria("Compte");
  await assertSurface("account"); count++;

  await clickAria("MODARYX IA");
  await assertSurface("modaryx-ai"); count++;

  await clickExact("footer button","Droits jeux · démo admin");
  await assertSurface("rights-dashboard"); count++;

  console.log("A11Y_STRUCTURE_SURFACE_COUNT",count);
  console.log("PASS_V2_ACCESSIBILITY_STRUCTURE_MATRIX");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
