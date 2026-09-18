# CHECKPOINT CANONIQUE — MODARYX — 18 septembre 2026

Ce document remplace les états Git plus anciens pour la reprise du chantier web MODARYX. Il ne constitue ni une promotion production ni une déclaration de VF.

## Git

- Dépôt : `Jajaz537/Nova-Forge-Site-Public`
- Branche distante de la PR #12 : `design/modaryx-premium-hd-20260914-work`
- HEAD distant vérifié : `7454e13a80e78c6680b1499ee115bdd697ec2e0a`
- Worktree isolé : branche locale `security/modaryx-vf-gate-20260918`
- HEAD local avant le commit de ce checkpoint : `082f503`
- État avant checkpoint : propre ; branche locale en avance de 6 commits sur le HEAD distant
- Push : **BLOQUÉ** — Git HTTPS ne dispose d’aucun identifiant dans cet environnement (`could not read Username for 'https://github.com'`)
- Le worktree historique `modaryx-finishline` est divergent et sale ; il n’a pas été modifié.

Commits locaux à conserver, dans l’ordre :

1. `3144468` — `Add MODARYX static security gate`
2. `12a954f` — `Reconcile MODARYX PWA product identity`
3. `e0d8040` — `Restore the MODARYX local preview server`
4. `bbcc9b3` — `Record the current MODARYX branch preview audit`
5. `105e2e1` — `Map the MODARYX static security gate to ASVS`
6. `082f503` — `Ignore generated Python bytecode`

## TERMINÉ avec preuve locale

- Gate source sécurité statique : 17 pages avec CSP stricte, aucun handler/script/style inline, zéro sink DOM dangereux après retrait de `innerHTML` du menu.
- Matrice de couverture ASVS adaptée à la surface statique : `qa/SECURITY-ASVS-COVERAGE.md`.
- Séparation produit dans le manifeste PWA : MODARYX web, aucune recréation de « Modaryx OS ».
- `npm run dev` réparé par `preview.mjs` ; 4 contrôles ciblés couvrent `/`, route propre, asset JS et 404.
- Suite source : **32/32 scripts PASS**, lint PASS, build PASS, 17 pages, 13 scripts et 84 empreintes valides.
- Preview de branche inspecté dans Chromium : 17/17 routes avec un `h1`, un `main`, un footer, aucune image cassée, aucun lien vide anonyme et aucun débordement horizontal au viewport contrôlé.
- Premiers écrans inspectés : accueil Loup/Dragon, Catalogue, Creator Studio, Communauté, Écosystème et Sécurité. Direction graphite/or/bleu cohérente observée.
- Preuve structurée : `qa/preview-visual-structure-20260918.json`.

## EN COURS

- Candidat VF de la PR #12 : les six commits locaux ci-dessus ne sont pas encore sur la branche distante.
- Réconciliation finale des preuves : la source statique est consolidée, mais les validations natives externes restent ouvertes.
- Durcissement CI/CD : trois constats MOYENNE documentés (`actions/checkout@v4`, cutover mutatif possible sur push, workflow HTTP/3-off sur push). Les workflows sont protégés par le harnais et n’ont pas été modifiés sans stratégie dédiée.

## BLOQUÉ

- Push GitHub des commits locaux : authentification Git absente.
- Paramètres du compte Cloudflare : vérification humaine du navigateur Work.
- Infrastructure gelée : aucun changement SSL global, DNS, DNSSEC, nameserver, IONOS, email ou Cloudflare critique.

## PREUVE MANQUANTE

- SHA réellement déployé derrière l’alias de preview : aucun marqueur public ne relie le contenu à un commit Git.
- Lecteur d’écran natif, zoom natif 200/400 %, Firefox/Safari réels, appareils physiques.
- Cycle PWA réellement hors ligne et mise à jour après nouvelle publication.
- Core Web Vitals représentatifs ; Navigation Timing n’est pas utilisé comme substitut.
- Import/export avec sélecteur et fichier reçus sur un système utilisateur réel.
- Historique Git complet des secrets, paramètres Cloudflare privés, certificat d’origine Full (strict).
- Master Nova Design Intelligence complète de 46+ entrées : NON RÉCUPÉRÉE.

## Environnements

- Preview Loup/Dragon observé : `https://design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev/`
- Production : `https://modaryxmods.com/` ; elle affiche encore une présentation antérieure et n’est pas déclarée alignée sur le candidat.
- Aucune promotion, fusion de `main` ou modification d’infrastructure effectuée.

## Prochain point exact

Une fois l’authentification Git disponible, re-vérifier que la branche distante vaut toujours `7454e13`, puis pousser la chaîne locale sur `design/modaryx-premium-hd-20260914-work`. Attendre le déploiement Cloudflare Pages, relever l’URL immuable si disponible, vérifier le marqueur de révision ou comparer un manifeste de build, puis rejouer uniquement les contrôles affectés : menu partagé, manifeste PWA, `npm run dev`, structure des 17 routes et gate sécurité. Ne pas relancer les validations externes déjà classées impossibles dans cet environnement.
