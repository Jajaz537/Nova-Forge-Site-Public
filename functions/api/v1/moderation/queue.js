import {json} from '../../../_lib/api-security.mjs';
import {authorizeModerator} from '../../../_lib/moderation.mjs';

const STATES = new Set(['pending','held-for-review','accepted','rejected','all']);

function limitOf(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(1, Math.min(50, Math.trunc(parsed)));
}

function item(row) {
  const publicAuthor = row.profile_visibility === 'public'
    ? {
        profileId:row.actor_profile_id,
        handle:row.profile_handle,
        displayName:row.profile_display_name
      }
    : null;
  return {
    id:row.submission_id,
    kind:row.kind,
    targetId:row.target_id,
    title:row.title,
    body:row.body,
    rating:row.rating,
    parentSubmissionId:row.parent_submission_id,
    abuseState:row.abuse_state,
    moderationState:row.moderation_state,
    publicationState:row.publication_state,
    author:publicAuthor,
    createdAt:row.created_at,
    updatedAt:row.updated_at
  };
}

export async function onRequestGet(context) {
  const access = await authorizeModerator(context);
  if (!access.ok) return json({error:access.reason}, access.status);

  const url = new URL(context.request.url);
  const requested = (url.searchParams.get('state') || 'pending').trim();
  if (!STATES.has(requested)) return json({error:'moderation-state-invalid'}, 400);
  const limit = limitOf(url.searchParams.get('limit'));

  let where;
  if (requested === 'all') {
    where = "s.moderation_state IN ('pending','held-for-review','accepted','rejected')";
  } else if (requested === 'pending') {
    where = "s.moderation_state IN ('pending','held-for-review')";
  } else {
    where = 's.moderation_state = ?';
  }

  const sql = `SELECT
      s.submission_id, s.actor_profile_id, s.kind, s.target_id, s.title, s.body,
      s.rating, s.parent_submission_id, s.abuse_state, s.moderation_state,
      s.publication_state, s.created_at, s.updated_at,
      p.handle AS profile_handle, p.display_name AS profile_display_name,
      p.visibility AS profile_visibility
    FROM modaryx_community_submissions s
    JOIN modaryx_profiles p ON p.profile_id = s.actor_profile_id
    WHERE ${where}
    ORDER BY s.created_at ASC
    LIMIT ?`;

  const statement = context.env.MODARYX_DB.prepare(sql);
  const rows = requested === 'all' || requested === 'pending'
    ? await statement.bind(limit).all()
    : await statement.bind(requested, limit).all();

  return json({
    schemaVersion:1,
    state:requested,
    items:(rows?.results || []).map(item),
    count:(rows?.results || []).length
  });
}
