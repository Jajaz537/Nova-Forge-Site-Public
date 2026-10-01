# MODARYX — contrats de plateforme locale — 20 septembre 2026

Statut : **CONTRATS LOCAUX CIBLÉS ACQUIS — AUCUN SERVICE DISTANT AJOUTÉ**.

## Périmètre

- `public-status.json`
- `schemas/smart-profile.schema.json`
- `schemas/collection.schema.json`
- `schemas/compatibility-graph.schema.json`
- `data/compatibility-graph.json`
- `schemas/search-adapter.schema.json`

## Principes publics

Le statut public conserve :

- static-first ;
- local-first ;
- fail-closed ;
- public-only ;
- aucun compte requis pour la surface statique ;
- aucune télémétrie distante obligatoire ;
- aucune dépendance runtime tierce obligatoire ;
- cache service worker limité à une allowlist publique ;
- aucun cache arbitraire des GET same-origin ;
- un hash correspondant ne prouve pas la provenance.

## Smart Profile

Le contrat Smart Profile est strictement browser-local.

Il distingue :
- `measured`
- `estimated`
- `unknown`

Un état `unknown` doit être lié à une source indisponible et une valeur nulle.

La recommandation reste `estimated`.

Le contrat garantit explicitement :
- `fps = false`
- `stability = false`

Donc aucune recommandation de profil ne doit être transformée en garantie de performance.

## Collections

Le contrat collection conserve :
- visibilité explicite ;
- défaut `private-local` ;
- identifiants d'items uniques ;
- état de synchronisation explicite.

Le statut public actuel reste cependant :
- `browser-local-drafts`
- `local-only`
- `local-draft`
- `not-submitted`
- aucune écriture distante.

## Graphe de compatibilité

Le contrat distingue `demonstration` de `published`.

Une arête `measured` exige un `evidenceReceipt`.

Les données actuelles sont explicitement :
- `dataClass = demonstration`
- aucune arête `measured`.

Les relations actuelles ne constituent donc pas une preuve de compatibilité réelle.

## Search adapter

L'adaptateur de recherche externe est optionnel.

Contrat :
- `requiredForCore = false`
- identité locale préservée ;
- coût borné ;
- états `disabled | configured | degraded`.

Le statut public courant déclare :
- `external_search_adapter = not_required`

La recherche locale pré-indexée reste donc la source de disponibilité cœur.

## Intégrations distantes

Le statut public garde explicitement :
- pont Nova Forge OS : `not_connected`
- Storage Resolver : `not_connected`
- Repair Network : `not_connected`
- backend communautaire : `not_connected`

Cette preuve ne ferme aucun de ces services.

## Preuve ciblée

Checker :
- `qa/check-local-platform-contracts.cjs`

Marker :
- `PASS_TARGETED_LOCAL_PLATFORM_CONTRACTS`

## État honnête

- **TERMINÉ — contrats locaux Smart Profile / collection / compatibilité / search adapter ciblés**.
- **TERMINÉ — garde public-status local-first/fail-closed ciblée**.
- **EN COURS / NON CONNECTÉ — toutes les intégrations distantes explicitement ouvertes dans le registre**.

Les IDs historiques Nova Forge des schémas sont conservés pour compatibilité/provenance technique et ne fusionnent pas Nova Forge OS avec MODARYX.
