# MODARYX V2 — Audit exhaustif anti-contamination — Phase 6 CI / QA / migrations

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre inspecté

- `.github/workflows/` : 29 workflows
- `qa/` : scripts de contrôle, browser proofs, générateurs et outils de validation
- `migrations/` : 3 migrations SQL

Aucun workflow Cloudflare n'a été exécuté.
Aucun full replay n'a été lancé.
Aucune migration n'a été appliquée.

## 2. Finding critique — la majorité de la CI visuelle est V1

De nombreux workflows MODARYX sont déclenchés sur l'ancienne branche :

`design/modaryx-premium-hd-20260914-work`

et ciblent :

- les anciennes pages `*.html` ;
- les 23 routes V1 ;
- `assets/**` legacy ;
- le Service Worker actuel ;
- les anciens CSS “Premium HD / finishline” ;
- les anciens hubs et générateurs.

### Exemples

- browser a11y / reflow ;
- Firefox 23 routes ;
- WebKit 23 routes ;
- global visual route ;
- static Premium HD review ;
- catalog/community states ;
- profiles states ;
- project hub states ;
- page states ;
- PWA offline/update/installability ;
- living-world / layered-growth proofs ;
- studio schema state ;
- preview visual capture.

### Classification

**HISTORIQUE / V1 QA**

Leur logique de test peut être réutilisée comme référence, mais leurs routes, sélecteurs et attentes ne doivent pas définir V2.

## 3. Finding critique — run-final-source-validation

`qa/run-final-source-validation.py` exécute automatiquement tous les scripts `check-*`.

### Risque

Si utilisé tel quel pour V2, il relancerait de nombreux contrôles V1 et pourrait :

- imposer d'anciennes routes ;
- imposer l'ancien SW ;
- imposer les anciennes classes/structures ;
- produire un “PASS” sur V1 sans rien prouver sur V2.

### Classification

**À BLOQUER COMME VALIDATEUR V2**

V1 peut le conserver pour maintenance historique.

V2 doit avoir son propre runner de validation.

## 4. Finding critique — build-games-index.py

Ce générateur :

- lit le catalogue de démonstration ;
- génère `games/index.html` ;
- dérive la page depuis `project.html` ;
- injecte des routes `project-*.html` ;
- maintient la structure HTML/CSS V1.

### Classification

**LEGACY BUILD GENERATOR / À BLOQUER POUR V2**

Il ne doit jamais être appelé par le build V2.

## 5. check-site.py

Le checker :

- lance `build-games-index.py --check` ;
- parcourt les pages HTML V1 ;
- vérifie ancres/labels/images ;
- contrôle syntaxe JS actuelle ;
- contrôle `SHA256SUMS.txt`.

### Évaluation

Les principes :
- labels ;
- alt ;
- IDs ;
- liens cassés ;
- syntaxe ;
- digests

sont utiles.

Mais l'implémentation est V1.

### Classification

**À EXTRAIRE / RÉÉCRIRE POUR V2**

## 6. Service Worker / PWA QA

Scripts tels que :

- `check-cache.mjs`
- `check-scalable-cache.mjs`
- `check-pwa-entry.cjs`
- `check-preview-pwa-cycle.mjs`
- `check-pwa-offline-browser.mjs`
- `check-pwa-update-browser.mjs`

sont liés au SW actuel et aux routes V1.

### Classification

**V1 QA / PATTERNS RÉUTILISABLES**

V2 aura besoin de micro-preuves séparées :

- installation SW V2 ;
- old SW → new SW ;
- cache namespace V2 ;
- offline V2 ;
- update A→B ;
- rollback ;
- aucun asset legacy servi.

## 7. Browser proofs

Les scripts browser V1 restent utiles comme modèles techniques :

- Chrome via CDP ;
- Playwright Firefox/WebKit ;
- screenshots ;
- reflow ;
- clavier/focus ;
- states ;
- performance lab.

### Classification

**OUTILLAGE RÉUTILISABLE / SCÉNARIOS À RÉÉCRIRE**

Ne pas conserver :
- anciennes URLs ;
- anciennes classes ;
- nombre fixe de routes ;
- assertions “Premium HD”.

## 8. Tests backend/security

Plusieurs contrôles sont largement réutilisables :

- `check-auth-bff.mjs`
- `check-backend-dev-foundation.mjs`
- `check-dev-provider-readiness.cjs`
- `check-remote-write-endpoints.mjs`
- `check-moderation-publication-engine.mjs`
- `check-runtime-resilience-hardening.mjs`
- `check-signature-attestation-contract.cjs`
- `check-signature-verification-engine.mjs`
- `check-trusted-signers-gate.mjs`
- `check-distribution-trust-chain.mjs`
- `check-storage-repair-*.mjs/cjs`
- `check-storage-transport-primitive.mjs`
- `check-integration-consent-engine.mjs`
- `check-integration-discovery-runtime.mjs`

### Classification

**RÉUTILISABLE APRÈS ADAPTATION DES CONTRATS V2**

Les tests qui vérifient volontairement des IDs `urn:nova-forge:...` restent des tests **de compatibilité v1**, pas des normes V2.

## 9. Anti-oubli historique

`qa/check-anti-oubli-current.cjs` contient des assertions très spécifiques :

- ancienne branche design ;
- 23 routes ;
- anciens checkpoints ;
- anciens SHAs/PRs ;
- marqueurs PASS historiques ;
- états V1.

### Classification

**HISTORIQUE / À BLOQUER COMME GATE V2**

Le nouveau registre :
`docs/MODARYX-V2-ANTI-OUBLI-MASTER-20261003.md`
doit devenir la base du futur gate V2, mais aucun nouveau checker n'est encore implémenté.

