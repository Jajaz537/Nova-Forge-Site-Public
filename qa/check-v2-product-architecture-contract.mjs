import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-product-architecture-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const coreActivities=new Set(d["coreActivities"]||[]);for(const x of ["DISCOVER","UNDERSTAND","INSTALL_MANAGE","CREATE_PUBLISH_MAINTAIN"]) if(!coreActivities.has(x)) throw new Error("missing coreActivities "+x);
const primaryNav=new Set(d["primaryNav"]||[]);for(const x of ["Découvrir","Jeux","Mods & contenus","Collections","Créateurs","Communauté","Créer"]) if(!primaryNav.has(x)) throw new Error("missing primaryNav "+x);
const objectSeparation=new Set(d["objectSeparation"]||[]);for(const x of ["Favorite","Collection","Modpack","ProfileLoadout"]) if(!objectSeparation.has(x)) throw new Error("missing objectSeparation "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["FUNCTIONAL_LABELS_BEFORE_LORE","HOMEPAGE_IS_PRODUCT_NOT_NEWS","COLLECTION_NEVER_INSTALLABLE_WITHOUT_MANIFEST_RESOLUTION","PROFILE_LOCAL_PRIVATE_BY_DEFAULT","HIGH_FI_NEVER_MASKS_BROKEN_INFORMATION_ARCHITECTURE"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_PROVEN","NOT_EXECUTED"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_PRODUCT_ARCHITECTURE_CONTRACT");
