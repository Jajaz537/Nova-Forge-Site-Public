# MODARYX — moteur de consentement Guide / pont Nova Forge OS — 21 septembre 2026

Statut : **TERMINÉ — gate de consentement/permissions ciblé ; services réels non connectés**.

## Implémentation

- `functions/_lib/integration-consent.mjs`
- `qa/check-integration-consent-engine.mjs`

Le moteur ne découvre ni ne contacte aucun service. Il décide uniquement si une connexion déjà décrite peut être activée.

## Guide MODARYX

- consentement obligatoire ;
- les scopes accordés doivent rester un sous-ensemble des scopes demandés ;
- endpoint distant HTTPS uniquement ;
- aucune session partagée ;
- aucun credential forwarding ;
- aucune télémétrie distante requise par défaut.

## Pont Nova Forge OS

- frontière produit explicite `modaryx-web → nova-forge-os` ;
- permissions accordées ⊆ permissions demandées ;
- consentement obligatoire ;
- endpoint local HTTPS, ou HTTP uniquement sur loopback ;
- version de protocole explicite ;
- account linking implicite, session sharing et credential forwarding interdits.

Marker : `PASS_TARGETED_INTEGRATION_CONSENT_ENGINE`.

## Limite

Le Guide MODARYX réel et le runtime du pont côté Nova Forge OS restent **EN COURS**. Ce moteur ne les simule pas et n'établit aucune connexion réseau.
