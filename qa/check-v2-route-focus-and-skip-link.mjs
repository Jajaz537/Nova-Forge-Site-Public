import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9242;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-route-focus","about:blank"
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
async function pressTab(){
  const common={key:"Tab",code:"Tab",windowsVirtualKeyCode:9,nativeVirtualKeyCode:9};
  await send("Input.dispatchKeyEvent",{type:"keyDown",...common});
  await send("Input.dispatchKeyEvent",{type:"keyUp",...common});
}
async function clickExact(selector,text){
  const ok=await evaluate(`(() => {
    const el=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.textContent.trim()===${JSON.stringify(text)});
    if(!el||el.disabled||el.getBoundingClientRect().width===0) return false;
    el.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(220);
}
async function assertMainFocused(label){
  const state=await evaluate(`(() => {
    const el=document.activeElement;
    return {id:el?.id||"",tag:el?.tagName||"",text:el?.textContent?.trim().slice(0,80)||""};
  })()`);
  if(state.id!=="main-content") throw new Error(label+" route focus missing: "+JSON.stringify(state));
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

  const skipExists=await evaluate(`(() => {
    const a=document.querySelector('.skip-link');
    return !!a && a.getAttribute('href')==='#main-content' && a.textContent.trim()==='Aller au contenu principal';
  })()`);
  if(!skipExists) throw new Error("skip link missing or malformed");

  await evaluate("document.body.setAttribute('tabindex','-1');document.body.focus()");
  await pressTab();
  const skipFocus=await evaluate(`(() => {
    const a=document.activeElement;
    if(!a?.classList?.contains('skip-link')) return null;
    const r=a.getBoundingClientRect();
    return {height:r.height,top:r.top,left:r.left};
  })()`);
  if(!skipFocus||skipFocus.height<44||skipFocus.top<0) throw new Error("skip link not visible/44px on focus: "+JSON.stringify(skipFocus));

  await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"no-preference"}]});
  await evaluate(`window.__qaScroll=[];window.scrollTo=(arg)=>{window.__qaScroll.push(arg)}`);
  await clickExact(".global-nav button","Mods & contenus");
  await assertMainFocused("catalog");
  const smooth=await evaluate(`window.__qaScroll.at(-1)?.behavior||null`);
  if(smooth!=="smooth") throw new Error("normal motion navigation should use smooth scroll, got "+smooth);

  await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  await evaluate(`window.__qaScroll=[]`);
  await clickExact(".global-nav button","Collections");
  await assertMainFocused("collections");
  const reduced=await evaluate(`window.__qaScroll.at(-1)?.behavior||null`);
  if(reduced!=="auto") throw new Error("reduced motion navigation should use auto scroll, got "+reduced);

  const mainCount=await evaluate(`document.querySelectorAll('#main-content').length`);
  if(mainCount!==1) throw new Error("expected exactly one mounted main-content target, got "+mainCount);

  console.log("SKIP_LINK_VISIBLE_TARGET_OK");
  console.log("ROUTE_FOCUS_MAIN_OK");
  console.log("ROUTE_SCROLL_NORMAL",smooth);
  console.log("ROUTE_SCROLL_REDUCED",reduced);
  console.log("PASS_V2_ROUTE_FOCUS_AND_SKIP_LINK");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
