import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const ORIGIN = process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-real-file-proof-'));
const DOWNLOADS = path.join(ROOT, 'downloads');
const INPUTS = path.join(ROOT, 'inputs');
const CHROME_PROFILE = path.join(ROOT, 'chrome-profile');
const failures = [];
const checks = [];

fs.mkdirSync(DOWNLOADS, {recursive: true});
fs.mkdirSync(INPUTS, {recursive: true});
fs.mkdirSync(CHROME_PROFILE, {recursive: true});

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

async function waitForDevToolsPort(timeoutMs = 12000) {
  const file = path.join(CHROME_PROFILE, 'DevToolsActivePort');
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
  once(method, timeoutMs = 10000) {
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

async function navigate(cdp, relative) {
  const loaded = cdp.once('Page.loadEventFired', 12000);
  const navigation = await cdp.send('Page.navigate', {url: ORIGIN.replace(/\/$/, '') + '/' + relative});
  if (navigation.errorText) throw new Error('navigation failed: ' + navigation.errorText);
  await loaded;
  await sleep(180);
}

async function waitFor(cdp, expression, label, timeoutMs = 9000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const value = await evaluate(cdp, expression, true);
    if (value) return value;
    await sleep(100);
  }
  throw new Error('timeout: ' + label);
}

async function setFileInput(cdp, selector, filePath) {
  const {root} = await cdp.send('DOM.getDocument', {depth: 1, pierce: true});
  const {nodeId} = await cdp.send('DOM.querySelector', {nodeId: root.nodeId, selector});
  if (!nodeId) throw new Error('file input not found: ' + selector);
  await cdp.send('DOM.setFileInputFiles', {nodeId, files: [filePath]});
  await evaluate(cdp, `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    input?.dispatchEvent(new Event('change',{bubbles:true}));
    return Boolean(input?.files?.length);
  })()`);
}

async function clearDownloads() {
  for (const name of fs.readdirSync(DOWNLOADS)) fs.rmSync(path.join(DOWNLOADS, name), {force: true, recursive: true});
}

async function waitForDownload(filename, timeoutMs = 9000) {
  const target = path.join(DOWNLOADS, filename);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(target) && !fs.existsSync(target + '.crdownload')) {
      const stat = fs.statSync(target);
      if (stat.size > 0) return target;
    }
    await sleep(120);
  }
  throw new Error('download not produced: ' + filename + '; files=' + fs.readdirSync(DOWNLOADS).join(','));
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
  '--user-data-dir=' + CHROME_PROFILE,
  'about:blank'
], {stdio: ['ignore', 'ignore', 'pipe']});

