# CHECKPOINT-CANONIQUE — MODARYX V2 — 2026-10-05

**Statut : source opérationnelle courante**  
**Date : 2026-10-05**  
**Priorité : remplace les checkpoints plus anciens lorsqu'ils divergent, sauf preuve technique plus fraîche.**

## 1. Périmètre et nomenclature

- **MODARYX / MODARYX MODS** = plateforme web.
- **MODARYX Forge** = logiciel / écosystème desktop.
- **MODARYX Public** = édition publique desktop.
- **MODARYX Founder** = édition Founder desktop.
- `Nova Forge OS` = nom produit retiré ; legacy/provenance technique uniquement.
- `getnovaforge.com` / getnova = ancien projet web abandonné.
- Le projet adulte distinct évoqué par l'utilisateur reste hors périmètre MODARYX et ne doit jamais être mélangé à ce dépôt.

## 2. Git / PR

Dépôt technique historique :
`Jajaz537/Nova-Forge-Site-Public`

Branche :
`audit/modaryx-v2-legacy-boundary-20261003`

PR :
- #162
- draft : oui
- merged : non
- mergeable : oui

HEAD vérifié immédiatement avant création de ce checkpoint :
`7f537c274526b1a7afd67292e6e832f234faf5db`

La création de ce checkpoint avance elle-même le HEAD. Toujours re-vérifier branche + HEAD avant chaque écriture.

## 3. Discipline permanente

- ne pas modifier `main` sans stratégie explicite ;
- ne pas toucher DNS / DNSSEC / nameservers / IONOS / Cloudflare critique sans instruction explicite ;
- ne pas écraser le travail parallèle ;
- après erreur : erreur exacte → isolation → correction ciblée → micro-proof → continuation ;
- prototype vert ≠ production verte ;
- aucune VF/High-Fi finale sans preuves appropriées.

## 4. Prototype Living Threshold

Prototype :
`review-evidence/modaryx-v2-living-threshold-prototype-20261003/`

Couverture exploratoire large :
- Discover/Home ;
- Games Index ;
- Game Hub ;
- Search/Catalog ;
- Content Detail ;
- Collections/Modpack/Profils ;
- Créateurs/Community ;
- Library ;
- Creator Studio ;
- Account/Settings/Notifications ;
- offline/error/retry ;
- Game Atmosphere ;
- Rights Dashboard et previews publisher ;
- Trust / Help / Moderation ;
- MODARYX IA preview ;
- demande membre support jeu.

Archive de preuve courante : **87 captures**.

## 5. Référence artistique canonique récupérée

Source :
`REFERENCE-CANONIQUE-Compagnons-face-au-royaume-enchante.png`

Library :
`file_00000000dcd482439ade71a96dfc6ba0@1`

SHA-256 :
`3b2cf82eda155d33d0ff14ad5d4ca1f95c155b8f9d019e5da03182f99f45e992`

Dimensions :
`1672 × 941`

Preuve humaine d'approbation :
`WORK-HANDOFF-MODARYX-ULTRA-HAUT-DE-GAMME-2026-09-23.md`
Library `file_00000000ec7c81f4aa8d387fc8f2d34c@1`.

Composition verrouillée :
- humain assis au premier plan ;
- loup ;
- bébé dragon ;
- château dominant ;
- rivière/eau ;
- vallée/forêt/monde habité ;
- aucune île flottante ;
- cascades non dominantes ;
- ambiance vivante, narrative, crédible, premium.

## 6. Réconciliation hero — candidat courant

Le candidat précédent omettait humain/loup/dragon et était trop sombre.

Corrections maintenant matérialisées :
- voyageur assis réintroduit ;
- loup réintroduit ;
- bébé dragon réintroduit ;
- château, vallée et eau conservés ;
- aucune île flottante ajoutée ;
- monde visiblement éclairci/réchauffé ;
- scrim de lecture localisé ;
- hiérarchie MODARYX / modding-first conservée.

