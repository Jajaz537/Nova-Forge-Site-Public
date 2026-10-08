# MODARYX V2 — R3 CSS performance reduction — targeted handoff

Status: EN COURS / PREUVE MANQUANTE. No budget relaxation, no production action.

## Exact evidence
- R3 PR #292, last tested SHA `85e3c0de924568c296ad7a25716d59b5ee993420`.
- Preview Root Proof run `37852922912`: success (candidate proof, not production).
- Production Candidate Root Proof run `37852922963`: success (candidate proof, not production).
- Performance Candidate Proof run `37852922775`: failure at CSS bundle assertion.
- `qa/check-v2-performance-candidate-browser.mjs`: `CSS gzip 47511 > 22000` (bytes; gzip level 9; extracted built entry CSS).
- Vite build reports entry CSS 296.59 kB uncompressed / 48.15 kB gzip (its compression reading differs from contract runner's level-9 reading). Do not mix these measurements.
- `v2/src/main.jsx` statically imports `styles.css`, `product-blue-violet.css`, `readability-polish.css`, `premium-editorial.css`, `premium-reconciliation.css`, `premium-reconciliation-r3.css` through `r19.css`, and `premium-vf-architecture.css`.

## Targeted method (candidate only)
1. Fresh checkout of PR #292 commit; `cd v2 && npm ci && npm run build`. Preserve byte-identical baseline and output hashes.
2. Measure each source CSS size and enumerate selectors/declarations by cascade order, media queries, specificity and `!important`. Flag genuinely overridden/dead declarations; do not infer dead selectors from unrendered screens alone.
3. Use CSS AST and rendered-route coverage together. Review 143 screen states in desktop/mobile, plus reduced motion and keyboard focus. Keep accessibility selectors, consent/privacy, demo honesty, legal rights and error/empty states.
4. Consolidate only provably superseded declarations. For every small patch: rebuild, measure entry CSS level-9 gzip bytes, run the smallest relevant browser proof, and compare screenshots for visual regressions. Record SHA, delta, and tests.
5. Preserve threshold **22,000 bytes**. Do not increase it, substitute an alternate measurement, or claim PASS because one asset was split: account for all CSS needed for first render and regressions caused by deferral.
6. If genuine feature/CSS architectural restructuring is required to reach 22k, keep the gate BLOQUÉ until owner visual review and fresh proof for all affected routes; do not remove functionality or silently degrade desktop/mobile aesthetics.

## Safety and handoff
- No merge, main, DNS, production resources, payments, provider activation or cutover.
- Do not overwrite other branches or parallel work. Revalidate canonical branch and this PR before writes.
- Current performance gate: **BLOQUÉ**. Visual owner acceptance: **PREUVE MANQUANTE**. Legal/commercial gates independent.

## Source-only scan — 2026-10-09 (read-only GitHub)
The isolated `v2/src/premium-vf-architecture.css` source has 36,292 text characters at the inspected ref. Heuristic repeated-selector candidates include `.community>.community-board` (5), `.account-center>.account-shell` (5), `.community>.community-tabs` (4), and `.account-center .account-nav` (4). These occurrences may belong to different media contexts or deliberate overrides: **not safe-deletion evidence**.

Seven variable names occur once **inside this file**: `--vf-night-soft`, `--vf-violet`, `--vf-gold`, `--vf-ink`, `--vf-shadow`, `--vf-r3-panel-strong`, `--vf-r3-line-warm`. They may be referenced by other CSS files and must not be deleted without a cross-file scan.

Local Git clone unavailable in this execution environment (DNS resolution for github.com failed). This source-only scan is **TERMINÉ**, but local build, complete cross-file inventory, CSS removal and visual regression are **PREUVE MANQUANTE**. No bundle size improvement is claimed.
