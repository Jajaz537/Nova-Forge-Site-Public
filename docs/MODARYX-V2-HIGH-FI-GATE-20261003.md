# MODARYX V2 — Gate d'entrée High‑Fi

**Date : 2026-10-03**
**Statut : BLOQUÉ tant que les critères ci-dessous ne sont pas satisfaits**

## 1. Pourquoi ce gate existe

L'ancien processus a trop souvent transformé :

- une preuve technique ;
- un label Premium HD ;
- une capture correcte ;
- un lot CSS ;
- une PR de finition

en quasi-validation artistique.

V2 interdit ce raccourci.

## 2. IA / navigation

Avant high‑fi :

- navigation primaire stabilisée ;
- Game Hub matérialisé ;
- Global Search matérialisé ;
- Community matérialisée ;
- Mobile Game Hub matérialisé ;
- tâches de tree testing définies ;
- aucun libellé critique dépend d'un vocabulaire de lore.

## 3. Parcours

Les trois flows doivent être complets :

### Découverte → installation

- entrée jeu ;
- recherche ;
- catalogue ;
- fiche ;
- compatibilité ;
- dépendances ;
- action.

### Créateur → publication

- projet ;
- métadonnées ;
- compatibilité ;
- fichiers ;
- droits ;
- validation ;
- publication.

### Collection → profil

- sélection ;
- dépendances ;
- conflits ;
- versioning ;
- loadout ;
- installation.

## 4. États

Pour chaque flow :

- nominal ;
- loading ;
- empty/no-results ;
- error/retry ;
- offline/stale si pertinent ;
- unavailable ;
- auth/permission ;
- incompatible/unverified ;
- success.

## 5. Taxonomie

Avant art direction :

- différence mod/plugin/addon/tool/etc. clarifiée ;
- agrégats collection/modpack/profile séparés ;
- Release séparée de ContentItem ;
- dépendances et conflits structurés ;
- compatibilité multi-dimension définie.

## 6. Contenus réels

Aucun high‑fi ne doit dépendre de faux chiffres, faux mods ou fausses compatibilités.

Les placeholders low‑fi restent acceptables.

Les maquettes high‑fi devront utiliser :

- contenu autorisé ;
- démos explicitement marquées ;
- ou placeholders honnêtes.

## 7. Mobile

Le mobile doit être conçu comme composition dédiée :

- recherche immédiate ;
- navigation claire ;
- filtres drawer ;
- version/compatibilité accessibles ;
- actions critiques atteignables ;
- pas de simple compression du desktop.

## 8. Accessibilité de conception

Avant high‑fi final :

- focus prévu ;
- clavier prévu ;
- labels explicites ;
- reduced motion prévu ;
- ordre de lecture logique ;
- contrastes testables ;
- erreurs non uniquement colorées.

## 9. Performance perçue

Le design ne doit pas dépendre de :

- vidéos lourdes automatiques ;
- dizaines d'effets superposés ;
- blur massif ;
- assets hero disproportionnés ;
- animations permanentes.

L'univers vivant doit être fail-soft.

## 10. Identité MODARYX

L'identité finale doit respecter :

> L'univers est le théâtre ; le modding est l'action.

Le royaume, les compagnons, l'heure, la météo, les saisons, les factions et l'ambiance peuvent enrichir :

- hero ;
- background ;
- micro-interactions ;
- progression ;
- surfaces secondaires.

Ils ne doivent jamais masquer :

- jeu ;
- recherche ;
- contenu ;
- compatibilité ;
- dépendances ;
- installation ;
- créateur.

## 11. Validation comparative

Avant développement du skin final, le prototype high‑fi devra être comparé écran par écran sur :

- clarté ;
- densité ;
- vitesse de compréhension ;
- placement ;
- hiérarchie ;
- recherche ;
- filtres ;
- fiche ;
- dépendances ;
- mobile ;
- qualité de marque.

Références de comparaison fonctionnelle :

- Nexus Mods
- CurseForge
- Modrinth
- Thunderstore
- Steam Workshop
- GameBanana

La comparaison n'implique aucune copie de leur identité.

## 12. Preuves requises pour lever le gate

### TERMINÉ requis

- architecture produit ;
- taxonomie ;
- flows ;
- matrice d'états ;
- couverture wireframes core ;
- validation heuristique sans blocker majeur.

### Validation humaine encore incomplète

- P01 réel : mini-test critique + mini-test terminologique TERMINÉS ;
- étude Work 5 profils × 16 tâches : TERMINÉE, simulation IA ;
- étude indépendante interne 5 profils × 16 tâches : TERMINÉE, simulation IA ;
- validation humaine supplémentaire requise avant gel de la microcopy critique ;
- compréhension de la homepage : PREUVE MANQUANTE ;
- compréhension complète de la fiche : PREUVE PARTIELLE ;
- validation mobile réelle : PREUVE MANQUANTE ;
- validation de la direction artistique après génération des concepts : PREUVE MANQUANTE.

## 13. État courant

**BLOQUÉ pour gel high-fi final — exploration réversible autorisée.**

État réel :

