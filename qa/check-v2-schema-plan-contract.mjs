import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-schema-plan-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const schemaFamilies=new Set(d["schemaFamilies"]||[]);for(const x of ["game","content-type","content-item","release","dependency","compatibility-claim","file-artifact","collection-v2","modpack","profile-loadout","creator","team","search-document"]) if(!schemaFamilies.has(x)) throw new Error("missing schemaFamilies "+x);
const dependencyRelations=new Set(d["dependencyRelations"]||[]);for(const x of ["required","optional","recommended","incompatible","replaces"]) if(!dependencyRelations.has(x)) throw new Error("missing dependencyRelations "+x);
const compatibilityStates=new Set(d["compatibilityStates"]||[]);for(const x of ["compatible","partial","incompatible","unknown"]) if(!compatibilityStates.has(x)) throw new Error("missing compatibilityStates "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["SCHEMAS_VERSIONED_NEVER_OVERWRITE_V1","CONTENT_ITEM_STABLE_RELEASE_VERSIONED","COLLECTION_MODPACK_PROFILE_SEPARATE","REPLACES_NEVER_SILENTLY_SUBSTITUTES","COMPATIBLE_VISUAL_NEVER_FROM_UNKNOWN_CLAIM","PROFILE_DEFAULT_LOCAL_ONLY_PRIVATE_LOCAL","NO_NEW_NOVA_FORGE_SCHEMA_IDS"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_CREATED","NOT_PROVEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_SCHEMA_PLAN_CONTRACT");
