# MODARYX — DEV provider readiness delta — 20 septembre 2026

Statut : **PRÉPARATION SOURCE UNIQUEMENT — AUCUNE RESSOURCE FOURNISSEUR CRÉÉE**.

Ce complément ferme les derniers écarts provider-independent repérés avant provisioning DEV réel.

## D1 DEV

Appliquer les migrations dans cet ordre, sur une base DEV isolée uniquement :

1. `migrations/0001_modaryx_dev_foundation.sql`
2. `migrations/0002_modaryx_auth_sessions.sql`
3. `migrations/0003_modaryx_moderation_publication.sql`

La seconde migration est nécessaire au flux BFF/session. La troisième ajoute les receipts de modération nécessaires au moteur publication/modération.

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
- utiliser une origine de preview stable pour éviter de changer la callback à chaque commit ;
- pour la modération DEV, activer RBAC sur l'API et inclure les permissions dans l'access token ;
- attribuer `community:moderate` au compte modérateur de preuve ;
- attribuer séparément `community:appeals-review` au compte de preuve chargé des recours.

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
8. Après migration 0003 + RBAC, file modération lisible uniquement avec `community:moderate`.
9. Décision privilégiée refuse une session trop ancienne avec `reauthentication-required`.
10. Publication réelle n'apparaît dans `/api/v1/community/public` qu'après décision `publish`; `hold`/`reject` retirent le contenu public.
11. L'auteur peut relire uniquement sa propre soumission et déposer un seul recours contre une décision restrictive.
12. La file de recours refuse `community:moderate` seul et exige `community:appeals-review`.
13. Issue de recours `upheld / modified / reversed` créée avec receipt chaîné ; `reversed` ne publie que si `abuse=passed`.

Aucun DNS, production, `main`, tenant, binding ou secret réel n'est créé par ce document.
