# MODARYX V2 — FRANCE / UE LEGAL & COMPLIANCE READINESS — 2026-10-07

**Statut : EN COURS / LANCEMENT COMMERCIAL FRANCE-UE BLOQUÉ tant que les faits et validations manquants ne sont pas fermés**

Ce document est une matrice de préparation et ne constitue pas un avis juridique final. Il n'active aucun paiement et ne choisit aucun vendeur ou prestataire.

## 1. Vente B2C de contenu/service numérique — France

**PREUVE MANQUANTE / BLOQUÉ avant vente.**

La version en vigueur depuis le 19 juin 2026 de l'article L221-5 du Code de la consommation exige, avant conclusion du contrat, des informations lisibles et compréhensibles portant notamment sur :
- caractéristiques essentielles ;
- prix ;
- date/délai de fourniture ;
- identité et coordonnées du professionnel ;
- résiliation et règlement des litiges ;
- autres informations contractuelles applicables.

Pour un contenu numérique sans support matériel, l'exception au droit de rétractation ne doit jamais être présumée. L'article L221-28, 13° exige notamment, lorsque les conditions sont réunies :
- consentement exprès au démarrage avant la fin du délai ;
- reconnaissance de la perte du droit de rétractation ;
- confirmation de l'accord conformément à L221-13.

Conséquence produit : si cette voie est retenue, le checkout et le journal de preuve doivent matérialiser les consentements/confirmations légalement nécessaires. Un simple libellé « non remboursable » n'est pas une solution de conformité.

Sources officielles :
- https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000053310511/2026-07-06
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563170/2026-05-06

## 2. Conformité et remèdes numériques — France / UE

**LEGAL_REVIEW_REQUIRED.**

Les règles européennes relatives aux contrats de fourniture de contenus et services numériques prévoient des droits/remèdes lorsque le contenu ou service numérique n'est pas conforme.

À fermer avant CGV finales :
- promesse fonctionnelle exacte ;
- compatibilité/interopérabilité pertinente ;
- politique de mises à jour ;
- procédure de mise en conformité / réduction de prix / résolution selon cas ;
- traitement des contenus fournis ou créés par l'utilisateur lorsqu'une obligation s'applique.

Source officielle à conserver dans la revue finale :
- Commission européenne — Consumer sales and guarantees / digital contract rules.

## 3. Privacy / cookies — France

**EN COURS.**

Règle de conception maintenue :
- aucun traceur non strictement nécessaire avant consentement lorsqu'il est requis ;
- refus aussi simple que l'acceptation ;
- retrait aussi simple que l'octroi du consentement ;
- pas de dark pattern de consentement.

À fermer :
- responsable de traitement réel ;
- finalité/base juridique finale par traitement ;
- durées ;
- DPA/transferts ;
- process droits utilisateur ;
- CMP réelle seulement si nécessaire ;
- audit de l'implémentation RUM avant toute revendication d'exemption.

Sources officielles :
- https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ
- https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite

## 4. DSA — UGC, mods, communauté et créateurs

**BLOQUÉ PAR QUALIFICATION DU RÔLE RÉEL.**

MODARYX prévoit des contenus utilisateurs, des mécanismes de modération et potentiellement l'hébergement/distribution de contenus. Le rôle exact doit être qualifié au regard du DSA avant d'affirmer quelles obligations précises s'appliquent.

À préparer lorsque pertinent selon le rôle réel :
- notice-and-action pour contenu illicite ;
- information claire sur certaines décisions de modération ;
- mécanismes de plainte/recours lorsque requis ;
- transparence/reporting ;
- traçabilité des professionnels si une fonction marketplace réellement concernée est lancée ;
- preuve et conservation proportionnées.

Sources officielles :
- https://digital-strategy.ec.europa.eu/en/policies/dsa-notice-and-action-mechanism
- https://digital-strategy.ec.europa.eu/en/faqs/dsa-transparency-database-questions-and-answers

## 5. Accessibilité — commerce électronique

**LEGAL_REVIEW_REQUIRED / PREUVE MANQUANTE.**

La réglementation issue de l'European Accessibility Act s'applique depuis le 28 juin 2025 à certains produits et services, dont le commerce électronique. La DGCCRF décrit une approche/exemption liée aux microentreprises pour certains services sous critères de taille, mais cette situation ne doit jamais être présumée sans vérifier les faits réels de l'opérateur.

Indépendamment de l'éventuelle qualification juridique, la gate produit MODARYX conserve :
- clavier ;
- lecteurs d'écran ;
- contraste ;
- zoom/reflow ;
- reduced motion ;
- formulaires ;
- authentification ;
- checkout accessibles.

Source officielle :
- https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/professionnels-vos-produits-et-services-doivent-etre-conformes-la-directive-accessibilite

## 6. TVA / OSS — vente directe UE

**BLOQUÉ PAR IDENTITÉ VENDEUR + MODÈLE DE VENTE.**

Si MODARYX vend directement à des consommateurs de plusieurs États membres, le dispositif OSS peut simplifier certaines obligations de TVA transfrontalière selon le cas réel.

La Commission a publié le 24 juillet 2026 des notes explicatives et lignes directrices OSS révisées pour intégrer des changements ViDA entrant notamment en vigueur à partir du 1er janvier 2027.

Action :
- ne figer ni taux, ni facturation, ni traitement fiscal sans vendeur, établissement, nature de la prestation, territoires et rail de paiement ;
- obtenir une validation fiscale professionnelle lorsque la qualification a un impact matériel.

Source officielle :
- https://vat-one-stop-shop.ec.europa.eu/guides_en

## 7. Paiements — coûts officiels revus le 2026-10-07

**AUCUN FOURNISSEUR RETENU.**

### Stripe France
- cartes standard EEE : 1,5 % + 0,25 € ;
- cartes premium EEE : 2,8 % + 0,25 € ;
- frais de litige reçu : 20 € ;
- frais de réfutation manuelle : 20 €, remboursés si le litige est gagné selon la page tarifaire.

Source :
- https://stripe.com/fr/pricing

### Paddle
- Merchant of Record ;
- Checkout pay-as-you-go : 5 % + 0,50 USD par transaction ;
- paiement, billing, tax compliance, fraude/chargebacks et buyer support font partie de l'offre présentée.

Sources :
- https://www.paddle.com/pricing
- https://www.paddle.com/legal/terms

### Lemon Squeezy
- Merchant of Record ;
- base : 5 % + 0,50 USD ;
- frais supplémentaires documentés dans certains cas, notamment transaction internationale, PayPal et abonnement ;
- frais de payout possibles selon pays/méthode.

Sources :
- https://www.lemonsqueezy.com/pricing
- https://docs.lemonsqueezy.com/help/getting-started/fees

## 8. Décisions non prises

Toujours **PREUVE MANQUANTE / BLOQUÉ** :
- vendeur/opérateur ;
- prix canonique ;
- Premium final et périodicité ;
- PSP/MoR ;
- TVA/facturation ;
- CGU/CGV/privacy notice finales ;
- rôle DSA exact ;
- applicabilité/accessibilité réglementaire exacte au modèle réel ;
- durées de conservation ;
- droits/licences des assets et des contenus/jeux/éditeurs.

Aucun prix, abonnement ou commission n'est canonique par ce document.
