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
