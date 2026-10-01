# MODARYX — UI communauté distante — 20 septembre 2026

Statut : **UI DISTANTE CIBLÉE ACQUISE EN CODE — SERVICE TOUJOURS NON PROVISIONNÉ**.

## Principe

Le mode brouillon local reste le comportement de base et conserve ses propres garanties :

- stockage local ;
- export JSON ;
- import local ;
- aucun auteur distant inventé ;
- aucune publication distante implicite.

Une seconde voie, explicitement séparée, peut envoyer un brouillon validé vers la file de modération lorsque les services réels sont disponibles.

## Conditions d'activation

La voie distante exige :

- backend MODARYX same-origin ;
- D1 ;
- Auth0 BFF réellement configuré ;
- session authentifiée ;
- Turnstile site key + secret ;
- token Turnstile valide.

Sans ces conditions, le bouton reste désactivé.

## Envoi

Endpoint :

`POST /api/v1/community/submissions`

Action Turnstile :

`community-write`

Le payload distant est reconstruit depuis le brouillon local validé et ne transporte pas les états locaux `local-only/local-draft/not-submitted`.

Réponse attendue :

- `moderationState = pending`
- `publicationState = received`
- `distributable = false`

L'interface présente explicitement :

**Reçue pour modération · NON PUBLIÉE**

## Séparation local / distant

Un échec réseau ne supprime ni ne requalifie le brouillon local.

Un envoi non confirmé n'est jamais affiché comme publié.

Aucun token Auth0 n'est manipulé par la page Communauté.

## Turnstile

Le script officiel est chargé dynamiquement uniquement après confirmation de la configuration backend.

Origine autorisée par CSP :

`https://challenges.cloudflare.com`

## Preuves

Source :
- `qa/check-community-remote-ui.cjs`
- marker `PASS_TARGETED_COMMUNITY_REMOTE_UI`

Browser :
- `qa/check-catalog-community-states.mjs`
- marker `PASS_TARGETED_CATALOG_COMMUNITY_STATES`

En preview statique, la preuve exige que la voie distante reste fail-closed et que les brouillons locaux continuent de fonctionner.
