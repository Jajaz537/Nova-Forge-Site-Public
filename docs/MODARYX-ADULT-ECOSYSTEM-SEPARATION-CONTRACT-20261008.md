# MODARYX — contrat de séparation stricte avec l’écosystème 18+ — 2026-10-08

**État : TERMINÉ pour la règle d’architecture / audits release PREUVE MANQUANTE**

## Architecture

MODARYX et MODARYX OS forment l’écosystème principal actuel.

Un éventuel jeu 18+ et son site 18+ constituent **un écosystème distinct**, qui ne fait pas partie de MODARYX ni de MODARYX OS.

Cette séparation est une règle d’architecture, pas un simple choix de marketing.

## Interdictions côté MODARYX

Ne jamais afficher dans MODARYX :
- contenu 18+ ;
- promotion du jeu/site 18+ ;
- branding adulte ;
- lien commercial ou funnel vers l’écosystème adulte.

Ne pas créer :
- upsell ;
- cross-promo ;
- bannière ;
- carte catalogue ;
- notification ;
- recommandation ;
- newsletter ;
- CTA ;
- lien de navigation
qui transforme MODARYX en canal d’acquisition de l’écosystème 18+.

## Comptes / authentification

Par défaut :
- comptes séparés ;
- auth séparée ;
- sessions séparées ;
- entitlements séparés.

Ne jamais supposer qu’un compte MODARYX doit fonctionner dans l’écosystème 18+ ou inversement.

## Paiement

Par défaut :
- aucun abonnement partagé ;
- aucun panier partagé ;
- aucune facturation croisée ;
- aucun entitlement croisé ;
- aucun checkout MODARYX vers l’écosystème adulte.

Un même fournisseur technique futur ne vaudrait pas autorisation de partager les données ou les contrats.

## Données / analytics

Par défaut :
- aucun partage de profil ;
- aucun identifiant cross-ecosystem ;
- aucun partage de télémétrie ;
- aucun analytics unifié ;
- aucun enrichissement comportemental croisé ;
- aucune audience marketing croisée.

Toute évolution future exige avant implémentation :
1. décision produit explicite ;
2. revue sécurité ;
3. revue privacy/data-flow ;
4. revue juridique/compliance ;
5. revue âge/audience/consommateur ;
6. mise à jour threat model ;
7. mise à jour CHECKPOINT-CANONIQUE.

## Infrastructure

Co-ownership ou fournisseur commun ne signifie pas mutualisation autorisée.

Même si deux produits utilisent un jour :
- Cloudflare ;
- un PSP ;
- un outil support ;
- un provider auth ;
- une plateforme analytics,

les tenants, données, secrets, finalités et permissions doivent rester séparés sauf décision formelle contraire après les revues requises.

## Observation statique actuelle

Recherche de dépôt ciblée sur des marqueurs évidents :
- `18+`
- `adult`
- `adulte`
- `NSFW`

Aucune référence évidente n’a été observée dans la recherche courante.

Cela **ne constitue pas** une preuve de release complète.

Avant lancement, il faut encore auditer la surface distribuée et les configurations réelles pour prouver :
- absence de contenu/promo adulte ;
- absence de compte/auth partagé ;
- absence de paiement/entitlement partagé ;
- absence de données/analytics partagés.

## Gate de changement futur

Valeur par défaut : **NO_SHARING**.

Toute proposition de mutualisation future reste **BLOQUÉE** jusqu’à décision explicite + revues produit, sécurité, juridique et privacy.

Aucune fonction 18+, aucun lien commercial, aucun compte, paiement ou analytics partagé n’est activé par ce document.
