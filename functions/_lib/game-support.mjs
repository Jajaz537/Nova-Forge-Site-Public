import {rightsProductSurfaces,rightsScopes} from "./rights-registry.mjs";

const REQUEST_STATES=new Set(["REQUESTED","TRIAGE","ACCEPTED_SAFE_BASELINE","DECLINED_PRODUCT","DUPLICATE","ABUSE_BLOCKED"]);
const DECISIONS=new Set(["ACCEPTED_SAFE_BASELINE","DECLINED_PRODUCT","DUPLICATE","ABUSE_BLOCKED"]);
const SAFE_URLS=12;
const GAME_ID=/^mx_[a-z0-9][a-z0-9_-]{2,95}$/;

const text=(value,max,{required=false}={})=>{
  if(value===undefined||value===null) return required?null:"";
  if(typeof value!=="string") return null;
  const v=value.trim();
  if(required&&!v) return null;
  return v.length<=max?v:null;
};

const list=(value,{maxItems=32,maxLen=120,required=false}={})=>{
  if(!Array.isArray(value)||(required&&value.length===0)||value.length>maxItems) return null;
  const out=[];
  for(const raw of value){
    const v=text(raw,maxLen,{required:true});
    if(!v) return null;
    if(!out.includes(v)) out.push(v);
  }
  return out;
};

const httpsUrl=value=>{
  try{
    const u=new URL(value);
    return u.protocol==="https:"?u.href:null;
  }catch{return null}
};

export function normalizeGameSupportKey(name){
  const value=String(name||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  return value.replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,120);
}

export async function gameSupportActorKey(sub){
  const bytes=new TextEncoder().encode(String(sub||""));
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",bytes));
  return "game-support:"+[...digest].map(v=>v.toString(16).padStart(2,"0")).join("").slice(0,40);
}

export function validateGameSupportRequest(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"game-support-request-invalid"};
  for(const forbidden of ["publisherApproval","licenseGranted","officialPartnership","verifiedPublisherContact"]){
    if(Object.prototype.hasOwnProperty.call(input,forbidden)) return {ok:false,reason:"member-rights-claim-forbidden"};
  }
  const gameName=text(input.gameName,120,{required:true});
  const platforms=list(input.platforms,{maxItems:16,maxLen:80,required:true});
  const developerName=text(input.developer??"",160);
  const publisherName=text(input.publisher??"",160);
  const reason=text(input.reason??"",1200);
  if(!gameName||!platforms||developerName===null||publisherName===null||reason===null) return {ok:false,reason:"game-support-fields-invalid"};
  const sourceUrls=input.sourceUrls??[];
  if(!Array.isArray(sourceUrls)||sourceUrls.length>SAFE_URLS) return {ok:false,reason:"game-support-source-urls-invalid"};
  const normalizedUrls=[];
  for(const raw of sourceUrls){
    const url=httpsUrl(raw);
    if(!url) return {ok:false,reason:"game-support-source-url-invalid"};
    if(!normalizedUrls.includes(url)) normalizedUrls.push(url);
  }
  const normalizedGameKey=normalizeGameSupportKey(gameName);
  if(normalizedGameKey.length<2) return {ok:false,reason:"game-support-name-invalid"};
  return {ok:true,value:{
    gameName,normalizedGameKey,platforms,developerName:developerName||null,
    publisherName:publisherName||null,reason,sourceUrls:normalizedUrls
  }};
}

const checksRequired=[
  "gameExists","duplicateRequest","moddingRelevance","knownRestrictionsReviewed",
  "productFeasibility","securityRiskReviewed","legalRiskReviewed"
];

export function validateGameSupportTriage(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"game-support-triage-invalid"};
  const requestId=text(input.requestId,160,{required:true});
  if(!requestId||!/^mx_game_support_request_[a-f0-9]{32}$/.test(requestId)) return {ok:false,reason:"game-support-request-id-invalid"};
  if(!DECISIONS.has(input.decision)) return {ok:false,reason:"game-support-decision-invalid"};
  const decisionReason=text(input.decisionReason,2000,{required:true});
  if(!decisionReason) return {ok:false,reason:"game-support-decision-reason-invalid"};

  const checks=input.triageChecks;
  if(!checks||typeof checks!=="object"||Array.isArray(checks)) return {ok:false,reason:"game-support-triage-checks-invalid"};
  for(const key of checksRequired) if(typeof checks[key]!=="boolean") return {ok:false,reason:"game-support-triage-checks-invalid"};

  const accepted=input.decision==="ACCEPTED_SAFE_BASELINE";
  let gameId=null,publisherName=null,requestedScopes=[],productSurfaces=[];
  if(accepted){
    gameId=text(input.gameId,96,{required:true});
    publisherName=text(input.publisherName,160,{required:true});
    if(!gameId||!GAME_ID.test(gameId)||!publisherName) return {ok:false,reason:"game-support-acceptance-fields-invalid"};
    const allowedScopes=new Set(rightsScopes());
    const allowedSurfaces=new Set(rightsProductSurfaces());
    requestedScopes=list(input.requestedScopes,{maxItems:64,maxLen:80,required:true});
    productSurfaces=list(input.productSurfaces,{maxItems:16,maxLen:80,required:true});
    if(!requestedScopes||requestedScopes.some(x=>!allowedScopes.has(x))||!productSurfaces||productSurfaces.some(x=>!allowedSurfaces.has(x))) {
      return {ok:false,reason:"game-support-acceptance-scope-invalid"};
    }
    if(
      checks.gameExists!==true||checks.duplicateRequest!==false||checks.moddingRelevance!==true||
      checks.knownRestrictionsReviewed!==true||checks.productFeasibility!==true||
      checks.securityRiskReviewed!==true||checks.legalRiskReviewed!==true
    ) return {ok:false,reason:"game-support-acceptance-triage-incomplete"};
  }

  return {ok:true,value:{
    requestId,decision:input.decision,decisionReason,triageChecks:Object.fromEntries(checksRequired.map(k=>[k,checks[k]])),
    gameId,publisherName,requestedScopes,productSurfaces
  }};
}

const parse=value=>{try{const v=JSON.parse(value||"[]");return Array.isArray(v)?v:[]}catch{return []}};

export function publicGameSupportRequest(row){
  return {
    requestId:row.request_id,gameName:row.game_name,platforms:parse(row.platforms_json),
    developer:row.developer_name||null,publisher:row.publisher_name||null,reason:row.reason||"",
    sourceUrls:parse(row.source_urls_json),state:REQUEST_STATES.has(row.state)?row.state:"REQUESTED",
    decisionReason:row.decision_reason||null,gameId:row.game_id||null,rightsCaseId:row.rights_case_id||null,
    safeBaselineAllowed:Boolean(row.safe_baseline_allowed),createdAt:row.created_at,updatedAt:row.updated_at,
    decidedAt:row.decided_at||null
  };
}
