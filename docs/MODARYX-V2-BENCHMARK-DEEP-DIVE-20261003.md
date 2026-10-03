# MODARYX V2 — Benchmark approfondi des plateformes de modding

**Date : 2026-10-03**
**Portée : conception produit / UX, aucune implémentation production**

## Sources récentes étudiées

- Nexus Mods — collections, filtres, Vortex, curateurs.
- CurseForge — découverte, browse, filtres, deeplinks d'installation, gestion par instance.
- Modrinth — types de projet, facettes, loaders, versions, environnements client/serveur.
- Thunderstore — packages, versions sémantiques, dépendances, profils/modpacks, manager.
- Steam Workshop — dépendances, load order, dépendances manquantes, recherches sauvegardées, collections.
- GameBanana — studios, clubs, collaboration communautaire.

## 1. Découverte

### Pattern fort

Les meilleures plateformes ne commencent pas par une narration abstraite. Elles donnent rapidement accès à :

- un jeu ;
- une recherche ;
- un type de contenu ;
- des filtres ;
- des contenus populaires/récents.

### Règle MODARYX

La première interaction utile doit rester à moins d'un écran de distance :

**jeu → contenu → compatibilité → action**.

## 2. Recherche et facettes

Modrinth expose un modèle de facettes riche : type de projet, catégories/loaders, versions, open source et environnement client/serveur.

Steam Workshop ajoute des recherches sauvegardées et améliore la pertinence par popularité/notes.

CurseForge sépare Discover, Browse et Search, avec filtres par catégorie/version.

### Décision MODARYX

Le moteur de recherche V2 doit prévoir deux couches :

#### Universelles

- jeu ;
- type ;
- catégorie ;
- auteur ;
- version ;
- date ;
- popularité ;
- note ;
- dernière mise à jour ;
- langue ;
- statut.

#### Contextuelles

- loader/framework ;
- client/server ;
- DLC ;
- plateforme ;
- version exacte ;
- dépendances ;
- conflits ;
- compatibilité ;
- tags propres au jeu.

## 3. Dépendances

Thunderstore déclare les dépendances dans le manifest et le manager les installe automatiquement.

Steam Workshop affiche les dépendances, les dépendances manquantes et peut dériver le load order lorsque les auteurs déclarent correctement les relations.

### Décision MODARYX

Les dépendances sont un objet métier de premier rang, pas une note de bas de page.

Chaque relation doit distinguer :

- required ;
- optional ;
- recommended ;
- incompatible/conflict.

Le système ne doit jamais corriger silencieusement une incompatibilité par substitution.

## 4. Collections, modpacks et profils

Nexus définit les collections comme des méta-listes qui permettent de reproduire une configuration via Vortex.

Thunderstore distingue profils partageables et modpacks ; un profil peut inclure mods + configs, tandis qu'un modpack est distribué comme package avec ses dépendances.

Steam permet des collections et l'abonnement à un item avec ses dépendances.

### Décision MODARYX

Ne jamais fusionner ces concepts :

- **Favori** = marque-page personnel.
- **Collection** = liste éditoriale.
- **Modpack** = ensemble versionné/installable.
- **Profile / Loadout** = configuration utilisateur précise.
- **Saved Search** = requête/filtres réutilisables.

## 5. Installation / management

CurseForge permet de lancer l'installation depuis le web vers l'app via deeplink.

Nexus place Vortex au cœur de l'installation de collections.

Thunderstore/r2modman permettent l'installation avec manager et le téléchargement manuel.

### Décision MODARYX

La fiche contenu doit prévoir plusieurs actions distinctes :

- Installer avec manager — uniquement si réellement disponible.
- Téléchargement manuel — uniquement si artefact autorisé.
- Ajouter à une collection.
- Ajouter à un profil/loadout.
- Copier/voir les dépendances.

Aucune action automatisée ne doit être simulée.

## 6. Versions

Thunderstore utilise la version sémantique et affiche toujours la version la plus haute.

Les plateformes matures exposent historique, date de mise à jour et fichiers/version.

### Décision MODARYX

`Release` devient un objet de premier rang séparé du projet/contenu.

Une fiche doit permettre :

- dernière release ;
- historique ;
- changelog ;
- fichiers ;
- compatibilité spécifique à la release ;
- retrait/révocation ;
- provenance.

## 7. Créateurs et équipes

GameBanana met les Studios et Clubs en avant.

CurseForge valorise l'écosystème créateur et le partage de revenus.

### Décision MODARYX

Le modèle doit distinguer :

- Creator ;
- Team / Studio ;
- Curator ;
- Moderator.

Une création peut appartenir à une équipe tout en gardant ses auteurs/contributeurs.

## 8. Confiance

Les plateformes concurrentes mettent en avant sécurité, auteurs, statuts et gestion.

MODARYX possède déjà des briques plus strictes de provenance/signature/receipts.

### Opportunité MODARYX

Créer une couche de confiance réellement lisible :

- auteur vérifié/non vérifié ;
- provenance vérifiée/déclarée/inconnue ;
- hash disponible ;
- signature si applicable ;
- statut modération ;
- statut distribution ;
- licence ;
- date/version ;
- avertissements.

Ne jamais transformer un hash ou une signature isolée en garantie d'innocuité.

## 9. Différenciation possible

MODARYX peut combiner les forces observées :

- trouvabilité de Modrinth ;
- simplicité d'installation de CurseForge ;
- collections/configurations de Nexus ;
- dépendances/profils de Thunderstore ;
- puissance de gestion du Workshop ;
- collaboration créateur de GameBanana ;
- provenance/signatures déjà préparées côté MODARYX.

L'univers visuel MODARYX reste une couche de marque, pas un remplacement de ces fonctions.

## 10. Anti-patterns à éviter

- Homepage qui cache le produit derrière une narration.
- Filtres génériques identiques pour tous les jeux.
- Compatibilité noyée dans la description.
- Dépendances visibles seulement après installation.
- Confusion entre favori/collection/modpack/profile.
- Bouton “installer” sans manager réellement connecté.
- Scores/confiance non expliqués.
- Interfaces centrées sur des cartes sans hiérarchie de tâche.
- Navigation avec termes poétiques à la place de libellés fonctionnels.
