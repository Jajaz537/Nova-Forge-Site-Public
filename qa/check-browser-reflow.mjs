import {spawn} from 'node:child_process';

const ORIGIN = process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT || 9222);
const widths = [320, 400, 768, 1440];
const pages = [
  'index.html',
  'catalog.html',
  'search.html',
  'creator-studio.html',
  'community.html',
  'profiles.html',
  'ecosystem.html',
  'documentation.html',
  'security.html',
  'verify.html',
  'downloads.html',
  'project.html',
  'project-ember-textures.html',
  'project-balanced-latency-pack.html',
  'project-forge-night-experience.html',
  '404.html',
  'games/index.html'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const failures = [];
const results = [];

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
        const listeners = this.listeners.get(message.method);
        if (!listeners) return;
        for (const listener of [...listeners]) listener(message.params);
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
        if (!set) return;
        set.delete(listener);
        if (!set.size) this.listeners.delete(method);
      };
      if (!this.listeners.has(method)) this.listeners.set(method, new Set());
      this.listeners.get(method).add(listener);
    });
  }

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(listener);
    return () => this.listeners.get(method)?.delete(listener);
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
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  }
  return result.result?.value;
}

async function navigate(cdp, url) {
  const loaded = cdp.once('Page.loadEventFired', 12000);
  const navigation = await cdp.send('Page.navigate', {url});
  if (navigation.errorText) throw new Error('navigation failed: ' + navigation.errorText);
  await loaded;
  await sleep(220);
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
  '--user-data-dir=/tmp/modaryx-browser-proof-' + process.pid,
  'about:blank'
], {stdio: ['ignore', 'ignore', 'pipe']});

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

  let runtimeExceptions = [];
  const offException = cdp.on('Runtime.exceptionThrown', (params) => {
    runtimeExceptions.push(params?.exceptionDetails?.text || 'runtime exception');
  });

  for (const width of widths) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height: width <= 400 ? 900 : 1000,
      deviceScaleFactor: 1,
      mobile: width <= 400,
      screenWidth: width,
      screenHeight: width <= 400 ? 900 : 1000
    });

    for (const page of pages) {
      runtimeExceptions = [];
      const url = ORIGIN.replace(/\/$/, '') + '/' + page;
      try {
        await navigate(cdp, url);
        const metrics = await evaluate(cdp, `(() => {
          const de = document.documentElement;
          const body = document.body;
          const h1 = document.querySelector('h1');
          const main = document.querySelector('#main');
          const footer = document.querySelector('.site-footer');
          const h1Rect = h1?.getBoundingClientRect();
          return {
            innerWidth: window.innerWidth,
            documentWidth: Math.max(de.scrollWidth, body?.scrollWidth || 0),
            overflowPx: Math.max(0, Math.max(de.scrollWidth, body?.scrollWidth || 0) - de.clientWidth),
            readyState: document.readyState,
            h1Visible: Boolean(h1Rect && h1Rect.width > 0 && h1Rect.height > 0),
            hasMain: Boolean(main),
            hasFooter: Boolean(footer)
          };
        })()`);

        if (metrics.readyState !== 'complete') failures.push(page + ' @' + width + ': document not complete');
        if (metrics.innerWidth !== width) failures.push(page + ' @' + width + ': viewport mismatch ' + metrics.innerWidth);
        if (metrics.overflowPx > 1) failures.push(page + ' @' + width + ': horizontal overflow ' + metrics.overflowPx + 'px');
        if (!metrics.h1Visible) failures.push(page + ' @' + width + ': h1 not visible');
        if (!metrics.hasMain) failures.push(page + ' @' + width + ': main missing');
        if (!metrics.hasFooter) failures.push(page + ' @' + width + ': footer missing');
        if (runtimeExceptions.length) failures.push(page + ' @' + width + ': runtime exceptions: ' + runtimeExceptions.join(' | '));

        let mobileMenu = null;
        if (width <= 400) {
          mobileMenu = await evaluate(cdp, `(async () => {
            const button = document.querySelector('[data-menu-button], .nav-toggle');
            if (!button) return {present:false};
            button.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const controlled = button.getAttribute('aria-controls');
            const nav = controlled ? document.getElementById(controlled) : document.querySelector('[data-primary-nav], .topbar nav, .nova-nav');
            const rect = nav?.getBoundingClientRect();
            const visible = Boolean(nav && getComputedStyle(nav).display !== 'none' && rect && rect.height > 0);
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.click();
            return {present:true, expanded, visible};
          })()`, true);
          if (mobileMenu?.present && (!mobileMenu.expanded || !mobileMenu.visible)) {
            failures.push(page + ' @' + width + ': mobile menu did not expose visible expanded navigation');
          }
        }

        results.push({page, width, ...metrics, mobileMenu});
      } catch (error) {
        failures.push(page + ' @' + width + ': ' + error.message);
      }
    }
  }

  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 400,
    height: 900,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 400,
    screenHeight: 900
  });
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{name: 'prefers-reduced-motion', value: 'reduce'}]
  });
  await navigate(cdp, ORIGIN.replace(/\/$/, '') + '/index.html');
  const reducedMotion = await evaluate(cdp, `(() => {
    const art = document.querySelector('.modaryx-realm-art');
    const style = art ? getComputedStyle(art) : null;
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      animationName: style?.animationName || null
    };
  })()`);
  if (!reducedMotion.matches) failures.push('reduced-motion media emulation did not apply');
  if (reducedMotion.animationName !== 'none') failures.push('living-world hero animation remains active under reduced motion');

  offException();
  cdp.close();

  console.log(JSON.stringify({
    marker: failures.length ? 'FAIL_TARGETED_BROWSER_REFLOW_MICROPROOF' : 'PASS_TARGETED_BROWSER_REFLOW_MICROPROOF',
    origin: ORIGIN,
    pages: pages.length,
    widths,
    navigations: results.length,
    reducedMotion,
    failures,
    results
  }, null, 2));

  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    marker: 'FAIL_TARGETED_BROWSER_REFLOW_MICROPROOF',
    fatal: error.message,
    chromeStderr
  }, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
}
