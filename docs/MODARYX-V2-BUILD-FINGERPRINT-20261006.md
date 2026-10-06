# MODARYX V2 — Fingerprint de build exact — 2026-10-06

**État : candidat implémenté / preuve preview exact-SHA requise**

Le build V2 génère désormais `/build-info.json` à partir des variables système Cloudflare Pages :
- `CF_PAGES_COMMIT_SHA`
- `CF_PAGES_BRANCH`
- `CF_PAGES_URL`

Fallback CI : `GITHUB_SHA` / `GITHUB_REF_NAME`.

Le fichier public ne contient que :
- schemaVersion ;
- product ;
- commitSha ;
- branch ;
- deploymentUrl public.

Aucun secret, token, client secret, clé météo ou valeur de binding n'est exposé.

Le probe read-only accepte maintenant `MODARYX_EXPECTED_SHA` et refuse le PASS si le SHA déployé ne correspond pas exactement.

Cloudflare Pages fournit officiellement ces variables système au build et les alias de branche sont déterministes. Le workflow ciblé attend donc que l'alias de branche serve exactement le `GITHUB_SHA` avant d'exécuter le probe PRE_CUTOVER.

Aucune mutation distante, aucun provider, aucun DNS et aucun cutover.
