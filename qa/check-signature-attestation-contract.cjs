'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const schema=JSON.parse(fs.readFileSync(path.join(root,'schemas/signature-attestation.schema.json'),'utf8'));
const readiness=JSON.parse(fs.readFileSync(path.join(root,'data/integration-readiness.json'),'utf8'));
const downloads=JSON.parse(fs.readFileSync(path.join(root,'downloads.json'),'utf8'));
const publication=JSON.parse(fs.readFileSync(path.join(root,'schemas/publication-receipt.schema.json'),'utf8'));
const provenanceCheck=fs.readFileSync(path.join(root,'qa/check-provenance-receipt-contracts.cjs'),'utf8');

assert.equal(schema.$id,'urn:modaryx:schemas:signature-attestation:v1');
assert.match(schema.description,/must never contain private key material/i);
assert.deepEqual(schema.properties.subject.properties.kind.enum,['manifest','artifact','publication-receipt']);
assert.equal(schema.properties.subject.properties.sha256.pattern,'^[a-f0-9]{64}$');
assert.deepEqual(schema.properties.signer.properties.algorithm.enum,['ES256','EdDSA']);
assert.equal(schema.properties.signer.properties.publicKeyFingerprintSha256.pattern,'^[a-f0-9]{64}$');
assert.deepEqual(schema.properties.verification.properties.state.enum,['unverified','verified','failed','revoked']);
assert.equal(schema.properties.privateKeyMaterialPresent.const,false);

const rules=JSON.stringify(schema.allOf);
assert.ok(rules.includes('"state":{"const":"verified"}'));
assert.ok(rules.includes('"state":{"enum":["failed","revoked"]}'));
assert.ok(rules.includes('"reason":{"type":"string","minLength":1}'));

const distribution=readiness.capabilities.find(item=>item.id==='distribution.artifacts');
assert.ok(distribution,'distribution readiness missing');
assert.equal(distribution.state,'distribution-locked');
assert.ok(distribution.contractPaths.includes('./schemas/signature-attestation.schema.json'));
assert.equal(downloads.available,false);
assert.deepEqual(downloads.artifacts,[]);
assert.match(provenanceCheck,/does not attest authenticity/i);
assert.ok(publication.required.includes('provenanceState'));

console.log(JSON.stringify({
  marker:'PASS_TARGETED_SIGNATURE_ATTESTATION_CONTRACT',
  result:'PASS',
  scope:'Attestation envelope contract only; no signer, trusted public key or real artifact signature is claimed',
  invariants:[
    'signature is detached and bound to exact SHA-256 subject identity',
    'private key material is forbidden',
    'algorithm allowlist is explicit',
    'failed/revoked verification is reasoned',
    'distribution stays locked without real evidence'
  ],
  failures:[]
},null,2));
