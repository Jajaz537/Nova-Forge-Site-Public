import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-performance-candidate-contract.json","utf8"));
if(d.schemaVersion!==1||d.status!=="LAB_CANDIDATE_PROOF_REQUIRED") throw new Error("performance candidate contract drift");
if(d.root!=="v2"||d.productionCwv!=="OPEN") throw new Error("production CWV must remain OPEN");
for(const key of ["desktop","mobile"]){
  const s=d.scenarios?.[key];
  if(!s||s.lcpCeilingMs<=0||s.clsCeiling!==0.1||s.routeResponseCeilingMs<=0) throw new Error("scenario drift "+key);
}
const inv=new Set(d.invariants||[]);
for(const x of ["LAB_METRICS_NEVER_EQUAL_FIELD_CWV","PRODUCTION_CWV_REMAINS_OPEN","NO_CLOUDFLARE_CRITICAL_CHANGE","NO_CUTOVER"]) if(!inv.has(x)) throw new Error("missing invariant "+x);
console.log("PASS_V2_PERFORMANCE_CANDIDATE_CONTRACT");
