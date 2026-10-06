const SHA256_RE=/^[a-f0-9]{64}$/;
const SAFE_ID_RE=/^mx_[a-z0-9][a-z0-9_-]{2,95}$/;
const SAFE_FILENAME_RE=/^[a-zA-Z0-9][a-zA-Z0-9._ -]{0,159}$/;

const bytesOf=(value)=>{
  if(value instanceof Uint8Array) return value;
  if(value instanceof ArrayBuffer) return new Uint8Array(value);
  if(ArrayBuffer.isView(value)) return new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
  return null;
};

const hex=buffer=>[...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,"0")).join("");
const sha256Hex=async bytes=>hex(await crypto.subtle.digest("SHA-256",bytes));

export function artifactStorageReadiness(env={}){
  const binding=env?.MODARYX_ARTIFACTS;
  return {
    schemaVersion:1,
    bindingPresent:Boolean(binding),
    readReady:Boolean(binding&&typeof binding.get==="function"),
    writeReady:Boolean(binding&&typeof binding.put==="function"),
    deleteReady:Boolean(binding&&typeof binding.delete==="function"),
    productionApproval:"OPEN"
  };
}

export function artifactObjectKey({releaseId,fileId,sha256,filename}={}){
  if(!SAFE_ID_RE.test(releaseId||"")) return {ok:false,reason:"release-id-invalid"};
  if(!SAFE_ID_RE.test(fileId||"")) return {ok:false,reason:"file-id-invalid"};
  if(!SHA256_RE.test(sha256||"")) return {ok:false,reason:"artifact-digest-invalid"};
  if(typeof filename!=="string"||!SAFE_FILENAME_RE.test(filename)||filename.includes("..")||filename.includes("\\")) {
    return {ok:false,reason:"artifact-filename-invalid"};
  }
  const safeName=filename.replaceAll(" ","_");
  return {
    ok:true,
    key:`v2/artifacts/${releaseId}/${fileId}/${sha256}/${safeName}`
  };
}

export function validateArtifactStorageDescriptor(descriptor){
  if(!descriptor||typeof descriptor!=="object"||Array.isArray(descriptor)) return {ok:false,reason:"artifact-descriptor-invalid"};
  if(descriptor.schemaVersion!==2) return {ok:false,reason:"artifact-schema-version-invalid"};
  if(!SAFE_ID_RE.test(descriptor.id||"")) return {ok:false,reason:"artifact-id-invalid"};
  if(!SAFE_ID_RE.test(descriptor.releaseId||"")) return {ok:false,reason:"artifact-release-invalid"};
  if(typeof descriptor.filename!=="string"||!SAFE_FILENAME_RE.test(descriptor.filename)||descriptor.filename.includes("..")||descriptor.filename.includes("\\")) return {ok:false,reason:"artifact-filename-invalid"};
  if(!Number.isSafeInteger(descriptor.size)||descriptor.size<0) return {ok:false,reason:"artifact-size-invalid"};
  if(typeof descriptor.mediaType!=="string"||!descriptor.mediaType.trim()||descriptor.mediaType.length>120) return {ok:false,reason:"artifact-media-type-invalid"};
  if(!SHA256_RE.test(descriptor.hashes?.sha256||"")) return {ok:false,reason:"artifact-digest-invalid"};
  if(!["available","withdrawn","revoked","archived"].includes(descriptor.distributionState)) return {ok:false,reason:"artifact-distribution-state-invalid"};
  if(typeof descriptor.downloadable!=="boolean") return {ok:false,reason:"artifact-downloadable-invalid"};
  if(["withdrawn","revoked","archived"].includes(descriptor.distributionState)&&descriptor.downloadable!==false) return {ok:false,reason:"artifact-distribution-policy-invalid"};
  return {ok:true,value:descriptor};
}

export async function storeArtifactCandidate(env,{descriptor,bytes}={}){
  const ready=artifactStorageReadiness(env);
  if(!ready.writeReady) return {ok:false,status:503,reason:"r2-binding-write-missing"};
  const valid=validateArtifactStorageDescriptor(descriptor);
  if(!valid.ok) return {ok:false,status:400,reason:valid.reason};
  const data=bytesOf(bytes);
  if(!data) return {ok:false,status:400,reason:"artifact-bytes-invalid"};
  if(data.byteLength!==descriptor.size) return {ok:false,status:409,reason:"artifact-size-mismatch"};
  const digest=await sha256Hex(data);
  if(digest!==descriptor.hashes.sha256) return {ok:false,status:409,reason:"artifact-digest-mismatch"};
  const key=artifactObjectKey({releaseId:descriptor.releaseId,fileId:descriptor.id,sha256:digest,filename:descriptor.filename});
  if(!key.ok) return {ok:false,status:400,reason:key.reason};
  try{
    await env.MODARYX_ARTIFACTS.put(key.key,data,{
      httpMetadata:{contentType:descriptor.mediaType},
      customMetadata:{
        schemaVersion:"2",
        artifactId:descriptor.id,
        releaseId:descriptor.releaseId,
        sha256:digest,
        size:String(data.byteLength)
      }
    });
    return {ok:true,status:201,key:key.key,sha256:digest,size:data.byteLength};
  }catch{
    return {ok:false,status:503,reason:"artifact-storage-write-failed"};
  }
}

export async function readArtifactCandidate(env,{descriptor}={}){
  const ready=artifactStorageReadiness(env);
  if(!ready.readReady) return {ok:false,status:503,reason:"r2-binding-read-missing"};
  const valid=validateArtifactStorageDescriptor(descriptor);
  if(!valid.ok) return {ok:false,status:400,reason:valid.reason};
  if(descriptor.distributionState!=="available"||descriptor.downloadable!==true) {
    return {ok:false,status:409,reason:"artifact-distribution-blocked"};
  }
  const key=artifactObjectKey({
    releaseId:descriptor.releaseId,
    fileId:descriptor.id,
    sha256:descriptor.hashes.sha256,
    filename:descriptor.filename
  });
  if(!key.ok) return {ok:false,status:400,reason:key.reason};
  try{
    const object=await env.MODARYX_ARTIFACTS.get(key.key);
    if(!object) return {ok:false,status:404,reason:"artifact-not-found"};
    const buffer=await object.arrayBuffer();
    const data=new Uint8Array(buffer);
    if(data.byteLength!==descriptor.size) return {ok:false,status:409,reason:"artifact-size-mismatch"};
    const digest=await sha256Hex(data);
    if(digest!==descriptor.hashes.sha256) return {ok:false,status:409,reason:"artifact-digest-mismatch"};
    const meta=object.customMetadata||{};
    if(meta.sha256&&meta.sha256!==digest) return {ok:false,status:409,reason:"artifact-metadata-digest-mismatch"};
    if(meta.artifactId&&meta.artifactId!==descriptor.id) return {ok:false,status:409,reason:"artifact-metadata-id-mismatch"};
    return {
      ok:true,status:200,key:key.key,bytes:data,sha256:digest,
      mediaType:object.httpMetadata?.contentType||descriptor.mediaType
    };
  }catch{
    return {ok:false,status:503,reason:"artifact-storage-read-failed"};
  }
}
