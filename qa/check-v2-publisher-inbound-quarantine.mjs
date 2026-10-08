import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  archivePublisherInboundCandidate,evaluatePublisherInboundEvidence,
  publisherInboundArchiveReadiness,publisherInboundNetworkReceiverImplemented
} from "../functions/_lib/publisher-inbound.mjs";

assert.equal(publisherInboundNetworkReceiverImplemented(),false);
assert.equal(publisherInboundArchiveReadiness({}).writeReady,false);

const stored=new Map();
const fakeArchive={
  async put(key,value,options){
    stored.set(key,{bytes:value instanceof Uint8Array?value:new Uint8Array(value),options});
  },
  async get(key){return stored.get(key)||null}
};
const caseId="mx_rights_case_"+"1".repeat(32);
const archived=await archivePublisherInboundCandidate(
  {MODARYX_INBOUND_ARCHIVE:fakeArchive},
  {
    caseId,logicalRequestId:"rights:aetherlands:v1",
    rawMessage:"From: licensing@publisher.example\r\n\r\nHello",
    rawHeaders:"From: licensing@publisher.example\r\nSPF: pass",
    receivedAt:"2026-10-06T11:00:00Z"
  }
);
assert.equal(archived.ok,true);
assert.equal(archived.quarantineState,"RAW_MESSAGE_QUARANTINED");
assert.equal(archived.interpretationState,"BLOCKED");
assert.equal(archived.authorizes,false);
assert.equal(stored.size,2);
for(const [key,obj] of stored){
  assert.ok(key.startsWith("v2/rights-inbound/quarantine/"+caseId+"/"));
  assert.equal(obj.options.customMetadata.quarantineState,"RAW_MESSAGE_QUARANTINED");
}
assert.match(archived.rawMessageSha256,/^[a-f0-9]{64}$/);
assert.match(archived.rawHeadersSha256,/^[a-f0-9]{64}$/);
assert.match(archived.archiveRefDigestSha256,/^[a-f0-9]{64}$/);

const blocked=evaluatePublisherInboundEvidence({
  correlationMatched:true,knownContactMatch:true,officialDomainMatch:true,
  spf:"pass",dkim:"pass",dmarc:"pass",archivePresent:true,
  attachmentScanRequired:true,attachmentScanPassed:false
});
assert.equal(blocked.readyForInterpretation,false);
assert.ok(blocked.blockers.includes("attachment-scan-pending"));

const ready=evaluatePublisherInboundEvidence({
  correlationMatched:true,knownContactMatch:true,officialDomainMatch:true,
  spf:"pass",dkim:"pass",dmarc:"pass",archivePresent:true,
  attachmentScanRequired:false
});
assert.equal(ready.readyForInterpretation,true);
assert.equal(ready.authorizes,false);

const spoofed=evaluatePublisherInboundEvidence({
  correlationMatched:true,knownContactMatch:false,officialDomainMatch:true,
  spf:"pass",dkim:"pass",dmarc:"pass",archivePresent:true
});
assert.equal(spoofed.readyForInterpretation,false);
assert.ok(spoofed.blockers.includes("provenance-unverified"));

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql","migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql","migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql","migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql","migrations/0012_modaryx_v2_publisher_inbound_quarantine.sql"
]) db.exec(fs.readFileSync(p,"utf8"));
const now="2026-10-06T11:00:00Z";
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 caseId,"mx_game_aetherlands","Aetherlands","Example Publisher","REQUEST_READY",
 '["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"CONTACT_VERIFIED","rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_publisher_inbound_envelopes (
 inbound_id,case_id,logical_request_id,raw_message_sha256,raw_headers_sha256,
 archive_ref_digest_sha256,received_at,correlation_state,provenance_state,
 quarantine_state,interpretation_state,created_by_actor_key,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_inbound_"+"2".repeat(32),caseId,"rights:aetherlands:v1",
 archived.rawMessageSha256,archived.rawHeadersSha256,archived.archiveRefDigestSha256,now,
 "CORRELATION_PENDING","PROVENANCE_UNVERIFIED","RAW_MESSAGE_QUARANTINED","BLOCKED","rights-admin:test",now
);
assert.equal(db.prepare("SELECT interpretation_state FROM modaryx_v2_publisher_inbound_envelopes").get().interpretation_state,"BLOCKED");

const source=fs.readFileSync("functions/_lib/publisher-inbound.mjs","utf8");
for(const forbidden of ["eval(","new Function","child_process","spawn(","exec(","fetch("]){
  assert.equal(source.includes(forbidden),false,"active content/network execution found: "+forbidden);
}
console.log("PASS_V2_PUBLISHER_INBOUND_QUARANTINE");
