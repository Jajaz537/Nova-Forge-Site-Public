# MODARYX V2 — Registre maître anti-contamination du code

**Date : 2026-10-03**
**Statut : EN COURS — registre maître avant frontend V2**

Ce document consolide les phases 1 à 8 de l'audit exhaustif du dépôt.

## 1. Règle absolue

Aucun fichier V1 n'entre dans le runtime V2 par défaut.

Toute réutilisation doit être :
1. explicitement classée ;
2. extraite ou adaptée si nécessaire ;
3. couverte par un test ;
4. importée par allowlist.

## 2. Blacklist runtime V2 — interdiction directe

### Service Worker / shell
- `/sw.js`
- `assets/shell.js`

### Renderers / UI JS legacy
- `assets/app.js`
- `assets/catalog.js`
- `assets/search.js`
- `assets/community.js`
- `assets/creator-studio.js`
- `assets/downloads.js`
- `assets/verify.js`
- `assets/json-schema-lite.js`
- `assets/profiles.js`
- `assets/project-hub.js`
- `assets/nova-premium-hd.js`
- `assets/living-world.js`
- `assets/living-world-visual-growth.mjs`
- `assets/real-world-sync.mjs`

La logique utile de certains fichiers peut être extraite, mais les fichiers eux-mêmes ne sont pas importables par V2.

### CSS legacy
Interdiction de charger directement :

- `assets/site.css`
- `assets/tokens.css`
- `assets/nova-premium-hd.css`
- `assets/nova-premium-hd-secondary.css`
- `assets/modaryx-foundations.css`
- `assets/modaryx-cinematic-system.css`
- `assets/modaryx-home-cinematic.css`
- `assets/modaryx-home-finishline.css`
- `assets/modaryx-pages-finishline.css`
- `assets/modaryx-platform-refinement.css`
- `assets/modaryx-premium-refinement.css`
- `assets/modaryx-search-cinematic-fix.css`
- `assets/modaryx-studio-cinematic-fix.css`
- `assets/modaryx-community-finishline.css`
- `assets/catalog.css`
- `assets/creator-studio.css`
- `assets/profiles.css`
- `assets/project-hub.css`
- `assets/search.css`
- `assets/official.css`
- `assets/living-world.css`
- `assets/living-world-visual-growth.css`
- `assets/real-world-sync.css`
- `assets/verify-picker.css`

### Pages/templates
Toutes les pages HTML V1 sont interdites comme templates/runtime de la V2.

Cela comprend notamment :
- `index.html`
- `catalog.html`
- `search.html`
- `community.html`
- `creator-studio.html`
- `profiles.html`
- `project*.html`
- `games/index.html`
- hubs/guides GTA VI et RDR2
- pages Security/Verify/Downloads/Docs/Ecosystem
- `404.html`

### Build / QA V1 interdits comme pipeline V2
- `qa/build-games-index.py`
- `qa/run-final-source-validation.py`
- `qa/check-site.py` comme gate V2 global
- `qa/check-anti-oubli-current.cjs` comme gate V2
- anciens checks 23 routes comme validation V2
- anciens Premium HD / finishline proofs comme validation V2

### Données / manifests à ne pas consommer directement
- `data/search-index.json`
- `domain-cutover.json`
- `public-build.json`
- `public-status.json`
- `downloads.json`
- `site.webmanifest` comme manifest V2 final
- `sitemap.xml` comme sitemap V2 final

## 3. Blacklist identité / assets

Interdiction V2 directe :

- `assets/nova-mark.svg`
- `assets/nova-mark-192.png`
- `assets/nova-mark-512.png`
- `assets/nova-kingdom-panorama.svg`

Candidats non autorisés automatiquement :

- `assets/modaryx-wolf-dragon-hero.webp`
- `assets/modaryx-world-portals.webp`
- `assets/modaryx-realm-vista-reduced.webp`
- `assets/forge-field.svg`
- `assets/living-world/*`
- `favicon.svg` tant que l'identité V2 finale n'est pas approuvée

## 4. Namespaces interdits pour nouveau code V2

Nouveau code V2 ne doit pas introduire :

- localStorage `nova-forge:*`
- variables CSS `--nova-*`
- nouveaux schémas `urn:nova-forge:schemas:*`
- routes `project-*.html`
- classes `.nova-topbar`
- classes V1 génériques importées depuis anciennes feuilles.

Les anciens contrats v1 gardent leurs identifiants pour compatibilité.

## 5. Allowlist logique réutilisable — sous adaptation/tests

