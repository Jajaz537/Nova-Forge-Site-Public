# MODARYX V2 — inventaire statique cookies / stockage / traceurs — 2026-10-08

**Statut : EN COURS — inventaire source statique, validation runtime production PREUVE MANQUANTE**

Périmètre revu :
- client V2 actuel ;
- service worker V2 ;
- backend auth/RUM/Turnstile/météo directement relié au client ;
- HEAD source : `c331966fb7e01c7b2b340f4c411160f98db5da77`.

Cet inventaire ne constitue ni une privacy notice finale ni une qualification juridique finale.

## 1. Cookie de session first-party

Nom observé :
`modaryx_session`.

Source :
`functions/_lib/auth-session.mjs`.

Attributs :
- `Path=/`
- `HttpOnly`
- `Secure`
- `SameSite=Lax`
- `Max-Age` configurable.

Durée :
- défaut code : **8 heures** ;
- borne basse : **15 minutes** ;
- borne haute : **7 jours** ;
- configuration production réelle : **PREUVE MANQUANTE**.

Le token brut est envoyé au navigateur ; côté base, le code stocke un hash SHA-256 de session.

Classification candidate :
**strictement nécessaire à l'authentification si l'auth production est activée**, à confirmer dans la documentation finale.

## 2. Local Storage — migration fonctionnelle

Source :
`v2/src/storage-migration.js`.

Le client appelle :
`migrateLegacyBrowserState(window.localStorage)`.

Clés V2 observées :
- `modaryx:v2:favorites`
- `modaryx:v2:saved-searches`
- `modaryx:v2:creator-draft`
- `modaryx:v2:collection-drafts`
- `modaryx:v2:community-draft`
- `modaryx:v2:preferences`
- `modaryx:v2:migration:v1`

Anciennes clés relues pour migration non destructive :
- `nova-forge:catalog:favorites:v1`
- `nova-forge:catalog:saved-views:v1`
- `nova-forge:creator:draft:v1`
- `nova-forge:creator:draft:v2`
- `nova-forge:community:collection:v1`
- `nova-forge:community:submission:v1`
- `nova_site_shell_preferences_v1`

La migration :
- ne supprime pas les anciennes valeurs ;
- conserve les données invalides/non mappables ;
- écrit un reçu de migration ;
- reste fail-soft si le stockage est refusé.

Classification :
**stockage fonctionnel local**, pouvant contenir préférences, favoris, recherches et brouillons utilisateur.

Règles finales de durée, export et suppression : **PREUVE MANQUANTE**.

## 3. Cache Storage / PWA

Sources :
- `v2/src/pwa-registration.js`
- `v2/public/sw-v2.js`

Gate de production :
`VITE_MODARYX_PWA_PRODUCTION === "1"`.

Par défaut, sans cette gate :
**aucun service worker V2 n'est enregistré**.

Cache observé :
`modaryx-v2-candidate-shell-v1`.

Périmètre :
- shell same-origin ;
- navigation same-origin ;
- assets sous `/assets/` ;
- suppression explicite d'un ancien cache connu.

Le service worker ignore les requêtes cross-origin.

Classification :
**Cache Storage fonctionnel PWA**, pas un tracker publicitaire.

Activation production réelle : **PREUVE MANQUANTE**.

## 4. Field CWV / RUM first-party

Sources :
- `v2/src/main.jsx`
- `v2/src/cwv-rum.js`
- `functions/_lib/cwv-rum.mjs`
- `functions/api/v1/rum/cwv.js`.

Le client ne charge la collecte que si :
`VITE_MODARYX_FIELD_CWV === "1"`.

Le backend possède en plus sa propre gate :
`MODARYX_CWV_RUM_ENABLED`.

Le code documente explicitement cette **double gate**.

Le collecteur respecte :
- `navigator.doNotTrack === "1"`
- `navigator.globalPrivacyControl === true`.

Payload observé :
- `pageViewId` aléatoire 128 bits, non persistant observé ;
- classe de route ;
- classe de viewport ;
- type de navigation ;
- LCP ;
- INP ;
- CLS.

Envoi :
- endpoint first-party `/api/v1/rum/cwv` ;
- `sendBeacon` si disponible ;
- fallback `fetch` ;
- `credentials:"omit"` ;
- `cache:"no-store"`.

Aucun URL/referrer brut n'est observé dans ce payload.

