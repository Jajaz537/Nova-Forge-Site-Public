# MODARYX V2 — Gate d'entrée High‑Fi

**Date : 2026-10-03**
**Statut : BLOQUÉ tant que les critères ci-dessous ne sont pas satisfaits**

## 1. Pourquoi ce gate existe

L'ancien processus a trop souvent transformé :

- une preuve technique ;
- un label Premium HD ;
- une capture correcte ;
- un lot CSS ;
- une PR de finition

en quasi-validation artistique.

V2 interdit ce raccourci.

## 2. IA / navigation

Avant high‑fi :

- navigation primaire stabilisée ;
- Game Hub matérialisé ;
- Global Search matérialisé ;
- Community matérialisée ;
- Mobile Game Hub matérialisé ;
- tâches de tree testing définies ;
- aucun libellé critique dépend d'un vocabulaire de lore.

## 3. Parcours

Les trois flows doivent être complets :

### Découverte → installation

- entrée jeu ;
- recherche ;
- catalogue ;
- fiche ;
- compatibilité ;
- dépendances ;
- action.

### Créateur → publication

- projet ;
- métadonnées ;
- compatibilité ;
- fichiers ;
- droits ;
- validation ;
- publication.

### Collection → profil

- sélection ;
- dépendances ;
- conflits ;
- versioning ;
- loadout ;
- installation.

## 4. États

Pour chaque flow :

- nominal ;
- loading ;
- empty/no-results ;
- error/retry ;
- offline/stale si pertinent ;
- unavailable ;
- auth/permission ;
- incompatible/unverified ;
- success.

## 5. Taxonomie

Avant art direction :

- différence mod/plugin/addon/tool/etc. clarifiée ;
- agrégats collection/modpack/profile séparés ;
- Release séparée de ContentItem ;
- dépendances et conflits structurés ;
- compatibilité multi-dimension définie.

## 6. Contenus réels

Aucun high‑fi ne doit dépendre de faux chiffres, faux mods ou fausses compatibilités.

Les placeholders low‑fi restent acceptables.

Les maquettes high‑fi devront utiliser :

- contenu autorisé ;
- démos explicitement marquées ;
- ou placeholders honnêtes.

## 7. Mobile

Le mobile doit être conçu comme composition dédiée :

- recherche immédiate ;
- navigation claire ;
- filtres drawer ;
- version/compatibilité accessibles ;
- actions critiques atteignables ;
- pas de simple compression du desktop.

## 8. Accessibilité de conception

Avant high‑fi final :

- focus prévu ;
- clavier prévu ;
- labels explicites ;
- reduced motion prévu ;
- ordre de lecture logique ;
- contrastes testables ;
- erreurs non uniquement colorées.

## 9. Performance perçue

Le design ne doit pas dépendre de :

- vidéos lourdes automatiques ;
- dizaines d'effets superposés ;
- blur massif ;
- assets hero disproportionnés ;
- animations permanentes.

L'univers vivant doit être fail-soft.

## 10. Identité MODARYX

L'identité finale doit respecter :

> L'univers est le théâtre ; le modding est l'action.

Le royaume, les compagnons, l'heure, la météo, les saisons, les factions et l'ambiance peuvent enrichir :

- hero ;
- background ;
- micro-interactions ;
- progression ;
- surfaces secondaires.

Ils ne doivent jamais masquer :

- jeu ;
- recherche ;
- contenu ;
- compatibilité ;
- dépendances ;
- installation ;
- créateur.

## 11. Validation comparative

Avant développement du skin final, le prototype high‑fi devra être comparé écran par écran sur :

- clarté ;
- densité ;
- vitesse de compréhension ;
- placement ;
- hiérarchie ;
- recherche ;
- filtres ;
- fiche ;
- dépendances ;
- mobile ;
- qualité de marque.

Références de comparaison fonctionnelle :

- Nexus Mods
- CurseForge
- Modrinth
- Thunderstore
- Steam Workshop
- GameBanana

La comparaison n'implique aucune copie de leur identité.

## 12. Preuves requises pour lever le gate

### TERMINÉ requis

- architecture produit ;
- taxonomie ;
- flows ;
- matrice d'états ;
- couverture wireframes core ;
- validation heuristique sans blocker majeur.

### Validation humaine encore incomplète

- P01 réel : mini-test critique TERMINÉ ;
- étude Work 5 profils × 16 tâches : TERMINÉE, simulation IA ;
- étude indépendante interne 5 profils × 16 tâches : TERMINÉE, simulation IA ;
- validation humaine supplémentaire requise avant gel de la microcopy critique ;
- compréhension de la homepage : PREUVE MANQUANTE ;
- compréhension complète de la fiche : PREUVE PARTIELLE ;
- validation mobile réelle : PREUVE MANQUANTE ;
- validation de la direction artistique après génération des concepts : PREUVE MANQUANTE.

## 13. État courant

**BLOQUÉ pour gel high-fi final — exploration réversible autorisée.**

État réel :

1. couverture conceptuelle core : TERMINÉE ; quatre écrans supplémentaires existent en prototype low-fi HTML isolé mais restent non matérialisés dans Figma ;
2. quota Figma MCP Starter : BLOQUÉ EXTERNE ;
3. P01 humain : TERMINÉ pour 5 questions critiques ; validation humaine globale : EN COURS ;
4. convergence P01 + Work + étude indépendante : TERMINÉE ;
5. microcopy critique encore À REVALIDER : **Configurations de jeu**, capacité des **Collections**, compréhension de **Bibliothèque**, portée de **Mods & Plugins** et états **Non vérifié**.

Ce blocage n'empêche pas la direction artistique exploratoire, le design system préparatoire ni les prototypes comparatifs réversibles. Il interdit uniquement de présenter la microcopy ou le high-fi comme humainement validés/finalisés.
