import fs from "node:fs";
const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-install-manager-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const states=new Set(data.managerStates||[]);
for(const x of ["not-detected","available","connected","incompatible-version","permission-required","unavailable"]) if(!states.has(x)) throw new Error("missing manager state "+x);
const preflight=new Set(data.installPreflight||[]);
for(const x of ["game","gameVersion","loaderFramework","platform","release","dependencies","conflicts","provenance","distribution"]) if(!preflight.has(x)) throw new Error("missing preflight field "+x);
const actions=new Set(data.actionModes||[]);
for(const x of ["INSTALL_WITH_MANAGER","MANUAL_DOWNLOAD","ADD_TO_COLLECTION","ADD_TO_PROFILE"]) if(!actions.has(x)) throw new Error("missing action mode "+x);
const inv=new Set(data.invariants||[]);
for(const x of [
  "NEVER_SIMULATE_AUTOMATED_INSTALL_CAPABILITY",
  "MANAGER_INSTALL_REQUIRES_REAL_MANAGER_CAPABILITY",
  "MANUAL_DOWNLOAD_REQUIRES_PUBLISHED_AUTHORIZED_ARTIFACT",
  "NO_PROFILE_SELECTED_SILENTLY",
  "UNRESOLVED_CONFLICT_IS_BLOCKED_OR_REQUIRES_EXPLICIT_CHOICE",
  "NO_ARBITRARY_PROGRESS_PERCENTAGE",
  "FAILED_INSTALL_NEVER_MARKS_PROFILE_INSTALLED",
  "UPDATE_NEVER_SILENTLY_CHANGES_GAME_VERSION_LOADER_DEPENDENCIES_OR_CONFIG",
  "DEEPLINK_REQUIRES_EXPLICIT_USER_ACTION",
  "NO_SECRET_IN_MANAGER_URL",
  "NO_SILENT_INSTALL",
  "NO_LOCAL_MOD_LIST_OR_FILE_PATH_COLLECTION_WITHOUT_CONSENT_AND_NECESSITY",
  "MOBILE_NEVER_SHOWS_MANAGER_INSTALL_WHEN_MANAGER_UNAVAILABLE",
  "PRE_ACTION_REQUIRES_DISTRIBUTION_PROVENANCE_HASH_RIGHTS_WARNINGS"
]) if(!inv.has(x)) throw new Error("missing invariant "+x);
for(const [k,v] of Object.entries(data.productionStatus||{})) if(v!=="NOT_IMPLEMENTED") throw new Error("production status drift "+k+"="+v);
console.log("INSTALL_MANAGER_STATE_COUNT",states.size);
console.log("INSTALL_MANAGER_PREFLIGHT_COUNT",preflight.size);
console.log("INSTALL_MANAGER_INVARIANT_COUNT",inv.size);
console.log("PASS_V2_INSTALL_MANAGER_CONTRACT");
