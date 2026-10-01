# MODARYX — runtime de découverte Guide / pont Nova Forge OS — 21 septembre 2026

Statut : **TERMINÉ — découverte et préparation d’activation ciblées ; services réels toujours non connectés**.

## Ajout

- `functions/_lib/integration-discovery.mjs`
- `qa/check-integration-discovery-runtime.mjs`

Le runtime peut maintenant effectuer une découverte minimale, bornée et sans credential :

- Guide MODARYX : endpoint HTTPS uniquement ;
- pont Nova Forge OS : HTTPS, ou HTTP uniquement sur loopback ;
- GET sans credentials, sans referrer, sans redirection ;
- réponse JSON bornée en taille ;
- identité produit et capacités supportées vérifiées avant préparation de l’activation ;
- consentement explicite toujours obligatoire pour passer de « disponible » à « activable ».

La frontière reste strictement `modaryx-web → nova-forge-os`. Aucun account linking, partage de session ou transfert de credential n’est introduit.

## Limites

- aucun Guide MODARYX réel n’est annoncé ;
- aucun runtime Nova Forge OS réel n’est annoncé ;
- la micro-preuve utilise uniquement des réponses injectées ;
- `data/integration-readiness.json` reste `not-connected`.

Marker : `PASS_TARGETED_INTEGRATION_DISCOVERY_RUNTIME`.
