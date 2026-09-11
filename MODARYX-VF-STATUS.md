# MODARYX MODS — VF Premium HD V3 status

## Active recovery state — 2026-09-11

- **Production is the stable rollback and must not be changed without explicit human visual approval.**
- Work is restricted to preview branch `site/modaryx-vf-premium-hd-v3`.
- No merge, cutover or production deployment is authorized.
- The previous homepage visual PASS is **revoked**: the old VF hero was reported visually corrupted in production.
- The RAR `Nova_Forge_5_Nouveaux_Concepts_Loup_Dragon.rar` is the visual source of truth.
- Source boards, in order: Compagnons officiels Loup + Dragon; Site Accueil Loup + Dragon; Portails / Univers Loup + Dragon; OS Public Loup + Dragon; OS Fondateur Loup + Dragon.
- Current priority order: homepage board 02; portals/universe board 03; companions; OS Public; OS Fondateur; remove public-visible internal/debug copy; desktop/tablet/mobile visual validation; only then consider production.
- DNSSEC is frozen pending the IONOS response. Do not modify DS/DNSKEY settings in this site pass.

## Homepage board 02 — current blocker and proof

- `index.html` still renders its central scene through the CSS class `.mx-hero-scene`.
- `assets/modaryx-vf.css` still points desktop/tablet at `assets/modaryx-rar-hero.webp`; this old hero is **not visually approved**.
- The mobile rule at `max-width:720px` currently replaces the scene background with a gradient and drops the Wolf + Dragon image URL entirely. This is a confirmed responsive defect to repair when the exact board-02 asset is wired.
- Do **not** use `.github/rar-art-clean/part-00..03.b64` as a source; that legacy reconstruction is invalid.
- Do **not** use `.github/v3-home-scene/` as a source; that intermediate set is truncated.
- Clean source staging is `.github/v3-home-scene-exact/`.
- Current clean staging proof: **6 parts / 36,000 Base64 characters**.
- Expected exact Base64 length for the target 40,840-byte WEBP: **54,456 characters**.
- Expected target SHA-256: `0e13399167bf0e50ba21aba143a1379b39501265f4254654b7f7d5e1078e5101`.
- Rebuild workflow is fail-closed: it will not decode or commit an asset until the clean source reaches exactly 54,456 Base64 characters, then it additionally verifies 40,840 bytes, RIFF/WEBP integrity, RIFF length and the exact SHA-256.
- Targeted guard proof: GitHub Actions run `34598889195` completed successfully with `EXACT_SOURCE_PARTS=6`, `EXACT_SOURCE_BASE64_CHARS=36000`, `V3_REFERENCE_HOME_SOURCE=INCOMPLETE`; the asset commit step was skipped.
- A repository-history recovery probe is also enabled before chunk reconstruction so an already-committed copy with the exact 40,840-byte/hash identity can be recovered without approximation.

## Locked identity

- Public brand: **MODARYX MODS**
- Descriptor: **Gaming • Mods • Modding Tools**
- OS: **Modaryx OS Public** / **Modaryx OS Fondateur**
- Guide: **Modaryx Guide**
- Domain: **modaryxmods.com**

## Locked visual contract

The five Wolf + Dragon boards from the RAR are authoritative. No generated replacement artwork, approximate silhouette, guessed crop or legacy hero may be treated as a visual PASS. A technical/static PASS never substitutes for fresh human visual validation of desktop, tablet and mobile preview captures.

## Historical technical work — not a current visual PASS

The branch contains prior premium styling, game hubs, Creator Studio, ecosystem, trust/content, catalogue, search, download/verifier and project-hub work with targeted static/functional checks. Those checks may still be useful as regression guards, but all previous claims of final visual approval, responsive visual PASS or production readiness are superseded by the V3 recovery state above.

## Release gate

A new production deployment is allowed only after all of the following are true: board-02 homepage fidelity is visually approved; board-03 portals/universe fidelity is visually approved; companions and both OS surfaces are visually approved; public-visible debug/internal copy is removed; fresh desktop/tablet/mobile preview validation is approved by the user. Until then, production remains unchanged.
