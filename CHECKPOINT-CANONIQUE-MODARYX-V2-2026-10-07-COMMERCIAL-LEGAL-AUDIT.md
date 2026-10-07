# CHECKPOINT-CANONIQUE — MODARYX V2 — AUDIT COMMERCIAL + JURIDIQUE INITIAL — 2026-10-07

**Statut global : EN COURS**  
**But : établir la baseline launch-readiness commerciale et legal/compliance sans confondre avec la VF technique.**

## 1. Source vérifiée

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche produit : `design/modaryx-v2-blue-violet-product-20261005`
- SHA vérifié avant audit : `b5f72bcbd3982cb0fb7e3028136164fe1383c638`
- `main` : non modifié
- DNS / DNSSEC / nameservers : non modifiés
- production D1/R2/providers : non modifiés
- cutover : non exécuté

## 2. Trois gates

1. VF TECHNIQUE
2. LAUNCH-READINESS COMMERCIALE
3. LEGAL / COMPLIANCE READINESS

Une gate verte ne valide jamais les autres.

## 3. Audit commercial MODARYX

**État : EN COURS / PREUVE MANQUANTE**

Déjà acquis :
- vision produit Premium autour des jeux, mods, contenus, collections, créateurs et communauté ;
- backlog commercial explicite dans le checkpoint précédent ;
- doctrine anti-dark-pattern et non-dégradation artificielle du gratuit.

À définir/prouver avant lancement commercial :
- segment utilisateur prioritaire ;
- problème/job principal ;
- promesse centrale mesurable ;
- modèle gratuit ;
- valeur Premium éventuelle ;
- valeur/service créateur éventuel ;
- achats ponctuels / abonnement / commission : seulement après validation ;
- coûts réels Cloudflare, stockage, auth, e-mail, notifications, support, droits, paiement ;
- coût par utilisateur/créateur ;
- prix candidats ;
- willingness-to-pay / benchmark marché ;
- checkout, facturation, remboursements, chargebacks ;
- acquisition ;
- activation ;
- rétention ;
- conversion ;
- revenus nets ;
- support et anti-abus ;
- dashboard de viabilité ;
- plan pilote puis lancement.

Aucun prix, abonnement ou commission n'est canonique à ce stade.

## 4. Audit juridique MODARYX

**État : EN COURS / PREUVE MANQUANTE**

Le document `MODARYX-V2-PUBLIC-LEGAL-TRUST-READINESS-20261004.md` prouve que la structure produit est préparée, mais indique explicitement :
- contenu juridique réel non rédigé ;
- identité opérateur PREUVE MANQUANTE ;
- stack/services finaux non sélectionnés ;
- public IP intake non implémenté ;
- security contact PREUVE MANQUANTE ;
- legal review PREUVE MANQUANTE.

Donc : structure juridique UX = TERMINÉE ; conformité juridique finale = NON PROUVÉE.

## 5. Rights / jeux tiers

Contrats de registre de droits, provenance et takedown déjà préparés.

Le preflight rights du 2026-10-06 reste fail-closed :
- découverte contact éditeur réelle : non exécutée ;
- outbound : non exécuté ;
- réponse réelle : non ingérée ;
- revue juridique réelle : non obtenue ;
- autorisation finale : non accordée.

Les blockers rights/licensing restent OPEN jusqu'à preuves externes exactes.

## 6. Obligations France / UE à traiter

Avant vente/production publique selon fonctions réellement activées :
- identité opérateur + mentions légales ;
- CGU et CGV si applicable ;
- information précontractuelle ;
- contenus/services numériques et garanties/remèdes ;
- rétractation et exceptions correctement implémentées ;
- privacy/RGPD fondée sur données réellement collectées ;
- cookies/traceurs : consentement préalable lorsque requis, refus réel, retrait ;
- sous-traitants/transferts/durées ;
- facturation et TVA ;
- OSS pour ventes B2C UE lorsque pertinent ;
- accessibilité réglementaire si le service entre dans le champ applicable ;
- DSA si MODARYX agit comme intermédiaire/plateforme/marketplace selon son rôle réel ;
- modération, signalement, recours, transparence ;
- droits/licences/UGC/IP.

## 7. International

Ordre : France → UE/EEE → Royaume-Uni → États-Unis/États concernés → Canada → Australie → autres.

Pour chaque territoire :
vente autorisée, consommateurs, privacy, cookies, marketing, paiement, remboursement, fiscalité, IP, accessibilité et exigences locales.

Accessible sur Internet != prêt légalement partout.

## 8. Priorités immédiates

P0 :
1. identifier l'opérateur/vendeur réel ;
2. cartographier données, cookies, providers et finalités réelles ;
3. figer le rôle produit MODARYX (hébergeur/plateforme/marketplace ou non) pour analyse DSA ;
4. établir inventaire droits/licences production ;
5. définir segment prioritaire + proposition de valeur + modèle gratuit ;
6. établir coûts réels avant tout prix.

P1 :
7. préparer CGU/CGV/privacy/cookies à partir des faits réels ;
8. définir paiement/remboursement/facturation ;
9. construire unit economics ;
10. tester prix et willingness-to-pay ;
11. préparer pilote commercial France/UE.

## 9. Sources officielles vérifiées le 2026-10-07

- CNIL : cookies/traceurs et consentement ;
- Commission européenne : Consumer Rights Directive ;
- Commission européenne : Digital Content / Digital Services contract rules ;
- Commission européenne : Digital Services Act ;
- EUR-Lex : Directive (UE) 2019/882 accessibilité ;
- Commission européenne / Your Europe : VAT One Stop Shop.

Ces sources cadrent le travail mais ne constituent pas à elles seules une validation juridique du produit.

## 10. Verdict initial

- VF technique : séparée, toujours gouvernée par ses preuves/blockers propres.
- Commercial MODARYX : **EN COURS**.
- Legal/compliance MODARYX : **PREUVE MANQUANTE** pour lancement.
- Lancement commercial France/UE : **BLOQUÉ** jusqu'à fermeture des P0 applicables et validation des documents/process réels.
