# MODARYX V2 — Contexte vivant saison + heure + météo — 2026-10-06

**État : candidat implémenté / fournisseur météo non activé**

Cette slice intègre l'idée retenue pour la VF : faire vivre MODARYX avec le contexte réel de l'utilisateur sans popup GPS et sans sacrifier la confidentialité.

## Flux

La V2 appelle uniquement `/api/local-context` en same-origin.

Le serveur existant :
- exploite le contexte réseau approximatif Cloudflare lorsqu'il est disponible ;
- arrondit les coordonnées fournisseur ;
- ne renvoie ni ville, ni code postal, ni coordonnées exactes ;
- ne demande jamais `navigator.geolocation` ;
- garde la météo provider-off par défaut tant qu'aucun fournisseur n'est activé.

La V2 transforme ensuite :
- mois + bande climatique → saison ;
- timezone + heure locale → phase jour/nuit ;
- météo normalisée live → lentille visuelle légère.

## Design

Le canon reste prioritaire :
- bleu nuit sombre ;
- violet secondaire ;
- cyan réservé aux actions/états forts.

Le contexte vivant ajuste seulement la profondeur lumineuse et thermique du fond. Aucun système de particules, pluie/neige plein écran ou animation intrusive n'est ajouté.

## Fail-soft

Si le endpoint, la timezone ou la météo échouent :
- le site continue normalement ;
- la navigation et le contenu ne dépendent jamais de cette donnée ;
- aucune météo n'est inventée.

## Blocker provider

Cette slice **ne ferme pas** `providers-connectors-real`.

Pour le fermer il faudra encore :
- accepter explicitement un fournisseur/licence ;
- activer son secret serveur de manière contrôlée ;
- prouver le proxy avec données réelles ;
- contrôler attribution, disclaimer, limites/cache et confidentialité.
