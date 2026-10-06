# MODARYX V2 — Pack d’exécution des validations externes — 2026-10-06

**État : PRÊT CÔTÉ PROCÉDURE / EXÉCUTION BLOQUÉE TANT QU’UNE URL V2 INTERACTIVE N’EST PAS PUBLIÉE**

Candidat canonique courant :
- HEAD : `85ae67578f848cb1aef6f43d8958eb56fcf7e136`
- checkpoint : `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-2304.md`
- probe PRE_CUTOVER read-only : run `37532315393`, job `112504495423` — **SUCCESS**
- origin du probe infra : `https://6ed17e00.nova-forge-site-public.pages.dev`

## Important — ne pas tester le mauvais frontend

L’origin PRE_CUTOVER ci-dessus sert à prouver l’état backend/bindings en GET/HEAD.
Il ne doit **pas** être utilisé comme preuve visuelle ou interactive V2 si sa racine sert encore le frontend historique.

Avant toute session NVDA / VoiceOver / TalkBack / Safari / appareil physique :
- une URL **V2 interactive exacte** doit être publiée ;
- son commit doit correspondre au candidat testé ;
- le testeur doit ouvrir cette URL, pas la racine historique ;
- la preuve doit enregistrer l’URL, le SHA et les artifacts de session.

Le pack JSON marque donc :
`interactiveV2OriginState = MISSING_REQUIRED_BEFORE_EXECUTION`.

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
Aucune session ne doit être lancée contre l’ancien root historique en le faisant passer pour la V2.
