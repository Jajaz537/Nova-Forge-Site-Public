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
