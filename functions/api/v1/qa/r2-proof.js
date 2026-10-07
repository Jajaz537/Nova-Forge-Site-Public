import {json} from "../../../_lib/api-security.mjs";
import {
  artifactStorageReadiness,
  readArtifactCandidate
} from "../../../_lib/artifact-storage.mjs";

const CANONICAL_SOURCE="5dcde91e7aa7d7ea3c8a40f9eec6ba69b2d0e14a";
const RELEASE_ID="mx_release_r2proof";
const FILE_ID="mx_file_r2proof";
const FILENAME="proof.txt";
const MEDIA_TYPE="text/plain; charset=utf-8";

const toHex=buffer=>[...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,"0")).join("");

async function proofDescriptor(){
  const bytes=new TextEncoder().encode(`MODARYX-R2-DEV-PROOF\nsource=${CANONICAL_SOURCE}\n`);
  const sha256=toHex(await crypto.subtle.digest("SHA-256",bytes));
  return {
    bytes,
    descriptor:{
      schemaVersion:2,
      id:FILE_ID,
      releaseId:RELEASE_ID,
      filename:FILENAME,
      path:"/qa/r2/proof.txt",
      size:bytes.byteLength,
      mediaType:MEDIA_TYPE,
      executable:false,
      hashes:{sha256},
      signature:{state:"absent",signerId:null,receiptId:null},
      provenance:{state:"declared",receiptId:null},
      distributionState:"available",
      downloadable:true
    }
  };
}

export async function onRequestGet(context){
  const readiness=artifactStorageReadiness(context.env);
  if(!readiness.readReady){
    return json({
      schemaVersion:1,
      sourceCommit:CANONICAL_SOURCE,
      bindingPresent:readiness.bindingPresent,
      readReady:false,
      proofRead:false,
      reason:"r2-binding-read-missing"
    },503);
  }

  const {descriptor}=await proofDescriptor();
  const read=await readArtifactCandidate(context.env,{descriptor});

  const revoked={
    ...descriptor,
    distributionState:"revoked",
    downloadable:false
  };
  const denied=await readArtifactCandidate(context.env,{descriptor:revoked});

  return json({
    schemaVersion:1,
    sourceCommit:CANONICAL_SOURCE,
    bindingPresent:readiness.bindingPresent,
    readReady:readiness.readReady,
    writeReady:readiness.writeReady,
    deleteReady:readiness.deleteReady,
    proofRead:read.ok===true,
    proofSha256:read.ok?read.sha256:null,
    proofSize:read.ok?read.bytes.byteLength:null,
    revokedReadDenied:denied.ok===false&&denied.reason==="artifact-distribution-blocked",
    productionApproval:"OPEN"
  },read.ok?200:read.status||503);
}
