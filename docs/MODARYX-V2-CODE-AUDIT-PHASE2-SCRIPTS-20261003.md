# MODARYX V2 — Audit exhaustif anti-contamination — Phase 2 Scripts assets

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre

Scripts inspectés :

- assets/shell.js
- assets/app.js
- assets/catalog.js
- assets/search.js
- assets/community.js
- assets/creator-studio.js
- assets/profiles.js
- assets/project-hub.js
- assets/downloads.js
- assets/verify.js
- assets/json-schema-lite.js
- assets/nova-premium-hd.js
- assets/living-world.js
- assets/living-world-visual-growth.mjs
- assets/real-world-sync.mjs

## 2. Finding critique — shell.js

### Responsabilités actuelles

`shell.js` :

- enregistre automatiquement `sw.js` ;
- injecte un bouton reduced-motion ;
- injecte un menu mobile ;
- mesure la hauteur du header ;
- injecte une note produit dans le footer ;
- déclenche le chargement différé de `real-world-sync.mjs` ;
- utilise la clé localStorage `nova_site_shell_preferences_v1`.

### Risque

Très élevé.

Ce fichier mélange :

- PWA ;
- navigation ;
- préférences ;
- DOM ;
- identité produit ;
- monde vivant.

Il est donc incompatible avec une isolation V2 stricte.

### Classification

`assets/shell.js` → **À BLOQUER dans V2**

Les capacités utiles devront être extraites en modules séparés.

## 3. Finding critique — app.js

### Responsabilités

`app.js` :

- charge le catalogue ;
- rend des cartes ;
- construit des liens `project-<id>.html` ;
- gère un Smart Profile navigateur ;
- rend le statut public ;
- manipule de nombreux sélecteurs DOM V1.

### Risque

Élevé.

Bonne logique fonctionnelle mélangée au rendu V1.

### Classification

`assets/app.js` → **À EXTRAIRE**

À conserver conceptuellement :

- chargement local-first ;
- états loading/error/stale ;
- contrat `dataClass=demonstration` ;
- Smart Profile local et prudence sur les preuves ;
- public status fail-soft.

À interdire :

- rendu `.card` ;
- routes `project-*.html` ;
- sélecteurs DOM V1.

## 4. catalog.js

### Forces

- filtres ;
- favoris locaux ;
- saved views ;
- validation ;
- fallback cache/stale ;
- focus restauré ;
- pas de sync distante simulée.

### Risque

Couplage DOM/classes/IDs V1 et taxonomie historique.

### Classification

`assets/catalog.js` → **À EXTRAIRE**

## 5. search.js

### Forces

- recherche locale ;
- fallback ;
- retry ;
- index pré-calculé ;
- état stale.

### Limites

- résultat texte/lien V1 ;
- pas de SearchDocument V2 riche.

### Classification

`assets/search.js` → **À EXTRAIRE**

## 6. community.js

### Forces

- brouillons locaux ;
- collections privées locales ;
- import strict ;
- états publication/modération distincts ;
- aucune publication distante simulée.

### Risque

Mélange plusieurs responsabilités et rendu V1.

### Classification

`assets/community.js` → **À EXTRAIRE**

À découper plus tard en :

- collection-store ;
- community-draft-store ;
- submission client ;
- UI V2 séparée.

## 7. creator-studio.js

### Forces

- brouillon local ;
- validation schema ;
- migration prudente ;
- distribution forcée locked dans le brouillon ;
- hash/rights/provenance ;
- import rollback en cas d'échec.

### Risque

Workflow et DOM monolithiques.

### Classification

`assets/creator-studio.js` → **À EXTRAIRE**

Les garde-fous sont précieux et doivent être conservés.

## 8. profiles.js

### Forces

- session réelle ;
- distinction backend/session/profile ;
- WebAuthn capacité ≠ passkey configurée ;
- rôles serveur ;
- profile public séparé ;
- anti-abus.

### Risque

Rendu et état UI V1 couplés.

### Classification

`assets/profiles.js` → **À EXTRAIRE**

## 9. project-hub.js

### Finding

Ce script :

- charge catalog + compatibility graph ;
- utilise `nova-forge:catalog:favorites:v1` ;
- dépend d'IDs DOM fixes ;
- rend `relation-card` ;
- utilise la taxonomie V1 ;
- suppose ContentItem.version dans l'objet projet ;
- travaille avec les routes/fiches V1.

### Classification

`assets/project-hub.js` → **À EXTRAIRE / LEGACY RENDERER**

À préserver :

- lecture des relations ;
- fallback statique ;
- stale cache ;
- favoris locaux si ID stable.

À reconstruire :

- ContentItem / Release ;
- Requirements ;
- rendu ;
- namespace localStorage.

## 10. downloads.js

### Forces

