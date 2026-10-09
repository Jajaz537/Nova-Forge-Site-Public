// Targeted micro-proof: three Premium V2 CTA routes in a fresh Chrome profile.
// Does not mutate backend data, assets, browser caches on disk or production.
import {spawn} from "node:child_process";
import {mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4182";
if(!chrome)throw new Error("CHROME_BIN is required");
const dir=mkdtempSync(join(tmpdir(),"modaryx-v2-cta-proof-"));
const port=32000+(process.pid%6000);
const child=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--remote-debugging-address=127.0.0.1","--remote-debugging-port="+port,
  "--user-data-dir="+dir,"about:blank"
],{stdio:["ignore","ignore","pipe"]});
let stderr="";
child.stderr?.on("data",buf=>{stderr=(stderr+String(buf)).slice(-2500)});
let ws,id=0;
const pending=new Map(),exceptions=[];
function send(method,params={}){
  const key=++id;
  ws.send(JSON.stringify({id:key,method,params}));
  return new Promise((resolve,reject)=>pending.set(key,{resolve,reject}));
}
async function evaluate(expression){
  const reply=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(reply.result?.exceptionDetails)throw new Error(reply.result.exceptionDetails.text||"CDP eval failed");
  return reply.result?.result?.value;
}
async function discoverPage(){
  for(let i=0;i<200;i++){
    if(child.exitCode!==null)throw new Error("Chrome exited: "+stderr);
    try{
      const r=await fetch("http://127.0.0.1:"+port+"/json/list");
      if(r.ok){const pages=await r.json();const p=pages.find(p=>p.type==="page");if(p?.webSocketDebuggerUrl)return p}
    }catch{}
    await sleep(100);
  }
  throw new Error("Fresh CDP browser failed to initialize: "+stderr);
}
const checks=[
  {name:"Discover to catalogue",path:"/discover",selector:".canon-reconciled-hero .primary",expected:"/mods",target:".catalog"},
  {name:"Library to Game Hub",path:"/library",selector:".library-focus .primary",expected:"/games/aetherlands",target:".game-hub-page"},
  {name:"Hub content details",path:"/",selector:'[aria-label="Consulter les détails de Sentiers de l’aube"]',expected:"/content/sentiers-de-laube",target:"#main-content"}
];
async function runOne(check){
  await send("Page.navigate",{url:origin+check.path});
  let present=false;
  for(let i=0;i<90;i++){
    present=await evaluate("document.readyState==='complete' && !!document.querySelector("+JSON.stringify(check.selector)+")");
    if(present)break;
    await sleep(100);
  }
  const before=await evaluate("({path:location.pathname,title:document.title,outer:document.querySelector("+JSON.stringify(check.selector)+")?.outerHTML.slice(0,260)||null})");
  if(!present||before.path!==check.path)throw new Error("CTA initial screen not ready: "+JSON.stringify({check:check.name,before,exceptions}));
  await evaluate("document.querySelector("+JSON.stringify(check.selector)+").click();true");
  let after;
  for(let i=0;i<80;i++){
    after=await evaluate("({path:location.pathname,title:document.title,target:!!document.querySelector("+JSON.stringify(check.target)+")})");
    if(after.path===check.expected&&after.target)break;
    await sleep(100);
  }
  console.log("CTA_MICRO_PROOF",JSON.stringify({name:check.name,before,after,exceptions:exceptions.slice(-2)}));
  if(after.path!==check.expected||!after.target)
    throw new Error("CTA navigation failed: "+check.name+" "+JSON.stringify({before,after,exceptions}));
}
try{
  const target=await discoverPage();
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    ws.addEventListener("open",resolve,{once:true});
    ws.addEventListener("error",reject,{once:true});
  });
  ws.addEventListener("message",event=>{
    const message=JSON.parse(event.data);
    if(message.method==="Runtime.exceptionThrown"){
      const description=message.params?.exceptionDetails?.exception?.description||message.params?.exceptionDetails?.text;
      exceptions.push(String(description).slice(0,550));
    }
    if(!message.id||!pending.has(message.id))return;
    const p=pending.get(message.id);pending.delete(message.id);
    message.error?p.reject(new Error(message.error.message)):p.resolve(message);
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1024,deviceScaleFactor:1,mobile:false});
  for(const check of checks)await runOne(check);
  console.log("PASS_V2_THREE_PREMIUM_CTA_ROUTES");
}finally{
  try{ws?.close()}catch{}
  child.kill("SIGTERM");
  await sleep(300);
  try{rmSync(dir,{recursive:true,force:true,maxRetries:8,retryDelay:150})}
  catch(error){console.warn("CTA_MICRO_CLEANUP_WARNING",String(error))}
}
