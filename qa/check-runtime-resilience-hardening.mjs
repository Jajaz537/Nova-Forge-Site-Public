import assert from 'node:assert/strict';
import {normalizeTrustedSignerSet} from '../functions/_lib/trusted-signers.mjs';
import {fetchBoundedHttps} from '../functions/_lib/storage-transport.mjs';
import {resolveAndPlanRepair} from '../functions/_lib/storage-repair-orchestrator.mjs';
import {discoverGuideService} from '../functions/_lib/integration-discovery.mjs';

const publicX='AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const publicY='BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
const signerBase={
  keyId:'key:resilience-proof',
  algorithm:'ES256',
  publicKeyFingerprintSha256:'a'.repeat(64),
  publicKeyJwk:{
    kty:'EC',
    crv:'P-256',
    x:publicX,
    y:publicY,
    key_ops:['verify'],
    use:'sig',
    alg:'ES256'
  },
  status:'active',
  validFrom:'2026-09-01T00:00:00.000Z',
  validUntil:'2026-12-31T23:59:59.000Z',
  revokedAt:null,
  revocationReason:null
};
const activeStore={
  schema:'modaryx-trusted-signers/v1',
  state:'active',
  updatedAt:'2026-09-21T18:30:00.000Z',
  signers:[signerBase]
};

assert.equal(normalizeTrustedSignerSet(activeStore).ok,true);

const privateMaterial=structuredClone(activeStore);
privateMaterial.signers[0].publicKeyJwk.d='CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC';
assert.equal(normalizeTrustedSignerSet(privateMaterial).reason,'trusted-signer-invalid');

const signingUsage=structuredClone(activeStore);
signingUsage.signers[0].publicKeyJwk.key_ops=['sign','verify'];
assert.equal(normalizeTrustedSignerSet(signingUsage).reason,'trusted-signer-invalid');

const missingUpdate=structuredClone(activeStore);
missingUpdate.updatedAt=null;
assert.equal(normalizeTrustedSignerSet(missingUpdate).reason,'trusted-signer-updated-at-required');

const invalidWindow=structuredClone(activeStore);
invalidWindow.signers[0].validUntil='2026-08-31T23:59:59.000Z';
assert.equal(normalizeTrustedSignerSet(invalidWindow).reason,'trusted-signer-invalid');

const hangingFetch=()=>new Promise(()=>{});
const timeoutResult=await fetchBoundedHttps({
  url:'https://storage.example/artifact.bin',
  fetchImpl:hangingFetch,
  maxBytes:1024,
  timeoutMs:15
});
assert.equal(timeoutResult.reason,'transport-timeout');

assert.equal((await fetchBoundedHttps({
  url:'https://127.0.0.1/private',
  fetchImpl:async()=>new Response('unexpected',{status:200}),
  timeoutMs:15
})).reason,'transport-url-invalid');

const identity={manifestSha256:'a'.repeat(64),artifactSha256:'b'.repeat(64)};
const repairTimeout=await resolveAndPlanRepair({
  logicalIdentity:identity,
  origins:[{
    originId:'origin:timeout',
    state:'active',
    mutableAlias:false,
    kind:'https',
    manifestUrl:'https://storage.example/manifest.json',
    artifactUrl:'https://storage.example/artifact.bin'
  }],
  fetchImpl:hangingFetch,
  transportTimeoutMs:15
});
assert.equal(repairTimeout.ok,true);
assert.equal(repairTimeout.resolution.resolutionState,'failed');
assert.equal(repairTimeout.observations[0].reason,'manifest-transport-timeout');
assert.equal(repairTimeout.repair.result.distributable,false);

const discoveryTimeout=await discoverGuideService({
  endpointUri:'https://guide.example/.well-known/modaryx-guide',
  requestedScopes:['guide.read'],
  fetchImpl:hangingFetch,
  timeoutMs:15
});
assert.equal(discoveryTimeout.reason,'discovery-timeout');

assert.equal((await discoverGuideService({
  endpointUri:'https://127.0.0.1/.well-known/modaryx-guide',
  requestedScopes:['guide.read'],
  fetchImpl:async()=>new Response('{}',{status:200,headers:{'content-type':'application/json'}}),
  timeoutMs:15
})).reason,'discovery-endpoint-invalid');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING',
  result:'PASS',
  invariants:[
    'trusted signer registry rejects private JWK material and signing-capable key operations',
    'active trust stores require a dated update marker and coherent validity windows',
    'Storage transport has a bounded deadline and rejects obvious loopback/private literal targets',
    'Repair orchestration fails closed when an origin exceeds the transport deadline',
    'remote Guide discovery has a bounded deadline and rejects obvious local/private targets',
    'no production signer, provider endpoint or remote service is introduced by the proof'
  ],
  failures:[]
},null,2));
