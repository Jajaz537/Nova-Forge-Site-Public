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

Base `main` observée avant cette mise à jour :

`d8d5ea5509f07c5bf5a4424293cfa404643c239f`

Branche V2 :

`audit/modaryx-v2-legacy-boundary-20261003`

HEAD observé avant cette mise à jour :

`2a2fd30f0c5e4a22d9c9a95e08382edbf749904b`

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

## 7. Taxonomie et schémas

**TERMINÉ — conception**

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

### Analyse des écarts

Document :

`docs/MODARYX-V2-SCHEMA-GAP-ANALYSIS-20261003.md`

Constats :

- Universal Mod Manifest v1 mélange encore projet et release ;
- target doit pouvoir évoluer vers plateforme/DLC/environnement ;
- relations required/optional/recommended/incompatible/replaces à structurer ;
- compatibilité doit devenir multi-claim ;
- Collection doit rester distincte de Modpack/Profile ;
- Search Adapter local-first reste une bonne base ;
- le catalogue actuel est explicitement démonstration ;
- search-index legacy doit être reconstruit ;
- Integration Readiness reste une source de garde-fous à préserver.

### Plan v2

Document :

`docs/MODARYX-V2-SCHEMA-PLAN-20261003.md`

Schémas prévus conceptuellement :

- game
- content-type
- content-item
- release
- dependency
- compatibility-claim
- file-artifact
- collection-v2
- modpack
- profile-loadout
- creator
- team
- search-document

Stratégie :

1. préserver les schémas v1 ;
2. définir des schémas v2 séparés ;
3. mapper explicitement ;
4. migrer uniquement après validation ;
5. aucun nouvel ID web V2 sous namespace Nova Forge.

Aucun schéma v1 n'a été modifié.

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

### Audit approfondi modules

**TERMINÉ pour les modules inspectés**

Documents :

- `docs/MODARYX-V2-LEGACY-LOGIC-DEEP-AUDIT-20261003.md`
- `docs/MODARYX-V2-COMMUNITY-PROFILES-DEEP-AUDIT-20261003.md`

Décisions principales :

- préserver la logique catalogue/recherche, pas leur DOM ;
- préserver fail-closed downloads ;
- préserver vérification SHA-256 locale sans surpromesse de sécurité ;
- préserver Creator Studio local/locked et validation schema ;
- séparer Collection / Modpack / Profile ;
- séparer Account / Public Profile / Creator / Team / Authority ;
- rôles uniquement confirmés serveur ;
- Turnstile/WebAuthn restent des capacités réelles, jamais simulées ;
- monde vivant séparé en Reality Context Engine + Experience Adapter.

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

## 10. Contrats UX / système

**TERMINÉ — conception**

Documents :

- `docs/MODARYX-V2-INTERACTION-STATES-20261003.md`
- `docs/MODARYX-V2-A11Y-PERF-DESIGN-SYSTEM-CONTRACT-20261003.md`
- `docs/MODARYX-V2-SCREEN-ACCEPTANCE-CRITERIA-20261003.md`

Principes :

- états nominal/loading/empty/error/offline/unavailable/auth/incompatible/success ;
- focus visible/non masqué ;
- cibles tactiles minimales et espacements ;
- reduced motion ;
- design tokens primitifs + sémantiques ;
- composants de produit ;
- Core Web Vitals comme objectifs production ;
- critères d'acceptation écran par écran.

Références de performance :

- LCP ≤ 2,5 s au p75 ;
- INP ≤ 200 ms au p75 ;
- CLS ≤ 0,1 au p75.

Ces seuils ne valent pas PASS tant que V2 n'existe pas en production mesurable.

## 11. Architecture technique d'isolation

**TERMINÉ — conception**

Document :

`docs/MODARYX-V2-FRONTEND-ISOLATION-ARCHITECTURE-20261003.md`

Contrats :

- nouveau shell ;
- nouveau namespace UI ;
- aucun CSS legacy ;
- aucun renderer DOM legacy ;
- routing V2 explicite ;
- nouveau cache/service worker ;
- namespace localStorage V2 ;
- build V2 séparé ;
- tests anti-contamination CI ;
- preview séparé ;
- cutover et rollback contrôlés.

Aucun de ces éléments n'est encore implémenté.

## 12. Données, fixtures et migration navigateur

**TERMINÉ — conception**

Documents :

- `docs/MODARYX-V2-DATA-FIXTURE-STRATEGY-20261003.md`
- `docs/MODARYX-V2-STORAGE-CACHE-SW-MIGRATION-20261003.md`

Règles :

