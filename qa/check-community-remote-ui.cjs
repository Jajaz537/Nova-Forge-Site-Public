'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'community.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/community.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/modaryx-community-finishline.css'),'utf8');
const endpoint=fs.readFileSync(path.join(root,'functions/api/v1/community/submissions.js'),'utf8');
const publicEndpoint=fs.readFileSync(path.join(root,'functions/api/v1/community/public.js'),'utf8');
const appealEndpoint=fs.readFileSync(path.join(root,'functions/api/v1/community/appeals.js'),'utf8');
const statusEndpoint=fs.readFileSync(path.join(root,'functions/api/v1/community/submissions/[id].js'),'utf8');

for(const token of [
  'id="community-remote"',
  'data-remote-state="checking"',
  'id="community-login"',
  'id="community-submit-remote"',
  'id="community-turnstile"',
  'id="publications"',
  'data-public-state="loading"',
  'id="community-public-list"',
  'id="community-public-refresh"',
  'id="community-followup"',
  'data-followup-state="idle"',
  'id="community-followup-id"',
  'id="community-followup-check"',
  'id="community-appeal-panel"',
  'id="community-appeal-submit"',
  'Uniquement après modération.',
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
  'Le brouillon local est conservé',
  'fetch("/api/v1/community/public?limit=12"',
  'item.moderationState !== "accepted"',
  'item.publicationState !== "published"',
  'Aucun brouillon local n’est affiché à sa place',
  'remoteJson("/api/v1/community/submissions/" + encodeURIComponent(id))',
  'remoteJson("/api/v1/community/appeals"',
  'data?.state !== "submitted"',
  'trackedSubmission?.appealAvailable'
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
  '.community-remote-result{',
  '.community-publications{',
  '.community-public-grid{',
  '.community-public-card',
  '.community-followup{',
  '.community-followup-summary{',
  '.community-appeal-panel{'
]) assert.ok(css.includes(token),'community remote CSS invariant missing: '+token);

for(const token of [
  "authorizeWrite(context, {action:'community-write'",
  "'passed', 'pending', 'received'",
  "publicationState:'received'",
  "distributable:false"
]) assert.ok(endpoint.includes(token),'community endpoint invariant missing: '+token);

assert.ok(!endpoint.includes("publicationState:'published'"),'community endpoint must not auto-publish');
for(const token of [
  "s.abuse_state = 'passed'",
  "s.moderation_state = 'accepted'",
  "s.publication_state = 'published'",
  "row.profile_visibility === 'public'"
]) assert.ok(publicEndpoint.includes(token),'public community endpoint invariant missing: '+token);

for(const token of [
  'authorizeCommunityMemberWrite',
  "receipt_type = 'appeal'",
  "decision-not-appealable",
  "appeal-already-submitted",
  "'system'"
]) assert.ok(appealEndpoint.includes(token),'community appeal endpoint invariant missing: '+token);

for(const token of [
  'authenticateRead(context)',
  'p.identity_sub = ?',
  "receipt.receiptType === 'decision'",
  "receipt.receiptType === 'appeal'",
  "receipt.receiptType === 'appeal-outcome'",
  'appealAvailable'
]) assert.ok(statusEndpoint.includes(token),'community follow-up endpoint invariant missing: '+token);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_COMMUNITY_REMOTE_UI',
  result:'PASS',
  scope:'Community remote/public UI source contract; live moderation provider proof remains separate',
  invariants:[
    'local drafts remain independent and local-first',
    'remote path is session/backend/Turnstile gated',
    'remote submissions are sent for moderation, never auto-published',
    'failed remote writes do not claim success',
    'browser never handles Auth0 access tokens',
    'public feed renders only accepted/published server responses',
    'public feed fails closed instead of substituting local drafts',
    'owners can inspect only their own remote submission state',
    'appeal UI is exposed only when the server reports an appealable restrictive decision'
  ],
  failures:[]
},null,2));
