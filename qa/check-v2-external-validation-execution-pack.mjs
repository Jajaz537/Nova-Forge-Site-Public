import assert from "node:assert/strict";
import fs from "node:fs";

const pack=JSON.parse(fs.readFileSync("qa/modaryx-v2-external-validation-execution-pack.json","utf8"));
assert.equal(pack.schemaVersion,1);
assert.equal(pack.status,"PREPARED_NOT_EXECUTED");
assert.equal(pack.sessions.length,5);
assert.deepEqual(new Set(pack.blockerIds),new Set(["nvda-real","voiceover-real","talkback-real","safari-real","physical-devices"]));
const types=new Set(pack.sessions.map(x=>x.sessionType));
for(const t of ["NVDA_REAL","VOICEOVER_REAL","TALKBACK_REAL","SAFARI_REAL","PHYSICAL_DEVICE"]) assert.ok(types.has(t),"missing session "+t);
for(const s of pack.sessions){
  assert.ok(Array.isArray(s.requiredReality)&&s.requiredReality.length>0,s.blockerId+" reality flags missing");
  assert.ok(Array.isArray(s.criticalTasks)&&s.criticalTasks.length>=5,s.blockerId+" task coverage too small");
}
const inv=new Set(pack.invariants||[]);
for(const x of ["AUTOMATION_NEVER_CLOSES_EXTERNAL_BLOCKER","CDP_NEVER_EQUALS_SCREEN_READER","VIEWPORT_EMULATION_NEVER_EQUALS_PHYSICAL_DEVICE","NON_SAFARI_NEVER_EQUALS_SAFARI_REAL","EVIDENCE_TEMPLATE_NEVER_EQUALS_EXECUTED_SESSION","NO_EXTERNAL_SESSION_AGAINST_HISTORICAL_ROOT","INTERACTIVE_V2_ORIGIN_REQUIRED_BEFORE_REAL_DEVICE_EXECUTION"]) assert.ok(inv.has(x),"missing invariant "+x);
assert.equal(pack.preparedAgainstCommit,"85ae67578f848cb1aef6f43d8958eb56fcf7e136");
assert.equal(pack.preparedPreviewOrigin,null);
assert.equal(pack.interactiveV2OriginState,"MISSING_REQUIRED_BEFORE_EXECUTION");
assert.equal(pack.latestReadOnlyProbe?.runId,37532315393);
const template=JSON.parse(fs.readFileSync("qa/external-validation/evidence-template.json","utf8"));
assert.equal(template.status,"TEMPLATE_NOT_EVIDENCE");
assert.equal(template.result,"INCOMPLETE");
assert.equal(template.artifactRefs.length,0);
assert.equal(template.commitSha,null);
console.log("PASS_V2_EXTERNAL_VALIDATION_EXECUTION_PACK");
