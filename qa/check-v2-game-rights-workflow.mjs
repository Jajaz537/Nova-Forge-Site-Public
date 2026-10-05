import fs from "node:fs";

const path = "qa/modaryx-v2-game-rights-workflow.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const states = new Set(data.states || []);
for (const state of [
  "REQUESTED","TRIAGE","ACCEPTED_SAFE_BASELINE","RIGHTS_CASE_CREATED",
  "CONTACT_VERIFIED","REQUEST_READY","REQUEST_SENT","AWAITING_RESPONSE",
  "APPROVED","APPROVED_WITH_LIMITS","DECLINED","NO_RESPONSE",
  "EXPIRED","REVOKED","GAME_SUPPORT_BLOCKED"
]) {
  if (!states.has(state)) throw new Error("missing required state: " + state);
}

const permissionStates = new Set(data.permissionStates || []);
if (!permissionStates.has("APPROVED")) throw new Error("APPROVED must grant permission");
if (!permissionStates.has("APPROVED_WITH_LIMITS")) throw new Error("APPROVED_WITH_LIMITS must grant scoped permission");

for (const forbidden of ["NO_RESPONSE","DECLINED","EXPIRED","REVOKED","GAME_SUPPORT_BLOCKED"]) {
  if (permissionStates.has(forbidden)) {
    throw new Error(forbidden + " must never be a permission state");
  }
}

const noPermissionStates = new Set(data.noPermissionStates || []);
for (const required of ["NO_RESPONSE","DECLINED","EXPIRED","REVOKED","REQUEST_SENT","AWAITING_RESPONSE"]) {
  if (!noPermissionStates.has(required)) throw new Error(required + " must remain no-permission");
}

const allowedContactSources = new Set(data.allowedContactEvidenceSources || []);
for (const source of [
  "official_publisher_site",
  "official_legal_or_licensing_page",
  "official_business_or_press_contact",
  "official_licensing_form",
  "publisher_supplied_contact"
]) {
  if (!allowedContactSources.has(source)) throw new Error("missing allowed contact evidence source: " + source);
}

const forbiddenContactSources = new Set(data.forbiddenContactEvidenceSources || []);
for (const source of [
  "guessed_email",
  "forum_only_contact",
  "personal_account_without_authority_proof",
  "scraped_unverified_contact",
  "unverified_intermediary"
]) {
  if (!forbiddenContactSources.has(source)) throw new Error("missing forbidden contact source: " + source);
}

const readiness = new Set(data.requestReadinessRequires || []);
for (const requirement of [
  "product_support_accepted",
  "rights_case_exists",
  "official_contact_verified",
  "requested_scopes_explicit",
  "current_request_template"
]) {
  if (!readiness.has(requirement)) throw new Error("missing request readiness requirement: " + requirement);
}

const guards = new Set(data.requiredSendGuards || []);
for (const guard of [
  "product_support_accepted",
  "rights_case_exists",
  "official_contact_verified",
  "requested_scopes_explicit",
  "outbound_channel_authorized",
  "idempotency_key_unique",
  "no_active_refusal_or_opt_out"
]) {
  if (!guards.has(guard)) throw new Error("missing send guard: " + guard);
}

const scopes = new Set(data.requiredScopes || []);
for (const scope of [
  "OFFICIAL_LOGO","OFFICIAL_KEY_ART","OFFICIAL_SCREENSHOTS",
  "MOD_HOSTING","MOD_DISTRIBUTION","MOD_INSTALLATION_HANDOFF",
  "API_ACCESS","COMMERCIAL_USE","COBRANDING","PARTNERSHIP_CLAIM"
]) {
  if (!scopes.has(scope)) throw new Error("missing rights scope: " + scope);
}

const invariants = new Set(data.invariants || []);
for (const invariant of [
  "NO_RESPONSE_NEVER_EQUALS_APPROVED",
  "DECLINED_NEVER_UNLOCKS_RIGHTS",
  "ONLY_GRANTED_SCOPES_UNLOCK",
  "EXPIRED_OR_REVOKED_SCOPES_LOCK",
  "SAFE_BASELINE_USES_ORIGINAL_MODARYX_ASSETS",
  "OUTBOUND_REQUIRES_VERIFIED_OFFICIAL_CONTACT",
  "OUTBOUND_IS_IDEMPOTENT_AND_AUDITED",
  "WEB_AND_FORGE_RIGHTS_REMAIN_SEPARATE",
  "CONTACT_CANDIDATE_NEVER_ALLOWS_OUTBOUND",
  "REQUEST_READY_REQUIRES_VERIFIED_CONTACT"
]) {
  if (!invariants.has(invariant)) throw new Error("missing invariant: " + invariant);
}

for (const [key, value] of Object.entries(data.productionStatus || {})) {
  if (value !== "NOT_IMPLEMENTED") {
    throw new Error("production status must remain honest before implementation: " + key);
  }
}

console.log("GAME_RIGHTS_STATE_COUNT", states.size);
console.log("GAME_RIGHTS_SCOPE_COUNT", scopes.size);
console.log("GAME_RIGHTS_CONTACT_ALLOWED_SOURCE_COUNT", allowedContactSources.size);
console.log("GAME_RIGHTS_CONTACT_FORBIDDEN_SOURCE_COUNT", forbiddenContactSources.size);
console.log("GAME_RIGHTS_REQUEST_READINESS_COUNT", readiness.size);
console.log("GAME_RIGHTS_SEND_GUARD_COUNT", guards.size);
console.log("PASS_V2_GAME_RIGHTS_WORKFLOW");
