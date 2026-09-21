# MODARYX — chaîne de confiance de distribution — 21 septembre 2026

Statut : **TERMINÉ — composition source ciblée ; artefact et signer réels toujours absents**.

Ce lot relie les contrôles qui existaient déjà séparément : descripteur public d’artefact, octets réellement observés, SHA-256 exact, attestation et trust anchor public explicite.

## Ajout

- `functions/_lib/artifact-trust.mjs`
- `qa/check-distribution-trust-chain.mjs`

Le moteur refuse la distribution si la taille ou le SHA-256 divergent. Quand une signature est requise, l’attestation doit viser exactement l’identifiant et le digest de l’artefact, puis passer par le registre de signers de confiance existant.

Une signature mathématiquement valide provenant d’une clé inconnue, expirée ou révoquée reste refusée.

Le cas `signature_status=not-required` n’est accepté que si le contexte appelant indique explicitement `signatureRequired=false`. Il ne peut donc pas servir de contournement implicite du gate.

## Limites

- aucune clé de production n’est ajoutée ;
- aucun artefact public réel n’est créé ;
- `downloads.json` reste verrouillé avec `available=false` et zéro artefact ;
- aucun droit de redistribution n’est déduit de cette preuve.

Marker : `PASS_TARGETED_DISTRIBUTION_TRUST_CHAIN`.
