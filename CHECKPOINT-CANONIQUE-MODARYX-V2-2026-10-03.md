# CHECKPOINT CANONIQUE — MODARYX V2 — 3 octobre 2026

**Statut : SOURCE DE REPRISE V2 PRIORITAIRE — CONCEPTION LOW‑FI / HIGH‑FI BLOQUÉ**

Ce checkpoint décrit l'état opérationnel courant du chantier **MODARYX V2**. Il ne fusionne pas ce chantier dans `main`, ne remplace pas le site public et ne constitue pas une VF.

## 1. Séparation officielle

- **MODARYX Forge = logiciel / écosystème desktop**
  - **MODARYX Public** = édition publique
  - **MODARYX Founder** = édition Founder
- **MODARYX / MODARYX MODS = plateforme web**
- les deux produits appartiennent à la même famille de marque mais gardent des responsabilités distinctes : web = découverte/communauté/publication ; Forge = création locale/installation/gestion/test/réparation
- `Nova Forge` = nom historique / legacy technique uniquement tant que les références n'ont pas été classifiées ; aucun remplacement global aveugle
- `getnovaforge.com` / « getnova » = ancien projet web abandonné
- aucune fusion technique aveugle entre le site et MODARYX Forge ; les ponts doivent être contractuels et prouvés

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

`dd01067bf2155c7e7fbf88fe4477bbdae7a2d5d2`

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

Plateformes et outils étudiés, benchmark désormais élargi :

- Nexus Mods / Vortex / Collections
- CurseForge
- Modrinth
- Thunderstore / r2modman
- Steam Workshop
- GameBanana
- Mod DB
- ModDropV et outils spécialisés GTA5-Mods
- Mod Organizer 2
- Prism Launcher
- ATLauncher
- Wabbajack
- OpenIV / OIV Package Installer
- Reloaded-II
- mod.io
- Bethesda Creations

Transfert détaillé vers l'anti-oubli V2 :
`docs/MODARYX-V2-MODDING-ECOSYSTEM-BENCHMARK-TRANSFER-20261003.md`

Leçons retenues :

- benchmark continu jusqu'à la VF : toute nouvelle idée explicitement retenue doit être intégrée, mappée vers un équivalent prouvé ou rejetée explicitement ;
- MODARYX ne promet jamais une installation locale sans runtime MODARYX Forge prouvé ;
- adapters/connecteurs autorisés plutôt que scraping universel ;

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
- Mods & contenus
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

## 14. Contrats de découverte et fiche contenu

**TERMINÉ — conception**

Documents :

- `docs/MODARYX-V2-SEARCH-FILTER-DISCOVERY-CONTRACT-20261003.md`
- `docs/MODARYX-V2-CONTENT-DETAIL-CONTRACT-20261003.md`

Décisions :

- filtres actifs toujours visibles ;
- multi-sélection intra-facette quand pertinente ;
- logique OR dans une facette / AND entre facettes par défaut ;
- filtres contextuels par jeu/type ;
- search local-first, externe optionnel ;
- Content Detail centrée sur compatibilité/dépendances avant installation ;
- projet, release et fichier séparés ;
- Requirements structurés ;
- provenance/hash/scan présentés avec limites explicites ;
- mobile priorise identité → compatibilité → action → requirements.

## 15. Contrats de surfaces produit supplémentaires

**TERMINÉ — conception**

Documents :

- `docs/MODARYX-V2-GAME-HUB-CONTRACT-20261003.md`
- `docs/MODARYX-V2-CREATOR-STUDIO-CONTRACT-20261003.md`
- `docs/MODARYX-V2-COMMUNITY-LIBRARY-NAV-CONTRACT-20261003.md`

Décisions principales :

- Game Hub = pivot jeu/version/recherche/contenus ;
- un hub éditorial ne prouve pas un corpus distribuable ;
- Creator Studio sépare Project et Release ;
- brouillon local préservé après erreur ;
- Community reste centrée sur le modding ;
- Library sépare favoris, suivis, collections, modpacks, profils/loadouts et saved searches ;
- navigation mobile garde Recherche/Jeux/Découvrir/Bibliothèque/Compte en priorité ;
- vocabulaire fonctionnel avant lore.

Un premier envoi du document Community/Library/Nav a été bloqué par un contrôle de sécurité externe. Procédure appliquée : erreur exacte → vérification du SHA inchangé → simplification ciblée du document → micro-proof par commit réussi. Aucun full replay.

## 16. Contrats produit supplémentaires

**TERMINÉ — conception**

Documents :

