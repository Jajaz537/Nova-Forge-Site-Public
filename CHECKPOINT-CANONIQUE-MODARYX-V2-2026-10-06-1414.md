# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-1414

**Date : 2026-10-06 14:14 — Europe/Paris**  
**Statut global : EN COURS — candidat web MODARYX fortement prouvé ; VF stricte BLOQUÉE par 19 dépendances réelles externes/production**

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**.
- **MODARYX / MODARYX MODS = plateforme web**.
- `getnovaforge/getnova` = ancien projet web abandonné.
- Les artefacts historiques desktop ne changent pas cette séparation.
- Cette conversation reste **site MODARYX uniquement**.

## 2. Source Git courante

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique : `design/modaryx-v2-blue-violet-product-20261005`
- SHA de référence : `8afa90bad535105558f659cc8bacb71f140d685a`
- commit : `Merge MODARYX V2 current pre-cutover preview evidence

Archive fresh GET/HEAD-only proof for the exact current preview. Production blockers remain OPEN; no mutation or cutover.`
- `main` : non modifié.
- Cloudflare Pages : vert sur le SHA courant.
- gate VF readiness : vert comme **mécanisme de blocage**, avec statut fonctionnel `BLOCKED`.
- registre préproduction consolidé : vert.

## 3. Candidat navigateur / design

**TERMINÉ pour le candidat navigateur délégué**

- design sombre Premium HD, bleu nuit majoritaire, violet dosé, cyan ciblé ;
- 143 captures navigateur relues ;
- 71 desktop + 72 mobile ;
- overflow 0 / 0 ;
- deep links + historique navigateur prouvés ;
- product flows et accessibilité navigateur ciblée prouvés.

Toujours OPEN et non remplaçables par automatisation :
- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real`
- `physical-devices`

## 4. Web V2 candidat prouvé

**TERMINÉ pour les slices candidates correspondantes**

- React/Vite + root `v2/` + preview isolée ;
- anti-contamination ;
- migration navigateur V1→V2 ;
- PWA gated offline candidat ;
- performance labo desktop/mobile ;
- routes + métadonnées initiales ;
- backend/auth same-origin DEV réel ;
- D1/Auth0/Turnstile observés sur preview DEV ;
- schémas V2 stricts ;
- migration D1 core locale non appliquée ;
- historique append-only propriétaire local ;
- notifications in-app + producteurs modération ;
- garde email/push fail-closed sans provider ;
- registre providers sans secret ;
- saison + heure locale + météo same-origin fail-soft ;
- adapter R2 fail-closed ;
- production rehearsal localhost ;
- support jeux backend + UI candidat ;
- droits : registre, preflight, préparation outbound, quarantine inbound, décision d'autorisation fail-closed.

## 5. Preuve PRE_CUTOVER fraîche

**TERMINÉ pour le preview exact / production OPEN**

Preuve archivée :
- `docs/MODARYX-V2-CURRENT-PREVIEW-READ-ONLY-EVIDENCE-20261006.md`
- GET/HEAD uniquement ;
- noindex actif ;
- backend DEV joignable ;
- D1 présent ;
- R2 absent ;
- Auth0 + Turnstile configurés ;
- email/push non implémentés ;
- météo OFF ;
- historique anonyme refusé ;
- Service Worker production absent ;
- CWV terrain toujours PREUVE MANQUANTE.

Aucune mutation production, aucun cutover.

## 6. Gate VF web strict

Micro-preuve fraîche du SHA courant :
- `VF_READINESS_OPEN_BLOCKER_COUNT 19`
- `VF_READINESS_STATUS BLOCKED`
- `PASS_V2_VF_READINESS_GATE`

### Validations réelles externes — 5
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

Les six anciens blockers runtime desktop restent `OUT_OF_SCOPE_SITE_VF_OFFICIAL_SEPARATION` et ne bloquent pas la VF web.

## 7. Interdictions / invariants

1. Aucun faux PASS production.
2. Une preuve DEV/candidat ne vaut jamais preuve production.
3. Aucun DNS/DNSSEC/nameserver/IONOS/Cloudflare critique sans instruction explicite.
4. Aucun `main` sans stratégie contrôlée.
5. Après erreur : erreur exacte → isolation → correction ciblée → micro-proof.
6. Aucun cutover tant qu'un blocker requis reste OPEN.
7. Aucune automatisation ne ferme Safari réel, screen-reader réel, appareil physique, passkey réelle ou droits éditeurs réels.
8. Aucune migration distante automatique pour fermer artificiellement les blockers data/backend.

## 8. Prochain point logique

Maximiser ce qui reste possible sans infrastructure critique :
1. préparer la collecte **CWV production** non mutante / RUM sans prétendre au p75 tant que le trafic réel manque ;
2. renforcer les probes production GET/HEAD sans cutover ;
3. préparer les preuves backend/data/provider production sans appliquer automatiquement de migration distante ;
4. maintenir le pack d'exécution externe prêt pour NVDA/VoiceOver/TalkBack/Safari/appareils ;
5. ne fermer aucun blocker externe sans preuve réelle.

**Ce fichier devient le checkpoint canonique MODARYX web le plus récent après fusion.**
