# MODARYX V2 — matrice providers / DPA / transferts — candidate — 2026-10-08

**Statut : EN COURS — readiness documentaire, aucun provider sélectionné ou activé par ce document**

Cette matrice relie les providers déjà présents dans l'architecture ou étudiés commercialement aux preuves privacy/compliance à obtenir avant production.

Elle ne constitue ni un DPA, ni un TIA, ni une qualification juridique finale.

## 1. Règle commune

Pour chaque provider réellement activé, vérifier avant production :
- rôle contractuel : responsable / sous-traitant / indépendant selon traitement ;
- DPA ou clauses pertinentes ;
- région d'hébergement / traitement ;
- transferts internationaux ;
- mécanisme de transfert applicable ;
- sous-traitants ultérieurs ;
- catégories de données ;
- finalités ;
- rétention ;
- suppression/export ;
- sécurité ;
- incident/breach process ;
- audit/compliance docs pertinents ;
- accessibilité des surfaces utilisateur si applicable ;
- sortie/migration du fournisseur ;
- conditions tarifaires réelles.

Aucun champ absent ne devient « conforme par défaut ».

## 2. Cloudflare

Périmètre candidat :
- Pages / Workers ;
- D1 ;
- R2 ;
- Turnstile.

État produit :
- Pages/Workers : architecture candidate ;
- D1 : DEV prouvé, production non prouvée ;
- R2 : production non configurée/prouvée ;
- Turnstile : code candidat conditionnel.

Données possibles :
- requêtes HTTP ;
- auth/session côté app ;
- profils/UGC/D1 ;
- artefacts R2 si activés ;
- anti-abus Turnstile ;
- logs selon configuration.

À obtenir avant production :
- contrat/DPA applicable ;
- région/data location réelle ;
- sous-traitants ;
- transferts ;
- rétention/logs ;
- suppression/export D1/R2 ;
- Turnstile privacy terms ;
- configuration production réelle ;
- procédure incident.

État : **PREUVE MANQUANTE / LEGAL_REVIEW_REQUIRED**.

## 3. Auth0

Rôle candidat :
identité/authentification.

État :
code d'intégration présent ; configuration production **PREUVE MANQUANTE**.

Données possibles :
- identifiant de compte ;
- email/profil selon configuration ;
- facteurs/MFA ;
- journaux auth ;
- récupération.

À obtenir :
- DPA ;
- tenant/région ;
- transferts ;
- sous-traitants ;
- rétention/logs ;
- export/suppression ;
- MFA/recovery ;
- breach process ;
- configuration cookies/session ;
- accessibilité du parcours.

État : **PREUVE MANQUANTE**.

## 4. WeatherAPI / Open-Meteo

Rôle candidat :
contexte météo server-side optionnel.

État :
`MODARYX_WEATHER_MODE=off` par défaut.

Données observées côté design :
- coordonnées grossières dérivées server-side si provider activé ;
- pas de GPS navigateur ;
- pas de ville/code postal renvoyé au client ;
- coordonnées provider arrondies à 0,1°.

Avant activation :
- choisir un provider compatible avec usage commercial réel ;
- vérifier terms/licence ;
- privacy ;
- données envoyées ;
- rétention/logs ;
- transferts ;
- DPA si pertinent ;
- attribution ;
- limites/coûts ;
- fallback/off switch.

État : **PREUVE MANQUANTE**.

## 5. Email / push

Provider :
**NON CHOISI**.

Avant sélection :
- finalité opérationnelle vs marketing séparée ;
- régions/transferts ;
- DPA ;
- sous-traitants ;
- logs/rétention ;
- bounces/complaints ;
- suppression ;
- sécurité des credentials ;
- opt-out/consentement lorsque requis ;
- accessibilité des messages ;
- coût réel.

État : **PREUVE MANQUANTE**.

## 6. Paiement

Candidats de recherche :
- Stripe direct ;
- Paddle Merchant of Record ;
- Lemon Squeezy Merchant of Record.

Aucun provider canonique.

Avant choix :
- rôle vendeur/MoR ;
- données de paiement réellement reçues par MODARYX ;
- DPA/privacy ;
- transferts ;
- sous-traitants ;
- antifraude ;
- taxes/facturation ;
- refunds/chargebacks ;
- exports/comptabilité ;
- rétention ;
- webhooks ;
- sécurité ;
- accessibilité checkout ;
- coûts réels ;
- exit/migration.

Les données carte ne doivent pas transiter par MODARYX si une intégration hébergée/secure permet de l'éviter.

État : **PREUVE MANQUANTE / décision propriétaire requise**.

## 7. Analytics / performance

État courant :
- aucun analytics marketing canonique ;
- CWV/RUM first-party candidat, OFF par défaut ;
- pas de Google Analytics/gtag observé dans l'inventaire statique V2.

Si un provider externe est proposé plus tard :
**nouvelle revue obligatoire avant activation**.

À vérifier :
- nécessité ;
- minimisation ;
- cookies/traceurs ;
- consentement ou exemption applicable ;
- DPA ;
- transferts ;
- rétention ;
- IP/referrer/URL ;
- cross-site/cross-device ;
- opt-out ;
- suppression.

État : **pas de provider externe sélectionné**.

## 8. MODARYX IA

Provider IA production :
**NON CHOISI / PREUVE MANQUANTE**.

Avant toute activation :
- cas d'usage exact ;
- données envoyées ;
- données sensibles interdites ou contrôlées ;
- mémoire/rétention ;
- entraînement/fine-tuning ;
- outils/actions ;
- DPA ;
- transferts ;
- sous-traitants ;
- sécurité ;
- suppression/export ;
- transparence utilisateur ;
- désactivation ;
- accès mineurs si pertinent ;
- coûts.

Aucune hypothèse de partage avec l'écosystème 18+.

## 9. Matrice de sortie fournisseur

Pour chaque provider choisi, documenter :
- export disponible ;
- format ;
- délai technique ;
- suppression ;
- preuve de suppression ;
- migration vers alternative ;
- dépendances propriétaires ;
- clés/secrets à révoquer ;
- plan de rollback.

Aucun provider ne doit être traité comme irréversible par défaut.

## 10. Gate production

Aucun provider de données personnelles ou critique ne passe à production sans :
1. décision produit explicite ;
2. facts contractuels ;
3. privacy/data map mise à jour ;
4. DPA/terms vérifiés ;
5. transferts qualifiés ;
6. sécurité et secrets ;
7. suppression/export ;
8. accessibilité si surface utilisateur ;
9. coûts ;
10. revue juridique appropriée lorsque requise.

**Matrice candidate : TERMINÉE.**
**Validation provider par provider : PREUVE MANQUANTE.**
