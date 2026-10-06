import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {evaluateAuthorizingDecisionCandidate} from "../functions/_lib/rights-evidence.mjs";

const caseId="mx_rights_case_"+"a".repeat(32);
const responseId="mx_rights_response_"+"b".repeat(32);
const preflightId="mx_rights_preflight_"+"c".repeat(32);
const preflight={
  preflight_id:preflightId,case_id:caseId,response_evidence_id:responseId,
  right_scope:"OFFICIAL_LOGO",product_surface:"WEB_PUBLIC",requested_status:"GRANTED_WITH_LIMITS",
  evidence_refs_json:'["response:'+responseId+'","archive:artifact-1"]',
  conditions_json:'["credit required"]',territories_json:'["FR"]',platforms_json:'["web"]',
  valid_from:"2026-10-06T00:00:00Z",valid_until:"2027-10-06T00:00:00Z",
  asset_linked:1,conditions_satisfied:1,legal_review_ref:"legal-review:record-17",
  result:"ELIGIBLE_FOR_MANUAL_DECISION"
};
const response={
  response_evidence_id:responseId,case_id:caseId,archived:1,source_verified:1,
  review_state:"LEGAL_REVIEW_REQUIRED",
  extraction_json:'[{"rightScope":"OFFICIAL_LOGO","productSurface":"WEB_PUBLIC","status":"GRANTED_WITH_LIMITS"}]'
};
const eligible=evaluateAuthorizingDecisionCandidate({preflight,response});
assert.equal(eligible.ok,true);
assert.equal(eligible.eligible,true);
assert.equal(eligible.decision.status,"GRANTED_WITH_LIMITS");

assert.equal(evaluateAuthorizingDecisionCandidate({
  preflight:{...preflight,requested_status:"GRANTED"},
  response
}).eligible,false);
assert.ok(evaluateAuthorizingDecisionCandidate({
  preflight:{...preflight,legal_review_ref:null},
  response
}).blockers.includes("legal-review-record-missing"));
assert.ok(evaluateAuthorizingDecisionCandidate({
  preflight,
  response:{...response,source_verified:0}
}).blockers.includes("response-source-not-verified"));
assert.ok(evaluateAuthorizingDecisionCandidate({
  preflight,
  response:{...response,extraction_json:'[{"rightScope":"AUDIO_OST","productSurface":"WEB_PUBLIC","status":"GRANTED_WITH_LIMITS"}]'}
}).blockers.includes("response-does-not-support-exact-scope-status"));

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql","migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql","migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql","migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql","migrations/0012_modaryx_v2_publisher_inbound_quarantine.sql",
  "migrations/0013_modaryx_v2_authorizing_decision_audit.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T11:20:00Z";
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 caseId,"mx_game_aetherlands","Aetherlands","Example Publisher","AWAITING_RESPONSE",
 '["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"CONTACT_VERIFIED","rights-admin:test",now,now
);
const contactId="mx_rights_contact_"+"d".repeat(32);
db.prepare(`INSERT INTO modaryx_v2_rights_contact_evidence (
 contact_evidence_id,case_id,source_kind,source_url,contact_channel,contact_ref_digest_sha256,
 authority_basis,source_observed_at,verified_by_actor_key,verified_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 contactId,caseId,"official_publisher_site","https://publisher.example/contact","FORM","e".repeat(64),
 "Official publisher contact page",now,"rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_response_evidence (
 response_evidence_id,case_id,contact_evidence_id,logical_request_id,raw_message_sha256,raw_headers_sha256,
 received_at,review_state,extraction_json,source_verified,archived,created_by_actor_key,created_at
) VALUES (?,?,?,?,?,?,?,?,?,1,1,?,?)`).run(
 responseId,caseId,contactId,"rights-request-42","1".repeat(64),"2".repeat(64),now,
 "LEGAL_REVIEW_REQUIRED",response.extraction_json,"rights-admin:test",now
);
db.prepare(`INSERT INTO modaryx_v2_rights_license_preflight (
 preflight_id,case_id,response_evidence_id,right_scope,product_surface,requested_status,evidence_refs_json,
 conditions_json,territories_json,platforms_json,valid_from,valid_until,asset_linked,conditions_satisfied,
 legal_review_ref,result,reason,reviewer_actor_key,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 preflightId,caseId,responseId,"OFFICIAL_LOGO","WEB_PUBLIC","GRANTED_WITH_LIMITS",
 preflight.evidence_refs_json,preflight.conditions_json,preflight.territories_json,preflight.platforms_json,
 preflight.valid_from,preflight.valid_until,1,1,preflight.legal_review_ref,"ELIGIBLE_FOR_MANUAL_DECISION",null,"rights-admin:test",now
);

const decisionId="mx_rights_decision_"+"f".repeat(32);
db.prepare(`INSERT INTO modaryx_v2_rights_scope_decisions (
 decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
 allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
 evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
 reviewer_actor_key,verified_at,supersedes_decision_id,created_at
) VALUES (?,?,?,?,?,?,?,'[]','[]',?,0,?,?,?,1,1,1,1,?,?,NULL,?)`).run(
 decisionId,caseId,"OFFICIAL_LOGO","WEB_PUBLIC","GRANTED_WITH_LIMITS",
 preflight.territories_json,preflight.platforms_json,preflight.conditions_json,preflight.valid_from,preflight.valid_until,
 preflight.evidence_refs_json,"rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_authorizing_reviews (
 authorizing_review_id,decision_id,case_id,preflight_id,response_evidence_id,right_scope,
 product_surface,status,legal_review_ref_digest_sha256,source_snapshot_sha256,reviewer_actor_key,confirmed_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_authorizing_review_"+"9".repeat(32),decisionId,caseId,preflightId,responseId,
 "OFFICIAL_LOGO","WEB_PUBLIC","GRANTED_WITH_LIMITS","3".repeat(64),"4".repeat(64),"rights-admin:test",now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_rights_authorizing_reviews (
 authorizing_review_id,decision_id,case_id,preflight_id,response_evidence_id,right_scope,
 product_surface,status,legal_review_ref_digest_sha256,source_snapshot_sha256,reviewer_actor_key,confirmed_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_authorizing_review_"+"8".repeat(32),decisionId,caseId,preflightId,responseId,
 "OFFICIAL_LOGO","WEB_PUBLIC","GRANTED_WITH_LIMITS","3".repeat(64),"4".repeat(64),"rights-admin:test",now
));

const endpoint=fs.readFileSync("functions/api/v1/rights/authorizing-decisions.js","utf8");
assert.ok(endpoint.includes("AUTHORIZE_EXACT_PREFLIGHT_SCOPE"));
assert.ok(endpoint.includes("evaluateAuthorizingDecisionCandidate"));
assert.equal(/mailto:|fetch\(|sendgrid|mailgun|postmark|resend/i.test(endpoint),false);
assert.equal(endpoint.includes("access.body.rightScope"),false);
assert.equal(endpoint.includes("access.body.status"),false);

console.log("PASS_V2_AUTHORIZING_DECISION_CANDIDATE");
