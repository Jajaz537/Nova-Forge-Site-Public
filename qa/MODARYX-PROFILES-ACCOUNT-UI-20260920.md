# MODARYX — UI compte / profil — 20 septembre 2026

Statut : **UI CIBLÉE ACQUISE EN CODE — SERVICE FOURNISSEUR TOUJOURS NON PROVISIONNÉ**.

## Surface

Route :
- `/profiles` / `profiles.html`

L'ancienne présentation purement documentaire est remplacée par une console de compte progressive qui reflète l'état réel du backend.

## États

La console distingue explicitement :

- service non provisionné ;
- connexion disponible / déconnecté ;
- session confirmée ;
- erreur de vérification.

Aucun état connecté n'est dérivé d'un cache, de WebAuthn ou du stockage navigateur.

## Connexion

Le bouton de connexion reste désactivé tant que :

- D1 n'est pas présent ;
- Auth0 BFF n'est pas entièrement configuré.

Lorsqu'il est activé, il utilise :

`/api/v1/auth/login?returnTo=...`

Le navigateur ne manipule aucun access token Auth0.

## Session

La page lit uniquement :

`/api/v1/auth/session`

Une session authentifiée provient donc du backend same-origin et du cookie HttpOnly.

Logout :

`POST /api/v1/auth/logout`

## Profil

Lorsque la session est réelle :

- chargement via `GET /api/v1/profile` ;
- création/mise à jour via `PUT /api/v1/profile`.

Champs UI :
- pseudonyme ;
- nom affiché ;
- biographie ;
- visibilité ;
- statut créateur.

## Turnstile

L'éditeur distant reste verrouillé tant que le backend ne déclare pas :

- secret Turnstile configuré ;
- site key public configuré.

La site key est publique et peut être retournée par `/api/v1/status`.

Le secret Turnstile ne doit jamais être retourné.

Le script Cloudflare Turnstile n'est chargé dynamiquement qu'après confirmation de la configuration réelle.

Action :
- `profile-write`

## CSP

La page profils autorise uniquement l'origine officielle Turnstile supplémentaire :

- script : `https://challenges.cloudflare.com`
- connect : `https://challenges.cloudflare.com`
- frame : `https://challenges.cloudflare.com`

Les autres politiques restent same-origin / fail-closed.

## WebAuthn

La détection WebAuthn locale est conservée, mais reste explicitement non probante pour :

- existence d'un compte ;
- passkey enregistrée ;
- authentification réussie.

## Preuves

Checker source :
- `qa/check-profiles-account-ui.cjs`
- marker `PASS_TARGETED_PROFILES_ACCOUNT_UI`

Browser proof :
- `qa/check-profiles-state-browser.mjs`
- marker `PASS_TARGETED_PROFILES_STATE_BROWSER_PROOF`

En environnement statique, le browser proof exige :
- état `unavailable` ;
- aucune session simulée ;
- login désactivé ;
- éditeur désactivé ;
- aucune overflow desktop/mobile.
