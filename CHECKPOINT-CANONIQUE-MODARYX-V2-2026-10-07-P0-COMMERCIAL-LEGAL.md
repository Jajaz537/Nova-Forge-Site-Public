# CHECKPOINT-CANONIQUE — MODARYX V2 — P0 COMMERCIAL + LEGAL — 2026-10-07

**Statut global : EN COURS — cadrage P0 effectué, aucun lancement commercial autorisé**
**Source produit :** `design/modaryx-v2-blue-violet-product-20261005` @ `c00cd25f7cfcc2898887c03a3e1d39174a20bada`

## 1. Règle de vérité

Ce document distingue :
- **DÉCISION PRODUIT** : direction retenue pour continuer le travail ;
- **HYPOTHÈSE COMMERCIALE** : à tester, non canonique ;
- **PREUVE MANQUANTE** : information obligatoire non encore prouvée ;
- **BLOQUÉ** : empêche le lancement concerné.

Aucun prix, abonnement, commission, prestataire de paiement ou qualification juridique n'est déclaré final ici.

## 2. Segment utilisateur prioritaire — DÉCISION PRODUIT

Segment prioritaire MODARYX :
**joueurs PC utilisant des mods/contenus communautaires qui veulent réduire l'incertitude, les incompatibilités, les dépendances cachées et le risque d'installation.**

Secondaires :
- joueurs avancés qui construisent des configurations stables ;
- curateurs / auteurs de collections et modpacks ;
- créateurs/équipes publiant et maintenant des contenus ;
- modérateurs/administrateurs.

La priorité de lancement n'est pas de devenir une marketplace générale. La priorité est :
**découvrir → comprendre compatibilité/provenance → organiser → installer/gérer de façon sûre lorsque les droits et l'intégration le permettent.**

## 3. Proposition de valeur — DÉCISION PRODUIT

Promesse candidate de travail :
**« Trouver, comprendre et gérer ses mods avec une information claire sur compatibilité, dépendances, provenance et état avant d'agir. »**

Différenciation recherchée :
- confiance et provenance visibles ;
- compatibilité/version avant action ;
- dépendances/conflits explicites ;
- collections ≠ modpacks ≠ profiles/loadouts ;
- workflows créateurs structurés ;
- installation assistée uniquement quand techniquement et juridiquement autorisée ;
- sécurité/accessibilité non paywallées.

## 4. Modèle gratuit — DÉCISION PRODUIT CANDIDATE

Le cœur gratuit doit rester réellement utile :
- découverte/recherche ;
- fiches contenu ;
- compatibilité/dépendances/conflits disponibles ;
- provenance/licence/statut de sécurité disponibles ;
- favoris/collections de base ;
- profils/loadouts locaux de base lorsqu'implémentés ;
- téléchargement manuel lorsqu'autorisé ;
- fonctions communautaires essentielles ;
- signalement et sécurité ;
- publication créateur de base, droits/provenance et maintenance de release.

Interdiction : rendre volontairement ces fonctions mauvaises pour pousser au paiement.

## 5. Premium utilisateur — HYPOTHÈSE À TESTER

Un Premium n'est justifié que par une valeur récurrente réelle.

Capacités candidates :
- automatisation/installation assistée avancée lorsque droits + manager le permettent ;
- gestion avancée de profils/loadouts, version locking, rollback/historique ;
- synchronisation cloud si elle est réellement construite et économiquement soutenable ;
- outils avancés de comparaison/résolution ;
- confort et personnalisation avancés ;
- support amélioré sans diminuer le niveau de sécurité des gratuits.

Ne pas vendre :
- sécurité de base ;
- informations de compatibilité critiques ;
- accessibilité ;
- possibilité de signaler du contenu illicite ;
- protections légales.

## 6. Creator Services — HYPOTHÈSE À TESTER

Base créateur gratuite :
- projet/release ;
- licences/droits/provenance ;
- upload et validation de base ;
- support/comments de base ;
- modération et recours.

Services payants éventuels uniquement si valeur réelle et coûts récurrents :
- analytics avancées ;
- équipes/outils de workflow avancés ;
- automatisation CI/API enrichie ;
- services de mise en avant clairement identifiés et non trompeurs ;
- support professionnel.

Aucune commission marketplace n'est retenue à ce stade.

## 7. Benchmark commercial frais — 2026-10-07

