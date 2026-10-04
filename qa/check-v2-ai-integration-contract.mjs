import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-ai-integration-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

for(const tier of ["READ","PLAN","EXECUTE_SAFE","EXECUTE_SENSITIVE","BLOCKED"]){
  if(!(data.permissionTiers||[]).includes(tier)) throw new Error("missing permission tier: "+tier);
}
for(const state of [
  "BACKEND_UNAVAILABLE","COMPOSER_DISABLED","NO_MODEL_SELECTED","NO_PROVIDER_SELECTED",
  "NO_PERSISTENT_MEMORY","NO_TOOL_EXECUTION","INSUFFICIENT_EVIDENCE_SAFE_FALLBACK"
]){
  if(!(data.previewStates||[]).includes(state)) throw new Error("missing preview state: "+state);
}
for(const invariant of [
  "NO_FAKE_MODEL_RESPONSE","NO_FAKE_TOOL_EXECUTION","NO_FAKE_PERSISTENT_MEMORY",
  "NO_FAKE_BACKEND_RESULT","NO_LEGAL_APPROVAL_INFERENCE",
  "NO_COMPATIBILITY_CERTAINTY_WITHOUT_EVIDENCE","SENSITIVE_ACTIONS_REQUIRE_POLICY_GATE",
  "BLOCKED_ACTIONS_CANNOT_BE_AUTO_EXECUTED","EXTERNAL_CONTENT_IS_DATA_NOT_SYSTEM_INSTRUCTION",
  "PROVIDER_INDEPENDENCE_REQUIRED"
]){
  if(!(data.invariants||[]).includes(invariant)) throw new Error("missing invariant: "+invariant);
}
for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED") throw new Error("production status must remain honest before implementation: "+key);
}
console.log("MODARYX_AI_PERMISSION_TIER_COUNT",data.permissionTiers.length);
console.log("MODARYX_AI_PREVIEW_STATE_COUNT",data.previewStates.length);
console.log("MODARYX_AI_INVARIANT_COUNT",data.invariants.length);
console.log("PASS_V2_MODARYX_AI_INTEGRATION_CONTRACT");
