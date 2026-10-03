# MODARYX V2 — Blueprints des wireframes encore manquants

**Date : 2026-10-03**
**Statut : TERMINÉ — blueprint low-fi textuel détaillé / preuve visuelle Figma toujours BLOQUÉE**
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


## 9. Spécification de composition — Desktop Game Hub

### Canvas
- largeur de référence : 1440 px ;
- contenu max : 1240 px ;
- grille : 12 colonnes ;
- gutters desktop : 24 px ;
- espace vertical section : 48–64 px ;
- aucun hero plein écran.

### Ordre exact
1. breadcrumb ;
2. identité jeu + version ;
3. search contextualisée ;
4. raccourcis fonctionnels ;
5. modules de découverte ;
6. collections ;
7. créateurs ;
8. guides ;
9. activité utile.

### Zone identité
Colonne principale :
- nom du jeu ;
- support state ;
- version active ;
- texte descriptif court.

Colonne secondaire :
- suivre ;
- changer version ;
- ouvrir recherche jeu.

### Raccourcis
Boutons/tabs :
- Mods & Plugins
- Collections
- Créateurs
- Guides

### Module “Pour votre version”
Chaque item :
- ContentType
- titre
- creator
- release
- compatibility state
- evidence state
- dependency warning si nécessaire.

### Empty state editorial-only
Afficher explicitement :
- jeu supporté éditorialement ;
- aucun corpus installable prouvé ;
- guides disponibles ;
- aucune fausse promesse de téléchargement.

### Accessibilité
- h1 unique ;
- version selector avec label ;
- search avec accessible name ;
- tabs utilisables clavier ;
- status jamais couleur seule.

## 10. Spécification de composition — Desktop Global Search

### Canvas
- largeur : 1440 px ;
- contenu max : 1240 px ;
- search toujours visible au-dessus du fold.

### Ordre exact
1. titre / contexte ;
2. champ recherche principal ;
3. tabs de type ;
4. zone filtres ;
5. résumé résultats ;
6. résultats ;
7. pagination/infinite state selon solution retenue.

### Layout
Desktop :
- colonne filtres 280 px ;
- colonne résultats fluide ;
- applied filters au-dessus des résultats.

### Résultat type
Afficher :
- type de résultat ;
- titre ;
- contexte jeu ;
- creator/team ;
- version/fraîcheur ;
- compatibility si pertinente ;
- statut distribution ;
- extrait court.

### No query
Montrer :
- recherches récentes locales si activées ;
- jeux populaires seulement si données réelles ;
- aucun faux trending.

### No results
Actions :
- effacer certains filtres ;
- élargir type ;
- changer version jeu ;
- ouvrir catalogue jeu.

### Search externe indisponible
Message :
- résultats locaux affichés ;
- service externe indisponible ;
- aucun blocage core.

## 11. Spécification de composition — Desktop Community

### Canvas
- largeur : 1440 px ;
- contenu max : 1180–1240 px ;
- navigation fonctionnelle en premier.

### Ordre exact
1. titre + explication courte ;
2. search/community filter ;
3. tabs Support / Questions / Discussions / Studios ;
4. composer si autorisé ;
5. contenu principal ;
6. sidebar contexte jeu/contenu ;
7. ressources sécurité/signalement.

### Item Community
Afficher :
- type ;
- titre ;
- auteur ;
- jeu/contenu lié ;
- état réponse ;
- date ;
- modération visible seulement si nécessaire.

### Support
Mettre en avant :
- content/release concerné ;
- version jeu ;
- environnement ;
- statut résolu/non résolu.

### Signalement
Jamais dans le même composer que support.
Action secondaire distincte.

### Permission states
- anonymous ;
- authenticated ;
- creator ;
- moderator.

La UI n'affiche jamais un contrôle de modération sur simple rôle local.

## 12. Spécification de composition — Mobile Game Hub

### Viewport de référence
- 390 px ;
- padding horizontal : 16 px ;
- spacing section : 28–40 px.

### Ordre exact
1. back/breadcrumb compact ;
2. nom jeu + support state ;
3. version selector ;
4. search ;
5. raccourcis fonctionnels ;
6. Pour votre version ;
7. Populaires ;
8. Nouveautés ;
9. Catégories ;
10. Collections ;
11. Créateurs ;
12. Guides.

### Règles tactiles
- target minimum 44 px pratique ;
- filtres/version ouvrent drawer/bottom sheet ;
- search utilisable directement ;
- aucune action critique uniquement dans overflow menu.

### Pas de desktop compressé
Sur mobile :
- metadata secondaire collapsible ;
- sections moins denses ;
- une seule colonne ;
- cards deviennent rows quand scanning prioritaire.

## 13. Mapping composants low-fi existants

Réutiliser les primitives Figma low-fi déjà créées :

- Search Field → Game Hub + Global Search + Community ;
- Content Card → modules Game Hub/Search ;
- Button → actions ;
- Filter Chip → applied filters/tabs simples.

À créer seulement si Figma se débloque :
- Game Identity Header ;
- Result Row ;
- Community Topic Row ;
- Version Selector ;
- Support State Badge ;
- Empty State Panel.

Aucun composant high-fi à ce stade.

## 14. Matrice d'états — 4 écrans

| Surface | Loading | Empty | Error | Offline/Stale | Auth | Capability |
|---|---|---|---|---|---|---|
| Game Hub | skeleton sections | editorial-only/no corpus | hub unavailable | cached hub | follow disabled if needed | distribution hidden if absent |
| Global Search | search pending | no query/no results | external/local error | local stale results | saved search gated | external search optional |
| Community | topics loading | no topics | service unavailable | drafts/local read | composer gated | moderation by server role |
| Mobile Game Hub | progressive sections | compact empty | inline retry | cached state | follow gated | install hidden if absent |

## 15. Critères de fermeture low-fi hors Figma

Le blueprint textuel est considéré **TERMINÉ** si :
- hiérarchie exacte définie ;
- états principaux définis ;
- responsive défini ;
- composants mappés ;
- accessibilité de structure définie ;
- aucune donnée fictive obligatoire ;
- aucune capacité absente simulée.

Ce critère est désormais satisfait pour les 4 surfaces.

Ce qui reste **PREUVE MANQUANTE** :
- matérialisation visuelle dans Figma/Miro ;
- clipping/overflow réel ;
- validation humaine ;
- compréhension de la terminologie.

## 16. Alternative gratuite à Figma

Option disponible :
- créer un prototype low-fi dans **Miro** avec les 4 écrans ;
- aucune dépense Figma nécessaire ;
- ce prototype resterait une preuve low-fi distincte, pas une validation high-fi.

La création d'un nouveau board Miro nécessite une confirmation explicite utilisateur avant action.

**État final de ce document : TERMINÉ pour conception low-fi textuelle / BLOQUÉ uniquement pour matérialisation visuelle Figma.**
