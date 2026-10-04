# CHECKPOINT-CANONIQUE — MODARYX V2 — 2026-10-04

**Statut : source opérationnelle courante**  
**Date : 2026-10-04**  
**Priorité : ce checkpoint remplace les états plus anciens lorsqu’ils divergent, sauf preuve technique plus fraîche.**

## 1. Séparation et nomenclature actives

- **MODARYX / MODARYX MODS** = plateforme web.
- **MODARYX Forge** = logiciel / écosystème desktop.
- **MODARYX Public** = édition publique desktop.
- **MODARYX Founder** = édition Founder desktop.
- **Nova Forge OS** = nom produit retiré ; ne subsiste que comme legacy/provenance/compatibilité technique lorsque nécessaire.
- `getnovaforge.com` / getnova = ancien projet web abandonné, pas la cible actuelle.
- Le projet adulte distinct évoqué le 4 octobre 2026 reste **hors périmètre MODARYX** et ne doit jamais être mélangé à ce dépôt/projet.

## 2. Git / PR vérifiés avant écriture de ce checkpoint

Dépôt technique historique :
`Jajaz537/Nova-Forge-Site-Public`

Branche :
`audit/modaryx-v2-legacy-boundary-20261003`

PR :
- #162
- titre : `MODARYX V2: isolated architecture, Living Threshold prototype and readiness`
- draft : **oui**
- merged : **non**
- mergeable : **oui**

HEAD vérifié immédiatement avant création de ce checkpoint :
`3ea87341ef2bb5a107259651292f46ee62613d5d`

Base :
- `main`
- base SHA observé : `d8d5ea5509f07c5bf5a4424293cfa404643c239f`

La création de ce fichier avance elle-même le HEAD. Toujours re-lire branche + HEAD avant toute nouvelle écriture.

## 3. Règles de travail actives

- ne pas modifier `main` sans stratégie contrôlée explicite ;
- ne pas toucher DNS / DNSSEC / nameservers / IONOS / Cloudflare critique sans instruction explicite ;
- ne pas écraser le travail parallèle ;
- avant chaque write : vérifier branche, HEAD et changements récents ;
- après erreur : erreur exacte → isolation → correction ciblée → micro-proof → continuation ;
- ne jamais transformer une hypothèse en PASS ;
- prototype vert ≠ production verte ;
- aucune VF/High-Fi finale sans preuves appropriées.

## 4. État prototype Living Threshold

Le prototype exploratoire reste :
`review-evidence/modaryx-v2-living-threshold-prototype-20261003/`

Direction :
- Living Threshold hybride 2+3 ;
- MODARYX reste dominant ;
- `L’univers est le théâtre ; le modding est l’action.`
- Game Atmosphere : `On change de monde, pas de produit.`

Surfaces majeures matérialisées :
- Discover / Home ;
- Games Index ;
- Game Hub ;
- Global Search ;
- Catalog ;
- Content Detail ;
- Collections ;
- Modpack ;
- Profils de jeu ;
- Créateurs ;
- Community ;
- Library ;
- Creator Studio ;
- Account / Settings / Notifications ;
- offline/stale ;
- report error/retry ;
- Game Atmosphere Layer ;
- Rights Dashboard admin fictif.

## 5. Preuve navigateur la plus fraîche pour le code UI actuel matérialisé

Workflow :
`MODARYX V2 Living Threshold Visual Proof`

Run :
`37214829645` — **SUCCESS**

Commit capturé :
`31db0796949a3c453f61864d84e3cf86f103aa94`

Artifact :
`11308280526`

Digest :
`sha256:124e7465bbb4b732153b2f8858a9288b96a59a2d7f1d905c1b0fea44df7d8a5c`

Marqueurs :
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `KEYBOARD_REACHABLE 37 / 37`
- `RIGHTS_MOBILE_OVERFLOW 0`
- `PUBLISHER_CONTACT_MOBILE_OVERFLOW 0`
- `GAME_SUPPORT_REQUEST_MOBILE_OVERFLOW 0`
- `RIGHTS_NOTIFICATION_MOBILE_OVERFLOW 0`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `FLOW_ASSERT publisher inbound correlation provenance fail-closed`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 81`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Cette preuve n’est pas :
- certification WCAG ;
- preuve screen reader réel ;
- validation appareil physique ;
- validation humaine finale ;
- frontend production ;
- VF.

## 6. Surface map production

Fichiers :
- `qa/modaryx-v2-production-surface-map.json`
- `qa/check-v2-production-surface-map.mjs`

Run :
`37214676514` — **SUCCESS**

Marqueurs :
- `SURFACE_MAP_COUNT 24`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`

Les 24 surfaces restent `BLOCKED_GATE` côté production.

États runtime réels toujours non résolus :
- session-expired-real ;
- permission-denied-server-real ;
- backend-error-real ;
- sync-conflict-real ;
- pwa-service-worker-production ;
- modaryx-forge-install-runtime.

## 7. Game Atmosphere

Politique :
`docs/MODARYX-V2-GAME-ATMOSPHERE-IP-POLICY-20261004.md`

Décision :
- ambiance originale par jeu possible ;
- design system MODARYX stable ;
- aucun asset éditeur officiel par défaut ;
- `Unknown = BLOQUÉ` ;
- fallback original MODARYX obligatoire ;
- aucune OST / key art / logo / UI copiée sans licence/permission/preuve claire.

Preuve touch dédiée :
- run `37193592557` — **SUCCESS**
- `PASS_V2_GAME_ATMOSPHERE_TOUCH_TARGETS`

Preuve Living Threshold atmosphère :
- run `37193557372` — **SUCCESS**
- 59 captures à cette étape historique.

## 8. Workflow automatique support jeu → éditeur

Contrat :
`docs/MODARYX-V2-GAME-SUPPORT-PUBLISHER-RIGHTS-WORKFLOW-20261004.md`

Machine-readable :
`qa/modaryx-v2-game-rights-workflow.json`

Checker :
`qa/check-v2-game-rights-workflow.mjs`

Workflow :
`.github/workflows/modaryx-v2-game-rights-workflow-proof.yml`

Micro-proof :
- run `37196259361` — **SUCCESS**
- commit capturé `038a5b0e51eea76bb6859f7ead12ed18eef20894`
- `PASS_V2_GAME_RIGHTS_WORKFLOW`

Invariants :
- `NO_RESPONSE` ne vaut jamais autorisation ;
- refus / expiration / révocation ne débloquent aucun droit ;
- seuls les scopes accordés débloquent un usage ;
- contact officiel vérifié requis avant outbound ;
- idempotence obligatoire ;
- droits web et MODARYX Forge séparés ;
- le statut production reste honnêtement non implémenté tant que le backend n’existe pas.

Workflow cible :
`demande membre → triage → acceptation MODARYX → baseline sûre → Rights Case → contact officiel vérifié → demande → réponse → activation scope par scope`.

## 9. Rights Dashboard

Prototype admin fictif matérialisé.

États exercés :
- `APPROVED_WITH_LIMITS`
- `AWAITING_RESPONSE`
- `NO_RESPONSE`

Règles UX :
- disclaimer explicite : aucune demande réelle envoyée ;
- lecture scope par scope ;
- MODARYX Forge séparé du Web ;
- outbound désactivé sans backend ;
- mobile sans overflow dans le check ciblé.

Réponses éditeurs futures :
- parsing automatique ciblé ;
- notification admin ;
- `SAFE_AUTOMATION`
- `NEEDS_REVIEW`
- `LEGAL_REVIEW_REQUIRED`
- `DENIED`

Une ambiguïté juridique ne doit jamais être transformée automatiquement en approbation.

Toujours non implémenté :
- Game Rights Registry production ;
- recherche réelle de contact officiel ;
- email/API outbound ;
- réception/parsing réel ;
- validation de licence réelle ;
- revue juridique réelle.

Aucune demande réelle à un éditeur n’a été envoyée.

## 10. MODARYX IA

Fondation :
`docs/MODARYX-AI-FOUNDATION-ARCHITECTURE-20261004.md`

Décision :
MODARYX IA sera une plateforme IA native, pas un simple chatbot.

Fondations retenues :
- AI Gateway ;
- Model Router multi-provider ;
- Knowledge Layer / RAG ;
- Tool Layer ;
- Permission Engine ;
- agents spécialisés ;
- evals ;
- safety / prompt-injection / data-leak protections ;
- observabilité ;
- mémoire contrôlée ;
- intégration contextuelle site + MODARYX Forge ;
- provider independence.

Stratégie :
- meilleurs modèles disponibles + RAG/tools/evals d’abord ;
- fine-tuning ciblé ensuite ;
- petits modèles spécialisés/local-first si utile ;
- modèle fondamental propriétaire uniquement si avantage mesuré.

Statut :
- architecture conceptuelle : **TERMINÉE**
- provider/modèles : **NON SÉLECTIONNÉS**
- backend IA : **NON IMPLÉMENTÉ**
- eval harness : **NON IMPLÉMENTÉ**
- intégration site : **NON IMPLÉMENTÉ**
- intégration MODARYX Forge : **NON IMPLÉMENTÉ**

## 11. Stack technique

Comparaison :
`docs/MODARYX-V2-STACK-COMPARISON-20261004.md`

Gate :
`docs/MODARYX-V2-TECH-STACK-SELECTION-GATE-20261003.md`

Shortlist :
1. vanilla/static-first + Vite léger ;
2. Astro + Cloudflare Workers ;
3. React + Vite + Cloudflare Workers.

**Aucune stack finale sélectionnée.**

Le gate actuel interdit encore de choisir définitivement la stack ou de créer le root/frontend production tant que les validations exigées ne sont pas fermées ou explicitement reclassifiées.

## 12. High-Fi / validation humaine

High-Fi final : **BLOQUÉ**

Documents :
- `docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`
- `docs/MODARYX-V2-HUMAN-MULTISCREEN-REVIEW-PACK-20261004.md`
- `docs/MODARYX-V2-ASSISTIVE-DEVICE-VALIDATION-PROTOCOL-20261004.md`

Pack humain actuel préparé autour de la preuve **81 captures**.

Toujours PREUVE MANQUANTE :
- validation humaine multi-écrans supplémentaire ;
- validation mobile humaine réelle ;
- référence visuelle approuvée archivable ;
- comparaison normalisée source ↔ implémentation ;
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques.

Une simulation IA, Work ou un navigateur automatisé ne remplace pas ces preuves humaines/appareils.

## 13. Figma

Fichier :
`MODARYX V2 — Architecture & Wireframes`

Key :
`TYoIH62lChEK6iMHhhpxZv`

État :
- fondations / low-fi déjà matérialisées ;
- quota Figma MCP Starter : **BLOQUÉ EXTERNE** pour écritures supplémentaires.

Ne pas réessayer sans preuve de quota/plan disponible.

## 14. Production / backend

Toujours BLOQUÉ ou PREUVE MANQUANTE :
- root/frontend V2 production ;
- stack finale ;
- backend réel ;
- auth/passkeys réels ;
- données/historique réels ;
- providers/connecteurs réels ;
- notifications email/push réelles ;
- PWA/SW V2 production ;
- migration/upgrade V1→V2 réelle ;
- Core Web Vitals production ;
- cutover.

MODARYX Forge réel :
- runtime ;
- transport/protocole ;
- receipt/signature ;
- install/update/rollback ;
- Safe Profile ;
- sync serveur/save ;
restent PREUVE MANQUANTE.

## 15. Anti-oubli

Maître :
`docs/MODARYX-V2-ANTI-OUBLI-MASTER-20261003.md`

Éléments récents intégrés :
- Game Atmosphere ;
- Game Rights workflow ;
- réponse éditeur automatique / LEGAL_REVIEW_REQUIRED ;
- Rights Dashboard ;
- MODARYX IA.

Historique non récupéré :
- Master Nova Design Intelligence complète : **PREUVE MANQUANTE / NON RÉCUPÉRÉE**.
Ne jamais l’inventer.

## 16. État autorisé

### TERMINÉ
- isolation et contrats V2 préparatoires ;
- prototype exploratoire très large ;
- Game Atmosphere prototype original ;
- contrat Rights workflow + micro-proof ;
- Rights Dashboard prototype ;
- mapping 23 surfaces ;
- MODARYX IA architecture conceptuelle ;
- handoff Web → MODARYX Forge au niveau contrat.

