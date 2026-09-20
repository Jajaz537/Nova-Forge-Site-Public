import {readJson, requireSameOrigin} from './api-security.mjs';
import {getSessionIdentity} from './auth-session.mjs';

export const MODERATION_PERMISSION = 'community:moderate';
export const APPEALS_REVIEW_PERMISSION = 'community:appeals-review';

const OUTCOMES = new Set(['publish', 'hold', 'reject']);
const CATEGORIES = new Set([
  'illegal-content',
  'policy-violation',
  'spam-abuse',
  'intellectual-property'
]);
const SUBMISSION_RE = /^submission-[a-z0-9-]{16,96}$/;
const RECEIPT_RE = /^moderation:[0-9a-f-]{36}$/i;
const APPEAL_RESULTS = new Set(['upheld','modified','reversed']);

function boundedText(value, max, {required=false} = {}) {
  if (value === undefined || value === null) return required ? null : '';
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (required && !normalized) return null;
  if (normalized.length > max) return null;
  return normalized;
}

export function moderationAuthMaxAgeSeconds(env = {}) {
  const requested = Number(env.MODARYX_PRIVILEGED_AUTH_MAX_AGE_SECONDS);
  if (!Number.isFinite(requested)) return 15 * 60;
  return Math.max(60, Math.min(60 * 60, Math.trunc(requested)));
}

export async function auditActorKey(sub, prefix = 'actor') {
  const digest = new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(sub || '')))
  );
  const hex = [...digest].map((value) => value.toString(16).padStart(2, '0')).join('');
  return prefix + ':' + hex.slice(0, 40);
}

export async function moderationActorKey(sub) {
  return auditActorKey(sub, 'moderator');
}

export async function authorizeModerator(context, {
  requireRecentAuthentication = false,
  readBody = false,
  maxBytes = 16_000,
  nowMs = Date.now(),
  permissionOverride = MODERATION_PERMISSION
} = {}) {
  const db = context.env?.MODARYX_DB;
  if (!db || typeof db.prepare !== 'function') {
    return {ok:false, status:503, reason:'d1-binding-missing'};
  }

  if (readBody) {
    const origin = requireSameOrigin(context.request);
    if (!origin.ok) return origin;
  }

  const identity = await getSessionIdentity(context.request, db, {nowMs});
  if (!identity) return {ok:false, status:401, reason:'authentication-required'};
  if (!identity.permissions.includes(permissionOverride)) {
    return {
      ok:false,
      status:403,
      reason:permissionOverride === APPEALS_REVIEW_PERMISSION
        ? 'appeals-review-permission-required'
        : 'moderator-permission-required'
    };
  }

  if (requireRecentAuthentication) {
    const createdAtMs = Date.parse(identity.createdAt || '');
    const ageMs = nowMs - createdAtMs;
    const maxAgeMs = moderationAuthMaxAgeSeconds(context.env || {}) * 1000;
    if (!Number.isFinite(createdAtMs) || ageMs < 0 || ageMs > maxAgeMs) {
      return {ok:false, status:401, reason:'reauthentication-required'};
    }
  }

  let body = null;
  if (readBody) {
    const parsed = await readJson(context.request, maxBytes);
    if (!parsed.ok) return parsed;
    body = parsed.value;
  }

  return {ok:true, status:200, reason:null, identity, body};
}

export async function authorizeAppealsReviewer(context, options = {}) {
  const access = await authorizeModerator(context, {...options, permissionOverride:APPEALS_REVIEW_PERMISSION});
  return access;
}

export async function authorizeCommunityMemberWrite(context, {
  maxBytes = 16_000,
  nowMs = Date.now()
} = {}) {
  const db = context.env?.MODARYX_DB;
  if (!db || typeof db.prepare !== 'function') {
    return {ok:false, status:503, reason:'d1-binding-missing'};
  }
  const origin = requireSameOrigin(context.request);
  if (!origin.ok) return origin;

  const identity = await getSessionIdentity(context.request, db, {nowMs});
  if (!identity) return {ok:false, status:401, reason:'authentication-required'};

  const parsed = await readJson(context.request, maxBytes);
  if (!parsed.ok) return parsed;
  return {ok:true, status:200, reason:null, identity, body:parsed.value};
}

export function validateModerationDecision(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {ok:false, reason:'moderation-decision-invalid'};
  }

  const submissionId = typeof input.submissionId === 'string'
    ? input.submissionId.trim().toLowerCase()
    : '';
  if (!SUBMISSION_RE.test(submissionId)) return {ok:false, reason:'submission-id-invalid'};
  if (!OUTCOMES.has(input.outcome)) return {ok:false, reason:'moderation-outcome-invalid'};
  if (!CATEGORIES.has(input.category)) return {ok:false, reason:'moderation-category-invalid'};

  const statementOfReasons = boundedText(input.statementOfReasons, 8000, {required:true});
  if (!statementOfReasons) return {ok:false, reason:'statement-of-reasons-invalid'};

  const ruleOrLegalBasis = boundedText(input.ruleOrLegalBasis ?? '', 1000);
  if (ruleOrLegalBasis === null) return {ok:false, reason:'rule-or-legal-basis-invalid'};

  if (
    input.automatedSignalUsed !== undefined &&
    typeof input.automatedSignalUsed !== 'boolean'
  ) {
    return {ok:false, reason:'automated-signal-invalid'};
  }

  return {
    ok:true,
    value:{
      submissionId,
      outcome:input.outcome,
      category:input.category,
      statementOfReasons,
      ruleOrLegalBasis,
      automatedSignalUsed:Boolean(input.automatedSignalUsed)
    }
  };
}

