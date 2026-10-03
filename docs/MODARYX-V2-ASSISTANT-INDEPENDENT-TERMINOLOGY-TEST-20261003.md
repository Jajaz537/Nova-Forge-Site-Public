# MODARYX V2 — Test terminologique indépendant assistant — multi-profils

**Date : 2026-10-03**  
**Statut : TERMINÉ — simulation IA indépendante appuyée sur benchmark externe ; ne remplace pas un test humain**

## 1. Méthode

Objectif : tester les mêmes zones terminologiques que P01 avec plusieurs profils synthétiques dérivés des conventions observées sur :
- Nexus Mods ;
- CurseForge ;
- Modrinth ;
- Thunderstore ;
- Steam Workshop ;
- Bethesda Creations ;
- mod.io ;
- ModDB ;
- GameBanana.

Les réponses ci-dessous sont des **simulations IA**, pas des statistiques humaines.

Les résultats P01 ne sont pas utilisés comme données de notation ; ils seront comparés seulement après cette passe.

## 2. Profils synthétiques

### S1 — Débutant modding
Connaît surtout mod, installer, télécharger, favori.

### S2 — Joueur moddé expérimenté
Connaît versions, loaders, dépendances, profiles, modpacks.

### S3 — Créateur / moddeur
Pense projets, versions, fichiers, publication, support.

### S4 — Curateur / utilisateur de packs
Manipule collections, modpacks, listes, profils et managers.

### S5 — Joueur mobile peu technique
Privilégie termes directs et recherche globale.

### S6 — Joueur multi-plateformes / Workshop
Habitué à Steam Workshop, contenus communautaires, bibliothèques et abonnements.

## 3. Q1 — Profils de jeu vs Configurations de jeu

Scénario : retrouver un ensemble enregistré de mods et versions pour un jeu.

| Profil | Choix simulé | Motif |
|---|---|---|
| S1 | Configurations de jeu | plus descriptif sans connaissance du terme profile |
| S2 | Profils de jeu | convention des managers de mods |
| S3 | Profils de jeu | terme court, distingue plusieurs environnements |
| S4 | Profils de jeu | convention familière de manager |
| S5 | Configurations de jeu | plus explicite sur mobile |
| S6 | Profils de jeu | proche des presets/profiles connus |

### Lecture
Les deux termes restent plausibles. **Profils de jeu** gagne en convention modding/manager ; **Configurations de jeu** gagne en descriptivité novice.

### Recommandation simulée
**Profils de jeu** comme libellé court, avec microcopy descriptive :
**Configurations enregistrées de mods et versions**.

## 4. Q2 — Collection

Scénario : rubrique « Collection ».

| Profil | Compréhension simulée | Ambiguïté |
|---|---|---|
| S1 | sélection/liste organisée | faible |
| S2 | liste potentiellement installable | moyenne |
| S3 | sélection éditoriale | faible |
| S4 | ensemble pouvant être déployé via manager | forte |
| S5 | dossier/liste à partager | faible |
| S6 | ensemble d'items pouvant être souscrit/récupéré | moyenne |

### Lecture
Le mot **Collection** fonctionne comme idée d'ensemble organisé, mais **ne communique pas sa capacité d'installation**.

### Recommandation simulée
Conserver **Collection**, avec capacité visible :
- Sélection organisée
- Installation non disponible
- ou installation réelle si prouvée.

## 5. Q3 — Bibliothèque

Scénario : rubrique personnelle.

| Profil | Attente simulée |
|---|---|
| S1 | favoris + contenus sauvegardés |
| S2 | profils/modpacks/favoris |
| S3 | projets personnels ou contenus sauvegardés selon contexte |
| S4 | collections/profils/packs |
| S5 | mes éléments gardés |
| S6 | contenus abonnés/sauvegardés |

### Lecture
**Bibliothèque** est largement compréhensible comme espace personnel, mais ses sous-objets doivent être exposés immédiatement.

### Recommandation simulée
Conserver **Bibliothèque**.

## 6. Q4 — « Mods & Plugins » englobe-t-il tout ?

Types à couvrir : mods, plugins, addons, scripts, maps, shaders, presets, outils.

| Profil | Compréhension simulée |
|---|---|
| S1 | mods + plugins uniquement |
| S2 | probablement mods/plugins, pas forcément tools/maps |
| S3 | terme taxonomiquement incomplet |
| S4 | incomplet pour packs/tools/presets |
| S5 | littéral : seulement mods et plugins |
| S6 | incomplet par rapport à Workshop content/items |

### Lecture
**Mods & Plugins** n'est pas un parapluie sémantiquement robuste.

### Recommandation simulée
Le remplacer comme entrée générale.

## 7. Q5 — « Non vérifié »

| Profil | Interprétation simulée |
|---|---|
| S1 | peut-être dangereux |
| S2 | compatibilité ou fichier non testé |
| S3 | preuve/provenance absente |
| S4 | statut de validation incomplet |
| S5 | « le site ne sait pas si c'est sûr » |
| S6 | modération ou scan pas fini |

### Lecture
Le terme générique mélange sécurité, compatibilité, provenance, scan et modération.

### Recommandation simulée
Interdire **Non vérifié** seul. Qualifier :
- Compatibilité non vérifiée
- Provenance inconnue / non vérifiée
- Non analysé
- Conflit non évalué
- Modération en attente, si réel.

## 8. Q6 — Parapluie général de contenu

Candidats :
- A. **Contenus de jeu**
- B. **Mods & contenus**
- C. **Créations**

| Profil | Choix simulé | Motif |
|---|---|---|
| S1 | B — Mods & contenus | « Mods » donne immédiatement le contexte |
| S2 | B — Mods & contenus | large sans perdre l'ancrage modding |
| S3 | B — Mods & contenus | couvre les types sans collision avec Creator Studio |
| S4 | B — Mods & contenus | distingue mieux packs/collections du contenu de base |
| S5 | A — Contenus de jeu | très simple, mais plus vague |
| S6 | C — Créations | familier des écosystèmes Workshop/Creations |

### Lecture
Dans cette simulation, **Mods & contenus** est le meilleur compromis entre :
- reconnaissance immédiate du domaine ;
- largeur taxonomique ;
- faible collision avec Creator Studio.

**Contenus de jeu** est plus simple mais plus générique.
**Créations** est élégant et réel dans certains écosystèmes, mais entre en collision avec Créateurs / Créer dans MODARYX.

## 9. Résultat assistant

### Convergences simulées fortes
- Profils de jeu : défendable avec microcopy.
- Collection : bon concept, capacité d'installation explicite obligatoire.
- Bibliothèque : bon contenant personnel.
- Mods & Plugins : trop étroit.
- Non vérifié : trop ambigu.
- Mods & contenus : candidat parapluie le plus équilibré dans cette simulation.

## 10. Limite

Cette passe est une **simulation IA multi-profils**.  
Elle ne transforme aucun choix en preuve humaine globale.

La prochaine comparaison valide doit opposer :
1. P01 humain ;
2. cette simulation assistant ;
3. un test Work réellement indépendant qui n'a pas vu les résultats P01 ni ceux de ce document.
