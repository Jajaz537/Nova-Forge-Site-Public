# MODARYX MODS — VF status

## Locked identity
- Public brand: **MODARYX MODS**
- Descriptor: **Gaming • Mods • Modding Tools**
- OS: **Modaryx OS Public** / **Modaryx OS Fondateur**
- Guide: **Modaryx Guide**
- Domain: **modaryxmods.com**

## Locked visual source
The five Wolf + Dragon boards recovered from the user-provided RAR remain the composition source of truth. Homepage placement must preserve the approved rhythm: header/navigation, editorial copy on the left, kingdom + companion focus in the center, manifesto rail on the right, portal row below, companion progression strip, then the lower ecosystem band. No generated replacement artwork is part of the implementation pass.

## Completed VF milestones
- Premium homepage top rebuilt around the recovered RAR placement.
- MODARYX visible-name audit: PASS after targeted repair.
- Premium multigaming hub added at `games.html`.
- Dedicated SEO/content hubs added at `/gta-6/mods/` and `/red-dead-redemption-2/mods/`.
- Game hubs use the same graphite / forged-gold / kingdom language.
- GTA 6 and RDR2 pages explicitly separate editorial preparation from actual artifact availability; no fake download or compatibility claim.
- Homepage and catalogue expose a `Jeux` entry point; catalogue has an explicit canonical URL.
- Sitemap includes Games, GTA 6 Mods and RDR2 Mods.
- Targeted game-hub link proof: PASS (`MODARYX_GAME_HUB_LINK_PROOF=PASS`).
- Shared premium styling added for functional secondary surfaces.
- Creator Studio now uses the MODARYX premium visual family while preserving its functional form IDs, local-only draft behavior and existing JavaScript pipeline.
- Ecosystem page now uses **Modaryx OS Public**, **Modaryx OS Fondateur** and **Modaryx Guide**, with the explicit rule Public green ≠ Fondateur green.
- Targeted secondary-surface proof: PASS (`MODARYX_SECONDARY_PREMIUM_PROOF=PASS`, `CREATOR_FUNCTIONAL_IDS=PRESERVED`).
- Community, profiles, security and documentation now share the premium graphite / forged-gold / kingdom family and explicit canonicals.
- Their behavioral markers were preserved: `MODARYX_TRUST_COMMUNITY_STYLE_PROOF=PASS`, `BEHAVIORAL_MARKERS=PRESERVED`.
- Community/profile navigation and cross-portal paths are harmonized; forms and scripts remain intact.
- Security and documentation contain explicit **Modaryx Guide** explanation callouts without granting the Guide any automatic authority.
- Targeted trust/content proof: PASS (`MODARYX_TRUST_CONTENT_PROOF=PASS`, `COMMUNITY_PROFILE_FUNCTIONS=PRESERVED`).
- Catalogue now uses the premium family, links Games/GTA 6/RDR2, and keeps all local filter IDs and `catalog.js` behavior intact.
- Targeted catalogue proof: PASS (`MODARYX_CATALOG_PREMIUM_PROOF=PASS`, `CATALOG_FUNCTIONAL_MARKERS=PRESERVED`).
- Search uses the premium family, a canonical URL, harmonized navigation, and direct entries for Games/GTA 6/RDR2.
- Local search index expanded from 9 to 13 entries, including Games, GTA 6 Mods, RDR2 Mods and Documentation/Modaryx Guide; external adapter remains optional.
- Domain/cutover documentation was refreshed to MODARYX and still keeps DNSSEC pending until registrar/parent proof.
- Downloads, local SHA-256 verification, project directory and all three public mini-hubs now use the premium MODARYX family with explicit canonical URLs and harmonized navigation.
- Distribution remains fail-closed (`available=false`, `artifacts=[]`), the verifier remains browser-local, and project identities/favorite controls remain intact.
- Targeted release/project proof: PASS (`MODARYX_RELEASE_PROJECTS_PREMIUM_PROOF=PASS`, `DOWNLOAD_FAIL_CLOSED_MARKERS=PRESERVED`, `VERIFY_LOCAL_SHA256_MARKERS=PRESERVED`, `PROJECT_HUB_IDENTITIES=PRESERVED`).
- Static VF audit repaired two isolated QA findings without broad replay: `robots.txt` now declares the MODARYX sitemap, and the remote-dependency detector distinguishes executable remote loads from schema identifiers/example URLs.
- Targeted static VF audit: PASS on 18 core pages (`MODARYX_STATIC_VF_AUDIT=PASS`, `CANONICAL_SITEMAP_ROBOTS=PASS`, `LOCAL_LINK_AND_ASSET_REFERENCES=PASS`, `STATIC_ACCESSIBILITY_MARKERS=PASS`, `FUNCTIONAL_MARKERS=PRESERVED`).
- Static CSS/JS footprint measured by the audit: **196,889 bytes** total; largest scanned asset `assets/nova-premium-hd.css` at **26,304 bytes**; executable remote asset dependencies: none.

## Still required before merge
- Finish the homepage art treatment using the recovered RAR as the source, not generated replacement imagery.
- Run responsive desktop/tablet/mobile visual checks and browser-level performance pass.
- Re-run the final visible naming audit after the RAR homepage treatment.
- Do not merge PR #11 until the complete VF is coherent and proven.
