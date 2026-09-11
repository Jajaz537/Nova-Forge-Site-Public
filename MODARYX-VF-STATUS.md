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

## Board 01 — companions implementation / exact-art gate

- `companions.html` now provides a dedicated Board-01-derived premium surface with the four locked stages **Bébés / Jeunes / Forgés / Royaux**, the shared-bond sequence and explicit continuity wording.
- `assets/companions-v3.css` provides the responsive dark-fantasy / forged-gold composition for desktop, tablet and mobile.
- Exact Board-01 stage crops are intentionally referenced as `assets/companions-stage-1.webp` through `assets/companions-stage-4.webp`; they are **not** to be replaced by generated or guessed artwork.
- Source staging lives only under `.github/v3-companions-stage-art/`.
- A fail-closed workflow, `.github/workflows/modaryx-v3-companions-stage-art.yml`, now refuses to decode/commit until all four stages each have exactly three ordered Base64 chunks and the exact expected Base64 length.
- Locked exact stage contracts:
  - Stage I: **36,268 Base64 chars / 32,084 bytes / SHA-256 `af8e9596cfe07640f63c49e38784a33a28d4f6633220d256bb07157ee2fe34ae`**.
  - Stage II: **35,224 Base64 chars / 33,970 bytes / SHA-256 `1f942dbadd93ca9e0518a12cfbad45bdcae2bee4bd6c358d17dc692428b2c71e`**.
  - Stage III: **40,084 Base64 chars / 36,950 bytes / SHA-256 `7e7785f2b4e2806b93055652ae002325810e027ccfc7987bac6957846c0797f7`**.
  - Stage IV: **42,620 Base64 chars / 39,364 bytes / SHA-256 `84ee3bc895726dba85f489a42399151b585124d2d58c192a013b3effb3af6b3d`**.
- Only Stage-I source chunk `stage1-part-00.b64` is currently staged in Git, so the workflow must report the source incomplete and skip asset publication until the remaining exact chunks are present.
- **Board 01 has no visual PASS yet.** Exact asset reconstruction plus fresh responsive screenshots and human comparison are still required.

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
