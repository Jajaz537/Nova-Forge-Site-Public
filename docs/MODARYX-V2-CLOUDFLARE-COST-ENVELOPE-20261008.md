# MODARYX V2 — enveloppe de coûts Cloudflare — 2026-10-08

**Statut : EN COURS — sensibilité économique, aucun budget ni plan production canonique**

Cette note utilise les tarifs officiels Cloudflare actuels pour construire des scénarios de sensibilité. Les volumes sont **hypothétiques** : ils ne sont pas des prévisions MODARYX.

## Tarifs officiels utilisés

### Pages
- offre Free affichée à **$0/mois** ;
- le trafic statique n'est pas traité ici comme des invocations Workers.

### Workers Paid
- minimum : **$5/mois**
- 10 M requêtes/mois incluses
- puis **$0.30 / million de requêtes**
- 30 M CPU-ms/mois inclus
- puis **$0.02 / million CPU-ms**
- pas de supplément de transfert/egress dans le modèle Workers Standard cité.

### D1 — Workers Paid
- 25 milliards de rows read/mois inclus
- puis **$0.001 / million de rows read**
- 50 millions de rows written/mois inclus
- puis **$1 / million de rows written**
- 5 GB inclus
- puis **$0.75 / GB-mois**

### R2 Standard
- 10 GB/mois inclus
- puis **$0.015 / GB-mois**
- 1 M opérations Class A incluses, puis **$4.50 / million**
- 10 M opérations Class B incluses, puis **$0.36 / million**
- egress Internet : **$0**.

## Scénarios de sensibilité

### Workers — hypothèse 5 ms CPU moyen / requête dynamique

| Scénario | Requêtes dynamiques/mois | Coût estimé |
|---|---:|---:|
| petit | 5 M | **$5.00/mois** |
| moyen | 25 M | **$11.40/mois** |
| grand | 100 M | **$41.40/mois** |

Ces chiffres ne comprennent pas D1, R2, providers externes, support ou opérations humaines.

### D1

| Scénario | Reads | Writes | Stockage | Coût estimé |
|---|---:|---:|---:|---:|
| petit | 1 Md | 5 M | 1 GB | **$0.00** |
| bord des inclusions | 25 Md | 50 M | 5 GB | **$0.00** |
| write-heavy | 100 Md | 200 M | 20 GB | **$236.25** |

Le troisième scénario n'est **pas** une prévision : il montre que les écritures massives peuvent dominer le coût une fois les inclusions dépassées.

### R2

| Scénario | Stockage | Class A | Class B | Coût estimé |
|---|---:|---:|---:|---:|
| petit | 100 GB | 1 M | 10 M | **$1.35/mois** |
| moyen | 1 TB | 10 M | 100 M | **$88.11/mois** |
| grand | 10 TB | 50 M | 500 M | **$550.35/mois** |

À l'échelle d'une plateforme de mods, le volume d'opérations peut devenir aussi important que le stockage. L'egress gratuit est favorable mais ne suffit pas à lui seul pour choisir le provider.

## Ce que ce modèle ne comprend pas

Toujours exclus :
- PSP/MoR ;
- TVA/taxes/facturation ;
- refunds/chargebacks ;
- email/push ;
- Auth/passkeys tiers ;
- observabilité additionnelle ;
- support ;
- modération ;
- fraude/abuse ;
- droits/licences ;
- juridique/comptabilité ;
- CAC ;
- coûts humains.

## Décision

Cette enveloppe réduit l'incertitude sur les ordres de grandeur techniques, mais ne valide aucun prix.

Avant budget canonique :
1. mesurer requêtes dynamiques / MAU ;
2. mesurer CPU-ms réel ;
3. mesurer rows read/write D1 ;
4. mesurer stockage + ops R2 par release/créateur ;
5. ajouter support/modération/providers/compliance ;
6. seulement ensuite calculer contribution margin et LTV.

Preuve machine-readable :
`docs/MODARYX-V2-CLOUDFLARE-COST-ENVELOPE-20261008.json`.

**Budget infra canonique : PREUVE MANQUANTE.**
**Usage production réel : PREUVE MANQUANTE.**
