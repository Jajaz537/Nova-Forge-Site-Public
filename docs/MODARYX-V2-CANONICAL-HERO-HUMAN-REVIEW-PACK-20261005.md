# MODARYX V2 — Pack de validation humaine du hero canonique

**Date : 2026-10-05**  
**Statut : PRÊT POUR REVUE HUMAINE — aucune validation inventée**

## 1. Objet

Permettre à une vraie personne de comparer le hero MODARYX V2 courant avec la référence artistique approuvée et de produire une preuve compatible avec le contrat de validation externe.

Ce document ne vaut pas approbation.

## 2. Référence artistique approuvée

Nom :
`REFERENCE-CANONIQUE-Compagnons-face-au-royaume-enchante.png`

Library :
`file_00000000dcd482439ade71a96dfc6ba0@1`

SHA-256 :
`3b2cf82eda155d33d0ff14ad5d4ca1f95c155b8f9d019e5da03182f99f45e992`

Dimensions :
`1672 × 941`

Preuve d'approbation :
`WORK-HANDOFF-MODARYX-ULTRA-HAUT-DE-GAMME-2026-09-23.md`
Library :
`file_00000000ec7c81f4aa8d387fc8f2d34c@1`

## 3. Composition verrouillée à vérifier

La référence approuvée impose comme ancres :
- humain assis au premier plan ;
- loup ;
- bébé dragon ;
- château dominant ;
- rivière/eau structurante ;
- vallée/forêt/monde habité ;
- aucune île flottante ;
- cascades non dominantes ;
- ambiance vivante, narrative, crédible et premium.

## 4. Candidat V2 à revoir

Code visuel courant du candidat :
`f54f4c96350436dbc9a9d4796d687706fa9d1e26`

Living Threshold Visual Proof :
- run `37311727875` — **SUCCESS**
- artifact `11346416315`
- digest `sha256:779e09e6169e0421511f40f541d7a67deafb9dfe738aad34cecad9e95615d872`
- capture desktop : `multiscreen/desktop-home.png`
- capture mobile : `multiscreen/mobile-home.png`
- 87 captures dans l'archive.

Le code UI n'a pas été modifié par les micro-proofs géométriques postérieurs.

## 5. Preuve technique complémentaire

Canonical Hero Composition Micro-Proof :
- run `37314488570` — **SUCCESS**
- commit `83259afcfb8d71fe53aebdf813ac849b16557b26`
- `PASS_V2_CANON_HERO_COMPOSITION`.

Cette preuve confirme seulement que les ancres restent techniquement visibles, basses dans la composition et sans overlap significatif avec le copy.

Elle ne répond pas à la question artistique : **est-ce suffisamment bon ?**

## 6. Tâche humaine desktop

Comparer la source canonique avec `desktop-home.png`.

Répondre à chaque question :

1. Le voyageur paraît-il réellement assis et intégré à la scène, ou ressemble-t-il encore à un placeholder ?
2. Le loup paraît-il naturellement positionné dans le terrain ?
3. Le bébé dragon paraît-il naturellement positionné dans le terrain ?
4. Les trois compagnons fonctionnent-ils comme un groupe narratif cohérent ?
5. Le château reste-t-il un point focal fort ?
6. La rivière/eau structure-t-elle toujours clairement la profondeur ?
7. La vallée paraît-elle vivante et habitable plutôt que froide/générique ?
8. La scène conserve-t-elle la chaleur et la noblesse de la référence ?
9. Le hero est-il suffisamment lumineux sans dégrader la lisibilité du texte ?
10. MODARYX et le modding restent-ils clairement prioritaires par rapport au décor ?
11. Aucune île flottante ou structure flottante indésirable n'est-elle visible ?
12. Les cascades restent-elles secondaires ?
13. Le résultat paraît-il premium et volontaire, sans collage visible ?

## 7. Tâche humaine mobile

Comparer la source canonique avec `mobile-home.png`.

