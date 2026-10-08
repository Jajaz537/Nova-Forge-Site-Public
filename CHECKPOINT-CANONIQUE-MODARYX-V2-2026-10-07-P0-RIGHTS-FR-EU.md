# CHECKPOINT-CANONIQUE — MODARYX V2 — RIGHTS / PRIVACY / FR-EU — 2026-10-07

**Statut global : EN COURS — P0 commercial/legal renforcé**
**Base Git vérifiée avant tranche :** `685d7fd321c06489cf8cce9adcfbcc777beb9b7c`
**Branche produit cible :** `design/modaryx-v2-blue-violet-product-20261005`

Aucun changement `main`, DNS/DNSSEC/nameservers, D1 production, R2 production, provider production, paiement ou cutover.

## 1. Gates séparées

- VF TECHNIQUE : **EN COURS** — non validée ni modifiée par cette tranche.
- LAUNCH-READINESS COMMERCIALE : **EN COURS**.
- LEGAL / COMPLIANCE : **EN COURS / BLOQUÉ pour lancement France-UE tant que les preuves et décisions manquantes ne sont pas fermées**.

Une gate verte ne valide jamais automatiquement les autres.

## 2. Assets / provenance

Inventaire exhaustif lié à l'arbre Git source :
- **23 PRODUCT**
- **5 LEGACY**
- **4 PREVIEW**
- **78 PROOF**
- total : **110**

Registre :
`docs/MODARYX-V2-ASSET-RIGHTS-REGISTER-20261007.json`

**PREUVE MANQUANTE** pour provenance et droits commerciaux des assets produit actuels, notamment :
- marque MODARYX ;
- living-world ;
- living-threshold.

Les preuves QA/review sont à préserver. Leur statut de preuve ne constitue pas une autorisation de réutilisation commerciale des contenus qu'elles reproduisent.

Aucun asset avec provenance manquante ne peut justifier un PASS commercial/legal final.

## 3. THIRD-PARTY / OSS

- inventaire npm : **115 packages** ;
- registre exhaustif package/version/licence déclarée ajouté ;
- NOTICE candidat ajouté ;
- textes de licence upstream et scan du bundle final : **PREUVE MANQUANTE** ;
- `caniuse-lite@1.0.30001803` est déclaré `CC-BY-4.0` dans le lockfile : attribution/redistribution à vérifier sur la release réelle.

Registres :
- `docs/MODARYX-V2-THIRD-PARTY-REGISTRY-CANDIDATE-20261007.json`
- `docs/MODARYX-V2-THIRD-PARTY-NOTICES-CANDIDATE-20261007.md`

## 4. Privacy

Un registre table/champ dérivé des migrations 0001→0015 est ajouté :
`docs/MODARYX-V2-PRIVACY-TABLE-FIELD-REGISTER-CANDIDATE-20261007.json`

Il contient **37 tables / 463 champs recensés**.

Toujours **PREUVE MANQUANTE / LEGAL_REVIEW_REQUIRED** :
- responsable de traitement ;
- finalités et bases finales ;
- durées ;
- accès/rôles ;
- DPA/transferts ;
- suppression/export ;
- process d'exercice des droits ;
- CMP réelle si nécessaire ;
- implémentation RUM production et éventuelle exemption.

## 5. France / UE

Matrice actualisée :
`docs/MODARYX-V2-FR-EU-COMPLIANCE-READINESS-20261007.md`

Elle couvre sans faux PASS :
- informations précontractuelles France ;
- rétractation pour contenu numérique ;
- conformité/remèdes numériques ;
- privacy/cookies ;
- DSA selon rôle réel ;
- accessibilité e-commerce ;
- TVA/OSS et changements ViDA 2027 à anticiper.

Toujours à qualifier/valider :
- vendeur/opérateur ;
- rôle DSA exact ;
- applicabilité réglementaire accessibilité au modèle réel ;
- fiscalité/facturation ;
- CGU/CGV/privacy notice finales.

## 6. Pricing / paiements / coûts

Aucun prix canonique. Aucun provider choisi. Aucun checkout production.

Stimuli de recherche conservés, non canoniques :
- 4,99 €
- 6,99 €
- 8,99 € / mois

Frais officiels revus le 2026-10-07 :
- Stripe France : 1,5 % + 0,25 € cartes standard EEE, frais de litige à intégrer ;
- Paddle : 5 % + 0,50 USD Checkout, Merchant of Record ;
- Lemon Squeezy : 5 % + 0,50 USD base, Merchant of Record, frais additionnels possibles.

Le modèle de coûts doit encore intégrer taxes, refunds, chargebacks, payouts, infra, support, modération, droits, fraude, CAC, churn et coûts juridiques/comptables.

Document :
`docs/MODARYX-V2-COST-PRICING-PAYMENT-REFRESH-20261007.md`

## 7. Architecture / séparation

- MODARYX / MODARYX MODS = plateforme web actuelle.
- MODARYX OS Public / Fondateur = famille OS.
- Nova Forge = legacy uniquement ; aucune migration aveugle.
- L'écosystème jeu+site 18+ reste totalement séparé : aucun contenu/promotion/branding/funnel adulte dans MODARYX et aucun partage supposé de comptes, auth, paiements, données ou analytics.

## 8. Prochain travail logique

1. rechercher les preuves de création/licence des **23 assets PRODUCT** ;
2. générer le bundle final candidat et identifier les composants réellement redistribués avant THIRD-PARTY final ;
3. récupérer/conserver les textes LICENSE/NOTICE upstream exacts des versions distribuées ;
4. proposer des durées de conservation par finalité avec justification, puis revue juridique ;
5. qualifier vendeur/opérateur et rôle DSA avant textes finaux ;
6. qualifier l'applicabilité accessibilité et TVA/OSS selon le modèle réel ;
7. mesurer les coûts d'un pilote avant toute décision de prix ;
8. préparer CGU/CGV/privacy notice uniquement après fixation des faits vendeur/provider/territoires.

**Ce checkpoint supersède les checkpoints commerciaux/juridiques antérieurs pour les éléments qu'il précise.**


---

## 10. Mise à jour provenance — 2026-10-07

Après remontée de l'historique Git :

**PARTIAL_EVIDENCE récupérée**
- marque SVG MODARYX : historique vectoriel in-repo retrouvé ;
- hero Loup/Dragon + portails : archive source utilisateur documentée, SHA-256 `c7592976adc53de0d5fb6f98bc1454c73d741bd0215fcd1398e047ececfb6532` ;
- vista réduite : dérivation depuis panorama approuvé documentée ;
- Living Threshold : workflow d'assets générés spécifiquement et source visuelle locale documentés.

