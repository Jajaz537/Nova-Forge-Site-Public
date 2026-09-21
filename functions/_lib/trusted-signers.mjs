import {verifySignatureAttestation} from './attestation.mjs';

const SHA256_RE=/^[a-f0-9]{64}$/;

function validDate(value){
  return typeof value==='string' && Number.isFinite(Date.parse(value));
}

function normalizeSigner(item){
  if(!item || typeof item!=='object') return null;
  if(typeof item.keyId!=='string' || item.keyId.trim().length<3 || item.keyId.trim().length>160) return null;
  if(!['ES256','EdDSA'].includes(item.algorithm)) return null;
  if(!SHA256_RE.test(item.publicKeyFingerprintSha256||'')) return null;
  if(!item.publicKeyJwk || typeof item.publicKeyJwk!=='object' || Array.isArray(item.publicKeyJwk)) return null;
  if(!['active','revoked'].includes(item.status)) return null;
  if(!validDate(item.validFrom)) return null;
  if(item.validUntil!==null && item.validUntil!==undefined && !validDate(item.validUntil)) return null;
  if(item.status==='revoked'){
    if(!validDate(item.revokedAt)) return null;
    if(typeof item.revocationReason!=='string' || !item.revocationReason.trim()) return null;
  }
  return {
    keyId:item.keyId.trim(),
    algorithm:item.algorithm,
    publicKeyFingerprintSha256:item.publicKeyFingerprintSha256,
    publicKeyJwk:item.publicKeyJwk,
    status:item.status,
    validFrom:new Date(item.validFrom).toISOString(),
    validUntil:item.validUntil ? new Date(item.validUntil).toISOString() : null,
    revokedAt:item.revokedAt ? new Date(item.revokedAt).toISOString() : null,
    revocationReason:typeof item.revocationReason==='string' ? item.revocationReason.trim() || null : null
  };
}

export function normalizeTrustedSignerSet(input){
  if(!input || typeof input!=='object' || input.schema!=='modaryx-trusted-signers/v1') {
    return {ok:false,reason:'trusted-signer-set-invalid'};
  }
  if(!['no-trust-anchor-published','active'].includes(input.state)) {
    return {ok:false,reason:'trusted-signer-state-invalid'};
  }
  if(!Array.isArray(input.signers) || input.signers.length>64) {
    return {ok:false,reason:'trusted-signer-list-invalid'};
  }
  const signers=[];
  const ids=new Set();
  for(const raw of input.signers){
    const signer=normalizeSigner(raw);
    if(!signer) return {ok:false,reason:'trusted-signer-invalid'};
    if(ids.has(signer.keyId)) return {ok:false,reason:'trusted-signer-duplicate'};
    ids.add(signer.keyId);
    signers.push(signer);
  }
  if(input.state==='no-trust-anchor-published' && signers.length!==0) {
    return {ok:false,reason:'unexpected-trust-anchor'};
  }
  if(input.state==='active' && signers.length===0) {
    return {ok:false,reason:'trust-anchor-missing'};
  }
  return {ok:true,reason:null,value:{schema:input.schema,state:input.state,updatedAt:input.updatedAt??null,signers}};
}

export function resolveTrustedSigner({trustStore,keyId,algorithm,fingerprint,now=new Date()}={}){
  const normalized=normalizeTrustedSignerSet(trustStore);
  if(!normalized.ok) return normalized;
  if(normalized.value.state!=='active') return {ok:false,reason:'trust-anchor-not-published'};
  const signer=normalized.value.signers.find(item=>item.keyId===keyId);
  if(!signer) return {ok:false,reason:'trusted-signer-not-found'};
  if(signer.algorithm!==algorithm) return {ok:false,reason:'trusted-signer-algorithm-mismatch'};
  if(signer.publicKeyFingerprintSha256!==fingerprint) return {ok:false,reason:'trusted-signer-fingerprint-mismatch'};
  if(signer.status==='revoked') return {ok:false,reason:'trusted-signer-revoked'};
  const nowMs=now instanceof Date ? now.getTime() : Date.parse(now);
  if(!Number.isFinite(nowMs)) return {ok:false,reason:'verification-time-invalid'};
  if(Date.parse(signer.validFrom)>nowMs) return {ok:false,reason:'trusted-signer-not-yet-valid'};
  if(signer.validUntil && Date.parse(signer.validUntil)<nowMs) return {ok:false,reason:'trusted-signer-expired'};
  return {ok:true,reason:null,signer};
}

export async function verifyAttestationWithTrustStore({
  attestation,
  trustStore,
  expectedSubjectSha256=null,
  now=new Date()
}={}){
  const trust=resolveTrustedSigner({
    trustStore,
    keyId:attestation?.signer?.keyId,
    algorithm:attestation?.signer?.algorithm,
    fingerprint:attestation?.signer?.publicKeyFingerprintSha256,
    now
  });
  if(!trust.ok) return trust;
  const verified=await verifySignatureAttestation({
    attestation,
    publicKeyJwk:trust.signer.publicKeyJwk,
    expectedSubjectSha256,
    revokedKeyIds:[]
  });
  return verified.ok ? {...verified,trustKeyId:trust.signer.keyId} : verified;
}
