# MODARYX V2 — Architecture produit et informationnelle

**Date : 2026-10-03**  
**Statut : DRAFT DE CONCEPTION — aucun cutover / aucune production**

## 1. Positionnement

MODARYX V2 est une plateforme multigaming de mods, plugins, addons, scripts, outils, packs, presets, maps, collections et contenus communautaires.

Le produit doit permettre quatre activités principales :

1. **Découvrir** du contenu pour un jeu.
2. **Comprendre** compatibilité, dépendances, provenance et sécurité.
3. **Installer / gérer** le contenu de manière manuelle ou assistée.
4. **Créer / publier / maintenir** du contenu et participer à la communauté.

## 2. Personas fonctionnels

### Joueur découverte

Objectif :
- trouver rapidement du contenu intéressant pour un jeu.

Besoins :
- recherche claire ;
- jeux populaires/récents ;
- recommandations ;
- catégories ;
- previews ;
- confiance.

### Joueur avancé

Objectif :
- construire une configuration stable.

Besoins :
- versions ;
- dépendances ;
- conflits ;
- load order ;
- collections/profils ;
- historique ;
- compatibilité précise.

### Créateur

Objectif :
- publier et maintenir une création.

Besoins :
- upload ;
- validation ;
- versions ;
- changelog ;
- dépendances ;
- droits ;
- analytics ;
- support utilisateur ;
- modération.

### Curateur / auteur de collection

Objectif :
- organiser et recommander une sélection éditoriale partageable.

Besoins :
- ajouter/retirer ;
- ordre éditorial facultatif ;
- notes ;
- visibilité ;
- contexte jeu/version ;
- filtres de collection ;
- support/limitations de la collection.

La création d'une configuration installable relève d'un **Modpack** ou d'un **Profile / Loadout**, pas d'une Collection simple.

### Modérateur / administrateur

Objectif :
- maintenir confiance et sécurité.

Besoins :
- signalements ;
- statuts ;
- publication/retrait ;
- appels ;
- traçabilité ;
- receipts ;
- permissions.

## 3. Objets métier principaux

- Game
- ContentItem
- ContentType
- Release
- File
- Dependency
- Conflict
- CompatibilityClaim
- Creator
- Team/Studio
- Collection
- Profile/Loadout
- Tag
- Category
- Review
- Comment
- Issue/SupportThread
- Report
- ModerationDecision
- ProvenanceReceipt
- SecurityObservation
- Download/InstallIntent
- SearchQuery
- SavedSearch
- Follow/Favorite

## 4. Navigation principale proposée

Libellés fonctionnels d'abord ; personnalité MODARYX dans la présentation, pas dans la trouvabilité.

### Navigation desktop

- **Découvrir**
- **Jeux**
- **Mods & Plugins**
- **Collections**
- **Créateurs**
- **Communauté**
- **Créer**

Éléments utilitaires :

- recherche globale ;
- notifications ;
- bibliothèque/profils ;
- compte.

### Mobile

Priorités :

1. Recherche
2. Jeux
3. Découvrir
4. Bibliothèque
5. Compte/Menu

Les autres rubriques restent accessibles dans le menu complet.

## 5. Arborescence publique V2

### /

Homepage produit.

### /discover

Découverte transversale :
- tendance ;
- nouveaux ;
- récemment mis à jour ;
- mieux notés ;
- collections ;
- créateurs ;
- filtres de découverte.

### /games

Index de jeux :
- recherche ;
- tri ;
- popularité ;
- récemment consultés ;
- suivis.

### /games/:game

Hub jeu :
- recherche contextualisée ;
- types disponibles ;
- mods/plugins ;
- collections ;
- nouveaux ;
- populaires ;
- compatibles avec version sélectionnée ;
- créateurs ;
- guides techniques si pertinents.

### /games/:game/:content-type

Catalogue contextualisé :
- filtres spécifiques ;
- tri ;
- view modes ;
- quick view.

### /content/:id

Fiche universelle d'une création.

L'URL publique pourra plus tard inclure des slugs lisibles sans faire dépendre l'identité interne du slug.

### /content/:id/files

Fichiers distribuables et artefacts de la release sélectionnée.

### /content/:id/versions

Historique des releases/versions.

### /content/:id/changelog

Historique des changements par release.

### /content/:id/requirements

