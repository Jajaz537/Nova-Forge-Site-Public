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
- Fresh browser QA run `34612814238` completed successfully for homepage desktop **1440×900**, tablet **1024×768**, mobile **390×844**, plus the existing secondary-page capture set.
- The run passed screenshot dimension, non-blank render and required homepage DOM-marker guards.
- Artifact `modaryx-vf-browser-qa-v3`, id `10268374949`, digest `sha256:714620784f4f9406fdc46976be63d0945e72190bdf235d13ef93fafca3c9360e`, contains the fresh captures.
- **This is still not a visual PASS.** The homepage requires fresh human inspection against board 02 before it can be marked approved.

## Board 03 — portals/universe implementation and current proof

- `ecosystem.html` has now been rebuilt at the top of the page toward the Portails / Univers board rather than the former prototype hero.
- A dedicated preview-only visual layer, `assets/modaryx-portals-v3.css`, implements the board-03 composition family: large `Explorer les univers` hierarchy, six glowing portal arches, premium dark fantasy/gold treatment, a central Stage-I baby Wolf + Dragon scene, six large universe cards and the narrow brand/world band.
- The portal labels are adapted to the current MODARYX public information architecture: Studio, Jeux, Mods, Outils, Communauté and Sécurité.
- The older public/status-oriented ecosystem content is retained below the premium composition for now so functional trust/distribution information is not destroyed before the dedicated public-copy cleanup pass.
- Browser QA was extended with fresh board-03 captures at **1440×900**, **1024×768** and **390×844**, plus dedicated DOM markers for the portal headline, Stage-I companions and six-world section.
- Targeted responsive QA run `34616445291` completed **successfully** at preview head `308aac2ba33214bddcd9095140d11a276ce91750`.
- The run passed Cloudflare preview resolution, responsive screenshot dimensions, non-blank render guards, homepage markers and the new board-03 portal markers.
- Fresh artifact `modaryx-vf-browser-qa-v3`, id `10270366550`, digest `sha256:b0ff66f24e5ff88a741337f0bdfd4246092c9a2dc60a8ee412b0f997aa857551`, contains the responsive proof set.
- **This is not yet a visual PASS.** Board 03 still requires fresh human comparison against the authoritative source board; the central baby pair currently reuses the exact Stage-I board-02 baby scene and therefore must not be claimed as exact board-03 artwork.

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
