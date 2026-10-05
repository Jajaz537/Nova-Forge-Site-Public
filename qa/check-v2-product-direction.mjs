import { readFileSync } from "node:fs";

const mainPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/main.jsx";
const appPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/App.jsx";
const cssPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/product-blue-violet.css";
const canonPath = "docs/MODARYX-V2-DESIGN-CANON-20261005.md";
const topbarPath = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/canon-topbar.css";

const main = readFileSync(mainPath, "utf8");
const app = readFileSync(appPath, "utf8");
const css = readFileSync(cssPath, "utf8");
const canon = readFileSync(canonPath, "utf8");
const topbar = readFileSync(topbarPath, "utf8");

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL_V2_PRODUCT_DIRECTION", message);
    process.exit(1);
  }
}

const imports = [...main.matchAll(/import\s+["']\.\/([^"']+\.css)["'];/g)].map(m => m[1]);
const productIndex = imports.indexOf("product-blue-violet.css");
const editorialIndex = imports.indexOf("premium-editorial.css");

assert(productIndex >= 0, "product-blue-violet.css import missing");
assert(editorialIndex >= 0, "premium-editorial.css import missing");
assert(productIndex > editorialIndex, "product direction override must load after premium-editorial.css");
assert(!imports.includes("canon-hero.css"), "historical cinematic hero stylesheet must not load in the active product direction");

assert(css.includes("--violet:"), "violet token missing");
assert(css.includes("--cyan-2:"), "blue token missing");
assert(/\.canon-reconciled-hero::before[\s\S]*display:\s*none\s*!important/.test(css), "old cinematic Discover pseudo-hero is not explicitly disabled");
assert(/\.canon-reconciled-hero::after[\s\S]*display:\s*none\s*!important/.test(css), "old cinematic Discover overlay is not explicitly disabled");
assert(/h1,\s*h2,\s*h3[\s\S]*font-family:\s*Inter/.test(css), "product sans-serif heading contract missing");
assert(/\.game-hero\s*\{[\s\S]*background-position/.test(css), "contextual Game Hub banner contract missing");
assert(css.includes("no full-screen marketing hero"), "design rationale marker missing");
assert(css.includes("balanced blue + violet"), "blue/violet balance marker missing");
assert(css.includes("human-selected Aurelian Vale Game Hub canon"), "human-selected Game Hub canon marker missing");
assert(/\.game-hub-page \.hub-layout[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) 336px/.test(css), "desktop Game Hub + profile rail structure missing");
assert(/\.game-hub-page \.content-grid[\s\S]*grid-template-columns:\s*1fr/.test(css), "dense single-column Game Hub content list missing");
assert(/\.game-hub-page \.profiles-rail[\s\S]*position:\s*sticky/.test(css), "desktop profile rail contract missing");
assert(canon.includes("VERROUILLÉ PAR DÉCISION HUMAINE"), "human design canon is not locked");
assert(canon.includes("Mélange équilibré bleu nuit + violet premium"), "canonical blue/violet palette statement missing");
assert(canon.includes("contenus présentés prioritairement en lignes produit denses sur desktop"), "canonical dense desktop list statement missing");
assert(app.includes('const navItems = ["Découvrir", "Jeux", "Mods & contenus", "Collections", "Créateurs", "Communauté"];'), "canonical six-item primary navigation missing");
assert(!app.includes('"Communauté", "Créer"'), "Créer must not return to the primary canon navigation");
assert(!app.includes("<CanonNarrativeLayer/>"), "historical cinematic narrative layer must not render in active Discover");
assert(app.includes('className="demo-cta"'), "canonical Demonstration CTA missing from desktop topbar");
assert(topbar.includes(".top-actions .desktop-utility{display:none}"), "non-canonical desktop utility buttons must stay out of the visible topbar");

console.log("PASS_V2_PRODUCT_DIRECTION");
console.log("PRODUCT_DIRECTION", "human-selected Game Hub, dense desktop list, right profile rail, blue+violet, no full-screen marketing hero");
