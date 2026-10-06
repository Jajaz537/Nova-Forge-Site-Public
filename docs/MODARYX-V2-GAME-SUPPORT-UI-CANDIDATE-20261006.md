# MODARYX V2 — UI demande de support réelle — 2026-10-06

**État : candidat réel fail-soft**

La page Jeux conserve le brouillon local existant et ajoute un chemin distant uniquement lorsque l'environnement prouve :
- session MODARYX authentifiée ;
- remote writes prêts ;
- clé publique Turnstile disponible.

Le challenge Turnstile est chargé uniquement pour un utilisateur authentifié sur le formulaire ouvert.
L'action est `game-support-request`, identique au contrôle serveur.

Si le backend, D1, la migration ou Turnstile ne sont pas disponibles :
- aucun token n'est inventé ;
- aucun POST n'est simulé ;
- l'UI reste en brouillon local ou affiche l'indisponibilité.

Un succès affiche `REQUESTED` et rappelle explicitement que cela ne vaut aucune permission éditeur.
Les demandes réelles du membre sont relues same-origin quand le backend les fournit.

Cette slice n'applique aucune migration distante et ne contacte aucun éditeur.
