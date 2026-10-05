# MODARYX V2 — Audit exhaustif anti-contamination — Phase 3 CSS

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre

Stylesheets inspectés dans `assets/` :

- catalog.css
- creator-studio.css
- living-world-visual-growth.css
- living-world.css
- modaryx-cinematic-system.css
- modaryx-community-finishline.css
- modaryx-foundations.css
- modaryx-home-cinematic.css
- modaryx-home-finishline.css
- modaryx-pages-finishline.css
- modaryx-platform-refinement.css
- modaryx-premium-refinement.css
- modaryx-search-cinematic-fix.css
- modaryx-studio-cinematic-fix.css
- nova-premium-hd-secondary.css
- nova-premium-hd.css
- official.css
- profiles.css
- project-hub.css
- real-world-sync.css
- search.css
- site.css
- tokens.css
- verify-picker.css

## 2. Finding critique — styles globaux

Plusieurs fichiers redéfinissent des sélecteurs globaux ou quasi globaux :

- `:root`
- `*`
- `html`
- `body`
- `body:before`
- `a`
- `button`
- `input`
- `nav`
- `h1/h2/h3`
- `.button`
- `.card`
- `.panel`
- `.topbar`
- `.site-footer`

### Risque

Critique.

Un simple import accidentel peut changer :

- typographie ;
- couleurs ;
- espacements ;
- navigation ;
- cartes ;
- formulaires ;
- responsive ;
- motion ;
- focus ;
- arrière-plan.

### Décision

Aucun stylesheet V1 ne doit être chargé dans le scope V2.

## 3. Finding critique — namespace Nova dans les tokens

`assets/tokens.css` définit encore des variables telles que :

- `--nova-canvas`
- `--nova-navigation`
- `--nova-panel`
- `--nova-card`
- `--nova-gold`
- `--nova-guide`
- `--nova-font`

### Risque

Confusion d'identité entre MODARYX web et Nova Forge OS.

### Classification

`assets/tokens.css` → **HISTORIQUE / LEGACY VISUEL**

Les valeurs utiles peuvent inspirer une comparaison, mais les noms et contrats ne doivent pas entrer dans V2.

## 4. Finding critique — modaryx-home-finishline.css

Ce fichier contient explicitement des blocs “bundled from” :

- `assets/tokens.css`
- `assets/nova-premium-hd.css`

Il combine donc :

- tokens historiques ;
- règles globales ;
- styles homepage ;
- composants ;
- responsive ;
- anciennes références Nova.

### Risque

Très élevé.

Il peut contaminer pratiquement n'importe quelle surface V2.

### Classification

`assets/modaryx-home-finishline.css` → **À BLOQUER**

## 5. nova-premium-hd.css / secondary

Ces fichiers définissent :

- base globale ;
- shell ;
- boutons ;
- cartes ;
- topbar ;
- grids ;
- responsive ;
- couleurs/tokens Nova.

### Classification

`assets/nova-premium-hd.css` → **LEGACY VISUEL / À BLOQUER**

`assets/nova-premium-hd-secondary.css` → **LEGACY VISUEL / À BLOQUER**

## 6. site.css

### Finding

`site.css` agit comme feuille globale V1 :

- `:root`
- body background
- nav
- hero
- buttons
- cards
- panels
- requirements
- footer
- responsive
- motion

Il redéfinit ensuite ses propres variables via les variables `--nova-*`.

### Classification

`assets/site.css` → **LEGACY VISUEL / À BLOQUER**

## 7. modaryx-cinematic-system.css

### Finding

Ce fichier applique une direction artistique transverse à :

- body ;
- topbar ;
- hero ;
- catalog hero ;
- project hero ;
- studio hero ;
- profile hero ;
- sections ;
- cards ;
- panels ;
- forms.

### Risque

Très élevé car il cible plusieurs classes génériques.

### Classification

`assets/modaryx-cinematic-system.css` → **LEGACY VISUEL / À BLOQUER**

## 8. modaryx-home-cinematic.css / finishline

Ces fichiers pilotent :

- homepage ;
- realm hero ;
- portals ;
- chapters ;
- catalog teaser ;
- security stage ;
- downloads stage ;
- FAQ ;
- footer.

### Classification

→ **LEGACY VISUEL / À BLOQUER**

## 9. modaryx-foundations.css

Même si son nom évoque des fondations, il appartient au système V1.

### Règle

Ne pas considérer “foundations” comme autorisation automatique de réutilisation.

### Classification

→ **LEGACY VISUEL / À REVALIDER COMME RÉFÉRENCE SEULEMENT**

## 10. modaryx-pages-finishline.css / platform-refinement / premium-refinement

