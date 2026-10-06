import assert from "node:assert/strict";
import fs from "node:fs";

const m=JSON.parse(fs.readFileSync("qa/modaryx-v2-production-activation-manifest.json","utf8"));
assert.equal(m.schemaVersion,1);
assert.equal(m.status,"PREPARED_NOT_EXECUTED");
assert.equal(m.productionPass,false);
assert.equal(m.cutoverAuthorized,false);

const ids=m.activationUnits.map(x=>x.id);
assert.deepEqual(ids,[
  "d1-remote-schema","artifact-storage-r2","auth-passkeys","external-notifications",
  "pwa-production","field-cwv","weather-provider","public-cutover"
]);
for(const unit of m.activationUnits) assert.equal(unit.automatic,false,unit.id+" must never auto-activate");

const d1=m.activationUnits.find(x=>x.id==="d1-remote-schema");
assert.ok(d1.exactInputs.includes("qa/modaryx-v2-d1-migration-execution-manifest.json"));
assert.ok(d1.requiredBeforeProduction.includes("SEPARATE_EXPLICIT_PRODUCTION_APPROVAL"));

const pwa=m.activationUnits.find(x=>x.id==="pwa-production");
assert.equal(pwa.buildFlag,"VITE_MODARYX_PWA_PRODUCTION=1");

const cwv=m.activationUnits.find(x=>x.id==="field-cwv");
assert.equal(cwv.clientFlag,"VITE_MODARYX_FIELD_CWV=1");
assert.equal(cwv.serverFlag,"MODARYX_CWV_RUM_ENABLED=1");
assert.equal(cwv.retentionFlag,"MODARYX_CWV_RETENTION_ENABLED=1");
assert.deepEqual(cwv.retentionDaysBounds,[7,90]);

const notifications=m.activationUnits.find(x=>x.id==="external-notifications");
assert.equal(notifications.requiredProviderState,"CONFIGURED_PRODUCTION_APPROVED");
assert.equal(notifications.state,"BLOCKED_CANDIDATES_SELECTED_NOT_IMPLEMENTED_OR_APPROVED");
assert.equal(notifications.candidateProviders.email,"Cloudflare Email Service");
assert.equal(notifications.candidateProviders.push,"Web Push standard + VAPID");

const weather=m.activationUnits.find(x=>x.id==="weather-provider");
assert.ok(weather.allowedModes.includes("off"));
assert.equal(weather.state,"OPTIONAL_OFF_UNLESS_EXPLICITLY_APPROVED");

const cutover=m.activationUnits.find(x=>x.id==="public-cutover");
assert.equal(cutover.state,"NOT_AUTHORIZED");
assert.ok(cutover.requiredBeforeCutover.includes("ALL_REQUIRED_VF_BLOCKERS_CLOSED"));

const inv=new Set(m.invariants||[]);
for(const x of [
  "NO_REMOTE_MUTATION_BY_THIS_MANIFEST","NO_D1_REMOTE_APPLY","NO_PROVIDER_ACTIVATION",
  "NO_PWA_PRODUCTION_ENABLE","NO_FIELD_CWV_ENABLE","NO_INDEXABILITY_CHANGE",
  "NO_CLOUDFLARE_CRITICAL_CHANGE","NO_CUTOVER",
  "ALL_19_REAL_EXTERNAL_PRODUCTION_BLOCKERS_REMAIN_OPEN_UNTIL_SEPARATE_EVIDENCE"
]) assert.ok(inv.has(x),"missing invariant "+x);

const raw=fs.readFileSync("qa/modaryx-v2-production-activation-manifest.json","utf8").toLowerCase();
for(const forbidden of [
  "wrangler d1 execute","--remote","cloudflare api token","curl -x post","curl -x put",
  "curl -x patch","curl -x delete","serviceworker.register("
]) assert.equal(raw.includes(forbidden),false,"mutation token in manifest: "+forbidden);

const pwaContract=JSON.parse(fs.readFileSync("qa/modaryx-v2-pwa-candidate-contract.json","utf8"));
assert.equal(pwaContract.activationFlag,"VITE_MODARYX_PWA_PRODUCTION");
assert.equal(pwaContract.productionCutover,"OPEN");
const cwvContract=JSON.parse(fs.readFileSync("qa/modaryx-v2-cwv-rum-contract.json","utf8"));
assert.equal(cwvContract.serverEnableFlag,"MODARYX_CWV_RUM_ENABLED=1");
assert.equal(cwvContract.defaultClientEnabled,false);
const retention=JSON.parse(fs.readFileSync("qa/modaryx-v2-cwv-retention-contract.json","utf8"));
assert.equal(retention.productionApproval,"OPEN");
assert.equal(retention.minimumDays,7);
assert.equal(retention.maximumDays,90);
const delivery=JSON.parse(fs.readFileSync("qa/modaryx-v2-notification-delivery-contract.json","utf8"));
assert.equal(delivery.dispatchImplementation,"NOT_IMPLEMENTED");
assert.equal(delivery.providerSelection,"TECHNICAL_CANDIDATES_SELECTED_NOT_PRODUCTION_APPROVED");
const readiness=JSON.parse(fs.readFileSync("qa/modaryx-v2-production-readiness-contract.json","utf8"));
assert.equal(readiness.productionPass,false);
assert.equal(readiness.closesNoBlockerByItself,true);

console.log("ACTIVATION_UNIT_COUNT",m.activationUnits.length);
console.log("PASS_V2_PRODUCTION_ACTIVATION_MANIFEST");
