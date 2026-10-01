# MODARYX — contrat Storage Resolver + Repair Network — 20 septembre 2026

Statut : **CONTRAT CIBLÉ ACQUIS — SERVICES DISTANTS NON CONNECTÉS**.

## Source existante

Le dépôt contient déjà deux contrats JSON structurés :

- `schemas/storage-resolver.schema.json`
- `schemas/repair-network.schema.json`

Ils sont référencés par `data/integration-readiness.json` via la capacité `storage.resolver-repair`, dont l'état reste `not-connected`.

## Séparation de marque / provenance

Les deux schémas portent encore des identifiants historiques :

- `urn:nova-forge:schemas:storage-resolver:v1`
- `urn:nova-forge:schemas:repair-network:v1`

Ces identifiants sont **conservés volontairement pour compatibilité et provenance technique**. Ils ne signifient pas que MODARYX devient Nova Forge, et ne doivent pas être renommés par remplacement global sans migration de schéma/version explicitement conçue.

MODARYX reste la plateforme web. Nova Forge reste le logiciel/OS.

## Invariants Storage Resolver

Le contrat impose :

- identité logique liée à `manifestSha256` + `artifactSha256` ;
- empreintes SHA-256 64 hex ;
- au moins une origine ;
- types d'origine bornés : HTTPS, object storage, mirror, P2P, IPFS ;
- vérification digest obligatoire ;
- binding manifeste obligatoire ;
- rejet du digest divergent ;
- rejet d'un alias mutable non fiable ;
- état de résolution explicite `unresolved | verified | failed` ;
- une résolution `verified` doit fournir l'origine sélectionnée et l'empreinte vérifiée ;
- une résolution `failed` doit fournir une raison.

## Invariants Repair Network

Le contrat est fail-closed et impose :

- vérification préalable par resolver ;
- digest exact ;
- binding manifeste exact ;
- substitution silencieuse interdite ;
- distribution d'une release révoquée interdite ;
- confiance implicite dans les alias mutables interdite ;
- releases `withdrawn` et `revoked` non distribuables ;
- résultat `repaired` uniquement sur release `active` ;
- une réparation réussie fournit origine + empreinte vérifiée ;
- les états d'échec restent non distribuables et motivés.

## Preuve ciblée

Checker :

- `qa/check-storage-repair-contracts.cjs`

Marker attendu :

- `PASS_TARGETED_STORAGE_REPAIR_CONTRACTS`

La preuve vérifie les invariants des deux schémas et leur raccordement à `integration-readiness.json`.

## Ce que cette preuve ne valide pas

Elle ne valide pas :

- un service de résolution distant ;
- un bucket R2 ou autre stockage réel ;
- un réseau de réparation actif ;
- des miroirs publics ;
- des manifests réellement signés ;
- une signature/attestation de provenance réelle ;
- un téléchargement public ;
- un artefact réel autorisé.

## État produit honnête

- **TERMINÉ — contrat Storage Resolver ciblé**.
- **TERMINÉ — protocole contractuel Repair Network ciblé**.
- **EN COURS — service Storage Resolver réel**.
- **EN COURS — exécution Repair Network réelle**.
- `integration-readiness.json` reste correctement `not-connected`.

Aucune réparation distante ne doit être annoncée tant qu'un service réel n'a pas prouvé la correspondance exacte d'identité, manifeste et empreinte.
