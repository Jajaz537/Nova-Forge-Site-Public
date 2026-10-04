# MODARYX V2 — Mapping Living Threshold → frontend production

**Date : 2026-10-04**  
**Statut : EN COURS — préparation technique autorisée / aucun root production créé**

## 1. But

Transformer le prototype exploratoire Living Threshold en plan d'implémentation exploitable sans :
- importer le monolithe `App.jsx` tel quel ;
- copier les fixtures de démonstration dans le futur runtime ;
- réintroduire le legacy V1 ;
- choisir une stack par défaut avant fermeture du gate technique ;
- confondre preuve prototype et production.

Le prototype reste une **référence de comportement et de direction**, pas le frontend final.

## 2. Source prototype actuelle

Prototype :
`review-evidence/modaryx-v2-living-threshold-prototype-20261003/`

Fonctions UI actuellement présentes :
- `Logo`
- `Topbar`
- `Compatibility`
- `Media`
- `ContentCard`
- `ProfilesRail`
- `GamesIndex`
- `GlobalSearch`
- `GameHub`
- `Discover`
- `CollectionsPage`
- `CreatorsPage`
- `Catalog`
- `Detail`
- `Library`
- `CreatorStudio`
- `AccountCenter`
- `Community`
- `RightsDashboard`
- `App`

Ces fonctions ne deviennent pas automatiquement les composants finaux. Elles matérialisent les comportements à conserver.

## 3. Mapping vers les patterns production

| Prototype | Pattern production cible | Domaine principal | Dépendance runtime |
|---|---|---|---|
| Logo + Topbar | AppHeader / MobileNav | Navigation | routes + session facultative |
| Compatibility | CompatibilityBadge | CompatibilityClaim | adapter données |
| ContentCard | ContentCard / CompactContentRow | ContentItem + Release | catalog adapter |
| ProfilesRail | GameProfileRail | Profile/Loadout | local profile adapter / manager futur |
| GamesIndex | GamesIndexPage + GameSupportRequest | Game + GameSupportRequest | games adapter + support-request backend futur |
| GlobalSearch | GlobalSearchPage | SearchDocument | search adapter |
| GameHub | GameHubPage + GameHubHeader | Game + ContentItem | games/catalog adapters |
| Discover | DiscoverPage | Discovery feed | discovery adapter |
| CollectionsPage | CollectionsIndexPage | Collection | collections adapter |
| CreatorsPage | CreatorsIndexPage | Creator / Team | creator adapter |
| Catalog | CatalogShell | ContentItem | catalog/search adapter |
| Detail | ContentDetailPage + DetailDecisionPanel | ContentItem + Release + File + Dependency | content adapter |
| Library | LibraryShell | favorites/follows/collections/profiles/searches | local library adapter |
| CreatorStudio | CreatorDashboardShell | Creator/Team/Project/Release | studio adapter/backend futur |
| AccountCenter | AccountSettingsShell | Account / Preferences | local prefs + auth futur |
| Community | CommunityPage | Support/Question/Discussion/TeamActivity | community adapter/backend futur |
| RightsDashboard | RightsAdminPage + RightsCaseList + RightsScopeMatrix | RightsCase + RightsScope + PublisherContact | rights registry/backend futur |
| App | Route shell | routing | stack à sélectionner |

## 4. Primitives et composants à extraire

### Primitives interactives

À construire une fois dans le design system :
- Button
- IconButton
- Link
- Input
- SearchInput
- Select
- Textarea
- Checkbox
- Radio
- Switch
- Chip
- Badge
- Tabs
- EmptyState
- ErrorState
- UnavailableState
- StatusBanner

### Patterns produit

À dériver du prototype actuel :
- GameCard
- GameSupportRequest
- ContentCard
- CompatibilityBadge
- ReleaseSelector
- DependencyRow
- ConflictRow
- FilterGroup
- CollectionCard
- CreatorCard
- GameProfileCard
- ProfileStatus
- ProvenancePanel
- ModerationStatus
- InstallCapability
- SupportState
- LocalDraftState
- ConnectivityBanner
- RightsCaseList
- RightsScopeMatrix
- RightsStateBadge

Aucun de ces patterns ne doit importer le CSS V1.

## 5. Tokens observés dans Living Threshold

Primitives actuelles du prototype :
- background : `#07121d`
- surface : `#0b1926`
- surface secondaire : `#102333`
- ligne : `#21394d`
- texte : `#eef5ff`
- texte secondaire : `#93a9bd`
- cyan : `#35d6ff`
- bleu action : `#2b7cff`
- teal : `#54e6c1`
- violet : `#8d6cff`
- ambre : `#ffb35c`
- danger : `#ff718a`
- rayon principal : `16px`

Cible production :
- convertir ces valeurs en **tokens sémantiques** ;
- éviter qu'un composant dépende directement d'un hex ;
- conserver cyan = action/focus, teal = compatibilité/succès, violet = profils/secondaire, ambre = avertissement/lumière du monde ;
- vérifier à nouveau les contrastes après extraction.

Exemples de tokens :
- `color.surface.canvas`
- `color.surface.elevated`
- `color.border.default`
- `color.text.primary`
- `color.text.muted`
- `color.action.primary`
- `color.focus.ring`
- `color.status.compatible`
- `color.status.warning`
- `color.status.danger`
- `color.profile.accent`

## 6. Données de démonstration → domaines V2

Les constantes du prototype sont **fixtures de démonstration seulement** :

### contentItems
Doivent devenir :
- ContentItem
- ContentType
- Creator / Team
- Release
- CompatibilityClaim

