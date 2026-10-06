const AUTHORISING=new Set(["GRANTED","GRANTED_WITH_LIMITS"]);
const TERMINAL=new Set(["EXPIRED","REVOKED","FORBIDDEN","DENIED","RESTRICTED"]);

const list=value=>{
  try{
    const parsed=typeof value==="string"?JSON.parse(value):value;
    return Array.isArray(parsed)?parsed.filter(x=>typeof x==="string"):[];
  }catch{return []}
};

export function classifyRightsLifecycle(decision,{now=new Date().toISOString(),expiringWindowDays=30}={}){
  if(!decision||typeof decision!=="object") return {state:"REVALIDATION_REQUIRED",reason:"decision-missing"};
  if(TERMINAL.has(decision.status)) return {
    state:decision.status==="REVOKED"?"REVOKED":"EXPIRED",
    reason:"terminal-decision-active"
  };
  if(!AUTHORISING.has(decision.status)) return {state:"REVALIDATION_REQUIRED",reason:"not-authorizing"};
  const at=Date.parse(now);
  if(!Number.isFinite(at)) return {state:"REVALIDATION_REQUIRED",reason:"time-invalid"};
  const until=decision.valid_until??decision.validUntil??null;
  if(!until) return {state:"ACTIVE_WITH_LIMITS",reason:"no-expiry-recorded"};
  const expiry=Date.parse(until);
  if(!Number.isFinite(expiry)) return {state:"REVALIDATION_REQUIRED",reason:"expiry-invalid"};
  if(at>=expiry) return {state:"EXPIRED",reason:"validity-ended",effectiveAt:new Date(expiry).toISOString()};
  const window=Math.max(1,Math.min(365,Number(expiringWindowDays)||30))*86400000;
  if(expiry-at<=window) return {state:"EXPIRING_SOON",reason:"within-revalidation-window",effectiveAt:new Date(expiry).toISOString()};
  return {state:"ACTIVE_WITH_LIMITS",reason:"within-validity",effectiveAt:new Date(expiry).toISOString()};
}

export function expiryLockDecision(source,{decisionId,createdAt}={}){
  if(!source||!AUTHORISING.has(source.status)) return {ok:false,reason:"source-not-authorizing"};
  const id=typeof decisionId==="string"&&/^mx_rights_decision_[a-f0-9]{32}$/.test(decisionId)?decisionId:null;
  const at=typeof createdAt==="string"&&!Number.isNaN(Date.parse(createdAt))?new Date(createdAt).toISOString():null;
  if(!id||!at) return {ok:false,reason:"expiry-lock-fields-invalid"};
  const originalId=source.decision_id??source.decisionId;
  if(typeof originalId!=="string") return {ok:false,reason:"source-decision-id-invalid"};
  return {ok:true,value:{
    decisionId:id,
    caseId:source.case_id??source.caseId,
    rightScope:source.right_scope??source.rightScope,
    productSurface:source.product_surface??source.productSurface,
    status:"EXPIRED",
    territories:list(source.territories_json??source.territories),
    platforms:list(source.platforms_json??source.platforms),
    conditions:list(source.conditions_json??source.conditions),
    evidenceRefs:list(source.evidence_refs_json??source.evidenceRefs),
    validFrom:source.valid_from??source.validFrom??null,
    validUntil:source.valid_until??source.validUntil??null,
    supersedesDecisionId:originalId,
    createdAt:at
  }};
}

const hex=buffer=>[...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,"0")).join("");
export async function lifecycleIdempotencyKey({caseId,decisionId,eventType,effectiveAt}){
  const raw=[caseId,decisionId,eventType,effectiveAt].join("|");
  return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(raw)));
}
