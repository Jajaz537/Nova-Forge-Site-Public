const SHA256_RE = /^[a-f0-9]{64}$/;

function fail(message) {
  throw new Error(message);
}

function requireSha256(value, label) {
  const text = String(value || '').toLowerCase();
  if (!SHA256_RE.test(text)) fail(`${label}: sha256-required`);
  return text;
}

function requireLogicalIdentity(identity) {
  if (!identity || typeof identity !== 'object') fail('logicalIdentity-required');
  return {
    manifestSha256: requireSha256(identity.manifestSha256, 'manifestSha256'),
    artifactSha256: requireSha256(identity.artifactSha256, 'artifactSha256')
  };
}

function stableOrigin(origin) {
  if (!origin || typeof origin !== 'object') return null;
  const originId = String(origin.originId || '').trim();
  const kind = String(origin.kind || '').trim();
  const locator = String(origin.locator || '').trim();
  const state = String(origin.state || '').trim();
  if (!originId || !kind || !locator || !['active', 'degraded', 'disabled'].includes(state)) return null;
  return {
    originId,
    kind,
    locator,
    state,
    mutableAlias: origin.mutableAlias === true,
    providerLabel: origin.providerLabel == null ? null : String(origin.providerLabel)
  };
}

function resolveStorage(plan, probes = {}) {
  const logicalIdentity = requireLogicalIdentity(plan?.logicalIdentity);
  const origins = (Array.isArray(plan?.origins) ? plan.origins : []).map(stableOrigin).filter(Boolean);
  if (!origins.length) return {state: 'failed', reason: 'no-origins', logicalIdentity};

  const rejected = [];
  const order = [...origins].sort((a, b) => {
    const rank = {active: 0, degraded: 1, disabled: 2};
    return rank[a.state] - rank[b.state] || a.originId.localeCompare(b.originId, 'en');
  });

  for (const origin of order) {
    if (origin.state === 'disabled') {
      rejected.push({originId: origin.originId, reason: 'disabled'});
      continue;
    }
    if (origin.mutableAlias) {
      rejected.push({originId: origin.originId, reason: 'mutable-alias-forbidden'});
      continue;
    }
    const probe = probes[origin.originId];
    if (!probe || probe.ok !== true) {
      rejected.push({originId: origin.originId, reason: 'unverified'});
      continue;
    }
    const observed = String(probe.artifactSha256 || '').toLowerCase();
    if (!SHA256_RE.test(observed) || observed !== logicalIdentity.artifactSha256) {
      rejected.push({originId: origin.originId, reason: 'digest-mismatch'});
      continue;
    }
    if (probe.manifestSha256 && String(probe.manifestSha256).toLowerCase() !== logicalIdentity.manifestSha256) {
      rejected.push({originId: origin.originId, reason: 'manifest-mismatch'});
      continue;
    }
    return {
      state: 'verified',
      logicalIdentity,
      resolvedOriginId: origin.originId,
      verifiedArtifactSha256: observed,
      providerLabel: origin.providerLabel,
      rejected
    };
  }
  return {state: 'failed', reason: 'no-verified-origin', logicalIdentity, rejected};
}

function repairArtifact({logicalIdentity, releaseState = 'active', origins = []}, probes = {}) {
  const identity = requireLogicalIdentity(logicalIdentity);
  if (releaseState === 'revoked') return {state: 'release-revoked', distributable: false, reason: 'revoked'};
  if (releaseState === 'withdrawn') return {state: 'release-withdrawn', distributable: false, reason: 'withdrawn'};
  const resolution = resolveStorage({logicalIdentity: identity, origins}, probes);
  if (resolution.state !== 'verified') {
    return {state: 'no-verified-copy', distributable: false, reason: resolution.reason, rejected: resolution.rejected || []};
  }
  return {
    state: 'repaired',
    distributable: true,
    selectedOriginId: resolution.resolvedOriginId,
    verifiedArtifactSha256: resolution.verifiedArtifactSha256
  };
}

function surgeDecision({requestsPerSecond = 0, softLimit = 50, hardLimit = 100, queueDepth = 0, queueLimit = 500} = {}) {
  for (const [name, value] of Object.entries({requestsPerSecond, softLimit, hardLimit, queueDepth, queueLimit})) {
    if (!Number.isFinite(value) || value < 0) fail(`${name}: invalid-number`);
  }
  if (softLimit <= 0 || hardLimit < softLimit || queueLimit <= 0) fail('surge-limits-invalid');
  let mode = 'normal';
  if (requestsPerSecond >= hardLimit || queueDepth >= queueLimit) mode = 'backpressure';
  else if (requestsPerSecond >= softLimit || queueDepth >= Math.ceil(queueLimit * 0.6)) mode = 'degraded';
  return {
    mode,
    acceptNonEssential: mode === 'normal',
    cacheFirstPreferred: mode !== 'normal',
    retryAfterSeconds: mode === 'backpressure' ? 30 : (mode === 'degraded' ? 5 : 0),
    silentOverage: false,
    paidBurst: false
  };
}

