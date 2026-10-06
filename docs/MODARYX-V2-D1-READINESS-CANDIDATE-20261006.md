# MODARYX V2 — Diagnostic D1 read-only — 2026-10-06

**État : candidat read-only / aucune migration appliquée**

Le endpoint `/api/v1/status/d1-readiness` peut déterminer si les groupes de migrations 0001→0007 sont présents dans le binding D1 courant.

Il ne retourne que :
- présence du binding ;
- état de requête ;
- niveau de migration agrégé ;
- nombres attendus / présents / complets par groupe ;
- booléen candidat complet.

Il ne retourne :
- aucun nom de table ;
- aucun SQL de schéma ;
- aucune donnée utilisateur ;
- aucun secret.

La requête est exclusivement `SELECT` sur `sqlite_master`.

Cette slice **ne ferme pas** le blocker données/historique réel : elle supprime seulement l’incertitude sur l’état du D1 courant. Toute application de migration distante reste une action séparée et contrôlée.
