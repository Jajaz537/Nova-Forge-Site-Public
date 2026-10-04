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
- inspection historique : cohérence de famille visuelle conservée ; cette observation sur le Creator Studio minimal a depuis été dépassée par l’expansion ciblée du 4 octobre.
- cette preuve rend possible la revue humaine multi-écrans mais ne la remplace pas.

Prochains écarts produit historiques de cette étape : Games Index, Global Search, Catalog, Content Detail, Library et Creator Studio. Ces surfaces ont depuis été approfondies et micro-prouvées ; voir la section d'expansion accélérée ci-dessous.


## Micro-preuve parcours produit Living Threshold

**TERMINÉE pour le prototype local — aucune preuve backend/production déduite**

- run : `37159148521` — **SUCCESS**
- commit candidat : `d24e00372e513741dac54316a5e9357e945efc31`
- artifact : `11286822252`
- artifact SHA-256 : `292083586f83740a9712f354db4396abce261ba6bfef00923d57310b2ec74a34`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 15`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`
- Jeux : recherche locale + état de support + ouverture Game Hub prouvés ;
- Recherche globale : regroupement multi-type + ouverture fiche prouvés ;
- Catalogue : recherche + filtre type + tri + reset + no-results/recovery prouvés ;
- Mobile : accès Recherche globale + résultat prouvés.

État produit :
- Games Index : **TERMINÉ — prototype exploratoire fonctionnel**
- Global Search : **TERMINÉ — prototype exploratoire fonctionnel**
- Catalog : **EN COURS — prototype fonctionnel pour recherche/filtre/tri/reset ; autres états/quick view encore à approfondir**
- données : **démonstration explicite uniquement**
- backend réel / recherche distante / production : **PREUVE MANQUANTE / non implémenté**


## Expansion accélérée des surfaces Living Threshold — 4 octobre 2026

**EN COURS — prototype exploratoire élargi / aucun PASS production**

