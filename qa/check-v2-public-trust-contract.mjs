import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-public-trust-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const categories=new Set(data.categories||[]);
for(const x of [
  "operator_information","privacy","terms","community_ugc_rules",
  "cookies_storage","intellectual_property","security","support_contact"
]){
  if(!categories.has(x)) throw new Error("missing public trust category "+x);
}

const states=new Set(data.readinessStates||[]);
for(const x of [
  "STRUCTURE_READY","PRODUCT_FACTS_MISSING","LEGAL_DRAFT_REQUIRED",
  "LEGAL_REVIEW_REQUIRED","APPROVED_FOR_PUBLICATION","PUBLISHED","REVIEW_DUE"
]){
  if(!states.has(x)) throw new Error("missing readiness state "+x);
}

const publishable=new Set(data.publishableStates||[]);
if(publishable.size!==2||!publishable.has("APPROVED_FOR_PUBLICATION")||!publishable.has("PUBLISHED")){
  throw new Error("publishable states drift");
}

const invariants=new Set(data.invariants||[]);
for(const x of [
  "NO_FAKE_OPERATOR_IDENTITY","NO_FAKE_ADDRESS","NO_FAKE_DPO",
  "NO_FAKE_RETENTION_PERIOD","NO_FAKE_PROCESSOR_LIST","NO_FAKE_SECURITY_CONTACT",
  "NO_FAKE_SUPPORT_CHANNEL","PRIVACY_DERIVED_FROM_DEPLOYED_ARCHITECTURE",
  "PUBLIC_CHANNELS_MUST_EXIST_BEFORE_PUBLICATION","AI_DISCLOSURES_MATCH_DEPLOYED_PROVIDERS",
  "PLACEHOLDER_NEVER_PRESENTED_AS_FINAL"
]){
  if(!invariants.has(x)) throw new Error("missing public trust invariant "+x);
}

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(!["NOT_PROVEN","NOT_WRITTEN","NOT_IMPLEMENTED"].includes(value)){
    throw new Error("production status must remain honest: "+key+"="+value);
  }
}

if(!String(data.prototypeBanner||"").includes("Prototype noindex")) throw new Error("prototype banner must remain explicit");

console.log("PUBLIC_TRUST_CATEGORY_COUNT",categories.size);
console.log("PUBLIC_TRUST_READINESS_STATE_COUNT",states.size);
console.log("PUBLIC_TRUST_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_PUBLIC_TRUST_CONTRACT");
