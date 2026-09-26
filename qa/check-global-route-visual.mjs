import {spawn} from 'node:child_process';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = (process.env.MODARYX_VISUAL_ORIGIN || '').replace(/\/$/, '');
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const OUT = process.env.MODARYX_VISUAL_OUT || path.join(process.cwd(), 'visual-proof-output');
const TARGET_SHA = process.env.MODARYX_VISUAL_TARGET_SHA || '';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-preview-visual-'));
const USER_DATA_DIR = path.join(TEMP_ROOT, 'chrome-profile');
const failures = [];
const observations = {};

if (!/^https:\/\//.test(ORIGIN)) {
  throw new Error('MODARYX_VISUAL_ORIGIN must be an HTTPS preview origin');
}
fs.mkdirSync(OUT, {recursive: true});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDevToolsPort(timeoutMs = 12000) {
  const file = path.join(USER_DATA_DIR, 'DevToolsActivePort');
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(file)) {
      const [port] = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
      if (/^\d+$/.test(port)) return Number(port);
    }
    await sleep(120);
  }
  throw new Error('DevToolsActivePort not created');
}

async function waitForJson(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {cache: 'no-store'});
      if (response.ok) return response.json();
    } catch (error) {
      lastError = error;
    }
    await sleep(120);
  }
  throw lastError || new Error('timeout waiting for ' + url);
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.opened = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, {once: true});
      this.ws.addEventListener('error', reject, {once: true});
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const waiter = this.pending.get(message.id);
        if (!waiter) return;
        this.pending.delete(message.id);
        if (message.error) waiter.reject(new Error(message.error.message || JSON.stringify(message.error)));
        else waiter.resolve(message.result);
        return;
      }
      if (message.method) {
        for (const listener of [...(this.listeners.get(message.method) || [])]) listener(message.params);
      }
    });
  }
  async send(method, params = {}) {
    await this.opened;
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => this.pending.set(id, {resolve, reject}));
    this.ws.send(JSON.stringify({id, method, params}));
    return promise;
  }
  once(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('timeout waiting for ' + method));
      }, timeoutMs);
      const listener = (params) => {
        cleanup();
        resolve(params);
      };
      const cleanup = () => {
        clearTimeout(timer);
        const set = this.listeners.get(method);
        set?.delete(listener);
        if (set && !set.size) this.listeners.delete(method);
      };
      if (!this.listeners.has(method)) this.listeners.set(method, new Set());
      this.listeners.get(method).add(listener);
    });
  }
  close() {
    this.ws.close();
  }
}

async function evaluate(cdp, expression, awaitPromise = false) {
  const result = await cdp.send('Runtime.evaluate', {expression, awaitPromise, returnByValue: true});
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  return result.result?.value;
}

