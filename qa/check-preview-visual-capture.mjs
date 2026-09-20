import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = (process.env.MODARYX_VISUAL_ORIGIN || '').replace(/\/$/, '');
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const OUT = process.env.MODARYX_VISUAL_OUT || path.join(process.cwd(), 'visual-proof-output');
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

async function captureCase(cdp, spec) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: spec.width,
    height: spec.height,
    deviceScaleFactor: 1,
    mobile: spec.mobile
  });
  await cdp.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{name: 'prefers-reduced-motion', value: spec.reduced ? 'reduce' : 'no-preference'}]
  });

  const loaded = cdp.once('Page.loadEventFired', 15000);
  const nav = await cdp.send('Page.navigate', {
    url: ORIGIN + '/index.html?preview-visual-proof=' + encodeURIComponent(spec.name)
  });
  if (nav.errorText) throw new Error(spec.name + ' navigation failed: ' + nav.errorText);
  await loaded;

  await waitFor(
    cdp,
    `(() => {
      const root = document.documentElement;
      const layers = document.querySelector('[data-world-visual-layers]');
      const ready = [...document.querySelectorAll('[data-world-visual]')]
        .filter((node) => node.dataset.visualReady === 'true' && node.complete && node.naturalWidth > 0);
      return root.dataset.worldVisualGrowth === 'active' && layers && ready.length === 2 && root.dataset.realitySync === 'active';
    })()`,
    spec.name + ' integrated living world',
    15000
  );

  await sleep(650);

  const state = await evaluate(cdp, `(() => {
    const root = document.documentElement;
    const hero = document.querySelector('.modaryx-realm-hero');
    const layers = document.querySelector('[data-world-visual-layers]');
    const environment = document.querySelector('[data-world-environment], .modaryx-realm-art');
    const companions = [...document.querySelectorAll('[data-world-visual]')].map((node) => ({
      id: node.dataset.worldVisual || null,
      stage: node.dataset.growthStage || null,
      ready: node.dataset.visualReady === 'true',
      complete: node.complete,
      naturalWidth: node.naturalWidth,
      naturalHeight: node.naturalHeight,
      src: node.currentSrc || node.src
    }));
    const heroRect = hero?.getBoundingClientRect();
    const layerRect = layers?.getBoundingClientRect();
    const layerStyle = layers ? getComputedStyle(layers) : null;
    const weatherLayer = document.querySelector('[data-real-weather-layer]');
    const weatherStyle = weatherLayer ? getComputedStyle(weatherLayer) : null;
    return {
      href: location.href,
      viewport: {width: innerWidth, height: innerHeight},
      readyState: document.readyState,
      worldVisualGrowth: root.dataset.worldVisualGrowth || null,
      worldPhase: root.dataset.worldPhase || null,
      wolfStage: root.dataset.worldWolfStage || null,
      dragonStage: root.dataset.worldDragonStage || null,
      realitySync: root.dataset.realitySync || null,
      realitySource: root.dataset.realitySource || null,
      localClimate: root.dataset.localClimate || null,
      localSeason: root.dataset.localSeason || null,
      localDaypart: root.dataset.localDaypart || null,
      localWeather: root.dataset.localWeather || null,
      localContext: document.querySelector('[data-real-world-context]')?.textContent?.trim() || '',
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      environment: {
        complete: Boolean(environment?.complete),
        naturalWidth: environment?.naturalWidth || 0,
        naturalHeight: environment?.naturalHeight || 0,
        src: environment?.currentSrc || environment?.src || ''
      },
      companions,
      geometry: {
        hero: heroRect ? {x: heroRect.x, y: heroRect.y, width: heroRect.width, height: heroRect.height} : null,
        layers: layerRect ? {x: layerRect.x, y: layerRect.y, width: layerRect.width, height: layerRect.height} : null
      },
      layerAnimation: layerStyle?.animationName || null,
      layerTransition: layerStyle?.transitionDuration || null,
      weatherAnimation: weatherStyle?.animationName || null,
      weatherTransition: weatherStyle?.transitionDuration || null
    };
  })()`);

  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false
  });
  fs.writeFileSync(path.join(OUT, spec.name + '.png'), Buffer.from(shot.data, 'base64'));
  observations[spec.name] = state;

  assert(state.worldVisualGrowth === 'active', spec.name + ': visual growth not active');
  assert(state.realitySync === 'active', spec.name + ': reality sync not active');
  assert(state.companions.length === 2, spec.name + ': expected two companion layers');
  assert(state.companions.every((item) => item.ready && item.complete && item.naturalWidth === 1600 && item.naturalHeight === 900),
    spec.name + ': companion layer dimensions/readiness drifted');
  assert(state.environment.complete && state.environment.naturalWidth > 0, spec.name + ': environment not loaded');
  assert(Boolean(state.localSeason) && Boolean(state.localDaypart), spec.name + ': local season/daypart missing');
  assert(Boolean(state.geometry.hero) && Boolean(state.geometry.layers), spec.name + ': integrated hero/layers geometry missing');

  if (spec.reduced) {
    assert(state.reducedMotion === true, spec.name + ': reduced-motion emulation not active');
    assert(state.layerAnimation === 'none', spec.name + ': living-world animation still active under reduced motion');
    assert(state.layerTransition === '0s', spec.name + ': living-world transition still active under reduced motion');
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
  const port = await waitForDevToolsPort();
  await waitForJson('http://127.0.0.1:' + port + '/json/version');
  const tabResponse = await fetch(
    'http://127.0.0.1:' + port + '/json/new?' + encodeURIComponent('about:blank'),
    {method: 'PUT'}
  );
  if (!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP ' + tabResponse.status);
  const tab = await tabResponse.json();
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for (const spec of [
    {name: 'desktop', width: 1440, height: 1000, mobile: false, reduced: false},
    {name: 'mobile', width: 390, height: 844, mobile: true, reduced: false},
    {name: 'reduced-motion', width: 1440, height: 1000, mobile: false, reduced: true}
  ]) {
    await captureCase(cdp, spec);
  }

  cdp.close();
  const result = {
    marker: failures.length ? 'FAIL_TARGETED_PREVIEW_VISUAL_CAPTURE' : 'PASS_TARGETED_PREVIEW_VISUAL_CAPTURE',
    origin: ORIGIN,
    observations,
    failures
  };
  fs.writeFileSync(path.join(OUT, 'visual-capture.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  const result = {
    marker: 'FAIL_TARGETED_PREVIEW_VISUAL_CAPTURE',
    origin: ORIGIN,
    fatal: error.message,
    chromeStderr,
    observations,
    failures
  };
  fs.writeFileSync(path.join(OUT, 'visual-capture.json'), JSON.stringify(result, null, 2) + '\n');
  console.error(JSON.stringify(result, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT, {recursive: true, force: true});
}
