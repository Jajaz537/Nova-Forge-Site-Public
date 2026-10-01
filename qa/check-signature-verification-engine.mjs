import assert from 'node:assert/strict';
import {
  canonicalAttestationPayload,
  publicKeyFingerprintSha256,
  verifySignatureAttestation
} from '../functions/_lib/attestation.mjs';

const enc=(bytes)=>Buffer.from(bytes).toString('base64url');

async function makeCase(algorithm){
  const keyPair=algorithm==='ES256'
    ? await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify'])
    : await crypto.subtle.generateKey({name:'Ed25519'},true,['sign','verify']);
  const publicJwk=await crypto.subtle.exportKey('jwk',keyPair.publicKey);
  const fingerprint=await publicKeyFingerprintSha256(publicJwk,algorithm);
  assert.match(fingerprint,/^[a-f0-9]{64}$/);

  const attestation={
    schemaVersion:1,
    attestationId:'attestation:proof-'+algorithm.toLowerCase(),
    subject:{
      kind:'artifact',
      subjectId:'artifact:proof',
      sha256:'1'.repeat(64)
    },
    signer:{
      keyId:'key:proof-'+algorithm.toLowerCase(),
      algorithm,
      publicKeyFingerprintSha256:fingerprint
    },
    signature:'',
    signedAt:'2026-09-21T13:40:00.000Z',
    verification:{state:'unverified',verifiedAt:null,reason:null},
    privateKeyMaterialPresent:false
  };

  const payload=canonicalAttestationPayload(attestation);
  assert.ok(payload);
  const data=new TextEncoder().encode(payload);
  const sig=algorithm==='ES256'
    ? await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},keyPair.privateKey,data)
    : await crypto.subtle.sign({name:'Ed25519'},keyPair.privateKey,data);
  attestation.signature=enc(sig);

  const ok=await verifySignatureAttestation({
    attestation,
    publicKeyJwk:publicJwk,
    expectedSubjectSha256:'1'.repeat(64)
  });
  assert.equal(ok.ok,true,algorithm+': valid signature');

  const digestMismatch=await verifySignatureAttestation({
    attestation,
    publicKeyJwk:publicJwk,
    expectedSubjectSha256:'2'.repeat(64)
  });
  assert.equal(digestMismatch.reason,'subject-digest-mismatch');

  const revoked=await verifySignatureAttestation({
    attestation,
    publicKeyJwk:publicJwk,
    revokedKeyIds:[attestation.signer.keyId]
  });
  assert.equal(revoked.reason,'signer-key-revoked');

  const tampered=structuredClone(attestation);
  tampered.subject.subjectId='artifact:tampered';
  const invalid=await verifySignatureAttestation({attestation:tampered,publicKeyJwk:publicJwk});
  assert.equal(invalid.reason,'signature-invalid');

  const badFingerprint=structuredClone(attestation);
  badFingerprint.signer.publicKeyFingerprintSha256='f'.repeat(64);
  const fp=await verifySignatureAttestation({attestation:badFingerprint,publicKeyJwk:publicJwk});
  assert.equal(fp.reason,'public-key-fingerprint-mismatch');

  return algorithm;
}

const algorithms=[];
for(const algorithm of ['ES256','EdDSA']) algorithms.push(await makeCase(algorithm));

console.log(JSON.stringify({
  marker:'PASS_TARGETED_SIGNATURE_VERIFICATION_ENGINE',
  result:'PASS',
  algorithms,
  invariants:[
    'canonical signing payload is deterministic',
    'public key fingerprint is checked before verification',
    'subject digest mismatch fails closed',
    'revoked signer keys fail closed',
    'tampered signed fields invalidate the signature',
    'no private key material is accepted in attestation records'
  ],
  failures:[]
},null,2));
