# MODARYX V2 — COST / PRICING / PAYMENT ASSUMPTIONS REFRESH — 2026-10-07

**Statut : EN COURS — recherche uniquement, aucun prix canonique, aucun paiement activé**

## 1. Prix de recherche existants

Les stimuli `4,99 € / 6,99 € / 8,99 € par mois` restent uniquement des valeurs de recherche.
Ils ne constituent ni un tarif ni une promesse de lancement.

Le cœur gratuit doit rester un vrai bon produit. Un Premium récurrent n'est justifié que par une valeur récurrente réelle et prouvée.

## 2. Rails de paiement — frais officiels revus

### Stripe France
- 1,5 % + 0,25 € pour cartes standard EEE ;
- 2,8 % + 0,25 € pour cartes premium EEE ;
- 20 € pour chaque litige reçu ;
- 20 € pour une réfutation manuelle, remboursés si le litige est gagné selon la tarification publiée.

### Paddle
- 5 % + 0,50 USD par transaction Checkout en pay-as-you-go ;
- Merchant of Record.

### Lemon Squeezy
- 5 % + 0,50 USD de base ;
- Merchant of Record ;
- frais additionnels documentés dans certains cas : international, PayPal, abonnement, payout.

## 3. Correction du modèle d'unit economics

Le modèle précédent reste utile pour comparer grossièrement PSP direct et MoR, mais il est incomplet tant qu'il n'intègre pas :
- TVA/taxes et facturation selon rail choisi ;
- refunds ;
- chargebacks et frais de litige ;
- payouts et conversion de devises ;
- infrastructure ;
- stockage/egress/opérations ;
- support ;
- modération ;
- droits/licences ;
- fraude ;
- CAC ;
- churn ;
- comptabilité et revue juridique/fiscale.

Le « net après frais de paiement » ne doit jamais être présenté comme bénéfice.

## 4. Données à mesurer avant prix

- activation ;
- rétention D7/D30 ;
- coût infra / MAU ;
- stockage et egress / créateur et / release ;
- tickets support / 1 000 MAU ;
- coût modération / 1 000 UGC ;
- conversion Premium ;
- churn Premium ;
- ARPPU ;
- refunds ;
- chargebacks ;
- CAC ;
- LTV net ;
- coût réel du rail de paiement ;
- coût réel de conformité et de support.

## 5. Critères de choix PSP vs MoR

Comparer le coût total, pas uniquement le pourcentage affiché :
- couverture France/UE puis autres territoires ciblés ;
- KYC/onboarding ;
- TVA/taxes ;
- factures ;
- refunds ;
- chargebacks/fraude ;
- payout/devises ;
- accessibilité du checkout ;
- DPA/privacy/transferts ;
- webhooks ;
- export/portabilité ;
- résiliation ;
- dépendance fournisseur ;
- coût opérationnel interne évité.

## 6. Gate

Aucune décision de prix, d'abonnement, de commission ou de fournisseur tant que :
- valeur récurrente non prouvée ;
- coûts réels non mesurés ;
- willingness-to-pay non testée ;
- modèle vendeur/fiscal non qualifié ;
- politique refunds/chargebacks non définie ;
- au moins un pilote n'a pas mesuré activation/rétention/coûts.

**État : EN COURS / PREUVE MANQUANTE.**