### EN COURS
- maintenance preuves / anti-oubli ;
- checks CI du HEAD courant selon exécution GitHub.

### BLOQUÉ
- high-fi final ;
- root/frontend production ;
- stack finale ;
- backend/runtime réel ;
- validations humaines/appareils ;
- Figma écritures supplémentaires.

### PREUVE MANQUANTE
- tout service/runtime réel listé ci-dessus ;
- validation humaine supplémentaire ;
- référence visuelle approuvée archivable ;
- screen readers/appareils ;
- production.

## 17. Prochain point logique

Le travail interne honnêtement matérialisable sans franchir le gate a été poussé jusqu’au Rights Dashboard et aux garde-fous associés.

Prochain saut significatif :
1. obtenir une preuve réelle fermant au moins un gate externe/humain ;
2. ou recevoir une **reclassification canonique explicite** autorisant le root/frontend production malgré certains blockers conservés comme PREUVE MANQUANTE ;
3. puis sélectionner la stack de manière contrôlée et créer le premier root V2 isolé.

Ne pas créer de nouvelles fonctionnalités décoratives uniquement pour augmenter un pourcentage.

Si un nouvel élément produit explicitement retenu arrive avant la levée du gate :
- le tracer ;
- le matérialiser seulement s’il peut être prouvé honnêtement dans le prototype ;
- ne pas le présenter comme production.

## 18. Work

Passer à ChatGPT Work uniquement si Work peut réellement fermer un blocker que cette conversation ne peut pas fermer.

Work peut éventuellement aider :
- retrouver/archiver une référence visuelle manquante si elle est accessible ;
- naviguer des outils externes supportés ;
- préparer des workflows multi-étapes.

Work **ne remplace pas** :
- un vrai participant humain indépendant ;
- NVDA/VoiceOver/TalkBack réels ;
- un appareil physique ;
- une approbation juridique humaine lorsque requise.

## 19. Règle de reprise

Quand l’utilisateur dit `Suite l’ami` :
- relire ce checkpoint ;
- vérifier branche + HEAD + PR ;
- ne pas reconstruire depuis d’anciens chats ;
- continuer automatiquement au prochain point logique ;
- ne demander une clarification que si une décision réellement nécessaire manque.


## 20. Demande membre de support d’un jeu — preuve prototype

**TERMINÉ pour le prototype local / production PREUVE MANQUANTE**

Flux matérialisé :
- ouverture depuis Games Index ;
- nom du jeu + plateforme ;
- validation si nom absent ;
- brouillon local explicite ;
- `Brouillon de demande — non envoyé` ;
- triage MODARYX requis ;
- aucun Rights Case réel ;
- aucune demande éditeur réelle.

Preuve :
- Living Threshold run `37198162015` — **SUCCESS**
- commit capturé `103aab8b82684e65020b4c9575df0f6819a69b7f`
- artifact `11301612556`
- digest `sha256:c567c6e27c5e4648fe3267becb48736b5861bb22c2ae85ffa31009e3626695d3`
- `GAME_SUPPORT_REQUEST_MOBILE_OVERFLOW 0`
- `FLOW_ASSERT game support request local-only triage`
- `MULTISCREEN_CAPTURE_COUNT 67`

Captures :
- `desktop-game-support-request.png`
- `mobile-game-support-request.png`

Toujours non implémenté :
- persistance serveur de la demande ;
- triage admin réel ;
- création automatique réelle du Rights Case ;
- notification membre ;
- contact éditeur ;
- outbound.


## 21. Proposition de reclassification du gate frontend

Document :
`docs/MODARYX-V2-FRONTEND-GATE-RECLASSIFICATION-PROPOSAL-20261004.md`

**Statut : PROPOSITION UNIQUEMENT — NON APPROUVÉE / NON ACTIVE**

Objet :
- séparer le gate **High-Fi final** du démarrage éventuel d’un **preview engineering isolé** ;
- conserver toutes les validations humaines/appareils comme blockers avant finalisation/cutover ;
- permettre, uniquement après décision explicite, un root preview noindex, branche dédiée, sans `main`, sans DNS/Cloudflare critique et sans exposition production.

État :
- proposition : **TERMINÉE**
- reclassification canonique : **NON PRISE**
- stack : **NON SÉLECTIONNÉE**
- root preview : **NON CRÉÉ**
- production/cutover : **BLOQUÉS**

Cette proposition ne constitue pas une autorisation technique.


### Micro-preuve contrat demande membre — 4 octobre 2026

**TERMINÉ pour le contrat pré-production**

Fichiers :
- `qa/modaryx-v2-game-support-request-contract.json`
- `qa/check-v2-game-support-request-contract.mjs`
- `.github/workflows/modaryx-v2-game-support-request-contract-proof.yml`

Preuve :
- workflow `MODARYX V2 Game Support Request Contract Proof`
- run `37199100800` — **SUCCESS**
- commit capturé `971de05729cfb8ebd582bce5b7244b996cfbc516`
- `GAME_SUPPORT_REQUEST_STATE_COUNT 7`
- `GAME_SUPPORT_REQUEST_INVARIANT_COUNT 8`
- `PASS_V2_GAME_SUPPORT_REQUEST_CONTRACT`

Invariants verrouillés :
- brouillon local ≠ demande envoyée ;
- demande membre ≠ permission éditeur ;
- acceptation produit avant Rights Case ;
- acceptation produit avant outbound éditeur ;
- le membre ne peut pas déclarer une licence ;
- baseline sûre reste originale MODARYX ;
- refus produit ne contacte pas l’éditeur ;
- doublon ne crée pas un Rights Case dupliqué.

Cette preuve valide le contrat, pas la persistance serveur, le triage réel, les notifications ni l’automatisation Rights Case.


## 22. Contrat d’interprétation automatique des réponses éditeurs

**TERMINÉ pour le contrat pré-production / parsing réel PREUVE MANQUANTE**

Fichiers :
- `qa/modaryx-v2-publisher-response-contract.json`
- `qa/check-v2-publisher-response-contract.mjs`
- `.github/workflows/modaryx-v2-publisher-response-contract-proof.yml`

Preuve :
- run `37199257204` — **SUCCESS**
- commit capturé `555267e5e09c751cd4886cd10902553c98eed9b0`
- `PUBLISHER_RESPONSE_INTERPRETATION_STATE_COUNT 4`
- `PUBLISHER_RESPONSE_SCOPE_STATUS_COUNT 6`
- `PASS_V2_PUBLISHER_RESPONSE_CONTRACT`

États d’interprétation :
- SAFE_AUTOMATION
- NEEDS_REVIEW
- LEGAL_REVIEW_REQUIRED
- DENIED

Scopes :
- GRANTED
- GRANTED_WITH_LIMITS
- DENIED
- UNADDRESSED
- EXPIRED
- REVOKED

Invariants :
- scope absent ≠ accordé ;
- ambiguïté = revue ;
- risque juridique = LEGAL_REVIEW_REQUIRED ;
- aucun accord global inféré ;
- droits Web et MODARYX Forge séparés ;
- expiration/révocation rebloquent ;
- réponse brute + provenance conservées ;
- réponse matérielle notifiée à l’administration.

Toujours non implémenté :
- mailbox/inbound réel ;
- parser réel ;
- vérification de provenance réelle ;
- notification réelle ;
- moteur de politique de licence réel.


## 23. Triage administrateur des demandes de support — preuve prototype

**TERMINÉ pour le prototype fictif / backend réel PREUVE MANQUANTE**

Matérialisé :
- demande membre fictive en état `TRIAGE` ;
- contrôles existence / doublon / pertinence modding / restrictions-risque légal ;
- décision locale `ACCEPTED_SAFE_BASELINE` ;
- refus produit local possible ;
- Rights Case uniquement préparé en démonstration ;
- aucun contact éditeur ;
- aucun outbound ;
- aucun asset officiel débloqué.

Preuve Living Threshold :
- run `37199552009` — **SUCCESS**
- commit capturé `d6716baabdb573012ef722d7f5fa014142f4d84d`
- artifact `11302751771`
- digest `sha256:9af7ba96ea9c8aed64f11cf9f2b15ae74cc9fe8e89798aa4f270e8715a58cd59`
- `FLOW_ASSERT member support triage accepted safe baseline only`
- `MULTISCREEN_CAPTURE_COUNT 67`

Surface map :
- run `37200329164` — **SUCCESS**
- `SURFACE_MAP_COUNT 23`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`

Toujours non implémenté :
- queue serveur ;
- triage réel ;
- décision admin authentifiée ;
- Rights Case production ;
- outbound.


## 24. Interprétation automatique des réponses éditeurs — preuve UI

**TERMINÉ pour le prototype fictif / moteur réel PREUVE MANQUANTE**

Matérialisé :
- état `SAFE_AUTOMATION` pour une réponse fictive explicite et partielle ;
- scopes écrits seuls applicables ;
- notification admin indiquée comme fictive/non envoyée ;
- fallback `LEGAL_REVIEW_REQUIRED` pour clause ambiguë, conflit de documents ou portée incertaine ;
- aucun déblocage automatique en cas d’ambiguïté.

Preuve Living Threshold :
- run `37200132643` — **SUCCESS**
- commit capturé `81ddfbb24d9ff3a3e74342121cbcc1b779810681`
- artifact `11302418920`
- digest `sha256:0f9bb8ea6d2293c1c866026f11d2a7200e1f80dd3a4b6748204dcf3463b08e35`
- `FLOW_ASSERT publisher response interpretation safe automation with legal fallback`
- `MULTISCREEN_CAPTURE_COUNT 67`

Surface map :
- run `37200329164` — **SUCCESS**
- 23 surfaces / 6 états runtime réels toujours ouverts.

Toujours non implémenté :
- mailbox inbound ;
- parsing de réponse réelle ;
- vérification provenance ;
- moteur licence/policy ;
- notification admin réelle.


## 25. Vérification contact éditeur → REQUEST_READY — preuve prototype

**TERMINÉ pour le prototype et le contrat / outbound réel PREUVE MANQUANTE**

Preuve UI Living Threshold :
- run `37201151562` — **SUCCESS**
- commit capturé `238cc7f5fae3720aa495ca2e6c3909c8baabc21a`
- artifact `11303470181`
- digest `sha256:853428274c5abce89cd1ab2b147005161b656f7e613ae121fd191835a69ed719`
- `KEYBOARD_REACHABLE 36 / 36`
- `PUBLISHER_CONTACT_MOBILE_OVERFLOW 0`
- `RIGHTS_MOBILE_OVERFLOW 0`
- `FLOW_ASSERT publisher contact verified before request ready`
- `MULTISCREEN_CAPTURE_COUNT 69`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Preuve contrat droits renforcé :
- run `37201224168` — **SUCCESS**
- `GAME_RIGHTS_CONTACT_ALLOWED_SOURCE_COUNT 5`
- `GAME_RIGHTS_CONTACT_FORBIDDEN_SOURCE_COUNT 5`
- `GAME_RIGHTS_REQUEST_READINESS_COUNT 5`
- `GAME_RIGHTS_SEND_GUARD_COUNT 7`
- `PASS_V2_GAME_RIGHTS_WORKFLOW`

Surface map :
- run `37201297613` — **SUCCESS**
- `SURFACE_MAP_COUNT 23`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`

Flux matérialisé :
`ACCEPTED_SAFE_BASELINE → CONTACT_CANDIDATE → CONTACT_VERIFIED → REQUEST_READY`.

Garde-fous :
- candidat ≠ contact vérifié ;
- aucune adresse devinée ;
- sources non officielles/non vérifiées interdites ;
- REQUEST_READY exige contact vérifié + scopes explicites + Rights Case + template courant ;
- REQUEST_READY ≠ REQUEST_SENT ;
- aucun outbound réel dans le prototype.

Toujours non implémenté :
- découverte de contact réelle ;
- preuve de domaine/contact réelle ;
- outbound email/API ;
- audit mailbox ;
- Game Rights Registry production.


## 26. Notifications droits éditeurs — contrat et micro-preuve ciblée

**TERMINÉ pour le contrat et la surface ciblée / événement réel PREUVE MANQUANTE**

Contrat :
- `docs/MODARYX-V2-NOTIFICATIONS-PREFERENCES-CONTRACT-20261003.md`
- `qa/modaryx-v2-rights-notification-contract.json`
- `qa/check-v2-rights-notification-contract.mjs`
- workflow `MODARYX V2 Rights Notification Contract Proof`