- distinguer production réelle / démonstration / fixture technique / placeholder UI ;
- aucun faux compteur, auteur, badge verified ou compatibilité mesurée ;
- fixtures isolées du build public ;
- namespace localStorage V2 sous `modaryx:v2:` ;
- migration non destructive ;
- aucun remapping silencieux d'ID ou de type ;
- SW V2 séparé ;
- purge cache uniquement par liste explicite ;
- test obligatoire navigateur neuf + navigateur legacy + offline + upgrade interrompu ;
- aucun changement Cloudflare critique nécessaire pour cette phase.

## 13. QA V2

**TERMINÉ — stratégie, NON EXÉCUTÉ**

Document :

`docs/MODARYX-V2-QA-STRATEGY-20261003.md`

Couverture prévue :

- fonctionnelle ;
- responsive ;
- visuelle ;
- accessibilité automatisée + manuelle ;
- performance lab + field ;
- sécurité/confiance ;
- données ;
- recherche ;
- collections/modpacks/profiles ;
- PWA/SW ;
- anti-contamination legacy ;
- navigateurs ;
- monde vivant ;
- contenu.

Règle après erreur conservée : erreur exacte → isolation → correction ciblée → micro-proof → continuation.

## 14. Figma

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

## 15. Erreurs Figma et procédure

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

## 16. Wireframes encore manquants

**BLOQUÉ Figma / EN COURS conception**

- Desktop Game Hub
- Desktop Global Search
- Desktop Community
- Mobile Game Hub

Blueprints textuels :

`docs/MODARYX-V2-MISSING-WIREFRAME-BLUEPRINTS-20261003.md`

Revue de couverture :

`docs/MODARYX-V2-WIREFRAME-COVERAGE-20261003.md`

## 17. High‑Fi

**BLOQUÉ**

Interdiction d'ouvrir la direction artistique finale tant que :

- couverture wireframe core incomplète ;
- tree testing humain non exécuté ;
- quota Figma bloque les écrans manquants.

Gate :

`docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`

## 18. Validation humaine

**PREUVE MANQUANTE**

Script de test :

`docs/MODARYX-V2-HUMAN-LOWFI-TEST-20261003.md`

À tester :

- trouvabilité ;
- terminologie ;
- compatibilité ;
- dépendances ;
- collection vs profil ;
- publication créateur.

Aucune validation humaine n'est inventée.

## 19. Production / infrastructure

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

## 20. États courants

- Audit legacy : **TERMINÉ**
- Audit modules legacy ciblés : **TERMINÉ pour périmètre inspecté**
- Analyse des écarts de schémas : **TERMINÉ — conception**
- Plan schémas V2 : **TERMINÉ — conception**
- Benchmark : **TERMINÉ**
- Architecture produit : **TERMINÉ — draft**
- Taxonomie : **TERMINÉ — draft**
- Parcours critiques : **TERMINÉ — low-fi**
- Matrice d'états : **TERMINÉ — conception**
- Contrat accessibilité/performance/design system : **TERMINÉ — conception**
- Critères d'acceptation écrans : **TERMINÉ — conception**
- Architecture isolation frontend : **TERMINÉ — conception**
- Stratégie données/fixtures : **TERMINÉ — conception**
- Migration storage/cache/SW : **TERMINÉ — conception**
- Stratégie QA : **TERMINÉ — conception, NON EXÉCUTÉ**
- Wireframes core : **EN COURS**
- Écriture Figma supplémentaire : **BLOQUÉ EXTERNE**
- Tree testing humain : **PREUVE MANQUANTE**
- Direction artistique : **BLOQUÉ**
- High-fi : **BLOQUÉ**
- Nouveau frontend production : **NON COMMENCÉ volontairement**

## 21. Prochain point logique automatique

1. Continuer recherche/specification et audit ne nécessitant pas Figma.
2. Ne pas relancer Figma tant que le quota Starter reste bloqué.
3. Continuer l'audit des contrats et préparer les critères de test/QA V2 sans implémenter le front.
4. Dès disponibilité Figma :
   - ajouter Game Hub ;
   - ajouter Global Search ;
   - ajouter Community ;
   - ajouter Mobile Game Hub ;
   - micro-vérifier clipping/overflow.
5. Exécuter/obtenir tree testing humain.
6. Corriger les ambiguïtés.
7. Seulement après : direction artistique, design system final, prototype high-fi.
8. Ne pas toucher au front public ni à `main` sans stratégie contrôlée.

## 22. Règle de reprise

Pour toute nouvelle conversation :

> Lire ce checkpoint en priorité, vérifier Git frais, puis continuer au prochain point logique sans reconstruire l'état depuis les anciens chats.
