# MODARYX V2 — modèle KPI de viabilité commerciale — 2026-10-08

**Statut : EN COURS — contrat de mesure, aucune collecte production activée, aucun seuil/prix canonique**

Ce document relie les travaux déjà terminés sur :
- proposition de valeur ;
- gratuit / Premium candidats ;
- pricing research ;
- coûts Cloudflare ;
- frais de paiement ;
- launch facts France/UE.

Il ne transforme aucune hypothèse en objectif de production et n’active aucun analytics.

## 1. Objectif

Avant toute décision de prix ou de lancement commercial, MODARYX doit pouvoir mesurer :

1. acquisition ;
2. activation ;
3. rétention ;
4. usage récurrent ;
5. conversion Premium ;
6. churn ;
7. refunds / chargebacks / fraude ;
8. support / modération ;
9. coût infrastructure / MAU ;
10. CAC ;
11. LTV nette ;
12. viabilité du gratuit et du Premium séparément.

## 2. Définitions canoniques de mesure

### Acquisition
- visiteurs qualifiés par canal ;
- coût par canal ;
- source non payée / payée ;
- campagne ou contenu d’origine si légalement et techniquement mesurable.

**CAC** = dépenses d’acquisition attribuables / nouveaux clients payants attribuables.

Ne pas calculer un CAC tant que dépenses + attribution ne sont pas suffisamment fiables.

### Activation
Une activation ne doit pas être « compte créé ».

Définition candidate à tester :
un utilisateur accomplit un premier workflow utile complet, par exemple :
- trouver un contenu pertinent ;
- comprendre compatibilité / dépendances / provenance ;
- l’ajouter à une collection/profil ;
- ou accomplir un workflow créateur utile.

La définition exacte doit être validée par usage réel avant de devenir canonique.

### Rétention
Mesures minimales :
- D1 ;
- D7 ;
- D30 ;
- rétention mensuelle par cohorte.

Toujours mesurer séparément :
- utilisateurs gratuits ;
- utilisateurs Premium ;
- créateurs actifs si l’offre créateur existe réellement.

### Conversion Premium
Deux dénominateurs doivent rester distincts :
- conversion sur MAU éligibles ;
- conversion sur utilisateurs activés/rétenus.

Ne jamais mélanger les deux dans les rapports.

### Churn Premium
- churn logo / comptes ;
- churn revenu si plusieurs offres existent ;
- churn volontaire / involontaire lorsque mesurable.

Ne pas calculer LTV par simple (ARPPU / churn) tant que les cohortes ne sont pas suffisamment stables.

### ARPPU
Revenu brut réellement encaissé / nombre de payeurs actifs sur la même période.

Ne pas confondre :
- revenu brut ;
- payment-net ;
- revenu après taxes ;
- contribution ;
- bénéfice.

## 3. Cascade économique minimale

À mesurer séparément :

`Gross Revenue`

moins :
- frais de paiement réels ;
- refunds ;
- chargebacks / litiges ;
- taxes assumées par MODARYX selon rail réel ;
- infra ;
- stockage / opérations ;
- auth / providers ;
- support ;
- modération ;
- fraude / abuse ;
- droits / licences ;
- comptabilité / juridique attribuables ;
- autres coûts variables prouvés.

Résultat intermédiaire :
**contribution avant acquisition**.

Puis retirer acquisition attribuable pour calculer une contribution après CAC.

Aucune de ces lignes ne peut être remplacée par zéro « par défaut ».

## 4. Formules de travail

Variables :

- `MAU` = utilisateurs actifs mensuels ;
- `A` = taux d’activation ;
- `R30` = rétention D30 de la cohorte activée ;
- `C` = conversion Premium sur le dénominateur explicitement choisi ;
- `P` = payeurs ;
- `ARPPU` = revenu brut moyen par payeur ;
- `PaymentFees` = frais de paiement réellement observés ;
- `Refunds`, `Chargebacks`, `Infra`, `Support`, `Moderation`, `Rights`, `Compliance`, `CAC` = coûts mesurés.

Exemples de calculs :

- utilisateurs activés = `MAU × A`
- retenus D30 = `Activated × R30`
- payeurs = `Denominator × C`
- revenu brut = `P × ARPPU`
- payment-net = `GrossRevenue - PaymentFees`
- contribution avant acquisition = payment-net - autres coûts variables mesurés
- contribution après acquisition = contribution avant acquisition - CAC attribuable

**Aucun ratio de marge n’est canonique tant que les coûts manquants ne sont pas mesurés.**

## 5. Support et modération

Mesures minimales :
- tickets / 1 000 MAU ;
- temps moyen de traitement ;
- réouvertures ;
- escalades ;
- tickets paiement/refund ;
- signalements UGC / 1 000 UGC ;
- temps modération / 1 000 UGC ;
- recours / appels ;
- incidents sécurité / abuse.

