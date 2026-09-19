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
| Index jeux / catégories extensibles | Champs `game`, `kind`, `tags` dans `data/catalog.json` | Index `/games/` ajouté pour les trois jeux des démonstrations, liens vers les fiches existantes. Pages de catégories et corpus réel restent absents. Recette propre à cette 17e page, sans hériter automatiquement des preuves des seize précédentes. | EN COURS |
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
| Responsive / navigation / accessibilité | Shell, contrôles et styles des seize pages | Zoom/reflow 200 % ciblé acquis sur six pages dans Firefox et Chromium ; lecteur d'écran, 400 %, tactile et états restants à documenter. | EN COURS |
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

## Mémo récupéré — dépendances de développement à ne pas oublier — 19 septembre 2026

Ces éléments étaient déjà partiellement représentés dans le registre par leurs contrats ou états `not_connected`. Le présent ajout conserve explicitement les **conditions de déclenchement** retrouvées dans les mémos utilisateur afin qu'elles ne soient pas perdues avant la VF complète.

| Capacité | Condition retenue | État | Règle de reprise |
|---|---|---|---|
| OS Bridge | Après stabilisation de l'interface publique de **Nova Forge OS** | **EN COURS — capacité non livrée / dépendance externe** | Ne pas anticiper ni simuler le pont. MODARYX et Nova Forge OS restent deux produits distincts ; le pont éventuel doit utiliser une interface publique stabilisée et documentée. |
| Storage Resolver | Lorsque le service de stockage sera disponible | **EN COURS — capacité non livrée / dépendance service** | Le schéma actuel ne constitue pas le service. Ne développer l'intégration réelle qu'avec un stockage disponible, sécurisé et vérifiable. |
| Repair Network | Lorsque son protocole public sera finalisé | **EN COURS — capacité non livrée / dépendance protocole** | Le schéma actuel ne constitue pas le réseau. Attendre un protocole public finalisé ; ne pas inventer d'endpoint, de réparation distante ou de preuve de récupération. |
| Backend communautaire | Lorsqu'une solution sécurisée respectant le budget de **0 €** sera prête | **EN COURS — capacité non livrée / solution à qualifier** | Ne pas fabriquer de backend temporaire présenté comme final. Toute solution retenue doit être sécurisée, compatible avec le budget de 0 €, documentée et validée avant activation de publication/modération distante. |

### Anti-confusion

- **OS Bridge** est une intégration optionnelle de la plateforme web MODARYX avec l'interface publique de Nova Forge OS ; il ne fusionne pas les identités des deux produits.
- **Storage Resolver**, **Repair Network** et le **backend communautaire** restent des capacités MODARYX non livrées tant que leurs dépendances réelles ne sont pas disponibles.
- L'existence de schémas JSON, états UI ou contrats ne vaut jamais preuve qu'un service distant existe.
- Ces quatre entrées doivent rester tracées jusqu'à livraison réelle ou décision produit explicite ; aucune suppression implicite avant la VF.

## Monde vivant — exigence retenue pour la VF — 19 septembre 2026

Décision utilisateur à conserver avant la VF : MODARYX ne doit pas rester une galerie d'images figées.

- La direction visuelle générale actuelle est **approuvée** ; arrêter la recherche par nouvelles photos/illustrations tant qu'aucun besoin précis de production ne réouvre ce sujet.
- Le monde doit évoluer avec le temps.
- Le loup et le dragon doivent grandir progressivement dans la chronologie du monde.
- Les animaux, habitants, gardes, lumières, eau et végétation doivent pouvoir gagner une activité discrète et cohérente au fil des versions.
- Le héros reste occasionnel et ne doit pas dominer chaque scène.
- Reduced motion doit couper les animations sans arrêter la progression logique du monde.
- Une illustration composite seule n'est pas une preuve de « monde vivant » : la croissance visuelle individuelle nécessite des couches/éléments séparés et reste à fermer avant la VF si elle est retenue comme exigence visuelle finale.

Première base technique : `data/living-world.json`, `assets/living-world.js`, `assets/living-world.css` et `qa/MODARYX-LIVING-WORLD-SYSTEM-20260919.md`.

### Règle canonique de croissance des compagnons — 19 septembre 2026

Décision utilisateur explicite à ne pas perdre :

- **Louveteau / Dragonneau** au départ ;
- puis pour les deux : **juvénile → adolescent → jeune adulte → adulte** ;
- le loup et le dragon utilisent donc le **même ordre de stades** ;
- leurs vitesses de croissance peuvent être réglées séparément ;
- toute future couche visuelle doit respecter ce modèle partagé et montrer le stade réellement calculé, sans sauter directement à une apparence adulte.

## Confirmation anti-oubli — monde vivant + cache durable — 19 septembre 2026

À conserver avant toute VF :

- monde vivant évolutif obligatoire, pas de galerie d'images figées ;
- Louveteau et Dragonneau suivent le même ordre de stades : bébé → juvénile → adolescent → jeune adulte → adulte ;
- rythme de croissance indépendant possible selon l'espèce ;
- croissance visuelle réelle à terminer via couches séparées ;
- précache cœur compact comme architecture permanente ;
- ne jamais remettre jeux/mods/modules/visuels lourds dans le précache global par défaut ;
- utiliser chargement à la demande + runtime cache borné ;
- garde-fou 800000 conservé sans hausse arbitraire ;
- état courant de référence : noyau 111076 octets, marge 688924 octets, runtime monde vivant 11065 octets ;
- validation PWA/offline réelle encore PREUVE MANQUANTE.