Preuve contrat :
- run `37202025942` — **SUCCESS**
- `RIGHTS_NOTIFICATION_EVENT_TYPE_COUNT 9`
- `RIGHTS_NOTIFICATION_INVARIANT_COUNT 8`
- `RIGHTS_NOTIFICATION_REQUIRED_EVIDENCE_COUNT 5`
- `PASS_V2_RIGHTS_NOTIFICATION_CONTRACT`

Événements structurés prévus :
- réponse éditeur reçue ;
- approved / approved with limits ;
- information complémentaire ;
- legal review required ;
- declined ;
- expiring / expired / revoked.

Garde-fous :
- aucun événement réel = aucune notification réelle ;
- notification liée à un Rights Case réel ;
- scope absent jamais présenté comme accordé ;
- `LEGAL_REVIEW_REQUIRED` ne débloque aucun droit ;
- confidentialité des réponses éditeurs ;
- droits Web et MODARYX Forge séparés ;
- badge réel uniquement avec compteur réel ;
- email/push bloqués sans infrastructure réelle.

### Incident QA ciblé et fermeture

Run Living Threshold `37201905576` :
- build : SUCCESS ;
- static a11y : SUCCESS ;
- browser a11y : **FAIL** ;
- erreur exacte : `publisher rights notification safety copy missing`.

Isolation :
- micro-proof dédié `MODARYX V2 Rights Notification Preview Micro-Proof` ;
- premier run `37202147304` : **FAIL** ;
- erreur exacte : `missing text: Démonstration · non reçue` ;
- cause isolée : le label utilise la règle CSS `text-transform: uppercase`, donc le texte rendu est `DÉMONSTRATION · NON REÇUE`.

Correction ciblée :
- assertions alignées sur le texte réellement rendu ;
- aucune modification fonctionnelle ou de contenu nécessaire.

Micro-proof après correction :
- run `37202244972` — **SUCCESS**
- commit capturé `356afffdee0280081a5684307e237ad9d4dfe51c`
- `RIGHTS_NOTIFICATION_MOBILE_OVERFLOW 0`
- `PASS_V2_RIGHTS_NOTIFICATION_PREVIEW`.

Le full Living Threshold de continuation doit rester séparément prouvé avant d’archiver le nouveau nombre de captures.


## 27. Cycle de vie des droits — expiration / révocation

**TERMINÉ pour le contrat + prototype / automation production PREUVE MANQUANTE**

Contrat :
- `qa/modaryx-v2-rights-lifecycle-contract.json`
- `qa/check-v2-rights-lifecycle-contract.mjs`
- workflow `MODARYX V2 Rights Lifecycle Contract Proof`

Preuve contrat :
- run `37204099457` — **SUCCESS**
- `RIGHTS_LIFECYCLE_STATE_COUNT 4`
- `RIGHTS_LIFECYCLE_INVARIANT_COUNT 9`
- `RIGHTS_LIFECYCLE_REACTIVATION_EVIDENCE_COUNT 6`
- `PASS_V2_RIGHTS_LIFECYCLE_CONTRACT`

Preuve UI :
- Living Threshold run `37204012017` — **SUCCESS**
- commit capturé `7dc36e1231872d1fdd5a7af17bed6f5ad0b717da`
- artifact `11303812534`
- digest `sha256:9718d2ff47e24b3ba50707bcb340adfe5fbff9bc24f7b73c0a95a93b1ff8cf00`
- `FLOW_ASSERT rights lifecycle expired revoked scopes reblocked`
- `MULTISCREEN_CAPTURE_COUNT 73`

Surface map :
- run `37204224753` — **SUCCESS**
- `SURFACE_MAP_COUNT 23`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`

Règles :
- EXPIRED et REVOKED rebloquent tous les usages dépendants ;
- EXPIRING_SOON ne crée aucun droit supplémentaire ;
- baseline originale MODARYX comme fallback lorsque juridiquement acceptable ;
- aucune réactivation silencieuse ;
- nouvelle preuve nécessaire pour réactivation ;
- droits Web et MODARYX Forge séparés ;
- transitions auditées et locks idempotents.

Toujours NON IMPLÉMENTÉ :
- scheduler ;
- monitor d'expiration ;
- inbound révocation ;
- lock automatique production ;
- revalidation automatique ;
- licence réelle.


## 28. IP / takedown — contrat + prototype

**TERMINÉ pour contrat et prototype / production PREUVE MANQUANTE**

Référence :
`docs/MODARYX-V2-IP-TAKEDOWN-WORKFLOW-20261004.md`

Contrat :
- `qa/modaryx-v2-ip-takedown-contract.json`
- `qa/check-v2-ip-takedown-contract.mjs`
- workflow `MODARYX V2 IP Takedown Contract Proof`
- run `37204583345` — **SUCCESS**
- `IP_TAKEDOWN_STATE_COUNT 12`
- `IP_TAKEDOWN_INVARIANT_COUNT 12`
- `IP_TAKEDOWN_RESTRICTION_EFFECT_COUNT 6`
- `PASS_V2_IP_TAKEDOWN_CONTRACT`

Preuve UI :
- Living Threshold run `37204720263` — **SUCCESS**
- commit capturé `eefd01c8ec1d35f7bd9212e40f65d2ac390479cd`
- artifact `11304695959`
- digest `sha256:126e3758ca6a4f1c19e85f6eb8be0c9d0b456705feb43ce1e8777ccbf77004f0`
- `FLOW_ASSERT ip takedown containment preserves evidence fallback legal escalation`
- `MULTISCREEN_CAPTURE_COUNT 75`

Surface map :
- run `37204857565` — **SUCCESS**
- `SURFACE_MAP_COUNT 23`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`

Matérialisé :
- RECEIVED ;
- CONTENT_LOCATED ;
- TEMP_RESTRICTED ;
- fallback original MODARYX ;
- preuves conservées ;
- autorité non vérifiée explicitement ;
- LEGAL_REVIEW_REQUIRED ;
- aucune restauration automatique.

Toujours NON IMPLÉMENTÉ :
- backend IpCase ;
- formulaire IP public ;
- mailbox IP ;
- invalidation cache/CDN/SW production ;
- anti-réupload production ;
- recours réel ;
- legal review opérationnelle.

Le contrat/prototype ne vaut pas conformité juridique finale.


## 29. Provenance assets / guard droits

**TERMINÉ pour les assets du prototype / production PREUVE MANQUANTE**

Manifest :
- `qa/modaryx-v2-asset-rights-manifest.json`

Checker :
- `qa/check-v2-asset-rights-provenance.mjs`

Workflow :
- `MODARYX V2 Asset Rights Provenance Proof`

Preuve :
- run `37205150007` — **SUCCESS**
- `ASSET_RIGHTS_PROVENANCE_COUNT 2`
- `ASSET_RIGHTS_REMOTE_REFERENCE_COUNT 0`
- `PASS_V2_ASSET_RIGHTS_PROVENANCE`

Assets couverts :
- `living-threshold-hero.png`
- `living-threshold-content-sheet.png`

Classification :
- `ORIGINAL_MODARYX_DEMO`
- `ALLOWED_PROTOTYPE_ONLY`

Le guard bloque :
- asset média prototype non listé ;
- Unknown / Forbidden ;
- changement de blob sans mise à jour du manifest ;
- preuve/politique absente ;
- références média distantes HTTP(S) dans le prototype.

Toujours PREUVE MANQUANTE :
- dossier de provenance/licence production complet ;
- assets de jeux réels ;
- licences éditeurs ;
- allowlist production ;
- scanning de tous futurs roots/media production.


## 30. Game Rights Registry — contrat machine-readable

**TERMINÉ pour le contrat / registre production PREUVE MANQUANTE**

Référence :
`docs/MODARYX-V2-GAME-RIGHTS-REGISTRY-CONTRACT-20261004.md`

Fichiers :
- `qa/modaryx-v2-game-rights-registry-contract.json`
- `qa/check-v2-game-rights-registry-contract.mjs`
- workflow `MODARYX V2 Game Rights Registry Contract Proof`

Preuve :
- run `37205429699` — **SUCCESS**
- `GAME_RIGHTS_REGISTRY_SURFACE_COUNT 8`
- `GAME_RIGHTS_REGISTRY_SCOPE_COUNT 18`
- `GAME_RIGHTS_REGISTRY_STATUS_COUNT 10`
- `GAME_RIGHTS_REGISTRY_ACTIVATION_GUARD_COUNT 14`
- `GAME_RIGHTS_REGISTRY_INVARIANT_COUNT 14`
- `PASS_V2_GAME_RIGHTS_REGISTRY_CONTRACT`

Règles verrouillées :
- aucun statut global `APPROVED_ALL` ;
- uniquement GRANTED / GRANTED_WITH_LIMITS peuvent autoriser ;
- scope exact + surface exacte + preuve + dates + conditions ;
- NO_RESPONSE / PENDING / LEGAL_REVIEW_REQUIRED n'autorisent rien ;
- Web n'implique jamais MODARYX Forge ;
- asset officiel doit référencer un ScopeDecision ;
- EXPIRED / REVOKED fail closed ;
- Registry indisponible = fail closed pour usages sensibles ;
- import legacy démarre non vérifié ;
- membre ne peut pas écrire GRANTED / CONTACT_VERIFIED ;
- MODARYX IA ne peut pas créer GRANTED sans policy gate ;
- audit historique non réécrit silencieusement.

Toujours NON IMPLÉMENTÉ :
- database ;
- API ;
- admin CRUD réel ;
- policy engine ;
- scheduler/revalidation ;
- asset linkage production ;
- audit store production.


## 32. MODARYX IA — preview site + contrat d’intégration

**TERMINÉ pour le prototype et le contrat / système IA réel PREUVE MANQUANTE**

Preuve Living Threshold :
- run `37211271783` — **SUCCESS**
- commit capturé `f8616f18876c49de45b3d208222be042dd2b543a`
- artifact `11306731614`
- digest `sha256:6cd590ef764afc4825cec9f199c504fbd57b6d7dd296a629fa311a1393495047`
- `KEYBOARD_REACHABLE 37 / 37`
- `FLOW_ASSERT modaryx ai preview no fake model or action`
- `MULTISCREEN_CAPTURE_COUNT 77`.

Preuve contrat :
- workflow `MODARYX V2 Assistant Contract Proof`
- run `37211787695` — **SUCCESS**
- `MODARYX_AI_PERMISSION_TIER_COUNT 5`
- `MODARYX_AI_PREVIEW_STATE_COUNT 7`
- `MODARYX_AI_INVARIANT_COUNT 10`
- `PASS_V2_MODARYX_AI_INTEGRATION_CONTRACT`.

Surface map :
- `modaryx-ai-preview`
- total : **24 surfaces**
- toutes restent `BLOCKED_GATE`.

Matérialisé :
- entrée desktop/mobile ;
- surface MODARYX IA dédiée ;
- composer désactivé ;
- absence de modèle/provider/backend explicitée ;
- sources, permissions et incertitude rendues visibles ;
- aucune réponse ou action IA réelle simulée.

Toujours NON IMPLÉMENTÉ :
- gateway ;
- model router ;
- knowledge layer / retrieval ;
- tool layer ;
- permission engine réel ;
- eval harness ;
- observabilité ;
- assistant production ;
- intégration MODARYX Forge.


## 31. Publisher Outbound — contrat de transport

**TERMINÉ pour le contrat pré-production / transport réel PREUVE MANQUANTE**

Fichiers :
- `qa/modaryx-v2-publisher-outbound-contract.json`
- `qa/check-v2-publisher-outbound-contract.mjs`
- `.github/workflows/modaryx-v2-publisher-outbound-contract-proof.yml`

Preuve :
- workflow `MODARYX V2 Publisher Outbound Contract Proof`
- run `37210953700` — **SUCCESS**
- commit capturé `f56ee00e0a304e89b7062e8755d6cfa97a20cc13`
- `PUBLISHER_OUTBOUND_STATE_COUNT 11`
- `PUBLISHER_OUTBOUND_ENQUEUE_GUARD_COUNT 9`
- `PUBLISHER_OUTBOUND_INVARIANT_COUNT 10`
- `PASS_V2_PUBLISHER_OUTBOUND_CONTRACT`

