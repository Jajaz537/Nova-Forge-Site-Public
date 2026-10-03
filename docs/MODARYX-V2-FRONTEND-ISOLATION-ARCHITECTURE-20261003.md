# MODARYX V2 — Architecture technique du nouveau frontend isolé

**Date : 2026-10-03**
**Statut : conception technique — aucun frontend V2 production écrit**

## 1. Objectif

Construire V2 comme une nouvelle surface qui ne peut pas être stylée, routée ou mutée accidentellement par le legacy.

Le principe est une **liste blanche d'intégration** :

> rien de l'ancien front n'entre dans V2 sans import explicite et audit.

## 2. Frontière de répertoire proposée

Proposition de structure lorsque l'implémentation commencera :

```
v2/
  app/
  components/
  features/
    catalog/
    search/
    games/
    content/
    collections/
    creators/
    community/
    studio/
    library/
  domain/
  contracts/
  stores/
  services/
  design-system/
  assets/
  routes/
  pwa/
  tests/
```

Cette structure est indicative. Elle ne doit pas être créée tant que le gate high-fi n'est pas levé, sauf nécessité technique explicite.

## 3. CSS

### Interdictions

V2 ne doit importer aucun de ces fichiers :

- `assets/site.css`
- `assets/tokens.css`
- `assets/nova-premium-hd*.css`
- `assets/modaryx-foundations.css`
- `assets/modaryx-home-*.css`
- `assets/modaryx-cinematic-system.css`
- `assets/modaryx-community-finishline.css`
- CSS feature legacy comme `catalog.css`, `search.css`, `profiles.css`.

### Règle

Le point d'entrée V2 charge uniquement :
- reset/base V2 ;
- tokens V2 ;
- composants V2 ;
- styles feature V2.

### Garde

Ajouter ultérieurement un test CI qui échoue si un fichier sous `v2/` référence un stylesheet legacy interdit.

## 4. JavaScript

### Interdictions

Le shell V2 ne doit pas charger directement :

- `assets/shell.js`
- `assets/app.js`
- `assets/nova-premium-hd.js`
- scripts feature legacy qui modifient le DOM.

### Réutilisation

La logique utile doit être extraite sous forme de fonctions/modules sans connaissance du DOM V1.

Exemples :

- `search-index.ts/js`
- `catalog-query.ts/js`
- `favorite-store.ts/js`
- `creator-draft-validator.ts/js`
- `distribution-policy.ts/js`
- `reality-context.ts/js`

## 5. DOM

Aucune dépendance V2 à :

- `.topbar`
- `.card`
- `.button`
- `.panel`
- `.hero`
- `.modaryx-realm-hero`
- IDs historiques.

Les composants V2 possèdent leurs propres contrats.

## 6. Routing

### Cible V2

- `/`
- `/discover`
- `/games`
- `/games/:game`
- `/games/:game/:type`
- `/content/:id`
- `/content/:id/files`
- `/content/:id/versions`
- `/content/:id/requirements`
- `/collections`
- `/collections/:id`
- `/creators`
- `/creators/:id`
- `/community`
- `/studio`
- `/library`
- `/search`
- `/security`
- `/docs`

### Legacy redirects

Ne pas réutiliser automatiquement les redirects actuels qui envoient catalog/search/games/profiles vers la homepage/aventures.

Au cutover, la table de redirects sera reconstruite à partir d'une matrice explicite :
- ancienne route ;
- nouvelle destination ;
- type de redirect ;
- conservation query/hash ;
- raison.

## 7. Service Worker

### Risque actuel

Le SW legacy connaît :
- anciennes pages ;
- anciens CSS ;
- anciens JS ;
- anciens manifests.

### V2

Créer une stratégie distincte :

- nouveau cache name/version ;
- allowlist d'assets V2 ;
- aucun précache legacy ;
- network-first ou stale-while-revalidate seulement pour les données adaptées ;
- fail-closed pour distribution/téléchargements ;
- purge contrôlée des anciens caches au moment du cutover.

### Activation

