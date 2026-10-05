import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-route-cutover-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const layers=new Set(data.layers||[]);
for(const x of ["ISOLATED_V2_BUILD","IMMUTABLE_V2_PREVIEW","VALIDATED_ROUTE_REDIRECT_MAPPING","CONTROLLED_PROMOTION"]){
  if(!layers.has(x)) throw new Error("missing layer: "+x);
}

const routeRules=new Set(data.routeRules||[]);
for(const x of [
  "NO_BLIND_GLOBAL_REDIRECT",
  "NO_FAKE_CONTENT_ITEM_FOR_LEGACY_URL",
  "HISTORICAL_GAME_HUB_MAP_ONLY_IF_EQUIVALENT_EXISTS",
  "REDIRECT_NEVER_MASKS_SEMANTIC_INCOMPATIBILITY"
]){
  if(!routeRules.has(x)) throw new Error("missing route rule: "+x);
}

const seo=new Set(data.seoRules||[]);
for(const x of ["ONE_CANONICAL_PER_INDEXABLE_ROUTE","SITEMAP_FROM_REAL_V2_ROUTES","NO_GETNOVAFORGE_CANONICAL","NO_CANONICAL_TO_REMOVED_V1","PREVIEW_NOINDEX"]){
  if(!seo.has(x)) throw new Error("missing seo rule: "+x);
}

const sw=data.serviceWorkerCutoverOrder||[];
const requiredSw=["IDENTIFY_V1_CONTROLLED_CLIENTS","TRANSITION_OR_CONTROLLED_UNREGISTER","VERIFY_FRESH_BROWSER","VERIFY_EXISTING_V1_BROWSER","VERIFY_OFFLINE","VERIFY_POST_UPGRADE_REFRESH","VERIFY_ROLLBACK"];
if(JSON.stringify(sw)!==JSON.stringify(requiredSw)) throw new Error("service worker cutover order changed");

const storage=new Set(data.storageRules||[]);
for(const x of ["LEGACY_NAMESPACE_READ_ONLY_VIA_MIGRATOR","COPY_ONLY_MAPPABLE_DATA","BACKUP_AND_VERSION","WRITE_V2_NAMESPACE_MODARYX_V2","MARK_MIGRATION_COMPLETE","PRESERVE_UNKNOWN_HISTORY"]){
  if(!storage.has(x)) throw new Error("missing storage rule: "+x);
}

const preview=new Set(data.previewRules||[]);
for(const x of ["BOUND_TO_EXACT_SHA","NO_FALLBACK_TO_OLD_PR","PRODUCTION_DOMAIN_NOT_PROOF","NOINDEX","NO_SHARED_CONTAMINATING_SW"]){
  if(!preview.has(x)) throw new Error("missing preview rule: "+x);
}

const forbidden=new Set(data.forbiddenWithoutExplicitInstruction||[]);
for(const x of ["DNS","DNSSEC","NAMESERVERS","IONOS","CLOUDFLARE_CRITICAL_SETTINGS","PAGES_DOMAIN"]){
  if(!forbidden.has(x)) throw new Error("missing forbidden mutation: "+x);
}

const status=data.productionStatus||{};
if(status.rootV2!=="NOT_CREATED") throw new Error("rootV2 status must stay NOT_CREATED before gate");
if(status.routeRedirects!=="DESIGN_ONLY") throw new Error("route redirects must stay DESIGN_ONLY");
if(status.swMigrationBrowser!=="NOT_EXECUTED") throw new Error("sw migration must stay NOT_EXECUTED");
if(status.cutover!=="NOT_EXECUTED") throw new Error("cutover must stay NOT_EXECUTED");
if(status.dnsCloudflare!=="UNCHANGED") throw new Error("dns/cloudflare status must stay UNCHANGED");

const invariants=new Set(data.invariants||[]);
for(const x of [
  "LAYERS_DO_NOT_AUTO_AUTHORIZE_NEXT_LAYER",
  "NO_PUBLIC_REDIRECT_BEFORE_EQUIVALENT_V2_ROUTE_PROVEN",
  "NO_GLOBAL_STORAGE_DELETE",
  "NO_SW_CUTOVER_BEFORE_MIGRATION_STRATEGY",
  "ROLLBACK_MUST_RESTORE_BUILD_AND_ROUTES",
  "ROLLBACK_MUST_AVOID_STORAGE_CORRUPTION",
  "PREVIEW_MUST_BE_IMMUTABLE_AND_NOINDEX",
  "MAIN_AND_PRODUCTION_UNTOUCHED_UNTIL_CONTROLLED_PROMOTION"
]){
  if(!invariants.has(x)) throw new Error("missing invariant: "+x);
}

console.log("ROUTE_CUTOVER_LAYER_COUNT",layers.size);
console.log("ROUTE_CUTOVER_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_ROUTE_CUTOVER_CONTRACT");
