import assert from "node:assert/strict";
import fs from "node:fs";
const h=JSON.parse(fs.readFileSync("qa/modaryx-v2-work-handoff.json","utf8"));
const l=JSON.parse(fs.readFileSync("qa/modaryx-v2-vf-closure-ledger.json","utf8"));
assert.equal(h.status,"READY_FOR_WORK_OR_REAL_OPERATOR");
assert.equal(h.sourceCommit,"128add6e1b39aa072d300befed6641cd16bfef5f");
assert.equal(h.blockerCount,l.blockerCount);
assert.equal(h.testedCandidateCommit,"db8ebf50ba4ff593fd73b27e72075b4f8088686a");
assert.equal(h.latestCheckpoint,"CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-07-P0-RIGHTS-FR-EU.md");
assert.equal(h.treeEquivalentCanonicalCommit,"39c98861dfbfcc4dfee3f266e5f500a7b7a934d1");
assert.equal(h.latestDesignProof?.canonicalTreeEquivalent,true);
assert.equal(h.currentFrontendEquivalence?.canonicalCommit,"128add6e1b39aa072d300befed6641cd16bfef5f");
assert.equal(h.currentFrontendEquivalence?.verifiedNoV2OrV2PreviewFileChanges,true);
assert.equal(h.currentFrontendEquivalence?.fullTreeEquivalent,false);
assert.equal(h.latestInteractiveV2Preview?.state,"SUCCESS");
assert.equal(h.latestInteractiveV2Preview?.aliasOrigin,"https://v2-engineering.nova-forge-site-public.pages.dev");
assert.equal(h.latestCloudflareCanonicalDeploy?.sourceCommit,"7ef0c89a13539b6060b51d604717c40b5cf5168b");
assert.equal(h.latestCloudflareCanonicalDeploy?.state,"SUCCESS");
assert.equal(h.latestCloudflareCanonicalDeploy?.build,"SUCCESS");
assert.equal(h.latestCloudflareCanonicalDeploy?.deploy,"SUCCESS");
assert.equal(h.latestNotificationDestinationVault?.migration,"0015");
assert.equal(h.latestNotificationDestinationVault?.remoteApplication,"DEV_SCHEMA_APPLIED");
assert.equal(h.d1MigrationState?.migrationCount,15);
assert.equal(h.d1MigrationState?.requiredV2TableCount,32);
assert.equal(h.d1MigrationState?.remoteDevApply,"SUCCESS");
assert.equal(h.d1MigrationState?.ownerHistoryTargetedReadWrite,"PENDING_REAL_AUTHENTICATED_PIPELINE");
assert.equal(h.latestD1DevControlledApply?.status,"SUCCESS");
assert.equal(h.latestD1DevControlledApply?.runId,37613283219);
assert.equal(h.latestD1DevControlledApply?.zeroUnappliedMigrations,true);
assert.equal(h.latestD1DevControlledApply?.postApplyV2TableCount,32);
assert.equal(h.latestD1DevControlledApply?.backendSchemaReady,true);
assert.equal(h.latestD1DevControlledApply?.productionPass,false);
assert.equal(h.latestD1DevControlledApply?.productionD1BindingPresent,false);
assert.equal(h.latestD1DevControlledApply?.workflowReturnedToManualOnly,true);
assert.equal(h.latestD1DevControlledApply?.ownerHistoryPipelineProof,"PENDING");
assert.equal(h.notificationProviderCandidates?.email?.state,"TECHNICAL_CANDIDATE_NOT_PRODUCTION_APPROVED");
assert.equal(h.notificationProviderCandidates?.push?.state,"TECHNICAL_CANDIDATE_NOT_PRODUCTION_APPROVED");
assert.equal(h.notificationProviderCandidates?.dispatchImplementation,"NOT_IMPLEMENTED");
assert.equal(h.latestReadOnlyProbe?.state,"SUCCESS");
assert.deepEqual(new Set(h.blockers.map(x=>x.id)),new Set(l.blockers.map(x=>x.id)));
for(const b of h.blockers){
  assert.equal(b.automationCanCloseWithoutExternalChange,false,b.id+" must remain external");
  assert.ok(Array.isArray(b.requiredEvidence)&&b.requiredEvidence.length>0,b.id+" evidence missing");
}
const inv=new Set(h.invariants||[]);
for(const x of [
  "NO_BLOCKER_CLOSES_WITHOUT_MATCHING_REQUIRED_EVIDENCE",
  "NO_REMOTE_D1_APPLY_WITHOUT_EXPLICIT_APPROVAL",
  "NO_R2_BINDING_CHANGE_WITHOUT_EXPLICIT_APPROVAL",
  "NO_PROVIDER_ACTIVATION_WITHOUT_EXPLICIT_APPROVAL",
  "NO_CUTOVER_UNTIL_ALL_REQUIRED_BLOCKERS_CLOSED",
  "AUTOMATION_NEVER_EQUALS_LEGAL_OR_PUBLISHER_APPROVAL"
]) assert.ok(inv.has(x),"missing invariant "+x);
console.log("WORK_HANDOFF_BLOCKER_COUNT",h.blockerCount);
console.log("PASS_V2_WORK_HANDOFF");
