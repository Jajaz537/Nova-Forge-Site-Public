# MODARYX V2 — Matrice de readiness d'implémentation

**Date : 2026-10-03**
**Statut : conception — frontend V2 volontairement non commencé**

## 1. Principe

Une surface n'entre pas en implémentation parce qu'elle possède seulement un wireframe ou un contrat.

Chaque surface doit avoir :
- objectif ;
- données ;
- états ;
- responsive ;
- accessibilité ;
- dépendances runtime ;
- critères QA ;
- stratégie legacy.

## 2. Homepage

- Architecture : TERMINÉ
- Wireframe desktop : TERMINÉ
- Wireframe mobile : TERMINÉ
- États : TERMINÉ — conception
- Données : TERMINÉ — stratégie
- Identité vivante : EN COURS — adaptation V2 non finalisée
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 3. Games Index

- Architecture : TERMINÉ
- Wireframe : TERMINÉ
- Données Game : TERMINÉ — plan de schéma
- États : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 4. Game Hub

- Contrat : TERMINÉ
- Wireframe desktop : BLOQUÉ Figma
- Wireframe mobile : BLOQUÉ Figma
- Données : TERMINÉ — conception
- Support lifecycle : TERMINÉ
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 5. Global Search

- Contrat : TERMINÉ
- Filtres/facettes : TERMINÉ
- Wireframe : BLOQUÉ Figma
- Search local-first : TERMINÉ — principe
- SearchDocument v2 : TERMINÉ — plan
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 6. Catalogue

- Wireframe desktop : TERMINÉ
- Wireframe mobile : TERMINÉ
- Filtres : TERMINÉ — conception
- Quick View : TERMINÉ — conception
- États : TERMINÉ — conception
- Données réelles : BLOQUÉ / corpus réel requis
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 7. Content Detail

- Wireframes : TERMINÉ desktop/mobile
- Contrat : TERMINÉ
- Release/files : TERMINÉ — conception
- Compatibility/dependencies : TERMINÉ — conception
- Trust panel : TERMINÉ — conception
- Install actions : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 8. Collection

- Wireframe desktop : TERMINÉ
- Mobile blueprint détaillé : EN COURS
- Contrat : TERMINÉ
- Filters collection : TERMINÉ — conception
- Support curateur : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 9. Modpack

- Contrat : TERMINÉ
- Wireframe dédié : PREUVE MANQUANTE
- Manifest v2 : TERMINÉ — plan
- Install flow : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 10. Profile / Loadout

- Contrat : TERMINÉ
- Library integration : TERMINÉ — conception
- Wireframe dédié : PREUVE MANQUANTE
- Manager integration : BLOQUÉ runtime
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 11. Creator Profile

- Wireframe desktop : TERMINÉ
- Contrat account/creator : TERMINÉ
- Mobile : PREUVE MANQUANTE
- Données : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 12. Creator Studio

- Wireframe desktop : TERMINÉ
- Contrat : TERMINÉ
- Mobile minimal : EN COURS — conception
- Backend historique : capacité à reconnecter
- Publication workflow : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 13. Community

- Contrat : TERMINÉ
- Wireframe desktop : BLOQUÉ Figma
- Mobile : PREUVE MANQUANTE
- Backend historique : capacité à reconnecter
- Moderation/appeals : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 14. Library

- Wireframe desktop : TERMINÉ
- Mobile : PREUVE MANQUANTE
- Objets séparés : TERMINÉ
- Sync states : TERMINÉ
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 15. Account / Settings

- Contrat : TERMINÉ
- Wireframe : PREUVE MANQUANTE
- Auth/session historiques : à reconnecter
- Preferences : TERMINÉ — conception
- Notifications : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 16. Security / Trust

- Contrat : TERMINÉ
- Surface dédiée : secondaire
- Intégration dans Content Detail : TERMINÉ — conception
- Signer/trust anchor production : BLOQUÉ
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 17. Docs / Help

- Architecture : TERMINÉ — conception
- Contenu final : PREUVE MANQUANTE
- i18n/SEO : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 18. PWA / Offline

- Architecture : TERMINÉ — conception
- Migration SW/cache : TERMINÉ — plan
- Implémentation : BLOQUÉ jusqu'au frontend preview
- Preuve appareil : PREUVE MANQUANTE

