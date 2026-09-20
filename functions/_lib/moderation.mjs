import {readJson, requireSameOrigin} from './api-security.mjs';
import {getSessionIdentity} from './auth-session.mjs';

export const MODERATION_PERMISSION = 'community:moderate';

const OUTCOMES = new Set(['publish', 'hold', 'reject']);
const CATEGORIES = new Set([
  'illegal-content',
  'policy-violation',
  'spam-abuse',
  'intellectual-property'
]);
const SUBMISSION_RE = /^submission-[a-z0-9-]{16,96}$/;

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

export async function moderationActorKey(sub) {
  const digest = new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(sub || '')))
  );
  const hex = [...digest].map((value) => value.toString(16).padStart(2, '0')).join('');
  return 'moderator:' + hex.slice(0, 40);
}

export async function authorizeModerator(context, {
  requireRecentAuthentication = false,
  readBody = false,
  maxBytes = 16_000,
  nowMs = Date.now()
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
  if (!identity.permissions.includes(MODERATION_PERMISSION)) {
    return {ok:false, status:403, reason:'moderator-permission-required'};
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
