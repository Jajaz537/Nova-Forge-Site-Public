import fs from "node:fs";

const path="qa/modaryx-v2-game-rights-registry-contract.json";
const data=JSON.parse(fs.readFileSync(path,"utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const surfaces=new Set(data.productSurfaces||[]);
for(const v of ["WEB_PUBLIC","WEB_ADMIN","WEB_MARKETING","MODARYX_FORGE","CREATOR_STUDIO","API_INTEGRATION"]){
  if(!surfaces.has(v)) throw new Error("missing product surface: "+v);
}

const scopes=new Set(data.rightScopes||[]);
for(const v of [
  "TRADEMARK_TEXT_REFERENCE","OFFICIAL_LOGO","OFFICIAL_KEY_ART","OFFICIAL_SCREENSHOTS",
  "MOD_LISTING","MOD_HOSTING","MOD_DISTRIBUTION","MOD_INSTALLATION_HANDOFF",
  "API_ACCESS","COMMERCIAL_USE","COBRANDING","PARTNERSHIP_CLAIM"
]){
  if(!scopes.has(v)) throw new Error("missing right scope: "+v);
}

const statuses=new Set(data.scopeStatuses||[]);
for(const v of ["UNKNOWN","NOT_REQUESTED","PENDING","GRANTED","GRANTED_WITH_LIMITS","DENIED","RESTRICTED","EXPIRED","REVOKED","FORBIDDEN"]){
  if(!statuses.has(v)) throw new Error("missing scope status: "+v);
}

const authorizing=new Set(data.authorizingStatuses||[]);
if(authorizing.size!==2||!authorizing.has("GRANTED")||!authorizing.has("GRANTED_WITH_LIMITS")){
  throw new Error("only GRANTED and GRANTED_WITH_LIMITS may authorize");
}

const nonAuthorizing=new Set(data.nonAuthorizingStatuses||[]);
for(const v of ["UNKNOWN","NOT_REQUESTED","PENDING","DENIED","RESTRICTED","EXPIRED","REVOKED","FORBIDDEN","NO_RESPONSE","REQUEST_SENT","AWAITING_RESPONSE","LEGAL_REVIEW_REQUIRED"]){
  if(!nonAuthorizing.has(v)) throw new Error("missing non-authorizing status: "+v);
  if(authorizing.has(v)) throw new Error("non-authorizing state included as authorizing: "+v);
}

const registryFields=new Set(data.requiredRegistryFields||[]);
for(const v of ["GameId","GameName","Publisher","TrademarkOwners","PolicyEvidence","ContactEvidence","RightsCases","ScopeDecisions","Restrictions","NextReviewDue","AuditRefs"]){
  if(!registryFields.has(v)) throw new Error("missing registry field: "+v);
}

const decisionFields=new Set(data.requiredScopeDecisionFields||[]);
for(const v of ["ScopeDecisionId","GameId","RightScope","ProductSurface","Status","Territories","Platforms","Conditions","EvidenceRefs","Reviewer","VerifiedAt","RevalidationDue"]){
  if(!decisionFields.has(v)) throw new Error("missing scope decision field: "+v);
}

const guards=new Set(data.activationGuards||[]);
for(const v of [
  "exact_scope_match","product_surface_match","authorizing_status","evidence_archived",
  "source_verified","effective_date_reached","not_expired","not_revoked",
  "conditions_satisfied","asset_links_scope_decision","audit_event_present"
]){
  if(!guards.has(v)) throw new Error("missing activation guard: "+v);
}

const invariants=new Set(data.invariants||[]);
for(const v of [
  "NO_GLOBAL_APPROVED_ALL_STATE","NO_RESPONSE_NEVER_AUTHORIZES","PENDING_NEVER_AUTHORIZES",
  "LEGAL_REVIEW_REQUIRED_NEVER_AUTHORIZES","ONLY_EXACT_SCOPE_AND_SURFACE_CAN_AUTHORIZE",
  "DERIVED_FLAGS_ARE_NOT_AUTHORITY","EXPIRED_AND_REVOKED_FAIL_CLOSED",
  "WEB_PERMISSION_NEVER_IMPLIES_FORGE_PERMISSION","ASSET_MUST_REFERENCE_SCOPE_DECISION",
  "REGISTRY_UNAVAILABLE_FAILS_CLOSED_FOR_SENSITIVE_USES","IMPORTED_RECORDS_START_UNVERIFIED",
  "MEMBER_CANNOT_WRITE_GRANTED_OR_CONTACT_VERIFIED","AI_CANNOT_CREATE_GRANTED_WITHOUT_POLICY_GATE",
  "AUDIT_HISTORY_IS_NOT_SILENTLY_REWRITTEN"
]){
  if(!invariants.has(v)) throw new Error("missing registry invariant: "+v);
}

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest: "+key);
}

console.log("GAME_RIGHTS_REGISTRY_SURFACE_COUNT",surfaces.size);
console.log("GAME_RIGHTS_REGISTRY_SCOPE_COUNT",scopes.size);
console.log("GAME_RIGHTS_REGISTRY_STATUS_COUNT",statuses.size);
console.log("GAME_RIGHTS_REGISTRY_ACTIVATION_GUARD_COUNT",guards.size);
console.log("GAME_RIGHTS_REGISTRY_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_GAME_RIGHTS_REGISTRY_CONTRACT");