Dernier micro-run consolidé de cette tranche :
- workflow : `MODARYX V2 Living Threshold Visual Proof`
- run : `37160578411` — **SUCCESS**
- commit capturé : `94fbc061d0d2915c1faf9376a01342d7caf92737`
- artifact : `11286779471`
- digest : `sha256:fe9629a3b042508ddd79711371d62c319c12c8d97c7db0e5eb56178a34e79046`
- `KEYBOARD_REACHABLE 36 / 36`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 22`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Surfaces maintenant approfondies dans le prototype :
- **Games Index** : recherche, support state, ouverture Game Hub ;
- **Global Search** : résultats multi-type et accès mobile ;
- **Catalog** : requête, filtres, tri, reset, no-results/recovery ;
- **Content Detail** : décision avant ajout + tabs Fichiers / Versions / Compatibilité et prérequis / Changelog / Support / Permissions ;
- **Library** : Favoris / Suivis / Collections / Profils de jeu / Recherches enregistrées, états local/cloud/manager explicites ;
- **Creator Studio** : Dashboard / Projects / Releases / Upload / Analytics / Support / Reports / Team / Settings ; brouillon local et services absents non simulés ;
- **Collections** : surface dédiée, filtres propres, curateur, jeu/version, capacité explicite `Sélection organisée` + `Installation non disponible` ;
- **Créateurs** : surface dédiée, identité publique de démonstration, rôle/focus/créations, aucune vérification simulée ;
- **Community** : Support / Questions / Discussions / Studios-équipe / Activité ; brouillon local non envoyé, modération avancée non simulée ;
- **Mobile** : Bibliothèque rendue accessible depuis le menu utilitaire ; captures dédiées Library / Creator Studio / Collections / Créateurs / Community.

Erreur fermée pendant cette tranche :
- capture Library attendait l'ancienne microcopy `Retrouvez vos jeux` ;
- erreur exacte isolée dans le script de capture ;
- correction ciblée vers la microcopy actuelle ;
- micro-proof de la ligne desktop/mobile ;
- run suivant **SUCCESS**.

Ce que ces preuves ne prouvent toujours pas :
- backend réel ;
- production V2 ;
- téléchargement/installation MODARYX Forge ;
- données réelles ;
- screen reader réel ;
- appareils physiques ;
- revue humaine multi-écrans complète ;
- comparaison normalisée à la référence visuelle approuvée.

**Prochain axe interne : fermer les surfaces encore non matérialisées/peu profondes (compte, notifications/préférences, onboarding, états critiques transverses) puis seulement préparer le passage du prototype vers le frontend V2 de production.**


## Consolidation automatique — surfaces produit et preuve fraîche — 4 octobre 2026

**TERMINÉ pour le prototype exploratoire ciblé / aucun PASS VF**

Run de référence : `37161527706` — **SUCCESS**  
Commit capturé : `03858bea92232b3040d76923e53d9a71d822712c`  
Artifact : `11288295345`  
Digest : `sha256:ca08469b5b434b57f68d3cbe2f1ef253596c8580fd55baa7c6f033a0cb5f21cf`

Preuves fraîches :
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `KEYBOARD_REACHABLE 32 / 32`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 37`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Nouvelles fermetures prototype :
- Game Hub : onglets Aperçu / Mods & contenus / Collections / Créateurs / Guides / Activité réellement distincts et exercés ;
- support jeu explicite : `Catalogue consultable — téléchargement non garanti` ;
- Content Detail : Support séparé de Signalement ; signalement = brouillon local non envoyé, aucune modération simulée ;
- Library : Profil de jeu ouvrable avec composants, versions, ordre, localité, sync/manager indisponibles explicites ;
- Collections : Collection distincte de Modpack ;
- Modpack : cible/version/dépendances/config/historique visibles ; manifeste/runtime réels explicitement PREUVE MANQUANTE ; installation désactivée ;
- Creator Studio : dashboard/projects/releases/upload/analytics/support/reports/team/settings approfondis ;
- Account/Settings : guest-first, onboarding facultatif/skippable, privacy privée par défaut, notifications sans faux événements, préférences locales ;
- mobile : utilitaires Recherche/Bibliothèque/Notifications/Compte et captures dédiées des nouvelles surfaces.

Erreurs ciblées fermées :
- attente Library périmée ;
- libellé exact `← Retour à la Bibliothèque` ;
- titre Collections périmé ;
- aucune relance full production n'a été utilisée.

Blockers encore réels :
- référence visuelle approuvée/source archivable pour comparaison normalisée ;
- revue humaine multi-écrans supplémentaire ;
- vrai screen reader ;
- appareils physiques ;
- frontend V2 de production / runtime réel ;
- données/backend/intégrations réels.

**Prochain point logique interne : fermer les états critiques transverses encore faisables dans le prototype (offline/stale/error/retry), puis réévaluer le gate de passage vers le root frontend V2 isolé sans cutover public.**


## États critiques transverses — preuve fraîche — 4 octobre 2026

**TERMINÉ pour le prototype ciblé / pas une preuve production**

Run : `37161856917` — **SUCCESS**  
Commit capturé : `9d0bfd38052797ccbfac0e7960733e143833491f`  
Artifact : `11288036698`  
Digest : `sha256:92b7c046125ab389b69dbd2b6dc4c86d794acaebacc1c21769be3647e0d5e8e1`