async function waitFor(cdp, expression, label, timeoutMs = 12000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await evaluate(cdp, expression, true);
    if (last) return last;
    await sleep(150);
  }
  throw new Error('timeout: ' + label + '; last=' + JSON.stringify(last));
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const ROUTES = [
 '404.html','community.html','creator-studio.html','documentation.html','downloads.html',
 'ecosystem.html','games/','gta-6/','gta-6/guides/','gta-6/mods/',
 'profiles.html','project.html','project-balanced-latency-pack.html',
 'project-ember-textures.html','project-forge-night-experience.html',
 'red-dead-redemption-2/','red-dead-redemption-2/guides/',
 'red-dead-redemption-2/mods/','search.html','security.html','verify.html'
];
const VIEWPORTS = [
  {name:'desktop',width:1440,height:900,mobile:false},
  {name:'mobile-small',width:320,height:640,mobile:true},
  {name:'mobile',width:390,height:844,mobile:true},
  {name:'mobile-large',width:430,height:932,mobile:true},
  {name:'mobile-landscape',width:844,height:390,mobile:true}
];
async function captureRoute(cdp, route, spec, index) {
  const key = route.replace(/[^a-z0-9]/g, '-') + '-' + spec.name;
  await cdp.send('Emulation.setDeviceMetricsOverride', {width:spec.width,height:spec.height,deviceScaleFactor:1,mobile:spec.mobile});
  const loaded = cdp.once('Page.loadEventFired', 20000);
  const nav = await cdp.send('Page.navigate',{url:ORIGIN+'/'+route+'?global-proof='+encodeURIComponent(TARGET_SHA)});
  if (nav.errorText) throw new Error(route+': '+nav.errorText);
  await loaded;
  await sleep(160);
  const state = await evaluate(cdp, `(() => {
    const hero = document.querySelector('.search-hero, .hero, .games-intro, main > section, main > article');
    const input = document.querySelector('#site-search');
    const rect = (element) => element ? {top:Math.round(element.getBoundingClientRect().top),bottom:Math.round(element.getBoundingClientRect().bottom)} : null;
    return {url:location.href,title:document.title,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      pageHeight:document.documentElement.scrollHeight,hero:rect(hero),searchInput:rect(input),
      heading:document.querySelector('h1')?.textContent?.trim(),footer:!!document.querySelector('.site-footer')};
  })()`);
  assert(state.scrollWidth <= spec.width+1,key+': horizontal overflow '+state.scrollWidth+'/'+spec.width);
  assert(state.heading && state.footer,key+': heading/footer absent');
  if(route==='search.html' && spec.name==='desktop') assert(state.searchInput?.top<1000,key+': search control below first viewport');
  const shot=async(suffix)=>{
    const image=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:65,fromSurface:true,captureBeyondViewport:false});
    fs.writeFileSync(path.join(OUT,key+suffix+'.jpg'),Buffer.from(image.data,'base64'));
  };
  await shot('');
  if(spec.name==='desktop'||spec.name==='mobile') {
    await evaluate(cdp,"scrollTo({top:document.documentElement.scrollHeight-innerHeight,behavior:'instant'})");
    await sleep(100);
    state.footerVisible=await evaluate(cdp,"document.querySelector('.site-footer')?.getBoundingClientRect().top < innerHeight");
    await shot('-footer');
    assert(state.footerVisible,key+': footer unreachable');
    await evaluate(cdp,"scrollTo({top:0,behavior:'instant'})");
    if(spec.name==='mobile') {
      const control=await evaluate(cdp,"document.querySelector('.nav-toggle, [data-menu-button]')?.outerHTML || ''");
      if(control){
        await evaluate(cdp,"document.querySelector('.nav-toggle, [data-menu-button]').click()");
        state.menuExpanded=await evaluate(cdp,"document.querySelector('.nav-toggle, [data-menu-button]')?.getAttribute('aria-expanded')");
        await shot('-menu');
        assert(state.menuExpanded==='true',key+': mobile menu failed');
      }
    }
  }
  if(route==='search.html' && spec.name==='mobile'){
    await evaluate(cdp,"document.querySelector('#site-search').value='Skyrim';document.querySelector('#site-search').dispatchEvent(new Event('input',{bubbles:true}))");
    state.searchResults=await evaluate(cdp,"document.querySelectorAll('#search-results .search-result:not([hidden])').length");
    assert(state.searchResults>0,key+': search returned no results');
  }
  observations[key]=state;
  return key;
}
const chrome = spawn(CHROME_BIN, [
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-background-networking',
  '--disable-default-apps',
  '--disable-extensions',
  '--disable-sync',
  '--metrics-recording-only',
  '--no-first-run',
  '--remote-debugging-address=127.0.0.1',
  '--remote-debugging-port=0',
  '--user-data-dir=' + USER_DATA_DIR,
  'about:blank'
], {stdio: ['ignore', 'ignore', 'pipe']});

let chromeStderr = '';
chrome.stderr.on('data', (chunk) => {
  chromeStderr = (chromeStderr + String(chunk)).slice(-12000);
});

try {
 const port=await waitForDevToolsPort();
 await waitForJson('http://127.0.0.1:'+port+'/json/version');
 const response=await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'});
 if(!response.ok) throw new Error('Chrome target: '+response.status);
 const tab=await response.json(); const cdp=new Cdp(tab.webSocketDebuggerUrl);
 await cdp.opened; await cdp.send('Page.enable');await cdp.send('Runtime.enable');
 const montages={desktop:[],mobile:[]};
 for(const [index,route] of ROUTES.entries()){
   for(const spec of VIEWPORTS){
     const key=await captureRoute(cdp,route,spec,index);
     if(montages[spec.name]) montages[spec.name].push(key+'.jpg');
   }
 }
 for(const [name,files] of Object.entries(montages)){
   const list=path.join(OUT,name+'-frames.txt');
   fs.writeFileSync(list,files.map(file=>"file '"+path.join(OUT,file)+"'\nduration 1.5").join('\n')+"\nfile '"+path.join(OUT,files.at(-1))+"'\n");
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',list,'-vf',
     'scale=trunc(iw/2)*2:trunc(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p',path.join(OUT,'route-overview-'+name+'.mp4')]);
 }
 cdp.close();
 const proof={marker:failures.length?'FAIL_ROUTE_PROOF':'ROUTE_PROOF_CAPTURED',origin:ORIGIN,targetSha:TARGET_SHA,
   routes:ROUTES,viewports:VIEWPORTS,observations,failures,
   videoNote:'Videos are labeled sequential still-frame route overviews, not continuous interaction recordings.'};
 fs.writeFileSync(path.join(OUT,'route-proof.json'),JSON.stringify(proof,null,2)+'\n');
 console.log(JSON.stringify({targetSha:TARGET_SHA,origin:ORIGIN,routes:ROUTES.length,viewports:VIEWPORTS.length,failures}));
 if(failures.length) process.exitCode=1;
} catch(error){
 fs.writeFileSync(path.join(OUT,'route-proof-error.json'),JSON.stringify({targetSha:TARGET_SHA,origin:ORIGIN,error:error.message,observations,failures},null,2));
 console.error(error);process.exitCode=1;
} finally{chrome.kill();fs.rmSync(TEMP_ROOT,{recursive:true,force:true,maxRetries:8,retryDelay:200});}
