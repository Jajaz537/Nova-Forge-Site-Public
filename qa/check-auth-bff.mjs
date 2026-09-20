import assert from 'node:assert/strict';
import fs from 'node:fs';
import {backendState, requireAuthLoginFoundation} from '../functions/_lib/backend-config.mjs';
import {buildAuth0AuthorizationUrl, exchangeAuth0AuthorizationCode} from '../functions/_lib/auth0.mjs';
import {
  clearSessionCookie,
  consumeAuthTransaction,
  createAuthTransaction,
  createSession,
  destroySession,
  getSessionIdentity,
  safeReturnTo,
  sessionCookie,
  sessionTtlSeconds
} from '../functions/_lib/auth-session.mjs';

class FakeStatement {
  constructor(db, sql) { this.db=db; this.sql=sql.replace(/\s+/g,' ').trim(); this.args=[]; }
  bind(...args) { this.args=args; return this; }
  async run() {
    const sql=this.sql;
    if (sql.startsWith('DELETE FROM modaryx_auth_transactions WHERE expires_at <=')) {
      const [cutoff]=this.args;
      for (const [key,row] of this.db.transactions) if (row.expires_at <= cutoff) this.db.transactions.delete(key);
      return {success:true};
    }
    if (sql.startsWith('INSERT INTO modaryx_auth_transactions')) {
      const [state_hash,code_verifier,return_to,created_at,expires_at]=this.args;
      this.db.transactions.set(state_hash,{state_hash,code_verifier,return_to,created_at,expires_at});
      return {success:true};
    }
    if (sql.startsWith('DELETE FROM modaryx_auth_transactions WHERE state_hash =')) {
      this.db.transactions.delete(this.args[0]);
      return {success:true};
    }
    if (sql.startsWith('DELETE FROM modaryx_sessions WHERE expires_at <=')) {
      const [cutoff]=this.args;
      for (const [key,row] of this.db.sessions) if (row.expires_at <= cutoff) this.db.sessions.delete(key);
      return {success:true};
    }
    if (sql.startsWith('INSERT INTO modaryx_sessions')) {
      const [session_hash,identity_sub,scope_json,permissions_json,created_at,last_seen_at,expires_at]=this.args;
      this.db.sessions.set(session_hash,{session_hash,identity_sub,scope_json,permissions_json,created_at,last_seen_at,expires_at});
      return {success:true};
    }
    if (sql.startsWith('DELETE FROM modaryx_sessions WHERE session_hash =')) {
      this.db.sessions.delete(this.args[0]);
      return {success:true};
    }
    throw new Error('Unhandled run SQL: '+sql);
  }
  async first() {
    const sql=this.sql;
    if (sql.startsWith('SELECT state_hash, code_verifier, return_to, expires_at FROM modaryx_auth_transactions')) {
      return this.db.transactions.get(this.args[0]) || null;
    }
    if (sql.startsWith('SELECT identity_sub, scope_json, permissions_json, expires_at FROM modaryx_sessions')) {
      return this.db.sessions.get(this.args[0]) || null;
    }
    throw new Error('Unhandled first SQL: '+sql);
  }
}
class FakeDb {
  constructor(){this.transactions=new Map();this.sessions=new Map();}
  prepare(sql){return new FakeStatement(this,sql);}
}

const checks=[];
const env={
  AUTH0_ISSUER_BASE_URL:'https://tenant.example/',
  AUTH0_AUDIENCE:'https://api.modaryx.example',
  AUTH0_CLIENT_ID:'client-public-id',
  AUTH0_CLIENT_SECRET:'server-secret'
};
const fakeDb=new FakeDb();

let state=backendState({...env,MODARYX_DB:fakeDb});
assert.equal(state.auth0.configured,true);
assert.equal(state.auth0.loginConfigured,true);
assert.equal(state.auth0.clientSecretConfigured,true);
assert.equal(requireAuthLoginFoundation({...env,MODARYX_DB:fakeDb}).ok,true);
assert.equal(requireAuthLoginFoundation({...env,AUTH0_CLIENT_SECRET:'',MODARYX_DB:fakeDb}).reason,'auth0-login-not-configured');
checks.push('Login readiness requires D1 + issuer/audience/client ID/client secret');

