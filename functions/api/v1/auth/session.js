import {json} from '../../../_lib/api-security.mjs';
import {getSessionIdentity} from '../../../_lib/auth-session.mjs';

export async function onRequestGet(context) {
  const db = context.env?.MODARYX_DB;
  if (!db || typeof db.prepare !== 'function') return json({error:'d1-binding-missing'},503);

  const identity = await getSessionIdentity(context.request, db);
  if (!identity) return json({authenticated:false});

  const profile = await db.prepare(
    'SELECT profile_id, handle, display_name, visibility, creator_is_creator FROM modaryx_profiles WHERE identity_sub = ? LIMIT 1'
  ).bind(identity.sub).first();

  return json({
    authenticated:true,
    profile:profile ? {
      profileId:profile.profile_id,
      handle:profile.handle,
      displayName:profile.display_name,
      visibility:profile.visibility,
      isCreator:Boolean(profile.creator_is_creator)
    } : null
  });
}
