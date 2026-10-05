# MODARYX V2 — Audit exhaustif anti-contamination — Phase 4 Backend Functions

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre

Inspecté :

- `functions/_lib/*.mjs`
- `functions/api/local-context.js`
- `functions/api/v1/**`

Le backend est nettement moins contaminant visuellement que le frontend V1 : il ne transporte pas de CSS ni de renderer UI. En revanche, certains contrats, routes et noms restent hérités de V1.

## 2. Classification générale

### RÉUTILISABLE après tests

- `api-security.mjs`
- `artifact-trust.mjs`
- `attestation.mjs`
- `trusted-signers.mjs`
- `storage-transport.mjs`
- `storage-repair-engine.mjs`
- `storage-repair-orchestrator.mjs`
- `turnstile.mjs`
- `integration-consent.mjs`
- `integration-discovery.mjs`

Ces modules sont principalement des contrats/domain logic et ne dépendent pas du DOM V1.

### À EXTRAIRE / ADAPTER POUR V2

- `auth-session.mjs`
- `auth0.mjs`
- `backend-config.mjs`
- `remote-write.mjs`
- `moderation.mjs`
- `local-context.mjs`
- `access-control.mjs`

Ils restent utiles mais certains defaults, routes, états ou modèles sont V1.

## 3. Access control

Permissions MODARYX observées :

- `modaryx:founder`
- `modaryx:admin`
- `administration:access`
- `community:moderate`
- `community:appeals-review`

### Bon point

L'autorité est calculée côté backend à partir des permissions.

### Risque V2

Le rôle `founder`/admin est un concept de plateforme, pas d'équipe créateur.

### Décision

**RÉUTILISABLE** avec séparation stricte entre :
- autorité plateforme ;
- rôle Creator/Team.

## 4. API security

`api-security.mjs` fournit :

- JSON no-store ;
- nosniff ;
- referrer-policy ;
- CORP same-origin ;
- same-origin check ;
- JSON bounded ;
- lecture IP Cloudflare limitée.

### Classification

**RÉUTILISABLE**

Aucune dépendance au frontend V1.

## 5. Auth session / Auth0

Forces :

- PKCE ;
- state hashé ;
- session token hashé ;
- cookie HttpOnly/Secure/SameSite=Lax ;
- TTL borné ;
- JWT RS256 vérifié avec JWKS ;
- audience/issuer/expiry/nbf/sub vérifiés.

### Finding V1

`safeReturnTo()` utilise `/profiles` comme fallback.

Les endpoints login/callback renvoient vers :
- `/profiles`
- `/profiles?auth=...`

### Risque

Le backend d'auth ne doit pas figer une route V1.

### Décision

Auth logic → **RÉUTILISABLE / À ADAPTER**

V2 devra utiliser une route compte explicite, par exemple `/account` ou celle validée par IA, sans modifier v1 en place tant que les consumers historiques existent.

## 6. Backend config

`backendState()` annonce :

- `stage: dev-foundation`
- D1 / R2 bindings
- Auth0 state
- Turnstile state
- `remoteWritesReady`

### Risque

Ne pas afficher `dev-foundation` comme état production V2.

### Classification

**À ADAPTER**

Le V2 status contract devra séparer :
- environment ;
- readiness ;
- feature capabilities.

## 7. Local context / météo

Forces :

- coordonnées Cloudflare arrondies à 0.1° ;
- aucune coordonnée exacte retournée ;
- timezone/climate band ;
- provider off par défaut ;
- timeout ;
- Open-Meteo / WeatherAPI normalisés ;
- disclaimer WeatherAPI.

### Risque

`/api/local-context` est déjà très utile, mais le produit doit garder le contexte réel optionnel et fail-soft.

### Classification

`local-context.mjs` → **RÉUTILISABLE COMME DOMAIN LOGIC**

`functions/api/local-context.js` → **RÉUTILISABLE APRÈS REVALIDATION PRIVACY/PROVIDER**

Aucune permission GPS n'est requise par ce code.

## 8. Integration Guide / Nova Forge OS bridge

Forces :

- consentement explicite ;
- moindre privilège ;
- aucune session partagée ;
- aucun credential forwarding ;
- découverte bornée ;
- timeout ;
- remote host protection ;
- loopback explicitement géré pour le pont local ;
- protocole versionné.

### Séparation produit

Le contrat bridge déclare explicitement :
- sourceProduct = `modaryx-web`
- targetProduct = `nova-forge-os`