**Toujours PREUVE MANQUANTE**
- droits commerciaux/licences des sources ci-dessus ;
- auteur/générateur/conditions exactes quand ils ne sont pas établis ;
- environnement + 10 couches de croissance wolf/dragon : commits d'introduction et hashes retrouvés, mais aucune provenance/licence explicite récupérée.

Référence :
`docs/MODARYX-V2-ASSET-PROVENANCE-EVIDENCE-20261007.md`.

Aucun `finalReleaseAllowed` n'a été passé à `true`.


---

## 11. Mise à jour privacy / rétention — 2026-10-07

Calendrier candidat ajouté :
`docs/MODARYX-V2-RETENTION-SCHEDULE-CANDIDATE-20261007.md`.

Cadres de référence intégrés sans configuration production :
- auth transaction : purge rapide après expiration, durée exacte **PREUVE MANQUANTE** ;
- sessions : jusqu'à expiration/révocation, secrets invalidés dès révocation ;
- logs sécurité standard : **6 à 12 mois candidat** selon nature/justification ;
- profils/comptes : pendant le besoin de service, traitement post-clôture à justifier séparément ;
- UGC/modération : durée finale dépend du rôle réel, des CGU et du DSA applicable ;
- prospection si activée : cadre CNIL de **3 ans** selon relation client/prospect ;
- mémorisation du choix cookies si CMP nécessaire : **6 mois candidat** ;
- mesure d'audience exemptée de consentement : **13 mois traceur / 25 mois données maximum uniquement si toutes les conditions CNIL sont réellement satisfaites** ;
- pièces comptables françaises : **10 ans uniquement lorsque l'obligation s'applique effectivement au vendeur/document**.

Aucune de ces durées ne devient automatiquement une valeur production.

Toujours **PREUVE MANQUANTE / LEGAL_REVIEW_REQUIRED** :
- responsable de traitement ;
- finalités finales ;
- rôle DSA ;
- provider RUM/CMP ;
- vendeur et modèle de facturation ;
- sauvegardes/purge production ;
- process suppression/export.


---

## 12. Mise à jour pricing research / DSA / launch facts — 2026-10-07

Nouveaux artefacts :
- `docs/MODARYX-V2-PRICING-RESEARCH-INSTRUMENT-20261007.md`
- `docs/MODARYX-V2-DSA-ROLE-QUALIFICATION-WORKSHEET-20261007.md`
- `docs/MODARYX-V2-FR-EU-LAUNCH-FACTS-REGISTER-20261007.md`

### Pricing
Le protocole est désormais transformé en questionnaire/interview guide exécutable :
- gratuit testé comme vrai produit ;
- Premium testé par valeur fonctionnelle ;
- prix 4,99 / 6,99 / 8,99 €/mois uniquement comme stimuli ;
- premier test prix monadique/randomisé ;
- aucune carte, réservation ou fausse commande ;
- segment créateurs séparé.

**Exécution terrain : PREUVE MANQUANTE.**

### DSA
La qualification finale n'est pas forcée.
Le worksheet distingue :
- stockage à la demande ;
- diffusion publique ;
- hosting/online platform à qualifier selon fonctions réellement activées ;
- marketplace non prouvée et non canonique ;
- vente propre MODARYX distincte d'une marketplace tiers.

**Qualification finale : LEGAL_REVIEW_REQUIRED.**

### Launch facts France/UE
Registre centralisé créé pour les faits manquants avant documents finaux :
- opérateur/vendeur ;
- territoires ;
- langues ;
- offre/prix ;
- paiement/TVA ;
- privacy/providers ;
- cookies ;
- DSA/UGC ;
- accessibilité ;
- rights/licenses ;
- support/refunds.

Aucun champ manquant n'a été inventé.
Les CGU/CGV/privacy notice/mentions légales finales restent BLOQUÉES tant que les faits structurants ne sont pas fournis et validés.


---

## 13. Vérification finale sources officielles + Projet — 2026-10-07

### France — rétractation interface en ligne

Vérification officielle effectuée le 2026-10-07 :
- article L221-5 en vigueur depuis le 19/06/2026 ;
- article L221-21 en vigueur depuis le 19/06/2026 ;
- article D221-5 créé par décret n°2026-3 du 5 janvier 2026.

Point ajouté à la gate checkout :
lorsque le droit de rétractation existe pour un contrat conclu à distance via une interface en ligne, une fonctionnalité gratuite d'exercice du droit doit être prévue, visible, directement et facilement accessible, selon les modalités applicables.

Le lien L221-5 erroné de la première matrice a été corrigé vers l'article officiel courant.

### Sources officielles revérifiées

- Stripe France : 1,5 % + 0,25 € cartes standard EEE ; 2,8 % + 0,25 € premium EEE ; litiges 20 € ; réfutation manuelle 20 € remboursée si gagnée selon tarification publiée.
- Paddle : 5 % + 0,50 USD par Checkout, Merchant of Record.
- Lemon Squeezy : 5 % + 0,50 USD base ; frais additionnels possibles, notamment international, PayPal et abonnement.
- CNIL : durées par finalité, logs standard 6–12 mois, prospection 3 ans selon cas, choix cookies 6 mois comme bonne pratique.
- DGCCRF : obligations accessibilité depuis 28/06/2025 pour catégories concernées ; exemption microentreprise de services à qualifier, jamais à présumer.
- Commission UE : guides OSS révisés le 24/07/2026 pour changements ViDA entrant notamment en vigueur le 01/01/2027.

### Sources visuelles Projet

Cross-check ajouté :
`docs/MODARYX-V2-PROJECT-VISUAL-SOURCE-CROSSCHECK-20261007.md`.

Résultat :
- références historiques MODARYX/loup+dragon retrouvées ;
- hashes/dimensions conservés ;
- aucune identité exacte avec les assets Git actuels n'est affirmée sans preuve ;
- droits commerciaux restent **PREUVE MANQUANTE** ;
- `finalReleaseAllowed` reste `false`.

### État après cette tranche

- commercial : **EN COURS**
- legal/compliance France-UE : **BLOQUÉ / PREUVE MANQUANTE** sur faits vendeur/provider/territoires/rights
- prix canonique : **aucun**
- paiement : **aucun activé**
- production : **aucun changement**


---

## 14. Handoff Work — bundle / SBOM / THIRD-PARTY — 2026-10-07 18:45 CEST

