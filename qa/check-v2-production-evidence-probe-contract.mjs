import assert from "node:assert/strict";
import fs from "node:fs";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-production-evidence-probe-contract.json","utf8"));
assert.equal(c.schemaVersion,1);
assert.equal(c.status,"PREPARED_READ_ONLY_NOT_EXECUTED_AGAINST_PRODUCTION");
assert.deepEqual(c.allowedMethods,["GET","HEAD"]);
for(const method of ["POST","PUT","PATCH","DELETE"]) assert.ok(c.forbiddenMethods.includes(method));
const inv=new Set(c.invariants||[]);
for(const x of [
  "READ_ONLY_HTTP_ONLY","HTTPS_ORIGIN_REQUIRED","NO_MUTATING_METHODS",
  "NO_CUTOVER","NO_FIELD_CWV_CLAIM_FROM_SYNTHETIC_PROBE","NO_PRODUCTION_PASS_FROM_PRE_CUTOVER_PROBE"
  ,"CWV_READINESS_GET_NEVER_ENABLES_COLLECTION","READINESS_ENDPOINT_NEVER_CLOSES_PRODUCTION_BLOCKER"
]) assert.ok(inv.has(x),"missing invariant "+x);

assert.ok(c.endpoints.includes("/build-info.json"),"build fingerprint endpoint missing");
assert.ok(c.endpoints.includes("/api/v1/rum/cwv"),"CWV readiness endpoint missing");
assert.ok(c.endpoints.includes("/api/v1/production/readiness"),"production readiness endpoint missing");
assert.equal(c.fieldCwv?.collectorProbeMethod,"GET");
assert.equal(c.fieldCwv?.collectorProbeCanCloseBlocker,false);
assert.ok((c.optionalInputs||[]).includes("expectedSha"),"expectedSha optional input missing");
assert.ok((c.invariants||[]).includes("EXPECTED_SHA_WHEN_SUPPLIED_MUST_MATCH_DEPLOYED_BUILD"));
const source=fs.readFileSync("qa/check-v2-production-evidence-origin.mjs","utf8");
for(const forbidden of ['method:"POST"','method:"PUT"','method:"PATCH"','method:"DELETE"',"credentials:'include'"]) {
  assert.equal(source.includes(forbidden),false,"mutating/credentialed probe code forbidden: "+forbidden);
}
assert.equal(/fetch\([^\n]+\{[^}]*body\s*:/.test(source),false,"probe must never send request body");
console.log("PASS_V2_PRODUCTION_EVIDENCE_PROBE_CONTRACT");
