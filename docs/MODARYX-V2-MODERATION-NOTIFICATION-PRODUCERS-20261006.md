# MODARYX V2 — Producteurs notifications modération — 2026-10-06

**État : candidat implémenté / migration distante et email/push OPEN**

Deux événements serveur réels sont reliés au centre in-app :
- décision de modération ;
- issue de recours.

Le destinataire est résolu depuis le profil auteur de la soumission. L'événement pointe vers `/community` et n'invente aucune notification si l'identité auteur n'est pas résolue.

La décision de modération est écrite **avant** la notification. Une table notification absente ou indisponible ne doit jamais annuler ni corrompre la décision principale : la notification est un side-effect fail-soft.

Aucun email/push, aucun événement rights éditeur et aucun provider externe ne sont simulés.