HEAD GitHub revérifié avant écriture :
`design/modaryx-v2-blue-violet-product-20261005` @ `f2ebe61655954d39b6230112f890b8bbc0f0ec9a`.

Le prochain bloc de preuve exige désormais un environnement d'exécution propre capable de lancer le build V2. Runbook ajouté :
`docs/MODARYX-V2-WORK-BUNDLE-SBOM-HANDOFF-20261007.md`.

**À exécuter dans Work / environnement équivalent :**
- `npm ci` puis `npm run build` dans `v2/`, sans déploiement ;
- manifeste SHA-256 complet de `v2/dist` ;
- SBOM + distinction dépendances réellement redistribuées / build-only / inconnues ;
- collecte des LICENSE/NOTICE exacts ;
- poursuite de la recherche de provenance des assets PRODUCT.

**Toujours interdit / non décidé :**
- production, DNS, paiement, cutover ;
- prix canonique ;
- fausse clearance de droits ;
- passage automatique d'une gate à PASS.

État après handoff :
- VF TECHNIQUE : **EN COURS**
- COMMERCIAL : **EN COURS**
- LEGAL/COMPLIANCE France-UE : **BLOQUÉ / PREUVE MANQUANTE** sur les faits externes et droits non fermés.


---

## 15. Exécution CI bundle / SBOM / licences — 2026-10-07

La contrainte d'absence de chat local a été contournée par une CI GitHub isolée, sans production et sans utiliser de runner self-hosted.

Baseline produit :
`175533c149a9bdfd7e4eccd2d4983327d0d0f201`.

Preuves :
- build/SBOM run `37656319907` @ `0b28efb076744e9cd34bfd47a936a720e1b7dba0` : **success** ;
- micro-preuve licences run `37657179187` @ `f8763c2a4db27916d3ddeac7cd703851fe15a5a0` : **success** ;
- les deltas depuis la baseline sont uniquement les workflows de preuve.

Résultats :
- `npm ci` : **TERMINÉ**
- `npm run build` : **TERMINÉ**
- `npm run test:sites` : **TERMINÉ**
- `v2/dist` : **15 fichiers**
- SBOM CycloneDX 1.5 : **66 composants**
- packages installés : **66** sur **115** chemins package du lockfile multi-plateforme
- classification : **4 BUNDLED_OR_RUNTIME / 59 BUILD_ONLY / 3 UNKNOWN**
- textes LICENSE/NOTICE locaux : **62/66**
- `caniuse-lite@1.0.30001803` : CC-BY-4.0, **BUILD_ONLY** par classification de rôle, LICENSE hashé.

Bundle visuel réellement redistribué :
- **5 assets PRODUCT**
- les cinq restent `finalReleaseAllowed=false`
- droits commerciaux : **PREUVE MANQUANTE**
- aucune promotion en release finale autorisée par cette preuve.

Références :
- `docs/MODARYX-V2-CI-BUNDLE-SBOM-EVIDENCE-20261007.md`
- `docs/MODARYX-V2-CI-BUNDLE-SBOM-EVIDENCE-20261007.json`

État des gates :
- VF TECHNIQUE : **EN COURS** — cette micro-preuve ferme le build/bundle/SBOM ciblé, pas la VF entière ;
- LAUNCH-READINESS COMMERCIALE : **EN COURS** ;
- LEGAL/COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE** notamment sur les droits des assets réellement redistribués, vendeur/provider/territoires et validations externes.

Aucun prix canonique, aucun paiement, aucun DNS, aucun déploiement, aucun cutover.


---

## 16. Preuve renforcée module → bundle — 2026-10-07

Un travail parallèle a d'abord intégré la preuve bundle/SBOM via PR #242. Cette tranche ne l'a pas écrasé ; elle ajoute uniquement une attribution plus forte des modules réellement empaquetés.

Preuve :
- baseline produit : `175533c149a9bdfd7e4eccd2d4983327d0d0f201`
- run module attribution : `37657712033`
- execution SHA : `47b3e26014c84c3f4506a074d1f6327c5ed3fd87`
- Vite : 6.4.2
- conclusion : **success**

Résultat :
- packages npm dans les chunks client : **4**
- `@phosphor-icons/react`, `react`, `react-dom`, `scheduler`
- licences : MIT
- `caniuse-lite@1.0.30001803` : **absent des chunks client / BUILD_ONLY pour ce candidat**
- worker serveur : **aucun import npm tiers**

Le mapping npm module→bundle candidat est désormais **TERMINÉ**.

Toujours **BLOQUÉ / PREUVE MANQUANTE** :
- droits commerciaux des 5 assets PRODUCT réellement présents dans `v2/dist` ;
- faits vendeur/provider/territoires ;
- validation juridique/fiscale finale ;
- release SHA finale et THIRD-PARTY final associé à cette release.

Gates :
- VF TECHNIQUE : **EN COURS** — le registre interne conserve 19 blockers ouverts ;
- LAUNCH-READINESS COMMERCIALE : **EN COURS** ;
- LEGAL/COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**.

Aucun déploiement, DNS, paiement, provider ou cutover.


---

## 17. THIRD-PARTY bundle candidate exact — 2026-10-07

À partir de la preuve exacte `chunk.modules`, un NOTICE candidat limité aux composants npm réellement observés dans les chunks a été créé :
`docs/MODARYX-V2-THIRD-PARTY-NOTICES-BUNDLE-CANDIDATE-20261007.md`.

Contenu :
- `@phosphor-icons/react@2.1.10` — MIT — texte exact + copyright Phosphor Icons ;
- `react@19.2.0` — MIT ;
- `react-dom@19.2.0` — MIT ;
- `scheduler@0.27.0` — MIT ;
- texte exact Meta partagé pour ces trois packages.

`caniuse-lite@1.0.30001803` :
- CC-BY-4.0 conservé dans la preuve build-time ;
- absent des chunks client ;
- non inclus dans le NOTICE redistribué candidat.

État :
- NOTICE npm du **bundle candidat actuel** : **TERMINÉ**
- THIRD-PARTY final de release : **EN COURS** jusqu'au SHA final et au packaging final
- droits des 5 assets PRODUCT redistribués : **BLOQUÉ / PREUVE MANQUANTE**

Aucun changement production/paiement/DNS/cutover.


---

## 18. Provenance variantes raster MODARYX — 2026-10-07

Chaîne Git directe récupérée pour les assets de marque réellement présents dans le bundle candidat :

1. `14142306a9d160fc2ebc01486167853bc27dcdf2` modifie le SVG pour rendre le « M » explicite ;
2. `2ae5bd279bd3437d74424801ff428e40bc61504c` est son **enfant direct** ;
3. ce second commit ne modifie que `modaryx-mark-192.png` et `modaryx-mark-512.png`, avec le message `refresh MODARYX PNG marks with clear M`.

