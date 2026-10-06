# MODARYX V2 — Classification du runtime desktop hors gate VF web — 2026-10-06

La séparation officielle du projet est prioritaire :

- Nova Forge = logiciel / OS ;
- MODARYX = plateforme web.

Le document historique `MODARYX-V2-FORGE-HANDOFF-CONTRACT-20261004.md` décrit un desktop nommé « MODARYX Forge ». Cette appellation est incompatible avec la séparation officielle actuelle et ne doit pas déclencher une migration d'identité ni un développement desktop depuis le dépôt web.

Décision pour le gate **MODARYX web site VF** :
- conserver le document historique pour provenance ;
- ne pas effectuer de remplacement global ;
- reclasser les six blockers runtime desktop en `OUT_OF_SCOPE_SITE_VF_OFFICIAL_SEPARATION` ;
- conserver seulement les contrats web sûrs de non-action/handoff comme historique préparatoire ;
- aucun PASS Nova Forge OS n'est dérivé de cette reclassification.

Cette décision ne dit pas que le runtime desktop est terminé. Elle dit seulement qu'il n'appartient pas au gate de finalisation du **site web MODARYX**.
