# CHECKPOINT CANONIQUE — MODARYX V2 — 3 octobre 2026

**Statut : SOURCE DE REPRISE V2 PRIORITAIRE — CONCEPTION LOW‑FI / HIGH‑FI BLOQUÉ**

Ce checkpoint décrit l'état opérationnel courant du chantier **MODARYX V2**. Il ne fusionne pas ce chantier dans `main`, ne remplace pas le site public et ne constitue pas une VF.

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**
  - Nova Forge OS Public
  - Nova Forge OS Fondateur
- **MODARYX / MODARYX MODS = plateforme web**
- `getnovaforge.com` / « getnova » = ancien projet web abandonné
- aucune migration MODARYX → Nova Forge

## 2. Source de reprise

Sources historiques lues :

- `CHECKPOINT-CANONIQUE-NOVA-FORGE-MODARYX-2026-09-15.md`
- `CHECKPOINT-CANONIQUE-MODARYX-2026-09-21.md`

Ce checkpoint V2 est prioritaire pour la reconstruction produit/design V2 lorsqu'il est présent sur la branche V2, sauf preuve technique fraîche contraire.

## 3. Git frais

Dépôt :

`Jajaz537/Nova-Forge-Site-Public`

Base `main` observée avant ce checkpoint :

`d8d5ea5509f07c5bf5a4424293cfa404643c239f`

Branche V2 :

`audit/modaryx-v2-legacy-boundary-20261003`

HEAD observé avant ce checkpoint :

`668c76eb7962cc395dfdeec041456ff23b7e938e`

PR :

- **#162**
- ouverte
- draft
- mergeable
- non fusionnée
- base : `main`
- aucun cutover

## 4. Décision de méthode

L'ancien front n'est plus la référence visuelle finale.

V2 est construit comme **nouvelle surface produit isolée**.

Règle :

> aucun composant visuel, stylesheet global, shell DOM, script UI ou asset legacy n'entre automatiquement dans V2.

Les fonctions, contrats et protections utiles sont préservés après audit sélectif.

## 5. Recherche / benchmark

**TERMINÉ — base de benchmark initiale et approfondie**

Plateformes étudiées :

- Nexus Mods
- CurseForge
- Modrinth
- Thunderstore
- Steam Workshop
- GameBanana
- Mod DB

Leçons retenues :

- entrée par jeu ;
- recherche/facettes centrales ;
- compatibilité visible ;
- dépendances de premier rang ;
- Release séparée du projet ;
- collections/modpacks/profils distincts ;
- créateurs/équipes comme personas de premier rang ;
- installation automatisée uniquement si runtime réel ;
- confiance/provenance lisibles.

## 6. Architecture produit

**TERMINÉ — draft V2 structuré**

Navigation cible :

- Découvrir
- Jeux
- Mods & Plugins
- Collections
- Créateurs
- Communauté
- Créer

Utilitaires :

- Recherche
- Bibliothèque
- Notifications
- Compte

Objets métier principaux :

- Game
- ContentItem
- ContentType
- Release
- File
- Dependency
- Conflict
- CompatibilityClaim
- Creator
- Team/Studio
- Collection
- Modpack
- Profile/Loadout
- ProvenanceReceipt
- ModerationDecision

## 7. Taxonomie

**TERMINÉ — draft de taxonomie**

Familles prévues :

- mods
- plugins
- addons
- scripts
- maps
- patches
- translations
- packs
- shaders
- presets
- tools
- libraries/frameworks
- loaders
- collections
- modpacks
- profiles/loadouts

Le `kind` historique du Universal Mod Manifest est considéré trop large pour la navigation V2.

Aucune migration de schéma effectuée.

## 8. Audit legacy

**TERMINÉ — frontière initiale**

Risques identifiés :

- service worker/cache ancien ;
- `shell.js` ;
- `app.js` couplé au DOM legacy ;
- CSS globaux ;
- générateurs V1 ;
- redirects incompatibles avec l'IA V2 ;
- manifest royaume-first.

Capacités à préserver après audit :

- recherche ;
- catalogue ;
- profils ;
- communauté ;
- Creator Studio ;
- provenance/signatures ;
- distribution fail-closed ;
- Storage/Repair ;
- Guide/OS bridge ;
- monde vivant.

## 9. Classification assets

**TERMINÉ — classification initiale**

- scripts fonctionnels : réutilisables après audit
- runtime monde vivant : réutilisable après audit
- CSS monde vivant : legacy visuel
- anciens stylesheets : legacy visuel à isoler
- `shell.js` : legacy à isoler
- assets MODARYX : à revalider
- assets Nova : historique/provenance
- assets royaume/compagnons : candidats uniquement, pas référence finale automatique