Conséquence :
- SVG : **PARTIAL_EVIDENCE** déjà conservé ;
- PNG 192/512 et leurs copies V2 : **PARTIAL_EVIDENCE** désormais ;
- outil de rasterisation : **PREUVE MANQUANTE** ;
- droits de marque/commerciaux : **PREUVE MANQUANTE** ;
- `finalReleaseAllowed=false`.

Sur les 5 visuels réellement redistribués par le bundle candidat, les 3 assets de marque ont donc une chaîne de provenance interne partielle. Les deux Living Threshold gardent leur preuve partielle de génération spécifique au prototype, avec outil/modèle/conditions exactes encore manquants.

Gates inchangées :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Aucun changement main, DNS, paiement, production ou cutover.


---

## 19. Clôture tranche CI / SBOM / provenance — 2026-10-07

HEAD canonique revérifié avant cette clôture :
`design/modaryx-v2-blue-violet-product-20261005` @ `f4c5f49bcfa0f3289866e62766d281fbf76d0264`.

### Build / bundle / SBOM

Les preuves canoniques intégrées dans les sections précédentes restent prioritaires :
- build V2 candidat : **TERMINÉ**
- micro-tests Sites : **TERMINÉ**
- bundle `v2/dist` : **15 fichiers**
- SBOM CycloneDX candidat : **66 composants**
- attribution module → bundle : **TERMINÉ pour le candidat courant**
- tiers client effectivement attribués : `@phosphor-icons/react`, `react`, `react-dom`, `scheduler`, tous déclarés MIT
- `caniuse-lite@1.0.30001803` : **BUILD_ONLY** pour ce candidat, non attribué aux chunks client.

Erreur ciblée rencontrée pendant une lane auxiliaire :
- collecteur initial : `packageCount=0` car certaines entrées lockfile v3 n'exposent pas `name`
- correction : dérivation du nom depuis le chemin `node_modules/`
- micro-proof corrigé : **TERMINÉ**
- cette classification auxiliaire plus faible ne remplace pas la preuve module→bundle canonique déjà intégrée.

### Assets réellement redistribués

Cinq visuels produit sont présents dans le bundle candidat.

**Marque MODARYX — PARTIAL_EVIDENCE**
- `modaryx-mark.svg`
- `modaryx-mark-192.png`
- `modaryx-mark-512.png`

Chaîne Git directe fermée :
- SVG « M » : `14142306a9d160fc2ebc01486167853bc27dcdf2`
- PNG refresh : `2ae5bd279bd3437d74424801ff428e40bc61504c`
- le second commit est l'enfant direct du premier et ne modifie que les deux PNG.

**Living Threshold — PARTIAL_EVIDENCE**
- `living-threshold-hero.png`
- `living-threshold-content-sheet.png`

Le commit d'introduction `33405e93bae60ccfc4b84362f3102c578d100ab9` documente :
- assets générés spécifiquement pour le prototype ;
- aucun asset V1/legacy ;
- source visual truth locale `C:\Users\steph\.codex\generated_images\01a1033a-47d2-7910-92b8-05aa89cfb208\exec-197fd322-f242-4a81-a337-91f52572641b.png` ;
- dimensions source : **1488 × 1058**.

Recherche Projet/Bibliothèque : le binaire source exact n'a pas été retrouvé.

Donc, pour les deux Living Threshold :
- source/génération dédiée : **PARTIAL_EVIDENCE**
- binaire source original : **PREUVE MANQUANTE**
- outil/modèle exact et conditions de génération : **PREUVE MANQUANTE**
- droits commerciaux : **PREUVE MANQUANTE**

Pour les cinq visuels :
`finalReleaseAllowed=false`.

### Intégrations gouvernance

- PR #241 : handoff bundle/SBOM
- PR #244 : THIRD-PARTY exact du bundle candidat
- PR #245 : provenance raster de la marque

Aucun changement `main`, DNS/DNSSEC/nameservers, Cloudflare critique, D1/R2 production, paiement, provider production ou cutover.

### Gates après tranche

- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE France-UE : **BLOQUÉ / PREUVE MANQUANTE**

Blockers principaux restants :
- droits commerciaux/propriété intellectuelle des visuels ;
- faits vendeur/opérateur/territoires ;
- choix provider/paiement et fiscalité lorsque l'utilisateur décidera d'avancer ;
- validation juridique appropriée ;
- terrain pricing réel.

Aucun prix canonique et aucun paiement activé.


---

## 20. Handoff Work / opérateur — 19 blockers externes VF — 2026-10-07

HEAD canonique revérifié avant handoff :
`design/modaryx-v2-blue-violet-product-20261005` @ `d88a416313a02d4b976ef9d6e0843489f8930998`.

Runbook consolidé ajouté :
`docs/MODARYX-V2-WORK-EXTERNAL-VF-HANDOFF-20261007.md`.

Le ledger reste :
- status : `ACTIVE_FAIL_CLOSED_19_OPEN`
- blockers : **19**
- blockers fermables sans changement externe : **0**
- `automationCanCloseWithoutExternalChange=false` pour **19/19**.

Répartition :
- 5 blockers appareil réel / accessibilité ;
- 8 blockers production contrôlée ;
- 6 blockers droits / juridique.

Le handoff sépare explicitement :
1. sessions appareils réels ;
2. production contrôlée une unité à la fois et uniquement après approbation explicite ;
3. droits/licences/revue juridique avec preuves réelles.

Aucun blocker n'est fermé par ce document.

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Aucun `main`, DNS/DNSSEC/nameserver, Cloudflare critique, D1/R2 production, paiement/provider, PWA production, field CWV, indexability ou cutover modifié.


---

## 21. Refresh lecture seule des sources officielles droits/contact — 2026-10-08

Une revalidation fraîche des sources officielles du catalogue de démonstration a été effectuée sans outbound.

Preuves ajoutées :
- `docs/MODARYX-V2-RIGHTS-OFFICIAL-SOURCE-REFRESH-20261008.md`
- `docs/MODARYX-V2-RIGHTS-OFFICIAL-SOURCE-REFRESH-20261008.json`

Périmètre :
- Skyrim Special Edition — Bethesda / ZeniMax
- Cyberpunk 2077 — CD PROJEKT RED
- Minecraft — Mojang / Microsoft

