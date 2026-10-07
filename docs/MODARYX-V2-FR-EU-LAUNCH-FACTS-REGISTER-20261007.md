# MODARYX V2 — FRANCE / UE LAUNCH FACTS REGISTER — 2026-10-07

**Statut : EN COURS — registre de faits manquants, pas formulaire légal final**

Objectif : centraliser les faits qui doivent exister avant rédaction finale des mentions légales, CGU/CGV, privacy notice, politique de remboursement et paramétrage paiement.

Aucune valeur manquante n'est inventée.

## 1. Opérateur / vendeur

- raison sociale ou identité du professionnel : **PREUVE MANQUANTE**
- forme juridique : **PREUVE MANQUANTE**
- adresse professionnelle : **PREUVE MANQUANTE**
- pays d'établissement : **PREUVE MANQUANTE**
- SIREN/SIRET ou identifiant applicable : **PREUVE MANQUANTE**
- TVA intracommunautaire si applicable : **PREUVE MANQUANTE**
- registre/immatriculation si applicable : **PREUVE MANQUANTE**
- représentant légal : **PREUVE MANQUANTE**
- contact légal/support : **PREUVE MANQUANTE**
- directeur de publication si applicable : **PREUVE MANQUANTE**

**BLOQUE : mentions légales finales, CGV, fiscalité, contrats providers.**

## 2. Territoires de lancement

Priorité de travail :
1. France
2. UE/EEE
3. Royaume-Uni
4. États-Unis selon États
5. Canada
6. Australie
7. autres marchés après revue

Territoire commercial réellement ouvert au jour 1 : **DÉCISION PROPRIÉTAIRE MANQUANTE**.

Ne pas confondre accessibilité Internet et commercialisation juridiquement préparée.

## 3. Langues contractuelles / support

- langue(s) interface : français / autres à confirmer
- langue(s) CGU/CGV : **PREUVE MANQUANTE**
- langue(s) support : **PREUVE MANQUANTE**
- politique en cas de divergence de traduction : **LEGAL_REVIEW_REQUIRED**

## 4. Modèle économique

- gratuit : baseline réelle à préserver
- Premium utilisateur : candidat, valeur récurrente à prouver
- achat ponctuel : candidat à étudier
- services créateurs : à tester séparément
- commission marketplace : non retenue sans étude dédiée
- abonnement final : **NON DÉCIDÉ**
- prix final : **PREUVE MANQUANTE**

Les stimuli 4,99 / 6,99 / 8,99 €/mois restent exclusivement des valeurs de recherche.

## 5. Paiement

- PSP ou Merchant of Record : **NON CHOISI**
- compte marchand créé : **NON**
- paiement production : **NON**
- devises : **PREUVE MANQUANTE**
- moyens de paiement : **PREUVE MANQUANTE**
- facturation : **PREUVE MANQUANTE**
- gestion TVA : **PREUVE MANQUANTE**
- payout créateurs : non applicable tant qu'aucun modèle marketplace/créateur payé n'est décidé
- chargebacks/fraude : **PREUVE MANQUANTE**

Aucune intégration production avant décision explicite.

## 6. Offre / contrat consommateur

À fixer factuellement :
- caractéristiques essentielles du gratuit ;
- caractéristiques exactes du Premium ;
- durée/périodicité ;
- renouvellement éventuel ;
- résiliation ;
- fourniture immédiate ou différée ;
- compatibilité/prérequis ;
- mises à jour ;
- support ;
- disponibilité ;
- politique de remboursement ;
- conditions de rétractation ;
- fonctionnalité de rétractation en ligne conforme L221-21/D221-5 lorsque le droit existe ;
- garantie/remèdes numériques.

**BLOQUE : CGV finales et checkout.**

## 7. Privacy

