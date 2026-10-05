# MODARYX V2 — Threat model pré-implémentation

**Date : 2026-10-03**
**Statut : TERMINÉ — conception sécurité, aucun runtime V2 déployé**

## 1. Objectif

Identifier les menaces propres à la transition V1 → V2 avant le premier frontend produit.

Ce document complète :
- audit anti-contamination ;
- contrats trust/provenance ;
- architecture frontend isolée ;
- migration storage/cache/SW ;
- frontières adapters.

## 2. Actifs à protéger

- identité MODARYX ;
- comptes/sessions ;
- profils publics ;
- projets/releases/files ;
- provenance et signatures ;
- collections/modpacks/profiles ;
- brouillons créateurs ;
- états modération/appels ;
- préférences locales ;
- trust store ;
- routes/canonicals ;
- intégrité du frontend V2.

## 3. Frontière legacy

Menace :
ancien code V1 chargé par erreur.

Vecteurs :
- import CSS ;
- import JS renderer ;
- shell.js ;
- SW racine ;
- cache ancien ;
- asset glob ;
- fallback route ;
- ancienne PR preview.

Mitigation :
- blacklist ;
- guard CI ;
- nouveau root V2 ;
- aucun import direct V1 ;
- preview SHA exact.

État :
**TERMINÉ — prévention installée / runtime V2 absent.**

## 4. Service Worker

Menaces :
- SW V1 contrôle le V2 ;
- stale cache ;
- boucle upgrade ;
- cache poisoning applicatif ;
- ancienne page servie après cutover.

Mitigation :
- scope/namespace V2 ;
- migration A→B testée ;
- purge explicite ;
- fail-safe offline ;
- navigateur legacy obligatoire dans QA.

État :
**BLOQUÉ jusqu'au preview runtime.**

## 5. Auth/session

Menaces :
- token exposé au client ;
- returnTo ouvert ;
- confusion compte/profil ;
- élévation via creator/team metadata.

Mitigation :
- cookie HttpOnly/Secure ;
- state/PKCE ;
- authority serveur ;
- allowlist returnTo ;
- séparation Account/PublicProfile/Creator/Team.

État :
**TERMINÉ — architecture / PREUVE RUNTIME future.**

## 6. Autorisation

Menace :
UI masque un bouton mais backend accepte l'action.

Mitigation :
- permissions serveur ;
- UI capability hint seulement ;
- test forbidden ;
- aucune autorité dérivée localement.

État :
**TERMINÉ — principe.**

## 7. Distribution de fichiers

Menaces :
- fichier remplacé ;
- hash absent ;
- signature non trusted ;
- artefact stale ;
- mauvaise release ;
- URL cross-origin imprévue.

Mitigation :
- digest exact ;
- FileArtifact distinct ;
- trusted signer gate ;
- same-origin/allowlist ;
- fail-closed ;
- release/file binding.

État :
**TERMINÉ — conception / trust anchor prod BLOQUÉ.**

## 8. Installation manager

Menaces :
- mauvais jeu/instance/profil ;
- dépendance silencieusement substituée ;
- faux succès ;
- protocole incompatible ;
- commande manager forgée.

Mitigation :
- capability negotiation ;
- version protocole ;
- instance explicite ;
- profil choisi/créé ;
- confirmation runtime ;
- rollback ;
- consentement.

État :
**TERMINÉ — contrat / runtime manager BLOQUÉ.**

## 9. Compatibilité

Menaces :
- claim obsolète ;
- evidence absente ;
- mauvaise version de jeu ;
- confusion declared/measured/estimated.

Mitigation :
- CompatibilityClaim ;
- freshness/evidence ;
- contexte version/platform/loader ;
- unverified explicite.

État :
**TERMINÉ — modèle / corpus réel PREUVE MANQUANTE.**

## 10. Recherche

Menaces :
- moteur externe devient SPOF ;
- résultats non canoniques ;
- injection de liens/routes ;
- index V1 stale.

Mitigation :
- local-first ;
- canonical IDs ;
- SearchDocument V2 ;
- external optional ;
- sanitize/validate URLs.

État :
**TERMINÉ — conception.**

## 11. Contenu de démonstration

Menace :
fixture perçue comme contenu réel.

Mitigation :
- dataClass ;
- séparation build ;
- aucun faux compteur/badge ;
- corpus réel distinct.

État :
**TERMINÉ — règle / corpus réel BLOQUÉ.**

## 12. Creator Studio

Menaces :
- perte de brouillon ;
- upload non autorisé ;
- rights absents ;
- dépendance libre incohérente ;
- publication contournant modération.

Mitigation :
- draft local ;
- validation structurée ;
- rights obligatoires ;
- Release séparée ;
- publication state machine.

État :
**TERMINÉ — contrat.**

## 13. Community

Menaces :
- spam/abus ;
- contenu privé exposé ;
- signalement confondu avec support ;
- modération contournée.

Mitigation :
- Turnstile si configuré ;
- permission serveur ;
- publication/modération distinctes ;
- report séparé ;
- privacy state.

État :
**TERMINÉ — conception / provider runtime à prouver.**

## 14. localStorage

Menaces :
- collision namespace ;
- données V1 interprétées comme V2 ;
- migration destructive ;
- XSS lisant des préférences sensibles.

