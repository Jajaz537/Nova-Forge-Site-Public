import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-v1-v2-mapping-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const legacyContracts=new Set(d["legacyContracts"]||[]);for(const x of ["universal-mod-manifest","compatibility-graph","collection","public-profile","community-submission","community-write","smart-profile","search-adapter","publication-receipt","trusted-signer-set","account-security","moderation","catalog-json","search-index-json","localStorage","routes"]) if(!legacyContracts.has(x)) throw new Error("missing legacyContracts "+x);
const mapperGate=new Set(d["mapperGate"]||[]);for(const x of ["SOURCE_SCHEMA_KNOWN","TARGET_SCHEMA_VERSIONED","LOSS_RULE_DOCUMENTED","V1_FIXTURE","EXPECTED_V2_FIXTURE","INVALID_INPUT_TEST","NO_INVENTION_TEST","ROLLBACK_TEST_IF_MUTATION"]) if(!mapperGate.has(x)) throw new Error("missing mapperGate "+x);
const invariants=new Set(d["invariants"]||[]);for(const x of ["V1_CONTRACTS_IMMUTABLE","NO_MISSING_DATA_INVENTED","LOSS_OR_UNKNOWN_EXPLICIT","COLLECTION_V1_MAPS_ONLY_TO_COLLECTION","SMART_PROFILE_NEVER_MAPS_TO_PROFILE_LOADOUT","DEMO_CATALOG_FIXTURE_ONLY","SEARCH_INDEX_REBUILT_NOT_IN_PLACE","LOCAL_STORAGE_MIGRATION_NON_DESTRUCTIVE"]) if(!invariants.has(x)) throw new Error("missing invariants "+x);
for(const [k,v] of Object.entries(d.productionStatus||{})) if(!["NOT_IMPLEMENTED","NOT_PROVEN","NOT_EXECUTED"].includes(v)) throw new Error("production status drift "+k+"="+v);
console.log("PASS_V2_V1_V2_MAPPING_CONTRACT");
