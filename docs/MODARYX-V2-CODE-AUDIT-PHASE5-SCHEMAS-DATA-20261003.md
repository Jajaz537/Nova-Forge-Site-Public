# MODARYX V2 — Audit exhaustif anti-contamination — Phase 5 Schémas et données

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre

Inspecté :

- `schemas/*.json`
- `data/*.json`

## 2. Finding transversal — namespaces historiques

Plusieurs schémas utilisent encore :

- `urn:nova-forge:schemas:...`
- titres `Nova Forge ...`
- description Nova Forge

Exemples :

- account-security
- collection
- community-submission
- community-write
- compatibility-graph
- moderation-export
- moderation-receipt
- public-profile
- publication-receipt
- repair-network
- search-adapter
- smart-profile
- storage-resolver
- universal-mod-manifest

### Risque

Confusion d'identité si ces IDs historiques sont repris dans de nouveaux contrats V2.

### Décision

**HISTORIQUE / COMPATIBILITÉ**

- ne pas renommer les IDs v1 en place ;
- ne pas créer de nouveaux schémas MODARYX V2 sous namespace Nova Forge ;
- créer des IDs `urn:modaryx:schemas:...` pour V2 ;
- mapper explicitement v1 → v2.

## 3. Schémas déjà MODARYX

Déjà correctement namespacés :

- `integration-readiness.schema.json`
- `modaryx-guide-connection.schema.json`
- `nova-forge-os-bridge.schema.json`
- `signature-attestation.schema.json`
- `trusted-signer-set.schema.json`

### Classification

**RÉUTILISABLE / À VERSIONNER si évolution**

## 4. account-security v1

Forces :

- passkey records sans private key ;
- sessions ;
- recovery ;
- privileged re-auth ;
- device label ;
- session revocation.

### Risque

ID/titre Nova Forge historique.

### Classification

**RÉUTILISABLE COMME CONTRAT HISTORIQUE / À MAPPER**

V2 devra conserver les mêmes garanties sous identité MODARYX.

## 5. collection v1

Forces :

- private-local par défaut ;
- sync state ;
- item IDs uniques.

Limites :

- simple liste d'IDs ;
- pas de curateur structuré ;
- pas de notes/item ;
- pas de version ;
- pas de distinction modpack/profile.

### Classification

**À REMPLACER PAR COLLECTION V2, v1 CONSERVÉ POUR COMPAT**

## 6. community-submission v1

Forces :

- local-only ;
- local-draft ;
- not-submitted ;
- règles distinctes discussion/review/comment.

### Classification

**RÉUTILISABLE COMME FORMAT LEGACY LOCAL**

V2 ne doit pas le traiter comme publication distante.

## 7. community-write v1

### Finding

Inclut encore :
- `collection-update`
- target contentId/contentVersion
- moderation/abuse shield

### Risque

Collection write et publication community sont mélangés dans un même intent.

### Classification

**À REVALIDER / À SCINDER EN V2**

## 8. compatibility-graph v1

Forces :

- graph explicite ;
- evidence measured/estimated/unknown ;
- receipt requis si measured.

Limites :

- relations limitées ;
- compatibilité pas assez multidimensionnelle ;
- pas de declared ;
- pas de release-first complète.

### Classification

**À EXTRAIRE / MAPPER VERS CompatibilityClaim V2**

## 9. integration-readiness

### Force

C'est un excellent garde-fou de vérité opérationnelle :

- local-only ;
- contract-ready ;
- blocked-inputs ;
- not-connected ;
- distribution-locked.

### Classification

**RÉUTILISABLE**

Mais les capability IDs et chemins devront être mis à jour lors de V2.

## 10. Guide / OS bridge

Ces schémas respectent :

- consentement ;
- moindre privilège ;
- sessionSharing=false ;
- credentialForwarding=false ;
- séparation `modaryx-web` / `nova-forge-os`.

### Classification

**RÉUTILISABLE**

## 11. Moderation receipt/export

Forces :

- receipts ;
- appeals ;
- outcomes ;
- provenance ;
- immutable structure ;
- legal-hold explicitement distingué.

### Risque

Namespace/titre Nova Forge historique.

### Classification

**RÉUTILISABLE COMME v1 / À VERSIONNER V2**

## 12. public-profile v1

### Finding critique

Le profil public contient directement :

- `collections`

Cela contredit le modèle V2 séparant :
- Profile
- Creator
- Team
- Collection.

### Classification

**À ADAPTER / V1 COMPAT**

Ne pas porter `collections` comme propriété intrinsèque du profil V2.

## 13. publication-receipt v1

Forces :

- release identity ;
- manifest digest ;
- artifact digests ;
- provenance ;
- rights ;
- moderation ;
- release state ;
- distributable fail-closed.

### Classification

**RÉUTILISABLE COMME FONDATION**

À mapper vers Release/FileArtifact V2.

## 14. repair-network / storage-resolver

Forces :

- digest strict ;
- identité logique stable ;
- pas de substitution ;
- revoked/withdrawn non distribuable.

### Classification

**RÉUTILISABLE**

Namespace historique à ne pas reproduire dans les futurs schémas.

