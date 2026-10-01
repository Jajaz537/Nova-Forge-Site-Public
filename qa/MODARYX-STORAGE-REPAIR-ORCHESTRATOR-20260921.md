# MODARYX — orchestrateur Storage Resolver / Repair — 21 septembre 2026

Statut : **TERMINÉ — orchestration source ciblée ; origines et réseau réels toujours non connectés**.

## Ajout

- `functions/_lib/storage-repair-orchestrator.mjs`
- `qa/check-storage-repair-orchestrator.mjs`

L’orchestrateur compose désormais les deux briques déjà prouvées :

1. transport HTTPS borné + SHA-256 des octets réellement reçus ;
2. décision Resolver / Repair fail-closed.

Les origines actives et immuables éligibles sont observées en parallèle. Les aliases mutables et origines inactives ne sont pas récupérés. Une réparation n’est planifiée que pour une copie dont le manifeste et l’artefact correspondent exactement à l’identité logique attendue.

Une release `withdrawn` ou `revoked` coupe le réseau avant toute récupération et reste non distribuable.

## Limites

- la micro-preuve utilise un transport injecté en mémoire ;
- aucun endpoint Storage réel n’est configuré ;
- aucun Repair Network distant n’est exécuté ;
- aucune copie distante de production n’est revendiquée.

Marker : `PASS_TARGETED_STORAGE_REPAIR_ORCHESTRATOR`.
