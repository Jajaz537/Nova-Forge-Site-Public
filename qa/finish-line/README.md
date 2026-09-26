# MODARYX — revue consolidée de finition

15 septembre 2026. PR #12, branche `design/modaryx-premium-hd-20260914-work`.
Baseline vérifiée : `bcec1f008c93c2096b3f7ee10b4df3fc2e634717`.
Corrections : `05d8e79e91c5184073d596c3e6926e06c2c9662a`, puis `c7d91eedee1a264c77dff98df14fe18c57e605d6`.

**TERMINÉ : lot de revue visuelle des seize pages sur ordinateur, corrections ciblées et contrôles source ci-dessous. EN COURS : qualification VF du produit.** Une capture d’un état ne valide pas tous ses parcours. Les images WebP sont des captures navigateur réduites pour archivage, sans modification de leur contenu.

## Défauts observés et corrections vérifiées

| Défaut | Correction | Preuve |
|---|---|---|
| Studio : deux sélecteurs étirés à 78,3125 px par l’aide du champ voisin | `align-content:start` sur les labels ; quatre sélecteurs mesurés à 48 px après déploiement | [Studio après](after-creator-studio.webp). Mesure initiale DOM, pas de capture avant conservée dans ce dossier. |
| Catalogue à 768 px : colonne de contrat trop étroite, mots coupés | Passage sur une colonne jusqu’à 860 px ; texte de contrat retrouve sa largeur | [Avant](before-catalog-768.webp) · [Après](after-catalog-768.webp) |
| Index projets : grille de détails asymétrique appliquée à trois cartes équivalentes | Trois colonnes égales au-dessus de 860 px ; une colonne en dessous | [Avant](before-project.webp) · [Après](after-project.webp). Colonnes natives mesurées : 382,656 / 382,672 / 382,656 px. |
| Accueil : statut chargé remplaçant le texte clair par du jargon build/public-only | Message public explicite, disponibilité toujours conditionnelle et contrôlée | Texte lu après déploiement : « MODARYX est en pré-VF… Aucun téléchargement public n’est déclaré disponible. » |
| Téléchargements : états internes `available=false` et `artifacts=[]` en présentation principale | Description lisible de l’indisponibilité, lien technique existant conservé | Contrôles consommateurs inchangés ; aucune ouverture de distribution. |
| Outil QA : changement de largeur pendant une navigation pouvant associer ancienne URL et nouveau choix | Refus de mesurer tant que le document demandé n’est pas complètement chargé ; comparaison des chemins canoniques | Les 32 mesures finales vérifient aussi explicitement URL et largeur demandées. |

## Revue page par page

Ces vues couvrent l’état initial chargé sur ordinateur, sauf les exceptions explicites. Les 16 pages ont aussi été mesurées aux largeurs demandées 390/768 puis 320/960 ; cela ne signifie pas que chaque état interactif a été inspecté visuellement à chacune de ces tailles.

| Page | Observation de composition / contenu | Capture |
|---|---|---|
| Accueil | Art Loup/Dragon, portails, hiérarchie or/anthracite conservés ; statut runtime clarifié | [Accueil](before-index.webp) |
| Catalogue | Cartes et filtres cohérents ; défaut tablette corrigé | [Catalogue](before-catalog.webp) |
| Communauté | Collections et brouillons distincts, catalogue chargé avec trois choix ; aucune publication revendiquée | [Communauté](before-community.webp) |
| Creator Studio | Sections lisibles, aperçu JSON séparé, aides et contrôles réalignés ; erreur sur formulaire vide observée sur mobile | [Studio corrigé](after-creator-studio.webp) |
| Documentation | Navigation de sections et tableaux lisibles sur ordinateur ; limites explicites | [Documentation](before-documentation.webp) |
| Téléchargements | État indisponible volontaire, contrat et aide séparés ; texte simplifié dans ce lot | [Téléchargements avant](before-downloads.webp) |
| Écosystème | Panorama portails, modules locaux séparés des services non connectés | [Écosystème](before-ecosystem.webp) |
| Profils | Cartes cohérentes ; disponibilité navigateur ne devient pas une authentification | [Profils](before-profiles.webp) |
| Projets | Trois cartes équilibrées après correction | [Projets corrigés](after-project.webp) |
| Balanced Latency Pack | Fiche démonstrative, relations et droits distincts ; galerie volontairement vide | [Balanced](before-project-balanced-latency-pack.webp) |
| Ember Textures | Hiérarchie identique aux autres fiches, absence d’artefact explicite | [Ember](before-project-ember-textures.webp) |
| Forge Night Experience | Même structure, preuves de compatibilité non inventées | [Forge Night](before-project-forge-night-experience.webp) |
| Recherche | Champ identifié, résultats lisibles, périmètre local indiqué | [Recherche](before-search.webp) |
| Sécurité | Principes, états et limites séparés ; aucun badge ne constitue une attestation | [Sécurité](before-security.webp) |
| Vérificateur | Formulaire et résultat distincts ; aides et limites du SHA-256 visibles | [Vérificateur](before-verify.webp) |
| 404 | Message et retours de navigation disponibles | [404](before-404.webp) |

