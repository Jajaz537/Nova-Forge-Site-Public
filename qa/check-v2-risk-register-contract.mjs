import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-risk-register-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const allowedStates=new Set(d["allowedStates"]||[]);for(const x of ["EN COURS","BLOQUÉ","PREUVE MANQUANTE","TERMINÉ"]) if(!allowedStates.has(x)) throw new Error("missing allowedStates "+x);
const reviewGates=new Set(d["reviewGates"]||[]);for(const x of ["before-high-fi","before-first-v2-code","before-preview","before-cutover","before-vf"]) if(!reviewGates.has(x)) throw new Error("missing reviewGates "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["DOCUMENTED_RISK_IS_NOT_CLOSED_RISK","NO_CUTOVER_WITHOUT_ROLLBACK","NO_REAL_DISTRIBUTION_WITHOUT_RIGHTS","NO_MANAGER_INSTALL_WITHOUT_RUNTIME","NO_COMPATIBILITY_SUCCESS_WITHOUT_EVIDENCE","NO_HUMAN_VALIDATION_CLAIM_FROM_AUTOMATION","NO_FALSE_PASS_OR_VF"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_EXECUTED","NOT_PROVEN","BLOCKED","OPEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_RISK_REGISTER_CONTRACT");
