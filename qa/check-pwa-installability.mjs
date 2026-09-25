import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN=process.env.MODARYX_TEST_ORIGIN||'http://127.0.0.1:4177';
const CHROME_BIN=process.env.CHROME_BIN||'google-chrome';
const USER_DATA_DIR='/tmp/modaryx-installability-'+process.pid;
const failures=[];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function waitPort(timeoutMs=20000){
  const f=path.join(USER_DATA_DIR,'DevToolsActivePort');
  const deadline=Date.now()+timeoutMs;
  while(Date.now()<deadline){
    if(fs.existsSync(f)){
      const p=fs.readFileSync(f,'utf8').trim().split(/\r?\n/)[0];
      if(/^\d+$/.test(p)) return Number(p);
    }
    const announced=stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
    if(announced) return Number(announced[1]);
    await sleep(120);
  }
  throw new Error('DevToolsActivePort not created');
}
async function waitJson(url,timeoutMs=10000){
  const deadline=Date.now()+timeoutMs; let last;
  while(Date.now()<deadline){
    try{const r=await fetch(url,{cache:'no-store'});if(r.ok)return r.json();}catch(e){last=e;}
    await sleep(120);
  }
  throw last||new Error('timeout '+url);
}
class Cdp{
  constructor(url){this.ws=new WebSocket(url);this.nextId=1;this.pending=new Map();this.listeners=new Map();
    this.opened=new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',(e)=>{const m=JSON.parse(String(e.data));if(m.id){const w=this.pending.get(m.id);if(!w)return;this.pending.delete(m.id);m.error?w.reject(new Error(m.error.message||JSON.stringify(m.error))):w.resolve(m.result);return;}if(m.method){for(const fn of [...(this.listeners.get(m.method)||[])])fn(m.params);}});
  }
  async send(method,params={}){await this.opened;const id=this.nextId++;const p=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));this.ws.send(JSON.stringify({id,method,params}));return p;}
  once(method,timeoutMs=12000){return new Promise((resolve,reject)=>{const t=setTimeout(()=>{cleanup();reject(new Error('timeout '+method));},timeoutMs);const fn=(p)=>{cleanup();resolve(p);};const cleanup=()=>{clearTimeout(t);const s=this.listeners.get(method);s?.delete(fn);if(s&&!s.size)this.listeners.delete(method);};if(!this.listeners.has(method))this.listeners.set(method,new Set());this.listeners.get(method).add(fn);});}
  close(){this.ws.close();}
}
async function evaluate(cdp,expression,awaitPromise=false){const r=await cdp.send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'eval failed');return r.result?.value;}
async function navigate(cdp,url){const loaded=cdp.once('Page.loadEventFired');const nav=await cdp.send('Page.navigate',{url});if(nav.errorText)throw new Error(nav.errorText);await loaded;await sleep(300);}
async function waitFor(cdp,expression,label,timeoutMs=12000){const deadline=Date.now()+timeoutMs;while(Date.now()<deadline){const v=await evaluate(cdp,expression,true);if(v)return v;await sleep(120);}throw new Error('timeout '+label);}
function assert(name,condition){if(!condition)failures.push(name);}

const chrome=spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+USER_DATA_DIR,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let stderr='';chrome.stderr.on('data',c=>stderr=(stderr+String(c)).slice(-10000));

try{
  const port=await waitPort();await waitJson('http://127.0.0.1:'+port+'/json/version');
  const tr=await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'});if(!tr.ok)throw new Error('target '+tr.status);
  const tab=await tr.json();const cdp=new Cdp(tab.webSocketDebuggerUrl);await cdp.opened;
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');

  await navigate(cdp,ORIGIN+'/index.html');

  const ready=await waitFor(cdp,`(async()=>{if(!('serviceWorker' in navigator))return null;const r=await navigator.serviceWorker.ready;return r?.active?{state:r.active.state,scope:r.scope,controller:Boolean(navigator.serviceWorker.controller)}:null;})()`,'service worker ready');
  if(!ready.controller){
    await navigate(cdp,ORIGIN+'/index.html');
    await waitFor(cdp,`(()=>Boolean(navigator.serviceWorker.controller))()`,'service worker controller');
  }

  const manifest=await cdp.send('Page.getAppManifest');
  const installability=await cdp.send('Page.getInstallabilityErrors');
  const manifestData=JSON.parse(manifest.data||'{}');

  const browserManifest=await evaluate(cdp,`(async()=>{const link=document.querySelector('link[rel="manifest"]');const url=new URL(link.href,document.baseURI);const r=await fetch(url,{cache:'no-store'});const data=await r.json();const iconChecks=await Promise.all((data.icons||[]).map(async icon=>{const u=new URL(icon.src,url);const x=await fetch(u,{cache:'no-store'});return {src:icon.src,status:x.status,ok:x.ok,type:x.headers.get('content-type')||''};}));return {href:link.href,status:r.status,data,iconChecks};})()`,true);

  assert('manifest URL missing',Boolean(manifest.url));
  assert('manifest parse errors present',!(manifest.errors||[]).length);
  assert('installability errors present',!(installability.installabilityErrors||[]).length);
  assert('manifest id drifted',manifestData.id==='./');
  assert('manifest display not standalone',manifestData.display==='standalone');
  assert('manifest start_url drifted',manifestData.start_url==='./');
  assert('manifest scope drifted',manifestData.scope==='./');
  assert('manifest name drifted',manifestData.short_name==='MODARYX MODS');
  assert('192 icon missing',browserManifest.data.icons?.some(i=>i.sizes==='192x192'));
  assert('512 icon missing',browserManifest.data.icons?.some(i=>i.sizes==='512x512'));
  assert('manifest icon fetch failed',browserManifest.iconChecks.every(i=>i.ok));
  assert('service worker not controlling',Boolean(await evaluate(cdp,'Boolean(navigator.serviceWorker.controller)')));

  cdp.close();
  console.log(JSON.stringify({
    marker:failures.length?'FAIL_TARGETED_PWA_INSTALLABILITY_PROOF':'PASS_TARGETED_PWA_INSTALLABILITY_PROOF',
    serviceWorker:ready,
    manifestUrl:manifest.url,
    manifestErrors:manifest.errors||[],
    installabilityErrors:installability.installabilityErrors||[],
    manifest:{id:manifestData.id,name:manifestData.name,short_name:manifestData.short_name,start_url:manifestData.start_url,scope:manifestData.scope,display:manifestData.display},
    iconChecks:browserManifest.iconChecks,
    failures
  },null,2));
  if(failures.length)process.exitCode=1;
}catch(error){
  console.error(JSON.stringify({marker:'FAIL_TARGETED_PWA_INSTALLABILITY_PROOF',fatal:error.message,chromeStderr:stderr,failures},null,2));process.exitCode=1;
}finally{
  chrome.kill('SIGTERM');
  for(let attempt=0;attempt<20&&chrome.exitCode===null;attempt++) await sleep(100);
  if(chrome.exitCode===null) chrome.kill('SIGKILL');
}
