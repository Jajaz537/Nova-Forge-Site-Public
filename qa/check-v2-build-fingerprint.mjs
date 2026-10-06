import assert from "node:assert/strict";
import fs from "node:fs";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-build-fingerprint-contract.json","utf8"));
assert.equal(c.schemaVersion,1);
assert.equal(c.status,"IMPLEMENTED_CANDIDATE_EXACT_SHA_PROOF_REQUIRED");
assert.equal(c.output,"v2/dist/client/build-info.json");
const inputs=new Set(c.cloudflareSystemInputs||[]);
for(const x of ["CF_PAGES_COMMIT_SHA","CF_PAGES_BRANCH","CF_PAGES_URL"]) assert.ok(inputs.has(x),"missing Pages system input "+x);
const inv=new Set(c.invariants||[]);
for(const x of [
  "NO_SECRET_ENV_VALUE_EXPOSED","BUILD_INFO_STATIC_READ_ONLY","BRANCH_ALIAS_PROBE_GET_HEAD_ONLY",
  "PRE_CUTOVER_REQUIRES_NOINDEX","EXPECTED_SHA_MUST_MATCH_BEFORE_PASS","NO_REMOTE_MUTATION","NO_CUTOVER"
]) assert.ok(inv.has(x),"missing invariant "+x);

const source=fs.readFileSync("v2/scripts/prepare-sites-build.mjs","utf8");
for(const required of ["CF_PAGES_COMMIT_SHA","CF_PAGES_BRANCH","CF_PAGES_URL","build-info.json"]) assert.ok(source.includes(required),"fingerprint source missing "+required);
for(const forbidden of ["AUTH0_CLIENT_SECRET","MODARYX_TURNSTILE_SECRET","MODARYX_WEATHER_API_KEY","CLOUDFLARE_API_TOKEN"]) assert.equal(source.includes(forbidden),false,"secret env referenced by fingerprint source");

const probe=fs.readFileSync("qa/check-v2-production-evidence-origin.mjs","utf8");
assert.ok(probe.includes('json("/build-info.json")'));
assert.ok(probe.includes("MODARYX_EXPECTED_SHA"));
assert.ok(probe.includes("deployed build SHA does not match expected SHA"));
for(const forbidden of ['method:"POST"','method:"PUT"','method:"PATCH"','method:"DELETE"']) assert.equal(probe.includes(forbidden),false,"mutating method in read-only probe");

console.log("PASS_V2_BUILD_FINGERPRINT_CONTRACT");
