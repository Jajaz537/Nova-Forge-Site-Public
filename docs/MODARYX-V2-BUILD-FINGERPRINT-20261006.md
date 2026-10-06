# MODARYX V2 — Fingerprint de build exact — 2026-10-06

**État : candidat implémenté / preuve preview immuable exact-SHA requise**

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

Cloudflare Pages fournit officiellement ces variables système au build. Le workflow ciblé lit en **lecture seule** le check GitHub `Cloudflare Pages`, extrait sa **Preview URL hashée immuable**, attend que `/build-info.json` serve exactement le `GITHUB_SHA`, puis exécute le probe PRE_CUTOVER. L'alias de branche n'est plus utilisé comme preuve primaire.

Aucune mutation distante, aucun provider, aucun DNS et aucun cutover.
