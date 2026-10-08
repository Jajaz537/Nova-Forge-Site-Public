# MODARYX V2 — WORK / OPERATOR HANDOFF — 19 BLOCKERS EXTERNES VF — 2026-10-07

**Statut : BLOQUÉ localement — exécution externe/production/réelle requise**
**Branche cible :** `design/modaryx-v2-blue-violet-product-20261005`
**HEAD attendu :** `d88a416313a02d4b976ef9d6e0843489f8930998`

Ce document consolide les blockers déjà définis par :
- `qa/modaryx-v2-vf-closure-ledger.json`
- `qa/modaryx-v2-vf-readiness-gate.json`
- `qa/modaryx-v2-external-validation-execution-pack.json`
- `qa/modaryx-v2-production-activation-manifest.json`
- `docs/MODARYX-V2-RIGHTS-EVIDENCE-PREFLIGHT-20261006.md`

Il n’accorde aucun PASS et ne remplace aucune preuve réelle.

## 1. Règle de fermeture

Le ledger courant est `ACTIVE_FAIL_CLOSED_19_OPEN`.

Les 19 blockers ont tous :
`automationCanCloseWithoutExternalChange=false`.

Donc :
- aucune preuve DEV/preview/candidate ne ferme un blocker production ;
- aucune émulation ne ferme un blocker appareil réel ;
- aucune recherche documentaire ne ferme un blocker licence/droit réel ;
- aucune revue IA ne remplace une revue juridique lorsque celle-ci est requise.

## 2. Lane A — appareils réels / accessibilité

Blockers :
- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real`
- `physical-devices`

Exécuter uniquement sur réalité correspondante :
- Windows réel + NVDA actif + navigateur réel ;
- Apple OS réel + VoiceOver actif ;
- Android physique + TalkBack actif + Chrome réel ;
- Safari réel sur Apple OS ;
- appareil physique réel avec touch réel.

Utiliser :
`qa/modaryx-v2-external-validation-execution-pack.json`

Pour chaque session :
- tester le **commit exact** ;
- toutes les tâches critiques prévues ;
- artefacts non vides ;
- reviewer enregistré ;
- aucun P0/P1 ouvert ;
- résultat non `INCOMPLETE`.

Ne jamais transformer viewport emulation/CDP en preuve appareil réel.

## 3. Lane B — production contrôlée

Blockers :
- `backend-real`
- `auth-passkeys-real`
- `real-data-history`
- `providers-connectors-real`
- `notifications-email-push-real`
- `pwa-service-worker-production`
- `core-web-vitals-production`
- `cutover`

Source :
`qa/modaryx-v2-production-activation-manifest.json`

État actuel important :
- DEV D1 remote apply : déjà prouvé ;
- production D1 : non exécutée ;
- R2 réel/binding : absent ;
- passkeys : preuve appareil réel + production manquante ;
- email/push : aucun provider activé ;
- PWA production : non activée ;
- field CWV : non activés ;
- cutover : non autorisé.

### STOP avant toute mutation sensible

Ne pas modifier sans approbation explicite :
- D1 production ;
- R2 bucket/binding production ;
- secrets/provider production ;
- DNS/DNSSEC/nameservers ;
- domaine production / cutover ;
- email domain onboarding ;
- PWA production enable ;
- field CWV enable ;
- indexability/route promotion.

Après approbation explicite, traiter **une unité à la fois** :
erreur exacte → isolation → correction ciblée → micro-proof → continuation.

Ne pas grouper toutes les mutations production en une seule opération.

## 4. Lane C — droits / licences / revue juridique

Blockers :
- `game-rights-registry-production`
- `official-contact-discovery`
- `publisher-outbound`
- `publisher-response-parsing`
- `license-validation`
- `legal-review-where-required`

Source :
`docs/MODARYX-V2-RIGHTS-EVIDENCE-PREFLIGHT-20261006.md`

Règles :
- source officielle réelle pour les contacts ;
- aucune adresse brute non nécessaire dans les preuves ;
- aucun scraping contournant restrictions ;
- envoi sortant seulement vers destination officielle vérifiée ;
- réponse réelle archivée/provenancée ;
- toute autorisation ambiguë → `LEGAL_REVIEW_REQUIRED` ;
- aucune décision `GRANTED` automatisée ;
- aucune licence considérée valide sans scope match et contraintes enregistrées.

Les cinq assets PRODUCT du bundle courant restent `finalReleaseAllowed=false` tant que les droits commerciaux ne sont pas prouvés.

## 5. Ordre recommandé

1. Lane A : sessions appareils réels, car non destructive.
2. Lane C : official-contact discovery et préparation des scopes, sans envoi si approbation manquante.
3. Lane B : uniquement les unités production explicitement approuvées, une par une.
4. Recalcul du ledger après chaque preuve externe réelle.
5. Cutover en dernier, uniquement si tous les blockers requis sont fermés et qu’une approbation release explicite existe.

## 6. États autorisés

Uniquement :
- TERMINÉ
- EN COURS
- BLOQUÉ
- PREUVE MANQUANTE

Interdits :
- convertir DEV/preview/candidate en production ;
- annoncer VF tant que le ledger n’est pas fermé ;
- faire passer une gate commerciale ou juridique grâce à une gate technique.

## 7. Retour attendu

Pour chaque blocker traité :
- blocker id ;
- commit exact ;
- environnement/réalité utilisée ;
- action exacte ;
- run/session/artefacts ;
- résultats ;
- P0/P1 éventuels ;
- état final autorisé ;
- preuve permettant ou non de modifier le readiness gate.

Aucun prix, PSP, DNS, provider, cutover ou droit ne devient canonique sans décision/proof correspondante.