Résultat :
- Bethesda : règles officielles de portage + monétisation + contact général toujours disponibles ; destination licensing exacte MODARYX : **PREUVE MANQUANTE**
- CD PROJEKT RED : Fan Content Guidelines + User Agreement + contact juridique officiel confirmés ; scope MODARYX : **PARTIAL_EVIDENCE**
- Minecraft : Usage Guidelines + formulaire officiel de partenariat confirmés ; autorisation MODARYX : **PREUVE MANQUANTE**

Aucune politique publique n'est transformée en licence.

Blockers droits :
- `official-contact-discovery` : **EN COURS**
- `publisher-outbound` : **BLOQUÉ**
- `publisher-response-parsing` : **BLOQUÉ**
- `license-validation` : **BLOQUÉ**
- `legal-review-where-required` : **PREUVE MANQUANTE**
- `game-rights-registry-production` : **BLOQUÉ**

Le ledger VF reste fail-closed ; aucun des 19 blockers externes n'est fermé par cette tranche.

Aucun outbound, production, D1/R2, provider, paiement, DNS ou cutover exécuté.


---

## 22. Référence marché pricing — 2026-10-08

Références officielles adjacentes revues en lecture seule :
- CurseForge Premium : **$2.99/mois**, **$30/an**
- Modrinth Plus : **$4.99/mois**, réduction annuelle affichée **16 %**
- Nexus Mods Premium : valeur Premium confirmée, présentation tarifaire variable selon page/région
- Overwolf : subscriptions app-specific, non utilisées comme benchmark tarifaire direct.

Documents :
- `docs/MODARYX-V2-MARKET-PRICING-REFERENCE-20261008.md`
- `docs/MODARYX-V2-MARKET-PRICING-REFERENCE-20261008.json`

Conséquences :
- stimuli `4,99 / 6,99 / 8,99 € / mois` maintenus **uniquement pour recherche**
- `4,99 €` reste une hypothèse crédible à tester, pas une décision
- `6,99 / 8,99 €` exigent une valeur récurrente plus forte
- aucun ralentissement/bridage artificiel du gratuit pour fabriquer un upsell
- sécurité/accessibilité/provenance/privacy/récupération essentielle restent baseline.

**Prix canonique : PREUVE MANQUANTE.**
**Paiement/provider : PREUVE MANQUANTE.**
**Willingness-to-pay terrain : PREUVE MANQUANTE.**

La gate commerciale reste **EN COURS**.


---

## 23. Enveloppe de coûts Cloudflare — 2026-10-08

Modèle de sensibilité ajouté :
- `docs/MODARYX-V2-CLOUDFLARE-COST-ENVELOPE-20261008.md`
- `docs/MODARYX-V2-CLOUDFLARE-COST-ENVELOPE-20261008.json`

Tarifs officiels retenus pour la modélisation :
- Workers Paid : minimum **$5/mois**, 10 M requêtes + 30 M CPU-ms inclus
- D1 Paid : 25 Md rows read + 50 M rows written + 5 GB inclus
- R2 Standard : 10 GB + 1 M Class A + 10 M Class B inclus, egress Internet à **$0**
- Pages Free : **$0** affiché pour l'offre statique.

Scénarios purement hypothétiques :
- Workers à 5 ms CPU moyen : 5 M req → **$5.00**, 25 M → **$11.40**, 100 M → **$41.40**
- R2 : 100 GB / faible ops → **$1.35**, 1 TB / 10 M A / 100 M B → **$88.11**, 10 TB / 50 M A / 500 M B → **$550.35**
- D1 write-heavy illustratif : 100 Md reads / 200 M writes / 20 GB → **$236.25**

Ces montants ne sont **pas des prévisions ni un budget canonique**.

Toujours exclus :
- paiement/taxes
- support/modération/fraude
- providers email/push/auth
- observabilité additionnelle
- droits/licences
- juridique/comptabilité
- CAC et coûts humains.

**Budget infra canonique : PREUVE MANQUANTE.**
**Mesures de production réelles : PREUVE MANQUANTE.**
La gate commerciale reste **EN COURS**.


---

## 24. Sensibilité unit economics paiement — 2026-10-08

Documents :
- `docs/MODARYX-V2-UNIT-ECONOMICS-SENSITIVITY-20261008.md`
- `docs/MODARYX-V2-UNIT-ECONOMICS-SENSITIVITY-20261008.json`

Stripe France standard EEE, paiement réussi :
- 4,99 € → frais ≈ **0,325 €** → payment-net ≈ **4,665 €**
- 6,99 € → frais ≈ **0,355 €** → payment-net ≈ **6,635 €**
- 8,99 € → frais ≈ **0,385 €** → payment-net ≈ **8,605 €**

Ces valeurs excluent explicitement TVA/taxes, refunds, chargebacks, FX, support, modération, fraude, droits, juridique, infrastructure et CAC.

Paddle :
- headline officiel : **5 % + $0.50**
- comparaison directe EUR non effectuée car Merchant of Record et base/coûts opérationnels différents.

Lemon Squeezy :
- base : **5 % + $0.50**
- frais additionnels documentés possibles : international, PayPal, abonnement, payout.

Conclusion :
- aucun « net paiement » n'est assimilé à un bénéfice ;
- aucun prix/provider n'est choisi ;
- choix final à faire sur total cost of ownership + faits vendeur/territoires/fiscalité/refunds.

**Prix canonique : PREUVE MANQUANTE.**
**Provider : PREUVE MANQUANTE.**
**Conversion/refunds/chargebacks terrain : PREUVE MANQUANTE.**

Gate commerciale : **EN COURS**.


---

## 25. Modèle KPI de viabilité commerciale — 2026-10-08

Documents :
- `docs/MODARYX-V2-COMMERCIAL-VIABILITY-KPI-MODEL-20261008.md`
- `docs/MODARYX-V2-COMMERCIAL-VIABILITY-KPI-MODEL-20261008.json`

But :
relier les travaux pricing/coûts/paiement déjà prouvés à un contrat de mesure terrain avant toute décision de prix.

Le modèle définit sans activer de collecte :
- acquisition / CAC ;
- activation ;
- rétention D1/D7/D30 ;
- conversion Premium ;
- churn ;
- ARPPU ;
- refunds / chargebacks ;
- support / modération ;
- infra / MAU ;
- contribution avant/après acquisition ;
- LTV nette uniquement quand les cohortes sont suffisamment stables.

Règles :
- activation ≠ simple création de compte ;
- dénominateur de conversion toujours explicite ;
- payment-net ≠ bénéfice ;
- aucune ligne de coût manquante ne devient zéro par défaut ;
- gratuit réellement utile à préserver ;
- sécurité/accessibilité/provenance essentielle non paywallées ;
- aucune collecte/analytics activée par cette tranche ;
- privacy by design + minimisation + consentement lorsque requis.

