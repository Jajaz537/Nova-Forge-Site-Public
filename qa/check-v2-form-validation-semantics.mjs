import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9244;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-form-validation","about:blank"
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
async function clickContains(selector,text){
  const ok=await evaluate(`(() => {
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.includes(${JSON.stringify(text)}) && getComputedStyle(x).display!=='none' && x.getBoundingClientRect().width>0);
    if(!el||el.disabled) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(180);
}
async function typeInto(selector,value){
  const ok=await evaluate(`(() => {
    const el=document.querySelector(${JSON.stringify(selector)});
    if(!el) return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(el,${JSON.stringify(value)});
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  })()`);
  if(!ok) throw new Error("unable to type into "+selector);
  await sleep(140);
}
async function assertError(fieldId,errorId,expectedText,label){
  const state=await evaluate(`(() => {
    const field=document.getElementById(${JSON.stringify(fieldId)});
    const error=document.getElementById(${JSON.stringify(errorId)});
    return {
      activeId:document.activeElement?.id||"",
      invalid:field?.getAttribute('aria-invalid')||null,
      describedBy:field?.getAttribute('aria-describedby')||null,
      errorText:error?.textContent?.trim()||"",
      errorRole:error?.getAttribute('role')||null
    };
  })()`);
  if(state.activeId!==fieldId) throw new Error(label+" focus not moved to invalid field: "+JSON.stringify(state));
  if(state.invalid!=="true") throw new Error(label+" aria-invalid missing: "+JSON.stringify(state));
  if(state.describedBy!==errorId) throw new Error(label+" aria-describedby missing: "+JSON.stringify(state));
  if(state.errorRole!=="alert") throw new Error(label+" error role alert missing: "+JSON.stringify(state));
  if(!state.errorText.includes(expectedText)) throw new Error(label+" error text mismatch: "+JSON.stringify(state));
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
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await sleep(220);

  await clickContains(".global-nav button","Jeux");
  await clickContains(".game-support-request>.quiet","Demander le support d’un jeu");
  await clickContains(".game-request-form .primary","Préparer la demande locale");
  await sleep(120);
  await assertError("game-support-name","game-support-name-error","Saisissez un nom de jeu","game support request");

  await typeInto("#game-support-name","Project Meridian");
  const requestCleared=await evaluate(`(() => {
    const field=document.getElementById('game-support-name');
    return {
      invalid:field?.getAttribute('aria-invalid')||null,
      describedBy:field?.getAttribute('aria-describedby')||null,
      errorExists:!!document.getElementById('game-support-name-error')
    };
  })()`);
  if(requestCleared.invalid!==null||requestCleared.describedBy!==null||requestCleared.errorExists){
    throw new Error("game support error state did not clear: "+JSON.stringify(requestCleared));
  }

  await clickContains("footer button","Game Hub");
  const detailOpened=await evaluate(`(() => {
    const b=document.querySelector('.content-card .card-hit');
    if(!b) return false; b.click(); return true;
  })()`);
  if(!detailOpened) throw new Error("content detail entry unavailable");
  await sleep(180);
  await clickContains(".detail-tabs button","Signalement");
  await clickContains(".report-section .primary","Préparer le signalement local");
  await sleep(120);
  await assertError("report-reason","report-reason-error","Choisissez une raison","report");

  const reportSelect=await evaluate(`(() => {
    const el=document.getElementById('report-reason');
    if(!el) return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;
    setter.call(el,'Droits / licence');
    el.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  })()`);
  if(!reportSelect) throw new Error("report select unavailable");
  await sleep(140);
  const reportCleared=await evaluate(`(() => {
    const field=document.getElementById('report-reason');
    return {
      invalid:field?.getAttribute('aria-invalid')||null,
      describedBy:field?.getAttribute('aria-describedby')||null,
      errorExists:!!document.getElementById('report-reason-error')
    };
  })()`);
  if(reportCleared.invalid!==null||reportCleared.describedBy!==null||reportCleared.errorExists){
    throw new Error("report error state did not clear: "+JSON.stringify(reportCleared));
  }

  console.log("FORM_ERROR_GAME_REQUEST_ASSOCIATED");
  console.log("FORM_ERROR_REPORT_ASSOCIATED");
  console.log("FORM_ERROR_FOCUS_RECOVERY_OK");
  console.log("FORM_ERROR_CLEAR_RECOVERY_OK");
  console.log("PASS_V2_FORM_VALIDATION_SEMANTICS");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
