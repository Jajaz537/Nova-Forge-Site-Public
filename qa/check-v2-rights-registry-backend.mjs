import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  evaluateEffectiveRights,
  validateNonAuthorizingDecision,
  validateRightsCaseCreate
} from "../functions/_lib/rights-registry.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-rights-registry-backend-contract.json","utf8"));
assert.equal(contract.status,"RIGHTS_REGISTRY_BACKEND_CANDIDATE_LOCAL_PROOF");
assert.equal(contract.remoteApplication,"NOT_EXECUTED");
assert.equal(contract.productionStatus.authorizingEvidenceIngestion,"CANDIDATE_ELIGIBLE_PREFLIGHT_ONLY");
assert.equal(contract.productionStatus.contactDiscovery,"NOT_IMPLEMENTED");
assert.equal(contract.productionStatus.outbound,"NOT_IMPLEMENTED");
const inv=new Set(contract.invariants||[]);
for(const x of [
  "ADMIN_PERMISSION_REQUIRED","GENERAL_SCOPE_DECISIONS_API_CANNOT_RECORD_GRANTED_OR_GRANTED_WITH_LIMITS","AUTHORISING_DECISION_REQUIRES_ELIGIBLE_PREFLIGHT","AUTHORISING_DECISION_REQUIRES_EXPLICIT_ADMIN_CONFIRMATION",
  "NO_RESPONSE_NEVER_AUTHORIZES","EXACT_SCOPE_AND_PRODUCT_SURFACE_MATCH_REQUIRED",
  "VERIFIED_EVIDENCE_GUARDS_REQUIRED_FOR_AUTHORIZING_ROWS","WEB_AND_MODARYX_FORGE_REMAIN_SEPARATE",
  "NO_PUBLISHER_CONTACT_OR_OUTBOUND","RIGHTS_PRODUCTION_BLOCKERS_REMAIN_OPEN"
]) assert.ok(inv.has(x),"missing invariant "+x);

const validCase=validateRightsCaseCreate({
  gameId:"mx_game_aetherlands",gameName:"Aetherlands",publisherName:"Example Publisher",
  requestedScopes:["OFFICIAL_LOGO","MOD_DISTRIBUTION"],
  productSurfaces:["WEB_PUBLIC","MODARYX_FORGE"]
});
assert.equal(validCase.ok,true);
assert.equal(validateRightsCaseCreate({...validCase.value,gameId:"bad id"}).ok,false);

const caseId="mx_rights_case_"+"a".repeat(32);
const pending=validateNonAuthorizingDecision({
  caseId,rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",status:"PENDING",
  territories:["FR"],platforms:["web"],conditions:[],evidenceRefs:["policy:official-page"]
});
assert.equal(pending.ok,true);
assert.equal(validateNonAuthorizingDecision({...pending.value,status:"GRANTED"}).reason,"authorizing-decision-requires-verified-evidence-pipeline");

const baseDecision={
  decisionId:"mx_rights_decision_"+"b".repeat(32),
  rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",status:"GRANTED",
  territories:["FR"],platforms:["web"],evidenceRefs:["evidence:archived"],
  evidenceArchived:true,sourceVerified:true,conditionsSatisfied:true,assetLinked:true,
  reviewerActorKey:"rights-admin:abc",verifiedAt:"2026-10-06T09:00:00Z",
  validFrom:"2026-10-01T00:00:00Z",validUntil:"2027-10-01T00:00:00Z",
  supersedesDecisionId:null,createdAt:"2026-10-06T09:00:00Z"
};
assert.equal(evaluateEffectiveRights({
  caseState:"APPROVED",decisions:[baseDecision],rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",
  territory:"FR",platform:"web",now:"2026-10-06T10:00:00Z"
}).allowed,true);
assert.equal(evaluateEffectiveRights({
  caseState:"APPROVED",decisions:[baseDecision],rightScope:"OFFICIAL_LOGO",productSurface:"MODARYX_FORGE",
  territory:"FR",platform:"web",now:"2026-10-06T10:00:00Z"
}).allowed,false);
assert.equal(evaluateEffectiveRights({
  caseState:"NO_RESPONSE",decisions:[baseDecision],rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",
  territory:"FR",platform:"web",now:"2026-10-06T10:00:00Z"
}).allowed,false);
const revoked={...baseDecision,decisionId:"mx_rights_decision_"+"c".repeat(32),status:"REVOKED",verifiedAt:null,createdAt:"2026-10-06T09:30:00Z"};
assert.equal(evaluateEffectiveRights({
  caseState:"APPROVED",decisions:[baseDecision,revoked],rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",
  territory:"FR",platform:"web",now:"2026-10-06T10:00:00Z"
}).reason,"superior-restriction-active");

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql",
  "migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql",
  "migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql",
  "migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql",
  "migrations/0008_modaryx_v2_game_rights_registry.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T10:00:00Z";
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 caseId,"mx_game_aetherlands","Aetherlands","Example Publisher","RIGHTS_CASE_CREATED",
 '["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"CONTACT_NOT_FOUND","rights-admin:test",now,now
);

assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_rights_scope_decisions (
 decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
 allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
 evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
 reviewer_actor_key,verified_at,supersedes_decision_id,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_decision_"+"d".repeat(32),caseId,"OFFICIAL_LOGO","WEB_PUBLIC","GRANTED",
 "[]","[]","[]","[]","[]",0,null,null,'["evidence:x"]',0,0,0,0,null,null,null,now
));

db.prepare(`INSERT INTO modaryx_v2_rights_scope_decisions (
 decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
 allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
 evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
 reviewer_actor_key,verified_at,supersedes_decision_id,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_decision_"+"e".repeat(32),caseId,"OFFICIAL_LOGO","WEB_PUBLIC","PENDING",
 '["FR"]','["web"]',"[]","[]","[]",0,null,null,'["policy:official-page"]',0,0,0,0,"rights-admin:test",null,null,now
);

const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
for(const t of ["modaryx_v2_rights_cases","modaryx_v2_rights_scope_decisions","modaryx_v2_rights_audit"]) assert.ok(tables.has(t),t+" missing");

for(const p of [
  "../functions/api/v1/rights/cases/index.js",
  "../functions/api/v1/rights/scope-decisions.js",
  "../functions/api/v1/rights/effective.js",
  "../functions/api/v1/rights/authorizing-decisions.js"
]) await import(p);

const decisionEndpoint=fs.readFileSync("functions/api/v1/rights/scope-decisions.js","utf8");
assert.ok(decisionEndpoint.includes("validateNonAuthorizingDecision"));
assert.equal(/CONTACT_VERIFIED|email|mailto:|fetch\(/i.test(decisionEndpoint),false,"decision endpoint must not contact publisher");
console.log("PASS_V2_RIGHTS_REGISTRY_BACKEND_CANDIDATE");
