import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9231;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-rights-notification-proof","about:blank"
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
  for(let i=0;i<120;i++){
    try{
      const r=await fetch(`http://127.0.0.1:${port}${path}`);
      if(r.ok) return await r.json();
      last=new Error("HTTP "+r.status);
    }catch(e){last=e}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable");
}
async function waitBodyText(value){
  for(let i=0;i<80;i++){
    if(await evaluate(`document.body?.innerText.includes(${JSON.stringify(value)})`)) return;
    await sleep(75);
  }
  throw new Error("missing text: "+value);
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
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await waitBodyText("Catalogue consultable — téléchargement non garanti");

  const opened=await evaluate(`(() => {
    const menu=document.querySelector('.mobile-menu'); if(!menu) return false; menu.click();
    const b=[...document.querySelectorAll('.global-nav .mobile-nav-utility')].find(el=>el.textContent.includes('Notifications'));
    if(!b) return false; b.click(); return true;
  })()`);
  if(!opened) throw new Error("notifications navigation unavailable");

  await waitBodyText("Centre de notifications");
  await waitBodyText("Réponse éditeur reçue — Aetherlands");
  await waitBodyText("Démonstration · non reçue");
  await waitBodyText("LEGAL_REVIEW_REQUIRED");

  const overflow=await evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth");
  if(overflow>1) throw new Error("notification preview horizontal overflow "+overflow);

  const realClaims=await evaluate(`(() => {
    const t=document.querySelector('.notification-demo-list')?.innerText||'';
    return {
      markedDemo:t.includes('Démonstration · non reçue'),
      approved:t.includes('APPROVED_WITH_LIMITS'),
      legal:t.includes('LEGAL_REVIEW_REQUIRED')
    };
  })()`);
  if(!realClaims?.markedDemo||!realClaims?.approved||!realClaims?.legal) throw new Error("notification demo truth markers incomplete");

  console.log("RIGHTS_NOTIFICATION_MOBILE_OVERFLOW",overflow);
  console.log("PASS_V2_RIGHTS_NOTIFICATION_PREVIEW");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
