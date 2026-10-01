# MODARYX — micro-preuve navigateur des fonctions locales — 19 septembre 2026

Statut : **EN COURS — preuve CI requise avant intégration**.

## But

Valider dans Chromium headless, sur le candidat exact, les fonctions locales déjà livrées sans les confondre avec les services distants absents.

Périmètre ciblé :

- Catalogue : hydratation, filtre, favori local et persistance ;
- Recherche : index local et filtrage ;
- Communauté : collection locale, contribution locale et restauration après rechargement ;
- Creator Studio : brouillon V2 local, verrouillage de distribution et restauration ;
- Vérificateur : validation du fragment SHA-256 invalide puis valide.

Aucun compte, publication distante, modération distante, backend ou distribution réelle n'est simulé.

Cette preuve ne ferme pas l'import/export par vrai fichier utilisateur, qui reste une preuve séparée.

## Résultats réels

Premier run ciblé : `35463958957` — **FAIL ciblé**.

Quatre contrôles étaient déjà verts :

- Catalogue ;
- Recherche ;
- Communauté ;
- Creator Studio.

Échec isolé :

- Vérificateur : `timeout waiting for Page.loadEventFired`.

Cause : le second changement de fragment SHA-256 est une **navigation même-document** ; aucun nouvel événement `Page.loadEventFired` n'est garanti. Le produit n'était pas en défaut.

Correction ciblée :

- le test modifie désormais `location.hash` dans le document courant ;
- le gestionnaire réel `hashchange` du Vérificateur est donc testé directement ;
- aucun fichier produit modifié.

Micro-preuve après correction :

- run `35464005629` — **success / PASS CIBLÉ** ;
- Catalogue : filtre Ember + favori local + persistance ;
- Recherche : résultat Ember depuis l'index local ;
- Communauté : collection locale + avis local + restauration ;
- Creator Studio : brouillon V2 + distribution `locked` / `downloadable=false` + restauration ;
- Vérificateur : fragment invalide puis fragment SHA-256 valide.

PR #31 fusionnée par `033e3227fe9b776c4ca58c022dcceec2dbcc3c2a`.

