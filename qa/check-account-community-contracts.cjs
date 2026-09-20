'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const profile=JSON.parse(fs.readFileSync(path.join(root,'schemas/public-profile.schema.json'),'utf8'));
const security=JSON.parse(fs.readFileSync(path.join(root,'schemas/account-security.schema.json'),'utf8'));
const submission=JSON.parse(fs.readFileSync(path.join(root,'schemas/community-submission.schema.json'),'utf8'));
const write=JSON.parse(fs.readFileSync(path.join(root,'schemas/community-write.schema.json'),'utf8'));
const readiness=JSON.parse(fs.readFileSync(path.join(root,'data/integration-readiness.json'),'utf8'));

assert.equal(profile.$id,'urn:nova-forge:schemas:public-profile:v1');
assert.equal(security.$id,'urn:nova-forge:schemas:account-security:v1');
assert.equal(submission.$id,'https://nova-forge.invalid/schemas/community-submission.schema.json');
assert.equal(write.$id,'urn:nova-forge:schemas:community-write:v1');

for(const key of ['schemaVersion','profileId','handle','displayName','visibility','creator']) {
  assert.ok(profile.required.includes(key),'profile required: '+key);
}
assert.equal(profile.additionalProperties,false);
assert.equal(profile.properties.schemaVersion.const,1);
assert.equal(profile.properties.profileId.pattern,'^profile:[a-z0-9][a-z0-9._:-]{2,127}$');
assert.equal(profile.properties.handle.pattern,'^[a-z0-9][a-z0-9._-]{2,31}$');
assert.deepEqual(profile.properties.visibility.enum,['public','unlisted','private']);
assert.equal(profile.properties.creator.additionalProperties,false);
assert.deepEqual(profile.properties.creator.required,['isCreator']);
assert.equal(profile.properties.creator.properties.isCreator.type,'boolean');
assert.equal(profile.properties.links.maxItems,12);
assert.equal(profile.properties.links.uniqueItems,true);

assert.match(security.description,/never contains or requests a private key/i);
for(const key of ['schemaVersion','profileRef','credentials','recovery','sessions','privilegedActions']) {
  assert.ok(security.required.includes(key),'security required: '+key);
}
assert.equal(security.additionalProperties,false);
assert.equal(security.$defs.credential.properties.kind.const,'passkey');
assert.deepEqual(security.$defs.credential.properties.userVerification.enum,['required','preferred','discouraged']);
assert.deepEqual(security.$defs.credential.properties.state.enum,['active','revoked']);
assert.deepEqual(security.$defs.recovery.properties.mode.enum,['none','recovery-codes','verified-contact','support-assisted']);
assert.deepEqual(security.$defs.recovery.properties.state.enum,['not-configured','configured','suspended']);
assert.deepEqual(security.$defs.session.properties.state.enum,['active','revoked','expired']);
assert.deepEqual(security.$defs.privilegedAction.properties.action.enum,[
  'publish','moderate','review-appeal','change-credentials','change-recovery','revoke-session'
]);
assert.equal(security.$defs.privilegedAction.properties.reauthenticationRequired.const,true);
assert.equal(security.$defs.privilegedAction.properties.maximumAuthenticationAgeSeconds.maximum,3600);

for(const key of [
  'schemaVersion','id','kind','targetId','body','authorProfileId','syncState','publicationState','moderationState'
]) assert.ok(submission.required.includes(key),'submission required: '+key);
assert.equal(submission.additionalProperties,false);
assert.equal(submission.properties.authorProfileId.type,'null');
assert.equal(submission.properties.syncState.const,'local-only');
assert.equal(submission.properties.publicationState.const,'local-draft');
assert.equal(submission.properties.moderationState.const,'not-submitted');
assert.deepEqual(submission.properties.kind.enum,['discussion','review','comment']);
const submissionRules=JSON.stringify(submission.allOf);
for(const token of [
  '"kind":{"const":"review"}','"required":["title","rating"]',
  '"kind":{"const":"discussion"}','"required":["title"]',
  '"kind":{"const":"comment"}','"required":["parentSubmissionId"]'
]) assert.ok(submissionRules.includes(token),token);

assert.match(write.description,/does not imply that a backend is active/i);
for(const key of ['schemaVersion','intentId','actorProfileRef','kind','target','payload','abuseShield','moderation','createdAt']) {
  assert.ok(write.required.includes(key),'write required: '+key);
}
assert.equal(write.additionalProperties,false);
assert.deepEqual(write.properties.kind.enum,['collection-update','discussion','review','comment']);
assert.equal(write.properties.abuseShield.properties.required.const,true);
assert.deepEqual(write.properties.abuseShield.properties.state.enum,['pending','passed','blocked']);
assert.deepEqual(write.properties.moderation.properties.routingState.enum,['pending','accepted','rejected','held-for-review']);
assert.equal(write.properties.moderation.properties.moderationReceiptId.pattern,'^moderation:[a-z0-9][a-z0-9._:-]{7,191}$');
const writeRules=JSON.stringify(write.allOf);
assert.ok(writeRules.includes('"state":{"const":"blocked"}'));
assert.ok(writeRules.includes('"routingState":{"enum":["rejected","held-for-review"]}'));

const accounts=readiness.capabilities.find(item=>item.id==='accounts.profiles');
const community=readiness.capabilities.find(item=>item.id==='community.publication-moderation');
assert.ok(accounts&&community,'required readiness capabilities missing');
assert.equal(accounts.state,'not-connected');
assert.equal(community.state,'local-only');
for(const p of ['./schemas/public-profile.schema.json','./schemas/account-security.schema.json']) {
  assert.ok(accounts.contractPaths.includes(p),p);
}
for(const p of ['./schemas/community-submission.schema.json','./schemas/community-write.schema.json']) {
  assert.ok(community.contractPaths.includes(p),p);
}
assert.ok(accounts.permissions.some(v=>/Clé privée jamais demandée ni stockée/i.test(v)));
assert.ok(accounts.permissions.some(v=>/Réauthentification/i.test(v)));
assert.ok(accounts.permissions.some(v=>/Révocation de session/i.test(v)));
assert.ok(community.permissions.some(v=>/Écriture distante après authentification/i.test(v)));
assert.ok(community.permissions.some(v=>/Modération séparée/i.test(v)));
assert.ok(community.permissions.some(v=>/Appel traçable/i.test(v)));

console.log(JSON.stringify({
  marker:'PASS_TARGETED_ACCOUNT_COMMUNITY_CONTRACTS',
  result:'PASS',
  scope:'Profile/account-security/community-write contracts only; identity and remote publication services remain not-connected/local-only',
  historicalSchemaIdsRetained:true,
  readiness:{
    accounts:accounts.state,
    community:community.state
  },
  invariants:[
    'public profile visibility is explicit',
    'private keys are never requested or stored by the account-security contract',
    'passkeys are represented as public credential records only',
    'privileged actions require reauthentication',
    'sessions have revocable states',
    'local community submissions cannot masquerade as published content',
    'remote write intents require Abuse Shield routing',
    'blocked abuse signals cannot route directly to accepted'
  ],
  failures:[]
},null,2));
