import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-tech-stack-selection-gate-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const shortlist=new Set(d["shortlist"]||[]);for(const x of ["vanilla-static-vite","astro-cloudflare-workers","react-vite-cloudflare-workers"]) if(!shortlist.has(x)) throw new Error("missing shortlist "+x);
const requiredCapabilities=new Set(d["requiredCapabilities"]||[]);for(const x of ["ISOLATED_V2_BUILD","ACCESSIBLE_INSPECTABLE_HTML","NO_REQUIRED_GLOBAL_HYDRATION","STRICT_CSP","CONTROLLED_V2_SW","NO_V1_ASSET_AUTO_IMPORT","EXPLICIT_404_410_REDIRECTS","SHA_BOUND_IMMUTABLE_PREVIEW"]) if(!requiredCapabilities.has(x)) throw new Error("missing requiredCapabilities "+x);
const disqualifiers=new Set(d["disqualifiers"]||[]);for(const x of ["UNSAFE_EVAL_PRODUCTION","GENERALIZED_UNSAFE_INLINE","UNCONTROLLABLE_ROUTING","OPAQUE_AUTOMATIC_SERVICE_WORKER","AUTOMATIC_LEGACY_ASSET_GLOB"]) if(!disqualifiers.has(x)) throw new Error("missing disqualifiers "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["NO_STACK_SELECTED_BY_POPULARITY_OR_HABIT","STACK_NEVER_DICTATES_DOMAIN_MODEL","NO_GLOBAL_HYDRATION_WITHOUT_NEED","NO_STACK_SELECTION_WHILE_CANONICAL_GATE_BLOCKS","NO_ROOT_CREATED_BY_THIS_CONTRACT","NO_CLOUDFLARE_MIGRATION_AUTHORIZED"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_SELECTED","NOT_CREATED","NONE","BLOCKED","NOT_IMPLEMENTED","NOT_PROVEN"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_TECH_STACK_SELECTION_GATE_CONTRACT");
