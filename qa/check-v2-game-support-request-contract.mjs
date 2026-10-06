import fs from "node:fs";

const path = "qa/modaryx-v2-game-support-request-contract.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");
if (data.status !== "CANDIDATE_BACKEND_LOCAL_PROOF_REMOTE_OPEN") throw new Error("game support backend status drift");
if (data.remoteApplication !== "NOT_EXECUTED") throw new Error("remote D1 apply must remain NOT_EXECUTED");

const states = new Set(data.requestStates || []);
for (const state of [
  "LOCAL_DRAFT","REQUESTED","TRIAGE","ACCEPTED_SAFE_BASELINE",
  "DECLINED_PRODUCT","DUPLICATE","ABUSE_BLOCKED"
]) if (!states.has(state)) throw new Error("missing request state: " + state);

const fields = new Set(data.requiredFields || []);
for (const field of ["gameName","platforms","createdAt"]) if (!fields.has(field)) throw new Error("missing required field: " + field);

const forbiddenClaims = new Set(data.forbiddenMemberClaims || []);
for (const claim of ["publisherApproval","licenseGranted","officialPartnership","verifiedPublisherContact"]) if (!forbiddenClaims.has(claim)) throw new Error("missing forbidden member claim: " + claim);

const accept = new Set(data.acceptanceEffects || []);
for (const effect of ["create_game_support_record","allow_safe_modaryx_baseline","create_rights_case"]) if (!accept.has(effect)) throw new Error("missing acceptance effect: " + effect);

const nonAccept = new Set(data.nonAcceptanceEffects || []);
for (const effect of ["no_publisher_outbound","no_official_assets","no_partnership_claim","no_forge_permission_inference"]) if (!nonAccept.has(effect)) throw new Error("missing non-acceptance effect: " + effect);

const invariants = new Set(data.invariants || []);
for (const invariant of [
  "LOCAL_DRAFT_IS_NOT_SENT","MEMBER_REQUEST_IS_NOT_PUBLISHER_PERMISSION","PRODUCT_ACCEPTANCE_PRECEDES_RIGHTS_CASE",
  "PRODUCT_ACCEPTANCE_PRECEDES_PUBLISHER_OUTBOUND","MEMBER_CANNOT_ASSERT_LICENSE","SAFE_BASELINE_REMAINS_ORIGINAL_MODARYX",
  "DECLINED_PRODUCT_NEVER_CONTACTS_PUBLISHER","DUPLICATES_DO_NOT_CREATE_DUPLICATE_RIGHTS_CASES",
  "ACTIVE_DUPLICATE_REQUESTS_FAIL_CLOSED","ACCEPTANCE_REQUIRES_COMPLETE_TRIAGE",
  "ACCEPTANCE_REQUIRES_EXPLICIT_GAME_PUBLISHER_SCOPES_AND_SURFACES",
  "ACCEPTANCE_CREATES_SAFE_BASELINE_WITH_OFFICIAL_ASSETS_FALSE","ACCEPTANCE_CREATES_OR_REUSES_SINGLE_RIGHTS_CASE",
  "TRIAGE_NEVER_CONTACTS_PUBLISHER","IN_APP_NOTIFICATION_IS_FAIL_SOFT","NO_REMOTE_D1_APPLY"
]) if (!invariants.has(invariant)) throw new Error("missing invariant: " + invariant);

const p=data.productionStatus||{};
if(p.persistence!=="CANDIDATE_LOCAL_MIGRATION_PROVEN") throw new Error("persistence status drift");
if(p.triageBackend!=="CANDIDATE_ADMIN_ONLY") throw new Error("triage status drift");
if(p.rightsCaseCreation!=="CANDIDATE_ATOMIC_ON_ACCEPTANCE") throw new Error("rights creation status drift");
if(p.memberNotification!=="IN_APP_CANDIDATE_FAIL_SOFT") throw new Error("member notification status drift");

console.log("GAME_SUPPORT_REQUEST_STATE_COUNT", states.size);
console.log("GAME_SUPPORT_REQUEST_INVARIANT_COUNT", invariants.size);
console.log("PASS_V2_GAME_SUPPORT_REQUEST_CONTRACT");
