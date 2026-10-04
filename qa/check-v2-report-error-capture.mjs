import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9231;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars",
  "--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-report-error-capture-proof",
  "about:blank"
],{stdio:"ignore"});

let ws; let nextId=1; const pending=new Map();
function send(method,params={}){const id=nextId++;ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));}
async function waitJson(path){let last;for(let i=0;i<200;i++){try{const r=await fetch(`http://127.0.0.1:${port}${path}`);if(r.ok)return await r.json();last=new Error("HTTP "+r.status);}catch(e){last=e;}await sleep(100);}throw last||new Error("CDP unavailable");}
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"Runtime.evaluate failed");return r.result?.result?.value;}
async function clickText(selector,text){const ok=await evaluate(`(() => {const t=[...document.querySelector(${JSON.stringify(selector)} ? ${JSON.stringify(selector)} : '')];return false;})()`);}
async function clickByText(selector,text){
  const ok=await evaluate(`(() => {
    const target=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>{
      if(el.textContent.trim()!==${JSON.stringify(text)}) return false;
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    });
    if(!target) return false; target.click(); return true;
  })()`);
  if(!ok) throw new Error("target not found: "+selector+" / "+text);
  await sleep(120);
}
async function clickSelector(selector){
  const ok=await evaluate(`(() => {const t=document.querySelector(${JSON.stringify(selector)});if(!t)return false;t.click();return true;})()`);
  if(!ok) throw new Error("selector not found: "+selector);
  await sleep(120);
}
async function navigate(width,height){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<760});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){if(await evaluate("document.readyState==='complete'")) break;await sleep(100);}
  await sleep(250);
}
async function prepareError(width,height){
  await navigate(width,height);
  if(width<760){
    await clickSelector(".mobile-menu");
  }
  await clickByText(".global-nav button","Mods & contenus");
  await clickSelector(".card-hit");
  await clickByText(".detail-tabs button","Signalement");
  await clickByText(".report-section .primary","Préparer le signalement local");
  const errorPresent=await evaluate("!!document.querySelector('#report-reason-error')");
  if(!errorPresent) throw new Error("report validation error missing");
  await evaluate("document.querySelector('#report-reason-error')?.scrollIntoView({block:'center'})");
  await sleep(120);
  const rect=await evaluate(`(() => {
    const el=document.querySelector('#report-reason-error'); if(!el) return null;
    const r=el.getBoundingClientRect();
    return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height,innerHeight:innerHeight,innerWidth:innerWidth};
  })()`);
  if(!rect) throw new Error("error rect missing");
  if(rect.top<0||rect.bottom>rect.innerHeight||rect.width<=0||rect.height<=0) throw new Error("error state not centered in viewport: "+JSON.stringify(rect));
  const metrics=await send("Page.getLayoutMetrics");
  const viewport=metrics.result.visualViewport||{};
  const shot=await send("Page.captureScreenshot",{
    format:"png",fromSurface:true,captureBeyondViewport:false,
    clip:{x:viewport.pageX||0,y:viewport.pageY||0,width,height,scale:1}
  });
  const bytes=Buffer.from(shot.result.data,"base64").length;
  return {rect,bytes,pageY:viewport.pageY||0};
}

try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const page=targets.find(x=>x.type==="page");
  if(!page?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
  ws.addEventListener("message",event=>{const msg=JSON.parse(event.data);if(!msg.id||!pending.has(msg.id))return;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg);});
  await send("Page.enable"); await send("Runtime.enable");

  const mobile=await prepareError(390,844);
  console.log("REPORT_ERROR_CAPTURE_MOBILE",JSON.stringify(mobile));
  if(mobile.bytes<20000) throw new Error("mobile report error screenshot unexpectedly small/blank: "+mobile.bytes);

  const desktop=await prepareError(1440,1024);
  console.log("REPORT_ERROR_CAPTURE_DESKTOP",JSON.stringify(desktop));
  if(desktop.bytes<60000) throw new Error("desktop report error screenshot unexpectedly small/blank: "+desktop.bytes);

  console.log("PASS_V2_REPORT_ERROR_CAPTURE_VIEWPORT");
}finally{
  try{ws?.close();}catch{}
  proc.kill("SIGTERM");
}
