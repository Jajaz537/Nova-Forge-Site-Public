import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-onboarding-account-creator-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const guest=new Set(data.guestCapabilities||[]);
for(const x of ["SEARCH","BROWSE_GAMES","READ_CONTENT","READ_COMPATIBILITY","READ_DEPENDENCIES","VIEW_PUBLIC_COLLECTIONS","VIEW_PUBLIC_CREATORS","READ_HELP_AND_SECURITY"]){
  if(!guest.has(x)) throw new Error("missing guest capability "+x);
}
const auth=new Set(data.authRequiredCapabilities||[]);
for(const x of ["PUBLISH","REMOTE_PRIVATE_SYNC","REMOTE_FOLLOW","TEAM_MANAGEMENT","SERVER_NOTIFICATIONS","MODERATION_ACTIONS"]){
  if(!auth.has(x)) throw new Error("missing auth capability "+x);
}
if(data.onboarding?.skippable!==true) throw new Error("onboarding must remain skippable");

const identity=new Set(data.identitySeparation||[]);
for(const x of ["ACCOUNT","PUBLIC_PROFILE","CREATOR"]) if(!identity.has(x)) throw new Error("identity separation drift "+x);

const privacy=new Set(data.privacyDefaults||[]);
for(const x of ["LIBRARY_PRIVATE","FAVORITES_PRIVATE","GAME_PROFILES_PRIVATE_LOCAL","DRAFTS_PRIVATE","SAVED_SEARCHES_PRIVATE"]){
  if(!privacy.has(x)) throw new Error("missing private default "+x);
}

const sessions=new Set(data.sessionStates||[]);
for(const x of ["ANONYMOUS","AUTHENTICATED","EXPIRED","UNAVAILABLE","PERMISSION_DENIED"]){
  if(!sessions.has(x)) throw new Error("missing session state "+x);
}

const passkeys=new Set(data.passkeyRules||[]);
for(const x of ["BROWSER_SUPPORT_IS_NOT_ENROLLMENT","ENROLLMENT_IS_NOT_SUCCESSFUL_AUTHENTICATION","NEVER_SHOW_CONFIGURED_WITHOUT_PROOF"]){
  if(!passkeys.has(x)) throw new Error("missing passkey rule "+x);
}

const invariants=new Set(data.invariants||[]);
for(const x of [
  "GUEST_FIRST","NO_FORCED_LOGIN_FOR_EXPLORATION","ONBOARDING_SKIPPABLE",
  "ACCOUNT_PROFILE_CREATOR_SEPARATE","PRIVACY_PRIVATE_BY_DEFAULT",
  "SHARING_REQUIRES_EXPLICIT_ACTION","TEAM_PERMISSIONS_SERVER_AUTHORITY",
  "SESSION_UI_REFLECTS_REAL_STATE","PASSKEY_STATUS_REQUIRES_REAL_PROOF",
  "MARKETING_NOTIFICATION_NOT_DEFAULT","FAILED_SAVE_PRESERVES_LOCAL_CHANGES",
  "CRITICAL_ACTION_NOT_ICON_ONLY"
]){
  if(!invariants.has(x)) throw new Error("missing invariant "+x);
}

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest: "+key);
}

console.log("ONBOARDING_GUEST_CAPABILITY_COUNT",guest.size);
console.log("ONBOARDING_SESSION_STATE_COUNT",sessions.size);
console.log("ONBOARDING_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_ONBOARDING_ACCOUNT_CREATOR_CONTRACT");
