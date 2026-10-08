# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-07-1510

**Date de référence : 2026-10-07 ~15:10 Europe/Paris**  
**Statut global : EN COURS — produit V2 avancé, viabilité commerciale désormais workstream explicite, VF stricte toujours BLOQUÉE**

## 1. Source opérationnelle

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique produit : `design/modaryx-v2-blue-violet-product-20261005`
- SHA canonique vérifié avant ce checkpoint : `5dcde91e7aa7d7ea3c8a40f9eec6ba69b2d0e14a`
- commit : `Merge MODARYX V2 real profile editor with Turnstile`
- `main` : non modifié
- DNS / DNSSEC / nameservers : non modifiés
- production D1/R2/providers : non modifiés par cette décision
- cutover : non exécuté

## 2. Identité MODARYX

MODARYX / MODARYX MODS reste la plateforme web actuelle.

Ce checkpoint ne lance aucune migration MODARYX -> autre marque et ne mélange pas le produit web avec d'autres écosystèmes.

Les références historiques présentes dans le dépôt restent à classifier avant toute modification. Aucun remplacement global aveugle.

## 3. Nouvelle doctrine produit + viabilité commerciale

À partir de maintenant, la qualité produit et la viabilité économique avancent ensemble.

Objectif :
1. maximiser la valeur réelle, le plaisir, la confiance, l'accessibilité et l'utilité pour les utilisateurs ;
2. construire en parallèle une voie crédible vers des revenus durables.

Cela ne signifie pas :
- monétiser chaque fonction ;
- dégrader la version gratuite ;
- ajouter des paywalls artificiels ;
- sacrifier confiance, sécurité, accessibilité ou performance.

La préparation commerciale doit désormais couvrir au minimum :
- utilisateurs cibles et problèmes/jobs résolus ;
- proposition de valeur gratuite ;
- proposition de valeur payante éventuelle ;
- hypothèses de prix ;
- coûts d'infrastructure, support, paiement, fournisseurs et droits ;
- acquisition ;
- activation et rétention ;
- conversion et revenus ;
- paiements et remboursements ;
- support et abus ;
- droits/licences ;
- conformité ;
- plan de lancement ;
- critères mesurables de launch-readiness.

La VF technique et la launch-readiness commerciale restent deux gates distincts.

## 4. Séparation stricte de l'écosystème adulte

Le jeu 18+ et son futur site 18+ constituent ensemble un seul écosystème produit séparé.

Règle MODARYX :
- aucun contenu adulte user-facing ;
- aucune promotion du jeu/site 18+ dans MODARYX ;
- aucun funnel commercial croisé par défaut ;
- aucune identité visuelle ou marque adulte injectée dans MODARYX ;
- aucun compte/paiement partagé par défaut sans future décision explicite et revue légale/privacy.

Cette règle vaut pour les surfaces publiques et produit. Les notes techniques internes peuvent mentionner l'existence de la séparation uniquement pour l'imposer.

## 5. Profil / owner-history — état frais

Le profil distant authentifié avec Turnstile est désormais intégré dans la branche canonique.

Preuves fraîches avant fusion :
- proof éditeur ciblé : SUCCESS ;
- full-stack profile proof preview : SUCCESS ;
- VF readiness : SUCCESS ;
- performance candidate : SUCCESS ;
- accessibilité preview : SUCCESS ;
- product flows : SUCCESS.

Le blocker strict `real-data-history` reste OPEN :
1. login Auth0 humain réel ;
2. sauvegarde réelle via `RemoteProfileEditor` + Turnstile réel ;
3. lecture owner-scoped de l'historique correspondant ;
4. preuve production séparée ensuite.

Aucune identité synthétique / insertion SQL synthétique ne ferme ce blocker.

## 6. R2 — état frais

Préflight read-only effectué :
- adaptateur local : PASS candidate ;
- binding `MODARYX_ARTIFACTS` preview : ABSENT ;
- binding production : ABSENT ;
- token Pages existant pour métadonnées R2 : HTTP 403 / scope insuffisant ;
- aucune mutation R2 issue de ce préflight.

Un plan contrôlé R2 DEV existe mais n'a pas été exécuté.
Avant tout apply :
- re-vérifier la méthode exacte write/read/delete ;
- token R2 dédié minimal ;
- bucket DEV uniquement ;
- preview binding uniquement ;
- aucune production ;
- rollback fail-closed ;
- approbation explicite requise.

## 7. VF stricte

Le dernier état strict reste **19 blockers réels ouverts**, sauf preuve ciblée fraîche correspondant exactement au blocker.

DEV/candidate != production.

## 8. Commercial-readiness backlog initial MODARYX

À construire avant lancement commercial :
- segment utilisateur prioritaire ;
- promesse centrale de MODARYX ;
- modèle gratuit ;
- modèle premium/payant éventuel ;
- valeur créateur éventuelle ;
- structure de prix candidate ;
- coût par utilisateur / créateur ;
- droits et politique de contenus ;
- paiement/facturation/remboursement ;
- acquisition ;
- activation ;
- rétention ;
- métriques produit ;
- support ;
- abuse/fraud controls ;
- unit economics simples ;
- objectifs de lancement et seuils de validation.

Aucun prix, abonnement ou commission n'est canonique tant qu'une décision produit explicite et des éléments de marché/coûts ne le justifient.

## 9. Prochain ordre logique

1. continuer les micro-proofs techniques sans full replay ;
2. fermer owner-history avec un humain réel quand possible ;
3. poursuivre R2 DEV uniquement après prérequis/approbation ;
4. lancer en parallèle le workstream commercial MODARYX ;
5. garder les 19 blockers stricts séparés des avancées commerciales ;
6. cutover en dernier.

**Ce checkpoint supersède le checkpoint MODARYX V2 du 2026-10-07 13:20 pour les éléments qu'il met explicitement à jour.**
