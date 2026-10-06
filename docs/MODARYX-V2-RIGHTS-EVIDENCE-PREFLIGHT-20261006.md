# MODARYX V2 — Rights evidence & license preflight — 2026-10-06

**État : candidat local prouvé / blockers production toujours OPEN**

Cette slice matérialise la chaîne préparatoire sans contacter un éditeur et sans accorder de droit.

Elle ajoute :
- preuve de contact officiel issue uniquement de sources autorisées ;
- stockage d’un digest de référence de contact, jamais d’adresse brute par cette slice ;
- ingestion admin d’une réponse déjà reçue sous forme de preuves/digests ;
- interprétation fail-closed des scopes : tout langage d’autorisation part en `LEGAL_REVIEW_REQUIRED` ;
- préflight licence qui peut devenir `ELIGIBLE_FOR_MANUAL_DECISION` seulement avec contact vérifié, réponse archivée/provenancée, asset lié, conditions satisfaites et référence de revue juridique ;
- le préflight retourne toujours `authorizes:false` et n’écrit jamais de décision `GRANTED`.

Ne sont **pas** exécutés ici :
- découverte réelle des contacts éditeurs ;
- envoi sortant ;
- mailbox/webhook entrant ;
- revue juridique réelle ;
- écriture finale d’une autorisation ;
- migration D1 distante ;
- cutover.

Les blockers `official-contact-discovery`, `publisher-outbound`, `publisher-response-parsing`, `license-validation` et `legal-review-where-required` restent OPEN jusqu’aux preuves externes/réelles correspondantes.
