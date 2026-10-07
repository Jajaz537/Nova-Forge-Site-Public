# MODARYX V2 — PAYMENT RAIL COMPARISON — CANDIDATE — 2026-10-07

**Statut : ANALYSE CANDIDATE — aucun compte/provider activé**

## 1. PSP direct — Stripe

Tarif France observé le 2026-10-07 :
- cartes standard EEE : **1,5 % + 0,25 €**.

Atouts :
- coût transactionnel de base plus faible ;
- contrôle checkout/intégration ;
- écosystème mature.

Charge restant à MODARYX :
- vendeur légal ;
- TVA/taxes selon configuration ;
- facturation ;
- conformité territoires ;
- remboursements/chargebacks ;
- maintenance intégration.

## 2. Merchant of Record — Paddle

Tarif pay-as-you-go observé :
- **5 % + 0,50 USD** par transaction Checkout.

Paddle se présente comme Merchant of Record et inclut notamment paiements, billing, taxes, fraude/chargebacks et buyer support dans son offre standard.

## 3. Merchant of Record — Lemon Squeezy

Tarif de base observé :
- **5 % + 0,50 USD** par transaction.

Lemon Squeezy se présente comme Merchant of Record et indique gérer la collecte/déclaration des taxes. Des frais supplémentaires peuvent s'appliquer selon le type de transaction, par exemple international, PayPal ou abonnement.

## 4. Décision P0

**AUCUN FOURNISSEUR RETENU.**

Pour un premier lancement international à petit volume, un MoR mérite priorité d'évaluation car il peut réduire fortement la charge opérationnelle fiscale.

À volume élevé, comparer le surcoût MoR au coût total réel d'une gestion PSP directe.

## 5. Critères de sélection

- France/UE supportés ;
- futurs UK/US/Canada/Australie ;
- produit accepté ;
- abonnement + achat ponctuel ;
- TVA/taxes ;
- factures ;
- remboursements ;
- chargebacks/fraude ;
- payouts ;
- devises ;
- KYC ;
- DPA/privacy ;
- accessibilité checkout ;
- webhooks ;
- export/portabilité ;
- résiliation ;
- coût total réel.

## 6. Blockers

Avant sélection :
- identité vendeur/opérateur ;
- modèle exact ;
- territoires de lancement ;
- qualification fiscale ;
- revue contractuelle ;
- architecture entitlement ;
- politique remboursement.

Aucune intégration production sans approbation explicite.

## 7. Sources officielles revues le 2026-10-07

- Stripe France Pricing
- Paddle Pricing + Master Services Agreement
- Lemon Squeezy Pricing + Fees

**État : COMPARAISON P0 TERMINÉE / CHOIX PREUVE MANQUANTE.**
