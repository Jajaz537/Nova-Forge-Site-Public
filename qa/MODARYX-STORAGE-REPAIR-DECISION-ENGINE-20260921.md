# MODARYX — moteur décisionnel Storage Resolver / Repair Network — 21 septembre 2026

Statut : **TERMINÉ — logique décisionnelle ciblée ; transport et services distants réels non connectés**.

## Implémentation

- `functions/_lib/storage-repair-engine.mjs`
- `qa/check-storage-repair-decision-engine.mjs`

Le moteur est volontairement pur : il ne contacte aucun miroir, stockage ou réseau. Il reçoit uniquement des observations déjà obtenues par un transport futur.

## Résolution

Une origine n'est `verified` que si :

- elle est active ;
- elle n'est pas un alias mutable non fiable ;
- le SHA-256 du manifeste correspond exactement ;
- le SHA-256 de l'artefact correspond exactement.

Sinon le moteur échoue avec une raison explicite, notamment `manifest-binding-mismatch`, `artifact-digest-mismatch` ou `no-verified-origin`.

## Réparation

Une réparation devient `repaired / distributable=true` uniquement avec une copie déjà vérifiée dont le digest est exactement celui de l'identité logique attendue.

Les releases `withdrawn` et `revoked` restent toujours non distribuables.

Marker : `PASS_TARGETED_STORAGE_REPAIR_DECISION_ENGINE`.

## Limite

Le resolver distant, le transport vers les origines, la récupération des octets et l'écriture/réparation réelle restent **EN COURS**. Aucun réseau distant n'est simulé.