- `docs/MODARYX-V2-COLLECTION-MODPACK-PROFILE-CONTRACT-20261003.md`
- `docs/MODARYX-V2-TRUST-PROVENANCE-DISTRIBUTION-CONTRACT-20261003.md`
- `docs/MODARYX-V2-INSTALL-MANAGER-CONTRACT-20261003.md`

Décisions principales :

- Favori, Collection, Modpack et Profile/Loadout restent distincts ;
- conversion entre objets uniquement par action explicite ;
- états de provenance et distribution restent explicites ;
- installation automatisée uniquement si la capacité réelle existe ;
- compatibilité, dépendances et conflits sont vérifiés avant action ;
- mobile ne montre pas de capacité absente.

## 17. Anti-oubli V2

**TERMINÉ — consolidation actuelle, À MAINTENIR**

Document :

`docs/MODARYX-V2-ANTI-OUBLI-MASTER-20261003.md`

Le registre couvre :

- identité produit ;
- architecture/navigation ;
- jeux/hubs ;
- recherche/filtres ;
- taxonomie ;
- fiche contenu/releases ;
- compatibilité/dépendances ;
- favoris/collections/modpacks/profiles ;
- créateurs/équipes/Studio ;
- compte/auth ;
- Community/modération ;
- confiance/provenance/distribution ;
- installation/manager ;
- monde vivant ;
- notifications/préférences ;
- SEO/i18n ;
- PWA/cache/migration ;
- accessibilité/responsive/performance ;
- isolation legacy ;
- wireframes/high-fi ;
- capacités historiques à reconnecter ;
- preuves externes encore manquantes.

Aucune idée explicitement retenue ne doit disparaître silencieusement.

## 18. Veille actuelle et gouvernance API

**TERMINÉ — recherche / conception**

Documents :

- `docs/MODARYX-V2-RESEARCH-DELTA-20261003.md`
- `docs/MODARYX-V2-API-GOVERNANCE-CONTRACT-20261003.md`

Décisions ajoutées :

- prévoir plusieurs installations/instances d'un même jeu ;
- proposer profil existant ou nouveau profil lors d'une installation manager ;
- support du curateur de Collection explicite ;
- facettes spécifiques aux Collections ;
- recommandation de profil propre à tester selon capacités manager ;
- API V2 avec versioning, dépréciation documentée, migration guidée et contract tests.

Les contrats Collection/Modpack/Profile et Installation/Manager ont été mis à jour avec ces résultats de benchmark.

## 19. Readiness, risques et terminologie

**TERMINÉ — conception / À MAINTENIR**

Documents :

- `docs/MODARYX-V2-RISK-REGISTER-20261003.md`
- `docs/MODARYX-V2-IMPLEMENTATION-READINESS-20261003.md`
- `docs/MODARYX-V2-SECONDARY-WIREFRAME-BLUEPRINTS-20261003.md`
- `docs/MODARYX-V2-PRODUCT-GLOSSARY-20261003.md`

Ces documents couvrent :

- risques de contamination legacy ;
- risques UX, données, distribution, manager et gouvernance ;
- readiness écran par écran avant implémentation ;
- blueprints secondaires mobile/desktop ;
- séparation des termes Collection/Modpack/Profile, ContentItem/Release/File, compte/profil/créateur/autorité ;
- termes lore conservés comme couche secondaire uniquement.

Le frontend V2 reste volontairement bloqué tant que les gates UX/Figma/high-fi ne sont pas fermés.

## 20. Revue experte IA / terminologie

**TERMINÉ — passe experte ; validation humaine partielle désormais disponible**

Document :

`docs/MODARYX-V2-IA-TERMINOLOGY-EXPERT-REVIEW-20261003.md`

Corrections appliquées :

- Collection / Modpack / Profile séparés dans l'architecture et les routes ;
- `/content/:id/requirements` aligné avec le vocabulaire produit ;
- `/content/:id/versions` distingué de Files ;
- persona curateur recentré sur la curation plutôt que la configuration installable ;
- script de test humain corrigé pour séparer Favori / Collection / Profile ;
- Support et Signalement séparés ;
- test Release vs File ajouté ;
- compréhension de “Catalogue disponible” ajoutée au protocole humain.

Points toujours à tester humainement :

- “Mods & Plugins” comme umbrella label ;
- “Découvrir” vs homepage ;
- “Bibliothèque” comme contenant personnel ;
- statuts de support jeu ;
- compréhension contextualisée de “Non vérifié”.

## 21. Kit de validation humaine IA

**TERMINÉ — protocole prêt / P01 partiellement exécuté**

Document :

`docs/MODARYX-V2-HUMAN-IA-TEST-KIT-20261003.md`

