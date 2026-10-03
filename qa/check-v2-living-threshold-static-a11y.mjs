import { readFileSync } from "node:fs";

const cssPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/styles.css";
const appPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/App.jsx";
const css = readFileSync(cssPath, "utf8");
const app = readFileSync(appPath, "utf8");

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

for (const label of ["Mods & contenus", "Mes profils pour ce jeu", "Créer", "Guides", "Activité", "Bibliothèque", "Recherche globale"]) {
  if (!app.includes(label)) fail("canonical label missing: " + label);
}
if (!app.includes("Configurations enregistrées de mods, versions et réglages.")) {
  fail("locked game-profile microcopy missing");
}

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
