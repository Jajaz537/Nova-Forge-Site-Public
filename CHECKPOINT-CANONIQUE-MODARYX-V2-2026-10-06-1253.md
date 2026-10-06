# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-1253

**Date : 2026-10-06 12:53 — Europe/Paris**  
**Statut global : EN COURS — MODARYX V2 web fortement prouvé, VF stricte encore BLOQUÉE par dépendances réelles externes/production**

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**.
- **MODARYX / MODARYX MODS = plateforme web**.
- `getnovaforge/getnova` = ancien projet web abandonné.
- Le runtime/desktop ne doit pas être créé ni validé dans la lane VF du site MODARYX.
- Les anciens documents `MODARYX Forge` restent des artefacts historiques/compatibilité et ne modifient pas l'identité produit officielle.

## 2. Source Git actuelle

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique : `design/modaryx-v2-blue-violet-product-20261005`
- SHA de départ de ce checkpoint : `ddb2f8ef4d679367dd46c433a5dcd47eb2881a11`
- `main` : non modifié.
- Cloudflare Pages du SHA : vert.
- registre préproduction consolidé : vert.

## 3. Design / validation navigateur

**TERMINÉ pour le candidat navigateur délégué**
- direction sombre Premium HD bleu nuit + violet dosé + cyan ciblé ;
- revue déléguée : 143 captures, 71 desktop + 72 mobile ;
- overflow : 0 / 0 ;
- routes profondes + historique navigateur : prouvés ;
- product flows et accessibilité navigateur ciblée : prouvés.

Toujours OPEN, non remplaçables par automatisation :
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques.

## 4. Web V2 déjà prouvé en candidat

**TERMINÉ / candidat seulement**
- React 19.2 + Vite 6.4 + Worker-compatible ;
- root `v2/` + preview isolée ;
- anti-contamination ;
- migration V1→V2 ;
- PWA gated offline candidat ;
- performance labo desktop/mobile ;
- routes + métadonnées initiales ;
- backend/auth same-origin DEV réel ;
- D1/Auth0/Turnstile preview DEV observés ;
- schémas V2 stricts ;
- migration D1 core locale non appliquée ;
- historique append-only propriétaire local ;
- notifications in-app + producteurs modération ;
- garde email/push fail-closed sans provider ;
- registre providers sans secret ;
- saison + heure locale + météo same-origin fail-soft ;
- adapter R2 fail-closed sans bucket/binding mutation ;
- production rehearsal localhost ;
- support jeux backend + UI candidat ;
- droits : registre, preflight, outbound préparatoire, inbound quarantine et décision d'autorisation fail-closed.

## 5. Runtime desktop hors scope site

Les entrées historiques suivantes sont reclassifiées :
- forge-runtime ;
- transport-protocol ;
- receipt-signature ;
- install-update-rollback ;
- safe-profile ;
- server-save-sync.

État : **OUT_OF_SCOPE_SITE_VF_OFFICIAL_SEPARATION**.

Elles ne sont pas des blockers de la VF web MODARYX et ne doivent pas provoquer un travail Nova Forge OS dans cette conversation site-only.

## 6. Gate VF web strict

Le site reste **BLOQUÉ** tant qu'un blocker `OPEN` subsiste.

### Validations réelles externes
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques.

### Production web
- backend production réel ;
- auth/passkeys réels ;
- données/historique production réels ;
- providers/connectors production réels ;
- email/push réels ;
- PWA production ;
- Core Web Vitals production ;
- cutover.

### Droits / légal réels
- registre droits jeux production ;
- découverte/vérification contacts officiels ;
- outbound éditeurs réel ;
- réponses éditeurs réelles ;
- validation licences sur preuves réelles ;
- revue juridique externe lorsque requise.

Les implémentations candidates correspondantes existent mais **ne ferment pas** ces preuves réelles.

## 7. Règles

1. Site MODARYX uniquement.
2. Vérifier branche + SHA avant écriture.
3. Ne pas écraser le travail parallèle.
4. Pas de `main` sans stratégie contrôlée.
5. Après erreur : erreur exacte → isolation → correction ciblée → micro-proof.
6. Aucun faux PASS production.
7. Aucun DNS/DNSSEC/nameserver/IONOS/Cloudflare critique sans instruction explicite.
8. Aucun cutover tant que les dépendances réelles ne sont pas fermées.
9. Une preuve candidat/DEV ne vaut jamais preuve production.
10. Les artefacts historiques desktop ne changent pas la séparation officielle.

## 8. Prochain point logique

Maximiser ce qui reste faisable sans infrastructure critique :
1. consolider le gate et le checkpoint sur le HEAD courant ;
2. préparer les probes production non mutantes ;
3. préparer la collecte CWV production sans indexer/cutover ;
4. préparer les preuves backend/data/provider sans appliquer de migration distante automatiquement ;
5. ne jamais prétendre fermer Safari, screen-readers, appareils, passkey réelle ou droits éditeurs sans preuve externe.

**Ce fichier devient le checkpoint canonique MODARYX web le plus récent après fusion.**