Marqueurs :
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `KEYBOARD_REACHABLE 32 / 32`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `FLOW_ASSERT offline state real browser transition`
- `FLOW_ASSERT report validation error retry recovered`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 39`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Fermetures :
- **offline/stale** : état réel `navigator.onLine`, événement navigateur réel via CDP, bandeau explicite ; données locales consultables et données distantes potentiellement indisponibles/obsolètes ;
- **error/retry** : Signalement refuse le brouillon sans raison, erreur liée au champ, correction par sélection d'une raison, retry réussi vers `Brouillon de signalement — non envoyé` ;
- captures desktop/mobile archivées de l'état d'erreur de signalement.

Ces preuves ne ferment pas :
- erreurs backend réelles ;
- sync conflict réel ;
- session expirée réelle ;
- PWA/SW offline production ;
- screen reader/appareil physique ;
- high-fi final ou VF.


## Mapping prototype → production / anti-oubli machine-readable — 4 octobre 2026

**TERMINÉ pour la préparation technique / root production toujours BLOQUÉ**

Documents et policy :
- `docs/MODARYX-V2-LIVING-THRESHOLD-PRODUCTION-MAPPING-20261004.md`
- `qa/modaryx-v2-production-surface-map.json`
- `qa/check-v2-production-surface-map.mjs`
- `.github/workflows/modaryx-v2-production-surface-map-proof.yml`

Micro-proof :
- run `37163081008` — **SUCCESS**
- commit : `8059e6dd9c0fab3ca58e8b6f09e9f25a60978657`
- marqueur : `PASS_V2_PRODUCTION_SURFACE_MAP`
- surfaces obligatoires mappées : **22**
- états runtime restant volontairement non prouvés : **6**
  - session expirée réelle ;
  - permission denied serveur réelle ;
  - erreur backend réelle ;
  - sync conflict réel ;
  - PWA/SW production ;
  - installation MODARYX Forge réelle.

Décision :
- le prototype Living Threshold possède désormais un mapping explicite vers composants, domaines, adapters, états et routing production ;
- `Requirements / Dependencies` est explicitement couvert comme surface de production, et non plus seulement implicitement via Content Detail ;
- toute surface reste `BLOCKED_GATE` côté production jusqu'à décision canonique de création du root V2 ;
- aucune modification de `main`, du frontend public, DNS/Cloudflare ou du cutover n'a été réalisée.

**Prochain point logique interne : comparaison de stack non engageante + blueprint root, puis arrêt au gate externe/humain si aucun autre blocker interne n'est récupérable.**


## Préparation finale avant root V2 — 4 octobre 2026

**TERMINÉ pour le travail interne autorisé / root production toujours BLOQUÉ**

### Mapping production

- `docs/MODARYX-V2-LIVING-THRESHOLD-PRODUCTION-MAPPING-20261004.md`
- `qa/modaryx-v2-production-surface-map.json`
- `qa/check-v2-production-surface-map.mjs`
- workflow `MODARYX V2 Production Surface Map Proof`
- run `37163081008` — **SUCCESS**
- marqueur `PASS_V2_PRODUCTION_SURFACE_MAP`
- 22 surfaces mappées
- 6 états runtime réels volontairement non prouvés

### Stack — comparaison uniquement

Document :
`docs/MODARYX-V2-STACK-COMPARISON-20261004.md`

Shortlist non engageante :
1. vanilla/static-first + Vite léger ;
2. Astro + Cloudflare Workers ;
3. React + Vite + Cloudflare Workers.

Fait externe frais :
- Cloudflare recommande actuellement Workers comme plateforme principale pour les nouvelles applications ;
- aucune migration Pages/Workers n'a été exécutée ;
- production actuelle, DNS, Cloudflare critique et `main` restent inchangés.

### Validation humaine prête

Document :
`docs/MODARYX-V2-HUMAN-MULTISCREEN-REVIEW-PACK-20261004.md`

Le pack réutilise la preuve 57 captures et concentre la revue sur :
- compréhension Home/Game Hub ;
- Catalog/Content Detail ;
- Collection / Modpack / Profil de jeu ;
- Library ;
- Creator Studio ;
- Community ;
- mobile ;
- direction visuelle.

Aucune réponse humaine supplémentaire n'est inventée.

### Assistive / appareils prête

Document :
`docs/MODARYX-V2-ASSISTIVE-DEVICE-VALIDATION-PROTOCOL-20261004.md`

Toujours PREUVE MANQUANTE réelle :
- NVDA/VoiceOver/TalkBack réel ;
- Safari réel ;
- mobile physique ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- validation humaine multi-écrans supplémentaire.

### Anti-oubli

`docs/MODARYX-V2-ANTI-OUBLI-MASTER-20261003.md` a été réconcilié avec les preuves actuelles :
- anti-import CI = implémenté/prouvé ;
- capture archivable = fermée ;
- ancien statut Work terminologique = marqué historique supersédé ;
- offline/error/retry = fermé au niveau prototype ;
- mapping production et comparaison stack = tracés.

### Décision courante

Tout le travail interne autorisé avant création du root V2 est maintenant suffisamment préparé pour ne pas refaire l'architecture.

Le prochain saut significatif vers la VF nécessite l'un des événements suivants :
1. vraies validations humaines supplémentaires ;
2. preuve assistive/appareil ;
3. référence visuelle approuvée archivable ;
4. décision canonique explicite reclassifiant le gate et autorisant le premier root/frontend V2 isolé.

Jusqu'à cet événement :
- ne pas créer un root production en contournant le gate ;
- ne pas toucher à `main` ;
- ne pas cutover le frontend public ;
- ne pas changer DNS/Cloudflare critique ;
- continuer seulement les micro-proofs/maintenance anti-oubli nécessaires.

**État : EN COURS vers VF / BLOQUÉ pour root production par validations externes et humaines restantes.**


## Benchmark écosystèmes + matérialisation Living Threshold — 4 octobre 2026

**TERMINÉ pour la recherche et les états prototype ciblés / aucun PASS production**

Benchmark actuel :
`docs/MODARYX-V2-CURRENT-MOD-ECOSYSTEM-BENCHMARK-20261004.md`

Écosystèmes analysés dans la passe actuelle :
- Nexus Mods / Vortex ;
- CurseForge ;
- Modrinth ;
- Thunderstore / r2modman ;
- Steam Workshop ;
- Bethesda Creations ;
- mod.io ;
- GameBanana ;
- Mod DB ;
- Prism Launcher ;
- Wabbajack ;
- signaux Reddit uniquement comme signaux UX.

Décisions produit retenues et désormais matérialisées au niveau prototype quand possible :
- delta avant mutation ;
- `Ajouter / Remplacer / Annuler` ;
- origine des dépendances ;
- version `Auto sûr / Proposer / Épinglé` ;
- mise à jour vers copie/branche avant promotion ;
- Historique Library privé par défaut, sans fausse entrée ;
- maturité projet `Concept / WiP / Released / Archived` séparée du canal de release ;
- crédits/auteurs/studio/assets tiers structurés ;
- Collection toujours distincte de son éventuelle application locale.

Micro-proof frais :
- workflow : `MODARYX V2 Living Threshold Visual Proof`
- run : `37163931034` — **SUCCESS**
- commit capturé : `226b41b40f49166c936cf7968391e0d35105b09e`
- artifact : `11288409054`
- artifact digest : `sha256:0f3c73af5ab4936fc0e10cee121612cef13363b4701a313df70041164f8df60f`
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `KEYBOARD_REACHABLE 32 / 32`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 47`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Couverture supplémentaire archivée :
- Library > Historique desktop/mobile ;
- Profile delta desktop/mobile ;
- Modpack delta desktop/mobile ;
- Creator Project / crédits desktop/mobile.

