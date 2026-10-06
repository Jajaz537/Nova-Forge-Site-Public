# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-1535

**Date : 2026-10-06 15:35 — Europe/Paris**  
**Statut global : EN COURS — candidat web MODARYX très avancé ; VF stricte BLOQUÉE par 19 dépendances réelles externes/production**

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**.
- **MODARYX / MODARYX MODS = plateforme web**.
- `getnovaforge/getnova` = ancien projet web abandonné.
- Lane active : **site MODARYX uniquement**.
- Aucun travail OS dans cette phase.

## 2. Source Git inspectée

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique : `design/modaryx-v2-blue-violet-product-20261005`
- SHA source inspecté avant ce checkpoint : `97e67d4ea077782fed08dd037819c7b98347e478`
- commit : `Merge MODARYX V2 VF closure evidence ledger`
- `main` : non modifié.
- Cloudflare Pages sur ce SHA : **SUCCESS**.
- registre préproduction consolidé sur ce SHA : **SUCCESS**.

## 3. Canon design / navigateur

**TERMINÉ pour le candidat navigateur automatisé/délégué**

- design Premium HD sombre ;
- bleu nuit majoritaire ;
- violet premium dosé ;
- cyan ciblé CTA/états ;
- pas de bleu envahissant ;
- pas de néon généralisé ;
- ancien hero narratif = historique, non cible VF.
- matrice navigateur contrôlée : **143 captures** ;
- desktop + mobile ;
- product flows, deep links, migration/rollback et accessibilité navigateur ciblée prouvés ;
- revue visuelle déléguée IA effectuée sans la présenter comme session humaine réelle.

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
- migrations D1 `0001 → 0014` rejouées localement ;
- manifeste exact D1 avec blob hashes : **PRÉPARÉ / NON EXÉCUTÉ À DISTANCE** ;
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
- performance labo desktop/mobile ;
- RUM CWV privacy-safe, désactivé par défaut ;
- p75 read-only candidat ;
- rétention CWV 7–90 jours, désactivée par défaut ;
- manifeste d’activation production préparé, strictement non-mutant.

Restent **OPEN** :
- `pwa-service-worker-production`
- `core-web-vitals-production`
- `cutover`

## 6. Droits / légal

**Préparation technique candidat prouvée**

- registre droits fail-closed ;
- demandes support jeux ;
- ingestion/preflight de preuves ;
- préparation outbound non-sending ;
- quarantaine inbound opaque ;
- décision d’autorisation auditée/fail-closed.

Restent **OPEN** :
- `game-rights-registry-production`
- `official-contact-discovery`
- `publisher-outbound`
- `publisher-response-parsing`
- `license-validation`
- `legal-review-where-required`

Aucun contact éditeur réel, accord réel ou validation juridique réelle n’est simulé.

## 7. Nouveaux artefacts canoniques de fermeture

**TERMINÉ pour la préparation / aucune fermeture réelle**

- `qa/modaryx-v2-d1-migration-execution-manifest.json`
  - ordre exact `0001 → 0014` ;
  - hashes Git exacts ;
  - replay SQLite local ;
  - aucune application remote.
- `qa/modaryx-v2-production-activation-manifest.json`
  - D1, R2, auth/passkeys, notifications, PWA, CWV, météo et cutover ;
  - toutes les unités restent manuelles/bloquées ;
  - aucune activation ni mutation distante.
- `qa/modaryx-v2-vf-closure-ledger.json`
  - correspond **exactement** aux 19 blockers OPEN ;
  - 5 validations externes ;
  - 8 production web ;
  - 6 droits/légal ;
  - chaque blocker indique la preuve réelle nécessaire pour sortir de `OPEN`.

## 8. Gate VF strict

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

## 9. Invariants de reprise

1. Aucun faux PASS production/VF.
2. DEV/candidat ≠ production.
3. Aucun DNS/DNSSEC/nameserver/IONOS/Cloudflare critique sans instruction explicite.
4. Aucun cutover tant qu’un blocker requis reste OPEN.
5. Aucun `main` sans stratégie contrôlée.
6. Après erreur : erreur exacte → isolation → correction ciblée → micro-proof.
7. Tests navigateur ≠ NVDA/VoiceOver/TalkBack/Safari/appareil physique réel.
8. Aucune migration distante ou activation provider automatique pour fabriquer un PASS.
9. Droits éditeurs et revue juridique réels jamais simulés.
10. Le ledger de fermeture doit rester exactement synchronisé avec l’ensemble des blockers `OPEN`.

## 10. Prochain point logique

Le maximum interne préparatoire est maintenant largement matérialisé.

Ordre de continuation :
1. maintenir les probes production **read-only** à jour ;
2. conserver le pack external validation prêt pour NVDA/VoiceOver/TalkBack/Safari/appareils physiques ;
3. n’exécuter une migration/activation remote qu’avec cible exacte + sauvegarde + approbation explicite ;
4. fermer chaque blocker par **micro-preuve réelle ciblée**, jamais par équivalence ;
5. aucun cutover avant fermeture de tous les blockers requis.

**Ce fichier devient le checkpoint canonique MODARYX web le plus récent après fusion.**