Fichiers principaux :
- `src/App.jsx`
- `src/styles.css`
- `src/canon-hero.css`

Assets compagnon :
- `living-threshold-wolf-baby.png`
- `living-threshold-dragon-baby.png`

Ces deux assets restent :
`ALLOWED_PROTOTYPE_ONLY`.

Preuve navigateur du candidat :
- run `37309857645` — **SUCCESS**
- commit capturé `0ea8e28485f83466c5a8aaf05b28243cb56b4f0e`
- artifact `11344949022`
- digest `sha256:144573c0d12e6aea8dd9a146f53bc2f25c71e20372ccf9733a89716d8160e0d6`
- `KEYBOARD_REACHABLE 41 / 41`
- desktop/mobile overflow `0 / 0`
- `PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 87`
- `PASS_V2_MULTISCREEN_CAPTURE_INTEGRITY`.

Comparaison complémentaire :
`review-evidence/modaryx-v2-canonical-reference-20261005/visual-reference-comparison-reconciled.json`

Mesure de support uniquement :
- ancien candidat : luminance moyenne relative ~`0.0676`
- candidat réconcilié : ~`0.0935`
- source canonique : ~`0.1534`.

La luminance n'est pas un verdict artistique.

## 7. État High-Fi

**High-Fi final : BLOQUÉ**

Les P1 visuels ne sont pas fermés :
- la présence humain/loup/dragon est corrigée au niveau prototype ;
- le voyageur reste une silhouette prototype ;
- loup/dragon n'ont pas encore une provenance production fermée ;
- le candidat reste plus sombre que la source ;
- validation artistique humaine du candidat réconcilié : PREUVE MANQUANTE.

Documents :
- `docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`
- `docs/MODARYX-V2-HUMAN-MULTISCREEN-REVIEW-PACK-20261004.md`
- `docs/MODARYX-V2-ASSISTIVE-DEVICE-VALIDATION-PROTOCOL-20261004.md`.

Toujours PREUVE MANQUANTE :
- validation humaine multi-écrans ;
- validation mobile humaine ;
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques.

Automatisation/Work ne remplace pas ces preuves.

## 8. Preuves techniques courantes

Au commit `b443f145771a03fffff796695d411d331f3bee87`, tous les checks PR observés étaient verts, dont :
- Anti-Contamination Guard ;
- Low-Fi Review ;
- CodeQL ;
- Living Threshold Visual Proof ;
- Asset Rights Provenance ;
- responsive/reflow/accessibility micro-proofs ;
- security sinks ;
- publisher preview proofs.

Le candidat hero plus récent a son propre Living Threshold run vert `37309857645`.

Toujours re-lire les checks du HEAD courant avant toute déclaration de PASS.

## 9. VF readiness

Machine gate :
`qa/modaryx-v2-vf-readiness-gate.json`

Dernier état canonique avant le candidat hero :
- `VF_READINESS_OPEN_BLOCKER_COUNT 31`
- `VF_READINESS_STATUS BLOCKED`.

Le blocker `approved-visual-reference` est **PROVEN**.

`normalized-visual-comparison` reste **OPEN** parce que le nouveau candidat doit encore recevoir une validation artistique humaine appropriée.

## 10. Production web

Toujours non fermé :
- stack finale ;
- root V2 production ;
- backend réel ;
- auth/passkeys réels ;
- données/historique réels ;
- providers/connecteurs ;
- notifications email/push ;
- PWA/SW production ;
- migration V1→V2 ;
- Core Web Vitals production ;
- cutover.

Aucun de ces éléments ne doit être simulé comme réel.

## 11. Proposition de reclassification frontend

Document :
`docs/MODARYX-V2-FRONTEND-GATE-RECLASSIFICATION-PROPOSAL-20261004.md`

Statut :
**PROPOSITION UNIQUEMENT — NON APPROUVÉE / NON ACTIVE**

Elle permettrait, uniquement après décision explicite, un preview engineering isolé/noindex sans lever le gate High-Fi humain.

