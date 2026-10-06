import assert from "node:assert/strict";
import fs from "node:fs";
import {
  artifactObjectKey,
  artifactStorageReadiness,
  readArtifactCandidate,
  storeArtifactCandidate,
  validateArtifactStorageDescriptor
} from "../functions/_lib/artifact-storage.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-artifact-storage-r2-contract.json","utf8"));
assert.equal(contract.status,"R2_ADAPTER_CANDIDATE_FAKE_BINDING_PROVEN");
assert.equal(contract.realBindingActivation,"NOT_EXECUTED");
assert.equal(contract.bucketCreation,"NOT_EXECUTED");
const inv=new Set(contract.invariants||[]);
for(const x of ["SHA256_VERIFIED_BEFORE_STORE","SHA256_VERIFIED_AFTER_READ","PATH_TRAVERSAL_REJECTED","NO_BUCKET_CREATION","NO_BINDING_CONFIGURATION_CHANGE","NO_REMOTE_ARTIFACT_WRITE_IN_PROOF","PRODUCTION_APPROVAL_REMAINS_OPEN"]) assert.ok(inv.has(x),"missing invariant "+x);

assert.equal(artifactStorageReadiness({}).readReady,false);
assert.equal(artifactStorageReadiness({}).writeReady,false);
assert.equal(artifactObjectKey({releaseId:"mx_release_one",fileId:"mx_file_one",sha256:"a".repeat(64),filename:"../evil.zip"}).ok,false);

const bytes=new TextEncoder().encode("MODARYX-artifact-test");
const digest=[...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(v=>v.toString(16).padStart(2,"0")).join("");
const descriptor={
  schemaVersion:2,
  id:"mx_file_test",
  releaseId:"mx_release_test",
  filename:"artifact.zip",
  path:"/artifacts/artifact.zip",
  size:bytes.byteLength,
  mediaType:"application/zip",
  executable:false,
  hashes:{sha256:digest},
  signature:{state:"absent",signerId:null,receiptId:null},
  provenance:{state:"declared",receiptId:null},
  distributionState:"available",
  downloadable:true
};
assert.equal(validateArtifactStorageDescriptor(descriptor).ok,true);

class FakeR2Object{
  constructor(bytes,options){
    this._bytes=new Uint8Array(bytes);
    this.customMetadata=options?.customMetadata||{};
    this.httpMetadata=options?.httpMetadata||{};
  }
  async arrayBuffer(){
    return this._bytes.slice().buffer;
  }
}
class FakeR2{
  constructor(){this.map=new Map();}
  async put(key,bytes,options){this.map.set(key,new FakeR2Object(bytes,options));}
  async get(key){return this.map.get(key)||null;}
  async delete(key){this.map.delete(key);}
}
const r2=new FakeR2();
const env={MODARYX_ARTIFACTS:r2};
const stored=await storeArtifactCandidate(env,{descriptor,bytes});
assert.equal(stored.ok,true);
assert.match(stored.key,/^v2\/artifacts\/mx_release_test\/mx_file_test\/[a-f0-9]{64}\/artifact\.zip$/);

const read=await readArtifactCandidate(env,{descriptor});
assert.equal(read.ok,true);
assert.equal(read.sha256,digest);
assert.equal(new TextDecoder().decode(read.bytes),"MODARYX-artifact-test");

const wrong={...descriptor,hashes:{sha256:"b".repeat(64)}};
assert.equal((await storeArtifactCandidate(env,{descriptor:wrong,bytes})).reason,"artifact-digest-mismatch");

const blocked={...descriptor,distributionState:"revoked",downloadable:false};
assert.equal((await readArtifactCandidate(env,{descriptor:blocked})).reason,"artifact-distribution-blocked");

const tamperedKey=stored.key;
r2.map.set(tamperedKey,new FakeR2Object(new TextEncoder().encode("tampered"),{customMetadata:{sha256:digest,artifactId:descriptor.id}}));
assert.equal((await readArtifactCandidate(env,{descriptor})).ok,false);

assert.equal((await storeArtifactCandidate({}, {descriptor,bytes})).reason,"r2-binding-write-missing");
assert.equal((await readArtifactCandidate({}, {descriptor})).reason,"r2-binding-read-missing");

const source=fs.readFileSync("functions/_lib/artifact-storage.mjs","utf8");
for(const forbidden of ["bucket.create","wrangler","cloudflare.com/client","api.cloudflare.com"]) assert.equal(source.toLowerCase().includes(forbidden),false,"critical infra code forbidden: "+forbidden);

console.log("PASS_V2_R2_ARTIFACT_STORAGE_ADAPTER");
