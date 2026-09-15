const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../assets/catalog.js'), 'utf8');
const unit = name => source.match(new RegExp('  (?:async )?function ' + name + '\\([^]*?\\n  }'))[0];
const checks = [];
(async () => {
  for (const stale of [false, true]) {
    const context = { DATA_URL: '', items: [], staleCatalog: false, fetch: async () => ({ ok: true, headers: { get: () => stale ? 'offline-stale' : null }, json: async () => ({ schemaVersion: 1, items: [] }) }),
      refreshGames() {}, refreshSavedViews() {}, buildCard() {}, normalize: x => x, queryInput: { value: '' }, kindSelect: { value: '' }, gameSelect: { value: '' }, evidenceSelect: { value: '' }, sortSelect: { value: 'featured' }, favoritesOnly: { checked: false }, grid: { replaceChildren() {} }, countNode: {}, emptyNode: {}, stateNode: {} };
    vm.createContext(context); vm.runInContext(unit('readPublicItems') + '\n' + unit('render') + '\n' + unit('hydrate'), context);
    await context.hydrate();
    assert.equal(context.stateNode.textContent.includes('Copie en cache'), stale);
    context.favoritesOnly.checked = true; context.render();
    assert.equal(context.stateNode.textContent.includes('Copie en cache'), stale);
    assert.match(context.stateNode.textContent, /favoris activé/);
    checks.push(stale ? 'Cache response remains qualified after favorites filter rerender' : 'Network response never receives an unsupported stale label');
  }
  const report = { result: 'PASS', scope: 'Two Node VM source scenarios; not native HTTPS/offline proof', checks };
  fs.writeFileSync(path.join(__dirname, 'catalog-cache-label-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
