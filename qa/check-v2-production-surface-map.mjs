import fs from "node:fs";

const path = "qa/modaryx-v2-production-surface-map.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const required = [
  "homepage","games-index","game-hub","catalog","global-search","content-detail",
  "requirements-dependencies","release-files","collection","modpack","profile-loadout",
  "creator-profile","creator-studio","community","library","security-trust",
  "mobile-navigation","mobile-catalog","mobile-content-detail",
  "account-settings","notifications","offline-stale","rights-admin","modaryx-ai-preview"
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

console.log("SURFACE_MAP_COUNT", data.surfaces.length);
console.log("UNRESOLVED_RUNTIME_COUNT", unresolved.size);
console.log("PASS_V2_PRODUCTION_SURFACE_MAP");
