# MODARYX V2 — Contrat Onboarding, Compte et Profil Créateur

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Principe

MODARYX doit être utile avant toute création de compte.

La connexion devient nécessaire uniquement pour les capacités réellement privées ou distantes.

## 2. Usage sans compte

Accessible sans compte :
- rechercher ;
- consulter jeux et contenus ;
- lire compatibilité/dépendances ;
- consulter collections publiques ;
- consulter profils créateurs publics ;
- lire documentation/sécurité.

Les favoris ou brouillons peuvent rester locaux si la fonction existe.

## 3. Quand demander une connexion

Connexion requise uniquement pour :
- publier ;
- synchroniser des données privées ;
- commenter si backend l'exige ;
- suivre à distance ;
- gérer équipe/studio ;
- recevoir notifications serveur ;
- actions de modération.

Ne pas forcer une connexion pour une simple exploration.

## 4. Onboarding joueur

Étapes facultatives :
- choisir quelques jeux ;
- choisir types de contenus préférés ;
- expliquer collections/profils ;
- expliquer état de compatibilité ;
- présenter la Library.

L'onboarding doit être skippable.

## 5. Onboarding créateur

Étapes :
- identité publique ;
- rôle solo/équipe ;
- jeux ciblés ;
- droits/licence ;
- rappel provenance ;
- premier projet.

Aucune autorité administrative n'est déduite du statut créateur.

## 6. Account vs Profile vs Creator

### Account
Session/authentification.

### Public Profile
Identité visible :
- handle ;
- displayName ;
- bio ;
- liens ;
- avatar.

### Creator
Capacité éditoriale :
- projets ;
- releases ;
- équipe ;
- activité créateur.

Ces concepts restent séparés.

## 7. Privacy defaults

Par défaut :
- Library privée ;
- favoris privés ;
- profils/loadouts privés locaux ;
- brouillons privés ;
- recherches sauvegardées privées.

Le partage demande une action explicite.

## 8. Profil créateur

Afficher :
- identité ;
- bio ;
- équipe/studio ;
- créations ;
- collections ;
- activité utile ;
- liens externes ;
- vérification si réellement supportée.

## 9. Team / Studio

Rôles possibles :
- owner ;
- maintainer ;
- contributor ;
- translator ;
- tester.

Permissions doivent être contrôlées côté serveur.

## 10. Édition du profil

États :
- local draft ;
- authenticated ;
- backend unavailable ;
- anti-abuse unavailable ;
- save pending ;
- saved ;
- error.

Un échec ne doit pas effacer les changements non sauvegardés.

## 11. Session

États :
- anonymous ;
- authenticated ;
- expired ;
- unavailable ;
- permission denied.

La UI doit refléter l'état réel, pas simuler une session.

## 12. WebAuthn / Passkeys

Séparer :
- capacité navigateur ;
- enrôlement ;
- authentification réussie.

Le simple support WebAuthn ne doit jamais afficher “Passkey configurée”.

## 13. Notifications

Après connexion, l'utilisateur peut choisir :
- mises à jour de créations suivies ;
- commentaires/support ;
- changements de release ;
- modération ;
- conflits de profil si service réel.

Aucune notification marketing par défaut sans choix explicite.

## 14. Suppression / export

Prévoir :
- export des données utilisateur ;
- suppression de compte ;
- suppression de profil public ;
- conservation légale si nécessaire et documentée.

Ne pas promettre ces fonctions tant que backend/politique ne sont pas prêts.

## 15. Mobile

Le compte mobile doit donner accès rapidement à :
- Library ;
- notifications ;
- profil ;
- studio si autorisé ;
- paramètres.

## 16. Accessibilité

- formulaires correctement labellisés ;
- erreurs associées aux champs ;
- focus première erreur ;
- état session annoncé ;
- aucune action critique uniquement par icône.

## 17. Gate high-fi

Avant high-fi :
- guest-first défini ;
- account/profile/creator séparés ;
- privacy defaults définis ;
- session states définis ;
- team roles définis ;
- mobile défini.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
