import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = (process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173').replace(/\/$/, '');
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-home-status-states-'));
const USER_DATA_DIR = path.join(TEMP_ROOT, 'chrome-profile');
const failures = [];
const checks = [];
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
        for (const listener of [...(this.listeners.get(message.method) || [])]) {
          try {
            const value = listener(message.params);
            if (value && typeof value.catch === 'function') value.catch(() => {});
          } catch {}
        }
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
  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(listener);
    return () => {
      const set = this.listeners.get(method);
      set?.delete(listener);
      if (set && !set.size) this.listeners.delete(method);
    };
  }
  close() { this.ws.close(); }
}

async function evaluate(cdp, expression, awaitPromise = false) {
  const result = await cdp.send('Runtime.evaluate', {expression, awaitPromise, returnByValue: true});
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  return result.result?.value;
}

async function navigate(cdp, relative) {
  const loaded = cdp.once('Page.loadEventFired', 12000);
  const nav = await cdp.send('Page.navigate', {url: ORIGIN + '/' + relative});
  if (nav.errorText) throw new Error('navigation failed: ' + nav.errorText);
  await loaded;
  await sleep(180);
}

async function waitFor(cdp, expression, label, timeoutMs = 9000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await evaluate(cdp, expression, true);
    if (last) return last;
    await sleep(100);
  }
  throw new Error('timeout: ' + label + '; last=' + JSON.stringify(last));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function runCheck(name, fn) {
  try {
    const detail = await fn();
    checks.push({name, status: 'PASS', detail});
  } catch (error) {
    failures.push(name + ': ' + error.message);
    checks.push({name, status: 'FAIL', detail: error.message});
  }
}
async function failRequests(cdp, patterns) {
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', {bypass: true});
  await cdp.send('Fetch.enable', {
    patterns: patterns.map((urlPattern) => ({urlPattern, requestStage: 'Request'}))
  });
  const remove = cdp.on('Fetch.requestPaused', async (params) => {
    await cdp.send('Fetch.failRequest', {requestId: params.requestId, errorReason: 'Failed'});
  });
  return async () => {
    remove();
    await cdp.send('Fetch.disable');
    await cdp.send('Network.setBypassServiceWorker', {bypass: false});
  };
}

const chrome = spawn(CHROME_BIN, [
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking',
  '--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only',
  '--no-first-run','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
  '--user-data-dir=' + USER_DATA_DIR,'about:blank'
], {stdio: ['ignore', 'ignore', 'pipe']});

let chromeStderr = '';
chrome.stderr.on('data', (chunk) => { chromeStderr = (chromeStderr + String(chunk)).slice(-12000); });

try {
  const portFile = path.join(USER_DATA_DIR, 'DevToolsActivePort');
  const deadline = Date.now() + 12000;
  while (!fs.existsSync(portFile) && Date.now() < deadline) await sleep(120);
  if (!fs.existsSync(portFile)) throw new Error('DevToolsActivePort not created');
  const [debugPort] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
  if (!/^\d+$/.test(debugPort)) throw new Error('invalid DevTools port');
  await waitForJson('http://127.0.0.1:' + debugPort + '/json/version');
  const tabResponse = await fetch('http://127.0.0.1:' + debugPort + '/json/new?' + encodeURIComponent('about:blank'), {method: 'PUT'});
  if (!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP ' + tabResponse.status);
  const tab = await tabResponse.json();
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  await runCheck('home-public-data-failure-recovery', async () => {
    const release = await failRequests(cdp, ['*data/catalog.json*','*public-status.json*','*public-build.json*']);
    await navigate(cdp, 'index.html?state-proof=public-data-failure');

    const failed = await waitFor(cdp, `(() => {
      const root=document.querySelector('[data-mod-catalog]');
      const retry=root?.querySelector('button');
      const status=document.querySelector('[data-public-status-message]');
      const build=document.querySelector('[data-public-build-fact]');
      if (!retry || status?.dataset.freshness!=='unavailable' || build?.dataset.freshness!=='unavailable') return null;
      return {
        retryText:retry.textContent||'',
        catalogText:root.textContent||'',
        searchDisabled:document.querySelector('#mod-search')?.disabled,
        publicStatus:status.textContent||'',
        statusFreshness:status.dataset.freshness||'',
        buildText:build.querySelector('small')?.textContent||'',
        buildFreshness:build.dataset.freshness||''
      };
    })()`, 'home public-data failure');
    assert(failed.retryText === 'Réessayer', 'home catalogue retry missing');
    assert(failed.searchDisabled === true, 'home search must remain disabled while catalogue failed');
    assert(/catalogue ne peut pas être chargé/i.test(failed.catalogText), 'home catalogue failure copy missing');
    assert(/manifeste public est indisponible/i.test(failed.publicStatus), 'public status failure copy missing');

    await release();
    await evaluate(cdp, `document.querySelector('[data-mod-catalog] button')?.click(); true`);
    const catalogRecovered = await waitFor(cdp, `(() => {
      const search=document.querySelector('#mod-search');
      const cards=document.querySelectorAll('[data-mod-catalog] article.card');
      return search && !search.disabled && cards.length===3 && document.activeElement===search
        ? {cards:cards.length,focused:document.activeElement.id}
        : null;
    })()`, 'home catalogue retry');

    await navigate(cdp, 'index.html?state-proof=public-data-recovered');
    const recovered = await waitFor(cdp, `(() => {
      const status=document.querySelector('[data-public-status-message]');
      const build=document.querySelector('[data-public-build-fact]');
      const search=document.querySelector('#mod-search');
      const cards=document.querySelectorAll('[data-mod-catalog] article.card');
      if (!status || !build || !search) return null;
      return status.dataset.freshness==='network' && build.dataset.freshness==='unavailable' && build.dataset.reported===undefined && !search.disabled && cards.length===3
        ? {
            status:status.textContent||'',
            statusFreshness:status.dataset.freshness,
            buildText:build.querySelector('small')?.textContent||'',
            buildFreshness:build.dataset.freshness,
            buildReported:build.dataset.reported ?? null,
            cards:cards.length
          }
        : null;
    })()`, 'home public-data recovery');
    assert(/Aucun téléchargement public n’est déclaré disponible/.test(recovered.status), 'recovered public status drifted');
    assert(recovered.buildText === 'Empreinte de build non disponible', 'public build must stay unavailable while the digest is intentionally null');

    await evaluate(cdp, `document.querySelector('[data-os-bridge]')?.click(); true`);
    const bridge = await waitFor(cdp, `(() => {
      const panel=document.querySelector('[data-profile-result]');
      return /Pont local optionnel inactif/.test(panel?.textContent||'')
        ? {text:panel.textContent||''}
        : null;
    })()`, 'OS bridge inactive state');
    assert(/Aucun protocole local, exécutable ou service n’a été lancé/.test(bridge.text), 'OS bridge inactive boundary copy missing');

    return {failed, catalogRecovered, recovered, bridge};
  });

  cdp.close();
  console.log(JSON.stringify({marker: failures.length ? 'FAIL_TARGETED_HOME_PUBLIC_STATES' : 'PASS_TARGETED_HOME_PUBLIC_STATES', checks, failures}, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({marker: 'FAIL_TARGETED_HOME_PUBLIC_STATES', fatal: error.message, chromeStderr, failures}, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT, {recursive: true, force: true});
}
