# MODARYX V2 — Collecte CWV terrain candidate — 2026-10-06

**État : candidat préparé, désactivé par défaut / p75 production toujours OPEN**

La slice prépare une collecte RUM same-origin pour LCP, INP et CLS sans activer la collecte en production.

## Double gate

La collecte ne peut être active que si :
1. le build V2 utilise `VITE_MODARYX_FIELD_CWV=1` ;
2. le runtime serveur expose `MODARYX_CWV_RUM_ENABLED=1` avec D1 disponible.

Par défaut, les deux côtés restent désactivés.

## Minimisation des données

Stockage autorisé :
- métrique LCP/INP/CLS ;
- valeur ;
- rating dérivé côté serveur ;
- classe de route fermée ;
- classe viewport ;
- type de navigation ;
- identifiant de page aléatoire éphémère ;
- timestamps.

Non stocké :
- compte / identité ;
- IP ;
- user-agent ;
- URL brute ;
- query string ;
- referrer ;
- email ;
- token.

Le client respecte DNT et Global Privacy Control.

## Preuve et limite

La micro-preuve locale valide :
- schéma D1 0014 ;
- seuils/rating ;
- validation fail-closed ;
- mapping route/viewport ;
- sélection INP candidate ;
- double gate OFF par défaut ;
- absence de champs PII dans la table.

Cette préparation **ne ferme jamais** `core-web-vitals-production`.

Il faudra encore :
- décision explicite d'activation ;
- migration D1 distante contrôlée ;
- politique de rétention ;
- trafic réel suffisant ;
- agrégation p75 LCP/INP/CLS sur la fenêtre retenue ;
- preuve que les métriques proviennent de la production réelle.
