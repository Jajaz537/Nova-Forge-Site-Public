# MODARYX V2 — Blueprints des wireframes encore manquants

**Date : 2026-10-03**
**Statut : EN COURS — préparation textuelle**
**Blocage externe actuel : quota d'appels Figma MCP du plan Starter atteint.**

Aucun écran ci-dessous n'est revendiqué comme créé dans Figma tant que le quota n'est pas réouvert.

## 1. Desktop — Game Hub

### Header

- identité du jeu ;
- suivi/favori ;
- version active ;
- sélecteur de version ;
- recherche dans le jeu ;
- indication du nombre de contenus si réel.

### Sous-navigation

- Aperçu
- Mods & Plugins
- Collections
- Créateurs
- Guides
- Activité

### Blocs

1. Populaires
2. Nouveautés
3. Récemment mis à jour
4. Pour votre version
5. Types de contenus
6. Catégories
7. Collections
8. Créateurs actifs
9. Guides techniques

### États

- jeu sans corpus ;
- version non reconnue ;
- recherche indisponible ;
- aucun contenu compatible ;
- cache stale/offline.

## 2. Desktop — Global Search

### Header

- champ de recherche global ;
- historique local facultatif ;
- suggestions si disponibles.

### Groupes

- Tous
- Jeux
- Contenus
- Collections
- Créateurs

### Filtres

- jeu ;
- type ;
- auteur ;
- date ;
- statut ;
- compatibilité si un jeu/version est déjà contextualisé.

### États

- no query ;
- suggestions ;
- no results ;
- service externe indisponible avec fallback local ;
- stale/offline.

## 3. Desktop — Community

La communauté reste liée au modding.

### Entrées

- Support
- Questions
- Discussions
- Studios / équipes
- Activité

### Blocs

- sujets utiles récents ;
- questions sans réponse ;
- studios actifs ;
- créations associées ;
- signalements contextualisés.

### Interdictions

- ne pas transformer la page en flux social générique ;
- ne pas laisser l'activité communautaire remplacer le catalogue produit ;
- ne pas exposer de capacité de modération sans permission réelle.

## 4. Mobile — Game Hub

### Priorité

1. titre jeu ;
2. version active ;
3. recherche ;
4. raccourcis Mods / Collections / Guides ;
5. contenus populaires ;
6. contenus récents ;
7. catégories ;
8. créateurs.

### Règles

- recherche visible sans ouvrir le menu ;
- version accessible près du titre ;
- filtres en drawer ;
- pas de carrousel horizontal indispensable à la compréhension ;
- actions essentielles atteignables au pouce.

## 5. Mobile — Navigation complète

### Barre primaire

- Recherche
- Jeux
- Découvrir
- Bibliothèque
- Compte/Menu

### Drawer secondaire

- Mods & Plugins
- Collections
- Créateurs
- Communauté
- Créer
- Docs
- Sécurité

## 6. Mobile — Collection

### Header

- nom ;
- jeu ;
- version ;
- curateur ;
- statut compatibilité.

### Contenu

- nombre d'items ;
- dépendances manquantes ;
- conflits ;
- action d'installation si manager réel ;
- items ;
- notes.

## 7. Mobile — Creator Studio

Minimum fonctionnel mobile :

- dashboard ;
- état projets ;
- releases ;
- commentaires/support ;
- alertes/modération ;
- upload uniquement si UX fiable.

Les opérations lourdes peuvent rester desktop-first si la capacité mobile n'est pas robuste.

## 8. Critère de reprise Figma

Lorsque le quota Figma est disponible :

1. ne pas recréer les pages existantes ;
2. ajouter uniquement les surfaces manquantes ;
3. conserver la neutralité low-fi ;
4. micro-vérifier clipping/overflow ;
5. mettre à jour le registre de couverture ;
6. ne pas ouvrir high-fi avant fermeture de ces gaps.

**État : BLOQUÉ pour écriture Figma / EN COURS pour conception.**
