# CHECKPOINT-CANONIQUE — MODARYX V2 — R3 CSS CONSOLIDATION — 2026-10-09

**État opérationnel : EN COURS**. Ce checkpoint reprend le chantier technique R3 **sans remplacer** les obligations juridiques/commerciales et les registres du checkpoint `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-07-P0-RIGHTS-FR-EU.md`.

## Portée / Git
- Produit : **MODARYX Web V2**, design Premium bleu nuit/cyan/violet, **jamais V1/ancien design**.
- Dépôt : `Jajaz537/Nova-Forge-Site-Public`.
- PR de travail : [#292](https://github.com/Jajaz537/Nova-Forge-Site-Public/pull/292), **draft ouverte**.
- Branche : `design/modaryx-v2-vf-architecture-r3-20261008`.
- HEAD testé pour ce lot : `2dd3734e92275c30a4225118b8c6b254b841d6da`.
- Branche produit de référence : `design/modaryx-v2-blue-violet-product-20261005`.
- Aucun merge, main, DNS/DNSSEC/nameserver, Cloudflare prod, D1/R2 prod, paiement ou cutover.
- Ne jamais écraser un travail parallèle sans nouveau contrôle branche/SHA.

## Lots R3 terminés sur le code candidat
1. Commit `c211dd959b9e9d8a51190cb57416fbc3b645871b` : suppression groupée de **89 déclarations de même valeur** ultérieurement définies au même sélecteur et contexte ; 5 fichiers R15–R19.
2. Commit `2dd3734e92275c30a4225118b8c6b254b841d6da` : suppression groupée de **232 déclarations primitives remplacées par une déclaration ultérieure !important**, sélecteur + contexte identiques, avec exclusions conservatrices des expressions variables/modernes ; 5 fichiers R15–R19.
3. **321 déclarations consolidées** en deux commits, sans modifier le CSS VF final ni les sources d'images et sans changement de fonctionnalité.
4. Build et tests Chrome déclenchés sur chaque HEAD par GitHub Actions. Validation visuelle propriétaire exhaustive **PREUVE MANQUANTE** : ne pas la déduire des tests automatiques.

## Preuves de laboratoire — SHA `2dd3734e92275c30a4225118b8c6b254b841d6da`
- Performance Candidate Proof, run `37927953636` : **BLOQUÉ** uniquement par le contrat CSS `CSS gzip 46470 > 22000`.
- Bundle CSS gzip level-9 : **46 470 octets**, plafond **22 000** (écart **24 470**).
- Comparaison : 47 511 au point de départ, 47 390 après le premier lot, **46 470 après le deuxième**. Gain total mesuré **1 041 octets gzip**.
- Bundle JS gzip : **104 927 octets**, plafond **105 000**, marge **73 octets**.
- Desktop lab 1440×1024 : LCP **700 ms**, CLS **0.008421**, réponse route **210.9 ms**, tous sous les budgets du contrat.
- Mobile lab 390×844 : LCP **1 492 ms**, CLS **0**, réponse route **45.7 ms**, tous sous les budgets du contrat.
- Preview Root Proof : **TERMINÉ — PASS**, run `37927953555`.
- Production Candidate Root Proof : **TERMINÉ — PASS**, run `37927953540`.
- Production Rehearsal : **BLOQUÉ** par le même CSS budget, run `37927953516`.
- Ces métriques LAB ne sont pas des Core Web Vitals terrain ; la production, l'approbation esthétique et le release PASS restent ouverts.

## Prochaine tâche : optimisation architecturale, pas micro-chasse infinie
Le bundle CSS reste trop volumineux avec **23 imports** depuis `v2/src/main.jsx`. Ne pas tricher via plafond relevé, CSS différé seulement pour contourner la mesure, ou disparition de composants/design. Explorer une consolidation AST robuste et les CSS réellement spécifiques aux routes **sans dégrader FOUC, accessibilité, responsive, reduced-motion ou UX**. Refaire build mesuré, comparaisons visuelles desktop/mobile et micro-proofs frais au SHA final.

## Trois gates indépendantes
- **VF TECHNIQUE : EN COURS** — budget CSS BLOQUÉ ; visuel Premium propriétaire PREUVE MANQUANTE ; Previews et candidats PASS ciblés seulement.
- **LAUNCH-READINESS COMMERCIALE : EN COURS** — ni prix ni modèle commerciaux validés par ce lot.
- **LEGAL / COMPLIANCE : BLOQUÉ / PREUVE MANQUANTE pour lancement FR/UE** — mêmes faits manquants que checkpoint 2026-10-07 (provenance/droits assets, opérateur, contrats, privacy, DSA, taxes et revues nécessaires). Aucun PASS juridique inventé.

## Anti-oubli et séparation
MODARYX Web distinct de MODARYX OS Public/Fondateur ; « Nova Forge » provenance/legacy seulement. Aucun mélange avec écosystème jeu/site 18+. Valeur Premium, performance, inclusion, privacy by design et qualité restent obligatoires. Préserver les preuves et le legacy guard byte-locké ; .NET OS 10.0.302 inchangé.

## Extension du checkpoint — lot R8–R13, 2026-10-09

- Commit code : `6028527dda8b37d5e5c705aac5a616c8943bcd29`, branche R3, PR #292 draft.
- Troisième lot : **80 déclarations CSS remplacées** retirées de quatre feuilles `premium-reconciliation-r8.css`, `r11.css`, `r12.css`, `r13.css`; **1 675 caractères source** environ retirés dans ces quatre fichiers. Suppression limitée aux propriétés primitives avec gagnant ultérieur `!important`, contexte média/selector strictement identique ; revue esthétique propriétaire toujours **PREUVE MANQUANTE**.
- Cumul trois lots : **401 déclarations consolidées** (89 + 232 + 80).
- GitHub Performance Candidate Proof run **37928656012** : build et scénarios de laboratoire réalisés, **BLOQUÉ** par `CSS gzip 46211 > 22000`.
- Bundle CSS level-9 gzip : **46 211 octets** (contre 47 511 initiaux), amélioration mesurée **1 300 octets**, dépassement restant **24 211 octets**. Budget inchangé.
- JS gzip **104 925 octets** / plafond 105 000 (75 octets de marge).
- Desktop lab LCP **512 ms**, CLS **0.008421**, réponse navigation **37.1 ms**.
- Mobile lab LCP **1 460 ms**, CLS **0**, réponse navigation **41.7 ms**.
- Preview Root Proof run **37928656101** : **TERMINÉ — PASS ciblé**.
- Production Candidate Root Proof run **37928656041** : **TERMINÉ — PASS ciblé**.
- Production Rehearsal run **37928656111** : **BLOQUÉ** par le même plafond CSS, pas une preuve de mise en production.
- Résultat CI du commit code : **37 success / 2 failure**, performances et répétition de la gate en échec sur même budget.
- Prochaine tâche : restructuration réelle du CSS selon les usages et routes avec **mesure totale des feuilles nécessaires au premier rendu**, maintien de toutes les capacités, aucune dissimulation de coût via chargement différé, absence de FOUC, captures avant/après, clavier et reduced motion. Ne pas tenter de supprimer massivement les règles sur simple recherche textuelle.
- Les gates **VF TECHNIQUE EN COURS**, **LAUNCH-READINESS COMMERCIALE EN COURS** et **LEGAL / COMPLIANCE BLOQUÉE / PREUVE MANQUANTE** restent indépendantes ; ne pas prétendre à la production.

## Extension R3 — inventaire CSS réellement utilisé et anti-contournement, 2026-10-09

- **SHA de code validé dans ce lot :** `4705fb036b8b0ab2b90f8b175d821a6ae7bf5fdf`. Trois modifications ciblées :
  - `83b5d94dcb50f474db81e29c517c3205496edcef` : outil CDP Chrome de couverture des règles CSS sur **9 routes × 2 formats (18 configurations)** ;
  - `0e0f763d77ad3977963c2a454af977575cbf70eb` : correction ciblée de la course au nettoyage du profil Chrome (`ENOTEMPTY` après collecte réussie) ;
  - `4705fb036b8b0ab2b90f8b175d821a6ae7bf5fdf` : renforcement du contrôle de performance pour mesurer les **fichiers CSS réellement chargés** par les scénarios de laboratoire desktop/mobile, y compris d'éventuels fichiers CSS additionnels après navigation. **Budget de 22 000 octets inchangé**.
- **Preuve d'exécution de la couverture :** run `37930359260` → `CSS_ROUTE_USAGE_SUMMARY` pour 9 routes et 18 configurations, étape diagnostic réussie. Page initiale `/`, découvrir, jeux, mods, collections, créateurs, communauté, compte, contenu détaillé. Ce n'est **pas** un audit de toutes les interactions, pseudo-états, lecteurs d'écran ni variantes utilisateurs.
- CSS Vite minifié chargé par l'échantillon : **284 682 caractères** de feuille externe ; plage des règles signalées utilisées par échantillon **24 390 à 63 221 caractères** suivant page et format. Ce sont des observations de règles appliquées, **pas** des octets supprimables, ni un résultat de compression par route. Aucune purge automatique autorisée sur cette base.
- **Contrôle réel des chargements CSS :** run `37930359260` → `PERF_ROUTE_CSS_GZIP desktop 46211` et `mobile 46211` (une feuille d'entrée observée), ainsi que `PERF_BUNDLE_CSS_GZIP 46211`. Le contrat rejette toute mesure supérieure à **22 000 octets** et ne compte pas uniquement la première feuille HTML si des feuilles additionnelles sont réellement chargées. État : **BLOQUÉ**, dépassement **24 211 octets gzip**.
- Mesures LAB sur le SHA : desktop LCP **808 ms**, CLS **0.008421**, navigation **52.1 ms** ; mobile LCP **1 552 ms**, CLS **0**, navigation **54.5 ms**. Ces mesures ne sont pas des CWV de terrain ni preuve de production.
- CI `4705fb036b8b0ab2b90f8b175d821a6ae7bf5fdf` : **37 success / 2 failure**, les deux échecs étant `Performance Candidate Proof` (run `37930359260`) et `Production Rehearsal` (run `37930359201`), liés au budget CSS. `Preview Root Proof` (run `37930358906`) **TERMINÉ — PASS ciblé** ; `Production Candidate Root Proof` (run `37930359099`) **TERMINÉ — PASS ciblé**.
- **Décision technique non finale :** la modularisation par route est une piste examinable, **pas** une solution validée. Elle doit conserver l'ordre de cascade, les styles de chaque état (focus, interaction, écran vide, erreur, chargement, reduced motion, clavier), empêcher FOUC, préserver les assets approuvés, et mesurer **tous** les CSS effectivement téléchargés pour le parcours visité. Ne pas déplacer du CSS uniquement pour contourner la gate.
- **Gates inchangées :** VF TECHNIQUE **EN COURS** / performance **BLOQUÉE** / revue propriétaire **PREUVE MANQUANTE** ; LAUNCH-READINESS COMMERCIALE **EN COURS** ; LEGAL/COMPLIANCE FR-UE **BLOQUÉ / PREUVE MANQUANTE** selon checkpoint droits/privacy du 7 octobre. Aucun merge, DNS, provider, paiement, production ou cutover.

## Extension R3 — compiled CSS & coverage réelle des 143 captures, 2026-10-09

- **Branche de code / SHA vérifié :** `92ecc208ba5351c56727474480df939f0eaa5da1`, PR #292 draft, MODARYX Web V2 uniquement.
- **Coverage Chrome sur 143 captures : TERMINÉ (preuve ciblée)** : run Production Candidate Root Proof `37932423203`, `CSS_143_STATE_USAGE_SUMMARY` : 143 captures, **181 208 caractères de règles CSS observées utilisées** dans le bundle minifié d'environ **284 682 caractères** avant cette dernière optimisation, 1 917 observations de plages. Cet inventaire ne couvre pas toutes les situations personnalisées, pseudostates et variantes d'accessibilité ; **ce n'est pas une autorisation de purge**.
- **Diagnostic du CSS compilé : TERMINÉ** : `qa/experiment-v2-compiled-css-cascade.mjs` a identifié **493 déclarations conservativement supplantées**, dont 83 valeurs identiques et 410 remplacements. Estimation initiale de gain : **1 439 octets gzip** sans preuve visuelle sur le premier prototype d'essai.
- **Découpage CSS par route examiné puis NON RETENU à ce stade** : l'estimation naïve donne encore **33 446 octets gzip de CSS commun** avant optimisation (environ **32 561 octets** après optimisation), au-delà du plafond de **22 000 octets** avant ajout des chunks de route. Ne pas adopter ce découpage artificiel en le présentant comme une solution au budget.
- **Code candidat construit et testé : TERMINÉ (preuves ciblées)** : `v2/css-cascade-prune.mjs` fournit l'optimisation AST conservatrice ; `qa/apply-v2-compiled-css-cascade.mjs` la lance **après minification Vite, avant distribution multi-sites** et renomme le CSS selon une empreinte du contenu, avec garde bloquant les références générées obsolètes. Vite.config ne modifie pas à chaud des assets avec un hash ancien. Le processus produit une sortie compilée optimisée, pas une transformation du CSS source.
- **CSS réel de la build du SHA `92ecc208ba5351c56727474480df939f0eaa5da1`** : **44 772 octets gzip** contre **46 211** avant ce lot et **47 511** au début du chantier : **1 439 octets gagnés dans ce lot, 2 739 octets cumulés**. CSS final V2 : `index-d5a266f1c3b2.css`. Le contrat reste **BLOQUÉ** : 44 772 > 22 000 ; dépassement **22 772 octets**.
- **JS gzip** : 104 925 / 105 000 octets, marge **75 octets**, sous plafond de laboratoire.
- **Scénarios lab SHA final** : desktop LCP **716 ms**, CLS **0.008421**, navigation **44.1 ms** ; mobile LCP **1 536 ms**, CLS **0**, navigation **49.6 ms**. Ne pas les qualifier de CWV terrain.
- **Contrôles GitHub sur SHA `92ecc208ba5351c56727474480df939f0eaa5da1`** : 39 workflows terminés, **37 success / 2 failure**. `MODARYX V2 Preview Root Proof` (run `37933246976`) **TERMINÉ — PASS ciblé**. `Production Candidate Root Proof` (run `37933247306`) **TERMINÉ — PASS ciblé**, captures et interactions couvertes. `Performance Candidate Proof` (run `37933247337`) **BLOQUÉ budget CSS**. `Production Rehearsal` (run `37933247310`) **BLOQUÉ budget CSS**, non équivalent à une production.
- **État visuel** : le design Premium V2 bleu nuit/cyan/violet est la seule référence ; toutes les captures automatisées sont positives dans leurs scénarios, mais **comparaison pixel-à-pixel avec référence propriétaire + acceptation esthétique : PREUVE MANQUANTE**. Aucune direction artistique modifiée intentionnellement, aucune image/asset remplacé.
- **Prochain gros lot** : audit structurant de `styles.css` (héritage et doublons), de la vraie couche commune, et conception d'un système CSS plus compact sans perte de fonctionnalité. Le découpage par route seul ne ferme pas le budget ; ne pas augmenter 22 000, dégrader gratuit/Premium, différer artificiellement les octets, ni déclarer PASS sans preuve.
- **Gates séparées inchangées** : VF TECHNIQUE **EN COURS / performance BLOQUÉE** ; LAUNCH-READINESS COMMERCIALE **EN COURS** ; LEGAL/COMPLIANCE France/UE **BLOQUÉ / PREUVE MANQUANTE** (voir registre droits/privacy du 7 octobre). Production et ressources sensibles intactes.

## Extension R3 — preuve de parité CSS original / optimisé, 2026-10-09

- **SHA de code prouvé :** `d765fc41ebf352ec737d676740596610ba7a108f` sur `design/modaryx-v2-vf-architecture-r3-20261008`, PR #292 draft. Le précédent checkpoint du 9 octobre et le checkpoint P0 droits/privacy du 7 octobre restent sources complémentaires, aucun effacement de preuves.
- **Nouveau contrôle GitHub :** `qa/check-v2-css-parity-browser.mjs` compare **18 états navigateur (9 routes × 2 viewports)** avec le CSS minifié avant optimisation et le CSS optimisé **sur le même DOM**, après remplacement contrôlé via Chrome DevTools. Il compare **41 propriétés visuelles calculées** ainsi que 6 caractéristiques des pseudo-éléments `::before` / `::after` pour chaque élément DOM. Mode `prefers-reduced-motion: reduce` pour les relevés. Aucun remplacement d'asset produit.
- **Données temporaires / sécurité du pipeline :** `qa/apply-v2-compiled-css-cascade.mjs` écrit la CSS d'origine uniquement sous `/tmp/` lorsque `MODARYX_CSS_PARITY_BASELINE` est fourni en CI ; ce baseline **n'est pas livré dans les sites**. Le contrôle de parité est exécuté avant les budgets de performance et **bloque si des propriétés diffèrent**.
- **Preuve ciblée : TERMINÉ — PASS**, `Performance Candidate Proof`, run **37934546510**, `PASS_V2_CSS_COMPUTED_PARITY_18_ROUTE_VIEWPORTS`. **18 relevés, 0 différence détectée** dans les propriétés comparées ; ne pas transformer ce résultat en acceptation de design propriétaire, en équivalence exhaustive de toutes les interactions, ni en Core Web Vitals de terrain.
- **Poids CSS actuel inchangé :** **44 772 octets gzip** après optimisation, contre **46 211** avant le pruner et **47 511** au point de départ R3. Plafond inchangé : **22 000** ; déficit **22 772 octets**. **BLOQUÉ**. JS gzip **104 925 / 105 000**, marge très faible.
- **CI du SHA `d765fc41ebf352ec737d676740596610ba7a108f` :** 39 workflows terminés, **37 succès / 2 échecs**. `Preview Root Proof` run **37934546526** : **TERMINÉ — PASS ciblé** ; `Production Candidate Root Proof` run **37934546517** : **TERMINÉ — PASS ciblé** ; `Performance Candidate Proof` run **37934546510** et `Production Rehearsal` run **37934546631** : **BLOQUÉ** par le même budget CSS. Ni fusion ni déploiement.
- **Examen de `styles.css` : EN COURS**. Inventaire statique de 326 noms de classes identifiés dans la feuille ; certains noms absents des fichiers JSX parcourus pourraient être générés dynamiquement ou représenter des couches artistiques à préserver (dont loup/dragon). **Aucune suppression automatique** de telles classes sans preuves d'absence en runtime et sans validation de la référence esthétique V2.
- **Suite réalisable :** reconstruction mesurée de la CSS commune selon composants réellement utilisés, maîtrise des héritages/règles globales et tests de non-régression sur desktop/mobile/états interactifs. Une séparation par routes naïve reste insuffisante (environ 32,6 Ko gzip communs après pruner contre 22 Ko de plafond). Conserver l'anti-oubli, les assets approuvés, toutes les voies d'accessibilité et le gratuit non dégradé.
- **Gates indépendantes non fermées :** VF TECHNIQUE **EN COURS / CSS BLOQUÉ** ; LAUNCH-READINESS COMMERCIALE **EN COURS** ; LEGAL/COMPLIANCE France/UE **BLOQUÉ / PREUVE MANQUANTE** (droits assets, privacy et obligations territoriales). Pas de PASS final.

## Extension R3 — réduction des règles vides et tests de cascade, 2026-10-09

- **Code prouvé :** `3c29ddd2979cc6ca168739437e48d31a24535383`, branche `design/modaryx-v2-vf-architecture-r3-20261008`, PR #292 **draft ouverte**. Branche produit V2 et `main` non fusionnées ; production, DNS, Cloudflare critique, paiements et assets artistiques approuvés intacts.
- **Lot CSS livré au candidat :** `v2/css-cascade-prune.mjs` reconnaît les listes de sélecteurs simples équivalentes indépendamment de leur ordre et retire les blocs CSS devenus vides après consolidation. Les sélecteurs complexes (fonctions, attributs, chaînes) restent exclus de cette normalisation. Les garde-fous de cascade antérieurs restent actifs, de même que le contrôle du renommage par empreinte de contenu.
- **Unit tests de non-régression : TERMINÉ — 7/7 PASS.** `v2/tests/css-cascade-prune.test.mjs` couvre sélecteurs équivalents, règles vides, contextes média distincts, variables/fallbacks CSS, `@supports`, keyframes, priorité `!important` et idempotence. Ces tests s'exécutent désormais **avant le build** dans le workflow Performance Candidate.
- **Parité navigateur : TERMINÉ — 18/18 PASS ciblés**. L'étape `PASS_V2_CSS_COMPUTED_PARITY_18_ROUTE_VIEWPORTS` confirme zéro différence des propriétés calculées observées entre le CSS original et optimisé dans 9 routes × 2 tailles d'écran ; acceptation esthétique propriétaire et couverture de toutes les interactions **PREUVE MANQUANTE**.
- **Build CI mesuré :** 512 déclarations supplantées retirées au total par le pruner compilé. Fichier CSS `index-bfbe1515fa3c.css` : **44 467 octets gzip** contre **44 772** avant ce lot. Gain nouveau **305 octets gzip**, gain cumulatif **3 044 octets gzip** depuis la baseline **47 511**. **Budget 22 000** inchangé ; dépassement **22 467 octets — BLOQUÉ**. JS gzip **104 925 octets** sous plafond de 105 000 avec marge très faible (75 octets).
- **Lab au SHA `3c29ddd2979cc6ca168739437e48d31a24535383` :** desktop LCP **588 ms**, CLS **0.008421**, route **35.3 ms** ; mobile LCP **1 476 ms**, CLS **0**, route **48.3 ms**. Résultats lab uniquement, pas mesures terrain ni production.
- **Workflow GitHub sur SHA `3c29ddd2979cc6ca168739437e48d31a24535383` :** **39 terminés : 37 success / 2 failure**. `Production Candidate Root Proof` run **37935663162** : **TERMINÉ — PASS ciblé**, `Preview Root Proof` run **37935663346** : **TERMINÉ — PASS ciblé**. `Performance Candidate Proof` run **37935663184** et `Production Rehearsal` run **37935663309** : **BLOQUÉ** exactement sur `CSS gzip 44467 > 22000` ; ne pas présenter leur échec comme un PASS final.
- **Décision de conservation** : ne pas supprimer automatiquement les classes de `styles.css` sans présence statique dans le JSX. Elles peuvent provenir de variantes dynamiques, de futures fonctionnalités retenues ou de couches artistiques (dragon/loup) et l'anti-oubli prévaut. Pour une réduction structurelle future, établir propriété/usage de chaque composant et tester les états invisibles, accessibilité, navigation, CSS chargé cumulativement et rendu propriétaire.
- **Gates inchangées** : VF TECHNIQUE **EN COURS / performance CSS BLOQUÉE** ; LAUNCH-READINESS COMMERCIALE **EN COURS** ; LEGAL / COMPLIANCE France–UE **BLOQUÉ / PREUVE MANQUANTE** selon checkpoint P0 du 2026-10-07 (provenance/droits assets, privacy, obligations FR/UE). Aucun PASS final.
