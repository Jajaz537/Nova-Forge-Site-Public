# MODARYX V2 — Sélection de stack — 2026-10-06

**État : TERMINÉ pour la décision de stack / cutover toujours BLOQUÉ**

Stack retenue pour le candidat de production :
**React 19.2.0 + Vite 6.4.2 + shell compatible Cloudflare Workers**.

La décision s'appuie sur la direction produit Game Hub bleu nuit + violet déjà approuvée, le root preview isolé, les product flows navigateur, l'accessibilité ciblée, la matrice de 143 captures et la migration navigateur non destructive.

Le prérequis `HUMAN_TREE_TEST` n'est **pas** déclaré humainement PASS. La décision propriétaire fraîche autorise la poursuite site-only et délègue l'inspection navigateur exhaustive ; ce prérequis est donc reclassifié **uniquement pour la sélection de stack**, avec proxy technique `TREE_PROXY_ASSERT 1..10`. Les validations humaines, screen readers et appareils restent indépendantes dans le gate VF.

Pourquoi cette stack :
- continuité exacte avec le candidat visuel déjà prouvé ;
- dépendances petites et épinglées ;
- JS prototype ~100 kB gzip, à ne pas laisser régresser sans justification ;
- contrôle explicite du Service Worker et du routing ;
- stratégie BFF same-origin/Auth0/D1/R2 déjà définie ;
- migration immédiate vers un root réel sans repeindre le produit.

Conditions avant cutover :
- initial HTML/SEO route-level à prouver ;
- budgets performance/CWV à prouver ;
- PWA/SW production à prouver ;
- backend/auth/providers réels à prouver ;
- aucune migration Cloudflare critique implicite.

Aucun DNS, DNSSEC, nameserver, IONOS, `main` ou cutover n'est modifié par cette décision.
