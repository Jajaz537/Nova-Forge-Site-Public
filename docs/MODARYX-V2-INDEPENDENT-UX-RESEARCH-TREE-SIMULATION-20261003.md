# MODARYX V2 — Recherche UX indépendante + simulation tree test

**Date : 2026-10-03**  
**Statut : TERMINÉ — recherche externe + simulation IA, ne remplace pas une validation humaine**

## 1. But

Réaliser une passe indépendante de la simulation experte précédente et de ChatGPT Work.

Cette passe sépare explicitement :
- faits issus de sources actuelles ;
- inférences UX ;
- simulations IA.

Aucune statistique humaine n'est inventée.

## 2. Sources externes étudiées

### Nexus Mods
Constats utiles :
- une Collection Nexus est une liste de mods gérée par un curateur ;
- les Collections peuvent être installées automatiquement via Vortex ;
- le produit emploie clairement les notions d'auteur, curateur, collection et mods inclus ;
- des contrôles de compatibilité jeu/version peuvent apparaître avant installation via des outils de l'écosystème.

Sources :
- Nexus Mods Site Help — Guidelines for Collections
- Nexus Mods — Collections
- Nexus Mods — MO2 Collection Installer

### CurseForge
Constats utiles :
- les profils correspondent à des instances/configurations moddés avec paramètres, fichiers, modloader et mods ;
- l'installation d'un mod peut proposer un nouveau profil ou un profil existant ;
- les profils incompatibles sont explicitement signalés avec la raison : version de jeu, modloader ou les deux ;
- le produit distingue mod, modpack/profile, game version, modloader et files/versions.

Sources :
- CurseForge Support — Creating a Custom Profile/Modpack
- CurseForge Support — Installing Minecraft Mods and Modpacks
- CurseForge Support — Minecraft Getting Started
- CurseForge Support — Customizing Modpacks

### Modrinth
Constats utiles :
- les dépendances sont attachées aux versions ;
- les types de dépendances incluent required, optional, incompatible et embedded ;
- versions, game versions, loaders et fichiers sont des objets distincts au niveau du contrat.

Sources :
- Modrinth Documentation — List project's versions
- Modrinth Documentation — Get all of a project's dependencies
- Modrinth Documentation — Create a version

### Thunderstore
Constats utiles :
- les pages de packages exposent explicitement version, catégories, dépendances et « Required mods » ;
- les modpacks sont présentés comme packages distincts contenant de nombreux mods ;
- l'écosystème emploie également la notion de profils dans certains managers.

Sources :
- Thunderstore — modpack dependencies pages
- Thunderstore — ecosystem manager/package pages

### Communautés
Signaux anecdotiques, non statistiques :
- des utilisateurs expérimentés peuvent malgré tout trouver la combinaison version de jeu / loader / mod déroutante ;
- le mot « profile » peut nécessiter une explication pour les débutants ;
- des joueurs distinguent fortement mod individuel et modpack, et certains préfèrent les packs comme expérience prête à l'emploi.

Sources :
- Reddit r/feedthebeast — discussions 2024–2025 sur profiles, loaders, mods et modpacks

## 3. Profils simulés

### P-A — Débutant modding
- connaît « mod » et « télécharger » ;
- comprend mal loaders, profiles, dependencies ;
- cherche d'abord par jeu.

### P-B — Joueur expérimenté multi-jeux
- connaît versions, dépendances, conflits ;
- utilise recherche et filtres ;
- comprend modpacks et gestionnaires.

### P-C — Créateur/moddeur
- pense projet → version/release → fichier ;
- connaît compatibilité, dépendances, publication et support.

### P-D — Curateur / utilisateur de packs
- pense listes, collections, modpacks, profils et partage ;
- connaît les différences d'installation selon les plateformes.

### P-E — Mobile peu technique
- privilégie recherche, jeu courant et actions explicites ;
- évite le jargon ;
- attend des avertissements automatiques.

## 4. 80 simulations brutes

Notation :
- D = direct simulé
- I = indirect simulé
- A = ambiguïté simulée
- E = échec simulé plausible

### T1 — Installer un plugin pour un jeu précis

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Jeux | Jeux → jeu → Mods & Plugins | D | faible |
| P-B | Recherche ou Jeux | filtre jeu → plugin | D | faible |
| P-C | Jeux | hub jeu → plugin | D | faible |
| P-D | Jeux | hub jeu → contenus | D | faible |
| P-E | Recherche | recherche du jeu puis plugin | I | recherche globale vs contextualisée |

### T2 — Vérifier compatibilité avec version 1.21.1

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | page du mod | cherche un badge compatible | I | terme « compatibilité » compris, dimensions moins claires |
| P-B | fiche | Compatibilité et prérequis | D | faible |
| P-C | fiche/version | version → compatibilité | D | faible |
| P-D | fiche | contexte jeu/version | D | faible |
| P-E | page du mod | attend avertissement visible | I | ne cherchera pas un onglet profond |