1. couverture conceptuelle core : TERMINÉE ; quatre écrans supplémentaires existent en prototype low-fi HTML isolé mais restent non matérialisés dans Figma ;
2. quota Figma MCP Starter : BLOQUÉ EXTERNE ;
3. P01 humain : mini-test critique + mini-test terminologique TERMINÉS ; validation humaine globale : EN COURS ;
4. convergence P01 + Work + étude indépendante : TERMINÉE ;
5. P01 préfère **Profils de jeu**, comprend **Collection** et **Bibliothèque** ; ces points restent à consolider avec d'autres humains mais ne sont plus les principaux risques de wording ;
6. **Mods & contenus** devient le libellé parapluie provisoire préféré après benchmark externe + P01 + simulation assistant + simulation Work ; validation humaine globale encore EN COURS ;
7. le badge générique **Non vérifié** est écarté : toujours qualifier Compatibilité / Provenance / Scan / risque réel.

Ce blocage n'empêche pas la direction artistique exploratoire, le design system préparatoire ni les prototypes comparatifs réversibles. Il interdit uniquement de présenter la microcopy ou le high-fi comme humainement validés/finalisés.


## 14. État terminologique après test Work en aveugle

Convergences suffisantes pour poursuivre l'exploration réversible :
- **Mods & contenus** ;
- Collection avec capacité explicite ;
- Bibliothèque comme espace personnel ;
- suppression de **Non vérifié** générique.

L'arbitrage **Profils de jeu** vs **Configurations de jeu** est **TERMINÉ** : **Profils de jeu** est retenu comme décision produit.

Aucun blocker terminologique majeur ne subsiste sur ce point.


## 15. Réévaluation après expansion Living Threshold — 4 octobre 2026

**High-Fi final : BLOQUÉ — mais la couverture prototype interne a fortement progressé.**

Preuve cible la plus récente :
- run `37161856917` — SUCCESS ;
- 39 captures desktop/mobile ;
- flows produit ciblés : SUCCESS ;
- keyboard/touch/overflow ciblés : SUCCESS ;
- offline navigateur réel : SUCCESS ;
- erreur locale → correction → retry : SUCCESS.

### Critères désormais matérialisés dans le prototype navigateur

- navigation primaire complète ;
- Games Index ;
- Game Hub desktop/mobile ;
- Global Search desktop/mobile ;
- Catalog ;
- Content Detail ;
- Collections ;
- Modpack distinct ;
- Profil de jeu détaillé ;
- Créateurs ;
- Community ;
- Library ;
- Creator Studio ;
- Compte/Notifications/Préférences/Onboarding ;
- Support séparé de Signalement ;
- Game Atmosphere Layer originale, avec variante desktop/mobile ;
- Rights Dashboard admin fictif : autorisation limitée / attente / no-response / outbound indisponible ;
- demande membre de support d’un jeu : brouillon local, validation, triage explicite, aucun Rights Case réel ;
- triage admin fictif d’une demande membre : ACCEPTED_SAFE_BASELINE distinct de tout accord éditeur ;
- interprétation automatique fictive de réponse éditeur : SAFE_AUTOMATION + LEGAL_REVIEW_REQUIRED fallback.
- états nominal / empty / unavailable / anonymous / local-only / offline-stale / validation-error-retry / success sur les surfaces ciblées.

### Limites internes encore ouvertes

- loading/skeletons systématiques non exercés écran par écran ;
- vraies erreurs backend/retry non prouvées tant que le backend V2 n'existe pas ;
- session expirée/permission denied réelles non prouvées ;
- sync conflict réel non prouvé ;
- PWA/SW V2 offline production non implémenté ;
- contenu/données réelles encore absents du prototype.

### Blockers externes ou humains restant pour le gel High-Fi

- référence visuelle approuvée archivable + comparaison normalisée ;
- revue humaine multi-écrans supplémentaire ;
- validation mobile humaine réelle ;
- screen reader réel ;
- appareils physiques ;
- Figma supplémentaire toujours bloqué par quota si la matérialisation Figma reste exigée ;
- vraie revue humaine de la variante Game Atmosphere : PREUVE MANQUANTE.

### Décision de gate

Le prototype peut continuer à être approfondi et utilisé comme référence de construction réversible.  
Il **ne devient pas** automatiquement un frontend V2 de production ni une validation High-Fi finale.

Le passage au premier root/frontend V2 de production reste régi par la matrice de readiness et doit faire l'objet d'une décision contrôlée une fois les blockers de validation requis fermés ou explicitement reclassifiés avec preuve.


## 16. Contact éditeur vérifié avant demande — preuve prototype — 4 octobre 2026

**High-Fi final reste BLOQUÉ.**

Preuve Living Threshold la plus fraîche pour ce flux :
- run `37201151562` — **SUCCESS** ;
- commit capturé `238cc7f5fae3720aa495ca2e6c3909c8baabc21a` ;
- artifact `11303470181` ;
- digest `sha256:853428274c5abce89cd1ab2b147005161b656f7e613ae121fd191835a69ed719` ;
- `KEYBOARD_REACHABLE 36 / 36` ;
- `PUBLISHER_CONTACT_MOBILE_OVERFLOW 0` ;
- `RIGHTS_MOBILE_OVERFLOW 0` ;
- `FLOW_ASSERT publisher contact verified before request ready` ;
- `MULTISCREEN_CAPTURE_COUNT 69` ;
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Nouveau flux matérialisé :
- `CONTACT_CANDIDATE` ;
- vérification explicite du canal fictif ;
- `CONTACT_VERIFIED` ;
- préparation structurée seulement après vérification ;
- `REQUEST_READY` ;
- outbound réel toujours indisponible ;
- aucune adresse réelle utilisée.

Cette preuve améliore la couverture du workflow droits mais ne ferme aucun blocker humain/appareil, ne prouve aucun contact éditeur réel et ne lève pas le gate High-Fi.
