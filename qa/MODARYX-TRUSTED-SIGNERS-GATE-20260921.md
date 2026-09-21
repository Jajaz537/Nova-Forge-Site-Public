# MODARYX — registre de signers de confiance — 21 septembre 2026

Statut : **TERMINÉ — gate de trust anchors ciblé ; aucune clé de production publiée**.

## Fichiers

- `schemas/trusted-signer-set.schema.json`
- `data/trusted-signers.json`
- `functions/_lib/trusted-signers.mjs`
- `qa/check-trusted-signers-gate.mjs`

Le registre public courant reste volontairement :

- `state = no-trust-anchor-published`
- `signers = []`

Ainsi, aucune signature ne peut devenir « de confiance » uniquement parce qu'elle est mathématiquement valide.

## Gate de confiance

Une attestation ne passe le gate que si :

- son `keyId` existe explicitement dans le registre actif ;
- l'algorithme correspond ;
- le fingerprint SHA-256 de la clé publique correspond ;
- la clé est dans sa fenêtre de validité ;
- elle n'est pas révoquée ;
- la signature cryptographique liée au SHA-256 du sujet est ensuite valide.

Marker : `PASS_TARGETED_TRUSTED_SIGNER_GATE`.

La micro-preuve utilise une clé éphémère de test uniquement. Aucun trust anchor de production n'est revendiqué.

## Limite restante

Pour fermer réellement la lane signer :

- choisir/provisionner un signer réel ;
- publier la clé publique/fingerprint de confiance ;
- documenter rotation et révocation ;
- signer un artefact autorisé réel ;
- vérifier cette signature indépendamment.

La distribution reste verrouillée tant que ces entrées réelles sont absentes.
