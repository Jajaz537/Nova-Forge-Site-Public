# MODARYX V2 — DSA ROLE QUALIFICATION WORKSHEET — 2026-10-07

**Statut : LEGAL_REVIEW_REQUIRED / AUCUNE QUALIFICATION DSA FINALE**

Objectif : empêcher deux erreurs opposées :
- ignorer le DSA alors que MODARYX héberge/diffuse réellement du contenu tiers ;
- appliquer aveuglément toutes les obligations d'une marketplace ou d'une très grande plateforme sans que les faits le justifient.

## 1. Faits techniques candidats déjà visibles

Le modèle V2 prévoit notamment :
- profils/créateurs/équipes ;
- UGC : discussions, reviews, commentaires ;
- modération, décisions et appels ;
- content items/releases ;
- file artifacts ;
- collections/modpacks ;
- signalements/droits/licences ;
- recherche/indexation ;
- stockage D1 candidat ;
- R2 prévu mais production non prouvée.

Ces schémas montrent une **capacité prévue**, pas une preuve que tous ces services sont ouverts au public en production.

## 2. Questions de qualification à fermer

### A. Stockage à la demande d'un utilisateur
MODARYX conserve-t-il des informations fournies par un utilisateur/créateur ?

- production actuelle : **PREUVE MANQUANTE**
- si oui : examiner la qualification de service d'hébergement.

### B. Diffusion au public
Ces informations sont-elles diffusées au public à la demande de l'utilisateur ?

- produit prévu : candidat oui pour certaines publications ;
- production réelle : **PREUVE MANQUANTE**.

Si stockage + diffusion publique sont réellement opérés, examiner la qualification d'**online platform** au sens du DSA.

### C. Marketplace / contrats à distance avec traders
MODARYX permet-il à un consommateur de conclure avec un professionnel tiers un contrat de vente/service directement via la plateforme ?

- aujourd'hui : **NON PROUVÉ / aucun marketplace model canonique**.

Ne pas appliquer automatiquement les obligations spécifiques marketplace/trader traceability à une simple page créateur ou à une plateforme de mods gratuits.

### D. Vente propre MODARYX
Un abonnement MODARYX ou achat propre à MODARYX ne transforme pas automatiquement la plateforme en marketplace de vendeurs tiers.

Ce volet relève aussi du droit consommateur, paiement, TVA et contrats propres de MODARYX.

## 3. Capacités de conformité à préparer si rôle hosting/platform confirmé

Selon qualification finale et obligations applicables :
- point de contact et information légale ;
- mécanisme notice-and-action facile d'accès ;
- catégorie/motif du signalement ;
- accusé/référence de traitement ;
- décision motivée lorsque requise ;
- voie de contestation/recours lorsque requise ;
- journal de décision proportionné ;
- règles de modération publiées clairement ;
- mesures contre abus des mécanismes ;
- transparence/reporting selon catégorie de service ;
- coopération avec autorités lorsque légalement requise.

Le schéma actuel de `modaryx_moderation_receipts` et les tables rights/audit peuvent soutenir une partie de cette architecture, mais ne constituent pas une conformité DSA par eux-mêmes.

## 4. Notice-and-action — garde-fous produit

Le mécanisme ne doit pas devenir :
- un bouton de suppression automatique ;
- un canal de harcèlement contre les créateurs ;
- un substitut à une revue lorsque les faits sont contestables.

Prévoir :
- information suffisamment précise ;
- traçabilité ;
- priorité par gravité ;
- protection contre abus/spam ;
- distinction violation CGU / contenu potentiellement illicite / propriété intellectuelle ;
- escalade humaine adaptée ;
- recours.

## 5. Modération et explication

À concevoir :
- règle invoquée ;
- contenu/action concerné ;
- mesure prise ;
- durée si temporaire ;
- possibilité de recours si applicable ;
- historique de versions des règles ;
- preuve de notification.

Éviter les motifs opaques du type « décision de sécurité » sans détail lorsque la transparence est légalement requise et qu'aucune exception ne s'applique.

## 6. Propriété intellectuelle / mods

Les signalements de droits nécessitent une voie distincte ou une catégorisation claire :
- identité/autorité du déclarant à minimiser mais vérifier lorsque nécessaire ;
- œuvre/droit invoqué ;
- contenu visé ;
- base de la demande ;
- contre-notification/recours selon politique et droit applicable ;
- préservation de preuve proportionnée.

Le registre rights V2 ne doit jamais convertir une simple déclaration en autorisation ou violation prouvée.

## 7. Mineurs / safety

L'audience réelle, l'âge minimal et les éventuelles fonctions accessibles aux mineurs sont **PREUVE MANQUANTE**.

Avant lancement communautaire :
- définir audience/âge ;
- vérifier obligations renforcées applicables ;
- revoir privacy, recommandation, publicité et design selon le public réellement admis.

Aucune supposition n'est faite ici.

## 8. Seuils et exemptions

La taille de l'opérateur et du service peut modifier certaines obligations.
Ne pas présumer :
- statut micro/petite entreprise ;
- exemption ;
- statut VLOP/VLOSE ;
- nombre de destinataires actifs dans l'UE.

Mesurer et documenter uniquement lorsque le service réel existe.

## 9. Sources officielles à revoir au gate final

- Commission européenne — DSA notice-and-action mechanism :
  https://digital-strategy.ec.europa.eu/en/policies/dsa-notice-and-action-mechanism
- Commission européenne — DSA transparency / database guidance :
  https://digital-strategy.ec.europa.eu/en/faqs/dsa-transparency-database-questions-and-answers
- Règlement (UE) 2022/2065 — texte consolidé applicable au moment du lancement.

## 10. Décision gate

**EN COURS**
- architecture de modération/audit candidate ;
- inventaire des questions de rôle.

**PREUVE MANQUANTE**
- fonctionnalités réellement activées en production ;
- opérateur légal ;
- audience/âge ;
- nombre d'utilisateurs UE ;
- stockage/distribution R2 final ;
- marketplace ou absence de marketplace ;
- politique de modération finale.

**LEGAL_REVIEW_REQUIRED**
- qualification hosting/online platform ;
- obligations exactes et exemptions ;
- texte CGU/modération/notice-action final.

Aucun PASS DSA ne peut être déduit du seul schéma de base de données.
