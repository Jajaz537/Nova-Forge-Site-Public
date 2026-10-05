# MODARYX V2 — Handoff Work pour blockers externes

**Date : 2026-10-04**  
**Statut : PRÊT — à utiliser uniquement quand ChatGPT Work peut réellement fermer un blocker externe**

## 1. Principe

Cette conversation doit terminer tout ce qui est honnêtement faisable sans preuve externe.

Work ne doit être sollicité que pour un blocker qu'il peut réellement fermer, sans se substituer :
- à un vrai participant humain ;
- à NVDA / VoiceOver / TalkBack réels ;
- à un appareil physique ;
- à une revue juridique humaine lorsque nécessaire.

## 2. Mission prioritaire Work — référence visuelle source

Blocker :
`approved-visual-reference-archivable`

Objectif :
retrouver et archiver la **référence visuelle source réellement approuvée** ayant servi à la direction Living Threshold, si elle existe encore dans un espace accessible à Work.

Work doit chercher dans :
- ses propres artefacts / fichiers de la mission Living Threshold antérieure ;
- Figma si accessible ;
- fichiers/projets ChatGPT accessibles ;
- autres sources explicitement liées à cette mission.

Work ne doit pas :
- fabriquer une nouvelle référence ;
- recréer “à peu près” la référence ;
- prendre le prototype actuel comme sa propre source ;
- déclarer une référence approuvée sans provenance.

## 3. Sortie minimale si la source est retrouvée

Archiver :
- fichier exact ou export fidèle ;
- provenance ;
- source/outil ;
- date de récupération ;
- identifiant de fichier / URL interne si applicable ;
- dimensions ;
- checksum SHA-256 ;
- note expliquant pourquoi cette source est considérée comme la référence approuvée ;
- confirmation que l'artefact peut être conservé pour comparaison.

Statut :
`SOURCE_REFERENCE_ARCHIVED`

## 4. Si la source n'est pas retrouvée

Ne pas reconstruire.

Retour attendu :
- `SOURCE_REFERENCE_NOT_RECOVERED`
- sources vérifiées ;
- raison de l'échec ;
- aucune pseudo-preuve.

Le blocker reste ouvert.

## 5. Comparaison normalisée — uniquement après archivage source

Blocker :
`normalized-source-implementation-comparison`

Conditions :
- référence source archivée ;
- prototype cible lié à un commit exact ;
- captures comparables ;
- viewport et crop documentés.

Comparer :
- composition ;
- hiérarchie ;
- grille ;
- densité ;
- typographie ;
- surfaces ;
- couleur ;
- profondeur ;
- imagery ;
- navigation ;
- responsive ;
- motion si preuve disponible.

Résultat :
- écarts listés ;
- P0/P1/P2/P3 ;
- décision : `MATCH_SUFFICIENT` / `REWORK_REQUIRED` / `INCOMPLETE`.

Aucun PASS visuel si la source elle-même n'est pas approuvée ou archivable.

## 6. Ce que Work peut aider à préparer mais ne peut pas valider seul

Work peut :
- organiser le pack humain ;
- préparer formulaires et matrices ;
- récupérer artifacts ;
- comparer des captures ;
- préparer une session.

Work ne peut pas fermer seul :
- `human-multiscreen`
- `human-mobile`
- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real` si Safari réel n'est pas effectivement utilisé ;
- `physical-devices`.

## 7. État Git avant toute écriture

Avant modification :
- lire `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-04.md` ;
- vérifier PR #162 ;
- vérifier branche + HEAD ;
- vérifier commits récents ;
- ne rien écraser ;
- ne pas toucher `main` ;
- ne pas toucher DNS/Cloudflare critique.

## 8. Handoff artifact attendu

Si Work ferme un blocker, fournir :
- blocker id ;
- état avant/après ;
- preuve ;
- commit testé ;
- artifacts ;
- checksum ;
- findings ;
- P0/P1 ;
- limites ;
- fichiers modifiés ;
- nouveau SHA.

La conversation principale revalide ensuite le changement avant de modifier le VF readiness gate.

## 9. Blocage actuel

À la création de ce handoff :
- référence visuelle approuvée archivable : **PREUVE MANQUANTE**
- comparaison normalisée : **PREUVE MANQUANTE**
- validation humaine supplémentaire : **PREUVE MANQUANTE**
- appareils/screen readers : **PREUVE MANQUANTE**

Ce document n'en ferme aucun.
