import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9241;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-active-state-semantics","about:blank"
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
async function waitReady(){
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState==='complete'")) return;
    await sleep(75);
  }
  throw new Error("document readiness timeout");
}
async function clickExact(selector,text){
  const ok=await evaluate(`(() => {
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.trim()===${JSON.stringify(text)});
    if(!el||el.disabled||el.getBoundingClientRect().width===0) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(160);
}
async function assertCurrent(text){
  const value=await evaluate(`(() => {
    const el=[...document.querySelectorAll('.global-nav button')].find(x=>x.textContent.trim()===${JSON.stringify(text)});
    return el?.getAttribute('aria-current')||null;
  })()`);
  if(value!=="page") throw new Error(text+" missing aria-current=page");
}
async function assertPressed(selector,text,expected=true){
  const value=await evaluate(`(() => {
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.trim()===${JSON.stringify(text)});
    return el?.getAttribute('aria-pressed')||null;
  })()`);
  if(value!==String(expected)) throw new Error(text+" aria-pressed expected "+expected+" got "+value);
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
  await waitReady();
  await sleep(220);

  await assertCurrent("Jeux");
  await assertPressed(".local-nav button","Aperçu",true);
  await assertPressed(".local-nav button","Collections",false);
  await clickExact(".local-nav button","Collections");
  await assertPressed(".local-nav button","Collections",true);
  await assertPressed(".local-nav button","Aperçu",false);

  await clickExact(".global-nav button","Mods & contenus");
  await assertCurrent("Mods & contenus");
  const oldCurrent=await evaluate(`(() => {
    const el=[...document.querySelectorAll('.global-nav button')].find(x=>x.textContent.trim()==='Jeux');
    return el?.getAttribute('aria-current')||null;
  })()`);
  if(oldCurrent!==null) throw new Error("old primary navigation item remained current");

  const gridPressed=await evaluate(`(() => {
    const grid=document.querySelector('.view-toggle button[aria-label="Vue grille"]');
    const list=document.querySelector('.view-toggle button[aria-label="Vue liste"]');
    return {grid:grid?.getAttribute('aria-pressed'),list:list?.getAttribute('aria-pressed')};
  })()`);
  if(gridPressed.grid!=="true"||gridPressed.list!=="false") throw new Error("catalog view toggle semantics invalid: "+JSON.stringify(gridPressed));

  const accountOpened=await evaluate(`(() => {
    const b=[...document.querySelectorAll('.top-actions button')].find(x=>x.getAttribute('aria-label')==='Compte');
    if(!b) return false; b.click(); return true;
  })()`);
  if(!accountOpened) throw new Error("account utility unavailable");
  await sleep(160);
  const accountCurrent=await evaluate(`document.querySelector('.top-actions button[aria-label="Compte"]')?.getAttribute('aria-current')||null`);
  if(accountCurrent!=="page") throw new Error("account utility missing aria-current");
  await assertPressed(".account-nav button","Compte",true);
  await clickExact(".account-nav button","Accessibilité");
  await assertPressed(".account-nav button","Accessibilité",true);
  await assertPressed(".account-nav button","Compte",false);

  console.log("ACTIVE_STATE_PRIMARY_NAV_OK");
  console.log("ACTIVE_STATE_LOCAL_TABS_OK");
  console.log("ACTIVE_STATE_VIEW_TOGGLE_OK");
  console.log("ACTIVE_STATE_ACCOUNT_TABS_OK");
  console.log("PASS_V2_ACTIVE_STATE_SEMANTICS");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
