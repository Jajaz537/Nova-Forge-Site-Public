# MODARYX V2 — contrat CMP / consentement cookies et traceurs — candidat — 2026-10-08

**État : EN COURS — aucune activation CMP / validation juridique finale**

## Objet

Ce contrat complète l'inventaire statique :
`docs/MODARYX-V2-COOKIE-STORAGE-TRACKER-STATIC-INVENTORY-20261008.md`.

Il est distinct de l'ancien moteur de consentement Guide/OS, qui ne concerne que des permissions d'intégration et ne vaut pas gestion cookies/traceurs.

## Doctrine officielle revue

Sources CNIL revues le 2026-10-08 :
- Cookies et traceurs — règles générales ;
- FAQ cookies et autres traceurs ;
- solutions de mesure d'audience ;
- retrait du consentement.

Principes à intégrer :
- une action positive est requise lorsqu'un consentement est nécessaire ;
- aucun traceur non essentiel soumis à consentement ne doit être déposé/lu avant ce choix ;
- refuser doit être aussi simple qu'accepter ;
- retirer le consentement doit rester simple et accessible ;
- une exemption de consentement pour mesure d'audience n'est possible que si les conditions réelles de la configuration sont démontrées.

**La qualification exacte de chaque storage/traceur et toute exemption restent PREUVE MANQUANTE.**

## Premier écran candidat

Présenter au même niveau :
- **Accepter les traceurs non nécessaires**
- **Refuser les traceurs non nécessaires**
- **Personnaliser**

Interdits :
- bouton accepter dominant + refus caché ;
- cases précochées non nécessaires ;
- « continuer = accepter » ;
- cookie wall artificiel ;
- réactivation silencieuse après refus ;
- dégradation artificielle du produit gratuit.

## Catégories candidates

### Strictement nécessaires

Uniquement si l'élément est réellement indispensable au service demandé.

Candidats à qualifier :
- session/auth ;
- sécurité/anti-abus indispensable ;
- certaines préférences intrinsèques au service.

État : **PREUVE MANQUANTE** par élément.

### Fonctionnels optionnels

OFF ou choix explicite si non indispensables.

État : **PREUVE MANQUANTE**.

### Audience / performance

CWV/RUM :
- actuellement OFF par défaut ;
- first-party candidat ;
- DNT/GPC pris en compte dans le code candidat ;
- aucune exemption n'est revendiquée.

Si l'exemption CNIL est envisagée, elle doit être documentée contre **la configuration finale réelle**, pas contre une intention.

### Marketing

OFF par défaut.
Aucun traceur marketing/publicitaire n'est actuellement observé dans l'inventaire statique.

## Mapping actuel

- `modaryx_session` : session first-party ; catégorie nécessaire candidate, qualification finale manquante.
- localStorage favoris/recherches/brouillons/collections/préférences : classification à faire fonction par fonction.
- Cache Storage PWA : capacité technique/offline ; gate production OFF.
- CWV/RUM : catégorie analytics candidate ; OFF.
- Turnstile : sécurité/anti-abus conditionnel ; qualification finale manquante.

## Reçu de consentement candidat

Minimiser :
- version de politique ;
- timestamp ;
- catégories choisies ;
- surface/source du choix.

Ne pas créer un identifiant publicitaire ou cross-site pour prouver le consentement.

À décider :
- emplacement de stockage ;
- durée ;
- règle de renouvellement ;
- synchronisation éventuelle compte/appareil.

Aucun consentement multi-terminal implicite n'est supposé.

## Retrait

Une entrée permanente « Gérer mes cookies / traceurs » doit rester accessible.

Après retrait :
- bloquer les traitements futurs contrôlés par consentement ;
- nettoyer/désactiver le stockage concerné lorsque techniquement et juridiquement approprié ;
- ne pas affecter les fonctions essentielles de manière punitive.

## Gate avant lancement

Restent **PREUVE MANQUANTE** :
- opérateur réel ;
- inventaire runtime final ;
- classification finale par traceur/storage ;
- analyse d'exemption éventuelle ;
- stockage/durée du reçu ;
- texte cookies/privacy ;
- observation réseau/cookies du candidat final ;
- accessibilité réelle du CMP ;
- validation juridique appropriée.

Aucun CMP, analytics, marketing, provider ou traceur supplémentaire n'est activé par ce document.
