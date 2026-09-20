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
- **TERMINÉ sur le premier asset** — environnement séparé Premium réel `assets/living-world/environment-premium.jpg`, **1600 × 900**, ajouté par PR #46 et gardé non référencé tant que le bundle compagnon n'est pas complet ;
- PR #46 : **TERMINÉE — fusionnée** au commit `8e9fc9bb2bdc73c047f6b65bd0b223a7b297e744` ; `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING`, Source, PWA Offline, Reflow Chromium, Accessibility Chromium et Lab Performance : **success** ;
- **TERMINÉ — 1/10 couche compagnon** — `assets/living-world/wolf-baby.png` (Louveteau), **1600 × 900 RGBA / alpha=true**, PR #47 fusionnée au commit `ad1de7ce2e99030474e303de9d7044c788c9eb76` ;
- PR #47 : `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING` ; Source, PWA Offline, Reflow Chromium, Accessibility Chromium et Lab Performance : **success** ;
- **TERMINÉ — 2/10 couches compagnon** — `assets/living-world/wolf-juvenile.png` (Loup juvénile), **1600 × 900 RGBA / alpha=true**, SHA-256 `ae7397920f962352e5e47f67f7973fd4711d059e33d83e2188e7b7e73a8a2c03`, PR #48 fusionnée au commit `01af14c8e5623e86ee5166cbcefee32f34603b2f` ;
- PR #48 : `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING` ; Source, PWA Offline, Reflow Chromium, Accessibility Chromium et Lab Performance : **success** ;
- **EN COURS** — 3 couches loup restantes + 5 couches dragon avec alpha ;
- `visualGrowth.status=awaiting-assets` reste obligatoire tant que les dix couches compagnon ne sont pas toutes présentes et prouvées ;
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
- PR #45 : **TERMINÉE — fusionnée** au commit `dc61a0372d9ecab7eae8f4a2091b5e0066e3b316` ; la chronique mondiale reste commune tandis qu’un **rythme local** distinct adapte les activités affichées à saison + heure locale + météo ;
- micro-preuves : `PASS_TARGETED_REAL_WORLD_SYNC` et `PASS_TARGETED_REAL_WORLD_SYNC_BROWSER` ; source, fonctions locales, reflow, accessibilité Chromium, PWA offline/update et performance labo du candidat PR #44 : **success** ;
- erreur performance PR #44 isolée : accueil mobile `7 long tasks > 5` ; correction ciblée : import atmosphère non critique déplacé hors chemin initial ; micro-preuve performance suivante : **success**, sans assouplir le seuil ;
- PR #45 : Source, Living Chronicle, Local Functional, Layered Growth, Reflow, Accessibility, PWA Offline/Installability/Update et Lab Performance : **success** ; un timeout PWA Update a été isolé avec `sw.js` strictement inchangé, puis seul le job échoué a été relancé et a réussi ;
- **PREUVE MANQUANTE** — exécution réelle de la Pages Function sur une preview HTTPS avec `request.cf` ;
- **BLOQUÉ / décision externe** — activation de la météo réelle en production tant que fournisseur, licence et attribution ne sont pas validés ;
- `main`, DNS, DNSSEC, IONOS, secrets et configuration Cloudflare critique restent inchangés.



## Asset compagnon — Loup adolescent — 20 septembre 2026

- PR #49 : **TERMINÉE — fusionnée** au commit `7a229e034aa3f403e12fe689d4731e74d2b40e79` ;
- asset réel : `assets/living-world/wolf-adolescent.png` ;
- dimensions : **1600 × 900** ;
- PNG RGBA, `alpha=true` ;
- SHA-256 final : `79a5676ac09523c691e650d097d9ed18011bd5bff597657e9ab0262bd3856b97` ;
- `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING` ; Source, PWA Offline, Reflow Chromium, Accessibility Chromium et Lab Performance : **success** ;
- incident ciblé : premier checksum faux `fd9e…` ; Source Proof a mesuré l’empreinte réelle `79a5676a…`, seule la ligne checksum a été corrigée, puis micro-proof Source : **success** ;
- asset gardé **non référencé** ; `visualGrowth.status=awaiting-assets` inchangé ;
- couches compagnon : **3/10 TERMINÉES** ;
- **EN COURS** — loup jeune adulte / adulte + cinq stades dragon.


## Asset compagnon — Loup jeune adulte — 20 septembre 2026

- PR #50 : **TERMINÉE — fusionnée** au commit `75f264a347945f9771829201ffd7821d1f83fb8f` ;
- asset réel : `assets/living-world/wolf-young-adult.png` ;
- dimensions : **1600 × 900** ;
- PNG RGBA, `alpha=true` ;
- SHA-256 : `137d2bfee47bd270c7760474c7c83cb5cf596355966f364f1d208b9fcdb14535` ;
- `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING` ; Source, PWA Offline, Reflow Chromium, Accessibility Chromium et Lab Performance : **success** ;
- asset gardé **non référencé** ; `visualGrowth.status=awaiting-assets` inchangé ;
- couches compagnon : **4/10 TERMINÉES** ;
- **EN COURS** — loup adulte + cinq stades dragon.

