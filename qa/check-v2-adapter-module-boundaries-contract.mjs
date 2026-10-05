import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-adapter-module-boundaries-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const dependencyDirection=new Set(d["dependencyDirection"]||[]);for(const x of ["UI_TO_APPLICATION","APPLICATION_TO_DOMAIN","DOMAIN_TO_ADAPTER_PORTS","ADAPTERS_TO_EXTERNALS"]) if(!dependencyDirection.has(x)) throw new Error("missing dependencyDirection "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["UI_NEVER_IMPORTS_V1_RENDERER_CSS_OR_SW","DOMAIN_NEVER_DEPENDS_ON_BROWSER_CSS_AUTH0_OR_CLOUDFLARE","V1_COMPAT_READS_THROUGH_V1_COMPAT_ADAPTER","INSTALL_UI_ONLY_EXPOSES_REAL_CAPABILITIES","NO_PRODUCTION_DATA_FROM_DEMO_DATASET"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_CREATED","NOT_PROVEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_ADAPTER_MODULE_BOUNDARIES_CONTRACT");
