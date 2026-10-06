# MODARYX V2 — Probe de preuve production lecture seule — 2026-10-06

**État : préparé / non exécuté contre une origine production autorisée**

Le probe n'utilise que GET/HEAD. Il vérifie root/noindex, backend status, session anonyme, providers, readiness email/push, refus de l'historique anonyme et présence de l'asset Service Worker selon le mode.

Il ne mesure jamais les Core Web Vitals terrain : LCP/INP/CLS p75 restent une preuve externe.

Aucune écriture, aucun compte connecté, aucun email/push, aucun DNS/DNSSEC/nameserver, aucun réglage Cloudflare critique et aucun cutover.

Modes :
- PRE_CUTOVER : origine candidate encore noindex ;
- POST_CUTOVER : origine réellement publiée/indexable.

Un probe PRE_CUTOVER vert ne ferme aucun blocker production.
