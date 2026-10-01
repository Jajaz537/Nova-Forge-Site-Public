# MODARYX — contrats comptes, profils et écritures communautaires — 20 septembre 2026

Statut : **CONTRATS CIBLÉS ACQUIS — SERVICES RÉELS NON CONNECTÉS**.

## Sources existantes

- `schemas/public-profile.schema.json`
- `schemas/account-security.schema.json`
- `schemas/community-submission.schema.json`
- `schemas/community-write.schema.json`
- `data/integration-readiness.json`

Ces contrats existent déjà dans le dépôt. Ce lot ne crée pas un backend : il les transforme en invariants machine-enforced.

## Provenance historique

Les identifiants historiques `urn:nova-forge:...` et `https://nova-forge.invalid/...` sont conservés pour compatibilité/provenance technique.

Ils ne changent pas l'identité produit :
- Nova Forge = logiciel / OS ;
- MODARYX = plateforme web.

Aucun remplacement global n'est effectué.

## Profil public

Le contrat borne :
- identifiant de profil ;
- handle ;
- nom d'affichage ;
- visibilité `public | unlisted | private` ;
- statut créateur ;
- liens publics ;
- collections référencées.

La validation du schéma ne signifie pas qu'un utilisateur réel peut encore éditer ou publier son profil à distance.

## Frontière sécurité compte

Le contrat sécurité précise explicitement qu'il ne contient et ne demande **jamais de clé privée**.

Il distingue :
- credentials passkeys publics ;
- récupération ;
- sessions/appareils ;
- actions privilégiées.

Invariants :
- credential = `passkey` ;
- session = `active | revoked | expired` ;
- credential = `active | revoked` ;
- récupération = état explicite ;
- toute action privilégiée du contrat exige `reauthenticationRequired: true` ;
- âge maximal d'authentification borné à 3600 secondes lorsqu'il est fourni.

Ce contrat ne prouve aucune cérémonie WebAuthn réelle.

## Brouillons communautaires locaux

Le contrat `community-submission` reste strictement local :
- `authorProfileId = null` ;
- `syncState = local-only` ;
- `publicationState = local-draft` ;
- `moderationState = not-submitted`.

Un brouillon local ne peut donc pas être présenté comme publication distante.

Les variantes restent bornées :
- review → titre + note ;
- discussion → titre ;
- comment → parent requis.

## Write intent distant

Le contrat `community-write` est provider-neutral et précise qu'il **n'implique pas qu'un backend soit actif**.

Toute intention d'écriture contient :
- acteur ;
- cible ;
- payload ;
- Abuse Shield ;
- routage de modération ;
- timestamp.

L'Abuse Shield est obligatoire.

Si son état est `blocked`, le routage de modération ne peut être que :
- `rejected`
- `held-for-review`

Jamais `accepted`.

## Readiness conservée

- `accounts.profiles = not-connected`
- `community.publication-moderation = local-only`

Cette preuve ne ferme donc ni l'identité réelle, ni les profils éditables réels, ni la publication/modération distante.

## Preuve ciblée

Checker :
- `qa/check-account-community-contracts.cjs`

Marker :
- `PASS_TARGETED_ACCOUNT_COMMUNITY_CONTRACTS`

## État honnête

- **TERMINÉ — contrat profil public ciblé**.
- **TERMINÉ — contrat sécurité compte ciblé**.
- **TERMINÉ — contrat brouillon communautaire local ciblé**.
- **TERMINÉ — contrat write-intent/Abuse Shield ciblé**.
- **EN COURS — comptes/passkeys réels**.
- **EN COURS — profils publics éditables à distance**.
- **EN COURS — publication/modération distante réelle**.

Aucun service distant ne doit être annoncé sur la seule base de ces schémas.