Aucun titre, créateur ou statut démo ne doit entrer automatiquement en production.

### gameItems
Doivent devenir :
- Game
- GameSupportState
- GameVersion

Le libellé `Catalogue consultable` ne doit jamais devenir une promesse de téléchargement.

### collectionDetails
Doivent devenir :
- Collection
- curator
- items
- game/version context
- visibility
- capability

Collection reste distincte de Modpack et Profile.

### creatorDetails
Doivent devenir :
- Creator ou Team
- public identity
- creations
- role
- verification state réel uniquement

## 7. Adapters de données à prévoir

Interfaces conceptuelles, framework-agnostic :

- `GamesRepository`
- `CatalogRepository`
- `ContentRepository`
- `SearchRepository`
- `CollectionsRepository`
- `CreatorsRepository`
- `LibraryRepository`
- `ProfilesRepository`
- `CommunityRepository`
- `StudioRepository`
- `AccountRepository`
- `RightsRepository`

Chaque adapter doit pouvoir retourner :
- nominal ;
- empty ;
- unavailable ;
- stale ;
- error ;
- permission/auth state quand réel.

Les fixtures de preview doivent être séparées des adapters production.

## 8. Routing cible

Le prototype utilise un état React local. La production doit utiliser des routes explicites :

- `/`
- `/discover`
- `/games`
- `/games/:gameId`
- `/games/support-request` — route/formulaire membre ou action équivalente, backend futur
- `/search`
- `/mods`
- `/content/:contentId`
- `/collections`
- `/collections/:collectionId`
- `/modpacks/:modpackId`
- `/profiles/:profileId`
- `/creators/:handle`
- `/teams/:teamId`
- `/community`
- `/studio`
- `/library`
- `/account`
- `/admin/rights` — administration authentifiée uniquement

Aucun fallback vers une page V1 contaminante.

## 9. État local

Le prototype stocke son état en mémoire.

Production :
- namespace V2 : `modaryx:v2:` ;
- migrations explicites et non destructives ;
- aucun `localStorage.clear()` ;
- préférences locales séparées des données serveur ;
- brouillons Creator/Community préservés en cas d'erreur ;
- profils de jeu privés/local-first par défaut.

## 10. Images

Assets exploratoires actuels :
- `living-threshold-hero.png`
- `living-threshold-content-sheet.png`

Avant production :
- décider s'ils deviennent références, placeholders ou sont remplacés ;
- réserver dimensions ;
- fournir variantes responsive ;
- aucun background critique sans stratégie LCP ;
- aucun asset V1 blacklisté.

## 11. Accessibilité à conserver

Les micro-proofs actuels imposent comme minimum de non-régression :
- focus visible 3 px ;
- reduced motion ;
- navigation clavier ;
- mobile sans overflow horizontal global ;
- cibles visibles fréquentes ≥44 px dans le prototype ;
- état jamais transmis par couleur seule ;
- erreurs liées au champ ;
- menus/tabs identifiables.

Ces preuves prototype ne remplacent pas le vrai screen reader ni les appareils physiques.

## 12. États déjà matérialisés

Prototype :
- nominal ;
- empty/no-results ;
- unavailable ;
- local-only ;
- guest/anonymous ;
- offline/stale navigateur ;
- validation error → correction → retry ;
- success local ;
- compatibilité/prérequis ;
- manager/runtime absent explicitement ;
- rights workflow fictif : approved-with-limits / awaiting-response / no-response ;
- outbound rights désactivé sans backend.

États non prouvés réellement :
- vraie session expirée ;
- permission denied serveur ;
- erreur backend réelle ;
- sync conflict réel ;
- PWA/SW production ;
- installation MODARYX Forge.

Ne pas les marquer TERMINÉ avant runtime réel.

## 13. Structure root conceptuelle

Aucun dossier n'est créé par ce document.

Cible possible après levée du gate :

```
v2/
  app/
    routes/
    layouts/
  components/
    primitives/
    product/
    layout/
  domain/
    contracts/
    adapters/
  data/
    fixtures/
    repositories/
  styles/
    tokens/
    components/
  public/
    media/
  tests/
    unit/
    contract/
    browser/
```

Le choix réel dépendra de la stack retenue.

## 14. Anti-contamination

Avant toute création du root :
- checker V2 exécuté ;
- aucune dépendance V1 blacklistée ;
- aucun CSS V1 ;
- aucun SW V1 ;
- aucun namespace historique nouveau ;
- aucun asset historique non classifié ;
- routes preview noindex ;
- build séparé.

## 15. Ordre de migration recommandé

Quand le gate autorisera le root :

1. tokens + primitives ;
2. AppHeader/MobileNav ;
3. routes shell ;
4. Games Index + Game Hub ;
5. Search + Catalog ;
6. Content Detail ;
7. Collections / Modpack / Profiles ;
8. Creators / Community ;
9. Library ;
10. Creator Studio ;
11. Account / Settings ;
12. Rights admin / Game Rights Registry ;
13. PWA V2 séparée ;
14. QA complète ;
15. upgrade/rollback V1→V2 ;
16. cutover seulement après preuves.

## 16. Gate

**TERMINÉ pour le mapping de préparation.**

Toujours BLOQUÉ :
- root/frontend production réel ;
- stack finale ;
- high-fi final ;
- cutover.

Blockers externes restants :
- validation humaine multi-écrans supplémentaire ;
- mobile humain réel ;
- référence approuvée archivable/comparaison ;
- screen reader ;
- appareil physique.

Ce mapping permet de commencer immédiatement l'implémentation réelle dès que la décision canonique de gate l'autorise, sans refaire l'architecture.
