import {verifySignatureAttestation} from './attestation.mjs';

const SHA256_RE=/^[a-f0-9]{64}$/;
const B64URL_RE=/^[A-Za-z0-9_-]+$/;
const PRIVATE_JWK_FIELDS=['d','p','q','dp','dq','qi','oth','k'];

function b64urlByteLength(value){
  if(typeof value!=='string' || !value || !B64URL_RE.test(value)) return null;
  try{
    const normalized=value.replace(/-/g,'+').replace(/_/g,'/');
    const padded=normalized+'='.repeat((4-normalized.length%4)%4);
    return atob(padded).length;
  }catch{
    return null;
  }
}

function validPublicJwk(jwk,algorithm){
  if(!jwk || typeof jwk!=='object' || Array.isArray(jwk)) return false;
  if(PRIVATE_JWK_FIELDS.some(field=>Object.prototype.hasOwnProperty.call(jwk,field))) return false;
  if(jwk.use!==undefined && jwk.use!=='sig') return false;
  if(jwk.key_ops!==undefined){
    if(!Array.isArray(jwk.key_ops) || !jwk.key_ops.length) return false;
    if(jwk.key_ops.some(operation=>operation!=='verify')) return false;
  }

  if(algorithm==='ES256'){
    if(jwk.kty!=='EC' || jwk.crv!=='P-256') return false;
    if(b64urlByteLength(jwk.x)!==32 || b64urlByteLength(jwk.y)!==32) return false;
    if(jwk.alg!==undefined && jwk.alg!=='ES256') return false;
    return true;
  }

  if(algorithm==='EdDSA'){
    if(jwk.kty!=='OKP' || jwk.crv!=='Ed25519') return false;
    if(b64urlByteLength(jwk.x)!==32) return false;
    if(jwk.alg!==undefined && jwk.alg!=='EdDSA') return false;
    return true;
  }

  return false;
}

function validDate(value){
  return typeof value==='string' && Number.isFinite(Date.parse(value));
}

function normalizeSigner(item){
  if(!item || typeof item!=='object') return null;
  if(typeof item.keyId!=='string' || item.keyId.trim().length<3 || item.keyId.trim().length>160) return null;
  if(!['ES256','EdDSA'].includes(item.algorithm)) return null;
  if(!SHA256_RE.test(item.publicKeyFingerprintSha256||'')) return null;
  if(!validPublicJwk(item.publicKeyJwk,item.algorithm)) return null;
  if(!['active','revoked'].includes(item.status)) return null;
  if(!validDate(item.validFrom)) return null;
  if(item.validUntil!==null && item.validUntil!==undefined && !validDate(item.validUntil)) return null;
  const validFromMs=Date.parse(item.validFrom);
  const validUntilMs=item.validUntil ? Date.parse(item.validUntil) : null;
  if(validUntilMs!==null && validUntilMs<=validFromMs) return null;
  if(item.status==='revoked'){
    if(!validDate(item.revokedAt)) return null;
    if(Date.parse(item.revokedAt)<validFromMs) return null;
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
  if(input.updatedAt!==null && input.updatedAt!==undefined && !validDate(input.updatedAt)){
    return {ok:false,reason:'trusted-signer-updated-at-invalid'};
  }
  if(input.state==='active' && !validDate(input.updatedAt)){
    return {ok:false,reason:'trusted-signer-updated-at-required'};
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
