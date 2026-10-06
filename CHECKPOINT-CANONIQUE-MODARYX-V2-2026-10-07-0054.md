# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-07-0054

**Date de référence : 2026-10-07 00:54 Europe/Paris**  
**Statut global : EN COURS — candidat MODARYX V2 Premium HD très avancé ; VF stricte toujours BLOQUÉE par 19 dépendances réelles**

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**
- **MODARYX / MODARYX MODS = plateforme web**
- getnovaforge/getnova = ancien projet web abandonné
- lane active : **site MODARYX uniquement**

## 2. Source Git fraîche

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique : `design/modaryx-v2-blue-violet-product-20261005`
- HEAD canonique : `7ef0c89a13539b6060b51d604717c40b5cf5168b`
- commit : `Merge MODARYX V2 Cloudflare Pages import-path fix`
- `main` : non modifié
- DNS / DNSSEC / nameservers : non modifiés
- cutover : non exécuté

## 3. Canon visuel / preview interactive

Direction conservée :
- sombre bleu nuit / quasi-noir ;
- violet premium ;
- cyan réservé aux CTA / états actifs ;
- lisibilité Premium HD renforcée ;
- pas de hero narratif voyageur/loup/dragon comme cible VF ;
- pas de néon généralisé.

Preview V2 interactive vérifiée :
- alias : `https://v2-engineering.nova-forge-site-public.pages.dev`
- source déployée : `acd424a3d4abf0eb4cb153dc24d5202db7412afe`
- run : `37533118410`
- job : `112507209743`
- état : **SUCCESS**
- noindex : oui
- DNS modifié : non
- cutover : non

Comparaison fraîche `acd424a3...` → `7ef0c89a...` :
- **aucun fichier `v2/` ou `v2-preview/` modifié** ;
- la preview reste donc frontend-equivalent au canon actuel ;
- elle ne constitue pas une preuve du backend chiffré ajouté ensuite.

## 4. Cloudflare canonique frais

Incident détecté puis fermé selon la procédure ciblée :

Échec :
- source : `e3f48abc03066cdd3209dc4b3f043f12e5401cb2`
- déploiement : `f2eb493d-be91-496b-9df7-c2a39571794c`
- erreur exacte : trois imports `../../../../_lib/...` non résolus depuis `functions/api/v1/notifications/destinations.js`.

Correction :
- imports corrigés vers `../../../_lib/...`
- micro-preuve branche : déploiement `672f177c-b771-47d2-a83a-83abbaa8ee59` — build SUCCESS / deploy SUCCESS
- run : `37543212641`

Preuve canonique finale :
- source : `7ef0c89a13539b6060b51d604717c40b5cf5168b`
- déploiement : `1912f10b-d142-45ea-84ca-6c608c141d57`
- URL : `https://1912f10b.nova-forge-site-public.pages.dev`
- build : **SUCCESS**
- deploy : **SUCCESS**
- probe GET-only : run `37543478471`, job `112541779264`

## 5. D1 / backend

Manifest contrôlé :
- migrations : `0001 → 0015`
- nombre : **15**
- tables V2 requises : **32**
- replay local : prouvé
- apply D1 remote DEV : **NON EXÉCUTÉ**
- apply production : **NON EXÉCUTÉ**
- autorisation explicite + export/backup + identité de cible restent requis avant toute mutation distante

Nouvelle table candidate :
- `modaryx_v2_notification_destinations`

## 6. Notifications externes

Direction technique candidate enregistrée, sans activation production :

Email :
- candidat : **Cloudflare Email Service**
- état : `TECHNICAL_CANDIDATE_NOT_PRODUCTION_APPROVED`

Push :
- candidat : **Web Push standard + VAPID**
- état : `TECHNICAL_CANDIDATE_NOT_PRODUCTION_APPROVED`

Dispatch réseau :
- **NOT_IMPLEMENTED**

Coffre de destinations :
- AES-256-GCM ;
- clé runtime secrète uniquement ;
- destination brute jamais stockée dans l'outbox ;
- email / push brut chiffrés au repos ;
- destination révoquée non résoluble ;
- API write protégée par same-origin + auth + Turnstile ;
- remote D1 non appliqué ;
- preuve ciblée verte, y compris Cloudflare Pages Functions.

## 7. Validations externes

Le pack réel est prêt et pointe vers la bonne V2 :
- `https://v2-engineering.nova-forge-site-public.pages.dev`

Toujours OPEN :
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques réels.

Aucune émulation ne ferme ces blockers.

## 8. VF strict

**19 blockers OPEN — inchangé**

Catégories :
- validations externes réelles : 5 ;
- production web : 8 ;
- droits / légal : 6.

Aucun blocker ne peut être fermé par équivalence automatisée.

## 9. Invariants de sécurité

Toujours interdits sans preuve / approbation adaptée :
- D1 remote apply ;
- création/binding R2 ;
- activation provider ;
- onboarding email/DNS ;
- clés VAPID production ;
- email/push réel ;
- PWA production ;
- CWV terrain ;
- indexabilité/cutover ;
- droits/licences/validation juridique simulés.

## 10. Prochain ordre logique

1. validations réelles appareils / screen readers sur la V2 interactive ;
2. probes production read-only frais ;
3. D1 DEV remote seulement après approbation explicite + backup/export + cible exacte ;
4. R2/providers/auth réel après approbation ;
5. droits et échanges éditeurs réels ;
6. CWV terrain après vraie production ;
7. cutover en dernier.

**Ce checkpoint remplace comme source de reprise opérationnelle le checkpoint du 2026-10-06 23:04.**
