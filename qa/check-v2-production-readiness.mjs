import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {productionReadinessState,requiredProductionTables} from "../functions/_lib/production-readiness.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-production-readiness-contract.json","utf8"));
assert.equal(contract.status,"PRE_CUTOVER_READ_ONLY_CANDIDATE");
assert.equal(contract.productionPass,false);
assert.equal(contract.closesNoBlockerByItself,true);
assert.equal(requiredProductionTables().length,31);
assert.equal(contract.requiredCurrentV2TableCount,31);
const inv=new Set(contract.invariants||[]);
for(const x of [
  "NO_SECRET_VALUES_RETURNED","NO_REMOTE_MUTATION","NO_SCHEMA_MIGRATION","D1_SCHEMA_CHECK_IS_READ_ONLY",
  "PRODUCTION_PASS_ALWAYS_FALSE","AUTH_CONFIG_NEVER_EQUALS_PASSKEY_PROOF",
  "CWV_COLLECTOR_READY_NEVER_EQUALS_FIELD_P75_PROOF","NO_CUTOVER"
]) assert.ok(inv.has(x),"missing invariant "+x);

const empty=await productionReadinessState({});
assert.equal(empty.productionPass,false);
assert.equal(empty.secretsReturned,false);
assert.equal(empty.remoteMutationPerformed,false);
assert.equal(empty.technical.d1Schema.ready,false);
assert.equal(empty.blockerHints["cutover"],"OPEN_EXPLICIT_CUTOVER");

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql","migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql","migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql","migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql","migrations/0012_modaryx_v2_publisher_inbound_quarantine.sql",
  "migrations/0013_modaryx_v2_authorizing_decision_audit.sql","migrations/0014_modaryx_v2_cwv_rum.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const d1={
  prepare(sql){
    const statement=db.prepare(sql);
    let args=[];
    return {
      bind(...values){args=values;return this;},
      async all(){return {results:statement.all(...args)}}
    };
  }
};
const fakeArtifacts={get(){},put(){},delete(){}};
const env={
  MODARYX_DB:d1,
  MODARYX_ARTIFACTS:fakeArtifacts,
  AUTH0_ISSUER_BASE_URL:"https://tenant.example/",
  AUTH0_AUDIENCE:"https://api.example/",
  AUTH0_CLIENT_ID:"sentinel-client-93x",
  AUTH0_CLIENT_SECRET:"sentinel-auth-secret-8f4",
  MODARYX_TURNSTILE_SECRET:"sentinel-turnstile-7c2",
  MODARYX_TURNSTILE_SITE_KEY:"sentinel-site-key-5b1",
  MODARYX_CWV_RUM_ENABLED:"1"
};
const ready=await productionReadinessState(env);
assert.equal(ready.productionPass,false);
assert.equal(ready.technical.backendFoundation.ready,true);
assert.equal(ready.technical.d1Schema.ready,true);
assert.equal(ready.technical.d1Schema.presentCount,31);
assert.equal(ready.technical.artifactStorage.readReady,true);
assert.equal(ready.technical.artifactStorage.writeReady,true);
assert.equal(ready.technical.cwv.collectorState,"READY_FOR_FIELD_TRAFFIC");
assert.equal(ready.technical.cwv.productionP75,"OPEN_REAL_TRAFFIC_REQUIRED");
assert.equal(ready.blockerHints["auth-passkeys-real"],"OPEN_REAL_DEVICE_PASSKEY_PROOF");
assert.equal(ready.blockerHints["core-web-vitals-production"],"OPEN_REAL_TRAFFIC_P75_PROOF");
assert.equal(ready.blockerHints["pwa-service-worker-production"],"OPEN_PRODUCTION_ACTIVATION_PROOF");
assert.equal(ready.blockerHints["cutover"],"OPEN_EXPLICIT_CUTOVER");

const serialized=JSON.stringify(ready);
for(const sentinel of ["tenant.example","https://api.example/","sentinel-client-93x","sentinel-auth-secret-8f4","sentinel-turnstile-7c2","sentinel-site-key-5b1"]) assert.equal(serialized.includes(sentinel),false,"config/secret leaked: "+sentinel);

const endpoint=fs.readFileSync("functions/api/v1/production/readiness.js","utf8");
assert.equal(/POST|PUT|PATCH|DELETE/.test(endpoint),false,"readiness endpoint must remain GET only");
console.log("PASS_V2_PRODUCTION_READINESS_CANDIDATE");
