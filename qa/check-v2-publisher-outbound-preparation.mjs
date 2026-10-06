import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  evaluatePublisherOutboundReadiness,
  publisherOutboundNetworkDispatchImplemented,
  validatePublisherOutboundPreparation
} from "../functions/_lib/publisher-outbound.mjs";

const digest="a".repeat(64);
const base={
  caseId:"mx_rights_case_"+"1".repeat(32),
  contactEvidenceId:"mx_rights_contact_"+"2".repeat(32),
  logicalRequestId:"rights:aetherlands:v1",
  requestVersion:1,templateVersion:"publisher-rights-v1",
  requestedScopes:["OFFICIAL_LOGO"],productSurfaces:["WEB_PUBLIC"],
  contactChannel:"EMAIL",idempotencyKeySha256:digest
};
assert.equal(validatePublisherOutboundPreparation(base).ok,true);
assert.equal(validatePublisherOutboundPreparation({...base,idempotencyKeySha256:"bad"}).ok,false);
assert.equal(validatePublisherOutboundPreparation({...base,contactChannel:"SOCIAL_DM"}).ok,false);
assert.equal(publisherOutboundNetworkDispatchImplemented(),false);

const ready=evaluatePublisherOutboundReadiness({
  caseState:"CONTACT_VERIFIED",contactState:"CONTACT_VERIFIED",contactChannel:"EMAIL",
  contactRefDigestSha256:digest,requestedScopes:["OFFICIAL_LOGO"],productSurfaces:["WEB_PUBLIC"],
  caseRequestedScopes:["OFFICIAL_LOGO","OFFICIAL_KEY_ART"],caseProductSurfaces:["WEB_PUBLIC"],
  suppressionActive:false,providerAvailable:false,templateCurrent:true
});
assert.equal(ready.readyForPreparation,true);
assert.equal(ready.readyForQueue,false);
assert.ok(ready.blockers.includes("outbound-provider-not-implemented"));

assert.equal(evaluatePublisherOutboundReadiness({
  caseState:"CONTACT_VERIFIED",contactState:"CONTACT_VERIFIED",contactChannel:"EMAIL",
  contactRefDigestSha256:digest,requestedScopes:["OFFICIAL_LOGO"],productSurfaces:["WEB_PUBLIC"],
  caseRequestedScopes:["OFFICIAL_LOGO"],caseProductSurfaces:["WEB_PUBLIC"],
  suppressionActive:true,providerAvailable:false,templateCurrent:true
}).readyForPreparation,false);

assert.equal(evaluatePublisherOutboundReadiness({
  caseState:"CONTACT_VERIFIED",contactState:"CONTACT_VERIFIED",contactChannel:"EMAIL",
  contactRefDigestSha256:digest,requestedScopes:["AUDIO_OST"],productSurfaces:["WEB_PUBLIC"],
  caseRequestedScopes:["OFFICIAL_LOGO"],caseProductSurfaces:["WEB_PUBLIC"],
  suppressionActive:false,providerAvailable:false,templateCurrent:true
}).readyForPreparation,false);

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
  "migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T10:45:00Z";
const caseId=base.caseId, contactId=base.contactEvidenceId;
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 caseId,"mx_game_aetherlands","Aetherlands","Example Publisher","CONTACT_VERIFIED",
 '["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"CONTACT_VERIFIED","rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_contact_evidence (
 contact_evidence_id,case_id,source_kind,source_url,contact_channel,contact_ref_digest_sha256,
 authority_basis,source_observed_at,verified_by_actor_key,verified_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 contactId,caseId,"official_legal_or_licensing_page","https://publisher.example/licensing","EMAIL",
 digest,"Official licensing page",now,"rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_publisher_outbound_requests (
 outbound_request_id,case_id,contact_evidence_id,logical_request_id,request_version,
 template_version,requested_scopes_json,product_surfaces_json,contact_channel,
 contact_ref_digest_sha256,idempotency_key_sha256,state,provider_kind,
 provider_message_id_digest_sha256,prepared_by_actor_key,prepared_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,'REQUEST_READY',NULL,NULL,?,?,?)`).run(
 "mx_rights_outbound_"+"3".repeat(32),caseId,contactId,"rights:aetherlands:v1",1,
 "publisher-rights-v1",'["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"EMAIL",digest,digest,
 "rights-admin:test",now,now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_publisher_outbound_requests (
 outbound_request_id,case_id,contact_evidence_id,logical_request_id,request_version,
 template_version,requested_scopes_json,product_surfaces_json,contact_channel,
 contact_ref_digest_sha256,idempotency_key_sha256,state,provider_kind,
 provider_message_id_digest_sha256,prepared_by_actor_key,prepared_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,'REQUEST_READY',NULL,NULL,?,?,?)`).run(
 "mx_rights_outbound_"+"4".repeat(32),caseId,contactId,"rights:aetherlands:v2",1,
 "publisher-rights-v1",'["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"EMAIL",digest,digest,
 "rights-admin:test",now,now
));

const source=fs.readFileSync("functions/_lib/publisher-outbound.mjs","utf8");
for(const forbidden of ["fetch(","https://api.","sendgrid","mailgun","postmark","resend","smtp","nodemailer"]){
  assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()),false,"network/provider implementation found: "+forbidden);
}
const endpoint=fs.readFileSync("functions/api/v1/rights/outbound/prepare.js","utf8");
assert.equal(/emailAddress|recipientAddress|rawContact|smtp|fetch\(/i.test(endpoint),false,"raw contact or network send found");
console.log("PASS_V2_PUBLISHER_OUTBOUND_PREPARATION");
