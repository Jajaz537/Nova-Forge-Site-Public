import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  normalizeGameSupportKey,
  validateGameSupportRequest,
  validateGameSupportTriage
} from "../functions/_lib/game-support.mjs";

assert.equal(normalizeGameSupportKey("  Échos du Nord!  "),"echos-du-nord");
const request=validateGameSupportRequest({
  gameName:"Échos du Nord",platforms:["PC"],publisher:"Publisher Example",reason:"Support mods",
  sourceUrls:["https://example.invalid/game"]
});
assert.equal(request.ok,true);
assert.equal(validateGameSupportRequest({...request.value,publisherApproval:true}).reason,"member-rights-claim-forbidden");
assert.equal(validateGameSupportRequest({gameName:"A",platforms:["PC"]}).ok,false);

const checks={
  gameExists:true,duplicateRequest:false,moddingRelevance:true,knownRestrictionsReviewed:true,
  productFeasibility:true,securityRiskReviewed:true,legalRiskReviewed:true
};
const requestId="mx_game_support_request_"+"a".repeat(32);
const accepted=validateGameSupportTriage({
  requestId,decision:"ACCEPTED_SAFE_BASELINE",decisionReason:"Fit produit confirmé",
  triageChecks:checks,gameId:"mx_game_echoes",publisherName:"Publisher Example",
  requestedScopes:["OFFICIAL_LOGO","MOD_DISTRIBUTION"],productSurfaces:["WEB_PUBLIC","MODARYX_FORGE"]
});
assert.equal(accepted.ok,true);
assert.equal(validateGameSupportTriage({...accepted.value,status:"GRANTED"}).ok,true);
assert.equal(validateGameSupportTriage({
  ...accepted.value,triageChecks:{...checks,legalRiskReviewed:false}
}).reason,"game-support-acceptance-triage-incomplete");

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql",
  "migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql",
  "migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql",
  "migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql",
  "migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T10:10:00Z";
db.prepare(`INSERT INTO modaryx_v2_game_support_requests (
 request_id,requester_identity_sub,requester_actor_key,game_name,normalized_game_key,platforms_json,
 developer_name,publisher_name,reason,source_urls_json,state,triage_json,decision_reason,game_id,
 rights_case_id,safe_baseline_allowed,created_at,updated_at,decided_at
) VALUES (?,?,?,?,?,?,?,?,?,?,'REQUESTED','{}',NULL,NULL,NULL,0,?,?,NULL)`).run(
 requestId,"auth0|member","game-support:key","Échos du Nord","echos-du-nord",'["PC"]',
 null,"Publisher Example","Support mods",'["https://example.invalid/game"]',now,now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_game_support_requests (
 request_id,requester_identity_sub,requester_actor_key,game_name,normalized_game_key,platforms_json,
 developer_name,publisher_name,reason,source_urls_json,state,triage_json,decision_reason,game_id,
 rights_case_id,safe_baseline_allowed,created_at,updated_at,decided_at
) VALUES (?,?,?,?,?,?,?,?,?,?,'REQUESTED','{}',NULL,NULL,NULL,0,?,?,NULL)`).run(
 "mx_game_support_request_"+"b".repeat(32),"auth0|other","game-support:key2","Echos du Nord","echos-du-nord",'["PC"]',
 null,null,"dup","[]",now,now
));

const caseId="mx_rights_case_"+"c".repeat(32);
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?, 'RIGHTS_CASE_CREATED', ?, ?, 'CONTACT_NOT_FOUND', ?, ?, ?)`).run(
 caseId,"mx_game_echoes","Échos du Nord","Publisher Example",'["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"rights-admin:test",now,now
);
db.prepare(`UPDATE modaryx_v2_game_support_requests
 SET state='ACCEPTED_SAFE_BASELINE',triage_json=?,decision_reason=?,game_id=?,rights_case_id=?,
 safe_baseline_allowed=1,publisher_name=?,updated_at=?,decided_at=? WHERE request_id=?`).run(
 JSON.stringify(checks),"Fit produit confirmé","mx_game_echoes",caseId,"Publisher Example",now,now,requestId
);
db.prepare(`INSERT INTO modaryx_v2_game_support_records (
 support_id,request_id,game_id,game_name,rights_case_id,safe_baseline_allowed,
 official_assets_allowed,partnership_claim_allowed,forge_permission_inferred,created_at,updated_at
) VALUES (?,?,?,?,?,1,0,0,0,?,?)`).run(
 "mx_game_support_"+"d".repeat(32),requestId,"mx_game_echoes","Échos du Nord",caseId,now,now
);

const support=db.prepare("SELECT * FROM modaryx_v2_game_support_records WHERE request_id=?").get(requestId);
assert.equal(support.safe_baseline_allowed,1);
assert.equal(support.official_assets_allowed,0);
assert.equal(support.partnership_claim_allowed,0);
assert.equal(support.forge_permission_inferred,0);

const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
for(const t of ["modaryx_v2_game_support_requests","modaryx_v2_game_support_records"]) assert.ok(tables.has(t),t+" missing");

for(const p of [
  "../functions/api/v1/game-support/requests.js",
  "../functions/api/v1/game-support/admin/requests.js",
  "../functions/api/v1/game-support/triage.js"
]) await import(p);

const triageSource=fs.readFileSync("functions/api/v1/game-support/triage.js","utf8");
assert.equal(/mailto:|https:\/\/|fetch\(/i.test(triageSource),false,"triage endpoint must not contact publishers");
assert.ok(triageSource.includes("recordInAppNotification"));
console.log("PASS_V2_GAME_SUPPORT_BACKEND_CANDIDATE");
