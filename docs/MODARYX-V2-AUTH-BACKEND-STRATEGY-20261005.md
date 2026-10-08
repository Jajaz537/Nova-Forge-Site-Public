# MODARYX V2 — Stratégie auth + backend de production

**Date : 2026-10-05**  
**Statut : TERMINÉ — stratégie définie / services production non activés**

## 1. Objectif

Définir la stratégie V2 sans prétendre qu'un backend production, un tenant fournisseur, des passkeys ou des données réelles sont déjà actifs.

Cette décision ne modifie ni DNS, ni DNSSEC, ni nameservers, ni configuration Cloudflare critique, ni `main`.

## 2. Architecture retenue

### Frontend / BFF

- frontend V2 isolé du legacy ;
- appels same-origin vers un BFF/API MODARYX ;
- autorité serveur pour les écritures, rôles, modération et droits ;
- aucun secret fournisseur dans le navigateur ;
- aucun access token Auth0 persisté côté client.

### Identité

Conserver le modèle déjà préparé dans le dépôt :

- Auth0 **Regular Web Application** ;
- New Universal Login ;
- Authorization Code + PKCE S256 ;
- callback serveur ;
- session MODARYX propre, cookie **HttpOnly + Secure + SameSite=Lax** ;
- token de session stocké côté serveur uniquement sous forme hashée ;
- redirection V2 vers `/account`, jamais vers l'ancien fallback `/profiles`.

Les passkeys restent conduites par Auth0 Universal Login. MODARYX n'implémente pas un WebAuthn maison dans le frontend.

### Données

- Cloudflare D1 comme base transactionnelle serveur pour comptes, sessions, communautés, modération et données V2 compatibles ;
- schémas V1 conservés pour compatibilité ;
- nouvelles structures V2 versionnées, sans mutation silencieuse des routes/API V1 ;
- migrations séquentielles et rollback documenté avant production.

### Artefacts

- R2 pour artefacts/provenance uniquement lorsqu'un artefact est explicitement autorisé ;
- identité SHA-256 obligatoire ;
- pas de distribution si droits/provenance/manifestes sont incomplets.

### Anti-abus

- Turnstile côté serveur pour écritures distantes à risque ;
- validation fail-closed ;
- hostname/action bornés ;
- aucun secret Turnstile exposé.

## 3. API V2

La V2 ne change pas silencieusement `/api/v1`.

Deux chemins sont autorisés :

1. adapter V2 vers une route V1 lorsque son contrat est réellement suffisant ;
2. route `/api/v2/*` lorsqu'un modèle V2 exige une sémantique différente.

Les adapters restent framework-agnostic.

## 4. Sessions et permissions

- permissions racines vérifiées côté serveur ;
- séparation autorité plateforme / rôles Creator-Team ;
- réauthentification des actions privilégiées ;
- révocation de session ;
- durée de session bornée ;
- returnTo strictement same-origin et allowlisté.

## 5. Passkeys

Préconditions production :

- New Universal Login ;
- Identifier First ;
- passkeys actives sur la database connection MODARYX dédiée ;
- aucune Custom Login Page incompatible ;
- récupération de compte définie ;
- preuve réelle appareil/provider : enrôlement → logout → login passkey → récupération → révocation.

Avant cette preuve, le gate `auth-passkeys-real` reste OPEN.

## 6. Environnements

Ordre obligatoire :

1. DEV isolé ;
2. migrations DEV ;
3. bindings D1/R2 DEV ;
4. Auth0 DEV ;
5. Turnstile DEV ;
6. preview SHA-bound ;
7. micro-proofs login/session/write/modération ;
8. seulement ensuite préparation production.

Aucune ressource production n'est créée par ce document.

## 7. États de vérité

- code/backend foundation existant : **RÉUTILISABLE / À ADAPTER** ;
- stratégie auth/backend V2 : **DÉFINIE** ;
- backend production réel : **NON PROUVÉ** ;
- auth réelle production : **NON PROUVÉE** ;
- passkey réelle : **NON PROUVÉE** ;
- données réelles : **NON PROUVÉES**.

## 8. Conséquence pour la sélection de stack

Le prérequis `AUTH_BACKEND_STRATEGY_DEFINED` est désormais satisfait par cette stratégie.

Cela **ne sélectionne aucune stack**. Les autres prérequis du gate restent indépendants, notamment validation humaine, tree testing, comparaison visuelle normalisée et budget bundle mesuré.

## 9. Sources repo

Cette stratégie consolide sans les contredire :

- `docs/MODARYX-V2-CODE-AUDIT-PHASE4-BACKEND-20261003.md` ;
- `qa/MODARYX-BACKEND-DEV-PROVISIONING-20260920.md` ;
- `qa/MODARYX-PASSKEY-PROVIDER-READINESS-20260921.md` ;
- `functions/_lib/backend-config.mjs`.

**État : TERMINÉ pour la stratégie / implémentation production toujours BLOQUÉE par preuves réelles.**
