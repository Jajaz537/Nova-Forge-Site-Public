# MODARYX — micro-preuve navigateur reflow Chromium — 19 septembre 2026

Statut : **TERMINÉ — micro-preuve Chromium ciblée intégrée ; portée strictement bornée ci-dessous**.

## But

Compléter les garde-fous source par une vraie navigation dans Chromium headless, sans confondre cette preuve avec :

- zoom navigateur natif 400 % ;
- lecteur d'écran natif ;
- appareil physique ;
- Safari/Firefox ;
- Core Web Vitals ;
- PWA réellement hors ligne.

## Périmètre

Le script `qa/check-browser-reflow.mjs` utilise uniquement les API Node.js et le protocole Chrome DevTools, sans dépendance npm.

Il ouvre les **17 pages publiques** à quatre largeurs CSS :

- 320 px ;
- 400 px ;
- 768 px ;
- 1440 px.

Soit **68 navigations ciblées**.

Pour chaque navigation il contrôle :

- document chargé ;
- largeur de viewport réellement appliquée ;
- absence de débordement horizontal de page > 1 px ;
- H1 visible ;
- landmark principal présent ;
- footer partagé présent ;
- absence d'exception JavaScript remontée par Chromium ;
- sur 320/400 px, ouverture réelle du menu mobile lorsqu'un bouton de menu existe.

Une passe séparée émule `prefers-reduced-motion: reduce` sur l'accueil et exige que l'animation du panorama principal soit désactivée.

## Environnement

Le workflow :

1. checkout du candidat exact ;
2. localise Chrome/Chromium fourni par `ubuntu-latest` ;
3. démarre un serveur HTTP local en lecture seule sur `127.0.0.1:4173` ;
4. exécute la micro-preuve ;
5. arrête le serveur.

Aucun secret, aucun déploiement, aucune mutation Cloudflare/DNS et aucune dépendance npm téléchargée.

## Portée de conclusion

Un PASS de ce workflow peut prouver le comportement observé dans **Chromium headless** aux largeurs testées.

Il ne doit jamais être présenté comme :

- preuve native zoom 400 % ;
- preuve appareil ;
- preuve tactile réelle ;
- preuve Firefox/Safari ;
- preuve lecteur d'écran ;
- preuve de performance utilisateur finale.


## Résultats réels

### Premier run ciblé

Run : `35463522362`  
Résultat : **FAIL ciblé**.

Défauts observés uniquement à 320 px :

- `project-ember-textures.html` : overflow horizontal 33 px ;
- `project-balanced-latency-pack.html` : overflow horizontal 33 px ;
- `project-forge-night-experience.html` : overflow horizontal 33 px.

Isolation source : la règle desktop `.project-grid:not(.project-directory)` avait une spécificité supérieure à la règle mobile générique `.project-grid`. La grille conservait donc sa colonne minimale `19rem` à 320 px.

Correction ciblée : la règle mobile utilise désormais la même cible `.project-grid:not(.project-directory)` et force `grid-template-columns:1fr`.

### Micro-preuve après correction

Run : `35463591149`  
Résultat : **PASS CIBLÉ**.

- 17 pages ;
- 4 largeurs : 320 / 400 / 768 / 1440 ;
- **68 navigations** ;
- 0 overflow horizontal > 1 px ;
- H1/main/footer présents ;
- aucune exception JavaScript détectée par le contrôle ;
- menus mobiles testés aux largeurs étroites lorsqu'ils sont présents ;
- `prefers-reduced-motion: reduce` : actif ;
- animation du panorama principal : `animationName = none`.

Le workflow source Site First du même correctif, run `35463591245`, est également **success**.

## Intégration

PR #30 fusionnée par le commit `1fd480d721ab3f5780be881da33b24c3da0a10f5`.
