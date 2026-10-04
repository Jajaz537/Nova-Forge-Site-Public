# MODARYX V2 — Pack de validation humaine multi-écrans

**Date : 2026-10-04**  
**Statut : PRÊT À UTILISER — aucune validation humaine inventée**

## 1. But

Fermer rapidement et proprement les derniers blockers humains du prototype Living Threshold sans demander aux participants de parcourir 81 captures au hasard.

Ce pack ne remplace pas :
- un screen reader réel ;
- un appareil physique ;
- une comparaison normalisée à une référence visuelle approuvée ;
- un backend réel ;
- la QA production.

## 2. Preuve visuelle disponible

Run de capture étendu le plus récent :
- workflow : `MODARYX V2 Living Threshold Visual Proof`
- run : `37222125590` — **SUCCESS**
- commit capturé : `a478afcf3eadfb1682754535d0ca632520601a26`
- artifact : `11310576920`
- digest : `sha256:ad2efb5f42047e36812f8a53e753adec443be53baab05a8ca2d92b44a7ca2fb3`
- captures : **81**
- desktop + mobile
- keyboard : `38 / 38`
- desktop/mobile overflow : `0 / 0`
- document en français, preview noindex, titre non générique ;
- flows produit ciblés : **SUCCESS**.

Aucune capture ne doit être présentée comme donnée réelle : le prototype utilise des contenus explicitement de démonstration.

## 3. Écrans prioritaires pour la revue

### Desktop — noyau

1. `desktop-home.png`
2. `desktop-game-hub.png`
3. `desktop-catalog.png`
4. `desktop-content-detail.png`
5. `desktop-collections.png`
6. `desktop-modpack.png`
7. `desktop-library.png`
8. `desktop-community.png`
9. `desktop-creator-studio.png`
10. `desktop-account.png`
11. `desktop-game-hub-atmosphere-rivenfall.png` — variante fictive/originale MODARYX, à évaluer sur la cohérence de marque plutôt que sur la ressemblance à un jeu réel
12. `desktop-rights-dashboard.png` — administration fictive : vérifier clarté des statuts, scopes et garde-fous
13. `desktop-game-support-request.png` — vérifier que la demande membre paraît locale, non envoyée et soumise à triage
14. `desktop-rights-triage-accepted.png` — vérifier qu’une acceptation produit n’est pas confondue avec un accord éditeur
15. `desktop-rights-response-interpretation.png` — vérifier la lecture SAFE_AUTOMATION + fallback LEGAL_REVIEW_REQUIRED
16. `desktop-rights-contact-verified.png` — vérifier que CONTACT_VERIFIED précède REQUEST_READY et qu’aucun envoi réel n’est suggéré
17. `desktop-rights-notification-preview.png` — vérifier que les événements fictifs restent clairement marqués non reçus
18. `desktop-rights-outbound-delivered.png` — vérifier que DELIVERED n’est jamais confondu avec une autorisation
19. `desktop-rights-inbound-ready.png` — vérifier corrélation, provenance, quarantaine et READY_FOR_INTERPRETATION sans confusion juridique
- `desktop-rights-lifecycle-expired.png` — vérifier que l’expiration rebloque clairement les usages dépendants.
- `desktop-ip-takedown-restricted.png` — vérifier compréhension du fallback temporaire, preuves conservées et absence de décision juridique automatique.

### Mobile — noyau

