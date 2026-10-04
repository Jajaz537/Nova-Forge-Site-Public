import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-screen-acceptance-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const surfaces=new Set(d["surfaces"]||[]);for(const x of ["Homepage","GamesIndex","GameHub","Catalog","GlobalSearch","ContentDetail","Requirements","ReleaseFiles","Collection","Modpack","ProfileLoadout","CreatorProfile","CreatorStudio","Community","Library","SecurityTrust","MobileNavigation","MobileCatalog","MobileContentDetail"]) if(!surfaces.has(x)) throw new Error("missing surfaces "+x);
const globalGate=new Set(d["globalGate"]||[]);for(const x of ["PRIMARY_OBJECTIVE","PRIMARY_ACTION","CRITICAL_STATES","MOBILE_DEFINED","ACCESSIBILITY_PLANNED","REQUIRED_DATA_DEFINED","UNAVAILABLE_CASE_DEFINED","RUNTIME_DEPENDENCIES_EXPLICIT"]) if(!globalGate.has(x)) throw new Error("missing globalGate "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["CONTEXTUAL_SEARCH_NEVER_SILENTLY_GLOBAL","INSTALL_NEVER_PRECEDES_COMPATIBILITY","UNVERIFIED_NEVER_LOOKS_VERIFIED","PROFILE_PRIVATE_BY_DEFAULT","HASH_OR_SIGNATURE_NEVER_MEANS_SAFE","STICKY_CTA_NEVER_OBSCURES_FOCUS"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_PROVEN","NOT_EXECUTED"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_SCREEN_ACCEPTANCE_CONTRACT");
