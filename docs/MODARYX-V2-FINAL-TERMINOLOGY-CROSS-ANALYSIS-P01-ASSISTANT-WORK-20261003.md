# MODARYX V2 — Analyse croisée finale terminologie : P01 + Assistant + Work

**Date : 2026-10-03**  
**Statut : TERMINÉ — comparaison croisée / validation humaine globale EN COURS**

## 1. Sources

### P01 — humain réel
- mini-test terminologique ;
- mini-test parapluie ;
- un seul participant réel, aucune généralisation statistique.

### Assistant — simulation indépendante
Document :
`docs/MODARYX-V2-ASSISTANT-INDEPENDENT-TERMINOLOGY-TEST-20261003.md`

Nature :
- 6 profils synthétiques ;
- 36 réponses ;
- appui sur benchmark externe ;
- aucune statistique humaine.

### Work — simulation indépendante
Rapport reçu :
**Rapport indépendant — Test terminologique MODARYX V2**

SHA-256 du fichier reçu :
`77ed079ac6168f8577b8ac2d00ed31c399df9b171e6dafa64ae5b027573e28a0`

Work déclare :
- 9 écosystèmes étudiés ;
- 6 profils synthétiques ;
- 36 réponses ;
- résultats P01 non consultés ;
- test assistant non consulté ;
- aucune modification produit/configuration.

## 2. Résultats croisés

### 2.1 Profils de jeu vs Configurations de jeu

P01 humain :
- préfère **Profils de jeu**.

Assistant :
- simulation plutôt favorable à **Profils de jeu** chez les profils managers/avancés ;
- **Configurations de jeu** plus explicite pour novices/mobile.

Work :
- recommande **Configurations de jeu** comme terme plus auto-explicatif pour le grand public ;
- reconnaît que **Profils de jeu** est conventionnel chez CurseForge/Thunderstore.

### Décision de travail

Ne pas déclarer de gagnant global.

Conserver provisoirement :
- **Profils de jeu** comme libellé UI principal actuel, parce que c'est la seule préférence humaine réelle obtenue ;
- microcopy : **Configurations enregistrées de mods et versions** ;
- **Configurations de jeu** reste l'alternative principale à retester auprès d'autres humains.

Le vrai problème reste la collision entre profil de compte et profil de jeu, plus la trouvabilité depuis Bibliothèque.

**État : EN COURS — revalidation humaine supplémentaire requise avant gel final.**

### 2.2 Collection

P01 :
- comprend Collection comme sélection organisée à partager.

Assistant :
- Collection compris comme ensemble organisé, avec risque d'attente d'installation chez les profils expérimentés.

Work :
- même collision : Nexus, mod.io et Workshop peuvent enseigner qu'une Collection est installable ou abonnable.

### Décision

Conserver **Collection**.

Toujours afficher la capacité réelle :
- Sélection organisée ;
- Installation non disponible ;
- Suivable / partageable ;
- Installable uniquement si capacité réelle prouvée.

**État : TERMINÉ — principe / wording à consolider humainement.**

### 2.3 Bibliothèque

P01 :
- comprend Bibliothèque comme espace personnel.

Assistant :
- convergence forte vers espace personnel.

Work :
- terme viable, mais un profil mobile peut le prendre pour le catalogue général ;
- recommande de rendre son contenu visible.

### Décision

Conserver **Bibliothèque**.

Sous-objets immédiatement visibles :
- Favoris ;
- Suivis ;
- Collections ;
- Modpacks ;
- Profils de jeu ;
- Recherches sauvegardées.

Microcopy candidate :
**Vos favoris, suivis, collections, modpacks et profils enregistrés.**

**État : TERMINÉ — conception / validation globale EN COURS.**

### 2.4 Mods & Plugins

P01 :
- l'interprète littéralement comme mods + plugins.

Assistant :
- 6/6 profils synthétiques considèrent le terme incomplet ou dépendant d'une microcopy.

Work :
- aucun profil ne le juge universellement explicite sans réserve ;
- maps, shaders, presets et outils sont mal couverts mentalement.

### Décision

**Mods & Plugins n'est plus le parapluie UI primaire.**

Il peut survivre comme catégorie ou raccourci contextualisé dans certains jeux, mais pas comme entrée universelle de MODARYX.

**État : TERMINÉ — abandon comme parapluie global.**

### 2.5 Non vérifié

P01 :
- comprend simultanément danger potentiel, non testé et provenance inconnue.

Assistant :
- même mélange : sécurité, compatibilité, provenance, scan, modération.

Work :
- même divergence entre danger, absence de test, provenance et modération.

### Décision

Interdiction du badge générique **Non vérifié**.

Toujours qualifier :
- Compatibilité non testée / non vérifiée ;
- Provenance inconnue ;
- Fichier non analysé ;
- En attente de modération ;
- Conflit non évalué ;
- auteur ou programme vérifié uniquement si preuve réelle et dimension explicite.

**État : TERMINÉ — principe.**

### 2.6 Parapluie global de contenu

P01 :
- choisit **Mods & contenus**.

Assistant :
- **Mods & contenus** ressort comme compromis le plus équilibré ;
- Contenus de jeu plus générique ;
- Créations plus éditorial et collision possible avec Créer/Créateurs.

Work :
- **Mods & contenus** ressort également comme favori provisoire des simulations ;
- recommande encore un test humain plus large.

### Décision

**Mods & contenus** devient le libellé parapluie UI provisoire principal.

Taxonomie visible selon jeu :
- Mods
- Plugins
- Addons
- Scripts
- Maps
- Shaders
- Presets
- Outils
- autres types pertinents.

**État : EN COURS — préférence humaine P01 + convergence des deux simulations indépendantes ; validation humaine globale toujours incomplète.**

## 3. Convergences fortes à intégrer

1. **Mods & contenus** = parapluie provisoire principal.
2. **Mods & Plugins** = ne plus utiliser comme parapluie universel.
3. **Collection** = conserver, capacité réelle explicite.
4. **Bibliothèque** = conserver comme espace personnel, contenu annoncé.
5. **Non vérifié** = interdit seul.
6. **Profils de jeu / Configurations de jeu** = seul vrai arbitrage terminologique encore ouvert.

## 4. Prochain test humain utile

Ne pas refaire les six questions entières.

Tester seulement :
1. **Profils de jeu** vs **Configurations de jeu** ;
2. compréhension de **Mods & contenus** sans liste d'exemples ;
3. compréhension de **Votre bibliothèque** avec et sans microcopy.

Échantillon idéal : au moins un utilisateur novice et un utilisateur habitué aux managers de mods.

## 5. Limite de preuve

- P01 = 1 humain réel.
- Assistant = simulations IA.
- Work = simulations IA.
- aucune simulation ne devient une statistique humaine ;
- aucune VF/high-fi finale n'est validée par ce document.
