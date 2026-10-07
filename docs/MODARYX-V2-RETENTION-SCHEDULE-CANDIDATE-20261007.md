# MODARYX V2 — RETENTION SCHEDULE CANDIDATE — FRANCE / UE — 2026-10-07

**Statut : EN COURS / CANDIDAT — aucune durée n'est finale tant que responsable de traitement, finalité, provider et configuration production ne sont pas fixés**

Référence technique :
`docs/MODARYX-V2-PRIVACY-TABLE-FIELD-REGISTER-CANDIDATE-20261007.json`.

## 1. Principe

La CNIL rappelle en 2026 qu'une donnée personnelle ne peut pas être conservée indéfiniment et que la durée doit être déterminée en fonction de la finalité.

Le modèle MODARYX doit distinguer :
1. base active ;
2. archivage intermédiaire si nécessaire ;
3. suppression ou anonymisation ;
4. sauvegardes avec purge cohérente ;
5. journaux de preuve de suppression sans recopier inutilement la donnée supprimée.

Source :
- https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees

## 2. Auth transactions

Tables :
- `modaryx_auth_transactions`

**Candidat produit :**
- base active : jusqu'à `expires_at` ;
- purge : rapide après expiration, cible technique à fixer ;
- pas d'archivage long par défaut.

Raison : state/verifier sont des données transitoires d'authentification. Leur conservation au-delà du besoin opérationnel doit être justifiée.

**État : EN COURS — durée technique exacte à valider.**

## 3. Sessions

Tables :
- `modaryx_sessions`

**Candidat produit :**
- session active : jusqu'à expiration/révocation ;
- secret/token de session : supprimer/invalider dès révocation ;
- si des événements de sécurité distincts sont journalisés, appliquer le calendrier sécurité dédié plutôt que conserver la session elle-même.

**État : EN COURS.**

## 4. Journalisation sécurité / administration

Catégories concernées :
- historique/audit ;
- accès/actions sensibles ;
- anomalies/incidents ;
- actions d'administration.

La CNIL recommande généralement une période glissante de **6 mois à 1 an** pour la journalisation standard, sauf justification spécifique (obligation, contentieux, contrôle interne, menace particulière).

Source :
- https://www.cnil.fr/fr/securite-tracer-les-operations

**Candidat MODARYX : 6 à 12 mois selon type de journal, à minimiser et documenter.**
Ce n'est pas une obligation automatique de conserver toutes les données 12 mois.

## 5. Profils, compte et données produit

Tables/catégories :
- profiles ;
- creators ;
- teams ;
- game profiles ;
- collections privées ;
- préférences.

**Candidat produit :**
- base active : pendant l'existence du compte / besoin de service ;
- à fermeture : suppression ou anonymisation des données sans obligation ou motif distinct ;
- archivage séparé seulement si une obligation légale ou défense de droits le justifie.

**Durée post-clôture finale : PREUVE MANQUANTE.**

## 6. UGC et contenu communautaire

Tables/catégories :
- community submissions ;
- contenu créé ;
- collections publiques ;
- commentaires/notes si applicables.

**Candidat produit :**
- contenu publié : tant que publication légitime/active ;
- suppression utilisateur : suppression du contenu visible selon règles produit, sous réserve des preuves ou obligations séparées ;
- toute conservation post-suppression pour modération/contentieux doit être isolée et justifiée.

**Durée exacte : PREUVE MANQUANTE / dépend du rôle DSA réel et des CGU.**

## 7. Modération / signalements / décisions

Tables :
- `modaryx_moderation_receipts`
- éléments d'audit liés.

Le calendrier doit couvrir :
- traitement du signalement ;
- recours ;
- preuve de décision ;
- obligations éventuelles liées au rôle DSA.

**Aucune durée finale n'est fixée avant qualification DSA.**
Éviter d'utiliser la durée des logs sécurité comme raccourci pour les preuves de modération.

**État : BLOQUÉ PAR QUALIFICATION DU RÔLE.**

## 8. Notifications

Tables :
- events ;
- preferences ;
- delivery outbox ;
- destinations.

**Candidat :**
- événements visibles : durée produit limitée et configurable ;
- outbox : suppression après succès/échec définitivement clôturé + fenêtre de diagnostic courte ;
- destination chiffrée : uniquement tant que canal actif ;
- révocation : supprimer le secret utilisable, conserver seulement la preuve minimale si nécessaire ;
- marketing : calendrier spécifique de prospection.

Durées exactes : **PREUVE MANQUANTE**.

## 9. Prospection / marketing