Observations :
- Modrinth Plus : **$4.99/mo**, sans publicité et avec soutien créateurs ; 50 % de l'abonnement annoncé comme redistribué aux créateurs.
- Nexus Mods affiche un Premium à partir d'environ **£2.99/mo** sur sa page d'inscription, avec fonctions de confort/automatisation.
- Mod Organizer 2 et Wabbajack restent gratuits/open source, ce qui impose une forte valeur pour tout paiement.
- CurseForge met en avant des outils créateurs, analytics, distribution et un programme de rémunération ; le modèle créateur est donc un axe concurrentiel important.

**HYPOTHÈSE DE RECHERCHE, PAS UN PRIX :**
tester la volonté de payer dans une bande utilisateur d'environ **3 à 9 €/mois**, avec au moins trois points de test. Aucun prix de lancement n'est fixé.

## 8. Coûts infrastructure — BASELINE PUBLIQUE À REVALIDER AVANT PROD

Stack candidate repo :
React/Vite + Cloudflare Workers/Pages + D1 + R2 + Auth0 + Turnstile.

Ordres de grandeur officiels observés le 2026-10-07 :
- Pages : requêtes d'assets statiques gratuites ; Free ≈ 500 builds/mois.
- Workers Free : ≈ 100 000 requêtes/jour ; Workers Paid à partir d'environ **$5/mois**.
- D1 Free : ≈ 5 M rows read/jour, 100 k rows written/jour, 5 GB ; paid ensuite selon usage.
- R2 Standard : 10 GB/mois gratuits, 1 M opérations Class A, 10 M Class B ; au-delà env. **$0.015/GB-mois**, $4.50/M A, $0.36/M B ; egress Internet annoncé gratuit.
- Auth0 Free : jusqu'à 25 000 MAU selon page tarifaire actuelle ; fonctionnalités/conditions à revalider avant production.
- Turnstile Free : $0/mois, jusqu'à 20 widgets, challenges illimités selon documentation actuelle.

Conclusion P0 : les coûts fixes techniques peuvent rester faibles au début, mais support, modération, droits, stockage massif, paiement et croissance peuvent devenir les coûts dominants.

## 9. Paiement — OPTIONS À ÉVALUER

Aucun provider retenu.

Option A — PSP classique :
Stripe France affiche actuellement env. **1.5 % + 0.25 €** pour cartes standard EEE ; fiscalité/facturation restent à la charge du vendeur selon configuration.

Option B — Merchant of Record :
Paddle et Lemon Squeezy affichent actuellement env. **5 % + 0.50** par transaction et prennent en charge une part importante de la collecte/déclaration de taxes en tant que MoR.

**DÉCISION P0 :** comparer PSP direct vs Merchant of Record avant toute activation. Un coût transactionnel supérieur peut être rationnel s'il réduit fortement la charge fiscale/compliance internationale au lancement.

## 10. Cartographie données/providers — ÉTAT ACTUEL

### Auth0
Rôle candidat : identité/auth.
État production : NON PROUVÉ.
Données : identité de compte, facteurs/authentification selon configuration.
Action legal : DPA, régions/transferts, rétention/logs, politique de récupération.

### D1
Rôle candidat : comptes/sessions/communauté/modération/profils.
État : DEV prouvé, production non prouvée.
Action : inventaire table → finalité → base juridique → durée → droits utilisateur.

### R2
Rôle candidat : artefacts/provenance autorisés.
État production : NON CONFIGURÉ/PROUVÉ.
Action : droits, rétention, suppression, localisation/contrat, anti-malware.

### Turnstile
Rôle : anti-abus.
État candidat/dev : utilisé ; prod à prouver.
Action : documenter le traitement, Privacy Addendum, Siteverify serveur obligatoire.

### Météo
État : OFF par défaut.
Aucun GPS navigateur prévu.
Tout provider futur = revue terms/privacy avant activation.

### Email / push
État : NOT_IMPLEMENTED.
Provider final = PREUVE MANQUANTE.

### Analytics / RUM
Provider final production : PREUVE MANQUANTE.
Aucun traceur non nécessaire ne doit être activé avant décision privacy/cookies.

## 11. Cookies / stockage — DÉCISION DE CONCEPTION

- cookies/session strictement nécessaires : documenter précisément ;
- préférences locales : minimiser ;
- analytics/marketing : OFF par défaut tant que consentement et provider ne sont pas validés ;
- accepter/refuser avec facilité comparable lorsque consentement requis ;
- retrait facile ;
- pas de cross-domain/cross-device implicite.

