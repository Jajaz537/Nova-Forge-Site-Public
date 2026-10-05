# MODARYX V2 — Décision produit finale : Profils de jeu

**Date : 2026-10-03**  
**Statut : TERMINÉ — décision produit de wording**

## Décision

Le libellé utilisateur retenu est :

**Profils de jeu**

Microcopy standard :

**Configurations enregistrées de mods, versions et réglages.**

## Motifs

1. P01, seul participant humain réel testé sur ce choix, préfère **Profils de jeu**.
2. CurseForge utilise explicitement **Profiles** pour des ensembles comprenant modloader, configurations, fichiers et mods.
3. Thunderstore distingue explicitement **Profile** et **Modpack** ; un profil contient une liste de mods et leurs configurations.
4. Nexus/Vortex expose des **Mod Profiles** pour gérer des combinaisons indépendantes de mods.
5. Modrinth emploie surtout **Instances** et parfois profile/instance dans sa documentation ; cela confirme qu'un objet dédié représente le setup, plutôt que le terme générique « configuration ».
6. **Configurations de jeu** est descriptif mais peut aussi évoquer, dans un contexte gaming, des réglages de jeu ou paramètres techniques.

## Règles UI

- Navigation / Bibliothèque : **Profils de jeu**
- Game Hub : **Mes profils pour ce jeu**
- Action : **Ajouter à un profil de jeu**
- Empty state : **Aucun profil de jeu**
- Description : **Configurations enregistrées de mods, versions et réglages.**

Le profil de compte doit rester nommé **Profil public** ou **Compte** selon le contexte afin d'éviter la collision.

## Domaine interne

Le domaine peut conserver :
- `Profile`
- `Loadout`
- `profile-loadout`

Aucun renommage de schéma interne n'est imposé par cette décision.

## État de preuve

Cette décision est une **décision produit** fondée sur :
- benchmark externe actuel ;
- préférence humaine P01 ;
- simulations assistant et Work.

Elle ne constitue pas une statistique humaine générale et ne prétend pas que tous les utilisateurs préfèrent ce terme.

## Conséquence

L'arbitrage **Profils de jeu vs Configurations de jeu** est fermé.

Il ne doit plus être considéré comme blocker terminologique pour la poursuite de la direction artistique exploratoire ou du design system préparatoire.
