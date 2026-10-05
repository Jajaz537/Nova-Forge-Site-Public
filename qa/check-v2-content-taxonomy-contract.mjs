import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-content-taxonomy-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const aggregateTypes=new Set(d["aggregateTypes"]||[]);for(const x of ["collection","modpack","profile","loadout"]) if(!aggregateTypes.has(x)) throw new Error("missing aggregateTypes "+x);
const dependencyRelations=new Set(d["dependencyRelations"]||[]);for(const x of ["required","optional","recommended","incompatible","replaces"]) if(!dependencyRelations.has(x)) throw new Error("missing dependencyRelations "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["CONTENT_TYPE_EXTENSIBLE_PER_GAME","AGGREGATES_NEVER_TREATED_AS_ORDINARY_FILES","CONTENT_ITEM_STABLE_RELEASE_DISTINCT","REPLACES_NEVER_AUTO_SUBSTITUTES","COLLECTION_EDITORIAL_NOT_INSTALLABLE_BY_DEFAULT","PROFILE_LOCAL_PRIVATE_BY_DEFAULT"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_PROVEN","NOT_EXECUTED"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_CONTENT_TAXONOMY_CONTRACT");
