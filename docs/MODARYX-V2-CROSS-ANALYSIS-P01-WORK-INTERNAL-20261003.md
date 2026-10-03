# MODARYX V2 — Analyse croisée P01 + Work + étude indépendante

**Date : 2026-10-03**  
**Statut : TERMINÉ — convergence analysée / validation humaine globale EN COURS**

## 1. Sources comparées

### A. P01 — humain réel
Document :
`docs/MODARYX-V2-HUMAN-MINI-TREE-TEST-P01-20261003.md`

Nature :
- 1 participant réel ;
- 5 questions critiques ;
- aucune généralisation autorisée.

### B. Work — étude indépendante
Source externe remise dans la conversation principale :
`Rapport indépendant — Architecture d’information et terminologie MODARYX V2`

Nature :
- recherche externe ;
- 5 profils simulés ;
- 80 simulations ;
- séparation explicite faits / inférences / simulations IA ;
- P01 non consulté.

### C. Étude indépendante conversation principale
Document :
`docs/MODARYX-V2-INDEPENDENT-UX-RESEARCH-TREE-SIMULATION-20261003.md`

Nature :
- recherche externe distincte ;
- 5 profils simulés ;
- 80 simulations ;
- ne remplace pas un test humain.

## 2. Convergences fortes

### 2.1 Contexte jeu d'abord
P01 cherche d'abord le jeu.  
Les deux études simulées montrent aussi que les profils débutants/mobile privilégient souvent le jeu ou la recherche avant une abstraction de bibliothèque.

Décision :
- garder le Game Hub comme pivot ;
- garder un accès transversal dans Bibliothèque ;
- ajouter un accès contextualisé vers les configurations personnelles depuis le jeu.

### 2.2 Collection est ambigu
P01 n'a pas produit spontanément le mot Collection.  
Les deux recherches externes détectent une collision avec Nexus/Steam, où une collection peut évoquer un ensemble récupérable/installable.

Décision :
- conserver l'objet domaine `Collection` ;
- afficher sa capacité réelle ;
- microcopy primaire : **Sélection organisée à partager** ;
- état explicite lorsqu'elle n'est pas installable ;
- réserver les actions d'installation aux objets/capacités réellement installables.

### 2.3 Profil de jeu entre en collision avec profil de compte
P01 ne trouve pas spontanément Bibliothèque → Profils de jeu.  
L'étude interne et Work détectent la même ambiguïté chez les profils peu techniques.

Décision provisoire :
- libellé utilisateur primaire : **Configurations de jeu** ;
- microcopy : **Mods et versions actifs enregistrés** ;
- `Profile/Loadout` reste le terme domaine/interne ;
- **Profils de jeu** devient terme secondaire/historique uniquement si nécessaire.

Cette décision reste À REVALIDER humainement avant microcopy high-fi finale.

### 2.4 Compatibilité, prérequis et conflits doivent être proactifs
P01 attend explicitement une alerte automatique.  
Les deux études convergent avec les conventions de plateformes actuelles.

Décision :
- résumé décisionnel avant action ;
- séparer visuellement :
  - compatibilité avec la configuration ;
  - éléments nécessaires ;
  - conflits connus avec d'autres contenus ;
- la page de détail conserve la section complète.

### 2.5 Catalogue et distribution doivent rester séparés
P01 comprend correctement **Catalogue consultable** comme consultation.  
Work montre qu'une partie des profils simulés peut tout de même associer `disponible` à téléchargement/installation.

Décision :
- ne plus utiliser **Catalogue disponible** seul côté utilisateur ;
- formulation par défaut : **Catalogue consultable — téléchargement non garanti** ;
- **Téléchargement disponible** seulement si un fichier réel est distribuable ;
- **Installation via manager disponible** seulement si la capacité réelle est connectée.

### 2.6 Version et fichier
Les deux études simulées convergent :
- les utilisateurs avancés distinguent Version/Release/File ;
- les débutants parlent souvent de « télécharger la version ».

Décision :
- UI grand public : **Versions** ;
- dans une version : **Fichiers de cette version** ;
- si un seul fichier évident : CTA **Télécharger cette version** ;
- qualifier les dimensions : Version du jeu / Version du mod / Version du modpack.

### 2.7 Recherche globale et recherche contextualisée
Convergence forte :
- recherche globale pour créateur/multi-type ;
- recherche dans le jeu pour préserver jeu/version.

Décision :
- libellés visibles :
  - **Rechercher dans ce jeu**
  - **Rechercher partout sur MODARYX**

## 3. Décisions conservées

- Favori reste un marque-page léger.
- Modpack reste l'ensemble versionné/installable.
- Support et Signalement restent distincts.
- Creator Studio sépare Project et Release.
- Mods & Plugins reste l'entrée courte, avec taxonomie complète en microcopy/filtres.
- Bibliothèque reste un contenant personnel, mais ses sous-objets doivent être immédiatement visibles.

## 4. Points encore À TESTER humainement

Priorité haute :
1. **Configurations de jeu** vs **Profils de jeu** ;
2. microcopy **Collection / Sélection organisée** ;
3. compréhension de Bibliothèque ;
4. portée de **Mods & Plugins** pour addons/scripts/outils ;
5. compréhension de **Non vérifié** selon sa dimension ;
6. Support vs Bugs/Issues sur cas limites ;
7. Créateur vs Équipe comme filtres de recherche.

## 5. Conséquence High-Fi

L'architecture générale est suffisamment cohérente pour poursuivre :
- direction artistique exploratoire ;
- design system préparatoire ;
- prototypes comparatifs réversibles.

Mais il reste interdit de déclarer :
- microcopy finale validée ;
- high-fi humainement validé ;
- VF.

Avant gel high-fi final, les libellés critiques ci-dessus doivent recevoir une validation humaine supplémentaire.

## 6. État

- P01 humain : **TERMINÉ**
- étude indépendante interne 5×16 : **TERMINÉ**
- étude Work 5×16 : **TERMINÉ**
- convergence croisée : **TERMINÉ**
- validation humaine globale : **EN COURS**
- high-fi final : **BLOQUÉ**
