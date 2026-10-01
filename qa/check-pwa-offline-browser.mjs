import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT || (20000 + (process.pid % 20000)));
const CACHE_NAME = 'modaryx-site-v120-scalable';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-pwa-offline-'));
const CHROME_PROFILE = path.join(TEMP_ROOT, 'chrome-profile');
const failures = [];
const observations = {};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForJson(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {cache: 'no-store'});
      if (response.ok) return response.json();
    } catch (error) { lastError = error; }
    await sleep(120);
  }
  throw lastError || new Error('timeout waiting for ' + url);
}

async function stopLoopbackServer() {
  const pid = Number(process.env.MODARYX_SERVER_PID || 0);
  if (!Number.isInteger(pid) || pid <= 0) throw new Error('invalid loopback server pid');
  try { process.kill(pid, 'SIGTERM'); } catch {}
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      await fetch(ORIGIN + '/index.html', {cache: 'no-store'});
    } catch {
      return;
    }
    await sleep(100);
  }
  throw new Error('loopback server did not stop');
}

async function startLoopbackServer() {
  const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'ignore', 'ignore']
  });
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(ORIGIN + '/index.html', {cache: 'no-store'});
      if (response.ok) return server;
    } catch {}
    await sleep(100);
  }
  try { server.kill('SIGTERM'); } catch {}
  throw new Error('loopback server did not restart');
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
  once(method, timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { cleanup(); reject(new Error('timeout waiting for ' + method)); }, timeoutMs);
      const listener = (params) => { cleanup(); resolve(params); };
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
  close() { this.ws.close(); }
}

async function evaluate(cdp, expression, awaitPromise = false) {
  const result = await cdp.send('Runtime.evaluate', {expression, awaitPromise, returnByValue: true});
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  return result.result?.value;
}

async function navigate(cdp, relative, {allowError = false} = {}) {
  const loaded = cdp.once('Page.loadEventFired', 12000);
  const nav = await cdp.send('Page.navigate', {url: ORIGIN.replace(/\/$/, '') + '/' + relative});
  if (nav.errorText && !allowError) throw new Error('navigation failed: ' + nav.errorText);
  if (!nav.errorText) await loaded;
  else await sleep(350);
  await sleep(120);
  return nav;
}

async function waitFor(cdp, expression, label, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await evaluate(cdp, expression, true);
    if (last) return last;
    await sleep(120);
  }
  throw new Error('timeout: ' + label + '; last=' + JSON.stringify(last));
}

function assert(condition, message) {
  if (!condition) failures.push(message);
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
  '--remote-debugging-port=' + DEBUG_PORT,
  '--user-data-dir=' + CHROME_PROFILE,
  'about:blank'
], {stdio: ['ignore', 'ignore', 'pipe']});

let restartedLoopback = null;
let chromeStderr = '';
chrome.stderr.on('data', (chunk) => {
  chromeStderr += String(chunk);
  if (chromeStderr.length > 12000) chromeStderr = chromeStderr.slice(-12000);
});

