# MODARYX V2 — Manifest d'exécution D1 contrôlé — état post-apply 2026-10-07

**État : DEV REMOTE APPLIQUÉ ET PROUVÉ / PRODUCTION NON EXÉCUTÉE**

Le manifest reste verrouillé sur la séquence `0001 → 0015`, soit **15 migrations** et **32 tables V2 requises**.

## Preuve DEV contrôlée

- autorisation explicite utilisateur : oui ;
- source canonique appliquée : `128add6e1b39aa072d300befed6641cd16bfef5f` ;
- run : `37613283219` ;
- job : `112765470695` ;
- cible preview D1 : hash SHA-256 attendu et vérifié ;
- binding D1 production : absent ;
- Time Travel pré-apply : capturé ;
- export SQL pré-apply : réussi, **10199 octets** ;
- SHA-256 export : `d7dabe791e6d42295a65fb9a2928fff019d5756dd93500ebd6e5b8ea72aadc26` ;
- migrations `0001→0015` : appliquées ;
- migrations restantes : zéro ;
- tables V2 post-apply : **32/32** ;
- readiness backend : `d1Schema.ready=true` ;
- `productionPass=false` ;
- DNS / main / cutover : inchangés.

Artifact reçu non sensible :
- id : `11479710441`
- SHA-256 : `b1e8455246acff26e2cf4465cad62f8ba14579c4306a1f8ea4e710859044e539`

## Incident et correction ciblée

Le premier run avec le token D1 dédié a échoué **avant mutation** sur :
`No migrations present at /tmp/migrations`.

Cause isolée : `migrations_dir` était résolu relativement au fichier Wrangler placé dans `/tmp`.

Micro-proof read-only :
- run `37613151174` — SUCCESS ;
- cible exacte vérifiée ;
- binding production absent ;
- `wrangler d1 migrations list` voit les 15 migrations `0001→0015`.

Correction appliquée :
- config Wrangler éphémère replacée dans le workspace du repo ;
- workflow d'apply remis en `workflow_dispatch` uniquement après succès.

## Ce qui reste OPEN

La preuve DEV distante ne ferme pas à elle seule `real-data-history`.

Toujours requis :
- **OWNER_HISTORY_TARGETED_READ_WRITE** via le pipeline authentifié réel ;
- preuve production séparée ;
- autorisation production séparée ;
- aucune promotion de données DEV vers production.

Le blocker strict reste OPEN jusqu'à preuve complète correspondante.
