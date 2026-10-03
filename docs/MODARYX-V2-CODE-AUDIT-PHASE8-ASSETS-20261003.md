# MODARYX V2 — Audit exhaustif anti-contamination — Phase 8 Assets médias

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre

Assets non-code sous `assets/` :

- marque MODARYX ;
- marque Nova historique ;
- panoramas / heroes ;
- 10 couches compagnons loup/dragon ;
- environnement living-world ;
- autres visuels de royaume/portails.

## 2. Marque MODARYX

Présents :

- `assets/modaryx-mark.svg`
- `assets/modaryx-mark-192.png`
- `assets/modaryx-mark-512.png`

### Classification

**À REVALIDER POUR IDENTITÉ V2**

Ils sont bien MODARYX mais leur présence historique ne suffit pas à en faire automatiquement le logo final V2.

Le manifest PWA actuel les utilise.

## 3. Assets Nova historiques

Présents :

- `assets/nova-mark.svg`
- `assets/nova-mark-192.png`
- `assets/nova-mark-512.png`
- `assets/nova-kingdom-panorama.svg`

### Risque

Fusion visuelle accidentelle entre Nova Forge OS et MODARYX.

### Classification

**HISTORIQUE / PROVENANCE — À BLOQUER DANS UI V2**

Ils peuvent rester dans le dépôt pour compatibilité/historique, mais ne doivent jamais être chargés par le frontend MODARYX V2.

## 4. Heroes / monde legacy

Présents :

- `assets/modaryx-wolf-dragon-hero.webp`
- `assets/modaryx-world-portals.webp`
- `assets/modaryx-realm-vista-reduced.webp`
- `assets/forge-field.svg`

### Classification

**CANDIDATS / LEGACY VISUEL**

Aucun n'est automatiquement canon V2.

Ils peuvent servir à :
- historique ;
- référence artistique ;
- comparaison ;
- fallback temporaire hors production V2.

## 5. Couches living-world physiques

Fichiers présents :

### Loup
- wolf-baby.png
- wolf-juvenile.png
- wolf-adolescent.png
- wolf-young-adult.png
- wolf-adult.png

### Dragon
- dragon-baby.png
- dragon-juvenile.png
- dragon-adolescent.png
- dragon-young-adult.png
- dragon-adult.png

### Environnement
- environment-premium.jpg

Tous sont référencés dans `SHA256SUMS.txt`.

## 6. Finding important — fichiers présents mais non activés

`data/living-world.json` indique toujours :

- `visualGrowth.status = awaiting-assets`
- `environmentAsset = null`
- toutes les valeurs de stages = `null`.

Le gate historique `qa/check-layered-growth-assets.mjs` traite donc les images physiques comme **candidates non référencées**.

### Conséquence

La présence du fichier ne vaut pas :
- activation ;
- approbation artistique ;
- canon final ;
- preuve qu'il faut l'utiliser.

### Classification

**ASSETS CANDIDATS — PREUVE D'APPROBATION FINALE MANQUANTE**

## 7. Validation technique candidate

Le gate historique contrôle notamment :

- canvas attendu ;
- format ;
- dimensions ;
- alpha des couches compagnons ;
- prefix same-origin ;
- ordre baby → juvenile → adolescent → young-adult → adult.

Ce mécanisme est utile comme garde technique.

### Classification

**RÉUTILISABLE COMME IDÉE DE VALIDATION**

Le renderer visuel V1 reste bloqué.

## 8. Risque d'activation accidentelle

Le module `living-world-visual-growth.mjs` pourrait activer ces images uniquement si le JSON passe à `status=ready` et contient des paths.

Comme ce module est classé **À BLOQUER** pour V2, aucune activation V2 ne doit dépendre de ce mécanisme.

## 9. Allowlist V2 future

Avant high-fi, chaque asset visuel devra avoir un statut explicite :

- APPROUVÉ V2
- CANDIDAT
- LEGACY
- HISTORIQUE
- REJETÉ
- PREUVE MANQUANTE

Aucun asset `CANDIDAT` ne doit être importé automatiquement par glob/build.

## 10. Anti-contamination asset guard

Le futur guard V2 doit bloquer au minimum :

- `nova-mark*`
- `nova-kingdom-panorama.svg`
- imports globaux de `assets/living-world/*`
- hero/realm images non allowlistées.

## 11. Performance

Les couches compagnons sont relativement lourdes et multiples.

Même si approuvées plus tard :
- charger uniquement l'état courant ;
- media responsive ;
- compression/format moderne à évaluer ;
- pas de téléchargement de toutes les étapes au premier écran ;
- reduced effects / mobile simplification.

## 12. Conclusion

Le dépôt contient davantage d'assets living-world qu'indiqué par le statut actif du JSON.

C'est précisément une raison supplémentaire pour garder une **allowlist stricte** :
des fichiers historiques/candidats peuvent exister sans devoir apparaître dans la V2.

**État Phase 8 : TERMINÉ pour assets médias. Audit global : EN COURS.**
