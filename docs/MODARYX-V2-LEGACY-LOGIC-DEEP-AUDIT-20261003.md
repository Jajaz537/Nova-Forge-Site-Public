# MODARYX V2 — Audit approfondi de la logique legacy réutilisable

**Date : 2026-10-03**
**Statut : audit ciblé — aucune migration runtime**

## 1. Catalogue legacy

Fichier étudié : `assets/catalog.js`

### Capacités saines à préserver conceptuellement

- filtrage local ;
- recherche accent-insensitive ;
- tri ;
- favoris locaux ;
- vues sauvegardées locales ;
- validation stricte du contrat JSON ;
- détection de copie cache `offline-stale` ;
- fallback statique si l'index dynamique échoue ;
- restauration du focus après modification d'une liste filtrée ;
- messages explicites sur l'absence de synchronisation distante.

### Couplages legacy à supprimer en V2

- IDs DOM fixes (`#catalog-grid`, `#catalog-filter-form`, etc.) ;
- rendu direct de cartes ;
- classes `catalog-card`, `badge`, `text-button`, `text-link` ;
- taxonomie limitée à `mod/pack/experience` ;
- URLs `project-<id>.html` ;
- clés localStorage `nova-forge:catalog:...`.

### Décision

Extraire une logique indépendante du DOM :

- `CatalogQuery`
- `CatalogFilterState`
- `FavoriteStore`
- `SavedSearchStore`
- `CatalogContractValidator`

Puis reconstruire le rendu V2 avec ses propres composants.

## 2. Recherche legacy

Fichier étudié : `assets/search.js`

### Capacités saines

- index public pré-calculé ;
- recherche locale ;
- validation des entrées ;
- fallback si index indisponible ;
- état `offline-stale` ;
- aucun service distant requis pour le cœur ;
- bouton retry explicite.

### Limites

- recherche monolithique texte uniquement ;
- aucune facette structurée ;
- aucun type de résultat explicite ;
- résultat = lien + résumé ;
- couplage direct au DOM.

### Décision V2

Conserver le principe :

> **recherche locale core, moteur externe optionnel**

Mais élargir le SearchDocument :

- `entityType` : game/content/creator/collection ;
- `gameId` ;
- `contentType` ;
- versions ;
- loaders ;
- tags ;
- creator ;
- status ;
- provenance/distribution ;
- updatedAt.

Le moteur externe ne doit jamais devenir un single point of failure.

## 3. Creator Studio legacy

Fichier étudié : `assets/creator-studio.js`

### Forces à préserver

- brouillon local ;
- migration prudente V1 → V2 ;
- JSON Schema fail-closed ;
- validation des SHA-256 ;
- receipts structurés ;
- dépendances/conflits structurés ;
- fichiers structurés ;
- manifest canonicalisé ;
- import uniquement des brouillons verrouillés ;
- restauration de l'ancien brouillon si import invalide ;
- aucune publication implicite ;
- distribution du brouillon forcée à `locked/downloadable=false` ;
- `releaseReceipt=null` obligatoire ;
- messages qui distinguent validation locale, provenance, signature et compatibilité réelle.

### Limites V2

- clé de stockage encore `nova-forge:creator:...` ;
- UI formulaire monolithique ;
- dépendances encodées en texte `id | versionRange | optional` ;
- fichiers encodés en lignes texte ;
- taxonomie `kind` historique ;
- projet et release encore partiellement mêlés dans le manifest ;
- absence de workflow visuel multi-étapes.

### Décision

Conserver les contraintes, réécrire l'expérience.

Workflow V2 :

1. Project identity
2. Game / Content type
3. Compatibility
4. Dependencies / Conflicts
5. Release
6. Files
7. Rights
8. Provenance
9. Review
10. Submit

Les relations doivent être des lignes/objets éditables, pas un mini-langage texte.

## 4. Téléchargements legacy

Fichier étudié : `assets/downloads.js`

### Forces à préserver

