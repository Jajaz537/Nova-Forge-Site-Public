import {spawn} from "node:child_process";
import {mkdtempSync,rmSync} from "node:fs";
import {setTimeout as sleep} from "node:timers/promises";
import assert from "node:assert/strict";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4196";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=24000+(process.pid%1000);
const userDataDir=mkdtempSync("/tmp/modaryx-game-support-");
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--no-first-run","--no-default-browser-check",
  "--remote-debugging-address=127.0.0.1","--remote-debugging-port="+port,
  "--user-data-dir="+userDataDir,"about:blank"
],{stdio:["ignore","ignore","pipe"]});
let stderr="";
proc.stderr?.on("data",chunk=>{stderr=(stderr+String(chunk)).slice(-6000);});
let ws,nextId=1; const pending=new Map();
const waitJson=async path=>{
  let last;
  for(let i=0;i<300;i++){
    if(proc.exitCode!==null) throw new Error("Chrome exited "+proc.exitCode+"\n"+stderr);
    try{const r=await fetch("http://127.0.0.1:"+port+path);if(r.ok)return await r.json();last=new Error("HTTP "+r.status);}catch(e){last=e}
    await sleep(100);
  }
  throw new Error("CDP unavailable: "+String(last||"unknown")+"\n"+stderr);
};
const send=(method,params={})=>{const id=nextId++;ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))};
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval failed");return r.result?.result?.value};
const waitText=async text=>{
  for(let i=0;i<100;i++){if(await evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`))return;await sleep(100)}
  throw new Error("text missing: "+text);
};
try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const target=targets.find(x=>x.type==="page");
  if(!target?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true})});
  ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m)});
  await send("Page.enable"); await send("Runtime.enable"); await send("Page.bringToFront");
  await send("Page.navigate",{url:origin+"/games"});
  for(let i=0;i<100;i++){if(await evaluate("document.readyState==='complete'"))break;await sleep(100)}
  let disclosureReady=false;
  for(let i=0;i<100;i++){
    disclosureReady=await evaluate('Boolean(document.querySelector(".game-support-request button[aria-expanded]"))');
    if(disclosureReady) break;
    await sleep(100);
  }
  assert.equal(disclosureReady,true,"support request disclosure control did not load");
  const opened=await evaluate(`(()=>{const b=document.querySelector(".game-support-request button[aria-expanded]");if(!b)return false;b.click();return true})()`);
  assert.equal(opened,true,"support request disclosure control missing");
  await waitText("Préparer la demande locale");
  const filled=await evaluate(`(()=>{const i=document.querySelector("#game-support-name");if(!i)return false;const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set;s.call(i,"Project Meridian");i.dispatchEvent(new Event("input",{bubbles:true}));return true})()`);
  assert.equal(filled,true,"game support input missing");
  const prepared=await evaluate(`(()=>{const b=[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="Préparer la demande locale");if(!b)return false;b.click();return true})()`);
  assert.equal(prepared,true,"prepare local draft button missing");
  await waitText("Brouillon de demande — non envoyé");
  assert.equal(await evaluate("Boolean(document.querySelector('script[data-modaryx-turnstile=\"1\"]'))"),false,"guest/local draft must not invent Turnstile challenge");
  console.log("PASS_V2_GAME_SUPPORT_UI_BROWSER_GUEST_FLOW");
} finally {
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
  try{rmSync(userDataDir,{recursive:true,force:true})}catch{}
}
