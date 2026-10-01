# MODARYX — Autorité Fondateur / Administrateur — 21 septembre 2026

Statut : **CODE CIBLÉ EN COURS DE PREUVE — attribution Auth0 réelle restante**.

## Objectif

Fournir à MODARYX une hiérarchie d'autorité explicite sans confondre privilèges du produit et secrets d'infrastructure.

## Permissions racines

- `modaryx:founder` : autorité maximale MODARYX sur les permissions produit actuellement connues.
- `modaryx:admin` : administration courante MODARYX.
- `administration:access` : accès à la surface d'administration produit.
- `community:moderate` : modération / publication.
- `community:appeals-review` : revue des recours.

## Héritage serveur

Le Fondateur hérite actuellement :
- administration produit ;
- modération / publication ;
- revue des recours.

L'Administrateur hérite actuellement :
- administration produit ;
- modération / publication ;
- revue des recours.

L'héritage est calculé côté serveur par `functions/_lib/access-control.mjs`.
Une permission inconnue n'est **pas** accordée automatiquement, même au Fondateur. Les futurs privilèges sensibles devront être ajoutés explicitement au registre du produit.

## Frontière infrastructure

Le compte web Fondateur/Administrateur ne reçoit jamais automatiquement :
- secrets Cloudflare ;
- secrets GitHub ;
- DNS / DNSSEC / nameservers ;
- secret Auth0 ;
- clés WeatherAPI ;
- clés privées de signature ;
- secrets de services tiers.

Ces éléments restent hors de la session web et hors de la réponse `/api/v1/auth/session`.

## Session / UI

`GET /api/v1/auth/session` expose uniquement un résumé d'autorité :
- rôle ;
- niveau ;
- capacités booléennes administration / modération / recours.

Les permissions brutes et secrets ne sont pas exposés par cette surface.

La console Profils affiche le rôle confirmé par le backend :
- Fondateur ;
- Administrateur ;
- Modérateur ;
- Reviewer recours ;
- Membre.

## Attribution réelle restante

Pour fermer réellement ce lot sur le compte du propriétaire :
1. créer les permissions `modaryx:founder` et `modaryx:admin` dans l'API Auth0 MODARYX DEV ;
2. attribuer `modaryx:founder` au compte Fondateur réel ;
3. refaire un login pour renouveler les permissions dans la session MODARYX ;
4. prouver côté Preview que `/api/v1/auth/session` retourne `authority.role=founder` ;
5. prouver une action modération et une action recours avec cette session ;
6. conserver la réauthentification récente pour les actions sensibles ;
7. ne jamais confondre cette preuve DEV avec production.

Aucun compte réel n'est promu par le seul code de cette branche.

## Preuves ciblées

- `qa/check-auth-bff.mjs`
- `qa/check-moderation-publication-engine.mjs`
- `qa/check-profiles-account-ui.cjs`

Markers attendus :
- `PASS_TARGETED_AUTH_BFF_SESSION`
- `PASS_TARGETED_MODERATION_PUBLICATION_ENGINE`
- `PASS_TARGETED_PROFILES_ACCOUNT_UI`

Aucune VF / aucun 100 % déclaré.
