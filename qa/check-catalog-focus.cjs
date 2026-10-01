// Source transaction tests: focus scheduling, not native keyboard/screen-reader proof.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../assets/catalog.js'), 'utf8');
const unit = source.match(/  function toggleFavorite\([^]*?\n  }/)[0];
const checks = [];
function run(ids, removed, options = {}) {
  let focused = null, renders = 0;
  const nodes = ids.map(id => ({ id, setAttribute() {}, classList: { toggle() {} }, focus() { focused = id; } }));
  let visible = nodes;
  const button = nodes.find(x => x.id === removed);
  const stateNode = {};
  const context = { favorites: new Set(ids), saveFavorites: () => !options.reject, stateNode, items: ids,
    favoritesOnly: { checked: options.filtered !== false }, document: { activeElement: options.unfocused ? null : button },
    grid: { querySelectorAll: () => visible }, queryInput: { focus() { focused = 'search'; } },
    render() { renders++; visible = nodes.filter(x => x.id !== removed); }
  };
  vm.createContext(context); vm.runInContext(unit, context); context.toggleFavorite(removed, button);
  return { focused, renders, context, stateNode };
}
assert.equal(run(['a', 'b', 'c'], 'b').focused, 'c');
checks.push('Removing focused middle favorite moves focus to the following card');
assert.equal(run(['a', 'b', 'c'], 'c').focused, 'b');
checks.push('Removing focused last card moves focus to previous remaining card');
assert.equal(run(['a'], 'a').focused, 'search');
checks.push('Removing only favorite returns focus to search');
assert.equal(run(['a', 'b'], 'a', { unfocused: true }).focused, null);
checks.push('Action without focus on favorite does not steal focus');
const rejected = run(['a'], 'a', { reject: true });
assert.equal(rejected.renders, 0); assert.equal(rejected.context.favorites.has('a'), true);
checks.push('Storage failure retains favorite and card without moving focus');
const unfiltered = run(['a'], 'a', { filtered: false });
assert.equal(unfiltered.renders, 0); assert.equal(unfiltered.focused, null);
checks.push('Unfiltered toggle retains its original button without rerender');
const report = { result: 'PASS', scope: 'Six source transaction scenarios in Node VM; not browser or screen reader', checks };
fs.writeFileSync(path.join(__dirname, 'catalog-focus-checks.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
