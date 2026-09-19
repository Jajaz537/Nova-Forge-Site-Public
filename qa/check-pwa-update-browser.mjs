import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const ORIGIN = 'http://127.0.0.1:4174';
const USER_DATA_DIR = '/tmp/modaryx-pwa-update-browser-' + process.pid;
const ROOT = '/tmp/modaryx-pwa-update-' + process.pid;
const CACHE_A = 'modaryx-site-v120-scalable';
const CACHE_B = 'modaryx-site-v121-update-proof';
const failures = [];
const observations = {};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) failures.push(message);
}

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
      const response = await fetch(url, {cache:'no-store'});
      if (response.ok) return response.json();
    } catch (error) { lastError = error; }
    await sleep(120);
  }
  throw lastError || new Error('timeout waiting for ' + url);
}

function copyCandidate() {
  fs.rmSync(ROOT, {recursive:true, force:true});
  fs.cpSync(process.cwd(), ROOT, {
    recursive:true,
    filter:(source) => !source.includes(path.sep + '.git' + path.sep) && !source.endsWith(path.sep + '.git')
  });
  const indexPath = path.join(ROOT, 'index.html');
  let index = fs.readFileSync(indexPath, 'utf8');
  index = index.replace('<body', '<body data-pwa-update-proof="A"');
  fs.writeFileSync(indexPath, index);
}

function mutateToB() {
  const swPath = path.join(ROOT, 'sw.js');
  const indexPath = path.join(ROOT, 'index.html');
  let sw = fs.readFileSync(swPath, 'utf8');
  if (!sw.includes(CACHE_A)) throw new Error('stage A cache name missing in copied sw.js');
  sw = sw.replace(CACHE_A, CACHE_B);
  fs.writeFileSync(swPath, sw);
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('data-pwa-update-proof="A"')) throw new Error('stage A marker missing in copied index.html');
  index = index.replace('data-pwa-update-proof="A"', 'data-pwa-update-proof="B"');
  fs.writeFileSync(indexPath, index);
}

function startServer() {
  const child = spawn('python3', ['-m','http.server','4174','--bind','127.0.0.1'], {
    cwd:ROOT,
    stdio:['ignore','ignore','ignore']
  });
  return child;
}

async function waitServerUp() {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(ORIGIN + '/index.html', {cache:'no-store'});
      if (response.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error('loopback update server did not start');
}

async function stopServer(child) {
  if (!child || child.killed) return;
  try { child.kill('SIGTERM'); } catch {}
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      await fetch(ORIGIN + '/index.html', {cache:'no-store'});
    } catch {
      return;
    }
    await sleep(100);
  }
  throw new Error('loopback update server did not stop');
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.opened = new Promise((resolve,reject) => {
      this.ws.addEventListener('open', resolve, {once:true});
      this.ws.addEventListener('error', reject, {once:true});
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
  async send(method, params={}) {
    await this.opened;
    const id = this.nextId++;
    const promise = new Promise((resolve,reject) => this.pending.set(id,{resolve,reject}));
    this.ws.send(JSON.stringify({id,method,params}));
    return promise;
  }
  once(method, timeoutMs=12000) {
    return new Promise((resolve,reject) => {
      const timer = setTimeout(() => { cleanup(); reject(new Error('timeout waiting for ' + method)); }, timeoutMs);
      const listener = (params) => { cleanup(); resolve(params); };
      const cleanup = () => {
        clearTimeout(timer);
        const set = this.listeners.get(method);
        set?.delete(listener);
        if (set && !set.size) this.listeners.delete(method);
      };
      if (!this.listeners.has(method)) this.listeners.set(method,new Set());
      this.listeners.get(method).add(listener);
    });
  }
  close() { this.ws.close(); }
}

async function evaluate(cdp, expression, awaitPromise=false) {
  const result = await cdp.send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  return result.result?.value;
}

async function navigate(cdp, relative, allowError=false) {
  const loaded = cdp.once('Page.loadEventFired',12000);
  const nav = await cdp.send('Page.navigate',{url:ORIGIN + '/' + relative});
  if (nav.errorText && !allowError) throw new Error('navigation failed: ' + nav.errorText);
  if (!nav.errorText) await loaded;
  else await sleep(350);
  await sleep(150);
  return nav;
}

async function waitFor(cdp, expression, label, timeoutMs=12000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await evaluate(cdp, expression, true);
    if (last) return last;
    await sleep(120);
  }
  throw new Error('timeout: ' + label + '; last=' + JSON.stringify(last));
}