### Classification

**RÉUTILISABLE**

Il respecte la séparation officielle MODARYX / Nova Forge OS.

## 9. Artifact trust / signatures

Forces :

- SHA-256 strict ;
- taille vérifiée ;
- path relatif same-origin contrôlé ;
- signature state stricte ;
- attestation vérifiée ;
- trust store ;
- key revocation ;
- public JWK uniquement ;
- private key fields interdits.

### Classification

**RÉUTILISABLE**

À reconnecter au modèle V2 Release/FileArtifact, sans changer ses garanties.

## 10. Storage Resolver / Repair

Forces :

- HTTPS uniquement ;
- protection SSRF basique private/loopback ;
- redirect error ;
- taille bornée ;
- digest exact ;
- immutable identity ;
- pas de substitution silencieuse ;
- withdrawn/revoked skip network ;
- repair uniquement vers digest attendu.

### Classification

**RÉUTILISABLE**

À adapter au futur FileArtifact/Release model.

## 11. Moderation

Forces :

- same-origin pour writes ;
- session réelle ;
- permissions serveur ;
- re-auth récente possible ;
- décisions et appels séparés ;
- receipts chaînés ;
- actor key hashé ;
- publication/distribution séparée.

### Finding V1

Le modèle est centré sur :
- discussion ;
- review ;
- comment.

Il ne couvre pas encore tous les objets V2 pouvant être signalés :
- content item ;
- release ;
- file ;
- collection ;
- profile ;
- team.

### Classification

**RÉUTILISABLE / À ÉTENDRE**

Ne pas remplacer le moteur : l'étendre versionné.

## 12. Remote writes / Profiles

Le backend profile stocke encore :

- `collections_json` directement dans `modaryx_profiles`
- `creator_is_creator`
- `creator_display_label`

### Risque

V2 a séparé :
- Account
- Public Profile
- Creator
- Team
- Collection

Le profil ne doit plus être l'agrégat de toutes ces notions.

### Classification

`remote-write.mjs` / profile endpoints → **À ADAPTER / V1 COMPAT**

## 13. Routes API v1

Routes observées :

- `/api/v1/auth/*`
- `/api/v1/profile`
- `/api/v1/profiles/:handle`
- `/api/v1/community/*`
- `/api/v1/moderation/*`
- `/api/v1/status`

### Décision

**Ne pas casser v1.**

V2 peut :
- continuer à consommer v1 si contrat suffisant ;
- ou introduire une API v2 séparée.

Aucun changement de sémantique silencieux dans `/api/v1`.

## 14. API public profile

### Finding

Le endpoint public renvoie encore :

- `collections` depuis `collections_json`

### Risque

La relation Profile ↔ Collections est trop compacte et peut devenir incohérente avec le modèle V2.

### Décision

V1 reste intact.

V2 doit récupérer les collections depuis un modèle dédié.

## 15. Community public API

Forces :

- seulement abuse passed ;
- moderation accepted ;
- publication published ;
- profil privé masqué ;
- cache court.

### Classification

**RÉUTILISABLE COMME CONTRAT V1**

À étendre séparément si V2 ajoute Questions/Support/Studios comme types distincts.

## 16. Statut backend

`/api/v1/status` retourne :
- bindings ;
- Auth0 readiness ;
- Turnstile readiness ;
- remoteWritesReady ;
- aucune secret.

### Classification

**RÉUTILISABLE POUR DIAGNOSTIC V1**

Ne pas confondre “configured” avec “fonction utilisateur validée”.

## 17. Risques anti-contamination backend

Contrairement au CSS/JS V1, le backend ne peut pas “repeindre” la V2.

Les risques sont plutôt :

1. V1 routes figées dans redirects auth ;
2. modèle Profile trop agrégé ;
3. API v1 sémantiquement trop compacte ;
4. stage DEV affiché comme production ;
5. anciens noms de schéma Nova Forge ;
6. Community limitée à discussion/review/comment ;
7. consumers V2 qui supposeraient des capabilities non prouvées.

## 18. Règle V2

- ne pas modifier v1 en place ;
- créer adapters/mappers ;
- centraliser clients V2 ;
- versionner nouvelles routes/contrats ;
- conserver fail-closed ;
- conserver permissions serveur ;
- conserver consentement explicite ;
- conserver séparation MODARYX / Nova Forge OS.

**État Phase 4 : TERMINÉ pour `functions/`. Audit global : EN COURS.**
