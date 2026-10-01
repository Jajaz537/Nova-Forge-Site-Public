'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const downloads=JSON.parse(fs.readFileSync(path.join(root,'downloads.json'),'utf8'));
const runtime=fs.readFileSync(path.join(root,'assets/downloads.js'),'utf8');
const recovery=JSON.parse(fs.readFileSync(path.join(root,'qa/download-recovery-checks.json'),'utf8'));
const universal=JSON.parse(fs.readFileSync(path.join(root,'schemas/universal-mod-manifest.schema.json'),'utf8'));
const readiness=JSON.parse(fs.readFileSync(path.join(root,'data/integration-readiness.json'),'utf8'));

assert.equal(downloads.schema,'nova-forge-public-downloads/v1');
assert.equal(downloads.surface,'official-site');
assert.equal(downloads.stage,'pre-vf');
assert.equal(downloads.available,false);
assert.equal(downloads.policy,'verified-artifacts-only');
assert.deepEqual(downloads.required_evidence,[
  'identity',
  'integrity-sha256',
  'provenance',
  'signature-when-required'
]);
assert.deepEqual(downloads.artifacts,[]);
assert.equal(downloads.artifact_contract.download_path_policy,'same-origin-public-surface-only');
assert.equal(downloads.artifact_contract.sha256_format,'64-lowercase-hex');
assert.equal(downloads.artifact_contract.signature_status_required,true);
for(const field of ['id','name','version','filename','size_bytes','sha256','provenance','download_path']) {
  assert.ok(downloads.artifact_contract.required_fields_when_published.includes(field),'published artifact field missing: '+field);
}

for(const token of [
  "state.dataset.state = 'locked'",
  "url.origin === base.origin",
  "!value.includes('..')",
  "['verified', 'not-required'].includes(item.signature_status)",
  "manifest?.available === false",
  "manifest?.available !== true",
  "!Array.isArray(manifest?.artifacts) || !manifest.artifacts.length",
  "!manifest.artifacts.every(validateArtifact)",
  "ids.size !== manifest.artifacts.length",
  "offline-stale",
  "Ce navigateur n’a vérifié ni les fichiers ni leur signature."
]) assert.ok(runtime.includes(token),'downloads runtime guard missing: '+token);

assert.equal(recovery.result,'PASS');
assert.match(recovery.scope,/not native offline or screen reader proof/i);
for(const expected of [
  'Network failure is distinct from declared absence and never exposes artifacts',
  'HTTP error, invalid contract and invalid JSON keep distribution locked with recovery',
  'Stale manifest remains locked and offers a fresh attempt'
]) assert.ok(recovery.checks.includes(expected),'download recovery proof missing: '+expected);

assert.equal(universal.$id,'urn:nova-forge:schemas:universal-mod-manifest:v1');
assert.deepEqual(universal.properties.rights.properties.redistribution.enum,[
  'allowed','restricted','not-authorized','unknown'
]);
assert.deepEqual(universal.properties.provenance.properties.state.enum,[
  'verified','declared-unattested','unknown'
]);
const provenanceRules=JSON.stringify(universal.properties.provenance.allOf);
assert.ok(provenanceRules.includes('"state":{"const":"verified"}'));
assert.ok(provenanceRules.includes('"required":["receiptId"]'));
assert.deepEqual(universal.properties.distribution.properties.state.enum,[
  'locked','published','withdrawn','revoked'
]);
const distributionRules=JSON.stringify(universal.properties.distribution.allOf);
assert.ok(distributionRules.includes('"withdrawn","revoked"'));
assert.ok(distributionRules.includes('"downloadable":{"const":false}'));
assert.equal(universal.properties.files.items.properties.hashes.properties.sha256.pattern,'^[a-f0-9]{64}$');
assert.equal(universal.properties.releaseReceipt.properties.manifestSha256.pattern,'^[a-f0-9]{64}$');
assert.ok(universal.properties.releaseReceipt.properties.signature,'release receipt signature field missing');

const capability=readiness.capabilities.find(item=>item.id==='distribution.artifacts');
assert.ok(capability,'distribution.artifacts capability missing');
assert.equal(capability.state,'distribution-locked');
assert.ok(capability.contractPaths.includes('./downloads.json'));
assert.ok(capability.contractPaths.includes('./schemas/publication-receipt.schema.json'));
for(const input of ['Artefact autorisé','Empreinte SHA-256','Provenance','Signature lorsque requise']) {
  assert.ok(capability.requiredInputs.includes(input),'distribution input missing: '+input);
}
assert.ok(capability.permissions.some(value=>/same-origin/i.test(value)));
assert.match(capability.publicationGate,/frais/i);
assert.match(capability.publicationGate,/same-origin/i);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_DISTRIBUTION_LOCK_CONTRACTS',
  result:'PASS',
  scope:'Distribution lock and manifest semantics only; no public artifact, file signature, or real download is claimed',
  historicalSchemaIdsRetained:true,
  readinessState:capability.state,
  manifest:{
    available:downloads.available,
    artifactCount:downloads.artifacts.length,
    stage:downloads.stage
  },
  invariants:[
    'default manifest is unavailable with zero public artifacts',
    'published artifact contract requires identity/integrity/provenance/signature status gates',
    'download paths are same-origin relative paths without parent traversal',
    'stale, invalid, failed or empty availability stays locked',
    'withdrawn or revoked universal manifests cannot be downloadable',
    'real distribution remains locked until required inputs exist'
  ],
  failures:[]
},null,2));
