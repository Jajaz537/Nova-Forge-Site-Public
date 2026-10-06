# MODARYX V2 — Manifest d'exécution D1 contrôlé — 2026-10-06

**État : PRÉPARÉ / NON EXÉCUTÉ À DISTANCE**

Ce paquet verrouille l'ordre et l'identité exacte des migrations D1 actuellement présentes, de `0001` à `0015`.

## Garanties

- chaque fichier est lié à son Git blob SHA-1 exact ;
- ordre continu obligatoire ;
- replay SQLite local complet ;
- 32 tables V2 requises présentes après replay ;
- détection de DDL destructif élémentaire (`DROP TABLE`, `DROP COLUMN`, `TRUNCATE`) ;
- aucune commande d'application remote dans le manifest ;
- aucun seed catalogue/fixture ;
- aucun cutover.

## Politique d'application

`DEV remote` : uniquement par action explicite séparée, après preuve exacte de la cible et preuve de sauvegarde/export.

`Production remote` : bloquée tant qu'une application DEV contrôlée + preuve post-apply + voie de restauration n'existent pas, puis exige une approbation explicite distincte.

## Post-apply attendu

Une future exécution autorisée devra prouver séparément :
- schéma D1 en lecture seule ;
- état backend en lecture seule ;
- micro-preuve ciblée lecture/écriture de l'historique propriétaire ;
- preuve de rollback/restauration.

Cette préparation ne ferme pas `real-data-history`, `backend-real` ou `cutover`.
