import fs from "node:fs";

const path = "qa/modaryx-v2-publisher-inbound-contract.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

for (const state of [
  "INBOUND_RECEIVED","CORRELATION_PENDING","CORRELATED","PROVENANCE_UNVERIFIED",
  "PROVENANCE_VERIFIED","ATTACHMENT_QUARANTINED","READY_FOR_INTERPRETATION",
  "LEGAL_REVIEW_REQUIRED","REJECTED_UNTRUSTED"
]) {
  if (!(data.inboundStates || []).includes(state)) throw new Error("missing inbound state: " + state);
}

for (const evidence of [
  "rights_case_id","logical_request_id","message_id","in_reply_to","references","thread_token"
]) {
  if (!(data.correlationEvidence || []).includes(evidence)) throw new Error("missing correlation evidence: " + evidence);
}

for (const signal of [
  "sender_address","sender_domain","raw_headers","spf_result","dkim_result","dmarc_result",
  "known_contact_match","official_domain_match"
]) {
  if (!(data.provenanceSignals || []).includes(signal)) throw new Error("missing provenance signal: " + signal);
}

for (const guard of [
  "quarantine_before_open","hash_before_processing","malware_scan_before_use",
  "no_macro_execution","no_script_execution","no_external_active_content_execution"
]) {
  if (!(data.attachmentGuards || []).includes(guard)) throw new Error("missing attachment guard: " + guard);
}

for (const blocked of [
  "grant_rights_from_transport_success",
  "grant_rights_from_sender_name_only",
  "grant_rights_from_spf_dkim_dmarc_only",
  "trust_unmatched_attachment",
  "execute_attachment_content",
  "create_new_contact_from_guess",
  "merge_web_and_forge_rights",
  "discard_raw_message_after_parsing"
]) {
  if (!(data.automaticActionsBlocked || []).includes(blocked)) throw new Error("missing blocked action: " + blocked);
}

for (const invariant of [
  "INBOUND_TRANSPORT_NEVER_GRANTS_RIGHTS",
  "CORRELATION_REQUIRED_BEFORE_AUTOMATED_INTERPRETATION",
  "PROVENANCE_SIGNAL_IS_NOT_LEGAL_AUTHORITY",
  "UNMATCHED_RESPONSE_FAILS_CLOSED",
  "ATTACHMENTS_ARE_QUARANTINED_BEFORE_PROCESSING",
  "RAW_MESSAGE_AND_HEADERS_ARE_PRESERVED",
  "UNKNOWN_SENDER_NEVER_BECOMES_VERIFIED_BY_GUESS",
  "WEB_AND_FORGE_RIGHTS_REMAIN_SEPARATE",
  "AMBIGUOUS_OR_UNTRUSTED_INBOUND_REQUIRES_REVIEW",
  "RESPONSE_INTERPRETATION_CONTRACT_REMAINS_SEPARATE"
]) {
  if (!(data.invariants || []).includes(invariant)) throw new Error("missing invariant: " + invariant);
}

for (const [key, value] of Object.entries(data.productionStatus || {})) {
  if (value !== "NOT_IMPLEMENTED") {
    throw new Error("production status must remain honest before implementation: " + key);
  }
}

console.log("PUBLISHER_INBOUND_STATE_COUNT", data.inboundStates.length);
console.log("PUBLISHER_INBOUND_CORRELATION_EVIDENCE_COUNT", data.correlationEvidence.length);
console.log("PUBLISHER_INBOUND_PROVENANCE_SIGNAL_COUNT", data.provenanceSignals.length);
console.log("PUBLISHER_INBOUND_INVARIANT_COUNT", data.invariants.length);
console.log("PASS_V2_PUBLISHER_INBOUND_CONTRACT");
