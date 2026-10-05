# MODARYX V2 — Delta de recherche concurrentielle

**Date : 2026-10-03**
**Statut : recherche actuelle — décisions à intégrer seulement lorsqu'elles améliorent réellement MODARYX**

## Sources vérifiées

- CurseForge App Getting Started  
  https://support.curseforge.com/support/solutions/articles/9000193488-curseforge-app-getting-started
- CurseForge — Installing Minecraft Mods and Modpacks  
  https://support.curseforge.com/support/solutions/articles/9000196984-installing-minecraft-modpacks
- Nexus Mods — Guidelines for Collections  
  https://help.nexusmods.com/article/115-guidelines-for-collections
- Nexus Mods — Collections  
  https://www.nexusmods.com/collections
- Nexus Mods — Vortex  
  https://www.nexusmods.com/vortex
- Nexus Mods API Documentation  
  https://api-docs.nexusmods.com/

## 1. Website → app / manager

CurseForge documente explicitement un flux :
- utilisateur clique Install sur le site ;
- deeplink ;
- l'application s'ouvre ;
- l'installation continue dans l'app.

### Décision MODARYX

**À INTÉGRER comme contrat futur**, pas comme capacité actuelle.

Le modèle `InstallAction` doit prévoir :
- managerDetected ;
- managerConnected ;
- protocolAvailable ;
- fallbackManual ;
- unsupportedPlatform.

Le clic web ne doit jamais être compté comme installation réussie.

## 2. Contexte par installation / instance

CurseForge gère certains réglages par installation/instance du jeu.

### Opportunité

MODARYX ne doit pas supposer qu'un jeu = une seule installation locale.

Le futur manager/profile model doit pouvoir distinguer :
- jeu ;
- installation/instance ;
- version ;
- loader ;
- profil.

**À INTÉGRER dans le modèle manager/profile.**

## 3. Installation vers nouveau profil ou profil existant

CurseForge propose, selon le flux, de créer un nouveau profil ou d'ajouter le mod à un profil existant.

### Décision MODARYX

**À INTÉGRER.**

Avant installation manager :
- “Installer dans un profil existant”
- “Créer un nouveau profil”

si le manager supporte réellement cette capacité.

Cela renforce notre séparation :
- Collection ≠ Profile
- ContentItem ≠ installation locale.

## 4. Collections comme listes reproductibles

Nexus décrit les Collections comme des listes de mods destinées à reproduire une configuration via Vortex.

### Décision MODARYX

Notre distinction actuelle reste correcte :

- Collection = curation/listing ;
- Modpack = objet installable versionné ;
- Profile = état local concret.

Une Collection peut devenir installable seulement via une couche de résolution/manifeste explicite.

**À CONSERVER.**

## 5. Responsabilité du curateur

Nexus place une responsabilité de support sur le curateur d'une Collection.

### Opportunité MODARYX

Prévoir dans la fiche collection :
- curateur ;
- instructions ;
- notes de support ;
- dernière validation ;
- contexte jeu/version ;
- limitations connues.

Ne pas détourner automatiquement l'utilisateur vers les auteurs de chaque mod pour un problème causé par la Collection elle-même.

**À INTÉGRER dans le contrat Collection.**

## 6. Filtres Collection

Les pages Nexus Collections filtrent notamment par :
- jeu/version ;
- catégorie ;
- type de collection ;
- tags ;
- nombre/mods inclus selon surface.

### Décision MODARYX

Le catalogue Collections doit avoir ses propres facettes.

Ne pas réutiliser aveuglément les filtres des ContentItems.

**À INTÉGRER.**

## 7. Profils propres pour les Collections

Les discussions de support Nexus montrent qu'une Collection installée dans un profil propre évite des mélanges avec des mods hors Collection.

### Opportunité

MODARYX devrait recommander, si le manager le supporte :
- nouveau profil propre pour une installation complexe ;
- ou confirmation explicite avant fusion dans un profil existant.

Ce n'est pas une règle absolue universelle, mais un bon garde-fou pour le design du flow.

**À TESTER / INTÉGRER selon manager.**

## 8. Mise à jour

Vortex met fortement en avant :
- mises à jour disponibles ;
- gestion centralisée ;
- installation de Collections.

### Décision MODARYX

Le futur manager doit traiter Update comme un flow distinct de Install :
- preflight ;
- compatibility ;
- dependency changes ;
- config impact ;
- rollback.

Déjà couvert dans le contrat installation ; **confirmé par benchmark.**

## 9. API de plateforme et dépréciation

La documentation Nexus API actuelle publie une politique de dépréciation avec fenêtres et guidance.

### Opportunité MODARYX

Pour les API/contrats futurs :
- version stable ;
- champs dépréciés explicitement ;
- période de migration ;
- compatibilité additive préférée ;
- documentation de migration.

**À INTÉGRER dans la gouvernance API future.**

## 10. Résumé des nouvelles décisions

### À INTÉGRER

- modèle multi-instance jeu ;
- installation vers profil nouveau/existant ;
- support du curateur de Collection ;
- filtres dédiés aux Collections ;
- politique API de dépréciation/versioning.

### À TESTER

- recommandation “profil propre” pour Collections/Modpacks ;
- deeplink manager exact selon runtime futur.

### À ÉCARTER pour l'instant

- compter un clic web comme installation réussie ;
- rendre une Collection installable par simple liste sans résolution/manifeste ;
- supposer une seule installation par jeu.

## 11. Règle

Ces découvertes complètent les contrats existants. Elles ne déclenchent aucun code production ni changement de schéma v1 sans gate explicite.

**État : TERMINÉ pour ce delta de recherche.**
