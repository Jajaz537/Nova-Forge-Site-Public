# MODARYX V2 — Classification initiale des assets et scripts legacy

**Date : 2026-10-03**
**Statut : audit source — aucune suppression / aucun renommage**

## 1. Règle

Aucun asset, stylesheet ou script historique n'est supprimé ou repris automatiquement.

Chaque élément entre dans une catégorie :

- **RÉUTILISABLE APRÈS AUDIT**
- **RÉUTILISABLE COMME DONNÉE / LOGIQUE**
- **LEGACY VISUEL À ISOLER**
- **HISTORIQUE / PROVENANCE**
- **À REVALIDER**

## 2. Scripts fonctionnels

### `assets/app.js`

**RÉUTILISABLE COMME LOGIQUE, PAS COMME UI**

Contient des comportements catalogue/recherche/états utiles mais génère du DOM legacy.

### `assets/catalog.js`

**RÉUTILISABLE APRÈS AUDIT**

À extraire :
- logique de catalogue ;
- filtres ;
- favoris ;
- états.

À ne pas reprendre :
- structure DOM et classes historiques.

### `assets/search.js`

**RÉUTILISABLE APRÈS AUDIT**

Bonne candidate pour migration vers un module V2 de recherche locale.

### `assets/community.js`

**RÉUTILISABLE APRÈS AUDIT**

Préserver :
- contrats de publication ;
- états ;
- modération/recours si couplés proprement.

Réécrire :
- rendu visuel.

### `assets/creator-studio.js`

**RÉUTILISABLE APRÈS AUDIT**

Préserver la logique de brouillon/validation/export utile.

### `assets/profiles.js`

**RÉUTILISABLE APRÈS AUDIT**

Préserver logique compte/profil et états.

### `assets/downloads.js`

**RÉUTILISABLE APRÈS AUDIT**

Conserver le fail-closed de distribution.

### `assets/verify.js`

**RÉUTILISABLE APRÈS AUDIT**

Conserver vérification locale et limites explicites.

### `assets/json-schema-lite.js`

**RÉUTILISABLE COMME LOGIQUE**

Ne dépend pas d'une identité visuelle.

## 3. Runtime monde vivant

### `assets/living-world.js`
### `assets/living-world-visual-growth.mjs`
### `assets/real-world-sync.mjs`

**RÉUTILISABLES APRÈS AUDIT**

Ils portent une capacité retenue :
- heure ;
- saison ;
- contexte local grossier ;
- croissance/ambiance ;
- reduced motion/fail-soft à conserver.

Ils ne doivent pas être branchés au nouveau front avant définition de l'interface V2 correspondante.

### CSS associés

- `living-world.css`
- `living-world-visual-growth.css`
- `real-world-sync.css`

**LEGACY VISUEL À ISOLER**

Le comportement peut être préservé, les styles doivent être repensés.

## 4. Stylesheets historiques

### `assets/site.css`
### `assets/tokens.css`
### `assets/catalog.css`
### `assets/search.css`
### `assets/profiles.css`
### `assets/project-hub.css`
### `assets/creator-studio.css`
### `assets/nova-premium-hd.css`
### `assets/nova-premium-hd-secondary.css`
### `assets/modaryx-foundations.css`
### `assets/modaryx-home-cinematic.css`
### `assets/modaryx-home-finishline.css`
### `assets/modaryx-cinematic-system.css`
### `assets/modaryx-community-finishline.css`

**LEGACY VISUEL À ISOLER**

Motif :
- sélecteurs globaux ;
- accumulation de passes artistiques successives ;
- conventions de classes anciennes ;
- risque de contamination V2.

Aucun de ces fichiers ne doit être importé directement dans le shell V2.

## 5. Scripts de shell

### `assets/shell.js`

**LEGACY À ISOLER**

Raisons :
- enregistrement SW ;
- injection navigation/mobile ;
- préférences localStorage historiques ;
- DOM shell ancien ;
- branchement monde vivant.

Toute capacité utile doit être extraite sous module V2 séparé.

### `assets/nova-premium-hd.js`

**HISTORIQUE / À REVALIDER**

Ne doit pas être chargé automatiquement dans V2.

## 6. Identité MODARYX

### `assets/modaryx-mark.svg`
### `assets/modaryx-mark-192.png`
### `assets/modaryx-mark-512.png`

**À REVALIDER**

Ce sont des assets MODARYX et non Nova Forge, mais ils ne sont pas automatiquement approuvés comme identité V2 finale.

Ils peuvent servir :
- provenance ;
- comparaison ;
- éventuelle base de marque.

Aucun changement de logo final n'est décidé ici.

## 7. Assets historiques Nova

### `assets/nova-mark.svg`
### `assets/nova-mark-192.png`
### `assets/nova-mark-512.png`
### `assets/nova-kingdom-panorama.svg`

**HISTORIQUE / PROVENANCE**

Ne pas les afficher comme marque actuelle MODARYX.

Ne pas les supprimer aveuglément :
- compatibilité ;
- provenance ;
- historique ;
- workflows legacy possibles.

## 8. Assets univers / royaume

Les assets MODARYX de type monde/portails/compagnons/héros sont **À REVALIDER**.

Le checkpoint historique protège notamment le hero humainement approuvé tant que les couches séparées ne sont pas validées.

Pour V2 :

- aucune ancienne composition n'est la référence visuelle finale ;
- les assets individuels peuvent rester candidats ;
- chaque réutilisation doit être validée dans la nouvelle direction artistique ;
- l'univers ne doit pas remplacer la fonction mods.

## 9. Priorité de migration fonctionnelle

Ordre recommandé quand le front V2 commencera :

1. recherche locale ;
2. catalogue ;
3. ContentItem / Release / compatibilité ;
4. collections / profils ;
5. compte/profil ;
6. Creator Studio ;
7. communauté/modération ;
8. distribution/verifier ;
9. monde vivant.

## 10. Interdictions V2

- aucun import CSS legacy global ;
- aucun import de `shell.js` ;
- aucun chargement automatique de `nova-premium-hd.js` ;
- aucune réactivation des anciens redirects comme contrat produit ;
- aucune réutilisation d'un asset royaume comme hero sans validation artistique ;
- aucune suppression des assets Nova historiques sans analyse de provenance.

**État : TERMINÉ — classification initiale + audit fichier/groupe fermé.**

Preuves complémentaires :
- `docs/MODARYX-V2-CODE-AUDIT-PHASE8-ASSETS-20261003.md` ;
- `docs/MODARYX-V2-CODE-AUDIT-COVERAGE-525-20261003.md` ;
- `docs/MODARYX-V2-CODE-ANTI-CONTAMINATION-MASTER-20261003.md`.

La réutilisation artistique finale reste **PREUVE MANQUANTE** tant que la direction artistique high-fi n'est pas validée.