État :
- contrat de mesure : **TERMINÉ**
- activation finale canonique : **EN COURS**
- données terrain activation/rétention/conversion/churn : **PREUVE MANQUANTE**
- support/modération/CAC/LTV réels : **PREUVE MANQUANTE**
- prix canonique : **PREUVE MANQUANTE**
- provider paiement : **PREUVE MANQUANTE**

Gate commerciale : **EN COURS**.

Aucun analytics, paiement, provider production, DNS, D1/R2 production ou cutover activé.


---

## 26. Processus droits utilisateur / données — 2026-10-08

Documents :
- `docs/MODARYX-V2-DATA-SUBJECT-RIGHTS-PROCESS-CANDIDATE-20261008.md`
- `docs/MODARYX-V2-DATA-SUBJECT-RIGHTS-PROCESS-CANDIDATE-20261008.json`

Le contrat prépare :
- accès ;
- rectification ;
- effacement ;
- portabilité/export ;
- opposition ;
- limitation ;
- retrait du consentement ;
- fermeture de compte ;
- information sur traitements ;
- contestation de décision automatisée si applicable.

Principes :
- vérification d’identité proportionnée ;
- pas de hard-delete global ;
- export sans secrets ni données d’autres utilisateurs ;
- propagation aux providers réels seulement ;
- aucune simulation de provider ;
- délais/base juridique/exceptions finales : **LEGAL_REVIEW_REQUIRED** ;
- privacy by design et minimisation.

État :
- contrat de processus : **TERMINÉ**
- implémentation backend : **PREUVE MANQUANTE**
- canal public : **PREUVE MANQUANTE**
- règles table→droit : **LEGAL_REVIEW_REQUIRED**
- délais finaux : **LEGAL_REVIEW_REQUIRED**
- test end-to-end : **PREUVE MANQUANTE**

Aucune suppression production, provider, collecte ou texte juridique final activé.


---

## 27. Inventaire statique cookies / storage / traceurs — 2026-10-08

Documents :
- `docs/MODARYX-V2-COOKIE-STORAGE-TRACKER-STATIC-INVENTORY-20261008.md`
- `docs/MODARYX-V2-COOKIE-STORAGE-TRACKER-STATIC-INVENTORY-20261008.json`

Périmètre :
client V2 + backend privacy-relevant au HEAD `c331966fb7e01c7b2b340f4c411160f98db5da77`.

Observé :
- cookie session first-party `modaryx_session`, `HttpOnly; Secure; SameSite=Lax`, TTL code 15 min→7 j, défaut 8 h ;
- localStorage fonctionnel pour favoris, recherches, brouillons, collections, préférences + reçu de migration legacy ;
- Cache Storage PWA `modaryx-v2-candidate-shell-v1`, gate production OFF par défaut ;
- CWV/RUM first-party doublement gated, OFF par défaut, respecte DNT/GPC, credentials omit ;
- Turnstile conditionnel uniquement quand auth + remote writes + site key sont prêts ;
- Auth0 configurable, production non prouvée ;
- météo server-side optionnelle, mode par défaut OFF, aucun GPS navigateur.

Non observé dans le périmètre statique revu :
- sessionStorage ;
- IndexedDB ;
- écriture client `document.cookie` ;
- Google Analytics / gtag ;
- SDK publicitaire ;
- pixel marketing.

Limite :
preuve statique seulement ; scan bundle final + observation réseau/cookies runtime production candidate restent **PREUVE MANQUANTE**.

État privacy/cookies : **EN COURS / LEGAL_REVIEW_REQUIRED**.
Aucun CMP, analytics, PWA production, Auth0 production, météo provider ou autre service n'a été activé.


---

## 28. Registre processors/subprocessors + procédure incident/breach — 2026-10-08

Documents ajoutés :
- `docs/MODARYX-V2-PROCESSOR-SUBPROCESSOR-REGISTER-CANDIDATE-20261008.md`
- `docs/MODARYX-V2-PROCESSOR-SUBPROCESSOR-REGISTER-CANDIDATE-20261008.json`
- `docs/MODARYX-V2-DATA-BREACH-INCIDENT-PROCESS-CANDIDATE-20261008.md`
- `docs/MODARYX-V2-DATA-BREACH-INCIDENT-PROCESS-CANDIDATE-20261008.json`

### Sous-traitance / providers

Le registre couvre sans activation :
- Cloudflare Pages / Workers / D1 ;
- R2 ;
- Turnstile ;
- Auth0 ;
- email ;
- Web Push ;
- météo ;
- paiement / Merchant of Record candidats.

Aucun rôle juridique n'est supposé automatiquement. Pour chaque provider réel restent **PREUVE MANQUANTE** :
- qualification de rôle ;
- DPA/clauses applicables ;
- subprocessors ;
- localisation/transferts ;
- rétention/suppression ;
- sécurité contractuelle ;
- notification incident/breach ;
- adéquation configuration production ↔ contrat.

Aucun provider n'est sélectionné ni activé par cette tranche.

### Incident / violation de données

Procédure candidate préparée :
détection → containment → qualification → décision privacy/juridique → notification si requise → récupération → postmortem.

Références officielles revues :
- CNIL sous-traitance / sécurité de la sous-traitance ;
- CNIL violations de données / notification ;
- RGPD articles 28 et 33.

La règle des 72 h, l'évaluation du risque et l'information des personnes sont enregistrées comme cadre à appliquer **lorsque les conditions juridiques sont remplies** ; l'applicabilité finale reste **PREUVE MANQUANTE** et nécessite validation appropriée.

Avant lancement restent notamment **PREUVE MANQUANTE** :
- responsable de traitement/opérateur ;
- point de contact privacy/DPO ou équivalent ;
- propriétaires/escalade incidents ;
- clauses providers ;
- procédure autorité adaptée au territoire ;
- template utilisateur ;
- exercice tabletop end-to-end.

### Gates

- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Aucun des 19 blockers VF externes n'est fermé.
Aucun provider, analytics, paiement, DNS, D1/R2 production, PWA production ou cutover activé.


---

## 29. Contrat CMP / consentement cookies et traceurs — candidat — 2026-10-08

Documents :
- `docs/MODARYX-V2-COOKIE-CONSENT-CMP-CANDIDATE-20261008.md`
- `docs/MODARYX-V2-COOKIE-CONSENT-CMP-CANDIDATE-20261008.json`