## 10. QA qui écrit des fichiers

Plusieurs scripts écrivent des rapports JSON, captures ou fichiers générés.

C'est normal pour une preuve, mais V2 devra distinguer :

- preuve éphémère CI ;
- artifact de test ;
- source versionnée ;
- générateur de production.

### Règle

Aucun script QA V2 ne doit modifier silencieusement les sources du frontend pendant une simple validation.

## 11. Workflows Cloudflare — risque opérationnel

### `cloudflare-modaryx-cutover.yml`

Peut :

- attacher le domaine Pages ;
- modifier les records apex ;
- supprimer A/AAAA ;
- créer CNAME ;
- activer DNSSEC.

### `cloudflare-modaryx-http3-off.yml`

Peut désactiver HTTP/3.

### Règle stricte

**À NE JAMAIS EXÉCUTER sans instruction explicite utilisateur.**

Ces workflows ne sont pas nécessaires à l'audit V2.

### Classification

**INFRA MUTANTE / HORS AUDIT D'EXÉCUTION**

## 12. Cloudflare probe

Le workflow probe est diagnostique, mais dépend d'un secret et de l'environnement réel.

### Classification

**OUTIL DIAGNOSTIC / À REVALIDER**

Pas nécessaire pour l'isolation frontend actuelle.

## 13. Preview workflows — dette historique

Plusieurs workflows de preview utilisent :

- ancienne branche cible ;
- anciennes routes ;
- parfois un fallback vers une ancienne PR de travail.

### Risque

Une preuve visuelle pourrait être prise sur un candidat qui n'est pas V2.

### Décision

Le preview V2 devra résoudre uniquement :

- le SHA exact du candidat V2 ;
- une URL immutable associée à ce SHA ;
- aucune ancienne PR fallback.

## 14. CodeQL

`.github/workflows/codeql.yml` est générique :

- push main ;
- PR main ;
- JavaScript/TypeScript ;
- security-extended.

### Classification

**RÉUTILISABLE**

La V2 devra rester couverte.

## 15. Performance limits

`qa/performance-limits.mjs` est principalement un outil générique de budgets.

### Classification

**À REVALIDER / RÉUTILISABLE**

Les budgets V2 devront être alignés avec le contrat Core Web Vitals déjà documenté.

## 16. Responsive review / text spacing

Les outils QA de reflow/text-spacing sont utiles comme techniques, mais les pages et styles de revue appartiennent à V1.

### Classification

- méthode : **RÉUTILISABLE**
- markup/styles de revue : **À REFAIRE POUR V2**

## 17. update-public-hashes.py

### Nature

Met à jour les hashes publics historiques.

### Risque

Ne doit pas être exécuté automatiquement dans V2 avant définition des artefacts concernés.

### Classification

**À REVALIDER**

## 18. Migrations SQL

### 0001 — dev foundation

Tables :
- profiles ;
- community submissions.

Finding :
- `collections_json` est embarqué dans profile ;
- community limité à discussion/review/comment.

### Classification

**V1 COMPAT / À ÉTENDRE PAR NOUVELLES MIGRATIONS**

Ne pas modifier rétroactivement 0001.

### 0002 — auth sessions

- auth transactions ;
- sessions ;
- hashed state/token usage côté code.

### Classification

**RÉUTILISABLE**

### 0003 — moderation publication

- immutable moderation receipts ;
- decision / appeal / appeal-outcome.

### Classification

**RÉUTILISABLE / À ÉTENDRE SI V2 AJOUTE DE NOUVEAUX TARGETS**

## 19. Règle migrations V2

- ne jamais éditer les migrations déjà appliquées ;
- ajouter `0004+` ;
- migration additive ;
- rollback/compat documentés ;
- collections/teams/releases V2 dans tables dédiées ;
- pas de suppression de colonnes V1 pendant le premier cutover.

## 20. Matrice CI/QA

| Famille | Classification |
|---|---|
| CodeQL | RÉUTILISABLE |
| Backend/security contract tests | RÉUTILISABLE / ADAPTER |
| Browser harness techniques | RÉUTILISABLE |
| Scénarios UI V1 | LEGACY QA |
| 23-route proofs | HISTORIQUE |
| Premium HD / finishline proofs | HISTORIQUE |
| Current SW/PWA proofs | V1 ONLY |
| build-games-index | À BLOQUER V2 |
| run-final-source-validation | À BLOQUER V2 |
| check-site.py | À EXTRAIRE |
| anti-oubli-current | HISTORIQUE |
| Cloudflare mutation workflows | HORS EXÉCUTION SANS AUTORISATION |
| SQL 0001-0003 | V1 COMPAT / NE PAS RÉÉCRIRE |

## 21. Pipeline V2 futur

À créer seulement quand le frontend V2 sera autorisé :

1. `v2:lint`
2. `v2:contracts`
3. `v2:anti-contamination`
4. `v2:a11y-source`
5. `v2:browser-microproof`
6. `v2:pwa-migration-proof`
7. `v2:security`
8. `v2:visual-proof`

Chaque preuve doit cibler le SHA exact V2.

## 22. Gate anti-contamination futur

Échec CI si V2 référence :

- pages V1 ;
- CSS legacy ;
- renderer JS V1 ;
- `sw.js` legacy ;
- namespace localStorage `nova-forge:` ;
- routes `project-*.html` ;
- ancienne branche design ;
- ancienne PR preview fallback.

**État Phase 6 : TERMINÉ pour CI/QA/migrations. Audit global : EN COURS.**