États transport :
- REQUEST_READY ;
- OUTBOUND_QUEUED ;
- SEND_ATTEMPTED ;
- PROVIDER_ACCEPTED ;
- DELIVERED ;
- DELIVERY_UNKNOWN ;
- BOUNCED ;
- SUPPRESSED ;
- CANCELED ;
- FAILED_RETRYABLE ;
- FAILED_FINAL.

Règles verrouillées :
- REQUEST_READY ≠ envoyé ;
- contact officiel vérifié requis avant queue ;
- idempotence obligatoire ;
- opt-out/refus actif bloque la queue ;
- succès transport ≠ permission/licence ;
- bounce ne déclenche jamais une adresse devinée ;
- retry conserve le logical request id ;
- relance commerciale ≠ retry technique ;
- droits Web et MODARYX Forge séparés.

Toujours NON IMPLÉMENTÉ :
- queue réelle ;
- adapter provider email/API ;
- identité d’envoi ;
- webhooks transport ;
- gestion bounce réelle ;
- corrélation réelle des réponses.

Aucun email réel n’est envoyé par ce contrat.


## 33. Publisher Inbound — contrat + prototype

**TERMINÉ pour contrat et prototype / infrastructure réelle PREUVE MANQUANTE**

Contrat :
- `qa/modaryx-v2-publisher-inbound-contract.json`
- `qa/check-v2-publisher-inbound-contract.mjs`
- workflow `MODARYX V2 Publisher Inbound Contract Proof`
- run `37214242330` — **SUCCESS**
- `PASS_V2_PUBLISHER_INBOUND_CONTRACT`.

Micro-proof :
- workflow `MODARYX V2 Publisher Inbound Preview Micro-Proof`
- run `37214564614` — **SUCCESS**
- `PUBLISHER_INBOUND_MOBILE_OVERFLOW 0`
- `PASS_V2_PUBLISHER_INBOUND_PREVIEW`.

Preuve UI :
- Living Threshold run `37214829645` — **SUCCESS**
- commit `31db0796949a3c453f61864d84e3cf86f103aa94`
- artifact `11308280526`
- digest `sha256:124e7465bbb4b732153b2f8858a9288b96a59a2d7f1d905c1b0fea44df7d8a5c`
- `FLOW_ASSERT publisher inbound correlation provenance fail-closed`
- `MULTISCREEN_CAPTURE_COUNT 81`.

Surface map :
- run `37214676514` — **SUCCESS**
- 24 surfaces ;
- 6 runtime states réels non résolus.

Règles :
- inbound transport ≠ permission ;
- corrélation avant interprétation ;
- provenance technique ≠ autorité juridique ;
- SPF/DKIM/DMARC seuls insuffisants ;
- unmatched/untrusted = fail closed ;
- attachments en quarantaine avant traitement ;
- raw message + headers conservés ;
- Web / MODARYX Forge séparés.

Toujours NON IMPLÉMENTÉ :
- mailbox/webhook ;
- correlation engine ;
- provenance verifier ;
- attachment scanner ;
- response router.


## 34. Tablet reflow — preuve navigateur ciblée

**TERMINÉ pour reflow navigateur simulé / appareil physique PREUVE MANQUANTE**

Incident initial :
- run `37215370580` — **FAIL**
- erreur exacte : Game Hub à 834×1112 avec overflow horizontal de **220 px**
- cause isolée : topbar desktop conservée trop longtemps ; `.top-actions` dépassait le viewport.

Correction ciblée :
- navigation primaire repliée en shell menu/search pour la plage **761–1050 px** ;
- aucun changement desktop ≥1051 px ;
- règles mobile ≤760 px conservées.

Micro-proof intermédiaires :
- `37215609256` / `37215757686` / `37215867021` : échecs de checker sur l'assertion textuelle `Catalogue global` après fermeture du premier overflow ;
- cause : `innerText` reflétait le `text-transform: uppercase` du kicker ;
- checker rendu indépendant du style via `textContent`.

Micro-proof final :
- workflow `MODARYX V2 Tablet Reflow Micro-Proof`
- run `37215965531` — **SUCCESS**
- commit capturé `2c867f7292ea5d5bfc23f366868e50a96f8d7350`
- viewport : **834×1112**
- `TABLET_REFLOW_SURFACE_COUNT 12`
- `PASS_V2_TABLET_REFLOW`
- overflow = **0** sur :
  - Game Hub
  - Games Index
  - Catalog
  - Collections
  - Creators
  - Community
  - Creator Studio
  - Library
  - Account
  - MODARYX IA
  - Rights Dashboard
  - Rights expanded.

Continuation générale après correction CSS :
- Living Threshold run `37215577121` — **SUCCESS**
- commit capturé `2692094981a2f67b1142709e33747bbde13a253b`
- artifact `11308176729`
- digest `sha256:824fbf35b192aa7f48d6fb283c9192a20b279cc8e315ff38e5b50542e916be2d`
- `KEYBOARD_REACHABLE 37 / 37`
- desktop/mobile overflow : `0 / 0`
- `MULTISCREEN_CAPTURE_COUNT 81`.

Cette preuve ne remplace pas :
- une vraie tablette physique ;
- Safari/iPadOS réel ;
- validation tactile humaine ;
- screen reader réel.

Le blocker appareil physique reste donc ouvert.


## 35. Narrow reflow 320 — incident ciblé

**EN COURS — correction produit non encore prouvée**

Premier run :
- workflow `MODARYX V2 Narrow Reflow 320 Micro-Proof`
- run `37216217158` — **FAIL**
- build : SUCCESS
- Game Hub / Games / Catalog / Collections / Creators / Community / Creator Studio / Library : overflow 0
- échec exact : Account à 320×900 → overflow horizontal **65 px**
- cause isolée : la navigation compte en flex conserve une largeur min-content qui élargit le grid parent ; les actions compte héritent ensuite d’un conteneur trop large.

Première correction :
- commit `03119e0482d19b5f638afefd2ccabd96dc008bb1`
- résultat run `37216621771` : **FAIL identique** ;
- cause de la correction inefficace : une règle `.account-shell{grid-template-columns:1fr}` plus tardive dans le même media query écrase le `minmax(0,1fr)` ajouté plus tôt.

Procédure :
- aucun full replay ;
- correction suivante doit neutraliser la règle plus tardive ou imposer le min-width au shell/nav ;
- relancer uniquement le micro-proof 320 avant continuation générale.


## 36. Narrow 320 + matrice responsive — fermeture ciblée

**TERMINÉ pour émulation navigateur / appareils réels PREUVE MANQUANTE**

Narrow 320 :
- workflow `MODARYX V2 Narrow Reflow 320 Micro-Proof`
- run `37217511653` — **SUCCESS**
- commit capturé `b57281c345aa0868208a53ec5137779185df7386`
- `NARROW_REFLOW_SURFACE_COUNT 12`
- `PASS_V2_NARROW_REFLOW_320`

Matrice responsive :
- workflow `MODARYX V2 Responsive Matrix Micro-Proof`
- run `37218193186` — **SUCCESS**
- commit capturé `eb48b1763537b1082bfece56e0d8294b0e0eee29`
- largeurs : 360 / 430 / 768 / 1024 / 1280 / 1920
- 12 surfaces par largeur
- marqueurs `PASS_V2_REFLOW_VIEWPORT_<width>`

Les correctifs narrow couvrent notamment :
- Account : track `minmax(0,1fr)`, actions wrappables ;
- Rights : actions wrappables ;
- Publisher Contact : track contraint, `min-width:0`.

Cette section **supersède l’état EN COURS de la section 35**.

Limites inchangées :
- émulation Chrome uniquement ;
- appareil physique : PREUVE MANQUANTE ;
- Safari/iPadOS réel : PREUVE MANQUANTE ;
- vrai screen reader : PREUVE MANQUANTE ;
- validation tactile humaine : PREUVE MANQUANTE.


## 37. Sémantique des états actifs — navigation et onglets

**TERMINÉ pour le prototype / screen reader réel PREUVE MANQUANTE**

Correction :
- navigation primaire : `aria-current="page"` sur la destination active ;
- utilitaires desktop/mobile : état courant exposé ;
- onglets/boutons de vue : `aria-pressed` synchronisé à l’état React ;
- aucune modification de routing ou de backend.

Micro-proof :
- workflow `MODARYX V2 Active State Semantics Micro-Proof`
- run `37219118824` — **SUCCESS**
- commit capturé `b553336718ef0a00818c20631e9e511cafc4a5f8`
- `ACTIVE_STATE_PRIMARY_NAV_OK`
- `ACTIVE_STATE_LOCAL_TABS_OK`
- `ACTIVE_STATE_VIEW_TOGGLE_OK`
- `ACTIVE_STATE_ACCOUNT_TABS_OK`
- `PASS_V2_ACTIVE_STATE_SEMANTICS`

Continuation générale de la correction App :
- Living Threshold run `37219047594` — **SUCCESS**
- commit capturé `63f00b5b70485502592a4f3d687b6befd53f197f`
- artifact `11309073492`
- digest `sha256:9b07ae5ea4d66dc65a0f72c8efa0788b29a5f5c367301a50530609fb80159144`
- `KEYBOARD_REACHABLE 37 / 37`
- desktop/mobile overflow : `0 / 0`
- `MULTISCREEN_CAPTURE_COUNT 81`

Limite :
- cette preuve navigateur ne remplace pas NVDA / VoiceOver / TalkBack réels.


## 38. Skip link + focus de route + reduced motion

**TERMINÉ pour le prototype navigateur / AT réel PREUVE MANQUANTE**

Implémenté :
- skip link `Aller au contenu principal` ;
- cible unique `#main-content` focusable programmatiquement ;
- focus déplacé vers le contenu principal après changement de route SPA ;
- scroll route `smooth` en mode normal ;
- scroll route `auto` sous `prefers-reduced-motion: reduce`.

Incident micro-proof :
- premier run `37219418914` — **FAIL**
- erreur exacte : skip link mesuré pendant sa transition, top `-31.49px` malgré hauteur 44px ;
- cause isolée : checker observait avant la fin de la transition CSS 140ms ;
- correction ciblée : attente 220ms dans le checker, aucun changement produit supplémentaire.

Micro-proof final :
- run `37219490005` — **SUCCESS**
- commit capturé `cbb0787ef8d433ccd69d24dde6c3b24980f477f6`
- `SKIP_LINK_VISIBLE_TARGET_OK`
- `ROUTE_FOCUS_MAIN_OK`
- `ROUTE_SCROLL_NORMAL smooth`
- `ROUTE_SCROLL_REDUCED auto`
- `PASS_V2_ROUTE_FOCUS_AND_SKIP_LINK`.

Continuation générale produit :
- Living Threshold run `37219359937` — **SUCCESS**
- commit capturé `ddc4da6e3193d063d7bfe7f6cb91a58340c49c8f`
- artifact `11309950992`
- digest `sha256:b1ac20cca202322b33afdf03c7da9114963676b90e17027280f76fa6ef95db53`
- `KEYBOARD_REACHABLE 38 / 38`
- desktop/mobile overflow `0 / 0`
- `MULTISCREEN_CAPTURE_COUNT 81`.

Limites :
- aucun screen reader réel ;
- aucune validation humaine clavier ;
- aucun navigateur Safari réel.


## 39. Matrice structure accessibilité — landmarks, titres et noms accessibles

**TERMINÉ pour navigateur automatisé / AT réel PREUVE MANQUANTE**

Premier run :
- `37219723858` — **FAIL**
- erreur exacte : Game Hub `main#main-content` sans `h1` interne ;
- cause : hero/h1 Aetherlands était placé avant le landmark `main`.
- Discover utilisait également un `main` sans cible `#main-content`.

Correction ciblée :
- Game Hub : hero + navigation locale + hub regroupés dans un unique landmark `main#main-content` ;
- Discover : landmark principal reçoit la même cible/focus programmables ;
- aucun changement de donnée/backend.

Micro-proof après correction :
- workflow `MODARYX V2 Accessibility Structure Matrix Proof`
- run `37219841541` — **SUCCESS**
- commit capturé `c350d06aff236e35d3b9c58630056f8d1d305ae4`
- 15 surfaces vérifiées ;
- `A11Y_STRUCTURE_SURFACE_COUNT 15`
- `PASS_V2_ACCESSIBILITY_STRUCTURE_MATRIX`.

