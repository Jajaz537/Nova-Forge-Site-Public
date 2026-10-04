import fs from "node:fs";

const path = "qa/modaryx-v2-csp-headers-rich-text-contract.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

if (data.schemaVersion !== 1) throw new Error("unexpected schemaVersion");

const directives = data.directives || {};
const exact = {
  "default-src":["'self'"],
  "base-uri":["'self'"],
  "object-src":["'none'"],
  "script-src":["'self'"],
  "style-src":["'self'"],
  "font-src":["'self'"],
  "connect-src":["'self'"],
  "media-src":["'self'"],
  "frame-src":["'none'"],
  "worker-src":["'self'"],
  "manifest-src":["'self'"],
  "form-action":["'self'"]
};
for (const [name, expected] of Object.entries(exact)) {
  if (JSON.stringify(directives[name]) !== JSON.stringify(expected)) {
    throw new Error("unexpected directive " + name);
  }
}
const img = new Set(directives["img-src"] || []);
if (!img.has("'self'") || !img.has("data:") || img.size !== 2) throw new Error("img-src baseline drift");

const forbidden = new Set(data.forbiddenGlobalTokens || []);
for (const token of ["'unsafe-inline'","'unsafe-eval'"]) {
  if (!forbidden.has(token)) throw new Error("missing forbidden token " + token);
  for (const values of Object.values(directives)) {
    if ((values || []).includes(token)) throw new Error("forbidden token present in directives " + token);
  }
}

const headers = new Set(data.requiredHeaders || []);
for (const h of ["Content-Security-Policy","X-Content-Type-Options","Referrer-Policy","Strict-Transport-Security","Permissions-Policy"]) {
  if (!headers.has(h)) throw new Error("missing required header " + h);
}

if (data.richText?.defaultMode !== "PLAIN_TEXT") throw new Error("rich text default must remain plain text");
if (JSON.stringify(data.richText?.pipeline) !== JSON.stringify(["parse","sanitize_allowlist","render"])) {
  throw new Error("rich text pipeline drift");
}
const forbiddenElements = new Set(data.richText?.forbiddenElements || []);
for (const el of ["script","style","iframe","object","embed","form"]) {
  if (!forbiddenElements.has(el)) throw new Error("missing forbidden rich text element " + el);
}
const protocols = new Set(data.richText?.externalLinkProtocols || []);
if (!protocols.has("http:") || !protocols.has("https:") || protocols.size !== 2) throw new Error("external link protocol allowlist drift");

if (!data.serviceWorker?.distinctV2FileRequired || !data.serviceWorker?.explicitScopeRequired || !data.serviceWorker?.importLegacyScriptsForbidden || !data.serviceWorker?.cacheV1Forbidden) {
  throw new Error("service worker isolation invariants missing");
}
if (!data.preview?.noindexRequired || !data.preview?.reportOnlyFirst || !data.preview?.fakeReportEndpointForbidden) {
  throw new Error("preview safety invariants missing");
}
for (const [key,value] of Object.entries(data.productionStatus || {})) {
  if (value !== "NOT_IMPLEMENTED") throw new Error("production status must remain honest: " + key);
}

const invariants = new Set(data.invariants || []);
for (const inv of [
  "NO_GLOBAL_UNSAFE_INLINE","NO_UNSAFE_EVAL","NO_ARBITRARY_REMOTE_ORIGINS",
  "RICH_TEXT_SANITIZED_BEFORE_RENDER","USER_LINK_PROTOCOL_ALLOWLIST",
  "NO_UNSANITIZED_USER_SVG","NO_FAKE_CSP_REPORT_ENDPOINT","PREVIEW_NOINDEX",
  "SW_V2_ISOLATED_FROM_V1","COOP_COEP_CORP_ONLY_AFTER_COMPATIBILITY_REVIEW"
]) {
  if (!invariants.has(inv)) throw new Error("missing invariant " + inv);
}

console.log("CSP_DIRECTIVE_COUNT", Object.keys(directives).length);
console.log("CSP_REQUIRED_HEADER_COUNT", headers.size);
console.log("CSP_INVARIANT_COUNT", invariants.size);
console.log("PASS_V2_CSP_HEADERS_RICH_TEXT_CONTRACT");
