'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const security=JSON.parse(fs.readFileSync(path.join(root,'schemas/account-security.schema.json'),'utf8'));
const profiles=fs.readFileSync(path.join(root,'assets/profiles.js'),'utf8');
const profilesHtml=fs.readFileSync(path.join(root,'profiles.html'),'utf8');
const login=fs.readFileSync(path.join(root,'functions/api/v1/auth/login.js'),'utf8');
const auth0=fs.readFileSync(path.join(root,'functions/_lib/auth0.mjs'),'utf8');
const authBff=fs.readFileSync(path.join(root,'qa/MODARYX-AUTH-BFF-SESSION-20260920.md'),'utf8');
const checkpoint=fs.readFileSync(path.join(root,'CHECKPOINT-CANONIQUE-MODARYX-2026-09-20.md'),'utf8');
const doc=fs.readFileSync(path.join(root,'qa/MODARYX-PASSKEY-PROVIDER-READINESS-20260921.md'),'utf8');

assert.match(security.description,/never contains or requests a private key/i);
assert.equal(security.$defs.credential.properties.kind.const,'passkey');
assert.deepEqual(security.$defs.credential.properties.state.enum,['active','revoked']);
assert.deepEqual(security.$defs.recovery.properties.state.enum,['not-configured','configured','suspended']);
for(const action of ['change-credentials','change-recovery','revoke-session']) {
  assert.ok(security.$defs.privilegedAction.properties.action.enum.includes(action),action);
}
assert.equal(security.$defs.privilegedAction.properties.reauthenticationRequired.const,true);

assert.match(profiles,/PublicKeyCredential/);
assert.match(profiles,/ne prouve l’existence d’aucune passkey/i);
assert.match(profiles,/Aucun flux de connexion n’est lancé par cette détection/i);
assert.match(profiles,/\/api\/v1\/auth\/login\?returnTo=/);
assert.match(profilesHtml,/Connexion Universal Login/);
assert.match(profilesHtml,/détection WebAuthn/i);

assert.match(login,/buildAuth0AuthorizationUrl/);
assert.match(login,/codeChallenge/);
assert.match(auth0,/\/authorize/);
assert.match(authBff,/Authorization Code \+ PKCE/);
assert.match(authBff,/access token/i);
assert.match(checkpoint,/TERMINÉ — Provider DEV réel et micro-proofs bout-en-bout ciblés/);

for(const token of [
  'New Universal Login',
  'Identifier First',
  'database connection',
  'cérémonie',
  'récupération',
  'révoquée'
]) assert.ok(doc.includes(token),'passkey readiness doc missing: '+token);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_PASSKEY_PROVIDER_READINESS',
  result:'PASS',
  scope:'Source/provider readiness only; no real passkey ceremony, recovery or revocation is claimed',
  invariants:[
    'Auth0 Universal Login remains the passkey ceremony boundary',
    'no private key is requested or stored by MODARYX',
    'local WebAuthn detection never claims account or passkey existence',
    'credential/recovery/session changes require privileged reauthentication',
    'real device/provider ceremony remains mandatory before final closure'
  ],
  failures:[]
},null,2));
