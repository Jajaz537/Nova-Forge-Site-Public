# MODARYX V2 — Gouvernance API et compatibilité

**Date : 2026-10-03**
**Statut : conception — aucune API V2 publiée**

## 1. Objectif

Éviter que le frontend, un futur manager, des intégrations ou des outils créateurs cassent à chaque évolution de contrat.

## 2. Principes

- changements additifs préférés ;
- champs existants stables ;
- versionnement explicite ;
- dépréciation documentée ;
- migration guidée ;
- période de transition ;
- compatibilité testée.

## 3. Stabilité

Classer les API/contrats futurs :

- experimental ;
- beta ;
- stable ;
- deprecated.

Une API stable ne doit pas changer de sémantique silencieusement.

## 4. Dépréciation

Toute dépréciation doit préciser :
- élément concerné ;
- raison ;
- remplacement ;
- date d'annonce ;
- date minimale de retrait ;
- guide de migration.

Ne pas supprimer un endpoint ou champ stable sans fenêtre de migration.

## 5. Versionnement

Options possibles :
- version dans URL ;
- version de schéma ;
- version de media type ;
- négociation explicite.

Le choix final doit rester uniforme.

## 6. Contrats JSON

Règles :
- IDs stables ;
- champs requis limités ;
- champs additifs tolérés par les consumers lorsque politique le permet ;
- enums évolués avec prudence ;
- dates ISO 8601 ;
- états documentés.

## 7. Frontend V2

Le frontend doit utiliser des clients centralisés, pas des fetch dispersés.

Chaque client gère :
- auth ;
- validation ;
- errors ;
- retry ;
- version ;
- timeout ;
- cache policy.

## 8. Manager futur

Le protocole web → manager doit avoir :
- version ;
- capability negotiation ;
- identity ;
- consent ;
- backward compatibility.

Une version incompatible doit produire un état explicite, pas un échec opaque.

## 9. Webhooks / événements futurs

Si introduits :
- versionner payload ;
- signature ;
- idempotency ;
- replay protection ;
- retry policy.

## 10. Search adapter

Le moteur externe reste optionnel.

Une évolution de l'adapter ne doit jamais empêcher le core local de fonctionner.

## 11. Tests

Pour toute évolution stable :
- contract tests ;
- fixture ancienne ;
- fixture nouvelle ;
- consumer compatibility ;
- rollback.

## 12. Documentation

Chaque endpoint/capacité doit documenter :
- objectif ;
- auth ;
- permissions ;
- request ;
- response ;
- errors ;
- states ;
- version ;
- deprecation status.

## 13. Gate

Avant publication d'une API V2 :
- politique de versioning ;
- politique de dépréciation ;
- contract tests ;
- changelog ;
- migration guidance ;
- owner.

**État : TERMINÉ pour la gouvernance de conception / NON IMPLÉMENTÉ volontairement.**
