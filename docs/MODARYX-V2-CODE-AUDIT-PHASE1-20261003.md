# MODARYX V2 — Audit exhaustif anti-contamination — Phase 1

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant tout frontend V2**

## 1. Portée

Inventaire frais du dépôt `main` :

- **525 fichiers**
- branche V2 d'audit : `audit/modaryx-v2-legacy-boundary-20261003`
- `main` observé : `d8d5ea5509f07c5bf5a4424293cfa404643c239f`
- aucune modification du site public ;
- aucun changement DNS/Cloudflare critique ;
- aucun frontend V2 créé.

L'objectif est de classer chaque fichier et chaque mécanisme susceptible d'affecter la future V2.

## 2. Catégories officielles

Chaque fichier ou groupe de fichiers doit finir dans une catégorie :

- **RÉUTILISABLE**
- **À EXTRAIRE**
- **LEGACY VISUEL**
- **HISTORIQUE / PROVENANCE**
- **À BLOQUER**
- **À REVALIDER**

## 3. Premier périmètre inspecté

Inspecté en priorité :

- `index.html`
- `catalog.html`
- `community.html`
- `creator-studio.html`
- `profiles.html`
- `sw.js`
- `_redirects`
- `_headers`
- `site.webmanifest`
- `preview.mjs`
- `package.json`

## 4. Finding critique — Service Worker legacy

### Precache actuel

`sw.js` précache notamment :

- `assets/tokens.css`
- `assets/nova-premium-hd.css`
- `assets/modaryx-premium-refinement.css`
- `assets/modaryx-foundations.css`
- `assets/modaryx-home-cinematic.css`
- `assets/modaryx-home-finishline.css`
- `assets/shell.js`
- `assets/app.js`
- `assets/nova-premium-hd.js`

### Risque

Un navigateur déjà contrôlé par ce SW peut continuer à servir :

- ancien CSS ;
- ancien shell ;
- ancien app renderer ;
- anciens assets ;
- anciennes pages.

Même si le nouveau frontend est correct, le SW legacy pourrait donc réinjecter des ressources de l'ancien design.

### Classification

`sw.js` → **À BLOQUER pour la V2**

Il reste utile comme référence historique et fonctionnelle, mais ne doit pas contrôler le preview V2.

### Règle V2

Le futur preview V2 doit utiliser :

- nouveau cache name ;
- nouvelle allowlist ;
- aucun CSS/JS visuel legacy ;
- migration SW contrôlée ;
- micro-test upgrade old SW → new SW ;
- rollback.

## 5. Finding critique — Homepage legacy

### Scripts chargés

`index.html` charge directement :

- `assets/shell.js`
- `assets/app.js`
- `assets/nova-premium-hd.js`
- `assets/living-world.js`

### Styles

Charge :

- `assets/modaryx-home-finishline.css`

et référence aussi :

- `assets/modaryx-foundations.css`

### Structure

Le HTML contient des conventions legacy :

- `.nova-topbar`
- `.nova-nav`
- `.modaryx-realm-hero`
- `.hero-grid`
- `.edition-panel`
- `.chapter`
- `.card`
- `.trust-rail`
- `.modaryx-portals`

### Conclusion

`index.html` → **LEGACY VISUEL**

La V2 ne doit pas être construite en éditant progressivement cette structure.

## 6. Finding — anciennes routes produit

Le site actuel utilise encore des routes comme :

- `catalog.html`
- `search.html`
- `creator-studio.html`
- `profiles.html`
- `community.html`
- `project.html`
- `project-*.html`
- `ecosystem.html`
- `downloads.html`

Ces routes sont cohérentes avec V1 mais pas avec la future IA V2.

### Classification

Pages HTML V1 → **LEGACY VISUEL / HISTORIQUE**

Le contenu fonctionnel peut être audité, mais le routing V2 doit être nouveau.

## 7. Finding — _redirects

Le fichier `_redirects` actuel ne contient pas de redirects path actifs.

### Risque

Faible pour l'instant.

### Classification

`_redirects` → **RÉUTILISABLE comme base vide**, mais à reconstruire lors du cutover.

## 8. Finding — _headers

`_headers` contient des headers de sécurité utiles :

- nosniff ;
- referrer policy ;
- X-Frame-Options ;
- HSTS ;
- permissions policy ;
- noindex preview ;
- canonicals par route V1.

### Classification

- headers sécurité → **RÉUTILISABLE après audit**
- canonicals V1 → **À REVALIDER / À REMPLACER**

La V2 ne doit pas reprendre les canonicals de routes V1 tels quels.

## 9. Finding — manifest PWA

`site.webmanifest` est déjà sous marque MODARYX, mais référence les routes V1 :

- `catalog.html`
- `search.html`
- `creator-studio.html`
- `profiles.html`
- `community.html`
- `ecosystem.html`
- `downloads.html`
- etc.

### Classification

`site.webmanifest` → **À REVALIDER**

Les icônes peuvent être réutilisées seulement après validation de l'identité V2.

Les shortcuts doivent être reconstruits selon l'IA V2.

## 10. Finding — preview.mjs

Le serveur local :

- sert le dépôt statique ;
- utilise `Cache-Control: no-store` ;
- bloque les traversées de chemin ;
- résout les routes sans extension vers `.html`.

### Classification

`preview.mjs` → **RÉUTILISABLE comme outil de preview legacy**, mais pas suffisant comme preuve d'isolation V2.

Il peut servir temporairement si le répertoire V2 est physiquement isolé.

## 11. Finding — package.json

Scripts actuels :

- `dev` → preview legacy ;
- `build` → générateur jeux V1 + check-site ;
- `lint` → check-site ;
- `test` → final source validation V1.

### Risque

Le pipeline actuel est fortement couplé à V1.

### Classification

`package.json` → **À REVALIDER**

La V2 aura besoin de commandes séparées, sans supprimer immédiatement les commandes V1.

Exemple futur :

- `v2:dev`
- `v2:build`
- `v2:test`
- `v2:anti-contamination`

## 12. Matrice Phase 1

| Élément | Classification | Risque V2 |
|---|---|---|
| index.html | LEGACY VISUEL | Très élevé |
| pages HTML V1 | LEGACY VISUEL | Élevé |
| sw.js | À BLOQUER | Très élevé |
| _redirects | RÉUTILISABLE / à reconstruire | Faible actuel |
| _headers sécurité | RÉUTILISABLE APRÈS AUDIT | Moyen |
| canonicals V1 | À REVALIDER | Moyen |
| site.webmanifest | À REVALIDER | Élevé |
| preview.mjs | RÉUTILISABLE OUTIL | Faible |
| package.json pipeline | À REVALIDER | Élevé |

## 13. Règle immédiate

**Aucun code V2 ne doit être introduit dans les pages HTML V1 ni sous le contrôle du SW actuel.**

Le futur frontend doit être isolé avant tout branchement fonctionnel.

## 14. Prochain lot prioritaire

Inspecter exhaustivement :

1. `assets/*.js`
2. `assets/*.css`
3. `functions/`
4. `schemas/`
5. `data/`
6. `.github/workflows/`
7. `qa/`
8. `migrations/`
9. pages jeu et projet ;
10. documents/générateurs susceptibles de modifier le build.

**État Phase 1 : TERMINÉ pour le périmètre ci-dessus. Audit global : EN COURS.**
