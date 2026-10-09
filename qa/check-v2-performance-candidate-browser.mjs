import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";
import fs from "node:fs";
import zlib from "node:zlib";
import assert from "node:assert/strict";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4182";
if(!chrome) throw new Error("CHROME_BIN missing");
const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-performance-candidate-contract.json","utf8"));
const gzipSize=path=>zlib.gzipSync(fs.readFileSync(path),{level:9}).length;
const html=fs.readFileSync("v2/dist/client/index.html","utf8");
const jsSrc=html.match(/<script[^>]+src="([^"]+\.js)"/)?.[1];
const cssHref=html.match(/<link[^>]+href="([^"]+\.css)"/)?.[1];
if(!jsSrc||!cssHref) throw new Error("entry JS/CSS asset missing from built index.html");
const normalizeAsset=value=>"v2/dist/client/"+value.replace(/^\//,"");
const jsPath=normalizeAsset(jsSrc);
const cssPath=normalizeAsset(cssHref);
if(!fs.existsSync(jsPath)||!fs.existsSync(cssPath)) throw new Error("built entry JS/CSS asset missing");
const jsGzip=gzipSize(jsPath);
const cssGzip=gzipSize(cssPath);
assert.ok(jsGzip<=contract.bundleCeilings.jsGzipBytes,`JS gzip ${jsGzip} > ${contract.bundleCeilings.jsGzipBytes}`);
// Preserve the CSS budget as a mandatory gate, but collect desktop/mobile lab metrics first.
const cssBudgetError=cssGzip>contract.bundleCeilings.cssGzipBytes ? `CSS gzip ${cssGzip} > ${contract.bundleCeilings.cssGzipBytes}` : null;
console.log("PERF_BUNDLE_JS_GZIP",jsGzip);
console.log("PERF_BUNDLE_CSS_GZIP",cssGzip);

async function runScenario(name,s){
  const port=23000+(process.pid%1000)+(name==="mobile"?1000:0);
  const userDataDir=fs.mkdtempSync("/tmp/modaryx-perf-"+name+"-");
  const proc=spawn(chrome,[
    "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
    "--remote-debugging-address=127.0.0.1","--remote-debugging-port="+port,
    "--user-data-dir="+userDataDir,"about:blank"
  ],{stdio:["ignore","ignore","pipe"]});
  let chromeStderr="";
  proc.stderr?.on("data",chunk=>{chromeStderr=(chromeStderr+String(chunk)).slice(-6000);});
  let ws,nextId=1;const pending=new Map();
  const wait=async path=>{
    let last;
    for(let i=0;i<240;i++){
      if(proc.exitCode!==null) throw new Error("Chrome exited before CDP: "+proc.exitCode+"\n"+chromeStderr);
      try{
        const r=await fetch("http://127.0.0.1:"+port+path);
        if(r.ok) return await r.json();
        last=new Error("HTTP "+r.status);
      }catch(e){last=e}
      await sleep(100);
    }
    throw new Error("CDP unavailable on "+port+": "+String(last||"unknown")+"\n"+chromeStderr);
  };
  const send=(method,params={})=>{const id=nextId++;ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))};
  const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval failed");return r.result?.result?.value};
  try{
    await wait("/json/version");
    const targets=await wait("/json/list");
    const target=targets.find(x=>x.type==="page");
    if(!target?.webSocketDebuggerUrl) throw new Error("page target missing");
    ws=new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true})});
    ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m)});
    await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
    await send("Page.bringToFront");
    await send("Emulation.setFocusEmulationEnabled",{enabled:true});
    await send("Emulation.setDeviceMetricsOverride",{width:s.width,height:s.height,deviceScaleFactor:1,mobile:name==="mobile"});
    await send("Emulation.setCPUThrottlingRate",{rate:s.cpuRate});
    await send("Network.setCacheDisabled",{cacheDisabled:true});
    const down=s.downloadMbps*1024*1024/8;
    await send("Network.emulateNetworkConditions",{offline:false,latency:s.latencyMs,downloadThroughput:down,uploadThroughput:down/2,connectionType:name==="mobile"?"cellular4g":"wifi"});
    await send("Page.addScriptToEvaluateOnNewDocument",{source:`
      window.__modPerf={lcp:0,cls:0,longTask:0};
      new PerformanceObserver(list=>{for(const e of list.getEntries()) window.__modPerf.lcp=Math.max(window.__modPerf.lcp,e.startTime)}).observe({type:"largest-contentful-paint",buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries()) if(!e.hadRecentInput) window.__modPerf.cls+=e.value}).observe({type:"layout-shift",buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries()) window.__modPerf.longTask+=e.duration}).observe({type:"longtask",buffered:true});
    `});
    await send("Network.clearBrowserCache");
    await send("Page.navigate",{url:origin});
    for(let i=0;i<150;i++){if(await evaluate("document.readyState==='complete'"))break;await sleep(100)}
    await sleep(1800);
    const metrics=await evaluate(`(()=>{const nav=performance.getEntriesByType("navigation")[0];return {...window.__modPerf,fcp:performance.getEntriesByName("first-contentful-paint")[0]?.startTime||0,domContentLoaded:nav?.domContentLoadedEventEnd||0,load:nav?.loadEventEnd||0,resources:performance.getEntriesByType("resource").reduce((n,e)=>n+(e.transferSize||0),0)}})()`);
    assert.ok(metrics.lcp>0,`${name} LCP was not observed`);
    assert.ok(metrics.lcp<=s.lcpCeilingMs,`${name} LCP ${metrics.lcp} > ${s.lcpCeilingMs}`);
    assert.ok(metrics.cls<=s.clsCeiling,`${name} CLS ${metrics.cls} > ${s.clsCeiling}`);
    const routeMs=await evaluate(`(()=>new Promise(resolve=>{
      const target=[...document.querySelectorAll(".global-nav button")].find(x=>x.textContent.trim()==="Découvrir");
      if(!target) return resolve(-1);
      const start=performance.now(); target.click();
      const poll=()=>{const h=document.querySelector("#main-content h1");if(h&&h.textContent.includes("Redécouvrez")) requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(performance.now()-start))); else requestAnimationFrame(poll)};
      poll();
    }))()`);
    assert.ok(routeMs>=0&&routeMs<=s.routeResponseCeilingMs,`${name} route response ${routeMs} > ${s.routeResponseCeilingMs}`);
    // Account for ALL local CSS actually loaded during the page and navigation,
    // not only the single HTML entry CSS. Prevent false greens from CSS splitting.
    const observedCssUrls=await evaluate(`(()=>[...new Set([
      ...performance.getEntriesByType("resource").map(resource=>resource.name),
      ...[...document.styleSheets].map(sheet=>sheet.href).filter(Boolean)
    ].filter(url=>/\\.css(?:[?#]|$)/.test(url)))])()`);
    const localCss=new Set();
    for(const stylesheet of observedCssUrls){
      const parsed=new URL(stylesheet,origin);
      if(parsed.origin!==new URL(origin).origin)throw new Error("Unaccounted external CSS: "+parsed.origin);
      if(!/^\\/assets\\/[a-zA-Z0-9._-]+\\.css$/.test(parsed.pathname)){
        throw new Error("Unaccounted local CSS: "+parsed.pathname);
      }
      localCss.add("v2/dist/client"+parsed.pathname);
    }
    if(!localCss.size) throw new Error("No CSS asset observed during "+name+" scenario");
    for(const file of localCss)if(!fs.existsSync(file))throw new Error("CSS asset not found for route proof: "+file);
    const loadedCssGzip=[...localCss].reduce((total,file)=>total+gzipSize(file),0);
    console.log("PERF_ROUTE_CSS_GZIP",name,loadedCssGzip,JSON.stringify([...localCss]));
    console.log("PERF_SCENARIO",name,JSON.stringify({...metrics,routeResponseMs:routeMs,loadedCssGzip}));
    return {...metrics,routeResponseMs:routeMs,loadedCssGzip};
  } finally {try{ws?.close()}catch{} proc.kill("SIGTERM"); try{fs.rmSync(userDataDir,{recursive:true,force:true})}catch{}}
}

const results={desktop:await runScenario("desktop",contract.scenarios.desktop),mobile:await runScenario("mobile",contract.scenarios.mobile)};
console.log("PERF_RESULT",JSON.stringify({jsGzip,cssGzip,results}));
const routeCssErrors=Object.entries(results).flatMap(([viewport,measure])=>
  measure.loadedCssGzip>contract.bundleCeilings.cssGzipBytes ?
    [viewport+" loaded CSS gzip "+measure.loadedCssGzip+" > "+contract.bundleCeilings.cssGzipBytes] : []
);
const errors=[...(cssBudgetError?[cssBudgetError]:[]),...routeCssErrors];
if(errors.length) throw new Error(errors.join("; "));
console.log("PASS_V2_PERFORMANCE_CANDIDATE_LAB");
