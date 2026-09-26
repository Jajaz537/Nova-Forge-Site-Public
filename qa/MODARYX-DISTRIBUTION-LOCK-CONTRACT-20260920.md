# MODARYX — verrou de distribution et téléchargements — 20 septembre 2026

Statut : **VERROU LOCAL CIBLÉ ACQUIS — AUCUN ARTEFACT PUBLIC RÉEL**.

## Sources existantes

- `downloads.json`
- `assets/downloads.js`
- `qa/check-download-recovery.cjs`
- `qa/download-recovery-checks.json`
- `schemas/universal-mod-manifest.schema.json`
- `data/integration-readiness.json`

## État de distribution courant

`downloads.json` déclare explicitement :

- `stage = pre-vf`
- `available = false`
- `policy = verified-artifacts-only`
- `artifacts = []`

Les preuves requises avant publication sont :

- identité ;
- intégrité SHA-256 ;
- provenance ;
- signature lorsque requise.

Le contrat de chemin est `same-origin-public-surface-only`.

## Runtime fail-closed

Le runtime téléchargements :

- commence dans un état verrouillé ;
- refuse les chemins hors origine ou avec traversée `..` ;
- exige un SHA-256 lowercase hex de 64 caractères ;
- exige un statut de signature `verified` ou `not-required` ;
- refuse un manifeste sans `available=true` ;
- refuse une liste d'artefacts vide lorsque `available=true` ;
- refuse tout artefact invalide ;
- refuse les identifiants dupliqués ;
- verrouille une copie de manifeste `offline-stale` ;
- précise qu'un navigateur affichant le manifeste n'a vérifié ni les fichiers ni leur signature.

## Recovery

Le checker existant `qa/check-download-recovery.cjs` prouve déjà de façon ciblée que :

- une erreur réseau n'expose aucun artefact ;
- erreur HTTP, JSON invalide ou contrat invalide gardent la distribution verrouillée ;
- une copie stale reste verrouillée ;
- retry et état accessible restent récupérables.

Sa portée reste Node VM : ce n'est pas une preuve native offline, lecteur d'écran ou appareil.

## Universal Mod Manifest

Le schéma universel conserve l'ID historique :

`urn:nova-forge:schemas:universal-mod-manifest:v1`

Il est conservé pour compatibilité/provenance technique, sans fusion de marque.

Le contrat borne :

- droits de redistribution ;
- provenance ;
- SHA-256 des fichiers ;
- état de distribution ;
- release receipt.

Une provenance `verified` exige un receipt ID au niveau schéma, mais un receipt bien formé ne constitue pas à lui seul une attestation cryptographique réelle.

Les états `withdrawn` et `revoked` imposent `downloadable=false`.

## Readiness

La capacité `distribution.artifacts` reste :

`distribution-locked`

Entrées réelles toujours requises :

- artefact autorisé ;
- SHA-256 ;
- provenance ;
- signature lorsque requise.

## Preuve ciblée

Checker :
- `qa/check-distribution-lock-contracts.cjs`

Marker :
- `PASS_TARGETED_DISTRIBUTION_LOCK_CONTRACTS`

## État honnête

- **TERMINÉ — verrou local de distribution ciblé**.
- **TERMINÉ — recovery fail-closed ciblé**.
- **TERMINÉ — sémantique de manifeste ciblée**.
- **BLOQUÉ — téléchargement public réel**, faute d'artefact autorisé + identité + intégrité + provenance + signature lorsque requise.

Aucun téléchargement réel ne doit être annoncé sur la base de cette preuve.
