# MODARYX V2 — TVA/facturation, médiation et résiliation — readiness candidat — 2026-10-08

**État : EN COURS / BLOQUÉ — vendeur, offre et territoires non définis**

## 1. TVA / OSS

Les sources fiscales France/UE confirment l'existence de mécanismes OSS pour certaines ventes/prestations B2C transfrontières dans l'UE.

Cela ne permet pas de décider aujourd'hui du régime MODARYX.

Avant toute vente réelle, il faut connaître :
- entité vendeuse ;
- pays d'établissement ;
- statut TVA ;
- nature exacte de l'offre ;
- client B2C/B2B ;
- localisation client pertinente ;
- territoires servis ;
- PSP direct ou Merchant of Record ;
- éventuels seuils/règles applicables au cas réel.

État :
- régime TVA : **PREUVE MANQUANTE**
- OSS : **PREUVE MANQUANTE**
- TVA destination/source : **PREUVE MANQUANTE**
- revue fiscale/comptable : **PREUVE MANQUANTE**

Ne jamais encoder une TVA « par défaut » comme règle fiscale finale.

## 2. Facturation / reçus

Le modèle final dépendra du vendeur, du rail de paiement et du régime fiscal.

À préparer :
- identité vendeur ;
- numérotation ;
- date ;
- produit/service ;
- montants HT/taxe/TTC selon cas ;
- traitement TVA ;
- devise ;
- refund/avoir ;
- responsabilités PSP/MoR ;
- conservation.

État : **PREUVE MANQUANTE**.

## 3. Médiation de la consommation

La DGCCRF indique que les professionnels concernés par des contrats avec des consommateurs doivent permettre un accès à un dispositif de médiation de la consommation et communiquer les informations utiles sur le médiateur désigné.

Pour MODARYX :
- médiateur compétent : **PREUVE MANQUANTE**
- adhésion/contrat : **PREUVE MANQUANTE**
- secteur exact : **PREUVE MANQUANTE**
- wording public : **PREUVE MANQUANTE**
- applicabilité finale : **LEGAL_REVIEW_REQUIRED**

Ne pas publier un nom de médiateur fictif.

## 4. Résiliation en ligne

Les sources françaises prévoient une résiliation électronique simplifiée pour les contrats relevant du dispositif lorsque le professionnel permet la conclusion électronique.

Si MODARYX lance un abonnement/contrat concerné, le flow candidat doit fournir :
1. entrée de résiliation facile, directe et non ambiguë ;
2. identification/confirmation du contrat ;
3. récapitulatif ;
4. notification finale claire ;
5. accusé de réception ;
6. information durable sur date/effets.

Interdits :
- cacher la résiliation ;
- imposer uniquement courrier/téléphone si le cadre impose la voie en ligne ;
- multiplications artificielles d'étapes ;
- culpabilisation/dark patterns.

Aucun abonnement n'est actuellement canonique.

## 5. Rétractation ≠ résiliation

Garder séparés :
- **rétractation** : droit lié notamment au contrat à distance et au délai légal applicable ;
- **résiliation** : fin du contrat selon ses règles/durée et les obligations de résiliation électronique applicables.

Ne pas utiliser une seule action/backend pour masquer ces différences si les conséquences juridiques sont distinctes.

## 6. Sources officielles revues le 2026-10-08

- impots.gouv.fr — guichet TVA OSS/IOSS ;
- Commission européenne / Your Europe — VAT One Stop Shop et TVA transfrontière ;
- DGCCRF — médiation de la consommation pour les professionnels ;
- Entreprendre.Service-Public / DGCCRF — résiliation électronique des contrats.

## 7. Gate

Toujours **PREUVE MANQUANTE** :
- vendeur ;
- établissement/statut TVA ;
- territoires ;
- modèle fiscal ;
- OSS ;
- facturation/reçus ;
- médiateur ;
- flow résiliation applicable ;
- validation comptable/fiscale ;
- validation juridique.

Aucun prix, abonnement, provider, paiement, taxe, facture, médiateur ou production n'est activé par ce document.
