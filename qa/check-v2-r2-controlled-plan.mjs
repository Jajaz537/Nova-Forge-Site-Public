import assert from "node:assert/strict";
import fs from "node:fs";

const file=".github/workflows/modaryx-v2-r2-dev-controlled-apply.yml";
const raw=fs.readFileSync(file,"utf8");

assert.match(raw,/^on:\n  workflow_dispatch:\n/m);
assert.equal(/^\s+push:/m.test(raw),false,"controlled R2 workflow must not auto-run");
assert.ok(raw.includes("CLOUDFLARE_R2_API_TOKEN"));
assert.ok(raw.includes("CLOUDFLARE_PAGES_API_TOKEN"));
assert.ok(raw.includes("R2_DEV_BUCKET: modaryx-v2-artifacts-dev"));
assert.ok(raw.includes("R2_BINDING: MODARYX_ARTIFACTS"));

for(const required of [
  "PAGES_PRODUCTION_R2_BINDING=ABSENT",
  "R2_EXACT_DEV_BUCKET_PRESTATE=ABSENT",
  "R2_DEV_BUCKET_CREATE=SUCCESS",
  "R2_PREVIEW_BINDING=SUCCESS",
  "R2_PRODUCTION_BINDING=ABSENT",
  "PAGES_NON_R2_CONFIG_UNCHANGED=yes",
  "R2_DIRECT_WRITE_READ_HASH=SUCCESS",
  "R2_REAL_BINDING_ADAPTER_READ=SUCCESS",
  "R2_REVOKED_DENY=SUCCESS",
  "R2_PROOF_OBJECT_CLEANUP=SUCCESS",
  "PRODUCTION_PASS_REMAINS_FALSE=yes",
  "Roll back bucket and preview binding if proof fails",
  "PASS_MODARYX_V2_CONTROLLED_R2_DEV_ACTIVATION"
]) assert.ok(raw.includes(required),"missing controlled R2 guard: "+required);

assert.match(raw,/deployment_configs:\{preview:\{r2_buckets:\$r2\}\}/);
assert.equal(/deployment_configs:\{production:\{r2_buckets/.test(raw),false,"workflow must never configure production R2");
assert.ok(raw.includes("test \"$after_production\" = \"$PRODUCTION_CONFIG_HASH\""));
assert.ok(raw.includes("test \"$d1_after_hash\" = \"$PREVIEW_D1_ID_SHA256\""));
assert.ok(raw.includes('if: failure()'));
assert.ok(raw.includes("ROLLBACK_PREVIEW_BINDING=attempted"));
assert.ok(raw.includes("ROLLBACK_BUCKET=attempted"));

for(const forbidden of [
  "dns_records",
  "dnssec",
  "nameservers",
  "git push origin main",
  "productionBinding:true",
  "productionApproval:\"APPROVED\""
]) assert.equal(raw.toLowerCase().includes(forbidden.toLowerCase()),false,"forbidden R2 plan token: "+forbidden);

const endpoint=fs.readFileSync("functions/api/v1/qa/r2-proof.js","utf8");
assert.ok(endpoint.includes("readArtifactCandidate"));
assert.ok(endpoint.includes("artifactStorageReadiness"));
assert.ok(endpoint.includes('distributionState:"revoked"'));
assert.ok(endpoint.includes('downloadable:false'));
assert.equal(/onRequest(Post|Put|Delete)/.test(endpoint),false,"QA proof endpoint must remain GET-only");

console.log("PASS_V2_CONTROLLED_R2_DEV_PLAN");
