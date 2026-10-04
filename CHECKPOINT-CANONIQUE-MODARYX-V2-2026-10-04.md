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
`37196769573` — **SUCCESS**

Commit capturé :
`103aab8b82684e65020b4c9575df0f6819a69b7f`

Artifact :
`11301612556`

Digest :
`sha256:c567c6e27c5e4648fe3267becb48736b5861bb22c2ae85ffa31009e3626695d3`

Marqueurs :
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y`
- `KEYBOARD_REACHABLE 36 / 36`
- `RIGHTS_MOBILE_OVERFLOW 0`
- `DESKTOP_OVERFLOW 0`
- `MOBILE_OVERFLOW 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 63`
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
`37196989554` — **SUCCESS**

Marqueurs :
- `SURFACE_MAP_COUNT 23`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`

Les 23 surfaces restent `BLOCKED_GATE` côté production.

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

Pack humain actuel préparé autour de la preuve **63 captures**.

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
- `MULTISCREEN_CAPTURE_COUNT 63`

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