Contrôles par surface :
- un unique `main#main-content` ;
- un unique `h1` nommé dans le main ;
- aucun ID dupliqué ;
- aucun tabindex positif ;
- aucun contrôle visible sans nom accessible selon le checker DOM ;
- aucun rôle interactif AX ciblé sans nom.

Continuation générale :
- Living Threshold run `37219841451` — **SUCCESS**
- commit `c350d06aff236e35d3b9c58630056f8d1d305ae4`
- artifact `11310112115`
- digest `sha256:0e150be45f1dbff04bcb0580c64f7a91f92f5f96f5b271dfc3dc88ed690813f8`
- `KEYBOARD_REACHABLE 38 / 38`
- desktop/mobile overflow `0 / 0`
- `MULTISCREEN_CAPTURE_COUNT 81`.

Limite : AX Chrome automatisé ≠ validation NVDA / VoiceOver / TalkBack réelle.


## 40. Validation de formulaires — sémantique d’erreur

**TERMINÉ pour le prototype navigateur / AT réel PREUVE MANQUANTE**

Implémenté :
- champ demande de support : `aria-invalid` + `aria-describedby` vers l’erreur ;
- champ raison de signalement : même contrat ;
- focus récupérable après erreur ;
- erreur supprimée après correction utilisateur.

Micro-proof :
- workflow `MODARYX V2 Form Validation Semantics Micro-Proof`
- run `37220323315` — **SUCCESS**
- commit capturé `74bab3ea80ae0407f050a4cbe5edd7966a6bd50e`
- `FORM_ERROR_GAME_REQUEST_ASSOCIATED`
- `FORM_ERROR_REPORT_ASSOCIATED`
- `FORM_ERROR_FOCUS_RECOVERY_OK`
- `FORM_ERROR_CLEAR_RECOVERY_OK`
- `PASS_V2_FORM_VALIDATION_SEMANTICS`.

Limite :
- aucun NVDA / VoiceOver / TalkBack réel.

## 41. Hiérarchie de titres — fermeture ciblée

**TERMINÉ pour les 15 surfaces automatisées / AT réel PREUVE MANQUANTE**

Incident :
- run `37220405644` — **FAIL**
- erreur exacte : Content Detail exposait `h2 À propos` avant son `h1 Sentiers de l’aube` ;
- après réordre DOM, run `37221370768` — **FAIL** sur Catalog : saut `h1 → h3`.

Corrections ciblées :
- Content Detail : titre principal placé avant les sous-sections dans l’ordre DOM, layout visuel préservé par CSS Grid ;
- Catalog : cartes de contenu exposées en `h2` sur cette surface, sans changer les autres usages où `h3` reste approprié.

Micro-proof final :
- workflow `MODARYX V2 Accessibility Structure Matrix Proof`
- run `37221433701` — **SUCCESS**
- commit capturé `b30c93a3946c22310c1e40551a41232a6e7ba75f`
- 15 surfaces ;
- `A11Y_STRUCTURE_SURFACE_COUNT 15`
- `PASS_V2_ACCESSIBILITY_STRUCTURE_MATRIX`.

Continuation générale :
- Living Threshold run `37221433677` — **SUCCESS**
- commit capturé `b30c93a3946c22310c1e40551a41232a6e7ba75f`
- artifact `11310750338`
- digest `sha256:12033e64f9ebbc316cfe0bb783eccc4bb68740df8fb2e2c149b86cd8cfd354f0`
- `KEYBOARD_REACHABLE 38 / 38`
- desktop/mobile overflow `0 / 0`
- `MULTISCREEN_CAPTURE_COUNT 81`.

## 42. Route-focus checker — hardening CDP

**TERMINÉ — incident d’infrastructure ciblé fermé**

Après les corrections de titres :
- run route-focus `37221433797` — **FAIL**
- erreur exacte : `ECONNREFUSED 127.0.0.1:9242` avant assertions produit ;
- aucun échec de skip link/focus/scroll prouvé.

Correction checker :
- user-data-dir Chrome unique par PID ;
- détection d’exit Chrome ;
- fenêtre readiness étendue.

Micro-proof :
- run `37221560230` — **SUCCESS**
- commit capturé `6d40be7205f2e27efbd989d4411330423436d6da`
- `SKIP_LINK_VISIBLE_TARGET_OK`
- `ROUTE_FOCUS_MAIN_OK`
- `ROUTE_SCROLL_NORMAL smooth`
- `ROUTE_SCROLL_REDUCED auto`
- `PASS_V2_ROUTE_FOCUS_AND_SKIP_LINK`.

Cette fermeture concerne la fiabilité du checker ; elle ne remplace pas une validation humaine clavier ou screen reader réelle.


## 43. Métadonnées document / titre de route

**TERMINÉ pour le prototype / SEO production PREUVE MANQUANTE**

Implémenté :
- `html lang="fr"` ;
- description prototype ;
- `noindex,nofollow,noarchive` ;
- titre initial `MODARYX V2 — Prototype Living Threshold` ;
- mise à jour du titre lors des changements de route SPA.

Preuve :
- Living Threshold run `37222125590` — **SUCCESS**
- commit `a478afcf3eadfb1682754535d0ca632520601a26`
- artifact `11310576920`
- digest `sha256:ad2efb5f42047e36812f8a53e753adec443be53baab05a8ca2d92b44a7ca2fb3`
- `DOCUMENT_LANG fr`
- `DOCUMENT_ROBOTS noindex,nofollow,noarchive`
- `DOCUMENT_TITLE MODARYX V2 — Prototype Living Threshold`
- `ROUTE_TITLE_CONTRACT_OK`
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `KEYBOARD_REACHABLE 38 / 38`
- `MULTISCREEN_CAPTURE_COUNT 81`.

Limites :
- canonical/sitemap/SEO production non implémentés ;
- routage production non sélectionné ;
- preview reste volontairement noindex.


## 44. États asynchrones / loading

**TERMINÉ pour le contrat UX / production PREUVE MANQUANTE**

Référence :
`docs/MODARYX-V2-ASYNC-LOADING-STATE-CONTRACT-20261004.md`

Contrat machine-readable :
`qa/modaryx-v2-async-loading-contract.json`

Décision :
- ne pas inventer de latence dans le prototype local ;
- loading initial, refresh, stale, empty et erreurs restent distincts ;
- skeleton uniquement lorsqu’une vraie frontière asynchrone le justifie ;
- production async reste non implémentée.


## 45. Preuve contrat async/loading

**TERMINÉ — contrat pré-production**

Preuve :
- workflow `MODARYX V2 Async Loading Contract Proof`
- run `37222822827` — **SUCCESS**
- commit `ee106dd7ae6e4ba50923f844e18ec5b28798aca5`
- `ASYNC_STATE_COUNT 9`
- `ASYNC_INVARIANT_COUNT 10`
- `PASS_V2_ASYNC_LOADING_CONTRACT`

Cette preuve valide le contrat, pas un backend asynchrone réel.


## 46. Archive visuelle courante + navigation logo

**TERMINÉ pour le prototype / production toujours BLOQUÉE**

Preuve Living Threshold la plus fraîche couvrant le code produit courant avant les ajouts QA-only :
- run `37223254174` — **SUCCESS**
- commit capturé `183c93867e147d928b88c11e41f2deb368308f88`
- artifact `11310823204`
- digest `sha256:5fb9a9fadff38960fbe977680cb393aa85e9a5a005203973d8549718503f98e6`
- `KEYBOARD_REACHABLE 38 / 38`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `MULTISCREEN_CAPTURE_COUNT 81`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`
- `FLOW_ASSERT MODARYX logo returns to discover`.

Le logo MODARYX du shell retourne désormais vers Découvrir dans le prototype.

Cette archive ne ferme aucun blocker humain/appareil et ne vaut pas frontend production.

## 47. Text spacing / reflow ciblé

**TERMINÉ pour Chrome automatisé / validation humaine et AT réel PREUVE MANQUANTE**

Micro-proof :
- workflow `MODARYX V2 Text Spacing Reflow Micro-Proof`
- run `37224236854` — **SUCCESS**
- commit capturé `8dd2fcaa7a9806510ad0efd1f29bde68489939e2`
- `TEXT_SPACING_SURFACE_COUNT 12`
- `PASS_V2_TEXT_SPACING_REFLOW`.

Override de test :
- line-height `1.5` ;
- letter-spacing `0.12em` ;
- word-spacing `0.16em` ;
- paragraph spacing `2em`.

Résultat :
- 12 surfaces ciblées ;
- overflow horizontal = 0 ;
- texte horizontalement clippé détecté = 0 selon le checker ciblé.

Surfaces :
- Game Hub
- Games Index
- Catalog
- Collections
- Creators
- Community
- Creator Studio
- Library
- Account
- MODARYX IA
- Rights Dashboard
- Rights expanded.

Limites :
- preuve automatisée Chrome uniquement ;
- ne remplace pas zoom navigateur humain ;
- ne remplace pas text resize réel sur Safari/iOS ;
- ne remplace pas screen reader ou validation humaine.


## 48. Keyboard reachability matrix

**TERMINÉ pour Chrome automatisé / validation humaine PREUVE MANQUANTE**

- run `37224495290` — **SUCCESS**
- commit `a43a8ffd95a32f727f5bb7dc5d72a912c9325ab4`
- 15 surfaces
- `PASS_V2_ACCESSIBILITY_STRUCTURE_MATRIX`
- `PASS_V2_KEYBOARD_REACHABILITY_MATRIX`
- tous les contrôles visibles ciblés atteints au clavier sur chaque surface.

Cette preuve ne remplace pas un test humain clavier ni un screen reader réel.


## 49. Confiance publique — surface prototype

**TERMINÉ pour la structure et le prototype / publication finale PREUVE MANQUANTE**

Référence :
`docs/MODARYX-V2-PUBLIC-LEGAL-TRUST-READINESS-20261004.md`

Preuve UI :
- run `37227306023` — **SUCCESS**
- commit `63868585bfc89b24eb2c138a0e64889932de69b8`
- artifact `11312436153`
- digest `sha256:dabf001e15e97608b988105de220a6743bca97664dcbe530303aabb1cbeea1be`
- `KEYBOARD_REACHABLE 39 / 39`
- `MULTISCREEN_CAPTURE_COUNT 83`.

Preuves ciblées :
- structure/accessibilité run `37227306134` — **SUCCESS**, 16 surfaces ;
- touch matrix : **16 surfaces** ;
- forced colors : **13 surfaces** ;
- text spacing run `37227306076` — **SUCCESS**, 13 surfaces ;
- narrow 320 run `37227306114` — **SUCCESS**, 13 surfaces ;
- tablet run `37227306108` — **SUCCESS**, 13 surfaces ;
- surface map run `37227011707` — **SUCCESS**, **25 surfaces**.

Matérialisé :
- entrée footer `Confiance & légal` ;
- catégories de readiness ;
- statuts non finaux explicites ;
- prototype noindex ;
- aucun contenu final présenté comme approuvé.

Toujours PREUVE MANQUANTE :
- identité opérateur réelle ;
- textes finaux ;
- canaux support/IP/sécurité réels ;
- revue juridique ;
- publication production.


## 50. Help / Documentation + archive produit courante

**TERMINÉ pour le prototype/contrat / production BLOQUÉE**

Contrat :
- `docs/MODARYX-V2-HELP-DOCUMENTATION-CONTRACT-20261004.md`
- run `37229486530` — **SUCCESS**
- `HELP_DOCS_STATE_COUNT 7`
- `HELP_DOCS_TOPIC_COUNT 16`
- `HELP_DOCS_INVARIANT_COUNT 11`
- `PASS_V2_HELP_DOCUMENTATION_CONTRACT`.

Surface map :
- run `37229378669` — **SUCCESS**
- `SURFACE_MAP_COUNT 26`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`.

Archive Living Threshold la plus fraîche couvrant le code produit matérialisé avant les ajouts docs/QA-only ultérieurs :
- run `37228199151` — **SUCCESS**
- commit `b5601ed14c224cec5c163d6783a0a351eb0e0f68`
- artifact `11312597804`
- digest `sha256:a67562f537c087e56417367be5c8f2b1da5268bd21d045dbbfc9196a0d4ab45d`
- `KEYBOARD_REACHABLE 40 / 40`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `MULTISCREEN_CAPTURE_COUNT 85`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Matrice structure :
- run `37228199163` — **SUCCESS**
- 17 surfaces structure ;
- 17 surfaces touch ;
- 14 surfaces forced colors ;
- Help/Docs incluse.

