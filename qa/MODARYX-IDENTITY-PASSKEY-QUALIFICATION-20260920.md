# MODARYX — qualification identité & passkeys — 20 septembre 2026

Statut : **EN COURS — candidat privilégié qualifié, aucune identité connectée**.

## Objectif

Qualifier une solution d'identité publique compatible avec :

- comptes réels ;
- sessions sécurisées ;
- passkeys/WebAuthn ;
- récupération de compte ;
- domaine de connexion stable ;
- intégration avec le data plane communautaire Cloudflare-native ;
- budget initial raisonnable ;
- séparation stricte avec Nova Forge OS.

Cette qualification ne crée aucun tenant fournisseur, ne configure aucun domaine, callback, secret, session ou passkey réelle.

## Candidats étudiés

### Auth0 — candidat privilégié, non connecté

Sources officielles consultées le 20 septembre 2026 :

- https://auth0.com/pricing
- https://auth0.com/docs/authenticate/database-connections
- https://auth0.com/docs/authenticate/login/auth0-universal-login/universal-experience
- https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first

Repères documentés :

- Free : jusqu'à 25 000 MAU ;
- 1 domaine personnalisé inclus sur le Free, avec vérification de carte indiquée par la page tarifaire pour cette fonctionnalité ;
- authentification passwordless incluant passkeys ;
- protection de base contre les attaques ;
- passkeys disponibles sur les database connections ;
- flux passkey lié à Universal Login / Identifier First.

Avantages pour MODARYX :

- passkeys non présentées comme expérimentales dans la documentation courante ;
- user store géré ;
- séparation nette entre identité et D1/R2 ;
- domaine personnalisé possible pour stabiliser le WebAuthn RP/origin avant enrôlement ;
- possibilité de commencer sans coût mensuel dans le quota Free documenté.

Limites / décisions requises :

- le flux d'authentification devra respecter les contraintes Universal Login / Identifier First ;
- la personnalisation visuelle devra être évaluée contre la cible Premium HD ;
- le domaine WebAuthn devra être figé avant toute passkey réelle ;
- callback/logout URLs, rotation des secrets, récupération, export/suppression, journaux et abus restent à concevoir ;
- le Free n'est pas une garantie de capacité ou SLA pour la VF ;
- les conditions contractuelles et confidentialité doivent être revérifiées au moment de l'activation.

### WorkOS AuthKit — très fort quota, non privilégié à ce stade

Sources :

- https://workos.com/docs/authkit/environments
- https://workos.com/docs/authkit/passkeys
- https://workos.com/docs/custom-domains

Constats :

- AuthKit gratuit jusqu'à 1 million de MAU selon la documentation actuelle ;
- production exige l'ajout d'informations de facturation ;
- passkeys supportées ;
- passkeys actuellement disponibles avec l'UI hébergée AuthKit ;
- custom domains proposés en production mais documentés comme service payant.

Pourquoi non privilégié :

- dépendance UI hébergée plus forte pour les passkeys ;
- coût/custom-domain moins aligné avec le besoin de branding Premium HD sans décision budgétaire explicite.

### Clerk — bon DX, mais passkeys production hors cible gratuite actuelle

Sources :

- https://clerk.com/pricing
- https://clerk.com/docs/guides/development/custom-flows/authentication/passkeys

Constats :

- Hobby Free jusqu'à 50 000 MRU/app ;
- custom domain inclus dans le Hobby ;
- APIs et UI préconstruites ;
- support passkeys complet dans la documentation.

Limite structurante :

- la documentation tarifaire 2026 de Clerk classe les passkeys de production parmi les capacités Pro ; ne pas supposer leur disponibilité VF gratuite.

### Supabase Auth — candidat secondaire, passkeys encore expérimentales

Sources :

- https://supabase.com/pricing
- https://supabase.com/docs/guides/auth/passkeys

Constats :

- Free : 50 000 MAU ;
- passkeys/WebAuthn disponibles ;
- support passkeys encore explicitement **expérimental** ;
- projets Free susceptibles d'être mis en pause après une semaine d'inactivité.

Conséquence :

- pertinent pour développement/évaluation ;
- non privilégié pour une VF passkeys tant que l'API reste expérimentale et que la stratégie uptime n'est pas acceptée.

## Décision technique courante

### Identité publique

**Candidat privilégié : Auth0, non connecté.**

Cette décision est une qualification, pas une sélection contractuelle définitive.

### Data plane

Reste séparé :

- Pages Functions / Workers ;
- D1 ;
- R2 ;
- Turnstile.

L'identifiant fournisseur devient une référence externe dans les données communautaires ; les credentials et données d'authentification ne doivent pas être répliqués arbitrairement dans D1.

## Contrat minimal d'intégration

Avant toute connexion réelle :

1. figer le domaine d'authentification / RP ID ;
2. créer tenant de développement séparé de production ;
3. définir callbacks, logout URLs et origines autorisées ;
4. définir création de compte primaire : email/passwordless/social selon décision produit ;
5. activer passkeys uniquement après premier compte vérifié si le fournisseur l'exige ;
6. définir récupération de compte avant lancement ;
7. définir politique session, expiration, révocation et appareils perdus ;
8. définir mapping minimal `identity_subject -> profile_id` côté MODARYX ;
9. ne stocker aucun secret fournisseur dans le frontend ;
10. protéger les opérations sensibles par vérification serveur des tokens ;
11. conserver un mode fail-closed pour publication/modération si l'identité est indisponible ;
12. tester allow/deny : utilisateur A ne peut jamais modifier les ressources privées de B ;
13. tester suppression/export et révocation ;
14. prouver une cérémonie passkey réelle sur Windows/Android/iOS/macOS appropriés avant VF ;
15. valider juridiquement fournisseur, politique de confidentialité et rétention.

## Condition de fermeture du blocker

Le statut `Comptes / authentification / passkeys réels` ne peut passer à TERMINÉ que lorsque :

- le fournisseur est explicitement approuvé ;
- tenant dev + prod contrôlés existent ;
- domaine/callbacks sont configurés ;
- session et récupération sont prouvées ;
- passkey réelle enregistrée, utilisée, renommée/révoquée selon capacités fournisseur ;
- rôle/claims et intégration D1 sont testés ;
- abus/rate limits et erreurs sont testés ;
- export/suppression et confidentialité sont validés ;
- preuves navigateur/appareil appropriées sont acquises.

La qualification fournisseur seule ne ferme donc pas le blocker.
