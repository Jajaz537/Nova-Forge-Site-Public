# MODARYX — contrats de provenance, publication et modération — 20 septembre 2026

Statut : **CONTRATS CIBLÉS ACQUIS — SIGNATURE / ATTESTATION RÉELLE NON CONNECTÉE**.

## Sources existantes

Le dépôt contient déjà :

- `schemas/publication-receipt.schema.json`
- `schemas/moderation-receipt.schema.json`
- `schemas/moderation-export.schema.json`
- `qa/check-receipt-fields.cjs`

Ces contrats alimentent les capacités `community.publication-moderation` et `distribution.artifacts` dans `data/integration-readiness.json`.

## Provenance historique des IDs

Les schémas utilisent encore les IDs historiques :

- `urn:nova-forge:schemas:publication-receipt:v1`
- `urn:nova-forge:schemas:moderation-receipt:v1`
- `urn:nova-forge:schemas:moderation-export:v1`

Ils restent conservés pour compatibilité et provenance technique. Ils ne signifient pas que MODARYX et Nova Forge partagent une identité produit.

## Publication receipt

Le contrat lie une release à :

- un `contentId` + version ;
- un digest d'identité SHA-256 ;
- un créateur référencé ;
- un manifeste SHA-256 ;
- un ou plusieurs artefacts avec digest + taille ;
- un état de provenance ;
- un état de droits ;
- un état de modération ;
- un état de release et une date.

Une release ne peut être `distributable: true` que si :

- `releaseState = published` ;
- `provenanceState = verified` ;
- `rightsState = verified` ;
- `moderationState = clear`.

Une release `withdrawn` / `revoked`, ou modérée `removed` / `restricted`, est fail-closed et non distribuable.

## Moderation receipts

Le contrat modération distingue :

- notice ;
- décision ;
- appel ;
- résultat d'appel.

Les notices sont explicitement immuables. Les décisions portent une action, une portée, une durée et une `statementOfReasons`. Les appels et résultats d'appel possèdent leurs liens de receipt.

Le schéma se décrit comme architecture « DSA-ready » mais précise explicitement que cela **ne constitue pas une déclaration de conformité juridique**.

## Export de modération

Le contrat d'export impose :

- enveloppe provider-neutral ;
- politique de rétention explicite ;
- expiration lorsque le legal hold n'est pas actif ;
- `legalHold = true` lorsque la politique est `legal-hold`.

## Limite essentielle : receipt ≠ attestation cryptographique

Le champ local `receipt:...` du Creator Studio vérifie uniquement un format et les exigences de saisie.

Le checker existant contient explicitement le scénario :

- « Correct format clears error **without attesting authenticity** ».

Donc :

- un receipt bien formé n'est pas une signature ;
- un receipt bien formé ne prouve pas la provenance ;
- un receipt bien formé ne crée pas un service d'attestation ;
- aucune distribution réelle ne doit être déverrouillée sur cette seule base.

## Preuve ciblée

Checker :

- `qa/check-provenance-receipt-contracts.cjs`

Marker :

- `PASS_TARGETED_PROVENANCE_RECEIPT_CONTRACTS`

La preuve doit conserver :

- `community.publication-moderation = local-only` ;
- `distribution.artifacts = distribution-locked`.

## État produit honnête

- **TERMINÉ — contrats publication/provenance/modération ciblés**.
- **TERMINÉ — sémantique fail-closed de distribution ciblée**.
- **EN COURS — signer/attester réel**.
- **EN COURS — publication/modération distante réelle**.
- **BLOQUÉ — distribution publique tant qu'artefact + droits + provenance + attestation/signature requise ne sont pas prouvés**.

Aucun receipt local ne doit être présenté comme preuve cryptographique.
