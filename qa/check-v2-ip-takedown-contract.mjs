import fs from "node:fs";

const path="qa/modaryx-v2-ip-takedown-contract.json";
const data=JSON.parse(fs.readFileSync(path,"utf8"));

if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const states=new Set(data.states||[]);
for(const state of [
  "RECEIVED","IDENTITY_OR_AUTHORITY_CHECK","EVIDENCE_REVIEW","CONTENT_LOCATED",
  "TEMP_RESTRICTED","NEEDS_MORE_INFO","LEGAL_REVIEW_REQUIRED","ACTIONED",
  "REJECTED","RESTORED","APPEALED","CLOSED"
]){
  if(!states.has(state)) throw new Error("missing takedown state: "+state);
}

const authority=new Set(data.authorityStates||[]);
for(const state of ["AUTHORITY_UNVERIFIED","AUTHORITY_PARTIAL","AUTHORITY_VERIFIED"]){
  if(!authority.has(state)) throw new Error("missing authority state: "+state);
}

const decisions=new Set(data.decisions||[]);
for(const decision of [
  "ACTION_REMOVE_OR_RESTRICT","ACTION_KEEP_RESTRICTED_PENDING_REVIEW","ACTION_RESTORE",
  "ACTION_REJECT_REQUEST","ACTION_REQUEST_MORE_INFO","ACTION_ESCALATE_LEGAL"
]){
  if(!decisions.has(decision)) throw new Error("missing decision: "+decision);
}

const fields=new Set(data.requiredCaseFields||[]);
for(const field of ["IpCaseId","receivedAt","claimant","contentRef","evidenceRefs","status","history","reviewer","result"]){
  if(!fields.has(field)) throw new Error("missing case field: "+field);
}

const effects=new Set(data.restrictionEffects||[]);
for(const effect of [
  "block_asset_public_reuse","block_marketing_reuse","remove_from_game_atmosphere",
  "fallback_original_modaryx","preserve_evidence","prevent_automatic_reupload"
]){
  if(!effects.has(effect)) throw new Error("missing restriction effect: "+effect);
}

const audit=new Set(data.auditFields||[]);
for(const field of ["eventId","caseId","fromState","toState","actor","reason","timestamp","evidenceRefs","technicalAction","result"]){
  if(!audit.has(field)) throw new Error("missing audit field: "+field);
}

const invariants=new Set(data.invariants||[]);
for(const invariant of [
  "EVIDENCE_IS_PRESERVED",
  "TEMP_RESTRICTION_IS_SCOPED",
  "CONTESTED_ASSET_NEVER_AUTO_RESTORES",
  "LEGAL_REVIEW_REQUIRED_NEVER_AUTO_CLOSES",
  "UNKNOWN_RIGHTS_ASSET_NEVER_ACTIVATES",
  "FALLBACK_MODARYX_REPLACES_CONTESTED_DECOR_WHEN_POSSIBLE",
  "RESTORE_REQUIRES_AUTHORIZED_STATE_AND_EVIDENCE",
  "DECISION_DOES_NOT_EXPAND_BEYOND_CASE_SCOPE",
  "RIGHTS_CASE_LINK_PRESERVES_SCOPE_BOUNDARY",
  "AUDIT_TRAIL_IS_APPEND_ONLY_LOGICALLY",
  "PRIVATE_CONTACTS_AND_CLAUSES_ARE_NOT_PUBLIC",
  "ANTI_REUPLOAD_DETECTION_IS_NOT_SOLE_LEGAL_EVIDENCE"
]){
  if(!invariants.has(invariant)) throw new Error("missing invariant: "+invariant);
}

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest: "+key);
}

console.log("IP_TAKEDOWN_STATE_COUNT",states.size);
console.log("IP_TAKEDOWN_INVARIANT_COUNT",invariants.size);
console.log("IP_TAKEDOWN_RESTRICTION_EFFECT_COUNT",effects.size);
console.log("PASS_V2_IP_TAKEDOWN_CONTRACT");
