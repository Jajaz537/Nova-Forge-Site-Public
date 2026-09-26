export function normalizeIssuer(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return null;
    url.pathname = url.pathname.replace(/\/+$/, '') + '/';
    return url.href;
  } catch {
    return null;
  }
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function backendState(env = {}) {
  const issuer = normalizeIssuer(env.AUTH0_ISSUER_BASE_URL);
  const audience = nonEmpty(env.AUTH0_AUDIENCE);
  const clientId = nonEmpty(env.AUTH0_CLIENT_ID);
  const clientSecret = nonEmpty(env.AUTH0_CLIENT_SECRET);
  const turnstileSecret = Boolean(nonEmpty(env.MODARYX_TURNSTILE_SECRET));
  const turnstileSiteKey = nonEmpty(env.MODARYX_TURNSTILE_SITE_KEY);

  return {
    schemaVersion: 1,
    stage: 'dev-foundation',
    bindings: {
      d1: Boolean(env.MODARYX_DB && typeof env.MODARYX_DB.prepare === 'function'),
      r2: Boolean(env.MODARYX_ARTIFACTS && typeof env.MODARYX_ARTIFACTS.get === 'function')
    },
    auth0: {
      configured: Boolean(issuer && audience),
      loginConfigured: Boolean(issuer && audience && clientId && clientSecret),
      issuerConfigured: Boolean(issuer),
      audienceConfigured: Boolean(audience),
      clientIdConfigured: Boolean(clientId),
      clientSecretConfigured: Boolean(clientSecret)
    },
    turnstile: {
      secretConfigured: turnstileSecret,
      siteKeyConfigured: Boolean(turnstileSiteKey),
      publicSiteKey: turnstileSiteKey
    },
    remoteWritesReady: Boolean(env.MODARYX_DB && issuer && audience && turnstileSecret)
  };
}

export function requireRemoteWriteFoundation(env = {}) {
  const state = backendState(env);
  if (!state.bindings.d1) return {ok: false, status: 503, reason: 'd1-binding-missing', state};
  if (!state.auth0.configured) return {ok: false, status: 503, reason: 'auth0-not-configured', state};
  if (!state.turnstile.secretConfigured) return {ok: false, status: 503, reason: 'turnstile-secret-missing', state};
  return {ok: true, status: 200, reason: null, state};
}

export function requireAuthLoginFoundation(env = {}) {
  const state = backendState(env);
  if (!state.bindings.d1) return {ok:false, status:503, reason:'d1-binding-missing', state};
  if (!state.auth0.loginConfigured) return {ok:false, status:503, reason:'auth0-login-not-configured', state};
  return {ok:true, status:200, reason:null, state};
}
