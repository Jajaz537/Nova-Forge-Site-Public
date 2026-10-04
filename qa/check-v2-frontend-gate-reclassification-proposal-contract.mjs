import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-frontend-gate-reclassification-proposal-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
if(d.status!=="PROPOSAL_ONLY_NOT_ACTIVE") throw new Error("proposal status drift");
const conditions=new Set(d.optionBConditions||[]);
for(const x of [
  "PREVIEW_ENGINEERING_ONLY","DEDICATED_BRANCH","NOINDEX","NO_MAIN",
  "NO_DNS_PAGES_WORKERS_PRODUCTION","NO_REAL_DATA_REQUIRED",
  "NO_AUTOMATIC_V1_REUSE","DEMO_ASSETS_FIXTURES_SEPARATE",
  "STACK_SELECTED_BY_EXPLICIT_CANONICAL_DECISION",
  "ANTI_CONTAMINATION_REQUIRED","ROLLBACK_WITHOUT_PRODUCTION_IMPACT"
]) if(!conditions.has(x)) throw new Error("missing option B condition "+x);

const activation=new Set(d.activationRequirements||[]);
for(const x of [
  "EXPLICIT_CANONICAL_DECISION","STACK_SELECTED","ROOT_PATH_DEFINED",
  "WORK_BRANCH_DEFINED","INITIAL_PERF_BUDGETS_DEFINED",
  "CSP_ROUTING_STORAGE_SW_RULES_DEFINED","HUMAN_BLOCKERS_REMAIN_OPEN",
  "NO_IMPLICIT_CUTOVER"
]) if(!activation.has(x)) throw new Error("missing activation requirement "+x);

const invariants=new Set(d.invariants||[]);
for(const x of [
  "PROPOSAL_NEVER_SELF_ACTIVATES","PROPOSAL_NEVER_AUTHORIZES_ROOT",
  "PROPOSAL_NEVER_SELECTS_STACK","PROPOSAL_NEVER_AUTHORIZES_PRODUCTION_DEPLOY",
  "HIGH_FI_GATE_REMAINS_BLOCKED","HUMAN_DEVICE_BLOCKERS_REMAIN_REQUIRED_BEFORE_CUTOVER",
  "NO_FAKE_BACKEND_IN_PREVIEW"
]) if(!invariants.has(x)) throw new Error("missing invariant "+x);

for(const [k,v] of Object.entries(d.statusFields||{})){
  if(k==="productionCutover"){
    if(v!=="BLOCKED") throw new Error("production cutover status drift "+v);
  } else if(v!=="NOT_PROVEN"){
    throw new Error("proposal field must remain NOT_PROVEN before explicit decision: "+k+"="+v);
  }
}
console.log("PASS_V2_FRONTEND_GATE_RECLASSIFICATION_PROPOSAL_CONTRACT");
