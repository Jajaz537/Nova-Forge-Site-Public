import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9226;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars",
  "--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-atmosphere-touch-proof",
  "about:blank"
],{stdio:"ignore"});

let ws; let nextId=1;
const pending=new Map();
function send(method,params={}) {
  const id=nextId++; ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function waitJson(path){
  let last;
  for(let i=0;i<200;i++){
    try{const r=await fetch(`http://127.0.0.1:${port}${path}`); if(r.ok)return await r.json(); last=new Error("HTTP "+r.status);}
    catch(e){last=e;}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable");
}
async function evaluate(expression){
  const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error(r.exceptionDetails.text||"Runtime.evaluate failed");
  return r.result?.result?.value;
}

try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const page=targets.find(x=>x.type==="page");
  if(!page?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
  ws.addEventListener("message",event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id)) return;
    const p=pending.get(msg.id); pending.delete(msg.id);
    msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg);
  });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  await sleep(300);
  const sizes=await evaluate(`[...document.querySelectorAll('.atmosphere-preview button')].map(b=>{const r=b.getBoundingClientRect();return {label:b.textContent.trim(),width:r.width,height:r.height}})`);
  if(!Array.isArray(sizes)||sizes.length!==3) throw new Error("expected 3 atmosphere buttons, got "+JSON.stringify(sizes));
  const bad=sizes.filter(x=>x.width<44||x.height<44);
  console.log("ATMOSPHERE_TOUCH_TARGETS",JSON.stringify(sizes));
  if(bad.length) throw new Error("atmosphere touch targets below 44x44: "+JSON.stringify(bad));
  console.log("PASS_V2_GAME_ATMOSPHERE_TOUCH_TARGETS");
}finally{
  proc.kill("SIGTERM");
}
