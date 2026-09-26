import {json} from '../../../../_lib/api-security.mjs';
import {authenticateRead} from '../../../../_lib/remote-write.mjs';

function parsePayload(row) {
  if (!row?.payload_json) return null;
  try {
    const value = JSON.parse(row.payload_json);
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

export async function onRequestGet(context) {
  const access = await authenticateRead(context);
  if (!access.ok) return json({error:access.reason}, access.status);

  const id = String(context.params?.id || '').trim().toLowerCase();
  if (!/^submission-[a-z0-9-]{16,96}$/.test(id)) {
    return json({error:'submission-id-invalid'}, 400);
  }

  const row = await context.env.MODARYX_DB.prepare(
    `SELECT s.submission_id, s.kind, s.target_id, s.title, s.body, s.rating,
      s.parent_submission_id, s.abuse_state, s.moderation_state,
      s.publication_state, s.created_at, s.updated_at
     FROM modaryx_community_submissions s
     JOIN modaryx_profiles p ON p.profile_id = s.actor_profile_id
     WHERE s.submission_id = ? AND p.identity_sub = ?
     LIMIT 1`
  ).bind(id, access.identity.sub).first();

  if (!row) return json({error:'submission-not-found'}, 404);

  const receipts = await context.env.MODARYX_DB.prepare(
    `SELECT receipt_id, receipt_type, payload_json, created_at
     FROM modaryx_moderation_receipts
     WHERE submission_id = ?
     ORDER BY created_at ASC`
  ).bind(id).all();

  const parsed = (receipts?.results || [])
    .map((receipt) => parsePayload(receipt))
    .filter(Boolean);

  const decision = [...parsed].reverse().find((receipt) => receipt.receiptType === 'decision') || null;
  const appeal = decision
    ? [...parsed].reverse().find((receipt) =>
        receipt.receiptType === 'appeal' &&
        receipt.appeal?.decisionReceiptId === decision.receiptId
      ) || null
    : null;
  const outcome = appeal
    ? [...parsed].reverse().find((receipt) =>
        receipt.receiptType === 'appeal-outcome' &&
        receipt.outcome?.appealReceiptId === appeal.receiptId
      ) || null
    : null;

  return json({
    schemaVersion:1,
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
    createdAt:row.created_at,
    updatedAt:row.updated_at,
    decision,
    appeal,
    outcome,
    appealAvailable:Boolean(
      decision &&
      ['remove','visibility-limit'].includes(decision.decision?.action) &&
      !appeal
    )
  });
}
