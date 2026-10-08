import assert from "node:assert/strict";
import fs from "node:fs";

const gate=JSON.parse(fs.readFileSync("qa/modaryx-v2-vf-readiness-gate.json","utf8"));
const ledger=JSON.parse(fs.readFileSync("qa/modaryx-v2-vf-closure-ledger.json","utf8"));

const open=[
  ...(gate.externalHuman||[]),
  ...(gate.webProduction||[]),
  ...(gate.rightsLegal||[])
].filter(x=>x.state==="OPEN").map(x=>x.id).sort();

const listed=(ledger.blockers||[]).map(x=>x.id).sort();
assert.equal(ledger.schemaVersion,1);
assert.equal(ledger.status,"ACTIVE_FAIL_CLOSED_20_OPEN");
assert.equal(ledger.blockerCount,20);
assert.equal(open.length,20,"gate open blocker count drift");
assert.deepEqual(listed,open,"closure ledger must exactly match OPEN gate blockers");
assert.equal(new Set(listed).size,listed.length,"duplicate blocker id");

const categories={};
for(const item of ledger.blockers){
  assert.equal(item.state,"OPEN",item.id+" must remain OPEN");
  assert.equal(item.automationCanCloseWithoutExternalChange,false,item.id+" automation-only closure forbidden");
  assert.ok(item.executorClass&&item.closureMode&&item.currentPreparation,item.id+" closure metadata incomplete");
  assert.ok(Array.isArray(item.requiredEvidence)&&item.requiredEvidence.length>=3,item.id+" evidence list too small");
  categories[item.category]=(categories[item.category]||0)+1;
}
assert.deepEqual(categories,{"external-validation":5,"visual-owner":1,"web-production":8,"rights-legal":6});

const inv=new Set(ledger.invariants||[]);
for(const x of [
  "LEDGER_MUST_EQUAL_GATE_OPEN_SET","NO_LEDGER_ENTRY_CLOSES_A_BLOCKER",
  "DEV_OR_CANDIDATE_EVIDENCE_NEVER_EQUALS_PRODUCTION_PROOF",
  "NO_SIMULATED_SCREEN_READER_SAFARI_DEVICE_RIGHTS_OR_LEGAL_PROOF",
  "NO_REMOTE_MUTATION_BY_THIS_LEDGER","NO_CUTOVER"
]) assert.ok(inv.has(x),"missing invariant "+x);

const raw=fs.readFileSync("qa/modaryx-v2-vf-closure-ledger.json","utf8").toLowerCase();
for(const forbidden of ["wrangler d1 execute","--remote","curl -x post","curl -x put","curl -x patch","curl -x delete"]){
  assert.equal(raw.includes(forbidden),false,"mutation command leaked into ledger: "+forbidden);
}

console.log("VF_CLOSURE_LEDGER_OPEN_COUNT",open.length);
console.log("VF_CLOSURE_LEDGER_EXTERNAL",categories["external-validation"]);
console.log("VF_CLOSURE_LEDGER_VISUAL",categories["visual-owner"]);
console.log("VF_CLOSURE_LEDGER_WEB",categories["web-production"]);
console.log("VF_CLOSURE_LEDGER_RIGHTS",categories["rights-legal"]);
console.log("PASS_V2_VF_CLOSURE_LEDGER");
