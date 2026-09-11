# MODARYX MODS — next VF batch

The next targeted batch is **preview runtime QA + responsive visual verification**.

Goals:
- keep the recovered Wolf + Dragon RAR artwork and approved composition exactly as the homepage source of truth;
- verify the Cloudflare Pages preview generated from `site/modaryx-vf-premium-hd-v2` before any production merge;
- check desktop, tablet and mobile behavior on the homepage, Games, GTA 6, RDR2, Catalogue, Creator Studio, Community, Security, Downloads and Documentation;
- run a browser-level performance sanity pass on the preview without weakening CSP, fail-closed distribution states or local-only verification behavior;
- confirm the final visible naming audit remains green after all runtime adjustments;
- repair only exact findings, with targeted micro-proofs after each repair;
- keep PR #11 draft until preview, responsive and runtime checks are green;
- only then prepare PR #11 for final promotion to `main`.
