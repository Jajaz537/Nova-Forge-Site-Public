import fs from "node:fs";

const path = "qa/modaryx-v2-notifications-preferences-contract.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const priorities = new Set(data.priorities || []);
for (const x of ["CRITICAL","IMPORTANT","NORMAL","SILENT"]) if (!priorities.has(x)) throw new Error("missing priority " + x);

const channels = new Set(data.channels || []);
for (const x of ["IN_APP","EMAIL","PUSH"]) if (!channels.has(x)) throw new Error("missing channel " + x);
if (data.channelRules?.EMAIL !== "HIDDEN_OR_DISABLED_UNTIL_REAL_INFRASTRUCTURE") throw new Error("email channel safety drift");
if (data.channelRules?.PUSH !== "HIDDEN_OR_DISABLED_UNTIL_REAL_INFRASTRUCTURE") throw new Error("push channel safety drift");

const prefs = data.preferenceClasses || {};
if (prefs.MARKETING !== "SEPARATE_EXPLICIT_OPT_IN") throw new Error("marketing opt-in drift");

const sync = new Set(data.syncConflictRules || []);
for (const x of ["EXPLAIN","COMPARE","USER_CHOICE","SAFE_MERGE_ONLY","NO_SILENT_OVERWRITE"]) {
  if (!sync.has(x)) throw new Error("missing sync conflict rule " + x);
}

const rights = new Set(data.rightsRules || []);
for (const x of [
  "REAL_RIGHTS_EVENT_REQUIRED","PARTIAL_RESPONSE_NEVER_GRANTS_GLOBAL_APPROVAL",
  "ABSENT_SCOPE_REMAINS_NOT_GRANTED","LEGAL_REVIEW_REQUIRED_GRANTS_NO_RIGHTS",
  "WEB_AND_FORGE_SCOPES_REMAIN_DISTINCT"
]) {
  if (!rights.has(x)) throw new Error("missing rights notification rule " + x);
}

const privacy = new Set(data.privacyRules || []);
for (const x of [
  "NO_SECRET_IN_LOCAL_STORAGE","NO_PRIVATE_PUBLISHER_CONTACT_IN_NOTIFICATION",
  "NO_CONFIDENTIAL_LICENSE_CLAUSE_IN_PUBLIC_NOTIFICATION","BADGE_REQUIRES_REAL_COUNT"
]) {
  if (!privacy.has(x)) throw new Error("missing privacy rule " + x);
}

const status=data.productionStatus||{};
if(status.serverEvents!=="NOT_IMPLEMENTED") throw new Error("event producers must remain NOT_IMPLEMENTED");
if(status.inAppStorageAndReadApi!=="IMPLEMENTED_CANDIDATE") throw new Error("in-app candidate status drift");
if(status.email!=="NOT_IMPLEMENTED"||status.push!=="NOT_IMPLEMENTED") throw new Error("email/push must remain NOT_IMPLEMENTED");
if(status.remotePreferences!=="IMPLEMENTED_CANDIDATE") throw new Error("remote preferences candidate status drift");
if(status.syncConflictBackend!=="VERSION_CONFLICT_PROTECTED_CANDIDATE") throw new Error("sync conflict candidate status drift");

const invariants = new Set(data.invariants || []);
for (const x of [
  "NO_FAKE_REMOTE_NOTIFICATION","NO_CHANNEL_EXPOSED_AS_ACTIVE_WITHOUT_INFRASTRUCTURE",
  "MARKETING_SEPARATE_OPT_IN","NO_SILENT_SYNC_OVERWRITE","BADGE_ONLY_FROM_REAL_COUNT",
  "RIGHTS_NOTIFICATION_REQUIRES_REAL_RIGHTS_EVENT","LEGAL_REVIEW_REQUIRED_NEVER_UNLOCKS_RIGHTS",
  "NOTIFICATION_POINTS_TO_REAL_SURFACE","READ_UNREAD_STATE_TEXTUAL","NO_SWIPE_ONLY_DELETE",
  "IN_APP_CANDIDATE_DOES_NOT_IMPLY_EVENT_PRODUCERS","EMAIL_PUSH_REMAIN_DISABLED"
]) {
  if (!invariants.has(x)) throw new Error("missing invariant " + x);
}

console.log("NOTIFICATION_TYPE_COUNT", (data.notificationTypes || []).length);
console.log("NOTIFICATION_PRIORITY_COUNT", priorities.size);
console.log("NOTIFICATION_INVARIANT_COUNT", invariants.size);
console.log("PASS_V2_NOTIFICATIONS_PREFERENCES_CONTRACT");
