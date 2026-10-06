import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  evaluateLicensePreflight,
  interpretPublisherResponseEvidence,
  validateOfficialContactEvidence
} from "../functions/_lib/rights-evidence.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-rights-evidence-preflight-contract.json","utf8"));
assert.equal(contract.status,"RIGHTS_EVIDENCE_PREFLIGHT_CANDIDATE_LOCAL_PROOF");
assert.equal(contract.remoteApplication,"NOT_EXECUTED");
assert.equal(contract.productionStatus.publisherOutbound,"NOT_IMPLEMENTED");
assert.equal(contract.productionStatus.authorizingDecisionWrite,"NOT_IMPLEMENTED");

const caseId="mx_rights_case_"+"a".repeat(32);
const contactId="mx_rights_contact_"+"b".repeat(32);
const responseId="mx_rights_response_"+"c".repeat(32);
const digest="d".repeat(64);

const contact=validateOfficialContactEvidence({
  caseId,sourceKind:"official_legal_or_licensing_page",sourceUrl:"https://publisher.example/legal/licensing",
  contactChannel:"FORM",contactRefDigestSha256:digest,authorityBasis:"Official licensing contact published by the publisher.",
  observedAt:"2026-10-06T10:40:00Z"
});
assert.equal(contact.ok,true);
assert.equal(validateOfficialContactEvidence({...contact.value,sourceKind:"scraped_unverified_contact"}).reason,"contact-source-not-official");
assert.equal(validateOfficialContactEvidence({...contact.value,sourceUrl:"http://publisher.example/contact"}).ok,false);

const granted=interpretPublisherResponseEvidence({
  caseId,contactEvidenceId:contactId,logicalRequestId:"rights-request-42",rawMessageSha256:"e".repeat(64),
  rawHeadersSha256:"f".repeat(64),receivedAt:"2026-10-06T10:45:00Z",
  scopes:[{rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",status:"GRANTED",territories:["FR"],platforms:["web"],conditions:["credit required"],wordingEvidenceRefs:["raw-message:line-12"],validUntil:"2027-10-06T00:00:00Z"}]
});
assert.equal(granted.ok,true);
assert.equal(granted.value.reviewState,"LEGAL_REVIEW_REQUIRED");
assert.equal(granted.authorizes,false);

const denied=interpretPublisherResponseEvidence({
  caseId,contactEvidenceId:contactId,logicalRequestId:"rights-request-43",rawMessageSha256:"1".repeat(64),
  rawHeadersSha256:"2".repeat(64),receivedAt:"2026-10-06T10:46:00Z",
  scopes:[{rightScope:"MOD_DISTRIBUTION",productSurface:"MODARYX_FORGE",status:"DENIED",territories:[],platforms:[],conditions:[],wordingEvidenceRefs:["raw-message:line-3"]}]
});
assert.equal(denied.value.reviewState,"SAFE_NON_AUTHORIZING");

const blocked=evaluateLicensePreflight({
  caseId,responseEvidenceId:responseId,rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",status:"GRANTED",
  evidenceRefs:["response:"+responseId],conditions:["credit required"],territories:["FR"],platforms:["web"],
  validFrom:"2026-10-06T00:00:00Z",validUntil:"2027-10-06T00:00:00Z",
  assetLinked:true,conditionsSatisfied:true
},{responseArchived:true,responseSourceVerified:true,contactVerified:true});
assert.equal(blocked.ok,true);
assert.equal(blocked.result,"BLOCKED");
assert.equal(blocked.reason,"legal-review-record-missing");
assert.equal(blocked.authorizes,false);

const eligible=evaluateLicensePreflight({
  caseId,responseEvidenceId:responseId,rightScope:"OFFICIAL_LOGO",productSurface:"WEB_PUBLIC",status:"GRANTED_WITH_LIMITS",
  evidenceRefs:["response:"+responseId,"archive:artifact-1"],conditions:["credit required"],territories:["FR"],platforms:["web"],
  validFrom:"2026-10-06T00:00:00Z",validUntil:"2027-10-06T00:00:00Z",
  assetLinked:true,conditionsSatisfied:true,legalReviewRef:"legal-review:record-17"
},{responseArchived:true,responseSourceVerified:true,contactVerified:true});
assert.equal(eligible.result,"ELIGIBLE_FOR_MANUAL_DECISION");
assert.equal(eligible.authorizes,false);

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
  "migrations/0009_modaryx_v2_game_support_requests.sql",
  "migrations/0010_modaryx_v2_rights_evidence.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T10:50:00Z";
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 caseId,"mx_game_aetherlands","Aetherlands","Example Publisher","RIGHTS_CASE_CREATED",
 '["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"CONTACT_NOT_FOUND","rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_contact_evidence (
 contact_evidence_id,case_id,source_kind,source_url,contact_channel,contact_ref_digest_sha256,
 authority_basis,source_observed_at,verified_by_actor_key,verified_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 contactId,caseId,"official_publisher_site","https://publisher.example/contact","FORM",digest,
 "Official publisher contact page",now,"rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_response_evidence (
 response_evidence_id,case_id,contact_evidence_id,logical_request_id,raw_message_sha256,raw_headers_sha256,
 received_at,review_state,extraction_json,source_verified,archived,created_by_actor_key,created_at
) VALUES (?,?,?,?,?,?,?,?,?,1,1,?,?)`).run(
 responseId,caseId,contactId,"rights-request-42","e".repeat(64),"f".repeat(64),now,
 "LEGAL_REVIEW_REQUIRED",'[{"rightScope":"OFFICIAL_LOGO","productSurface":"WEB_PUBLIC","status":"GRANTED"}]',
 "rights-admin:test",now
);
const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
for(const t of ["modaryx_v2_rights_contact_evidence","modaryx_v2_rights_response_evidence","modaryx_v2_rights_license_preflight"]) assert.ok(tables.has(t),t+" missing");

for(const p of [
  "functions/api/v1/rights/contact-evidence.js",
  "functions/api/v1/rights/response-evidence.js",
  "functions/api/v1/rights/license-preflight.js"
]){
  const source=fs.readFileSync(p,"utf8");
  assert.equal(/mailto:|fetch\(|sendgrid|mailgun|postmark|resend/i.test(source),false,p+" must not contact publisher/provider");
}
const preflightSource=fs.readFileSync("functions/api/v1/rights/license-preflight.js","utf8");
assert.equal(preflightSource.includes("modaryx_v2_rights_scope_decisions"),false,"preflight must never write an authorizing decision");

console.log("PASS_V2_RIGHTS_EVIDENCE_PREFLIGHT");
