import assert from 'node:assert/strict';
import {verifyArtifactForDistribution} from '../functions/_lib/artifact-trust.mjs';
import {canonicalAttestationPayload,publicKeyFingerprintSha256} from '../functions/_lib/attestation.mjs';

const bytes=new TextEncoder().encode('MODARYX trusted distribution proof');
const sha256=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))]
  .map(value=>value.toString(16).padStart(2,'0')).join('');

const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const publicJwk=await crypto.subtle.exportKey('jwk',pair.publicKey);
const fingerprint=await publicKeyFingerprintSha256(publicJwk,'ES256');

const artifact={
  id:'artifact:distribution-proof',
  name:'Distribution proof',
  version:'1.0.0',
  filename:'distribution-proof.bin',
  size_bytes:bytes.byteLength,
  sha256,
  provenance:'QA ephemeral proof only',
  download_path:'./downloads/distribution-proof.bin',
  signature_status:'verified'
};

const attestation={
  schemaVersion:1,
  attestationId:'attestation:distribution-proof',
  subject:{kind:'artifact',subjectId:artifact.id,sha256},
  signer:{keyId:'key:distribution-proof',algorithm:'ES256',publicKeyFingerprintSha256:fingerprint},
  signature:'',
  signedAt:'2026-09-21T18:00:00.000Z',
  verification:{state:'unverified',verifiedAt:null,reason:null},
  privateKeyMaterialPresent:false
};
const payload=canonicalAttestationPayload(attestation);
const signature=await crypto.subtle.sign(
  {name:'ECDSA',hash:'SHA-256'},
  pair.privateKey,
  new TextEncoder().encode(payload)
);
attestation.signature=Buffer.from(signature).toString('base64url');

const trustStore={
  schema:'modaryx-trusted-signers/v1',
  state:'active',
  updatedAt:'2026-09-21T18:00:00.000Z',
  signers:[{
    keyId:'key:distribution-proof',
    algorithm:'ES256',
    publicKeyFingerprintSha256:fingerprint,
    publicKeyJwk:publicJwk,
    status:'active',
    validFrom:'2026-09-01T00:00:00.000Z',
    validUntil:'2026-12-31T23:59:59.000Z',
    revokedAt:null,
    revocationReason:null
  }]
};

const verified=await verifyArtifactForDistribution({
  artifact,
  bytes,
  attestation,
  trustStore,
  now:new Date('2026-09-21T18:00:01.000Z')
});
assert.equal(verified.ok,true);
assert.equal(verified.signature.state,'verified');
assert.equal(verified.signature.trustKeyId,'key:distribution-proof');

const tampered=Uint8Array.from(bytes);
tampered[0]^=1;
assert.equal((await verifyArtifactForDistribution({artifact,bytes:tampered,attestation,trustStore})).reason,'artifact-digest-mismatch');

const wrongSubject=structuredClone(attestation);
wrongSubject.subject.subjectId='artifact:other';
assert.equal((await verifyArtifactForDistribution({artifact,bytes,attestation:wrongSubject,trustStore})).reason,'attestation-subject-id-mismatch');

const emptyTrust={schema:'modaryx-trusted-signers/v1',state:'no-trust-anchor-published',updatedAt:null,signers:[]};
assert.equal((await verifyArtifactForDistribution({artifact,bytes,attestation,trustStore:emptyTrust})).reason,'trust-anchor-not-published');

const unsigned={...artifact,signature_status:'not-required'};
const unsignedOk=await verifyArtifactForDistribution({artifact:unsigned,bytes,signatureRequired:false});
assert.equal(unsignedOk.ok,true);
assert.equal(unsignedOk.signature.state,'not-required');

assert.equal((await verifyArtifactForDistribution({artifact:unsigned,bytes,signatureRequired:true})).reason,'signature-required-not-verified');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_DISTRIBUTION_TRUST_CHAIN',
  result:'PASS',
  invariants:[
    'artifact byte length and SHA-256 must match the published descriptor',
    'required signatures must bind the exact artifact id and digest',
    'a cryptographic signature is accepted only through the explicit trusted-signer gate',
    'empty or unknown trust anchors fail closed',
    'signature-not-required is accepted only when the caller explicitly sets signatureRequired=false',
    'the proof uses ephemeral QA keys and publishes no production signer or artifact'
  ],
  failures:[]
},null,2));
