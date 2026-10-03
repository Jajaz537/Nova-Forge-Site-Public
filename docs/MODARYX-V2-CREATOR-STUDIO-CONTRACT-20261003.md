# MODARYX V2 — Contrat Creator Studio

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Rôle

Le Creator Studio est la surface de création, maintenance et publication.

Il doit permettre à un créateur ou une équipe de :

- créer un projet ;
- préparer une release ;
- déclarer compatibilité et dépendances ;
- gérer fichiers, droits et provenance ;
- prévisualiser ;
- soumettre ;
- suivre le statut ;
- maintenir versions et support.

## 2. Structure principale

Navigation proposée :

- Dashboard
- Projects
- Releases
- Upload
- Analytics
- Support
- Reports
- Team
- Settings

Les éléments non disponibles faute de backend réel doivent être explicitement indisponibles, pas simulés.

## 3. Dashboard

Afficher :

- projets récents ;
- brouillons ;
- releases en attente ;
- erreurs à corriger ;
- commentaires/support non traités ;
- alertes de modération ;
- analytics uniquement si réelles.

Aucun faux compteur.

## 4. Création de projet

Étapes :

1. Identité
2. Jeu
3. Type de contenu
4. Description
5. Catégories/tags
6. Créateur/équipe
7. Droits/licence

La création d'un projet ne crée pas automatiquement une release.

## 5. Création de release

Étapes :

1. Version
2. Canal
3. Version(s) du jeu
4. Loaders/frameworks
5. Plateformes/environnements
6. Dépendances
7. Conflits
8. Fichiers
9. Changelog
10. Provenance
11. Validation
12. Preview
13. Submit

## 6. Dépendances / conflits

Édition structurée par lignes/objets.

Champs :

- cible ;
- relation ;
- range de version ;
- raison ;
- vérification.

Pas de mini-langage texte imposé à l'utilisateur final.

## 7. Fichiers

Pour chaque fichier :

- nom ;
- taille ;
- type ;
- hash ;
- exécutable ;
- provenance ;
- distribution state.

Le hash peut être calculé localement.

Une erreur d'upload ne doit pas supprimer le brouillon.

## 8. Validation

Avant soumission :

- données requises ;
- schema ;
- IDs ;
- versions ;
- dependencies ;
- droits ;
- provenance ;
- fichiers ;
- distribution.

Les erreurs doivent pointer précisément le champ concerné.

## 9. Preview

La preview doit utiliser le rendu de fiche V2 avec un badge clair :

- BROUILLON
- NON PUBLIÉ

Aucune URL publique ne doit être inventée.

## 10. Publication / modération

États distincts :

- draft ;
- submitted ;
- held-for-review ;
- accepted ;
- published ;
- withdrawn ;
- rejected ;
- appealed.

Publication et modération ne sont pas un seul état.

## 11. Sauvegarde

### Local

Toujours possible pour le brouillon si le navigateur le permet.

### Distante

Seulement si :
- session réelle ;
- backend disponible ;
- permissions ;
- anti-abus si requis.

### Règle

Le brouillon local reste préservé après :
- timeout ;
- erreur réseau ;
- validation refusée ;
- anti-abus indisponible.

## 12. Équipes

Une équipe/studio doit permettre :

- membres ;
- rôles ;
- permissions ;
- projets ;
- historique.

L'autorité administrative MODARYX reste séparée du rôle dans une équipe.

## 13. Analytics

Ne montrer que des métriques réellement disponibles.

Exemples :
- vues ;
- téléchargements ;
- installs manager ;
- favoris ;
- versions utilisées.

Aucune estimation présentée comme mesure.

## 14. Support

Regrouper :

- comments/posts ;
- questions ;
- issues/bugs ;
- reports selon permission.

Le support d'un projet doit être séparé des actions de modération.

## 15. Mobile

Priorités mobile :

- dashboard ;
- état des projets ;
- releases ;
- support ;
- alertes.

Upload lourd peut rester desktop-first si la fiabilité mobile n'est pas suffisante.

## 16. Accessibilité

- chaque étape du workflow a un titre ;
- erreurs liées aux champs ;
- focus sur première erreur ;
- progression textuelle ;
- aucun drag-only pour ordonner ;
- upload accessible clavier ;
- statut publication annoncé textuellement.

## 17. Sécurité

- aucune clé privée demandée ;
- aucune autorité déduite de l'UI ;
- session same-origin ;
- action privilégiée réauthentifiable si nécessaire ;
- anti-abus réellement provisionné ;
- droits serveur.

## 18. États obligatoires

- empty dashboard ;
- local-only ;
- session expired ;
- backend unavailable ;
- anti-abuse unavailable ;
- upload failed ;
- validation failed ;
- held-for-review ;
- rejected ;
- published ;
- withdrawn ;
- revoked.

## 19. Critère high-fi

High-fi du Studio autorisé seulement quand :

- Project vs Release séparés ;
- workflow release stabilisé ;
- états publication/modération séparés ;
- sauvegarde locale définie ;
- permissions équipe définies ;
- erreurs et mobile définis.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