- fail-closed ;
- same-origin ;
- hash requis ;
- provenance ;
- stale = verrouillé ;
- aucune fausse affirmation de vérification.

### Classification

`assets/downloads.js` → **RÉUTILISABLE COMME POLITIQUE / À EXTRAIRE**

Le renderer V1 ne doit pas être repris.

## 11. verify.js

### Forces

- SHA-256 local ;
- Web Crypto ;
- fichier jamais envoyé ;
- distinction correspondance / différence / absence de hash attendu ;
- aucune conclusion “safe”.

### Classification

`assets/verify.js` → **RÉUTILISABLE COMME LOGIQUE / À EXTRAIRE**

## 12. json-schema-lite.js

### Nature

Validateur léger indépendant de l'identité visuelle.

### Classification

`assets/json-schema-lite.js` → **RÉUTILISABLE APRÈS TESTS**

À vérifier plus tard :

- couverture JSON Schema réellement supportée ;
- limites documentées ;
- comportement V2.

## 13. nova-premium-hd.js

### Finding

Ce script ne fait que piloter le menu de `.nova-topbar` et `[data-primary-nav]`.

### Classification

`assets/nova-premium-hd.js` → **LEGACY VISUEL / À BLOQUER**

Aucune raison de le charger dans V2.

## 14. living-world.js

### Forces

- chronologie monde vivant ;
- fail-soft ;
- données structurées ;
- activité locale ;
- progression habitants.

### Risque

Couplé au DOM et au vocabulaire du hero V1.

### Classification

`assets/living-world.js` → **À EXTRAIRE**

Séparer moteur d'état et rendu.

## 15. living-world-visual-growth.mjs

### Finding critique

Ce module :

- charge dynamiquement `living-world-visual-growth.css` ;
- cherche `.modaryx-realm-hero` ;
- cherche `.modaryx-realm-art` ;
- injecte des images/layers dans le hero ;
- remplace la source de l'environnement.

### Risque

Très élevé de contamination visuelle si importé dans V2.

### Classification

`assets/living-world-visual-growth.mjs` → **LEGACY VISUEL / À BLOQUER DIRECTEMENT**

La logique de stage/validation d'assets peut être extraite, mais jamais le renderer.

## 16. real-world-sync.mjs

### Forces

- saison ;
- daypart ;
- climate band ;
- météo optionnelle ;
- source/freshness ;
- fallback browser timezone ;
- activité locale.

### Finding critique

Le module :

- charge dynamiquement `real-world-sync.css` ;
- dépend de `.modaryx-realm-hero` ;
- injecte une weather layer ;
- écrit des variables CSS directement ;
- écrit des datasets sur `documentElement`.

### Classification

`assets/real-world-sync.mjs` → **À EXTRAIRE**

À conserver :

- `inferClimateBandFromTimezone`
- `zonedParts`
- `seasonState`
- `localDaypart`
- résolution de contexte

À bloquer :

- styleLink ;
- weatherLayer ;
- rendu hero V1 ;
- CSS variables V1.

## 17. Matrice scripts

| Script | Classification | Risque contamination |
|---|---|---|
| shell.js | À BLOQUER | Critique |
| app.js | À EXTRAIRE | Élevé |
| catalog.js | À EXTRAIRE | Élevé |
| search.js | À EXTRAIRE | Moyen |
| community.js | À EXTRAIRE | Élevé |
| creator-studio.js | À EXTRAIRE | Élevé |
| profiles.js | À EXTRAIRE | Élevé |
| project-hub.js | À EXTRAIRE / renderer legacy | Élevé |
| downloads.js | RÉUTILISABLE logique / À EXTRAIRE | Moyen |
| verify.js | RÉUTILISABLE logique / À EXTRAIRE | Faible/Moyen |
| json-schema-lite.js | RÉUTILISABLE après tests | Faible |
| nova-premium-hd.js | LEGACY VISUEL / À BLOQUER | Élevé |
| living-world.js | À EXTRAIRE | Élevé |
| living-world-visual-growth.mjs | LEGACY VISUEL / À BLOQUER | Critique |
| real-world-sync.mjs | À EXTRAIRE | Critique si renderer repris |

## 18. Architecture de migration scripts

La V2 devra isoler quatre couches :

### Contracts
- schemas
- validators
- receipts

### Domain
- search
- catalog
- compatibility
- distribution
- reality context

### Stores/clients
- favorites
- drafts
- profiles
- sessions
- community

### UI V2
- nouveau code uniquement

Aucun renderer V1 ne doit être importé par la couche UI V2.

## 19. Gate

Avant premier code V2 :

- blacklist des scripts V1 à établir ;
- dépendances dynamiques à tracer ;
- nouveau namespace storage ;
- SW séparé ;
- tests anti-import.

**État Phase 2 : TERMINÉ pour assets scripts. Audit global : EN COURS.**
