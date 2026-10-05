import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("qa/modaryx-v2-rights-notification-contract.json","utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const eventTypes=new Set(data.rightsEventTypes||[]);
for(const type of [
  "PUBLISHER_RESPONSE_RECEIVED","RIGHTS_APPROVED","RIGHTS_APPROVED_WITH_LIMITS",
  "RIGHTS_MORE_INFO_REQUIRED","LEGAL_REVIEW_REQUIRED","RIGHTS_DECLINED",
  "RIGHTS_EXPIRING","RIGHTS_EXPIRED","RIGHTS_REVOKED"
]){
  if(!eventTypes.has(type)) throw new Error("missing rights notification event: "+type);
}

const evidence=new Set(data.requiredEventEvidence||[]);
for(const field of ["rights_case_id","event_type","occurred_at","source_provenance","affected_scopes"]){
  if(!evidence.has(field)) throw new Error("missing event evidence: "+field);
}

const invariants=new Set(data.invariants||[]);
for(const invariant of [
  "NO_REAL_EVENT_NO_REAL_NOTIFICATION",
  "RIGHTS_NOTIFICATION_LINKS_TO_REAL_RIGHTS_CASE",
  "UNADDRESSED_SCOPE_NEVER_NOTIFIED_AS_GRANTED",
  "LEGAL_REVIEW_REQUIRED_UNLOCKS_NOTHING",
  "CONFIDENTIAL_REPLY_DATA_NOT_EXPOSED_PUBLICLY",
  "WEB_AND_FORGE_RIGHTS_REMAIN_SEPARATE",
  "BADGE_COUNT_REQUIRES_REAL_UNREAD_COUNT",
  "EMAIL_AND_PUSH_REQUIRE_REAL_INFRASTRUCTURE"
]){
  if(!invariants.has(invariant)) throw new Error("missing invariant: "+invariant);
}

const demos=new Set(data.demoRequirements||[]);
for(const rule of [
  "DEMO_EVENTS_EXPLICITLY_MARKED_NOT_RECEIVED",
  "NO_FAKE_REMOTE_COUNTER",
  "NO_FAKE_EMAIL_OR_PUSH_DELIVERY"
]){
  if(!demos.has(rule)) throw new Error("missing demo rule: "+rule);
}

if(data.channelReadiness?.EMAIL!=="NOT_IMPLEMENTED") throw new Error("email channel must remain NOT_IMPLEMENTED");
if(data.channelReadiness?.PUSH!=="NOT_IMPLEMENTED") throw new Error("push channel must remain NOT_IMPLEMENTED");

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest before implementation: "+key);
}

console.log("RIGHTS_NOTIFICATION_EVENT_TYPE_COUNT",eventTypes.size);
console.log("RIGHTS_NOTIFICATION_INVARIANT_COUNT",invariants.size);
console.log("RIGHTS_NOTIFICATION_REQUIRED_EVIDENCE_COUNT",evidence.size);
console.log("PASS_V2_RIGHTS_NOTIFICATION_CONTRACT");
