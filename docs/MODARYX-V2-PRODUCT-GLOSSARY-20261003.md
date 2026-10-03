# MODARYX V2 — Glossaire produit et terminologie

**Date : 2026-10-03**
**Statut : conception — à tester humainement**

## 1. But

Éviter les ambiguïtés entre concepts techniques, produit et lore.

Les termes ci-dessous sont des libellés de travail. Ils doivent être testés, pas considérés comme définitifs sans validation humaine.

## 2. Termes fonctionnels primaires

### Jeu
Contexte principal d'un contenu.

### Mod
Modification d'un jeu.

### Plugin
Extension chargée par un framework/loader ou une application compatible.

### Addon
Extension ou contenu additionnel dont la sémantique dépend du jeu.

### Script
Contenu exécutable/interprété selon l'écosystème.

### Tool / Outil
Programme ou utilitaire qui aide à créer, gérer, installer ou modifier.

### Collection
Liste éditoriale organisée par un curateur.

**Microcopy utilisateur provisoire :** **Sélection organisée à partager**.

La capacité doit être explicite. Une Collection ne doit jamais être supposée installable à cause de son nom. Afficher l'état réel, par exemple **Installation non disponible** ou une capacité d'installation seulement lorsqu'elle est réellement prouvée.

### Modpack
Ensemble versionné et installable avec manifeste/contraintes.

### Profile / Loadout
Configuration utilisateur concrète, locale ou synchronisée.

**Libellé UI français provisoire préféré après test humain P01 :**
- **Profils de jeu**
- microcopy : **Configurations enregistrées de mods et versions**

Le terme `Profile/Loadout` reste dans le domaine interne et les contrats techniques. **Configurations de jeu** reste une alternative testée par simulation IA, mais n'est pas retenue comme libellé primaire après le choix humain P01.

Le problème restant porte surtout sur la trouvabilité : le Game Hub doit offrir un accès contextualisé aux profils du jeu.

### Release
Version publiée d'un ContentItem.

### Fichier
Artefact téléchargeable lié à une Release.

**Libellé UI recommandé dans une release :**
- **Fichiers de cette version**

### Dépendance
Autre contenu requis, optionnel ou recommandé.

### Conflit
Relation connue rendant une combinaison incompatible ou risquée.

### Compatibilité
État entre une Release et un contexte précis.

## 3. États de compatibilité

- Compatible
- Partiellement compatible
- Incompatible
- Non vérifié

Ne pas utiliser “Probablement compatible” comme état principal sans méthode documentée.

## 4. Niveaux de preuve

- Mesuré
- Déclaré
- Estimé
- Inconnu

Ces niveaux décrivent la preuve, pas l'état de compatibilité lui-même.

## 5. Confiance / provenance

### Provenance vérifiée
Receipt/preuve réelle disponible.

### Provenance déclarée
Source déclarée mais non attestée.

### Provenance inconnue
Aucune preuve suffisante.

### Empreinte SHA-256
Identité des bytes.

### Signature
Relation cryptographique avec une clé/identité.

### Scan
Résultat d'un service de scan réel.

Ne pas regrouper tout sous un badge “Sûr”.

## 6. Distribution

- Verrouillé
- Publié
- Retiré
- Révoqué

Le terme “Disponible” doit signifier une disponibilité réelle.

## 7. Créateurs

### Créateur
Personne ou identité publique qui publie un projet.

### Équipe / Studio
Groupe de collaborateurs.

### Curateur
Personne qui organise une Collection.

### Modérateur
Rôle de plateforme distinct.

### Administrateur
Rôle de plateforme distinct.

### Fondateur
Rôle de plateforme distinct.

## 8. Compte et identité

### Compte
Session/authentification.

### Profil public
Identité visible.

### Identité créateur
Dimension éditoriale du profil.

### Autorité
Permissions serveur pour modération/administration.

## 9. Bibliothèque

### Favori
Marque-page personnel.

### Suivi
Abonnement aux mises à jour.

### Recherche sauvegardée
Requête + filtres mémorisés.

### Profils de jeu
Libellé UI provisoire préféré pour les `Profile/Loadout` après test humain P01.

Description :
- configurations enregistrées de mods et versions ;
- privées/locales par défaut ;
- distinctes des Collections et Modpacks.

## 10. Installation

### Installer avec manager
Action automatisée réelle vers un manager connecté.

### Téléchargement manuel
Récupération d'un fichier autorisé.

### Ajouter à une Collection
Organisation éditoriale.

### Ajouter à un Profil de jeu
Préparation d'une configuration utilisateur.

Ne pas utiliser “Installer” pour ces trois actions différentes.

## 11. États compte/sync

- Local uniquement
- Synchronisation en attente
- Synchronisé
- Conflit
- Indisponible

## 12. Publication créateur

