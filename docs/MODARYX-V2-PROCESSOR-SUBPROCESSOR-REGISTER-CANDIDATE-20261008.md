# MODARYX V2 — registre processors / subprocessors candidat — 2026-10-08

**État : EN COURS — qualification juridique et contrats PREUVE MANQUANTE**

## Objet

Ce registre relie l'inventaire de traitements MODARYX aux services externes réellement envisagés, sans supposer qu'un fournisseur est juridiquement « sous-traitant » par défaut.

La CNIL rappelle qu'un traitement confié à un sous-traitant doit être encadré contractuellement et que les garanties de sécurité, l'assistance, la notification d'incidents et les sous-traitants ultérieurs doivent être traités dans la relation contractuelle.

Références officielles revues le 2026-10-08 :
- CNIL — Travailler avec un sous-traitant ;
- CNIL — Sécurité : gérer la sous-traitance ;
- RGPD article 28.

**La qualification finale fournisseur par fournisseur reste PREUVE MANQUANTE et nécessite une validation appropriée.**

## Registre candidat

| Service | Usage MODARYX | État technique | Qualification privacy | Production |
|---|---|---|---|---|
| Cloudflare Pages / Workers / D1 | hébergement/backend/base | preuves preview/dev, production incomplète | PREUVE MANQUANTE | non |
| Cloudflare R2 | stockage artefacts | binding absent | PREUVE MANQUANTE | non |
| Cloudflare Turnstile | anti-abus | conditionnel, production non prouvée | PREUVE MANQUANTE | non |
| Auth0 | identité/auth | candidat, production non prouvée | PREUVE MANQUANTE | non |
| Email provider | notifications | non implémenté/activé | PREUVE MANQUANTE | non |
| Web Push | notifications | non implémenté/activé | PREUVE MANQUANTE | non |
| Weather provider | météo optionnelle | OFF par défaut | PREUVE MANQUANTE | non |
| Paiement / Merchant of Record | paiement/refunds/facturation | aucun choix | PREUVE MANQUANTE | non |

Pour le paiement, ne jamais supposer le rôle de sous-traitant : le rôle peut différer selon le fournisseur et le modèle commercial réel.

## Fiche obligatoire avant activation d'un service

Pour chaque service réellement retenu :
1. entité contractante exacte ;
2. rôle privacy qualifié ;
3. finalités / catégories de données ;
4. DPA/clauses article 28 si applicable ;
5. sous-traitants ultérieurs + mécanisme d'information/opposition lorsque applicable ;
6. localisation/hébergement/transferts ;
7. sécurité et certifications réellement vérifiées ;
8. rétention + suppression/restitution ;
9. assistance droits des personnes ;
10. délai/process contractuel d'incident et violation ;
11. fin de contrat / export / destruction ;
12. preuve de configuration production correspondant au contrat.

## État de gate

Restent **PREUVE MANQUANTE** :
- identité du responsable de traitement/opérateur ;
- set final des providers ;
- qualification juridique de chaque relation ;
- contrats/DPA applicables ;
- subprocessors ;
- transferts ;
- rétention/suppression ;
- clauses incident/breach ;
- conformité de la configuration production au contrat.

Aucun provider n'est activé par ce document. Aucun provider ne devient canonique.