## Priorité confirmée — Site First jusqu'à VF — 19 septembre 2026

Décision utilisateur : **MODARYX est désormais la priorité n°1 jusqu'à sa VF ultra haut de gamme**.

À conserver :

- poursuivre automatiquement MODARYX avant la finition finale des OS ;
- ne jamais fusionner les identités MODARYX et Nova Forge OS ;
- rendre visible que les deux produits sont créés par la même équipe ;
- garder MODARYX comme univers web vivant et Nova Forge OS comme logiciel/OS distinct ;
- ne déclarer ni 100 % ni VF tant que les preuves correspondantes ne sont pas réellement fermées ;
- toute capacité dépendant d'un backend, de droits, d'artefacts, d'un protocole ou d'une interface OS stabilisée reste BLOQUÉE/EN COURS plutôt que simulée.

Plan de reprise : `qa/MODARYX-SITE-FIRST-VF-PLAN-20260919.md`.

## Croissance visuelle — architecture prête, assets finaux encore manquants — 19 septembre 2026

Le contrat `layered-stage-assets-v1` et ses deux slots `wolf` / `dragon` sont désormais intégrés au candidat. Le moteur sait associer le stade logique courant à une couche visuelle indépendante, avec environnement séparé et activation atomique.

Aucun asset de stade n'est inventé : `visualGrowth.status=awaiting-assets` et les chemins restent nuls tant que de vrais visuels cohérents Premium HD ne sont pas disponibles.

Statuts à conserver :

- **TERMINÉ** — contrat de couches, mapping des cinq stades, politique same-origin/runtime-on-demand et fallback composite ;
- **EN COURS** — production/intégration des vrais assets loup + dragon + environnement séparé ;
- la croissance visuelle individuelle ne devient **TERMINÉE** qu'après présence, rendu et preuve des assets réels.

## Monde vivant — chronique ambiante partagée — 19 septembre 2026

La chronologie inclut désormais une chronique déterministe par créneaux de 3 heures : gardes, ateliers, marchés, oiseaux, faune, patrouilles, quais et veilleurs.

- **TERMINÉ** — logique partagée, sélection déterministe et présentation accessible ;
- **TERMINÉ** — performance/reflow/accessibilité ciblés du candidat ;
- **EN COURS** — représentation visuelle réelle des habitants, animaux et compagnons quand les assets Premium HD correspondants existent ;
- ne jamais confondre un signal narratif avec une preuve que le personnage est visible dans l'image.

## Synchronisation monde réel — intégrée sur la branche PR #12 — 20 septembre 2026

Décision utilisateur explicitement retenue pour la VF :

- MODARYX mélange **saison locale + heure locale + météo réelle** pour sa lentille atmosphérique ;
- l’adaptation saisonnière est automatique et ne demande pas de permission GPS ;
- hémisphère Nord et Sud sont inversés correctement ;
- les zones tropicales utilisent un profil tropical plutôt qu’un faux hiver tempéré ;
- pluie, neige, brouillard, orage, **vent, nuages et éclaircies** peuvent influencer l’ambiance avec intensité plafonnée, transitions progressives, lisibilité, reduced motion et performances prioritaires ;
- la chronologie MODARYX, les événements du royaume et la croissance loup/dragon restent partagés et indépendants de cette couche locale ;
- aucun fournisseur météo ne doit être activé silencieusement sans validation de licence, attribution et confidentialité ;
- aucune ville, code postal ou coordonnée exacte n’est renvoyée au navigateur pour cette fonctionnalité ; les coordonnées destinées au fournisseur sont arrondies à **0,1°** côté serveur.

État vérifié :
- **TERMINÉ sur le périmètre ciblé** — moteur saison Nord/Sud/tropical + heure locale + fusion météo normalisée + endpoint same-origin + confidentialité ;
- PR #43 : **TERMINÉE — fusionnée** dans la branche active de PR #12 au commit `e728670d763bdd872b670b798b323e1cfc8597f7` ;
- PR #44 : **TERMINÉE — fusionnée** au commit `7a91f813e60279bfffaf60bdcf750fa003c78a15` pour compléter vent, nuages et éclaircies ;
- micro-preuves : `PASS_TARGETED_REAL_WORLD_SYNC` et `PASS_TARGETED_REAL_WORLD_SYNC_BROWSER` ; source, fonctions locales, reflow, accessibilité Chromium, PWA offline/update et performance labo du candidat PR #44 : **success** ;
- erreur performance PR #44 isolée : accueil mobile `7 long tasks > 5` ; correction ciblée : import atmosphère non critique déplacé hors chemin initial ; micro-preuve performance suivante : **success**, sans assouplir le seuil ;
- **PREUVE MANQUANTE** — exécution réelle de la Pages Function sur une preview HTTPS avec `request.cf` ;
- **BLOQUÉ / décision externe** — activation de la météo réelle en production tant que fournisseur, licence et attribution ne sont pas validés ;
- `main`, DNS, DNSSEC, IONOS, secrets et configuration Cloudflare critique restent inchangés.

