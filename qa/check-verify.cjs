const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
class Element {
  constructor() { this.value = ''; this.files = []; this.dataset = {}; this.children = []; this.events = {}; this.attrs = {}; this.disabled = false; }
  addEventListener(name, fn) { this.events[name] = fn; }
  fire(name) { return this.events[name]?.(); }
  setAttribute(name, value) { this.attrs[name] = value; }
  removeAttribute(name) { delete this.attrs[name]; }
  replaceChildren(...children) { this.children = children; }
  focus() { this.focused = true; }
}
function setup(crypto = webcrypto) {
  const nodes = new Map();
  const get = key => { if (!nodes.has(key)) nodes.set(key, new Element()); return nodes.get(key); };
  const context = { Uint8Array, crypto, location: { hash: '' }, document: { querySelector: get, createElement: () => new Element() }, window: { addEventListener() {} } };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/verify.js'), 'utf8'), context);
  return { file: get('#verify-file'), expected: get('#expected-sha256'), button: get('[data-verify-file]'), result: get('[data-verify-result]') };
}
const checks = [];
(async () => {
  let e = setup();
  await e.button.fire('click');
  assert.equal(e.file.focused, true);
  assert.equal(e.file.attrs['aria-invalid'], 'true');
  assert.equal(e.result.dataset.state, 'warning');
  await e.expected.fire('input');
  assert.equal(e.file.attrs['aria-invalid'], 'true');
  checks.push('Missing file focuses the local file picker and reports a warning');

  let reads = 0;
  e.file.files = [{ name: 'test', arrayBuffer: async () => { reads++; return new ArrayBuffer(0); } }];
  await e.file.fire('change');
  assert.equal(e.file.attrs['aria-invalid'], undefined);
  e.expected.value = 'not-a-hash';
  await e.button.fire('click');
  assert.equal(reads, 0);
  assert.equal(e.expected.focused, true);
  assert.equal(e.expected.attrs['aria-invalid'], 'true');
  assert.equal(e.button.disabled, false);
  checks.push('Malformed expected hash is rejected before reading bytes, with field focus');

  e.expected.value = '';
  await e.expected.fire('input');
  assert.equal(e.expected.attrs['aria-invalid'], undefined);
  await e.button.fire('click');
  assert.equal(reads, 1);
  assert.equal(e.result.children[0].textContent, 'Empreinte calculée');
  assert.equal(e.result.dataset.state, 'neutral');
  checks.push('Editing clears stale field error; empty expected hash remains a neutral calculation');

  e.expected.value = ' SHA256:E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855 ';
  await e.button.fire('click');
  assert.equal(e.result.dataset.state, 'match');
  e.expected.value = 'a'.repeat(64);
  await e.button.fire('click');
  assert.equal(e.result.dataset.state, 'mismatch');
  checks.push('Real Node Web Crypto digest accepts normalized hash and distinguishes mismatch');

  e = setup();
  let release;
  reads = 0;
  e.file.files = [{ name: 'pending', arrayBuffer: () => { reads++; return new Promise(resolve => { release = resolve; }); } }];
  const pending = e.button.fire('click');
  await e.button.fire('click');
  assert.equal(reads, 1);
  assert.equal(e.button.attrs['aria-busy'], 'true');
  e.expected.value = 'a'.repeat(64);
  await e.expected.fire('input');
  release(new ArrayBuffer(0));
  await pending;
  assert.equal(e.result.children[0].textContent, 'Vérification à relancer');
  assert.equal(e.button.disabled, false);
  assert.equal(e.button.attrs['aria-busy'], undefined);
  checks.push('Concurrent activation is ignored and changed inputs suppress stale digest output');

  e = setup();
  e.file.files = [{ name: 'unreadable', arrayBuffer: async () => { throw Error('denied'); } }];
  await e.button.fire('click');
  assert.equal(e.result.children[0].textContent, 'Calcul impossible');
  assert.equal(e.button.disabled, false);
  assert.equal(e.button.attrs['aria-busy'], undefined);
  checks.push('Read failure restores button availability without a trust result');

  e = setup({});
  e.file.files = [{ name: 'test', arrayBuffer: () => { throw Error('must not read'); } }];
  await e.button.fire('click');
  assert.equal(e.result.children[0].textContent, 'SHA-256 indisponible');
  checks.push('Missing Web Crypto does not read or claim verification');
  const report = { result: 'PASS', kind: 'Node VM with real Web Crypto digest; not native browser or screen-reader proof', checks };
  fs.writeFileSync(path.join(__dirname, 'verify-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