assert.equal(safeReturnTo('/profiles?tab=account'),'/profiles?tab=account');
assert.equal(safeReturnTo('//evil.example/path'),'/profiles');
assert.equal(safeReturnTo('https://evil.example/path'),'/profiles');

const tx=await createAuthTransaction(fakeDb,{returnTo:'/profiles?tab=account',nowMs:1_800_000_000_000});
assert.ok(tx.state.length >= 40);
assert.ok(tx.codeVerifier.length >= 43 && tx.codeVerifier.length <= 128);
assert.ok(tx.codeChallenge.length >= 40);
assert.equal(fakeDb.transactions.size,1);
assert.ok(!fakeDb.transactions.has(tx.state));
assert.equal(await consumeAuthTransaction(fakeDb,'not-the-real-state',{nowMs:1_800_000_100_000}),null);
const consumed=await consumeAuthTransaction(fakeDb,tx.state,{nowMs:1_800_000_100_000});
assert.equal(consumed.returnTo,'/profiles?tab=account');
assert.equal(consumed.codeVerifier,tx.codeVerifier);
assert.equal(fakeDb.transactions.size,0);
assert.equal(await consumeAuthTransaction(fakeDb,tx.state,{nowMs:1_800_000_100_000}),null);
checks.push('OAuth transaction state is hashed, bounded, internal-return-only and single-use');

assert.equal(sessionTtlSeconds({}),8*60*60);
assert.equal(sessionTtlSeconds({MODARYX_SESSION_TTL_SECONDS:'60'}),15*60);
assert.equal(sessionTtlSeconds({MODARYX_SESSION_TTL_SECONDS:String(30*24*60*60)}),7*24*60*60);

const created=await createSession(fakeDb,{
  sub:'auth0|user-123',
  scope:['openid','profile'],
  permissions:['profile:write']
},env,{nowMs:1_800_000_000_000});
assert.equal(fakeDb.sessions.size,1);
assert.ok(!fakeDb.sessions.has(created.token));
const cookie=sessionCookie(created.token,created.ttl);
assert.match(cookie,/^modaryx_session=/);
assert.match(cookie,/HttpOnly/);
assert.match(cookie,/Secure/);
assert.match(cookie,/SameSite=Lax/);
assert.match(clearSessionCookie(),/Max-Age=0/);

const request=new Request('https://preview.example/api/v1/auth/session',{headers:{cookie:cookie.split(';')[0]}});
let identity=await getSessionIdentity(request,fakeDb,{nowMs:1_800_000_100_000});
assert.equal(identity.sub,'auth0|user-123');
assert.deepEqual(identity.scope,['openid','profile']);
assert.deepEqual(identity.permissions,['profile:write']);
await destroySession(request,fakeDb);
identity=await getSessionIdentity(request,fakeDb,{nowMs:1_800_000_100_000});
assert.equal(identity,null);
checks.push('Session cookie is HttpOnly/Secure/Lax while D1 stores only a hash and bounded identity metadata');

const keyPair=await crypto.subtle.generateKey(
  {name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},
  true,
  ['sign','verify']
);
const jwk=await crypto.subtle.exportKey('jwk',keyPair.publicKey);
jwk.kid='bff-key';jwk.use='sig';jwk.alg='RS256';
const now=Math.floor(Date.now()/1000);
const enc=(v)=>Buffer.from(v).toString('base64url');
const head=enc(JSON.stringify({alg:'RS256',typ:'JWT',kid:'bff-key'}));
const pay=enc(JSON.stringify({iss:'https://tenant.example/',aud:'https://api.modaryx.example',sub:'auth0|bff-user',exp:now+600,iat:now,scope:'openid profile'}));
const input=head+'.'+pay;
const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',keyPair.privateKey,new TextEncoder().encode(input));
const accessToken=input+'.'+Buffer.from(sig).toString('base64url');