### T3 — Savoir quoi installer en plus

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | page du mod | cherche « requis/prérequis » | I | « dépendances » plus technique |
| P-B | fiche | Compatibilité et prérequis → Requis | D | faible |
| P-C | fiche/version | dépendances de version | D | faible |
| P-D | fiche | prérequis avant installation | D | faible |
| P-E | bouton installer | attend message avant action | I | risque si info seulement en onglet |

### T4 — Vérifier les conflits

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | page du mod | cherche avertissement | I | « conflit » compris si expliqué |
| P-B | fiche | Compatibilité et prérequis → Incompatible | D | faible |
| P-C | fiche/version | relations incompatibles | D | faible |
| P-D | profil/modpack | vérifie résolution avant install | D | contexte profil vs fiche |
| P-E | action installer | attend blocage/alerte | I | faible si proactif |

### T5 — Retrouver un mod plus tard

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Favori | bouton Favori | D | faible |
| P-B | Favori | Favoris/Bibliothèque | D | faible |
| P-C | Favori | bouton Favori | D | faible |
| P-D | Favori ou Collection | Favori si personnel | I | Collection possible si classement |
| P-E | Favori | cœur / Ajouter plus tard | D | libellé secondaire utile |

### T6 — Sélection thématique à organiser/partager

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | liste/dossier | cherche « Collection » après explication | A | mot Collection non garanti |
| P-B | Collection | Collections → créer | D | influence Nexus possible |
| P-C | Collection | créer collection | D | faible |
| P-D | Collection | collection/curation | D | peut s'attendre à installabilité |
| P-E | Favoris ou liste | cherche partager une liste | A | Collection trop abstrait seul |

### T7 — Sauvegarder mods + versions actifs d'une configuration

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | jeu/mods installés | cherche configuration du jeu | A | « Profil » peu naturel |
| P-B | Profil | Bibliothèque → Profils de jeu | D | faible |
| P-C | Profil | profil/instance | D | faible |
| P-D | Profil | profil/loadout | D | faible |
| P-E | jeu | cherche Mes mods / configuration | A | Bibliothèque peu spontanée |

### T8 — Installer un ensemble versionné préparé

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Modpack | Modpacks | D | terme connu dans Minecraft surtout |
| P-B | Modpack | Modpacks → installer | D | faible |
| P-C | Modpack | modpack/version | D | faible |
| P-D | Modpack | modpack → version | D | faible |
| P-E | Pack de mods | recherche pack | I | vocabulaire à expliquer hors Minecraft |

### T9 — Revenir à la version 1.4

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | page du mod | Versions | D | faible |
| P-B | fiche | Versions → 1.4 | D | faible |
| P-C | fiche | historique/releases | D | « release » interne |
| P-D | fiche | version 1.4 | D | faible |
| P-E | page | Voir anciennes versions | D | libellé explicite utile |

### T10 — Récupérer le fichier de la version 1.4

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | version 1.4 | bouton Télécharger | I | version/fichier confondus conceptuellement |
| P-B | version 1.4 | Fichiers de cette version | D | faible |
| P-C | release | artefacts/files | D | faible |
| P-D | version | fichier associé | D | faible |
| P-E | version | Télécharger cette version | I | « Fichier » pas nécessairement recherché |

### T11 — Retrouver toutes les créations d'un créateur

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Recherche | nom → profil créateur | D | faible |
| P-B | Recherche | créateur | D | faible |
| P-C | Créateurs | profil | D | faible |
| P-D | Créateurs | profil | D | faible |
| P-E | Recherche | nom | D | faible |

### T12 — Publier une nouvelle version d'un projet

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Créer | hésite entre projet et fichier | A | tâche créateur hors expertise |
| P-B | Créer | Creator Studio → projet | D | faible |
| P-C | Creator Studio | Project → Releases | D | faible |
| P-D | Créer | projet → nouvelle version | D | faible |
| P-E | Créer | cherche « publier une mise à jour » | I | jargon release |

### T13 — Demander de l'aide pour un mod qui ne marche pas

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Support | fiche → aide/support | D | faible |
| P-B | Support/Issues | fiche | D | faible |
| P-C | Issues | bug/support | D | choix selon nature |
| P-D | Support | fiche/collection si composition | D | ownership du support |
| P-E | Aide | fiche → Support | D | « Issues » trop technique |

### T14 — Signaler un contenu risqué ou hors règles

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Signaler | menu fiche | D | faible |
| P-B | Signaler | fiche → signalement | D | faible |
| P-C | Signaler | fiche | D | faible |
| P-D | Signaler | fiche | D | faible |
| P-E | menu ⋯ | Signaler | D | doit rester visible |

