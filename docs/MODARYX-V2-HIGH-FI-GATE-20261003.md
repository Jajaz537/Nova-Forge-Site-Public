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
- interprétation automatique fictive de réponse éditeur : SAFE_AUTOMATION + LEGAL_REVIEW_REQUIRED fallback ;
- Publisher Outbound fictif : queue/provider/livraison/bounce permission-neutral ;
- Publisher Inbound fictif : réception/corrélation/provenance/quarantaine/READY_FOR_INTERPRETATION.
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


## 17. Notifications droits éditeurs — preuve prototype — 4 octobre 2026

**High-Fi final reste BLOQUÉ.**

Preuves ciblées :
- contrat notification run `37202025942` — **SUCCESS** ;
- micro-proof rendu run `37202244972` — **SUCCESS** ;
- Living Threshold continuation run `37202254205` — **SUCCESS** ;
- commit capturé `ddba1f0bbf90c417600f6fdb800529b7e24248f0` ;
- artifact `11303272811` ;
- digest `sha256:f34ee2b0b83e561f6f550ab1e575216a80200dd60d827f9bc64f6d96a7da34a4` ;
- 71 captures ;
- `RIGHTS_NOTIFICATION_MOBILE_OVERFLOW 0` ;
- `FLOW_ASSERT publisher rights notification preview truthful`.

La surface démontre :
- aucun événement réel inventé ;
- notification d’autorisation limitée distincte de revue juridique ;
- `LEGAL_REVIEW_REQUIRED` ne ressemble pas à une approbation ;
- email/push restent indisponibles sans infrastructure.

Cette preuve ne valide aucune notification production et ne ferme aucun blocker humain/appareil.


## 18. Cycle de vie des droits éditeurs — preuve prototype — 4 octobre 2026

**High-Fi final reste BLOQUÉ.**

Preuve Living Threshold :
- run `37204012017` — **SUCCESS** ;
- commit capturé `7dc36e1231872d1fdd5a7af17bed6f5ad0b717da` ;
- artifact `11303812534` ;
- digest `sha256:9718d2ff47e24b3ba50707bcb340adfe5fbff9bc24f7b73c0a95a93b1ff8cf00` ;
- `FLOW_ASSERT rights lifecycle expired revoked scopes reblocked` ;
- `MULTISCREEN_CAPTURE_COUNT 73` ;
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Preuve contrat :
- run `37204099457` — **SUCCESS** ;
- `RIGHTS_LIFECYCLE_STATE_COUNT 4` ;
- `RIGHTS_LIFECYCLE_INVARIANT_COUNT 9` ;
- `RIGHTS_LIFECYCLE_REACTIVATION_EVIDENCE_COUNT 6` ;
- `PASS_V2_RIGHTS_LIFECYCLE_CONTRACT`.

Matérialisé :
- ACTIVE_WITH_LIMITS ;
- EXPIRING_SOON ;
- EXPIRED ;
- REVOKED ;
- expiration/révocation → usages dépendants rebloqués ;
- fallback baseline originale MODARYX ;
- aucune réactivation silencieuse ;
- MODARYX Forge reste un droit distinct.

Cette preuve améliore la couverture du workflow droits mais ne prouve aucun scheduler, monitor d'expiration, inbound de révocation, lock production ou licence réelle et ne lève aucun blocker humain/appareil.


## 19. IP / takedown — preuve prototype — 4 octobre 2026

**High-Fi final reste BLOQUÉ.**

Contrat :
- `docs/MODARYX-V2-IP-TAKEDOWN-WORKFLOW-20261004.md`
- `qa/modaryx-v2-ip-takedown-contract.json`
- run `37204583345` — **SUCCESS**
- `IP_TAKEDOWN_STATE_COUNT 12`
- `IP_TAKEDOWN_INVARIANT_COUNT 12`
- `IP_TAKEDOWN_RESTRICTION_EFFECT_COUNT 6`
- `PASS_V2_IP_TAKEDOWN_CONTRACT`.

