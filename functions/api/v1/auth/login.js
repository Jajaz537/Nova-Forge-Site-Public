import {requireAuthLoginFoundation} from '../../../_lib/backend-config.mjs';
import {buildAuth0AuthorizationUrl} from '../../../_lib/auth0.mjs';
import {createAuthTransaction, safeReturnTo} from '../../../_lib/auth-session.mjs';

function unavailable(reason, status=503) {
  return new Response(JSON.stringify({error:reason}), {
    status,
    headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}
  });
}

export async function onRequestGet(context) {
  const foundation = requireAuthLoginFoundation(context.env || {});
  if (!foundation.ok) return unavailable(foundation.reason, foundation.status);

  const requestUrl = new URL(context.request.url);
  const returnTo = safeReturnTo(requestUrl.searchParams.get('returnTo') || '/profiles');
  const transaction = await createAuthTransaction(context.env.MODARYX_DB, {returnTo});
  const redirectUri = requestUrl.origin + '/api/v1/auth/callback';
  const authorizeUrl = buildAuth0AuthorizationUrl({
    env:context.env,
    redirectUri,
    state:transaction.state,
    codeChallenge:transaction.codeChallenge
  });
  if (!authorizeUrl) return unavailable('auth0-login-not-configured');

  return new Response(null, {
    status:302,
    headers:{
      location:authorizeUrl.href,
      'cache-control':'no-store',
      'referrer-policy':'no-referrer',
      'x-content-type-options':'nosniff'
    }
  });
}
