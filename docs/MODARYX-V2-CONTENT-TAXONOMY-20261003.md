# MODARYX V2 — Taxonomie et modèle de contenu

**Date : 2026-10-03**
**Statut : DRAFT de conception**

## 1. Objectif

Éviter de forcer tous les contenus dans le type historique `mod`.

Le type de contenu doit être extensible et dépendre de l'écosystème du jeu.

## 2. Familles de contenus proposées

### Gameplay / contenu

- mod
- addon
- plugin
- script
- map
- campaign
- quest
- character
- vehicle
- weapon
- gameplay-overhaul
- patch
- translation

### Visuel / audio

- texture-pack
- resource-pack
- shader
- preset
- reshade-preset
- model
- animation
- sound-pack
- music-pack
- ui-theme

### Technique

- library
- framework
- loader
- api
- tool
- utility
- installer
- manager-extension

### Agrégats

- collection
- modpack
- profile
- loadout

Les agrégats ne doivent pas être traités comme des fichiers ordinaires.

## 3. ContentType

Chaque type doit pouvoir déclarer :

- `id`
- `label`
- `family`
- `gameScope`
- `installMode`
- `supportsDependencies`
- `supportsConflicts`
- `supportsFiles`
- `supportsVersions`
- `supportsClientServerEnvironment`
- `supportsLoadOrder`
- `supportsCollections`

## 4. Game

Un jeu doit pouvoir définir sa propre taxonomie :

- types autorisés ;
- catégories ;
- loaders/frameworks ;
- versions ;
- DLC ;
- plateformes ;
- environnement client/server ;
- règles d'installation ;
- champs spécifiques.

## 5. ContentItem

Objet stable représentant le projet.

Champs conceptuels :

- id
- slug
- title
- summary
- description
- gameId
- contentTypeId
- creatorIds
- teamId
- categories
- tags
- status
- license
- permissions
- provenanceState
- moderationState
- visibility
- currentReleaseId
- createdAt
- updatedAt

## 6. Release

Une release est distincte du projet.

- id
- contentId
- version
- channel : stable / beta / alpha / legacy
- publishedAt
- gameVersions
- loaders
- platforms
- environment
- files
- dependencies
- conflicts
- changelog
- provenance
- distributionState

## 7. Relation de dépendance

Chaque relation doit comporter :

- targetContentId
- targetReleaseRange
- relationType
- reason
- source
- verificationState

`relationType` :

- required
- optional
- recommended
- incompatible
- replaces

`replaces` ne doit jamais entraîner de substitution automatique sans consentement.

## 8. CompatibilityClaim

Distinguer :

- measured
- declared
- estimated
- unknown
- incompatible

Chaque claim doit pouvoir être relié à :

- jeu/version ;
- loader ;
- plateforme ;
- environnement ;
- receipt/preuve si disponible ;
- date.

## 9. Collection

Collection éditoriale :

- items
- ordre facultatif
- notes
- visibilité
- curateur
- jeu(s)
- tags

Elle ne transporte pas nécessairement des fichiers.

## 10. Modpack

Configuration versionnée et installable :

- manifest versionné
- dépendances exactes/ranges
- fichiers de configuration autorisés
- règles d'installation
- gameVersion
- loader
- provenance
- release history

## 11. Profile / Loadout

État utilisateur concret :

- installation locale
- versions sélectionnées
- activation/désactivation
- ordre de chargement
- configs
- origine de chaque contenu
- état sync local/distant

Le profil reste privé-local par défaut.

## 12. Creator / Team

Creator :
- identité publique
- bio
- créations
- rôles
- liens
- statuts de vérification

Team :
- membres
- rôles
- projets
- permissions
- historique

## 13. SearchDocument

L'index de recherche doit pouvoir contenir :

- contentId
- gameId
- type
- title
- creator
- categories
- tags
- compatibleVersions
- loaders
- environment
- popularity signals
- rating
- updatedAt
- provenanceState
- distributionState

## 14. Conséquence pour le schéma existant

Le schéma `universal-mod-manifest` actuel reste une bonne base pour :

- cible ;
- versions ;
- loaders ;
- compatibilité ;
- dépendances ;
- conflits ;
- droits ;
- provenance ;
- fichiers ;
- distribution.

Mais `content.kind` doit être reconsidéré avant V2 : les valeurs historiques `mod/pack/experience/tool/resource` sont trop larges pour la navigation, les filtres et les parcours V2.

Aucune migration de schéma n'est effectuée dans cette phase de conception.
