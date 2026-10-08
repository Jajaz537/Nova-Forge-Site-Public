const SCOPES=new Set([
  "TRADEMARK_TEXT_REFERENCE","OFFICIAL_LOGO","OFFICIAL_KEY_ART","OFFICIAL_SCREENSHOTS","PRESS_KIT_MEDIA",
  "GAME_ICON","OFFICIAL_FONTS","AUDIO_OST","MOD_LISTING","MOD_HOSTING","MOD_DISTRIBUTION",
  "MOD_INSTALLATION_HANDOFF","API_ACCESS","SDK_ACCESS","DEEPLINK_TO_GAME","COMMERCIAL_USE",
  "COBRANDING","PARTNERSHIP_CLAIM"
]);
const SURFACES=new Set([
  "WEB_PUBLIC","WEB_ADMIN","WEB_MARKETING","MODARYX_FORGE","CREATOR_STUDIO",
  "API_INTEGRATION","EMAIL_MARKETING","SOCIAL_PROMOTION"
]);
const STATUSES=new Set([
  "UNKNOWN","NOT_REQUESTED","PENDING","GRANTED","GRANTED_WITH_LIMITS","DENIED",
  "RESTRICTED","EXPIRED","REVOKED","FORBIDDEN"
]);
const AUTHORISING=new Set(["GRANTED","GRANTED_WITH_LIMITS"]);
const BLOCKING=new Set(["DENIED","RESTRICTED","EXPIRED","REVOKED","FORBIDDEN"]);
const CASE_STATES_BLOCKING=new Set(["DECLINED","NO_RESPONSE","EXPIRED","REVOKED","GAME_SUPPORT_BLOCKED"]);
const ID=/^mx_[a-z0-9][a-z0-9_-]{2,95}$/;

const text=(value,max,{required=false}={})=>{
  if(value===undefined||value===null) return required?null:"";
  if(typeof value!=="string") return null;
  const v=value.trim();
  if(required&&!v) return null;
  return v.length<=max?v:null;
};
const stringList=(value,{maxItems=64,maxLen=120,allowed=null,required=false}={})=>{
  if(!Array.isArray(value)||(required&&value.length===0)||value.length>maxItems) return null;
  const out=[];
  for(const raw of value){
    const v=text(raw,maxLen,{required:true});
    if(!v||(allowed&&!allowed.has(v))) return null;
    if(!out.includes(v)) out.push(v);
  }
  return out;
};
const parseList=value=>{
  try{
    const parsed=typeof value==="string"?JSON.parse(value):value;
    return Array.isArray(parsed)?parsed.filter(x=>typeof x==="string"):[];
  }catch{return []}
};

export const rightsScopes=()=>[...SCOPES];
export const rightsProductSurfaces=()=>[...SURFACES];

export function validateRightsCaseCreate(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"rights-case-invalid"};
  const gameId=text(input.gameId,96,{required:true});
  const gameName=text(input.gameName,120,{required:true});
  const publisherName=text(input.publisherName,160,{required:true});
  const requestedScopes=stringList(input.requestedScopes,{allowed:SCOPES,required:true});
  const productSurfaces=stringList(input.productSurfaces,{allowed:SURFACES,required:true});
  if(!gameId||!ID.test(gameId)||!gameName||!publisherName||!requestedScopes||!productSurfaces) return {ok:false,reason:"rights-case-fields-invalid"};
  return {ok:true,value:{gameId,gameName,publisherName,requestedScopes,productSurfaces}};
}

