# MODARYX V2 — Publisher inbound quarantine candidate — 2026-10-06

**État : archive/quarantaine candidate prouvée sur fake binding / mailbox production OPEN**

La slice prépare une archive opaque dédiée `MODARYX_INBOUND_ARCHIVE` :
- message RFC822 brut conservé comme octets ;
- headers bruts conservés comme octets ;
- SHA-256 message + headers ;
- clé d’archive dérivée sans adresse expéditeur brute ;
- état initial `CORRELATION_PENDING / PROVENANCE_UNVERIFIED / BLOCKED`.

Aucun contenu du message n’est exécuté.
Aucune pièce jointe n’est ouverte.
Aucun script, macro ou contenu actif n’est exécuté.

L’évaluation de readiness exige simultanément :
- archive présente ;
- corrélation avec une demande ;
- contact connu + domaine officiel ;
- SPF/DKIM/DMARC pass ;
- scan pièce jointe terminé si nécessaire.

Même alors, `authorizes=false` : l’interprétation des droits reste un contrat séparé.

Non implémentés :
- mailbox réelle ;
- webhook provider ;
- corrélation production ;
- vérification provenance production ;
- scanner malware réel ;
- routeur de réponse production.

Le blocker `publisher-response-parsing` / inbound production reste OPEN.
