# MODARYX V2 — Stratégie de données et fixtures

**Date : 2026-10-03**
**Statut : conception — aucun faux contenu public créé**

## 1. Objectif

Permettre de concevoir, tester et développer V2 sans confondre :

- données réelles ;
- données de démonstration ;
- placeholders de wireframe ;
- fixtures de test.

## 2. Classes de données

### Production réelle

Données pouvant apparaître publiquement comme vraies.

Exigences :
- source ;
- droits ;
- statut ;
- provenance ;
- version ;
- compatibilité selon niveau de preuve.

### Démonstration explicite

Données destinées aux previews/tests visuels.

Doivent être marquées clairement :
- `dataClass: demonstration`
- ou équivalent V2.

Elles ne doivent jamais être utilisées pour créer une impression de catalogue réel.

### Fixture technique

Données synthétiques uniquement pour tests unitaires/intégration.

Elles ne doivent pas être servies par la production.

### Placeholder UI

Contenu neutre de wireframe :
- “Nom du mod”
- “Jeu”
- “Version”

Aucune propriété réelle n'est sous-entendue.

## 3. Règle high-fi

Le prototype high-fi pourra utiliser :

1. contenu réel autorisé ;
2. contenu de démonstration explicitement marqué ;
3. données synthétiques clairement fictives.

Interdiction :
- faux nombre de téléchargements présenté comme réel ;
- faux auteur ;
- faux badge verified ;
- fausse compatibilité mesurée ;
- faux avis ;
- faux classement.

## 4. Fixtures minimales à préparer plus tard

### Game

- jeu avec corpus ;
- jeu éditorial seulement ;
- jeu sans contenu ;
- jeu déprécié.

### ContentItem

- mod stable ;
- plugin ;
- tool ;
- shader/preset ;
- contenu archived ;
- contenu quarantined ;
- contenu removed.

### Release

- stable compatible ;
- beta ;
- incompatible version ;
- withdrawn ;
- revoked.

### Dependencies

- required valide ;
- optional ;
- recommended ;
- conflit ;
- dépendance manquante ;
- dépendance revoked.

### Collection

- vide ;
- petite ;
- grande ;
- mixed compatibility.

### Profile

- local-only ;
- sync-pending ;
- synced ;
- conflict.

### Creator

- solo ;
- team member ;
- verified/unverified identity state.

## 5. Tests de rendu

Chaque composant critique doit être testé avec :

- texte court ;
- texte long ;
- nom très long ;
- aucun media ;
- plusieurs media ;
- plusieurs tags ;
- zéro métrique ;
- métriques élevées ;
- statut unavailable.

## 6. Données de catalogue actuelles

Le catalogue actuel est explicitement :
- `dataClass: demonstration`
- `metadata-preview-only`
- locked/non downloadable.

Il peut rester fixture historique.

Il ne doit pas être migré automatiquement comme corpus V2 réel.

## 7. Search fixtures

Créer plus tard des documents synthétiques couvrant :
- game
- content
- creator
- team
- collection
- modpack

pour vérifier le regroupement des résultats sans inventer de données publiques.

## 8. Sécurité

Les fixtures doivent tester :
- hash invalide ;
- receipt absent ;
- provenance unknown ;
- rights not-authorized ;
- stale distribution ;
- revoked artifact.

Le produit doit rester fail-closed.

## 9. Accessibilité

Fixtures pour :
- traduction longue ;
- caractères non latins ;
- accents ;
- RTL si scope futur ;
- labels très longs ;
- erreurs multiples.

## 10. Nettoyage

Les données fixtures doivent être isolées dans un espace explicite futur, par exemple :

`v2/tests/fixtures/`

ou équivalent.

Aucune fixture ne doit être copiée dans le répertoire public par simple build glob.

## 11. Critère de passage

Avant implémentation du catalogue V2 :
- classes de données définies ;
- fixture paths isolés ;
- démonstration marquée ;
- aucun faux contenu non étiqueté ;
- tests de contrats prêts.

**État : TERMINÉ pour la stratégie / NON IMPLÉMENTÉ volontairement.**