### T15 — Comprendre « Catalogue disponible »

| Profil | Premier choix mental | Interprétation simulée | État | Ambiguïté |
|---|---|---|---|---|
| P-A | voir contenus | peut supposer téléchargement si bouton proche | A | élevé sans microcopy |
| P-B | catalogue | consultation, distribution séparée | D | faible |
| P-C | catalogue | indexation/discovery | D | faible |
| P-D | catalogue | peut associer à installabilité selon Nexus | A | influence écosystème |
| P-E | catalogue | « je peux voir », pas forcément télécharger | I | microcopy utile |

### T16 — Retrouver jeu + collection + créateur depuis un seul endroit

| Profil | Premier choix | Chemin simulé | État | Ambiguïté |
|---|---|---|---|---|
| P-A | Recherche | recherche globale | D | faible |
| P-B | Recherche | globale, filtres par type | D | faible |
| P-C | Recherche | globale | D | faible |
| P-D | Recherche | globale | D | faible |
| P-E | icône recherche | globale | D | faible |

## 5. Convergences fortes de cette simulation

### 5.1 Le contexte jeu est un point d'entrée majeur
Les profils débutant et mobile tendent à commencer par le jeu plutôt que par une abstraction comme Bibliothèque.

### 5.2 Compatibilité, dépendances et conflits doivent remonter avant l'action
Les patterns de CurseForge et de l'écosystème Nexus montrent des avertissements de compatibilité/version avant installation ou lors du choix du profil.

### 5.3 « Profil » est un terme de domaine utile mais pas auto-explicatif
CurseForge l'emploie pour une instance modée concrète, mais les signaux communautaires montrent que le terme peut déconcerter les débutants.

### 5.4 Modpack est plus naturellement compris comme ensemble installable
La séparation Mod individuel / Modpack est forte dans les écosystèmes étudiés.

### 5.5 Version et fichier sont distincts dans les modèles techniques, mais pas toujours mentalement
Pour un débutant, « télécharger la version 1.4 » peut suffire sans penser à l'objet « File ».

### 5.6 Recherche globale multi-type est naturelle
Tous les profils simulés convergent vers la recherche pour une requête mélangeant jeux, créateurs et collections.

## 6. Risque majeur découvert — « Collection »

Dans Nexus Mods, une Collection est non seulement une liste curatoriale de mods, mais elle peut aussi être installée automatiquement via Vortex.

Conséquence pour MODARYX :
- notre définition « Collection = éditoriale, pas automatiquement installable » est cohérente en interne ;
- mais elle entre en collision avec un modèle mental possible importé de Nexus ;
- une simple microcopy peut ne pas suffire pour les utilisateurs habitués à Nexus.

### Recommandation
Conserver l'objet Collection seulement si l'UI rend immédiatement visible :
- **Sélection organisée à partager**
- **Pas nécessairement installable**

Et réserver l'action « Installer » aux Modpacks/profils/manifeste réellement installables.

## 7. Autres recommandations issues de la recherche

### Profils de jeu
Prévoir deux entrées vers le même objet :
- Bibliothèque → Profils de jeu
- Game Hub → Mes profils pour ce jeu

### Compatibilité et prérequis
Conserver ce libellé utilisateur.
Dans la fiche et avant action, afficher proactivement :
- version de jeu ;
- loader ;
- dépendances obligatoires ;
- incompatibilités ;
- conflit majeur.

### Release
Préférer **Versions** dans l'UI grand public.
Garder Release comme terme interne/créateur lorsque pertinent.

### Files
Dans l'UI :
**Fichiers de cette version**
ou bouton contextuel **Télécharger cette version** lorsque l'utilisateur n'a pas besoin de choisir entre plusieurs fichiers.

### Support
Préférer **Support / Aide** côté joueur.
Réserver « Issues » à des surfaces créateur/techniques si utile.

### Mods & Plugins
Le libellé reste clair mais ne doit pas masquer les autres types.
Toujours exposer types/filtres propres au jeu.

## 8. État de preuve

- Recherche externe : **TERMINÉE pour cette passe**
- 5 profils simulés : **TERMINÉ**
- 80 tâches simulées : **TERMINÉ**
- Statistiques humaines : **AUCUNE INVENTÉE**
- Validation humaine : **NON REMPLACÉE**
- Comparaison avec P01 : à faire séparément après cette passe pour préserver l'indépendance
- Comparaison avec Work : à faire lorsqu'il rend son rapport

## 9. Décision

Cette étude renforce plusieurs choix MODARYX, mais elle révèle un risque réel de modèle mental sur **Collection** et confirme que les parcours **jeu d'abord** doivent rester forts.

Aucune modification de production ni de frontend V2 n'est autorisée par ce document.
