import { readFileSync } from "node:fs";

const cssPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/styles.css";
const appPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/App.jsx";
const indexPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/index.html";
const css = readFileSync(cssPath, "utf8");
const app = readFileSync(appPath, "utf8");
const indexHtml = readFileSync(indexPath, "utf8");

const fail = (message) => {
  console.error("FAIL_V2_LIVING_THRESHOLD_STATIC_A11Y", message);
  process.exit(1);
};
const requireMatch = (re, message) => {
  if (!re.test(css)) fail(message);
};

requireMatch(/button:focus-visible[^\{]*\{[^}]*outline:\s*3px solid var\(--cyan\)[^}]*outline-offset:\s*3px/s, "focus-visible 3px cyan rule missing");
requireMatch(/@media \(prefers-reduced-motion:reduce\)[\s\S]*transition:none!important/, "reduced-motion transition suppression missing");
requireMatch(/\.top-actions button,\.mobile-menu,\.mobile-search\{height:44px;min-width:44px;/, "top/mobile target below 44px");
requireMatch(/\.game-identity select\{min-height:44px;/, "version select target below 44px");
requireMatch(/\.hero-search button\{height:44px;width:44px;/, "search filter target below 44px");
requireMatch(/\.profile-add\{width:100%;min-height:44px;/, "profile add target below 44px");
requireMatch(/\.view-toggle button\{[^}]*width:44px;min-height:44px;/, "view toggle target below 44px");

for (const label of ["Mods & contenus", "Mes profils pour ce jeu", "Créer", "Guides", "Activité", "Bibliothèque", "Recherche globale", "Droits des jeux", "Aucune demande réelle n’est envoyée dans ce prototype.", "NO_RESPONSE ≠ autorisation", "Demander le support d’un jeu", "Brouillon de demande — non envoyé", "Vérifier le canal avant toute demande", "CONTACT_VERIFIED", "REQUEST_READY", "Outbound réel indisponible", "Démonstration · non reçue", "Réponse éditeur reçue — Aetherlands", "Revue juridique requise — Project Meridian", "Confiance, informations légales et transparence.", "Prototype noindex — aucun texte juridique final n’est simulé.", "Comprendre MODARYX sans deviner.", "Documentation finale : PREUVE MANQUANTE"]) {
  if (!app.includes(label)) fail("canonical label missing: " + label);
}
if (!app.includes("Configurations enregistrées de mods, versions et réglages.")) {
  fail("locked game-profile microcopy missing");
}

for (const [needle,message] of [
  ['<html lang="fr">',"prototype document language must be fr"],
  ['<meta name="robots" content="noindex,nofollow,noarchive" />',"prototype noindex metadata missing"],
  ['<title>MODARYX V2 — Prototype Living Threshold</title>',"prototype title missing"],
]) {
  if (!indexHtml.includes(needle)) fail(message);
}
if (indexHtml.includes('<html lang="en">')) fail("English document language regression");
console.log("DOCUMENT_LANG fr");
console.log("DOCUMENT_ROBOTS noindex,nofollow,noarchive");
console.log("DOCUMENT_TITLE MODARYX V2 — Prototype Living Threshold");
if (!app.includes("document.title=routeTitle;")) fail("SPA route title contract missing");
if (!app.includes('active+" — MODARYX"')) fail("SPA route title fallback missing");
console.log("ROUTE_TITLE_CONTRACT_OK");

const vars = {};
for (const match of css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) vars[match[1]] = match[2];

function luminance(hex) {
  const rgb = [1,3,5].map(i => parseInt(hex.slice(i, i+2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  const hi = Math.max(x,y), lo = Math.min(x,y);
  return (hi + 0.05) / (lo + 0.05);
}
function assertContrast(name, fg, bg, min=4.5) {
  const ratio = contrast(fg,bg);
  console.log("CONTRAST", name, ratio.toFixed(2));
  if (ratio < min) fail(name + " contrast " + ratio.toFixed(2) + " < " + min);
}

for (const key of ["--bg","--text","--muted","--cyan","--cyan-2","--teal","--violet"]) {
  if (!vars[key]) fail("missing color token " + key);
}
assertContrast("primary text", vars["--text"], vars["--bg"]);
assertContrast("muted text", vars["--muted"], vars["--bg"]);
assertContrast("cyan action", vars["--cyan"], vars["--bg"]);
assertContrast("compatibility chip", "#061510", vars["--teal"]);
assertContrast("primary gradient cyan", "#03131c", vars["--cyan"]);
assertContrast("primary gradient blue", "#03131c", vars["--cyan-2"]);
assertContrast("primary gradient violet", "#03131c", vars["--violet"]);

console.log("PASS_V2_LIVING_THRESHOLD_STATIC_A11Y");
