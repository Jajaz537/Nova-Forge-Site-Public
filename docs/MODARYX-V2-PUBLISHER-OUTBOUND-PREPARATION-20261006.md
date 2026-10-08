# MODARYX V2 — Publisher outbound preparation candidate — 2026-10-06

**État : préparation locale prouvée / aucun envoi réel**

La slice implémente uniquement le passage `CONTACT_VERIFIED → REQUEST_READY`.

Elle vérifie avant préparation :
- Rights Case existant et prêt ;
- contact officiel vérifié ;
- canal officiel autorisé ;
- scopes/surfaces inclus dans le Rights Case ;
- template courant `publisher-rights-v1` ;
- absence de refus/opt-out actif enregistré ;
- idempotency key SHA-256 unique.

Le stockage ne contient **aucune adresse de contact brute** : uniquement le digest de référence déjà vérifié.

Le système retourne explicitement :
- `state=REQUEST_READY` ;
- `queueAllowed=false` ;
- `dispatchImplemented=false` ;
- blocker `outbound-provider-not-implemented`.

Aucun provider, aucune identité expéditeur, aucun webhook transport et aucun envoi réseau ne sont implémentés.

Le blocker `publisher-outbound` reste **OPEN** jusqu'à provider réel, sender identity, queue/transport, bounce handling, reply correlation et preuve d'envoi contrôlée.
