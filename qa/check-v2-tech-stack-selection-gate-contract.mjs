import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-tech-stack-selection-gate-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
if(d.status!=="SELECTED_PRODUCTION_CANDIDATE_NO_CUTOVER") throw new Error("stack selection status not active");
const shortlist=new Set(d.shortlist||[]);
for(const x of ["vanilla-static-vite","astro-cloudflare-workers","react-vite-cloudflare-workers"]) if(!shortlist.has(x)) throw new Error("missing shortlist "+x);
if(d.selectedStack!=="react-vite-cloudflare-workers"||!shortlist.has(d.selectedStack)) throw new Error("unexpected selected stack");
const p=d.prerequisiteEvidence||{};
for(const key of ["AUTH_BACKEND_STRATEGY_DEFINED","BUNDLE_BUDGET_MEASURED","CORE_WIREFRAMES_COMPLETE","V2_ARCHITECTURE_STABLE","INTERACTION_REQUIREMENTS_KNOWN"]) {
  if(p[key]?.state!=="PROVEN") throw new Error("selection prerequisite not proven: "+key);
}
if(p.HUMAN_TREE_TEST?.state!=="RECLASSIFIED_FOR_STACK_SELECTION_ONLY"||p.HUMAN_TREE_TEST?.finalHumanValidation!=="OPEN") throw new Error("human tree reclassification drift");
const inv=new Set(d.invariants||[]);
for(const x of ["NO_STACK_SELECTED_BY_POPULARITY_OR_HABIT","STACK_NEVER_DICTATES_DOMAIN_MODEL","NO_GLOBAL_HYDRATION_WITHOUT_NEED","EVERY_DEPENDENCY_JUSTIFIED_AND_PINNED","GATE_RECLASSIFICATION_IS_EXPLICIT_AND_LIMITED","HUMAN_TREE_TEST_NOT_CLAIMED_PROVEN","NO_CLOUDFLARE_MIGRATION_AUTHORIZED","NO_CUTOVER_AUTHORIZED"]) if(!inv.has(x)) throw new Error("missing invariant "+x);
if(d.productionStatus?.stack!==d.selectedStack) throw new Error("production candidate stack mismatch");
if(d.productionStatus?.framework!=="react-19.2.0-vite-6.4.2") throw new Error("framework pin drift");
if(d.productionStatus?.runtimeDependencies!=="PINNED") throw new Error("runtime dependencies not pinned");
if(d.productionStatus?.rootV2!=="CREATED_PRODUCTION_CANDIDATE") throw new Error("root status drift");
if(d.productionStatus?.productionMigration!=="BLOCKED") throw new Error("cutover must stay blocked");
if(!fs.existsSync("v2/package.json")) throw new Error("v2 root missing");
console.log("STACK_SELECTED",d.selectedStack);
console.log("PASS_V2_TECH_STACK_SELECTION_GATE_CONTRACT");
