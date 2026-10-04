import fs from "node:fs";
import { spawnSync } from "node:child_process";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-preproduction-contract-registry.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");
if(!Array.isArray(data.contracts)||data.contracts.length<15) throw new Error("contract registry unexpectedly small");

const ids=new Set();
for(const entry of data.contracts){
  if(!entry.id||ids.has(entry.id)) throw new Error("missing/duplicate contract id "+entry.id);
  ids.add(entry.id);
  for(const key of ["contract","checker","source"]){
    if(!entry[key]||!fs.existsSync(entry[key])) throw new Error("missing "+key+" for "+entry.id+": "+entry[key]);
  }
  const contract=JSON.parse(fs.readFileSync(entry.contract,"utf8"));
  if(contract.schemaVersion!==1) throw new Error("schemaVersion drift for "+entry.id);
  const run=spawnSync(process.execPath,[entry.checker],{encoding:"utf8"});
  process.stdout.write(run.stdout||"");
  process.stderr.write(run.stderr||"");
  if(run.status!==0) throw new Error("contract checker failed: "+entry.id);
  console.log("CONTRACT_REGISTRY_PASS",entry.id);
}

const invariants=new Set(data.invariants||[]);
for(const x of [
  "EVERY_CONTRACT_HAS_SOURCE",
  "EVERY_CONTRACT_HAS_CHECKER",
  "EVERY_MACHINE_CONTRACT_SCHEMA_VERSION_ONE",
  "EVERY_CHECKER_MUST_PASS",
  "REGISTRY_DOES_NOT_IMPLY_PRODUCTION_IMPLEMENTATION"
]){
  if(!invariants.has(x)) throw new Error("missing registry invariant "+x);
}

console.log("PREPRODUCTION_CONTRACT_COUNT",data.contracts.length);
console.log("PREPRODUCTION_CONTRACT_REGISTRY_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY");
