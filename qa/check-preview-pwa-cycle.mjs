import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = (process.env.MODARYX_PREVIEW_ORIGIN || '').replace(/\/$/, '');
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-preview-pwa-'));
const USER_DATA_DIR = path.join(TEMP_ROOT, 'chrome-profile');
const failures = [];
const observations = {};

if (!/^https:\/\//.test(ORIGIN)) {
  throw new Error('MODARYX_PREVIEW_ORIGIN must be an HTTPS preview origin');
}
fs.mkdirSync(USER_DATA_DIR, {recursive: true});

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
    const announced = chromeStderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
    if (announced) return Number(announced[1]);
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
  async send(method, params = {}, sessionId = null) {
    await this.opened;
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => this.pending.set(id, {resolve, reject}));
    this.ws.send(JSON.stringify(sessionId ? {id, method, params, sessionId} : {id, method, params}));
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
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  return result.result?.value;
}

async function navigate(cdp, relative, allowError = false) {
  const loaded = cdp.once('Page.loadEventFired', 15000);
  const nav = await cdp.send('Page.navigate', {url: ORIGIN + '/' + relative});
  if (nav.errorText && !allowError) throw new Error('navigation failed: ' + nav.errorText);
  if (!nav.errorText) await loaded;
  else await sleep(500);
  await sleep(250);
  return nav;
}

async function waitFor(cdp, expression, label, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await evaluate(cdp, expression, true);
    if (last) return last;
    await sleep(150);
  }
  throw new Error('timeout: ' + label + '; last=' + JSON.stringify(last));
}

