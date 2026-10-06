# MODARYX V2 — Preuve performance candidat — 2026-10-06

**État : preuve laboratoire ciblée uniquement**

Le root `v2/` est mesuré dans Chrome headless sur deux profils synthétiques desktop/mobile, avec cache froid, réseau et CPU contraints.

Contrôles :
- bundle JS/CSS gzip ;
- LCP laboratoire ;
- CLS laboratoire ;
- réponse visuelle d'une navigation SPA.

Ces mesures sont des garde-fous de non-régression. Elles **ne valent pas Core Web Vitals production p75** ni validation appareil réel/Safari.

Le blocker `core-web-vitals-production` reste **OPEN** jusqu'à mesure sur l'origine production réelle.

Aucun DNS, DNSSEC, nameserver, IONOS, Cloudflare critique, `main` ou cutover n'est modifié.
