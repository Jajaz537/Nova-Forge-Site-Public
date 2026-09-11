# MODARYX MODS — VF Premium HD V3 status

## Active preview state — 2026-09-11

- **Production remains the stable rollback and must not be changed without explicit human visual approval.**
- Work is restricted to preview branch `site/modaryx-vf-premium-hd-v3`.
- No merge, cutover or production deployment is authorized.
- The five Wolf + Dragon boards from `Nova_Forge_5_Nouveaux_Concepts_Loup_Dragon.rar` remain the visual source of truth.
- Source boards, in order: Compagnons officiels Loup + Dragon; Site Accueil Loup + Dragon; Portails / Univers Loup + Dragon; OS Public Loup + Dragon; OS Fondateur Loup + Dragon.
- Priority order remains: homepage board 02; portals/universe board 03; companions; OS Public; OS Fondateur; remove public-visible internal/debug copy; desktop/tablet/mobile visual validation; only then consider production.
- DNSSEC remains frozen pending the IONOS response. Do not modify DS/DNSKEY settings in this site pass.

## Locked companion progression + character continuity

- The official progression is **I — Bébés → II — Jeunes → III — Forgés → IV — Royaux**.
- The story starts with the Wolf + Dragon at **Stage I — Bébés**. Homepage/initial present-day appearances must therefore begin with the baby pair.
- The companions then grow **progressively as the user/story advances**. Later surfaces may show Stages II–IV only when their place in the narrative warrants that evolution.
- No random age jump is acceptable: an older/forged/royal pair must never appear earlier merely because a source board depicts them older.
- Conversely, later-stage surfaces must not be forced back to babies when the intended sequence has already advanced; continuity takes precedence over a one-age-everywhere rule.
- The recurring **main character/personage must not be forgotten**. Its visual/story presence must remain coherent alongside the Wolf + Dragon wherever the authoritative composition or narrative calls for it.
- Do not invent a new character design to satisfy this rule. Reuse/derive only from authoritative board/source material once identified clearly.

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

## Board 01 — companions implementation / exact-art proof

- `companions.html` provides a dedicated Board-01-derived premium surface with the four locked stages **Bébés / Jeunes / Forgés / Royaux**, the shared-bond sequence and explicit continuity wording.
- `assets/companions-v3.css` provides the responsive dark-fantasy / forged-gold composition for desktop, tablet and mobile.
- Exact Board-01 stage crops are published only as `assets/companions-stage-1.webp` through `assets/companions-stage-4.webp`; generated or guessed replacements remain forbidden.
- Source staging lives only under `.github/v3-companions-stage-art/` and is validated fail-closed before any asset commit.
- Locked **HD 520 px / Q75** contracts now proven natively by workflow:
  - Stage I: **36,268 Base64 chars / 27,200 bytes / SHA-256 `e33e75f1d84f8fce1c712d44ec9867d658aca340df75b8e5576089dd50ef4b74`**.
  - Stage II: **35,224 Base64 chars / 26,418 bytes / SHA-256 `23e74b894c589ac33efa3b084db194d8cd746e1c36d36019612376094c0debfe`**.
  - Stage III: **40,084 Base64 chars / 30,062 bytes / SHA-256 `12f750fe36354ac8c9ff2239f085c34cc68fe2e190111e596fdf97c8cc8ad03a`**.
  - Stage IV: **42,620 Base64 chars / 31,964 bytes / SHA-256 `1b7564a565b2a5ee3a772c8bb5a1e345aa8d087fccbc18900cc7171d3ca2994c`**.
- Stages I–III use three ordered source chunks. Stage IV uses four ordered chunks because the middle 15,000-character source block is intentionally split into two 7,500-character pieces to avoid connector truncation; concatenation still yields exactly 42,620 Base64 characters.
- Targeted exact-art run `34624861467` completed **successfully** and emitted `MODARYX_BOARD01_STAGE_1=PASS` through `MODARYX_BOARD01_STAGE_4=PASS`, plus `MODARYX_BOARD01_ALL_STAGES=PASS`.
- The validated assets were committed by the workflow to the preview branch at commit `4bb1247` (`assets(site): rebuild exact board-01 companion stages`).
- Browser QA has been extended to capture `companions.html` at **1440×900**, **1024×768** and **390×844**, with dedicated DOM markers for all four stages. A technical browser PASS does not constitute human visual approval.
- **Board 01 has no human visual PASS yet.** Fresh responsive screenshots must still be inspected against the authoritative board 01.

## OS Public / Founder isolation rule

- OS Public and OS Founder remain separate from the website preview branch and from each other.
- No new cosmetic/polish change is authorized on either OS visual branch until its targeted native Windows proof is identified and green again.
- Public green never implies Founder green; each edition requires its own fresh proof.
- The final full replay of Public + Founder remains reserved for the very end, only after targeted blockers are green.
- `.NET` remains pinned to **10.0.302** and the byte-locked legacy guard must not be modified.

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