async function setOffline(cdp, offline, serviceWorkerSessionId = null) {
  const conditions = {
    offline,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
    connectionType: offline ? 'none' : 'wifi'
  };
  await cdp.send('Network.emulateNetworkConditions', conditions);
  if (serviceWorkerSessionId) {
    await cdp.send('Network.emulateNetworkConditions', conditions, serviceWorkerSessionId);
  }
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
  const debugPort = await waitForDevToolsPort();
  await waitForJson('http://127.0.0.1:' + debugPort + '/json/version');
  const tabResponse = await fetch(
    'http://127.0.0.1:' + debugPort + '/json/new?' + encodeURIComponent('about:blank'),
    {method: 'PUT'}
  );
  if (!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP ' + tabResponse.status);
  const tab = await tabResponse.json();
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  await cdp.send('Target.setDiscoverTargets', {discover: true});

  await navigate(cdp, 'index.html?preview-pwa-proof=warmup');

  let sw = await waitFor(cdp, `(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.ready;
    return reg?.active?.state === 'activated'
      ? {active:reg.active.state, controller:Boolean(navigator.serviceWorker.controller), scope:reg.scope}
      : null;
  })()`, 'service worker active', 20000);

  if (!sw.controller) {
    await navigate(cdp, 'index.html?preview-pwa-proof=controlled');
    sw = await waitFor(cdp, `(async () => {
      const reg = await navigator.serviceWorker.ready;
      return reg?.active?.state === 'activated' && navigator.serviceWorker.controller
        ? {active:reg.active.state, controller:true, scope:reg.scope}
        : null;
    })()`, 'service worker controlling after reload', 15000);
  }
  observations.serviceWorker = sw;

  const serviceWorkerTarget = await waitFor(cdp, `(async () => true)()`, 'service worker target wait', 1000)
    .then(async () => {
      const {targetInfos} = await cdp.send('Target.getTargets');
      return targetInfos.find((target) =>
        target.type === 'service_worker' &&
        target.url.startsWith(ORIGIN + '/sw.js')
      ) || null;
    });
  assert(Boolean(serviceWorkerTarget), 'service worker CDP target not found');
  let serviceWorkerSessionId = null;
  if (serviceWorkerTarget) {
    const attached = await cdp.send('Target.attachToTarget', {
      targetId: serviceWorkerTarget.targetId,
      flatten: true
    });
    serviceWorkerSessionId = attached.sessionId || null;
    assert(Boolean(serviceWorkerSessionId), 'service worker CDP session not attached');
    if (serviceWorkerSessionId) {
      await cdp.send('Network.enable', {}, serviceWorkerSessionId);
    }
  }
  observations.serviceWorkerNetworkSession = Boolean(serviceWorkerSessionId);

  await navigate(cdp, 'catalog.html?preview-pwa-proof=warm');
  const catalogWarm = await waitFor(cdp, `(() => {
    const q=document.querySelector('#catalog-query');
    const cards=document.querySelectorAll('[data-catalog-id]');
    return q && !q.disabled && cards.length===3
      ? {cards:cards.length,controller:Boolean(navigator.serviceWorker.controller)}
      : null;
  })()`, 'catalog warm hydration', 15000);
  observations.catalogWarm = catalogWarm;

  await navigate(cdp, 'games/index.html?preview-pwa-proof=warm');
  const gamesWarm = await waitFor(cdp, `(() => document.querySelector('#main') && document.querySelector('h1')
    ? {title:document.querySelector('h1').textContent.trim(),controller:Boolean(navigator.serviceWorker.controller)}
    : null)()`, 'games warm page', 10000);
  observations.gamesWarm = gamesWarm;

  const cachesWarm = await evaluate(cdp, `(async () => {
    const names=await caches.keys();
    const rows=[];
    for (const name of names.filter((value)=>value.startsWith('modaryx-site-'))) {
      const cache=await caches.open(name);
      const keys=await cache.keys();
      rows.push({name,count:keys.length,urls:keys.map((request)=>request.url)});
    }
    return rows;
  })()`, true);
  observations.cachesWarm = cachesWarm.map((row) => ({name:row.name,count:row.count}));
  assert(cachesWarm.length >= 1, 'no MODARYX cache found on deployed preview');
  const cachedUrls = cachesWarm.flatMap((row) => row.urls);
  assert(cachedUrls.some((url) => /\/index\.html(?:$|\?)/.test(url) || /pages\.dev\/$/.test(url)), 'index not found in preview cache');
  assert(cachedUrls.some((url) => /\/catalog\.html(?:$|\?)/.test(url)), 'catalog page not found in preview cache');
  assert(cachedUrls.some((url) => /\/data\/catalog\.json(?:$|\?)/.test(url)), 'catalog data not found in preview cache');

  await cdp.send('Network.clearBrowserCache');
  await setOffline(cdp, true, serviceWorkerSessionId);
  observations.networkOffline = true;

  const offlineCatalogNav = await navigate(cdp, 'catalog.html?preview-pwa-proof=offline', true);
  const offlineCatalog = await waitFor(cdp, `(() => {
    const main=document.querySelector('#main');
    const q=document.querySelector('#catalog-query');
    return main && q
      ? {title:document.querySelector('h1')?.textContent?.trim()||'', controller:Boolean(navigator.serviceWorker.controller), disabled:q.disabled}
      : null;
  })()`, 'offline catalog shell', 12000);
  observations.offlineCatalog = {...offlineCatalog, navigationError:offlineCatalogNav.errorText || null};
  assert(!offlineCatalogNav.errorText, 'catalog offline navigation failed: ' + offlineCatalogNav.errorText);
  assert(offlineCatalog.controller, 'catalog offline page lost service worker controller');

  const offlineData = await evaluate(cdp, `(async () => {
    try {
      const response=await fetch('./data/catalog.json',{cache:'no-store'});
      return {
        ok:response.ok,
        status:response.status,
        stale:response.headers.get('X-Modaryx-Cache'),
        schemaVersion:(await response.json())?.schemaVersion ?? null
      };
    } catch (error) {
      return {error:String(error)};
    }
  })()`, true);
  observations.offlineData = offlineData;
  assert(offlineData.ok === true && offlineData.status === 200, 'catalog data unavailable offline: ' + JSON.stringify(offlineData));
  assert(offlineData.stale === 'offline-stale', 'offline catalog data missing offline-stale marker');
  assert(offlineData.schemaVersion === 1, 'offline catalog data schema missing');

  const offlineIndexNav = await navigate(cdp, 'index.html?preview-pwa-proof=offline', true);
  const offlineIndex = await waitFor(cdp, `(() => document.querySelector('#main') && document.querySelector('h1')
    ? {title:document.querySelector('h1').textContent.trim(),controller:Boolean(navigator.serviceWorker.controller)}
    : null)()`, 'offline index', 12000);
  observations.offlineIndex = {...offlineIndex, navigationError:offlineIndexNav.errorText || null};
  assert(!offlineIndexNav.errorText, 'index offline navigation failed: ' + offlineIndexNav.errorText);
  assert(offlineIndex.controller, 'index offline page lost service worker controller');

  await setOffline(cdp, false, serviceWorkerSessionId);
  observations.networkRecovered = true;

  const freshData = await evaluate(cdp, `(async () => {
    const response=await fetch('./data/catalog.json',{cache:'no-store'});
    return {ok:response.ok,status:response.status,stale:response.headers.get('X-Modaryx-Cache')};
  })()`, true);
  observations.freshData = freshData;
  assert(freshData.ok === true && freshData.status === 200, 'catalog data did not recover online');
  assert(freshData.stale === null, 'fresh online catalog data still marked stale');

  const updateCheck = await evaluate(cdp, `(async () => {
    const reg=await navigator.serviceWorker.getRegistration();
    if (!reg) return {registration:false};
    await reg.update();
    await new Promise((resolve)=>setTimeout(resolve,250));
    return {
      registration:true,
      active:reg.active?.state||null,
      waiting:reg.waiting?.state||null,
      installing:reg.installing?.state||null,
      controller:Boolean(navigator.serviceWorker.controller)
    };
  })()`, true);
  observations.updateCheck = updateCheck;
  assert(updateCheck.registration === true, 'service worker registration missing after recovery');
  assert(updateCheck.active === 'activated' && updateCheck.controller === true, 'service worker not healthy after online update check');

  cdp.close();

  console.log(JSON.stringify({
    marker: failures.length ? 'FAIL_TARGETED_PREVIEW_PWA_CYCLE' : 'PASS_TARGETED_PREVIEW_PWA_CYCLE',
    origin: ORIGIN,
    observations,
    failures
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    marker: 'FAIL_TARGETED_PREVIEW_PWA_CYCLE',
    origin: ORIGIN,
    fatal: error.message,
    chromeStderr,
    observations,
    failures
  }, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
}