## Couche compagnon — Loup adulte — 20 septembre 2026

- **TERMINÉ** — PR #51 fusionnée dans la branche Work au commit `f429b4eec281d2d1e5740e5fad8095604fa1da84`.
- Asset : `assets/living-world/wolf-adult.png`.
- Format prouvé : PNG RGBA, **1600 × 900**, alpha=true.
- SHA-256 : `96ef42acd3e209a77602087c0e174335b06f7b85662d3bde53b86c359b56b0d8`.
- Progression visuelle : adulte final pleinement mature, plus imposant et puissant que le jeune adulte, sans agressivité ni dérive monstrueuse ; composition entière conservée avec espace utile à gauche.
- Asset volontairement non référencé ; `visualGrowth.status=awaiting-assets` reste inchangé.
- Preuves ciblées : Layered Growth Asset Gate `35477224017`, Site First Source `35477224046`, PWA Offline `35477224004`, Accessibility `35477224002`, Reflow `35477224010`, Lab Performance `35477224220` — toutes **success**.
- Couches compagnon : **5/10 TERMINÉES**.
- **EN COURS** — cinq stades dragon restent à produire, intégrer et prouver avant tout passage `ready`.

## Couche compagnon — Dragonneau — 20 septembre 2026

- **TERMINÉ** — PR #52 fusionnée dans la branche Work au commit `19c0da457d8f6e587b8d48500ca6b35692efb660`.
- Asset : `assets/living-world/dragon-baby.png`.
- Format prouvé : PNG RGBA, **1600 × 900**, alpha=true.
- SHA-256 : `3f2067fcbe7ea7ceb3a1fe76611f3438dcd1807723c9d2bc1e8c03d9945adb66`.
- Direction : Dragonneau réaliste, proportions juvéniles, expression calme, composition trois-quarts, sans armure/accessoire/texte/autre animal.
- Asset volontairement non référencé ; `visualGrowth.status=awaiting-assets` reste inchangé.
- Preuves ciblées : Layered Growth Asset Gate `35477467690`, Site First Source `35477467766`, PWA Offline `35477467671`, Accessibility `35477467702`, Reflow `35477467706`, Lab Performance `35477467667` — toutes **success**.
- Couches compagnon : **6/10 TERMINÉES**.
- **EN COURS** — dragon juvénile / adolescent / jeune adulte / adulte restent à produire, intégrer et prouver avant tout passage `ready`.
- Validation artistique humaine finale du bundle complet : **PREUVE MANQUANTE** tant que les 10 couches ne sont pas réunies dans leur rendu intégré.

## Couche compagnon — Dragon juvénile — 20 septembre 2026

- **TERMINÉ** — PR #53 fusionnée dans la branche Work au commit `35b70b87bfb0c19ce4e9051f95adb51ab413a480`.
- Asset : `assets/living-world/dragon-juvenile.png`.
- Format prouvé : PNG RGBA, **1600 × 900**, alpha=true.
- SHA-256 : `3ee8b9a0a9ea83000b3cbd2e1e0560690e7923d5764c7f20a0a171d228c0cde3`.
- Dérivé du Dragonneau pour maintenir la continuité d'identité ; stade juvénile plus grand et plus assuré, sans basculer adolescent.
- Asset volontairement non référencé ; `visualGrowth.status=awaiting-assets` reste inchangé.
- Preuves ciblées : Layered Growth Asset Gate `35477746978`, Site First Source `35477746997`, PWA Offline `35477746983`, Accessibility `35477746988`, Reflow `35477746993`, Lab Performance `35477746982` — toutes **success**.
- Couches compagnon : **7/10 TERMINÉES**.
- **EN COURS** — dragon adolescent / jeune adulte / adulte.

## Couche compagnon — Dragon adolescent — 20 septembre 2026

- **TERMINÉ** — PR #54 fusionnée dans la branche Work au commit `15e2993fa3e93c02cd69834672b97fe3ffc2cb1e`.
- Asset : `assets/living-world/dragon-adolescent.png`.
- Format prouvé : PNG RGBA, **1600 × 900**, alpha=true.
- SHA-256 : `288859aba608a4c57ccdfb43ab4c4004c25b10bcecddb84e40be8f472960500f`.
- Dérivé du dragon juvénile ; développement intermédiaire sans atteindre le jeune adulte.
- Asset volontairement non référencé ; `visualGrowth.status=awaiting-assets` reste inchangé.
- Preuves ciblées : Asset Gate `35477956449`, Source `35477956448`, PWA `35477956440`, Accessibility `35477956461`, Lab Performance `35477956479` — **success**.
- Reflow `35477956465` : tentative 1 **failure** exacte `FAIL_TARGETED_BROWSER_REFLOW_MICROPROOF / fetch failed`; isolation infrastructure/loopback, aucun changement de code ; re-run ciblé du seul job échoué, tentative 2 **success**.
- Couches compagnon : **8/10 TERMINÉES**.
- **EN COURS** — dragon jeune adulte / adulte.