export function moderationTransition(submission, outcome) {
  const wasPublished = submission?.publication_state === 'published';
  const scope = submission?.kind === 'comment' ? 'comment' : 'thread';

  if (outcome === 'publish') {
    if (submission?.abuse_state !== 'passed') {
      return {ok:false, reason:'abuse-state-not-passed'};
    }
    return {
      ok:true,
      moderationState:'accepted',
      publicationState:'published',
      distributable:true,
      action:'no-action',
      scope
    };
  }

  if (outcome === 'hold') {
    return {
      ok:true,
      moderationState:'held-for-review',
      publicationState:wasPublished ? 'withdrawn' : 'received',
      distributable:false,
      action:'visibility-limit',
      scope
    };
  }

  if (outcome === 'reject') {
    return {
      ok:true,
      moderationState:'rejected',
      publicationState:wasPublished ? 'withdrawn' : 'received',
      distributable:false,
      action:'remove',
      scope
    };
  }

  return {ok:false, reason:'moderation-outcome-invalid'};
}

export function buildModerationDecisionReceipt({
  receiptId,
  submission,
  decision,
  transition,
  previousReceiptId = null,
  now
}) {
  return {
    schemaVersion:1,
    receiptId,
    receiptType:'decision',
    content:{
      contentId:submission.submission_id,
      contentVersion:submission.created_at,
      contentDigest:null
    },
    category:decision.category,
    createdAt:now,
    decision:{
      action:transition.action,
      scope:transition.scope,
      duration:'none',
      expiresAt:null,
      statementOfReasons:decision.statementOfReasons,
      ...(decision.ruleOrLegalBasis ? {ruleOrLegalBasis:decision.ruleOrLegalBasis} : {}),
      decidedAt:now,
      automatedSignalUsed:decision.automatedSignalUsed,
      humanDecision:true
    },
    provenance:{
      recordedBy:'moderator',
      recordedAt:now,
      previousReceiptId
    }
  };
}


export function validateAppealRequest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {ok:false, reason:'appeal-invalid'};
  }
  const submissionId = typeof input.submissionId === 'string'
    ? input.submissionId.trim().toLowerCase()
    : '';
  if (!SUBMISSION_RE.test(submissionId)) return {ok:false, reason:'submission-id-invalid'};
  const grounds = boundedText(input.grounds, 8000, {required:true});
  if (!grounds) return {ok:false, reason:'appeal-grounds-invalid'};
  return {ok:true, value:{submissionId, grounds}};
}

export function validateAppealOutcome(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {ok:false, reason:'appeal-outcome-invalid'};
  }
  const appealReceiptId = typeof input.appealReceiptId === 'string'
    ? input.appealReceiptId.trim()
    : '';
  if (!RECEIPT_RE.test(appealReceiptId)) return {ok:false, reason:'appeal-receipt-id-invalid'};
  if (!APPEAL_RESULTS.has(input.result)) return {ok:false, reason:'appeal-result-invalid'};
  const reason = boundedText(input.reason, 8000, {required:true});
  if (!reason) return {ok:false, reason:'appeal-outcome-reason-invalid'};
  return {ok:true, value:{appealReceiptId, result:input.result, reason}};
}

export function appealOutcomeTransition(submission, result) {
  if (result === 'upheld') {
    return {
      ok:true,
      moderationState:submission.moderation_state,
      publicationState:submission.publication_state,
      distributable:submission.moderation_state === 'accepted' && submission.publication_state === 'published'
    };
  }

  if (result === 'modified') {
    return {
      ok:true,
      moderationState:'held-for-review',
      publicationState:submission.publication_state === 'published' ? 'withdrawn' : 'received',
      distributable:false
    };
  }

  if (result === 'reversed') {
    if (submission.abuse_state !== 'passed') return {ok:false, reason:'abuse-state-not-passed'};
    return {
      ok:true,
      moderationState:'accepted',
      publicationState:'published',
      distributable:true
    };
  }

  return {ok:false, reason:'appeal-result-invalid'};
}

export function buildAppealReceipt({
  receiptId,
  submission,
  decisionReceipt,
  grounds,
  now
}) {
  return {
    schemaVersion:1,
    receiptId,
    receiptType:'appeal',
    content:{
      contentId:submission.submission_id,
      contentVersion:submission.created_at,
      contentDigest:null
    },
    category:decisionReceipt.category,
    createdAt:now,
    appeal:{
      decisionReceiptId:decisionReceipt.receiptId,
      grounds,
      submittedAt:now,
      state:'submitted'
    },
    provenance:{
      recordedBy:'system',
      recordedAt:now,
      previousReceiptId:decisionReceipt.receiptId
    }
  };
}

export function buildAppealOutcomeReceipt({
  receiptId,
  submission,
  appealReceipt,
  result,
  reason,
  now
}) {
  return {
    schemaVersion:1,
    receiptId,
    receiptType:'appeal-outcome',
    content:{
      contentId:submission.submission_id,
      contentVersion:submission.created_at,
      contentDigest:null
    },
    category:appealReceipt.category,
    createdAt:now,
    outcome:{
      appealReceiptId:appealReceipt.receiptId,
      result,
      reason,
      decidedAt:now
    },
    provenance:{
      recordedBy:'appeals-reviewer',
      recordedAt:now,
      previousReceiptId:appealReceipt.receiptId
    }
  };
}
