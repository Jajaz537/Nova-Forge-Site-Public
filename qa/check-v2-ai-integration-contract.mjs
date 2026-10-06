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
if(data.foundationArtifact?.version!=="0.141") throw new Error("Foundation version must be v0.141");
if(data.foundationArtifact?.sha256!=="714fe55635fdbdfcf11f69257ec0c4154e797d2ac2a72ea0e75a39dde4359a4d") throw new Error("Foundation SHA mismatch");
if(data.foundationArtifact?.tests!=="392/392"||data.foundationArtifact?.evals!=="12/12") throw new Error("sealed v0.141 proof mismatch");
for(const gate of ["exactArchive","releaseGate","hardwareBaseline"]){
  if(data.foundationArtifact?.realTargetEvidence?.[gate]!=="PASS") throw new Error("missing real-target PASS: "+gate);
}
if(data.foundationArtifact?.realTargetEvidence?.coreIdleBaseline?.version!=="0.140"||data.foundationArtifact?.realTargetEvidence?.coreIdleBaseline?.status!=="PASS") throw new Error("core idle baseline provenance mismatch");
if(data.foundationArtifact?.realTargetEvidence?.modelQualification!=="IN_PROGRESS") throw new Error("model qualification must remain in progress until final target proof");
if(data.foundationArtifact?.realTargetEvidence?.gameImpact!=="NOT_RUN") throw new Error("game impact must remain NOT_RUN");
if(data.foundationArtifact?.realTargetEvidence?.multimodal!=="IN_PROGRESS") throw new Error("multimodal must remain in progress until vision closes");
if(data.foundationArtifact?.realTargetEvidence?.vfCreditApplied!==false) throw new Error("VF credit must remain unapplied");
console.log("MODARYX_AI_PERMISSION_TIER_COUNT",data.permissionTiers.length);
console.log("MODARYX_AI_PREVIEW_STATE_COUNT",data.previewStates.length);
console.log("MODARYX_AI_INVARIANT_COUNT",data.invariants.length);
console.log("PASS_V2_MODARYX_AI_INTEGRATION_CONTRACT");
