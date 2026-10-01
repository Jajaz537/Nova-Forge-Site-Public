import {json} from '../../../_lib/api-security.mjs';
import {
  auditActorKey,
  authorizeCommunityMemberWrite,
  buildAppealReceipt,
  validateAppealRequest
} from '../../../_lib/moderation.mjs';

function parseReceipt(row) {
  try {
    const value = JSON.parse(row?.payload_json || 'null');
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

export async function onRequestPost(context) {
  const access = await authorizeCommunityMemberWrite(context, {maxBytes:12_000});
  if (!access.ok) return json({error:access.reason}, access.status);

  const validated = validateAppealRequest(access.body);
  if (!validated.ok) return json({error:validated.reason}, 400);

  const db = context.env.MODARYX_DB;
  const submission = await db.prepare(
    `SELECT s.submission_id, s.actor_profile_id, s.kind, s.abuse_state,
      s.moderation_state, s.publication_state, s.created_at, s.updated_at
     FROM modaryx_community_submissions s
     JOIN modaryx_profiles p ON p.profile_id = s.actor_profile_id
     WHERE s.submission_id = ? AND p.identity_sub = ?
     LIMIT 1`
  ).bind(validated.value.submissionId, access.identity.sub).first();

  if (!submission) return json({error:'submission-not-found'}, 404);

  const decisionRow = await db.prepare(
    `SELECT receipt_id, category, payload_json, created_at
     FROM modaryx_moderation_receipts
     WHERE submission_id = ? AND receipt_type = 'decision'
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(submission.submission_id).first();

  const decisionReceipt = parseReceipt(decisionRow);
  if (!decisionReceipt) return json({error:'moderation-decision-required'}, 409);
  if (!['remove','visibility-limit'].includes(decisionReceipt.decision?.action)) {
    return json({error:'decision-not-appealable'}, 409);
  }

  const existing = await db.prepare(
    `SELECT receipt_id
     FROM modaryx_moderation_receipts
     WHERE submission_id = ?
       AND receipt_type = 'appeal'
       AND previous_receipt_id = ?
     LIMIT 1`
  ).bind(submission.submission_id, decisionReceipt.receiptId).first();
  if (existing) return json({error:'appeal-already-submitted'}, 409);

  const now = new Date().toISOString();
  const receiptId = 'moderation:' + crypto.randomUUID();
  const receipt = buildAppealReceipt({
    receiptId,
    submission,
    decisionReceipt,
    grounds:validated.value.grounds,
    now
  });
  const actorKey = await auditActorKey(access.identity.sub, 'appellant');

  try {
    await db.prepare(
      `INSERT INTO modaryx_moderation_receipts (
        receipt_id, submission_id, receipt_type, category, payload_json,
        actor_key, recorded_by, previous_receipt_id, created_at
      ) VALUES (?, ?, 'appeal', ?, ?, ?, 'system', ?, ?)`
    ).bind(
      receiptId,
      submission.submission_id,
      decisionReceipt.category,
      JSON.stringify(receipt),
      actorKey,
      decisionReceipt.receiptId,
      now
    ).run();
  } catch {
    return json({error:'appeal-write-failed'}, 409);
  }

  return json({
    schemaVersion:1,
    submissionId:submission.submission_id,
    appealReceiptId:receiptId,
    state:'submitted',
    submittedAt:now
  }, 201);
}
