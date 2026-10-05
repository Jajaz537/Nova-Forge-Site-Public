import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("qa/modaryx-v2-moderation-appeals-contract.json","utf8"));
if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const states=new Set(data.moderationStates||[]);
for(const state of ["RECEIVED","TRIAGED","UNDER_REVIEW","ACTIONED","NO_ACTION","APPEALED","CLOSED"]){
  if(!states.has(state)) throw new Error("missing moderation state: "+state);
}

const actions=new Set(data.actions||[]);
for(const action of ["HIDE","RESTRICT","QUARANTINE","REMOVE","RESTORE","REQUEST_CHANGES"]){
  if(!actions.has(action)) throw new Error("missing moderation action: "+action);
}

const roles=new Set(data.serverRoles||[]);
for(const role of ["MODERATOR","APPEALS_REVIEWER","ADMINISTRATOR"]){
  if(!roles.has(role)) throw new Error("missing server role: "+role);
}

const audit=new Set(data.auditFields||[]);
for(const field of ["serverActorId","action","target","timestamp","reasonCode","previousState","nextState"]){
  if(!audit.has(field)) throw new Error("missing audit field: "+field);
}

const invariants=new Set(data.invariants||[]);
for(const invariant of [
  "SUPPORT_AND_REPORT_ARE_DISTINCT",
  "DESTRUCTIVE_ACTION_REQUIRES_SERVER_AUTHORITY",
  "APPEAL_REFERENCES_PREVIOUS_DECISION",
  "APPEAL_NEVER_ERASES_PREVIOUS_DECISION",
  "QUARANTINE_LOCKS_DISTRIBUTION_WHEN_REAL",
  "NO_SILENT_REMOVAL_WITHOUT_AUDIT",
  "SERVER_ROLE_IS_AUTHORITATIVE",
  "REPORTER_RECEIVES_NO_OUTCOME_PROMISE",
  "CREATOR_SEES_ONLY_SHAREABLE_REASON",
  "MOBILE_SUPPORTS_REPORT_TRACKING_RESPONSE_AND_APPEAL",
  "STATUS_IS_TEXTUAL_NOT_COLOR_ONLY",
  "ERROR_FOCUS_RECOVERY_REQUIRED"
]){
  if(!invariants.has(invariant)) throw new Error("missing invariant: "+invariant);
}

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest before implementation: "+key);
}

console.log("MODERATION_STATE_COUNT",states.size);
console.log("MODERATION_ACTION_COUNT",actions.size);
console.log("MODERATION_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_MODERATION_APPEALS_CONTRACT");