## 10. Figma

Fichier :

**MODARYX V2 — Architecture & Wireframes**

File key :

`TYoIH62lChEK6iMHhhpxZv`

URL :

https://www.figma.com/design/TYoIH62lChEK6iMHhhpxZv

### Fondations

**TERMINÉ — low-fi**

- variables neutres
- styles typographiques
- Search Field
- Content Card
- Button
- Filter Chip

### Core wireframes présents

Desktop :

- Home
- Games
- Catalog
- Content Detail
- Collection
- Creator
- Creator Studio
- Library

Mobile :

- Home
- Catalog
- Content Detail

### Parcours critiques

**TERMINÉ — low-fi**

- Découverte → installation
- Créateur → publication
- Collection → profil stable

### IA / Tree Test

**TERMINÉ — préparation low-fi**

12 tâches critiques cartographiées.

### Matrice d'états

**TERMINÉ — conception**

Recherche, fiche, installation, collection/profil, Creator Studio et Community ont leurs principaux états définis.

## 11. Erreurs Figma et procédure

### Erreur 1

`marginLeft` invalide sur Frame.

Procédure :

erreur exacte → état vérifié → correction ciblée → micro-vérification.

### Erreur 2

Plan Starter limité à 3 pages.

Erreur exacte :

`The Starter plan only comes with 3 pages`

Correction :

IA/Tree Test ajouté à une page existante sans supprimer les pages existantes.

### Erreur 3

Quota MCP Figma Starter atteint.

Erreur exacte :

`You've reached the Figma MCP tool call limit on the Starter plan.`

**État : BLOQUÉ EXTERNE pour nouvelles écritures Figma**

Aucune relance immédiate.

## 12. Wireframes encore manquants

**BLOQUÉ Figma / EN COURS conception**

- Desktop Game Hub
- Desktop Global Search
- Desktop Community
- Mobile Game Hub

Blueprints textuels déjà préparés dans :

`docs/MODARYX-V2-MISSING-WIREFRAME-BLUEPRINTS-20261003.md`

## 13. High‑Fi

**BLOQUÉ**

Interdiction d'ouvrir la direction artistique finale tant que :

- couverture wireframe core incomplète ;
- tree testing humain non exécuté ;
- quota Figma bloque les écrans manquants.

Gate documenté dans :

`docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`

## 14. Validation humaine

**PREUVE MANQUANTE**

Script de test prêt :

`docs/MODARYX-V2-HUMAN-LOWFI-TEST-20261003.md`

À tester :

- trouvabilité ;
- terminologie ;
- compatibilité ;
- dépendances ;
- collection vs profil ;
- publication créateur.

Aucune validation humaine n'est inventée.

## 15. Production / infrastructure

Inchangés :

- `main`
- production
- DNS
- DNSSEC
- nameservers
- IONOS
- configuration Cloudflare critique
- service worker public
- redirects publics

Aucun front V2 production n'a été écrit.

## 16. États courants

- Audit legacy : **TERMINÉ**
- Benchmark : **TERMINÉ**
- Architecture produit : **TERMINÉ — draft**
- Taxonomie : **TERMINÉ — draft**
- Parcours critiques : **TERMINÉ — low-fi**
- Matrice d'états : **TERMINÉ — conception**
- Wireframes core : **EN COURS**
- Écriture Figma supplémentaire : **BLOQUÉ EXTERNE**
- Tree testing humain : **PREUVE MANQUANTE**
- Direction artistique : **BLOQUÉ**
- High-fi : **BLOQUÉ**
- Nouveau frontend production : **NON COMMENCÉ volontairement**

## 17. Prochain point logique automatique

1. Continuer tout travail de recherche/specification ne nécessitant pas Figma.
2. Ne pas relancer Figma tant que le quota Starter reste bloqué.
3. Dès disponibilité Figma :
   - ajouter Game Hub ;
   - ajouter Global Search ;
   - ajouter Community ;
   - ajouter Mobile Game Hub ;
   - micro-vérifier clipping/overflow.
4. Exécuter/obtenir tree testing humain.
5. Corriger les ambiguïtés.
6. Seulement après : direction artistique, design system final, prototype high-fi.
7. Ne pas toucher au front public ni à `main` sans stratégie contrôlée.

## 18. Règle de reprise

Pour toute nouvelle conversation :

> Lire ce checkpoint en priorité, vérifier Git frais, puis continuer au prochain point logique sans reconstruire l'état depuis les anciens chats.
