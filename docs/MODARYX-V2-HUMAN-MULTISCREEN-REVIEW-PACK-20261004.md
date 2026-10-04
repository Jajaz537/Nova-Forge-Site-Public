# MODARYX V2 — Pack de validation humaine multi-écrans

**Date : 2026-10-04**  
**Statut : PRÊT À UTILISER — aucune validation humaine inventée**

## 1. But

Fermer rapidement et proprement les derniers blockers humains du prototype Living Threshold sans demander aux participants de parcourir 69 captures au hasard.

Ce pack ne remplace pas :
- un screen reader réel ;
- un appareil physique ;
- une comparaison normalisée à une référence visuelle approuvée ;
- un backend réel ;
- la QA production.

## 2. Preuve visuelle disponible

Run de capture étendu :
- workflow : `MODARYX V2 Living Threshold Visual Proof`
- run : `37161856917` — **SUCCESS**
- artifact : `11288036698`
- captures : **39**
- desktop + mobile
- offline/error/retry inclus dans la preuve produit associée.

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
