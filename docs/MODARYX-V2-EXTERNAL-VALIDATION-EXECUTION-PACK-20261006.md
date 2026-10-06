# MODARYX V2 — Pack d’exécution des validations externes — 2026-10-06

**État : PRÊT À EXÉCUTER / aucune validation externe ajoutée**

Ce pack cible exactement les cinq blockers encore impossibles à fermer honnêtement depuis l’automatisation :
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

## Important

Une même personne peut exécuter plusieurs sessions, mais chaque blocker conserve sa propre preuve.
Safari + VoiceOver peuvent être testés dans le même créneau réel, mais doivent produire deux enregistrements distincts.

Aucune émulation Chrome, arbre AX/CDP, user-agent Safari ou viewport mobile ne ferme ces blockers.

Le pack ne collecte aucune donnée personnelle nécessairement identifiable : utiliser des identifiants opérateur/reviewer opaques.
