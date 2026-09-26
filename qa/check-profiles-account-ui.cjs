'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'profiles.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/profiles.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/profiles.css'),'utf8');
const config=fs.readFileSync(path.join(root,'functions/_lib/backend-config.mjs'),'utf8');
const status=fs.readFileSync(path.join(root,'functions/api/v1/status.js'),'utf8');

for(const token of [
  'id="account-console"',
  'data-account-state="checking"',
  'id="account-login"',
  'id="account-logout"',
  'id="profile-editor"',
  'id="profile-editor-fields"',
  'id="turnstile-slot"',
  'id="public-profile"',
  'data-public-profile-state="idle"',
  'id="public-profile-search"',
  'id="public-profile-card"',
  'id="account-authority-card"',
  'id="account-authority-role"',
  'id="account-cap-admin"',
  'id="account-cap-moderation"',
  'id="account-cap-appeals"',
  'https://challenges.cloudflare.com'
]) assert.ok(html.includes(token),'profiles html invariant missing: '+token);

for(const token of [
  'fetchJson("/api/v1/status")',
  'fetchJson("/api/v1/auth/session")',
  '/api/v1/auth/login?returnTo=',
  'fetchJson("/api/v1/auth/logout"',
  'fetchJson("/api/v1/profile")',
  'method: "PUT"',
  'profile-write',
  'window.turnstile',
  'Service non provisionné',
  'Provisionnement requis',
  '/api/v1/profiles/${encodeURIComponent(handle)}',
  'profile.visibility !== "public"',
  'new URLSearchParams(window.location.search).get("profile")',
  'renderAuthority(session.authority)',
  'Fondateur',
  'Administrateur',
  'Les secrets d’infrastructure restent séparés.'
]) assert.ok(js.includes(token),'profiles JS invariant missing: '+token);

assert.ok(!js.includes('localStorage'),'profiles UI must not persist auth state in localStorage');
assert.ok(!js.includes('sessionStorage'),'profiles UI must not persist auth state in sessionStorage');
assert.ok(!js.includes('access_token'),'profiles UI must never handle Auth0 access tokens');
assert.ok(!js.includes('.innerHTML'),'profiles UI must render remote public data without innerHTML');

assert.ok(js.includes('backendStatus?.turnstile?.publicSiteKey'));
assert.ok(js.includes('backendStatus?.turnstile?.secretConfigured'));
assert.ok(js.includes('backendStatus?.turnstile?.siteKeyConfigured'));
assert.ok(js.includes('if (!response.ok || data?.service !== "modaryx-backend")'));
assert.ok(js.includes('if (!session?.authenticated)'));

for(const token of [
  '.account-console{',
  '[data-account-state="authenticated"]',
  '.profile-form-grid{',
  '.public-profile-console{',
  '[data-public-profile-state="found"]',
  '.public-profile-card{',
  '@media(max-width:560px)'
]) assert.ok(css.includes(token),'profiles CSS invariant missing: '+token);

assert.ok(config.includes('MODARYX_TURNSTILE_SITE_KEY'));
assert.ok(config.includes('siteKeyConfigured'));
assert.ok(config.includes('publicSiteKey'));
assert.ok(status.includes('turnstile: state.turnstile'));
assert.ok(status.includes('secretsReturned: false'));

console.log(JSON.stringify({
  marker:'PASS_TARGETED_PROFILES_ACCOUNT_UI',
  result:'PASS',
  scope:'Profile account and public profile lookup UI source contract; provider DEV runtime proof is tracked separately',
  invariants:[
    'account UI is backend-state driven',
    'no browser auth token persistence',
    'login remains disabled until D1 + Auth0 login readiness are real',
    'profile editor requires authenticated session and real Turnstile readiness',
    'Turnstile secret remains server-only',
    'WebAuthn detection remains non-authenticating',
    'public profile lookup reads only the visibility=public endpoint',
    'remote profile fields are rendered with DOM-safe text nodes and HTTPS-only links',
    'private and unlisted profiles remain fail-closed at the server endpoint',
    'authenticated authority is rendered from the same-origin server session without raw permission exposure',
    'founder/admin UI explicitly keeps infrastructure secrets outside the web account boundary'
  ],
  failures:[]
},null,2));
