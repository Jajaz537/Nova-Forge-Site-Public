# MODARYX V2 — Policy CSP, headers et rich text

**Date : 2026-10-03**
**Statut : TERMINÉ — conception sécurité, aucun header public modifié**

## 1. Objectif

Définir une baseline sécurité V2 avant le premier runtime, sans modifier le fichier public `_headers` actuel.

Le header set V1 contient déjà :
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-Frame-Options: SAMEORIGIN
- HSTS
- Permissions-Policy camera/microphone/geolocation désactivés
- CSP limitée à `upgrade-insecure-requests`

La V2 devra aller plus loin avec une policy dédiée.

## 2. CSP V2 — stratégie

Commencer en **Report-Only** sur preview avant enforcement production.

Objectifs :
- bloquer scripts inline non autorisés ;
- bloquer styles/assets non allowlistés ;
- limiter connexions réseau ;
- limiter frames ;
- éviter legacy assets V1 ;
- préserver les providers explicitement requis.

## 3. Directives minimales proposées

### default-src
`'self'`

### base-uri
`'self'`

### object-src
`'none'`

### frame-ancestors
`'self'` ou `'none'` selon besoins d'intégration futurs.

### script-src
`'self'`

Aucun `unsafe-inline` par défaut.

Si un framework exige des scripts inline :
- préférer nonce/hash ;
- documenter le besoin ;
- ne pas ouvrir globalement.

### style-src
`'self'`

Éviter `unsafe-inline`.

Les styles générés dynamiquement doivent passer par :
- classes ;
- variables CSS définies ;
- ou policy documentée si réellement nécessaire.

### img-src
`'self' data:`

Ajouter explicitement des origines externes seulement si approuvées.

### font-src
`'self'`

Toute font distante future nécessite allowlist et budget performance/privacy.

### connect-src
`'self'`

Ajouter seulement :
- endpoints backend réels ;
- providers météo/search explicitement activés ;
- bridge local si nécessaire via configuration dédiée.

### media-src
`'self'`

### frame-src
`'none'` par défaut.

### worker-src
`'self'`

Nécessaire pour futur SW V2 uniquement.

### manifest-src
`'self'`

### form-action
`'self'`

## 4. Trusted Types

Si l'architecture future introduit du HTML riche ou des sinks DOM sensibles, évaluer Trusted Types.

Aucune dépendance à Trusted Types n'est requise pour commencer si :
- textContent est la règle ;
- innerHTML est interdit par défaut ;
- le rich text passe par sanitizer.

## 5. Rich text policy

### Par défaut
Contenu utilisateur affiché comme texte brut.

### Si markdown/rich text est requis
Pipeline obligatoire :

input
→ parse
→ sanitize allowlist
→ render

Interdits par défaut :
- script
- style
- iframe
- object
- embed
- form
- event handlers
- javascript: URLs
- data: URLs arbitraires

## 6. Liens utilisateur

Pour chaque lien externe :
- URL parsée ;
- protocole http/https uniquement ;
- affichage domaine si contexte sensible ;
- `rel=noopener noreferrer` pour nouvel onglet ;
- aucune navigation silencieuse vers protocole custom.

Les protocoles manager éventuels passent par une action dédiée avec consentement.

## 7. Images utilisateur

Ne pas injecter une URL arbitraire directement sans validation.

Policy future :
- origine reconnue ou proxy contrôlé ;
- taille/dimensions ;
- type MIME ;
- fallback ;
- pas de SVG utilisateur non sanitisé.

## 8. X-Frame-Options / frame-ancestors

Lorsque CSP V2 est active :
- `frame-ancestors` devient la policy principale ;
- X-Frame-Options peut rester en défense historique.

Choix initial :
- SAMEORIGIN / `frame-ancestors 'self'`.

Si aucun embed n'est requis :
- préférer `frame-ancestors 'none'`.

## 9. COOP / COEP / CORP

Évaluer par capacité réelle.

### CORP
Le backend utilise déjà `Cross-Origin-Resource-Policy: same-origin` sur certaines réponses JSON.

### COOP
Peut être activé si compatible avec Auth0/popups et intégrations.

### COEP
Ne pas activer avant inventaire complet des ressources cross-origin.

Aucun de ces headers ne doit être ajouté “pour durcir” sans test fonctionnel.

## 10. Permissions-Policy

Baseline actuelle :
- camera=()
- microphone=()
- geolocation=()

À conserver tant qu'aucune fonction réelle ne nécessite ces capacités.

Le contexte météo/saison MODARYX ne nécessite pas de permission GPS.

## 11. Referrer Policy

Conserver :
`strict-origin-when-cross-origin`

Toute policy plus stricte doit être testée avec auth/intégrations.

## 12. HSTS

Le header public actuel :
`max-age=31536000`

Ne pas ajouter `includeSubDomains` ou preload sans audit du domaine complet.

## 13. Canonicals

Le fichier `_headers` V1 contient des canonicals de routes historiques.

V2 doit :
- générer ses canonicals depuis la route V2 ;
- ne pas réutiliser les routes V1 ;
- garder les previews noindex ;
- éviter getnovaforge.

## 14. Service Worker

La CSP V2 ne remplace pas l'isolation SW.

Le futur SW :
- fichier V2 distinct ;
- scope explicite ;
- aucun importScripts legacy ;
- aucun cache V1 ;
- worker-src self.

## 15. Reports CSP

Sur preview/staging, préférer :
- Content-Security-Policy-Report-Only ;
- collecte de violations si un endpoint réel existe.

Ne pas créer un endpoint fictif.

## 16. Header baseline V2 conceptuelle

Avant production, le set cible doit couvrir au minimum :

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security
- Permissions-Policy
- frame protection
- noindex previews
- canonicals V2

Et revalider :
- COOP
- COEP
- CORP
- reporting

## 17. Tests obligatoires

Avant enforcement CSP :

1. Home ;
2. Search ;
3. Game Hub ;
4. Content Detail ;
5. Creator Studio ;
6. auth login/callback ;
7. community writes ;
8. local-context/weather ;
9. manager integration si active ;
10. PWA/SW ;
11. offline ;
12. images/fonts.

Aucune violation ne doit être contournée par `unsafe-inline` global sans justification.

## 18. Anti-contamination

La CSP complète le guard CI.

Le guard empêche les imports legacy dans le code.
La CSP réduit les chargements runtime inattendus.

Les deux sont nécessaires.

## 19. État

- policy CSP V2 : **TERMINÉ — conception**
- sanitizer policy : **TERMINÉ — conception**
- header public V1 : **INCHANGÉ**
- CSP Report-Only preview : **NON EXÉCUTÉ**
- CSP enforcement production : **NON EXÉCUTÉ**
- runtime V2 : **NON CRÉÉ**