## 15. search-adapter

Forces :

- `requiredForCore=false`
- identité locale préservée ;
- budget explicite ;
- surge mode local-only.

### Classification

**RÉUTILISABLE**

Mais il ne remplace pas le futur `SearchDocument` V2.

## 16. signature-attestation / trusted-signer-set

Forces :

- provider-neutral ;
- public key only ;
- state explicite ;
- no-trust-anchor possible ;
- revocation.

### Classification

**RÉUTILISABLE**

## 17. smart-profile v1

### Nature

Observation navigateur locale :
- hardwareConcurrency ;
- deviceMemory ;
- screen width ;
- DPR ;
- recommandation estimée ;
- aucune garantie FPS/stabilité.

### Risque

Le nom “Smart Profile” peut être confondu avec Profile/Loadout V2.

### Classification

**À RENOMMER CONCEPTUELLEMENT EN V2**

Ne pas mélanger :
- performance/browser recommendation ;
- mod profile/loadout.

## 18. Universal Mod Manifest v1

Forces :

- rights ;
- provenance ;
- files ;
- SHA-256 ;
- distribution ;
- dependencies/conflicts ;
- compatibility evidence.

Limites déjà confirmées :

- ContentItem + Release mélangés ;
- `kind` trop grossier ;
- target insuffisamment extensible ;
- relation optional bool trop pauvre ;
- compatibility globale.

### Classification

**À MAPPER, JAMAIS À ÉCRASER**

## 19. data/catalog.json

### État

Catalogue de démonstration.

### Règles

- ne pas convertir automatiquement en corpus réel ;
- conserver pour fixtures/tests ;
- ne pas montrer comme preuve de catalogue V2 public.

### Classification

**FIXTURE / HISTORIQUE**

## 20. data/compatibility-graph.json

### Nature

Graph de démonstration lié aux IDs V1.

### Classification

**FIXTURE / À REVALIDER**

Ne pas utiliser comme source de compatibilité V2 réelle.

## 21. data/integration-readiness.json

### Force

Contient des gates utiles et explicites.

### Finding important

Il porte encore des états historiques comme :
- account not-connected ;
- community local-only ;
- distribution locked ;
- integrations not-connected.

Ces états doivent être lus comme preuve de cette version de données, pas comme vérité éternelle.

### Classification

**RÉUTILISABLE COMME READINESS LEDGER / À ACTUALISER AVEC PREUVE**

## 22. data/living-world.json

### Forces

- progression partagée ;
- day phases ;
- companions ;
- reduced motion ;
- asset policy.

### Findings

- vocabulaire “royaume” historique ;
- `visualGrowth.status = awaiting-assets`
- slots loup/dragon encore `null`
- `environmentAsset = null`

### Risque

Ne pas prétendre que les couches finales existent.

### Classification

**À EXTRAIRE / BRAND DATA HISTORIQUE**

Le modèle temporel peut être conservé ; le canon visuel final reste à valider.

## 23. data/search-index.json

### Finding critique

Index encore couplé aux routes V1 :

- `./catalog.html`
- `./creator-studio.html`
- `./profiles.html`
- `./community.html`
- `./project-*.html`
- `./games/index.html`
- hubs legacy

Il contient aussi des contenus de démonstration.

### Classification

**À BLOQUER POUR V2 / RECONSTRUIRE**

Le principe preindexed-local est conservé, pas les entrées.

## 24. data/trusted-signers.json

### État prouvé

- `state = no-trust-anchor-published`
- `signers = []`

### Conséquence

Aucune chaîne de signature production ne doit être présentée comme active.

### Classification

**RÉUTILISABLE / BLOQUE DISTRIBUTION SIGNÉE PROD TANT QUE VIDE**

## 25. Matrice

| Élément | Classification V2 |
|---|---|
| Schemas Nova Forge v1 | HISTORIQUE / COMPAT / MAPPER |
| Schemas MODARYX v1 | RÉUTILISABLE / VERSIONNER |
| Universal Mod Manifest | À MAPPER |
| Collection v1 | À REMPLACER V2 |
| Public Profile v1 | À ADAPTER |
| Compatibility Graph | À MAPPER |
| Search Adapter | RÉUTILISABLE |
| Publication Receipt | RÉUTILISABLE |
| Trust / Attestation | RÉUTILISABLE |
| Storage / Repair | RÉUTILISABLE |
| catalog.json | FIXTURE |
| compatibility-graph.json | FIXTURE |
| integration-readiness.json | READINESS LEDGER |
| living-world.json | BRAND DATA À EXTRAIRE |
| search-index.json | À BLOQUER / RECONSTRUIRE |
| trusted-signers.json | GATE RÉEL, AUCUN SIGNER ACTIF |

## 26. Règle V2

Aucune donnée ou schéma V1 ne devient “V2” par simple réutilisation de fichier.

Il faut :
- version ;
- mapper ;
- tests ;
- compatibilité consumers ;
- namespace correct ;
- absence de faux claim.

**État Phase 5 : TERMINÉ pour `schemas/` et `data/`. Audit global : EN COURS.**
