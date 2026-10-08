# MODARYX V2 — Rétention CWV candidate — 2026-10-06

**État : mécanisme candidat prêt / désactivé par défaut / production OPEN**

Cette slice ajoute une rétention bornée pour les seuls échantillons CWV :
- défaut 28 jours ;
- minimum 7 jours ;
- maximum 90 jours ;
- GET de readiness sans mutation ;
- POST same-origin + permission administration ;
- POST refusé tant que `MODARYX_CWV_RETENTION_ENABLED=1` n’est pas explicitement configuré.

Aucune configuration Cloudflare n’est modifiée.
Aucun endpoint distant n’est invoqué.
Aucune donnée distante n’est purgée par cette change.

Même avec le mécanisme en place, le blocker `core-web-vitals-production` reste OPEN :
- activation collecte non autorisée ici ;
- rétention de production doit être explicitement approuvée ;
- migration D1 distante reste contrôlée séparément ;
- trafic réel + p75 + origine production restent requis.
