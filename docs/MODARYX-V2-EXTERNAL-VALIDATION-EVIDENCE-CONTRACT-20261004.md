# MODARYX V2 — Contrat de preuve de validation externe

**Date : 2026-10-04**  
**Statut : ACTIF — structure de preuve / aucune session externe inventée**

## 1. But

Définir les métadonnées minimales permettant de fermer honnêtement un blocker humain, screen reader, navigateur réel ou appareil physique.

Ce contrat ne produit aucune validation. Il empêche uniquement qu'une automatisation, une simulation, une capture ou un simple commentaire soit compté à tort comme preuve externe.

## 2. Types de session

Types acceptés :
- `HUMAN_MULTISCREEN`
- `HUMAN_MOBILE`
- `NVDA_REAL`
- `VOICEOVER_REAL`
- `TALKBACK_REAL`
- `SAFARI_REAL`
- `PHYSICAL_DEVICE`
- `VISUAL_REFERENCE_COMPARISON`

Un même événement peut produire plusieurs preuves uniquement si chaque environnement requis est réellement exercé et enregistré séparément.

## 3. Champs obligatoires

Chaque preuve doit contenir :
- `evidenceId`
- `sessionType`
- `date`
- `commitSha`
- `participantOpaqueId` ou `operatorOpaqueId`
- `environment`
- `tasks`
- `findings`
- `result`
- `artifactRefs`
- `reviewer`

Aucune donnée personnelle inutile.

## 4. Environment

Selon le type, enregistrer ce qui est réellement connu :
- appareil ;
- OS ;
- navigateur ;
- version navigateur si connue ;
- screen reader ;
- version screen reader si connue ;
- taille/viewport approximatif ;
- orientation ;
- clavier/souris/touch ;
- mode reduced motion / contrast si pertinent.

Valeurs inconnues explicites :
- `UNKNOWN_RECORDED`

Interdit :
- inventer une version ;
- déduire un appareil physique depuis une émulation ;
- transformer un browser automation en screen reader réel.

## 5. Résultats autorisés

- `PASS_WITH_NO_BLOCKER`
- `PASS_WITH_P2_P3`
- `FAIL_P0_P1`
- `INCOMPLETE`

Règles :
- `PASS_WITH_NO_BLOCKER` exige toutes les tâches prévues exécutées ;
- `PASS_WITH_P2_P3` exige P0/P1 absents ;
- tout P0/P1 non corrigé = `FAIL_P0_P1` ;
- session interrompue ou environnement non prouvé = `INCOMPLETE`.

## 6. Findings

Chaque finding comporte :
- id ;
- surface ;
- description ;
- severity : P0 / P1 / P2 / P3 ;
- reproduction ;
- status : OPEN / FIXED / ACCEPTED_P2_P3 / NOT_REPRODUCIBLE ;
- fixCommit si corrigé ;
- microProof si corrigé.

P0/P1 ne peuvent pas être fermés par une note “acceptable” sans correction ou décision canonique justifiée.

## 7. Preuves humaines

Une vraie preuve humaine exige :
- participant réel ;
- réponses ou observations archivées ;
- tâche donnée ;
- comportement/réponse observé ;
- synthèse ;
- aucun remplacement par une simulation IA.

Une auto-évaluation du créateur peut être archivée, mais ne suffit pas à fermer le gate humain global.

## 8. Screen reader réel

Pour `NVDA_REAL`, `VOICEOVER_REAL`, `TALKBACK_REAL` :
- le lecteur d'écran doit réellement être actif ;
- environnement enregistré ;
- parcours enregistré ;
- annonces problématiques notées ;
- focus/navigation vérifiés ;
- P0/P1 corrigés avant fermeture.

Un accessibility tree CDP ne compte pas comme session screen reader réelle.

## 9. Safari réel

`SAFARI_REAL` exige Safari réellement exécuté.

Une émulation WebKit/Chrome, un user-agent modifié ou une capture statique ne suffit pas.

## 10. Appareil physique

`PHYSICAL_DEVICE` exige un appareil réel.

Émulation viewport, DevTools device mode ou screenshot redimensionné ne suffit pas.

## 11. Référence visuelle approuvée

`VISUAL_REFERENCE_COMPARISON` exige :
- référence source archivable ;
- identité/provenance de la référence ;
- preuve qu'elle est approuvée comme cible ;
- commit de l'implémentation comparée ;
- conditions de comparaison normalisées ;
- écarts relevés ;
- décision finale.

Sans source approuvée archivable :
- résultat = `INCOMPLETE`.

## 12. Artifact refs

Les références peuvent viser :
- fichier versionné ;
- artifact CI ;
- capture ;
- vidéo/audio si autorisé ;
- notes de session ;
- matrice de résultats.

Une simple phrase “testé et bon” sans artifact ou observations structurées n'est pas suffisante.

## 13. Fermeture d'un blocker

Un blocker externe passe de `OPEN` à `CLOSED` seulement si :
1. preuve correspondant exactement au blocker ;
2. environnement réel requis ;
3. commit testé enregistré ;
4. tâches exécutées ;
5. findings archivés ;
6. P0/P1 fermés ;
7. reviewer identifié de manière non sensible ;
8. artifactRefs non vides.

## 14. Invariants

- AUTOMATION_NEVER_EQUALS_HUMAN_EVIDENCE
- EMULATION_NEVER_EQUALS_PHYSICAL_DEVICE
- CDP_AX_TREE_NEVER_EQUALS_REAL_SCREEN_READER
- NON_SAFARI_NEVER_EQUALS_SAFARI_REAL
- NO_ARCHIVABLE_REFERENCE_NEVER_EQUALS_VISUAL_FIDELITY_PASS
- P0_P1_OPEN_NEVER_EQUALS_GATE_CLOSED
- INCOMPLETE_NEVER_EQUALS_PASS
- EVIDENCE_MUST_BIND_TO_COMMIT
- EVIDENCE_MUST_HAVE_ARTIFACT_REFS
- NO_UNNECESSARY_PERSONAL_DATA

## 15. Sources opérationnelles

Ce contrat complète :
- `docs/MODARYX-V2-HUMAN-MULTISCREEN-REVIEW-PACK-20261004.md`
- `docs/MODARYX-V2-ASSISTIVE-DEVICE-VALIDATION-PROTOCOL-20261004.md`
- `docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`

## 16. Statut

À ce jour :
- structure de preuve : **TERMINÉE**
- sessions humaines supplémentaires : **PREUVE MANQUANTE**
- NVDA réel : **PREUVE MANQUANTE**
- VoiceOver réel : **PREUVE MANQUANTE**
- TalkBack réel : **PREUVE MANQUANTE**
- Safari réel : **PREUVE MANQUANTE**
- appareils physiques : **PREUVE MANQUANTE**
- référence visuelle approuvée archivable : **PREUVE MANQUANTE**
