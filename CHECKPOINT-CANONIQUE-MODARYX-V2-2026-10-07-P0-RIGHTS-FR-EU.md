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
