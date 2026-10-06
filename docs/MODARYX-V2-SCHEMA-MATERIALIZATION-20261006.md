# MODARYX V2 — Matérialisation des schémas — 2026-10-06

**État : candidat implémenté / migration de données NON exécutée**

## Décision

Les 13 familles prévues par le plan sont matérialisées sous `schemas/v2/` avec des identifiants `urn:modaryx:schemas:*:v2`.

Aucun schéma historique n'est écrasé.

## Frontières

- ContentItem stable / Release versionnée.
- Collection éditoriale distincte de Modpack installable.
- Profil de jeu local-first, privé par défaut ; partage public exige un receipt de consentement explicite.
- Dépendances `required/optional/recommended/incompatible/replaces`.
- `replaces` n'est qu'une relation : aucune substitution automatique.
- Claim mesuré exige un receipt.
- Provenance vérifiée exige un receipt.
- Artefact/release retiré ou révoqué reste non téléchargeable.
- Creator public ne transporte aucune autorité admin.
- SearchDocument garde l'identité stable même si le libellé change.

## Terminologie

Les identifiants internes sont suffisamment stables pour le candidat de données.
Le débat humain résiduel **Profils de jeu / Configurations de jeu** reste un sujet de libellé UI et n'est pas transformé en schéma concurrent.

## Non effectué

- aucune migration D1 ;
- aucune conversion de fixture en catalogue réel ;
- aucune écriture de production ;
- aucune suppression de schéma v1 ;
- aucun cutover.

La migration réelle reste fail-closed jusqu'à une lane dédiée.
