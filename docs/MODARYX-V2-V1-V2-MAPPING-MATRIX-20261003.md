# MODARYX V2 — Matrice de mapping V1 → V2

**Date : 2026-10-03**
**Statut : TERMINÉ — conception de compatibilité, aucune migration runtime exécutée**

## 1. Principe

Les contrats V1 restent immuables pour compatibilité.

La V2 :
- lit V1 via adapters explicites ;
- normalise vers les concepts V2 ;
- ne renomme pas silencieusement les objets ;
- ne fabrique pas de données manquantes ;
- marque toute perte d'information ou preuve manquante.

## 2. Universal Mod Manifest v1

### V1
- id
- name
- kind
- version
- target
- dependencies
- conflicts
- files
- rights
- provenance
- distribution

### V2
- ContentItem
- Release
- FileArtifact[]
- Dependency[]
- Conflict[]
- CompatibilityClaim[]
- RightsClaim
- ProvenanceReceipt
- DistributionState

### Règles
- `id` projet → ContentItem.id si stable ;
- `version` → Release.version ;
- `files[]` → FileArtifact[] ;
- `kind` → ContentType seulement via table de mapping explicite ;
- optional bool legacy → relation typed ;
- compatibilité globale → claims distincts si preuve disponible ;
- aucune compatibilité supplémentaire inventée.

### Perte possible
- granularité platform/DLC/loader ;
- distinction required/recommended ;
- evidence par claim.

État :
**MAPPABLE PARTIELLEMENT — aucune migration automatique sans validation.**

## 3. compatibility-graph v1

### V1
Relations principalement :
- compatible
- incompatible
- measured
- estimated
- unknown

### V2
`CompatibilityClaim` :
- subjectReleaseId
- gameId
- gameVersion
- platform
- loader
- environment
- state
- evidenceLevel
- evidenceRef

### Règle
- measured → evidenceLevel=measured si receipt existe ;
- estimated → evidenceLevel=estimated ;
- unknown → unknown ;
- absence de dimension → champ inconnu, jamais supposé.

État :
**MAPPABLE avec perte de dimensions.**

## 4. collection v1

### V1
- liste d'IDs
- local/private state
- sync state

### V2
Collection :
- curator
- game context
- ordered/unordered items
- notes
- visibility
- metadata

### Règle
Un objet v1 n'est jamais transformé en Modpack ou Profile.

Si les métadonnées curateur/notes n'existent pas :
- valeur absente ;
- ne pas inventer.

État :
**MAPPABLE vers Collection uniquement.**

## 5. public-profile v1

### V1
Inclut :
- identité publique
- creator fields
- collections inline

### V2
Séparation :
- Account
- PublicProfile
- Creator
- Team membership
- Collection references

### Règles
- auth/account data non exposée vers PublicProfile ;
- creator flag → Creator relation uniquement si preuve suffisante ;
- collections inline → références séparées ;
- rôle plateforme jamais dérivé de creator metadata.

État :
**MAPPABLE avec séparation obligatoire.**

## 6. community-submission v1

### V1
Types :
- discussion
- review
- comment

États :
- local-only
- local-draft
- not-submitted
- submitted/published selon backend

### V2
CommunityEntry :
- discussion
- review
- support-question
- issue
- comment
- report séparé du contenu public

### Règle
Ne jamais mapper automatiquement un “problème” en report.

État :
**MAPPABLE pour types connus ; support/report nécessitent nouveaux objets.**

## 7. community-write v1

### Finding
Le contrat mélange intent communautaire et `collection-update`.

### V2
Séparer :
- CommunityWriteCommand
- CollectionMutationCommand
- ModerationCommand

État :
**NON MAPPABLE 1:1 — adapter de dispatch requis.**

## 8. smart-profile v1

### V1
Recommandation locale selon :
- hardwareConcurrency
- deviceMemory
- viewport
- DPR

### V2
Renommé conceptuellement :
`BrowserCapabilityRecommendation`

### Règle
Ne jamais mapper vers Profile/Loadout.

État :
**MAPPABLE APRÈS RENOMMAGE CONCEPTUEL.**

## 9. search-adapter v1

### V1
- local-first
- external optional
- core not dependent on provider

### V2
- SearchDocument
- LocalSearchAdapter
- OptionalExternalSearchAdapter

### Règle
Préserver canonical IDs et fallback local.

État :
**RÉUTILISABLE avec nouveau document model.**

## 10. publication-receipt v1

### V1
- release identity
- manifest digest
- file digests
- rights
- provenance
- moderation
- release state

### V2
- Release
- FileArtifact[]
- ProvenanceReceipt
- ModerationDecision
- DistributionState