Ne pas créer de root production ou sélectionner la stack en traitant cette proposition comme approuvée.

## 12. Rights / éditeurs

Contrat :
`docs/MODARYX-V2-GAME-SUPPORT-PUBLISHER-RIGHTS-WORKFLOW-20261004.md`

Principes :
- demande membre → triage → baseline sûre → Rights Case → contact officiel vérifié → demande → réponse → scopes ;
- `NO_RESPONSE != APPROVED` ;
- droits Web et MODARYX Forge séparés ;
- ambiguïté juridique → `LEGAL_REVIEW_REQUIRED`.

Prototype et contrats : avancés/verts.

Production toujours manquante :
- Game Rights Registry ;
- discovery contact réel ;
- outbound réel ;
- parsing réel ;
- validation licence ;
- revue juridique lorsque requise.

## 13. MODARYX IA

Fondation :
`docs/MODARYX-AI-FOUNDATION-ARCHITECTURE-20261004.md`

Architecture conceptuelle : TERMINÉE.

Toujours non implémenté :
- providers/modèles ;
- backend IA ;
- eval harness production ;
- intégration site réelle ;
- intégration MODARYX Forge réelle.

## 14. MODARYX Forge

Le contrat Web → Forge existe.

Toujours PREUVE MANQUANTE :
- runtime ;
- transport/protocole ;
- receipt/signature ;
- install/update/rollback ;
- Safe Profile réel ;
- sync serveur/save.

## 15. Figma

Fichier :
`MODARYX V2 — Architecture & Wireframes`

Key :
`TYoIH62lChEK6iMHhhpxZv`

Figma MCP Starter reste :
**BLOQUÉ EXTERNE par quota**.

Ne pas relancer sans changement réel de quota/plan.

## 16. Anti-oubli / preuves machine

Anti-oubli :
`docs/MODARYX-V2-ANTI-OUBLI-MASTER-20261003.md`

Registry machine :
- 55 JSON MODARYX V2 classifiés ;
- 52 contrats ;
- 3 JSON infrastructure explicitement non-contractuels ;
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Workflow security :
- 51 workflows contrôlés ;
- Actions externes pinées par SHA ;
- baseline sécurité workflows verte dans la dernière preuve canonique.

## 17. États autorisés

### TERMINÉ
- référence visuelle canonique retrouvée et hashée ;
- isolation V2 / anti-contamination ;
- prototype Living Threshold très large ;
- archive multiscreen 87 captures ;
- intégrité des captures ;
- contrats pré-production majeurs ;
- Rights / IA au niveau conception/prototype ;
- réintroduction prototype des ancres humain/loup/dragon.

### EN COURS
- réconciliation artistique finale du hero ;
- maintien des preuves / anti-oubli.

### BLOQUÉ
- High-Fi final ;
- stack/root production ;
- backend/runtime réel ;
- validations humaines/appareils ;
- Figma supplémentaire.

### PREUVE MANQUANTE
- validation artistique humaine du hero réconcilié ;
- provenance production des companion assets ;
- screen readers/appareils ;
- production/backend/Forge/rights réels.

## 18. Prochain point logique

Ne pas inventer du travail décoratif pour faire progresser un pourcentage.

Prochain point significatif :
1. présenter/faire valider humainement le candidat hero réconcilié par rapport à la source canonique ;
2. fermer ou corriger les P1 artistiques selon ce retour ;
3. ensuite seulement reclasser `normalized-visual-comparison` si la preuve le permet ;
4. puis traiter le gate de démarrage frontend : soit gate strict conservé, soit reclassification explicitement approuvée ;
5. seulement après cette décision : sélection contrôlée de stack et éventuel preview/root isolé.

## 19. Règle de reprise

