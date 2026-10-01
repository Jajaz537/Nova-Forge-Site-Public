# MODARYX — contrat signature / attestation — 21 septembre 2026

Statut : **TERMINÉ — enveloppe d'attestation source ciblée ; signer réel non connecté**.

## Objectif

Formaliser une preuve cryptographique provider-neutral sans prétendre qu'un signer existe déjà.

Schéma :

- `schemas/signature-attestation.schema.json`

## Invariants

- signature détachée liée à un SHA-256 exact ;
- sujet borné : manifeste, artefact ou publication receipt ;
- identifiant de clé public et empreinte de clé publique ;
- algorithmes explicitement bornés : `ES256` ou `EdDSA` ;
- états de vérification : `unverified | verified | failed | revoked` ;
- une vérification échouée ou révoquée doit porter une raison ;
- `privateKeyMaterialPresent=false` obligatoire ;
- aucune clé privée ne doit apparaître dans le receipt, le manifeste ou le frontend.

## Distribution

Le capability `distribution.artifacts` reste **distribution-locked**.

Ajouter ce contrat ne rend aucun fichier téléchargeable et ne transforme pas un receipt local en preuve d'authenticité.

La fermeture réelle exige encore :

- un signer/attestation service réel ;
- une clé publique de confiance publiée et versionnée ;
- rotation/révocation documentées ;
- preuve d'une signature réelle puis vérification indépendante ;
- artefact autorisé réel.

Checker : `qa/check-signature-attestation-contract.cjs`

Marker : `PASS_TARGETED_SIGNATURE_ATTESTATION_CONTRACT`.
