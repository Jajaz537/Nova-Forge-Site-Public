import {spawn} from "node:child_process";
import {existsSync,readFileSync} from "node:fs";
import {setTimeout as sleep} from "node:timers/promises";
import assert from "node:assert/strict";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN;
const expectation=process.env.MODARYX_PWA_EXPECT;
const pidFile=process.env.MODARYX_PREVIEW_PID_FILE;
if(!chrome||!origin||!["disabled","enabled"].includes(expectation)) throw new Error("PWA browser proof env missing");
const profileDir="/tmp/modaryx-v2-pwa-"+process.pid;
const proc=spawn(chrome,["--headless=new","--no-sandbox","--disable-gpu","--remote-debugging-port=0","--user-data-dir="+profileDir,"about:blank"],{stdio:"ignore"});
let port=null,ws,nextId=1;const pending=new Map();
const waitForPort=async()=>{let last;const file=profileDir+"/DevToolsActivePort";for(let i=0;i<300;i++){try{if(existsSync(file)){const first=readFileSync(file,"utf8").trim().split(/\r?\n/)[0];const value=Number(first);if(Number.isInteger(value)&&value>0)return value}}catch(e){last=e}await sleep(100)}throw last||new Error("Chrome DevToolsActivePort unavailable")};
const wait=async path=>{let last;if(!port)port=await waitForPort();for(let i=0;i<200;i++){try{const r=await fetch("http://127.0.0.1:"+port+path);if(r.ok)return await r.json();last=new Error("HTTP "+r.status);}catch(e){last=e}await sleep(100)}throw last||new Error("CDP unavailable")};
const send=(method,params={})=>{const id=nextId++;ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))};
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval failed");return r.result?.result?.value};
const navigate=async url=>{await send("Page.navigate",{url});for(let i=0;i<100;i++){if(await evaluate("document.readyState==='complete'"))break;await sleep(100)}await sleep(350)};
async function waitOriginDown(){for(let i=0;i<80;i++){try{await fetch(origin,{cache:"no-store"});}catch{return}await sleep(100)}throw new Error("origin did not stop")}

try{
  await wait("/json/version");
  const targets=await wait("/json/list");
  const target=targets.find(x=>x.type==="page"); if(!target?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true})});
  ws.addEventListener("message",event=>{const msg=JSON.parse(event.data);if(!msg.id||!pending.has(msg.id))return;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg)});
  await send("Page.enable");await send("Runtime.enable");
  await navigate(origin);

  if(expectation==="disabled"){
    await sleep(900);
    const state=await evaluate(`(async()=>({regs:(await navigator.serviceWorker.getRegistrations()).length,caches:await caches.keys()}))()`);
    assert.equal(state.regs,0,"default candidate build registered a service worker");
    assert.equal(state.caches.includes("modaryx-v2-candidate-shell-v1"),false,"default build unexpectedly created candidate cache");
    console.log("PWA_ASSERT default build registration disabled");
    console.log("PASS_V2_PWA_CANDIDATE_DISABLED_BROWSER");
  } else {
    let info=null;
    for(let i=0;i<100;i++){
      info=await evaluate(`(async()=>{const regs=await navigator.serviceWorker.getRegistrations();const r=regs[0];return {count:regs.length,scope:r?.scope||"",script:r?.active?.scriptURL||r?.installing?.scriptURL||r?.waiting?.scriptURL||"",active:Boolean(r?.active),caches:await caches.keys()}})()`);
      if(info.count===1&&info.active&&info.caches.includes("modaryx-v2-candidate-shell-v1")) break;
      await sleep(100);
    }
    assert.equal(info.count,1,"enabled build did not create exactly one registration");
    assert.equal(new URL(info.scope).pathname,"/","unexpected SW scope");
    assert.equal(new URL(info.script).pathname,"/sw-v2.js","unexpected SW script");
    assert.equal(info.caches.includes("modaryx-v2-candidate-shell-v1"),true,"candidate cache missing");
    console.log("PWA_ASSERT enabled build auto registration active");

    for(let i=0;i<6;i++){
      await navigate(origin);
      if(await evaluate("Boolean(navigator.serviceWorker.controller)")) break;
      await sleep(250);
    }
    assert.equal(await evaluate("Boolean(navigator.serviceWorker.controller)"),true,"SW did not control after reload");
    console.log("PWA_ASSERT controller acquired only after navigation");

    if(!pidFile) throw new Error("preview pid file missing for offline proof");
    const pid=Number(readFileSync(pidFile,"utf8").trim());
    if(!Number.isInteger(pid)||pid<=0) throw new Error("preview pid invalid");
    process.kill(pid,"SIGTERM");
    await waitOriginDown();
    await navigate(origin+"/offline-proof");
    const body=await evaluate("document.body.innerText");
    assert.equal(body.includes("MODARYX"),true,"offline navigation did not restore MODARYX shell");
    console.log("PWA_ASSERT offline navigation works with origin stopped");
    console.log("PASS_V2_PWA_CANDIDATE_ENABLED_BROWSER");
  }
} finally {
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
