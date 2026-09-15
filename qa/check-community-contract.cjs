const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/community.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog.json'), 'utf8'));
const unit = name => source.match(new RegExp('  (?:async )?function ' + name + '\\([^]*?\\n  }'))[0];
async function load(payload) {
  const displayed = [], restored = [];
  const context = { CATALOG_URL: './data/catalog.json', ID_RE: /^[a-z0-9][a-z0-9._-]{1,127}$/,
    catalogItems: [], catalogReady: false, selectedIds: new Set(['existing-draft-item']),
    fields: { id: { value: 'kept-draft' }, name: { value: 'Brouillon conservé' }, description: { value: '' } },
    fetch: async () => ({ ok: true, json: async () => payload }),
    status: {}, submissionStatus: {},
    renderItems() { displayed.push(context.catalogItems.map(item => item.id)); },
    renderSubmissionTargets() {}, renderPreview() {}, renderSubmissionPreview() {},
    loadSavedCollection() { restored.push('collection'); }, loadSavedSubmission() { restored.push('submission'); }
  };
  vm.createContext(context);
  vm.runInContext(unit('buildCollection') + '\n' + unit('loadCatalog'), context);
  await context.loadCatalog();
  return { context, displayed, restored };
}
(async () => {
  const checks = [];
  let result = await load(data);
  assert.equal(result.context.catalogReady, true);
  assert.equal(result.context.catalogItems.length, 3);
  assert.deepEqual(result.restored, ['collection', 'submission']);
  checks.push('Current catalogue loads before saved drafts are restored');
  for (const patch of [{ id: 123 }, { id: '../private' }, { name: '' }, { name: {} }, { game: null }, { game: { name: '  ' } }]) {
    result = await load({ ...data, items: [data.items[0], { ...data.items[1], ...patch }] });
    assert.equal(result.context.catalogReady, false);
    assert.equal(result.context.catalogItems.length, 0);
    assert.equal(result.displayed.length, 1);
    assert.equal(result.displayed[0].length, 0);
    assert.deepEqual(result.restored, []);
    assert.equal(result.context.fields.name.value, 'Brouillon conservé');
    assert.deepEqual([...result.context.selectedIds], ['existing-draft-item']);
    assert.throws(() => result.context.buildCollection(), /Catalogue indisponible/);
  }
  checks.push('Six malformed variants reject the whole catalogue before restoration; draft fields and selection remain intact and collection validation is blocked');
  result = await load({ ...data, items: [data.items[0], data.items[0]] });
  assert.equal(result.context.catalogReady, false); assert.deepEqual(result.restored, []);
  checks.push('Duplicate identifiers block collection and contribution catalogue loading');
  result = await load({ ...data, items: [...data.items, null, { public: false, id: 'private' }] });
  assert.equal(result.context.catalogItems.length, 3); assert.equal(result.context.catalogReady, true);
  checks.push('Non-public records are excluded before public field validation');
  result = await load({ ...data, items: [] });
  assert.equal(result.context.catalogReady, true); assert.equal(result.context.catalogItems.length, 0);
  checks.push('Valid empty catalogue remains distinct from an invalid response');
  const report = { result: 'PASS', scope: 'Five grouped Node VM source scenarios, not native browser or actual storage restoration proof', checks };
  fs.writeFileSync(path.join(__dirname, 'community-contract-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
