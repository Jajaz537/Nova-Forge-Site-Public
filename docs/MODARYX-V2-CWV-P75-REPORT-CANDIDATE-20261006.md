# MODARYX V2 — Rapport p75 CWV terrain candidat — 2026-10-06

**État : agrégateur lecture seule prêt / preuve production toujours OPEN**

La collecte RUM possède maintenant une pièce de lecture séparée :
- endpoint admin `GET /api/v1/rum/cwv/report` ;
- fenêtre candidate par défaut : 28 jours ;
- calcul p75 par méthode nearest-rank ;
- LCP / INP / CLS séparés ;
- compteur de samples par métrique ;
- aucun identifiant de compte, IP, user-agent, URL brute, query ou referrer.

Le seuil `75 samples / métrique` est uniquement un **target candidat de suffisance de données interne**. Il ne représente ni une certification CrUX ni une preuve p75 production.

Même si le target est atteint, la réponse reste :
`SAMPLE_TARGET_MET_EXTERNAL_PRODUCTION_PROOF_STILL_REQUIRED`

Le blocker `core-web-vitals-production` reste OPEN jusqu'à :
1. activation explicitement autorisée ;
2. migration D1 distante contrôlée ;
3. politique de rétention approuvée ;
4. trafic production réel suffisant ;
5. preuve d'origine production ;
6. revue des p75 réellement collectés.

Aucun cutover, provider, DNS/Cloudflare critique ou activation de collecte n'est effectué ici.
