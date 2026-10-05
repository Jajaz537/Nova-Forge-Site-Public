import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-external-validation-evidence-contract.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const types=new Set(d.sessionTypes||[]);
for(const x of ["HUMAN_MULTISCREEN","HUMAN_MOBILE","NVDA_REAL","VOICEOVER_REAL","TALKBACK_REAL","SAFARI_REAL","PHYSICAL_DEVICE","VISUAL_REFERENCE_COMPARISON"]) {
  if(!types.has(x)) throw new Error("missing session type "+x);
}

const fields=new Set(d.requiredEvidenceFields||[]);
for(const x of ["evidenceId","sessionType","date","commitSha","actorOpaqueId","environment","tasks","findings","result","artifactRefs","reviewer"]) {
  if(!fields.has(x)) throw new Error("missing evidence field "+x);
}

const results=new Set(d.resultStates||[]);
for(const x of ["PASS_WITH_NO_BLOCKER","PASS_WITH_P2_P3","FAIL_P0_P1","INCOMPLETE"]) {
  if(!results.has(x)) throw new Error("missing result state "+x);
}

const closure=new Set(d.blockerClosureRequirements||[]);
for(const x of ["matching_evidence_type","real_required_environment","commit_bound","tasks_executed","findings_archived","no_open_p0_p1","reviewer_recorded","artifact_refs_non_empty"]) {
  if(!closure.has(x)) throw new Error("missing closure requirement "+x);
}

const inv=new Set(d.invariants||[]);
for(const x of [
  "AUTOMATION_NEVER_EQUALS_HUMAN_EVIDENCE",
  "EMULATION_NEVER_EQUALS_PHYSICAL_DEVICE",
  "CDP_AX_TREE_NEVER_EQUALS_REAL_SCREEN_READER",
  "NON_SAFARI_NEVER_EQUALS_SAFARI_REAL",
  "NO_ARCHIVABLE_REFERENCE_NEVER_EQUALS_VISUAL_FIDELITY_PASS",
  "P0_P1_OPEN_NEVER_EQUALS_GATE_CLOSED",
  "INCOMPLETE_NEVER_EQUALS_PASS",
  "EVIDENCE_MUST_BIND_TO_COMMIT",
  "EVIDENCE_MUST_HAVE_ARTIFACT_REFS",
  "NO_UNNECESSARY_PERSONAL_DATA"
]) if(!inv.has(x)) throw new Error("missing invariant "+x);

for(const [k,v] of Object.entries(d.currentStatus||{})){
  if(v!=="NOT_PROVEN") throw new Error("external validation status must remain NOT_PROVEN before evidence: "+k+"="+v);
}

console.log("EXTERNAL_VALIDATION_SESSION_TYPE_COUNT",types.size);
console.log("EXTERNAL_VALIDATION_CLOSURE_REQUIREMENT_COUNT",closure.size);
console.log("PASS_V2_EXTERNAL_VALIDATION_EVIDENCE_CONTRACT");