## 19. Design System

- Low-fi primitives : TERMINÉ
- Semantic tokens : TERMINÉ — contrat
- Composants core : TERMINÉ — inventaire
- Direction artistique : BLOQUÉ
- Library high-fi : BLOQUÉ
- Code components : BLOQUÉ

## 20. Readiness technique transversale

- Audit code dépôt : **TERMINÉ — 525/525, 0 non classé**
- Blacklist/allowlist anti-contamination : **TERMINÉ — draft opérationnel**
- Guard CI anti-contamination : **TERMINÉ — micro-proof frais**
- Frontières modules/adapters : **TERMINÉ — conception**
- Matrice V1→V2 : **TERMINÉ — conception**
- Mapping V1→V2 détaillé : **TERMINÉ — pertes/unknowns documentés**
- Threat model : **TERMINÉ — conception**
- Plan routes/cutover : **TERMINÉ — conception**
- Runtime V2 réel : **NON CRÉÉ**
- CSP/headers V2 : **TERMINÉ — conception**
- SW migration browser : **PREUVE MANQUANTE**
- Tree testing humain : **PREUVE MANQUANTE**

## 21. Conditions globales avant premier code de skin

Doivent être fermées :

1. wireframes Game Hub / Global Search / Community / Mobile Game Hub ;
2. tree testing humain ou preuve équivalente de trouvabilité ;
3. corrections IA issues des tests ;
4. direction artistique sélectionnée ;
5. design system high-fi ;
6. prototype comparatif validé humainement.

## 22. Ce qui peut être codé avant le skin

Uniquement si nécessaire et isolé :
- tests anti-contamination ;
- validateurs de contrats ;
- mappers de données purement techniques ;
- fixtures non publiques ;
- tooling QA ;
- policy headers/CSP ;
- contract tests adapters.

Mais même ces éléments ne doivent pas être introduits sans nécessité, branche isolée et micro-proof.

**État global : BLOQUÉ volontairement pour le frontend / préparation technique avancée.**


## 23. Réévaluation après expansion Living Threshold — 4 octobre 2026

**Statut : prototype exploratoire largement matérialisé / root frontend V2 de production toujours BLOQUÉ**

La matrice ci-dessus décrit l'état avant l'expansion Living Threshold. Elle reste historique pour expliquer le gate initial, mais plusieurs lignes `PREUVE MANQUANTE` ou `NON IMPLÉMENTÉ` ont depuis été fermées **au niveau prototype exploratoire uniquement**.

### Preuve consolidée de référence

- run `37161527706` — **SUCCESS** ;
- commit capturé : `03858bea92232b3040d76923e53d9a71d822712c` ;
- artifact : `11288295345` ;
- `PASS_V2_LIVING_THRESHOLD_STATIC_A11Y` ;
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y` ;
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS` ;
- `MULTISCREEN_CAPTURE_COUNT 37` ;
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Preuve transverse plus récente :
- run `37161856917` — **SUCCESS** ;
- offline navigateur réel + validation error/retry locale prouvés ;
- `MULTISCREEN_CAPTURE_COUNT 39`.

### Surfaces désormais matérialisées et exercées dans le prototype

| Surface | État prototype | État production V2 |
|---|---|---|
| Homepage / Discover | TERMINÉ — exploratoire | NON COMMENCÉ |
| Games Index | TERMINÉ — exploratoire | NON COMMENCÉ |
| Game Hub desktop/mobile | TERMINÉ — exploratoire | NON COMMENCÉ |
| Global Search desktop/mobile | TERMINÉ — exploratoire | NON COMMENCÉ |
| Catalog | TERMINÉ pour recherche/filtres/tri/reset/no-results | NON COMMENCÉ |
| Content Detail | TERMINÉ pour tabs décision/fichiers/versions/compatibilité/changelog/support/permissions/report local | NON COMMENCÉ |
| Collections | TERMINÉ — surface distincte | NON COMMENCÉ |
| Modpack | TERMINÉ — démonstration distincte, install indisponible | NON COMMENCÉ |
| Profil de jeu | TERMINÉ — détail local/private/components/order/sync unavailable | NON COMMENCÉ |
| Créateurs | TERMINÉ — surface distincte | NON COMMENCÉ |
| Community | TERMINÉ — Support/Questions/Discussions/Studios/Activité | NON COMMENCÉ |
| Library | TERMINÉ — objets séparés + profil ouvrable | NON COMMENCÉ |
| Creator Studio | TERMINÉ — couverture exploratoire étendue | NON COMMENCÉ |
| Account / Settings | TERMINÉ — guest-first, privacy, onboarding facultatif, préférences locales | NON COMMENCÉ |
| Notifications | TERMINÉ — états sans faux événements | NON COMMENCÉ |
| Offline / stale | TERMINÉ — prototype browser event | NON COMMENCÉ |
| Validation error / retry | TERMINÉ — signalement local | NON COMMENCÉ |