try {
  await waitForJson('http://127.0.0.1:' + DEBUG_PORT + '/json/version');
  const tabResponse = await fetch(
    'http://127.0.0.1:' + DEBUG_PORT + '/json/new?' + encodeURIComponent('about:blank'),
    {method: 'PUT'}
  );
  if (!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP ' + tabResponse.status);
  const tab = await tabResponse.json();
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  await navigate(cdp, 'index.html');

  const swReady = await waitFor(cdp, `(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.ready;
    return reg?.active?.state === 'activated' && navigator.serviceWorker.controller
      ? {state:reg.active.state,scope:reg.scope,controller:true}
      : null;
  })()`, 'service worker activated and controlling', 12000);
  observations.serviceWorkerReady = swReady;

  const initialCache = await evaluate(cdp, `(async () => {
    const names = await caches.keys();
    const cache = await caches.open(${JSON.stringify(CACHE_NAME)});
    const keys = await cache.keys();
    return {names,count:keys.length,urls:keys.map(r=>r.url)};
  })()`, true);
  observations.initialCache = {names:initialCache.names,count:initialCache.count};
  assert(initialCache.names.includes(CACHE_NAME), 'expected MODARYX cache missing');
  assert(initialCache.count >= 17, 'precache unexpectedly small: ' + initialCache.count);

  for (const page of ['catalog.html','creator-studio.html','games/index.html']) {
    await navigate(cdp, page);
    await waitFor(cdp, `(() => document.readyState==='complete' && Boolean(document.querySelector('#main')))()`, page + ' online ready');
  }

  await navigate(cdp, 'catalog.html');
  await waitFor(cdp, `(() => {
    const q=document.querySelector('#catalog-query');
    return q && !q.disabled && document.querySelectorAll('[data-catalog-id]').length===3;
  })()`, 'catalog data cached online');

  const runtimeCache = await evaluate(cdp, `(async () => {
    const cache = await caches.open(${JSON.stringify(CACHE_NAME)});
    const keys = await cache.keys();
    return {
      count:keys.length,
      hasCatalogPage:keys.some(r=>r.url.endsWith('/catalog.html')),
      hasCatalogData:keys.some(r=>r.url.endsWith('/data/catalog.json')),
      hasStudioPage:keys.some(r=>r.url.endsWith('/creator-studio.html')),
      hasGamesPage:keys.some(r=>r.url.endsWith('/games/index.html'))
    };
  })()`, true);
  observations.runtimeCache = runtimeCache;
  assert(runtimeCache.hasCatalogPage, 'catalog page not cached after online visit');
  assert(runtimeCache.hasCatalogData, 'catalog data not cached after online visit');
  assert(runtimeCache.hasStudioPage, 'creator studio page not cached after online visit');
  assert(runtimeCache.hasGamesPage, 'games page not cached after online visit');

  await stopLoopbackServer();
  observations.loopbackOffline = true;

  const offlineCatalogNav = await navigate(cdp, 'catalog.html', {allowError: true});
  observations.offlineCatalogNavigation = offlineCatalogNav.errorText || 'served';
  const offlineCatalog = await evaluate(cdp, `(() => ({
    title:document.querySelector('h1')?.textContent||'',
    main:Boolean(document.querySelector('#main')),
    filters:Boolean(document.querySelector('#catalog-filter-form')),
    controller:Boolean(navigator.serviceWorker.controller),
    ready:document.readyState
  }))()`);
  observations.offlineCatalog = offlineCatalog;
  assert(!offlineCatalogNav.errorText, 'catalog offline navigation failed: ' + offlineCatalogNav.errorText);
  assert(offlineCatalog.main && offlineCatalog.filters && /Explorez les projets/i.test(offlineCatalog.title), 'catalog offline page content missing');
  assert(offlineCatalog.controller, 'catalog offline page lost service worker controller');

  const offlineAliasNav = await navigate(cdp, 'catalog?game=demo', {allowError: true});
  observations.offlineAliasNavigation = offlineAliasNav.errorText || 'served';
  const offlineAlias = await evaluate(cdp, `(() => ({
    title:document.querySelector('h1')?.textContent||'',
    main:Boolean(document.querySelector('#main')),
    filters:Boolean(document.querySelector('#catalog-filter-form')),
    href:location.href
  }))()`);
  observations.offlineAlias = offlineAlias;
  assert(!offlineAliasNav.errorText, 'catalog query offline navigation failed: ' + offlineAliasNav.errorText);
  assert(offlineAlias.main && offlineAlias.filters && /Explorez les projets/i.test(offlineAlias.title), 'catalog query offline content missing');

  const offlineData = await evaluate(cdp, `(async () => {
    try {
      const response = await fetch('./data/catalog.json', {cache:'no-store'});
      return {
        ok:response.ok,
        status:response.status,
        stale:response.headers.get('X-Modaryx-Cache'),
        json:await response.json()
      };
    } catch (error) {
      return {error:String(error)};
    }
  })()`, true);
  observations.offlineData = {ok:offlineData.ok,status:offlineData.status,stale:offlineData.stale,error:offlineData.error};
  assert(offlineData.ok === true && offlineData.status === 200, 'catalog data unavailable offline: ' + JSON.stringify(offlineData));
  assert(offlineData.stale === 'offline-stale', 'offline catalog data missing stale marker');
  assert(offlineData.json?.schemaVersion === 1, 'offline catalog data contract missing');

  const offlineIndexNav = await navigate(cdp, 'index.html', {allowError: true});
  observations.offlineIndexNavigation = offlineIndexNav.errorText || 'served';
  const offlineIndex = await evaluate(cdp, `(() => ({
    title:document.querySelector('h1')?.textContent||'',
    main:Boolean(document.querySelector('#main'))
  }))()`);
  assert(!offlineIndexNav.errorText, 'precache index offline navigation failed: ' + offlineIndexNav.errorText);
  assert(offlineIndex.main && offlineIndex.title.length > 0, 'offline index content missing');

  restartedLoopback = await startLoopbackServer();
  observations.loopbackRecovered = Boolean(restartedLoopback?.pid);

  const onlineData = await evaluate(cdp, `(async () => {
    const response = await fetch('./data/catalog.json', {cache:'no-store'});
    return {ok:response.ok,status:response.status,stale:response.headers.get('X-Modaryx-Cache')};
  })()`, true);
  observations.onlineData = onlineData;
  assert(onlineData.ok === true && onlineData.status === 200, 'catalog data did not recover online');
  assert(onlineData.stale === null, 'fresh online catalog data still marked stale');

  cdp.close();

  console.log(JSON.stringify({
    marker: failures.length ? 'FAIL_TARGETED_PWA_OFFLINE_BROWSER_PROOF' : 'PASS_TARGETED_PWA_OFFLINE_BROWSER_PROOF',
    origin: ORIGIN,
    cacheName: CACHE_NAME,
    observations,
    failures
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    marker:'FAIL_TARGETED_PWA_OFFLINE_BROWSER_PROOF',
    fatal:error.message,
    chromeStderr,
    failures
  }, null, 2));
  process.exitCode = 1;
} finally {
  if (restartedLoopback && !restartedLoopback.killed) {
    try { restartedLoopback.kill('SIGTERM'); } catch {}
  }
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT, {recursive: true, force: true});
}
