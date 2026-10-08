import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-vf-readiness-gate.json","utf8"));
if(d.schemaVersion!==1) throw new Error("unexpected schemaVersion");
const groups=["externalHuman","webProduction","forgeRuntime","rightsLegal"];
const allowedNonBlockingStates=new Set([
  "PROVEN",
  "RECLASSIFIED_OWNER_DELEGATED_AI_REVIEW",
  "OUT_OF_SCOPE_SITE_VF_OFFICIAL_SEPARATION"
]);
const open=[];
for(const group of groups){
  if(!Array.isArray(d[group])||!d[group].length) throw new Error("empty blocker group "+group);
  for(const item of d[group]){
    if(!item.id||!item.state) throw new Error("malformed blocker in "+group);
    if(item.state==="OPEN") open.push(group+":"+item.id);
    else if(!allowedNonBlockingStates.has(item.state)) throw new Error("unsupported blocker state "+group+":"+item.id+"="+item.state);
  }
}
if(open.length===0 && d.status!=="READY") throw new Error("no blockers open but status not READY");
if(open.length>0 && d.status!=="BLOCKED") throw new Error("required blockers open but status not BLOCKED");
const inv=new Set(d.invariants||[]);
for(const x of [
  "PUBLIC_GREEN_NEVER_IMPLIES_PRODUCTION_VF",
  "PROTOTYPE_GREEN_NEVER_IMPLIES_HIGH_FI_FINAL",
  "AUTOMATED_BROWSER_NEVER_REPLACES_REAL_SCREEN_READER_OR_DEVICE",
  "WORK_NEVER_REPLACES_REAL_HUMAN_VALIDATION",
  "NO_CUTOVER_WITHOUT_ROLLBACK_PROOF",
  "NO_REAL_INSTALL_CLAIM_WITHOUT_FORGE_RUNTIME",
  "NO_PUBLISHER_APPROVAL_CLAIM_WITHOUT_SCOPE_EVIDENCE",
  "NO_VF_WHILE_ANY_REQUIRED_BLOCKER_OPEN",
  "OFFICIAL_SEPARATION_MODARYX_WEB_NOVA_FORGE_SOFTWARE_OS",
  "DESKTOP_RUNTIME_NEVER_BLOCKS_MODARYX_WEB_SITE_VF",
  "HISTORICAL_DESKTOP_HANDOFF_DOCS_DO_NOT_CHANGE_PRODUCT_IDENTITY"
]) if(!inv.has(x)) throw new Error("missing invariant "+x);
if(d.status==="READY"&&open.length) throw new Error("READY forbidden while blockers remain");
console.log("VF_READINESS_OPEN_BLOCKER_COUNT",open.length);
console.log("VF_READINESS_STATUS",d.status);
console.log("PASS_V2_VF_READINESS_GATE");

for(const item of d.forgeRuntime||[]){
  if(item.state!=="OUT_OF_SCOPE_SITE_VF_OFFICIAL_SEPARATION") throw new Error("desktop runtime must remain out of MODARYX web-site VF gate: "+item.id);
}
