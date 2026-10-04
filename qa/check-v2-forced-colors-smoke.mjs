import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9250;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-forced-colors-"+process.pid,"about:blank"
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
    return true;
  })()`);
  if(!ok) throw new Error("menu unavailable");
}
async function clickPrimary(text){
  await openMenu();
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('.global-nav button')].find(x=>x.textContent.trim()===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click primary "+text);
  await sleep(220);
}
async function clickUtility(text){
  const direct=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('.mobile-search,.top-actions button')].find(x=>x.getAttribute('aria-label')===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(direct){await sleep(220);return;}
  await openMenu();
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll('.global-nav .mobile-nav-utility')].find(x=>x.textContent.trim()===${JSON.stringify(text)}&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click utility "+text);
  await sleep(220);
}
async function clickExact(selector,text){
  const ok=await evaluate(`(()=>{
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.includes(${JSON.stringify(text)})&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false; el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(220);
}
async function assertSurface(label){
  const result=await evaluate(`(()=>{
    const main=document.querySelector('main#main-content');
    const h1=main?.querySelector('h1');
    const de=document.documentElement;
    const focusables=[...document.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    });
    const invisible=focusables.filter(el=>{
      const s=getComputedStyle(el);
      return Number(s.opacity)<0.5||s.color==='rgba(0, 0, 0, 0)'||s.color==='transparent';
    }).map(el=>({tag:el.tagName,label:el.getAttribute('aria-label')||el.textContent.trim().slice(0,60),color:getComputedStyle(el).color,opacity:getComputedStyle(el).opacity}));
    return {
      forced:matchMedia('(forced-colors: active)').matches,
      mainVisible:!!main&&main.getBoundingClientRect().width>0&&main.getBoundingClientRect().height>0,
      h1:(h1?.textContent||'').trim(),
      overflow:de.scrollWidth-de.clientWidth,
      focusableCount:focusables.length,
      invisible
    };
  })()`);
  if(!result.forced) throw new Error("forced-colors emulation inactive");
  if(!result.mainVisible||!result.h1) throw new Error(label+" main/h1 not visible");
  if(result.overflow>1) throw new Error(label+" forced-colors horizontal overflow "+result.overflow);
  if(!result.focusableCount) throw new Error(label+" no visible focusable controls");
  if(result.invisible.length) throw new Error(label+" invisible controls in forced colors "+JSON.stringify(result.invisible.slice(0,10)));
  console.log("FORCED_COLORS_SURFACE",label,result.focusableCount,result.h1);
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
  await send("Emulation.setEmulatedMedia",{media:"screen",features:[
    {name:"forced-colors",value:"active"},
    {name:"prefers-reduced-motion",value:"reduce"}
  ]});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<100;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await sleep(220);

  let count=0;
  await assertSurface("game-hub"); count++;
  await clickPrimary("Jeux"); await assertSurface("games-index"); count++;
  await clickUtility("Recherche globale"); await assertSurface("global-search"); count++;
  await clickPrimary("Mods & contenus"); await assertSurface("catalog"); count++;
  await clickPrimary("Collections"); await assertSurface("collections"); count++;
  await clickPrimary("Créateurs"); await assertSurface("creators"); count++;
  await clickPrimary("Communauté"); await assertSurface("community"); count++;
  await clickPrimary("Créer"); await assertSurface("creator-studio"); count++;
  await clickUtility("Bibliothèque"); await assertSurface("library"); count++;
  await clickUtility("Compte"); await assertSurface("account"); count++;
  await clickUtility("MODARYX IA"); await assertSurface("modaryx-ai"); count++;
  await clickExact("footer button","Droits jeux · démo admin"); await assertSurface("rights-dashboard"); count++;
  await clickExact("footer button","Confiance & légal"); await assertSurface("public-trust"); count++;

  console.log("FORCED_COLORS_SURFACE_COUNT",count);
  console.log("PASS_V2_FORCED_COLORS_SMOKE");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
