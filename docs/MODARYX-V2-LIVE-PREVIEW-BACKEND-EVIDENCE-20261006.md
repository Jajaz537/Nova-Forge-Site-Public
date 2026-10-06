# MODARYX V2 — Preuve backend/auth live preview — 2026-10-06

**État : TERMINÉ pour le preview DEV / production non revendiquée**

## Cible exacte

- source : `d70613a1c5d22b5745545f3547ee9b6d6dfba6be`
- déploiement Cloudflare : `d51866bb`
- workflow : `MODARYX V2 Live Preview Backend Proof`
- run initial bindings : `37432515114` — SUCCESS
- run allow/deny : `37432679004` — SUCCESS

## Bindings réellement observés

```text
stage=dev-foundation
d1=true
r2=false
authConfigured=true
loginConfigured=true
turnstileSecretConfigured=true
remoteWritesReady=true
```

Aucun secret n'est renvoyé ou journalisé.

## Session / auth

- `GET /api/v1/auth/session` → HTTP 200, `authenticated:false` sur la session de preuve ;
- `GET /api/v1/auth/login?returnTo=/account` → HTTP 302 vers une destination HTTPS Auth0 ;
- la V2 utilise le BFF same-origin ;
- aucun bearer token n'est nécessaire dans le navigateur ;
- aucun faux état authentifié n'est créé.

## Deny boundaries réelles

Sans session :
- `GET /api/v1/profile` → 401 `authentication-required` ;
- `GET /api/v1/moderation/queue?limit=1` → 401 ;
- `GET /api/v1/moderation/appeals?limit=1` → 401.

Écriture profil :
- sans Origin → 403 `origin-required` ;
- Origin same-origin mais sans session → 401 `authentication-required`.

Aucune mutation distante n'a été réalisée par cette preuve.

## Limites

Cette preuve ne ferme pas :
- backend **production** ;
- R2 (absent du preview testé) ;
- passkey réelle sur appareil ;
- auth production ;
- cutover.

Elle remplace uniquement l'état « bindings preview inconnus » par une preuve DEV fraîche.
