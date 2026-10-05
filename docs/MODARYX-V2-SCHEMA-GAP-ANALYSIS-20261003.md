# MODARYX V2 — Analyse des écarts de schémas et contrats

**Date : 2026-10-03**
**Statut : audit de conception — aucune migration de schéma**

## 1. Universal Mod Manifest v1

Fichier : `schemas/universal-mod-manifest.schema.json`

### Forces à conserver

- JSON Schema 2020-12 ;
- `additionalProperties: false` ;
- identifiants contraints ;
- game target séparé ;
- creator séparé ;
- compatibilité avec niveau de preuve ;
- receipt obligatoire pour evidence=measured ;
- droits/licence/redistribution ;
- provenance avec receipt si verified ;
- fichiers avec SHA-256 ;
- distribution state ;
- release receipt ;
- dépendances/conflits structurés.

### Écarts V2

#### 1. Projet et release sont mélangés

`content.version` est stocké dans le projet lui-même.

V2 doit séparer :
- ContentItem stable ;
- Release versionnée.

#### 2. `kind` trop grossier

Valeurs actuelles :
- mod
- pack
- experience
- tool
- resource

Insuffisant pour :
- plugin
- addon
- script
- shader
- preset
- map
- patch
- translation
- library
- framework
- loader
- modpack
- profile/loadout.

#### 3. Target incomplet

Actuel :
- gameId
- gameName
- versions
- loaders

V2 peut nécessiter :
- platform ;
- DLC ;
- client/server environment ;
- architecture/runtime ;
- store/channel lorsque techniquement pertinent.

#### 4. Relations trop simples

Actuel :
- id
- versionRange
- optional

V2 doit exprimer :
- required
- optional
- recommended
- incompatible
- replaces
- raison/source ;
- niveau de vérification.

#### 5. Compatibilité trop globale

Actuel :
- evidence global
- notes

V2 doit permettre plusieurs CompatibilityClaims :
- par release ;
- par game version ;
- loader ;
- platform ;
- environment ;
- preuve/date/source.

#### 6. Distribution trop globale

Distribution doit être principalement attachée à une release/fichier.

Un projet peut exister même si une release précise est withdrawn.

## 2. Collection v1

Fichier : `schemas/collection.schema.json`

### Forces

- privé local par défaut ;
- sync state clair ;
- owner facultatif ;
- item IDs uniques.

### Écarts V2

- pas de curateur distinct de owner account ;
- pas de notes par item ;
- pas d'ordre ;
- pas de release recommendation ;
- pas de jeu/tags ;
- pas d'historique/version de collection ;
- pas de distinction collection/modpack/profile.

### Décision

Ne pas étendre Collection jusqu'à en faire un modpack.

Créer trois contrats séparés.

## 3. Search Adapter v1

Fichier : `schemas/search-adapter.schema.json`

### Force majeure

`requiredForCore: false`

et :

`identityPolicy: preserve-local-content-id`

Cette règle reste excellente pour V2.

### À compléter côté SearchDocument

Le contrat adapter n'est pas un schéma des documents indexés.

V2 a besoin d'un `search-document.schema` séparé.

Champs proposés :
- entityType ;
- id ;
- gameId ;
- contentType ;
- title ;
- summary ;
- creatorIds ;
- categories ;
- tags ;
- compatibleVersions ;
- loaders ;
- platform ;
- environment ;
- status ;
- updatedAt ;
- rankingSignals.

## 4. Catalogue de démonstration

Fichier : `data/catalog.json`

### Constat

- `dataClass: demonstration`
- `distributionPolicy: metadata-preview-only`
- trois items de démonstration ;
- contenus volontairement locked/non downloadable ;
- provenance déclarée non attestée.

### Règle V2

Ce corpus ne doit **pas** devenir le catalogue réel par inertie.

Il peut servir à :
- tests ;
- fixtures ;
- développement.

Mais les maquettes high-fi ne doivent pas laisser croire qu'il s'agit d'un vrai catalogue utilisateur si elles utilisent ces données.

## 5. Search index legacy

Fichier : `data/search-index.json`

### Limites

L'index contient :
- pages ;
- contenus de démonstration ;
- routes HTML legacy ;
- anciens hubs éditoriaux ;
- termes historiques.

Il n'est pas approprié tel quel comme index V2.

### À conserver

- index local pré-calculé ;
- absence de dépendance externe obligatoire ;
- contenu explicite.

### À reconstruire

- href V2 ;
- entity types ;
- facettes ;
- games/creators/collections ;
- versions/loaders ;
- compatibilité.

## 6. Integration Readiness

Fichier : `data/integration-readiness.json`

Ce fichier contient des garde-fous essentiels.

### À préserver

#### Game corpus

Ne jamais publier/distribuer sans :
- corpus réel autorisé ;
- droits ;
- version ;
- provenance.

#### Accounts

Ne jamais simuler compte/auth sans backend réel.

#### Community

Pas de publication/modération distante tant que services non connectés.

#### Storage Resolver / Repair

Aucune substitution silencieuse ;
empreinte et identité doivent correspondre.

#### Distribution

Fresh manifest obligatoire ;
artefact autorisé ;
SHA-256 ;
provenance ;
signature si requise.

#### Guide / Nova Forge OS bridge

Connexion optionnelle ;
consentement explicite ;
identités séparées.

## 7. Proposition d'évolution de contrats

Sans implémenter maintenant :

### Schemas V2 potentiels

- `game.schema.json`
- `content-item.schema.json`
- `content-type.schema.json`
- `release.schema.json`
- `dependency.schema.json`
- `compatibility-claim.schema.json`
- `collection-v2.schema.json`
- `modpack.schema.json`
- `profile-loadout.schema.json`
- `creator.schema.json`
- `team.schema.json`
- `search-document.schema.json`

### Compatibilité legacy

Prévoir un mapper :

`UniversalModManifestV1 → ContentItem + ReleaseV2`

mais uniquement après :
- contrat V2 validé ;
- fixtures ;
- tests ;
- stratégie de backward compatibility.

## 8. Règles de migration

- jamais modifier le schéma v1 en place si cela casse ses consumers ;
- versionner les nouveaux schémas ;
- maintenir les IDs stables ;
- écrire des convertisseurs explicites ;
- tester round-trip quand possible ;
- aucune migration de données réelle avant validation.

## 9. Conclusion

Les contrats actuels sont **précieux comme fondation de sécurité**, mais trop compacts pour l'architecture produit V2.

La bonne stratégie n'est pas de les jeter.

C'est de :
1. préserver v1 ;
2. définir v2 séparément ;
3. mapper explicitement ;
4. migrer seulement après preuve.

**État : TERMINÉ pour l'analyse des écarts / NON IMPLÉMENTÉ volontairement.**
