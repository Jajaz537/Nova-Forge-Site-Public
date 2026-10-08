import {rightsProductSurfaces,rightsScopes} from "./rights-registry.mjs";

const CONTACT_SOURCES=new Set([
  "official_publisher_site","official_legal_or_licensing_page","official_business_or_press_contact",
  "official_licensing_form","publisher_supplied_contact"
]);
const CONTACT_CHANNELS=new Set(["EMAIL","FORM","PORTAL","POSTAL","OTHER_OFFICIAL"]);
const RESPONSE_STATUSES=new Set(["GRANTED","GRANTED_WITH_LIMITS","DENIED","UNADDRESSED","EXPIRED","REVOKED"]);
const AUTHORIZING=new Set(["GRANTED","GRANTED_WITH_LIMITS"]);
const SCOPES=new Set(rightsScopes());
const SURFACES=new Set(rightsProductSurfaces());
const CASE_ID=/^mx_rights_case_[a-f0-9]{32}$/;
const CONTACT_ID=/^mx_rights_contact_[a-f0-9]{32}$/;
const RESPONSE_ID=/^mx_rights_response_[a-f0-9]{32}$/;
const HEX64=/^[a-f0-9]{64}$/;

const text=(value,max,{required=false}={})=>{
  if(value===undefined||value===null) return required?null:"";
  if(typeof value!=="string") return null;
  const v=value.trim();
  if(required&&!v) return null;
  return v.length<=max?v:null;
};
const list=(value,{maxItems=64,maxLen=240,required=false}={})=>{
  if(!Array.isArray(value)||(required&&value.length===0)||value.length>maxItems) return null;
  const out=[];
  for(const raw of value){
    const v=text(raw,maxLen,{required:true});
    if(!v) return null;
    if(!out.includes(v)) out.push(v);
  }
  return out;
};
const iso=value=>{
  const v=text(value,40,{required:true});
  if(!v||Number.isNaN(Date.parse(v))) return null;
  return new Date(v).toISOString();
};
const httpsUrl=value=>{
  const v=text(value,1000,{required:true});
  if(!v) return null;
  try{
    const u=new URL(v);
    if(u.protocol!=="https:"||u.username||u.password) return null;
    return u.toString();
  }catch{return null}
};

export function validateOfficialContactEvidence(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"contact-evidence-invalid"};
  const caseId=text(input.caseId,120,{required:true});
  const sourceUrl=httpsUrl(input.sourceUrl);
  const authorityBasis=text(input.authorityBasis,500,{required:true});
  const observedAt=iso(input.observedAt);
  const digest=typeof input.contactRefDigestSha256==="string"?input.contactRefDigestSha256.trim().toLowerCase():"";
  if(!CASE_ID.test(caseId||"")) return {ok:false,reason:"rights-case-id-invalid"};
  if(!CONTACT_SOURCES.has(input.sourceKind)) return {ok:false,reason:"contact-source-not-official"};
  if(!CONTACT_CHANNELS.has(input.contactChannel)) return {ok:false,reason:"contact-channel-invalid"};
  if(!sourceUrl||!authorityBasis||!observedAt||!HEX64.test(digest)) return {ok:false,reason:"contact-evidence-fields-invalid"};
  return {ok:true,value:{caseId,sourceKind:input.sourceKind,sourceUrl,contactChannel:input.contactChannel,contactRefDigestSha256:digest,authorityBasis,observedAt}};
}

export function interpretPublisherResponseEvidence(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"response-evidence-invalid"};
  const caseId=text(input.caseId,120,{required:true});
  const contactEvidenceId=text(input.contactEvidenceId,120,{required:true});
  const logicalRequestId=text(input.logicalRequestId,180,{required:true});
  const rawMessageSha256=typeof input.rawMessageSha256==="string"?input.rawMessageSha256.trim().toLowerCase():"";
  const rawHeadersSha256=typeof input.rawHeadersSha256==="string"?input.rawHeadersSha256.trim().toLowerCase():"";
  const receivedAt=iso(input.receivedAt);
  if(!CASE_ID.test(caseId||"")) return {ok:false,reason:"rights-case-id-invalid"};
  if(!CONTACT_ID.test(contactEvidenceId||"")) return {ok:false,reason:"contact-evidence-id-invalid"};
  if(!logicalRequestId||!HEX64.test(rawMessageSha256)||!HEX64.test(rawHeadersSha256)||!receivedAt) return {ok:false,reason:"response-evidence-fields-invalid"};
  if(!Array.isArray(input.scopes)||input.scopes.length===0||input.scopes.length>64) return {ok:false,reason:"response-scopes-invalid"};
  const scopes=[];
  for(const row of input.scopes){
    if(!row||typeof row!=="object"||Array.isArray(row)) return {ok:false,reason:"response-scope-invalid"};
    if(!SCOPES.has(row.rightScope)||!SURFACES.has(row.productSurface)||!RESPONSE_STATUSES.has(row.status)) return {ok:false,reason:"response-scope-invalid"};
    const territories=list(row.territories??[],{maxItems:64,maxLen:80});
    const platforms=list(row.platforms??[],{maxItems:32,maxLen:80});
    const conditions=list(row.conditions??[],{maxItems:32,maxLen:240});
    const wordingEvidenceRefs=list(row.wordingEvidenceRefs??[],{maxItems:16,maxLen:240,required:true});
    const validUntil=row.validUntil==null?null:iso(row.validUntil);
    if(!territories||!platforms||!conditions||!wordingEvidenceRefs||(row.validUntil!=null&&!validUntil)) return {ok:false,reason:"response-scope-fields-invalid"};
    scopes.push({rightScope:row.rightScope,productSurface:row.productSurface,status:row.status,territories,platforms,conditions,wordingEvidenceRefs,validUntil});
  }
  const reviewState=scopes.some(x=>AUTHORIZING.has(x.status))?"LEGAL_REVIEW_REQUIRED"
    :scopes.some(x=>x.status==="UNADDRESSED")?"NEEDS_REVIEW":"SAFE_NON_AUTHORIZING";
  return {ok:true,value:{caseId,contactEvidenceId,logicalRequestId,rawMessageSha256,rawHeadersSha256,receivedAt,scopes,reviewState},authorizes:false};
}

