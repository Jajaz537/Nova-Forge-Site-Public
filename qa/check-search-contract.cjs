const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/search.js'), 'utf8');
const actual = JSON.parse(fs.readFileSync(path.join(root, 'data/search-index.json'), 'utf8'));
class Element {
  constructor() { this.value = ''; this.textContent = ''; this.children = ['static directory']; this.disabled = true; this.hidden = true; this.events = {}; }
  addEventListener(name, callback) { this.events[name] = callback; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
}
async function setup(payload, offline = false) {
  const nodes = new Map();
  const get = key => { if (!nodes.has(key)) nodes.set(key, new Element()); return nodes.get(key); };
  const context = { document: { querySelector: get, createElement: () => new Element() }, fetch: async () => {
    if (offline) throw Error('offline');
    return { ok: true, json: async () => payload };
  } };
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return get;
}
(async () => {
  const checks = [];
  const malformed = [
    { ...actual.entries[0], terms: {} },
    { ...actual.entries[0], terms: [4] },
    { ...actual.entries[0], title: '' },
    { ...actual.entries[0], summary: null }
  ];
  for (const entry of malformed) {
    const get = await setup({ ...actual, entries: [entry] });
    assert.equal(get('#site-search').disabled, true);
    assert.deepEqual(get('#search-results').children, ['static directory']);
    get('#site-search').events.input();
    assert.match(get('#search-state').textContent, /indisponible/);
  }
  checks.push('Four malformed-entry variants preserve static directory and keep filtering disabled');
  const duplicate = await setup({ ...actual, entries: [actual.entries[0], actual.entries[0]] });
  assert.equal(duplicate('#site-search').disabled, true);
  assert.deepEqual(duplicate('#search-results').children, ['static directory']);
  checks.push('Duplicate identifiers reject the index without erasing fallback');
  const get = await setup(actual);
  assert.equal(get('#site-search').disabled, false);
  assert.equal(get('#search-results').children.length, actual.entries.length);
  get('#site-search').value = 'CREER'; get('#site-search').events.input();
  assert.ok(get('#search-results').children.length > 0);
  get('#site-search').value = 'zzzz-no-match'; get('#site-search').events.input();
  assert.equal(get('#search-results').children.length, 0);
  assert.equal(get('#search-empty').hidden, false);
  checks.push('Current index hydrates, folds accents/case and exposes no-match state');
  const empty = await setup({ ...actual, entries: [] });
  assert.equal(empty('#site-search').disabled, false);
  assert.equal(empty('#search-count').textContent, '0 résultats');
  checks.push('Valid empty index remains usable and distinct from failure');
  const offline = await setup(actual, true);
  assert.deepEqual(offline('#search-results').children, ['static directory']);
  assert.equal(offline('#site-search').disabled, true);
  checks.push('Network failure preserves static navigation');
  const report = { result: 'PASS', scope: 'Five grouped Node VM scenarios, including four malformed entry variants; not browser proof', checks };
  fs.writeFileSync(path.join(__dirname, 'search-contract-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
