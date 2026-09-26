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
      const companions = document.querySelectorAll('[data-world-visual]');
      const environment = document.querySelector('[data-world-environment], .modaryx-realm-art');
      const approvedHero = environment && (environment.currentSrc || environment.src || '').includes('/assets/modaryx-wolf-dragon-hero.webp');
      return root.dataset.worldVisualGrowth === 'awaiting-assets'
        && !layers
        && companions.length === 0
        && approvedHero
        && environment.complete
        && environment.naturalWidth > 0
        && root.dataset.realitySync === 'active';
    })()`,
    spec.name + ' approved composite living world',
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
    const environmentStyle = environment ? getComputedStyle(environment) : null;
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
      environmentAnimation: environmentStyle?.animationName || null,
      environmentTransition: environmentStyle?.transitionDuration || null,
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

  if (!spec.reduced) {
    const frames = path.join(OUT, spec.name + '-frames');
    fs.mkdirSync(frames, {recursive: true});
    const frame = async (index) => {
      const image = await cdp.send('Page.captureScreenshot', {
        format: 'png', fromSurface: true, captureBeyondViewport: false
      });
      fs.writeFileSync(path.join(frames, String(index).padStart(2, '0') + '.png'), Buffer.from(image.data, 'base64'));
    };
    await frame(0);
    await sleep(600);
    await frame(1);
    await evaluate(cdp, "scrollTo({top: Math.min(300, document.documentElement.scrollHeight - innerHeight), behavior: 'instant'})");
    await sleep(350);
    await frame(2);
    await evaluate(cdp, "scrollTo({top: 0, behavior: 'instant'})");
    await evaluate(cdp, "document.querySelector('[data-menu-button]')?.click()");
    await sleep(250);
    await frame(3);
    const interaction = await evaluate(cdp, `(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      menuExpanded: document.querySelector('[data-menu-button]')?.getAttribute('aria-expanded'),
      menuVisible: getComputedStyle(document.querySelector('[data-menu-button]')).display !== 'none',
      primaryHref: document.querySelector('.modaryx-realm-hero .button.primary')?.getAttribute('href')
    }))()`);
    await evaluate(cdp, "document.querySelector('[data-menu-button]')?.click()");
    await evaluate(cdp, "scrollTo({top: document.documentElement.scrollHeight - innerHeight, behavior: 'instant'})");
    await sleep(350);
    await frame(4);
    interaction.footerSeen = await evaluate(cdp, "document.querySelector('.site-footer')?.getBoundingClientRect().top < innerHeight");
    await evaluate(cdp, "scrollTo({top: 0, behavior: 'instant'})");
    await frame(5);
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '1',
      '-i', path.join(frames, '%02d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      path.join(OUT, spec.name + '.mp4')]);
    state.interaction = interaction;
    state.videoFrames = 6;
    state.video = spec.name + '.mp4';
  }

  assert(state.worldVisualGrowth === 'awaiting-assets', spec.name + ': visual growth must remain awaiting human-approved layered art');
  assert(state.realitySync === 'active', spec.name + ': reality sync not active');
  assert(state.companions.length === 0, spec.name + ': unapproved companion layers must not activate');
  assert(state.environment.complete && state.environment.naturalWidth > 0, spec.name + ': approved composite hero not loaded');
  assert(state.environment.src.includes('/assets/modaryx-wolf-dragon-hero.webp'), spec.name + ': approved Loup/Dragon hero was replaced');
  assert(Boolean(state.localSeason) && Boolean(state.localDaypart), spec.name + ': local season/daypart missing');
  assert(Boolean(state.geometry.hero) && state.geometry.layers === null, spec.name + ': unexpected layered visual geometry');

  if (spec.reduced) {
    assert(state.reducedMotion === true, spec.name + ': reduced-motion emulation not active');
    assert(state.environmentAnimation === 'none', spec.name + ': approved hero animation still active under reduced motion');
    assert(state.environmentTransition === '0s', spec.name + ': approved hero transition still active under reduced motion');
  }
}

async function captureCatalog(cdp, spec) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: spec.width, height: spec.height, deviceScaleFactor: 1, mobile: spec.mobile
  });
  const loaded = cdp.once('Page.loadEventFired', 15000);
  const nav = await cdp.send('Page.navigate', {url: ORIGIN + '/catalog.html?preview-visual-proof=' + spec.name});
  if (nav.errorText) throw new Error(spec.name + ' navigation failed: ' + nav.errorText);
  await loaded;
  await waitFor(cdp, "document.querySelectorAll('.catalog-card').length === 3", spec.name + ' catalogue ready');
  await sleep(400);
  const prefix = 'catalog-' + spec.name;
  const frameDir = path.join(OUT, prefix + '-frames');
  fs.mkdirSync(frameDir, {recursive: true});
  const frame = async (number) => {
    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png', fromSurface: true, captureBeyondViewport: false
    });
    const bytes = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(path.join(frameDir, String(number).padStart(2, '0') + '.png'), bytes);
    if (number === 0) fs.writeFileSync(path.join(OUT, prefix + '.png'), bytes);
  };
  const initial = await evaluate(cdp, `(() => {
    const panel = document.querySelector('.catalog-contract');
    const spans = [...panel.querySelectorAll('span')];
    const css = getComputedStyle(panel);
    return {
      href: location.href, viewport: {width: innerWidth, height: innerHeight},
      scrollWidth: document.documentElement.scrollWidth,
      panelColumns: css.gridTemplateColumns, panelWidth: panel.getBoundingClientRect().width,
      statementWidths: spans.map(x => Math.round(x.getBoundingClientRect().width)),
      image: getComputedStyle(document.querySelector('.catalog-hero')).backgroundImage,
      cardCount: document.querySelectorAll('.catalog-card:not([hidden])').length
    };
  })()`);
  await frame(0);
  await evaluate(cdp, "document.querySelector('#catalog-kind').value='pack'; document.querySelector('#catalog-kind').dispatchEvent(new Event('change',{bubbles:true}))");
  await sleep(200);
  await frame(1);
  const filterCount = await evaluate(cdp, "document.querySelectorAll('.catalog-card:not([hidden])').length");
  await evaluate(cdp, "document.querySelector('#catalog-reset').click()");
  await evaluate(cdp, "document.querySelector('.nav-toggle')?.click()");
  await sleep(200);
  await frame(2);
  const menuExpanded = await evaluate(cdp, "document.querySelector('.nav-toggle')?.getAttribute('aria-expanded')");
  await evaluate(cdp, "document.querySelector('.nav-toggle')?.click()");
  await evaluate(cdp, "scrollTo({top: document.documentElement.scrollHeight - innerHeight, behavior: 'instant'})");
  await sleep(250);
  await frame(3);
  const footerSeen = await evaluate(cdp, "document.querySelector('.site-footer')?.getBoundingClientRect().top < innerHeight");
  await evaluate(cdp, "scrollTo({top: 0, behavior: 'instant'})");
  await frame(4);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '1',
    '-i', path.join(frameDir, '%02d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    path.join(OUT, prefix + '.mp4')]);
  observations[prefix] = {...initial, filterCount, menuExpanded, footerSeen, videoFrames: 5};
  assert(initial.scrollWidth <= initial.viewport.width, prefix + ': horizontal overflow');
  assert(initial.cardCount === 3 && filterCount === 1, prefix + ': catalogue filter mismatch');
  assert(initial.statementWidths.every(w => w > 180), prefix + ': contract statements too narrow');
  assert(footerSeen, prefix + ': footer not reached');
  if (spec.mobile) assert(menuExpanded === 'true', prefix + ': mobile menu failed to open');
  assert(Boolean(TARGET_SHA), prefix + ': target SHA absent');
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
    {name: 'mobile-small', width: 320, height: 640, mobile: true, reduced: false},
    {name: 'mobile-large', width: 430, height: 932, mobile: true, reduced: false},
    {name: 'mobile-landscape', width: 844, height: 390, mobile: true, reduced: false},
    {name: 'reduced-motion', width: 1440, height: 1000, mobile: false, reduced: true}
  ]) {
    await captureCase(cdp, spec);
  }
  for (const spec of [
    {name: 'desktop', width: 1440, height: 1000, mobile: false},
    {name: 'mobile-small', width: 320, height: 640, mobile: true},
    {name: 'mobile', width: 390, height: 844, mobile: true},
    {name: 'mobile-large', width: 430, height: 932, mobile: true},
    {name: 'mobile-landscape', width: 844, height: 390, mobile: true}
  ]) {
    await captureCatalog(cdp, spec);
  }

  cdp.close();
  const result = {
    marker: failures.length ? 'FAIL_TARGETED_PREVIEW_VISUAL_CAPTURE' : 'PASS_TARGETED_PREVIEW_VISUAL_CAPTURE',
    origin: ORIGIN,
    targetSha: TARGET_SHA,
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
  const artifactFailure = {
    marker: 'FAIL_TARGETED_PREVIEW_VISUAL_CAPTURE',
    fatal: 'capture failed; inspect the workflow log for diagnostic details',
    failures: ['capture-failed']
  };
  fs.writeFileSync(path.join(OUT, 'visual-capture.json'), JSON.stringify(artifactFailure, null, 2) + '\n');
  console.error(JSON.stringify(result, null, 2));
  process.exitCode = 1;
} finally {
  const waitForChromeClose = () => new Promise((resolve) => {
    if (chrome.exitCode !== null || chrome.signalCode !== null) return resolve();
    chrome.once('close', resolve);
    setTimeout(resolve, 1200);
  });
  if (chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill('SIGTERM');
    await waitForChromeClose();
  }
  if (chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill('SIGKILL');
    await waitForChromeClose();
  }
  fs.rmSync(TEMP_ROOT, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
}