let chromeStderr = '';
chrome.stderr.on('data', (chunk) => {
  chromeStderr += String(chunk);
  if (chromeStderr.length > 12000) chromeStderr = chromeStderr.slice(-12000);
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
  await cdp.send('DOM.enable');

  try {
    await cdp.send('Browser.setDownloadBehavior', {behavior: 'allow', downloadPath: DOWNLOADS, eventsEnabled: true});
  } catch {
    await cdp.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: DOWNLOADS});
  }

  await runCheck('verify-real-file-sha256', async () => {
    const payload = 'MODARYX real file proof 2026-09-19\n';
    const inputPath = path.join(INPUTS, 'verify-payload.txt');
    fs.writeFileSync(inputPath, payload);
    const expected = crypto.createHash('sha256').update(payload).digest('hex');

    await navigate(cdp, 'verify.html#sha256=' + expected);
    await waitFor(cdp, `(() => document.querySelector('#expected-sha256')?.value?.length===64)()`, 'verify hash prefilled');
    await setFileInput(cdp, '#verify-file', inputPath);
    await evaluate(cdp, `document.querySelector('[data-verify-file]')?.click(); true`);
    const result = await waitFor(cdp, `(() => {
      const h=document.querySelector('[data-verify-result] strong')?.textContent||'';
      const p=document.querySelector('[data-verify-result] p')?.textContent||'';
      return h==='Correspondance exacte' ? {heading:h,copy:p,file:document.querySelector('#verify-file-name')?.textContent||''} : null;
    })()`, 'verify exact match');
    assert(result.file.includes('verify-payload.txt'), 'verify file name not exposed');
    assert(result.copy.includes(expected), 'verify output missing expected digest');
    return {filename:'verify-payload.txt',sha256:expected};
  });

  await runCheck('community-collection-export-import-file', async () => {
    await clearDownloads();
    await navigate(cdp, 'community.html');
    await waitFor(cdp, `(() => document.querySelectorAll('#collection-items input[type=checkbox]').length>0)()`, 'community collection hydrated');

    await evaluate(cdp, `(() => {
      const id=document.querySelector('#collection-id');
      const name=document.querySelector('#collection-name');
      const desc=document.querySelector('#collection-description');
      id.value='vf-file-collection';
      name.value='VF File Collection';
      desc.value='Import export file proof';
      for (const el of [id,name,desc]) el.dispatchEvent(new Event('input',{bubbles:true}));
      const first=document.querySelector('#collection-items input[type=checkbox]');
      first.checked=true;
      first.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('#collection-export').click();
      return true;
    })()`);

    const filename='vf-file-collection.nova-collection.json';
    const downloaded=await waitForDownload(filename);
    const parsed=JSON.parse(fs.readFileSync(downloaded,'utf8'));
    assert(parsed.id==='vf-file-collection', 'exported collection id mismatch');
    assert(parsed.syncState==='local-only' && parsed.visibility==='private-local', 'exported collection contract drifted');
    assert(parsed.ownerProfileId===null && parsed.itemIds.length===1, 'exported collection identity/items drifted');

    await evaluate(cdp, `document.querySelector('#collection-clear')?.click(); true`);
    await setFileInput(cdp, '#collection-import-file', downloaded);
    await evaluate(cdp, `document.querySelector('#collection-import')?.click(); true`);
    const restored=await waitFor(cdp, `(() => {
      const status=document.querySelector('#collection-status')?.textContent||'';
      const checked=[...document.querySelectorAll('#collection-items input[type=checkbox]')].filter(x=>x.checked).length;
      return document.querySelector('#collection-id')?.value==='vf-file-collection' && checked===1 && /importée en mémoire/i.test(status)
        ? {status,checked,name:document.querySelector('#collection-name')?.value||''}
        : null;
    })()`, 'collection imported from real file');
    return {filename,restored};
  });

  await runCheck('community-submission-export-import-file', async () => {
    await clearDownloads();
    await navigate(cdp, 'community.html');
    await waitFor(cdp, `(() => document.querySelector('#submission-target')?.options.length>1)()`, 'community submission targets');

    await evaluate(cdp, `(() => {
      const id=document.querySelector('#submission-id');
      const kind=document.querySelector('#submission-kind');
      const target=document.querySelector('#submission-target');
      const heading=document.querySelector('#submission-heading');
      const body=document.querySelector('#submission-body');
      const rating=document.querySelector('#submission-rating');
      id.value='vf-file-review';
      kind.value='review';
      kind.dispatchEvent(new Event('change',{bubbles:true}));
      target.value=target.options[1].value;
      heading.value='Avis fichier VF';
      body.value='Preuve import export via vrai fichier.';
      rating.value='5';
      for (const el of [id,target,heading,body,rating]) el.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('#submission-export').click();
      return true;
    })()`);

    const filename='vf-file-review.nova-community-draft.json';
    const downloaded=await waitForDownload(filename);
    const parsed=JSON.parse(fs.readFileSync(downloaded,'utf8'));
    assert(parsed.id==='vf-file-review' && parsed.kind==='review' && parsed.rating===5, 'exported submission mismatch');
    assert(parsed.syncState==='local-only' && parsed.publicationState==='local-draft' && parsed.moderationState==='not-submitted', 'submission remote-state guard drifted');

    await evaluate(cdp, `document.querySelector('#submission-clear')?.click(); true`);
    await setFileInput(cdp, '#submission-import-file', downloaded);
    await evaluate(cdp, `document.querySelector('#submission-import')?.click(); true`);
    const restored=await waitFor(cdp, `(() => {
      const status=document.querySelector('#submission-status')?.textContent||'';
      return document.querySelector('#submission-id')?.value==='vf-file-review' && /importé en mémoire/i.test(status)
        ? {status,kind:document.querySelector('#submission-kind')?.value||'',rating:document.querySelector('#submission-rating')?.value||''}
        : null;
    })()`, 'submission imported from real file');
    return {filename,restored};
  });

  await runCheck('creator-studio-export-import-file', async () => {
    await clearDownloads();
    await navigate(cdp, 'creator-studio.html');
    await waitFor(cdp, `(() => !/non chargé/i.test(document.querySelector('#schema-status')?.textContent || ''))()`, 'studio schema loaded');

    await evaluate(cdp, `(() => {
      const values={
        'content-id':'vf-file-studio',
        'content-version':'1.0.0',
        'content-name':'VF File Studio',
        'game-id':'demo-game',
        'game-name':'Demo Game',
        'creator-id':'modaryx-team',
        'creator-name':'MODARYX MODS',
        'license':'All Rights Reserved'
      };
      for (const [id,value] of Object.entries(values)) {
        const el=document.getElementById(id);
        el.value=value;
        el.dispatchEvent(new Event('input',{bubbles:true}));
      }
      document.querySelector('#download-draft').click();
      return true;
    })()`);

    const filename='vf-file-studio.nova-manifest.json';
    const downloaded=await waitForDownload(filename);
    const parsed=JSON.parse(fs.readFileSync(downloaded,'utf8'));
    assert(parsed.content?.id==='vf-file-studio', 'studio export id mismatch');
    assert(parsed.distribution?.state==='locked' && parsed.distribution?.downloadable===false, 'studio export distribution guard drifted');
    assert(parsed.releaseReceipt===null, 'studio export releaseReceipt must be null');

    await evaluate(cdp, `document.querySelector('#clear-draft')?.click(); true`);
    await setFileInput(cdp, '#import-draft-file', downloaded);
    await evaluate(cdp, `document.querySelector('#import-draft')?.click(); true`);
    const restored=await waitFor(cdp, `(() => {
      const status=document.querySelector('#studio-status')?.textContent||'';
      return document.querySelector('#content-id')?.value==='vf-file-studio' && /importé localement et validé/i.test(status)
        ? {status,name:document.querySelector('#content-name')?.value||''}
        : null;
    })()`, 'studio imported from real file');
    return {filename,restored};
  });

  cdp.close();

  console.log(JSON.stringify({
    marker: failures.length ? 'FAIL_TARGETED_REAL_FILE_BROWSER_PROOF' : 'PASS_TARGETED_REAL_FILE_BROWSER_PROOF',
    origin: ORIGIN,
    checks,
    failures
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    marker: 'FAIL_TARGETED_REAL_FILE_BROWSER_PROOF',
    fatal: error.message,
    chromeStderr
  }, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(ROOT, {recursive: true, force: true});
}
