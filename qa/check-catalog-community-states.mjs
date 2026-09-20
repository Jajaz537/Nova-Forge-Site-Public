import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = (process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173').replace(/\/$/, '');
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-catalog-community-states-'));
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

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(listener);
    return () => {
      const set = this.listeners.get(method);
      set?.delete(listener);
      if (set && !set.size) this.listeners.delete(method);
    };
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

async function failRequests(cdp, pattern) {
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', {bypass: true});
  await cdp.send('Fetch.enable', {patterns: [{urlPattern: pattern, requestStage: 'Request'}]});
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
  const portFile = path.join(USER_DATA_DIR, 'DevToolsActivePort');
  const deadline = Date.now() + 12000;
  while (!fs.existsSync(portFile) && Date.now() < deadline) await sleep(120);
  if (!fs.existsSync(portFile)) throw new Error('DevToolsActivePort not created');
  const [debugPort] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
  if (!/^\d+$/.test(debugPort)) throw new Error('invalid DevTools port');

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

  await runCheck('catalog-empty-reset', async () => {
    await navigate(cdp, 'catalog.html?state-proof=empty');
    await waitFor(cdp, `(() => {
      const q=document.querySelector('#catalog-query');
      return q && !q.disabled && document.querySelectorAll('[data-catalog-id]').length===3;
    })()`, 'catalog hydrated');

    const empty = await evaluate(cdp, `(() => {
      const q=document.querySelector('#catalog-query');
      q.value='zzzz-modaryx-no-catalog-result-zzzz';
      q.dispatchEvent(new Event('input',{bubbles:true}));
      return {
        count:document.querySelector('#catalog-count')?.textContent||'',
        emptyHidden:document.querySelector('#catalog-empty')?.hidden,
        cards:document.querySelectorAll('[data-catalog-id]').length,
        state:document.querySelector('#catalog-state')?.textContent||''
      };
    })()`);
    assert(empty.cards === 0, 'catalog empty state still has cards');
    assert(empty.emptyHidden === false, 'catalog empty panel is hidden');
    assert(/^0 entrées$/.test(empty.count), 'catalog empty count mismatch: ' + empty.count);
    assert(/Catalogue chargé/.test(empty.state), 'catalog local-state copy missing');

    await evaluate(cdp, `document.querySelector('#catalog-reset')?.click(); true`);
    const reset = await waitFor(cdp, `(() => {
      const q=document.querySelector('#catalog-query');
      const cards=document.querySelectorAll('[data-catalog-id]');
      return q && q.value==='' && cards.length===3 && document.activeElement===q
        ? {cards:cards.length,count:document.querySelector('#catalog-count')?.textContent||'',focused:document.activeElement.id}
        : null;
    })()`, 'catalog reset recovery');
    return {empty, reset};
  });

  await runCheck('catalog-load-failure-static-favorites', async () => {
    await evaluate(cdp, `localStorage.removeItem('nova-forge:catalog:favorites:v1'); true`);
    const release = await failRequests(cdp, '*data/catalog.json*');
    await navigate(cdp, 'catalog.html?state-proof=failure');

    const failed = await waitFor(cdp, `(() => {
      const state=document.querySelector('#catalog-state')?.textContent||'';
      const first=document.querySelector('[data-favorite-id]');
      const controls=[...document.querySelectorAll('#catalog-filter-form input, #catalog-filter-form select')];
      if (!/Chargement impossible|Hors ligne/.test(state) || !first) return null;
      return {
        cards:document.querySelectorAll('[data-catalog-id]').length,
        controlsDisabled:controls.length>0 && controls.every((el)=>el.disabled),
        favoriteDisabled:first.disabled,
        favoritePressed:first.getAttribute('aria-pressed'),
        state
      };
    })()`, 'catalog failure fallback');
    assert(failed.cards === 3, 'static catalog cards disappeared on load failure');
    assert(failed.controlsDisabled === true, 'catalog filters not disabled after load failure');
    assert(failed.favoriteDisabled === false, 'static favorite control unexpectedly disabled');

    const favorite = await evaluate(cdp, `(() => {
      const first=document.querySelector('[data-favorite-id]');
      first.click();
      return {
        id:first.dataset.favoriteId,
        pressed:first.getAttribute('aria-pressed'),
        stored:localStorage.getItem('nova-forge:catalog:favorites:v1')||''
      };
    })()`);
    assert(favorite.pressed === 'true', 'static favorite could not be toggled after load failure');
    assert(favorite.stored.includes(favorite.id), 'static favorite was not persisted locally');

    await release();
    await navigate(cdp, 'catalog.html?state-proof=recovered');
    const recovered = await waitFor(cdp, `(() => {
      const q=document.querySelector('#catalog-query');
      const first=document.querySelector('[data-favorite-id]');
      if (!q || q.disabled || document.querySelectorAll('[data-catalog-id]').length!==3 || !first) return null;
      return {
        cards:document.querySelectorAll('[data-catalog-id]').length,
        favoritePressed:first.getAttribute('aria-pressed'),
        state:document.querySelector('#catalog-state')?.textContent||''
      };
    })()`, 'catalog recovered');
    assert(recovered.favoritePressed === 'true', 'favorite did not survive catalog recovery');
    await evaluate(cdp, `localStorage.removeItem('nova-forge:catalog:favorites:v1'); true`);
    return {failed, favorite, recovered};
  });

  await runCheck('community-catalog-failure-recovery', async () => {
    const release = await failRequests(cdp, '*data/catalog.json*');
    await navigate(cdp, 'community.html?state-proof=failure');
    const failed = await waitFor(cdp, `(() => {
      const collection=document.querySelector('#collection-status')?.textContent||'';
      const submission=document.querySelector('#submission-status')?.textContent||'';
      const itemCopy=document.querySelector('#collection-items .muted')?.textContent||'';
      const target=document.querySelector('#submission-target');
      if (!/Catalogue indisponible/.test(collection) || !/Catalogue indisponible/.test(submission)) return null;
      return {
        collection,
        submission,
        itemCopy,
        targetText:target?.options?.[0]?.textContent||'',
        targetOptions:target?.options?.length||0
      };
    })()`, 'community catalog failure');
    assert(/copie locale.*conservée/i.test(failed.collection), 'collection failure does not preserve local-copy message');
    assert(/copie locale.*conservée/i.test(failed.submission), 'submission failure does not preserve local-copy message');
    assert(/catalogue n’est pas disponible/i.test(failed.itemCopy), 'community collection fallback copy missing');
    assert(failed.targetText === 'Catalogue indisponible' && failed.targetOptions === 1, 'community target fallback mismatch');

    await release();
    await navigate(cdp, 'community.html?state-proof=recovered');
    const recovered = await waitFor(cdp, `(() => {
      const boxes=document.querySelectorAll('#collection-items input[type=checkbox]');
      const target=document.querySelector('#submission-target');
      return boxes.length===3 && target?.options?.length===4
        ? {boxes:boxes.length,targetOptions:target.options.length,firstTarget:target.options[1]?.textContent||''}
        : null;
    })()`, 'community catalog recovered');
    return {failed, recovered};
  });

  await runCheck('community-remote-fail-closed', async () => {
    await navigate(cdp, 'community.html?state-proof=remote');
    const remote = await waitFor(cdp, `(() => {
      const panel=document.querySelector('#community-remote');
      const status=document.querySelector('#community-remote-status');
      const login=document.querySelector('#community-login');
      const submit=document.querySelector('#community-submit-remote');
      const result=document.querySelector('#community-remote-result');
      if (!panel || !status || !login || !submit || !result) return null;
      if (panel.dataset.remoteState==='checking') return null;
      return {
        state:panel.dataset.remoteState,
        status:status.textContent.trim(),
        loginDisabled:login.getAttribute('aria-disabled'),
        submitDisabled:submit.disabled,
        result:result.textContent.trim(),
        storedDraft:localStorage.getItem('nova-forge:community:submission:v1')
      };
    })()`, 'community remote fail-closed');

    assert(remote.state === 'unavailable', 'remote community state must stay unavailable without backend');
    assert(remote.status === 'Service non provisionné', 'remote community unavailable label mismatch');
    assert(remote.loginDisabled === 'true', 'remote login must stay disabled without backend');
    assert(remote.submitDisabled === true, 'remote submit must stay disabled without backend');
    assert(/Aucun contenu n’est envoyé en ligne/i.test(remote.result), 'remote fail-closed copy missing');
    return remote;
  });

  cdp.close();

  console.log(JSON.stringify({
    marker: failures.length ? 'FAIL_TARGETED_CATALOG_COMMUNITY_STATES' : 'PASS_TARGETED_CATALOG_COMMUNITY_STATES',
    checks,
    failures
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    marker: 'FAIL_TARGETED_CATALOG_COMMUNITY_STATES',
    fatal: error.message,
    chromeStderr,
    failures
  }, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT, {recursive: true, force: true});
}
