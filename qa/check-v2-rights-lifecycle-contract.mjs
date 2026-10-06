import fs from "node:fs";

const path="qa/modaryx-v2-rights-lifecycle-contract.json";
const data=JSON.parse(fs.readFileSync(path,"utf8"));

if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const states=new Set(data.lifecycleStates||[]);
for(const state of ["ACTIVE_WITH_LIMITS","EXPIRING_SOON","EXPIRED","REVOKED"]){
  if(!states.has(state)) throw new Error("missing lifecycle state: "+state);
}

const effects=data.stateEffects||{};
for(const state of states){
  if(!Array.isArray(effects[state])||effects[state].length===0) throw new Error("missing lifecycle effects: "+state);
}
for(const state of ["EXPIRED","REVOKED"]){
  const set=new Set(effects[state]);
  for(const effect of ["lock_dependent_scopes","fallback_original_modaryx","require_new_evidence"]){
    if(!set.has(effect)) throw new Error(state+" missing effect: "+effect);
  }
}
if(new Set(effects.EXPIRING_SOON||[]).has("expand_rights")) throw new Error("expiring state must never expand rights");

const invariants=new Set(data.invariants||[]);
for(const invariant of [
  "EXPIRED_LOCKS_ALL_DEPENDENT_SCOPES",
  "REVOKED_LOCKS_ALL_DEPENDENT_SCOPES",
  "EXPIRING_SOON_DOES_NOT_EXPAND_RIGHTS",
  "REACTIVATION_REQUIRES_NEW_EVIDENCE",
  "NO_SILENT_REACTIVATION",
  "SAFE_BASELINE_REMAINS_AVAILABLE_WHEN_LEGALLY_ALLOWED",
  "WEB_AND_FORGE_LIFECYCLES_REMAIN_SEPARATE",
  "LIFECYCLE_TRANSITIONS_ARE_AUDITED",
  "LOCK_ACTIONS_ARE_IDEMPOTENT",
  "ADMIN_TRIGGERED_EXPIRY_LOCK_CANNOT_EXPAND_RIGHTS",
  "EXPIRY_LOCK_SUPERSEDES_ONLY_SOURCE_DECISION",
  "EXPIRY_LOCK_IDEMPOTENCY_KEY_REQUIRED",
  "NO_SILENT_REACTIVATION_FROM_LIFECYCLE_ENDPOINT",
  "PRODUCTION_SCHEDULER_REMAINS_OPEN",
  "REMOTE_D1_NOT_APPLIED"
]){
  if(!invariants.has(invariant)) throw new Error("missing invariant: "+invariant);
}

const evidence=new Set(data.requiredEvidenceForReactivation||[]);
for(const item of ["publisher_response_or_license","scope_identity","product_scope","effective_dates","provenance"]){
  if(!evidence.has(item)) throw new Error("missing reactivation evidence: "+item);
}

if(data.productionStatus?.scheduler!=="NOT_IMPLEMENTED") throw new Error("scheduler must remain NOT_IMPLEMENTED");
if(data.productionStatus?.expiryMonitor!=="CANDIDATE_PURE_EVALUATOR") throw new Error("expiry monitor candidate status drift");
if(data.productionStatus?.revocationInbound!=="NOT_IMPLEMENTED") throw new Error("revocation inbound must remain NOT_IMPLEMENTED");
if(data.productionStatus?.automaticScopeLock!=="CANDIDATE_ADMIN_TRIGGERED_IDEMPOTENT_EXPIRY_LOCK") throw new Error("scope lock candidate status drift");
if(data.productionStatus?.revalidation!=="NOT_IMPLEMENTED") throw new Error("revalidation must remain NOT_IMPLEMENTED");
if(data.remoteApplication!=="NOT_EXECUTED") throw new Error("remote application must remain NOT_EXECUTED");

console.log("RIGHTS_LIFECYCLE_STATE_COUNT",states.size);
console.log("RIGHTS_LIFECYCLE_INVARIANT_COUNT",invariants.size);
console.log("RIGHTS_LIFECYCLE_REACTIVATION_EVIDENCE_COUNT",evidence.size);
console.log("PASS_V2_RIGHTS_LIFECYCLE_CONTRACT");
