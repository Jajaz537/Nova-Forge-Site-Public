# MODARYX V2 — Workspace de conception

**Date : 2026-10-03**  
**Statut : EN COURS — low-fidelity uniquement**  
**Aucune implémentation production / aucun cutover**

## Figma

Fichier : **MODARYX V2 — Architecture & Wireframes**  
URL : https://www.figma.com/design/TYoIH62lChEK6iMHhhpxZv  
File key : `TYoIH62lChEK6iMHhhpxZv`

## 00 Foundations

Fondations low-fi volontairement neutres :

- variables de couleur wireframe ;
- espacements ;
- rayons ;
- styles typographiques ;
- composants locaux Search Field, Content Card, Button, Filter Chip.

Ces primitives ne constituent pas la direction artistique finale et ne réutilisent pas l'ancien front MODARYX.

## 01 Core Wireframes

### Desktop

- 01 Home
- 02 Games
- 03 Catalog
- 04 Content Detail
- 05 Collection
- 06 Creator
- 07 Creator Studio
- 08 Library

### Mobile

- 09 Mobile Home
- 10 Mobile Catalog
- 11 Mobile Detail

## Principes déjà matérialisés

- navigation fonctionnelle explicite ;
- recherche globale prioritaire ;
- entrée par jeu ;
- catalogue + filtres ;
- compatibilité/dépendances comme information de décision ;
- collections distinctes ;
- créateurs comme persona de premier rang ;
- Creator Studio séparé ;
- bibliothèque utilisateur séparée ;
- mobile recomposé, pas simple réduction du desktop ;
- aucune navigation Royaume-first.

## Micro-correction effectuée

Un premier script Figma a échoué sur une propriété de layout invalide (`marginLeft` sur Frame).

Procédure appliquée :

1. erreur exacte isolée ;
2. état du fichier vérifié ;
3. construction relancée sans cette propriété ;
4. micro-vérification structurelle ;
5. correction ciblée des débordements :
   - topbars desktop ramenées à la largeur intérieure ;
   - homepage redimensionnée pour ne pas couper son dernier bloc ;
   - titre long de la fiche mobile rendu multilignes.

## Limites actuelles

- wireframes low-fi, pas une proposition artistique finale ;
- interactions/prototype détaillé encore à construire ;
- tree testing humain non exécuté ;
- direction artistique non commencée ;
- aucun ancien front remplacé ;
- aucun code production V2 écrit.

## Prochaine étape

1. formaliser les parcours critiques ;
2. compléter les états et interactions ;
3. vérifier la trouvabilité/navigation ;
4. seulement ensuite ouvrir la phase direction artistique et design system final.

