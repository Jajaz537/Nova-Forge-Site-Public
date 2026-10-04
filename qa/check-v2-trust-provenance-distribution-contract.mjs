import fs from "node:fs";
const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-trust-provenance-distribution-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");
for(const [key,expected] of Object.entries({
  provenanceStates:["verified","declared-unattested","unknown"],
  scanStates:["not-scanned","scanning","passed","warning","quarantined","unavailable"],
  distributionStates:["locked","published","withdrawn","revoked"]
})){
  const s=new Set(data[key]||[]);
  for(const x of expected) if(!s.has(x)) throw new Error("missing "+key+" state "+x);
}
const hashForbidden=new Set(data.hashClaimsForbidden||[]);
for(const x of ["SAFE","MALWARE_FREE","QUALITY","COMPATIBILITY"]) if(!hashForbidden.has(x)) throw new Error("hash must not claim "+x);
const sigForbidden=new Set(data.signatureClaimsForbidden||[]);
for(const x of ["SAFE","MALWARE_FREE","QUALITY"]) if(!sigForbidden.has(x)) throw new Error("signature must not claim "+x);
const inv=new Set(data.invariants||[]);
for(const x of [
  "VERIFIED_PROVENANCE_REQUIRES_RECEIPT",
  "NO_SAFE_LABEL_WITHOUT_REAL_POLICY_AND_EVIDENCE",
  "CREATOR_BADGE_NEVER_GRANTS_ADMIN_AUTHORITY",
  "ABSENCE_OF_LICENSE_NEVER_EQUALS_PERMISSION",
  "WITHDRAWN_OR_REVOKED_NOT_DOWNLOADABLE",
  "STALE_REQUIRED_PROOF_FAILS_CLOSED",
  "REQUIRED_HASH_OR_PROVENANCE_MISSING_BLOCKS_ACTION",
  "WARNINGS_PRECEDE_INSTALL_ACTION",
  "OFFLINE_NEVER_SIMULATES_SENSITIVE_ACTION",
  "STATUS_NEVER_COLOR_ONLY"
]) if(!inv.has(x)) throw new Error("missing invariant "+x);
for(const [k,v] of Object.entries(data.productionStatus||{})) if(v!=="NOT_IMPLEMENTED") throw new Error("production status drift "+k+"="+v);
console.log("TRUST_PROVENANCE_STATE_COUNT",(data.provenanceStates||[]).length);
console.log("TRUST_DISTRIBUTION_STATE_COUNT",(data.distributionStates||[]).length);
console.log("TRUST_INVARIANT_COUNT",inv.size);
console.log("PASS_V2_TRUST_PROVENANCE_DISTRIBUTION_CONTRACT");
