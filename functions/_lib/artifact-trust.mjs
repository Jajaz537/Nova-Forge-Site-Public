import {verifyAttestationWithTrustStore} from './trusted-signers.mjs';

const SHA256_RE=/^[a-f0-9]{64}$/;
const SAFE_ID_RE=/^[a-z0-9][a-z0-9._:-]{0,159}$/;

function toBytes(input){
  if(input instanceof Uint8Array) return input;
  if(input instanceof ArrayBuffer) return new Uint8Array(input);
  if(ArrayBuffer.isView(input)) return new Uint8Array(input.buffer,input.byteOffset,input.byteLength);
  return null;
}

function toHex(buffer){
  return [...new Uint8Array(buffer)].map(value=>value.toString(16).padStart(2,'0')).join('');
}

async function sha256Hex(bytes){
  return toHex(await crypto.subtle.digest('SHA-256',bytes));
}

function validRelativeDownloadPath(value){
  if(typeof value!=='string' || !value.startsWith('./') || value.includes('..') || value.includes('\\')) return false;
  try{
    const url=new URL(value,'https://modaryx.invalid/');
    return url.origin==='https://modaryx.invalid' && url.pathname.startsWith('/');
  }catch{
    return false;
  }
}

export function validateDistributionArtifactDescriptor(item){
  if(!item || typeof item!=='object') return {ok:false,reason:'artifact-descriptor-invalid'};
  if(!SAFE_ID_RE.test(item.id||'')) return {ok:false,reason:'artifact-id-invalid'};
  if(typeof item.name!=='string' || !item.name.trim()) return {ok:false,reason:'artifact-name-invalid'};
  if(typeof item.version!=='string' || !item.version.trim()) return {ok:false,reason:'artifact-version-invalid'};
  if(typeof item.filename!=='string' || !item.filename.trim()) return {ok:false,reason:'artifact-filename-invalid'};
  if(!Number.isSafeInteger(item.size_bytes) || item.size_bytes<1) return {ok:false,reason:'artifact-size-invalid'};
  if(!SHA256_RE.test(item.sha256||'')) return {ok:false,reason:'artifact-digest-invalid'};
  if(typeof item.provenance!=='string' || !item.provenance.trim()) return {ok:false,reason:'artifact-provenance-missing'};
  if(!validRelativeDownloadPath(item.download_path)) return {ok:false,reason:'artifact-download-path-invalid'};
  if(!['verified','not-required'].includes(item.signature_status)) return {ok:false,reason:'artifact-signature-state-invalid'};
  return {
    ok:true,
    reason:null,
    artifact:{
      id:item.id,
      name:item.name.trim(),
      version:item.version.trim(),
      filename:item.filename.trim(),
      size_bytes:item.size_bytes,
      sha256:item.sha256,
      provenance:item.provenance.trim(),
      download_path:item.download_path,
      signature_status:item.signature_status
    }
  };
}

export async function verifyArtifactForDistribution({
  artifact,
  bytes,
  attestation=null,
  trustStore=null,
  signatureRequired=true,
  now=new Date()
}={}){
  const descriptor=validateDistributionArtifactDescriptor(artifact);
  if(!descriptor.ok) return descriptor;

  const data=toBytes(bytes);
  if(!data) return {ok:false,reason:'artifact-bytes-invalid'};
  if(data.byteLength!==descriptor.artifact.size_bytes){
    return {ok:false,reason:'artifact-size-mismatch',observedSizeBytes:data.byteLength};
  }

  const observedSha256=await sha256Hex(data);
  if(observedSha256!==descriptor.artifact.sha256){
    return {ok:false,reason:'artifact-digest-mismatch',observedSha256};
  }

  if(!signatureRequired){
    if(descriptor.artifact.signature_status!=='not-required'){
      return {ok:false,reason:'signature-policy-state-mismatch'};
    }
    return {
      ok:true,
      reason:null,
      artifactId:descriptor.artifact.id,
      verifiedSha256:observedSha256,
      signature:{state:'not-required',trustKeyId:null}
    };
  }

  if(descriptor.artifact.signature_status!=='verified'){
    return {ok:false,reason:'signature-required-not-verified'};
  }
  if(!attestation || typeof attestation!=='object') return {ok:false,reason:'signature-attestation-missing'};
  if(!trustStore || typeof trustStore!=='object') return {ok:false,reason:'trusted-signer-set-missing'};
  if(attestation?.subject?.kind!=='artifact') return {ok:false,reason:'attestation-subject-kind-invalid'};
  if(attestation?.subject?.subjectId!==descriptor.artifact.id) return {ok:false,reason:'attestation-subject-id-mismatch'};
  if(attestation?.subject?.sha256!==descriptor.artifact.sha256) return {ok:false,reason:'attestation-subject-digest-mismatch'};

  const verified=await verifyAttestationWithTrustStore({
    attestation,
    trustStore,
    expectedSubjectSha256:descriptor.artifact.sha256,
    now
  });
  if(!verified.ok) return verified;

  return {
    ok:true,
    reason:null,
    artifactId:descriptor.artifact.id,
    verifiedSha256:observedSha256,
    signature:{state:'verified',trustKeyId:verified.trustKeyId}
  };
}
