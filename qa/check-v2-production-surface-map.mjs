import fs from "node:fs";

const path = "qa/modaryx-v2-production-surface-map.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const required = [
  "homepage","games-index","game-hub","catalog","global-search","content-detail",
  "requirements-dependencies","release-files","collection","modpack","profile-loadout",
  "creator-profile","creator-studio","community","library","security-trust",
  "mobile-navigation","mobile-catalog","mobile-content-detail",
  "account-settings","notifications","offline-stale","rights-admin","modaryx-ai-preview","public-trust","help-docs","moderation-center"
];

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");
if (!Array.isArray(data.surfaces)) throw new Error("surfaces missing");
const ids = data.surfaces.map(x => x.id);
if (new Set(ids).size !== ids.length) throw new Error("duplicate surface id");

for (const id of required) {
  if (!ids.includes(id)) throw new Error("missing required surface: " + id);
}

for (const surface of data.surfaces) {
  for (const field of ["id","acceptance","prototypeStatus","productionStatus","mobile"]) {
    if (!surface[field]) throw new Error(`surface ${surface.id || "unknown"} missing ${field}`);
  }
  for (const field of ["components","domains","states"]) {
    if (!Array.isArray(surface[field]) || surface[field].length === 0) {
      throw new Error(`surface ${surface.id} missing non-empty ${field}`);
    }
  }
  if (surface.productionStatus !== "BLOCKED_GATE") {
    throw new Error(`surface ${surface.id} must remain BLOCKED_GATE before production root approval`);
  }
}


const gamesIndex = data.surfaces.find(x => x.id === "games-index");
for (const component of ["GameSupportRequest"]) {
  if (!gamesIndex?.components?.includes(component)) throw new Error("games-index missing component: " + component);
}
for (const state of ["support-request-closed","support-request-validation-error","support-request-local-draft"]) {
  if (!gamesIndex?.states?.includes(state)) throw new Error("games-index missing state: " + state);
}

const rightsAdmin = data.surfaces.find(x => x.id === "rights-admin");
for (const component of ["RightsDashboard","GameSupportTriage","PublisherResponseInterpretation"]) {
  if (!rightsAdmin?.components?.includes(component)) throw new Error("rights-admin missing component: " + component);
}
for (const state of [
  "approved-with-limits-demo","awaiting-response-demo","no-response-demo",
  "support-triage-demo","support-accepted-safe-baseline-demo","support-declined-product-demo",
  "response-safe-automation-demo","response-legal-review-fallback-demo","outbound-unavailable"
]) {
  if (!rightsAdmin?.states?.includes(state)) throw new Error("rights-admin missing state: " + state);
}

const aiPreview = data.surfaces.find(x => x.id === "modaryx-ai-preview");
for (const component of ["ModaryxAIPage","AiTrustPanel","AiDisabledComposer"]) {
  if (!aiPreview?.components?.includes(component)) throw new Error("modaryx-ai-preview missing component: " + component);
}
for (const state of ["backend-unavailable","composer-disabled","insufficient-evidence-safe-fallback"]) {
  if (!aiPreview?.states?.includes(state)) throw new Error("modaryx-ai-preview missing state: " + state);
}

const moderationCenter = data.surfaces.find(x => x.id === "moderation-center");
for (const component of ["ModerationCenter","ModerationCaseList","ModerationDecisionHistory","ModerationAppealState"]) {
  if (!moderationCenter?.components?.includes(component)) throw new Error("moderation-center missing component: " + component);
}
for (const state of ["received-demo","under-review-demo","appealed-demo","server-actions-disabled","audit-history-preserved"]) {
  if (!moderationCenter?.states?.includes(state)) throw new Error("moderation-center missing state: " + state);
}

const helpDocs = data.surfaces.find(x => x.id === "help-docs");
for (const component of ["HelpDocsPage","HelpTopicGrid","HelpActionLinks","DocumentationReadinessState"]) {
  if (!helpDocs?.components?.includes(component)) throw new Error("help-docs missing component: " + component);
}
for (const state of ["prototype-help","final-documentation-missing","runtime-dependent-content","no-server-workflow-simulated"]) {
  if (!helpDocs?.states?.includes(state)) throw new Error("help-docs missing state: " + state);
}

const publicTrust = data.surfaces.find(x => x.id === "public-trust");
for (const component of ["PublicLegalTrustPage","TrustReadinessGrid","PublicTrustGate"]) {
  if (!publicTrust?.components?.includes(component)) throw new Error("public-trust missing component: " + component);
}
for (const state of ["structure-ready","product-facts-missing","legal-draft-required","legal-review-required"]) {
  if (!publicTrust?.states?.includes(state)) throw new Error("public-trust missing state: " + state);
}

const unresolved = new Set(data.unresolvedRealRuntimeStates || []);
for (const requiredState of [
  "session-expired-real",
  "permission-denied-server-real",
  "backend-error-real",
  "sync-conflict-real",
  "pwa-service-worker-production",
  "modaryx-forge-install-runtime"
]) {
  if (!unresolved.has(requiredState)) throw new Error("missing unresolved runtime state: " + requiredState);
}

const trustContract = JSON.parse(fs.readFileSync("qa/modaryx-v2-public-trust-contract.json", "utf8"));
if (trustContract.schemaVersion !== 1) throw new Error("public trust schemaVersion");
if ((trustContract.categories || []).length !== 8) throw new Error("public trust categories");
if ((trustContract.readinessStates || []).length !== 7) throw new Error("public trust readiness states");
if ((trustContract.invariants || []).length < 10) throw new Error("public trust invariants");
if ((trustContract.publishableStates || []).join("|") !== "APPROVED_FOR_PUBLICATION|PUBLISHED") {
  throw new Error("public trust publishable states");
}
console.log("PUBLIC_TRUST_CATEGORY_COUNT", trustContract.categories.length);
console.log("PUBLIC_TRUST_STATE_COUNT", trustContract.readinessStates.length);
console.log("PASS_V2_PUBLIC_TRUST_CONTRACT");

console.log("SURFACE_MAP_COUNT", data.surfaces.length);
console.log("UNRESOLVED_RUNTIME_COUNT", unresolved.size);
console.log("PASS_V2_PRODUCTION_SURFACE_MAP");
