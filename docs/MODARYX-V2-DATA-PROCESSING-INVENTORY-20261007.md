# MODARYX V2 — DATA PROCESSING INVENTORY — P0 — 2026-10-07

**Statut : EN COURS / PREUVE MANQUANTE pour bases juridiques, durées finales et production**
**Source technique : migrations 0001 à 0015 + stratégie auth/backend V2**

## 1. Principe

Ce document inventorie les catégories de données visibles dans le schéma candidat. Il ne constitue pas une politique de confidentialité finale.

Aucune base juridique ni durée de conservation n'est déclarée finale tant que l'opérateur, les finalités exactes, les providers et la configuration production ne sont pas figés.

## 2. Identité / profil

Tables :
- modaryx_profiles
- modaryx_v2_creators
- modaryx_v2_teams

Données visibles :
- identity_sub
- handle / display_name
- bio
- visibilité
- liens
- collections
- statut créateur
- avatar URL
- membres/rôles équipe

Finalités candidates :
- compte/profil
- publication/création
- équipe
- personnalisation explicite

Manquants :
- base juridique finale
- durées
- suppression/export
- règles de visibilité
- process identité vérifiée

## 3. Authentification / sessions

Tables :
- modaryx_auth_transactions
- modaryx_sessions

Données :
- state hash
- PKCE code verifier
- return_to
- session hash
- identity_sub
- scopes/permissions
- timestamps/expiration

Principe :
- aucun access token Auth0 persisté côté client ;
- session propre MODARYX ;
- données d'auth minimisées.

Manquants :
- durées finales
- politique logs
- DPA Auth0 et transferts
- procédures révocation/récupération

## 4. UGC / communauté / modération

Tables :
- modaryx_community_submissions
- modaryx_moderation_receipts

Données :
- discussions/reviews/comments
- notes
- cible
- auteur
- états abuse/modération/publication
- décisions/appels
- payload de décision
- actor keys

Finalités candidates :
- publication communautaire
- support
- modération
- sécurité
- recours

Risques :
- contenu libre pouvant inclure données personnelles
- sanctions/décisions
- contenu illicite/IP

Actions obligatoires :
- règles UGC
- notice/action si applicable
- information modération
- politique conservation
- effacement/anonymisation selon obligations et preuve

## 5. Contenus / créateurs / fichiers

Tables V2 core :
- games/content types
- creators/teams
- content items/releases
- dependencies/compatibility
- file artifacts
- collections/modpacks/profiles
- search documents

Données personnelles possibles :
- identifiants créateur
- handles/bios/links
- équipe
- contenus textuels
- provenance/licence
- métadonnées fichiers

Actions :
- provenance
- droits
- suppression
- ownership
- redistribution
- sécurité fichiers
- anti-malware

## 6. Notifications

Tables :
- modaryx_v2_notification_events
- modaryx_v2_notification_preferences
- modaryx_v2_notification_delivery_outbox
- modaryx_v2_notification_destinations

Données :
- recipient_identity_sub
- préférences produit/communauté/créateur/profil/droits/marketing
- événements et liens
- canal EMAIL/PUSH
- destination chiffrée
- digest de destination
- erreurs/attempts

Point positif :
- marketing_enabled = 0 par défaut dans le schéma candidat ;
- adresse brute/push brut ne doit pas être stocké dans l'outbox ;
- destinations prévues chiffrées.

Manquants :
- provider réel
- clé/rotation
- base juridique par type de message
- durée
- unsubscribe/withdrawal process

## 7. Historique propriétaire

Table :
- modaryx_v2_data_history

Données :
- owner_identity_sub
- type d'entité/action
- champs changés
- digest snapshot
- timestamps

But :
- historique/audit utilisateur.

Risques :
- conservation excessive ;
- conflit droit à l'effacement vs preuve/audit.

Action :
- définir durée et stratégie purge/anonymisation selon nature.

## 8. Game support / rights

Tables :
- modaryx_v2_game_support_requests
- modaryx_v2_game_support_records
- rights cases/decisions/audit
- contact evidence
- response evidence
- license preflight
- outbound/inbound quarantine
- authorizing reviews

Données :
- requester identity
- raison/source URLs
- noms développeur/éditeur
- contacts officiels sous forme digest
- hashes messages/headers
- références de revue juridique
- actor/reviewer keys
- territoires/conditions/droits

Principe :
- fail-closed ;
- ne pas exposer publiquement contacts/correspondances ;
- minimiser les données de contact.

Manquants :
- mailbox/provider
- politique conservation preuves
- confidentialité juridique
- habilitations admin

## 9. RUM performance

Table :
- modaryx_v2_cwv_samples

Données :
- page_view_id pseudonyme/éphémère attendu
- LCP/INP/CLS
- rating
- route_class
- viewport_class
- navigation_type
- timestamp

Le schéma indique explicitement ne pas stocker :
- account id
- IP
- user-agent
- URL brute
- query string
- referrer

État : candidat ; production non prouvée.

Action :
- confirmer implémentation réelle identique ;
- durée courte ;
- vérifier exemption éventuelle de consentement uniquement si toutes conditions CNIL sont satisfaites ; sinon consentement préalable.

## 10. Cookies / terminal

Candidats strictement nécessaires :
- session/auth
- anti-abus selon implémentation
- préférence consentement

Candidats locaux :
- préférences UI
- brouillons locaux

Tout analytics/marketing non nécessaire : OFF avant consentement lorsque requis.

## 11. Providers

- Auth0 : identité — production à prouver.
- Cloudflare D1 : données transactionnelles — production à prouver.
- Cloudflare R2 : artefacts — production absent/non prouvé.
- Turnstile : anti-abus — Siteverify serveur requis.
- Email : non implémenté.
- Push : non implémenté.
- Weather : off par défaut.
- Analytics tiers : non sélectionné.

## 12. P0 privacy blockers

BLOQUÉ / PREUVE MANQUANTE :
- identité du responsable de traitement ;
- finalité exacte par table/champ ;
- base juridique par traitement ;
- durée par catégorie ;
- DPA/providers/transferts ;
- process accès/export/rectification/suppression ;
- politique logs ;
- incident/breach process ;
- CMP/cookies si nécessaire ;
- analytics production final ;
- privacy notice finale.

## 13. Règle de continuation

Le prochain travail privacy doit mapper :
TABLE/CHAMP → FINALITÉ → BASE CANDIDATE → ACCÈS → DURÉE → SOUS-TRAITANT → DROITS → SUPPRESSION/EXPORT → PREUVE.

Aucune valeur manquante ne doit être inventée.
