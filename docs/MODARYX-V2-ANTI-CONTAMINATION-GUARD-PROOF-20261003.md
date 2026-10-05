# MODARYX V2 — Micro-preuve du guard anti-contamination

**Date : 2026-10-03**
**Branche :** `audit/modaryx-v2-legacy-boundary-20261003`
**Commit ciblé :** `7dd13b463c58291b686b1b578275b17d5df26d5e`

## 1. Contexte

Après la couverture 525/525 et la fermeture des dépendances entrantes critiques, un guard machine-readable a été ajouté sans créer de frontend V2.

Fichiers :

- `qa/modaryx-v2-anti-contamination-policy.json`
- `qa/check-v2-anti-contamination.mjs`
- `.github/workflows/modaryx-v2-anti-contamination.yml`

## 2. Première tentative

Run GitHub Actions :

- run ID : `37142243867`
- résultat : **FAIL**
- étape : `Self-test guard logic`

Erreur exacte :

- le fixture `project-ember-textures.html` n'était pas détecté.

Cause isolée :

- regex JSON sur-échappées : `\\.html` / `\\.js` au lieu de `\.html` / `\.js`.

Procédure appliquée :

erreur exacte → isolation → correction ciblée → micro-proof.

Aucun full replay.

## 3. Correction ciblée

Seuls les motifs regex du fichier de policy ont été corrigés.

Commit corrigé :

`7dd13b463c58291b686b1b578275b17d5df26d5e`

## 4. Micro-proof frais

Run GitHub Actions :

- run ID : `37142295594`
- job : `V2 contamination guard`
- résultat : **SUCCESS**

Étapes :

- Checkout exact candidate : success
- Record exact candidate : success
- Self-test guard logic : success
- Scan V2 candidate roots : success

Marqueurs de logs :

- `PASS_V2_ANTI_CONTAMINATION_SELF_TEST`
- `READY_V2_ANTI_CONTAMINATION_NO_ROOT`

## 5. Interprétation correcte

### TERMINÉ

Le guard lui-même est micro-prouvé :
- fixture sûre acceptée ;
- shell legacy détecté ;
- route projet legacy détectée ;
- workflow exécutable sur le candidat exact.

### PREUVE MANQUANTE / NON APPLICABLE POUR LE FRONT

`READY_V2_ANTI_CONTAMINATION_NO_ROOT` signifie :

> aucun répertoire frontend V2 candidat n'existe encore.

Cela ne signifie pas :
- PASS frontend ;
- PASS visuel ;
- PASS UX ;
- PASS production ;
- VF.

## 6. Règles couvertes

Le guard bloque notamment dans les racines V2 futures :

- shell/service worker V1 ;
- renderers JS V1 ;
- CSS legacy ;
- namespaces `nova-forge:` ;
- variables `--nova-` ;
- schémas `urn:nova-forge:schemas:` nouveaux ;
- routes `project-*.html` ;
- classe realm legacy ;
- ancienne branche design ;
- getnovaforge.com ;
- assets Nova ;
- imports globaux living-world historiques.

## 7. État

- couverture dépôt : **TERMINÉ — 525/525**
- dépendances entrantes : **TERMINÉ**
- policy machine-readable : **TERMINÉ**
- guard : **TERMINÉ**
- micro-proof guard : **TERMINÉ**
- frontend V2 : **NON COMMENCÉ volontairement**
- high-fi : **BLOQUÉ**
- validation humaine IA : **PREUVE MANQUANTE**

