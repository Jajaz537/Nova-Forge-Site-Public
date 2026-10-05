import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-qa-strategy-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const qaCategories=new Set(d["qaCategories"]||[]);for(const x of ["functional","visual","accessibility","performance","security-trust","responsive","data","migration","cache-pwa","anti-contamination"]) if(!qaCategories.has(x)) throw new Error("missing qaCategories "+x);
const requiredPwaScenarios=new Set(d["requiredPwaScenarios"]||[]);for(const x of ["fresh-browser","upgrade-from-legacy-sw","offline","stale-cache","interrupted-sw-activation","rollback"]) if(!requiredPwaScenarios.has(x)) throw new Error("missing requiredPwaScenarios "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["QA_CATEGORIES_VALIDATE_SEPARATELY","NO_GLOBAL_REPLAY_AFTER_TARGETED_ERROR","ERROR_EXACT_THEN_ISOLATE_THEN_FIX_THEN_MICRO_PROOF","FULL_REPLAY_ONLY_AT_FINAL_CANDIDATE","FIELD_CWV_ONLY_WHEN_REAL_STAGING_OR_PRODUCTION"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_EXECUTED","NOT_PROVEN","BLOCKED","OPEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_QA_STRATEGY_CONTRACT");
