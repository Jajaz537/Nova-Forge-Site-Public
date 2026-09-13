const RECEIPT_RE = /^moderation:[a-z0-9][a-z0-9._:-]{7,191}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T/;

function nonEmpty(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

export function validateModerationReceipt(receipt) {
  if (!receipt || receipt.schemaVersion !== 1 || !RECEIPT_RE.test(String(receipt.receiptId || ''))) return { valid: false, reason: 'receipt-identity-invalid' };
  if (!['notice', 'decision', 'appeal', 'appeal-outcome'].includes(receipt.receiptType)) return { valid: false, reason: 'receipt-type-invalid' };
  if (!receipt.content?.contentId || !receipt.content?.contentVersion) return { valid: false, reason: 'content-reference-invalid' };
  if (!ISO_DATE_RE.test(String(receipt.createdAt || ''))) return { valid: false, reason: 'created-at-invalid' };
  if (!receipt.provenance || !['system', 'moderator', 'appeals-reviewer'].includes(receipt.provenance.recordedBy)) return { valid: false, reason: 'provenance-invalid' };
  if (receipt.receiptType === 'notice') {
    const value = receipt.notice;
    if (!value || !nonEmpty(value.reason, 4000) || !nonEmpty(value.ruleOrLegalBasis, 1000) || !ISO_DATE_RE.test(String(value.submittedAt || ''))) return { valid: false, reason: 'notice-reason-basis-time-required' };
    if (!Array.isArray(value.evidenceRefs)) return { valid: false, reason: 'notice-evidence-refs-required' };
    if (value.immutable !== true) return { valid: false, reason: 'notice-must-be-immutable' };
  }
  if (receipt.receiptType === 'decision') {
    const value = receipt.decision;
    if (!value || !nonEmpty(value.statementOfReasons, 8000) || !nonEmpty(value.ruleOrLegalBasis, 1000)) return { valid: false, reason: 'decision-reason-basis-required' };
    if (!['content-version', 'release', 'thread', 'comment', 'account'].includes(value.scope)) return { valid: false, reason: 'decision-scope-required' };
    if (!Array.isArray(value.evidenceRefs)) return { valid: false, reason: 'decision-evidence-refs-required' };
    if (!ISO_DATE_RE.test(String(value.decidedAt || ''))) return { valid: false, reason: 'decision-time-required' };
    if (typeof value.automatedSignalUsed !== 'boolean' || typeof value.humanDecision !== 'boolean') return { valid: false, reason: 'human-automation-separation-required' };
    if (!['human', 'automated'].includes(value.decisionMakerType)) return { valid: false, reason: 'decision-maker-type-required' };
    if ((value.decisionMakerType === 'human') !== value.humanDecision) return { valid: false, reason: 'decision-maker-human-flag-mismatch' };
    if (value.decisionMakerType === 'automated' && value.humanDecision !== false) return { valid: false, reason: 'automated-decision-human-flag-invalid' };
  }
  if (receipt.receiptType === 'appeal') {
    const value = receipt.appeal;
    if (!value || !RECEIPT_RE.test(String(value.decisionReceiptId || '')) || !nonEmpty(value.grounds, 8000) || !ISO_DATE_RE.test(String(value.submittedAt || ''))) return { valid: false, reason: 'appeal-contract-invalid' };
    if (value.humanReviewRequired !== true || value.automatedOnlyResolutionAllowed !== false) return { valid: false, reason: 'appeal-human-review-required' };
  }
  if (receipt.receiptType === 'appeal-outcome') {
    const value = receipt.outcome;
    if (!value || !RECEIPT_RE.test(String(value.appealReceiptId || '')) || !nonEmpty(value.reason, 8000) || !ISO_DATE_RE.test(String(value.decidedAt || ''))) return { valid: false, reason: 'appeal-outcome-invalid' };
    if (value.humanReviewed !== true) return { valid: false, reason: 'appeal-outcome-human-review-required' };
  }
  return { valid: true };
}