Coût support/modération =
volume réel × temps réel × coût de capacité réel.

Le coût horaire ou coût prestataire reste **PREUVE MANQUANTE** tant qu’il n’est pas factuel.

## 6. Fraude / refunds / chargebacks

Mesurer séparément :
- refund rate ;
- refund reason ;
- chargeback rate ;
- chargeback loss ;
- frais de litige ;
- fraude confirmée ;
- faux positifs anti-fraude ;
- coût opérationnel de revue.

Ne pas introduire de réserve arbitraire comme « coût réel ».

Une réserve de scénario peut exister dans un modèle interne, mais doit être explicitement étiquetée **HYPOTHÈSE**.

## 7. Valeur du gratuit

Le gratuit doit rester un produit utile.

Indicateurs :
- activation gratuite ;
- D7 / D30 gratuit ;
- workflows utiles complétés ;
- retour organique ;
- confiance / provenance comprise ;
- abandon lié aux limitations.

Une faible rétention gratuite n’est pas une justification pour dégrader davantage le gratuit.

## 8. Valeur Premium

Avant abonnement :
- fonctions Premium utilisées de façon récurrente ;
- rétention supérieure liée à une valeur réelle, pas à un lock-in ;
- raisons de paiement ;
- raisons de churn ;
- usage des fonctions avancées ;
- satisfaction ;
- préférence abonnement / achat ponctuel.

Ne pas paywaller sécurité, accessibilité, provenance essentielle, signalement ou récupération essentielle.

## 9. Funnel de recherche avant vente

Étapes autorisées avant vente réelle :

1. entretiens qualitatifs ;
2. questionnaire pricing ;
3. prototype / pilote gratuit ;
4. mesure d’usage réel non commercial ;
5. page d’intérêt clairement **non achetable** si utilisée ;
6. vente réelle seulement après gates technique + commerciale + légale.

Interdits :
- fausse commande ;
- faux stock ;
- faux compteur ;
- carte bancaire collectée pour un test non commercial ;
- dark pattern de rétention ou d’annulation.

## 10. Privacy by design

Aucune nouvelle collecte n’est activée par ce document.

Avant instrumentation :
- finalité ;
- minimisation ;
- base juridique ;
- durée ;
- accès ;
- sous-traitants ;
- suppression/export ;
- sécurité ;
- information utilisateur ;
- consentement si requis.

Préférer :
- agrégats ;
- événements strictement nécessaires à la mesure ;
- pseudonymisation ;
- données first-party ;
- aucune donnée sensible inutile.

Marketing/analytics non nécessaires restent OFF avant consentement lorsque requis.

## 11. Matrice de preuve

### TERMINÉ
- segments et proposition de valeur P0 ;
- gratuit / Premium candidats ;
- stimuli pricing 4,99 / 6,99 / 8,99 € ;
- protocole pricing ;
- références marché ;
- enveloppe coûts Cloudflare ;
- sensibilité frais de paiement.

### EN COURS
- définition finale d’activation ;
- architecture de mesure minimale ;
- modèle de contribution ;
- choix PSP vs MoR ;
- offre Premium exacte.

### PREUVE MANQUANTE
- activation terrain ;
- D7/D30 ;
- conversion ;
- churn ;
- refunds ;
- chargebacks ;
- support cost ;
- moderation cost ;
- CAC ;
- LTV nette ;
- coût providers réel ;
- taxes réelles ;
- droits/licences réels ;
- willingness-to-pay terrain.

## 12. Critères de décision

Aucun prix canonique ni lancement Premium avant :
- gratuit réellement utile prouvé ;
- activation/rétention réelles ;
- valeur Premium récurrente prouvée ;
- conversion/churn observés ou pilote crédible ;
- payment-net réel ;
- coûts support/modération/infra suffisamment mesurés ;
- refunds/chargebacks qualifiés ;
- CAC/LTV ou équivalent de viabilité mesuré ;
- seller/territories/taxes/provider définis ;
- droits/licences et legal readiness adaptés ;
- décision explicite propriétaire.

## 13. Liens avec les travaux existants

Références :
- `docs/MODARYX-V2-PRICING-VALIDATION-PROTOCOL-20261007.md`
- `docs/MODARYX-V2-PRICING-RESEARCH-INSTRUMENT-20261007.md`
- `docs/MODARYX-V2-UNIT-ECONOMICS-CANDIDATE-20261007.md`
- `docs/MODARYX-V2-UNIT-ECONOMICS-SENSITIVITY-20261008.md`
- `docs/MODARYX-V2-CLOUDFLARE-COST-ENVELOPE-20261008.md`
- `docs/MODARYX-V2-FR-EU-LAUNCH-FACTS-REGISTER-20261007.md`

**Gate commerciale : EN COURS.**
