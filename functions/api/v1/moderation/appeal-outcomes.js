import {json} from '../../../_lib/api-security.mjs';
import {
  appealOutcomeTransition,
  auditActorKey,
  authorizeAppealsReviewer,
  buildAppealOutcomeReceipt,
  validateAppealOutcome
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
  const access = await authorizeAppealsReviewer(context, {
    requireRecentAuthentication:true,
    readBody:true,
    maxBytes:12_000
  });
  if (!access.ok) return json({error:access.reason}, access.status);

  const validated = validateAppealOutcome(access.body);
  if (!validated.ok) return json({error:validated.reason}, 400);

  const db = context.env.MODARYX_DB;
  const appealRow = await db.prepare(
    `SELECT receipt_id, submission_id, category, payload_json, created_at
     FROM modaryx_moderation_receipts
     WHERE receipt_id = ? AND receipt_type = 'appeal'
     LIMIT 1`
  ).bind(validated.value.appealReceiptId).first();

  const appealReceipt = parseReceipt(appealRow);
  if (!appealReceipt) return json({error:'appeal-not-found'}, 404);

  const existingOutcome = await db.prepare(
    `SELECT receipt_id
     FROM modaryx_moderation_receipts
     WHERE receipt_type = 'appeal-outcome'
       AND previous_receipt_id = ?
     LIMIT 1`
  ).bind(appealReceipt.receiptId).first();
  if (existingOutcome) return json({error:'appeal-already-decided'}, 409);

  const submission = await db.prepare(
    `SELECT submission_id, kind, abuse_state, moderation_state,
      publication_state, created_at, updated_at
     FROM modaryx_community_submissions
     WHERE submission_id = ?
     LIMIT 1`
  ).bind(appealRow.submission_id).first();
  if (!submission) return json({error:'submission-not-found'}, 404);

  const transition = appealOutcomeTransition(submission, validated.value.result);
  if (!transition.ok) return json({error:transition.reason}, 409);

  const now = new Date().toISOString();
  const receiptId = 'moderation:' + crypto.randomUUID();
  const receipt = buildAppealOutcomeReceipt({
    receiptId,
    submission,
    appealReceipt,
    result:validated.value.result,
    reason:validated.value.reason,
    now
  });
  const actorKey = await auditActorKey(access.identity.sub, 'appeals-reviewer');

  try {
    const statements = [
      db.prepare(
        `INSERT INTO modaryx_moderation_receipts (
          receipt_id, submission_id, receipt_type, category, payload_json,
          actor_key, recorded_by, previous_receipt_id, created_at
        ) VALUES (?, ?, 'appeal-outcome', ?, ?, ?, 'appeals-reviewer', ?, ?)`
      ).bind(
        receiptId,
        submission.submission_id,
        appealRow.category,
        JSON.stringify(receipt),
        actorKey,
        appealReceipt.receiptId,
        now
      )
    ];

    if (
      submission.moderation_state !== transition.moderationState ||
      submission.publication_state !== transition.publicationState
    ) {
      statements.push(
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
      );
    }

    await db.batch(statements);
  } catch {
    return json({error:'appeal-outcome-write-failed'}, 409);
  }

  return json({
    schemaVersion:1,
    submissionId:submission.submission_id,
    appealReceiptId:appealReceipt.receiptId,
    outcomeReceiptId:receiptId,
    result:validated.value.result,
    moderationState:transition.moderationState,
    publicationState:transition.publicationState,
    distributable:transition.distributable,
    decidedAt:now
  });
}
