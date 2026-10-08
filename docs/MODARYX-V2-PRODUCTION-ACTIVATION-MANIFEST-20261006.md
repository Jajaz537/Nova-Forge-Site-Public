# MODARYX V2 — Manifeste d’activation production contrôlée — 2026-10-06

**État : PRÉPARÉ / NON EXÉCUTÉ / CUTOVER NON AUTORISÉ**

Ce manifeste relie les contrats déjà prouvés aux actions qui seraient nécessaires plus tard pour une activation réelle. Il ne contient aucune commande de mutation distante.

## Unités verrouillées

- D1 remote : DEV explicite d’abord, backup/export, post-proof, restauration, puis approbation production séparée.
- R2 : bucket/binding réels + micro-preuve hash/read/write + approbation.
- Auth/passkeys : configuration origine production + passkey appareil réel + cookie/session + Turnstile.
- Email/push : aucun provider sélectionné aujourd’hui ; dispatch reste absent.
- PWA : `VITE_MODARYX_PWA_PRODUCTION=1` seulement après preuve origine production + rollback.
- CWV terrain : double gate client/server + rétention approuvée + trafic réel + p75 LCP/INP/CLS.
- Météo : optionnelle et peut rester `off`; tout provider réel exige termes/licence/attribution.
- Cutover : aucune autorisation tant qu’un blocker VF requis reste OPEN.

## Interdictions

Ce paquet n’applique pas D1, ne crée pas de bucket R2, ne modifie aucun binding/secret, n’active pas de provider, n’envoie aucun email/push, n’active ni PWA ni RUM, ne retire pas le noindex, ne modifie ni DNS ni Cloudflare critique et n’effectue aucun cutover.

Les **19 blockers externes/production réels** restent OPEN jusqu’à preuve séparée.
