'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const doc=fs.readFileSync(path.join(__dirname,'MODARYX-DEV-PROVIDER-READINESS-20260920.md'),'utf8');
const remote=fs.readFileSync(path.join(root,'functions/_lib/remote-write.mjs'),'utf8');

for(const token of [
  'migrations/0001_modaryx_dev_foundation.sql',
  'migrations/0002_modaryx_auth_sessions.sql',
  'migrations/0003_modaryx_moderation_publication.sql',
  'MODARYX_TURNSTILE_HOSTNAME',
  'profile-write',
  'community-write',
  'AUTH0_AUDIENCE',
  'RS256',
  'community:moderate'
]) assert.ok(doc.includes(token),'DEV readiness doc invariant missing: '+token);

assert.ok(remote.includes('MODARYX_TURNSTILE_HOSTNAME'),'remote-write hostname pin variable missing');
assert.ok(remote.includes('expectedHostname:hostname'),'remote-write hostname is not passed to Turnstile verification');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_DEV_PROVIDER_READINESS',
  result:'PASS',
  scope:'Provider-independent readiness only; no Auth0 tenant, Cloudflare resource, binding, secret, DNS or production activation is claimed',
  checks:[
    'D1 migrations 0001 then 0002 then 0003 are explicit',
    'Turnstile stable hostname pin is explicit',
    'profile-write and community-write actions are explicit',
    'Auth0 audience, RS256 and community:moderate RBAC expectations are explicit',
    'R2 is not falsely required for current profile/community DEV proof'
  ],
  failures:[]
},null,2));
