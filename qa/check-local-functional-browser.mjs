import {spawn} from 'node:child_process';

const ORIGIN = process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4173';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT || 9223);
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
  await sleep(160);
}

async function waitFor(cdp, expression, label, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  let lastValue;
  while (Date.now() < deadline) {
    lastValue = await evaluate(cdp, expression, true);
    if (lastValue) return lastValue;
    await sleep(100);
  }
  throw new Error('timeout: ' + label + ' (last=' + JSON.stringify(lastValue) + ')');
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
  '--remote-debugging-port=' + DEBUG_PORT,
  '--user-data-dir=/tmp/modaryx-functional-proof-' + process.pid,
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

  await navigate(cdp, 'index.html');
  await evaluate(cdp, `localStorage.clear(); true`);

  await runCheck('catalog-filter-favorite-persistence', async () => {
    await navigate(cdp, 'catalog.html');
    await waitFor(cdp,
      `(() => { const q=document.querySelector('#catalog-query'); return q && !q.disabled && document.querySelectorAll('[data-catalog-id]').length===3; })()`,
      'catalog hydrated'
    );
    await evaluate(cdp, `(() => {
      const q=document.querySelector('#catalog-query');
      q.value='ember';
      q.dispatchEvent(new Event('input',{bubbles:true}));
      return true;
    })()`);
    const filtered = await waitFor(cdp,
      `(() => ({count:document.querySelector('#catalog-count')?.textContent||'', ids:[...document.querySelectorAll('[data-catalog-id]')].map(n=>n.dataset.catalogId)}))()`,
      'catalog filtered'
    );
    assert(filtered.count.startsWith('1 '), 'catalog did not filter to one item: ' + filtered.count);
    assert(filtered.ids.length === 1 && filtered.ids[0] === 'ember-textures', 'unexpected filtered catalog ids: ' + filtered.ids.join(','));

    await evaluate(cdp, `(() => {
      const b=document.querySelector('[data-favorite-id="ember-textures"]');
      b.click();
      return true;
    })()`);
    const saved = await waitFor(cdp,
      `(() => {
        const b=document.querySelector('[data-favorite-id="ember-textures"]');
        const raw=localStorage.getItem('nova-forge:catalog:favorites:v1');
        return b?.getAttribute('aria-pressed')==='true' && raw ? {pressed:true,raw} : null;
      })()`,
      'favorite saved'
    );
    assert(JSON.parse(saved.raw).includes('ember-textures'), 'favorite storage missing ember-textures');

    await navigate(cdp, 'catalog.html');
    await waitFor(cdp,
      `(() => {
        const b=document.querySelector('[data-favorite-id="ember-textures"]');
        return b?.getAttribute('aria-pressed')==='true';
      })()`,
      'favorite restored'
    );
    await evaluate(cdp, `(() => {
      document.querySelector('[data-favorite-id="ember-textures"]')?.click();
      return true;
    })()`);
    return {filteredId:'ember-textures', persisted:true};
  });

  await runCheck('search-local-index', async () => {
    await navigate(cdp, 'search.html');
    await waitFor(cdp, `(() => { const q=document.querySelector('#site-search'); return q && !q.disabled; })()`, 'search hydrated');
    await evaluate(cdp, `(() => {
      const q=document.querySelector('#site-search');
      q.value='Ember';
      q.dispatchEvent(new Event('input',{bubbles:true}));
      return true;
    })()`);
    const result = await waitFor(cdp,
      `(() => {
        const links=[...document.querySelectorAll('#search-results .search-result')];
        if (!links.length) return null;
        return {count:document.querySelector('#search-count')?.textContent||'', text:links.map(a=>a.textContent).join(' | ')};
      })()`,
      'search result'
    );
    assert(/Ember/i.test(result.text), 'Ember not found in search results');
    assert(/résultat/.test(result.count), 'search count not updated: ' + result.count);
    return result;
  });

  await runCheck('community-local-drafts', async () => {
    await navigate(cdp, 'community.html');
    await waitFor(cdp,
      `(() => document.querySelectorAll('#collection-items input[type=checkbox]').length > 0 && document.querySelector('#submission-target')?.options.length > 1)()`,
      'community catalog hydrated'
    );

    const collection = await evaluate(cdp, `(() => {
      const id=document.querySelector('#collection-id');
      const name=document.querySelector('#collection-name');
      const desc=document.querySelector('#collection-description');
      id.value='vf-check';
      name.value='VF Check';
      desc.value='Preuve locale ciblée';
      for (const el of [id,name,desc]) el.dispatchEvent(new Event('input',{bubbles:true}));
      const first=document.querySelector('#collection-items input[type=checkbox]');
      first.checked=true;
      first.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('#collection-save').click();
      const raw=localStorage.getItem('nova-forge:community:collection:v1');
      return raw ? JSON.parse(raw) : null;
    })()`);
    assert(collection?.id === 'vf-check', 'collection id not saved');
    assert(collection?.syncState === 'local-only', 'collection syncState drifted');
    assert(collection?.visibility === 'private-local', 'collection visibility drifted');
    assert(collection?.ownerProfileId === null, 'collection ownerProfileId must stay null');
    assert(collection?.itemIds?.length === 1, 'collection should contain one item');

    const submission = await evaluate(cdp, `(() => {
      const kind=document.querySelector('#submission-kind');
      kind.value='review';
      kind.dispatchEvent(new Event('change',{bubbles:true}));
      const target=document.querySelector('#submission-target');
      target.value=target.options[1].value;
      target.dispatchEvent(new Event('change',{bubbles:true}));
      const heading=document.querySelector('#submission-heading');
      const body=document.querySelector('#submission-body');
      const rating=document.querySelector('#submission-rating');
      heading.value='Avis local VF';
      body.value='Brouillon fonctionnel local.';
      rating.value='5';
      for (const el of [heading,body,rating]) el.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('#submission-save').click();
      const raw=localStorage.getItem('nova-forge:community:submission:v1');
      return raw ? JSON.parse(raw) : null;
    })()`);
    assert(submission?.kind === 'review' && submission?.rating === 5, 'review draft not saved correctly');
    assert(submission?.syncState === 'local-only', 'submission syncState drifted');
    assert(submission?.publicationState === 'local-draft', 'submission publicationState drifted');
    assert(submission?.moderationState === 'not-submitted', 'submission moderationState drifted');
    assert(submission?.authorProfileId === null, 'submission authorProfileId must stay null');

    await navigate(cdp, 'community.html');
    const restored = await waitFor(cdp,
      `(() => {
        const id=document.querySelector('#collection-id')?.value;
        const heading=document.querySelector('#submission-heading')?.value;
        const checked=[...document.querySelectorAll('#collection-items input[type=checkbox]')].filter(x=>x.checked).length;
        return id==='vf-check' && heading==='Avis local VF' && checked===1 ? {id,heading,checked} : null;
      })()`,
      'community drafts restored'
    );
    await evaluate(cdp, `localStorage.removeItem('nova-forge:community:collection:v1'); localStorage.removeItem('nova-forge:community:submission:v1'); true`);
    return restored;
  });

  await runCheck('creator-studio-local-draft', async () => {
    await navigate(cdp, 'creator-studio.html');
    await waitFor(cdp,
      `(() => !/non chargé/i.test(document.querySelector('#schema-status')?.textContent || ''))()`,
      'studio schema loaded'
    );
    const saved = await evaluate(cdp, `(() => {
      const values={
        'content-id':'vf-check',
        'content-version':'1.0.0',
        'content-name':'VF Check',
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
      document.querySelector('#save-draft').click();
      const raw=localStorage.getItem('nova-forge:creator:draft:v2');
      return raw ? JSON.parse(raw) : null;
    })()`);
    assert(saved?.draftSchema === 2, 'studio draftSchema not saved as v2');
    assert(saved?.manifest?.content?.id === 'vf-check', 'studio content id not saved');
    assert(saved?.manifest?.distribution?.state === 'locked', 'studio distribution state not locked');
    assert(saved?.manifest?.distribution?.downloadable === false, 'studio downloadable must remain false');
    assert(saved?.manifest?.releaseReceipt === null, 'studio releaseReceipt must remain null');

    await navigate(cdp, 'creator-studio.html');
    const restored = await waitFor(cdp,
      `(() => document.querySelector('#content-id')?.value === 'vf-check' ? {
        id:document.querySelector('#content-id').value,
        status:document.querySelector('#studio-status')?.textContent||''
      } : null)()`,
      'studio draft restored'
    );
    await evaluate(cdp, `localStorage.removeItem('nova-forge:creator:draft:v2'); localStorage.removeItem('nova-forge:creator:draft:v1'); true`);
    return restored;
  });

  await runCheck('verify-fragment-validation', async () => {
    await navigate(cdp, 'verify.html#sha256=bad');
    const invalid = await waitFor(cdp,
      `(() => {
        const input=document.querySelector('#expected-sha256');
        const heading=document.querySelector('[data-verify-result] strong');
        return input?.getAttribute('aria-invalid')==='true' ? {value:input.value,heading:heading?.textContent||''} : null;
      })()`,
      'invalid verify fragment'
    );
    assert(invalid.value === 'bad', 'invalid fragment value not preserved');
    assert(invalid.heading === 'Lien de vérification invalide', 'invalid fragment status missing');

    const hash='a'.repeat(64);
    await navigate(cdp, 'verify.html#sha256=' + hash);
    const valid = await waitFor(cdp,
      `(() => {
        const input=document.querySelector('#expected-sha256');
        const heading=document.querySelector('[data-verify-result] strong');
        return input?.value?.length===64 ? {value:input.value,invalid:input.hasAttribute('aria-invalid'),heading:heading?.textContent||''} : null;
      })()`,
      'valid verify fragment'
    );
    assert(valid.value === hash, 'valid hash not prefilled');
    assert(valid.invalid === false, 'valid hash marked invalid');
    assert(valid.heading === 'Empreinte attendue préremplie', 'valid fragment status missing');
    return {invalidHeading:invalid.heading,validHeading:valid.heading};
  });

  cdp.close();

  console.log(JSON.stringify({
    marker: failures.length ? 'FAIL_TARGETED_LOCAL_FUNCTIONAL_BROWSER_PROOF' : 'PASS_TARGETED_LOCAL_FUNCTIONAL_BROWSER_PROOF',
    origin: ORIGIN,
    checks,
    failures
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    marker: 'FAIL_TARGETED_LOCAL_FUNCTIONAL_BROWSER_PROOF',
    fatal: error.message,
    chromeStderr
  }, null, 2));
  process.exitCode = 1;
} finally {
  chrome.kill('SIGTERM');
  await sleep(150);
  if (!chrome.killed) chrome.kill('SIGKILL');
}
