# MODARYX V2 — Plan de schémas v2

**Date : 2026-10-03**
**Statut : conception uniquement — aucun schéma v1 modifié**

## 1. Objectif

Définir la future frontière de données V2 sans casser les consommateurs historiques.

Principes :

- versionner, ne pas écraser ;
- séparer projet et release ;
- séparer collection, modpack et profile/loadout ;
- préserver provenance, droits et fail-closed ;
- permettre une taxonomie de contenu extensible par jeu ;
- garder les identités stables.

## 2. `game.schema.json`

### Rôle

Décrit un jeu supporté comme contexte de navigation et compatibilité.

### Champs conceptuels

- schemaVersion
- id
- slug
- name
- aliases
- status
- platforms
- versions
- dlcs
- contentTypeIds
- categoryIds
- loaderIds
- environmentModel
- installCapabilities
- metadata

### Règles

- aucun support mod ne doit être déduit du simple fait qu'un hub éditorial existe ;
- `status` doit distinguer au minimum :
  - editorial-only
  - catalog-enabled
  - distribution-enabled
  - deprecated.

## 3. `content-type.schema.json`

### Champs

- id
- label
- family
- gameScope
- supportsFiles
- supportsVersions
- supportsDependencies
- supportsConflicts
- supportsLoadOrder
- supportsClientServerEnvironment
- supportsCollections
- installMode

### But

Ne plus coder les catégories de contenu dans l'UI.

## 4. `content-item.schema.json`

### Identité stable

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
- licenseRef
- permissionRef
- provenanceSummary
- moderationState
- visibility
- currentReleaseId
- createdAt
- updatedAt

### Important

Aucune version de release n'est stockée comme propriété principale du projet.

## 5. `release.schema.json`

### Champs

- id
- contentId
- version
- channel
- publishedAt
- gameVersions
- loaders
- platforms
- dlcs
- environment
- files
- dependencyIds
- compatibilityClaimIds
- changelog
- provenance
- distribution
- releaseReceipt

### États

- draft
- submitted
- published
- withdrawn
- revoked
- archived

## 6. `dependency.schema.json`

### Champs

- id
- sourceContentId
- sourceReleaseRange
- targetContentId
- targetReleaseRange
- relationType
- reason
- source
- verificationState

### relationType

- required
- optional
- recommended
- incompatible
- replaces

### Règle

`replaces` n'autorise jamais une substitution silencieuse.

## 7. `compatibility-claim.schema.json`

### Dimensions

- contentId
- releaseId
- gameId
- gameVersion
- loader
- platform
- environment
- state
- evidenceType
- receiptId
- source
- observedAt
- notes

### state

- compatible
- partial
- incompatible
- unknown

### evidenceType

- measured
- declared
- estimated
- unknown

### Règle

Le visuel `compatible` ne doit jamais être produit depuis un claim `unknown`.

## 8. `file-artifact.schema.json`

### Champs

- id
- releaseId
- filename
- path
- size
- mediaType
- executable
- hashes
- signature
- provenance
- distributionState

### Règle

Distribution stale/withdrawn/revoked reste fail-closed.

## 9. `collection-v2.schema.json`

### Objet éditorial

- id
- title
- description
- curatorId
- visibility
- gameIds
- tags
- items
- createdAt
- updatedAt

### item

- contentId
- note
- order
- recommendedReleaseId facultatif

Une collection n'est pas installable par défaut.

## 10. `modpack.schema.json`

### Objet installable versionné

- id
- title
- gameId
- gameVersion
- loader
- version
- releaseConstraints
- configArtifacts
- dependencies
- conflicts
- rights
- provenance
- distribution
- history

## 11. `profile-loadout.schema.json`

### Objet utilisateur local-first

- id
- ownerProfileId nullable
- gameId
- gameVersion
- selectedReleases
- enabledState
- loadOrder
- localConfigRefs
- syncState
- visibility
- createdAt
- updatedAt

### Défaut

- syncState = local-only
- visibility = private-local

## 12. `creator.schema.json`

- id
- handle
- displayName
- bio
- avatar
- links
- verificationState
- teamIds
- projectIds

Ne pas inclure l'autorité admin dans ce schéma public.

## 13. `team.schema.json`

- id
- name
- description
- visibility
- members
- roles
- projectIds

Les permissions d'édition doivent être contrôlées côté serveur.

## 14. `search-document.schema.json`

### entityType

- game
- content
- release
- creator
- team
- collection
- modpack

### Champs

- id
- entityType
- title
- summary
- href
- gameId
- contentTypeId
- creatorIds
- categories
- tags
- gameVersions
- loaders
- platforms
- status
- updatedAt
- rankingSignals

### Règle

Un index externe peut enrichir, jamais devenir source d'identité.

## 15. Compatibilité v1 → v2

### Mapping Universal Mod Manifest v1

`content` →
- ContentItem
- Release

`target` →
- Release target dimensions

`creator` →
- Creator reference

`compatibility.dependencies/conflicts` →
- Dependency records

`files` →
- FileArtifact records

`distribution/releaseReceipt` →
- Release distribution + receipt

### Champs sans équivalent parfait

- `kind` historique : nécessite table de mapping.
- `compatibility.evidence` global : devient claim contextualisé.
- `version` dans content : devient release.version.

## 16. Tests de schéma requis

Avant adoption :

- fixture minimale valide ;
- fixture complète ;
- additionalProperties refusées ;
- IDs invalides ;
- duplicate relations ;
- withdrawn downloadable=false ;
- measured sans receipt refusé ;
- verified provenance sans receipt refusé ;
- profile public par défaut refusé ;
- collection importable sans devenir modpack ;
- search identity stable.

## 17. Stratégie de versionnage

IDs proposés :

- `urn:modaryx:schemas:game:v2`
- `urn:modaryx:schemas:content-item:v2`
- etc.

Aucun nouvel ID `nova-forge` ne doit être créé pour les schémas web V2.

Les anciens IDs restent inchangés pour compatibilité.

## 18. Gate d'implémentation

Ne créer les fichiers de schéma réels qu'après :

1. wireframes core fermés ;
2. terminologie produit stabilisée ;
3. validation des relations Collection/Modpack/Profile ;
4. validation de ContentItem/Release ;
5. décision de compatibilité backward.

**État : TERMINÉ pour le plan / NON IMPLÉMENTÉ volontairement.**
