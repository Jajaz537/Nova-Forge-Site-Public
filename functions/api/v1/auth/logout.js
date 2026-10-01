import {json, requireSameOrigin} from '../../../_lib/api-security.mjs';
import {clearSessionCookie, destroySession} from '../../../_lib/auth-session.mjs';

export async function onRequestPost(context) {
  const origin = requireSameOrigin(context.request);
  if (!origin.ok) return json({error:origin.reason},origin.status);

  const db = context.env?.MODARYX_DB;
  if (!db || typeof db.prepare !== 'function') return json({error:'d1-binding-missing'},503);
  await destroySession(context.request, db);
  return json({ok:true},200,{'set-cookie':clearSessionCookie()});
}
