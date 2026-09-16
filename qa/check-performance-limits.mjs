import assert from 'node:assert/strict';
import {budgetChecks, limits} from './performance-limits.mjs';
const sample = () => [{page:'fixture.html',css:{rawBytes:limits.cssPerPage},js:{rawBytes:limits.jsPerPage}}];
const passed = (size, pages=sample()) => budgetChecks({rawBytes:size},pages).every(x=>x.passed);
assert.equal(passed(limits.precache),true);
assert.equal(passed(limits.precache+1),false);
for(const kind of ['css','js']) {
  const pages=sample(); pages[0][kind].rawBytes++;
  assert.equal(passed(0,pages),false);
}
for(const bad of [undefined,NaN,-1,1.5]) assert.equal(passed(bad),false);
assert.equal(passed(0,[]),false);
assert.equal(passed(0,[{page:'missing.html'}]),false);
console.log('10 budget boundary checks passed; synthetic data only.');
