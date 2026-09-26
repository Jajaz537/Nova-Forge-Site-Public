import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = (process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173').replace(/\/$/, '');
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const OUT = process.env.MODARYX_PROFILES_OUT || path.join(process.cwd(), 'profiles-state-proof-output');
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-profiles-proof-'));
const USER_DATA_DIR = path.join(TEMP_ROOT, 'chrome-profile');
const failures = [];
const observations = {};

fs.mkdirSync(OUT, {recursive: true});

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

async function navigate(cdp, url) {
  const loaded = cdp.once('Page.loadEventFired', 12000);
  const nav = await cdp.send('Page.navigate', {url});
  if (nav.errorText) throw new Error('navigation failed: ' + nav.errorText);
  await loaded;
  await sleep(150);
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

async function capture(cdp, filename) {
  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false
  });
  fs.writeFileSync(path.join(OUT, filename), Buffer.from(shot.data, 'base64'));
}

async function runCase(cdp, spec) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: spec.width,
    height: spec.height,
    deviceScaleFactor: 1,
    mobile: spec.mobile
  });
  await navigate(cdp, ORIGIN + '/profiles.html?profiles-proof=' + encodeURIComponent(spec.name));

  const state = await waitFor(cdp, `(() => {
    const status=document.querySelector('#passkey-status');
    const api=document.querySelector('#webauthn-api');
    const platform=document.querySelector('#platform-authenticator');
    const conditional=document.querySelector('#conditional-mediation');
    const note=document.querySelector('.profiles-note');
    const account=document.querySelector('#account-console');
    const accountStatus=document.querySelector('#account-status');
    const accountCopy=document.querySelector('#account-status-copy');
    const login=document.querySelector('#account-login');
    const logout=document.querySelector('#account-logout');
    const fields=document.querySelector('#profile-editor-fields');
    const cards=[...document.querySelectorAll('.profiles-grid .profile-card')];
    const body=document.body;
    const root=document.documentElement;
    if (!status || !api || !platform || !conditional || !note || !account || !accountStatus || !accountCopy || !login || !logout || !fields) return null;
    if (status.textContent.trim()==='Non vérifié') return null;
    if (account.dataset.accountState==='checking') return null;
    return {
      status:status.textContent.trim(),
      api:api.textContent.trim(),
      platform:platform.textContent.trim(),
      conditional:conditional.textContent.trim(),
      note:note.textContent.trim(),
      accountState:account.dataset.accountState,
      accountStatus:accountStatus.textContent.trim(),
      accountCopy:accountCopy.textContent.trim(),
      loginDisabled:login.getAttribute('aria-disabled'),
      loginHidden:login.hidden,
      logoutHidden:logout.hidden,
      editorDisabled:fields.disabled,
      cardCount:cards.length,
      overflow:Math.max(body.scrollWidth,root.scrollWidth)-root.clientWidth,
      h1:document.querySelector('h1')?.textContent?.trim()||'',
      boundaries:[...document.querySelectorAll('[aria-labelledby="boundaries-title"] .profile-card h3')].map(x=>x.textContent.trim()),
      webauthnCards:[...document.querySelectorAll('[aria-labelledby="webauthn-title"] .profile-card h3')].map(x=>x.textContent.trim())
    };
  })()`, spec.name + ' profile/account detection');

  assert(state.h1 === 'Votre identité MODARYX, sans exposer vos moyens de connexion.', spec.name + ': profile title mismatch');
  assert(state.cardCount >= 8, spec.name + ': profile cards missing');
  assert(state.boundaries.length === 5, spec.name + ': account boundary cards mismatch');
  assert(state.webauthnCards.length === 3, spec.name + ': WebAuthn cards mismatch');
  assert(state.overflow <= 1, spec.name + ': horizontal overflow ' + state.overflow);
  assert(
    ['WebAuthn indisponible','Détection locale terminée','Détection partielle — résultat inconnu'].includes(state.status),
    spec.name + ': unexpected WebAuthn status ' + state.status
  );
  assert(/Ce résultat ne prouve l’existence d’aucune passkey|Non testable sans WebAuthn/.test(state.platform), spec.name + ': platform caution missing');
  assert(/Aucun flux de connexion n’est lancé|Non testable sans WebAuthn/.test(state.conditional), spec.name + ': conditional caution missing');
  assert(/ne prouvent pas qu’un compte existe/i.test(state.note), spec.name + ': account limitation note missing');

  assert(state.accountState === 'unavailable', spec.name + ': static proof must stay unavailable, got ' + state.accountState);
  assert(state.accountStatus === 'Service non provisionné', spec.name + ': unavailable account status mismatch');
  assert(/ne simule aucune session/i.test(state.accountCopy), spec.name + ': fail-closed account copy missing');
  assert(state.loginDisabled === 'true', spec.name + ': login must stay disabled without backend');
  assert(state.loginHidden === false, spec.name + ': login action should remain visible');
  assert(state.logoutHidden === true, spec.name + ': logout must stay hidden without session');
  assert(state.editorDisabled === true, spec.name + ': editor must stay disabled without backend');

  const publicProfile = await evaluate(cdp, `(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (url === '/api/v1/profiles/proof.creator') {
        return new Response(JSON.stringify({
          schemaVersion:1,
          profileId:'profile:proofcreator000000000000000000000000',
          handle:'proof.creator',
          displayName:'Proof Creator',
          bio:'Profil public de preuve navigateur.',
          visibility:'public',
          creator:{isCreator:true,displayLabel:'Créateur vérifié'},
          links:[{label:'Portfolio HTTPS',url:'https://example.com/portfolio'}],
          collections:[],
          createdAt:'2026-09-21T00:00:00.000Z',
          updatedAt:'2026-09-21T00:00:00.000Z'
        }), {status:200, headers:{'content-type':'application/json'}});
      }
      if (url === '/api/v1/profiles/private.user') {
        return new Response(JSON.stringify({error:'profile-not-found'}), {status:404, headers:{'content-type':'application/json'}});
      }
      return originalFetch(input, init);
    };
    const input = document.querySelector('#public-profile-handle');
    const form = document.querySelector('#public-profile-search');
    input.value = 'proof.creator';
    form.requestSubmit();
    return true;
  })()`, true);
  assert(publicProfile === true, spec.name + ': public profile mock setup failed');

  const publicState = await waitFor(cdp, `(() => {
    const root=document.querySelector('#public-profile');
    const card=document.querySelector('#public-profile-card');
    if (!root || !card || root.dataset.publicProfileState !== 'found' || card.hidden) return null;
    return {
      state:root.dataset.publicProfileState,
      status:document.querySelector('#public-profile-state')?.textContent?.trim()||'',
      handle:document.querySelector('#public-profile-handle-label')?.textContent?.trim()||'',
      name:document.querySelector('#public-profile-display-name')?.textContent?.trim()||'',
      bio:document.querySelector('#public-profile-bio')?.textContent?.trim()||'',
      creatorHidden:document.querySelector('#public-profile-creator')?.hidden,
      creator:document.querySelector('#public-profile-creator')?.textContent?.trim()||'',
      links:[...document.querySelectorAll('#public-profile-links a')].map(a=>({text:a.textContent.trim(),href:a.href,rel:a.rel}))
    };
  })()`, spec.name + ' public profile rendering');

  assert(publicState.state === 'found', spec.name + ': public profile state mismatch');
  assert(publicState.status === 'Profil public', spec.name + ': public profile status mismatch');
  assert(publicState.handle === '@proof.creator', spec.name + ': public handle mismatch');
  assert(publicState.name === 'Proof Creator', spec.name + ': public display name mismatch');
  assert(publicState.bio === 'Profil public de preuve navigateur.', spec.name + ': public bio mismatch');
  assert(publicState.creatorHidden === false && publicState.creator === 'Créateur vérifié', spec.name + ': creator badge mismatch');
  assert(publicState.links.length === 1, spec.name + ': public HTTPS link missing');
  assert(publicState.links[0].href === 'https://example.com/portfolio', spec.name + ': public link href mismatch');
  assert(/noopener/.test(publicState.links[0].rel) && /noreferrer/.test(publicState.links[0].rel), spec.name + ': public link rel guard missing');

  await evaluate(cdp, `document.querySelector('#public-profile')?.scrollIntoView({block:'center'}); true`);
  await sleep(120);
  await capture(cdp, spec.name + '-public-profile.png');

  await evaluate(cdp, `(() => {
    const input=document.querySelector('#public-profile-handle');
    input.value='private.user';
    document.querySelector('#public-profile-search').requestSubmit();
    return true;
  })()`, true);

  const hiddenState = await waitFor(cdp, `(() => {
    const root=document.querySelector('#public-profile');
    const card=document.querySelector('#public-profile-card');
    if (!root || root.dataset.publicProfileState !== 'empty') return null;
    return {
      state:root.dataset.publicProfileState,
      cardHidden:card?.hidden,
      status:document.querySelector('#public-profile-state')?.textContent?.trim()||'',
      copy:document.querySelector('#public-profile-search-status')?.textContent?.trim()||''
    };
  })()`, spec.name + ' private profile fail-closed');

  assert(hiddenState.cardHidden === true, spec.name + ': hidden/private profile card must stay hidden');
  assert(hiddenState.status === 'Introuvable', spec.name + ': hidden/private public status mismatch');
  assert(/Aucun profil public/.test(hiddenState.copy), spec.name + ': hidden/private fail-closed copy missing');

  observations[spec.name + 'PublicProfile'] = {public:publicState, hidden:hiddenState};

  await evaluate(cdp, `document.querySelector('#account-console')?.scrollIntoView({block:'center'}); true`);
  await sleep(120);
  await capture(cdp, spec.name + '-account.png');

  await evaluate(cdp, `document.querySelector('[aria-labelledby="webauthn-title"]')?.scrollIntoView({block:'center'}); true`);
  await sleep(120);
  await capture(cdp, spec.name + '-webauthn.png');
  return state;
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
], {stdio: ['ignore','ignore','pipe']});

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
    {method:'PUT'}
  );
  if (!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP ' + tabResponse.status);
  const tab = await tabResponse.json();
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for (const spec of [
    {name:'desktop', width:1280, height:900, mobile:false},
    {name:'mobile', width:390, height:844, mobile:true}
  ]) {
    observations[spec.name] = await runCase(cdp, spec);
  }

  cdp.close();
  console.log(JSON.stringify({
    marker:'PASS_TARGETED_PROFILES_STATE_BROWSER_PROOF',
    observations,
    failures
  }, null, 2));
} catch (error) {
  failures.push(error.message);
  console.error(JSON.stringify({
    marker:'FAIL_TARGETED_PROFILES_STATE_BROWSER_PROOF',
    fatal:error.message,
    chromeStderr,
    observations,
    failures
  }, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT, {recursive:true, force:true});
}
