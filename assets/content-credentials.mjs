const SHA256_RE = /^[0-9a-f]{64}$/;
const SAFE_PROVIDER_RE = /^[a-z0-9][a-z0-9._:-]{1,127}$/i;

export function evaluateC2paEvidence(evidence, expectedAssetSha256) {
  const expected = String(expectedAssetSha256 || '').toLowerCase();
  if (!SHA256_RE.test(expected)) return { accepted: false, reason: 'expected-asset-sha256-invalid' };
  if (!evidence || typeof evidence !== 'object') return { accepted: false, reason: 'evidence-missing' };
  if (evidence.schema !== 'nova-forge-c2pa-evidence/v1' || evidence.standard !== 'c2pa') return { accepted: false, reason: 'c2pa-contract-invalid' };
  if (evidence.validationState !== 'valid') return { accepted: false, reason: 'c2pa-not-valid' };
  if (!SAFE_PROVIDER_RE.test(String(evidence.validatorProvider || ''))) return { accepted: false, reason: 'validator-provider-invalid' };
  if (!SHA256_RE.test(String(evidence.validationReceiptSha256 || ''))) return { accepted: false, reason: 'validation-receipt-invalid' };
  if (!SHA256_RE.test(String(evidence.manifestClaimDigestSha256 || ''))) return { accepted: false, reason: 'manifest-claim-digest-invalid' };
  if (String(evidence.assetSha256 || '').toLowerCase() !== expected) return { accepted: false, reason: 'asset-digest-mismatch' };
  if (evidence.rightsOwnershipInferred !== false) return { accepted: false, reason: 'rights-must-remain-separate' };
  if (!['original', 'derived', 'unknown'].includes(evidence.lineageState)) return { accepted: false, reason: 'lineage-state-invalid' };

  return {
    accepted: true,
    standard: 'c2pa',
    provenance: 'validated-receipt',
    assetSha256: expected,
    lineageState: evidence.lineageState,
    rightsOwnership: 'not-inferred'
  };
}
