import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-api-governance-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const maturity=new Set(data.maturityStates||[]);
for(const x of ["EXPERIMENTAL","BETA","STABLE","DEPRECATED"]) if(!maturity.has(x)) throw new Error("missing maturity state "+x);

const dep=new Set(data.deprecationRequiredFields||[]);
for(const x of ["target","reason","replacement","announcedAt","minimumRemovalAt","migrationGuide"]){
  if(!dep.has(x)) throw new Error("missing deprecation field "+x);
}

const jsonRules=new Set(data.jsonRules||[]);
for(const x of ["STABLE_IDS","LIMIT_REQUIRED_FIELDS","ADDITIVE_FIELDS_PREFERRED","ENUMS_EVOLVE_CAUTIOUSLY","ISO_8601_DATES","DOCUMENTED_STATES"]){
  if(!jsonRules.has(x)) throw new Error("missing json rule "+x);
}

const clientRules=new Set(data.clientRules||[]);
for(const x of ["CENTRALIZED_CLIENTS","AUTH_HANDLED_CENTRALLY","VALIDATION","STRUCTURED_ERRORS","RETRY_POLICY","VERSION_HANDLING","TIMEOUT","CACHE_POLICY"]){
  if(!clientRules.has(x)) throw new Error("missing client rule "+x);
}

const manager=new Set(data.managerProtocol||[]);
for(const x of ["VERSIONED","CAPABILITY_NEGOTIATION","IDENTITY","CONSENT","BACKWARD_COMPATIBILITY","INCOMPATIBLE_VERSION_EXPLICIT_STATE"]){
  if(!manager.has(x)) throw new Error("missing manager protocol rule "+x);
}

const webhooks=new Set(data.webhookRules||[]);
for(const x of ["VERSIONED_PAYLOAD","SIGNATURE","IDEMPOTENCY","REPLAY_PROTECTION","RETRY_POLICY"]){
  if(!webhooks.has(x)) throw new Error("missing webhook rule "+x);
}

const tests=new Set(data.stableChangeTests||[]);
for(const x of ["CONTRACT_TESTS","OLD_FIXTURE","NEW_FIXTURE","CONSUMER_COMPATIBILITY","ROLLBACK"]){
  if(!tests.has(x)) throw new Error("missing stable change test "+x);
}

const gate=new Set(data.publicationGate||[]);
for(const x of ["VERSIONING_POLICY","DEPRECATION_POLICY","CONTRACT_TESTS","CHANGELOG","MIGRATION_GUIDANCE","OWNER"]){
  if(!gate.has(x)) throw new Error("missing publication gate "+x);
}

const invariants=new Set(data.invariants||[]);
for(const x of [
  "ADDITIVE_CHANGES_PREFERRED","NO_SILENT_SEMANTIC_CHANGE_FOR_STABLE_API",
  "NO_STABLE_REMOVAL_WITHOUT_MIGRATION_WINDOW","FRONTEND_NO_SCATTERED_FETCH",
  "MANAGER_PROTOCOL_CAPABILITY_NEGOTIATED","WEBHOOKS_REPLAY_PROTECTED",
  "SEARCH_ADAPTER_OPTIONAL_CORE_SURVIVES","ROLLBACK_REQUIRED_FOR_STABLE_EVOLUTION"
]){
  if(!invariants.has(x)) throw new Error("missing invariant "+x);
}

for(const [key,value] of Object.entries(data.productionStatus||{})){
  if(value!=="NOT_IMPLEMENTED" && value!=="NOT_SELECTED") throw new Error("unexpected production status "+key+"="+value);
}

console.log("API_MATURITY_STATE_COUNT",maturity.size);
console.log("API_PUBLICATION_GATE_COUNT",gate.size);
console.log("API_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_API_GOVERNANCE_CONTRACT");