Vérifier :
- le texte reste prioritaire et immédiatement lisible ;
- loup / voyageur / bébé dragon sont identifiables ;
- aucun compagnon ne paraît coupé de manière maladroite ;
- le groupe ne ressemble pas à une rangée d'assets posés au bas de l'écran ;
- la profondeur du royaume reste compréhensible ;
- le château reste perceptible ;
- l'ambiance reste cohérente avec desktop ;
- CTA visible et clair ;
- aucune sensation de surcharge.

## 8. Findings connus avant revue

### VR2-01 — P1 OPEN

Le voyageur/loup/dragon sont présents, mais :
- voyageur encore sous forme de silhouette prototype ;
- acceptation artistique humaine manquante ;
- provenance production des companion assets manquante.

### VR2-02 — P1 OPEN

Le monde a été éclairci/réchauffé, mais :
- reste plus sombre que la source canonique ;
- acceptation humaine manquante.

### VR2-03 — P3 ACCEPTED_P2_P3

Préservés :
- château ;
- vallée continue ;
- eau ;
- monde habité ;
- absence d'îles flottantes ;
- cascades non dominantes.

### VR2-04 — P3 ACCEPTED_P2_P3

Préservés :
- navigation MODARYX ;
- CTA ;
- hiérarchie modding-first.

## 9. Verdicts autorisés

### PASS_WITH_NO_BLOCKER

Uniquement si :
- aucun P0/P1 ouvert ;
- toutes les tâches desktop/mobile sont exécutées ;
- résultat jugé final sur le périmètre artistique comparé.

### PASS_WITH_P2_P3

Uniquement si :
- aucun P0/P1 ;
- seuls défauts mineurs P2/P3 restent acceptables.

### FAIL_P0_P1

Si un défaut bloquant existe, par exemple :
- traveler encore clairement placeholder ;
- compagnons mal intégrés ;
- ambiance trop sombre / trop froide ;
- source canonique insuffisamment respectée ;
- perte de la lisibilité produit.

### INCOMPLETE

Si :
- comparaison interrompue ;
- source non consultée ;
- desktop ou mobile non revu ;
- participant/environnement non archivés.

## 10. Forme de preuve attendue

Créer une preuve `VISUAL_REFERENCE_COMPARISON` compatible avec :
`docs/MODARYX-V2-EXTERNAL-VALIDATION-EVIDENCE-CONTRACT-20261004.md`

Elle doit contenir :
- evidenceId ;
- sessionType ;
- date ;
- commitSha ;
- actorOpaqueId ;
- environment ;
- tasks ;
- findings ;
- result ;
- artifactRefs ;
- reviewer ;
- sourceReference approuvée ;
- normalizedConditions.

Ne pas enregistrer de donnée personnelle inutile.

## 11. Normalized conditions minimales

- même source canonique hashée ;
- même capture candidat clairement identifiée ;
- desktop et mobile revus séparément ;
- pas de comparaison basée uniquement sur luminance ou histogramme ;
- hiérarchie, composition, narration, intégration des compagnons et lisibilité produit examinées ;
- aucune automatisation ne remplace le verdict humain.

## 12. Après la revue

Si P1 :
1. conserver le finding OPEN ;
2. correction ciblée ;
3. micro-proof technique si pertinent ;
4. nouvelle capture ;
5. nouvelle revue humaine ciblée.

Si aucun P0/P1 :
- archiver la preuve ;
- la valider avec `qa/validate-v2-external-validation-evidence.mjs` ;
- seulement alors reconsidérer `normalized-visual-comparison` dans le VF readiness gate.

## 13. Limites séparées

Même une validation artistique humaine positive ne ferme pas :
- droits/licence production des assets ;
- NVDA / VoiceOver / TalkBack ;
- Safari réel ;
- appareils physiques ;
- backend ;
- stack/root production ;
- MODARYX Forge ;
- cutover.

**État : PACK PRÊT / SESSION HUMAINE PREUVE MANQUANTE.**
