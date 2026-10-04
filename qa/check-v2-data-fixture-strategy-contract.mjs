import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-data-fixture-strategy-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const dataClasses=new Set(d["dataClasses"]||[]);for(const x of ["production-real","demonstration","technical-fixture","ui-placeholder"]) if(!dataClasses.has(x)) throw new Error("missing dataClasses "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["DEMONSTRATION_EXPLICITLY_MARKED","TECHNICAL_FIXTURE_NEVER_SERVED_AS_PRODUCTION","NO_FAKE_VERIFIED_BADGE","CURRENT_DEMO_CATALOG_NEVER_AUTO_MIGRATES_TO_REAL_V2_CORPUS","FIXTURES_ISOLATED_FROM_PUBLIC_BUILD_GLOB","SECURITY_FIXTURES_FAIL_CLOSED"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_CREATED","NOT_PROVEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_DATA_FIXTURE_STRATEGY_CONTRACT");
