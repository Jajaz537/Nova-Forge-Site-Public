# MODARYX V2 — Audit approfondi Community & Profiles

**Date : 2026-10-03**
**Statut : audit ciblé — aucune migration runtime**

## 1. Community legacy

Fichier étudié : `assets/community.js`

Le fichier porte deux responsabilités distinctes :

1. collections locales ;
2. contributions communautaires locales.

Cette combinaison doit être séparée dans V2.

## 2. Collections legacy

### Capacités saines à préserver

- collection locale privée par défaut ;
- `syncState: local-only` ;
- `visibility: private-local` ;
- aucun `ownerProfileId` inventé sans service réel ;
- import strict avec liste blanche de champs ;
- rejet des IDs inconnus ;
- rejet des doublons ;
- conservation de la copie locale si le catalogue distant n'est pas disponible ;
- import depuis favoris locaux ;
- export JSON local ;
- distinction explicite entre sauvegarde locale et synchronisation réseau.

### Limites

- dépend du catalogue démonstration historique ;
- clés de stockage `nova-forge:community:collection:v1` ;
- collection réduite à une liste d'IDs sans version de release ;
- pas de dépendances/conflicts au niveau collection ;
- pas de distinction suffisamment forte entre collection, modpack et profile/loadout.

### Décision V2

Faire de `Collection` un objet éditorial et non une installation.

Une collection peut référencer :
- ContentItem
- éventuellement une release recommandée
- ordre éditorial
- notes
- curateur
- visibilité

Un `Modpack` ou `Profile/Loadout` porte les contraintes d'installation précises.

## 3. Contributions communautaires legacy

Types observés :

- discussion ;
- review ;
- comment.

### Forces

- brouillons `local-only` ;
- `publicationState: local-draft` ;
- `moderationState: not-submitted` ;
- auteur distant non affirmé en mode local ;
- contrat différent selon discussion/review/comment ;
- rating seulement pour review ;
- parent seulement pour comment ;
- import strict ;
- refus d'un brouillon qui prétend une publication/modération distante.

### Décision V2

Préserver cette séparation des états.

Le modèle V2 doit séparer :

- `CommunityDraft`
- `CommunitySubmission`
- `ModerationDecision`
- `PublicationState`

Aucune UI ne doit transformer automatiquement un brouillon local en contenu publié.

## 4. Profiles legacy

Fichier étudié : `assets/profiles.js`

### Capacités à préserver

- détection locale WebAuthn sans prétendre qu'une passkey existe ;
- backend status vérifié avant activation login ;
- session same-origin ;
- Auth0 Universal Login ;
- session HttpOnly ;
- distinction :
  - backend absent ;
  - provisionnement incomplet ;
  - session inconnue ;
  - déconnecté ;
  - connecté ;
- profils publics chargés via endpoint dédié ;
- aucun contenu privé montré en fallback ;
- liens publics limités à HTTPS ;
- rôles/capacités affichés uniquement depuis l'autorité serveur ;
- Turnstile exigé pour écriture profil quand provisionné ;
- éditeur verrouillé si anti-abus indisponible ;
- déconnexion serveur explicite ;
- erreurs d'enregistrement ne simulent pas un succès.

## 5. Autorité / rôles

Rôles observés :

- founder
- administrator
- moderator
- appeals-reviewer
- member

Capacités observées :

- administration
- moderation
- appealsReview

### Décision V2

Conserver le principe :

> le rôle est un résultat serveur, jamais une déduction UI.

La UI V2 ne doit jamais :
- inférer un rôle depuis le profil public ;
- débloquer une action admin par CSS/route seule ;
- confondre badge créateur et autorité de modération.

## 6. Compte et profil public

### Distinctions à maintenir

- Account Session
- Public Profile
- Creator Identity
- Team/Studio Membership
- Authority Role

Ce sont cinq concepts différents.

### V2

`Account` :
- authentification/session.

`Profile` :
- handle ;
- displayName ;
- bio ;
- visibility ;
- links.

`Creator` :
- statut créateur ;
- projets ;
- contributions.

`Team` :
- rôles de collaboration.

`Authority` :
- capacités administratives serveur.

## 7. Turnstile / anti-abus

Le système legacy charge Turnstile uniquement si le backend déclare les bindings nécessaires.

### Règle V2

L'UI doit refléter l'état réel :

- prêt ;
- non provisionné ;
- expiré ;
- erreur ;
- validé.

Ne jamais afficher un formulaire “fonctionnel” si la protection obligatoire est absente.

## 8. Passkeys / WebAuthn

Le legacy fait uniquement une détection de capacité navigateur.

### Règle V2

Séparer :

- `WebAuthn capability`
- `Passkey enrollment`
- `Passkey authentication`

Une capacité navigateur n'est pas une preuve d'enrôlement.

## 9. Refactor cible

### Modules domain/store

- `collection-store`
- `community-draft-store`
- `profile-client`
- `session-client`
- `authority-model`
- `anti-abuse-client`

### UI V2

- CollectionEditor
- CommunityComposer
- AccountPanel
- PublicProfile
- CreatorProfile
- AuthorityPanel

Aucun composant V2 ne doit reprendre les classes DOM historiques.

## 10. Migration localStorage

Clés historiques détectées :

- `nova-forge:community:collection:v1`
- `nova-forge:community:submission:v1`
- `nova-forge:catalog:favorites:v1`

Nouvelles clés proposées :

- `modaryx:v2:collection-draft`
- `modaryx:v2:community-draft`
- `modaryx:v2:favorites`

Migration :

1. lire ancien ;
2. valider contrat ;
3. convertir ;
4. écrire nouveau ;
5. garder ancien tant que la migration n'est pas prouvée ;
6. ne jamais annoncer suppression automatique.

## 11. Conclusion

Les modules Community/Profile legacy contiennent des garde-fous utiles et parfois meilleurs que leur UI.

À préserver :
- états locaux vs distants ;
- autorité serveur ;
- fail-closed ;
- anti-abus ;
- validation d'import ;
- confidentialité par défaut.

À reconstruire :
- architecture visuelle ;
- organisation des responsabilités ;
- collections vs modpacks/profiles ;
- écrans compte/créateur/community.

**État : TERMINÉ pour cet audit ciblé.**
