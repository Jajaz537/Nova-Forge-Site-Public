import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-external-validation-evidence-contract.json","utf8"));
const validTypes=new Set(contract.sessionTypes||[]);
const validResults=new Set(contract.resultStates||[]);
const validSeverity=new Set(contract.findingSeverities||[]);
const validFindingStates=new Set(contract.findingStates||[]);

function fail(message){ throw new Error(message); }
function nonEmpty(v){ return typeof v==="string" && v.trim().length>0; }

export function validateEvidence(e){
  for(const k of ["evidenceId","sessionType","date","commitSha","actorOpaqueId","environment","tasks","findings","result","artifactRefs","reviewer"]){
    if(e[k]===undefined||e[k]===null) fail("missing evidence field "+k);
  }
  if(!nonEmpty(e.evidenceId)) fail("evidenceId empty");
  if(!validTypes.has(e.sessionType)) fail("invalid sessionType "+e.sessionType);
  if(!/^([0-9a-f]{40})$/i.test(e.commitSha)) fail("commitSha must be full 40-char SHA");
  if(!nonEmpty(e.actorOpaqueId)) fail("actorOpaqueId empty");
  if(!nonEmpty(e.reviewer)) fail("reviewer empty");
  if(!Array.isArray(e.tasks)||!e.tasks.length) fail("tasks must be non-empty");
  if(!Array.isArray(e.findings)) fail("findings must be array");
  if(!validResults.has(e.result)) fail("invalid result "+e.result);
  if(!Array.isArray(e.artifactRefs)||!e.artifactRefs.length||!e.artifactRefs.every(nonEmpty)) fail("artifactRefs must be non-empty strings");
  if(typeof e.environment!=="object"||Array.isArray(e.environment)) fail("environment must be object");

  for(const f of e.findings){
    for(const k of ["id","surface","description","severity","reproduction","status"]) if(f[k]===undefined||f[k]===null) fail("finding missing "+k);
    if(!validSeverity.has(f.severity)) fail("invalid finding severity "+f.severity);
    if(!validFindingStates.has(f.status)) fail("invalid finding status "+f.status);
  }

  const openBlocking=e.findings.filter(f=>["P0","P1"].includes(f.severity) && f.status==="OPEN");
  if(openBlocking.length && ["PASS_WITH_NO_BLOCKER","PASS_WITH_P2_P3"].includes(e.result)) fail("PASS forbidden with open P0/P1");

  const env=e.environment;
  if(["HUMAN_MULTISCREEN","HUMAN_MOBILE"].includes(e.sessionType) && env.humanParticipant!==true) fail("human session requires humanParticipant=true");
  if(["NVDA_REAL","VOICEOVER_REAL","TALKBACK_REAL"].includes(e.sessionType)){
    if(env.realEnvironment!==true) fail("real screen reader session requires realEnvironment=true");
    if(!nonEmpty(env.screenReader)) fail("real screen reader session requires screenReader");
  }
  if(e.sessionType==="SAFARI_REAL"){
    if(env.realEnvironment!==true) fail("Safari real requires realEnvironment=true");
    if((env.browser||"").toLowerCase()!=="safari") fail("Safari real requires browser=Safari");
  }
  if(e.sessionType==="PHYSICAL_DEVICE"){
    if(env.realEnvironment!==true || env.physicalDevice!==true) fail("physical device session requires realEnvironment=true and physicalDevice=true");
  }
  if(e.sessionType==="VISUAL_REFERENCE_COMPARISON"){
    if(e.sourceReference?.approved!==true) fail("visual comparison requires approved source reference");
    if(!nonEmpty(e.sourceReference?.artifactRef)) fail("visual comparison requires source artifactRef");
    if(!Array.isArray(e.normalizedConditions)||!e.normalizedConditions.length) fail("visual comparison requires normalizedConditions");
  }

  if(e.result==="PASS_WITH_NO_BLOCKER" && e.findings.some(f=>["P0","P1","P2","P3"].includes(f.severity) && f.status==="OPEN")) fail("PASS_WITH_NO_BLOCKER forbids open findings");
  if(e.result==="PASS_WITH_P2_P3" && e.findings.some(f=>["P0","P1"].includes(f.severity))) fail("PASS_WITH_P2_P3 forbids P0/P1 findings");
  return true;
}

function selfTest(){
  const base={
    evidenceId:"EV-DEMO",
    sessionType:"HUMAN_MOBILE",
    date:"2026-10-04",
    commitSha:"a".repeat(40),
    actorOpaqueId:"P01",
    environment:{humanParticipant:true,realEnvironment:true,physicalDevice:true,device:"demo-device"},
    tasks:["inspect mobile navigation"],
    findings:[],
    result:"PASS_WITH_NO_BLOCKER",
    artifactRefs:["artifact://demo"],
    reviewer:"reviewer-opaque"
  };
  validateEvidence(base);
  let rejected=false;
  try{ validateEvidence({...base,environment:{humanParticipant:false}}); }catch{ rejected=true; }
  if(!rejected) fail("self-test expected simulated human evidence rejection");
  rejected=false;
  try{ validateEvidence({...base,sessionType:"PHYSICAL_DEVICE",environment:{realEnvironment:false,physicalDevice:false}}); }catch{ rejected=true; }
  if(!rejected) fail("self-test expected emulated physical device rejection");
  rejected=false;
  try{ validateEvidence({...base,findings:[{id:"F1",surface:"mobile",description:"blocking",severity:"P1",reproduction:"steps",status:"OPEN"}]}); }catch{ rejected=true; }
  if(!rejected) fail("self-test expected open P1 PASS rejection");
  console.log("PASS_V2_EXTERNAL_VALIDATION_EVIDENCE_VALIDATOR_SELF_TEST");
}

if(process.argv.includes("--self-test")){
  selfTest();
}else{
  const idx=process.argv.indexOf("--file");
  if(idx<0||!process.argv[idx+1]) fail("usage: node qa/validate-v2-external-validation-evidence.mjs --file <evidence.json> or --self-test");
  const p=process.argv[idx+1];
  const evidence=JSON.parse(fs.readFileSync(p,"utf8"));
  validateEvidence(evidence);
  console.log("PASS_V2_EXTERNAL_VALIDATION_EVIDENCE_FILE",path.basename(p));
}