### Security / backend
- API security
- Auth0/OAuth PKCE
- session hashing/cookies
- server-side permissions
- Turnstile
- moderation receipts/appeals
- artifact trust
- signature verification
- trusted signer gate
- storage resolver/repair
- integration consent/discovery
- local context/weather normalization

### Domain / client logic à extraire
- catalogue query/filter
- favorites
- saved searches
- search local-first
- Creator draft validation
- community local draft contracts
- distribution fail-closed
- SHA-256 verifier
- Reality Context Engine

Aucune de ces capacités ne doit être réutilisée via import du renderer V1.

## 6. Contrats v1 compatibles mais non canoniques V2

À conserver comme compatibilité/mapping :

- account-security
- collection v1
- community submission/write v1
- compatibility graph v1
- moderation v1
- public profile v1
- publication receipt v1
- repair/storage v1
- search adapter v1
- smart profile v1
- Universal Mod Manifest v1

Règle :
- ne pas modifier rétroactivement ;
- mapper vers contrats V2 ;
- nouveaux IDs MODARYX.

## 7. Données historiques / fixtures

### Fixtures uniquement
- `data/catalog.json`
- `data/compatibility-graph.json`

### Readiness ledger
- `data/integration-readiness.json`

### Brand data candidate
- `data/living-world.json`

### Trust gate réel
- `data/trusted-signers.json`

État actuel du trust store :
- aucun trust anchor publié ;
- aucun signer actif.

## 8. Tooling réutilisable

Peut servir de base technique après adaptation :

- `preview.mjs`
- CodeQL workflow
- méthodes browser CDP/Playwright
- vérifications a11y/reflow
- techniques PWA A→B/offline
- performance limits
- hash validation
- security baseline patterns

## 9. Infrastructure mutante — hors exécution

Ne jamais exécuter automatiquement :

- Cloudflare cutover
- réparation DNS apex
- activation DNSSEC
- désactivation HTTP/3

sans instruction explicite.

Le fichier historique `domain-cutover.json` concernant getnovaforge.com est interdit comme source de vérité actuelle.

## 10. Dépendances entrantes critiques

### sw.js
Chargé/enregistré par :
- `assets/shell.js`

Contrôle ensuite :
- pages V1 ;
- CSS legacy ;
- JS legacy ;
- manifest/data cache.

### shell.js
Chargé par :
- toutes les pages HTML V1 auditée.

### CSS legacy
Chargés directement par :
- chaque page HTML V1 ;
- certains modules living-world chargent aussi dynamiquement leurs CSS.

### Search index V1
Consommé par :
- search.js ;
- checks QA V1.

### Demo catalogue
Consommé par :
- app/catalog/community/project hub ;
- build-games-index ;
- nombreux checks V1.

## 11. Guards V2 obligatoires avant preview

Le futur CI doit échouer si un fichier V2 référence :

- une entrée de blacklist ;
- `nova-forge:`
- `--nova-`
- `project-*.html`
- `modaryx-realm-hero`
- le SW racine historique ;
- un CSS V1 ;
- une PR fallback historique ;
- l'ancienne branche design.

## 12. Isolation du preview

Le preview V2 doit avoir :

- entrypoint propre ;
- scope SW distinct ou aucun SW au premier micro-preview ;
- cache namespace propre ;
- manifest propre ;
- routes propres ;
- aucune page V1 comme fallback ;
- aucun glob d'assets historiques ;
- build/test V2 séparés.

## 13. Couverture dépôt

Preuve : `docs/MODARYX-V2-CODE-AUDIT-COVERAGE-525-20261003.md`

- inventaire : **525 fichiers** ;
- classés : **525 / 525** ;
- non classés : **0** ;
- QA code : **95 / 95 scannés individuellement** ;
- workflows : **29 / 29 scannés individuellement** ;
- assets code : **39 / 39 couverts par blacklist directe ou extraction explicite**.

## 14. Ce qui reste à fermer

Avant de déclarer l'audit anti-contamination totalement fermé :

1. finaliser les références croisées des éléments bloqués ;
2. produire une allowlist d'import V2 explicite ;
3. implémenter un guard CI ciblé anti-contamination ;
4. micro-prouver ce guard sans démarrer le frontend produit ;
5. vérifier Git frais et mettre à jour le checkpoint.

## 15. État

- Blacklist assets code : **TERMINÉ — 39/39 couverts**
- Blacklist globale : **TERMINÉ — draft opérationnel**
- Allowlist logique : **TERMINÉ — draft opérationnel**
- Dépendances critiques : **EN COURS — fermeture finale**
- Couverture dépôt complète : **TERMINÉ — 525/525, 0 non classé**
- Frontend V2 : **BLOQUÉ volontairement**

Aucune autorisation de démarrer le frontend n'est donnée par ce document.
