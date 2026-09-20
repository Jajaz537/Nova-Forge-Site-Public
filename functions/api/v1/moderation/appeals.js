import {json} from '../../../_lib/api-security.mjs';
import {authorizeAppealsReviewer} from '../../../_lib/moderation.mjs';

function limitOf(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(1, Math.min(50, Math.trunc(parsed)));
}

function parsePayload(value) {
  try {
    const parsed = JSON.parse(value || 'null');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export async function onRequestGet(context) {
  const access = await authorizeAppealsReviewer(context);
  if (!access.ok) return json({error:access.reason}, access.status);

  const url = new URL(context.request.url);
  const limit = limitOf(url.searchParams.get('limit'));

  const rows = await context.env.MODARYX_DB.prepare(
    `SELECT a.receipt_id, a.submission_id, a.payload_json, a.created_at,
      s.kind, s.target_id, s.title, s.body, s.rating, s.abuse_state,
      s.moderation_state, s.publication_state
     FROM modaryx_moderation_receipts a
     JOIN modaryx_community_submissions s ON s.submission_id = a.submission_id
     LEFT JOIN modaryx_moderation_receipts o
       ON o.receipt_type = 'appeal-outcome'
      AND o.previous_receipt_id = a.receipt_id
     WHERE a.receipt_type = 'appeal'
       AND o.receipt_id IS NULL
     ORDER BY a.created_at ASC
     LIMIT ?`
  ).bind(limit).all();

  const items = [];
  for (const row of rows?.results || []) {
    const appeal = parsePayload(row.payload_json);
    if (!appeal || appeal.receiptType !== 'appeal') continue;
    items.push({
      appeal,
      submission:{
        id:row.submission_id,
        kind:row.kind,
        targetId:row.target_id,
        title:row.title,
        body:row.body,
        rating:row.rating,
        abuseState:row.abuse_state,
        moderationState:row.moderation_state,
        publicationState:row.publication_state
      }
    });
  }

  return json({schemaVersion:1, items, count:items.length});
}
