import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-publisher-outbound-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

for(const state of [
  "REQUEST_READY","OUTBOUND_QUEUED","SEND_ATTEMPTED","PROVIDER_ACCEPTED",
  "DELIVERED","DELIVERY_UNKNOWN","BOUNCED","SUPPRESSED","CANCELED",
  "FAILED_RETRYABLE","FAILED_FINAL"
]){
  if(!(data.states||[]).includes(state)) throw new Error("missing outbound state: "+state);
}

for(const guard of [
  "product_support_accepted","rights_case_exists","official_contact_verified",
  "requested_scopes_explicit","current_request_template","authorized_outbound_channel",
  "unique_idempotency_key","no_active_refusal","no_active_opt_out"
]){
  if(!(data.enqueueRequires||[]).includes(guard)) throw new Error("missing enqueue guard: "+guard);
}

for(const state of ["PROVIDER_ACCEPTED","DELIVERED","DELIVERY_UNKNOWN","BOUNCED"]){
  if(!(data.permissionNeutralTransportStates||[]).includes(state)) {
    throw new Error("transport state must stay permission-neutral: "+state);
  }
}

for(const invariant of [
  "REQUEST_READY_IS_NOT_SENT",
  "CONTACT_VERIFIED_REQUIRED_BEFORE_QUEUE",
  "IDEMPOTENCY_PREVENTS_DUPLICATE_LOGICAL_SEND",
  "OPT_OUT_BLOCKS_QUEUE",
  "ACTIVE_REFUSAL_BLOCKS_QUEUE",
  "TRANSPORT_SUCCESS_NEVER_EQUALS_RIGHTS_APPROVAL",
  "BOUNCE_NEVER_TRIGGERS_GUESSED_CONTACT",
  "RETRY_PRESERVES_LOGICAL_REQUEST_ID",
  "FOLLOW_UP_IS_NOT_TECHNICAL_RETRY",
  "WEB_AND_FORGE_SCOPES_REMAIN_SEPARATE",
  "NO_RAW_CONTACT_ADDRESS_STORED_BY_OUTBOUND_PREPARATION",
  "REQUEST_PREPARATION_NEVER_PERFORMS_NETWORK_SEND",
  "PROVIDER_MISSING_BLOCKS_QUEUE",
  "REMOTE_D1_NOT_APPLIED",
  "PUBLISHER_OUTBOUND_PRODUCTION_BLOCKER_REMAINS_OPEN"
]){
  if(!(data.invariants||[]).includes(invariant)) throw new Error("missing invariant: "+invariant);
}

if((data.retryableOnlyStates||[]).length!==1||data.retryableOnlyStates[0]!=="FAILED_RETRYABLE"){
  throw new Error("retryable state set must remain explicit and bounded");
}

if(data.productionStatus?.requestPreparation!=="CANDIDATE_LOCAL_PROOF") throw new Error("request preparation candidate status drift");
for(const key of ["queue","providerAdapter","senderIdentity","transportWebhook","bounceHandling","replyCorrelation"]){
  if(data.productionStatus?.[key]!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest: "+key);
}
if(data.remoteApplication!=="NOT_EXECUTED") throw new Error("remote application must remain NOT_EXECUTED");

console.log("PUBLISHER_OUTBOUND_STATE_COUNT",data.states.length);
console.log("PUBLISHER_OUTBOUND_ENQUEUE_GUARD_COUNT",data.enqueueRequires.length);
console.log("PUBLISHER_OUTBOUND_INVARIANT_COUNT",data.invariants.length);
console.log("PASS_V2_PUBLISHER_OUTBOUND_CONTRACT");
