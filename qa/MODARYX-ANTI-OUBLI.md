# MODARYX — Registre anti-oubli de la finition Premium HD

Revue documentaire et lecture des sources, 15 septembre 2026. Référence de périmètre : `CHECKPOINT-CANONIQUE-NOVA-FORGE-MODARYX-2026-09-15.md`. Candidat : PR #12. **Cette revue ne constitue ni une recette navigateur ni une déclaration de VF.**

## Sources réconciliées

Les six documents `MODARYX-DESIGN-CONTRACT.md`, `MODARYX-NEXT-BATCH.md`, `MODARYX-SITE-ARCHITECTURE-V1.md`, `MODARYX-SITE-IDEAS-INVENTORY.md`, `MODARYX-SITE-VF-PLAN.md` et `MODARYX-VF-STATUS.md` ont été lus. La correction canonique remplace le libellé produit historique « Modaryx OS » par l'aperçu web MODARYX. Nova Forge reste le nom des OS distincts. Les anciens ordres de cutover/suppression getnova sont retirés du plan actif, avec mention historique conservée.

Les observations ci-dessous portent sur les fichiers du candidat local issu de `9084686f02af0a9b4c8d1ab879e0c8d66915caec`, pendant la consolidation du lot. Elles devront être rattachées au commit consolidé par le coordinateur. Aucun état ancien de branche ou pourcentage ne vaut preuve fraîche.

## Idées → capacités observées → écarts

| Idée retenue | Fichiers / capacité observée | Écart et prochaine action | Statut de l'idée complète |
|---|---|---|---|
| Identité MODARYX | `index.html`, `assets/modaryx-mark.svg`, variantes PNG et `favicon.svg` | Vérifier marque visible et noms accessibles sur les seize pages ; conserver les identifiants de contrat historiques. | EN COURS |
| Design system Premium HD | `assets/tokens.css`, feuilles communes et raffinements MODARYX | Consolidation et preuves visuelles multi-pages ; présence de CSS ≠ cohérence vérifiée. | EN COURS |
| Catalogue multigaming | `catalog.html`, `assets/catalog.js`, `data/catalog.json` | Filtres, favoris et vues locales ; trois créations démonstratives seulement. Aucun catalogue distribué réel. | EN COURS |
| GTA 6 : hub, mods, catégories, guides | Routes prévues dans l'architecture, aucun dossier `/gta-6/` | Idée retenue manquante. Créer du contenu substantiel après vérification des sources, droits et possibilités réelles, sans présumer une sortie PC ou un écosystème de mods. | EN COURS — capacité non livrée |
| RDR2 : hub et mods | Routes prévues, aucun dossier `/red-dead-redemption-2/` | Idée retenue manquante ; préparer le corpus éditorial et les assets autorisés. | EN COURS — capacité non livrée |
| Index jeux / catégories extensibles | Champs `game`, `kind`, `tags` dans `data/catalog.json` | Modèle extensible présent ; index `/games/` et pages de catégories absents. Ne pas créer de pages vides. | EN COURS |
| Fiches de créations | `project.html`, trois `project-*.html`, `assets/project-hub.js`, `data/compatibility-graph.json` | Métadonnées et favoris démonstratifs. Galerie réelle, versions distribuées et compatibilité mesurée non prouvées. | EN COURS |
| Recherche | `search.html`, `assets/search.js`, `data/search-index.json` | Index statique local ; tester résultats, vide et erreur. Adaptateur externe défini par schéma, pas connecté. | EN COURS |
| Creator Studio / Universal Mod Manifest | `creator-studio.html`, `assets/creator-studio.js`, `schemas/universal-mod-manifest.schema.json` | Validation locale de format, sauvegarde et export ; un identifiant de receipt saisi ne prouve pas une attestation. Publication distante absente. | EN COURS |
| Profils créateurs | `profiles.html`, `assets/profiles.js`, `schemas/public-profile.schema.json` | Présentation de contrats et détection des API WebAuthn ; pas d'éditeur de profil public ni de compte authentifié opérationnel. | EN COURS — capacité non livrée |
| Communauté / collections | `community.html`, `assets/community.js`, schémas collection et community-submission | Brouillons, import/export et stockage locaux ; pas de soumission distante, de flux social ou de modération serveur. | EN COURS |
| Provenance / confiance distincte de compatibilité | `verify.html`, `assets/verify.js`, `security.html`, `SHA256SUMS.txt` | Calcul SHA-256 local présent ; concordance d'empreinte ≠ provenance, signature ou innocuité. Démonstrations non attestées. | EN COURS |
| Signatures de publication / modération | Schémas `publication-receipt`, `moderation-receipt`, `moderation-export` | Contrats présents, service de signature/vérification distante non démontré. Ne pas convertir en badges de confiance. | EN COURS — capacité non livrée |
| Smart Profile | `assets/app.js`, `schemas/smart-profile.schema.json`, accueil | Observations CPU logique/écran, mémoire approximative, résultats inconnus possibles ; pas de benchmark ni garantie de performances. | EN COURS |
| Guide MODARYX | Présentation éditoriale et aperçu sur l'accueil | Assistance conceptuelle ; aucun moteur de Guide connecté démontré. Maintenir la distinction avec Nova Guide des OS. | EN COURS — capacité non livrée |
| Sécurité / documentation | `security.html`, `documentation.html`, `public-status.json` | Revoir les promesses et expliciter limites et données locales ; tests d'accès et navigation à consolider. | EN COURS |
| Téléchargements réels | `downloads.html`, `assets/downloads.js`, `downloads.json` | `available:false`, `artifacts:[]`. Attendre artefacts, identité, empreinte, provenance et signature requise ; état indisponible intentionnel. | BLOQUÉ |
| Comptes / authentification | `schemas/account-security.schema.json`, `assets/profiles.js` | Disponibilité d'une API navigateur ≠ compte, passkey inscrite ou connexion réussie. Backend absent. | EN COURS — capacité non livrée |
| Pont vers les OS Nova Forge | `public-status.json` : `nova_forge_os_bridge: not_connected` | Intégration historique non connectée ; ne pas fusionner les produits ou suggérer une session partagée. | EN COURS — capacité non livrée |
| Storage Resolver / Repair Network | Deux schémas dédiés ; `public-status.json` : `not_connected` | Contrats seulement. Ne pas fabriquer une preuve de stockage, réparation ou récupération distante. | EN COURS — capacité non livrée |
| SEO par jeu / catégorie / mod | HTML actuels, `sitemap.xml`, `robots.txt` | Architecture éditoriale cible incomplète. Vérifier métadonnées contre les pages réellement disponibles avant changement ; préserver la configuration actuelle dans ce lot. | EN COURS |
| Responsive / navigation / accessibilité | Shell, contrôles et styles des seize pages | Revue visuelle et parcours clavier, zoom, états et mouvement réduit à documenter page par page. | EN COURS |
| Performance | Site statique, assets locaux, service worker à liste autorisée | Coûts et chargement à mesurer ; ne pas conclure « optimisé » à partir de la seule fluidité perçue. | PREUVE MANQUANTE |

