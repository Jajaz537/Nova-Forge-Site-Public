import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-forge-handoff-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const capabilityStates=new Set(d["capabilityStates"]||[]);for(const x of ["UNAVAILABLE","RUNTIME_NOT_DETECTED","PROTOCOL_UNSUPPORTED","ADAPTER_UNSUPPORTED","SOURCE_UNSUPPORTED","ARTIFACT_UNAVAILABLE","READY_FOR_HANDOFF","LOCAL_CONFIRMATION_REQUIRED"]) if(!capabilityStates.has(x)) throw new Error("missing capabilityStates "+x);
const allowedActions=new Set(d["allowedActions"]||[]);for(const x of ["OPEN_CONTENT","OPEN_RELEASE","OPEN_PROFILE","PREPARE_ADD_TO_PROFILE","PREPARE_INSTALL","PREPARE_UPDATE"]) if(!allowedActions.has(x)) throw new Error("missing allowedActions "+x);
const forbiddenActions=new Set(d["forbiddenActions"]||[]);for(const x of ["RUN_COMMAND","EXECUTE_SCRIPT","WRITE_PATH","DELETE_PATH"]) if(!forbiddenActions.has(x)) throw new Error("missing forbiddenActions "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["WEB_ONLY_PREPARES_DECLARATIVE_INTENT","WEB_NEVER_WRITES_LOCAL_GAME_FILES","WEB_NEVER_SIMULATES_LOCAL_INSTALL","CAPABILITY_HANDSHAKE_REQUIRED_BEFORE_ACTIVE_CTA","FORGE_REVALIDATES_LOCALLY_BEFORE_MUTATION","LOCAL_CONFIRMATION_REQUIRED_FOR_RISKY_MUTATION","SITE_NEVER_CLAIMS_INSTALLED_UPDATED_OR_ROLLED_BACK_WITHOUT_VERIFIABLE_RECEIPT"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_SELECTED","NOT_CREATED","NONE","BLOCKED","NOT_IMPLEMENTED","NOT_PROVEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_FORGE_HANDOFF_CONTRACT");