const authorize=buildAuth0AuthorizationUrl({
  env,
  redirectUri:'https://preview.example/api/v1/auth/callback',
  state:'state-123',
  codeChallenge:'challenge-123'
});
assert.equal(authorize.origin,'https://tenant.example');
assert.equal(authorize.pathname,'/authorize');
assert.equal(authorize.searchParams.get('response_type'),'code');
assert.equal(authorize.searchParams.get('client_id'),'client-public-id');
assert.equal(authorize.searchParams.get('code_challenge_method'),'S256');
assert.equal(authorize.searchParams.get('audience'),'https://api.modaryx.example');

const fetchImpl=async (url,options={})=>{
  const parsed=new URL(url);
  if(parsed.pathname==='/oauth/token'){
    assert.equal(options.method,'POST');
    assert.equal(options.body.get('client_id'),'client-public-id');
    assert.equal(options.body.get('client_secret'),'server-secret');
    assert.equal(options.body.get('code'),'authorization-code');
    assert.equal(options.body.get('code_verifier'),'verifier-value');
    return new Response(JSON.stringify({access_token:accessToken,token_type:'Bearer',expires_in:600}),{status:200,headers:{'content-type':'application/json'}});
  }
  if(parsed.pathname==='/.well-known/jwks.json'){
    return new Response(JSON.stringify({keys:[jwk]}),{status:200,headers:{'content-type':'application/json'}});
  }
  throw new Error('Unexpected fetch '+parsed.href);
};
const exchange=await exchangeAuth0AuthorizationCode({
  env,
  code:'authorization-code',
  codeVerifier:'verifier-value',
  redirectUri:'https://preview.example/api/v1/auth/callback',
  fetchImpl
});
assert.equal(exchange.ok,true);
assert.equal(exchange.identity.sub,'auth0|bff-user');
checks.push('Authorization Code + PKCE exchange stays server-side and verifies the returned Auth0 access token');

const migration=fs.readFileSync(new URL('../migrations/0002_modaryx_auth_sessions.sql',import.meta.url),'utf8');
for(const token of [
  'CREATE TABLE IF NOT EXISTS modaryx_auth_transactions',
  'state_hash TEXT PRIMARY KEY',
  'code_verifier TEXT NOT NULL',
  'CREATE TABLE IF NOT EXISTS modaryx_sessions',
  'session_hash TEXT PRIMARY KEY',
  'identity_sub TEXT NOT NULL',
  'expires_at TEXT NOT NULL'
]) assert.ok(migration.includes(token),'auth migration invariant missing: '+token);

const login=fs.readFileSync(new URL('../functions/api/v1/auth/login.js',import.meta.url),'utf8');
const callback=fs.readFileSync(new URL('../functions/api/v1/auth/callback.js',import.meta.url),'utf8');
const logout=fs.readFileSync(new URL('../functions/api/v1/auth/logout.js',import.meta.url),'utf8');
const remote=fs.readFileSync(new URL('../functions/_lib/remote-write.mjs',import.meta.url),'utf8');
const sessionSource=fs.readFileSync(new URL('../functions/_lib/auth-session.mjs',import.meta.url),'utf8');

assert.ok(login.includes("'/api/v1/auth/callback'"));
assert.ok(login.includes('codeChallenge:transaction.codeChallenge'));
assert.ok(callback.includes('consumeAuthTransaction'));
assert.ok(callback.includes('createSession'));
assert.ok(callback.includes("'set-cookie':sessionCookie"));
assert.ok(!callback.includes('access_token'));
assert.ok(!sessionSource.includes('access_token'));
assert.ok(logout.includes('requireSameOrigin'));
assert.ok(remote.includes('getSessionIdentity'));
assert.ok(remote.includes("authMethod:'session'"));
assert.ok(remote.includes("authMethod:'bearer'"));
checks.push('BFF routes keep provider tokens server-side, require same-origin logout and prefer HttpOnly sessions');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_AUTH_BFF_SESSION',
  result:'PASS',
  scope:'BFF auth/session code proof only; no real Auth0 tenant, client secret, D1 binding, login ceremony or passkey is claimed',
  checks,
  failures:[]
},null,2));
