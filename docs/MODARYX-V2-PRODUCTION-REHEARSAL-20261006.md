# MODARYX V2 — Rehearsal de promotion — 2026-10-06

**État : rehearsal localhost/CI uniquement — aucune promotion publique**

Cette lane exécute la séquence la plus proche possible d'un cutover sans toucher à la production :

1. build V2 par défaut : Service Worker désactivé ;
2. build avec `VITE_MODARYX_PWA_PRODUCTION=1` : enregistrement, contrôle après navigation et offline ;
3. retour au build par défaut : PWA désactivée à nouveau ;
4. migration navigateur V1→V2 et rollback ;
5. deep links/routes ;
6. budgets performance laboratoire.

Le candidat reste `noindex` avant, pendant et après le rehearsal.

Cette preuve réduit le risque du futur cutover, mais **ne ferme pas** :
- PWA production ;
- Core Web Vitals production p75 ;
- indexabilité/canonicals production ;
- redirects publics ;
- cutover.

Aucune action n'est effectuée sur DNS, DNSSEC, nameservers, IONOS, domaine Pages, configuration Cloudflare critique ou `main`.
