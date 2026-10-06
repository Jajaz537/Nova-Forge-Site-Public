# MODARYX V2 — Probe de preuve production lecture seule — 2026-10-06

**État : préparé / non exécuté contre une origine production autorisée**

Le probe n'utilise que GET/HEAD. Il vérifie root/noindex, backend status, session anonyme, providers, readiness email/push, readiness du collecteur CWV, refus de l'historique anonyme et présence de l'asset Service Worker selon le mode.

Il ne mesure jamais les Core Web Vitals terrain : LCP/INP/CLS p75 restent une preuve externe.

Aucune écriture, aucun compte connecté, aucun email/push, aucun DNS/DNSSEC/nameserver, aucun réglage Cloudflare critique et aucun cutover.

Modes :
- PRE_CUTOVER : origine candidate encore noindex ;
- POST_CUTOVER : origine réellement publiée/indexable.

Un probe PRE_CUTOVER vert ne ferme aucun blocker production.


## Extension CWV

Le probe appelle désormais `GET /api/v1/rum/cwv` uniquement pour lire :
- `DISABLED` ;
- `STORAGE_MISSING` ;
- ou `READY_FOR_FIELD_TRAFFIC`.

Ce GET ne collecte aucune métrique et ne peut jamais fermer le blocker `core-web-vitals-production`. Les p75 LCP/INP/CLS doivent toujours provenir de trafic production réel suffisant.
