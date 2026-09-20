import {normalizeIssuer} from './backend-config.mjs';

const jwksCache = new Map();
const CACHE_MS = 5 * 60 * 1000;

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return bytes;
}

function decodeJson(value) {
  const bytes = decodeBase64Url(value);
  return JSON.parse(new TextDecoder().decode(bytes));
}

function audienceMatches(claim, expected) {
  if (typeof claim === 'string') return claim === expected;
  if (Array.isArray(claim)) return claim.includes(expected);
  return false;
}

async function fetchJwks(issuer, fetchImpl) {
  const cached = jwksCache.get(issuer);
  if (cached && cached.expiresAt > Date.now()) return cached.keys;

  const response = await fetchImpl(new URL('.well-known/jwks.json', issuer), {
    headers: {'accept': 'application/json'}
  });
  if (!response.ok) throw new Error('jwks-http-' + response.status);
  const body = await response.json();
  if (!body || !Array.isArray(body.keys)) throw new Error('jwks-invalid');
  jwksCache.set(issuer, {keys: body.keys, expiresAt: Date.now() + CACHE_MS});
  return body.keys;
}

export function bearerToken(request) {
  const header = request?.headers?.get?.('authorization') || '';
  const match = /^Bearer\s+([^\s]+)$/i.exec(header);
  return match ? match[1] : null;
}

export async function verifyAuth0AccessToken({
  token,
  env = {},
  fetchImpl = fetch,
  nowSeconds = Math.floor(Date.now() / 1000)
}) {
  const issuer = normalizeIssuer(env.AUTH0_ISSUER_BASE_URL);
  const audience = typeof env.AUTH0_AUDIENCE === 'string' ? env.AUTH0_AUDIENCE.trim() : '';
  if (!issuer || !audience) return {ok: false, status: 503, reason: 'auth0-not-configured'};
  if (typeof token !== 'string' || token.length < 20 || token.length > 8192) {
    return {ok: false, status: 401, reason: 'bearer-token-invalid'};
  }

  const parts = token.split('.');
  if (parts.length !== 3) return {ok: false, status: 401, reason: 'jwt-format-invalid'};

  let header;
  let payload;
  try {
    header = decodeJson(parts[0]);
    payload = decodeJson(parts[1]);
  } catch {
    return {ok: false, status: 401, reason: 'jwt-json-invalid'};
  }

  if (header?.alg !== 'RS256' || typeof header?.kid !== 'string' || !header.kid) {
    return {ok: false, status: 401, reason: 'jwt-header-invalid'};
  }

  let keys;
  try {
    keys = await fetchJwks(issuer, fetchImpl);
  } catch {
    return {ok: false, status: 503, reason: 'jwks-unavailable'};
  }

  const jwk = keys.find((key) => key?.kid === header.kid && key?.kty === 'RSA');
  if (!jwk) return {ok: false, status: 401, reason: 'jwt-key-not-found'};

  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
      false,
      ['verify']
    );
    const signature = decodeBase64Url(parts[2]);
    const data = new TextEncoder().encode(parts[0] + '.' + parts[1]);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
    if (!valid) return {ok: false, status: 401, reason: 'jwt-signature-invalid'};
  } catch {
    return {ok: false, status: 401, reason: 'jwt-verification-failed'};
  }

  if (payload?.iss !== issuer) return {ok: false, status: 401, reason: 'jwt-issuer-invalid'};
  if (!audienceMatches(payload?.aud, audience)) return {ok: false, status: 401, reason: 'jwt-audience-invalid'};
  if (!Number.isFinite(payload?.exp) || payload.exp <= nowSeconds) return {ok: false, status: 401, reason: 'jwt-expired'};
  if (Number.isFinite(payload?.nbf) && payload.nbf > nowSeconds + 60) return {ok: false, status: 401, reason: 'jwt-not-yet-valid'};
  if (typeof payload?.sub !== 'string' || !payload.sub) return {ok: false, status: 401, reason: 'jwt-subject-missing'};

  return {
    ok: true,
    status: 200,
    reason: null,
    identity: {
      sub: payload.sub,
      scope: typeof payload.scope === 'string' ? payload.scope.split(/\s+/).filter(Boolean) : [],
      permissions: Array.isArray(payload.permissions) ? payload.permissions.filter((item) => typeof item === 'string') : []
    },
    claims: payload
  };
}