Le kit comprend :

- card sorting ;
- hypothèses à tester ;
- 16 tâches de tree testing ;
- distinction Favori / Collection / Modpack / Profile ;
- distinction Release / File ;
- distinction Support / Signalement ;
- test du libellé “Catalogue disponible” ;
- test “Mods & Plugins” comme umbrella label ;
- grille de résultats et seuils de correction.

Cette préparation ne remplace pas un participant réel.

## 22. Figma

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

## 23. Erreurs Figma et procédure

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

### Retry Figma ciblé — 2026-10-03 20:12 Europe/Paris

Une seule tentative de reprise en lecture via `use_figma` a été effectuée après reprise canonique.

Résultat : **même erreur de quota Starter**.

Aucune écriture canvas n'a eu lieu.
Aucune nouvelle relance Figma n'est autorisée tant qu'un changement réel de quota/plan ou de fenêtre d'accès n'est pas prouvé.

## 24. Wireframes core complémentaires

**TERMINÉ — conception textuelle + prototype low-fi HTML isolé / BLOQUÉ uniquement pour matérialisation Figma**

- Desktop Game Hub — blueprint détaillé TERMINÉ
- Desktop Global Search — blueprint détaillé TERMINÉ
- Desktop Community — blueprint détaillé TERMINÉ
- Mobile Game Hub — blueprint détaillé TERMINÉ

Blueprints textuels :

`docs/MODARYX-V2-MISSING-WIREFRAME-BLUEPRINTS-20261003.md`

Revue de couverture :

`docs/MODARYX-V2-WIREFRAME-COVERAGE-20261003.md`

### Boucle visuelle locale dans le chat standard

**TERMINÉ — micro-preuve d’outillage dans l’environnement courant / À REVALIDER À CHAQUE SESSION**

- Chromium est disponible via `/usr/bin/chromium` ;
- Playwright Python est disponible et a lancé Chromium en headless avec succès ;
- le prototype low-fi peut être injecté avec `page.set_content`, rendu, inspecté par sélecteurs puis capturé en image ;
- les navigations directes `file://` et `http://127.0.0.1` sont bloquées par la politique de l’environnement (`ERR_BLOCKED_BY_ADMINISTRATOR`) : ne pas les relancer en boucle ;
- micro-preuve ciblée : 4 frames rendues, libellé actif `Mods & contenus` présent 3 fois et `Mods & Plugins` actif absent après correction ;
- cette capacité permet ici la boucle **rendre → inspecter → corriger → comparer → recommencer** pour les prototypes isolés ; elle ne remplace pas une validation humaine ni un gel High-Fi final ;
- revalider la disponibilité de Chromium/Playwright au début d’une nouvelle session avant de s’y fier.

## 25. High‑Fi

**BLOQUÉ POUR GEL FINAL / EXPLORATION RÉVERSIBLE AUTORISÉE**

État réel :

- couverture conceptuelle core : TERMINÉE ;
- prototype low-fi HTML des 4 écrans complémentaires : TERMINÉ et QA mécanique verte ;
- P01 humain : mini-test critique + mini-test terminologique TERMINÉS ;
- étude indépendante interne 5×16 : TERMINÉE ;
- étude Work indépendante 5×16 : TERMINÉE ;
- convergence croisée : TERMINÉE ;
- validation humaine globale : EN COURS ;
- résultats terminologiques P01 : **Profils de jeu** préféré à Configurations de jeu ; **Collection** comprise comme sélection organisée ; **Bibliothèque** comprise comme espace personnel ; **Mods & Plugins** jugé trop étroit comme parapluie ; **Non vérifié** jugé ambigu ;
- libellé parapluie retenu par décision produit : **Mods & contenus** ; validation humaine globale toujours EN COURS ;
- `Non vérifié` générique est désormais interdit : toujours qualifier la dimension ;
- Figma MCP : BLOQUÉ EXTERNE pour nouvelles écritures.

Gate :

`docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`

## 26. Validation humaine

**EN COURS — 1 participant réel testé / OUTILLAGE TERMINÉ**

Harness local de tree testing :
- 16 tâches ;
- card sorting ;
- questions de sortie ;
- sauvegarde locale ;
- export JSON ;
- aucun service payant requis.

SHA-256 du harness local :
`9cc383f7645656a9819177147f3dc3fabfb55880eff4e5f1505fb5dd2a100534`

Le harness ne constitue une preuve humaine qu'après remplissage par un participant réel.

