# MODARYX V2 — Frontières modules et adapters

**Date : 2026-10-03**
**Statut : TERMINÉ — conception technique, aucun frontend créé**

## 1. Principe

V2 ne consomme jamais directement un renderer, une page, un CSS ou un Service Worker V1.

Architecture cible :

UI V2
→ application services
→ domain modules
→ adapters
→ API/data/runtime externes

Le sens de dépendance ne doit jamais être inversé.

## 2. Couche UI V2

Responsabilités :

- composition de pages ;
- composants ;
- états loading/empty/error/offline/auth/incompatible ;
- navigation ;
- accessibilité ;
- responsive ;
- motion ;
- affichage des claims de confiance.

Interdictions :

- appels directs aux fichiers legacy ;
- lecture directe de localStorage historique ;
- accès direct aux datasets de démonstration ;
- logique d'auth/modération dans les composants ;
- logique de compatibilité dispersée dans le DOM.

## 3. Application services

Services prévus :

- DiscoveryService
- SearchService
- GameHubService
- ContentDetailService
- LibraryService
- CollectionService
- ModpackService
- ProfileLoadoutService
- CreatorStudioService
- CommunityService
- AccountService
- InstallService
- TrustService
- RealityContextService

Ils orchestrent les use-cases mais ne connaissent pas le DOM.

## 4. Domain modules

Objets/domain rules :

- Game
- ContentItem
- ContentType
- Release
- FileArtifact
- Dependency
- Conflict
- CompatibilityClaim
- Collection
- Modpack
- ProfileLoadout
- Creator
- Team
- Account
- PublicProfile
- ModerationReceipt
- ProvenanceReceipt

Règle :

Aucun module domain ne dépend du navigateur, du CSS, d'Auth0 ou de Cloudflare.

## 5. Adapters

### CatalogAdapter

Sources possibles :
- API V2 future ;
- fixture technique isolée ;
- compat V1 en lecture seule.

Sortie :
- ContentItem[]
- Game[]
- facettes normalisées

Ne retourne jamais de DOM ou markup.

### SearchAdapter

Sources :
- index local V2 ;
- adapter externe optionnel.

Règle :
- local-first ;
- external not required for core ;
- preserve canonical content IDs.

### AuthAdapter

Encapsule :
- session ;
- login/logout ;
- authority ;
- re-auth.

Le fallback V1 `/profiles` ne fuit pas vers l'UI V2.

### CommunityAdapter

Encapsule :
- drafts locaux ;
- publication distante ;
- modération ;
- appels.

V2 ne suppose jamais qu'un backend est actif.

### TrustAdapter

Encapsule :
- digests ;
- attestation ;
- trusted signer set ;
- publication receipt ;
- distribution gate.

### StorageRepairAdapter

Encapsule :
- resolver ;
- transport ;
- repair orchestration.

Aucune substitution silencieuse.

### RealityContextAdapter

Encapsule :
- heure locale ;
- saison ;
- météo normalisée ;
- confidentialité ;
- fallback.

Ne connaît pas le renderer visuel.

### InstallAdapter

Expose uniquement des capabilities réelles :

- manual download available ;
- manager runtime connected ;
- install profile selected ;
- dependency resolution available.

L'UI ne montre pas de bouton manager si le capability flag est faux.

## 6. Compatibility adapters V1

Si un contrat V1 doit être lu temporairement :

V1 data
→ V1CompatAdapter
→ normalisation V2
→ domain V2

Jamais :

UI V2 → V1 data directement.

## 7. Mapping V1 → V2

Mappings explicites requis :

- public-profile v1 → Account/PublicProfile/Creator relations ;
- collection v1 → Collection v2 ;
- compatibility graph v1 → CompatibilityClaim[] ;
- UMM v1 → ContentItem + Release + FileArtifact ;
- smart-profile v1 → BrowserCapabilityRecommendation, pas ProfileLoadout ;
- catalog demo → fixture V2 uniquement.

## 8. Erreurs

Les adapters retournent des erreurs structurées :

- unavailable
- unauthorized
- forbidden
- offline
- stale
- incompatible
- unverified
- removed
- quarantined
- invalid-data
- capability-missing

L'UI choisit la présentation, pas l'adapter.

## 9. Observabilité

Chaque adapter peut exposer :

- source ;
- freshness ;
- evidence state ;
- capability state.

Mais aucun secret, token ou information privée ne remonte vers l'UI.

## 10. Tests

Chaque adapter doit avoir :

1. contract tests ;
2. fail-closed tests ;
3. malformed input tests ;
4. offline tests si pertinent ;
5. V1 mapping tests si compat utilisée ;
6. no-legacy-import guard.

## 11. Import allowlist conceptuelle

V2 peut dépendre de :

- modules V2 ;
- adapters V2 ;
- types/schemas V2 ;
- fonctions backend réutilisées via API ;
- utilitaires purs réécrits/extraits.

V2 ne peut pas dépendre directement de :

- `assets/*.js` V1 ;
- `assets/*.css` V1 ;
- pages HTML V1 ;
- `sw.js` V1 ;
- datasets démo comme source production ;
- namespace Nova historique.

## 12. Arborescence cible conceptuelle

```
v2/
  app/
  components/
  pages/
  domain/
  application/
  adapters/
  contracts/
  styles/
  assets/
  tests/
```

Aucun fichier n'a encore été créé sous `v2/`.

## 13. Gate

Avant création de la première surface produit :

- adapter boundaries approuvées ;
- anti-contamination guard actif ;
- schémas V2 minimaux prêts ;
- wireframes core fermés ;
- tree test humain effectué.

**État : TERMINÉ — conception uniquement.**
