# MODARYX V2 — sensibilité unit economics paiement — 2026-10-08

**Statut : EN COURS — frais de paiement uniquement, aucun prix/provider canonique**

Ce document ne calcule **ni bénéfice ni marge nette**. Il isole seulement l'effet du rail de paiement sur les trois stimuli de recherche.

## Stripe France — carte standard EEE

Tarif officiel courant utilisé :
**1,5 % + 0,25 €** par paiement réussi.

| Stimulus | Frais paiement | Frais / prix | Net après paiement uniquement |
|---:|---:|---:|---:|
| 4,99 € | 0,325 € | 6,51 % | 4,665 € |
| 6,99 € | 0,355 € | 5,08 % | 6,635 € |
| 8,99 € | 0,385 € | 4,28 % | 8,605 € |

Le coût fixe de 0,25 € pèse proportionnellement davantage sur le prix bas.

**Exclus de ce net :**
- TVA/taxes ;
- remboursements ;
- litiges/chargebacks ;
- conversion de devise ;
- support ;
- modération ;
- fraude/abuse ;
- droits/licences ;
- juridique/comptabilité ;
- infrastructure ;
- CAC.

Le terme correct est donc **payment-net**, jamais « profit ».

## Paddle — Merchant of Record

Tarif officiel :
**5 % + $0.50 par Checkout transaction**.

Pas de conversion directe en euros ici :
- le fixe est coté en USD ;
- Paddle agit comme Merchant of Record ;
- le traitement fiscal/billing/fraude/chargebacks/buyer support n'est pas comparable à un simple PSP direct ;
- le contrat réel et la configuration doivent être examinés.

## Lemon Squeezy — Merchant of Record

Base officielle :
**5 % + $0.50**.

Frais additionnels actuellement documentés :
- +1,5 % transaction internationale hors US ;
- +1,5 % PayPal ;
- +0,5 % paiement d'abonnement ;
- frais de payout possibles selon région/méthode.

Leur exemple France montre aussi que la base peut inclure la TVA selon la configuration de prix, ce qui interdit une comparaison correcte par simple « 5 % vs 1,5 % ».

## Lecture produit

1. Un prix plus bas n'est pas « presque gratuit » à servir : les coûts fixes de transaction deviennent proportionnellement plus importants.
2. Un MoR plus cher en headline peut remplacer une partie d'une charge fiscale/opérationnelle que MODARYX devrait sinon assumer.
3. Le choix doit se faire sur **total cost of ownership**, pas le seul fee.
4. Aucun rail ne doit être sélectionné avant vendeur, territoires, politique de remboursement, fiscalité et checkout accessible.
5. Les trois stimuli `4,99 / 6,99 / 8,99 €` restent des instruments de recherche.

Preuve machine-readable :
`docs/MODARYX-V2-UNIT-ECONOMICS-SENSITIVITY-20261008.json`.

**Prix canonique : PREUVE MANQUANTE.**  
**Provider canonique : PREUVE MANQUANTE.**  
**Conversion/refunds/chargebacks terrain : PREUVE MANQUANTE.**