Ces fichiers sont des couches d'override ou de finition historique.

### Risque

Ils peuvent produire des conflits de cascade difficiles à détecter.

### Classification

→ **LEGACY VISUEL / À BLOQUER**

## 11. Fix CSS spécifiques

- modaryx-search-cinematic-fix.css
- modaryx-studio-cinematic-fix.css

### Finding

Ce sont des rustines ciblées sur V1.

### Classification

→ **HISTORIQUE / À BLOQUER**

## 12. CSS feature V1

### catalog.css
Couplé à :
- `.catalog-page`
- `.filter-grid`
- `.catalog-card`
- saved views
- taxonomie/rendu V1

→ **LEGACY VISUEL**

### creator-studio.css
Couplé au formulaire monolithique V1.

→ **LEGACY VISUEL**

### profiles.css
Couplé :
- account console
- public profile console
- WebAuthn UI V1
- hero historique

→ **LEGACY VISUEL**

### project-hub.css
Couplé :
- project page
- relation cards
- game directory
- evidence chips V1

→ **LEGACY VISUEL**

### search.css
Simple mais lié au markup V1.

→ **LEGACY VISUEL**

### official.css
Contient status band, verify UI et conventions V1.

→ **LEGACY VISUEL / À EXTRAIRE VISUELLEMENT SI BESOIN**

## 13. Monde vivant CSS

### living-world.css
Dépend directement de :

- `.modaryx-realm-hero`
- `.modaryx-realm-art`
- datasets V1
- animations spécifiques

→ **LEGACY VISUEL / À BLOQUER**

### living-world-visual-growth.css
Dépend de la couche d'images V1.

→ **LEGACY VISUEL / À BLOQUER**

### real-world-sync.css
Dépend :
- datasets `data-local-weather`
- `.modaryx-realm-art`
- `.living-world-visual-layers`
- weather layer V1

→ **LEGACY VISUEL / À BLOQUER**

Le moteur de contexte réel pourra être réutilisé, pas ces styles.

## 14. verify-picker.css

Petit pattern d'accessibilité pour input file.

### Classification

→ **À REVALIDER**

Le principe “input file visuellement masqué + focus visible sur label” est utile, mais le code V2 doit être recréé dans son design system.

## 15. Problème de cascade historique

Le dépôt contient plusieurs générations de styles :

1. site.css
2. tokens.css
3. nova-premium-hd.css
4. modaryx refinements
5. cinematic system
6. finishline CSS
7. feature CSS
8. fix CSS

### Conclusion

Même sans bug individuel, la superposition de couches crée un risque structurel.

**La V2 doit repartir avec une cascade neuve et contrôlée.**

## 16. Classification globale CSS

### À BLOQUER DIRECTEMENT

- site.css
- tokens.css
- nova-premium-hd.css
- nova-premium-hd-secondary.css
- modaryx-cinematic-system.css
- modaryx-home-cinematic.css
- modaryx-home-finishline.css
- modaryx-pages-finishline.css
- modaryx-platform-refinement.css
- modaryx-premium-refinement.css
- modaryx-search-cinematic-fix.css
- modaryx-studio-cinematic-fix.css
- living-world.css
- living-world-visual-growth.css
- real-world-sync.css

### LEGACY VISUEL FEATURE

- catalog.css
- creator-studio.css
- profiles.css
- project-hub.css
- search.css
- official.css
- modaryx-community-finishline.css

### À REVALIDER COMME PATTERN, PAS IMPORT DIRECT

- verify-picker.css
- certains principes d'accessibilité/motion présents dans les feuilles V1

## 17. Règle V2

Le futur shell V2 doit posséder :

- reset/base V2 ;
- tokens `--modaryx-*` ou nomenclature approuvée ;
- composants V2 ;
- styles feature V2 ;
- aucun sélecteur global hérité ;
- aucun `--nova-*` nouveau.

## 18. Guard futur

Ajouter un test anti-contamination qui échoue si un fichier sous V2 référence :

- `assets/site.css`
- `assets/tokens.css`
- `assets/nova-premium-hd*.css`
- `assets/modaryx-*-finishline.css`
- `assets/modaryx-cinematic-system.css`
- `assets/living-world*.css`
- `assets/real-world-sync.css`

## 19. Erreur rencontrée pendant l'audit

Un premier lot CSS trop large a dépassé le nombre maximal d'appels du connecteur.

Procédure appliquée :

erreur exacte
→ isolation
→ découpage en petits lots
→ micro-proof par lectures réussies
→ continuation.

Aucun replay global.

**État Phase 3 : TERMINÉ pour CSS assets. Audit global : EN COURS.**
