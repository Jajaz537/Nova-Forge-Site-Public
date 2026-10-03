# MODARYX V2 — Critères d'acceptation écran par écran

**Date : 2026-10-03**
**Statut : contrat de conception avant high‑fi**

## 1. Homepage

Doit permettre en quelques secondes de répondre à :

- Qu'est-ce que MODARYX ?
- Où chercher un jeu ?
- Où chercher un mod/plugin ?
- Où reprendre un jeu récent ?
- Où découvrir des contenus ?
- Où commencer si je suis créateur ?

### Obligatoire

- proposition de valeur claire ;
- recherche globale ;
- entrée par jeu ;
- découverte de contenus ;
- collections/créateurs ;
- confiance ;
- univers MODARYX secondaire à la tâche.

### Échec si

- l'utilisateur croit être sur un site de news ;
- le Royaume masque les mods ;
- la recherche n'est pas visible ;
- l'action principale est décorative.

## 2. Games index

### Obligatoire

- recherche jeu ;
- tri ;
- jeux populaires ;
- récents/suivis si disponibles ;
- nombre de contenus uniquement si réel ;
- accès direct au hub jeu.

### Échec si

- l'utilisateur doit connaître le nom exact ;
- les cartes imposent des animations lourdes ;
- aucune distinction entre jeu supporté et jeu vide.

## 3. Game Hub

### Obligatoire

- identité jeu ;
- version active ;
- recherche contextualisée ;
- accès Mods & Plugins ;
- types/catégories ;
- contenus populaires/récents/mis à jour ;
- collections ;
- créateurs ;
- guides si utiles.

### Échec si

- la version du jeu est cachée ;
- la recherche revient à une recherche globale sans contexte ;
- le hub devient une page marketing.

## 4. Catalogue

### Obligatoire

- requête ;
- jeu ;
- filtres actifs ;
- tri ;
- nombre de résultats ;
- vue grille/liste si bénéfique ;
- quick view ;
- reset filtres ;
- états no-results/error.

### Échec si

- les filtres modifient la page sans feedback ;
- les filtres contextuels ne s'adaptent pas au jeu/type ;
- le mobile garde une sidebar inutilisable.

## 5. Global Search

### Obligatoire

- recherche dans jeux / contenus / collections / créateurs ;
- groupes ou tabs ;
- suggestions ;
- filtres pertinents ;
- fallback local si moteur externe absent.

### Échec si

- une panne externe casse la recherche locale ;
- résultats mélangés sans type identifiable ;
- aucun moyen de revenir au contexte jeu.

## 6. Content Detail

### Above the fold

Doit montrer :

- titre ;
- jeu ;
- type ;
- auteur/équipe ;
- release/version ;
- compatibilité ;
- mise à jour ;
- provenance/statut ;
- action principale réelle.

### Navigation interne

- Overview
- Files
- Versions
- Requirements
- Changelog
- Support/Posts
- Permissions

### Échec si

- l'installation est proposée avant compatibilité ;
- dépendances/conflicts sont cachés ;
- un statut unverified ressemble à verified ;
- les fichiers historiques sont invisibles.

## 7. Requirements / Dependencies

### Obligatoire

- required ;
- optional ;
- recommended ;
- incompatible/conflict ;
- version/range ;
- source/justification si disponible.

### Échec si

- les relations sont uniquement du texte libre ;
- un conflit est résolu sans consentement ;
- une dépendance withdrawn reste installable silencieusement.

## 8. Release / Files

### Obligatoire

- version ;
- canal stable/beta/alpha/legacy ;
- date ;
- fichiers ;
- hash ;
- compatibilité release ;
- changelog ;
- distribution state.

### Échec si

- le projet et la release sont confondus ;
- une ancienne release disparaît sans trace ;
- un fichier revoked reste présenté comme normal.

## 9. Collection

### Obligatoire

- nom ;
- curateur ;
- jeu ;
- visibilité ;
- items ;
- notes ;
- compatibilité globale ;
- conflits ;
- ajout/retrait ;
- partage.

### Échec si

- collection = favori ;
- collection = profil local ;
- l'ordre ou les versions sont supposés sans être affichés.

## 10. Modpack

### Obligatoire

- version ;
- game version ;
- loader ;
- dépendances ;
- configs autorisées ;
- historique ;
- install action réelle.

### Échec si

- une collection éditoriale est présentée comme installable sans manifeste.

## 11. Profile / Loadout

### Obligatoire

- local-first ;
- versions sélectionnées ;
- activation/désactivation ;
- ordre ;
- configs ;
- sync state ;
- conflits.

### Échec si

- le profil privé est public par défaut ;
- sync-pending ressemble à synced ;
- une substitution se produit sans confirmation.

## 12. Creator Profile

### Obligatoire

- identité publique ;
- créations ;
- équipe ;
- rôles ;
- activité utile ;
- liens ;
- statut de vérification si réel.

### Échec si

- métriques non fiables sont utilisées comme preuve de confiance ;
- équipe et auteur individuel sont confondus.

## 13. Creator Studio

### Obligatoire

- Dashboard
- Projects
- Releases
- Upload
- Analytics
- Support
- Reports
- Team
- Settings

### Publication

- draft ;
- validation ;
- rights ;
- provenance ;
- preview ;
- submit ;
- status.

### Échec si

- une erreur d'upload détruit le brouillon ;
- publication et modération sont fusionnées ;
- licence/droits sont optionnels sans explication.

## 14. Community

### Obligatoire

- support ;
- questions ;
- discussions ;
- studios/équipes ;
- activité liée au modding.

### Échec si

- devient un réseau social générique ;
- la communauté remplace la fiche contenu pour les infos critiques ;
- signalement/modération est exposé sans permission.

## 15. Library

### Obligatoire

- favoris ;
- suivis ;
- collections ;
- profils/loadouts ;
- saved searches si retenus ;
- état manager si connecté.

### Échec si

- toutes les listes sont fusionnées ;
- local vs cloud n'est pas distingué.

## 16. Security / Trust

### Obligatoire

Dans les surfaces concernées :

- provenance ;
- hash ;
- signature si applicable ;
- licence ;
- statut de distribution ;
- statut de modération ;
- date/version.

### Échec si

- une page Sécurité est la seule source de ces infos ;
- hash = “safe” ;
- signature = “sans danger”.

## 17. Mobile Navigation

### Obligatoire

Accès rapide à :

- Recherche
- Jeux
- Découvrir
- Bibliothèque
- Compte/Menu

### Échec si

- l'utilisateur doit ouvrir deux menus pour rechercher ;
- les contrôles sont trop petits ;
- le focus est masqué par une barre sticky.

## 18. Mobile Catalog

### Obligatoire

- recherche ;
- tri ;
- filtres drawer ;
- résultats lisibles ;
- quick actions ;
- reset.

### Échec si

- le drawer perd les choix sans validation explicite ;
- la page saute à chaque ouverture ;
- la densité devient illisible.

## 19. Mobile Content Detail

### Obligatoire

- compatibilité ;
- action ;
- version ;
- requirements ;
- media ;
- fichiers.

### Échec si

- CTA sticky masque le focus ;
- l'action d'installation cache les dépendances ;
- les tabs horizontales deviennent inaccessibles.

## 20. Gate global

Une surface n'est pas prête pour high‑fi tant qu'elle n'a pas :

- objectif principal ;
- action principale ;
- états critiques ;
- mobile défini ;
- accessibilité prévue ;
- données requises définies ;
- cas unavailable défini ;
- dépendances au runtime explicites.

**État : TERMINÉ pour le contrat / PREUVE MANQUANTE pour tests humains et prototype high‑fi.**
