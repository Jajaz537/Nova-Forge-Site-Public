# MODARYX V2 — UNIT ECONOMICS CANDIDATE — 2026-10-07

**Statut : MODÈLE DE RECHERCHE — aucun prix ni revenu canonique**

## 1. Objectif

Fournir un modèle simple pour décider plus tard si un Premium récurrent est viable.

## 2. Hypothèse centrale de calcul

Prix de recherche central : **6,99 €/mois**.
Ce prix n'est PAS un prix de lancement.

Comparaison paiement simplifiée :
- PSP direct type Stripe : 1,5 % + 0,25 € / transaction EEE standard observé ;
- Merchant of Record : 5 % + 0,50 / transaction comme ordre de grandeur Paddle/Lemon Squeezy.

Le calcul ci-dessous EXCLUT :
- TVA/taxes ;
- remboursements ;
- chargebacks ;
- infra ;
- support/modération ;
- droits/licences ;
- fraude ;
- acquisition ;
- churn.

Il s'agit donc de **net après frais de paiement seulement**, pas de bénéfice.

## 3. Scénarios

### 1 000 MAU, conversion 2 %
- payants : 20
- brut mensuel : 139,80 €
- après PSP direct indicatif : ~132,70 €
- après MoR indicatif : ~122,81 €

### 10 000 MAU, conversion 3 %
- payants : 300
- brut : 2 097,00 €
- après PSP direct : ~1 990,55 €
- après MoR : ~1 842,15 €

### 10 000 MAU, conversion 5 %
- payants : 500
- brut : 3 495,00 €
- après PSP direct : ~3 317,58 €
- après MoR : ~3 070,25 €

### 100 000 MAU, conversion 3 %
- payants : 3 000
- brut : 20 970,00 €
- après PSP direct : ~19 905,45 €
- après MoR : ~18 421,50 €

### 100 000 MAU, conversion 5 %
- payants : 5 000
- brut : 34 950,00 €
- après PSP direct : ~33 175,75 €
- après MoR : ~30 702,50 €

## 4. Lecture

Le différentiel MoR vs PSP direct devient important avec le volume, mais le MoR peut réduire fortement la charge opérationnelle de taxes/compliance.

Décision future = comparer :
**coût MoR supplémentaire**
versus
**coût réel comptable/fiscal/technique d'une gestion directe**.

## 5. Infrastructure

Les free tiers Cloudflare/Auth0 peuvent absorber un pilote de taille limitée selon le profil d'usage, mais ne doivent pas être modélisés comme coût zéro permanent.

Variables à mesurer en pilote :
- Functions requests / MAU
- D1 reads/writes / MAU
- R2 GB stockés / créateur
- R2 ops / téléchargement
- Auth0 MAU
- notifications / utilisateur
- coût support / 1000 MAU
- coût modération / 1000 UGC
- coût stockage par mod/release

## 6. KPI nécessaires avant prix final

- activation
- rétention D7/D30
- conversion Premium
- churn Premium
- ARPPU
- refund rate
- chargeback rate
- support tickets / 1k MAU
- infra / MAU
- storage / creator
- UGC moderation cost
- CAC par canal
- LTV net

## 7. Pricing research

Tester sans vente réelle au minimum :
- 4,99 €
- 6,99 €
- 8,99 €

Mesurer :
- compréhension de la valeur ;
- préférence ;
- intention crédible ;
- fonctions qui justifient le prix ;
- rejet de l'abonnement ;
- préférence annuelle/achat ponctuel.

Ne pas transformer un sondage en preuve de conversion réelle.

## 8. Gate

Aucun modèle Premium final tant que :
- coûts réels non mesurés ;
- valeur récurrente non prouvée ;
- willingness-to-pay non testée ;
- politique refunds/taxes non définie ;
- au moins un pilote utilisateur n'a pas mesuré activation/rétention.

État : **EN COURS / PREUVE MANQUANTE**.
