'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'community.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/community.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/modaryx-community-finishline.css'),'utf8');
const endpoint=fs.readFileSync(path.join(root,'functions/api/v1/community/submissions.js'),'utf8');

for(const token of [
  'id="community-remote"',
  'data-remote-state="checking"',
  'id="community-login"',
  'id="community-submit-remote"',
  'id="community-turnstile"',
  'Envoyer pour modération',
  'https://challenges.cloudflare.com'
]) assert.ok(html.includes(token),'community html invariant missing: '+token);

for(const token of [
  'remoteJson("/api/v1/status")',
  'remoteJson("/api/v1/auth/session")',
  '/api/v1/auth/login?returnTo=',
  'remoteJson("/api/v1/community/submissions"',
  'action: "community-write"',
  'moderationState !== "pending"',
  'publicationState !== "received"',
  'distributable !== false',
  'Contribution reçue pour modération · NON PUBLIÉE',
  'Le brouillon local est conservé'
]) assert.ok(js.includes(token),'community JS invariant missing: '+token);

assert.ok(!js.includes('access_token'),'community UI must never handle Auth0 access tokens');
assert.ok(js.includes('buildSubmission(true)'),'remote path must reuse local validation');
assert.ok(js.includes('remoteSubmit.disabled = true'),'remote submit must start/return locked');
assert.ok(js.includes('remoteBackend?.turnstile?.publicSiteKey'));
assert.ok(js.includes('remoteBackend?.turnstile?.secretConfigured'));
assert.ok(js.includes('remoteBackend?.turnstile?.siteKeyConfigured'));

for(const token of [
  '.community-remote-bridge{',
  '[data-remote-state="authenticated"]',
  '.community-remote-result{'
]) assert.ok(css.includes(token),'community remote CSS invariant missing: '+token);

for(const token of [
  "authorizeWrite(context, {action:'community-write'",
  "'passed', 'pending', 'received'",
  "publicationState:'received'",
  "distributable:false"
]) assert.ok(endpoint.includes(token),'community endpoint invariant missing: '+token);

assert.ok(!endpoint.includes("publicationState:'published'"),'community endpoint must not auto-publish');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_COMMUNITY_REMOTE_UI',
  result:'PASS',
  scope:'Community remote UI source contract only; no real Auth0 session, D1 write, Turnstile challenge or moderation service is claimed',
  invariants:[
    'local drafts remain independent and local-first',
    'remote path is session/backend/Turnstile gated',
    'remote submissions are sent for moderation, never auto-published',
    'failed remote writes do not claim success',
    'browser never handles Auth0 access tokens'
  ],
  failures:[]
},null,2));