## 12. DSA / rôle plateforme — LEGAL_REVIEW_REQUIRED

L'architecture prévoit UGC, Creator Studio, commentaires/support, reports et modération.

Donc MODARYX doit être conçu **comme si des obligations de plateforme/intermédiation pouvaient s'appliquer**, notamment :
- mécanisme notice-and-action ;
- confirmation et décision sur signalement ;
- motivation/recours selon obligations applicables ;
- règles et transparence de modération ;
- traçabilité et droits des créateurs ;
- lutte contre contenus illicites.

La qualification juridique exacte (hosting service / online platform / marketplace ou autre) reste **PREUVE MANQUANTE / LEGAL_REVIEW_REQUIRED** selon le modèle final.

## 13. Consommateurs France / UE

Avant vente :
- identité vendeur/opérateur réelle ;
- informations précontractuelles ;
- prix total et modalités ;
- CGV adaptées ;
- droit de rétractation et exceptions digitales correctement recueillies ;
- conformité des contenus/services numériques et remèdes ;
- politique remboursement ;
- facture/TVA ;
- accessibilité du parcours e-commerce si applicable.

Ne jamais faire perdre un droit par simple wording non conforme.

## 14. Accessibilité

Si MODARYX conclut des contrats de consommation en ligne, l'European Accessibility Act et sa transposition doivent être qualifiés pour le service réellement fourni.

Le checkout, identification, authentification et paiement doivent rester dans le périmètre accessibilité.

Tests automatisés seuls != conformité.

## 15. Rights / IP

État repo :
- contrats Game Rights Registry : préparés ;
- takedown/modération/provenance : préparés ;
- autorisations réelles éditeurs : NON PROUVÉES.

DÉCISION :
- aucun asset/licence tierce non prouvé ne devient commercialement autorisé ;
- aucun silence éditeur ne vaut accord ;
- distribution/monétisation de mods tiers doit respecter politiques/EULA/licences et choix de distribution du créateur.

## 16. Blockers P0

### BLOQUÉ pour lancement commercial
- identité vendeur/opérateur réelle ;
- CGV/privacy/cookies finals ;
- modèle paiement/fiscalité ;
- droits/licences production nécessaires ;
- qualification DSA finale selon fonctions actives ;
- production providers/data map finale ;
- validation des obligations accessibilité applicables.

### PREUVE MANQUANTE
- willingness-to-pay ;
- coûts support/modération réels ;
- taux conversion/rétention ;
- provider email/push/analytics ;
- unit economics en production.

## 17. Prochaine tranche

1. construire un **Data Processing Inventory** à partir des schémas D1/API réels ;
2. établir un **Rights & OSS Inventory** production ;
3. produire un **unit economics calculator** pour 1k / 10k / 100k MAU ;
4. définir un test de pricing sans vente réelle ;
5. préparer pack juridique France/UE à partir de l'identité vendeur quand disponible ;
6. comparer Stripe direct vs Merchant of Record ;
7. ne pas activer paiement/production sans approbation explicite.

## 18. Sources de benchmark / règles vérifiées

Officielles ou éditeurs :
- https://modrinth.com/plus
- https://www.nexusmods.com/registration/signup
- https://authors.curseforge.com/welcome/
- https://www.modorganizer.org/
- https://www.wabbajack.org/
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/pages/functions/pricing/
- https://www.cloudflare.com/plans/developer-platform/
- https://developers.cloudflare.com/turnstile/plans/
- https://auth0.com/pricing
- https://stripe.com/fr/pricing
- https://www.paddle.com/pricing
- https://www.lemonsqueezy.com/pricing
- https://cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi
- https://www.cnil.fr/fr/comprendre-le-rgpd/reglement-general-sur-la-protection-des-donnees-ce-qui-change-pour-les-professionnels
- https://commission.europa.eu/law/law-topic/consumer-protection-law/consumer-contract-law/consumer-rights-directive_en
- https://commission.europa.eu/topics/business-and-industry/contract-rules/digital-contracts/digital-contract-rules_en
- https://digital-strategy.ec.europa.eu/en/policies/dsa-notice-and-action-mechanism
- https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=celex:32019L0882
- https://vat-one-stop-shop.ec.europa.eu/guides_en

**Ce checkpoint supersède l'audit initial du 2026-10-07 pour les éléments commerciaux/juridiques P0 qu'il précise.**