Le contrat distingue explicitement :
- moteur de consentement Guide/OS historique ;
- consentement cookies/traceurs privacy actuel.

Principes enregistrés :
- refus aussi simple qu'acceptation ;
- retrait simple et accessible ;
- aucun traceur non nécessaire soumis à consentement avant choix valide ;
- aucune case précochée non nécessaire ;
- aucun dark pattern / cookie wall artificiel ;
- aucune dégradation artificielle du gratuit après refus ;
- exemption audience jamais supposée sans preuve de configuration finale réelle.

Mapping candidat :
- session first-party : catégorie nécessaire candidate, qualification finale **PREUVE MANQUANTE** ;
- localStorage fonctionnel : classification à faire item par item ;
- PWA Cache Storage : gate production OFF ;
- CWV/RUM : analytics candidat, OFF par défaut, exemption **PREUVE MANQUANTE** ;
- Turnstile : sécurité/anti-abus conditionnel, qualification **PREUVE MANQUANTE**.

Avant lancement restent **PREUVE MANQUANTE** :
- opérateur réel ;
- inventaire runtime final ;
- classification finale par storage/traceur ;
- analyse exemption ;
- stockage/durée/renouvellement du reçu ;
- texte cookies/privacy ;
- observation réseau/cookies du candidat final ;
- accessibilité réelle du CMP ;
- validation juridique appropriée.

Aucun CMP, analytics, marketing ou provider n'est activé.

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Les 19 blockers VF externes restent ouverts.


---

## 30. Privacy notice candidate — 2026-10-08

Documents :
- `docs/MODARYX-V2-PRIVACY-NOTICE-CANDIDATE-20261008.md`
- `docs/MODARYX-V2-PRIVACY-NOTICE-CANDIDATE-20261008.json`

La structure candidate couvre :
- responsable/opérateur ;
- catégories de données ;
- finalités / bases ;
- obligatoire/facultatif ;
- destinataires/providers ;
- rétention ;
- cookies/storage/traceurs ;
- droits ;
- transferts ;
- sécurité/incidents ;
- décisions automatisées/profilage ;
- réclamation ;
- changements de notice.

Références officielles revues :
- CNIL — information des personnes ;
- RGPD articles 12, 13 et 14.

Règle fail-closed :
`finalPublicationAllowed=false` tant qu'un champ obligatoire reste **PREUVE MANQUANTE**.

Toujours **PREUVE MANQUANTE** notamment :
- identité du responsable/opérateur ;
- contact privacy/DPO éventuel ;
- finalités et bases finales ;
- caractère obligatoire/facultatif par fonction ;
- destinataires/providers finaux ;
- rétention finale ;
- transferts ;
- canal droits ;
- décision automatisée/profiling final ;
- cookies/traceurs finaux ;
- validation juridique appropriée.

Le document impose aussi un contrat d'accessibilité pour la future notice :
langage clair, headings sémantiques, clavier/lecteur d'écran, zoom/reflow et lien stable depuis le footer/formulaires pertinents.

Aucun texte juridique final, provider, collecte ou CMP n'est activé.

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Les 19 blockers VF externes restent ouverts.


---

## 31. Surfaces légales publiques France/UE — readiness candidat — 2026-10-08

Documents :
- `docs/MODARYX-V2-PUBLIC-LEGAL-SURFACES-READINESS-20261008.md`
- `docs/MODARYX-V2-PUBLIC-LEGAL-SURFACES-READINESS-20261008.json`

Modules préparés sans publication finale :
- mentions légales ;
- CGU / règles d'utilisation ;
- CGV / vente consommateur ;
- rétractation / remboursement ;
- accessibilité du commerce électronique.

Références officielles revues :
- Ministère de l'Économie / DGCCRF — mentions obligatoires, informations précontractuelles, CGV, rétractation ;
- Commission européenne / Your Europe — Consumer Rights Directive et contrats numériques ;
- DGCCRF / Commission européenne — European Accessibility Act.

Points fail-closed :
- aucune identité vendeur/opérateur inventée ;
- aucun prix/offre/provider de paiement rendu canonique ;
- aucune exception au droit de rétractation supposée ;
- services numériques et contenus numériques distingués ;
- aucune exemption accessibilité supposée sans faits réels et revue appropriée ;
- aucun texte légal final publiable tant que les faits obligatoires manquent.

État :
- mentions légales : **PREUVE MANQUANTE**
- CGU : **EN COURS**
- CGV : **BLOQUÉ**
- rétractation/refund : **PREUVE MANQUANTE**
- conformité/accessibilité réglementaire : **EN COURS / PREUVE MANQUANTE**
- revue juridique : **PREUVE MANQUANTE**

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Aucune production, vente, paiement, DNS ou cutover activé.


---

## 32. Operational readiness candidat — support / fraude / résilience / exploitation — 2026-10-08

Documents :
- `docs/MODARYX-V2-OPERATIONAL-READINESS-CANDIDATE-20261008.md`
- `docs/MODARYX-V2-OPERATIONAL-READINESS-CANDIDATE-20261008.json`

Modules préparés :
- support utilisateur ;
- fraude/abus ;
- exploitation de la modération ;
- backup/restore/rollback ;
- monitoring/observability ;
- incident response ;
- release operations.

Règles :
- aucun canal support fictif ;
- aucun SLA fictif ;
- aucun backup déclaré sans restore testé ;
- monitoring ≠ analytics marketing ;
- aucun cutover sans autorisation explicite ;
- aucune astreinte/staffing inventé.

Toujours **PREUVE MANQUANTE** :
- canal support public réel ;
- ownership support ;
- ownership fraude/abus ;
- staffing modération ;
- backup/restore production testé ;
- rollback production testé ;
- monitoring production ;
- escalade incident ;
- release owner.

Aucun des 19 blockers externes VF n'est fermé.

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**

Aucune production, provider, paiement, DNS ou cutover activé.


---

## 33. Protocole pilote lancement / go-no-go — 2026-10-08

Documents :
- `docs/MODARYX-V2-LAUNCH-PILOT-GO-NO-GO-PROTOCOL-20261008.md`
- `docs/MODARYX-V2-LAUNCH-PILOT-GO-NO-GO-PROTOCOL-20261008.json`

Le protocole relie :
problème/valeur → recherche pricing → pilote gratuit utile → acquisition → éventuel pilote commercial → décision go/no-go.

