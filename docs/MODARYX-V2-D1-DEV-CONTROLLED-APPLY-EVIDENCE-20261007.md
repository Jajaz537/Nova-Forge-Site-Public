# MODARYX V2 — Preuve D1 DEV contrôlée — 2026-10-07

**Statut : TERMINÉ pour l'application DEV distante / aucune preuve production revendiquée**

## Résultat

- source : `128add6e1b39aa072d300befed6641cd16bfef5f`
- run : `37613283219`
- job : `112765470695`
- workflow ops final appliqué : `eaabf029f8e916c40fa05e92c1057400ed7a5c7d`
- cible D1 preview : identifiée et vérifiée par hash
- production D1 : binding absent
- token D1 dédié : utilisé
- Time Travel restore point : capturé
- export pré-apply : réussi
- migrations : `0001 → 0015`
- migrations restantes : zéro
- tables V2 : `32/32`
- backend : schéma D1 ready
- productionPass : `false`
- workflow d'apply : revenu en déclenchement manuel uniquement
- DNS, R2, providers, main, cutover : non modifiés

## Reçu

- artifact : `11479710441`
- artifact SHA-256 : `b1e8455246acff26e2cf4465cad62f8ba14579c4306a1f8ea4e710859044e539`
- export SHA-256 : `d7dabe791e6d42295a65fb9a2928fff019d5756dd93500ebd6e5b8ea72aadc26`
- export bytes : `10199`
- bookmark pré-apply SHA-256 : `5588e4509c58bfd9d05070f0d44b29869520378fb748961d6d59143302960912`
- timestamp pré-apply : `2026-10-07T11:19:28Z`

## Limite

Cette preuve ferme la sous-étape **DEV_REMOTE_APPLY + POST_APPLY_SCHEMA** uniquement.

Elle ne ferme pas :
- `real-data-history` ;
- `backend-real` ;
- aucun blocker production.

Le prochain micro-proof valide doit passer par un vrai write authentifié producteur d'historique propriétaire, puis une lecture owner-scoped correspondante. Une insertion SQL synthétique directe ne comptera pas.