Preuve Living Threshold :
- run `37204720263` — **SUCCESS** ;
- commit capturé `eefd01c8ec1d35f7bd9212e40f65d2ac390479cd` ;
- artifact `11304695959` ;
- digest `sha256:126e3758ca6a4f1c19e85f6eb8be0c9d0b456705feb43ce1e8777ccbf77004f0` ;
- `FLOW_ASSERT ip takedown containment preserves evidence fallback legal escalation` ;
- `MULTISCREEN_CAPTURE_COUNT 75`.

Matérialisé :
- cas IP fictif ;
- autorité non vérifiée explicitement ;
- localisation asset ;
- restriction temporaire ;
- fallback original MODARYX ;
- preuves conservées ;
- escalade `LEGAL_REVIEW_REQUIRED` ;
- aucune restauration automatique.

Toujours NON IMPLÉMENTÉ :
- backend cases ;
- formulaire IP réel ;
- mailbox IP ;
- cache/CDN/SW invalidation production ;
- anti-réupload production ;
- legal review opérationnelle.

Cette preuve ne vaut ni procédure juridique finale ni conformité réglementaire et ne ferme aucun blocker humain/appareil.


## MODARYX IA — extension de couverture — 4 octobre 2026

Run `37211271783` : **SUCCESS**  
Commit `f8616f18876c49de45b3d208222be042dd2b543a`  
Artifact `11306731614`  
Captures : **77**  
Keyboard : `37 / 37`

La surface MODARYX IA desktop/mobile est matérialisée comme preview non active :
- aucune réponse réelle ;
- aucun backend réel ;
- composer désactivé ;
- garde-fous de confiance visibles.

Cela augmente la couverture du prototype sans lever les validations humaines/appareils.

**High-Fi final : BLOQUÉ.**


## 20. Publisher Inbound — preuve prototype — 4 octobre 2026

**High-Fi final reste BLOQUÉ.**

Contrat :
- run `37214242330` — **SUCCESS** ;
- `PASS_V2_PUBLISHER_INBOUND_CONTRACT`.

Micro-proof :
- run `37214564614` — **SUCCESS** ;
- `PUBLISHER_INBOUND_MOBILE_OVERFLOW 0` ;
- `PASS_V2_PUBLISHER_INBOUND_PREVIEW`.

Preuve Living Threshold :
- run `37214829645` — **SUCCESS** ;
- commit `31db0796949a3c453f61864d84e3cf86f103aa94` ;
- artifact `11308280526` ;
- digest `sha256:124e7465bbb4b732153b2f8858a9288b96a59a2d7f1d905c1b0fea44df7d8a5c` ;
- `FLOW_ASSERT publisher inbound correlation provenance fail-closed` ;
- `MULTISCREEN_CAPTURE_COUNT 81`.

Matérialisé :
- réception fictive ;
- corrélation à une demande logique / Rights Case fictifs ;
- provenance technique séparée de l’autorité juridique ;
- quarantaine des pièces jointes ;
- `READY_FOR_INTERPRETATION ≠ autorisation` ;
- provenance non fiable → fail closed.

Toujours NON IMPLÉMENTÉ :
- mailbox/webhook ;
- moteur de corrélation réel ;
- vérification provenance réelle ;
- scanner pièces jointes ;
- parser/routing réel.

Cette preuve n’enlève aucun blocker humain/appareil et ne vaut aucune validation juridique.


## 21. Tablet reflow navigateur — preuve ciblée — 4 octobre 2026

**High-Fi final reste BLOQUÉ.**

Incident :
- run `37215370580` : overflow horizontal 220 px à 834×1112 sur le Game Hub.

Correction ciblée :
- topbar/navigation repliée pour la plage 761–1050 px.

Preuve :
- run `37215965531` — **SUCCESS**
- `TABLET_REFLOW_SURFACE_COUNT 12`
- `PASS_V2_TABLET_REFLOW`
- aucun overflow horizontal sur les 12 surfaces ciblées.

La correction UI a également conservé la suite Living Threshold verte :
- run `37215577121` — **SUCCESS**
- 81 captures ;
- keyboard 37/37 ;
- desktop/mobile overflow 0.

Limite :
il s'agit d'une émulation Chrome 834×1112, **pas** d'une validation sur tablette physique ou Safari/iPadOS.

Le blocker « appareils physiques » reste donc inchangé.
