import assert from 'node:assert/strict';
import {backendState, normalizeIssuer, requireRemoteWriteFoundation} from '../functions/_lib/backend-config.mjs';
import {bearerToken, verifyAuth0AccessToken} from '../functions/_lib/auth0.mjs';
import {verifyTurnstile} from '../functions/_lib/turnstile.mjs';
import fs from 'node:fs';

const b64url = (value) => Buffer.from(value).toString('base64url');

const checks = [];

assert.equal(normalizeIssuer('http://tenant.example/'), null);
assert.equal(normalizeIssuer('https://tenant.example/path?x=1'), null);
assert.equal(normalizeIssuer('https://tenant.example'), 'https://tenant.example/');
checks.push('Auth0 issuer accepts HTTPS only and canonicalizes trailing slash');

const empty = backendState({});
assert.equal(empty.bindings.d1, false);
assert.equal(empty.bindings.r2, false);
assert.equal(empty.auth0.configured, false);
assert.equal(empty.turnstile.secretConfigured, false);
assert.equal(empty.remoteWritesReady, false);
assert.equal(requireRemoteWriteFoundation({}).reason, 'd1-binding-missing');
checks.push('Missing provider configuration is fail-closed');

const fakeDb = {prepare() {}};
const fakeR2 = {get() {}};
let guard = requireRemoteWriteFoundation({MODARYX_DB: fakeDb});
assert.equal(guard.reason, 'auth0-not-configured');
guard = requireRemoteWriteFoundation({
  MODARYX_DB: fakeDb,
  AUTH0_ISSUER_BASE_URL: 'https://tenant.example/',
  AUTH0_AUDIENCE: 'https://api.modaryx.example'
});
assert.equal(guard.reason, 'turnstile-secret-missing');
guard = requireRemoteWriteFoundation({
  MODARYX_DB: fakeDb,
  MODARYX_ARTIFACTS: fakeR2,
  AUTH0_ISSUER_BASE_URL: 'https://tenant.example/',
  AUTH0_AUDIENCE: 'https://api.modaryx.example',
  MODARYX_TURNSTILE_SECRET: 'test-secret'
});
assert.equal(guard.ok, true);
assert.equal(guard.state.bindings.r2, true);
checks.push('Remote-write readiness requires D1 + Auth0 issuer/audience + Turnstile secret');

assert.equal(bearerToken(new Request('https://example.test/', {headers:{authorization:'Bearer abc.def.ghi'}})), 'abc.def.ghi');
assert.equal(bearerToken(new Request('https://example.test/', {headers:{authorization:'Basic nope'}})), null);
checks.push('Bearer parser accepts only explicit Bearer authorization');

const keyPair = await crypto.subtle.generateKey(
  {name:'RSASSA-PKCS1-v1_5', modulusLength:2048, publicExponent:new Uint8Array([1,0,1]), hash:'SHA-256'},
  true,
  ['sign','verify']
);
const jwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
jwk.kid = 'dev-key';
jwk.use = 'sig';
jwk.alg = 'RS256';

const now = 1_800_000_000;
const header = b64url(JSON.stringify({alg:'RS256',typ:'JWT',kid:'dev-key'}));
const payloadObject = {
  iss:'https://tenant.example/',
  aud:'https://api.modaryx.example',
  sub:'auth0|user-123',
  exp:now + 600,
  iat:now - 5,
  scope:'openid profile'
};
const payload = b64url(JSON.stringify(payloadObject));
const signingInput = header + '.' + payload;
const signature = await crypto.subtle.sign(
  'RSASSA-PKCS1-v1_5',
  keyPair.privateKey,
  new TextEncoder().encode(signingInput)
);
const token = signingInput + '.' + Buffer.from(signature).toString('base64url');
const jwksFetch = async () => new Response(JSON.stringify({keys:[jwk]}), {
  status:200,
  headers:{'content-type':'application/json'}
});

let auth = await verifyAuth0AccessToken({
  token,
  env:{
    AUTH0_ISSUER_BASE_URL:'https://tenant.example/',
    AUTH0_AUDIENCE:'https://api.modaryx.example'
  },
  fetchImpl:jwksFetch,
  nowSeconds:now
});
assert.equal(auth.ok, true);
assert.equal(auth.identity.sub, 'auth0|user-123');
assert.deepEqual(auth.identity.scope, ['openid','profile']);

auth = await verifyAuth0AccessToken({
  token,
  env:{
    AUTH0_ISSUER_BASE_URL:'https://tenant.example/',
    AUTH0_AUDIENCE:'https://wrong.example'
  },
  fetchImpl:jwksFetch,
  nowSeconds:now
});
assert.equal(auth.ok, false);
assert.equal(auth.reason, 'jwt-audience-invalid');
checks.push('RS256 Auth0 JWT proof validates signature, issuer, audience, expiry and subject');

let turnstile = await verifyTurnstile({token:'x',env:{}});
assert.equal(turnstile.reason, 'turnstile-not-configured');

const turnstileFetch = async (_url, options) => {
  assert.equal(options.method, 'POST');
  assert.equal(options.body.get('secret'), 'test-secret');
  assert.equal(options.body.get('response'), 'valid-token');
  return new Response(JSON.stringify({
    success:true,
    hostname:'preview.modaryx.example',
    action:'community-write'
  }), {status:200,headers:{'content-type':'application/json'}});
};
turnstile = await verifyTurnstile({
  token:'valid-token',
  env:{MODARYX_TURNSTILE_SECRET:'test-secret'},
  expectedHostname:'preview.modaryx.example',
  expectedAction:'community-write',
  fetchImpl:turnstileFetch
});
assert.equal(turnstile.ok, true);

turnstile = await verifyTurnstile({
  token:'valid-token',
  env:{MODARYX_TURNSTILE_SECRET:'test-secret'},
  expectedHostname:'wrong.example',
  fetchImpl:turnstileFetch
});
assert.equal(turnstile.reason, 'turnstile-hostname-mismatch');
checks.push('Turnstile is server-validated and hostname/action can be pinned');

const migration = fs.readFileSync(new URL('../migrations/0001_modaryx_dev_foundation.sql', import.meta.url), 'utf8');
for (const tokenText of [
  'PRAGMA foreign_keys = ON',
  'CREATE TABLE IF NOT EXISTS modaryx_profiles',
  'identity_sub TEXT NOT NULL UNIQUE',
  "CHECK (visibility IN ('public', 'unlisted', 'private'))",
  'CREATE TABLE IF NOT EXISTS modaryx_community_submissions',
  "CHECK (abuse_state IN ('pending', 'passed', 'blocked'))",
  "CHECK (moderation_state IN ('pending', 'accepted', 'rejected', 'held-for-review'))",
  'FOREIGN KEY (actor_profile_id) REFERENCES modaryx_profiles(profile_id)'
]) assert.ok(migration.includes(tokenText), 'migration invariant missing: ' + tokenText);
checks.push('D1 migration defines bounded profile/community states with FK and indexes');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_BACKEND_DEV_FOUNDATION',
  result:'PASS',
  scope:'DEV backend foundation only; no Auth0 tenant, Cloudflare resource, secret, binding, remote write or production deployment is claimed',
  checks,
  failures:[]
}, null, 2));
