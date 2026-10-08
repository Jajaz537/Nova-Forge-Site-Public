# MODARYX V2 — Historique serveur propriétaire — 2026-10-06

**État : candidat prouvé localement / migration distante OPEN**

La slice prépare un journal append-only pour les données V2 :
- lecture uniquement pour le propriétaire authentifié ;
- révision monotone par entité ;
- lien vers l’entrée précédente ;
- digest SHA-256 de métadonnées de l’événement ;
- liste de champs modifiés **sans stocker leurs valeurs** ;
- aucun identity sub brut renvoyé au navigateur.

Producteurs raccordés en fail-soft :
- écriture profil ;
- préférences de notifications.

Le write métier principal reste prioritaire : si la table historique n’existe pas encore à distance, un historique indisponible ne doit pas annuler le profil ou les préférences déjà validés.

L’UI Compte > Données & historique affiche uniquement des entrées réellement retournées ; sinon elle montre un état vide/indisponible honnête.

Cette slice **ne ferme pas** `real-data-history` :
- migration remote non exécutée ;
- catalogue V2 réel non peuplé ;
- pipeline de données production non prouvé ;
- export/restauration non implémentés.