## Preuves exécutées

- [Validation source](source-validation.json) : **22 scripts, 22 codes de sortie 0** sur les sources après `c7d91ee`. Ce nombre désigne des scripts, pas 22 scénarios navigateur. Structure des 16 pages, syntaxe des 13 scripts et 76 empreintes vérifiées dans ce lot ; détails dans les sorties archivées.
- [Mesures responsive](responsive.json) : 32 observations initiales à 390/768 et 15 observations après correction sur Catalogue/Studio/Projets à 320/390/768/960/1280. Aucune largeur de document supérieure à la largeur utile. Les URL ont été recoupées avant conservation.
- [Reflow final](final-reflow.json) : 32 observations sur les 16 pages à 320/960 après les corrections, aucun débordement horizontal et aucun tabindex positif. Les barres de défilement peuvent réduire la largeur utile de 15 px. Aucune équivalence revendiquée avec un zoom natif 200/400 %.
- Studio mobile : ancre Compatibilité et champs inspectés ; formulaire vide produit « À corriger : 8 point(s) » et bloque sauvegarde/export. La tentative d’inspection du focus à travers `contentDocument` du harnais a échoué dans l’outil : **aucune nouvelle preuve de focus revendiquée pour ce parcours**.
- Budgets source actuels : CSS max 69 776 octets/page, JS déclaré max 26 968, précache 797 096 octets, 71 requêtes/70 fichiers. Sous les budgets proposés 70 000 / 30 000 / 800 000. Ce ne sont pas des octets réellement transférés ni des Core Web Vitals.
- 25 assertions de cache simulées réussies ; zéro différence sur les fichiers d’infrastructure protégés dans ce contrôle. Contrôleur worker HTTPS actif observé dans le navigateur. Rien de cela ne prouve une navigation effectivement déconnectée.

## Anti-oubli et limites de sortie

Le registre [MODARYX-ANTI-OUBLI](../MODARYX-ANTI-OUBLI.md) et l’inventaire d’idées ont été relus. Aucun « Modaryx OS » visible trouvé dans les HTML/JS/JSON examinés. `domain-cutover.json` conserve des références historiques getnovaforge.com : **À VÉRIFIER / HISTORIQUE**, fichier lié à l’ancien déploiement, non modifié. Les clés et schémas Nova Forge historiques ne sont pas renommés globalement.

**PREUVE MANQUANTE, limites de l’environnement :** lecteur d’écran natif, zoom navigateur 200/400 % effectivement observé, appareils physiques, profiling LCP/CLS/INP, cache froid et réseau contrôlés, cycle réel installation/mise à jour/déconnexion/reconnexion/reprise PWA. Le navigateur exposé ne fournit pas ici de commande de déconnexion ni de profiler. L’essai antérieur de raccourci zoom n’a pas changé la largeur observée : il ne vaut pas test de zoom.

**Fonctions et contenu encore absents, pas de simples preuves externes :** hubs GTA 6/RDR2 avec contenu substantiel et sources/droits qualifiés, corpus réel du catalogue, comptes/authentification, publication et modération distantes, Guide connecté, Storage Resolver/Repair Network, artefacts de téléchargement et signatures. Les schémas ou démonstrations ne réalisent pas ces capacités. Leur statut reste ouvert ; aucune annulation ou substitution implicite.

La Master NDI complète et toutes les décisions historiques ne sont pas récupérées : **NON RÉCUPÉRÉ** pour l’exhaustivité de ce corpus. Les références Loup/Dragon récupérées et la séparation MODARYX web / Nova Forge OS restent applicables.

**VF NON VALIDÉE.** Ce lot ferme les défauts visuels reproduits, pas l’intégralité du produit ni une conformité d’accessibilité. La PR reste en brouillon. Aucun OS, domaine ou réglage d’infrastructure modifié.

## Contrôle de continuité — 18 septembre 2026

Le preview de branche a été rouvert dans Chromium à l’URL `https://design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev/`. Les 17 routes publiques ont chacune un titre, un `h1`, un `main`, un footer, aucune image cassée après `networkidle`, aucun lien vide sans nom accessible et aucun débordement horizontal au viewport du contrôle. Les premiers écrans de l’accueil, du Catalogue, de Creator Studio, de Communauté, de l’Écosystème et de Sécurité ont été inspectés : la direction Loup/Dragon et les surfaces cinématiques MODARYX sont présentes.

Preuve structurée : `qa/preview-visual-structure-20260918.json`. La révision réellement déployée reste **PREUVE MANQUANTE** : le preview ne publie aucun marqueur reliant son contenu à un SHA Git. Le HEAD distant lu juste avant le contrôle était `7454e13a80e78c6680b1499ee115bdd697ec2e0a`. La production `modaryxmods.com` affiche encore une présentation antérieure et n’est pas déclarée alignée sur ce candidat.