Le nouveau SW ne doit pas prendre le contrôle de production avant validation.

Une phase de test séparée devra vérifier :
- first install ;
- update ;
- old SW → new SW ;
- offline ;
- cache stale ;
- rollback.

## 8. localStorage / IndexedDB

### Namespace V2

Nouvelles clés :
- `modaryx:v2:preferences`
- `modaryx:v2:favorites`
- `modaryx:v2:saved-searches`
- `modaryx:v2:collection-drafts`
- `modaryx:v2:creator-draft`
- `modaryx:v2:profiles`

### Migration

Toute migration :
1. lit l'ancien ;
2. valide strictement ;
3. transforme ;
4. écrit dans le nouveau namespace ;
5. marque la migration ;
6. ne supprime l'ancien qu'après preuve et politique explicite.

## 9. Data contracts

Les données V2 doivent être indépendantes du markup.

### Game

Contrat dédié.

### ContentItem

Identité stable.

### Release

Version/distribution distinctes.

### SearchDocument

Indexable sans HTML.

### Collection / Modpack / Profile

Contrats séparés.

### Creator / Team

Contrats séparés des comptes/auth.

## 10. Backend/API

Réutiliser les endpoints existants seulement si :
- contrat documenté ;
- auth/permissions correctes ;
- état réel ;
- pas de dépendance au HTML V1.

Les clients V2 doivent centraliser :
- erreurs ;
- auth ;
- retries ;
- cache ;
- validation.

## 11. Build

Le build V2 ne doit pas être généré par les templates V1.

Prévoir :
- entrypoint V2 propre ;
- lint ;
- tests unitaires domain ;
- tests UI ;
- tests de routes ;
- test anti-import legacy ;
- test anti-asset Nova-visible ;
- validation schemas ;
- build statique/dynamique selon architecture retenue.

Le générateur `qa/build-games-index.py` legacy reste hors pipeline V2.

## 12. Anti-contamination CI

Tests proposés :

### CSS import guard

Échec si V2 importe un fichier legacy blacklisté.

### JS import guard

Échec si V2 importe un renderer DOM legacy.

### String provenance guard

Scanner les références :
- `nova-forge:`
- anciennes routes ;
- `project-*.html`
- `.modaryx-realm-hero`
- noms de classes legacy critiques.

Toute occurrence doit être classifiée/allowlistée.

### Route guard

Chaque route V2 :
- doit exister ;
- ne doit pas être capturée par un redirect legacy.

### SW guard

Le précache V2 ne doit contenir aucun asset visuel legacy.

## 13. Preview

Avant production, V2 doit être testée sur une surface non conflictuelle :

- branche preview ;
- origine/URL de preview ;
- cache séparé ;
- pas de DNS critique modifié.

Le preview ne doit pas installer un SW qui contrôle l'origine production.

## 14. Cutover

Le cutover futur suit :

1. fonctionnalités V2 validées ;
2. prototype visuel validé ;
3. tests desktop/mobile ;
4. backend vérifié ;
5. SW migration testée ;
6. redirects reconstruits ;
7. caches testés ;
8. rollback défini ;
9. cutover ;
10. smoke tests ;
11. seulement ensuite nettoyage legacy éventuel.

## 15. Rollback

Conserver :
- commit avant cutover ;
- ancien front ;
- ancienne config ;
- matrice de routes.

Ne pas supprimer le legacy dans le même changement que le premier cutover.

## 16. Definition of Done technique V2

Le frontend V2 n'est pas “isolé” tant qu'on n'a pas prouvé :

- aucun CSS legacy chargé ;
- aucun script DOM legacy chargé ;
- aucun SW legacy contrôlant le preview V2 ;
- aucun redirect legacy interceptant les routes V2 ;
- aucun asset Nova visible par accident ;
- localStorage V2 séparé ;
- données legacy migrées explicitement seulement ;
- tests anti-contamination verts.

**État : TERMINÉ pour l'architecture de frontière ; NON IMPLÉMENTÉ volontairement.**
