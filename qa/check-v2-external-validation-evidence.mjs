import assert from "node:assert/strict";
import fs from "node:fs";

const file=process.argv[2];
if(!file) throw new Error("usage: node qa/check-v2-external-validation-evidence.mjs <evidence.json>");
const pack=JSON.parse(fs.readFileSync("qa/modaryx-v2-external-validation-execution-pack.json","utf8"));
const e=JSON.parse(fs.readFileSync(file,"utf8"));
const session=pack.sessions.find(x=>x.blockerId===e.blockerId&&x.sessionType===e.sessionType);
assert.ok(session,"evidence blocker/session mismatch");
assert.equal(e.schemaVersion,1);
assert.notEqual(e.status,"TEMPLATE_NOT_EVIDENCE","template is not evidence");
for(const key of ["evidenceId","date","commitSha","actorOpaqueId","reviewer"]) assert.ok(typeof e[key]==="string"&&e[key].trim(),key+" required");
assert.match(e.commitSha,/^[a-f0-9]{40}$/,"commitSha must be exact git SHA");
assert.ok(pack.requiredResultStates.includes(e.result),"result state invalid");
assert.notEqual(e.result,"INCOMPLETE","INCOMPLETE cannot close blocker");
assert.ok(Array.isArray(e.artifactRefs)&&e.artifactRefs.length>0,"artifact refs required");
assert.ok(e.environment&&Array.isArray(e.environment.realityFlags),"reality flags required");
const reality=new Set(e.environment.realityFlags);
for(const flag of session.requiredReality) assert.ok(reality.has(flag),session.blockerId+" missing real environment flag "+flag);
assert.ok(Array.isArray(e.tasks),"tasks required");
const executed=new Set(e.tasks.filter(x=>x&&x.executed===true).map(x=>x.id));
for(const task of session.criticalTasks) assert.ok(executed.has(task),session.blockerId+" missing executed critical task "+task);
assert.ok(Array.isArray(e.findings),"findings required");
for(const f of e.findings){
  assert.ok(["P0","P1","P2","P3"].includes(f.severity),"finding severity invalid");
  assert.ok(["OPEN","FIXED","ACCEPTED_P2_P3","NOT_REPRODUCIBLE"].includes(f.status),"finding status invalid");
  if(["P0","P1"].includes(f.severity)) assert.notEqual(f.status,"OPEN","P0/P1 must not remain OPEN");
}
if(e.result==="PASS_WITH_NO_BLOCKER") assert.equal(e.findings.some(f=>["P0","P1","P2","P3"].includes(f.severity)&&f.status==="OPEN"),false,"open finding incompatible with PASS_WITH_NO_BLOCKER");
if(e.result==="PASS_WITH_P2_P3") assert.equal(e.findings.some(f=>["P0","P1"].includes(f.severity)&&f.status==="OPEN"),false,"open P0/P1 incompatible with pass");
console.log("PASS_V2_EXTERNAL_VALIDATION_EVIDENCE",e.blockerId,e.commitSha);
