import fs from "node:fs";

const path = "qa/modaryx-v2-publisher-response-contract.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

for (const state of ["SAFE_AUTOMATION","NEEDS_REVIEW","LEGAL_REVIEW_REQUIRED","DENIED"]) {
  if (!(data.interpretationStates || []).includes(state)) throw new Error("missing interpretation state: " + state);
}

for (const status of ["GRANTED","GRANTED_WITH_LIMITS","DENIED","UNADDRESSED","EXPIRED","REVOKED"]) {
  if (!(data.scopeStatuses || []).includes(status)) throw new Error("missing scope status: " + status);
}

for (const evidence of ["raw_message","message_provenance","rights_case_id","matched_request_version","received_at"]) {
  if (!(data.requiredEvidence || []).includes(evidence)) throw new Error("missing evidence: " + evidence);
}

for (const blocked of [
  "infer_global_approval",
  "treat_unaddressed_as_granted",
  "accept_ambiguous_legal_clause",
  "extend_scope_beyond_written_terms",
  "merge_web_and_forge_rights",
  "override_expiry_or_revocation"
]) {
  if (!(data.automaticActionsBlocked || []).includes(blocked)) throw new Error("missing blocked action: " + blocked);
}

for (const invariant of [
  "UNADDRESSED_NEVER_EQUALS_GRANTED",
  "AMBIGUOUS_LANGUAGE_REQUIRES_REVIEW",
  "LEGAL_RISK_REQUIRES_LEGAL_REVIEW",
  "GLOBAL_APPROVAL_IS_NEVER_INFERRED",
  "WEB_AND_FORGE_SCOPES_REMAIN_SEPARATE",
  "EXPIRY_OR_REVOCATION_LOCKS_DEPENDENT_USES",
  "RAW_RESPONSE_AND_PROVENANCE_ARE_PRESERVED",
  "ADMIN_IS_NOTIFIED_OF_MATERIAL_RESPONSE"
]) {
  if (!(data.invariants || []).includes(invariant)) throw new Error("missing invariant: " + invariant);
}

for (const [key, value] of Object.entries(data.productionStatus || {})) {
  if (value !== "NOT_IMPLEMENTED") {
    throw new Error("production status must remain honest before implementation: " + key);
  }
}

console.log("PUBLISHER_RESPONSE_INTERPRETATION_STATE_COUNT", data.interpretationStates.length);
console.log("PUBLISHER_RESPONSE_SCOPE_STATUS_COUNT", data.scopeStatuses.length);
console.log("PASS_V2_PUBLISHER_RESPONSE_CONTRACT");
