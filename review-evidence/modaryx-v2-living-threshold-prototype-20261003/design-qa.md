# Design QA — MODARYX V2 Living Threshold

- source visual truth path: `C:\Users\steph\.codex\generated_images\01a1033a-47d2-7910-92b8-05aa89cfb208\exec-197fd322-f242-4a81-a337-91f52572641b.png`
- implementation screenshots: archived by GitHub Actions artifact `modaryx-v2-living-threshold-visual-proof`, run `37157794569`, artifact id `11286254258`
- artifact digest: `sha256:ee91b7e87f9d04a804b49873c0e1ba3249087d7cd05b0165787b8e71cca3a03c`
- desktop screenshot SHA-256: `9cccc32bc23d661d9ea6bd823e51cf7e09d4df9d0805bb132d4e57607ae1f417`
- mobile screenshot SHA-256: `52b0e3762591371b3c8a9b1c4dc038e44bbf80c403a94c4dfd5baa870a11b49c`
- desktop viewport: 1440 × 1024 CSS px, device scale 1
- mobile viewport: 390 × 844 CSS px, device scale 1
- state: Game Hub / `Pour votre version`, plus Catalog and Content Detail interaction checks
- source dimensions: 1488 × 1058 px
- implementation dimensions: desktop 1440 × 1024 px; mobile 390 × 844 px; device scale 1

**Findings**

- [CLOSED] Implementation screenshot export missing
  Location: QA evidence pipeline.
  Evidence: targeted workflow `MODARYX V2 Living Threshold Visual Proof` run `37157794569` completed successfully and archived exact desktop/mobile browser renders plus SHA-256 manifest.
  Result: implementation captures are now reproducible for commit `87245c939c42daf1a0b04879d26039eb4b5daae1`.

- [P2] Normalized source-vs-implementation comparison still missing
  Location: QA evidence pipeline.
  Evidence: source visual remains only at the Work-local path listed above and is not versioned in the repository/artifact.
  Impact: formal fidelity PASS against the selected source image is still not independently reproducible.
  Fix: archive the source visual or an approved normalized reference, then run the side-by-side/overlay comparison.

**Verified in browser**

- Game Hub renders with generated hero and six generated content images.
- Global `Mods & contenus` navigation opens the catalog.
- A content card opens Content Detail.
- `Ajouter à un profil` reaches the visible success state `Ajouté au profil Exploration`.
- Mobile viewport 390 × 844 preserves the core hierarchy and does not create page-level horizontal overflow.
- Console inspection after the corrected reload showed no new runtime error; one stale pre-correction import error remained in the tab history.

**Required fidelity surfaces**

- Fonts and typography: coherent system sans hierarchy; exact source font matching remains unproven.
- Spacing and layout rhythm: principal Game Hub proportions and desktop/mobile hierarchy visually coherent; formal overlay comparison missing.
- Colors and visual tokens: selected 2+3 palette applied; cyan primary, teal compatibility, violet profile states, amber limited to imagery.
- Image quality and asset fidelity: dedicated generated raster assets used; no CSS illustration or legacy visual asset.
- Copy and content: locked labels `Profils de jeu`/`Mes profils pour ce jeu`, microcopy, and `Mods & contenus` preserved.

**Open Questions**

- Human review of the hybrid cyan/violet intensity across all screens.
- Whether the environmental hero should be quieter on Content Detail and Community.

**Implementation Checklist**

1. ~~Export comparable desktop and mobile screenshots.~~ **TERMINÉ — run 37157794569**.
2. Run normalized side-by-side visual comparison once the source reference is archivable.
3. Fix any P0/P1/P2 differences found.
4. ~~Perform targeted contrast and keyboard/touch checks.~~ **TERMINÉ — run 37158374418**.
5. Complete screen-reader/device/human multi-screen validation before any final high-fi declaration.

**Follow-up Polish**

- Consider a dedicated compact mobile profile affordance after human review.
- Revisit typeface selection only after the visual direction is accepted.

final result: blocked — capture + targeted browser a11y closed; normalized source comparison + broader assistive/device/human review remain open


## Rendered accessibility micro-proof

**TERMINÉ — current prototype state / not a full WCAG certification**

Workflow run: `37158374418`  
Candidate commit: `6721a761034a091bf4f4f9eaff6cc7b555a49665`  
Artifact id: `11287195204`

Fresh markers:
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `KEYBOARD_REACHABLE 35 / 35`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`

Static token contrast micro-proof:
- primary text / background: **17.19**
- muted text / background: **7.77**
- cyan action / background: **10.97**
- compatibility chip: **12.00**
- primary gradient cyan: **10.97**
- primary gradient blue: **4.88**
- primary gradient violet: **5.14**

Rendered checks:
- every visible focusable discovered on the desktop Game Hub was reached by keyboard Tab in the targeted run;
- no page-level horizontal overflow at 1440×1024 or 390×844;
- visible mobile interactive targets checked by the browser micro-proof were at least 44×44 px;
- mobile menu target was visible and at least 44×44 px;
- reduced-motion rule and 3 px cyan focus-visible contract were statically verified.

Limit:
this closes the current prototype's targeted keyboard/touch/contrast proof only. It does **not** replace screen-reader testing, device testing, full WCAG audit, source-vs-implementation visual comparison, or human multi-screen review.
