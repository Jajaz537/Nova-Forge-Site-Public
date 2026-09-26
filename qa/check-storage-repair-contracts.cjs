'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const storage=JSON.parse(fs.readFileSync(path.join(root,'schemas/storage-resolver.schema.json'),'utf8'));
const repair=JSON.parse(fs.readFileSync(path.join(root,'schemas/repair-network.schema.json'),'utf8'));
const readiness=JSON.parse(fs.readFileSync(path.join(root,'data/integration-readiness.json'),'utf8'));

const shaPattern='^[a-f0-9]{64}$';

assert.equal(storage.$id,'urn:nova-forge:schemas:storage-resolver:v1');
assert.equal(repair.$id,'urn:nova-forge:schemas:repair-network:v1');
assert.match(storage.description,/provider-neutral/i);
assert.match(repair.description,/fail-closed/i);

for(const schema of [storage,repair]){
  assert.deepEqual(schema.properties.logicalIdentity.required,['manifestSha256','artifactSha256']);
  assert.equal(schema.properties.logicalIdentity.properties.manifestSha256.pattern,shaPattern);
  assert.equal(schema.properties.logicalIdentity.properties.artifactSha256.pattern,shaPattern);
}

const storagePolicy=storage.properties.verificationPolicy;
assert.deepEqual(storagePolicy.required,[
  'digestVerificationRequired',
  'manifestBindingRequired',
  'rejectDigestMismatch',
  'rejectUntrustedMutableAlias'
]);
for(const key of storagePolicy.required) assert.equal(storagePolicy.properties[key].const,true,key);
assert.deepEqual(storage.properties.resolutionState.enum,['unresolved','verified','failed']);
assert.deepEqual(storage.properties.origins.items.properties.kind.enum,['https','object-storage','mirror','p2p','ipfs']);

const storageRules=JSON.stringify(storage.allOf);
for(const token of ['resolvedOriginId','verifiedArtifactSha256','failureReason']) assert.ok(storageRules.includes(token),token);

const repairPolicy=repair.properties.repairPolicy;
assert.deepEqual(repairPolicy.required,[
  'resolverVerificationRequired',
  'digestMatchRequired',
  'manifestBindingRequired',
  'silentSubstitutionForbidden',
  'revokedDistributionForbidden',
  'mutableAliasTrustForbidden'
]);
for(const key of repairPolicy.required) assert.equal(repairPolicy.properties[key].const,true,key);
assert.deepEqual(repair.properties.releaseState.enum,['active','withdrawn','revoked']);
assert.deepEqual(repair.properties.result.properties.state.enum,[
  'not-attempted',
  'repaired',
  'no-verified-copy',
  'digest-mismatch',
  'release-withdrawn',
  'release-revoked'
]);

const repairRules=JSON.stringify(repair.allOf);
for(const token of [
  '"withdrawn","revoked"',
  '"distributable":{"const":false}',
  '"state":{"const":"repaired"}',
  '"releaseState":{"const":"active"}',
  '"distributable":{"const":true}',
  'selectedOriginId',
  'verifiedArtifactSha256',
  '"required":["reason"]'
]) assert.ok(repairRules.includes(token),token);

const capability=readiness.capabilities.find(item=>item.id==='storage.resolver-repair');
assert.ok(capability,'storage.resolver-repair readiness capability missing');
assert.equal(capability.state,'not-connected');
assert.deepEqual(capability.contractPaths,[
  './schemas/storage-resolver.schema.json',
  './schemas/repair-network.schema.json'
]);
assert.ok(capability.permissions.some(value=>/Aucune substitution silencieuse/i.test(value)));
assert.ok(capability.permissions.some(value=>/empreintes divergentes/i.test(value)));
assert.match(capability.publicationGate,/identité/i);
assert.match(capability.publicationGate,/manifeste/i);
assert.match(capability.publicationGate,/empreinte/i);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_STORAGE_REPAIR_CONTRACTS',
  result:'PASS',
  scope:'Contract semantics only; remote resolver/repair services remain not-connected',
  historicalSchemaIdsRetained:true,
  readinessState:capability.state,
  invariants:[
    'digest verification required',
    'manifest binding required',
    'digest mismatch rejected',
    'untrusted mutable aliases rejected',
    'silent substitution forbidden',
    'revoked distribution forbidden',
    'repair requires exact logical identity'
  ],
  failures:[]
},null,2));