La CNIL indique notamment :
- données clients utilisées pour prospection : pendant la relation commerciale puis **3 ans** à compter de la fin de la relation commerciale ;
- prospects : **3 ans** à compter de la collecte ou du dernier contact venant du prospect.

Sources :
- https://www.cnil.fr/fr/questions-reponses-sur-les-referentiels-relatifs-la-gestion-des-activites-commerciales-et-des
- https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_traitements-donnees-caractere-personnel_gestion-activites-commerciales.pdf

**Candidat MODARYX : suivre ce cadre uniquement si la prospection est effectivement activée et légalement fondée.**
Le marketing reste distinct des notifications opérationnelles.

## 10. Cookies / choix de consentement

La CNIL considère généralement **6 mois** comme une bonne pratique pour mémoriser le choix de consentement ou de refus, à apprécier au cas par cas.

Source :
- https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite

**Candidat MODARYX : 6 mois si une CMP/traceur soumis à consentement est réellement déployé.**
Aucune CMP ne doit être ajoutée par défaut si elle n'est pas nécessaire.

## 11. RUM / mesure d'audience

Table :
- `modaryx_v2_cwv_samples`

Deux voies distinctes :

### Avec consentement
Durée à définir selon finalité et outil réels.

### Exemption de consentement revendiquée
Uniquement si toutes les conditions CNIL sont réellement remplies : finalité strictement audience/performance pour l'éditeur, statistiques anonymes, pas de suivi cross-site, pas de recoupement/transmission interdite, etc.

La CNIL recommande alors notamment :
- durée de vie du traceur : **13 mois** ;
- données collectées : **25 mois maximum** ;
- réexamen périodique.

Source :
- https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience

**État MODARYX : PREUVE MANQUANTE — aucune exemption n'est revendiquée sans audit de configuration réel.**

## 12. Paiement / facturation si vente directe

MODARYX ne doit pas stocker les données carte brutes si un PSP/MoR les traite.

Pour les pièces comptables françaises, Service Public Entreprendre indique notamment une conservation de **10 ans** pour les pièces justificatives comptables, dont factures client/fournisseur, à compter de la clôture de l'exercice.

Source :
- https://entreprendre.service-public.fr/vosdroits/F10029

La CNIL donne également comme exemple e-commerce : données nécessaires à la commande/facturation pendant la relation commerciale et dix ans au titre des obligations comptables.

Source :
- https://www.cnil.fr/fr/exemple-dinformation-clients-dun-site-de-vente-en-ligne-prospection-par-courriel-et-transmission-de

**Applicabilité MODARYX : BLOQUÉE par vendeur + PSP/MoR + modèle de facture.**

## 13. Rights / éditeurs / licences / preuves

Tables :
- rights cases ;
- scope decisions ;
- contact/response evidence ;
- preflight ;
- outbound/inbound ;
- authorizing reviews.

Ces données peuvent inclure des éléments contractuels, de preuve, des contacts professionnels et des décisions de droits.

**Candidat :**
- conservation pendant validité/usage de l'autorisation ;
- archivage proportionné pour défense de droits et preuve ;
- séparation entre données de contact inutiles et preuve juridique nécessaire.

Durée finale : **LEGAL_REVIEW_REQUIRED**.

## 14. Suppression / export

Chaque catégorie doit définir :
- trigger de suppression ;
- purge base active ;
- purge cache/index ;
- suppression ou anonymisation historique ;
- traitement des sauvegardes ;
- preuve de purge ;
- export utilisateur lorsque le droit s'applique.

La CNIL recommande des mécanismes de purge automatique et la documentation des durées.

Source :
- https://www.cnil.fr/fr/minimiser-les-donnees-collectees

## 15. Gate

**Peut être retenu comme cadre dès maintenant**
- 6–12 mois comme fourchette CNIL de référence pour logs sécurité standard ;
- 3 ans pour prospection dans les conditions du référentiel CNIL ;
- 6 mois comme bonne pratique pour mémoriser le choix cookies ;
- 13 mois / 25 mois uniquement pour mesure d'audience exemptée réellement conforme ;
- 10 ans pour pièces comptables françaises lorsque l'obligation correspond réellement au vendeur/document.

**Toujours PREUVE MANQUANTE**
- durée finale par table MODARYX ;
- responsable de traitement ;
- rôle DSA ;
- PSP/MoR ;
- vendeur ;
- outil RUM ;
- sauvegardes production ;
- procédure d'effacement/export.

Aucune durée issue de ce document ne devient automatiquement une configuration production.
