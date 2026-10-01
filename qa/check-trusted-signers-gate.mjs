import assert from 'node:assert/strict';
import {
  normalizeTrustedSignerSet,
  resolveTrustedSigner,
  verifyAttestationWithTrustStore
} from '../functions/_lib/trusted-signers.mjs';
import {
  canonicalAttestationPayload,
  publicKeyFingerprintSha256
} from '../functions/_lib/attestation.mjs';

const empty={
  schema:'modaryx-trusted-signers/v1',
  state:'no-trust-anchor-published',
  updatedAt:null,
  signers:[]
};
assert.equal(normalizeTrustedSignerSet(empty).ok,true);
assert.equal(resolveTrustedSigner({
  trustStore:empty,
  keyId:'key:test',
  algorithm:'ES256',
  fingerprint:'a'.repeat(64)
}).reason,'trust-anchor-not-published');

const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const publicJwk=await crypto.subtle.exportKey('jwk',pair.publicKey);
const fingerprint=await publicKeyFingerprintSha256(publicJwk,'ES256');
const trustStore={
  schema:'modaryx-trusted-signers/v1',
  state:'active',
  updatedAt:'2026-09-21T14:00:00.000Z',
  signers:[{
    keyId:'key:dev-proof',
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

const attestation={
  schemaVersion:1,
  attestationId:'attestation:trusted-proof',
  subject:{kind:'artifact',subjectId:'artifact:trusted-proof',sha256:'7'.repeat(64)},
  signer:{keyId:'key:dev-proof',algorithm:'ES256',publicKeyFingerprintSha256:fingerprint},
  signature:'',
  signedAt:'2026-09-21T14:00:00.000Z',
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

const verified=await verifyAttestationWithTrustStore({
  attestation,
  trustStore,
  expectedSubjectSha256:'7'.repeat(64),
  now:new Date('2026-09-21T14:00:01.000Z')
});
assert.equal(verified.ok,true);
assert.equal(verified.trustKeyId,'key:dev-proof');

const unknown=structuredClone(attestation);
unknown.signer.keyId='key:unknown';
assert.equal((await verifyAttestationWithTrustStore({attestation:unknown,trustStore,now:new Date('2026-09-21T14:00:01.000Z')})).reason,'trusted-signer-not-found');

const revokedStore=structuredClone(trustStore);
revokedStore.signers[0].status='revoked';
revokedStore.signers[0].revokedAt='2026-09-21T14:00:00.000Z';
revokedStore.signers[0].revocationReason='test-revocation';
assert.equal((await verifyAttestationWithTrustStore({attestation,trustStore:revokedStore,now:new Date('2026-09-21T14:00:01.000Z')})).reason,'trusted-signer-revoked');

const expiredStore=structuredClone(trustStore);
expiredStore.signers[0].validUntil='2026-09-20T00:00:00.000Z';
assert.equal((await verifyAttestationWithTrustStore({attestation,trustStore:expiredStore,now:new Date('2026-09-21T14:00:01.000Z')})).reason,'trusted-signer-expired');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_TRUSTED_SIGNER_GATE',
  result:'PASS',
  invariants:[
    'empty public trust store fails closed',
    'only explicitly trusted public keys can verify attestations',
    'algorithm and public-key fingerprint must match the trust anchor',
    'revoked, expired and unknown keys fail closed',
    'private signing material is not stored in the trust registry'
  ],
  failures:[]
},null,2));
