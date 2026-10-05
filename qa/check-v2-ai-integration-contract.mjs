import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-ai-integration-contract.json","utf8"));
if(data.schemaVersion!==2) throw new Error("unexpected schemaVersion");

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
const allowedProductionStates=new Set([
  "NOT_IMPLEMENTED",
  "FOUNDATION_IMPLEMENTED_NOT_DEPLOYED",
  "FOUNDER_ONLY_CODE_INTEGRATED_NOT_DEPLOYED"
]);
for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(!allowedProductionStates.has(value)) throw new Error("unexpected production status: "+key+"="+value);
}
if(data.productionStatus?.siteAssistant!=="FOUNDER_ONLY_CODE_INTEGRATED_NOT_DEPLOYED") throw new Error("site assistant status must remain deployment-honest");
if(data.foundationArtifact?.vfProgress!==83) throw new Error("VF progress must stay at 83 until external proofs close");
if(data.foundationArtifact?.version!=="0.140") throw new Error("Foundation version must be v0.140");
if(data.foundationArtifact?.sha256!=="870c0b8373e6751788a6ebe4423828a0a296a2b39f9af937f6c93114856f7e34") throw new Error("Foundation SHA mismatch");
if(data.foundationArtifact?.tests!=="389/389"||data.foundationArtifact?.evals!=="12/12") throw new Error("sealed v0.140 proof mismatch");
for(const gate of ["exactArchive","preflight","releaseGate","coreIdle"]){
  if(data.foundationArtifact?.realTargetEvidence?.[gate]!=="PASS") throw new Error("missing real-target PASS: "+gate);
}
for(const gate of ["modelQualification","gameImpact","multimodal"]){
  if(data.foundationArtifact?.realTargetEvidence?.[gate]!=="NOT_RUN") throw new Error("external proof must remain honest: "+gate);
}
console.log("MODARYX_AI_PERMISSION_TIER_COUNT",data.permissionTiers.length);
console.log("MODARYX_AI_PREVIEW_STATE_COUNT",data.previewStates.length);
console.log("MODARYX_AI_INVARIANT_COUNT",data.invariants.length);
console.log("PASS_V2_MODARYX_AI_INTEGRATION_CONTRACT");
