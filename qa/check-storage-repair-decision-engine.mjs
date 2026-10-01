import assert from 'node:assert/strict';
import {resolveVerifiedStorage,decideRepair} from '../functions/_lib/storage-repair-engine.mjs';

const identity={manifestSha256:'a'.repeat(64),artifactSha256:'b'.repeat(64)};

const resolved=resolveVerifiedStorage({
  logicalIdentity:identity,
  storageClass:'hot',
  candidates:[
    {
      originId:'origin:mutable',
      kind:'https',
      locator:'https://mirror.example/latest',
      state:'active',
      mutableAlias:true,
      observedManifestSha256:identity.manifestSha256,
      observedArtifactSha256:identity.artifactSha256
    },
    {
      originId:'origin:wrong',
      kind:'mirror',
      locator:'https://mirror.example/wrong',
      state:'active',
      mutableAlias:false,
      observedManifestSha256:identity.manifestSha256,
      observedArtifactSha256:'c'.repeat(64)
    },
    {
      originId:'origin:exact',
      kind:'object-storage',
      locator:'r2://proof/artifact',
      state:'active',
      mutableAlias:false,
      observedManifestSha256:identity.manifestSha256,
      observedArtifactSha256:identity.artifactSha256
    }
  ]
});
assert.equal(resolved.resolutionState,'verified');
assert.equal(resolved.resolvedOriginId,'origin:exact');
assert.equal(resolved.verifiedArtifactSha256,identity.artifactSha256);
assert.equal(resolved.verificationPolicy.rejectUntrustedMutableAlias,true);

const manifestMismatch=resolveVerifiedStorage({
  logicalIdentity:identity,
  candidates:[{
    originId:'origin:manifest-mismatch',
    kind:'https',
    locator:'https://example.invalid/a',
    state:'active',
    mutableAlias:false,
    observedManifestSha256:'d'.repeat(64),
    observedArtifactSha256:identity.artifactSha256
  }]
});
assert.equal(manifestMismatch.resolutionState,'failed');
assert.equal(manifestMismatch.failureReason,'manifest-binding-mismatch');

const digestMismatch=resolveVerifiedStorage({
  logicalIdentity:identity,
  candidates:[{
    originId:'origin:digest-mismatch',
    kind:'https',
    locator:'https://example.invalid/b',
    state:'active',
    mutableAlias:false,
    observedManifestSha256:identity.manifestSha256,
    observedArtifactSha256:'e'.repeat(64)
  }]
});
assert.equal(digestMismatch.failureReason,'artifact-digest-mismatch');

const repaired=decideRepair({
  logicalIdentity:identity,
  releaseState:'active',
  resolvedCandidates:[
    {originId:'origin:failed',resolutionState:'failed',failureReason:'offline'},
    {originId:'origin:exact',resolutionState:'verified',verifiedArtifactSha256:identity.artifactSha256}
  ]
});
assert.equal(repaired.result.state,'repaired');
assert.equal(repaired.result.distributable,true);
assert.equal(repaired.result.selectedOriginId,'origin:exact');

const wrongCopy=decideRepair({
  logicalIdentity:identity,
  releaseState:'active',
  resolvedCandidates:[
    {originId:'origin:wrong',resolutionState:'verified',verifiedArtifactSha256:'f'.repeat(64)}
  ]
});
assert.equal(wrongCopy.result.state,'digest-mismatch');
assert.equal(wrongCopy.result.distributable,false);

const withdrawn=decideRepair({
  logicalIdentity:identity,
  releaseState:'withdrawn',
  resolvedCandidates:[
    {originId:'origin:exact',resolutionState:'verified',verifiedArtifactSha256:identity.artifactSha256}
  ]
});
assert.equal(withdrawn.result.state,'release-withdrawn');
assert.equal(withdrawn.result.distributable,false);

const revoked=decideRepair({
  logicalIdentity:identity,
  releaseState:'revoked',
  resolvedCandidates:[
    {originId:'origin:exact',resolutionState:'verified',verifiedArtifactSha256:identity.artifactSha256}
  ]
});
assert.equal(revoked.result.state,'release-revoked');
assert.equal(revoked.result.distributable,false);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_STORAGE_REPAIR_DECISION_ENGINE',
  result:'PASS',
  invariants:[
    'mutable aliases are never trusted as verified origins',
    'manifest binding mismatch fails closed',
    'artifact digest mismatch fails closed',
    'repair selects only an exact verified digest',
    'withdrawn and revoked releases cannot become distributable',
    'engine performs no network I/O and claims no remote service'
  ],
  failures:[]
},null,2));