### Gaps internes encore faisables avant root V2

- états loading/skeleton documentés ou exercés uniquement lorsque la future latence le justifie ;
- preview explicite de session expirée / permission denied sans prétendre à une session serveur réelle ;
- preview explicite de sync conflict sans prétendre à une synchronisation réelle ;
- inventaire final des composants/tokens réellement utilisés par Living Threshold ;
- mapping prototype → composants V2 production ;
- stratégie de données fixtures → adapters V2 ;
- choix de stack encore bloqué par les critères du gate technique et la validation humaine requise.

### Blockers restant avant premier root/frontend V2 de production

- revue humaine multi-écrans supplémentaire ;
- validation mobile humaine réelle ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- screen reader réel ;
- appareils physiques ;
- décision contrôlée de stack/root après fermeture ou reclassification prouvée des blockers requis.

### Décision

L'expansion du prototype **ne lève pas** automatiquement les conditions de la section 21.

Ce qui est autorisé :
- continuer les preuves et états réversibles du prototype ;
- préparer mapping composants/tokens/data ;
- préparer tooling/contract tests/policies isolés ;
- documenter précisément le futur root V2.

Ce qui reste interdit sans nouvelle décision canonique :
- présenter Living Threshold comme frontend production ;
- cutover public ;
- modification de `main` ;
- réutilisation visuelle V1 ;
- migration Cloudflare/DNS ;
- déclaration High-Fi/VF finale.

**État global réévalué : préparation technique très avancée ; prototype exploratoire substantiel ; root V2 production encore BLOQUÉ par gate de validation.**


## 24. Réconciliation canonique — 4 octobre 2026

**Cette section supersède la liste “Gaps internes encore faisables” de la section 23 lorsqu’elle diverge de l’état actuel.**

