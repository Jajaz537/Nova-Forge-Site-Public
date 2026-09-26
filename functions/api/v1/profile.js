import {json} from '../../_lib/api-security.mjs';
import {authenticateRead, authorizeWrite, profileIdForSub, validateProfilePayload} from '../../_lib/remote-write.mjs';

function publicShape(row) {
  return {
    schemaVersion:1,
    profileId:row.profile_id,
    handle:row.handle,
    displayName:row.display_name,
    bio:row.bio || '',
    visibility:row.visibility,
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

async function findByIdentity(db, sub) {
  return db.prepare(
    'SELECT profile_id, handle, display_name, bio, visibility, creator_is_creator, creator_display_label, links_json, collections_json, created_at, updated_at FROM modaryx_profiles WHERE identity_sub = ? LIMIT 1'
  ).bind(sub).first();
}

export async function onRequestGet(context) {
  const auth = await authenticateRead(context);
  if (!auth.ok) return json({error:auth.reason}, auth.status);
  const row = await findByIdentity(context.env.MODARYX_DB, auth.identity.sub);
  if (!row) return json({error:'profile-not-found'}, 404);
  return json(publicShape(row));
}

export async function onRequestPut(context) {
  const access = await authorizeWrite(context, {action:'profile-write', maxBytes:16_000});
  if (!access.ok) return json({error:access.reason}, access.status);

  const validated = validateProfilePayload(access.body);
  if (!validated.ok) return json({error:validated.reason}, 400);

  const db = context.env.MODARYX_DB;
  const now = new Date().toISOString();
  const profileId = await profileIdForSub(access.identity.identity.sub);
  const existing = await findByIdentity(db, access.identity.identity.sub);
  const createdAt = existing?.created_at || now;
  const profile = validated.value;

  try {
    await db.prepare(
      `INSERT INTO modaryx_profiles (
        profile_id, identity_sub, handle, display_name, bio, visibility,
        creator_is_creator, creator_display_label, links_json, collections_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(identity_sub) DO UPDATE SET
        handle = excluded.handle,
        display_name = excluded.display_name,
        bio = excluded.bio,
        visibility = excluded.visibility,
        creator_is_creator = excluded.creator_is_creator,
        creator_display_label = excluded.creator_display_label,
        links_json = excluded.links_json,
        updated_at = excluded.updated_at`
    ).bind(
      profileId,
      access.identity.identity.sub,
      profile.handle,
      profile.displayName,
      profile.bio,
      profile.visibility,
      profile.creator.isCreator ? 1 : 0,
      profile.creator.displayLabel || null,
      JSON.stringify(profile.links),
      existing?.collections_json || '[]',
      createdAt,
      now
    ).run();
  } catch {
    return json({error:'profile-write-conflict'}, 409);
  }

  const row = await findByIdentity(db, access.identity.identity.sub);
  return json(publicShape(row), existing ? 200 : 201);
}