Mitigation :
- `modaryx:v2:` ;
- migrator typé ;
- pas de secrets ;
- non-destructive ;
- version migration.

État :
**TERMINÉ — plan / runtime non exécuté.**

## 15. XSS / HTML injection

Menaces :
- descriptions créateur ;
- markdown ;
- community content ;
- noms de projets ;
- external metadata.

Mitigation :
- textContent par défaut ;
- sanitizer allowlist si rich text ;
- URLs validées ;
- CSP à définir ;
- aucune injection HTML depuis adapter.

État :
**EN COURS — CSP V2 à formaliser.**

## 16. CSRF

Menace :
writes same-origin sans protection suffisante.

Mitigation :
- SameSite cookies ;
- same-origin checks ;
- CSRF token si nécessaire selon méthode/runtime ;
- aucune mutation GET.

État :
**TERMINÉ — baseline backend / revalidation V2 requise.**

## 17. SSRF

Menace :
storage resolver ou integration discovery vers réseaux privés.

Mitigation :
- HTTPS ;
- deny private/loopback sauf bridge explicitement local ;
- redirect policy ;
- timeout ;
- size bounds.

État :
**TERMINÉ — baseline.**

## 18. Open redirect

Menace :
returnTo externe.

Mitigation :
- path local only ;
- validation stricte ;
- fallback V2 contrôlé.

État :
**TERMINÉ — conception.**

## 19. Supply chain

Menaces :
- GitHub Action mutable ;
- dépendance npm non pin ;
- asset distant ;
- script externe.

Mitigation :
- actions pin SHA ;
- lockfile si dépendances futures ;
- minimal dependencies ;
- provenance build ;
- CodeQL ;
- no remote script by default.

État :
**EN COURS — dépendances V2 non encore choisies.**

## 20. Secrets

Menaces :
- clé API dans frontend ;
- logs ;
- fixtures ;
- PR artifacts.

Mitigation :
- secrets uniquement backend/CI secret store ;
- redaction ;
- public status sans secret ;
- no private JWK.

État :
**TERMINÉ — principe.**

## 21. Privacy / real-world context

Menaces :
- localisation trop précise ;
- historique météo stocké ;
- fingerprinting excessif.

Mitigation :
- contexte grossier ;
- timezone ;
- coordonnées arrondies côté backend si utilisées ;
- pas de permission GPS nécessaire ;
- fail-soft/off.

État :
**TERMINÉ — contrat / provider prod à choisir.**

## 22. SEO / route poisoning

Menaces :
- canonical V1 ;
- getnovaforge historique ;
- duplicate content ;
- redirect loop.

Mitigation :
- sitemap V2 ;
- canonical V2 ;
- redirect matrix ;
- noindex preview ;
- blacklist getnova.

État :
**TERMINÉ — plan / cutover non exécuté.**

## 23. Clickjacking / headers

Baseline V1 utile :
- X-Frame-Options ;
- nosniff ;
- referrer policy ;
- HSTS ;
- permissions policy.

V2 doit revalider :
- CSP ;
- frame-ancestors ;
- COOP/COEP/CORP selon besoins.

État :
**EN COURS — header set V2 final à définir.**

## 24. Offline / stale state

Menace :
une action destructive ou de distribution reste active sur données stale.

Mitigation :
- stale state explicite ;
- downloads fail-closed ;
- writes online-only si nécessaire ;
- reconnect/revalidate avant action.

État :
**TERMINÉ — principe.**

## 25. Modération / receipts

Menaces :
- altération ;
- acteur non autorisé ;
- replay ;
- historique perdu.

Mitigation :
- immutable receipts ;
- chain/hash ;
- authority serveur ;
- timestamp/idempotency selon command.

État :
**TERMINÉ — baseline.**

## 26. Logging / analytics

Menaces :
- PII excessive ;
- tokens ;
- contenu privé ;
- faux analytics.

Mitigation :
- minimisation ;
- redaction ;
- métriques réelles seulement ;
- consentement selon finalité.

État :
**PREUVE MANQUANTE — système analytics V2 non choisi.**

## 27. Threats spécifiques au design

Menaces :
- faux badge “verified” ;
- couleur seule ;
- dark pattern install ;
- CTA manager quand indisponible.

Mitigation :
- vocabulaire trust ;
- états texte/icône ;
- capability-driven UI ;
- consentement explicite.

État :
**TERMINÉ — conception.**

## 28. Priorités avant premier runtime V2

À fermer avant preview réel :
1. CSP/header policy V2 ;
2. dépendances/supply-chain réelles ;
3. sanitizer/rich-text policy si rich text ;
4. SW scope et migration ;
5. adapter inputs validation ;
6. route/canonical preview ;
7. secret/config separation.

## 29. Priorités avant production

En plus :
- trust anchor réel si distribution signée ;
- corpus réel ;
- rights/legal ;
- provider weather si activé ;
- analytics/privacy ;
- browser/device proofs ;
- rollback cutover.

## 30. État global

- Threat model de conception : **TERMINÉ**
- Risques runtime : **NON PROUVÉS tant que V2 n'existe pas**
- Frontend V2 : **NON COMMENCÉ**
- Production : **NON MODIFIÉE**