copyCandidate();
let server = startServer();
await waitServerUp();

const chrome = spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking',
  '--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
  '--user-data-dir=' + USER_DATA_DIR,'about:blank'
],{stdio:['ignore','ignore','pipe']});

let chromeStderr='';
chrome.stderr.on('data',(chunk)=>{chromeStderr=(chromeStderr+String(chunk)).slice(-12000);});

try {
  const debugPort = await waitForDevToolsPort();
  await waitForJson('http://127.0.0.1:' + debugPort + '/json/version');
  const tabResponse = await fetch('http://127.0.0.1:' + debugPort + '/json/new?' + encodeURIComponent('about:blank'),{method:'PUT'});
  if (!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP ' + tabResponse.status);
  const tab = await tabResponse.json();
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  await navigate(cdp,'index.html');
  await waitFor(cdp,`(async()=>{const r=await navigator.serviceWorker.ready;return r?.active?.state==='activated'&&navigator.serviceWorker.controller;})()`,'stage A service worker');
  const stageA = await evaluate(cdp,`(async()=>({marker:document.body.dataset.pwaUpdateProof,caches:await caches.keys()}))()`,true);
  observations.stageA=stageA;
  assert(stageA.marker==='A','stage A page marker missing');
  assert(stageA.caches.includes(CACHE_A),'stage A cache missing');

  mutateToB();

  const updateTriggered = await evaluate(cdp,`(async()=>{
    const reg=await navigator.serviceWorker.getRegistration();
    if(!reg) return false;
    await reg.update();
    return true;
  })()`,true);
  assert(updateTriggered===true,'service worker update was not triggered');

  const stageB = await waitFor(cdp,`(async()=>{
    const names=await caches.keys();
    const reg=await navigator.serviceWorker.getRegistration();
    return names.includes(${JSON.stringify(CACHE_B)}) && !names.includes(${JSON.stringify(CACHE_A)}) && reg?.active?.state==='activated'
      ? {names,state:reg.active.state,controller:Boolean(navigator.serviceWorker.controller)}
      : null;
  })()`,'stage B cache activation',15000);
  observations.stageB=stageB;
  assert(stageB.controller===true,'stage B service worker is not controlling');

  await stopServer(server);
  server=null;

  const offlineNav = await navigate(cdp,'index.html',true);
  observations.offlineNavigation = offlineNav.errorText || 'served';
  const offline = await evaluate(cdp,`(() => ({
    marker:document.body.dataset.pwaUpdateProof,
    main:Boolean(document.querySelector('#main')),
    controller:Boolean(navigator.serviceWorker.controller),
    title:document.querySelector('h1')?.textContent||''
  }))()`);
  observations.offline=offline;
  assert(!offlineNav.errorText,'stage B offline navigation failed: ' + offlineNav.errorText);
  assert(offline.marker==='B','offline page is not the updated B version');
  assert(offline.main && offline.controller && offline.title.length>0,'updated B offline page incomplete');

  cdp.close();

  console.log(JSON.stringify({
    marker:failures.length?'FAIL_TARGETED_PWA_UPDATE_BROWSER_PROOF':'PASS_TARGETED_PWA_UPDATE_BROWSER_PROOF',
    origin:ORIGIN,
    cacheA:CACHE_A,
    cacheB:CACHE_B,
    observations,
    failures
  },null,2));
  if (failures.length) process.exitCode=1;
} catch (error) {
  console.error(JSON.stringify({
    marker:'FAIL_TARGETED_PWA_UPDATE_BROWSER_PROOF',
    fatal:error.message,
    chromeStderr,
    failures,
    observations
  },null,2));
  process.exitCode=1;
} finally {
  if (server) {
    try { await stopServer(server); } catch {}
  }
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(ROOT,{recursive:true,force:true});
}
