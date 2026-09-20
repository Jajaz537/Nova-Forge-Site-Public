import {json} from '../../../_lib/api-security.mjs';

const HANDLE_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/;

function publicShape(row) {
  return {
    schemaVersion:1,
    profileId:row.profile_id,
    handle:row.handle,
    displayName:row.display_name,
    bio:row.bio || '',
    visibility:'public',
    creator:{
      isCreator:Boolean(row.creator_is_creator),
      ...(row.creator_display_label ? {displayLabel:row.creator_display_label} : {})
    },
    links:JSON.parse(row.links_json || '[]'),
    collections:JSON.parse(row.collections_json || '[]'),
    createdAt:row.created_at,
    updatedAt:row.updated_at
  };
}

export async function onRequestGet(context) {
  if (!context.env?.MODARYX_DB || typeof context.env.MODARYX_DB.prepare !== 'function') {
    return json({error:'d1-binding-missing'}, 503);
  }
  const handle = String(context.params?.handle || '').trim().toLowerCase();
  if (!HANDLE_RE.test(handle)) return json({error:'handle-invalid'}, 400);

  const row = await context.env.MODARYX_DB.prepare(
    `SELECT profile_id, handle, display_name, bio, creator_is_creator,
      creator_display_label, links_json, collections_json, created_at, updated_at
     FROM modaryx_profiles
     WHERE handle = ? AND visibility = 'public'
     LIMIT 1`
  ).bind(handle).first();

  if (!row) return json({error:'profile-not-found'}, 404);
  return json(publicShape(row), 200, {'cache-control':'public, max-age=60, stale-while-revalidate=300'});
}
