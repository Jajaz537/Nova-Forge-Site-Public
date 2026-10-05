import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-interaction-states-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const transverseStates=new Set(d["transverseStates"]||[]);for(const x of ["loading","empty","no-results","error","offline","stale","unavailable","unauthorized","forbidden","revoked","quarantined","incompatible","unverified","success"]) if(!transverseStates.has(x)) throw new Error("missing transverseStates "+x);
const publicationStates=new Set(d["publicationStates"]||[]);for(const x of ["draft","submitted","held-for-review","accepted","published","withdrawn","rejected","appealed"]) if(!publicationStates.has(x)) throw new Error("missing publicationStates "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["STALE_NEVER_PRESENTED_AS_CURRENT","UNAUTHORIZED_NEVER_CONFUSED_WITH_FORBIDDEN","UNVERIFIED_NEVER_STYLED_AS_SUCCESS","MANAGER_ACTION_ONLY_WITH_REAL_CAPABILITY","NO_FAKE_PROGRESS","PUBLICATION_AND_MODERATION_SEPARATE","REDUCED_MOTION_LOSES_NO_INFORMATION"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_CREATED","NOT_PROVEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_INTERACTION_STATES_CONTRACT");
