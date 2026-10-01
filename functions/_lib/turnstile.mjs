export async function verifyTurnstile({
  token,
  env = {},
  remoteIp = null,
  expectedHostname = null,
  expectedAction = null,
  fetchImpl = fetch
}) {
  const secret = typeof env.MODARYX_TURNSTILE_SECRET === 'string'
    ? env.MODARYX_TURNSTILE_SECRET.trim()
    : '';
  if (!secret) return {ok: false, status: 503, reason: 'turnstile-not-configured'};
  if (typeof token !== 'string' || !token || token.length > 2048) {
    return {ok: false, status: 400, reason: 'turnstile-token-invalid'};
  }

  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (typeof remoteIp === 'string' && remoteIp) body.set('remoteip', remoteIp);

  let response;
  let result;
  try {
    response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body
    });
    if (!response.ok) return {ok: false, status: 503, reason: 'turnstile-http-' + response.status};
    result = await response.json();
  } catch {
    return {ok: false, status: 503, reason: 'turnstile-unavailable'};
  }

  if (!result?.success) {
    return {
      ok: false,
      status: 403,
      reason: 'turnstile-rejected',
      errorCodes: Array.isArray(result?.['error-codes']) ? result['error-codes'] : []
    };
  }
  if (expectedHostname && result.hostname !== expectedHostname) {
    return {ok: false, status: 403, reason: 'turnstile-hostname-mismatch'};
  }
  if (expectedAction && result.action !== expectedAction) {
    return {ok: false, status: 403, reason: 'turnstile-action-mismatch'};
  }

  return {ok: true, status: 200, reason: null};
}
