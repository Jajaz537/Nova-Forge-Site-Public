// MODARYX V2 — read-only Chrome CSS rule-usage inventory.
// Usage: CHROME_BIN=/usr/bin/google-chrome MODARYX_REVIEW_ORIGIN=http://127.0.0.1:4182 node qa/report-v2-css-route-usage.mjs
// Matched rules are diagnostic; unobserved rules MUST NOT be deleted automatically.
// Visits representative states, not all interactions or media/accessibility states.
import {spawn} from "node:child_process";
import {mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
if(!chrome) throw new Error("CHROME_BIN missing");
const origin=process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4182";
const routes=[
  "/","/discover","/games","/mods","/collections",
  "/creators","/community","/account","/content/sentiers-de-laube"
];
const viewports=[
  {label:"desktop",width:1440,height:1024,mobile:false},
  {label:"mobile",width:390,height:844,mobile:true}
];
const port=28000+(process.pid%10000);
const userDataDir=mkdtempSync(join(tmpdir(),"modaryx-css-route-"));
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--remote-debugging-address=127.0.0.1","--remote-debugging-port="+port,
  "--user-data-dir="+userDataDir,"about:blank"
],{stdio:["ignore","ignore","pipe"]});
let stderr="";
proc.stderr?.on("data",buf=>{stderr=(stderr+String(buf)).slice(-4000)});
let ws,nextId=1;
const pending=new Map();
const sheets=new Map();
const send=(method,params={})=>{
  const id=nextId++;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
};
async function waitJson(path){
  let last;
  for(let attempt=0;attempt<200;attempt++){
    if(proc.exitCode!==null) throw new Error("Chrome exited: "+proc.exitCode+" "+stderr);
    try{
      const res=await fetch("http://127.0.0.1:"+port+path);
      if(res.ok) return await res.json();
      last=new Error("HTTP "+res.status);
    }catch(err){last=err}
    await sleep(100);
  }
  throw new Error("Chrome CDP unavailable: "+String(last)+" "+stderr);
}
async function evaluate(expression){
  const result=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw new Error(result.exceptionDetails.text||"Chrome evaluation failed");
  return result.result?.result?.value;
}
function unionLength(intervals){
  let n=0,end=0;
  for(const [a,b] of intervals.sort((x,y)=>x[0]-y[0])){
    if(b<=end)continue;
    n+=b-Math.max(a,end);
    end=b;
  }
  return n;
}
async function runRoute(path,viewport){
  sheets.clear();
  await send("Emulation.setDeviceMetricsOverride",{
    width:viewport.width,height:viewport.height,
    deviceScaleFactor:1,mobile:viewport.mobile
  });
  await send("CSS.startRuleUsageTracking");
  try{
    await send("Page.navigate",{url:origin+path});
    let loaded=false;
    for(let i=0;i<100;i++){
      loaded=await evaluate("document.readyState==='complete' && !!document.querySelector('main, #main-content')");
      if(loaded)break;
      await sleep(100);
    }
    if(!loaded)throw new Error("Route never rendered: "+path);
    // Allow React route content, style matching, and short-lived loading states to settle.
    await sleep(450);
    await evaluate("window.scrollTo(0,document.body.scrollHeight); true");
    await sleep(90);
    await evaluate("window.scrollTo(0,0); true");
    const result=await send("CSS.stopRuleUsageTracking");
    const usage=result.result?.ruleUsage||[];
    const byId=new Map();
    for(const row of usage){
      const group=byId.get(row.styleSheetId)||[];
      group.push(row);
      byId.set(row.styleSheetId,group);
    }
    let usedRules=0,totalRules=0,usedChars=0,knownChars=0,assetStyles=0;
    for(const [id,items] of byId){
      const sheet=sheets.get(id);
      if(!sheet || !sheet.sourceURL || !sheet.sourceURL.includes("/assets/") || !sheet.sourceURL.includes(".css"))continue;
      const response=await send("CSS.getStyleSheetText",{styleSheetId:id});
      const text=response.result?.text||"";
      assetStyles++;
      knownChars+=text.length;
      totalRules+=items.length;
      const matched=items.filter(x=>x.used);
      usedRules+=matched.length;
      usedChars+=unionLength(matched.map(x=>[x.startOffset,x.endOffset]));
    }
    if(assetStyles===0 || totalRules===0)throw new Error("No built CSS rule coverage for "+path+" / "+viewport.label);
    const loadedCss=await evaluate(`performance.getEntriesByType("resource").filter(r=>r.name.includes(".css")).map(r=>({name:r.name.split("/").pop(),transferSize:r.transferSize,encodedBodySize:r.encodedBodySize}))`);
    const entry={
      path,viewport:viewport.label,loadedCss,assetStyles,
      trackedRules:totalRules,usedRules,usedRuleChars:usedChars,
      loadedStylesheetChars:knownChars,
      note:"Rule-usage snapshot only; no deletion or route-splitting proof"
    };
    console.log("CSS_ROUTE_USAGE",JSON.stringify(entry));
    return entry;
  }catch(err){
    try{await send("CSS.stopRuleUsageTracking")}catch{}
    throw err;
  }
}
try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const target=targets.find(x=>x.type==="page");
  if(!target?.webSocketDebuggerUrl)throw new Error("CDP page missing");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    ws.addEventListener("open",resolve,{once:true});
    ws.addEventListener("error",reject,{once:true});
  });
  ws.addEventListener("message",event=>{
    const msg=JSON.parse(event.data);
    if(msg.method==="CSS.styleSheetAdded" && msg.params?.header){
      const h=msg.params.header;
      sheets.set(h.styleSheetId,h);
    }
    if(!msg.id||!pending.has(msg.id))return;
    const item=pending.get(msg.id);
    pending.delete(msg.id);
    msg.error?item.reject(new Error(msg.error.message)):item.resolve(msg);
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("DOM.enable");
  await send("CSS.enable");
  const rows=[];
  for(const viewport of viewports)for(const path of routes){
    rows.push(await runRoute(path,viewport));
  }
  console.log("CSS_ROUTE_USAGE_SUMMARY",JSON.stringify({
    routeCount:routes.length,viewports:viewports.map(x=>x.label),
    rows:rows.length,
    disclaimer:"Coverage observes visited DOM states only; it cannot justify dropping unseen rules"
  }));
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
  // Chrome may still be flushing its profile when SIGTERM returns.
  await sleep(300);
  try{
    rmSync(userDataDir,{recursive:true,force:true,maxRetries:10,retryDelay:150});
  }catch(error){
    // Never replace genuine route-usage evidence with a temp-profile cleanup error.
    console.warn("CSS_ROUTE_USAGE_CLEANUP_WARNING",String(error));
  }
}
