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

`c755ffb9d7c0b4298e0f23bcc7e6337f515ae54d`

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

**TERMINÉ — passe experte, validation humaine toujours manquante**

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

**TERMINÉ — protocole prêt / PREUVE MANQUANTE pour exécution**

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

## 24. Wireframes encore manquants

**TERMINÉ — conception low-fi textuelle / BLOQUÉ pour matérialisation visuelle Figma**

- Desktop Game Hub — blueprint détaillé TERMINÉ
- Desktop Global Search — blueprint détaillé TERMINÉ
- Desktop Community — blueprint détaillé TERMINÉ
- Mobile Game Hub — blueprint détaillé TERMINÉ

Blueprints textuels :

`docs/MODARYX-V2-MISSING-WIREFRAME-BLUEPRINTS-20261003.md`

Revue de couverture :

`docs/MODARYX-V2-WIREFRAME-COVERAGE-20261003.md`

## 25. High‑Fi

**BLOQUÉ**

Interdiction d'ouvrir la direction artistique finale tant que :

- couverture wireframe core incomplète ;
- tree testing humain non exécuté ;
- quota Figma bloque les écrans manquants.

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
- Profils de jeu : trouvabilité insuffisante depuis Bibliothèque seule ;
- Collection : terme non spontané, besoin de microcopy ;
- conflits/prérequis : attente d'avertissement proactif avant action.

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
- Glossaire produit : **TERMINÉ — draft, PREUVE MANQUANTE pour validation humaine**
- Revue experte IA/terminologie : **TERMINÉ — passe experte**
- Script low-fi humain : **MIS À JOUR — 14 tâches, PREUVE MANQUANTE pour exécution**
- Kit validation humaine IA : **TERMINÉ — protocole prêt, PREUVE MANQUANTE pour exécution**
- Simulation experte multi-profils du tree test : **TERMINÉ — ne remplace pas une validation humaine**
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
- Wireframes core : **TERMINÉ pour conception textuelle + prototype low-fi local des 4 écrans / validation humaine PREUVE MANQUANTE**
- Écriture Figma supplémentaire : **BLOQUÉ EXTERNE**
- Tree testing humain : **EN COURS — P01 réel terminé / autres profils utiles pour consolider**
- Direction artistique : **BLOQUÉ**
- High-fi : **BLOQUÉ**
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
8. Tree testing humain : P01 réel terminé. Recherche indépendante interne 5×16 terminée. Attendre/comparer le rapport Work, puis confronter les convergences et divergences sans généraliser P01 ni les simulations IA.
9. Continuer vers la direction artistique exploratoire et le design system préparatoire ; ne déclarer aucun high-fi humainement validé sans preuve réelle.
10. Ne pas toucher au front public ni à `main` sans stratégie contrôlée.

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
