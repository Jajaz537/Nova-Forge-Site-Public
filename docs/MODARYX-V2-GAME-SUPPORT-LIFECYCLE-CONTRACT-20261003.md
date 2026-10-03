# MODARYX V2 — Contrat cycle de vie des jeux et statut de support

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Principe

La présence d'une page jeu ne signifie pas que MODARYX distribue des mods pour ce jeu.

Le statut de support doit être explicite et contrôlé.

## 2. États de support jeu

### editorial-only
Le jeu possède :
- page ;
- guides ;
- informations éditoriales.

Mais :
- aucun corpus distribuable n'est garanti ;
- aucune compatibilité mod n'est inférée.

### catalog-enabled
Le jeu possède :
- contenus catalogués ;
- métadonnées ;
- recherche/filtres.

La distribution peut rester verrouillée.

### distribution-enabled
Le jeu permet des artefacts distribuables selon les règles :
- droits ;
- provenance ;
- hash ;
- états de release.

### deprecated
Le jeu reste consultable mais le support actif est arrêté.

## 3. Transition d'état

Chaque transition doit être justifiée par des preuves.

Exemple :
editorial-only → catalog-enabled exige un corpus valide.

catalog-enabled → distribution-enabled exige :
- artefacts autorisés ;
- droits ;
- provenance ;
- règles de compatibilité ;
- distribution.

## 4. Game Hub

Le Game Hub affiche le statut réel.

Il ne doit pas cacher un état editorial-only derrière une UI de catalogue vide ambiguë.

## 5. Search

La recherche globale peut retourner un jeu editorial-only.

Le résultat doit indiquer le statut.

Les contenus distribuables ne sont proposés que si les contrats correspondants existent.

## 6. Compatibilité

Aucune compatibilité n'est déduite du support général du jeu.

Compatibilité = claim lié à :
- release ;
- version du jeu ;
- loader ;
- plateforme ;
- environnement.

## 7. Guides

Les guides peuvent exister avant le catalogue.

Ils doivent clairement distinguer :
- faits officiels ;
- préparation MODARYX ;
- support réel ;
- compatibilité inconnue.

## 8. Deprecation

Si un jeu devient deprecated :
- contenu historique reste consultable si autorisé ;
- nouvelles publications peuvent être bloquées ;
- releases existantes gardent leurs états ;
- aucune suppression automatique.

## 9. Version du jeu

Le support doit pouvoir gérer :
- version active ;
- versions historiques ;
- unknown ;
- unsupported.

Une nouvelle version du jeu ne doit pas rendre automatiquement toutes les releases compatibles.

## 10. UI

Badges possibles :
- Éditorial
- Catalogue disponible
- Distribution disponible
- Support archivé

Le vocabulaire final doit être testé humainement.

## 11. SEO

Un hub editorial-only ne doit pas être optimisé avec des claims “mods disponibles” si aucun corpus n'existe.

## 12. Analytics

Séparer :
- visites hub ;
- recherche contenu ;
- ouverture fiche ;
- distribution.

Une visite d'un hub ne prouve pas une demande de téléchargement.

## 13. Gate high-fi

Avant high-fi des hubs jeu :
- états support définis ;
- transitions définies ;
- empty states définis ;
- compatibilité séparée du support ;
- deprecation définie.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
