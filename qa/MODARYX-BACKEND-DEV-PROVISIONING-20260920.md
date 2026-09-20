# MODARYX — Backend DEV — provisioning isolé — 20 septembre 2026

Statut : **CODE DEV ACQUIS — RESSOURCES FOURNISSEUR NON CRÉÉES**.

## Objectif

Préparer le backend MODARYX réel sans activer la production avant preuve.

Socle source :
- `functions/_lib/backend-config.mjs`
- `functions/_lib/auth0.mjs`
- `functions/_lib/turnstile.mjs`
- `functions/api/v1/status.js`
- `migrations/0001_modaryx_dev_foundation.sql`

## Bindings attendus

### D1

Binding :

`MODARYX_DB`

Usage :
- profils ;
- contributions communautaires ;
- états de modération.

Aucune base distante n'est supposée exister tant que le binding n'est pas réellement provisionné.

### R2

Binding :

`MODARYX_ARTIFACTS`

Usage futur :
- artefacts autorisés ;
- pièces de provenance / exports lorsque requis.

Le socle ne publie aucun artefact.

## Variables / secrets attendus

Variables non secrètes :
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_AUDIENCE`
- `AUTH0_CLIENT_ID`
- `MODARYX_TURNSTILE_SITE_KEY`
- `MODARYX_SESSION_TTL_SECONDS` optionnel

Secrets :
- `AUTH0_CLIENT_SECRET`
- `MODARYX_TURNSTILE_SECRET`

Ne jamais committer une valeur réelle.

## Auth0

Le backend vérifie des access tokens RS256 via JWKS et impose :
- issuer HTTPS canonique ;
- audience exacte ;
- signature RS256 ;
- expiration ;
- nbf ;
- subject.

La présence du code ne signifie pas qu'un tenant Auth0 existe.

## Turnstile

Toute future écriture distante protégée doit appeler Siteverify côté serveur.

Le socle supporte :
- token obligatoire ;
- secret serveur ;
- hostname attendu ;
- action attendue ;
- fail-closed si provider indisponible.

## D1

Migration :

`migrations/0001_modaryx_dev_foundation.sql`

Tables :
- `modaryx_profiles`
- `modaryx_community_submissions`

Contraintes :
- visibilité bornée ;
- identité Auth0 unique ;
- états abuse/modération/publication bornés ;
- FK profil → contributions ;
- indexes minimaux.

## API status

Endpoint :

`/api/v1/status`

Retourne uniquement des booléens de présence/configuration.

Il ne retourne jamais :
- valeur de secret ;
- issuer complet comme preuve d'identité ;
- token ;
- clé ;
- contenu D1/R2.

## Séparation DEV / production

Avant toute activation distante :
1. provisionner des ressources DEV isolées ;
2. appliquer la migration sur D1 DEV ;
3. configurer bindings DEV ;
4. configurer tenant Auth0 DEV ;
5. créer Turnstile DEV séparé ;
6. micro-proofs sur preview ;
7. seulement après preuve, planifier production.

Aucun DNS/DNSSEC/nameserver n'est requis pour cette fondation.


## BFF Auth0 DEV

Architecture retenue :
- Auth0 Regular Web Application ;
- New Universal Login ;
- Authorization Code ;
- PKCE S256 ;
- callback serveur ;
- session MODARYX HttpOnly stockée par hash dans D1.

Callback à enregistrer dans Auth0 DEV :

`https://<origine-preview-stable>/api/v1/auth/callback`

Passkeys :
- Database Connection Auth0 ;
- New Universal Login ;
- Identifier First ;
- aucune custom login page incompatible.

La session MODARYX ne persiste aucun access token Auth0.


## Turnstile UI profil

Variable publique :
- `MODARYX_TURNSTILE_SITE_KEY`

Secret serveur :
- `MODARYX_TURNSTILE_SECRET`

La site key peut être exposée par `/api/v1/status` pour rendre le widget. Le secret ne doit jamais être retourné.

Action profil :
- `profile-write`

Le script Turnstile n'est chargé par la page Profils que lorsque site key + secret sont réellement déclarés prêts par le backend.
