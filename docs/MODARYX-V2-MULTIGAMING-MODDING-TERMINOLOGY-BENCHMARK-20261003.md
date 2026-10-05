# MODARYX V2 — Benchmark terminologique multi-gaming / gaming / modding

**Date : 2026-10-03**  
**Statut : TERMINÉ — recherche externe ; décisions utilisateur finales non figées**

## 1. Objectif

Rejouer les cinq points du mini-test humain P01 à la lumière des conventions de grands écosystèmes actuels :
- Nexus Mods ;
- CurseForge ;
- Modrinth ;
- Thunderstore ;
- Steam Workshop ;
- Bethesda Creations ;
- mod.io ;
- ModDB ;
- GameBanana.

Cette étude distingue :
- vocabulaire réellement observé ;
- inférences produit MODARYX ;
- décisions encore à tester humainement.

## 2. Matrice de vocabulaire observé

| Écosystème | Parapluie de contenu | Espace personnel | Ensemble / liste | Configuration installée | Confiance / statut |
|---|---|---|---|---|---|
| Nexus Mods | Mods | My Stuff / Download history | Collections | Vortex profiles côté manager | badges de scan par fichier, états précis |
| CurseForge | Content + types précis | My Modpacks / profiles | Modpacks | Profiles / custom profiles | modération + checks techniques, incompatibilités expliquées |
| Modrinth | Project types : mod, modpack, resourcepack, shader | instances/app | Modpacks | modded instance | relations/dépendances typées |
| Thunderstore | Packages / mods | profiles dans manager | Modpacks | Profiles | dépendances et catégories |
| Steam Workshop | Workshop content / items | Your Items / subscriptions | Collections | subscription lists / presets | compatibilité/dépendances exposées selon jeu |
| Bethesda | Creations / Mods | Library | bibliothèque / favoris | load order, installed creations | avertissements et exigences spécifiques |
| mod.io | UGC comme concept technique, nom utilisateur configurable | subscriptions | dépend du jeu | subscriptions installées | approbation/curation configurable |
| ModDB | Mods / Addons / Files / Tools séparés | comptes/follows historiques | pas de parapluie unique | hors cœur produit | types/catégories séparés |
| GameBanana | Sections avec Mods, Scripts, Sounds, Tools, etc. | compte/favoris | selon section | hors cœur produit | règles/modération par type |

## 3. Test Q1 — Profils de jeu vs Configurations de jeu

### Observations externes

- CurseForge utilise explicitement **Profile** pour une instance modée comprenant paramètres, fichiers, modloader, configs et mods.
- Thunderstore distingue également **Profiles** et **Modpacks**.
- Modrinth parle plutôt d'**instance**.
- Steam préfère listes/presets de souscriptions selon contexte.

### Lecture MODARYX

Le terme **Profil** est une convention réelle dans plusieurs managers de mods, mais il peut entrer en collision avec le profil de compte.

### Décision de travail

Conserver **Profils de jeu** comme libellé utilisateur provisoire préféré :
- cohérent avec P01 ;
- cohérent avec CurseForge/Thunderstore ;
- toujours accompagné d'une microcopy descriptive ;
- accès direct depuis le Game Hub pour réduire la confusion.

Microcopy :
**Configurations enregistrées de mods et versions**

## 4. Test Q2 — Collection

### Observations externes

- Nexus : Collection = liste de références de mods, installable automatiquement via Vortex.
- Steam Workshop : Collection = ensemble d'items, avec possibilité de Subscribe to all / synchroniser une liste.
- MODARYX veut préserver une Collection comme objet éditorial distinct d'un Modpack.

### Lecture MODARYX

Le mot **Collection** est une convention solide et largement compréhensible pour « ensemble organisé », mais le nom seul ne dit pas si l'ensemble est installable.

### Décision de travail

Conserver **Collection**.

Toujours afficher la capacité :
- **Sélection organisée**
- **Installation non disponible**
- ou une capacité réelle d'installation lorsqu'elle existe.

## 5. Test Q3 — Bibliothèque

### Observations externes

- Bethesda emploie explicitement **Library / Ajouter à la bibliothèque** pour des Creations/Mods.
- Steam utilise **Your Items**, favoris et abonnements.
- Nexus utilise **My Stuff** et Download history.

### Lecture MODARYX

