# MODARYX V2 — Pack d’exécution des validations externes — 2026-10-06

**État : PRÊT À EXÉCUTER SUR LA V2 INTERACTIVE EXACTE / aucune validation externe encore ajoutée**

Candidat canonique courant :
- HEAD : `acd424a3d4abf0eb4cb153dc24d5202db7412afe`
- checkpoint : `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-2304.md`

## Preview V2 interactive vérifiée

- alias stable : `https://v2-engineering.nova-forge-site-public.pages.dev`
- déploiement exact : `https://6b6a0acb.nova-forge-site-public.pages.dev`
- source déployée : `acd424a3d4abf0eb4cb153dc24d5202db7412afe`
- workflow : `MODARYX V2 Isolated Pages Preview`
- run : `37533118410`
- job : `112507209743`
- état : **SUCCESS**
- meta robots : noindex/nofollow/noarchive
- header X-Robots-Tag : noindex
- DNS : non modifié
- `main` : non modifié
- cutover : non exécuté

Cette URL est désormais l’origine correcte pour les sessions réelles NVDA / VoiceOver / TalkBack / Safari / appareil physique.

## Cinq blockers visés

- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real`
- `physical-devices`

## Règle de preuve

Une session réelle produit un fichier JSON basé sur `qa/external-validation/evidence-template.json`, puis :

`node qa/check-v2-external-validation-evidence.mjs <preuve.json>`

Le checker refuse :
- un template non exécuté ;
- un SHA non exact ;
- une session sans réalité matérielle/logicielle requise ;
- une tâche critique non exécutée ;
- une preuve sans artifact ;
- un P0/P1 encore OPEN ;
- un résultat `INCOMPLETE`.

Une même personne peut exécuter plusieurs sessions, mais chaque blocker conserve sa propre preuve.
Safari + VoiceOver peuvent être testés dans le même créneau réel, avec deux enregistrements distincts.

Aucune émulation Chrome, arbre AX/CDP, user-agent Safari ou viewport mobile ne ferme ces blockers.
La racine historique Pages ne doit jamais être utilisée comme substitut à cette URL V2 interactive.