export function evaluateLicensePreflight(input,{responseArchived=false,responseSourceVerified=false,contactVerified=false}={}){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"license-preflight-invalid"};
  const caseId=text(input.caseId,120,{required:true});
  const responseEvidenceId=text(input.responseEvidenceId,120,{required:true});
  const legalReviewRef=text(input.legalReviewRef,240,{required:false});
  const evidenceRefs=list(input.evidenceRefs??[],{maxItems:32,maxLen:240,required:true});
  const conditions=list(input.conditions??[],{maxItems:32,maxLen:240});
  const territories=list(input.territories??[],{maxItems:64,maxLen:80});
  const platforms=list(input.platforms??[],{maxItems:32,maxLen:80});
  const validFrom=input.validFrom==null?null:iso(input.validFrom);
  const validUntil=input.validUntil==null?null:iso(input.validUntil);
  if(!CASE_ID.test(caseId||"")||!RESPONSE_ID.test(responseEvidenceId||"")) return {ok:false,reason:"license-preflight-id-invalid"};
  if(!SCOPES.has(input.rightScope)||!SURFACES.has(input.productSurface)||!AUTHORIZING.has(input.status)) return {ok:false,reason:"license-preflight-scope-invalid"};
  if(!evidenceRefs||!conditions||!territories||!platforms||(input.validFrom!=null&&!validFrom)||(input.validUntil!=null&&!validUntil)) return {ok:false,reason:"license-preflight-fields-invalid"};
  const base={caseId,responseEvidenceId,rightScope:input.rightScope,productSurface:input.productSurface,status:input.status,evidenceRefs,conditions,territories,platforms,validFrom,validUntil,assetLinked:input.assetLinked===true,conditionsSatisfied:input.conditionsSatisfied===true,legalReviewRef:legalReviewRef||null};
  const blockers=[];
  if(!contactVerified) blockers.push("official-contact-not-verified");
  if(!responseArchived) blockers.push("response-not-archived");
  if(!responseSourceVerified) blockers.push("response-source-not-verified");
  if(!base.assetLinked) blockers.push("asset-not-linked");
  if(!base.conditionsSatisfied) blockers.push("conditions-not-satisfied");
  if(!base.legalReviewRef) blockers.push("legal-review-record-missing");
  return {ok:true,value:base,result:blockers.length?"BLOCKED":"ELIGIBLE_FOR_MANUAL_DECISION",reason:blockers[0]||null,blockers,authorizes:false};
}


const parseJsonList=value=>{
  try{
    const parsed=typeof value==="string"?JSON.parse(value):value;
    return Array.isArray(parsed)?parsed:[];
  }catch{return []}
};

export function evaluateAuthorizingDecisionCandidate({preflight,response}={}){
  const blockers=[];
  if(!preflight||!response) return {ok:false,reason:"authorizing-evidence-missing",blockers:["authorizing-evidence-missing"]};
  if(preflight.result!=="ELIGIBLE_FOR_MANUAL_DECISION") blockers.push("preflight-not-eligible");
  if(!AUTHORIZING.has(preflight.requested_status)) blockers.push("preflight-status-not-authorizing");
  if(!preflight.legal_review_ref) blockers.push("legal-review-record-missing");
  if(!Boolean(preflight.asset_linked)) blockers.push("asset-not-linked");
  if(!Boolean(preflight.conditions_satisfied)) blockers.push("conditions-not-satisfied");
  if(!Boolean(response.archived)) blockers.push("response-not-archived");
  if(!Boolean(response.source_verified)) blockers.push("response-source-not-verified");
  if(response.review_state!=="LEGAL_REVIEW_REQUIRED") blockers.push("response-review-state-invalid");
  if(preflight.case_id!==response.case_id||preflight.response_evidence_id!==response.response_evidence_id) blockers.push("response-preflight-mismatch");

  const extraction=parseJsonList(response.extraction_json);
  const exact=extraction.find(row=>
    row&&row.rightScope===preflight.right_scope&&
    row.productSurface===preflight.product_surface&&
    row.status===preflight.requested_status
  );
  if(!exact) blockers.push("response-does-not-support-exact-scope-status");

  const evidenceRefs=parseJsonList(preflight.evidence_refs_json).filter(x=>typeof x==="string"&&x.trim());
  if(evidenceRefs.length===0) blockers.push("preflight-evidence-empty");

  return {
    ok:true,
    eligible:blockers.length===0,
    blockers,
    decision:blockers.length?null:{
      caseId:preflight.case_id,
      preflightId:preflight.preflight_id,
      responseEvidenceId:preflight.response_evidence_id,
      rightScope:preflight.right_scope,
      productSurface:preflight.product_surface,
      status:preflight.requested_status,
      territories:parseJsonList(preflight.territories_json),
      platforms:parseJsonList(preflight.platforms_json),
      conditions:parseJsonList(preflight.conditions_json),
      evidenceRefs,
      validFrom:preflight.valid_from||null,
      validUntil:preflight.valid_until||null,
      legalReviewRef:preflight.legal_review_ref
    }
  };
}