Quand l'utilisateur dit `Suite l'ami` :
- lire ce checkpoint en premier ;
- vérifier branche + HEAD + PR ;
- ne pas reconstruire l'état depuis de vieux chats ;
- continuer automatiquement au prochain point logique ;
- ne jamais transformer la correction prototype du hero en validation humaine.


## 20. Micro-preuve composition hero canonique

**TERMINÉ pour la géométrie/visibilité du prototype — validation artistique humaine toujours PREUVE MANQUANTE**

Workflow :
`MODARYX V2 Canonical Hero Composition Micro-Proof`

Séquence d'erreur respectée :
1. run `37313644754` — **FAIL** : route Discover non ouverte, nœuds hero absents ;
2. diagnostic ciblé ;
3. run `37314359820` — **FAIL** : desktop géométrie valide, navigation mobile Discover non ouverte ;
4. correction ciblée : ouverture explicite du menu mobile + clic pointer réel ;
5. run `37314488570` — **SUCCESS**.

Commit capturé :
`83259afcfb8d71fe53aebdf813ac849b16557b26`

Marqueur :
`PASS_V2_CANON_HERO_COMPOSITION`

Mesures desktop :
- traveler visible ~98.97 %, overlap copy ~6.37 % ;
- wolf visible ~86.07 %, overlap copy ~3.26 % ;
- dragon visible ~80.40 %, overlap copy 0 %.

Mesures mobile :
- traveler visible ~96.46 %, overlap copy 0 % ;
- wolf visible ~69.89 %, overlap copy 0 % ;
- dragon visible ~71.94 %, overlap copy 0 %.

Invariants :
- narrative layer décorative `aria-hidden=true` ;
- `pointer-events:none` ;
- les trois ancres restent dans la zone narrative basse ;
- aucun overlap significatif avec le copy hero selon le seuil machine.

Cette micro-preuve ne ferme pas :
- l'acceptation artistique humaine ;
- la provenance production des assets compagnon ;
- le P1 `normalized-visual-comparison` ;
- High-Fi final.


## 21. Gate de promotion des assets prototype

**TERMINÉ pour le garde-fou CI / provenance production toujours PREUVE MANQUANTE**

Checker :
`qa/check-v2-production-asset-promotion-gate.mjs`

Workflow :
`MODARYX V2 Production Asset Promotion Gate`

Run :
`37315176208` — **SUCCESS**

Commit capturé :
`84673abf9bbe12e95709d6a2714116a8acd1f67f`

Marqueurs :
- `PRODUCTION_ASSET_GATE_PROTOTYPE_ONLY_COUNT 4`
- `PRODUCTION_ASSET_GATE_UNSAFE_REFERENCE_COUNT 0`
- `PRODUCTION_ASSET_GATE_UNAPPROVED_COPY_COUNT 0`
- `PASS_V2_PRODUCTION_ASSET_PROMOTION_GATE`

Le gate empêche la promotion silencieuse des assets `ALLOWED_PROTOTYPE_ONLY` vers une surface source hors des racines de preuve/policy contrôlées et bloque les copies binaires non approuvées des assets de prototype, tout en tolérant les chemins legacy explicitement connus pour loup/dragon.

Ce PASS ne transforme aucun asset en asset production :
- hero : provenance/licence production toujours manquante ;
- content sheet : idem ;
- loup/dragon : idem ;
- validation juridique formelle : non effectuée.


## 22. Pack de validation humaine du hero canonique

**TERMINÉ pour la préparation / session humaine PREUVE MANQUANTE**

Document :
`docs/MODARYX-V2-CANONICAL-HERO-HUMAN-REVIEW-PACK-20261005.md`

Le pack lie explicitement :
- source canonique Library + SHA-256 ;
- preuve d'approbation humaine historique ;
- artifact/captures du candidat actuel ;
- micro-proof géométrique ;
- tâches desktop/mobile ;
- findings P1 déjà ouverts ;
- verdicts autorisés ;
- format de preuve `VISUAL_REFERENCE_COMPARISON`.

Règle :
aucune automatisation ne peut remplir ce pack comme une vraie validation humaine.

Prochain événement requis pour `normalized-visual-comparison` :
- une vraie session humaine enregistrée ;
- ou une correction ciblée suivie d'une vraie session humaine si le candidat est rejeté.