État :
- architecture minimisée : **TERMINÉ**
- collecte production réelle : **PREUVE MANQUANTE**
- base juridique / éventuelle exemption de consentement : **LEGAL_REVIEW_REQUIRED**
- politique de rétention finale : **PREUVE MANQUANTE**

## 5. Cloudflare Turnstile

Sources :
- `v2/src/components/TurnstileWidget.jsx`
- `v2/src/components/GameSupportRequestPanel.jsx`
- `functions/_lib/turnstile.mjs`.

Script tiers observé :
`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`.

Vérification serveur :
`https://challenges.cloudflare.com/turnstile/v0/siteverify`.

Le widget de demande de support n'est rendu que si :
- utilisateur authentifié ;
- écriture distante réellement prête ;
- clé de site Turnstile fournie.

Sinon la surface reste fail-closed sans faux envoi réel.

Classification candidate :
**anti-abus / sécurité conditionnelle**.

Privacy/DPA/qualification cookies-stockage réelle de Turnstile en production :
**LEGAL_REVIEW_REQUIRED / PREUVE MANQUANTE**.

## 6. Auth0

Sources :
- `functions/_lib/auth0.mjs`
- endpoints `/api/v1/auth/*`.

L'issuer Auth0 est configurable par environnement.
Aucun domaine Auth0 production n'est canonique dans ce registre.

Le login distant n'est disponible que si les bindings nécessaires sont réellement configurés.

État production :
**PREUVE MANQUANTE**.

Avant activation :
- DPA ;
- région/transferts ;
- logs/rétention ;
- MFA/récupération ;
- sous-traitants ;
- accessibilité ;
- suppression/export ;
- configuration cookie/session finale.

## 7. Contexte saison/météo

Sources :
- `v2/src/api/local-context.js`
- `functions/api/local-context.js`.

Mode météo par défaut :
`MODARYX_WEATHER_MODE = off`.

Providers candidats observés :
- WeatherAPI ;
- Open-Meteo non-commercial ;
- Open-Meteo commercial.

Le navigateur appelle seulement l'endpoint first-party `/api/local-context`.

Le backend dérive un contexte grossier depuis les métadonnées Cloudflare et documente :
- coordonnées exactes non retournées ;
- ville non retournée ;
- code postal non retourné ;
- permission GPS navigateur non demandée ;
- coordonnées provider arrondies à **0,1°** si un provider météo est activé.

Provider/terms/privacy commerciaux finaux :
**PREUVE MANQUANTE**.

## 8. Absences observées dans le périmètre statique revu

Aucune utilisation observée dans le périmètre V2/auth/RUM/PWA revu de :
- `sessionStorage` ;
- `IndexedDB` ;
- écriture client via `document.cookie` ;
- Google Analytics / `gtag` ;
- SDK publicitaire ;
- pixel marketing ;
- tracker tiers marketing.

Cette conclusion est **statique et limitée au HEAD/périmètre revu**.
Elle ne remplace pas :
- un scan du bundle final ;
- une observation réseau navigateur ;
- une validation production.

## 9. Tableau de readiness

| Mécanisme | Type | État code | État production | Qualification finale |
|---|---|---|---|---|
| `modaryx_session` | cookie auth first-party | TERMINÉ | PREUVE MANQUANTE | LEGAL_REVIEW_REQUIRED |
| localStorage V2 | fonctionnel local | TERMINÉ | candidat actuel | durées/droits PREUVE MANQUANTE |
| Cache Storage PWA | fonctionnel/offline | TERMINÉ | désactivé par défaut | à documenter si activé |
| CWV RUM | mesure performance first-party | TERMINÉ candidat | OFF par défaut | LEGAL_REVIEW_REQUIRED |
| Turnstile | anti-abus tiers | TERMINÉ candidat | conditionnel | LEGAL_REVIEW_REQUIRED |
| Auth0 | identité tiers | TERMINÉ candidat | PREUVE MANQUANTE | LEGAL_REVIEW_REQUIRED |
| météo | contexte tiers server-side | candidat | OFF par défaut | provider/terms PREUVE MANQUANTE |

## 10. Prochaine preuve nécessaire

Avant privacy/cookies final :
1. build/release SHA final ;
2. scan bundle statique ;
3. observation réseau navigateur sur production candidate ;
4. inventaire cookies/storage runtime ;
5. providers réellement activés ;
6. durées réelles ;
7. base juridique/consentement ;
8. retrait/refus ;
9. DPA/transferts ;
10. revue juridique.

Aucun CMP, analytics, PWA, Auth0, météo ou provider production n'est activé par ce document.
