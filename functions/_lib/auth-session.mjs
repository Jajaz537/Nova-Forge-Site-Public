const SESSION_COOKIE = 'modaryx_session';
const AUTH_TRANSACTION_TTL_MS = 10 * 60 * 1000;

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const value of bytes) binary += String.fromCharCode(value);
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

function randomToken(bytes = 32) {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return bytesToBase64Url(value);
}

async function hashToken(value) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return bytesToBase64Url(digest);
}

export function safeReturnTo(value, fallback = '/profiles') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback;
  try {
    const url = new URL(value, 'https://modaryx.invalid');
    if (url.origin !== 'https://modaryx.invalid') return fallback;
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}

export async function createAuthTransaction(db, {returnTo='/profiles', nowMs=Date.now()} = {}) {
  const state = randomToken(32);
  const verifier = randomToken(64);
  const stateHash = await hashToken(state);
  const challenge = await hashToken(verifier);
  const createdAt = new Date(nowMs).toISOString();
  const expiresAt = new Date(nowMs + AUTH_TRANSACTION_TTL_MS).toISOString();
  const safeTarget = safeReturnTo(returnTo);

  await db.prepare('DELETE FROM modaryx_auth_transactions WHERE expires_at <= ?').bind(createdAt).run();
  await db.prepare(
    'INSERT INTO modaryx_auth_transactions (state_hash, code_verifier, return_to, created_at, expires_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(stateHash, verifier, safeTarget, createdAt, expiresAt).run();

  return {state, codeVerifier:verifier, codeChallenge:challenge, returnTo:safeTarget, expiresAt};
}

export async function consumeAuthTransaction(db, state, {nowMs=Date.now()} = {}) {
  if (typeof state !== 'string' || state.length < 20 || state.length > 512) return null;
  const stateHash = await hashToken(state);
  const row = await db.prepare(
    'SELECT state_hash, code_verifier, return_to, expires_at FROM modaryx_auth_transactions WHERE state_hash = ? LIMIT 1'
  ).bind(stateHash).first();

  if (!row) return null;
  await db.prepare('DELETE FROM modaryx_auth_transactions WHERE state_hash = ?').bind(stateHash).run();
  if (row.expires_at <= new Date(nowMs).toISOString()) return null;

  return {
    codeVerifier:row.code_verifier,
    returnTo:safeReturnTo(row.return_to),
    expiresAt:row.expires_at
  };
}

export function sessionTtlSeconds(env = {}) {
  const requested = Number(env.MODARYX_SESSION_TTL_SECONDS);
  if (!Number.isFinite(requested)) return 8 * 60 * 60;
  return Math.max(15 * 60, Math.min(7 * 24 * 60 * 60, Math.trunc(requested)));
}

export async function createSession(db, identity, env = {}, {nowMs=Date.now()} = {}) {
  const token = randomToken(32);
  const sessionHash = await hashToken(token);
  const ttl = sessionTtlSeconds(env);
  const createdAt = new Date(nowMs).toISOString();
  const expiresAt = new Date(nowMs + ttl * 1000).toISOString();

  await db.prepare('DELETE FROM modaryx_sessions WHERE expires_at <= ?').bind(createdAt).run();
  await db.prepare(
    'INSERT INTO modaryx_sessions (session_hash, identity_sub, scope_json, permissions_json, created_at, last_seen_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    sessionHash,
    identity.sub,
    JSON.stringify(Array.isArray(identity.scope) ? identity.scope : []),
    JSON.stringify(Array.isArray(identity.permissions) ? identity.permissions : []),
    createdAt,
    createdAt,
    expiresAt
  ).run();

  return {token, ttl, expiresAt};
}

function parseCookies(request) {
  const header = request?.headers?.get?.('cookie') || '';
  const values = new Map();
  for (const chunk of header.split(';')) {
    const index = chunk.indexOf('=');
    if (index <= 0) continue;
    const key = chunk.slice(0,index).trim();
    const value = chunk.slice(index + 1).trim();
    if (key) values.set(key,value);
  }
  return values;
}

export function sessionCookie(token, ttlSeconds) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${ttlSeconds}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export async function getSessionIdentity(request, db, {nowMs=Date.now()} = {}) {
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (!token || token.length < 20 || token.length > 512) return null;
  const sessionHash = await hashToken(token);
  const row = await db.prepare(
    'SELECT identity_sub, scope_json, permissions_json, expires_at FROM modaryx_sessions WHERE session_hash = ? LIMIT 1'
  ).bind(sessionHash).first();
  if (!row) return null;

  const now = new Date(nowMs).toISOString();
  if (row.expires_at <= now) {
    await db.prepare('DELETE FROM modaryx_sessions WHERE session_hash = ?').bind(sessionHash).run();
    return null;
  }

  let scope = [];
  let permissions = [];
  try { scope = JSON.parse(row.scope_json || '[]'); } catch {}
  try { permissions = JSON.parse(row.permissions_json || '[]'); } catch {}
  return {
    sub:row.identity_sub,
    scope:Array.isArray(scope) ? scope : [],
    permissions:Array.isArray(permissions) ? permissions : [],
    sessionHash
  };
}

export async function destroySession(request, db) {
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (!token || token.length < 20 || token.length > 512) return false;
  const sessionHash = await hashToken(token);
  await db.prepare('DELETE FROM modaryx_sessions WHERE session_hash = ?').bind(sessionHash).run();
  return true;
}
