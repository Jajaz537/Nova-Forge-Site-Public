import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-seo-i18n-content-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

for(const value of ["uniqueTitle","usefulDescription","canonical","readableUrl"]){
  if(!(data.seo?.requiredPerIndexableSurface||[]).includes(value)) throw new Error("missing SEO surface requirement: "+value);
}
for(const value of ["noindex","nofollow","noarchive"]){
  if(!(data.seo?.preview||[]).includes(value)) throw new Error("missing preview robots rule: "+value);
}
for(const value of ["longerTextReady","pluralReady","dateNumberLocaleReady","multiLanguageReady","creatorContentMayRemainOriginalLanguage","accentInsensitiveSearch"]){
  if(!(data.i18n?.requirements||[]).includes(value)) throw new Error("missing i18n requirement: "+value);
}
for(const state of ["DRAFT","PUBLISHED","UPDATED","ARCHIVED","REMOVED"]){
  if(!(data.editorialStates||[]).includes(state)) throw new Error("missing editorial state: "+state);
}
for(const field of ["title","game","type","author","release","state"]){
  if(!(data.requiredContentMetadata||[]).includes(field)) throw new Error("missing content metadata: "+field);
}
const invariants=new Set(data.invariants||[]);
for(const invariant of [
  "PREVIEW_IS_NOINDEX",
  "CANONICALS_USE_V2_ROUTES",
  "GETNOVAFORGE_IS_NOT_A_V2_CANONICAL_TARGET",
  "FILTERS_DO_NOT_CREATE_UNBOUNDED_INDEXABLE_URLS",
  "STRUCTURED_DATA_MUST_BE_FACTUAL",
  "REMOVED_CONTENT_HAS_EXPLICIT_URL_BEHAVIOR",
  "ACTIVE_CATALOG_CLAIM_REQUIRES_SUPPORT_STATE",
  "EDITORIAL_HUB_DOES_NOT_IMPLY_MOD_DISTRIBUTION",
  "SNIPPETS_DO_NOT_INVENT_POPULARITY_OR_COMPATIBILITY",
  "UI_AND_COMMUNITY_CONTENT_REMAIN_DISTINCT",
  "I18N_SUPPORTS_TEXT_EXPANSION_AND_LOCALE_FORMATS",
  "LEGAL_TRANSLATION_REQUIRES_APPROVAL"
]){
  if(!invariants.has(invariant)) throw new Error("missing invariant: "+invariant);
}
for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest before implementation: "+key);
}

const index=fs.readFileSync("review-evidence/modaryx-v2-living-threshold-prototype-20261003/index.html","utf8");
const app=fs.readFileSync("review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/App.jsx","utf8");
if(!index.includes('<html lang="fr">')) throw new Error("prototype language regression");
if(!index.includes('<meta name="robots" content="noindex,nofollow,noarchive" />')) throw new Error("preview robots regression");
if(!index.includes("<title>MODARYX V2 — Prototype Living Threshold</title>")) throw new Error("preview title regression");
if(!app.includes("document.title=routeTitle;")) throw new Error("route title update missing");
if(/getnovaforge\.com/i.test(index)) throw new Error("retired domain leaked into preview index");

console.log("SEO_I18N_EDITORIAL_STATE_COUNT",data.editorialStates.length);
console.log("SEO_I18N_INVARIANT_COUNT",invariants.size);
console.log("SEO_I18N_PREVIEW_ROBOTS noindex,nofollow,noarchive");
console.log("PASS_V2_SEO_I18N_CONTENT_CONTRACT");