**Bibliothèque** est cohérent avec les conventions gaming pour un espace personnel de contenus conservés, même si toutes les plateformes n'emploient pas le même mot.

### Décision de travail

Conserver **Bibliothèque**, avec ses sous-objets visibles :
- Favoris
- Suivis
- Collections
- Modpacks
- Profils de jeu
- Recherches sauvegardées

## 6. Test Q4 — « Mods & Plugins » comme parapluie

### Observations externes

Aucun des grands écosystèmes étudiés ne fournit une preuve solide que **Mods & Plugins** est un parapluie naturel pour toutes les catégories.

Patterns observés :
- Steam : **Workshop content / items**
- CurseForge : **Content**, puis types précis
- mod.io : **UGC** techniquement, avec nom utilisateur configurable
- Bethesda : **Creations**
- ModDB : sépare **Mods / Addons / Files / Tools**
- GameBanana : sépare les **Sections**
- Modrinth : types explicites plutôt qu'un seul parapluie

### Conclusion

La réponse P01 « Mods & Plugins = seulement mods et plugins » est cohérente avec le paysage externe.

**Mods & Plugins n'est plus considéré comme libellé parapluie final.**

### Shortlist à tester humainement

#### A. Contenus de jeu
Avantages :
- très large ;
- compréhensible ;
- compatible avec maps, scripts, outils, shaders, presets, plugins, mods ;
- proche du vocabulaire « content » de Steam/CurseForge/mod.io.

Risque :
- peut sembler trop générique.

#### B. Mods & contenus
Avantages :
- conserve le mot « Mods », immédiatement reconnaissable ;
- ouvre explicitement au-delà des mods.

Risque :
- légère redondance car un mod est déjà un contenu.

#### C. Créations
Avantages :
- large ;
- humain ;
- convention Bethesda réelle ;
- valorise les auteurs.

Risque :
- collision possible avec **Créer / Creator Studio / Créateurs** dans MODARYX.

#### D. Contenus communautaires
Avantages :
- explicite sur la provenance communautaire ;
- large.

Risque :
- long ;
- ne convient pas toujours aux contenus officiels, partenaires ou outils techniques.

### Candidats prioritaires à tester

1. **Contenus de jeu**
2. **Mods & contenus**
3. **Créations**

Aucun gagnant final n'est déclaré sans nouveau test humain.

## 7. Test Q5 — « Non vérifié »

### Observations externes

- Nexus affiche des statuts spécifiques au **fichier** et à son **scan**, avec distinction entre checks internes et VirusTotal.
- CurseForge distingue modération, approbation et checks techniques.
- Les plateformes sérieuses qualifient généralement **ce qui** est ou n'est pas vérifié.

### Conclusion

Le badge générique **Non vérifié** est trop ambigu et ne doit pas être utilisé.

Toujours qualifier la dimension :
- **Compatibilité non vérifiée**
- **Provenance inconnue**
- **Provenance non vérifiée**
- **Non analysé** pour un scan absent
- **Conflit non évalué** si applicable
- un risque réel est nommé explicitement, jamais déduit d'un manque de vérification.

## 8. Résultat croisé avec P01

| Point | P01 | Benchmark externe | État MODARYX |
|---|---|---|---|
| Profils de jeu | préféré | convention réelle CurseForge/Thunderstore | conserver provisoirement |
| Collection | comprise comme sélection | convention forte mais installabilité variable | conserver + capacité explicite |
| Bibliothèque | comprise comme espace personnel | convention gaming réelle | conserver |
| Mods & Plugins | trop étroit | aucune convention forte comme parapluie universel | À REMPLACER / À TESTER |
| Non vérifié | ambigu A+B+C | plateformes qualifient les dimensions | générique ÉCARTÉ |

## 9. Prochaine preuve utile

Faire un mini-test humain comparatif uniquement sur les trois candidats parapluie :
- **Contenus de jeu**
- **Mods & contenus**
- **Créations**

Puis retenir ou rejeter sur compréhension immédiate, largeur perçue et risque de confusion avec Creator Studio.

## 10. Limites

- cette étude ne remplace pas un test humain ;
- les plateformes utilisent des contextes produit différents ;
- certains termes sont techniques ou propres à un manager ;
- MODARYX doit rester cohérent avec sa propre architecture et son identité.

**État : benchmark terminologique externe TERMINÉ ; libellé parapluie final EN COURS.**