Preuve Living Threshold la plus fraîche pour la surface code matérialisée :
- run `37196769573` — **SUCCESS** ;
- commit capturé `ec8b57891858f7a25954ff60f77595be8eaf1f21` ;
- artifact `11301477422` ;
- digest `sha256:d9ad41faa1423c22aa986e5f6661447b029a32f1812ed63a3a096b269a0b0eb9` ;
- `KEYBOARD_REACHABLE 36 / 36` ;
- `RIGHTS_MOBILE_OVERFLOW 0` ;
- `DESKTOP_OVERFLOW 0` ;
- `MOBILE_OVERFLOW 0` ;
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS` ;
- `MULTISCREEN_CAPTURE_COUNT 65` ;
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Surface map :
- run `37196989554` — **SUCCESS** ;
- `SURFACE_MAP_COUNT 23` ;
- `UNRESOLVED_RUNTIME_COUNT 6` ;
- `PASS_V2_PRODUCTION_SURFACE_MAP`.

Nouveaux éléments matérialisés depuis la section 23 :
- Game Atmosphere Layer originale MODARYX ;
- droits/asset policy ;
- workflow support jeu → éditeur machine-readable + CI ;
- Rights Dashboard admin fictif ;
- lecture de scopes `APPROVED_WITH_LIMITS / AWAITING_RESPONSE / NO_RESPONSE` ;
- outbound explicitement désactivé sans backend ;
- MODARYX Forge séparé des droits Web ;
- modèle dépendances/compatibilité/source/version exploratoire fermé ;
- mapping prototype → production mis à jour ;
- pack humain mis à jour pour 65 captures ;
- demande membre de support d’un jeu local-only matérialisée et exercée ;
- triage admin fictif des demandes de support matérialisé ;
- ACCEPTED_SAFE_BASELINE explicitement séparé de tout accord éditeur.

Le mapping machine actuel couvre 23 surfaces et maintient **tous** les statuts production à `BLOCKED_GATE`.

### Gaps internes récupérables

À la date de cette réconciliation, aucun autre gap interne produit/prototype honnêtement récupérable n’est requis avant le gate sans :
- inventer un backend ;
- inventer un provider ;
- inventer un runtime MODARYX Forge ;
- inventer une preuve humaine ;
- inventer un appareil/screen reader ;
- ou créer du polish décoratif uniquement pour faire progresser artificiellement l’état.

Les anciens exemples “preview session expirée / permission denied / sync conflict” ne doivent pas être transformés en pseudo-preuves : ces états restent correctement classés **runtime réel non résolu** dans le surface map.

### Blocage actuel avant root/frontend production

Toujours requis ou à reclassifier explicitement :
- validation humaine multi-écrans supplémentaire ;
- validation mobile humaine réelle ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- screen reader réel ;
- appareils physiques ;
- choix contrôlé de stack/root après fermeture ou reclassification du gate.

Stack finale : **NON SÉLECTIONNÉE**.  
Root/frontend V2 production : **NON CRÉÉ**.

Source canonique de reprise la plus récente :
`CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-04.md`.


## 25. Réconciliation contact éditeur / request readiness — 4 octobre 2026

Cette section supersède les preuves de couverture antérieures lorsqu’elles sont moins récentes pour le workflow droits.

Preuve Living Threshold :
- run `37201151562` — **SUCCESS**
- commit `238cc7f5fae3720aa495ca2e6c3909c8baabc21a`
- artifact `11303470181`
- digest `sha256:853428274c5abce89cd1ab2b147005161b656f7e613ae121fd191835a69ed719`
- 69 captures ;
- `PUBLISHER_CONTACT_MOBILE_OVERFLOW 0` ;
- `FLOW_ASSERT publisher contact verified before request ready`.

Contrat droits renforcé :
- run `37201224168` — **SUCCESS**
- 5 sources de contact autorisées ;
- 5 sources explicitement interdites ;
- 5 exigences de readiness ;
- 7 send guards ;
- `PASS_V2_GAME_RIGHTS_WORKFLOW`.

Surface map :
- run `37201297613` — **SUCCESS**
- 23 surfaces ;
- 6 runtime states réels toujours non résolus.

Couverture prototype ajoutée :
- contact candidat ;
- contact vérifié ;
- REQUEST_READY ;
- outbound indisponible.

Toujours **NON IMPLÉMENTÉ** :
- découverte de contact réelle ;
- vérification domaine/contact réelle ;
- génération de demande production ;
- email/API outbound ;
- audit mailbox ;
- Game Rights Registry production.

Le root/frontend production reste BLOQUÉ selon le gate canonique.


## 26. Notifications droits éditeurs — réconciliation — 4 octobre 2026

Preuve Living Threshold :
- run `37202254205` — **SUCCESS**
- commit `ddba1f0bbf90c417600f6fdb800529b7e24248f0`
- artifact `11303272811`
- digest `sha256:f34ee2b0b83e561f6f550ab1e575216a80200dd60d827f9bc64f6d96a7da34a4`
- 71 captures ;
- notification preview desktop/mobile ;
- `RIGHTS_NOTIFICATION_MOBILE_OVERFLOW 0` ;
- product flows : SUCCESS.

Contrat notification :
- run `37202025942` — **SUCCESS**
- 9 event types ;
- 8 invariants ;
- 5 champs de preuve minimum ;
- `PASS_V2_RIGHTS_NOTIFICATION_CONTRACT`.

Surface map :
- run `37202563463` — **SUCCESS**
- 23 surfaces ;
- 6 runtime states réels non résolus ;
- Notifications inclut désormais RightsNotificationPreview + états fictifs rights approval/legal review et canaux indisponibles.

Toujours NON IMPLÉMENTÉ :
- event bus ;
- Rights Case deep-link réel ;
- unread counter ;
- email ;
- push ;
- persistance/acknowledgement serveur.

Le frontend/root production reste BLOQUÉ par le gate canonique.


## 27. Cycle de vie droits — réconciliation — 4 octobre 2026

Preuve prototype :
- Living Threshold run `37204012017` — **SUCCESS**
- commit `7dc36e1231872d1fdd5a7af17bed6f5ad0b717da`
- artifact `11303812534`
- digest `sha256:9718d2ff47e24b3ba50707bcb340adfe5fbff9bc24f7b73c0a95a93b1ff8cf00`
- 73 captures ;
- `FLOW_ASSERT rights lifecycle expired revoked scopes reblocked`.

Contrat :
- run `37204099457` — **SUCCESS**
- 4 états lifecycle ;
- 9 invariants ;
- 6 éléments de preuve de réactivation ;
- `PASS_V2_RIGHTS_LIFECYCLE_CONTRACT`.

Surface rights admin désormais mappée avec :
- RightsLifecyclePreview ;
- ACTIVE_WITH_LIMITS ;
- EXPIRING_SOON ;
- EXPIRED ;
- REVOKED ;
- dependent scopes reblocked.

Production toujours NON IMPLÉMENTÉE :
- scheduler ;
- monitor expiry ;
- revocation inbound ;
- automatic scope lock ;
- revalidation.

Le root/frontend production reste BLOQUÉ selon le gate canonique.


## 28. IP / takedown — réconciliation — 4 octobre 2026

Contrat :
- `docs/MODARYX-V2-IP-TAKEDOWN-WORKFLOW-20261004.md`
- run `37204583345` — **SUCCESS**
- 12 états ;
- 12 invariants ;
- 6 effets de restriction ;
- `PASS_V2_IP_TAKEDOWN_CONTRACT`.

Prototype :
- run `37204720263` — **SUCCESS**
- commit `eefd01c8ec1d35f7bd9212e40f65d2ac390479cd`
- artifact `11304695959`
- digest `sha256:126e3758ca6a4f1c19e85f6eb8be0c9d0b456705feb43ce1e8777ccbf77004f0`
- 75 captures ;
- `FLOW_ASSERT ip takedown containment preserves evidence fallback legal escalation`.

Rights admin map ajoute :
- IpTakedownPreview ;
- IpCase ;
- RECEIVED / CONTENT_LOCATED / TEMP_RESTRICTED / LEGAL_REVIEW_REQUIRED ;
- fallback original MODARYX.

Production toujours NON IMPLÉMENTÉE :
- case backend ;
- public IP form ;
- mailbox ;
- cache invalidation ;
- anti-reupload ;
- legal review workflow.

Le root/frontend production reste BLOQUÉ selon le gate canonique.


## 29. Asset rights provenance — réconciliation — 4 octobre 2026

Prototype :
- manifest `qa/modaryx-v2-asset-rights-manifest.json` ;
- checker `qa/check-v2-asset-rights-provenance.mjs` ;
- run `37205150007` — **SUCCESS** ;
- 2 assets classifiés ;
- 0 remote media reference ;
- `PASS_V2_ASSET_RIGHTS_PROVENANCE`.

La future production doit étendre ce mécanisme :
- tous assets V2 ;
- source/provenance ;
- licence/scope ;
- expiry/revocation ;
- Game Rights Registry ;
- build failure sur Unknown/Forbidden/unlisted.

Les assets actuels restent `ALLOWED_PROTOTYPE_ONLY`.

Le root/frontend production reste BLOQUÉ par le gate canonique.


## 30. Game Rights Registry — réconciliation — 4 octobre 2026

Contrat :
- `docs/MODARYX-V2-GAME-RIGHTS-REGISTRY-CONTRACT-20261004.md`
- run `37205429699` — **SUCCESS**
- 8 surfaces produit ;
- 18 scopes ;
- 10 statuts ;
- 14 activation guards ;
- 14 invariants ;
- `PASS_V2_GAME_RIGHTS_REGISTRY_CONTRACT`.

La production doit encore implémenter :
- persistence ;
- API ;
- admin CRUD ;
- policy engine ;
- scheduler/revalidation ;
- asset linkage ;
- audit store.

Le prototype Rights Dashboard reste une preuve comportementale fictive, pas le Registry production.

Le root/frontend production reste BLOQUÉ selon le gate canonique.


## 31. MODARYX IA — surface d’intégration exploratoire — 4 octobre 2026

- surface prototype : **TERMINÉE**
- desktop/mobile : **MATÉRIALISÉS**
- composer : **DÉSACTIVÉ sans backend réel**
- sources / permissions / evals / incertitude : **MATÉRIALISÉS**
- provider IA : **NON SÉLECTIONNÉ**
- modèle : **NON SÉLECTIONNÉ**
- backend IA : **NON IMPLÉMENTÉ**
- RAG / outils / mémoire : **NON IMPLÉMENTÉS**
- intégration production : **BLOQUÉE par le gate**

Preuve :
- run `37211271783` — **SUCCESS**
- commit `f8616f18876c49de45b3d208222be042dd2b543a`
- artifact `11306731614`
- `KEYBOARD_REACHABLE 37 / 37`
- `MULTISCREEN_CAPTURE_COUNT 77`.

Surface map :
- `modaryx-ai-preview`
- statut production : `BLOCKED_GATE`.


## 25. Publisher Inbound — readiness — 4 octobre 2026

**Prototype/contrat TERMINÉS / production PREUVE MANQUANTE**

Preuves :
- contrat inbound run `37214242330` — **SUCCESS** ;
- micro-proof run `37214564614` — **SUCCESS** ;
- Living Threshold run `37214829645` — **SUCCESS** ;
- 81 captures ;
- surface map : 24 surfaces, 6 runtime states réels non résolus.

Prototype :
- réception fictive ;
- corrélation ;
- provenance ;
- quarantaine pièces jointes ;
- ready-for-interpretation ;
- fail closed provenance non fiable.

Production requise :
- mailbox ou webhook inbound ;
- corrélation Message-ID/In-Reply-To/References/thread token ;
- préservation raw headers/message ;
- SPF/DKIM/DMARC comme signaux, jamais comme autorité juridique suffisante ;
- scanner pièces jointes ;
- audit store ;
- routing vers le Publisher Response Contract.

Ces éléments ne justifient pas de lever le gate frontend/High-Fi.


## 26. Tablet reflow readiness — 4 octobre 2026

- breakpoint medium shell : **MATÉRIALISÉ**
- viewport micro-proof 834×1112 : **SUCCESS**
- 12 surfaces : overflow 0
- run : `37215965531`
- `PASS_V2_TABLET_REFLOW`
- vraie tablette : **PREUVE MANQUANTE**
- Safari/iPadOS : **PREUVE MANQUANTE**
- validation tactile humaine : **PREUVE MANQUANTE**

Ce résultat améliore la readiness responsive mais ne reclassifie pas le gate High-Fi/root production.


## 25. Responsive readiness — matrice multi-largeurs — 4 octobre 2026

**TERMINÉ pour le navigateur automatisé ciblé.**

Preuves :
- 320×900 : run `37217511653` — SUCCESS ;
- responsive matrix : run `37218193186` — SUCCESS ;
- largeurs : 360 / 430 / 768 / 1024 / 1280 / 1920 ;
- 12 surfaces testées par largeur ;
- overflow horizontal : 0 sur les surfaces ciblées.

Les corrections Account / Rights / Publisher Contact ont été prouvées par micro-proofs ciblés avant continuation.

Toujours hors preuve :
- Safari/iOS/iPadOS réels ;
- vrais appareils ;
- tactile humain ;
- zoom navigateur réel ;
- text resize réel ;
- screen reader réel.

Cela augmente la readiness mais ne reclassifie pas le gate de production.


## 25. États asynchrones — réconciliation — 4 octobre 2026

Référence :
`docs/MODARYX-V2-ASYNC-LOADING-STATE-CONTRACT-20261004.md`

Le gap de conception loading/skeleton est fermé. Le prototype local ne doit pas simuler une attente réseau inexistante.

État :
- contrat UX async : **TERMINÉ** ;
- skeletons prototype artificiels : **NON REQUIS** ;
- backend/adapters async réels : **NON IMPLÉMENTÉS** ;
- loading/error/stale production : **PREUVE MANQUANTE** jusqu’aux frontières réelles.
