const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/catalog.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog.json'), 'utf8'));
const unit = name => source.match(new RegExp('  (?:async )?function ' + name + '\\([^]*?\\n  }'))[0];
async function load(payload) {
  const calls = [];
  const context = { items: [], navigator: { onLine: true }, DATA_URL: './data/catalog.json',
    fetch: async () => ({ ok: true, json: async () => payload }),
    refreshGames: () => calls.push('games'), refreshSavedViews: () => calls.push('views'), render: () => calls.push('render'),
    bindStaticFavorites: () => calls.push('static'), grid: { querySelectorAll: () => [1, 2, 3] }, stateNode: {}, countNode: {} };
  vm.createContext(context); vm.runInContext(unit('readPublicItems') + '\n' + unit('hydrate'), context);
  await context.hydrate();
  return { context, calls };
}
(async () => {
  const checks = [];
  let result = await load(data);
  assert.equal(result.context.items.length, 3); assert.ok(result.calls.includes('render'));
  checks.push('Current three public records load before rendering');
  const bad = [ { game: null }, { creator: null }, { compatibility: null }, { tags: {} }, { provenance: {} }, { distribution: null }, { name: '' }, { id: '../private' }, { kind: 'unsupported' }, { featuredRank: 'first' } ];
  for (const patch of bad) {
    result = await load({ ...data, items: [{ ...data.items[0], ...patch }] });
    assert.equal(result.context.items.length, 0); assert.deepEqual(result.calls, ['static']);
    assert.equal(result.context.countNode.textContent, '3 entrées statiques');
  }
  checks.push('Ten malformed public record variants retain static cards without invoking enriched rendering');
  result = await load({ ...data, items: [data.items[0], data.items[0]] });
  assert.deepEqual(result.calls, ['static']);
  checks.push('Duplicate public identifiers reject enriched catalogue');
  result = await load({ ...data, items: [...data.items, { public: false, name: 'private' }, null] });
  assert.equal(result.context.items.length, 3);
  checks.push('Non-public and null entries are excluded from public rendering');
  result = await load({ ...data, items: [] });
  assert.ok(result.calls.includes('render')); assert.equal(result.context.items.length, 0);
  checks.push('Empty valid catalogue reaches empty rendering rather than failure');
  result = await load({ schemaVersion: 2, items: [] });
  assert.deepEqual(result.calls, ['static']);
  checks.push('Unsupported contract preserves static fallback');
  const report = { result: 'PASS', scope: 'Six grouped Node VM source scenarios, including ten malformed variants; not native browser proof', checks };
  fs.writeFileSync(path.join(__dirname, 'catalog-contract-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