Règles maintenues :
- aucune entrée d'historique fictive n'est présentée comme activité réelle ;
- aucune mutation réelle n'est exécutée par les previews de delta ;
- le bouton d'installation Modpack reste désactivé sans runtime MODARYX Forge ;
- les providers/sources réels ne sont pas simulés ;
- aucun PASS High-Fi/VF n'est déduit de ces preuves.

Blockers externes inchangés :
- validation humaine multi-écrans supplémentaire ;
- mobile humain réel ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- vrai screen reader ;
- Safari/appareils physiques ;
- backend/données/providers réels ;
- root/frontend V2 production.


## Source/provider, interop et Plan avancé — preuve fraîche — 4 octobre 2026

**TERMINÉ pour le prototype ciblé / aucun provider-parser-runtime réel déclaré**

Séquence d'erreur respectée :
1. run `37164306202` : `ECONNREFUSED 127.0.0.1:9223` sur readiness Chrome CDP ;
2. isolation : build vert, erreur limitée au démarrage du micro-check navigateur ;
3. micro-proof dédié CDP : run `37164478594` — **SUCCESS** ;
4. correction ciblée du checker principal ;
5. continuation seulement ensuite.

Run de continuation :
- `37164509544` — **SUCCESS**
- commit capturé : `af4972fdf65c1df8248d25fc6f5fcc1c6c88da39`
- artifact : `11288507788`
- digest : `sha256:e5453441e1461c6f0c3955ba4d8a8cbfb26de38c00f64beba78c485d6f84d61b`
- `KEYBOARD_REACHABLE 32 / 32`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 51`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Nouveaux états prototype :
- auteur séparé de source/provider ;
- source manuelle de démonstration + provider réel absent ;
- Plan avancé déterministe, sans graph de conflits opaque ;
- futur receipt explicité ;
- rapport import/export de démonstration ;
- champs inconnus à préserver ;
- perte silencieuse interdite ;
- aucun fichier importé, aucun parser réel.

Toujours non prouvé :
- provider/connecteur réel ;
- parser/import/export réel ;
- backend/données/routing production ;
- runtime MODARYX Forge ;
- high-fi final/VF.

**Prochain axe interne : élargir le benchmark aux écosystèmes spécialisés encore non couverts, puis intégrer uniquement les apprentissages réellement distincts.**


## Benchmark spécialisé — preuve Living Threshold — 4 octobre 2026

**TERMINÉ pour le prototype ciblé / aucune preuve runtime réelle**

Benchmark spécialisé :
`docs/MODARYX-V2-SPECIALIZED-MOD-ECOSYSTEM-BENCHMARK-20261004.md`

Run :
- `37164976157` — **SUCCESS**
- commit capturé : `49ce52287c900e16376e4ccab84008a02a8a92e7`
- artifact : `11289531194`
- digest : `sha256:699e4daa8110e2182dce58eb7d0fc9fb7648114039bf411bca81d4d7f0e6db53`
- `KEYBOARD_REACHABLE 32 / 32`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 57`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Décisions spécialisées désormais matérialisées au niveau prototype :
- relations de dépendance typées ;
- reverse dependency impact ;
- compatibilité multi-dimension + fraîcheur/workaround ;
- variantes édition/loader ;
- capability handshake web→MODARYX Forge avec CTA désactivé sans capacité réelle ;
- Safe Profile affiché comme capacité indisponible ;
- validation par plateforme ;
- Crossplay explicitement non prouvé.

