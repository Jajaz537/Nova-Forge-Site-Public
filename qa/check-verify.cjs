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
function setup(crypto = webcrypto, hash = '') {
  const nodes = new Map();
  const get = key => { if (!nodes.has(key)) nodes.set(key, new Element()); return nodes.get(key); };
  const context = { Uint8Array, crypto, location: { hash }, document: { querySelector: get, createElement: () => new Element() }, window: { addEventListener(name, fn) { this[name] = fn; } } };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/verify.js'), 'utf8'), context);
  return { context, file: get('#verify-file'), expected: get('#expected-sha256'), button: get('[data-verify-file]'), result: get('[data-verify-result]') };
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

  let digests = 0;
  e = setup({subtle:{digest:async (...args)=>{digests++;return webcrypto.subtle.digest(...args);}}});
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
  assert.equal(digests, 0, 'Do not hash an obsolete selection after its read completes');
  checks.push('Concurrent activation is ignored; input changes during reading skip obsolete digest work');

  let finishDigest;
  e = setup({subtle:{digest:()=>new Promise(resolve=>{finishDigest=resolve;})}});
  e.file.files = [{name:'hashing',arrayBuffer:async()=>new ArrayBuffer(0)}];
  const hashing=e.button.fire('click');
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(typeof finishDigest,'function');
  await e.file.fire('change');
  finishDigest(new Uint8Array(32).buffer);
  await hashing;
  assert.equal(e.result.children[0].textContent,'Vérification à relancer');
  assert.equal(e.button.disabled,false);
  assert.equal(e.button.attrs['aria-busy'],undefined);
  checks.push('Input change during an already running digest still suppresses stale output and releases the button');

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
  for (const fragment of ['incorrect', '', '%E0%A4%A']) {
    e = setup(webcrypto, '#sha256=' + fragment);
    assert.equal(e.result.dataset.state, 'warning');
    assert.equal(e.expected.attrs['aria-invalid'], 'true');
    let fragmentReads = 0;
    e.file.files = [{ name: 'blocked', arrayBuffer: async () => { fragmentReads++; return new ArrayBuffer(0); } }];
    await e.button.fire('click');
    assert.equal(fragmentReads, 0);
    assert.equal(e.result.children[0].textContent, 'Empreinte attendue invalide');
  }
  checks.push('Malformed, empty and undecodable hash links show an error and prevent file reads');
  e = setup();
  let finish;
  e.expected.value = 'a'.repeat(64);
  e.file.files = [{ name: 'pending', arrayBuffer: () => new Promise(r => { finish = r; }) }];
  const oldRun = e.button.fire('click');
  e.context.location.hash = '#sha256=invalid';
  e.context.window.hashchange();
  finish(new ArrayBuffer(0));
  await oldRun;
  assert.equal(e.result.children[0].textContent, 'Lien de vérification invalide');
  assert.equal(e.button.disabled, false);
  e.context.location.hash = '#sha256=' + 'b'.repeat(64);
  e.context.window.hashchange();
  assert.equal(e.expected.value, 'b'.repeat(64));
  assert.equal(e.expected.attrs['aria-invalid'], undefined);
  assert.equal(e.result.dataset.state, 'neutral');
  checks.push('Invalid fragment interrupts stale digest output; a subsequent valid link restores neutral prefill');
  const report = { result: 'PASS', kind: 'Node VM with real Web Crypto digest; not native browser or screen-reader proof', checks };
  fs.writeFileSync(path.join(__dirname, 'verify-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