- Brouillon
- Soumis
- En vérification
- Accepté
- Publié
- Retiré
- Rejeté
- En appel

## 13. Support jeu

États internes :
- Éditorial uniquement
- catalog-enabled
- distribution-enabled
- Support archivé

### Clarification UI obligatoire

Le libellé utilisateur **Catalogue disponible** ne doit pas apparaître seul lorsque la distribution n'est pas prouvée.

Formulation recommandée :
- **Catalogue consultable — téléchargement non garanti**

Employer **Téléchargement disponible** seulement lorsqu'un fichier réel est distribuable.
Employer **Installation via manager disponible** seulement lorsqu'un manager/capability réel est connecté.

Les états techniques internes peuvent rester `catalog-enabled` et `distribution-enabled`.

Ces libellés restent à tester humainement.

## 14. “Mods & Plugins” comme entrée parapluie

Le libellé primaire reste **Mods & Plugins** pour la navigation.

Quand la surface le permet, ajouter une microcopy explicite :

> Mods, plugins, addons, scripts, outils et autres contenus compatibles.

Les filtres doivent exposer la taxonomie complète du jeu courant.

## 15. Compatibilité et prérequis

Pour l'interface française, préférer :

**Compatibilité et prérequis**

Microcopy recommandée : **Versions compatibles et éléments nécessaires avant installation.**

Séparer visuellement :
- **Compatibilité avec votre configuration** ;
- **Éléments nécessaires** ;
- **Conflits connus avec d'autres contenus**.

Sous-sections de relation :
- Requis
- Optionnel
- Recommandé
- Incompatible

Le terme technique `requirements` peut rester dans les routes et contrats internes.

## 16. Termes lore secondaires

Peuvent apparaître en microcopy/ambiance :
- Royaume
- Portail
- Chronique
- Compagnon
- Faction
- Lieu

Ils ne remplacent jamais comme libellé primaire :
- Jeux
- Mods & Plugins
- Collections
- Créateurs
- Recherche
- Bibliothèque

## 17. Termes à éviter

- “Safe” sans définition précise ;
- “Verified” sans preuve réelle ;
- “Compatible” sans contexte/version ;
- “Installé” sans confirmation runtime ;
- “Synchronisé” sans service réel ;
- “Compte connecté” sur simple détection WebAuthn ;
- “Collection installable” sans manifeste/résolution.

## 18. Questions de tree testing liées au vocabulaire

Tester :
- Collection vs Profil ;
- Release vs Fichier ;
- Compatible vs Non vérifié ;
- Créateur vs Équipe ;
- Support vs Signalement ;
- Catalogue disponible vs Distribution disponible ;
- “Mods & Plugins” comme entrée parapluie ;
- trouvabilité de “Profils de jeu” dans les parcours ;
- microcopy et capacité de Collection ;
- compréhension de Bibliothèque.

## 19. Gate

Avant high-fi final :
- ambiguïtés internes corrigées ;
- synonymes principaux connus ;
- lore limité à la couche de marque ;
- validation humaine encore souhaitable mais non inventée.

**État : TERMINÉ pour le glossaire de travail + convergence P01/Work/étude indépendante intégrée / validation humaine globale EN COURS.**


## 20. Interdiction du libellé générique “Non vérifié”

Le test humain P01 montre que **Non vérifié** peut être compris simultanément comme : danger potentiel, absence de test et provenance inconnue.

Ne jamais afficher ce libellé seul. Toujours qualifier la dimension :
- **Compatibilité non vérifiée** ;
- **Provenance inconnue** ou **provenance non vérifiée** selon la preuve ;
- **Non analysé** lorsqu'aucun scan n'a été exécuté ;
- un risque réel doit être nommé explicitement et ne doit jamais être déduit d'un simple manque de vérification.

## 21. “Mods & Plugins” — statut après test humain

Le test humain P01 ne comprend pas naturellement **Mods & Plugins** comme englobant addons, scripts, outils, maps, shaders et presets.

Conséquence : ce libellé reste **NON STABILISÉ comme entrée parapluie finale**. Il peut rester un libellé de travail, mais une alternative plus large doit être testée avant le gel high-fi.


## 22. Parapluie de contenus — benchmark multi-gaming

Le benchmark externe Nexus / CurseForge / Modrinth / Thunderstore / Steam Workshop / Bethesda / mod.io / ModDB / GameBanana confirme que **Mods & Plugins** n'est pas une convention universelle assez large pour englober naturellement addons, scripts, outils, maps, shaders, presets et autres types.

Candidats prioritaires à tester humainement :
1. **Contenus de jeu**
2. **Mods & contenus**
3. **Créations**

Décision actuelle : **Mods & Plugins** reste un libellé historique/de travail mais n'est pas le parapluie final validé.

Référence : `docs/MODARYX-V2-MULTIGAMING-MODDING-TERMINOLOGY-BENCHMARK-20261003.md`.