- **fail-closed** ;
- validation stricte des artefacts ;
- chemin de téléchargement same-origin ;
- SHA-256 obligatoire ;
- taille positive ;
- provenance obligatoire ;
- signature status limité ;
- verrouillage si manifeste offline-stale ;
- aucune affirmation de vérification navigateur non effectuée ;
- retry explicite.

### Décision V2

Ce comportement devient un contrat de sécurité transversal.

La disponibilité d'un bouton `Télécharger` doit dépendre de :

- distribution state ;
- artifact manifest ;
- provenance minimale ;
- hash ;
- freshness ;
- droits.

Une copie stale ne doit jamais réactiver une distribution verrouillée.

## 5. Vérificateur SHA-256 legacy

Fichier étudié : `assets/verify.js`

### Forces à préserver

- calcul local via Web Crypto ;
- fichier jamais envoyé par cet outil ;
- validation stricte du SHA-256 attendu ;
- résultat invalidé si le fichier/hash change pendant le calcul ;
- distinction claire :
  - empreinte calculée ;
  - correspondance exacte ;
  - différence ;
  - aucune empreinte attendue ;
- aucune conclusion abusive sur la sécurité du fichier.

### Décision V2

Conserver comme fonction de confiance locale.

Le vocabulaire V2 doit continuer à dire :

> “identique à l'empreinte attendue”

et jamais :

> “fichier sûr”

sur la seule base d'un hash.

## 6. Monde vivant

Fichiers étudiés :

- `assets/living-world.js`
- `assets/real-world-sync.mjs`

### Capacités saines

- fail-soft ;
- contenu principal reste accessible ;
- timezone navigateur comme fallback ;
- climate band ;
- saison ;
- daypart ;
- météo optionnelle ;
- attribution/disclaimer source météo ;
- activité locale dérivée ;
- variables CSS pour ambiance ;
- croissance visuelle différée ;
- chargement après `load` / idle ;
- état `offline-stale`.

### Couplages legacy

- sélecteur `.modaryx-realm-hero` ;
- injection directe d'une couche météo dans le hero ;
- chargement de `real-world-sync.css` ;
- vocabulaire “royaume” ;
- custom properties existantes liées à l'ancienne direction artistique.

### Décision V2

Séparer en deux couches :

#### Reality Context Engine

Pur état :
- timezone ;
- climateBand ;
- season ;
- daypart ;
- weather ;
- source ;
- freshness.

#### Experience Adapter

Décide comment le design V2 interprète cet état.

Ainsi, le moteur réel ne dépend plus d'un hero précis.

## 7. Problème transversal : namespace `nova-forge`

Plusieurs clés localStorage et contrats historiques utilisent encore `nova-forge`.

Dans V2 :

- ne pas renommer aveuglément ;
- classifier chaque clé ;
- prévoir migration explicite ;
- ne jamais fusionner avec Nova Forge OS actuel ;
- nouvelles clés MODARYX doivent employer un namespace clair.

Exemple proposé :

- `modaryx:v2:favorites`
- `modaryx:v2:saved-searches`
- `modaryx:v2:creator-draft`
- `modaryx:v2:preferences`

Toute migration doit :
- lire ancien ;
- valider ;
- écrire nouveau ;
- conserver ancien tant que la migration n'est pas confirmée ;
- ne pas déclarer suppression sans preuve.

## 8. Architecture de réutilisation cible

### Couche 1 — Contracts

- schemas
- validators
- receipts
- content models

### Couche 2 — Domain

- catalog query
- search
- compatibility
- dependencies
- distribution
- creator draft
- reality context

### Couche 3 — Stores

- favorites
- saved searches
- local drafts
- profile/loadout state

### Couche 4 — UI V2

Nouveau code uniquement.

Aucune classe legacy.

## 9. Conclusion

L'ancien code contient plusieurs **bonnes décisions de sûreté et de fail-soft**.

Le risque n'est pas de le conserver dans Git.

Le risque est de **réutiliser ses couches DOM/CSS directement**.

**Décision : logique et contrats sélectionnés = candidats ; rendu et shell = legacy.**

**État : TERMINÉ pour les modules audités ci-dessus / EN COURS pour les autres fichiers fonctionnels.**
