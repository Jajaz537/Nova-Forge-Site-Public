import {json} from '../../../_lib/api-security.mjs';
import {moderationDecisionNotification, recordInAppNotification} from '../../../_lib/notifications.mjs';
import {
  authorizeModerator,
  buildModerationDecisionReceipt,
  moderationActorKey,
  moderationTransition,
  validateModerationDecision
} from '../../../_lib/moderation.mjs';

function publicResult(row, receipt) {
  const published = row.moderation_state === 'accepted' && row.publication_state === 'published';
  return {
    schemaVersion:1,
    id:row.submission_id,
    moderationState:row.moderation_state,
    publicationState:row.publication_state,
    distributable:published,
    moderationReceiptId:receipt.receiptId,
    decidedAt:receipt.createdAt
  };
}

export async function onRequestPost(context) {
  const access = await authorizeModerator(context, {
    requireRecentAuthentication:true,
    readBody:true,
    maxBytes:16_000
  });
  if (!access.ok) return json({error:access.reason}, access.status);

  const validated = validateModerationDecision(access.body);
  if (!validated.ok) return json({error:validated.reason}, 400);

  const db = context.env.MODARYX_DB;
  const submission = await db.prepare(
    `SELECT s.submission_id, s.actor_profile_id, s.kind, s.target_id, s.abuse_state,
      s.moderation_state, s.publication_state, s.created_at, s.updated_at,
      p.identity_sub AS actor_identity_sub
     FROM modaryx_community_submissions s
     LEFT JOIN modaryx_profiles p ON p.profile_id = s.actor_profile_id
     WHERE s.submission_id = ?
     LIMIT 1`
  ).bind(validated.value.submissionId).first();

  if (!submission) return json({error:'submission-not-found'}, 404);

  const transition = moderationTransition(submission, validated.value.outcome);
  if (!transition.ok) return json({error:transition.reason}, 409);

  if (
    submission.moderation_state === transition.moderationState &&
    submission.publication_state === transition.publicationState
  ) {
    return json({error:'moderation-state-unchanged'}, 409);
  }

  const previous = await db.prepare(
    `SELECT receipt_id
     FROM modaryx_moderation_receipts
     WHERE submission_id = ?
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(submission.submission_id).first();

  const now = new Date().toISOString();
  const receiptId = 'moderation:' + crypto.randomUUID();
  const receipt = buildModerationDecisionReceipt({
    receiptId,
    submission,
    decision:validated.value,
    transition,
    previousReceiptId:previous?.receipt_id || null,
    now
  });
  const actorKey = await moderationActorKey(access.identity.sub);

  try {
    await db.batch([
      db.prepare(
        `INSERT INTO modaryx_moderation_receipts (
          receipt_id, submission_id, receipt_type, category, payload_json,
          actor_key, recorded_by, previous_receipt_id, created_at
        ) VALUES (?, ?, 'decision', ?, ?, ?, 'moderator', ?, ?)`
      ).bind(
        receiptId,
        submission.submission_id,
        validated.value.category,
        JSON.stringify(receipt),
        actorKey,
        previous?.receipt_id || null,
        now
      ),
      db.prepare(
        `UPDATE modaryx_community_submissions
         SET moderation_state = ?, publication_state = ?, updated_at = ?
         WHERE submission_id = ?`
      ).bind(
        transition.moderationState,
        transition.publicationState,
        now,
        submission.submission_id
      )
    ]);
  } catch {
    return json({error:'moderation-write-failed'}, 409);
  }

  const notification=moderationDecisionNotification({
    recipientIdentitySub:submission.actor_identity_sub,
    submissionId:submission.submission_id,
    outcome:validated.value.outcome,
    moderationState:transition.moderationState,
    receiptId,
    occurredAt:now
  });
  if(notification) await recordInAppNotification(context.env,notification);

  const updated = {
    ...submission,
    moderation_state:transition.moderationState,
    publication_state:transition.publicationState,
    updated_at:now
  };
  return json(publicResult(updated, receipt));
}
