# MODARYX — Moteur de modération / publication DEV — 21 septembre 2026

Statut : **CODE CIBLÉ — PREUVE FOURNISSEUR RÉELLE RESTANTE**.

Ce lot transforme la soumission distante déjà prouvée en file de modération contrôlée, sans auto-publication, avec suivi auteur et recours borné.

## Principes

- une soumission arrive toujours en `passed / pending / received` ;
- aucune contribution n'est publiée par l'endpoint de soumission ;
- la lecture de la file exige la permission Auth0 `community:moderate` ;
- la revue des recours exige une permission distincte `community:appeals-review` ;
- une décision modérateur exige une session HttpOnly réelle et une authentification récente ;
- âge d'authentification privilégiée : 15 minutes par défaut, borné à 60–3600 secondes via `MODARYX_PRIVILEGED_AUTH_MAX_AGE_SECONDS` ;
- une décision produit un receipt immuable dans D1 ;
- le subject Auth0 du modérateur n'est pas stocké en clair dans le receipt : un identifiant pseudonymisé `moderator:<sha256-prefix>` est conservé pour l'audit interne ;
- la surface publique ne lit que `abuse=passed + moderation=accepted + publication=published` ;
- si le profil auteur n'est plus public, la surface publique n'expose pas son pseudonyme ni son nom ;
- l'auteur ne peut consulter que ses propres soumissions distantes ;
- un recours n'est possible que contre la dernière décision restrictive (`remove` ou `visibility-limit`) et une seule fois par décision.

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
- `GET /api/v1/community/submissions/:id`
  - session auteur ;
  - lecture uniquement de sa propre contribution ;
  - décision, recours et issue courants sans identité modérateur exposée.
- `POST /api/v1/community/appeals`
  - same-origin + session auteur ;
  - une seule soumission de recours par décision restrictive.
- `GET /api/v1/moderation/appeals`
  - permission distincte `community:appeals-review` ;
  - file des recours sans issue.
- `POST /api/v1/moderation/appeal-outcomes`
  - same-origin + session récente ;
  - permission `community:appeals-review` ;
  - résultats bornés : `upheld`, `modified`, `reversed`.

## Transitions

- `publish` → `accepted / published`, uniquement si Abuse Shield = `passed` ;
- `hold` → `held-for-review` et contenu retiré de la surface publique s'il était déjà publié ;
- `reject` → `rejected` et contenu retiré de la surface publique s'il était déjà publié.

## Receipts

Chaque décision, recours et issue de recours crée un receipt compatible avec le contrat `schemas/moderation-receipt.schema.json` :

- catégorie ;
- statement of reasons ;
- règle/base optionnelle ;
- indicateur de signal automatisé ;
- `humanDecision=true` sur les décisions de modération ;
- recours `state=submitted` ;
- issue `upheld / modified / reversed` ;
- chaînage via `previousReceiptId` ;
- identités d'audit pseudonymisées (`moderator:…`, `appellant:…`, `appeals-reviewer:…`).

Un recours `reversed` ne republie qu'un contenu dont l'Abuse Shield reste `passed`; `modified` le replace en `held-for-review`; `upheld` conserve l'état courant.

## Auth0 DEV à prévoir

Pour le rôle de modération DEV :

- activer RBAC sur l'API MODARYX ;
- exposer les permissions dans l'access token ;
- créer/attribuer la permission `community:moderate` au compte de preuve modérateur ;
- créer/attribuer séparément `community:appeals-review` au compte de preuve de revue des recours ;
- refaire un login après chaque changement de rôle afin de créer une session MODARYX contenant les permissions fraîches.

## Preuve ciblée

Checker :

- `qa/check-moderation-publication-engine.mjs`

Marker :

- `PASS_TARGETED_MODERATION_PUBLICATION_ENGINE`

Cette preuve ne vaut ni migration D1 réelle, ni permission Auth0 réelle, ni décision de modération/recours réelle, ni VF.
