// Compare original and optimized compiled CSS against the same DOM states.
// A targeted browser parity gate, NOT proof of proprietary aesthetic approval.
import {spawn} from "node:child_process";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";
const chrome=process.env.CHROME_BIN;
const originalPath=process.env.MODARYX_CSS_PARITY_BASELINE;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4182";
if(!chrome||!originalPath)throw new Error("CSS parity requires Chrome and an original stylesheet");
const original=readFileSync(originalPath,"utf8");
if(original.length<10000)throw new Error("Original compiled stylesheet unexpectedly small");
const routes=["/","/discover","/games","/mods","/collections","/creators","/community","/account","/content/sentiers-de-laube"];
const viewports=[{name:"desktop",width:1440,height:1024,mobile:false},{name:"mobile",width:390,height:844,mobile:true}];
// This function is serialized and evaluated in the inspected Chrome page.
function captureComputed(){
  const props=[
    "display","position","visibility","opacity","width","height","minWidth","maxWidth",
    "marginTop","marginRight","marginBottom","marginLeft","paddingTop","paddingRight",
    "paddingBottom","paddingLeft","color","backgroundColor","backgroundImage",
    "fontSize","fontFamily","fontWeight","lineHeight","letterSpacing","textAlign",
    "borderTopWidth","borderTopColor","borderRadius","boxShadow","textShadow",
    "transform","filter","overflowX","overflowY","zIndex",
    "gridTemplateColumns","gridTemplateRows","gap","flexDirection","justifyContent","alignItems"
  ];
  return [...document.querySelectorAll("body *")].map((el,index)=>{
    const s=getComputedStyle(el);
    const pseudo=kind=>{const st=getComputedStyle(el,kind);return [st.content,st.display,st.width,st.height,st.opacity,st.backgroundImage]};
    return {i:index,tag:el.tagName,cl:(el.getAttribute("class")||"").slice(0,90),
      values:props.map(p=>s[p]),before:pseudo("::before"),after:pseudo("::after")};
  });
}
const captureExpression="("+captureComputed.toString()+")()";
const port=31000+(process.pid%8000);
const dir=mkdtempSync(join(tmpdir(),"modaryx-css-parity-"));
const child=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--remote-debugging-address=127.0.0.1","--remote-debugging-port="+port,
  "--user-data-dir="+dir,"about:blank"
],{stdio:["ignore","ignore","pipe"]});
let stderr="";
child.stderr?.on("data",c=>{stderr=(stderr+String(c)).slice(-4000)});
let ws,id=1;const pending=new Map(),sheets=new Map();
function send(method,params={}){
  const n=id++;ws.send(JSON.stringify({id:n,method,params}));
  return new Promise((resolve,reject)=>pending.set(n,{resolve,reject}));
}
async function evaluate(expression){
  const response=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(response.result?.exceptionDetails)throw new Error(response.result.exceptionDetails.text||"Chrome evaluation failed");
  return response.result?.result?.value;
}
async function waitForChrome(endpoint){
  for(let i=0;i<240;i++){
    if(child.exitCode!==null)throw new Error("Chrome exited early: "+stderr);
    try{const r=await fetch("http://127.0.0.1:"+port+endpoint);if(r.ok)return await r.json()}catch{}
    await sleep(100);
  }
  throw new Error("Chrome CDP not ready: "+stderr);
}
async function one(route,viewport){
  sheets.clear();
  await send("Emulation.setDeviceMetricsOverride",{
    width:viewport.width,height:viewport.height,deviceScaleFactor:1,mobile:viewport.mobile
  });
  await send("Page.navigate",{url:origin+route});
  let ready=false;
  for(let i=0;i<100;i++){
    ready=await evaluate("document.readyState==='complete'&&!!document.querySelector('#main-content,main')");
    if(ready)break;
    await sleep(100);
  }
  if(!ready)throw new Error("V2 route not rendered: "+route);
  await sleep(350);
  const optimized=await evaluate(captureExpression);
  const sheet=[...sheets].find(([,url])=>/\/assets\/index-[a-zA-Z0-9_-]+\.css(?:\?|$)/.test(url));
  if(!sheet)throw new Error("Entry CSS not registered in Chrome: "+route);
  await send("CSS.setStyleSheetText",{styleSheetId:sheet[0],text:original});
  await evaluate("new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))");
  const baseline=await evaluate(captureExpression);
  if(!Array.isArray(optimized)||!Array.isArray(baseline))throw new Error("CSS parity snapshot unavailable");
  let count=0;const samples=[];
  function difference(info){count++;if(samples.length<8)samples.push(info)}
  if(optimized.length!==baseline.length)difference({reason:"DOM element count changed",optimized:optimized.length,baseline:baseline.length});
  for(let i=0;i<Math.min(optimized.length,baseline.length);i++){
    const a=optimized[i],b=baseline[i];
    if(a.tag!==b.tag||a.cl!==b.cl){
      difference({i,reason:"Element changed",optimized:a.tag+"."+a.cl,baseline:b.tag+"."+b.cl});continue;
    }
    for(let j=0;j<a.values.length;j++)if(a.values[j]!==b.values[j])
      difference({i,cl:a.cl,property:j,optimized:a.values[j],baseline:b.values[j]});
    for(const pseudo of ["before","after"])for(let j=0;j<a[pseudo].length;j++)
      if(a[pseudo][j]!==b[pseudo][j])
        difference({i,cl:a.cl,pseudo,property:j,optimized:a[pseudo][j],baseline:b[pseudo][j]});
  }
  console.log("CSS_COMPUTED_PARITY",JSON.stringify({
    path:route,viewport:viewport.name,elements:optimized.length,differences:count,samples
  }));
  if(count)throw new Error("Computed CSS parity failed for "+route+" "+viewport.name+": "+count+" differences");
}
try{
  await waitForChrome("/json/version");
  const targets=await waitForChrome("/json/list");
  const page=targets.find(t=>t.type==="page");
  if(!page?.webSocketDebuggerUrl)throw new Error("Chrome page missing");
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.addEventListener("open",res,{once:true});ws.addEventListener("error",rej,{once:true})});
  ws.addEventListener("message",e=>{
    const m=JSON.parse(e.data);
    if(m.method==="CSS.styleSheetAdded"&&m.params?.header)
      sheets.set(m.params.header.styleSheetId,m.params.header.sourceURL||"");
    if(!m.id||!pending.has(m.id))return;
    const p=pending.get(m.id);pending.delete(m.id);
    m.error?p.reject(new Error(m.error.message)):p.resolve(m);
  });
  await send("Page.enable");await send("Runtime.enable");await send("DOM.enable");await send("CSS.enable");
  await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  for(const viewport of viewports)for(const route of routes)await one(route,viewport);
  console.log("PASS_V2_CSS_COMPUTED_PARITY_18_ROUTE_VIEWPORTS");
}finally{
  try{ws?.close()}catch{}
  child.kill("SIGTERM");
  await sleep(300);
  try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:150})}
  catch(err){console.warn("CSS_PARITY_CLEANUP_WARNING",String(err))}
}