Dépendances, recommandations et conflits détaillés.

Le libellé produit **Requirements** reste cohérent entre navigation, URL et documentation ; “Dependencies” reste un sous-concept structuré à l'intérieur.

### /collections

Découverte de collections.

### /collections/:id

Fiche **Collection** éditoriale.

### /modpacks

Découverte de modpacks installables/versionnés.

### /modpacks/:id

Fiche **Modpack** : manifeste, version, compatibilité, dépendances, provenance et actions d'installation réelles.

### /profiles/:id

Surface de **Profile / Loadout** uniquement lorsqu'un profil est explicitement partageable.

Un profil reste privé/local par défaut ; son absence de route publique est donc le comportement normal.

### /creators

Découverte créateurs/équipes.

### /creators/:id

Profil créateur.

### /community

Activité communautaire utile au modding :
- questions ;
- support ;
- discussions ;
- créations ;
- studios/équipes.

### /studio

Creator Studio authentifié.

### /library

Bibliothèque utilisateur :
- favoris ;
- suivis ;
- collections ;
- profils/loadouts ;
- téléchargements/installations si manager connecté.

### /search

Recherche globale avancée.

### /security

Confiance, provenance, sécurité.

### /docs

Documentation utilisateur/créateur.

## 6. Homepage V2 — structure fonctionnelle

La homepage n'est pas une page d'actualités.

### Zone 1 — Comprendre + agir

- marque MODARYX ;
- proposition de valeur ;
- recherche globale forte ;
- choix/reprise d'un jeu ;
- CTA secondaire créateur.

### Zone 2 — Vos jeux / jeux populaires

- récemment utilisés si connecté/local ;
- jeux suivis ;
- sinon jeux populaires.

### Zone 3 — Découvrir

Tabs ou filtres rapides :
- Tendances
- Nouveautés
- Mis à jour
- Collections

### Zone 4 — Contenus par type

Entrées directes :
- Mods
- Plugins
- Addons
- Tools
- Packs
- autres selon corpus.

### Zone 5 — Collections / configurations

Séparer visuellement :
- Collections : curation et découverte ;
- Modpacks : ensembles versionnés/installables ;
- Profiles / Loadouts : configurations utilisateur privées ou explicitement partagées.

Ne jamais présenter une Collection comme installable sans manifeste/résolution.

### Zone 6 — Créateurs

- créateurs/équipes actifs ;
- contribution ;
- rejoindre/créer un studio si retenu.

### Zone 7 — Confiance MODARYX

- provenance ;
- compatibilité ;
- sécurité ;
- transparence des statuts.

### Zone 8 — Univers vivant

Présence identitaire plus émotionnelle :
- ambiance ;
- compagnon ;
- heure/saison ;
- évolution visuelle.

Cette zone ne remplace aucune fonction produit.

## 7. Hub jeu — structure

Header jeu :
- cover/key art autorisé ;
- titre ;
- suivi ;
- version sélectionnée ;
- recherche dans le jeu.

Sous-navigation :
- Aperçu
- Mods & Plugins
- Collections
- Créateurs
- Guides
- Activité

Blocs :
- populaires ;
- nouveaux ;
- mis à jour ;
- pour votre version ;
- catégories ;
- collections ;
- créateurs.

## 8. Catalogue / résultats

### Barre supérieure

- requête ;
- contexte jeu ;
- type ;
- tri ;
- nombre de résultats ;
- mode liste/grille.

### Colonne filtres desktop / drawer mobile

Filtres universels :
- catégorie ;
- auteur ;
- date ;
- popularité ;
- note ;
- mise à jour ;
- langue ;
- statut.

Filtres contextuels :
- version jeu ;
- loader ;
- client/server ;
- DLC ;
- plateforme ;
- dépendances ;
- compatibilité.

### Item de résultat

Minimum :
- preview ;
- nom ;
- auteur ;
- type ;
- résumé court ;
- compatibilité clé ;
- version/mise à jour ;
- métrique(s) utile(s) ;
- tags principaux.

Actions :
- quick view ;
- favori ;
- collection ;
- ouvrir fiche.

## 9. Fiche contenu — hiérarchie

### Above the fold

Gauche / centre :
- médias principaux ;
- titre ;
- résumé ;
- auteur.

