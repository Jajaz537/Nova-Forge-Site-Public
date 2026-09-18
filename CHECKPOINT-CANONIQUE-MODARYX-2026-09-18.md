# CHECKPOINT CANONIQUE — MODARYX — 18 septembre 2026

Ce document remplace les états Git plus anciens pour la reprise du chantier web MODARYX. Il ne constitue ni une promotion production ni une déclaration de VF.

## Git

- Dépôt : `Jajaz537/Nova-Forge-Site-Public`
- Branche distante de la PR #12 : `design/modaryx-premium-hd-20260914-work`
- HEAD distant avant mise à jour documentaire de ce checkpoint : `18ee360ef371d1ee30a1699f51d7b25c473ac41a`
- Worktree isolé : branche locale `security/modaryx-vf-gate-20260918`
- HEAD local avant le commit de ce checkpoint : `082f503`
- Authentification : le push Git HTTPS direct reste indisponible, mais le connecteur GitHub Work authentifié a publié la chaîne en fast-forward, sans force-push.
- Intégrité : le tree distant du candidat `0e3acc1` correspond exactement au tree local attendu `a5599e7d66f61e8dccaf029ed7acde37fd6a409c`.
- Le worktree historique `modaryx-finishline` est divergent et sale ; il n’a pas été modifié.

Commits d’origine conservés sémantiquement dans la chaîne distante :

1. `3144468` — `Add MODARYX static security gate`
2. `12a954f` — `Reconcile MODARYX PWA product identity`
3. `e0d8040` — `Restore the MODARYX local preview server`
4. `bbcc9b3` — `Record the current MODARYX branch preview audit`
5. `105e2e1` — `Map the MODARYX static security gate to ASVS`
6. `082f503` — `Ignore generated Python bytecode`
7. `39a3bd1` — `Checkpoint the MODARYX VF security lane`

L’API GitHub a initialement omis trois fichiers du deuxième commit. Un commit fast-forward correctif, `0e3acc1`, a rétabli les fichiers manquants ; le contrôle de tree final est PASS. Le commit documentaire `18ee360` ajoute uniquement `qa/post-deploy-proof-20260918.json`.

## TERMINÉ avec preuve locale

- Gate source sécurité statique : 17 pages avec CSP stricte, aucun handler/script/style inline, zéro sink DOM dangereux après retrait de `innerHTML` du menu.
- Matrice de couverture ASVS adaptée à la surface statique : `qa/SECURITY-ASVS-COVERAGE.md`.
- Séparation produit dans le manifeste PWA : MODARYX web, aucune recréation de « Modaryx OS ».
- `npm run dev` réparé par `preview.mjs` ; 4 contrôles ciblés couvrent `/`, route propre, asset JS et 404.
- Suite source : **32/32 scripts PASS**, lint PASS, build PASS, 17 pages, 13 scripts et 84 empreintes valides.
- Preview de branche inspecté dans Chromium : 17/17 routes avec un `h1`, un `main`, un footer, aucune image cassée, aucun lien vide anonyme et aucun débordement horizontal au viewport contrôlé.
- Premiers écrans inspectés : accueil Loup/Dragon, Catalogue, Creator Studio, Communauté, Écosystème et Sécurité. Direction graphite/or/bleu cohérente observée.
- Preuve structurée : `qa/preview-visual-structure-20260918.json`.
- Déploiement fonctionnel prouvé : commit `0e3acc1`, URL immuable `https://747e35ca.nova-forge-site-public.pages.dev`.
- Micro-preuves post-déploiement : menu partagé/source identique, identité PWA PASS, serveur local 4/4, structure 17/17, gate sécurité PASS, 35 assertions PWA source PASS.
- Preuve post-déploiement : `qa/post-deploy-proof-20260918.json`.

## EN COURS

- Candidat VF de la PR #12 : branche distante mise à jour et déploiements Pages réussis ; la PR reste brouillon et n’est pas fusionnée.
- Réconciliation finale des preuves : la source statique et le déploiement affecté sont consolidés, mais les validations natives externes restent ouvertes.
- Durcissement CI/CD : trois constats MOYENNE documentés (`actions/checkout@v4`, cutover mutatif possible sur push, workflow HTTP/3-off sur push). Les workflows sont protégés par le harnais et n’ont pas été modifiés sans stratégie dédiée.

## BLOQUÉ

- Paramètres du compte Cloudflare : vérification humaine du navigateur Work.
- Infrastructure gelée : aucun changement SSL global, DNS, DNSSEC, nameserver, IONOS, email ou Cloudflare critique.

## PREUVE MANQUANTE

- Lecteur d’écran natif, zoom natif 200/400 %, Firefox/Safari réels, appareils physiques.
- Cycle PWA réellement hors ligne et mise à jour après nouvelle publication.
- Core Web Vitals représentatifs ; Navigation Timing n’est pas utilisé comme substitut.
- Import/export avec sélecteur et fichier reçus sur un système utilisateur réel.
- Historique Git complet des secrets, paramètres Cloudflare privés, certificat d’origine Full (strict).
- Master Nova Design Intelligence complète de 46+ entrées : NON RÉCUPÉRÉE.

## Environnements

- Preview Loup/Dragon observé : `https://design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev/`
- Preview immuable fonctionnel `0e3acc1` : `https://747e35ca.nova-forge-site-public.pages.dev`
- Preview immuable de la preuve documentaire `18ee360` : `https://bd807b62.nova-forge-site-public.pages.dev`
- Production : `https://modaryxmods.com/` ; elle affiche encore une présentation antérieure et n’est pas déclarée alignée sur le candidat.
- Aucune promotion, fusion de `main` ou modification d’infrastructure effectuée.

## Prochain point exact

Fermer uniquement les preuves externes lorsqu’un environnement adapté devient réellement disponible : lecteur d’écran natif, zoom 200/400 %, Firefox/Safari, appareils physiques, cycle PWA offline/update et mesures LCP/CLS/INP représentatives. Ne pas relancer les preuves autonomes déjà vertes et ne pas substituer une simulation à ces validations.