État :
**MAPPABLE — bonne fondation.**

## 11. trusted-signer-set v1

### V1 actuel
- no-trust-anchor-published
- signers=[]

### V2
Même sémantique.

Règle :
- ne jamais convertir cet état en “verified” ;
- distribution signée production reste bloquée.

État :
**RÉUTILISABLE.**

## 12. account-security v1

### V1
- passkeys
- sessions
- recovery
- privileged re-auth

### V2
Même domaine sécurité.

Règle :
- nouveaux IDs/schema MODARYX ;
- pas de migration de secret privé ;
- session/token restent serveur-only.

État :
**RÉUTILISABLE via versioning.**

## 13. moderation v1

### V1
Cible surtout communauté.

### V2
Étendre les target types :
- ContentItem
- Release
- FileArtifact
- Collection
- Creator
- Team
- CommunityEntry

### Règle
- receipts immuables ;
- appeals distincts ;
- authority serveur.

État :
**RÉUTILISABLE / À ÉTENDRE.**

## 14. storage-resolver / repair-network

### V1
- digest exact
- immutable identity
- no substitution
- revoked/withdrawn handling

### V2
Même sécurité appliquée à FileArtifact.

État :
**RÉUTILISABLE.**

## 15. integration-readiness

### V1
Readiness ledger :
- local-only
- contract-ready
- blocked-inputs
- not-connected
- distribution-locked

### V2
Même logique, nouvelles capability IDs.

État :
**RÉUTILISABLE COMME MODÈLE.**

## 16. data/catalog.json

### Nature
Démonstration.

### V2
Peut devenir :
- fixture de test ;
- sample explicite.

Interdit :
- seed production implicite ;
- faux corpus réel.

État :
**FIXTURE ONLY.**

## 17. data/search-index.json

### Nature
Index V1 couplé aux routes HTML.

### V2
Reconstruire depuis :
- SearchDocument[]
- routes V2
- IDs canoniques.

État :
**NE PAS MAPPER EN PLACE — REBUILD.**

## 18. data/living-world.json

### V1
- phases
- compagnons
- slots assets
- status awaiting-assets

### V2
Séparer :
- RealityContext
- WorldProgression
- VisualExperienceAdapter

### Règle
Un asset physiquement présent mais path=null reste non activé.

État :
**MAPPABLE PARTIELLEMENT.**

## 19. localStorage legacy

### Observé
Namespaces historiques :
- `nova_site_shell_preferences_v1`
- `nova-forge:...`
- autres clés feature V1.

### V2
Namespace :
`modaryx:v2:`

### Règles
- lecture legacy via migrator uniquement ;
- copie par type connu ;
- version migration ;
- pas de delete global ;
- rollback possible ;
- données inconnues conservées.

État :
**MIGRATION PLANIFIÉE / NON EXÉCUTÉE.**

## 20. Routes

V1 → V2 uniquement via table explicite.

Exemples :
- `/games/` → `/games`
- `/creator-studio` → `/studio` candidat
- `/project-<id>.html` → `/content/:id` seulement si objet réel correspondant.

État :
**PLANIFIÉ / NON EXÉCUTÉ.**

## 21. Matrice synthèse

| Contrat V1 | Cible V2 | Stratégie |
|---|---|---|
| UMM | ContentItem + Release + FileArtifact | mapper |
| compatibility graph | CompatibilityClaim[] | mapper avec unknowns |
| collection | Collection | mapper |
| public-profile | PublicProfile + Creator relations | split |
| community-submission | CommunityEntry | mapper partiel |
| community-write | plusieurs commands | split |
| smart-profile | BrowserCapabilityRecommendation | rename semantic |
| search-adapter | Search adapters V2 | preserve principle |
| publication-receipt | Release/Trust | mapper |
| trusted-signers | TrustStore | preserve |
| account-security | Security domain | version |
| moderation | Moderation domain | extend |
| storage/repair | FileArtifact recovery | preserve |
| integration-readiness | Capability ledger | extend |
| catalog.json | fixture | no production |
| search-index.json | SearchDocument index | rebuild |
| living-world.json | context/progression | split |
| localStorage V1 | modaryx:v2 namespace | migrator |
| routes V1 | routes V2 | explicit redirects |

## 22. Gate

Avant tout mapper codé :
- schéma source connu ;
- schéma cible versionné ;
- règle de perte documentée ;
- fixture V1 ;
- fixture V2 attendue ;
- test invalid input ;
- test no-invention ;
- test rollback si mutation.

**État : TERMINÉ — matrice de conception / aucun mapper runtime exécuté.**
