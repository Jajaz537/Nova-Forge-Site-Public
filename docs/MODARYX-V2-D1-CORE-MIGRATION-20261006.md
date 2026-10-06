# MODARYX V2 — Migration D1 core model — 2026-10-06

**État : migration créée et prouvée localement / NON appliquée à distance**

La migration `0004_modaryx_v2_core_model.sql` matérialise le stockage des objets V2 sans supprimer ni renommer les tables existantes.

La micro-preuve :
- exécute 0001 → 0004 sur SQLite en mémoire ;
- vérifie les 14 tables V2 ;
- vérifie que les tables V1 existent toujours ;
- vérifie les contraintes fail-closed (retrait/révocation, receipts, consentement, relations uniques).

Aucun seed de production, aucune fixture catalogue et aucune migration remote ne sont exécutés.

Le blocker `real-data-history` reste OPEN jusqu'à une application DEV contrôlée, un pipeline de lecture/écriture réel et des preuves d'historique/rollback.
