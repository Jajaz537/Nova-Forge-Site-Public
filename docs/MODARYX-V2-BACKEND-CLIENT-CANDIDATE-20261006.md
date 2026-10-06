# MODARYX V2 — Client backend/auth same-origin — 2026-10-06

**État : candidat implémenté / production non revendiquée**

## Réconciliation des preuves historiques

Les sources anciennes de septembre disaient correctement qu'aucune ressource fournisseur n'était encore créée au moment où elles ont été écrites. Des preuves DEV plus récentes ont ensuite établi :
- tenant Auth0 DEV configuré ;
- Universal Login + Identifier First ;
- passkey activée côté provider DEV ;
- session réelle Fondateur DEV et autorité runtime confirmées.

Cela ne ferme pas la VF :
- cérémonie passkey sur appareil réel : OPEN ;
- backend production réel : OPEN ;
- production/cutover : OPEN.

## Slice V2

La V2 dispose maintenant d'un client central same-origin pour :
- `/api/v1/status` ;
- `/api/v1/auth/session` ;
- `/api/v1/auth/login` avec `returnTo=/account` ;
- `/api/v1/auth/logout`.

Règles :
- aucun bearer token dans le navigateur ;
- aucune session Auth0 en localStorage/sessionStorage ;
- cookie HttpOnly laissé au BFF ;
- état authentifié affiché uniquement si le serveur le renvoie réellement ;
- backend absent/invalide → état invité/indisponible honnête ;
- aucun faux profil distant.

Cette slice prépare la V2 à réutiliser le BFF V1 lorsque son contrat est suffisant sans modifier silencieusement l'API V1.
