# MODARYX V2 — Pack d’exécution des validations externes — 2026-10-06

**État : PRÊT À EXÉCUTER / aucune validation externe ajoutée**

Candidat réellement re-probé :
- source runtime : `ce587af7d138eedf148d5d446cacd8fb6f2235a3`
- preview exact : `https://371b4eff.nova-forge-site-public.pages.dev`
- run read-only : `37488293293`
- job : `112354005071`
- checkpoint : `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-1732.md`

Ce pack cible exactement les cinq blockers impossibles à fermer honnêtement depuis l’automatisation :
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareil physique.

## Règle

Une session réelle produit un fichier JSON basé sur `qa/external-validation/evidence-template.json`, puis :

`node qa/check-v2-external-validation-evidence.mjs <preuve.json>`

Le checker refuse :
- un template non exécuté ;
- un SHA non exact ;
- une session sans réalité matérielle/logicielle requise ;
- une tâche critique non exécutée ;
- une preuve sans artifact ;
- un P0/P1 encore OPEN ;
- un résultat INCOMPLETE.

Une même personne peut exécuter plusieurs sessions, mais chaque blocker conserve sa propre preuve.
Safari + VoiceOver peuvent être testés dans le même créneau réel, avec deux enregistrements distincts.

Aucune émulation Chrome, arbre AX/CDP, user-agent Safari ou viewport mobile ne ferme ces blockers.
