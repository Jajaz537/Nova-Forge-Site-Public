# MODARYX V2 — Demandes de support jeu backend candidat — 2026-10-06

**État : backend candidat prouvé localement / migration distante OPEN**

Cette slice matérialise le parcours réel sans contacter d'éditeur :

- membre authentifié + Turnstile : création d'une demande ;
- déduplication des demandes actives ;
- lecture propriétaire ;
- liste admin ;
- triage admin avec authentification récente ;
- acceptation uniquement lorsque tous les checks sont explicites et verts ;
- acceptation : création atomique d'une baseline sûre + création/réutilisation d'un Rights Case ;
- refus / doublon / abuse : aucun Rights Case ;
- notification in-app fail-soft au membre.

La baseline sûre impose en base :
- `official_assets_allowed = 0` ;
- `partnership_claim_allowed = 0` ;
- `forge_permission_inferred = 0`.

L'acceptation exige :
- GameId explicite ;
- éditeur nommé par l'admin ;
- scopes demandés explicites ;
- surfaces produit explicites ;
- revue existence/doublon/modding/restrictions/faisabilité/sécurité/légal.

Ne sont pas implémentés ici :
- découverte de contact officiel ;
- contact éditeur ;
- outbound ;
- permission/grant ;
- asset officiel ;
- migration D1 distante.

Donc **ACCEPTED_SAFE_BASELINE ≠ autorisation éditeur**.