Une première preuve humaine réelle existe désormais :
- participant P01 ;
- mini-test critique 5 questions ;
- document : `docs/MODARYX-V2-HUMAN-MINI-TREE-TEST-P01-20261003.md` ;
- Favoris : compris naturellement ;
- `Catalogue consultable` : compris comme consultation sans téléchargement garanti ;
- Profils de jeu : trouvabilité insuffisante depuis Bibliothèque seule ; le mini-test terminologique P01 préfère néanmoins **Profils de jeu** à **Configurations de jeu** ;
- Collection : terme non spontané au premier test, mais compris comme sélection organisée dans le mini-test terminologique ; capacité d'installation toujours explicite ;
- conflits/prérequis : attente d'avertissement proactif avant action.
- document : `docs/MODARYX-V2-HUMAN-TERMINOLOGY-MINITEST-P01-20261003.md` ;
- Bibliothèque : comprise comme espace personnel ;
- Mods & Plugins : **ne couvre pas spontanément** addons/scripts/outils/maps/shaders/presets pour P01 ;
- Non vérifié : compris simultanément comme danger potentiel, absence de test et provenance inconnue → libellé générique à écarter.

**Validation humaine globale : EN COURS — ne pas généraliser à tous les utilisateurs à partir d'un seul participant.**

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

## 27. Production / infrastructure

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

## 28. États courants

- Audit legacy : **TERMINÉ**
- Audit modules legacy ciblés : **TERMINÉ pour périmètre inspecté**
- Audit exhaustif code — phases 1 à 8 : **TERMINÉ — couverture 525/525, 0 non classé**
- Registre maître anti-contamination : **TERMINÉ — draft opérationnel**
- Dépendances entrantes legacy critiques : **TERMINÉ**
- Policy anti-contamination machine-readable : **TERMINÉ**
- Guard CI anti-contamination : **TERMINÉ — micro-proof frais vert**
- Frontières modules/adapters V2 : **TERMINÉ — conception**
- Plan migration routes/cutover : **TERMINÉ — conception, aucun changement public**
- Brief exploration direction artistique : **TERMINÉ — préparation, high-fi toujours BLOQUÉ**
- Matrice mapping V1→V2 détaillée : **TERMINÉ — conception**
- Threat model pré-implémentation : **TERMINÉ — conception**
- Policy CSP/headers/rich-text V2 : **TERMINÉ — conception, public inchangé**
- Gate sélection stack technique : **TERMINÉ — critères seulement, aucune dépendance/framework sélectionné**
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
- Recherche/filtres/découverte : **TERMINÉ — conception**
- Fiche contenu : **TERMINÉ — conception**
- Game Hub : **TERMINÉ — conception**
- Creator Studio : **TERMINÉ — conception**
- Community/Library/Navigation : **TERMINÉ — conception**
- Collections/Modpacks/Profiles : **TERMINÉ — conception**
- Trust/Provenance/Distribution : **TERMINÉ — conception**
- Installation/Manager : **TERMINÉ — conception**
- SEO/I18n/Content : **TERMINÉ — conception**
- Anti-oubli V2 maître : **TERMINÉ — consolidation actuelle, À MAINTENIR**
- Veille actuelle / benchmark delta : **TERMINÉ — 2026-10-03**
- Gouvernance API V2 : **TERMINÉ — conception**
- Registre risques : **TERMINÉ — création initiale, À MAINTENIR**
- Matrice readiness implémentation : **TERMINÉ — conception**
- Blueprints secondaires : **TERMINÉ — conception textuelle**
- Glossaire produit : **TERMINÉ — draft convergé P01/Work/étude indépendante ; validation humaine globale EN COURS**
- Revue experte IA/terminologie : **TERMINÉ — passe experte**
- Script low-fi humain : **MIS À JOUR — 14 tâches, PREUVE MANQUANTE pour exécution**
- Kit validation humaine IA : **TERMINÉ — protocole prêt ; P01 réel partiellement exécuté**
- Simulation experte multi-profils du tree test : **TERMINÉ — ne remplace pas une validation humaine**
- Test terminologique indépendant assistant : **TERMINÉ — 6 profils synthétiques × 6 questions**
  - document : `docs/MODARYX-V2-ASSISTANT-INDEPENDENT-TERMINOLOGY-TEST-20261003.md`
  - simulation IA uniquement, aucune statistique humaine ;
  - convergence interne : Profils de jeu défendable, Collection + capacité explicite, Bibliothèque valide, Mods & Plugins trop étroit, Non vérifié trop ambigu, Mods & contenus meilleur compromis simulé.
