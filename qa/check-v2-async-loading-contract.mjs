import fs from "node:fs";

const data=JSON.parse(fs.readFileSync("qa/modaryx-v2-async-loading-contract.json","utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const states=new Set(data.states||[]);
for(const x of ["LOADING_INITIAL","REFRESHING_STALE","ERROR_RECOVERABLE","OFFLINE_STALE"]){
  if(!states.has(x)) throw new Error("missing async state "+x);
}
const invariants=new Set(data.invariants||[]);
for(const x of ["RIGHTS_LOADING_FAILS_CLOSED","NO_FAKE_PROGRESS_PERCENT"]){
  if(!invariants.has(x)) throw new Error("missing async invariant "+x);
}
if(data.skeletonRules?.reducedMotionStatic!==true) throw new Error("reduced motion skeleton rule missing");

console.log("ASYNC_STATE_COUNT",states.size);
console.log("ASYNC_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_ASYNC_LOADING_CONTRACT");