## Surface à couvrir dans la matrice QA

`index.html`, `catalog.html`, `search.html`, `creator-studio.html`, `community.html`, `profiles.html`, `ecosystem.html`, `documentation.html`, `security.html`, `verify.html`, `downloads.html`, `project.html`, `project-ember-textures.html`, `project-balanced-latency-pack.html`, `project-forge-night-experience.html`, `404.html`.

La matrice de recette du lot doit associer chaque page aux captures et aux contrôles réellement effectués : contenu, navigation, responsive, accessibilité et cohérence visuelle. Ce registre n'attribue pas de réussite aux pages non inspectées dans le navigateur.

## Exclusions et traces historiques

- Les tâches DNSSEC/IONOS et suppression Cloudflare getnovaforge.com de l'ancien inventaire ne sont plus des étapes du plan actif. **Conserver `OLD_DOMAIN_UNTOUCHED` ; aucune action d'infrastructure.**
- Les noms de schémas `nova-forge-*`, clés `nova-*`, noms de workflows et traces de provenance sont des références techniques/historiques. Les modifier demande un plan de compatibilité séparé.
- Les anciens chiffres, audits de branches et statuts de fichiers ne sont pas repris comme preuve actuelle.
- Virtual Team Orchestrator, Foundry et autres modules des OS restent dans le chantier Nova Forge. Ils ne deviennent pas des fonctions obligatoires du site par simple association de nom.
- La Master NDI complète et l'intégralité des conversations historiques ne sont pas présentes dans ce registre. L'absence d'autres idées n'est pas affirmée : réconcilier tout nouvel élément explicitement retenu lorsqu'il est récupéré.

## Décision de sortie

**EN COURS — VF non déclarée.** Le lot peut améliorer et vérifier la finition des pages existantes, tout en conservant explicitement les hubs et services absents. Une fusion, un build réussi ou l'existence d'un schéma ne clôture pas ces écarts. Aucune idée retenue n'est implicitement abandonnée ou considérée réalisée par ce document.

## Correction visuelle prioritaire

Pack Loup/Dragon récupéré et trois références web inspectées : intégration accueil et portails EN COURS de recette. Identité MODARYX préservée. Le cycle de croissance des compagnons du concept 01 est un langage visuel complémentaire ; aucune progression interactive n’est déclarée disponible.

## Relecture après c7d91ee

La revue des pages existantes est documentée dans `finish-line/README.md`. Aucun « Modaryx OS » visible trouvé dans les HTML/JS/JSON examinés. Les références getnovaforge.com dans `domain-cutover.json` restent historiques/liées au déploiement, À VÉRIFIER et non modifiées. Aucun hub, compte, backend, artefact ou signature absent ci-dessus n’est clôturé par les résultats visuels. Le corpus NDI complet reste NON RÉCUPÉRÉ.

## Qualification des écarts — 16 septembre 2026

Huit capacités absentes sont reclassées « EN COURS — capacité non livrée » : leur absence ne peut pas être résolue par une simple preuve de test. Aucun périmètre annulé ni service déclaré livré. La matrice de preuves courante détaille séparément les tests externes manquants et les acquis sur les seize pages existantes. Cette qualification ne constitue pas une nouvelle validation produit.