- Test terminologique Work : **TERMINÉ — 9 écosystèmes / 6 profils synthétiques / 36 réponses**
  - rapport ingéré dans `docs/MODARYX-V2-WORK-TERMINOLOGY-REPORT-INGEST-20261003.md` ;
  - indépendance déclarée vis-à-vis de P01 et du test assistant.
- Décision produit finale — **Profils de jeu** : **TERMINÉ**
  - document : `docs/MODARYX-V2-FINAL-PRODUCT-WORDING-GAME-PROFILES-20261003.md`
  - UI : **Profils de jeu**
  - microcopy : **Configurations enregistrées de mods, versions et réglages.**
  - Game Hub : **Mes profils pour ce jeu**
  - domaine interne : `Profile/Loadout`
  - arbitrage `Profils de jeu` vs `Configurations de jeu` : **FERMÉ**
- Décision produit finale — **Mods & contenus** : **TERMINÉ**
  - document : `docs/MODARYX-V2-FINAL-PRODUCT-WORDING-CONTENT-UMBRELLA-20261003.md`
  - UI : **Mods & contenus**
  - microcopy : **Mods, plugins, addons, scripts, maps, shaders, presets, outils et autres contenus pour vos jeux.**
  - arbitrage parapluie : **FERMÉ**
  - validation humaine globale : **EN COURS**
- Rapport Work terminologique indépendant : **TERMINÉ — 9 écosystèmes / 6 profils synthétiques / 36 réponses**
  - ingestion : `docs/MODARYX-V2-WORK-TERMINOLOGY-REPORT-INGEST-20261003.md`
  - analyse croisée finale : `docs/MODARYX-V2-FINAL-TERMINOLOGY-CROSS-ANALYSIS-P01-ASSISTANT-WORK-20261003.md`
  - indépendance déclarée : P01 et test assistant non consultés avant rédaction ;
  - convergence forte : **Mods & contenus**, Collection avec capacité explicite, Bibliothèque personnelle, suppression de `Non vérifié` générique ;
  - divergence de recherche documentée : **Profils de jeu** vs **Configurations de jeu** ; décision produit désormais FERMÉE en faveur de **Profils de jeu**.
- Benchmark terminologique multi-gaming / gaming / modding : **TERMINÉ — Nexus, CurseForge, Modrinth, Thunderstore, Steam Workshop, Bethesda, mod.io, ModDB, GameBanana**
  - document : `docs/MODARYX-V2-MULTIGAMING-MODDING-TERMINOLOGY-BENCHMARK-20261003.md`
  - confirme **Profils de jeu** comme convention défendable ;
  - confirme **Collection** mais capacité d'installation à rendre explicite ;
  - confirme **Bibliothèque** comme convention crédible d'espace personnel ;
  - confirme que **Mods & Plugins** est trop étroit comme parapluie universel ;
  - shortlist testée auprès de P01 : **Mods & contenus** choisi devant **Contenus de jeu** et **Créations** ;
  - confirme l'interdiction du libellé générique **Non vérifié**.
- Rapport Work indépendant : **TERMINÉ — 5 profils × 16 tâches / P01 non consulté**
  - ingestion : `docs/MODARYX-V2-WORK-REPORT-INGEST-20261003.md`
  - analyse croisée : `docs/MODARYX-V2-CROSS-ANALYSIS-P01-WORK-INTERNAL-20261003.md`
  - convergences : Collection/capacité explicite, compatibilité/prérequis proactifs, version→fichiers, recherche globale/contextuelle, catalogue≠distribution ; `Configurations de jeu` n'est plus prioritaire après préférence humaine P01 pour **Profils de jeu**
- Recherche UX indépendante + 80 simulations : **TERMINÉ — 5 profils × 16 tâches**
  - document : `docs/MODARYX-V2-INDEPENDENT-UX-RESEARCH-TREE-SIMULATION-20261003.md`
  - sources actuelles étudiées : Nexus Mods, CurseForge, Modrinth, Thunderstore + signaux communautaires
  - risque majeur détecté : `Collection` peut être interprétée comme installable par des utilisateurs habitués à Nexus
  - convergence : parcours jeu-d'abord, compatibilité/prérequis proactifs, profil expliqué, recherche globale multi-type
  - document : `docs/MODARYX-V2-TREE-TEST-EXPERT-SIMULATION-20261003.md`
  - contradictions internes graves : aucune détectée
  - clarifications sûres intégrées : Compatibilité et prérequis, Catalogue consultable, Mods & Plugins parapluie, Profils de jeu, Fichiers de cette version