1. `mobile-game-hub.png`
2. `mobile-catalog.png`
3. `mobile-content-detail.png`
4. `mobile-library.png`
5. `mobile-game-profile.png`
6. `mobile-creator-studio.png`
7. `mobile-collections.png`
8. `mobile-account.png`
9. `mobile-game-hub-atmosphere-rivenfall.png` — vérifier que l’ambiance reste lisible, secondaire et clairement MODARYX sur petit écran
10. `mobile-rights-dashboard.png` — vérifier que la hiérarchie admin reste compréhensible sur petit écran
11. `mobile-game-support-request.png` — vérifier lisibilité du brouillon local et du statut non envoyé
12. `mobile-rights-triage-accepted.png` — vérifier lisibilité du triage et de la baseline sûre sur petit écran
13. `mobile-rights-response-interpretation.png` — vérifier compréhension du parsing de réponse et du garde-fou juridique
14. `mobile-rights-contact-verified.png` — vérifier la lisibilité du contact vérifié et de REQUEST_READY sur petit écran
15. `mobile-rights-notification-preview.png` — vérifier la compréhension des notifications droits fictives sans confusion avec un événement réel
16. `mobile-rights-outbound-delivered.png` — vérifier que la livraison reste permission-neutral sur petit écran
17. `mobile-rights-inbound-ready.png` — vérifier que le résultat READY_FOR_INTERPRETATION ≠ autorisation reste immédiatement visible
- `mobile-rights-lifecycle-expired.png` — vérifier lisibilité du fallback baseline MODARYX après expiration.
- `mobile-ip-takedown-restricted.png` — vérifier lisibilité du cas IP restreint sur petit écran.

### États critiques si le participant a encore du temps

- `desktop-content-report-error.png`
- `mobile-content-report-error.png`
- `desktop-notifications.png`
- `mobile-notifications.png`

## 4. Consigne participant

Ne pas expliquer le vocabulaire avant les questions.

Dire seulement :

> Voici une proposition de MODARYX, une plateforme autour des jeux et du modding. Regardez les écrans comme si vous découvriez le produit pour la première fois. Dites ce que vous comprenez, ce qui vous attire, ce qui vous gêne et ce que vous chercheriez à faire.

Ne pas dire :
- où cliquer ;
- ce que signifie Collection / Modpack / Profil de jeu ;
- quelle direction artistique est attendue ;
- quelle réponse serait “bonne”.

## 5. Questions courtes obligatoires

### Compréhension globale

1. En regardant Home + Game Hub, à quoi sert MODARYX selon vous ?
2. Où iriez-vous pour trouver du contenu pour un jeu précis ?
3. Où vérifieriez-vous si un contenu est compatible avec votre version du jeu ?

### Objets produit

4. Quelle différence comprenez-vous entre :
   - Collection ;
   - Modpack ;
   - Profil de jeu ?
5. Dans la Bibliothèque, où vous attendez-vous à retrouver vos propres configurations ?

### Confiance

6. Sur la fiche contenu, quelles informations regarderiez-vous avant d'ajouter ou télécharger quelque chose ?
7. Est-ce qu'un état de sécurité/compatibilité/provenance vous semble ambigu ou trop rassurant ?

### Création / communauté

8. Si vous étiez créateur, où commenceriez-vous pour publier un projet ?
9. La page Communauté ressemble-t-elle à un espace centré modding ou à un réseau social générique ?

### Mobile

10. Sur mobile, pouvez-vous identifier rapidement :
   - Recherche ;
   - Jeux ;
   - Bibliothèque ;
   - Compte ?
11. Une information importante vous paraît-elle cachée ou trop basse dans la page ?

### Direction visuelle

12. Sans parler de goûts personnels uniquement :
   - qu'est-ce qui paraît propre / premium ;
   - qu'est-ce qui paraît chargé ;
   - qu'est-ce qui paraît difficile à lire ;
   - le cyan/violet/ambre aide-t-il à comprendre les actions et états ?

### Game Atmosphere

13. En comparant le Game Hub Aetherlands et la variante Rivenfall fictive :
   - avez-vous toujours l’impression d’être dans le même produit MODARYX ?
   - l’ambiance change-t-elle sans modifier la compréhension de la navigation ?
   - un élément décoratif gêne-t-il une information ou une action ?
   - la variante paraît-elle originale plutôt qu’une copie d’une identité de jeu connue ?

### Rights Dashboard

14. Sur la surface d’administration fictive :
   - comprenez-vous immédiatement qu’aucune demande réelle n’est envoyée ?
   - distinguez-vous autorisation limitée, attente et absence de réponse ?
   - comprenez-vous qu’un scope refusé ou absent reste bloqué ?
   - l’état MODARYX Forge paraît-il clairement séparé des droits Web ?

