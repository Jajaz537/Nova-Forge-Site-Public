# MODARYX V2 — Registre providers/connectors candidat — 2026-10-06

**État : candidat implémenté / blocker production OPEN**

Le site peut désormais interroger `/api/v1/providers/status` pour afficher un état technique sans valeur sensible.

Le registre couvre :
- Auth0 ;
- Cloudflare Turnstile ;
- Cloudflare R2 ;
- météo ;
- email ;
- push.

Règles :
- aucun secret, issuer, client id ou clé provider renvoyé ;
- météo fournisseur uniquement côté serveur ;
- navigateur sans GPS ;
- email/push restent `NOT_IMPLEMENTED` ;
- R2 reste `NOT_CONFIGURED` si le binding n’existe pas ;
- météo `off` par défaut ;
- une configuration technique n’est jamais présentée comme acceptation juridique/production.

La surface **Confiance & légal** utilise ce registre de façon fail-soft et n’invente aucun provider actif lorsque l’endpoint est indisponible.

Cette slice ne ferme pas `providers-connectors-real` : la production exige encore activation réelle + preuve + conditions/licences/attribution applicables.