Responsive ciblé :
- text spacing run `37228199140` — **SUCCESS**, 14 surfaces ;
- narrow 320 run `37228199109` — **SUCCESS**, 14 surfaces ;
- tablet run `37228199125` — **SUCCESS**, 14 surfaces.

Help/Docs matérialise :
- rubriques produit ;
- raccourcis vers tâches produit ;
- état final explicitement PREUVE MANQUANTE ;
- aucune fonction serveur inventée.

Toujours non final :
- contenu documentation production ;
- pipeline/repository docs ;
- recherche docs ;
- link/stale checks production ;
- validation humaine ;
- AT/appareils ;
- textes juridiques finaux.


## 51. Modération / signalements / appels

**TERMINÉ pour contrat + prototype / production PREUVE MANQUANTE**

Contrat source :
`docs/MODARYX-V2-MODERATION-APPEALS-CONTRACT-20261003.md`

Contrat machine :
`qa/modaryx-v2-moderation-appeals-contract.json`

Preuve contrat :
- run `37230196601` — **SUCCESS**
- `MODERATION_STATE_COUNT 7`
- `MODERATION_ACTION_COUNT 6`
- `MODERATION_INVARIANT_COUNT 12`
- `PASS_V2_MODERATION_APPEALS_CONTRACT`.

Preuve Living Threshold :
- run `37230093681` — **SUCCESS**
- commit `6134ec747cce538582236c39c4c656c07a0d5146`
- artifact `11313079816`
- digest `sha256:004e8a29f942dd177fd4b21c28cfda5d7ed4e6af2b872e18ff0cc9136262fd2e`
- `KEYBOARD_REACHABLE 41 / 41`
- desktop/mobile overflow `0 / 0`
- `FLOW_ASSERT moderation appeals preserves server authority and prior decision`
- `MULTISCREEN_CAPTURE_COUNT 87`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Accessibilité / responsive :
- structure/touch/forced-colors run `37230250723` — **SUCCESS** après fermeture ciblée d’un `ECONNREFUSED 127.0.0.1:9243` checker ;
- keyboard étendu run `37230361038` — **SUCCESS**, 18 surfaces, moderation `24 / 24` ;
- text spacing `37230028555` — SUCCESS, moderation overflow/clipped 0 ;
- narrow 320 `37230036543` — SUCCESS, moderation overflow 0 ;
- tablet `37230040694` — SUCCESS, moderation overflow 0.

Surface map :
- run `37230139266` — **SUCCESS**
- `SURFACE_MAP_COUNT 27`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`.

Matérialisé :
- RECEIVED ;
- UNDER_REVIEW ;
- APPEALED ;
- état public partageable ;
- historique conservé ;
- appel séparé ;
- Support ≠ Signalement ;
- actions Hide / Quarantine / Restore désactivées sans serveur.

Toujours NON IMPLÉMENTÉ :
- backend report/modération ;
- autorité serveur roles ;
- quarantine/remove/restore réels ;
- audit store ;
- appeal backend ;
- notifications réelles.

La validation humaine, screen reader réel et appareil physique restent PREUVE MANQUANTE.


## 52. SEO / i18n / contenu

**TERMINÉ pour contrat + garde-fou preview / production PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-SEO-I18N-CONTENT-CONTRACT-20261003.md`

Machine contract :
`qa/modaryx-v2-seo-i18n-content-contract.json`

Preuve :
- run `37230817511` — **SUCCESS**
- `SEO_I18N_EDITORIAL_STATE_COUNT 5`
- `SEO_I18N_INVARIANT_COUNT 12`
- `SEO_I18N_PREVIEW_ROBOTS noindex,nofollow,noarchive`
- `PASS_V2_SEO_I18N_CONTENT_CONTRACT`.

Le prototype reste :
- `lang=fr` ;
- `noindex,nofollow,noarchive` ;
- titre non générique ;
- titres SPA mis à jour par route logique.

Production reste à faire :
- canonicals V2 ;
- sitemap ;
- removed/archived URL behavior ;
- structured data ;
- i18n réel ;
- localisation/review.


## 53. Prototype security sinks / inline-style hardening

**TERMINÉ pour le prototype source / sécurité production PREUVE MANQUANTE**

Preuve ciblée :
- workflow `MODARYX V2 Prototype Security Sinks Micro-Proof`
- run `37231081387` — **SUCCESS**
- commit capturé `50d1d2aab8146aea5e6a63189c262497c73c2df3`
- `PROTOTYPE_SECURITY_REMOTE_REFERENCE_COUNT 0`
- `PROTOTYPE_SECURITY_DANGEROUS_SINK_COUNT 0`
- `PROTOTYPE_SECURITY_INLINE_STYLE_COUNT 0`
- `PROTOTYPE_SECURITY_INLINE_STYLE_STATUS SOURCE_CLEAN_FOR_STRICT_STYLE_SRC_EVALUATION`
- `PASS_V2_PROTOTYPE_SECURITY_SINKS`.

Fermé dans le prototype :
- aucune référence distante détectée par le checker ciblé ;
- aucun sink dangereux ciblé détecté ;
- aucun style inline React restant dans la source ciblée ;
- tailles/media/targets auparavant inline déplacés dans le CSS.

Cette preuve prépare une CSP stricte mais ne prouve pas :
- CSP production ;
- headers production ;
- backend security ;
- auth/session ;
- supply-chain complète ;
- absence absolue de toute vulnérabilité.


## 54. CSP / headers / rich text — preuve contrat

**TERMINÉ pour le contrat pré-production / déploiement réel PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-CSP-HEADERS-RICH-TEXT-POLICY-20261003.md`

Machine contract :
`qa/modaryx-v2-csp-headers-rich-text-contract.json`

Preuve :
- run `37232040196` — **SUCCESS**
- commit `d1e9aae73cce1aa7941613e9806257808c73a536`
- `CSP_DIRECTIVE_COUNT 13`
- `CSP_REQUIRED_HEADER_COUNT 5`
- `CSP_INVARIANT_COUNT 10`
- `PASS_V2_CSP_HEADERS_RICH_TEXT_CONTRACT`.

Verrouillé :
- `default-src 'self'` ;
- `script-src 'self'` ;
- `style-src 'self'` ;
- pas de `unsafe-inline` global ;
- pas de `unsafe-eval` ;
- `object-src 'none'` ;
- `frame-src 'none'` baseline ;
- rich text plain-text par défaut ;
- pipeline parse → sanitize allowlist → render ;
- liens externes http/https uniquement ;
- SW V2 isolé du V1 ;
- preview noindex ;
- Report-Only avant enforcement.

Toujours NON IMPLÉMENTÉ :
- headers CSP preview réels ;
- endpoint report réel ;
- CSP enforcement production ;
- headers production ;
- validation auth/providers/PWA sous CSP.


## 55. Notifications / préférences — preuve contrat

**TERMINÉ pour le contrat / services distants PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-NOTIFICATIONS-PREFERENCES-CONTRACT-20261003.md`

Machine contract :
`qa/modaryx-v2-notifications-preferences-contract.json`

Preuve :
- run `37232212946` — **SUCCESS**
- commit `d9ade196211e0dabe9465c555ee8c1134bd9baa1`
- `NOTIFICATION_TYPE_COUNT 27`
- `NOTIFICATION_PRIORITY_COUNT 4`
- `NOTIFICATION_INVARIANT_COUNT 10`
- `PASS_V2_NOTIFICATIONS_PREFERENCES_CONTRACT`.

Verrouillé :
- aucune notification distante inventée ;
- email/push cachés ou disabled sans infrastructure réelle ;
- marketing = opt-in explicite séparé ;
- pas d'écrasement silencieux en conflit de préférences ;
- badge uniquement depuis un compte réel ;
- notifications droits uniquement depuis un événement Rights réel ;
- `LEGAL_REVIEW_REQUIRED` ne débloque aucun droit ;
- Web et MODARYX Forge restent séparés.

Toujours NON IMPLÉMENTÉ :
- événements serveur ;
- email ;
- push ;
- préférences distantes ;
- résolution sync backend.


## 56. Onboarding / compte / créateur — preuve contrat

**TERMINÉ pour le contrat / auth et backend PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-ONBOARDING-ACCOUNT-CREATOR-CONTRACT-20261003.md`

Machine contract :
`qa/modaryx-v2-onboarding-account-creator-contract.json`

Preuve :
- run `37232342904` — **SUCCESS**
- commit `38025f4265b79c66ca5f4036afd0a39e1e66e9e8`
- `ONBOARDING_GUEST_CAPABILITY_COUNT 8`
- `ONBOARDING_SESSION_STATE_COUNT 5`
- `ONBOARDING_INVARIANT_COUNT 12`
- `PASS_V2_ONBOARDING_ACCOUNT_CREATOR_CONTRACT`.

Verrouillé :
- guest-first ;
- pas de login forcé pour exploration ;
- onboarding skippable ;
- Account / Public Profile / Creator séparés ;
- Library/favoris/profils/brouillons/recherches sauvegardées privés par défaut ;
- partage explicite ;
- rôles équipe = autorité serveur ;
- UI session reflète état réel ;
- support navigateur passkey ≠ passkey configurée ;
- marketing non activé par défaut ;
- échec save conserve les changements locaux.

Toujours NON IMPLÉMENTÉ :
- auth réelle ;
- profils distants ;
- autorité équipe ;
- passkeys ;
- notifications distantes ;
- export/suppression compte réels.


## 57. Gouvernance API — preuve contrat

**TERMINÉ pour la gouvernance pré-production / API réelle PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-API-GOVERNANCE-CONTRACT-20261003.md`

Machine contract :
`qa/modaryx-v2-api-governance-contract.json`

Preuve :
- run `37232488908` — **SUCCESS**
- commit `c17231128b5ea1f72400b66bba3df1d1a01f80ed`
- `API_MATURITY_STATE_COUNT 4`
- `API_PUBLICATION_GATE_COUNT 6`
- `API_INVARIANT_COUNT 8`
- `PASS_V2_API_GOVERNANCE_CONTRACT`.

Verrouillé :
- états experimental / beta / stable / deprecated ;
- changements additifs préférés ;
- aucune modification sémantique silencieuse d'une API stable ;
- aucune suppression stable sans fenêtre de migration ;
- clients frontend centralisés ;
- protocole MODARYX Forge versionné + capability negotiation ;
- webhooks signés, idempotents, protégés contre replay ;
- rollback et consumer compatibility pour évolution stable.

Toujours NON IMPLÉMENTÉ :
- API V2 publique ;
- choix final de versionnement ;
- runtime webhooks ;
- protocole MODARYX Forge réel.


## 58. Registre consolidé des contrats pré-production

**TERMINÉ — preuve consolidée / implémentations réelles restent distinctes**

Fichiers :
- `qa/modaryx-v2-preproduction-contract-registry.json`
- `qa/check-v2-preproduction-contract-registry.mjs`
- `.github/workflows/modaryx-v2-preproduction-contract-registry-proof.yml`

Incident initial :
- run `37232662714` — **FAIL**
- erreur exacte : checker dédié async manquant `qa/check-v2-async-loading-contract.mjs`
- les deux premiers contrats avaient déjà passé avant arrêt ;
- aucun full replay.

Isolation/correction ciblée :
- vérification de tous les checkers du registry ;
- seul `async-loading` était sans checker fichier dédié ;
- ajout de `qa/check-v2-async-loading-contract.mjs`.

Micro-proof/continuation :
- run `37232747869` — **SUCCESS**
- commit `905c83dad2bad10544060ae6ff8b9ff372bc8369`
- 19 contrats exécutés individuellement ;
- `PREPRODUCTION_CONTRACT_COUNT 19`
- `PREPRODUCTION_CONTRACT_REGISTRY_INVARIANT_COUNT 5`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Contrats couverts :
- MODARYX IA ;
- asset rights ;
- async/loading ;
- Game Rights Registry ;
- workflow droits ;
- demande support jeu ;
- Help/Docs ;
- IP takedown ;
- moderation/appeals ;
- publisher inbound/outbound/response ;
- rights lifecycle/notifications ;
- SEO/i18n ;
- CSP/headers/rich text ;
- notifications/preferences ;
- onboarding/account/creator ;
- API governance.

