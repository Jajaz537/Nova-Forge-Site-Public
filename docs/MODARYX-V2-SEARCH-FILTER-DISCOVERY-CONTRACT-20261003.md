# MODARYX V2 — Contrat Recherche, Filtres et Découverte

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Objectif

Permettre à l'utilisateur de réduire rapidement un corpus potentiellement massif de contenus vers un sous-ensemble réellement compatible et pertinent.

Le catalogue MODARYX V2 doit traiter les filtres comme un outil de décision, pas comme un simple panneau secondaire.

## 2. Règle centrale

Les filtres actifs doivent rester visibles même après fermeture du panneau de filtres.

### Pourquoi

Sans résumé visible :
- l'utilisateur oublie ce qui limite la liste ;
- le nombre de résultats devient difficile à interpréter ;
- retirer un filtre devient plus lent ;
- sur mobile, le contexte disparaît derrière le drawer.

### Décision MODARYX

Toujours afficher un **Applied Filters Overview** :

Desktop :
- au-dessus des résultats ou sous la barre de filtres.

Mobile :
- au-dessus des résultats ;
- en chips horizontales clairement scrollables ou en lignes ;
- avec compteur total de filtres actifs ;
- possibilité de retirer un filtre sans rouvrir le drawer.

## 3. Suppression des filtres

Chaque filtre actif doit être supprimable directement.

Actions :
- retirer une valeur ;
- retirer un groupe ;
- tout réinitialiser.

Le reset complet ne doit pas effacer :
- la requête texte si l'utilisateur a choisi uniquement “Réinitialiser les filtres” ;
- le contexte jeu, sauf action explicite.

## 4. Multi-sélection

Dans un même groupe de facettes, autoriser plusieurs valeurs quand la logique produit l'exige.

Exemple :
- Loader = Fabric OU Quilt
- Type = Mod OU Plugin
- Version = 1.21.1 OU 1.21.2

Ne pas forcer l'utilisateur à relancer plusieurs recherches si plusieurs valeurs sont compatibles avec son besoin.

## 5. Logique intra/inter-facettes

### Dans un même groupe

Par défaut : OR.

Exemple :
`loader=Fabric OR Quilt`.

### Entre groupes

Par défaut : AND.

Exemple :
`game=Minecraft AND loader=Fabric AND type=Mod`.

Les exceptions doivent être documentées.

## 6. Facettes universelles

- Jeu
- Type
- Catégorie
- Auteur / équipe
- Date de mise à jour
- Popularité
- Note
- Langue
- Statut
- Provenance
- Distribution

## 7. Facettes contextuelles

Selon le jeu/type :

- version du jeu ;
- loader/framework ;
- client/server ;
- DLC ;
- plateforme ;
- architecture/runtime ;
- dépendances ;
- conflits ;
- compatibility state.

Une facette ne doit pas apparaître si elle n'a aucun sens dans le contexte.

## 8. Ordre des filtres

Les filtres les plus décisionnels doivent apparaître avant les filtres décoratifs.

Priorité probable pour un hub jeu :

1. Version du jeu
2. Type de contenu
3. Loader/framework
4. Compatibilité
5. Catégorie
6. Dernière mise à jour
7. Auteur
8. Popularité/note

Cet ordre doit rester testable et adaptable au jeu.

## 9. Terminologie

Éviter les termes internes ou poétiques.

Exemples clairs :
- “Version du jeu”
- “Loader”
- “Compatible avec”
- “Dépendances”
- “Mis à jour”

Éviter :
- “Époque”
- “Portail”
- “Compatibilité mystique”
- vocabulaire d'univers à la place d'un concept technique.

## 10. Résumé de résultat

Toujours montrer :

- nombre de résultats ;
- contexte jeu ;
- requête ;
- filtres actifs ;
- tri.

Exemple logique :

`842 résultats · Minecraft · 1.21.1 · Fabric · Mods`

## 11. No results