- responsable de traitement : **PREUVE MANQUANTE**
- contact privacy/DPO si applicable : **PREUVE MANQUANTE**
- finalités finales : **EN COURS**
- bases juridiques finales : **LEGAL_REVIEW_REQUIRED**
- durées finales : **EN COURS / schedule candidat uniquement**
- Auth0 production : **À PROUVER**
- Cloudflare D1 production : **À PROUVER**
- R2 production : **NON PROUVÉ**
- email provider : **NON CHOISI**
- push provider : **NON CHOISI**
- analytics/RUM production : **NON FIGÉ**
- paiement provider : **NON CHOISI**
- transferts internationaux/DPA : **PREUVE MANQUANTE**
- procédure droits utilisateurs : **PREUVE MANQUANTE**
- breach/incident process : **PREUVE MANQUANTE**

## 8. Cookies / traceurs

- strictement nécessaires : à inventorier sur build production
- marketing : OFF par défaut
- publicité : OFF par défaut
- analytics tiers : non sélectionné
- CMP : uniquement si nécessaire, **NON CHOISIE**
- retrait du consentement : à implémenter si consentement utilisé
- preuve consentement/refus : à définir si applicable

Aucun traceur non nécessaire avant consentement lorsqu'il est requis.

## 9. UGC / DSA / modération

- rôle hosting/online platform : **LEGAL_REVIEW_REQUIRED**
- marketplace : **NON PROUVÉ / non canonique**
- audience/âge : **PREUVE MANQUANTE**
- règles UGC : **PREUVE MANQUANTE**
- notice-and-action final : **PREUVE MANQUANTE**
- appels/recours : architecture candidate, process final manquant
- transparence/reporting : dépend qualification
- propriété intellectuelle/mods : process final manquant

Référence :
`docs/MODARYX-V2-DSA-ROLE-QUALIFICATION-WORKSHEET-20261007.md`.

## 10. Accessibilité

Gate produit obligatoire indépendamment de l'exemption éventuelle :
- clavier
- lecteur d'écran
- contraste
- zoom/reflow
- reduced motion
- formulaires
- auth
- checkout

Applicabilité réglementaire exacte EAA au modèle/opérateur : **LEGAL_REVIEW_REQUIRED**.

## 11. Droits / licences

- 110 assets classifiés
- 23 PRODUCT
- 8 PRODUCT avec provenance interne partielle récupérée
- droits commerciaux validés : **0**
- npm : 115 packages inventoriés
- THIRD-PARTY final : **PREUVE MANQUANTE**
- droits jeux/éditeurs/mods : fail-closed par défaut
- marque MODARYX : clearance juridique **PREUVE MANQUANTE**

## 12. Support / opérations

À décider :
- horaires/canaux support ;
- SLA éventuel sans sur-promesse ;
- incident status ;
- politique abuse ;
- remboursement ;
- chargebacks ;
- sauvegarde/restauration ;
- continuité de service ;
- fin de service ;
- export utilisateur.

## 13. Preuves commerciales à obtenir

Avant prix canonique :
- entretiens 12–20 candidats ;
- questionnaire 150–300 réponses qualifiées ;
- pilote usage réel ;
- activation ;
- rétention D7/D30 ;
- coût / MAU ;
- coût modération/support ;
- conversion ;
- churn ;
- refunds/chargebacks ;
- CAC/LTV.

Ces tailles restent des objectifs de recherche, pas une garantie de représentativité.

## 14. Documents finaux bloqués

Ne pas finaliser avant faits suffisants :
- mentions légales
- CGU
- CGV
- privacy notice
- politique cookies
- politique remboursement
- politique créateurs/UGC
- politique modération
- DPA/subprocessor list
- checkout disclosures

## 15. Gate

Le lancement commercial France/UE reste **BLOQUÉ** tant que :
- opérateur/vendeur ;
- territoires ;
- offre/prix ;
- paiement/fiscalité ;
- privacy/providers ;
- DSA/UGC ;
- accessibilité ;
- droits/licences ;
- support/refunds

ne sont pas suffisamment définis et validés.

Ce registre sert précisément à éviter de transformer des hypothèses en mentions légales fictives.