Cette preuve consolide les **contrats**. Elle ne transforme aucun backend, provider, auth, email, runtime Forge ou service externe en implémentation réelle.


## 59. Archive Living Threshold courante après hardening source

**TERMINÉ pour le code produit prototype / High-Fi final BLOQUÉ**

Preuve la plus fraîche couvrant le code produit après déplacement des styles inline vers CSS :
- run `37231060131` — **SUCCESS**
- commit `d1397e5e370bb8bc45d25b766239364291132a73`
- artifact `11314270782`
- digest `sha256:cedeb19b42f6e866c9823effb1d951701a90297ed619c9870eb3ccdbe4a812cf`
- `KEYBOARD_REACHABLE 41 / 41`
- desktop/mobile overflow `0 / 0`
- publisher contact mobile overflow `0`
- rights mobile overflow `0`
- game support request mobile overflow `0`
- rights notification mobile overflow `0`
- product flows : PASS
- captures : **87**.

Le HEAD courant contient ensuite surtout des ajouts QA/docs/contracts ; ne pas prétendre qu'un commit docs-only est une nouvelle preuve visuelle.


## 60. Public trust — preuve contrat + registry consolidé

**TERMINÉ pour le contrat / publication réelle PREUVE MANQUANTE**

Public trust contract :
- run `37233036635` — **SUCCESS**
- commit `9294ac7dc7de19a40f14d57b44335f480349eab6`
- `PUBLIC_TRUST_CATEGORY_COUNT 8`
- `PUBLIC_TRUST_READINESS_STATE_COUNT 7`
- `PUBLIC_TRUST_INVARIANT_COUNT 11`
- `PASS_V2_PUBLIC_TRUST_CONTRACT`.

Verrouillé :
- aucune identité opérateur/adresse/DPO/canal support/sécurité inventé ;
- politiques privacy dérivées de l'architecture réellement déployée ;
- placeholders jamais présentés comme textes finaux ;
- publication uniquement après état approuvé ;
- disclosures IA alignés sur les providers réellement déployés.

Registry consolidé :
- run `37233086517` — **SUCCESS**
- commit `21a9f3d05b3b41e852ce76d789b4767e02c7b83b`
- `PREPRODUCTION_CONTRACT_COUNT 20`
- public trust inclus ;
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Toujours PREUVE MANQUANTE :
- identité opérateur réelle ;
- textes juridiques finaux ;
- canaux support/IP/sécurité réels ;
- revue juridique ;
- publication production.


## 61. Route / cutover — preuve contrat machine

**TERMINÉ pour le contrat pré-production / cutover réel PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-ROUTE-CUTOVER-PLAN-20261003.md`

Machine contract :
`qa/modaryx-v2-route-cutover-contract.json`

Checker :
`qa/check-v2-route-cutover-contract.mjs`

Workflow dédié :
`.github/workflows/modaryx-v2-route-cutover-contract-proof.yml`

Preuve consolidée :
- registry run `37235052411` — **SUCCESS**
- `ROUTE_CUTOVER_LAYER_COUNT 4`
- `ROUTE_CUTOVER_INVARIANT_COUNT 8`
- `PASS_V2_ROUTE_CUTOVER_CONTRACT`
- `CONTRACT_REGISTRY_PASS route-cutover`
- `PREPRODUCTION_CONTRACT_COUNT 21`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Verrouillé :
- V2 build isolé → preview immutable → mapping redirects validé → promotion contrôlée ;
- aucune couche n'autorise automatiquement la suivante ;
- aucun redirect global aveugle ;
- aucune fausse ressource V2 créée uniquement pour préserver une ancienne URL ;
- preview liée au SHA exact et noindex ;
- aucune canonical getnovaforge ;
- migration SW ordonnée et rollback testé avant cutover ;
- legacy storage lu en read-only via migrator, pas de suppression globale ;
- `modaryx:v2:` reste le namespace cible ;
- DNS/DNSSEC/nameservers/IONOS/Cloudflare critique/PAGES_DOMAIN interdits sans instruction explicite ;
- `main` et production restent intacts avant promotion contrôlée.

Statut réel :
- root V2 : `NOT_CREATED`
- redirects : `DESIGN_ONLY`
- migration SW browser : `NOT_EXECUTED`
- cutover : `NOT_EXECUTED`
- DNS/Cloudflare : `UNCHANGED`.

Le contrat ne vaut pas preuve d'un vrai cutover.


## 62. Registry contrats pré-production étendu — 35 contrats

**TERMINÉ pour les contrats / implémentations réelles restent distinctes**

Registry :
`qa/modaryx-v2-preproduction-contract-registry.json`

Run :
`37235820192` — **SUCCESS**

Marqueurs :
- `PASS_V2_STORAGE_CACHE_SW_MIGRATION_CONTRACT`
- `PASS_V2_TRUST_PROVENANCE_DISTRIBUTION_CONTRACT`
- `PASS_V2_INSTALL_MANAGER_CONTRACT`
- `PASS_V2_FRONTEND_ISOLATION_CONTRACT`
- `PASS_V2_THREAT_MODEL_CONTRACT`
- `PASS_V2_A11Y_PERF_DESIGN_SYSTEM_CONTRACT`
- `PASS_V2_GAME_SUPPORT_LIFECYCLE_CONTRACT`
- `PASS_V2_GAME_HUB_CONTRACT`
- `PASS_V2_SEARCH_FILTER_DISCOVERY_CONTRACT`
- `PASS_V2_CONTENT_DETAIL_CONTRACT`
- `PASS_V2_COLLECTION_MODPACK_PROFILE_CONTRACT`
- `PASS_V2_CREATOR_STUDIO_CONTRACT`
- `PASS_V2_COMMUNITY_LIBRARY_NAV_CONTRACT`
- `PASS_V2_CRITICAL_FLOWS_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 35`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Nouveaux garde-fous machine consolidés :
- migration localStorage/cache/SW non destructive ;
- provenance/hash/signature/scan/distribution fail-closed ;
- manager/install jamais simulé ;
- isolation frontend V2 stricte ;
- threat model pré-implémentation ;
- WCAG/performance/design-system contractuel ;
- cycle de vie support jeu ;
- Game Hub ;
- recherche/filtres/découverte ;
- Content Detail ;
- Collection/Modpack/Profile ;
- Creator Studio ;
- Community/Library/navigation ;
- parcours critiques.

Important :
ce run prouve les **contrats et invariants**, pas :
- backend ;
- auth ;
- runtime MODARYX Forge ;
- distribution réelle ;
- migration SW réelle ;
- production ;
- validation humaine ;
- appareils ;
- screen readers ;
- Core Web Vitals réels.


## 63. VF readiness gate machine

**TERMINÉ pour le garde-fou de statut / VF reste BLOQUÉE**

Fichiers :
- `qa/modaryx-v2-vf-readiness-gate.json`
- `qa/check-v2-vf-readiness-gate.mjs`
- `.github/workflows/modaryx-v2-vf-readiness-gate-proof.yml`

Preuve :
- run `37235975698` — **SUCCESS**
- `VF_READINESS_OPEN_BLOCKER_COUNT 32`
- `VF_READINESS_STATUS BLOCKED`
- `PASS_V2_VF_READINESS_GATE`.

Le checker interdit de marquer la VF `READY` tant qu'un blocker requis reste `OPEN`.

Groupes ouverts :
- validations humaines/appareils ;
- production web ;
- runtime MODARYX Forge ;
- droits/légal.

Ce PASS valide uniquement l'honnêteté du gate. Il confirme explicitement que la **VF n'est pas validée**.


## 64. Registry contrats pré-production étendu — 39 contrats

**TERMINÉ pour les contrats / production PREUVE MANQUANTE**

Run :
`37236188453` — **SUCCESS**

Nouveaux marqueurs :
- `PASS_V2_ADAPTER_MODULE_BOUNDARIES_CONTRACT`
- `PASS_V2_DATA_FIXTURE_STRATEGY_CONTRACT`
- `PASS_V2_SCHEMA_PLAN_CONTRACT`
- `PASS_V2_INTERACTION_STATES_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 39`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Verrouillé en plus :
- UI V2 → application services → domain → adapters → externes, sans inversion ;
- aucun accès direct UI aux renderers/CSS/SW/localStorage legacy ;
- fixtures classées et jamais présentées comme corpus réel ;
- aucun faux auteur/badge/compatibilité/avis/classement ;
- schémas V2 versionnés sans écraser v1 ;
- ContentItem séparé de Release ;
- Collection / Modpack / Profile séparés ;
- états transversaux loading/empty/error/offline/stale/unavailable/auth/conflict/etc. explicitement contractuels ;
- unverified ne devient jamais success ;
- progression et capacités runtime ne sont jamais simulées.

Ces PASS sont des preuves de contrat, pas des preuves backend/runtime/production.


## 65. QA strategy + risk register — preuve machine

**TERMINÉ pour les contrats / validations réelles restent distinctes**

Run :
`37236335418` — **SUCCESS**

Marqueurs :
- `PASS_V2_QA_STRATEGY_CONTRACT`
- `PASS_V2_RISK_REGISTER_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 41`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Verrouillé :
- fonction / visuel / accessibilité / performance / sécurité / responsive / données / migration / PWA / anti-contamination restent des catégories de QA distinctes ;
- après erreur : erreur exacte → isolation → correction ciblée → micro-proof ;
- aucun full replay immédiat ;
- full replay uniquement en fin de candidat ;
- CWV terrain seulement avec mesure terrain réelle ;
- risque documenté ≠ risque fermé ;
- aucun cutover sans rollback ;
- aucune distribution sans droits ;
- aucune validation humaine déduite d'une automatisation ;
- aucun faux PASS/VF.

Les risques runtime, appareils, humain, production et droits restent ouverts tant que leurs preuves n'existent pas.


## 66. Registry contrats pré-production étendu — 45 contrats

**TERMINÉ pour les contrats / validation humaine et production restent BLOQUÉES**

Run :
`37236534430` — **SUCCESS**

Nouveaux marqueurs :
- `PASS_V2_SCREEN_ACCEPTANCE_CONTRACT`
- `PASS_V2_PRODUCT_ARCHITECTURE_CONTRACT`
- `PASS_V2_CONTENT_TAXONOMY_CONTRACT`
- `PASS_V2_V1_V2_MAPPING_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 45`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Verrouillé en plus :
- critères d'acceptation écran par écran ;
- architecture produit et navigation fonctionnelle ;
- taxonomie extensible par jeu ;
- agrégats Collection/Modpack/Profile non confondus ;
- V1 reste immuable ;
- mapping V1→V2 explicite, sans invention silencieuse ;
- demo catalog = fixture only ;
- search index V1 = rebuild, pas migration en place ;
- localStorage V1→V2 non destructif.

Ces preuves ne ferment pas le gate humain/High-Fi ni les 32 blockers VF déjà comptabilisés.


## 67. Naming / wording canonique — preuve machine

**TERMINÉ pour le contrat de nommage / validation humaine globale reste PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-NAMING-WORDING-CONTRACT-20261004.md`

Run registry :
- `37236723146` — **SUCCESS**
- `PASS_V2_NAMING_WORDING_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 46`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Verrouillé :
- MODARYX / MODARYX MODS = web ;
- MODARYX Forge = logiciel/écosystème desktop ;
- MODARYX Public / MODARYX Founder = éditions ;
- `Nova Forge OS` = nom produit retiré, legacy uniquement ;
- getnovaforge = ancien projet web, jamais cible actuelle ;
- `Mods & contenus` = parapluie UI ;
- `Profils de jeu` / `Mes profils pour ce jeu` = wording ;
- compte = Compte / Profil public ;
- badge générique `Non vérifié` interdit seul ;
- MODARYX IA ne doit pas être présentée comme active sans runtime/provider réel.

Le checker confirme aussi que le prototype actif ne contient pas les libellés produits incorrects `MODARYX Forge Public`, `MODARYX Forge Founder` ou `Nova Forge OS`.


## 68. Forge handoff + stack gate — registry 48 contrats

**TERMINÉ pour les contrats / runtime et sélection restent BLOQUÉS**

Run consolidé :
`37236949498` — **SUCCESS**

Marqueurs :
- `PASS_V2_FORGE_HANDOFF_CONTRACT`
- `PASS_V2_TECH_STACK_SELECTION_GATE_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 48`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