## Dragon jeune adulte — couche compagnon — 20 septembre 2026

- **TERMINÉ** — PR #55 fusionnée dans la branche active PR #12.
- commit d’intégration : `6568976457c2df0115f6d103572bc713a5cae23d` ;
- asset : `assets/living-world/dragon-young-adult.png` ;
- PNG 1600 × 900, RGBA 8-bit, alpha=true ;
- SHA-256 : `f19e00f3ae9dee33a502b9bc78d3bfefabd82a8db377d8ac270fd69e95901615` ;
- couche gardée non référencée ; `visualGrowth.status=awaiting-assets` reste inchangé ;
- progression visuelle : plus grand, plus puissant et plus assuré que l’adolescent, sans atteindre encore le dragon adulte final ;
- bundle compagnon : **9/10 TERMINÉES** ;
- reste : **dragon adulte final** ;
- validation artistique humaine finale du bundle complet : **PREUVE MANQUANTE**.

Preuves ciblées PR #55 :

- Layered Growth Asset Gate `35479370917` — **success**, marker `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING`, candidat 1600 × 900, alpha=true, failures=[] ;
- Site First Source `35479370904` — **success** ;
- PWA Offline `35479371297` — **success** ;
- Browser Accessibility `35479370936` — **success** ;
- Browser Reflow `35479371074` — **success** ;
- Lab Performance `35479371003` — **success**.

Aucun full replay n’a été lancé. `main`, DNS, DNSSEC, IONOS et Cloudflare critique restent inchangés.


## Dragon adulte final — couche compagnon — 20 septembre 2026

- **TERMINÉ** — PR #56 fusionnée dans la branche active PR #12.
- commit d’intégration : `d34d3efa6e9d88650280764634071c0090399f0f` ;
- asset : `assets/living-world/dragon-adult.png` ;
- PNG 1600 × 900, RGBA 8-bit, alpha=true ;
- SHA-256 : `b4c0805fe39e4ca9e0cdc60410fbb62acbeff6c661c25267bb958473d16c233c` ;
- couche gardée non référencée pendant ce lot ; `visualGrowth.status=awaiting-assets` reste inchangé ;
- bundle compagnon : **10/10 TERMINÉES sur les assets séparés prouvés** ;
- loup : 5/5 ; dragon : 5/5 ;
- validation artistique humaine finale du bundle complet : **PREUVE MANQUANTE** ;
- activation réelle de la croissance visuelle : **EN COURS / étape suivante séparée**.

Preuves ciblées PR #56 :

- Layered Growth Asset Gate `35479965713` — **success**, marker `PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING`, `dragon-adult.png` 1600 × 900, alpha=true, failures=[] ;
- Site First Source `35479965731` — **success** ;
- PWA Offline `35479965803` — **success** ;
- Browser Accessibility `35479965703` — **success** ;
- Browser Reflow `35479965684` — **success** ;
- Lab Performance `35479965704` — **success**.

Aucun full replay n’a été lancé. `main`, DNS, DNSSEC, IONOS et Cloudflare critique restent inchangés.


## Activation croissance visuelle intégrée — PR #57 — 20 septembre 2026

- **TERMINÉ sur le périmètre source / navigateur ciblé** — PR #57 fusionnée dans la branche Work.
- candidat final : `8f0d61c03137cf9a4e262e1e8da8a47c1f83e813`.
- commit d'intégration : `beb4074c6ac8eff27c6ca01f4359228f1e6ae93d`.
- `visualGrowth.status` : `ready`.
- environnement + 10 stades compagnon référencés.
- activation courante uniquement, fallback composite conservé, reduced-motion conservé.
- saison + météo réelle + heure locale appliquées aussi aux couches compagnon quand le reality sync est actif.
- correctif performance : `VISUAL_GROWTH_DELAY_MS = 2200` après load puis idle ; budgets inchangés.
- performance finale ciblée : **success** — index mobile LCP 2152/load 2111, catalogue mobile LCP 1816/load 1778.5, index desktop LCP 2028/load 1968.4, catalogue desktop LCP 1832/load 1776.7.
- erreur de harnais offline `fresh source state` isolée : mock navigateur incomplet ; correction test-only ; micro-proof `PASS_TARGETED_LIVING_WORLD_OFFLINE_STATE`.
- 11 workflows ciblés du candidat final : **success**.
- aucun full replay.
- `main`, DNS, DNSSEC, IONOS et Cloudflare critique inchangés.
- **PREUVE MANQUANTE** — validation artistique humaine du rendu intégré environnement + loup + dragon sur une preview réelle.
- **EN COURS** — prochain point : inspection intégrée desktop/mobile + reduced-motion + interaction reality sync, puis correction ciblée uniquement si nécessaire.

