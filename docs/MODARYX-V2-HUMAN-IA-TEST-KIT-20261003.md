# MODARYX V2 — Kit de validation humaine IA / low-fi

**Date : 2026-10-03**
**Statut : protocole prêt — PREUVE MANQUANTE pour exécution**

## 1. Objectif

Tester séparément :

1. la manière dont les utilisateurs regroupent les concepts ;
2. la trouvabilité des tâches ;
3. la compréhension des libellés ;
4. les confusions entre objets proches.

Ce kit complète le script `MODARYX-V2-HUMAN-LOWFI-TEST-20261003.md`.

## 2. Participants

Minimum utile recommandé :

- 2 joueurs expérimentés en modding ;
- 2 joueurs peu expérimentés ;
- 1 créateur/moddeur si possible.

Ne pas utiliser uniquement des personnes connaissant déjà MODARYX.

## 3. Card sorting — cartes

Cartes à classer librement :

- Jeux
- Mods
- Plugins
- Addons
- Scripts
- Outils
- Collections
- Modpacks
- Profils / Loadouts
- Favoris
- Créateurs
- Équipes / Studios
- Communauté
- Support
- Signalements
- Versions
- Fichiers
- Dépendances
- Conflits
- Compatibilité
- Changelog
- Bibliothèque
- Recherche
- Notifications
- Creator Studio
- Paramètres
- Sécurité / Confiance
- Guides

## 4. Card sorting — consigne

> “Regroupe ces éléments de la manière qui te semble la plus naturelle. Tu peux créer autant de groupes que tu veux et leur donner le nom que tu veux.”

Ne pas donner les catégories MODARYX avant la fin.

## 5. Observations à relever

Pour chaque participant :

- groupes créés ;
- noms donnés aux groupes ;
- cartes hésitantes ;
- cartes laissées seules ;
- termes inconnus ;
- regroupements inattendus ;
- commentaires spontanés.

## 6. Hypothèses à tester

### H1 — Collections / Modpacks / Profiles

Hypothèse :
les utilisateurs distinguent naturellement :
- sélection éditoriale ;
- ensemble installable ;
- configuration personnelle.

Si plusieurs participants regroupent tout sous “packs” ou “listes”, revoir les libellés/explications.

### H2 — Files / Versions / Changelog

Hypothèse :
les utilisateurs distinguent :
- version publiée ;
- fichier de cette version ;
- historique des changements.

### H3 — Support / Signalement

Hypothèse :
les utilisateurs séparent :
- aide/bug ;
- violation/risque.

### H4 — Library

Hypothèse :
“Bibliothèque” est comprise comme l'espace personnel regroupant favoris, suivis, collections et profils.

### H5 — Mods & Plugins

Hypothèse :
ce libellé sert d'entrée naturelle pour chercher aussi addons/scripts/tools, sans exclure mentalement ces types.

## 7. Tree testing — tâches finales

### T1 — Plugin pour un jeu

> “Tu veux installer un plugin pour un jeu précis. Où vas-tu ?”

Attendu :
Jeux → Hub jeu → Mods & Plugins / recherche contextualisée.

### T2 — Compatibilité

> “Tu veux savoir si la version actuelle d'un mod fonctionne avec la version 1.21.1 de ton jeu.”

Attendu :
Fiche → Compatibilité / Requirements.

### T3 — Dépendance

> “Avant installation, tu veux savoir ce qu'il faut installer en plus.”

Attendu :
Fiche → Requirements → Required.

### T4 — Conflit

> “Tu veux vérifier ce qui risque d'entrer en conflit avec ce mod.”

Attendu :
Fiche → Requirements → Incompatible / Conflicts.

### T5 — Favori

> “Tu veux simplement retrouver ce mod plus tard.”

Attendu :
Favori.

### T6 — Collection

> “Tu prépares une sélection thématique de mods à organiser ou partager.”

Attendu :
Collection.

### T7 — Profil

> “Tu veux sauvegarder exactement les mods et versions actifs dans ta configuration de jeu.”

