# MODARYX V2 — Notifications in-app candidat — 2026-10-06

**État : stockage/lecture/préférences candidat implémentés ; producteurs réels + email/push OPEN**

La slice ajoute :
- tables D1 V2 pour événements in-app et préférences ;
- lecture authentifiée same-origin ;
- compteur non lu calculé à partir de lignes réelles ;
- marquage lu idempotent ;
- préférences versionnées avec conflit 409 au lieu d'un écrasement silencieux ;
- UI V2 qui n'affiche des notifications réelles que si le backend renvoie réellement des événements.

Ne sont **pas** implémentés :
- producteurs d'événements distants ;
- email ;
- push ;
- badge global hors données réelles ;
- droits éditeurs réels.

La démo droits reste explicitement `Démonstration · non reçue` lorsque l'utilisateur n'est pas authentifié.

Aucune migration remote n'est exécutée par cette change.