export function validateNonAuthorizingDecision(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"rights-decision-invalid"};
  const caseId=text(input.caseId,120,{required:true});
  if(!caseId||!/^mx_rights_case_[a-f0-9]{32}$/.test(caseId)) return {ok:false,reason:"rights-case-id-invalid"};
  if(!SCOPES.has(input.rightScope)) return {ok:false,reason:"rights-scope-invalid"};
  if(!SURFACES.has(input.productSurface)) return {ok:false,reason:"rights-surface-invalid"};
  if(!STATUSES.has(input.status)) return {ok:false,reason:"rights-status-invalid"};
  if(AUTHORISING.has(input.status)) return {ok:false,reason:"authorizing-decision-requires-verified-evidence-pipeline"};
  const territories=stringList(input.territories??[],{maxItems:64,maxLen:80});
  const platforms=stringList(input.platforms??[],{maxItems:32,maxLen:80});
  const conditions=stringList(input.conditions??[],{maxItems:32,maxLen:240});
  const evidenceRefs=stringList(input.evidenceRefs??[],{maxItems:32,maxLen:240});
  if(!territories||!platforms||!conditions||!evidenceRefs) return {ok:false,reason:"rights-decision-fields-invalid"};
  return {ok:true,value:{
    caseId,rightScope:input.rightScope,productSurface:input.productSurface,status:input.status,
    territories,platforms,conditions,evidenceRefs
  }};
}

function decisionShape(row){
  return {
    decisionId:row.decision_id||row.decisionId,
    rightScope:row.right_scope||row.rightScope,
    productSurface:row.product_surface||row.productSurface,
    status:row.status,
    territories:parseList(row.territories_json??row.territories),
    platforms:parseList(row.platforms_json??row.platforms),
    validFrom:row.valid_from??row.validFrom??null,
    validUntil:row.valid_until??row.validUntil??null,
    evidenceRefs:parseList(row.evidence_refs_json??row.evidenceRefs),
    evidenceArchived:Boolean(row.evidence_archived??row.evidenceArchived),
    sourceVerified:Boolean(row.source_verified??row.sourceVerified),
    conditionsSatisfied:Boolean(row.conditions_satisfied??row.conditionsSatisfied),
    assetLinked:Boolean(row.asset_linked??row.assetLinked),
    reviewerActorKey:row.reviewer_actor_key??row.reviewerActorKey??null,
    verifiedAt:row.verified_at??row.verifiedAt??null,
    supersedesDecisionId:row.supersedes_decision_id??row.supersedesDecisionId??null,
    createdAt:row.created_at??row.createdAt??null
  };
}

export function evaluateEffectiveRights({caseState,decisions,rightScope,productSurface,territory=null,platform=null,now=new Date().toISOString()}={}){
  if(!SCOPES.has(rightScope)||!SURFACES.has(productSurface)) return {allowed:false,reason:"scope-or-surface-invalid"};
  if(CASE_STATES_BLOCKING.has(caseState)) return {allowed:false,reason:"rights-case-blocking-state"};
  const rows=(Array.isArray(decisions)?decisions:[]).map(decisionShape).filter(x=>x.rightScope===rightScope&&x.productSurface===productSurface);
  const superseded=new Set(rows.map(x=>x.supersedesDecisionId).filter(Boolean));
  const active=rows.filter(x=>!superseded.has(x.decisionId));
  if(active.some(x=>BLOCKING.has(x.status))) return {allowed:false,reason:"superior-restriction-active"};

  const at=Date.parse(now);
  if(!Number.isFinite(at)) return {allowed:false,reason:"time-invalid"};
  const candidates=active.filter(x=>{
    if(!AUTHORISING.has(x.status)) return false;
    if(!x.evidenceArchived||!x.sourceVerified||!x.conditionsSatisfied||!x.assetLinked||!x.reviewerActorKey||!x.verifiedAt) return false;
    if(x.evidenceRefs.length===0) return false;
    const from=x.validFrom?Date.parse(x.validFrom):null;
    const until=x.validUntil?Date.parse(x.validUntil):null;
    if(from!==null&&(!Number.isFinite(from)||at<from)) return false;
    if(until!==null&&(!Number.isFinite(until)||at>=until)) return false;
    if(territory&&x.territories.length&& !x.territories.includes(territory)) return false;
    if(platform&&x.platforms.length&& !x.platforms.includes(platform)) return false;
    return true;
  }).sort((a,b)=>Date.parse(b.verifiedAt)-Date.parse(a.verifiedAt));

  if(candidates.length===0) return {allowed:false,reason:"no-authorizing-decision"};
  const chosen=candidates[0];
  return {allowed:true,status:chosen.status,decisionId:chosen.decisionId,validUntil:chosen.validUntil};
}
