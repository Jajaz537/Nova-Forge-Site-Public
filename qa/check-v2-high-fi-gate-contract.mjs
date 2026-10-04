import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-high-fi-gate-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const blockers=new Set(d["blockers"]||[]);for(const x of ["human-multiscreen-additional","human-mobile-real","approved-visual-reference-archivable","normalized-source-implementation-comparison","nvda-real","voiceover-real","talkback-real","safari-real","physical-devices"]) if(!blockers.has(x)) throw new Error("missing blockers "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["PROTOTYPE_PASS_NEVER_EQUALS_HIGH_FI_FINAL","AUTOMATED_A11Y_NEVER_EQUALS_REAL_SCREEN_READER","BROWSER_EMULATION_NEVER_EQUALS_PHYSICAL_DEVICE","NO_APPROVED_VISUAL_REFERENCE_MEANS_NO_NORMALIZED_FIDELITY_PASS","HUMAN_VALIDATION_CANNOT_BE_REPLACED_BY_AI_SIMULATION","ROOT_FRONTEND_REQUIRES_CONTROLLED_GATE_DECISION","PRODUCTION_REMAINS_UNTOUCHED_WHILE_GATE_BLOCKED"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.statusFields||{})) if(!["BLOCKED","NOT_PROVEN"].includes(v)) throw new Error("status drift "+k+"="+v);
console.log("PASS_V2_HIGH_FI_GATE_CONTRACT");
