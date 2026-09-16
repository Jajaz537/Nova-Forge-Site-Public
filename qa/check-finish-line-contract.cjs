'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];

const profiles = read('profiles.html');
assert.doesNotMatch(profiles, /href="\.\/community\.html"\s+aria-current/);
assert.match(profiles, /aria-current="page">Profils/);
checks.push('Profiles page does not misidentify Community as the current primary destination');

for (const file of ['ecosystem.html', 'games/index.html']) {
  const html = read(file);
  const match = html.match(/<img[^>]+modaryx-world-portals\.webp[^>]+>/);
  assert.ok(match, file);
  assert.match(match[0], /loading="eager"/);
  assert.match(match[0], /fetchpriority="high"/);
}
assert.match(read('qa/build-games-index.py'), /loading=\"eager\" fetchpriority=\"high\"/);
checks.push('Above-fold or near-fold Loup/Dragon portal art receives explicit eager/high priority, including generated games source');

const verify = read('verify.html');
assert.match(verify, /id="verify-file-button"[^>]+for="verify-file">Choisir un fichier/);
assert.match(verify, /id="verify-file-name"[^>]+aria-live="polite">Aucun fichier sélectionné/);
assert.doesNotMatch(verify, /<strong>Fail closed<\/strong>/);
const verifyScript = read('assets/verify.js');
assert.match(verifyScript, /fileName\.textContent = fileInput\.files\?\.\[0\]\?\.name \|\| 'Aucun fichier sélectionné'/);
assert.match(verify, /\.file-picker input:focus-visible\+label/);
checks.push('Verifier exposes a French custom file-picker surface, selected filename status and visible keyboard focus');

const review = read('qa/responsive-review.js');
assert.match(review, /Pseudo-localisation \+35 %|pseudoText|pseudoLocalized/);
assert.match(read('qa/responsive-review.html'), /Pseudo-localisation \+35 %/);
checks.push('Responsive harness can apply bounded pseudo-localization stress and records that mode in measurements');

console.log(JSON.stringify({result:'PASS',scope:'Static finish-line contracts; native rendering requires separate browser evidence',checks},null,2));