- Onboarding/Compte/Créateur : **TERMINÉ — conception**
- Notifications/Préférences : **TERMINÉ — conception**
- Modération/Appels : **TERMINÉ — conception**
- Cycle de vie support jeux : **TERMINÉ — conception**
- Wireframes core : **TERMINÉ pour conception textuelle + prototype low-fi local des 4 écrans / validation humaine EN COURS**
- Écriture Figma supplémentaire : **BLOQUÉ EXTERNE**
- Tree testing humain : **EN COURS — P01 réel terminé / autres profils utiles pour consolider**
- Direction artistique exploratoire : **LIVING THRESHOLD SÉLECTIONNÉE / PALETTE HYBRIDE 2+3 / prototype réversible créé**
- Design system préparatoire : **TERMINÉ — couleurs, surfaces, typographie, grille, spacing, composants, états, responsive, accessibilité, motion, iconographie, illustration et identité documentés**
- QA visuelle formelle du prototype : **EN COURS — captures desktop/mobile archivées + contraste/focus/reduced-motion/clavier/touch/overflow micro-prouvés ; comparaison normalisée à la source + screen-reader/appareils + revue humaine multi-écrans encore manquants**
- Direction artistique finale : **BLOQUÉE — la sélection exploratoire ne vaut pas gel high-fi**
- High-fi final : **BLOQUÉ — autres validations humaines/visuelles encore requises ; wordings `Profils de jeu` et `Mods & contenus` désormais figés par décision produit**
- Nouveau frontend production : **NON COMMENCÉ volontairement**

## 29. Prochain point logique automatique

1. Audit code anti-contamination : fermé pour le périmètre actuel ; garder le guard actif.
2. Les frontières modules/adapters, mapping V1→V2, threat model, policy CSP et gate de stack sont prêts ; ne créer aucune nouvelle spec si elle ne ferme pas un risque réel.
3. Ne pas relancer Figma tant que le quota Starter reste bloqué ; retry ciblé du 2026-10-03 20:12 = toujours BLOQUÉ EXTERNE.
4. Maintenir le registre anti-oubli et intégrer uniquement les améliorations justifiées.
5. Alternative gratuite exécutée : prototype low-fi HTML local créé et versionné comme review evidence ; Miro indisponible pour l'organisation.
6. Dès disponibilité Figma :
   - matérialiser Game Hub ;
   - matérialiser Global Search ;
   - matérialiser Community ;
   - matérialiser Mobile Game Hub ;
   - micro-vérifier clipping/overflow.
7. QA mécanique low-fi fermée ; simulation experte multi-profils fermée avec clarifications sûres intégrées.
8. P01 réel + étude indépendante interne 5×16 + étude Work 5×16 : comparaison croisée TERMINÉE. Ne pas généraliser P01 ni transformer les simulations IA en statistiques humaines.
9. Mini-test terminologique P01 TERMINÉ : **Profils de jeu** préféré ; Collection et Bibliothèque comprises ; **Mods & Plugins** trop étroit comme parapluie ; **Non vérifié** générique écarté.
10. Benchmark externe multi-gaming TERMINÉ : **Contenus de jeu**, **Mods & contenus** et **Créations** ont été comparés.
11. Mini-test humain parapluie P01 TERMINÉ : **Mods & contenus** choisi. Document : `docs/MODARYX-V2-HUMAN-CONTENT-UMBRELLA-MINITEST-P01-20261003.md`.
12. Test assistant 6×6 + rapport Work indépendant TERMINÉS ; comparaison P01 + assistant + Work TERMINÉE.
13. Décisions produit fermées : **Profils de jeu** et **Mods & contenus**. La validation humaine globale reste EN COURS et ne doit pas être confondue avec ces décisions de wording.
14. Direction artistique exploratoire : **TERMINÉE** avec sélection humaine de `Living Threshold` et affinage palette 2+3. Référence : `docs/MODARYX-V2-LIVING-THRESHOLD-DESIGN-SYSTEM-20261003.md`.
15. Prototype autonome créé dans `review-evidence/modaryx-v2-living-threshold-prototype-20261003/` pour Home, Game Hub, Catalog, Content Detail, Library, Community et mobile. Il reste une preuve de conception réversible, pas le frontend V2 de production.
16. Capture navigateur archivable : **TERMINÉE** — workflow `MODARYX V2 Living Threshold Visual Proof`, run `37157794569`, artifact `11286254258`, commit `87245c939c42daf1a0b04879d26039eb4b5daae1`.
17. Contraste + clavier/touch + overflow ciblés : **TERMINÉ — run 37158374418**. Preuve multi-écrans archivable : **TERMINÉ — run 37158610507 / 11 captures**. Restent : référence approuvée pour comparaison normalisée, revue humaine multi-écrans, screen reader/appareils et approfondissement des surfaces produit incomplètes. Aucun gel high-fi final avant fermeture suffisante de ces preuves.
18. Ne pas toucher au front public ni à `main` sans stratégie contrôlée.

