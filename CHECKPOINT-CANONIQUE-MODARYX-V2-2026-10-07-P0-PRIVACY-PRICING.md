# CHECKPOINT-CANONIQUE — MODARYX V2 — P0 PRIVACY / PRICING / PAYMENT — 2026-10-07

**Statut global : EN COURS — P0 commercial/legal renforcé**
**Base avant tranche :** `41cdb6b9c4d822922ee62d5ad8abee6644f674b0`

## 1. Nouveaux éléments TERMINÉS

- inventaire npm V2 : 115 packages résolus ; licences déclarées MIT/ISC/BSD-3-Clause/Apache-2.0/CC-BY-4.0 ;
- Data Processing Inventory fondé sur migrations 0001→0015 ;
- unit economics candidat ;
- matrice privacy / bases juridiques candidates ;
- protocole de validation pricing ;
- comparaison PSP direct vs Merchant of Record.

## 2. Commercial

**EN COURS**

Décisions produit de travail :
- cœur gratuit réellement utile ;
- Premium uniquement si valeur récurrente prouvée ;
- créateurs traités comme offre distincte ;
- aucun abonnement/commission canonique ;
- tests prix uniquement en recherche, sans vente.

Prix stimuli utilisateur :
- 4,99 / 6,99 / 8,99 €/mois.

Ces valeurs ne sont pas des prix de lancement.

## 3. Paiement

**PREUVE MANQUANTE / aucun provider choisi**

Baseline vérifiée le 2026-10-07 :
- Stripe France : 1,5 % + 0,25 € pour cartes standard EEE ;
- Paddle : 5 % + $0.50 Checkout, Merchant of Record ;
- Lemon Squeezy : 5 % + $0.50 base, Merchant of Record, frais additionnels possibles selon cas.

Aucune activation, aucun compte, aucun checkout production.

## 4. Privacy

**EN COURS / validation juridique PREUVE MANQUANTE**

Le schéma réel couvre :
- identité/profils ;
- auth/sessions ;
- UGC/modération ;
- créateurs/équipes ;
- notifications ;
- historique ;
- droits éditeurs ;
- RUM CWV candidat minimisé.

Restent obligatoires :
- responsable de traitement réel ;
- finalité/base légale finale ;
- durées ;
- DPA/transferts ;
- process droits utilisateur ;
- politique cookies/CMP si nécessaire ;
- privacy notice finale.

## 5. Juridique consommateur

**PREUVE MANQUANTE**

Avant vente France/UE :
- vendeur/opérateur ;
- CGU/CGV ;
- information précontractuelle ;
- rétractation numérique correctement gérée ;
- garanties/remèdes contenus/services numériques ;
- facturation/TVA ;
- accessibilité applicable ;
- DSA selon rôle réel de MODARYX.

## 6. Rights / licences

- npm lockfile inventory : TERMINÉ techniquement ;
- upstream notices / THIRD-PARTY final : PREUVE MANQUANTE ;
- assets : PREUVE MANQUANTE ;
- droits jeux/éditeurs production : BLOQUÉ tant que preuves externes manquent.

## 7. Production

Aucun changement :
- main ;
- DNS/DNSSEC/nameservers ;
- D1 production ;
- R2 production ;
- providers production ;
- paiement ;
- cutover.

## 8. Prochain travail logique

1. convertir Data Processing Inventory en registre champ→finalité→base→durée→droits ;
2. inventaire assets/provenance web ;
3. préparer THIRD-PARTY/NOTICE candidat ;
4. préparer questionnaire de pricing utilisable ;
5. qualifier opérateur/vendeur dès information disponible ;
6. produire brouillons juridiques uniquement après facts réels.

**Ce checkpoint supersède les checkpoints commerciaux/juridiques antérieurs pour les éléments qu'il précise.**
