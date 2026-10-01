# MODARYX — préparation finale passkeys Provider DEV — 21 septembre 2026

Statut : **TERMINÉ — préparation source ciblée ; cérémonie réelle appareil/provider encore EN COURS**.

## Base réellement acquise

Le Provider DEV Auth0 est déjà actif pour MODARYX : login/callback/session BFF, D1 et profils sont prouvés. Le navigateur ne stocke pas l'access token fournisseur ; la session MODARYX reste HttpOnly et same-origin.

## Contrat passkey retenu

MODARYX conserve le flux Auth0 **New Universal Login** au lieu d'implémenter WebAuthn maison dans le frontend.

Pour la passkey réelle, les prérequis fournisseur à vérifier au moment de l'activation DEV sont :

- New Universal Login actif ;
- profil d'authentification **Identifier First** ;
- passkeys activées sur la database connection dédiée à MODARYX ;
- aucune Custom Login Page incompatible avec ce flux ;
- récupération de compte définie avant fermeture du blocker.

Références officielles Auth0 consultées le 21 septembre 2026 :

- https://developer.auth0.com/resources/labs/authentication/passkeys
- https://support.auth0.com/center/s/article/Passkeys-are-only-available-in-the-Identifier-First-flow
- https://support.auth0.com/center/s/article/enable-passkey-for-specific-app
- https://support.auth0.com/center/s/article/Understanding-How-Passkeys-and-Face-ID-Work-Together-in-Auth0

## Ce qui est protégé dans la source

- aucun flux WebAuthn maison côté MODARYX ;
- aucune clé privée demandée ou stockée ;
- les passkeys sont représentées uniquement comme credentials publics avec états `active | revoked` ;
- récupération explicite et bornée ;
- changement de credentials, récupération et révocation de session restent des actions privilégiées avec réauthentification ;
- la détection WebAuthn locale ne prétend jamais qu'une passkey existe ou qu'une connexion a réussi ;
- l'entrée de connexion MODARYX reste Universal Login / Authorization Code + PKCE via le BFF.

## Micro-proof source

Checker : `qa/check-passkey-provider-readiness.cjs`

Marker : `PASS_TARGETED_PASSKEY_PROVIDER_READINESS`

Le checker ne prétend pas qu'une vraie passkey a été créée. Il prouve uniquement que la source MODARYX est préparée pour laisser Auth0 conduire la cérémonie sans dupliquer ni affaiblir le modèle de sécurité.

## Handoff minimal restant

Une seule intervention fournisseur DEV doit suffire pour :

1. vérifier New Universal Login ;
2. vérifier Identifier First ;
3. activer les passkeys sur la database connection MODARYX DEV dédiée ;
4. vérifier qu'aucune Custom Login Page incompatible n'est active ;
5. confirmer le parcours de récupération prévu.

La fermeture finale exige ensuite une **vraie cérémonie sur appareil approprié** :

- créer/enrôler une passkey ;
- se déconnecter ;
- se reconnecter avec cette passkey ;
- prouver le comportement de récupération ;
- renommer/révoquer la passkey si la capacité fournisseur est disponible ;
- vérifier qu'une passkey révoquée n'est plus utilisable.

Cette preuve appareil/provider reste **EN COURS** et ne doit pas être simulée.
