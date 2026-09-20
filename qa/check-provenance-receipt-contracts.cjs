'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const publication=JSON.parse(fs.readFileSync(path.join(root,'schemas/publication-receipt.schema.json'),'utf8'));
const moderation=JSON.parse(fs.readFileSync(path.join(root,'schemas/moderation-receipt.schema.json'),'utf8'));
const exportSchema=JSON.parse(fs.readFileSync(path.join(root,'schemas/moderation-export.schema.json'),'utf8'));
const readiness=JSON.parse(fs.readFileSync(path.join(root,'data/integration-readiness.json'),'utf8'));
const receiptUiCheck=fs.readFileSync(path.join(root,'qa/check-receipt-fields.cjs'),'utf8');

assert.equal(publication.$id,'urn:nova-forge:schemas:publication-receipt:v1');
assert.equal(moderation.$id,'urn:nova-forge:schemas:moderation-receipt:v1');
assert.equal(exportSchema.$id,'urn:nova-forge:schemas:moderation-export:v1');

for(const key of [
  'schemaVersion','receiptId','releaseIdentity','creatorProfileRef','manifestSha256',
  'artifacts','provenanceState','rightsState','moderationState','releaseState','publishedAt','distributable'
]) assert.ok(publication.required.includes(key),'publication required: '+key);

assert.equal(publication.properties.releaseIdentity.properties.identityDigest.pattern,'^sha256:[a-f0-9]{64}$');
assert.equal(publication.properties.manifestSha256.pattern,'^[a-f0-9]{64}$');
assert.equal(publication.properties.artifacts.items.properties.sha256.pattern,'^[a-f0-9]{64}$');
assert.deepEqual(publication.properties.provenanceState.enum,['verified','declared-unattested','unknown']);
assert.deepEqual(publication.properties.rightsState.enum,['verified','declared','unknown','restricted']);
assert.deepEqual(publication.properties.moderationState.enum,['clear','restricted','removed','under-review']);
assert.deepEqual(publication.properties.releaseState.enum,['published','withdrawn','revoked']);

const publicationRules=JSON.stringify(publication.allOf);
for(const token of [
  '"withdrawn","revoked"',
  '"removed","restricted"',
  '"distributable":{"const":false}',
  '"distributable":{"const":true}',
  '"releaseState":{"const":"published"}',
  '"provenanceState":{"const":"verified"}',
  '"rightsState":{"const":"verified"}',
  '"moderationState":{"const":"clear"}'
]) assert.ok(publicationRules.includes(token),token);

assert.match(moderation.description,/not a claim of legal compliance/i);
assert.deepEqual(moderation.properties.receiptType.enum,['notice','decision','appeal','appeal-outcome']);
assert.equal(moderation.$defs.notice.properties.immutable.const,true);
assert.ok(moderation.$defs.decision.required.includes('statementOfReasons'));
assert.ok(moderation.$defs.decision.properties.action.enum.includes('disable-distribution'));
assert.deepEqual(moderation.$defs.appeal.properties.state.enum,['submitted','under-review','closed']);
assert.deepEqual(moderation.$defs.outcome.properties.result.enum,['upheld','modified','reversed']);
assert.deepEqual(moderation.$defs.provenance.required,['recordedBy','recordedAt','previousReceiptId']);

const moderationRules=JSON.stringify(moderation.allOf);
for(const pair of [
  ['notice','notice'],
  ['decision','decision'],
  ['appeal','appeal'],
  ['appeal-outcome','outcome']
]) {
  assert.ok(moderationRules.includes('"const":"'+pair[0]+'"'),pair[0]);
  assert.ok(moderationRules.includes('"required":["'+pair[1]+'"]'),pair[1]);
}

assert.equal(exportSchema.properties.providerNeutral.const,true);
assert.deepEqual(exportSchema.properties.retention.required,['policy','expiresAt','legalHold']);
assert.deepEqual(exportSchema.properties.retention.properties.policy.enum,['standard','appeal-active','legal-hold']);
const exportRules=JSON.stringify(exportSchema.properties.retention.allOf);
assert.ok(exportRules.includes('"policy":{"const":"legal-hold"}'));
assert.ok(exportRules.includes('"legalHold":{"const":true}'));

const community=readiness.capabilities.find(item=>item.id==='community.publication-moderation');
const distribution=readiness.capabilities.find(item=>item.id==='distribution.artifacts');
assert.ok(community&&distribution,'readiness capabilities missing');
assert.equal(community.state,'local-only');
assert.equal(distribution.state,'distribution-locked');
for(const requiredPath of [
  './schemas/moderation-receipt.schema.json',
  './schemas/moderation-export.schema.json'
]) assert.ok(community.contractPaths.includes(requiredPath),requiredPath);
assert.ok(distribution.contractPaths.includes('./schemas/publication-receipt.schema.json'));

assert.match(receiptUiCheck,/without attesting authenticity/i);
assert.match(receiptUiCheck,/Correct format clears error/i);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_PROVENANCE_RECEIPT_CONTRACTS',
  result:'PASS',
  scope:'Receipt/provenance/moderation contracts only; no cryptographic signer or remote attestation service is claimed',
  historicalSchemaIdsRetained:true,
  readiness:{
    community:community.state,
    distribution:distribution.state
  },
  invariants:[
    'distribution requires published + verified provenance + verified rights + clear moderation',
    'withdrawn/revoked releases are non-distributable',
    'removed/restricted moderation is non-distributable',
    'moderation notices are immutable',
    'appeal and outcome receipts are explicit',
    'moderation export is provider-neutral with bounded retention semantics',
    'receipt format validation does not attest authenticity'
  ],
  failures:[]
},null,2));
