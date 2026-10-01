# MODARYX — moteur de vérification d'attestation — 21 septembre 2026

Statut : **TERMINÉ — moteur de vérification local/provider-neutral ciblé ; signer réel toujours non connecté**.

## Implémentation

- `functions/_lib/attestation.mjs`
- `qa/check-signature-verification-engine.mjs`

Le moteur vérifie une attestation détachée sans disposer de la clé privée :

- payload canonique `MODARYX-ATTESTATION-V1` ;
- liaison à l'identité exacte du sujet et son SHA-256 ;
- empreinte SHA-256 de la clé publique calculée avant vérification ;
- vérification `ES256` et `EdDSA/Ed25519` ;
- refus explicite des clés révoquées ;
- refus des fingerprints divergents ;
- refus des signatures modifiées ou mal encodées ;
- `privateKeyMaterialPresent=false` obligatoire.

La micro-preuve génère des paires de clés éphémères uniquement pour tester le vérificateur. Ces clés ne constituent pas le signer MODARYX de production.

Marker : `PASS_TARGETED_SIGNATURE_VERIFICATION_ENGINE`.

## Limite

Le signer réel, sa clé publique de confiance, la rotation/révocation opérationnelle et une signature d'artefact autorisé restent **EN COURS**. Ce moteur ne déverrouille aucun téléchargement.