Règles :
- activation ≠ création de compte ;
- intention de payer ≠ conversion ;
- signup count ≠ preuve de valeur ;
- payment-net ≠ bénéfice ;
- aucun seuil arbitraire canonisé ;
- aucune acquisition payante avant attribution/privacy/coûts crédibles ;
- aucun pilote commercial tant que vendeur/territoires/taxes/paiement/refunds/droits/legal/production ne sont pas prêts ;
- aucune dégradation artificielle du gratuit.

Toujours **PREUVE MANQUANTE** :
- valeur gratuite terrain ;
- activation/rétention ;
- valeur Premium récurrente ;
- willingness-to-pay terrain ;
- coûts réels ;
- CAC ;
- conversion/churn ;
- capacité opérationnelle ;
- readiness commerciale/légale ;
- décision propriétaire.

Aucun prix, paiement ou lancement n'est rendu canonique.

Gate commerciale : **EN COURS**.


---

## 34. TVA/facturation, médiation et résiliation — readiness candidat — 2026-10-08

Documents :
- `docs/MODARYX-V2-TAX-INVOICING-MEDIATION-CANCELLATION-READINESS-20261008.md`
- `docs/MODARYX-V2-TAX-INVOICING-MEDIATION-CANCELLATION-READINESS-20261008.json`

Axes préparés :
- TVA / OSS ;
- facturation / reçus ;
- médiation de la consommation ;
- résiliation électronique ;
- séparation rétractation vs résiliation.

Références officielles revues :
- impots.gouv.fr — OSS/IOSS ;
- Commission européenne / Your Europe — VAT One Stop Shop ;
- DGCCRF — médiation consommation ;
- Entreprendre.Service-Public / DGCCRF — résiliation électronique.

Règles :
- aucun régime TVA canonique sans vendeur/offre/territoires ;
- aucun médiateur fictif ;
- aucun abonnement supposé ;
- aucun flow de résiliation présenté comme final avant qualification du contrat ;
- rétractation et résiliation restent juridiquement/produit distinctes.

Toujours **PREUVE MANQUANTE** :
- vendeur/établissement/statut TVA ;
- territoires ;
- modèle fiscal ;
- OSS ;
- facturation/reçus ;
- médiateur ;
- applicabilité résiliation ;
- validation comptable/fiscale ;
- validation juridique.

Aucun prix, abonnement, provider, paiement, taxe, facture, médiateur ou production activé.

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**


---

## 35. Matrice de readiness internationale — 2026-10-08

Documents :
- `docs/MODARYX-V2-INTERNATIONAL-TERRITORY-READINESS-20261008.md`
- `docs/MODARYX-V2-INTERNATIONAL-TERRITORY-READINESS-20261008.json`

Règle enregistrée :
**accessible sur Internet ≠ prêt légalement/commercialement partout**.

Priorité :
1. France
2. UE/EEE
3. Royaume-Uni
4. États-Unis / États ciblés
5. Canada / provinces ciblées
6. Australie
7. autres marchés uniquement après décision explicite

État :
- France : **EN COURS**
- UE/EEE : **EN COURS**
- Royaume-Uni : **PREUVE MANQUANTE**
- États-Unis : **PREUVE MANQUANTE**
- Canada : **PREUVE MANQUANTE**
- Australie : **PREUVE MANQUANTE**
- autres : **BLOQUÉ jusqu'à ciblage explicite**

Aucun marketing ciblé ni vente payante hors marchés approuvés ne doit être supposé.
La décision de territoires, éventuelles limitations/geoblocking et revue locale restent **PREUVE MANQUANTE**.

Aucun territoire n'est ajouté au lancement par cette tranche.


---

## 36. Paquet décisions propriétaire / professionnels — 2026-10-08

Documents :
- `docs/MODARYX-V2-OWNER-PROFESSIONAL-DECISION-PACKET-20261008.md`
- `docs/MODARYX-V2-OWNER-PROFESSIONAL-DECISION-PACKET-20261008.json`

Le paquet centralise sans les prendre :
- opérateur/vendeur ;
- territoires jour 1 ;
- audience/âge ;
- baseline gratuite ;
- Premium / achat ponctuel / abonnement ;
- services créateurs ;
- marketplace/commission ;
- PSP vs MoR ;
- prix canonique ;
- refunds/rétractation ;
- privacy controller/DPO ;
- providers/processors ;
- analytics/CWV ;
- DSA role ;
- accessibilité réglementaire ;
- droits commerciaux/IP/marque ;
- support/modération/fraude/release owner ;
- autorisations production ;
- go/no-go/cutover.

Revues professionnelles explicitement séparées :
- juridique France/UE ;
- fiscalité/comptabilité ;
- droits/IP.

Règle :
ce paquet demande des décisions, il ne les rend pas canoniques.
Aucun prix, abonnement, commission, fournisseur, territoire ou production n'est activé.

État global :
- décisions propriétaire : **EN COURS / PREUVE MANQUANTE**
- revues professionnelles : **PREUVE MANQUANTE**
- production/cutover : **BLOQUÉ** jusqu'aux gates pertinentes.

Gates :
- VF TECHNIQUE : **EN COURS**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**


---

## 37. Séparation stricte avec l'écosystème 18+ — 2026-10-08

Documents :
- `docs/MODARYX-ADULT-ECOSYSTEM-SEPARATION-CONTRACT-20261008.md`
- `docs/MODARYX-ADULT-ECOSYSTEM-SEPARATION-CONTRACT-20261008.json`

Règle d'architecture :
l'éventuel jeu 18+ + son site 18+ forment un écosystème distinct de MODARYX et MODARYX OS.

Interdictions côté MODARYX :
- aucun contenu 18+ ;
- aucune promotion/funnel vers l'écosystème adulte ;
- aucun branding adulte ;
- aucun compte/auth partagé supposé ;
- aucun paiement/entitlement partagé supposé ;
- aucune donnée/analytics partagé par défaut.

Toute évolution future exige :
- décision produit explicite ;
- revue sécurité ;
- revue privacy/data-flow ;
- revue juridique/compliance ;
- revue âge/audience/consommateur ;
- mise à jour threat model/checkpoint.

Observation statique courante :
aucune référence évidente trouvée avec les recherches ciblées `18+`, `adult`, `adulte`, `NSFW`.
Cette observation ne remplace pas un audit de release.

État :
- contrat de séparation : **TERMINÉ**
- audit surface distribuée : **PREUVE MANQUANTE**
- audit auth/compte croisé : **PREUVE MANQUANTE**
- audit paiement/entitlement croisé : **PREUVE MANQUANTE**
- audit data/analytics croisé : **PREUVE MANQUANTE**

Valeur par défaut : **NO_SHARING**.