## 30. Règle de reprise

Pour toute nouvelle conversation :

> Lire ce checkpoint en priorité, vérifier Git frais, puis continuer au prochain point logique sans reconstruire l'état depuis les anciens chats.


## AUDIT EXHAUSTIF DU CODE — TERMINÉ POUR LE PÉRIMÈTRE ACTUEL

**Décision utilisateur respectée : l'audit code a été fermé avant tout nouveau frontend V2.**

État frais de départ :
- dépôt `Jajaz537/Nova-Forge-Site-Public`
- `main` : `d8d5ea5509f07c5bf5a4424293cfa404643c239f`
- inventaire : **525 fichiers**
- frontend V2 : **BLOQUÉ volontairement** jusqu'à fermeture suffisante de l'audit anti-contamination.

Phases terminées :
- `docs/MODARYX-V2-CODE-AUDIT-PHASE1-20261003.md` — entrées, SW, manifest, build ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE2-SCRIPTS-20261003.md` — scripts assets ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE3-CSS-20261003.md` — CSS ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE4-BACKEND-20261003.md` — functions/API ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE5-SCHEMAS-DATA-20261003.md` — schémas/données ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE6-CI-QA-MIGRATIONS-20261003.md` — CI/QA/migrations ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE7-ROOT-PAGES-CONFIG-20261003.md` — pages/racine/config ;
- `docs/MODARYX-V2-CODE-AUDIT-PHASE8-ASSETS-20261003.md` — assets médias ;
- `docs/MODARYX-V2-CODE-AUDIT-COVERAGE-525-20261003.md` — preuve 525/525 ;
- `docs/MODARYX-V2-LEGACY-INBOUND-DEPENDENCY-CLOSURE-20261003.md` — dépendances entrantes ;
- `docs/MODARYX-V2-CODE-ANTI-CONTAMINATION-MASTER-20261003.md` — blacklist/allowlist ;
- `docs/MODARYX-V2-ANTI-CONTAMINATION-GUARD-PROOF-20261003.md` — micro-proof du guard.

Findings critiques déjà prouvés :
- `sw.js` précache et peut resservir des CSS/JS legacy ;
- `shell.js` enregistre automatiquement le SW et mélange navigation, préférences, DOM et monde vivant ;
- plusieurs scripts utiles sont fortement couplés au DOM V1 et doivent être **extraits**, pas importés ;
- plusieurs CSS redéfinissent `:root`, `body`, `nav`, `.card`, `.button`, `.panel` et autres sélecteurs globaux ;
- `modaryx-home-finishline.css` embarque du CSS/tokens Nova historiques ;
- aucun stylesheet V1 ne doit être importé dans V2 ;
- les API/backend contiennent beaucoup de logique réutilisable mais leurs contrats/routes v1 restent à adapter, pas à casser ;
- de nombreux schémas v1 utilisent encore des IDs historiques `urn:nova-forge:...` : compatibilité uniquement, jamais nouveau namespace V2 ;
- le search-index, le sitemap, le webmanifest, les status/build manifests et le pipeline npm restent V1 ;
- la plupart des workflows UI/browser sont liés à l'ancienne branche design et/ou aux 23 routes V1 ;
- `build-games-index.py`, `run-final-source-validation.py` et plusieurs gates QA ne doivent pas devenir le pipeline V2 ;
- `domain-cutover.json` vise encore getnovaforge.com et est **historique / à bloquer** pour MODARYX V2 ;
- les workflows Cloudflare mutateurs restent hors exécution sans instruction explicite.

Classification obligatoire :
- RÉUTILISABLE
- À EXTRAIRE
- LEGACY VISUEL
- HISTORIQUE / PROVENANCE
- À BLOQUER
- À REVALIDER

Fermeture obtenue :
1. inventaire et classification complète **525/525** ;
2. assets médias classés ;
3. blacklist/allowlist consolidée ;
4. dépendances entrantes critiques fermées ;
5. policy machine-readable créée ;
6. checker + workflow anti-contamination créés ;
7. première micro-preuve échouée sur regex sur-échappée, correction ciblée appliquée ;
8. micro-proof frais GitHub Actions **SUCCESS** — run `37142295594` ;
9. marqueurs : `PASS_V2_ANTI_CONTAMINATION_SELF_TEST` et `READY_V2_ANTI_CONTAMINATION_NO_ROOT`.

