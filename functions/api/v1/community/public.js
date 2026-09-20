import {json} from '../../../_lib/api-security.mjs';

const TARGET_RE = /^[a-z0-9][a-z0-9._-]{1,127}$/;

function limitOf(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(1, Math.min(50, Math.trunc(parsed)));
}

function publicItem(row) {
  return {
    schemaVersion:1,
    id:row.submission_id,
    kind:row.kind,
    targetId:row.target_id,
    title:row.title,
    body:row.body,
    rating:row.rating,
    parentSubmissionId:row.parent_submission_id,
    author:row.profile_visibility === 'public'
      ? {
          profileId:row.actor_profile_id,
          handle:row.profile_handle,
          displayName:row.profile_display_name
        }
      : null,
    moderationState:'accepted',
    publicationState:'published',
    publishedAt:row.updated_at
  };
}

export async function onRequestGet(context) {
  const db = context.env?.MODARYX_DB;
  if (!db || typeof db.prepare !== 'function') {
    return json({error:'d1-binding-missing'}, 503);
  }

  const url = new URL(context.request.url);
  const rawTarget = (url.searchParams.get('targetId') || '').trim().toLowerCase();
  if (rawTarget && !TARGET_RE.test(rawTarget)) {
    return json({error:'target-invalid'}, 400);
  }
  const limit = limitOf(url.searchParams.get('limit'));

  const base = `SELECT
      s.submission_id, s.actor_profile_id, s.kind, s.target_id, s.title, s.body,
      s.rating, s.parent_submission_id, s.updated_at,
      p.handle AS profile_handle, p.display_name AS profile_display_name,
      p.visibility AS profile_visibility
    FROM modaryx_community_submissions s
    JOIN modaryx_profiles p ON p.profile_id = s.actor_profile_id
    WHERE s.abuse_state = 'passed'
      AND s.moderation_state = 'accepted'
      AND s.publication_state = 'published'`;

  const statement = rawTarget
    ? db.prepare(base + ' AND s.target_id = ? ORDER BY s.updated_at DESC LIMIT ?').bind(rawTarget, limit)
    : db.prepare(base + ' ORDER BY s.updated_at DESC LIMIT ?').bind(limit);

  const rows = await statement.all();
  return json({
    schemaVersion:1,
    targetId:rawTarget || null,
    items:(rows?.results || []).map(publicItem),
    count:(rows?.results || []).length
  }, 200, {'cache-control':'public, max-age=30, stale-while-revalidate=120'});
}
