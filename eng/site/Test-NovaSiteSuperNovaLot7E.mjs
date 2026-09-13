import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  abuseDecision,
  buildSmartProfile,
  evaluatePasskeyReadiness,
  evaluatePublicationEligibility,
  mediaDerivativePlan,
  repairArtifact,
  resolveStorage,
  routeCommunityItem,
  surgeDecision
} from '../../assets/site-fabric.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const governance = JSON.parse(fs.readFileSync(path.join(root, 'governance/SUPER-NOVA-SITE-LOT7E.json'), 'utf8'));
assert.equal(governance.schema, 'nova-forge-supernova-site-lot7e/v1');
assert.equal(governance.ideas.length, 23);
assert.equal(new Set(governance.ideas.map((x) => x.id)).size, 23);
assert.equal(governance.architectureOnlyRemaining, 0);
assert.equal(governance.policy.noSilentOverage, true);
assert.equal(governance.policy.noFakeBackend, true);

const a = 'a'.repeat(64);
const b = 'b'.repeat(64);
const c = 'c'.repeat(64);
const plan = {
  logicalIdentity: {manifestSha256: a, artifactSha256: b},
  origins: [
    {originId: 'mirror.mutable', kind: 'mirror', locator: 'https://m.example/latest', state: 'active', mutableAlias: true},
    {originId: 'mirror.bad', kind: 'mirror', locator: 'https://b.example/artifact', state: 'active'},
    {originId: 'origin.good', kind: 'https', locator: 'https://g.example/artifact', state: 'degraded', providerLabel: 'provider-neutral-demo'}
  ]
};
const resolved = resolveStorage(plan, {
  'mirror.mutable': {ok: true, artifactSha256: b, manifestSha256: a},
  'mirror.bad': {ok: true, artifactSha256: c, manifestSha256: a},
  'origin.good': {ok: true, artifactSha256: b, manifestSha256: a}
});
assert.equal(resolved.state, 'verified');
assert.equal(resolved.resolvedOriginId, 'origin.good');
assert.equal(resolved.verifiedArtifactSha256, b);
assert.ok(resolved.rejected.some((x) => x.reason === 'mutable-alias-forbidden'));
assert.ok(resolved.rejected.some((x) => x.reason === 'digest-mismatch'));

const failed = resolveStorage(plan, {'mirror.bad': {ok: true, artifactSha256: c, manifestSha256: a}});
assert.equal(failed.state, 'failed');
assert.equal(failed.reason, 'no-verified-origin');

const repaired = repairArtifact({logicalIdentity: {manifestSha256: a, artifactSha256: b}, origins: plan.origins}, {
  'origin.good': {ok: true, artifactSha256: b, manifestSha256: a}
});
assert.equal(repaired.state, 'repaired');
assert.equal(repaired.distributable, true);
assert.equal(repairArtifact({logicalIdentity: {manifestSha256: a, artifactSha256: b}, releaseState: 'revoked', origins: plan.origins}, {}).distributable, false);

assert.deepEqual(surgeDecision({requestsPerSecond: 10, softLimit: 50, hardLimit: 100, queueDepth: 2, queueLimit: 500}), {
  mode: 'normal', acceptNonEssential: true, cacheFirstPreferred: false, retryAfterSeconds: 0, silentOverage: false, paidBurst: false
});
const surge = surgeDecision({requestsPerSecond: 120, softLimit: 50, hardLimit: 100, queueDepth: 2, queueLimit: 500});
assert.equal(surge.mode, 'backpressure');
assert.equal(surge.silentOverage, false);
assert.equal(surge.paidBurst, false);

assert.equal(abuseDecision({failedActions: 1, distinctTargets: 1, automationScore: 0}).action, 'allow');
assert.equal(abuseDecision({failedActions: 6, distinctTargets: 1, automationScore: 0}).action, 'throttle');
assert.equal(abuseDecision({failedActions: 8, distinctTargets: 4, automationScore: 1}).action, 'block');

assert.equal(routeCommunityItem({ageHours: 1, activityScore: 0}), 'hot');
assert.equal(routeCommunityItem({ageHours: 72, activityScore: 12}), 'warm');
assert.equal(routeCommunityItem({ageHours: 24 * 30, activityScore: 1}), 'cold');

const media = mediaDerivativePlan({width: 2100, height: 1200, bytes: 8000000});
assert.deepEqual(media.widths, [320, 640, 960, 1440, 1920, 2100]);
assert.equal(media.sourcePreserved, true);
assert.equal(media.externalVideoReferencePreferred, true);

const smart = buildSmartProfile({hardwareConcurrency: 8, deviceMemory: 8, screenWidth: 1920, devicePixelRatio: 2});
assert.equal(smart.schemaVersion, 1);
assert.equal(smart.execution, 'browser-local');
assert.equal(smart.recommendation.profile, 'high');
assert.equal(smart.guarantees.fps, false);
assert.equal(smart.guarantees.stability, false);

const manifest = {schemaVersion: 1, distribution: {state: 'locked', downloadable: false}, releaseReceipt: null};
assert.equal(evaluatePublicationEligibility({manifest, provenanceState: 'verified', rightsState: 'verified', moderationState: 'clear', artifactSha256: b}).publicationState, 'ready-not-published');
assert.equal(evaluatePublicationEligibility({manifest, provenanceState: 'declared', rightsState: 'verified', moderationState: 'clear', artifactSha256: b}).eligible, false);

const passkey = evaluatePasskeyReadiness({webAuthnAvailable: true, platformAuthenticatorAvailable: true, serverChallengeAvailable: false, rpIdConfigured: true});
assert.equal(passkey.localCapable, true);
assert.equal(passkey.authenticationReady, false);
assert.equal(passkey.state, 'browser-ready-provider-not-connected');

console.log('PASS_SITE_FABRIC_STORAGE_FEDERATION_REPAIR');
console.log('PASS_SITE_FABRIC_SURGE_ABUSE_ZERO_OVERAGE');
console.log('PASS_SITE_FABRIC_MEDIA_COMMUNITY_SMART_PROFILE');
console.log('PASS_SITE_FABRIC_CREATOR_PASSKEY_FAIL_CLOSED');
console.log('PASS_TARGETED_SITE_SUPERNOVA_LOT7E_NODE_PROOF ideas=23');
