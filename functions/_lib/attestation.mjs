const SHA256_RE=/^[a-f0-9]{64}$/;
const B64URL_RE=/^[A-Za-z0-9_-]+$/;

function text(value,max){
  if(typeof value!=='string') return null;
  const out=value.trim();
  return out && out.length<=max ? out : null;
}

function hex(bytes){
  return [...bytes].map(v=>v.toString(16).padStart(2,'0')).join('');
}

function b64urlBytes(value){
  if(typeof value!=='string' || !B64URL_RE.test(value)) throw new Error('signature-encoding-invalid');
  const normalized=value.replace(/-/g,'+').replace(/_/g,'/');
  const padded=normalized+'='.repeat((4-normalized.length%4)%4);
  return Uint8Array.from(atob(padded),c=>c.charCodeAt(0));
}

async function sha256Hex(value){
  const bytes=value instanceof Uint8Array ? value : new TextEncoder().encode(String(value));
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)));
}

function canonicalJwk(jwk,algorithm){
  if(!jwk || typeof jwk!=='object') return null;
  if(algorithm==='ES256'){
    if(jwk.kty!=='EC'||jwk.crv!=='P-256'||typeof jwk.x!=='string'||typeof jwk.y!=='string') return null;
    return JSON.stringify({crv:'P-256',kty:'EC',x:jwk.x,y:jwk.y});
  }
  if(algorithm==='EdDSA'){
    if(jwk.kty!=='OKP'||jwk.crv!=='Ed25519'||typeof jwk.x!=='string') return null;
    return JSON.stringify({crv:'Ed25519',kty:'OKP',x:jwk.x});
  }
  return null;
}

export async function publicKeyFingerprintSha256(jwk,algorithm){
  const canonical=canonicalJwk(jwk,algorithm);
  if(!canonical) return null;
  return sha256Hex(canonical);
}

export function canonicalAttestationPayload(attestation){
  const id=text(attestation?.attestationId,192);
  const kind=attestation?.subject?.kind;
  const subjectId=text(attestation?.subject?.subjectId,200);
  const digest=attestation?.subject?.sha256;
  const keyId=text(attestation?.signer?.keyId,160);
  const algorithm=attestation?.signer?.algorithm;
  const fingerprint=attestation?.signer?.publicKeyFingerprintSha256;
  const signedAt=attestation?.signedAt;

  if(!id || !/^attestation:[a-z0-9][a-z0-9._:-]{7,191}$/.test(id)) return null;
  if(!['manifest','artifact','publication-receipt'].includes(kind)) return null;
  if(!subjectId || !SHA256_RE.test(digest||'')) return null;
  if(!keyId || !['ES256','EdDSA'].includes(algorithm)) return null;
  if(!SHA256_RE.test(fingerprint||'')) return null;
  if(typeof signedAt!=='string' || !Number.isFinite(Date.parse(signedAt))) return null;

  return [
    'MODARYX-ATTESTATION-V1',
    id,
    kind,
    subjectId,
    digest,
    keyId,
    algorithm,
    fingerprint,
    new Date(signedAt).toISOString()
  ].join('\n');
}

async function importVerificationKey(jwk,algorithm){
  if(algorithm==='ES256'){
    return crypto.subtle.importKey('jwk',jwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  }
  if(algorithm==='EdDSA'){
    return crypto.subtle.importKey('jwk',jwk,{name:'Ed25519'},false,['verify']);
  }
  throw new Error('algorithm-unsupported');
}

async function verifyBytes(key,algorithm,signature,data){
  if(algorithm==='ES256'){
    return crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,signature,data);
  }
  if(algorithm==='EdDSA'){
    return crypto.subtle.verify({name:'Ed25519'},key,signature,data);
  }
  return false;
}

export async function verifySignatureAttestation({
  attestation,
  publicKeyJwk,
  expectedSubjectSha256=null,
  revokedKeyIds=[]
}={}){
  const payload=canonicalAttestationPayload(attestation);
  if(!payload) return {ok:false,reason:'attestation-invalid'};

  if(attestation.privateKeyMaterialPresent!==false){
    return {ok:false,reason:'private-key-material-forbidden'};
  }

  if(expectedSubjectSha256!==null){
    if(!SHA256_RE.test(expectedSubjectSha256||'')) return {ok:false,reason:'expected-subject-invalid'};
    if(attestation.subject.sha256!==expectedSubjectSha256) return {ok:false,reason:'subject-digest-mismatch'};
  }

  if(Array.isArray(revokedKeyIds) && revokedKeyIds.includes(attestation.signer.keyId)){
    return {ok:false,reason:'signer-key-revoked'};
  }

  const fingerprint=await publicKeyFingerprintSha256(publicKeyJwk,attestation.signer.algorithm);
  if(!fingerprint) return {ok:false,reason:'public-key-invalid'};
  if(fingerprint!==attestation.signer.publicKeyFingerprintSha256){
    return {ok:false,reason:'public-key-fingerprint-mismatch'};
  }

  let signature;
  try{
    signature=b64urlBytes(attestation.signature);
  }catch{
    return {ok:false,reason:'signature-encoding-invalid'};
  }

  let key;
  try{
    key=await importVerificationKey(publicKeyJwk,attestation.signer.algorithm);
  }catch{
    return {ok:false,reason:'public-key-import-failed'};
  }

  let verified=false;
  try{
    verified=await verifyBytes(
      key,
      attestation.signer.algorithm,
      signature,
      new TextEncoder().encode(payload)
    );
  }catch{
    return {ok:false,reason:'signature-verification-failed'};
  }

  if(!verified) return {ok:false,reason:'signature-invalid'};
  return {
    ok:true,
    reason:null,
    subject:{...attestation.subject},
    signer:{
      keyId:attestation.signer.keyId,
      algorithm:attestation.signer.algorithm,
      publicKeyFingerprintSha256:fingerprint
    }
  };
}
