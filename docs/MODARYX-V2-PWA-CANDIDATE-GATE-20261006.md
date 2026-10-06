# MODARYX V2 — Gate PWA candidat — 2026-10-06

**État : EN COURS jusqu'à micro-preuve / production non activée**

Le root `v2/` reçoit un hook d'enregistrement Service Worker explicitement verrouillé par `VITE_MODARYX_PWA_PRODUCTION=1`.

Par défaut :
- aucun Service Worker n'est enregistré automatiquement ;
- le candidat reste noindex ;
- aucun cutover n'est déclenché.

La micro-preuve doit démontrer deux builds isolés :
1. build par défaut : zéro registration, zéro cache candidat ;
2. build avec flag : enregistrement automatique de `/sw-v2.js`, scope `/`, contrôle après navigation, puis navigation offline avec l'origine arrêtée.

Cette preuve prépare le code. Elle **ne ferme pas** le blocker `pwa-service-worker-production`, qui exige l'activation réelle au moment d'un cutover contrôlé.

Aucun DNS, DNSSEC, nameserver, IONOS, configuration Cloudflare critique ou `main` n'est modifié.
