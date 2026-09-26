# MODARYX — qualification backend communautaire — 20 septembre 2026

Statut : **EN COURS — qualification technique réalisée, aucun backend connecté**.

## Objectif

Qualifier une architecture de backend communautaire compatible avec :

- l'hébergement Cloudflare actuel ;
- le budget initial minimal / gratuit lorsque possible ;
- profils publics éditables ;
- publication et modération distantes ;
- audit et lutte anti-abus ;
- stockage d'assets et artefacts ;
- évolution future vers comptes/passkeys sans mélanger ce choix avec le pont Nova Forge OS.

Cette qualification ne déploie aucun service, ne crée aucun compte fournisseur, ne modifie aucun secret, DNS ou binding Cloudflare, et ne constitue pas une validation sécurité/juridique finale.

## Architecture candidate A — Cloudflare-native data plane

### Composants

- **Pages Functions / Workers** : API same-origin et logique serveur.
- **D1** : données structurées (profils publics, projets, statuts, signalements, modération, journal d'audit applicatif).
- **R2** : objets/fichiers autorisés, avatars et médias une fois les droits et règles de provenance fermés.
- **Turnstile** : garde anti-bot sur les surfaces exposées.
- éventuellement **Queues / Durable Objects** plus tard si une exigence réelle de séquencement, temps réel ou traitement asynchrone le justifie.

### Motifs

Cette architecture reste dans la même plateforme que Pages et évite d'introduire un second fournisseur pour le data plane communautaire.

Sources officielles consultées le 20 septembre 2026 :

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/turnstile/plans/
- https://developers.cloudflare.com/pages/functions/bindings/

Repères actuels documentés :

- Workers Free : 100 000 requêtes/jour ; Pages Functions suit la tarification Workers.
- D1 Free : 5 millions de lignes lues/jour, 100 000 lignes écrites/jour, 5 Go de stockage total inclus.
- R2 Free : 10 Go-mois de stockage standard, 1 million d'opérations Class A et 10 millions de Class B/mois ; egress Internet gratuit.
- Turnstile Free : gratuit, jusqu'à 20 widgets et challenges illimités ; présenté par Cloudflare comme adapté à la plupart des applications de production.
- Pages Functions peut être lié directement à D1, R2 et d'autres ressources Cloudflare.

### Limites / risques

- l'authentification publique et les passkeys ne sont pas fournies automatiquement par D1/R2 ;
- une implémentation WebAuthn maison serait une surface sécurité sensible et n'est **pas** retenue comme raccourci ;
- les limites Free doivent être instrumentées et les comportements de dépassement doivent rester fail-safe ;
- la modération, l'abus, les appels, la conservation et l'export des données nécessitent encore une politique produit/juridique réelle.

## Architecture candidate B — Supabase intégré

Sources officielles consultées le 20 septembre 2026 :

- https://supabase.com/pricing
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/auth/passkeys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/security/product-security
- https://supabase.com/docs/guides/database/secure-data

Atouts actuels :

- Auth + Postgres + Storage + API dans un même produit ;
- Free : 50 000 MAU, base 500 Mo, stockage fichiers 1 Go, 5 Go d'egress ;
- RLS Postgres pour contrôler les lignes accessibles selon le rôle/utilisateur ;
- Auth par mot de passe, magic link, OTP, OAuth et autres méthodes ;
- support passkeys/WebAuthn disponible en 2026.

Limites importantes :

- les projets Free peuvent être mis en pause après une semaine d'inactivité ;
- le support passkeys est encore **expérimental** : l'API peut changer ;
- le `service_role` / secret ne doit jamais être exposé au frontend car il contourne RLS ;
- une vraie production nécessite migration, tests RLS, rate limits, politique de session/récupération et observabilité.

## Décision technique courante

### Data plane communautaire

**Candidat privilégié : Cloudflare-native.**

Raisons :

1. intégration native avec l'hébergement actuel ;
2. pas de nouveau fournisseur obligatoire pour base/objets/API ;
3. palier Free documenté suffisant pour un démarrage contrôlé ;
4. D1/R2/Turnstile couvrent les briques attendues sans créer de faux backend ;
5. migration progressive possible, capacité par capacité.

### Identité / passkeys

**Reste un blocker séparé.**

Supabase Auth devient un **candidat qualifié** pour l'identité parce qu'il couvre Auth + WebAuthn/passkeys, mais il n'est pas sélectionné comme dépendance VF aujourd'hui :

- passkeys encore expérimentales ;
- politique de session/récupération à définir ;
- contrainte de pause du Free à accepter ou contourner via plan approprié ;
- domaine WebAuthn / RP ID à figer avant tout enrôlement réel.

Aucune implémentation WebAuthn maison n'est retenue par défaut.

## Contrat de sécurité minimal avant connexion

Aucune publication distante ne doit être activée avant d'avoir :

1. identité réelle et sessions sécurisées ;
2. rôles explicites : visiteur / membre / créateur / modérateur / administrateur ;
3. schéma D1 versionné et migrations reproductibles ;
4. séparation public / privé / modération ;
5. journal d'audit immuable au niveau applicatif ou équivalent ;
6. rate limiting / Turnstile sur les surfaces d'abus ;
7. politique de signalement, modération, appel et suppression ;
8. validation des droits médias/fichiers ;
9. règles de rétention/export/suppression des données ;
10. tests allow/deny automatisés ;
11. aucun secret dans le frontend ;
12. fail-closed pour toute action sensible si l'identité ou l'autorisation est indisponible.

## Modèle de données cible — sans déploiement

Entités minimales candidates :

- `accounts` / identité externe référencée, pas dupliquée arbitrairement ;
- `profiles` ;
- `projects` ;
- `project_versions` ;
- `publication_requests` ;
- `moderation_actions` ;
- `reports` ;
- `appeals` ;
- `audit_events` ;
- `asset_refs` pointant vers R2 ou un stockage approuvé ;
- `provenance_refs` pour SHA-256 / signature / attestations lorsqu'elles existent.

Ce modèle reste **contractuel**. Il ne doit pas être présenté comme déployé.

## Condition de fermeture du blocker

Le statut backend communautaire ne peut passer à TERMINÉ que lorsque :

- le fournisseur/data plane est explicitement approuvé ;
- l'identité choisie est réellement connectée ;
- migrations et politiques d'accès sont versionnées ;
- permissions et tests allow/deny sont verts ;
- modération / signalement / appel / audit sont prouvés ;
- stockage et droits des médias sont prouvés ;
- les limites de quota, erreurs et mode dégradé sont testés ;
- les exigences légales/confidentialité sont validées.

La qualification technique seule ne ferme donc pas le backend.
