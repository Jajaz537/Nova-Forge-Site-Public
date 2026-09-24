import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN=process.env.MODARYX_TEST_ORIGIN||'http://127.0.0.1:4176';
const CHROME_BIN=process.env.CHROME_BIN||'google-chrome';
const USER_DATA_DIR='/tmp/modaryx-lab-perf-'+process.pid;
const pages=['index.html','catalog.html','creator-studio.html','community.html','games/index.html'];
const profiles=[
  {name:'mobile',width:390,height:844,mobile:true,cpuRate:4},
  {name:'desktop',width:1440,height:1000,mobile:false,cpuRate:2}
];
const budgets={lcpMs:2500,cls:0.10,longTasks:5,loadMs:5000};
const failures=[]; const results=[];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

fs.mkdirSync(USER_DATA_DIR,{recursive:true});

async function waitForPort(timeoutMs=12000){
  const f=path.join(USER_DATA_DIR,'DevToolsActivePort'); const deadline=Date.now()+timeoutMs;
  while(Date.now()<deadline){
    if(fs.existsSync(f)){const p=fs.readFileSync(f,'utf8').trim().split(/\r?\n/)[0]; if(/^\d+$/.test(p)) return Number(p);}
    const announced=stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//); if(announced) return Number(announced[1]);
    await sleep(120);
  }
  throw new Error('DevToolsActivePort not created');
}
async function waitJson(url,timeoutMs=10000){
  const deadline=Date.now()+timeoutMs; let last;
  while(Date.now()<deadline){try{const r=await fetch(url,{cache:'no-store'}); if(r.ok)return r.json();}catch(e){last=e;} await sleep(120);}
  throw last||new Error('timeout '+url);
}
class Cdp{
  constructor(url){this.ws=new WebSocket(url);this.nextId=1;this.pending=new Map();this.listeners=new Map();
    this.opened=new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',(e)=>{const m=JSON.parse(String(e.data)); if(m.id){const w=this.pending.get(m.id); if(!w)return; this.pending.delete(m.id); m.error?w.reject(new Error(m.error.message||JSON.stringify(m.error))):w.resolve(m.result); return;}
      if(m.method){for(const fn of [...(this.listeners.get(m.method)||[])])fn(m.params);}});
  }
  async send(method,params={}){await this.opened;const id=this.nextId++;const p=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));this.ws.send(JSON.stringify({id,method,params}));return p;}
  once(method,timeoutMs=15000){return new Promise((resolve,reject)=>{const t=setTimeout(()=>{cleanup();reject(new Error('timeout '+method));},timeoutMs);const fn=(p)=>{cleanup();resolve(p);};const cleanup=()=>{clearTimeout(t);const s=this.listeners.get(method);s?.delete(fn);if(s&&!s.size)this.listeners.delete(method);};if(!this.listeners.has(method))this.listeners.set(method,new Set());this.listeners.get(method).add(fn);});}
  close(){this.ws.close();}
}
async function evalv(cdp,expression,awaitPromise=false){const r=await cdp.send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}
async function navigate(cdp,url){const loaded=cdp.once('Page.loadEventFired');const nav=await cdp.send('Page.navigate',{url});if(nav.errorText)throw new Error(nav.errorText);await loaded;await sleep(1800);}

const chrome=spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+USER_DATA_DIR,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let stderr=''; chrome.stderr.on('data',c=>stderr=(stderr+String(c)).slice(-10000));

try{
  const port=await waitForPort(); await waitJson('http://127.0.0.1:'+port+'/json/version');
  const tr=await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'}); if(!tr.ok)throw new Error('target '+tr.status);
  const tab=await tr.json(); const cdp=new Cdp(tab.webSocketDebuggerUrl); await cdp.opened;
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:`
    window.__mxPerf={lcp:0,lcpElement:'',cls:0,shiftSources:[],longTasks:0};
    new PerformanceObserver(list=>{for(const e of list.getEntries()){if((e.startTime||0)>=window.__mxPerf.lcp){window.__mxPerf.lcp=e.startTime||0;const n=e.element;window.__mxPerf.lcpElement=n?(n.tagName+(n.id?'#'+n.id:'')+(n.className&&typeof n.className==='string'?'.'+n.className.trim().replace(/\\s+/g,'.'):'')):'';}}}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries()) if(!e.hadRecentInput){window.__mxPerf.cls+=e.value||0;for(const s of e.sources||[]){const n=s.node;if(n){const label=n.tagName+(n.id?'#'+n.id:'')+(n.className&&typeof n.className==='string'?'.'+n.className.trim().replace(/\\s+/g,'.'):'');if(label&&!window.__mxPerf.shiftSources.includes(label))window.__mxPerf.shiftSources.push(label);}}}}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list=>{window.__mxPerf.longTasks+=list.getEntries().length;}).observe({type:'longtask',buffered:true});
  `});

  for(const profile of profiles){
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:profile.width,height:profile.height,deviceScaleFactor:1,mobile:profile.mobile,screenWidth:profile.width,screenHeight:profile.height});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpuRate});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'});

    for(const page of pages){
      await cdp.send('Network.clearBrowserCache');
      await navigate(cdp,ORIGIN.replace(/\/$/,'')+'/'+page);
      const m=await evalv(cdp,`(() => {
        const nav=performance.getEntriesByType('navigation')[0];
        const r=performance.getEntriesByType('resource');
        return {
          lcp:window.__mxPerf?.lcp||0,
          lcpElement:window.__mxPerf?.lcpElement||'',
          cls:window.__mxPerf?.cls||0,
          shiftSources:window.__mxPerf?.shiftSources||[],
          longTasks:window.__mxPerf?.longTasks||0,
          fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0,
          domContentLoaded:nav?.domContentLoadedEventEnd||0,
          load:nav?.loadEventEnd||0,
          requests:r.length+1,
          transferBytes:r.reduce((s,e)=>s+(e.transferSize||0),nav?.transferSize||0)
        };
      })()`);

      const row={page,profile:profile.name,...m}; results.push(row);
      if(m.lcp>budgets.lcpMs) failures.push(page+' '+profile.name+': LCP '+m.lcp.toFixed(1)+'ms > '+budgets.lcpMs);
      if(m.cls>budgets.cls) failures.push(page+' '+profile.name+': CLS '+m.cls.toFixed(4)+' > '+budgets.cls);
      if(m.longTasks>budgets.longTasks) failures.push(page+' '+profile.name+': long tasks '+m.longTasks+' > '+budgets.longTasks);
      if(m.load>budgets.loadMs) failures.push(page+' '+profile.name+': load '+m.load.toFixed(1)+'ms > '+budgets.loadMs);
    }
  }
  cdp.close();
  console.log(JSON.stringify({marker:failures.length?'FAIL_TARGETED_LAB_PERFORMANCE_PROOF':'PASS_TARGETED_LAB_PERFORMANCE_PROOF',profiles,pages,budgets,results,failures},null,2));
  if(failures.length)process.exitCode=1;
}catch(error){
  console.error(JSON.stringify({marker:'FAIL_TARGETED_LAB_PERFORMANCE_PROOF',fatal:error.message,chromeStderr:stderr,failures},null,2));process.exitCode=1;
}finally{
  chrome.kill('SIGTERM');await sleep(150);if(!chrome.killed)chrome.kill('SIGKILL');
}
