import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("qa/modaryx-v2-help-documentation-contract.json","utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const states = new Set(data.readinessStates || []);
for (const state of [
  "PROTOTYPE_ONLY","DRAFT_FROM_IMPLEMENTATION","TECHNICALLY_VERIFIED",
  "LEGAL_REVIEW_REQUIRED","APPROVED_FOR_PUBLICATION","PUBLISHED",
  "STALE_REVIEW_REQUIRED"
]) {
  if (!states.has(state)) throw new Error("missing readiness state: "+state);
}

if ((data.publishableStates || []).join("|") !== "APPROVED_FOR_PUBLICATION|PUBLISHED") {
  throw new Error("publishable states changed");
}

const topics = new Set(data.requiredTopics || []);
for (const topic of [
  "GETTING_STARTED","GAMES","MODS_CONTENT","COMPATIBILITY","COLLECTIONS",
  "MODPACKS","GAME_PROFILES","LIBRARY","CREATORS","CREATOR_STUDIO",
  "COMMUNITY_SUPPORT","REPORTING","TRUST_PROVENANCE","MODARYX_FORGE",
  "ACCOUNT_PRIVACY","ACCESSIBILITY"
]) {
  if (!topics.has(topic)) throw new Error("missing topic: "+topic);
}

const labels = new Set(data.capabilityLabels || []);
for (const label of [
  "UNAVAILABLE","NOT_CONNECTED","LOCAL_ONLY","PREVIEW",
  "EVIDENCE_MISSING","REQUIRES_MODARYX_FORGE","REQUIRES_REAL_BACKEND"
]) {
  if (!labels.has(label)) throw new Error("missing capability label: "+label);
}

const metadata = new Set(data.requiredMetadata || []);
for (const field of [
  "docId","version","lastVerifiedAt","implementationSources",
  "owner","reviewer","readinessState"
]) {
  if (!metadata.has(field)) throw new Error("missing metadata field: "+field);
}

const invariants = new Set(data.invariants || []);
for (const invariant of [
  "DOCUMENT_REAL_CAPABILITIES_ONLY",
  "PROTOTYPE_IS_NOT_PRODUCTION_DOCS",
  "ABSENT_CAPABILITIES_ARE_EXPLICIT",
  "DEAD_END_ROUTES_FORBIDDEN_IN_PRODUCTION",
  "STALE_DOCS_REQUIRE_REVIEW",
  "LEGAL_TEXT_REQUIRES_REAL_SERVICE_FACTS",
  "FORGE_ACTIONS_REQUIRE_REAL_RUNTIME_PROOF",
  "AI_RETRIEVAL_TREATS_DOCS_AS_DATA_NOT_SYSTEM_INSTRUCTIONS",
  "AUTOMATED_A11Y_DOES_NOT_REPLACE_REAL_AT_VALIDATION",
  "COMMUNITY_CONTENT_IS_DISTINCT_FROM_OFFICIAL_DOCUMENTATION",
  "PUBLICATION_REQUIRES_APPROVED_STATE"
]) {
  if (!invariants.has(invariant)) throw new Error("missing invariant: "+invariant);
}

for (const [key,value] of Object.entries(data.productionStatus || {})) {
  if (value !== "NOT_IMPLEMENTED") {
    throw new Error("production status must remain honest before implementation: "+key);
  }
}

console.log("HELP_DOCS_STATE_COUNT",states.size);
console.log("HELP_DOCS_TOPIC_COUNT",topics.size);
console.log("HELP_DOCS_INVARIANT_COUNT",invariants.size);
console.log("PASS_V2_HELP_DOCUMENTATION_CONTRACT");