### Forge handoff verrouillé
- web = intention déclarative uniquement ;
- capability handshake obligatoire ;
- Forge revalide localement avant mutation ;
- confirmation locale pour mutation à risque ;
- actions exécutables arbitraires interdites : `RUN_COMMAND / EXECUTE_SCRIPT / WRITE_PATH / DELETE_PATH` ;
- aucun path/secret/commande shell arbitraire dans le payload ;
- ContentItem / Release / File / provider restent distincts ;
- site ne peut afficher Installé / Mis à jour / Rollback réussi sans receipt vérifiable ;
- transport réel reste `NOT_SELECTED` ;
- runtime/protocole/receipt/install réels restent `NOT_IMPLEMENTED`.

### Stack gate verrouillé
- shortlist uniquement : vanilla/static-first + Vite, Astro + Workers, React + Vite + Workers ;
- aucune sélection par habitude/popularité ;
- strict CSP, routing contrôlé, SW contrôlé, preview SHA immutable et isolation V2 obligatoires ;
- `unsafe-eval`, unsafe-inline généralisé, SW opaque, import glob legacy et routing incontrôlable restent disqualifiants ;
- stack = `NOT_SELECTED` ;
- root V2 = `NOT_CREATED` ;
- migration production = `BLOCKED`.

Ce PASS ne choisit aucune stack et n'autorise aucun root/frontend.


## 69. High-Fi gate + proposition frontend — registry 50 contrats

**TERMINÉ pour les garde-fous machine / gate High-Fi et root restent BLOQUÉS**

Run consolidé :
- `37237489658` — **SUCCESS**
- `PASS_V2_HIGH_FI_GATE_CONTRACT`
- `PASS_V2_FRONTEND_GATE_RECLASSIFICATION_PROPOSAL_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 50`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

### High-Fi gate verrouillé
- prototype PASS ≠ High-Fi final ;
- automatisation a11y ≠ screen reader réel ;
- émulation navigateur ≠ appareil physique ;
- aucune référence visuelle approuvée archivable = aucun PASS fidélité normalisé ;
- validation humaine non remplaçable par simulation IA ;
- root/frontend requiert une décision de gate contrôlée ;
- production reste intacte tant que le gate est bloqué.

Statut machine :
- High-Fi final : `BLOCKED`
- root/frontend production : `BLOCKED`
- validation humaine : `NOT_PROVEN`
- validation appareils : `NOT_PROVEN`
- référence visuelle : `NOT_PROVEN`.

### Proposition de reclassification frontend verrouillée
Source :
`docs/MODARYX-V2-FRONTEND-GATE-RECLASSIFICATION-PROPOSAL-20261004.md`

Statut :
`PROPOSAL_ONLY_NOT_ACTIVE`

Le contrat interdit :
- auto-activation de la proposition ;
- création du root sans décision canonique explicite ;
- sélection implicite de stack ;
- déploiement production ;
- contournement des blockers humains/appareils ;
- faux backend dans une preview.

Toujours requis avant une éventuelle preview engineering :
- décision canonique explicite ;
- stack sélectionnée ;
- root path défini ;
- branche dédiée ;
- budgets perf initiaux ;
- règles CSP/routing/storage/SW ;
- blockers humains conservés ouverts ;
- aucun cutover implicite.

**Aucune reclassification n'a été activée. Aucun root frontend n'est créé.**


## 70. Registry 51 contrats — VF readiness incluse

**TERMINÉ pour les garde-fous machine / VF reste BLOQUÉE**

Run :
- `37237609788` — **SUCCESS**
- `VF_READINESS_OPEN_BLOCKER_COUNT 32`
- `VF_READINESS_STATUS BLOCKED`
- `PASS_V2_VF_READINESS_GATE`
- `PREPRODUCTION_CONTRACT_COUNT 51`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Correction de dérive :
- l'ancien marqueur figé `preproduction-contract-registry-35` dans le VF readiness gate a été remplacé par `preproduction-contract-registry-current-green` ;
- le gate référence désormais aussi le High-Fi gate machine bloqué et la proposition de reclassification frontend non active.

Le registre consolidé exécute maintenant également le VF readiness gate.  
Cette consolidation **ne ferme aucun des 32 blockers** et ne change pas le statut VF : `BLOCKED`.


## 71. Contrat de preuve validation externe — registry 52 contrats

**TERMINÉ pour la structure de preuve / sessions externes PREUVE MANQUANTE**

Source :
`docs/MODARYX-V2-EXTERNAL-VALIDATION-EVIDENCE-CONTRACT-20261004.md`

Machine :
- `qa/modaryx-v2-external-validation-evidence-contract.json`
- `qa/check-v2-external-validation-evidence-contract.mjs`

Run consolidé :
- `37237801947` — **SUCCESS**
- `PASS_V2_EXTERNAL_VALIDATION_EVIDENCE_CONTRACT`
- `PREPRODUCTION_CONTRACT_COUNT 52`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Verrouillé :
- automation ≠ preuve humaine ;
- émulation ≠ appareil physique ;
- accessibility tree CDP ≠ screen reader réel ;
- navigateur non-Safari ≠ Safari réel ;
- aucune référence archivable ≠ aucun PASS fidélité visuelle ;
- P0/P1 ouvert ≠ gate fermé ;
- INCOMPLETE ≠ PASS ;
- preuve liée à un commit ;
- artifact refs obligatoires ;
- minimisation des données personnelles.

Types de sessions structurés :
- HUMAN_MULTISCREEN ;
- HUMAN_MOBILE ;
- NVDA_REAL ;
- VOICEOVER_REAL ;
- TALKBACK_REAL ;
- SAFARI_REAL ;
- PHYSICAL_DEVICE ;
- VISUAL_REFERENCE_COMPARISON.

État réel : toutes ces preuves externes restent `NOT_PROVEN` tant qu'une vraie session/artifact correspondant n'existe pas.


## 72. Handoff Work — blockers externes

**TERMINÉ pour la préparation / blockers externes toujours ouverts**

Document :
`docs/MODARYX-V2-WORK-HANDOFF-EXTERNAL-GATES-20261004.md`

Priorité Work si utilisé :
1. tenter de retrouver et archiver la référence visuelle source réellement approuvée ;
2. fournir provenance + dimensions + checksum + artifact ;
3. seulement ensuite préparer une comparaison source ↔ implémentation normalisée.

Interdit :
- recréer une fausse référence ;
- utiliser le prototype comme sa propre source ;
- remplacer une validation humaine réelle ;
- remplacer NVDA/VoiceOver/TalkBack/appareil physique ;
- fermer un blocker sans artifact.

Si la source n'est pas retrouvée :
`SOURCE_REFERENCE_NOT_RECOVERED` et le blocker reste ouvert.

Ce handoff n'autorise aucun root, aucune stack, aucun cutover.


## 73. Validateur de preuves externes

**TERMINÉ pour le validateur / aucune preuve externe réelle créée**

Fichier :
`qa/validate-v2-external-validation-evidence.mjs`

Workflow :
`.github/workflows/modaryx-v2-external-validation-evidence-validator.yml`

Run :
- `37238143495` — **SUCCESS**
- `PASS_V2_EXTERNAL_VALIDATION_EVIDENCE_CONTRACT`
- `PASS_V2_EXTERNAL_VALIDATION_EVIDENCE_VALIDATOR_SELF_TEST`.

Le validateur rejette notamment :
- une “preuve humaine” sans `humanParticipant=true` ;
- un appareil physique simulé ;
- un screen reader “réel” sans environnement réel + nom du reader ;
- Safari réel sans navigateur Safari ;
- une comparaison visuelle sans source approuvée archivable ;
- un PASS avec P0/P1 ouvert ;
- une preuve sans full commit SHA ;
- une preuve sans artifactRefs.

Ce run prouve le validateur, pas une session humaine/appareil.


## 74. Report validation capture artifact — défaut fermé

**TERMINÉ pour le défaut de preuve visuelle / fonctionnalité produit inchangée**

Défaut observé dans l'artifact Living Threshold antérieur :
- `mobile-content-report-error.png` pouvait être capturé vide/sombre ;
- `desktop-content-report-error.png` pouvait capturer l'origine de page au lieu de l'état d'erreur visible ;
- product flow et validation fonctionnelle étaient déjà verts : le défaut concernait l'archive de preuve, pas le workflow produit.

Cause isolée :
- le helper `capture()` utilisait un clip page `x:0,y:0` ;
- après focus/scroll de validation, ce clip ne représentait plus le viewport actuel.

Correction ciblée :
- centrage de `#report-reason-error` ;
- capture via `captureCurrentViewport()` ;
- aucun changement du comportement produit.

Micro-preuve dédiée :
- workflow `MODARYX V2 Report Error Capture Micro-Proof`
- run `37238782856` — **SUCCESS**
- mobile : erreur centrée, screenshot `67707` bytes, `pageY 1686`
- desktop : erreur centrée, screenshot `314386` bytes, `pageY 609`
- `PASS_V2_REPORT_ERROR_CAPTURE_VIEWPORT`.

Incident de syntaxe intermédiaire :
- run Living Threshold `37238610323` — **FAIL**
- erreur exacte : `SyntaxError: missing ) after argument list` dans `qa/capture-v2-living-threshold-multiscreen.mjs:250`
- build, a11y navigateur et product flows avaient passé avant l'étape capture ;
- aucun full replay lancé aveuglément.

Isolation :
- micro-proof syntaxe dédié créé ;
- premier run `37238741435` — **FAIL**, reproduisant exactement le défaut.

Correction :
- fermeture des deux appels `await evaluate(...);`.

Micro-proof syntaxe après correction :
- run `37238782451` — **SUCCESS**
- `PASS_V2_MULTISCREEN_CAPTURE_SCRIPT_SYNTAX`.

Continuation Living Threshold :
- run `37238782482` — **SUCCESS**
- commit capturé `06621017f0e20595512164e20da6069ca9baabbe`
- artifact `11316682569`
- digest `sha256:bd136befe40d2efab32acf76c3cf85ea8e45660dbfebb191a12fadde64b5dfec`
- `KEYBOARD_REACHABLE 41 / 41`
- desktop/mobile overflow `0 / 0`
- `FLOW_ASSERT report validation error retry recovered`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 87`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Inspection visuelle directe de l'artifact frais :
- `mobile-content-report-error.png` montre clairement le formulaire, le champ Raison et le message d'erreur rouge ;
- `desktop-content-report-error.png` montre clairement le formulaire d'erreur et le panneau de décision ;
- les deux captures ne sont plus vides ni décalées hors de l'état critique.

Limite :
- cette fermeture valide l'archive de preuve du prototype ;
- elle ne ferme aucun blocker humain, screen reader, appareil, backend ou production.


## 75. Capture integrity guard — archive Living Threshold

**TERMINÉ pour le garde-fou d'archive / High-Fi final toujours BLOQUÉ**

Checker :
`qa/check-v2-multiscreen-capture-integrity.mjs`

Self-test dédié :
- run `37239093475` — **SUCCESS**
- `PASS_V2_MULTISCREEN_CAPTURE_INTEGRITY`
- `PASS_V2_MULTISCREEN_CAPTURE_INTEGRITY_SELF_TEST`.

Le checker protège notamment contre :
- capture PNG trop petite / probablement vide ;
- dimensions desktop/mobile inattendues ;
- nom de capture hors convention ;
- duplicata binaire exact ;
- nombre de captures inférieur au corpus attendu.

Intégration au workflow Living Threshold :
- run `37239135911` — **SUCCESS**
- commit capturé `9a783595ea87cb4475ea19cde8cdfa995a75b09c`
- artifact `11316673052`
- digest `sha256:2856da71951c047ce32fe7e1453b61a76567e97aae84ec74370887dd029ed117`
- `KEYBOARD_REACHABLE 41 / 41`
- desktop/mobile overflow `0 / 0`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 87`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`
- `MULTISCREEN_INTEGRITY_CAPTURE_COUNT 87`
- plus petite capture : `mobile-content-report-error.png 67707 bytes`
- `PASS_V2_MULTISCREEN_CAPTURE_INTEGRITY`.

Conséquence :
le défaut de capture vide détecté précédemment est désormais couvert par un garde-fou automatique dans le workflow visuel principal.

Ce PASS reste une preuve d'intégrité de l'archive du prototype, pas une validation humaine, High-Fi finale ou production.
