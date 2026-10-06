# MODARYX V2 — Rights lifecycle expiry lock candidate — 2026-10-06

**État : évaluateur + lock d’expiration admin candidat / scheduler production OPEN**

La slice calcule :
- `ACTIVE_WITH_LIMITS` ;
- `EXPIRING_SOON` ;
- `EXPIRED` ;
- `REVOKED`.

L’endpoint admin `POST /api/v1/rights/lifecycle/evaluate-case` exige une authentification récente et peut uniquement **réduire** les droits expirés :
- il crée une décision `EXPIRED` ;
- elle supersede exactement la décision autorisante arrivée à échéance ;
- l’opération est idempotente via SHA-256 ;
- elle crée un événement de lifecycle audité.

Il ne peut jamais :
- créer `GRANTED` ou `GRANTED_WITH_LIMITS` ;
- réactiver silencieusement un scope ;
- inventer une preuve ;
- traiter une révocation inbound réelle ;
- lancer un scheduler production.

Les blockers scheduler / revocation inbound / revalidation réelle restent OPEN.
