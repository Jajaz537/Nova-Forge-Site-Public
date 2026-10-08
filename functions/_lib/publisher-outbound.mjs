import {rightsProductSurfaces,rightsScopes} from "./rights-registry.mjs";

const SCOPES=new Set(rightsScopes());
const SURFACES=new Set(rightsProductSurfaces());
const CHANNELS=new Set(["EMAIL","FORM","PORTAL","POSTAL","OTHER_OFFICIAL"]);
const CASE_ID=/^mx_rights_case_[a-f0-9]{32}$/;
const CONTACT_ID=/^mx_rights_contact_[a-f0-9]{32}$/;
const HEX64=/^[a-f0-9]{64}$/;

const clean=(value,max)=>{
  if(typeof value!=="string") return null;
  const v=value.trim();
  return v&&v.length<=max?v:null;
};
const list=(value,allowed)=>{
  if(!Array.isArray(value)||value.length===0||value.length>64) return null;
  const out=[];
  for(const raw of value){
    const v=clean(raw,120);
    if(!v||!allowed.has(v)) return null;
    if(!out.includes(v)) out.push(v);
  }
  return out.sort();
};

export function validatePublisherOutboundPreparation(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"publisher-outbound-invalid"};
  const caseId=clean(input.caseId,120);
  const contactEvidenceId=clean(input.contactEvidenceId,120);
  const logicalRequestId=clean(input.logicalRequestId,180);
  const templateVersion=clean(input.templateVersion,80);
  const idempotencyKeySha256=typeof input.idempotencyKeySha256==="string"?input.idempotencyKeySha256.trim().toLowerCase():"";
  const requestedScopes=list(input.requestedScopes,SCOPES);
  const productSurfaces=list(input.productSurfaces,SURFACES);
  if(!CASE_ID.test(caseId||"")) return {ok:false,reason:"rights-case-id-invalid"};
  if(!CONTACT_ID.test(contactEvidenceId||"")) return {ok:false,reason:"contact-evidence-id-invalid"};
  if(!logicalRequestId||!templateVersion||!Number.isInteger(input.requestVersion)||input.requestVersion<1) return {ok:false,reason:"publisher-outbound-fields-invalid"};
  if(!requestedScopes||!productSurfaces) return {ok:false,reason:"publisher-outbound-scopes-invalid"};
  if(!CHANNELS.has(input.contactChannel)) return {ok:false,reason:"publisher-outbound-channel-invalid"};
  if(!HEX64.test(idempotencyKeySha256)) return {ok:false,reason:"publisher-outbound-idempotency-invalid"};
  return {ok:true,value:{
    caseId,contactEvidenceId,logicalRequestId,requestVersion:input.requestVersion,templateVersion,
    requestedScopes,productSurfaces,contactChannel:input.contactChannel,idempotencyKeySha256
  }};
}

export function evaluatePublisherOutboundReadiness({
  caseState,contactState,contactChannel,contactRefDigestSha256,
  requestedScopes,productSurfaces,caseRequestedScopes,caseProductSurfaces,
  suppressionActive=false,providerAvailable=false,templateCurrent=false
}={}){
  const blockers=[];
  if(!["CONTACT_VERIFIED","REQUEST_READY"].includes(caseState)) blockers.push("rights-case-not-ready");
  if(contactState!=="CONTACT_VERIFIED") blockers.push("official-contact-not-verified");
  if(!CHANNELS.has(contactChannel)) blockers.push("authorized-outbound-channel-missing");
  if(!HEX64.test(String(contactRefDigestSha256||""))) blockers.push("contact-reference-invalid");
  const reqScopes=Array.isArray(requestedScopes)?[...new Set(requestedScopes)].sort():[];
  const caseScopes=Array.isArray(caseRequestedScopes)?[...new Set(caseRequestedScopes)].sort():[];
  const reqSurfaces=Array.isArray(productSurfaces)?[...new Set(productSurfaces)].sort():[];
  const caseSurfaces=Array.isArray(caseProductSurfaces)?[...new Set(caseProductSurfaces)].sort():[];
  if(reqScopes.length===0||reqScopes.some(x=>!caseScopes.includes(x))) blockers.push("requested-scopes-not-authorized-for-case");
  if(reqSurfaces.length===0||reqSurfaces.some(x=>!caseSurfaces.includes(x))) blockers.push("product-surfaces-not-authorized-for-case");
  if(suppressionActive) blockers.push("active-refusal-or-opt-out");
  if(!templateCurrent) blockers.push("request-template-not-current");
  if(!providerAvailable) blockers.push("outbound-provider-not-implemented");
  return {
    readyForPreparation:blockers.filter(x=>x!=="outbound-provider-not-implemented").length===0,
    readyForQueue:blockers.length===0,
    blockers
  };
}

export const publisherOutboundNetworkDispatchImplemented=()=>false;