Ne pas afficher seulement “Aucun résultat”.

Afficher :
- la requête ;
- les filtres actifs ;
- le filtre probablement trop restrictif si détectable ;
- “Retirer le dernier filtre” ;
- “Réinitialiser les filtres” ;
- élargir vers versions proches uniquement comme suggestion, jamais comme substitution automatique.

## 12. Recherche globale

Types de résultats :

- jeux ;
- contenus ;
- créateurs ;
- équipes ;
- collections ;
- modpacks.

Chaque résultat doit afficher clairement son type.

## 13. Recherche contextualisée

Dans un Game Hub :

- le jeu reste verrouillé comme contexte ;
- la recherche ne doit pas silently basculer vers tous les jeux ;
- une action explicite permet de “Rechercher partout”.

## 14. Suggestions

Les suggestions peuvent inclure :

- titres exacts ;
- jeux ;
- créateurs ;
- tags ;
- catégories.

Ne pas suggérer une compatibilité ou un support qui n'existe pas.

## 15. Search local-first

Le principe existant reste :

- index local/pré-calculé disponible pour le core ;
- moteur externe facultatif ;
- identité locale préservée ;
- panne externe = recherche dégradée, pas panne complète.

## 16. Tri

Types à prévoir :

- Pertinence
- Plus populaires
- Mieux notés
- Récemment mis à jour
- Nouveaux
- Nom

Le tri “pertinence” doit rester explicable et ne pas masquer des résultats uniquement pour des raisons commerciales non signalées.

## 17. Cartes dans les résultats

Informations minimales :

- nom ;
- jeu si recherche globale ;
- type ;
- auteur ;
- résumé ;
- compatibilité clé ;
- version/release ;
- mise à jour ;
- statut ;
- métrique principale si réelle.

Ne pas charger chaque carte de toutes les métadonnées.

## 18. Quick View

Permet de vérifier sans quitter la liste :

- compatibilité ;
- dépendances principales ;
- dernière release ;
- auteur ;
- actions secondaires.

Ne doit pas remplacer la fiche complète.

## 19. Mobile

### Drawer

Le drawer contient :
- groupes de filtres ;
- compteur de résultats prévisionnel si disponible ;
- appliquer ;
- reset.

### Après fermeture

L'utilisateur voit immédiatement :
- filtres actifs ;
- nombre de résultats ;
- tri.

### Cibles

Les chips et contrôles doivent rester faciles à activer au tactile.

## 20. Performance

Les changements de filtre doivent :
- fournir un feedback immédiat ;
- éviter un rerender massif inutile ;
- préserver scroll position lorsque logique ;
- ne pas déclencher une requête réseau à chaque frappe sans debounce/cancel.

## 21. URL / partage

Les filtres importants doivent pouvoir être sérialisés dans l'URL lorsque possible.

Avantages :
- back/forward ;
- partage ;
- bookmark ;
- récupération après refresh.

Les données privées/locales ne doivent pas être exposées dans l'URL.

## 22. Saved Searches

Évolution naturelle des anciennes “saved views”.

Une recherche sauvegardée doit mémoriser :
- q
- contexte jeu
- filtres
- tri

Elle ne doit pas promettre de synchronisation si elle est locale.

## 23. Accessibilité

- labels explicites ;
- fieldsets/groupes ;
- état sélectionné annoncé ;
- compteur résultat annoncé avec modération ;
- focus maintenu après suppression d'une chip ;
- drawer focus trap ;
- Escape ferme le drawer ;
- reset accessible au clavier.

## 24. Gate avant high-fi

Avant design final du catalogue :

- Applied Filters Overview défini ;
- multi-select défini ;
- logique OR/AND définie ;
- filtres contextuels par jeu prévus ;
- no-results conçu ;
- mobile drawer conçu ;
- query URL strategy définie ;
- fallback local/externe défini.

**État : TERMINÉ pour le contrat UX / NON IMPLÉMENTÉ volontairement.**