---

## Synthèse fraîche anti-oubli — 20 septembre 2026 — après PR #61

**Cette synthèse est la lecture courante du registre.** Les sections historiques ci-dessus restent conservées pour provenance mais leurs anciens libellés `awaiting-assets`, nombres de couches incomplets ou anciennes PREUVE MANQUANTE ne doivent pas être interprétés comme l'état actuel lorsqu'une ligne ci-dessous les supersède.

| Élément suivi | État courant | Preuve / règle |
|---|---|---|
| Environnement séparé Premium HD | **TERMINÉ** | Asset réel intégré au bundle de croissance. |
| Loup — 5 stades | **TERMINÉ 5/5** | bébé → juvénile → adolescent → jeune adulte → adulte. |
| Dragon — 5 stades | **TERMINÉ 5/5** | bébé → juvénile → adolescent → jeune adulte → adulte. |
| Activation croissance visuelle | **TERMINÉ — périmètre ciblé** | `visualGrowth.status=ready`, environnement + 10 assets référencés. |
| Preview HTTPS du monde vivant | **TERMINÉ — preuve ciblée** | Run `35483330153`, marker `PASS_TARGETED_PREVIEW_VISUAL_CAPTURE`, desktop + mobile + reduced-motion. |
| Reduced motion du monde vivant | **TERMINÉ — preuve ciblée déployée** | animation couches `none`, transitions `0s` dans le cas reduced-motion. |
| Saison + heure locale via contexte grossier | **TERMINÉ — preuve ciblée déployée** | reality sync `active`, source `cloudflare-coarse`, saison/daypart observés. |
| Météo réelle production | **BLOQUÉ / décision externe** | Fournisseur, licence, attribution et confidentialité à valider ; aucune activation silencieuse. |
| Validation artistique humaine finale | **PREUVE MANQUANTE** | Captures réelles disponibles et inspectées de façon assistée, mais validation humaine finale distincte. |
| CodeQL PR #12 | **TERMINÉ sur les constats actuellement ouverts** | Run `35484967852` success ; 11/11 threads historiques résolus. |
| Finition Premium HD 17 pages | **EN COURS** | Poursuivre page par page ; une page n'hérite pas automatiquement de la preuve d'une autre. |
| Accessibilité externe | **PREUVE MANQUANTE** | Lecteur d'écran natif, 400 % réel, tactile/appareils physiques à fermer. |
| PWA réelle HTTPS | **PREUVE MANQUANTE** | Installation/update/offline/online sur environnement réel à fermer. |
| CWV représentatifs | **PREUVE MANQUANTE** | Les budgets labo ciblés déjà verts ne remplacent pas les données représentatives réelles. |
| Validation juridique complète | **PREUVE MANQUANTE** | Ne pas inventer identité légale, droits ou attestations. |
| Comptes / authentification | **EN COURS — capacité non livrée** | Backend d'identité réel requis. |
| Publication / modération distante | **EN COURS — capacité non livrée** | Backend sécurisé réel requis. |
| Storage Resolver | **EN COURS — capacité non livrée / dépendance service** | Aucun faux service. |
| Repair Network | **EN COURS — capacité non livrée / dépendance protocole** | Aucun faux protocole/endpoints. |
| OS Bridge | **EN COURS — capacité non livrée / dépendance Nova Forge OS** | Produits distincts ; attendre une interface publique stabilisée. |
| Téléchargements réels | **BLOQUÉ** | Artefacts + identité + hash + provenance + signature lorsque requise. |
| GTA 6 / RDR2 / catégories / guides | **EN COURS — capacité non livrée** | Contenu substantiel, sources et droits nécessaires ; aucune page SEO vide. |
| Guide MODARYX connecté | **EN COURS — capacité non livrée** | Ne pas confondre avec Nova Guide des OS. |

### Règle de fermeture

Avant la VF, chaque entrée retenue doit finir dans l'un de ces états documentés : **TERMINÉ**, **EN COURS**, **BLOQUÉ** ou **PREUVE MANQUANTE**. Rien n'est supprimé implicitement pour faire monter un pourcentage.

PR #58, #59, #60 et #61 sont des lots QA/sécurité/preuve ; ils ne transforment pas une capacité produit distante en fonctionnalité livrée. Aucun full replay n'a été exécuté pendant leur fermeture.

