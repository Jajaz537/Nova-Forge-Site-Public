# MODARYX V2 — Préflight production global — 2026-10-06

**État : candidat lecture seule / aucun blocker production fermé**

`GET /api/v1/production/readiness` agrège les préconditions techniques réellement observables sans secret et sans écriture.

Il vérifie notamment :
- binding D1 ;
- présence des **32 tables V2 actuellement requises** via `sqlite_master` en lecture seule ;
- fondation Auth0 + Turnstile ;
- R2 lecture/écriture ;
- readiness providers ;
- email/push ;
- collecteur CWV ;
- états PWA/cutover explicitement externes.

Même lorsque toutes les préconditions techniques sont présentes :
- `productionPass` reste toujours `false` ;
- Auth configurée ≠ passkey réelle sur appareil ;
- D1 complet ≠ historique/données production prouvés ;
- R2 présent ≠ provider production validé ;
- collecteur CWV prêt ≠ p75 terrain ;
- Service Worker candidat ≠ activation production ;
- cutover reste une action explicite.

Aucune migration, aucun provider, aucun secret, aucun DNS/Cloudflare critique et aucun cutover n’est modifié.
