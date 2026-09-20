# MODARYX — DEV provider readiness delta — 20 septembre 2026

Statut : **PRÉPARATION SOURCE UNIQUEMENT — AUCUNE RESSOURCE FOURNISSEUR CRÉÉE**.

Ce complément ferme les derniers écarts provider-independent repérés avant provisioning DEV réel.

## D1 DEV

Appliquer les migrations dans cet ordre, sur une base DEV isolée uniquement :

1. `migrations/0001_modaryx_dev_foundation.sql`
2. `migrations/0002_modaryx_auth_sessions.sql`

La seconde migration est nécessaire au flux BFF/session déjà codé.

## Turnstile DEV

- utiliser un hostname de preview stable ;
- configurer la site key pour ce hostname exact ;
- renseigner le même hostname, sans schéma ni chemin, via `MODARYX_TURNSTILE_HOSTNAME` ;
- conserver les actions exactes `profile-write` et `community-write`.

Le runtime transmet déjà ce hostname comme `expectedHostname` à la validation serveur.

## Auth0 DEV

- l'identifiant de l'API Auth0 doit correspondre exactement à `AUTH0_AUDIENCE` ;
- signature attendue : `RS256` ;
- callback DEV : `https://<origine-preview-stable>/api/v1/auth/callback` ;
- utiliser une origine de preview stable pour éviter de changer la callback à chaque commit.

## Portée Cloudflare

Pour profils + Communauté actuels :
- D1 est requis ;
- Turnstile est requis pour les écritures ;
- R2 n'est pas requis pour fermer ces deux parcours et reste réservé aux artefacts futurs.

## Micro-proofs à exécuter après provisioning

1. `/api/v1/status` expose D1/Auth0/Turnstile prêts sans valeur sensible.
2. Login BFF réel → callback → cookie HttpOnly MODARYX.
3. Session réelle via `/api/v1/auth/session`.
4. Écriture profil avec action `profile-write`.
5. Soumission Communauté avec action `community-write`.
6. Réponse Communauté uniquement `pending/received/distributable=false`.
7. Échec Turnstile/hostname/session reste fail-closed.

Aucun DNS, production, `main`, tenant, binding ou secret réel n'est créé par ce document.
