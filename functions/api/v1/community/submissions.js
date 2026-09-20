import {json} from '../../../_lib/api-security.mjs';
import {authorizeWrite, validateSubmissionPayload} from '../../../_lib/remote-write.mjs';

export async function onRequestPost(context) {
  const access = await authorizeWrite(context, {action:'community-write', maxBytes:20_000});
  if (!access.ok) return json({error:access.reason}, access.status);

  const validated = validateSubmissionPayload(access.body);
  if (!validated.ok) return json({error:validated.reason}, 400);

  const db = context.env.MODARYX_DB;
  const actor = await db.prepare(
    'SELECT profile_id FROM modaryx_profiles WHERE identity_sub = ? LIMIT 1'
  ).bind(access.identity.identity.sub).first();
  if (!actor) return json({error:'profile-required'}, 409);

  const submission = validated.value;
  const id = 'submission-' + crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await db.prepare(
      `INSERT INTO modaryx_community_submissions (
        submission_id, actor_profile_id, kind, target_id, title, body, rating,
        parent_submission_id, abuse_state, moderation_state, publication_state,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'passed', 'pending', 'received', ?, ?)`
    ).bind(
      id,
      actor.profile_id,
      submission.kind,
      submission.targetId,
      submission.title,
      submission.body,
      submission.rating,
      submission.parentSubmissionId,
      now,
      now
    ).run();
  } catch {
    return json({error:'submission-write-failed'}, 409);
  }

  return json({
    schemaVersion:1,
    id,
    actorProfileId:actor.profile_id,
    abuseState:'passed',
    moderationState:'pending',
    publicationState:'received',
    distributable:false,
    createdAt:now
  }, 202);
}