Interprétation : le guard est vert ; aucun frontend V2 n'existe encore, donc aucun PASS frontend n'est déclaré.

Specs ajoutées après fermeture de l'audit :
- `docs/MODARYX-V2-ADAPTER-MODULE-BOUNDARIES-20261003.md` ;
- `docs/MODARYX-V2-ROUTE-CUTOVER-PLAN-20261003.md` ;
- `docs/MODARYX-V2-ART-DIRECTION-EXPLORATION-BRIEF-20261003.md` ;
- `docs/MODARYX-V2-V1-V2-MAPPING-MATRIX-20261003.md` ;
- `docs/MODARYX-V2-THREAT-MODEL-20261003.md` ;
- `docs/MODARYX-V2-CSP-HEADERS-RICH-TEXT-POLICY-20261003.md` ;
- `docs/MODARYX-V2-TECH-STACK-SELECTION-GATE-20261003.md`.

Elles ne lèvent ni le gate Figma, ni le tree testing humain, ni le gate High-Fi.

Règle :
> Aucun premier code frontend V2 tant que les risques de contamination actifs n'ont pas été inventoriés et isolés.


## Preuve visuelle archivable Living Threshold

**TERMINÉE pour l'export navigateur / comparaison normalisée encore ouverte**

- workflow : `.github/workflows/modaryx-v2-living-threshold-visual-proof.yml`
- run : `37157794569` — **SUCCESS**
- commit capturé : `87245c939c42daf1a0b04879d26039eb4b5daae1`
- artifact : `modaryx-v2-living-threshold-visual-proof` / id `11286254258`
- artifact digest : `sha256:ee91b7e87f9d04a804b49873c0e1ba3249087d7cd05b0165787b8e71cca3a03c`
- desktop : `game-hub-desktop-1440x1024.png`, SHA-256 `9cccc32bc23d661d9ea6bd823e51cf7e09d4df9d0805bb132d4e57607ae1f417`
- mobile : `game-hub-mobile-390x844.png`, SHA-256 `52b0e3762591371b3c8a9b1c4dc038e44bbf80c403a94c4dfd5baa870a11b49c`
- source visuelle Work : toujours non archivée dans le dépôt ; comparaison source-vs-implémentation = **PREUVE MANQUANTE**
- aucun PASS esthétique final déduit de ce run.


## Micro-preuve accessibilité rendue Living Threshold

**TERMINÉE pour le périmètre ciblé du prototype — pas une certification WCAG finale**

- run : `37158374418` — **SUCCESS**
- commit candidat : `6721a761034a091bf4f4f9eaff6cc7b555a49665`
- artifact : `11287195204`
- marqueurs :
  - `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
  - `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
  - `KEYBOARD_REACHABLE 35 / 35`
  - `DESKTOP_OVERFLOW 0`
  - `MOBILE_OVERFLOW 0`
- contrastes token ciblés : 17.19 / 7.77 / 10.97 / 12.00 / 10.97 / 4.88 / 5.14, tous au-dessus du seuil 4.5 appliqué par ce micro-check.
- cibles interactives mobiles visibles testées : au moins 44×44 px.
- focus visible 3 px cyan + reduced-motion : contrat vérifié.
- **PREUVE MANQUANTE** : screen reader réel, appareils physiques, comparaison source normalisée et revue humaine multi-écrans.

Aucun PASS High-Fi final n'est déduit de cette micro-preuve.


## Preuve visuelle multi-écrans Living Threshold

**TERMINÉE pour l'archivage / validation humaine toujours EN COURS**

- run : `37158610507` — **SUCCESS**
- commit capturé : `63d6a79b9fa05378d8280ff65ed05a81fa750ead`
- artifact : `11287155242`
- artifact SHA-256 : `38d2a9e777feb9a8acdf1b55c4c953ce6665385fcb0251a3de240abadeb6f2c2`
- `MULTISCREEN_CAPTURE_COUNT 11`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`
- desktop : Game Hub, Home, Catalog, Content Detail, Library, Community, Creator Studio ;
- mobile : Game Hub, Home, Catalog, Content Detail.
- inspection : cohérence de famille visuelle conservée ; Creator Studio reste une couverture exploratoire minimale, non une surface finale.
- cette preuve rend possible la revue humaine multi-écrans mais ne la remplace pas.

Prochains écarts produit prioritaires du prototype :
1. Games Index réel ;
2. Global Search réel ;
3. Catalogue avec requête/filtres/tri/résultats/reset/états réellement exercés ;
4. Content Detail avec navigation Releases/Files/Requirements/Changelog/Support/Permissions ;
5. Library et Creator Studio approfondis selon critères d'acceptation.
