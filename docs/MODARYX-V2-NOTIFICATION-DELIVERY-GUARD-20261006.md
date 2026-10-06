# MODARYX V2 — Delivery email/push fail-closed — 2026-10-06

**État : garde/outbox candidat prêt / envoi réel NON implémenté**

Cette slice prépare uniquement la frontière technique future pour email/push.

Elle ajoute :
- une table outbox V2 versionnée ;
- une évaluation de readiness provider-neutral ;
- un planificateur qui refuse toute mise en file si :
  - le canal est invalide ;
  - la préférence utilisateur n’autorise pas le canal ;
  - la destination n’est pas représentée par un digest SHA-256 ;
  - le provider n’est pas explicitement `CONFIGURED_PRODUCTION_APPROVED` ;
- un endpoint de readiness sans secret.

Aucun provider n’est choisi.
Aucun `fetch` externe n’est implémenté.
Aucune adresse email ni token push brut n’est stocké dans l’outbox.
Aucune migration distante n’est appliquée.

Le blocker strict `notifications-email-push-real` reste **OPEN** jusqu’à :
1. choix explicite du provider ;
2. configuration/secret réel côté serveur ;
3. validation légale/consentement adaptée ;
4. preuve de livraison réelle ;
5. gestion bounce/unsubscribe/retry/révocation selon canal.
