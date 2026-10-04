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
