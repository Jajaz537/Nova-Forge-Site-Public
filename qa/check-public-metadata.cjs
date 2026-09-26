'use strict';
// Targeted consumer checks. Executes production scripts in a minimal DOM mock;
// this does not claim a browser, service-worker lifecycle or release validation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.resolve(__dirname, '..');
class Element {
  constructor(tag = 'div') { this.tag = tag; this.dataset = {}; this.children = []; this.textContent = ''; this.listeners = {}; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(event, handler) { this.listeners[event] = handler; }
  setAttribute(name, value) { this[name] = String(value); }
  removeAttribute(name) { delete this[name]; }
  querySelector(selector) { return this.children.find(node => node.tag === selector) || null; }
  cloneNode() { const copy = new Element(this.tag); copy.dataset = {...this.dataset}; copy.textContent = this.textContent; copy.children = this.children.map(node => node.cloneNode()); return copy; }
}
function appFixture(responses) {
  const message = new Element(), facts = new Element(), build = new Element(), bridgeButton = new Element(), profile = new Element();
  build.dataset.buildFact = 'true'; build.append(new Element('small')); facts.append(build);
  const nodes = {'[data-public-status-message]': message, '[data-public-status-facts]': facts, '[data-profile-result]': profile, '[data-os-bridge]': bridgeButton};
  const context = {
    URL, navigator: {}, location: {protocol: 'https:'},
    document: {baseURI: 'https://example.test/', createElement: tag => new Element(tag), querySelector: selector => selector === '[data-public-build-fact]' ? facts.children.find(node => node.dataset.buildFact) : nodes[selector] || null},
    fetch: async url => responses[path.basename(url.pathname)]()
  };
  context.window = context;
  vm.runInNewContext(fs.readFileSync(path.join(base, 'assets/app.js'), 'utf8'), context);
  return {message, facts, bridgeButton, profile, build: () => context.document.querySelector('[data-public-build-fact]')};
}
function downloadFixture(response) {
  const root = new Element(), state = new Element();
  vm.runInNewContext(fs.readFileSync(path.join(base, 'assets/downloads.js'), 'utf8'), {
    URL,
    document: {baseURI: 'https://example.test/', createElement: tag => new Element(tag), querySelector: selector => selector === '[data-download-artifacts]' ? root : state},
    fetch: async () => response()
  });
  return {root, state};
}
const response = (payload, stale = false) => () => ({ok: true, headers: {get: name => name === 'X-Modaryx-Cache' && stale ? 'offline-stale' : null}, json: async () => payload});
const flush = () => new Promise(resolve => setImmediate(resolve));
const buildManifest = {schema: 'nova-forge-public-site-build/v1', source_revision: 'withheld-private-source', surface_digest_sha256: 'a'.repeat(64)};
const statusManifest = {schema: 'nova-forge-public-site-status/v1', stage: 'pre-vf', principles: {public_only: true}, distribution: {public_download_available: true}};
const downloadManifest = {schema: 'nova-forge-public-downloads/v1', policy: 'verified-artifacts-only', available: true, artifacts: [{id: 'example', name: 'Example', version: '1', filename: 'example.zip', size_bytes: 64, sha256: 'b'.repeat(64), provenance: 'Test fixture only', download_path: './example.zip', signature_status: 'verified'}]};
(async () => {
  const checks = [];
  const manifest = fs.readFileSync(path.join(base, 'site.webmanifest'), 'utf8');
  assert.match(manifest, /Plateforme publique MODARYX MODS/);
  assert.doesNotMatch(manifest, /Modaryx OS/i);
  checks.push('PWA metadata identifies MODARYX as the web platform without reviving the obsolete Modaryx OS product name.');

  const stale = appFixture({'public-status.json': response(statusManifest, true), 'public-build.json': response(buildManifest, true)});
  await flush();
  assert.match(stale.message.textContent, /Statut non actualisé/);
  assert.equal(stale.message.dataset.freshness, 'offline-stale');
  assert.match(stale.build().querySelector('small').textContent, /Build non actualisé/);
  assert.equal(stale.build().dataset.reported, undefined);
  assert.equal(stale.facts.children[0].children[1].textContent, 'non confirmée hors ligne');
  checks.push('Offline status/build visibly unqualified; old availability and digest are not presented as current.');

  const fresh = appFixture({'public-status.json': response(statusManifest), 'public-build.json': response(buildManifest)});
  await flush();
  assert.match(fresh.message.textContent, /déclaré disponible/);
  assert.match(fresh.build().querySelector('small').textContent, /SHA-256 déclaré/);
  assert.equal(fresh.build().dataset.reported, 'true');
  assert.equal(fresh.build().dataset.verified, undefined);
  fresh.bridgeButton.listeners.click();
  assert.match(fresh.profile.children[0].textContent, /Pont local optionnel/);
  assert.doesNotMatch(fresh.profile.children[1].textContent, /Modaryx OS/i);
  checks.push('Fresh metadata remains a declaration, not cryptographic verification; optional bridge copy is separate.');

  const missing = appFixture({'public-status.json': async () => {throw new Error('offline');}, 'public-build.json': response({...buildManifest, surface_digest_sha256: null})});
  await flush();
  assert.match(missing.message.textContent, /Statut non actualisé/);
  assert.match(missing.build().querySelector('small').textContent, /non disponible/);
  checks.push('Unavailable status and missing build digest display explicit uncertainty.');

  const locked = downloadFixture(response(downloadManifest, true));
  await flush();
  assert.equal(locked.state.dataset.state, 'locked');
  assert.equal(locked.root.children.length, 0);
  assert.match(locked.state.textContent, /copie hors ligne non actualisée/);
  checks.push('Even a formerly available offline manifest cannot enable downloads.');

  const available = downloadFixture(response(downloadManifest));
  await flush();
  assert.equal(available.root.children.length, 1);
  assert.equal(available.state.dataset.state, 'available');
  assert.match(available.state.textContent, /déclaré disponible/);
  assert.match(available.state.textContent, /n’a vérifié ni les fichiers ni leur signature/);
  checks.push('Fresh conforming publication manifest enables links with explicit verification limits.');

  const invalid = downloadFixture(response({...downloadManifest, artifacts: [{...downloadManifest.artifacts[0], download_path: 'https://other.test/example.zip'}]}));
  await flush();
  assert.equal(invalid.root.children.length, 0);
  assert.equal(invalid.state.dataset.state, 'locked');
  checks.push('Non-local download paths still fail closed.');
  console.log(JSON.stringify({status: 'PASS', scope: 'targeted Node VM consumer checks', checks}, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
