# MODARYX V2 — Parcours critiques et plan de validation IA

**Date : 2026-10-03**  
**Statut : EN COURS — conception, aucune implémentation production**

## 1. Flow A — Découverte → installation

1. Accueil : recherche globale ou reprise d'un jeu.
2. Hub jeu : contexte du jeu et version choisie.
3. Catalogue : filtres, tri, aperçu rapide.
4. Fiche contenu : compatibilité, provenance, état.
5. Requirements : dépendances, conflits, DLC/loaders.
6. Action : installer via manager si disponible, téléchargement manuel si autorisé, ou ajout à une collection/profil.

### Critères de compréhension

- l'utilisateur sait immédiatement pour quel jeu il consulte le contenu ;
- la compatibilité est visible avant l'action ;
- les dépendances obligatoires ne sont jamais cachées ;
- un état non vérifié n'est jamais présenté comme compatible ;
- l'installation automatisée n'est proposée que si un manager réellement connecté la supporte.

## 2. Flow B — Créateur → publication

1. Creator Studio.
2. Création du projet.
3. Métadonnées : jeu, type, titre, description.
4. Compatibilité : versions, loaders/frameworks, plateformes.
5. Fichiers/release.
6. Droits/licence/redistribution.
7. Provenance/hash/contrôles.
8. Preview.
9. Soumission/publication.
10. Statut, support, maintenance et versions suivantes.

### Critères

- aucune donnée obligatoire ne peut être silencieusement inventée ;
- droits et redistribution sont explicites ;
- un échec de validation conserve le brouillon ;
- modération et publication restent des états séparés ;
- la nouvelle version ne remplace pas silencieusement l'historique.

## 3. Flow C — Collection → profil stable

1. Ouvrir/créer une collection.
2. Ajouter des contenus.
3. Résoudre les dépendances requises.
4. Exposer les conflits/incompatibilités.
5. Choisir/verrouiller les versions.
6. Transformer en profil/loadout si souhaité.
7. Installer via manager seulement si connecté et autorisé.

### Critères

- favoris, collections, modpacks et profils restent distincts ;
- les conflits ne sont jamais résolus silencieusement par substitution ;
- les versions de contenus sont traçables ;
- un contenu withdrawn/revoked ne doit pas être redistribué comme si de rien n'était.

## 4. Tree testing minimal

Les participants doivent pouvoir trouver, sans art direction ni indices décoratifs :

1. un plugin pour un jeu donné ;
2. les contenus compatibles avec une version précise ;
3. les dépendances d'un mod ;
4. les conflits connus ;
5. l'historique des versions ;
6. la licence et les permissions ;
7. l'auteur ou l'équipe ;
8. l'ajout à une collection ;
9. la création d'un profil/loadout ;
10. la publication d'une nouvelle release ;
11. le signalement d'un contenu ;
12. la documentation d'installation ;
13. la bibliothèque personnelle ;
14. les contenus récemment mis à jour.

## 5. États obligatoires à tester

Pour les surfaces pertinentes :

- loading ;
- skeleton ;
- empty ;
- no-results ;
- error ;
- retry ;
- offline ;
- stale ;
- unavailable ;
- unauthorized ;
- forbidden ;
- removed ;
- quarantined ;
- archived ;
- incompatible ;
- unverified ;
- success.

## 6. Règle d'arrêt avant direction artistique

Ne pas commencer la direction artistique finale si une tâche critique dépend :

- d'un libellé ambigu ;
- d'un chemin caché ;
- d'une information de compatibilité absente ;
- d'une dépendance invisible ;
- d'un état technique présenté comme certitude ;
- d'un élément de décor pour comprendre la navigation.

## 7. Figma

La page **02 Critical Flows** du fichier `MODARYX V2 — Architecture & Wireframes` matérialise les trois parcours principaux en low-fi.

Fichier : https://www.figma.com/design/TYoIH62lChEK6iMHhhpxZv
