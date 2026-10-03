import {spawn} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = process.env.MODARYX_REVIEW_ORIGIN || 'http://127.0.0.1:4182';
const PAGE = 'review-evidence/modaryx-v2-lowfi-20261003/core-wireframes.html';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT || (28000 + (process.pid % 10000)));
const widths = [320, 390, 768, 1440];
const expectedCaptions = ['Desktop Game Hub','Desktop Global Search','Desktop Community','Mobile Game Hub · 390 px'];
const failures = [];
const results = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function waitForJson(url, timeoutMs=10000){
  const end=Date.now()+timeoutMs;
  let last;
  while(Date.now()<end){
    try{const r=await fetch(url,{cache:'no-store'});if(r.ok)return r.json();}catch(e){last=e}
    await sleep(120);
  }
  throw last || new Error('timeout '+url);
}

class Cdp {
  constructor(url){
    this.ws=new WebSocket(url); this.id=1; this.pending=new Map(); this.listeners=new Map();
    this.opened=new Promise((res,rej)=>{this.ws.addEventListener('open',res,{once:true});this.ws.addEventListener('error',rej,{once:true});});
    this.ws.addEventListener('message',e=>{
      const m=JSON.parse(String(e.data));
      if(m.id){const p=this.pending.get(m.id); if(!p)return; this.pending.delete(m.id); return m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}
      if(m.method) for(const fn of [...(this.listeners.get(m.method)||[])]) fn(m.params);
    });
  }
  async send(method,params={}){await this.opened;const id=this.id++;const p=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));this.ws.send(JSON.stringify({id,method,params}));return p;}
  once(method,timeout=12000){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('timeout '+method));},timeout);const fn=p=>{cleanup();resolve(p)};const cleanup=()=>{clearTimeout(timer);const s=this.listeners.get(method);s?.delete(fn);if(s&&!s.size)this.listeners.delete(method)};if(!this.listeners.has(method))this.listeners.set(method,new Set());this.listeners.get(method).add(fn);});}
  on(method,fn){if(!this.listeners.has(method))this.listeners.set(method,new Set());this.listeners.get(method).add(fn);return()=>this.listeners.get(method)?.delete(fn);}
  close(){this.ws.close();}
}

async function evalJs(cdp, expression){
  const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true});
  if(r.exceptionDetails) throw new Error(r.exceptionDetails.text||'Runtime.evaluate failed');
  return r.result?.value;
}

const chrome=spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking',
  '--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port='+DEBUG_PORT,
  '--user-data-dir='+path.join(os.tmpdir(),'modaryx-v2-lowfi-'+process.pid),'about:blank'
],{stdio:['ignore','ignore','pipe']});

let chromeStderr='';
chrome.stderr.on('data',c=>chromeStderr=(chromeStderr+String(c)).slice(-12000));

try{
  await waitForJson('http://127.0.0.1:'+DEBUG_PORT+'/json/version');
  const tabResponse=await fetch('http://127.0.0.1:'+DEBUG_PORT+'/json/new?about%3Ablank',{method:'PUT'});
  if(!tabResponse.ok) throw new Error('cannot create target HTTP '+tabResponse.status);
  const tab=await tabResponse.json();
  const cdp=new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  let runtimeExceptions=[];
  const off=cdp.on('Runtime.exceptionThrown',p=>runtimeExceptions.push(p?.exceptionDetails?.text||'runtime exception'));

  for(const width of widths){
    runtimeExceptions=[];
    await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<=390,screenWidth:width,screenHeight:1000});
    const loaded=cdp.once('Page.loadEventFired');
    const nav=await cdp.send('Page.navigate',{url:ORIGIN.replace(/\/$/,'')+'/'+PAGE});
    if(nav.errorText) throw new Error(nav.errorText);
    await loaded; await sleep(150);

    const m=await evalJs(cdp, `(() => {
      const de=document.documentElement, body=document.body;
      const frames=[...document.querySelectorAll('.frame')];
      const captions=[...document.querySelectorAll('.caption')].map(n=>n.textContent.trim());
      const h1=[...document.querySelectorAll('h1')];
      const main=document.querySelector('main');
      const focusables=[...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')];
      return {
        readyState:document.readyState,
        overflowPx:Math.max(0,Math.max(de.scrollWidth,body.scrollWidth)-de.clientWidth),
        frameCount:frames.length,
        captions,
        h1Count:h1.length,
        h1Visible:Boolean(h1[0]&&h1[0].getBoundingClientRect().height>0),
        mainPresent:Boolean(main),
        focusableCount:focusables.length,
        minTextPx:Math.min(...[...document.querySelectorAll('body *')].filter(n=>n.textContent.trim()).map(n=>parseFloat(getComputedStyle(n).fontSize)||999))
      };
    })()`);

    if(m.readyState!=='complete') failures.push(width+': document not complete');
    if(m.overflowPx>1) failures.push(width+': horizontal overflow '+m.overflowPx+'px');
    if(m.frameCount!==4) failures.push(width+': expected 4 frames, got '+m.frameCount);
    if(m.h1Count!==1||!m.h1Visible) failures.push(width+': invalid h1');
    if(!m.mainPresent) failures.push(width+': main missing');
    for(const caption of expectedCaptions) if(!m.captions.includes(caption)) failures.push(width+': missing caption '+caption);
    if(runtimeExceptions.length) failures.push(width+': runtime exceptions '+runtimeExceptions.join(' | '));
    if(m.minTextPx<12) failures.push(width+': text below 12px detected ('+m.minTextPx+'px)');
    results.push({width,...m,runtimeExceptions});
  }

  off(); cdp.close();
  console.log(JSON.stringify({
    marker:failures.length?'FAIL_V2_LOWFIT_REVIEW_MICROPROOF':'PASS_V2_LOWFIT_REVIEW_MICROPROOF',
    page:PAGE,
    widths,
    failures,
    results,
    keyboardNote:'Static low-fi evidence contains no interactive controls; keyboard interaction is NOT_APPLICABLE here and must be tested on a future interactive prototype/runtime.'
  },null,2));
  if(failures.length) process.exitCode=1;
}catch(error){
  console.error(JSON.stringify({marker:'FAIL_V2_LOWFIT_REVIEW_MICROPROOF',fatal:error.message,chromeStderr,failures},null,2));
  process.exitCode=1;
}finally{
  chrome.kill('SIGTERM'); await sleep(120); if(!chrome.killed) chrome.kill('SIGKILL');
}