Droite / zone décision :
- jeu ;
- type ;
- version ;
- compatibilité ;
- dernière mise à jour ;
- sécurité/provenance ;
- action principale ;
- action manuelle/alternative.

### Navigation interne

- Overview
- Files
- Versions
- Requirements
- Changelog
- Posts/Support
- Bugs/Issues
- Permissions

### Requirements

Séparer :
- Required
- Optional
- Incompatible
- Recommended

### États

- stable ;
- beta ;
- archived ;
- abandoned ;
- quarantined ;
- removed ;
- incompatible ;
- unverified.

## 10. Collections / profils / modpacks

Le produit doit distinguer clairement :

### Favori
Marque-page personnel.

### Collection
Liste éditoriale de contenus organisée par un curateur.

### Modpack
Ensemble versionné et installable avec manifeste, dépendances et contraintes.

### Profile / Loadout
État concret d'installation/configuration utilisateur, privé/local par défaut et partageable uniquement par action explicite.

Ces notions ne doivent pas être fusionnées dans une seule UI.

## 11. Creator Studio

Sections :

- Dashboard
- Projects
- Releases
- Upload
- Analytics
- Comments/Support
- Reports/Moderation
- Team
- Settings

Workflow publication :

1. création du projet ;
2. métadonnées ;
3. jeu/type ;
4. compatibilité ;
5. dépendances ;
6. fichiers ;
7. licence/droits ;
8. provenance ;
9. validation ;
10. preview ;
11. soumission/publication ;
12. statut et suivi.

## 12. Sécurité et confiance

Afficher sans jargon inutile :

- provenance connue/inconnue ;
- hash ;
- statut scan si réel ;
- auteur ;
- date ;
- version ;
- permissions ;
- statut de modération ;
- historique ;
- licence ;
- signalements.

Ne jamais présenter une absence de preuve comme une preuve positive.

## 13. Recherche

Recherche globale :

- jeu ;
- contenu ;
- créateur ;
- collection.

Recherche contextualisée :

- dans un jeu ;
- dans un type ;
- dans les fichiers/versions si nécessaire.

Fonctions futures possibles :

- recherches sauvegardées ;
- alertes de mise à jour ;
- historique local ;
- suggestions.

## 14. États transversaux obligatoires

Chaque surface importante doit avoir :

- loading ;
- skeleton ;
- empty ;
- no results ;
- error ;
- retry ;
- offline ;
- stale ;
- unauthorized ;
- forbidden ;
- removed ;
- unavailable ;
- success.

## 15. Responsive

Desktop et mobile sont deux compositions coordonnées.

### Desktop

- densité fonctionnelle plus forte ;
- filtres persistants ;
- multi-colonnes ;
- quick view possible.

### Mobile

- search dominant ;
- filtres en drawer ;
- actions principales fixes/contextuelles avec parcimonie ;
- cartes/listes compactes ;
- dépendances/compatibilité résumées puis expansibles.

## 16. Test d'architecture avant design final

Tâches de tree testing minimales :

1. trouver un plugin pour un jeu précis ;
2. vérifier si un contenu fonctionne avec une version donnée ;
3. trouver les dépendances ;
4. ajouter à une collection ;
5. publier une nouvelle version ;
6. retrouver un créateur ;
7. signaler un contenu ;
8. trouver l'historique des versions ;
9. retrouver ses favoris ;
10. trouver la documentation d'installation.

Aucun design haute fidélité n'est autorisé à masquer une IA qui échoue ces tâches.

## 17. Règle d'identité

Les termes fonctionnels restent explicites.

À éviter comme libellé primaire :
- portail ;
- forge ;
- royaume ;
- sanctuaire ;
- chronique ;

si le mot attendu par l'utilisateur est :
- mods ;
- jeux ;
- collections ;
- créateurs ;
- recherche ;
- bibliothèque.

L'univers MODARYX s'exprime par :
- art direction ;
- microcopy secondaire ;
- motion ;
- illustrations ;
- atmosphère ;
- progression ;
- compagnon ;
- détails de marque.

## 18. Prochain livrable

Wireframes low-fi de :

1. Homepage
2. Games index
3. Game hub
4. Catalog/search
5. Content detail
6. Collection detail
7. Creator profile
8. Creator Studio
9. Library
10. Mobile navigation/search

Aucun code de production avant validation de ces flux.