Toujours PREUVE MANQUANTE :
- compatibilité réelle ;
- provider APIs ;
- sync serveur/save ;
- crossplay réel ;
- Safe Profile réellement exécuté ;
- MODARYX Forge runtime ;
- backend/données production ;
- validation humaine/appareils.

**Prochain axe interne : fermer les derniers détails de modèle encore non matérialisés (Alternative/AnyOf, Supported, Minimum accepté, états de fraîcheur), puis réévaluer s'il reste du travail interne honnête avant le gate externe.**


## Fermeture du modèle spécialisé Living Threshold — 4 octobre 2026

**TERMINÉ pour le prototype exploratoire / aucun runtime réel validé**

Run :
- `37165177246` — **SUCCESS**
- commit capturé : `8ecd8a139eac084348c503a65d0289d7fb30fdba`
- artifact : `11289616195`
- digest : `sha256:e3e680c741d79e2bb91dc94bc5b5817ea873182c9422b8dd5e71b476a4c33c76`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 57`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Derniers détails du modèle spécialisé maintenant matérialisés :
- `Supported` ;
- `Alternative / AnyOf` ;
- politique `Minimum accepté` ;
- fraîcheur `Current / Aging / Stale / Unknown`.

État :
- modèle prototype pour dépendances/compatibilité/version/source : **TERMINÉ pour l'exploration** ;
- providers, données, preuves de compatibilité, sync, installation, validation plateforme et runtime réel : **PREUVE MANQUANTE** ;
- root/frontend V2 production : toujours **BLOQUÉ par gate de validation**.

Le prochain travail doit être choisi uniquement parmi les gaps internes réellement récupérables restants ; ne pas ajouter des fonctionnalités décoratives simplement pour faire monter le pourcentage.


## Décision canonique de nomenclature desktop — 4 octobre 2026

**TERMINÉ — nouvelle nomenclature active**

Noms produits actifs :
- **MODARYX Forge** = logiciel / écosystème desktop ;
- **MODARYX Public** = édition publique ;
- **MODARYX Founder** = édition Founder.

Décision :
- **`Nova Forge OS` est un nom produit retiré** ;
- ne plus utiliser `Nova Forge OS` comme nom actif dans l'UI, la documentation produit, les nouveaux contrats ou les nouvelles capacités ;
- les anciennes occurrences `Nova Forge` / `Nova Forge OS` peuvent subsister uniquement comme **legacy technique, provenance historique, identifiant de dépôt/branche ou compatibilité**, tant qu'elles sont clairement classifiées ;
- aucun remplacement global aveugle des identifiants techniques historiques ;
- le site reste **MODARYX / MODARYX MODS** ;
- le desktop reste **MODARYX Forge**, avec ses éditions **MODARYX Public** et **MODARYX Founder**.

Le contrat Web → desktop de référence est :
`docs/MODARYX-V2-FORGE-HANDOFF-CONTRACT-20261004.md`

Cette décision remplace toute ancienne mention présentant `Nova Forge OS` comme nom produit courant.


## Audit interne final + handoff Web → MODARYX Forge — 4 octobre 2026

**TERMINÉ pour le travail interne récupérable avant gate externe**

Nomenclature active confirmée :
- **MODARYX Forge** = logiciel / écosystème desktop ;
- **MODARYX Public** = édition publique ;
- **MODARYX Founder** = édition Founder ;
- `Nova Forge OS` = nom produit retiré, legacy/provenance uniquement si nécessaire.

Contrat Web → desktop :
- `docs/MODARYX-V2-FORGE-HANDOFF-CONTRACT-20261004.md`
- contrat web : **TERMINÉ**
- capability handshake conceptuel : **TERMINÉ**
- runtime / transport / protocole / receipt réel : **PREUVE MANQUANTE**

Anti-oubli :
- QA prototype archivable : **57 captures**
- benchmark général : **TERMINÉ pour le corpus actuel / intégré**
- benchmark spécialisé : **TERMINÉ pour le corpus actuel / intégré**
- modèle dépendances/compatibilité/version/source : **TERMINÉ pour l'exploration**
- aucune nouvelle fonctionnalité décorative ne doit être ajoutée seulement pour faire monter un pourcentage.

Aucun autre gap interne honnêtement récupérable n'a été identifié sans inventer :
- backend ;
- provider/connecteur ;
- runtime MODARYX Forge ;
- preuve humaine ;
- appareil/screen-reader ;
- preuve production.

Reste réellement bloquant avant root/frontend V2 production :
1. validation humaine multi-écrans supplémentaire ;
2. validation mobile humaine réelle ;
3. référence visuelle approuvée archivable + comparaison normalisée ;
4. screen reader réel ;
5. Safari/appareils physiques ;
6. données/backend/providers réels selon surface ;
7. décision canonique levant le gate de création du root V2.

**Décision : maintenir PR #162 en draft, ne pas toucher à main/public/DNS/Cloudflare critique, et reprendre automatiquement dès qu'un de ces gates reçoit une preuve réelle ou une reclassification explicite.**
