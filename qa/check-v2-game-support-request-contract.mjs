import fs from "node:fs";

const path = "qa/modaryx-v2-game-support-request-contract.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const states = new Set(data.requestStates || []);
for (const state of [
  "LOCAL_DRAFT","REQUESTED","TRIAGE","ACCEPTED_SAFE_BASELINE",
  "DECLINED_PRODUCT","DUPLICATE","ABUSE_BLOCKED"
]) {
  if (!states.has(state)) throw new Error("missing request state: " + state);
}

const fields = new Set(data.requiredFields || []);
for (const field of ["gameName","platforms","createdAt"]) {
  if (!fields.has(field)) throw new Error("missing required field: " + field);
}

const forbiddenClaims = new Set(data.forbiddenMemberClaims || []);
for (const claim of [
  "publisherApproval","licenseGranted","officialPartnership","verifiedPublisherContact"
]) {
  if (!forbiddenClaims.has(claim)) throw new Error("missing forbidden member claim: " + claim);
}

const accept = new Set(data.acceptanceEffects || []);
for (const effect of [
  "create_game_support_record","allow_safe_modaryx_baseline","create_rights_case"
]) {
  if (!accept.has(effect)) throw new Error("missing acceptance effect: " + effect);
}

const nonAccept = new Set(data.nonAcceptanceEffects || []);
for (const effect of [
  "no_publisher_outbound","no_official_assets","no_partnership_claim","no_forge_permission_inference"
]) {
  if (!nonAccept.has(effect)) throw new Error("missing non-acceptance effect: " + effect);
}

const invariants = new Set(data.invariants || []);
for (const invariant of [
  "LOCAL_DRAFT_IS_NOT_SENT",
  "MEMBER_REQUEST_IS_NOT_PUBLISHER_PERMISSION",
  "PRODUCT_ACCEPTANCE_PRECEDES_RIGHTS_CASE",
  "PRODUCT_ACCEPTANCE_PRECEDES_PUBLISHER_OUTBOUND",
  "MEMBER_CANNOT_ASSERT_LICENSE",
  "SAFE_BASELINE_REMAINS_ORIGINAL_MODARYX",
  "DECLINED_PRODUCT_NEVER_CONTACTS_PUBLISHER",
  "DUPLICATES_DO_NOT_CREATE_DUPLICATE_RIGHTS_CASES"
]) {
  if (!invariants.has(invariant)) throw new Error("missing invariant: " + invariant);
}

for (const [key, value] of Object.entries(data.productionStatus || {})) {
  if (value !== "NOT_IMPLEMENTED") {
    throw new Error("production status must remain honest before implementation: " + key);
  }
}

console.log("GAME_SUPPORT_REQUEST_STATE_COUNT", states.size);
console.log("GAME_SUPPORT_REQUEST_INVARIANT_COUNT", invariants.size);
console.log("PASS_V2_GAME_SUPPORT_REQUEST_CONTRACT");
