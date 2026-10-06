# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-1519

**Date : 2026-10-06 15:19 — Europe/Paris**  
**Statut global : EN COURS — candidat web MODARYX très avancé ; VF stricte toujours BLOQUÉE par 19 dépendances réelles externes/production**

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**.
- **MODARYX / MODARYX MODS = plateforme web**.
- `getnovaforge/getnova` = ancien projet web abandonné.
- Cette lane reste **site MODARYX uniquement**.
- Aucun travail OS n'est inclus ici.

## 2. Source Git courante

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique : `design/modaryx-v2-blue-violet-product-20261005`
- SHA de référence : `770377dfb33feba9e3d06d79c1fd587bc81765b8`
- commit : `Merge MODARYX V2 fail-closed CWV retention  Integrate bounded disabled-by-default CWV retention plus the Chrome DevToolsActivePort rehearsal hardening. Production CWV evidence and cutover remain OPEN.`
- `main` : non modifié.
- Cloudflare Pages : **SUCCESS** sur le SHA courant.
- registre préproduction consolidé : **SUCCESS**.
- gate VF : mécanisme vert mais statut fonctionnel `BLOCKED`.

## 3. Design / navigateur

**TERMINÉ pour le candidat navigateur automatisé/délégué**

- direction Premium HD sombre, bleu nuit majoritaire, violet dosé, cyan ciblé ;
- 143 captures navigateur contrôlées ;
- desktop + mobile ;
- product flows, deep links, migration/rollback et accessibilité navigateur ciblée prouvés ;
- correction des drifts de capture sur panneau support lazy-loadée ;
- aucune validation automatisée n'est transformée en preuve humaine réelle.

Toujours **OPEN** :
- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real`
- `physical-devices`

## 4. Backend / données / providers candidats

**TERMINÉ pour les slices candidates prouvées**

- backend/auth same-origin DEV réel ;
- D1/Auth0/Turnstile preview DEV ;
- schémas V2 stricts ;
- migration D1 locale non appliquée à distance ;
- historique propriétaire append-only local ;
- notifications in-app + producteurs modération ;
- garde email/push fail-closed sans provider ;
- registre providers secret-safe ;
- adapter R2 fail-closed ;
- saison + heure locale + météo same-origin fail-soft ;
- production readiness read-only preflight.

Restent **OPEN** en production :
- `backend-real`
- `auth-passkeys-real`
- `real-data-history`
- `providers-connectors-real`
- `notifications-email-push-real`

## 5. PWA / performance / CWV

**TERMINÉ pour les preuves candidates internes**

- PWA gated browser-proof ;
- rollback/rehearsal localhost vert ;
- Chrome CDP du rehearsal durci avec `DevToolsActivePort` dynamique ;
- performance labo desktop/mobile ;
- collecteur RUM CWV privacy-safe, désactivé par défaut ;
- rapport p75 read-only admin ;
- rétention CWV bornée 7–90 jours, désactivée par défaut ;
- aucune collecte terrain ni purge distante activée.

Restent **OPEN** :
- `pwa-service-worker-production`
- `core-web-vitals-production`
- `cutover`

## 6. Droits / légal

**Préparation technique candidat prouvée**

- registre droits fail-closed ;
- demandes de support jeux ;
- ingestion/preflight de preuves ;
- préparation outbound non-sending ;
- quarantaine inbound opaque ;
- décision d'autorisation auditée/fail-closed.

Restent **OPEN** :
- `game-rights-registry-production`
- `official-contact-discovery`
- `publisher-outbound`
- `publisher-response-parsing`
- `license-validation`
- `legal-review-where-required`

Aucun contact éditeur réel, aucun accord réel et aucune validation juridique réelle ne sont simulés.

## 7. Gate VF strict

État courant : **19 blockers OPEN**

### Validations externes réelles — 5
- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real`
- `physical-devices`

### Production web — 8
- `backend-real`
- `auth-passkeys-real`
- `real-data-history`
- `providers-connectors-real`
- `notifications-email-push-real`
- `pwa-service-worker-production`
- `core-web-vitals-production`
- `cutover`

### Droits / légal réels — 6
- `game-rights-registry-production`
- `official-contact-discovery`
- `publisher-outbound`
- `publisher-response-parsing`
- `license-validation`
- `legal-review-where-required`

Les anciens blockers runtime desktop restent hors scope de la VF web selon la séparation officielle.

## 8. Invariants de reprise

1. Aucun faux PASS production/VF.
2. DEV/candidat ≠ production.
3. Aucun DNS/DNSSEC/nameserver/IONOS/Cloudflare critique sans instruction explicite.
4. Aucun cutover tant qu'un blocker requis reste OPEN.
5. Aucun `main` sans stratégie contrôlée.
6. Après erreur : erreur exacte → isolation → correction ciblée → micro-proof.
7. Les tests navigateur ne remplacent jamais NVDA/VoiceOver/TalkBack/Safari/appareils physiques réels.
8. Aucune migration distante ni activation provider automatique pour fabriquer un PASS.
9. Les droits éditeurs et revues juridiques réels ne sont jamais simulés.

## 9. Prochain point logique

Maximiser uniquement le travail encore faisable sans mutation critique :

1. maintenir les probes production read-only et le pack externe à jour ;
2. préparer les manifests/contrats de migration et activation sans les exécuter à distance ;
3. n'activer ni PWA production, ni RUM terrain, ni provider réel, ni email/push sans preuve/configuration réelle ;
4. garder les 19 blockers OPEN tant que leur preuve externe/production manque ;
5. lorsque les dépendances réelles sont disponibles, fermer chaque blocker par micro-preuve ciblée avant tout cutover.

**Ce fichier devient le checkpoint canonique MODARYX web le plus récent après fusion.**
