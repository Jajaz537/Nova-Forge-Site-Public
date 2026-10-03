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

## 02 Critical Flows

Trois parcours critiques sont matérialisés :

### Flow A — Découverte → installation

Accueil → Hub jeu → Catalogue → Fiche → Requirements → Action.

### Flow B — Créateur → publication

Studio → Métadonnées → Compatibilité → Fichiers → Droits → Validation → Publication.

### Flow C — Collection → profil stable

Collection → Contenus → Résolution des dépendances → Conflits → Versioning → Profil → Installation.

## IA & Tree Test

L'architecture de navigation et les tâches de tree testing ont été ajoutées **dans la page 02 Critical Flows** sous les parcours.

Raison : le plan Figma Starter a refusé la création d'une quatrième page avec l'erreur explicite :

> The Starter plan only comes with 3 pages.

Procédure suivie :

1. erreur exacte identifiée ;
2. aucune relance massive ;
3. pages existantes vérifiées ;
4. contenu IA isolé ;
5. ajout ciblé sur la page existante `02 Critical Flows`.

Aucune suppression de contenu n'a été nécessaire.

### Tâches de tree testing matérialisées

- trouver un plugin pour un jeu donné ;
- vérifier la compatibilité avec une version ;
- trouver les dépendances obligatoires ;
- voir les conflits connus ;
- retrouver l'historique des versions ;
- ajouter à une collection ;
- créer un profil/loadout ;
- publier une nouvelle release ;
- retrouver un créateur ;
- signaler un contenu ;
- trouver les instructions d'installation ;
- retrouver ses favoris.

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
- aucune navigation Royaume-first ;
- tree testing basé sur des tâches réelles, pas sur le décor.

## Micro-corrections effectuées

### 1. Propriété de layout invalide

Un premier script Figma a échoué sur `marginLeft` appliqué à un Frame.

Correction ciblée :

- erreur isolée ;
- état du fichier vérifié ;
- construction relancée sans propriété invalide.

### 2. Débordements low-fi

Corrections :

- topbars desktop ramenées à la largeur intérieure ;
- homepage redimensionnée pour ne pas couper son dernier bloc ;
- titre long de la fiche mobile rendu multilignes.

### 3. Limite de pages Figma Starter

Erreur :

`The Starter plan only comes with 3 pages`.

Correction :

- aucun upgrade requis ;
- aucune page existante sacrifiée ;
- IA/Tree Test intégré à `02 Critical Flows`.

## Validation visuelle low-fi

Une capture Figma de la homepage et une capture de la section IA/Tree Test ont été produites pour contrôle de composition.

Cela valide uniquement :

- absence de clipping évident sur les surfaces vérifiées ;
- structure low-fi lisible ;
- hiérarchie fonctionnelle exploitable pour la phase suivante.

Cela **ne valide pas** :

- direction artistique ;
- qualité Premium HD ;
- prototype interactif complet ;
- tests humains ;
- accessibilité finale ;
- production.

## Limites actuelles

- wireframes low-fi, pas une proposition artistique finale ;
- interactions/prototype détaillé encore à construire ;
- tree testing humain non exécuté ;
- direction artistique non commencée ;
- aucun ancien front remplacé ;
- aucun code production V2 écrit ;
- Figma Starter limité à trois pages.

## Prochaine étape

1. détailler états et interactions critiques ;
2. fermer les ambiguïtés de navigation/taxonomie ;
3. préparer les critères de test humain ;
4. affiner les wireframes si une tâche critique reste difficile ;
5. seulement ensuite ouvrir la phase direction artistique et design system final.
