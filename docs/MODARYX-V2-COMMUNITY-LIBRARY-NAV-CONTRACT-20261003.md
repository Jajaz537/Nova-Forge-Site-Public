# MODARYX V2 — Contrat Community, Library et Navigation

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## Community

La communauté reste centrée sur le modding.

Sections principales :
- Support
- Questions
- Discussions
- Studios / équipes
- Activité

Chaque contenu communautaire garde un contexte clair : jeu, création, collection ou équipe.

États à prévoir :
- brouillon local
- envoi
- publié
- indisponible
- erreur
- appel ou révision si la plateforme le permet

Les droits d'action avancés doivent toujours venir du serveur.

La page ne doit pas devenir un réseau social générique ni remplacer les informations critiques des fiches de contenus.

## Library

La bibliothèque personnelle sépare clairement :
- favoris
- suivis
- collections
- modpacks
- configurations de jeu (`Profile/Loadout` interne)
- recherches sauvegardées
- installations si un manager est réellement connecté

États :
- local-only
- sync-pending
- synced
- conflict
- unavailable

Les éléments personnels restent privés par défaut. Le partage est explicite.

Sans manager connecté, MODARYX ne doit pas prétendre connaître l'état réel des installations locales.

## Navigation desktop

Navigation primaire :
- Découvrir
- Jeux
- Mods & Plugins
- Collections
- Créateurs
- Communauté
- Créer

Utilitaires :
- Recherche
- Bibliothèque
- Notifications
- Compte

## Navigation mobile

Priorités :
- Recherche
- Jeux
- Découvrir
- Bibliothèque
- Compte / Menu

Menu complet :
- Mods & Plugins
- Collections
- Créateurs
- Communauté
- Créer
- Docs
- Sécurité

## Terminologie

Les libellés fonctionnels restent explicites.

Le lore MODARYX peut enrichir :
- sous-titres
- illustrations
- ambiance
- microcopy secondaire
- transitions

Il ne remplace jamais les mots attendus par l'utilisateur comme Jeux, Mods, Collections ou Recherche.

## Recherche

La recherche doit rendre sa portée explicite et réversible :
- **Rechercher dans ce jeu** pour une recherche contextualisée ;
- **Rechercher partout sur MODARYX** pour la recherche globale.

La recherche doit rester accessible :
- depuis le header desktop
- immédiatement sur mobile
- dans un Game Hub
- dans Community lorsque le contexte le justifie

## Breadcrumbs

Recommandés sur les parcours profonds :
- Game Hub → Catalogue → Content Detail
- Creator → Project → Release
- Collection → Item

## Notifications

Exemples possibles :
- nouvelle release
- problème de dépendance
- commentaire ou support
- changement d'état de publication
- conflit de profil

Aucune notification ne doit être affichée sans événement réel.

## Empty states

Community :
- aucune discussion
- aucune question
- aucun studio

Library :
- aucun favori
- aucune collection
- aucune configuration de jeu
- manager non connecté

Chaque état vide propose une prochaine action utile.

## Offline

Community :
- brouillons locaux
- lecture cache si disponible
- aucun envoi simulé

Library :
- données locales disponibles
- état de synchronisation clairement indiqué
- aucune action distante simulée

## Accessibilité

- skip link
- landmarks
- focus visible
- aria-current
- menu mobile au clavier
- fermeture par Escape
- labels textuels
- cibles tactiles suffisantes

## Gate high-fi

Community, Library et navigation ne passent en high-fi que lorsque :
- les concepts sont séparés
- les états local/cloud sont définis
- les permissions viennent d'une source réelle
- le mobile est défini
- la recherche est immédiatement accessible
- les libellés fonctionnels sont stabilisés

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**


## Clarifications terminologiques sûres

Dans la Bibliothèque, le libellé utilisateur provisoire recommandé est **Configurations de jeu** avec la description **Mods et versions actifs enregistrés**.

Le terme `Profile/Loadout` reste réservé au domaine interne. `Profils de jeu` peut rester un synonyme secondaire/historique pendant la transition terminologique.

La Bibliothèque doit afficher immédiatement ses sous-objets : Favoris, Suivis, Collections, Modpacks, Configurations de jeu et recherches sauvegardées, afin de ne pas obliger l'utilisateur à deviner ce qu'elle contient.

**État : convergence P01 + Work + étude indépendante intégrée ; libellé final encore À REVALIDER humainement.**
