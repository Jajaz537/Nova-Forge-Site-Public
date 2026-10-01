# MODARYX — Auth0 BFF + session D1 — 20 septembre 2026

Statut : **CODE BFF CIBLÉ ACQUIS — TENANT AUTH0 / D1 DISTANTS NON PROVISIONNÉS**.

## Architecture retenue

MODARYX utilise un modèle Backend-for-Frontend pour l'authentification web :

1. le navigateur appelle `/api/v1/auth/login` ;
2. le serveur crée une transaction OAuth temporaire dans D1 ;
3. redirection vers Auth0 Universal Login ;
4. Authorization Code + PKCE ;
5. callback serveur `/api/v1/auth/callback` ;
6. échange du code côté serveur ;
7. vérification du JWT access token ;
8. création d'une session MODARYX aléatoire ;
9. seul le **hash** du token de session est stocké dans D1 ;
10. le navigateur reçoit uniquement un cookie `HttpOnly; Secure; SameSite=Lax`.

L'access token Auth0 n'est pas stocké dans le navigateur ni dans D1.

## Routes

- `GET /api/v1/auth/login`
- `GET /api/v1/auth/callback`
- `GET /api/v1/auth/session`
- `POST /api/v1/auth/logout`

## Transaction OAuth

La transaction contient :
- hash du `state` ;
- code verifier PKCE ;
- returnTo interne ;
- timestamps ;
- expiration courte.

Le `state` est single-use : sa ligne D1 est supprimée lors de la consommation.

Les destinations `returnTo` externes sont refusées.

## Session

Table :
- `modaryx_sessions`

Le cookie brut n'est jamais stocké en base.

La base contient :
- hash de session ;
- subject Auth0 ;
- scopes/permissions ;
- timestamps ;
- expiration.

TTL par défaut :
- 8 heures.

Bornes configurables :
- minimum 15 minutes ;
- maximum 7 jours.

## Variables

Non secrètes :
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_AUDIENCE`
- `AUTH0_CLIENT_ID`
- `MODARYX_SESSION_TTL_SECONDS` optionnel

Secrets :
- `AUTH0_CLIENT_SECRET`
- `MODARYX_TURNSTILE_SECRET`

Aucune valeur réelle ne doit être commitée.

## Configuration Auth0 DEV

Type d'application recommandé pour ce BFF :
- Regular Web Application.

Callback DEV :
- `https://<origine-preview-stable>/api/v1/auth/callback`

Flux :
- Authorization Code ;
- PKCE S256 ;
- New Universal Login ;
- Identifier First pour le flux passkey ;
- Database Connection avec passkeys lorsque le tenant est provisionné.

## API MODARYX

Les endpoints profils/communauté préfèrent désormais la session HttpOnly.

Le bearer token Auth0 reste un fallback API, mais n'est plus requis pour l'interface web MODARYX si une session BFF valide existe.

Les écritures communautaires restent en plus protégées par Turnstile.

## Preuve

Checker :
- `qa/check-auth-bff.mjs`

Marker :
- `PASS_TARGETED_AUTH_BFF_SESSION`

La preuve couvre le code et les invariants locaux uniquement. Elle ne prouve pas un login réel chez Auth0 tant que le tenant DEV n'est pas provisionné.