### Demande membre de support d’un jeu

15. Sur la demande de support d’un jeu :
   - comprenez-vous que la demande reste locale dans le prototype ?
   - comprenez-vous qu’un triage MODARYX est obligatoire avant acceptation ?
   - comprenez-vous qu’aucune demande éditeur ni Rights Case réel n’est créé à ce stade ?

16. Dans le triage administrateur fictif :
   - l’état ACCEPTED_SAFE_BASELINE vous paraît-il distinct d’une autorisation éditeur ?
   - comprenez-vous qu’aucun contact, outbound ou asset officiel n’est activé ?
   - la décision de refuser/acceptation est-elle lisible sans ambiguïté ?

17. Sur l’interprétation automatique fictive :
   - comprenez-vous que SAFE_AUTOMATION s’applique uniquement à des scopes explicites ?
   - comprenez-vous qu’une clause ambiguë bascule en LEGAL_REVIEW_REQUIRED ?
   - comprenez-vous qu’aucune notification réelle n’est envoyée dans ce prototype ?

18. Sur la vérification du contact éditeur fictif :
   - comprenez-vous qu’un canal candidat n’autorise aucun outbound ?
   - comprenez-vous que le canal doit être vérifié avant de préparer la demande ?
   - comprenez-vous que REQUEST_READY signifie “prête à envoyer”, pas “envoyée” ?
   - voyez-vous clairement qu’aucune adresse réelle n’est utilisée dans la démo ?

19. Sur les notifications droits éditeurs fictives :
   - comprenez-vous qu’elles n’ont pas réellement été reçues ?
   - distinguez-vous APPROVED_WITH_LIMITS de LEGAL_REVIEW_REQUIRED ?
   - comprenez-vous que LEGAL_REVIEW_REQUIRED ne débloque aucun droit ?
   - comprenez-vous qu’email et push sont encore indisponibles ?

### Transport outbound / inbound éditeur

20. Sur le transport outbound fictif :
   - comprenez-vous que REQUEST_READY n’est pas envoyé ?
   - comprenez-vous que DELIVERED n’accorde aucun droit ?
   - comprenez-vous qu’un bounce ne déclenche jamais une adresse devinée ?

21. Sur la réception inbound fictive :
   - comprenez-vous que réception, corrélation, provenance et interprétation sont des étapes distinctes ?
   - comprenez-vous que SPF/DKIM/DMARC ne prouvent pas seuls l’autorité juridique ?
   - comprenez-vous que les pièces jointes restent en quarantaine avant traitement ?
   - comprenez-vous que READY_FOR_INTERPRETATION n’est toujours pas une autorisation ?

### Cycle de vie des droits

22. Dans le Rights Dashboard :
   - comprenez-vous qu’une autorisation expirée ou révoquée rebloque immédiatement ses usages dépendants ?
   - comprenez-vous que la baseline originale MODARYX peut rester disponible lorsqu’elle est juridiquement acceptable ?
   - comprenez-vous qu’une réactivation exige une nouvelle preuve et ne peut pas être silencieuse ?

### IP / takedown

23. Sur le cas IP de démonstration :
   - comprenez-vous qu’un signalement n’est pas automatiquement une décision juridique ?
   - comprenez-vous que l’asset contesté peut être restreint avec un fallback MODARYX sans suppression des preuves ?
   - comprenez-vous que `LEGAL_REVIEW_REQUIRED` bloque la restauration automatique ?

## 6. Tâches courtes recommandées

Le participant décrit ce qu'il ferait, même si les captures ne sont pas interactives :

- trouver un mod pour Aetherlands ;
- vérifier ses prérequis ;
- ouvrir ses Profils de jeu ;
- différencier une Collection d'un Modpack ;
- retrouver un créateur ;
- préparer un projet dans Creator Studio ;
- signaler un contenu ;
- retrouver les mêmes fonctions sur mobile.

## 7. Données à enregistrer

