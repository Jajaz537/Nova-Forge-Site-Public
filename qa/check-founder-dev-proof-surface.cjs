'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'functions/founder-proof-dev.js'),'utf8');

for(const token of [
  "design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev",
  "FOUNDER_PERMISSION",
  "hasPermission(identity, FOUNDER_PERMISSION)",
  "onRequestPost as decideModeration",
  "onRequestPost as decideAppeal",
  "/api/v1/moderation/decisions",
  "/api/v1/moderation/appeal-outcomes",
  'method="post"',
  "form-action 'self'",
  "x-robots-tag",
  "noindex, nofollow, noarchive",
  "cleanupFixture",
  "cleanupSucceeded",
  "receiptCreated",
  "getSessionIdentity",
  "requireSameOrigin"
]) assert.ok(source.includes(token),'Founder DEV proof invariant missing: '+token);

for(const forbidden of [
  'XMLHttpRequest',
  'sendBeacon',
  'AUTH0_CLIENT_SECRET',
  'MODARYX_TURNSTILE_SECRET',
  'MODARYX_WEATHER_API_KEY'
]) assert.ok(!source.includes(forbidden),'Founder DEV proof forbidden token present: '+forbidden);

assert.ok(!source.includes('fetch('),'Founder DEV proof must not depend on browser/server fetch');
assert.ok(source.includes("headers.set('cookie', cookie)"),'HttpOnly session forwarding into the real handler is missing');
assert.ok(!source.includes('document.cookie'),'Cookie extraction must never be used');
assert.ok(source.includes("result.cleanupSucceeded === true"),'Success must require fixture cleanup');
assert.ok(source.includes("DELETE FROM modaryx_moderation_receipts WHERE submission_id = ?"),'Receipt cleanup missing');
assert.ok(source.includes("DELETE FROM modaryx_community_submissions WHERE submission_id = ?"),'Submission cleanup missing');
assert.ok(source.includes("DELETE FROM modaryx_profiles WHERE profile_id = ?"),'Profile cleanup missing');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_FOUNDER_DEV_PROOF_SURFACE',
  result:'PASS',
  scope:'Temporary DEV-only proof surface; source proof only, runtime proof remains separate',
  checks:[
    'exact stable Preview hostname is enforced',
    'founder permission and same-origin session are required',
    'real moderation and appeals mutation handlers are reused',
    'no browser fetch/XHR/sendBeacon or cookie extraction is used',
    'success requires receipt creation and confirmed fixture cleanup',
    'no provider secret variable is exposed'
  ],
  failures:[]
},null,2));
