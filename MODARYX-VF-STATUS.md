# MODARYX MODS — VF Premium HD V3 status

## Active preview state — 2026-09-11

- **Production remains the stable rollback and must not be changed without explicit human visual approval.**
- Work is restricted to preview branch `site/modaryx-vf-premium-hd-v3`.
- No merge, cutover or production deployment is authorized.
- The five Wolf + Dragon boards from `Nova_Forge_5_Nouveaux_Concepts_Loup_Dragon.rar` remain the visual source of truth.
- Source boards, in order: Compagnons officiels Loup + Dragon; Site Accueil Loup + Dragon; Portails / Univers Loup + Dragon; OS Public Loup + Dragon; OS Fondateur Loup + Dragon.
- Priority order remains: homepage board 02; portals/universe board 03; companions; OS Public; OS Fondateur; remove public-visible internal/debug copy; desktop/tablet/mobile visual validation; only then consider production.
- DNSSEC remains frozen pending the IONOS response. Do not modify DS/DNSKEY settings in this site pass.

## Locked companion-age rule

- Main site appearances of the Wolf + Dragon must be **Stage I — babies**.
- This applies to the homepage hero, portals/universe foreground pair, companion cards and the principal OS visuals implemented on the public site.
- Stages II–IV may appear only where the interface explicitly demonstrates growth/progression, for example the `ILS GRANDISSENT AVEC TOI` progression strip.
- Any older/young/adult/royal pair used as the main site pair is not acceptable for visual approval.

## Homepage board 02 — recovered baby scene and current proof

- The previous corrupted legacy hero remains revoked and must not be reintroduced.
- An exact Stage-I baby scene derived from the board-02 source has now been rebuilt on the preview branch as `assets/modaryx-home-babies.webp`.
- Rebuild contract: **8 staged Base64 parts / 93,280 characters / 69,960 decoded bytes / valid RIFF-WEBP**.
- Locked asset SHA-256: `2e1aa635fae4f6ea882e153db2ee096fb345d8560f5ba67e033580e5384a9f1e`.
- The rebuild workflow validates byte length, RIFF/WEBP integrity, RIFF container length and the exact SHA before committing the asset.
- `assets/modaryx-vf.css` now uses `modaryx-home-babies.webp` for desktop, tablet and mobile hero scenes; the former mobile rule that dropped the animals has been removed.
- The hero was subsequently tightened toward board 02: reduced hero height, reduced oversized heading scale and reduced excess vertical spacing while preserving the exact baby artwork.
- The latest preview branch head used for responsive browser QA is `85cb6c24704525d00d39ade0182d399de34dff7b`.
- Fresh browser QA run `34612814238` completed successfully for homepage desktop **1440×900**, tablet **1024×768**, mobile **390×844**, plus the existing secondary-page capture set.
- The run passed screenshot dimension, non-blank render and required homepage DOM-marker guards.
- Artifact `modaryx-vf-browser-qa-v3`, id `10268374949`, digest `sha256:714620784f4f9406fdc46976be63d0945e72190bdf235d13ef93fafca3c9360e`, contains the fresh captures.
- **This is still not a visual PASS.** The homepage requires fresh human inspection against board 02 before it can be marked approved.

## Board 03 — next active implementation target

- `ecosystem.html` is still a prototype-style public ecosystem page and is not yet faithful to the Portails / Univers board.
- The target composition is the board-03 cinematic portals scene: large `Explorer les univers` hierarchy, multiple glowing portal arches, central Stage-I baby Wolf + Dragon pair, six large universe cards and the premium dark fantasy/gold visual language.
- The current public/debug-oriented ecosystem copy may be preserved below the premium composition until the later dedicated cleanup pass; do not destroy functional status surfaces broadly while the visual rebuild is in progress.
- Board-03 work must remain on the V3 preview branch and must not be treated as visually approved without fresh responsive captures and human comparison to the source board.

## Public-visible prototype/debug copy already identified

The current homepage and ecosystem surfaces still expose implementation-oriented wording such as browser analysis, Bridge OS status, fail-closed labels, local-profile state, backend connection state and source/build status language. These remain queued for the dedicated public-copy cleanup pass after the five main visual surfaces are rebuilt. Preserve functional IDs/data attributes until each surface is deliberately redesigned.

## Locked identity

- Public brand: **MODARYX MODS**
- Descriptor: **Gaming • Mods • Modding Tools**
- OS: **Modaryx OS Public** / **Modaryx OS Fondateur**
- Guide: **Modaryx Guide**
- Domain: **modaryxmods.com**

## Locked visual contract

The five Wolf + Dragon boards are authoritative. No generated replacement artwork, approximate silhouette, guessed crop or legacy hero may be treated as a visual PASS. A technical/static PASS never substitutes for fresh human visual validation of desktop, tablet and mobile preview captures.

## Historical technical work — not a current visual PASS

The branch contains prior premium styling, game hubs, Creator Studio, ecosystem, trust/content, catalogue, search, download/verifier and project-hub work with targeted static/functional checks. Those checks may still be useful as regression guards, but all previous claims of final visual approval, responsive visual PASS or production readiness remain superseded by the V3 recovery/rebuild state above.

## Release gate

A new production deployment is allowed only after all of the following are true: board-02 homepage fidelity is visually approved; board-03 portals/universe fidelity is visually approved; companions and both OS surfaces are visually approved; public-visible debug/internal copy is removed; fresh desktop/tablet/mobile preview validation is approved by the user. Until then, production remains unchanged.
