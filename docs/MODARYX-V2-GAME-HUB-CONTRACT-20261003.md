# MODARYX V2 — Contrat Game Hub

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Rôle

Le Game Hub est le pivot entre la découverte globale et le catalogue contextualisé.

Il doit permettre à un joueur de comprendre immédiatement :

- quel jeu il consulte ;
- quelle version est active ;
- quels types de contenus existent ;
- quels contenus sont compatibles ;
- où chercher ;
- où voir collections, créateurs et guides.

## 2. Header du jeu

Afficher :

- titre du jeu ;
- visuel autorisé ;
- statut de support MODARYX ;
- version active ;
- plateforme si pertinente ;
- suivi/favori si fonction réelle ;
- recherche dans ce jeu.

Le simple fait qu'un hub existe ne prouve pas qu'un corpus de mods distribuable existe.

## 3. Statut de support

États minimum :

- editorial-only ;
- catalog-enabled ;
- distribution-enabled ;
- deprecated.

Le statut doit être lisible sans induire en erreur.

Lorsque le backend est `catalog-enabled` sans distribution prouvée, afficher une formulation explicite comme **Catalogue consultable — téléchargement non garanti** plutôt que `Catalogue disponible` seul.

## 4. Recherche contextualisée

Par défaut, la recherche reste limitée au jeu courant.

L'utilisateur peut explicitement basculer vers :

- recherche globale ;
- autre jeu.

La requête ne doit pas perdre silencieusement son contexte de version.

## 5. Version active

La version active influence :

- compatibilité ;
- résultats ;
- filtres ;
- warnings ;
- recommandations.

Si aucune version n'est choisie :

- afficher “Toutes les versions” ou équivalent ;
- ne pas promettre une compatibilité personnelle.

## 6. Navigation interne

Onglets proposés :

- Aperçu
- Mods & Plugins
- Collections
- Créateurs
- Guides
- Activité

Les labels restent fonctionnels.

`Mods & Plugins` reste l'entrée primaire courte. Quand l'espace le permet, une microcopy précise : **Mods, plugins, addons, scripts, outils et autres contenus compatibles.**

## 7. Aperçu

Blocs prioritaires :

1. Pour votre version
2. Populaires
3. Nouveaux
4. Récemment mis à jour
5. Types de contenus
6. Catégories
7. Collections
8. Créateurs actifs
9. Guides techniques

Les blocs n'apparaissent que s'ils ont des données valides.

## 8. Types de contenus

Le jeu déclare les types qu'il supporte.

Exemples :

- mods ;
- plugins ;
- addons ;
- scripts ;
- maps ;
- shaders ;
- presets ;
- tools.

L'UI ne doit pas afficher une taxonomie globale inutile à ce jeu.

## 9. Catégories

Les catégories sont spécifiques au jeu.

Exemples possibles :

- gameplay ;
- graphics ;
- UI ;
- vehicles ;
- maps ;
- audio ;
- utilities.

Elles ne doivent pas être codées dans la homepage générale.

## 10. Accès aux profils de jeu

Une preuve humaine réelle a montré que le contexte **jeu** est un point d'entrée naturel pour retrouver une configuration personnelle.

Le Game Hub doit donc proposer, lorsque la fonction existe réellement, un accès visible de type :

- **Mes profils pour ce jeu**

Cet accès complète **Bibliothèque → Profils de jeu** ; il ne crée pas un second type d'objet.

Le but est d'éviter d'obliger l'utilisateur à comprendre d'abord le contenant abstrait « Bibliothèque ».

## 11. Collections

Afficher :

- collections populaires ;
- nouvelles collections ;
- compatibles avec la version active si prouvé.

Une collection éditoriale n'est pas présentée comme installable sans manifeste de modpack/profil approprié.

## 12. Créateurs

Afficher :

- créateurs actifs ;
- équipes/studios ;
- créations récentes.

Aucune métrique de popularité ne remplace provenance, droits ou compatibilité.

## 13. Guides

Les guides peuvent couvrir :

- installation ;
- loaders ;
- versions ;
- dépannage ;
- sécurité ;
- compatibilité.

Les guides éditoriaux restent séparés du statut de distribution.

## 14. Activité

Activité utile uniquement :

- nouvelles releases ;
- mises à jour ;
- collections ;
- discussions pertinentes ;
- changements de compatibilité.

Éviter un feed social générique.

## 15. États

### Aucun corpus

Le hub peut exister en mode éditorial.

Afficher explicitement :
- “Aucun contenu distribuable actuellement.”

### Aucun contenu compatible

Afficher :
- version active ;
- possibilité d'élargir manuellement ;
- aucune substitution automatique.

### Version inconnue

Afficher :
- “Compatibilité non vérifiée”.

### Offline / stale

Les contenus en cache peuvent être consultés avec état de fraîcheur.

Toute action de distribution reste fail-closed si la fraîcheur nécessaire manque.

## 16. Mobile

Priorité :

1. jeu ;
2. version ;
3. recherche ;
4. raccourcis Mods / Collections / Guides ;
5. contenus “pour votre version” ;
6. catégories ;
7. créateurs.

Le sélecteur de version doit rester accessible sans ouvrir un menu profond.

## 17. Desktop

Peut utiliser :

- hero compact ;
- colonne/zone version ;
- recherche ;
- tabs ;
- grille de contenus ;
- sections horizontales seulement si elles ne masquent pas la densité.

## 18. Accessibilité

- titre H1 unique ;
- tabs accessibles clavier ;
- version selector label explicite ;
- search landmark ;
- états support annoncés textuellement ;
- aucune compatibilité uniquement par couleur.

## 19. Performance

Le Game Hub ne doit pas charger toutes les catégories/collections avant le contenu essentiel.

Ordre recommandé :

1. identité/version ;
2. recherche ;
3. contenus principaux ;
4. sections secondaires ;
5. ambiance monde vivant après contenu critique.

## 20. Critère high-fi

High-fi autorisé uniquement quand :

- statut support défini ;
- version active définie ;
- recherche contextualisée définie ;
- types/catégories définis ;
- états vide/incompatible/offline définis ;
- mobile défini.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**


## 21. Clarifications issues de la simulation experte

- `Mods & Plugins` conservé comme libellé primaire, taxonomie complète exposée par microcopy/filtres.
- `catalog-enabled` ne doit jamais être interprété visuellement comme une preuve de téléchargement disponible.

**État : intégré ; validation humaine toujours PREUVE MANQUANTE.**
