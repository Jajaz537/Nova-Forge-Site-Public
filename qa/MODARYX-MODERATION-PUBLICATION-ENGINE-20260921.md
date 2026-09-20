# MODARYX — Moteur de modération / publication DEV — 21 septembre 2026

Statut : **CODE CIBLÉ — PREUVE FOURNISSEUR RÉELLE RESTANTE**.

Ce lot transforme la soumission distante déjà prouvée en file de modération contrôlée, sans auto-publication.

## Principes

- une soumission arrive toujours en `passed / pending / received` ;
- aucune contribution n'est publiée par l'endpoint de soumission ;
- la lecture de la file exige la permission Auth0 `community:moderate` ;
- une décision modérateur exige une session HttpOnly réelle et une authentification récente ;
- âge d'authentification privilégiée : 15 minutes par défaut, borné à 60–3600 secondes via `MODARYX_PRIVILEGED_AUTH_MAX_AGE_SECONDS` ;
- une décision produit un receipt immuable dans D1 ;
- le subject Auth0 du modérateur n'est pas stocké en clair dans le receipt : un identifiant pseudonymisé `moderator:<sha256-prefix>` est conservé pour l'audit interne ;
- la surface publique ne lit que `abuse=passed + moderation=accepted + publication=published` ;
- si le profil auteur n'est plus public, la surface publique n'expose pas son pseudonyme ni son nom.

## Migration D1

Après les migrations existantes :

1. `migrations/0001_modaryx_dev_foundation.sql`
2. `migrations/0002_modaryx_auth_sessions.sql`
3. `migrations/0003_modaryx_moderation_publication.sql`

La migration 0003 ajoute la table append-only logique `modaryx_moderation_receipts` et ses indexes.

## Routes

- `GET /api/v1/moderation/queue`
  - session réelle ;
  - permission `community:moderate` ;
  - file pending/held par défaut.
- `POST /api/v1/moderation/decisions`
  - same-origin ;
  - session réelle ;
  - permission `community:moderate` ;
  - réauthentification récente ;
  - résultats bornés : `publish`, `hold`, `reject`.
- `GET /api/v1/community/public`
  - lecture publique ;
  - uniquement contributions effectivement acceptées et publiées.

## Transitions

- `publish` → `accepted / published`, uniquement si Abuse Shield = `passed` ;
- `hold` → `held-for-review` et contenu retiré de la surface publique s'il était déjà publié ;
- `reject` → `rejected` et contenu retiré de la surface publique s'il était déjà publié.

## Receipts

Chaque décision crée un receipt compatible avec le contrat `schemas/moderation-receipt.schema.json` :

- catégorie ;
- statement of reasons ;
- règle/base optionnelle ;
- indicateur de signal automatisé ;
- `humanDecision=true` ;
- chaînage via `previousReceiptId`.

Le moteur d'appel reste un lot séparé : ce document ne prétend pas qu'un appel utilisateur ou une revue d'appel est déjà actif.

## Auth0 DEV à prévoir

Pour le rôle de modération DEV :

- activer RBAC sur l'API MODARYX ;
- exposer les permissions dans l'access token ;
- créer/attribuer la permission `community:moderate` uniquement au compte de preuve modérateur ;
- refaire un login après changement de rôle afin de créer une session MODARYX contenant la permission.

## Preuve ciblée

Checker :

- `qa/check-moderation-publication-engine.mjs`

Marker :

- `PASS_TARGETED_MODERATION_PUBLICATION_ENGINE`

Cette preuve ne vaut ni migration D1 réelle, ni permission Auth0 réelle, ni décision de modération réelle, ni VF.
