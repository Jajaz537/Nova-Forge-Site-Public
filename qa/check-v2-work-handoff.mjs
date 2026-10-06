import assert from "node:assert/strict";
import fs from "node:fs";
const h=JSON.parse(fs.readFileSync("qa/modaryx-v2-work-handoff.json","utf8"));
const l=JSON.parse(fs.readFileSync("qa/modaryx-v2-vf-closure-ledger.json","utf8"));
assert.equal(h.status,"READY_FOR_WORK_OR_REAL_OPERATOR");
assert.equal(h.sourceCommit,"39c98861dfbfcc4dfee3f266e5f500a7b7a934d1");
assert.equal(h.blockerCount,l.blockerCount);
assert.equal(h.testedCandidateCommit,"db8ebf50ba4ff593fd73b27e72075b4f8088686a");
assert.equal(h.latestCheckpoint,"CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-2304.md");
assert.equal(h.treeEquivalentCanonicalCommit,"39c98861dfbfcc4dfee3f266e5f500a7b7a934d1");
assert.equal(h.latestDesignProof?.canonicalTreeEquivalent,true);
assert.equal(h.latestReadOnlyProbe?.state,"SUCCESS");
assert.deepEqual(new Set(h.blockers.map(x=>x.id)),new Set(l.blockers.map(x=>x.id)));
for(const b of h.blockers){
  assert.equal(b.automationCanCloseWithoutExternalChange,false,b.id+" must remain external");
  assert.ok(Array.isArray(b.requiredEvidence)&&b.requiredEvidence.length>0,b.id+" evidence missing");
}
const inv=new Set(h.invariants||[]);
for(const x of [
  "NO_BLOCKER_CLOSES_WITHOUT_MATCHING_REQUIRED_EVIDENCE",
  "NO_REMOTE_D1_APPLY_WITHOUT_EXPLICIT_APPROVAL",
  "NO_R2_BINDING_CHANGE_WITHOUT_EXPLICIT_APPROVAL",
  "NO_PROVIDER_ACTIVATION_WITHOUT_EXPLICIT_APPROVAL",
  "NO_CUTOVER_UNTIL_ALL_REQUIRED_BLOCKERS_CLOSED",
  "AUTOMATION_NEVER_EQUALS_LEGAL_OR_PUBLISHER_APPROVAL"
]) assert.ok(inv.has(x),"missing invariant "+x);
console.log("WORK_HANDOFF_BLOCKER_COUNT",h.blockerCount);
console.log("PASS_V2_WORK_HANDOFF");