Pour chaque participant réel :
- identifiant anonymisé ;
- date ;
- appareil/taille approximative ;
- familiarité avec les mods : faible / moyenne / forte ;
- réponses brutes ;
- tâches comprises / hésitations ;
- termes incompris ;
- problème visuel observé ;
- problème mobile observé ;
- préférence visuelle éventuelle ;
- suggestion libre.

Ne pas enregistrer de donnée personnelle inutile.

## 8. Classification des findings

### P0
Empêche de comprendre ou d'accomplir la fonction principale.

### P1
Risque important d'erreur, de mauvaise décision ou de confusion.

### P2
Friction réelle mais contournable.

### P3
Polish / préférence / amélioration secondaire.

Aucun finding ne doit être ignoré uniquement parce que le prototype est “beau”.

## 9. Critères de fermeture

Le gate humain ne doit être déclaré fermé que lorsqu'il existe :
- de vraies réponses humaines archivées ;
- une synthèse des convergences/divergences ;
- les P0/P1 corrigés ou explicitement bloqués ;
- une décision sur les P2 importants ;
- une validation mobile humaine réelle ;
- aucune confusion critique nouvelle sur Mods & contenus / Collection / Modpack / Profil de jeu / Bibliothèque.

Le nombre exact de participants ne doit pas être inventé dans ce document. Une seule auto-évaluation de l'auteur ne vaut pas validation globale.

## 10. Relation avec la VF

Cette revue peut :
- débloquer le gel de microcopy ;
- débloquer la direction high-fi ;
- permettre la décision contrôlée du premier root V2.

Elle ne suffit pas seule à déclarer :
- VF ;
- production ready ;
- accessibilité complète ;
- sécurité complète ;
- performances production.

**État : pack prêt / validation humaine supplémentaire toujours PREUVE MANQUANTE.**


## Extension MODARYX IA — 4 octobre 2026

Preuve la plus fraîche du prototype :
- workflow : `MODARYX V2 Living Threshold Visual Proof`
- run : `37211271783` — **SUCCESS**
- commit capturé : `f8616f18876c49de45b3d208222be042dd2b543a`
- artifact : `11306731614`
- digest : `sha256:6cd590ef764afc4825cec9f199c504fbd57b6d7dd296a629fa311a1393495047`
- captures : **77**
- `KEYBOARD_REACHABLE 37 / 37`
- `FLOW_ASSERT modaryx ai preview no fake model or action`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Captures à inclure dans la revue humaine :
- `desktop-modaryx-ai.png`
- `mobile-modaryx-ai.png`

Questions ciblées :
- comprend-on immédiatement que MODARYX IA n’est pas encore active ?
- la distinction entre sources, permissions, outils et incertitude paraît-elle claire ?
- l’IA semble-t-elle intégrée à la famille MODARYX sans devenir le centre visuel du produit ?
- sur mobile, la hiérarchie reste-t-elle lisible et non envahissante ?

Cette surface reste un **preview d’intégration**, pas une IA réelle.


## Extension Publisher Inbound — 4 octobre 2026

Preuves :
- contrat inbound : run `37214242330` — **SUCCESS**, `PASS_V2_PUBLISHER_INBOUND_CONTRACT` ;
- micro-proof rendu : run `37214564614` — **SUCCESS**, `PUBLISHER_INBOUND_MOBILE_OVERFLOW 0`, `PASS_V2_PUBLISHER_INBOUND_PREVIEW` ;
- Living Threshold : run `37214829645` — **SUCCESS**, **81 captures**.

Captures :
- `desktop-rights-inbound-ready.png`
- `mobile-rights-inbound-ready.png`

À valider humainement :
- distinction réception / corrélation / provenance / interprétation ;
- compréhension de `READY_FOR_INTERPRETATION ≠ autorisation` ;
- compréhension de la quarantaine des pièces jointes ;
- lisibilité mobile de l’état final.

Le flux reste entièrement fictif : aucune mailbox, aucun webhook, aucun email entrant et aucune pièce jointe réelle.
