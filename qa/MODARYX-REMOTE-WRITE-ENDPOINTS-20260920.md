# MODARYX — endpoints distants profils / communauté — 20 septembre 2026

Statut : **CODE ENDPOINTS CIBLÉ ACQUIS — FOURNISSEURS TOUJOURS NON PROVISIONNÉS**.

## Endpoints

- `GET /api/v1/profile` — profil du compte authentifié.
- `PUT /api/v1/profile` — création/mise à jour du profil authentifié.
- `GET /api/v1/profiles/:handle` — lecture publique d'un profil `public` uniquement.
- `POST /api/v1/community/submissions` — contribution distante modérée.

## Garde d'écriture

Toute écriture distante exige simultanément :

- origine same-origin ;
- JSON explicite ;
- corps borné ;
- binding D1 ;
- Auth0 configuré ;
- bearer token Auth0 vérifié ;
- Turnstile secret configuré ;
- token Turnstile validé côté serveur.

Sans une de ces conditions, l'écriture échoue.

## Profils

L'identité fournisseur `sub` n'est jamais exposée comme identifiant public.

Le `profileId` est dérivé par SHA-256 du subject puis tronqué de façon stable.

Les profils publics exposent uniquement :
- profileId ;
- handle ;
- displayName ;
- bio ;
- visibilité ;
- statut créateur ;
- liens HTTPS ;
- collections ;
- timestamps.

Les liens publics sont limités à HTTPS.

## Contributions

Le endpoint distant accepte :
- discussion ;
- review ;
- comment.

Les invariants de champs sont conservés.

Après une validation Auth0 + Turnstile réussie, l'état initial reste :

- `abuse_state = passed`
- `moderation_state = pending`
- `publication_state = received`
- `distributable = false`

Aucune contribution n'est auto-publiée.

## Fournisseurs

Cette preuve ne signifie toujours pas qu'existent :
- tenant Auth0 ;
- database D1 distante ;
- widget Turnstile réel ;
- binding Pages ;
- backend déployé sur preview/production.

## Preuve

Checker :
- `qa/check-remote-write-endpoints.mjs`

Marker :
- `PASS_TARGETED_REMOTE_WRITE_ENDPOINTS`

## État honnête

- **TERMINÉ — code endpoints profils/communauté ciblé**.
- **EN COURS — provisionnement DEV réel**.
- **EN COURS — test réseau réel avec Auth0/D1/Turnstile**.
- **EN COURS — service de modération distant réel**.