Attendu :
Bibliothèque → Profils / Loadouts.

### T8 — Modpack

> “Tu veux installer un ensemble versionné de mods déjà préparé pour une version précise du jeu.”

Attendu :
Modpacks.

### T9 — Ancienne version

> “Tu veux revenir à la version 1.4 d'un mod.”

Attendu :
Fiche → Versions.

### T10 — Fichier correspondant

> “Après avoir choisi la version 1.4, tu veux récupérer son fichier.”

Attendu :
Release 1.4 → Files.

### T11 — Créateur

> “Tu connais le nom d'un créateur et veux retrouver toutes ses créations.”

Attendu :
Recherche globale ou Créateurs.

### T12 — Publier une release

> “Tu as déjà un projet et tu veux publier une nouvelle version.”

Attendu :
Créer → Creator Studio → Project → Releases.

### T13 — Support

> “Le mod ne fonctionne pas comme prévu et tu veux demander de l'aide.”

Attendu :
Fiche → Support / Issues.

### T14 — Signalement

> “Tu penses qu'un contenu enfreint les règles ou présente un risque.”

Attendu :
Fiche → Signalement.

### T15 — Catalogue vs distribution

> “Un jeu indique ‘Catalogue disponible’. T'attends-tu à pouvoir télécharger immédiatement ?”

Attendu :
non nécessairement ; le participant comprend que catalogue ≠ distribution.

### T16 — Recherche globale

> “Tu veux retrouver à la fois un jeu, une collection ou un créateur depuis un seul endroit.”

Attendu :
Recherche globale.

## 8. Mesures

Pour chaque tâche :

- premier choix ;
- chemin final ;
- succès ;
- échec ;
- hésitation ;
- retour arrière ;
- temps approximatif ;
- terme incompris ;
- commentaire.

## 9. Codage des résultats

### Succès direct
Premier choix correct + chemin sans retour.

### Succès indirect
Tâche réussie avec hésitation ou détour.

### Échec
Tâche non trouvée ou mauvais concept final.

### Ambiguïté terminologique
Le participant réussit mais explique un sens différent du modèle attendu.

## 10. Seuils de correction

Une tâche critique est à revoir si :

- plus d'un participant choisit un mauvais premier niveau ;
- le même terme est interprété de plusieurs façons incompatibles ;
- le participant doit connaître le lore ;
- Collection/Modpack/Profile restent confondus ;
- Catalogue disponible est compris comme téléchargement garanti ;
- Support et Signalement sont confondus.

## 11. Questions de sortie

- “En une phrase, à quoi sert MODARYX ?”
- “Où commencerais-tu pour trouver quelque chose pour ton jeu ?”
- “Quelle différence fais-tu entre Favori, Collection, Modpack et Profil ?”
- “Quelle différence fais-tu entre Version et Fichier ?”
- “Que signifie pour toi ‘Non vérifié’ ?”
- “Que comprends-tu par ‘Catalogue disponible’ ?”
- “À quoi t'attends-tu dans Bibliothèque ?”
- “Que mettrais-tu dans ‘Mods & Plugins’ ?”

## 12. Feuille de résultats

Pour chaque participant :

- profil : expérimenté / débutant / créateur ;
- device ;
- T1…T16 : direct / indirect / échec ;
- termes problématiques ;
- commentaire libre.

Synthèse finale :

- taux de succès direct par tâche ;
- confusions récurrentes ;
- termes à renommer ;
- chemins à raccourcir ;
- corrections IA nécessaires.

## 13. Règle de décision

Le test humain peut :
- confirmer ;
- invalider ;
- simplifier ;
- renommer.

Il ne doit pas être “réinterprété” pour sauver l'architecture actuelle.

## 14. Gate

Avant high-fi :

- tâches critiques exécutées ;
- confusions majeures corrigées ;
- terminologie critique stabilisée ;
- chemins principaux compréhensibles sans décor.

**État : TERMINÉ pour le kit / PREUVE MANQUANTE pour exécution humaine.**
