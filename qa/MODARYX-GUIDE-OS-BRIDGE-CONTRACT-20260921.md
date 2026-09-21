# MODARYX — contrats Guide connecté + pont Nova Forge OS — 21 septembre 2026

Statut : **TERMINÉ — contrats source ciblés ; services réels non connectés**.

## Séparation obligatoire

- MODARYX / MODARYX MODS reste la plateforme web.
- Nova Forge OS reste le logiciel distinct.
- Le Guide MODARYX est un composant de la plateforme web et ne devient pas « Nova Guide ».
- Le pont OS est optionnel et ne fusionne ni identité, ni session, ni compte.

## Contrats ajoutés

- `schemas/modaryx-guide-connection.schema.json`
- `schemas/nova-forge-os-bridge.schema.json`

## Invariants

Guide MODARYX :

- consentement explicite obligatoire ;
- connexion optionnelle ;
- scopes bornés et de moindre privilège ;
- aucune session partagée implicitement ;
- aucun credential fournisseur transmis ;
- aucune télémétrie distante requise par défaut.

Pont Nova Forge OS :

- frontière produit explicite `modaryx-web → nova-forge-os` ;
- consentement explicite avant état `connected` ;
- permissions demandées et accordées séparées ;
- aucun account linking implicite ;
- aucune session partagée ;
- aucun credential forwarding ;
- endpoint local et version de protocole requis seulement lorsque réellement connecté.

## État produit

`data/integration-readiness.json` reste `not-connected`.

Ces contrats ferment l'absence de protocole source mais **ne livrent ni le Guide connecté ni le runtime du pont OS**.

Checker : `qa/check-guide-os-bridge-contracts.cjs`

Marker : `PASS_TARGETED_GUIDE_OS_BRIDGE_CONTRACTS`.