function abuseDecision({failedActions = 0, distinctTargets = 0, automationScore = 0, verifiedHuman = false} = {}) {
  for (const value of [failedActions, distinctTargets, automationScore]) if (!Number.isFinite(value) || value < 0) fail('abuse-signal-invalid');
  let action = 'allow';
  const score = failedActions * 2 + distinctTargets + automationScore * 10;
  if (score >= 24) action = 'block';
  else if (score >= 10) action = 'throttle';
  if (verifiedHuman && action === 'block' && automationScore < 0.5) action = 'throttle';
  return {
    action,
    score,
    requiresServerEnforcement: action !== 'allow',
    storesBehavioralProfile: false,
    remoteTelemetryRequired: false
  };
}

function routeCommunityItem({ageHours = 0, activityScore = 0, pinned = false} = {}) {
  if (!Number.isFinite(ageHours) || ageHours < 0 || !Number.isFinite(activityScore) || activityScore < 0) fail('community-tier-input-invalid');
  if (pinned || activityScore >= 50 || ageHours <= 24) return 'hot';
  if (activityScore >= 10 || ageHours <= 24 * 14) return 'warm';
  return 'cold';
}

function mediaDerivativePlan({width, height, bytes, animated = false} = {}) {
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0 || !Number.isSafeInteger(bytes) || bytes <= 0) fail('media-input-invalid');
  const candidates = [320, 640, 960, 1440, 1920].filter((value) => value < width);
  const widths = [...new Set([...candidates, width])].sort((a, b) => a - b);
  return {
    strategy: 'deterministic-derivatives',
    sourcePreserved: true,
    animated,
    formats: animated ? ['webp'] : ['avif', 'webp', 'jpeg'],
    widths,
    lazyLoadEligible: true,
    externalVideoReferencePreferred: true,
    sourceBytes: bytes
  };
}

function buildSmartProfile(observations = {}) {
  const hardwareConcurrency = Number(observations.hardwareConcurrency);
  const deviceMemory = Number(observations.deviceMemory);
  const screenWidth = Number(observations.screenWidth);
  const dpr = Number(observations.devicePixelRatio);
  const rows = [
    ['hardware-concurrency', hardwareConcurrency, 'threads'],
    ['device-memory', deviceMemory, 'GiB'],
    ['screen-width', screenWidth, 'px'],
    ['device-pixel-ratio', dpr, 'ratio']
  ].map(([key, value, unit]) => Number.isFinite(value) && value > 0
    ? {key, evidence: key === 'device-memory' ? 'estimated' : 'measured', source: 'browser-api', value, unit}
    : {key, evidence: 'unknown', source: 'unavailable', value: null, unit});
  const known = rows.filter((row) => row.value != null);
  const score = (Number.isFinite(hardwareConcurrency) ? hardwareConcurrency : 0) + (Number.isFinite(deviceMemory) ? deviceMemory * 2 : 0);
  const profile = score >= 24 ? 'high' : score >= 10 ? 'medium' : 'low-prudent';
  return {
    schemaVersion: 1,
    execution: 'browser-local',
    observations: rows,
    recommendation: {profile, evidence: 'estimated', basis: known.length ? known.map((row) => row.key) : ['insufficient-browser-evidence']},
    guarantees: {fps: false, stability: false}
  };
}

function evaluatePublicationEligibility({manifest, provenanceState, rightsState, moderationState, artifactSha256, humanReviewRequired = false, humanReviewComplete = false} = {}) {
  if (!manifest || manifest.schemaVersion !== 1) return {eligible: false, reason: 'manifest-invalid', publicationState: 'blocked'};
  if (manifest.distribution?.state !== 'locked' || manifest.distribution?.downloadable !== false || manifest.releaseReceipt !== null) {
    return {eligible: false, reason: 'draft-not-locked', publicationState: 'blocked'};
  }
  if (provenanceState !== 'verified') return {eligible: false, reason: 'provenance-not-verified', publicationState: 'blocked'};
  if (rightsState !== 'verified') return {eligible: false, reason: 'rights-not-verified', publicationState: 'blocked'};
  if (moderationState !== 'clear') return {eligible: false, reason: 'moderation-not-clear', publicationState: 'blocked'};
  requireSha256(artifactSha256, 'artifactSha256');
  if (humanReviewRequired && !humanReviewComplete) return {eligible: false, reason: 'human-review-required', publicationState: 'blocked'};
  return {
    eligible: true,
    publicationState: 'ready-not-published',
    distributable: false,
    providerRequiredForPublication: true,
    artifactSha256: artifactSha256.toLowerCase()
  };
}

function evaluatePasskeyReadiness({webAuthnAvailable, platformAuthenticatorAvailable, serverChallengeAvailable, rpIdConfigured} = {}) {
  const localCapable = webAuthnAvailable === true;
  const serverReady = serverChallengeAvailable === true && rpIdConfigured === true;
  return {
    localCapable,
    platformAuthenticatorAvailable: platformAuthenticatorAvailable === true,
    serverReady,
    authenticationReady: localCapable && serverReady,
    state: localCapable && serverReady ? 'ready' : (localCapable ? 'browser-ready-provider-not-connected' : 'unsupported')
  };
}

export {
  abuseDecision,
  buildSmartProfile,
  evaluatePasskeyReadiness,
  evaluatePublicationEligibility,
  mediaDerivativePlan,
  repairArtifact,
  resolveStorage,
  routeCommunityItem,
  surgeDecision
};
