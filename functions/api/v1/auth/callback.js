import {requireAuthLoginFoundation} from '../../../_lib/backend-config.mjs';
import {exchangeAuth0AuthorizationCode} from '../../../_lib/auth0.mjs';
import {consumeAuthTransaction, createSession, sessionCookie} from '../../../_lib/auth-session.mjs';

function redirect(origin, path, extraHeaders={}) {
  const target = new URL(path, origin);
  return new Response(null, {
    status:302,
    headers:{
      location:target.href,
      'cache-control':'no-store',
      'referrer-policy':'no-referrer',
      'x-content-type-options':'nosniff',
      ...extraHeaders
    }
  });
}

export async function onRequestGet(context) {
  const foundation = requireAuthLoginFoundation(context.env || {});
  const requestUrl = new URL(context.request.url);
  if (!foundation.ok) return redirect(requestUrl.origin, '/profiles?auth=not-configured');

  if (requestUrl.searchParams.has('error')) {
    return redirect(requestUrl.origin, '/profiles?auth=provider-error');
  }

  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  if (!code || !state) return redirect(requestUrl.origin, '/profiles?auth=callback-invalid');

  const transaction = await consumeAuthTransaction(context.env.MODARYX_DB, state);
  if (!transaction) return redirect(requestUrl.origin, '/profiles?auth=state-invalid');

  const redirectUri = requestUrl.origin + '/api/v1/auth/callback';
  const exchange = await exchangeAuth0AuthorizationCode({
    env:context.env,
    code,
    codeVerifier:transaction.codeVerifier,
    redirectUri
  });
  if (!exchange.ok) return redirect(requestUrl.origin, '/profiles?auth=exchange-failed');

  const session = await createSession(context.env.MODARYX_DB, exchange.identity, context.env || {});
  return redirect(requestUrl.origin, transaction.returnTo, {
    'set-cookie':sessionCookie(session.token, session.ttl)
  });
}
