# MODARYX V2 — Adapter R2 stockage artefacts — 2026-10-06

**État : adapter candidat prouvé sur faux binding / binding R2 réel OPEN**

Cette slice prépare le code d'accès au futur binding `MODARYX_ARTIFACTS` sans créer de bucket, sans configurer Cloudflare et sans écrire à distance.

Garanties :
- clé objet dérivée de release + file id + SHA-256 + nom sûr ;
- rejet de traversal ;
- SHA-256 et taille vérifiés avant stockage ;
- SHA-256 et taille revérifiés après lecture ;
- metadata R2 cohérente contrôlée ;
- artefact withdrawn/revoked/archived non téléchargeable ;
- absence de binding = 503 fail-closed.

La micro-preuve utilise exclusivement un faux binding mémoire.

Cette slice **ne ferme pas** R2/production :
- aucun bucket réel créé ;
- aucun binding réel configuré ;
- aucune écriture artefact distante ;
- distribution backend production encore OPEN ;
- scan/signature/provenance production restent des dépendances séparées.
