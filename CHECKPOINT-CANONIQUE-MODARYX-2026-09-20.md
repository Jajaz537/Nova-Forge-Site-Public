# CHECKPOINT CANONIQUE — MODARYX — 20 septembre 2026

Ce document devient la source de vérité opérationnelle la plus récente pour MODARYX. Il remplace le checkpoint daté du 19 septembre pour l'état courant. Il ne constitue ni une fusion vers `main`, ni une promotion production, ni une déclaration de VF.

## Séparation officielle

- **Nova Forge = logiciel / OS**
  - Nova Forge OS Public
  - Nova Forge OS Fondateur
- **MODARYX / MODARYX MODS = plateforme web**
- `getnovaforge.com` / « getnova » = ancien projet web abandonné ; références historiques seulement pour compatibilité, provenance ou protection technique.
- Aucune migration MODARYX → Nova Forge.

## Git — état frais avant ce checkpoint

- Dépôt : `Jajaz537/Nova-Forge-Site-Public`.
- PR #12 : ouverte, brouillon.
- Branche Work active : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work observé avant création de ce checkpoint : `beb4074c6ac8eff27c6ca01f4359228f1e6ae93d`.
- `main` n'a pas été modifiée par le lot d'activation.
- DNS, DNSSEC, nameservers, IONOS et configuration Cloudflare critique : inchangés.

## TERMINÉ — bundle de croissance visuelle séparé

Le bundle compagnon est complet et déjà intégré sur la branche Work :

- environnement : **TERMINÉ** ;
- loup : **5/5 TERMINÉ** ;
- dragon : **5/5 TERMINÉ** ;
- couches compagnon : **10/10 TERMINÉES sur les assets séparés prouvés**.

La validation artistique humaine du rendu **intégré** reste distincte et n'est pas déduite de la seule validité technique des assets.

## TERMINÉ — activation réelle de la croissance visuelle, PR #57

PR #57 `chatgpt/modaryx-visual-growth-activation-20260920` : **fusionnée** dans la branche Work.

- candidat final : `8f0d61c03137cf9a4e262e1e8da8a47c1f83e813` ;
- commit de fusion : `beb4074c6ac8eff27c6ca01f4359228f1e6ae93d` ;
- base vérifiée avant fusion : `23d3005517d6fbe72ba89dff0bd551186b0fd441`.

Activation :

- `data/living-world.json` : `visualGrowth.status = "ready"` ;
- environnement : `./assets/living-world/environment-premium.jpg` ;
- 10 références de stades loup/dragon activées, toutes distinctes ;
- modèle : `layered-stage-assets-v1` ;
- activation : couche courante seulement, chargement à la demande ;
- fallback composite conservé si un asset échoue ;
- reduced-motion conservé ;
- la couche compagnon reçoit les mêmes filtres saison / météo / heure locale que l'environnement quand la synchronisation réelle est active.

## Erreurs ciblées et corrections — sans full replay

### 1. Contrat de croissance visuelle obsolète

Erreur exacte :

- `Error: current status must await assets`.

Cause :

- le test `qa/check-layered-growth-contract.mjs` exigeait encore l'ancien état `awaiting-assets` alors que le bundle complet devait désormais être `ready`.

Correction ciblée :

- le contrat réel courant valide `ready` ;
- un scénario synthétique `awaiting-assets` conserve la preuve de fallback ;
- micro-proof du contrat : **success**.

### 2. Performance initiale

Premier symptôme :

- `timeout Page.loadEventFired`.

Après un premier déplacement hors chemin critique, la page d'accueil est redevenue dans le budget mais `catalog.html`, mesuré juste après l'accueil, restait systématiquement très lent.

Isolation :

- le harnais attend **1800 ms** après `Page.loadEventFired` avant de naviguer vers la page suivante ;
- l'activation visuelle utilisait `requestIdleCallback(..., {timeout: 1500})` juste après le load ;
- environnement + loup courant + dragon courant pouvaient donc commencer à charger pendant cette fenêtre et concurrencer la navigation suivante sous réseau bridé.

Correction ciblée :

- constante `VISUAL_GROWTH_DELAY_MS = 2200` ;
- activation après `window.load`, puis délai 2200 ms, puis idle callback ;
- budgets inchangés.

Micro-proof final performance sur le candidat `8f0d61c` :

- marker : `PASS_TARGETED_LAB_PERFORMANCE_PROOF` ;
- mobile index : LCP **2152 ms**, load **2111 ms**, longTasks **0** ;
- mobile catalogue : LCP **1816 ms**, load **1778.5 ms**, longTasks **1** ;
- desktop index : LCP **2028 ms**, load **1968.4 ms**, longTasks **0** ;
- desktop catalogue : LCP **1832 ms**, load **1776.7 ms**, longTasks **0**.

### 3. Harnais offline après le nouveau scheduling

Erreur exacte :

- `Error: fresh source state`.

Isolation :

- production utilise normalement `window.addEventListener` ;
- le mock Node du test offline ne simulait pas encore `window.addEventListener`, `window.setTimeout` ni `document.readyState` ;
- le scheduling différé levait donc une exception dans le harnais et faisait basculer le scénario dans l'état `unavailable`.

Correction ciblée :

- mock aligné sur le contrat navigateur minimal du nouveau scheduling ;
- assertions ajoutées pour vérifier que fresh et offline-stale enregistrent bien un listener `load`.

Micro-proof final :

- `PASS_TARGETED_LIVING_WORLD_OFFLINE_STATE` ;
- `fresh` → source `fresh` ;
- `stale` → source `offline-stale` ;
- `unavailable` → source `unavailable`.

## Preuves finales du candidat PR #57

Sur le candidat final `8f0d61c03137cf9a4e262e1e8da8a47c1f83e813`, les 11 workflows ciblés suivants sont **success** :

- MODARYX Site First Targeted Source Proof — run `35481405323` ;
- MODARYX Layered Growth Contract Proof — run `35481405360` ;
- MODARYX Layered Growth Asset Gate — run `35481405376` ;
- MODARYX Living Chronicle Proof — run `35481405345` ;
- MODARYX Living World Offline State Proof — run `35481405357` ;
- MODARYX PWA Offline Browser Proof — run `35481405352` ;
- MODARYX Local Functional Browser Proof — run `35481405330` ;
- MODARYX Real File Browser Proof — run `35481405418` ;
- MODARYX Browser Accessibility Micro-Proof — run `35481405391` ;
- MODARYX Browser Reflow Micro-Proof — run `35481405427` ;
- MODARYX Lab Performance Micro-Proof — run `35481405372`.

Aucun full replay n'a été exécuté pour fermer ces erreurs.

## État courant

- **TERMINÉ** — 10/10 assets compagnon séparés et prouvés.
- **TERMINÉ sur le périmètre source / navigateur ciblé** — activation `ready` et chargement visuel différé intégrés dans Work.
- **PREUVE MANQUANTE** — validation artistique humaine du rendu intégré environnement + loup + dragon dans la composition réelle.
- **EN COURS** — finition Premium HD MODARYX.
- **PREUVE MANQUANTE** — preuves externes déjà connues : lecteur d'écran natif, appareils physiques, PWA HTTPS offline/update réel, CWV représentatifs, validation juridique complète et autres éléments explicitement tracés.
- Aucune VF ni PASS final déclaré.

## Prochain point logique

1. Vérifier Git frais avant toute nouvelle écriture.
2. Obtenir une preview réelle du HEAD Work contenant l'activation.
3. Inspecter visuellement le rendu intégré sur desktop et mobile, y compris cohérence environnement/loup/dragon, cadrage, superpositions et lisibilité.
4. Vérifier l'effet reduced-motion et l'interaction avec saison + météo réelle + heure locale sans casser la chronologie partagée.
5. Si une anomalie est trouvée : erreur exacte → isolation → correction ciblée → micro-proof.
6. Seulement après validation artistique intégrée, fermer cette PREUVE MANQUANTE.
7. Continuer ensuite la finition Premium HD et les preuves externes restantes, sans full replay prématuré.

---

## Mise à jour canonique — sécurité QA + preuve visuelle déployée — 20 septembre 2026

Cette section est plus récente que les sections précédentes du présent fichier et les complète sans effacer leur historique.

### Git / intégrations récentes

- PR #58 — **TERMINÉE / fusionnée** : durcissement des chemins temporaires des preuves navigateur QA ; merge `6b5e6c5339427138805269239676897834a8bfe0`.
- PR #59 — **TERMINÉE / fusionnée** : capture visuelle ciblée de la preview Cloudflare déployée ; merge `0c774005f895961921e8072f2230aff6b5c7bf00`.
- PR #60 — **TERMINÉE / fusionnée** : durcissement de l'artefact d'échec de capture visuelle ; merge `bb31db3015a659074c4d8a38f62544d39bf98793`.
- PR #61 — **TERMINÉE / fusionnée** : fermeture ciblée des cinq derniers constats CodeQL HTML/QA ; merge `7ed6e6a9c21d9235b9f35819cb7063221201fa04`.
- `main` n'a pas été modifiée par ces lots.
- Aucun full replay n'a été exécuté.

### Preuve déployée du monde vivant

Workflow `MODARYX Preview Visual Capture` :

- run `35483330153` — **success** ;
- marker : `PASS_TARGETED_PREVIEW_VISUAL_CAPTURE` ;
- artefact : `modaryx-preview-visual-98aa651608af1e6f5033183b23f7a37c5a613c07`, ID `10596672085` ;
- preview immuable inspectée : `https://9360feb3.nova-forge-site-public.pages.dev`.

Les trois cas capturés sont **desktop 1440×1000**, **mobile 390×844** et **prefers-reduced-motion**.

Observations prouvées dans le navigateur déployé :

- `data-world-visual-growth=active` ;
- environnement séparé chargé en **1600×900** ;
- loup courant `baby` chargé en **1600×900** ;
- dragon courant `baby` chargé en **1600×900** ;
- reality sync : `active` ;
- source de contexte : `cloudflare-coarse` ;
- climat observé : `north-temperate` ;
- saison observée : `autumn` ;
- moment local observé : `dusk` ;
- météo : `unavailable`, conformément au fait qu'aucun fournisseur météo production n'est encore activé ;
- en reduced-motion : animation des couches = `none`, transition des couches = `0s`, transition météo = `0s`.

Inspection assistée des captures : aucune coupure bloquante du héros, du loup ou du dragon n'a été observée sur les captures desktop/mobile ; la lisibilité du contenu principal reste exploitable. Cette inspection assistée **ne remplace pas** une validation artistique humaine finale.

Statuts mis à jour :

- **TERMINÉ** — preuve de rendu intégré sur preview HTTPS réelle, desktop + mobile.
- **TERMINÉ** — preuve déployée reduced-motion pour les couches du monde vivant.
- **TERMINÉ sur le contexte grossier** — preuve que la preview reçoit et applique le contexte `cloudflare-coarse`.
- **BLOQUÉ / décision externe** — météo réelle tant que fournisseur, licence, attribution et confidentialité ne sont pas validés.
- **PREUVE MANQUANTE** — validation artistique humaine finale du rendu intégré.

### Sécurité / CodeQL

Après les PR #58, #60 et #61 :

- CodeQL sur le HEAD Work `bb31db3015a659074c4d8a38f62544d39bf98793` : run `35484590405` — **success** ;
- micro-proof Site First de PR #61 : run `35484927948` — **success** ;
- CodeQL sur le HEAD Work `7ed6e6a9c21d9235b9f35819cb7063221201fa04` : run `35484967852` — **success** ;
- les **11/11 threads CodeQL** ouverts historiquement sur PR #12 sont désormais résolus ;
- aucune baisse de seuil, aucun contournement de scan et aucune modification runtime de production n'ont été utilisés pour les fermer.

### État opérationnel après cette mise à jour

- **TERMINÉ** — 10/10 assets compagnons séparés.
- **TERMINÉ** — activation technique ciblée de la croissance visuelle.
- **TERMINÉ** — preuve de preview déployée environnement + loup + dragon, desktop/mobile/reduced-motion.
- **TERMINÉ** — dette CodeQL actuellement visible sur PR #12 : 11/11 threads résolus.
- **EN COURS** — finition Premium HD page par page et fermeture de l'anti-oubli.
- **PREUVE MANQUANTE** — validation artistique humaine finale.
- **PREUVE MANQUANTE** — lecteur d'écran natif, appareils physiques, PWA HTTPS offline/update réelle, CWV représentatifs, validation juridique complète et autres preuves externes explicitement tracées.
- Aucune VF / aucun 100 % n'est déclaré.

## Prochain point logique actualisé

1. Conserver l'anti-oubli comme registre exhaustif : aucune idée retenue ne disparaît.
2. Continuer la finition Premium HD **page par page** sur les 17 pages actuelles, en micro-lots isolés.
3. Fermer en parallèle les fonctions locales réellement disponibles et leurs états empty/error/unavailable.
4. Fermer les preuves externes quand un environnement réel approprié est disponible.
5. Ne pas simuler les capacités dépendant d'un backend, de droits, d'artefacts, d'un protocole ou de Nova Forge OS.
6. Full replay uniquement à la toute fin, après fermeture des bloqueurs ciblés.



## Mise à jour canonique — états de pages + PWA HTTPS déployée — 20 septembre 2026

Cette section est plus récente que les sections précédentes et complète l'état opérationnel courant.

### PR #64 — états locaux Recherche / Téléchargements

- **TERMINÉE / fusionnée** dans Work au merge `9cd07604daff663d02f8026b4f44635edcf85726`.
- Candidat final : `4aa4450dcff748c811b3a34b6ecbe32760cc912b`.
- Workflow ciblé : `MODARYX Page States Browser Proof` run `35487557212` — **success**.
- Marker : `PASS_TARGETED_PAGE_STATES_BROWSER_PROOF`.
- Recherche : état vide observé avec `0 résultats` ; état panne observé avec répertoire statique conservé ; retry observé avec retour du focus sur `#site-search`.
- Téléchargements : panne réseau observée en **fail-closed**, 0 artefact exposé ; retry observé vers l'état volontairement verrouillé, 0 artefact exposé et focus restauré sur le statut.
- Artefact de captures : ID `10597941478`.
- Aucun comportement runtime de production n'a été modifié par ce lot.

### PR #63 — cycle PWA sur preview HTTPS réelle

- **TERMINÉE / fusionnée** dans Work au merge `be2f218d200805937279cb9b81802eee440b9a29`.
- Candidat final réconcilié avec Work : `0bd6534bd2464f2b7ea2f242cb6e00cf2e3b201f`.
- Première tentative `35485418540` : **failure ciblée** — la page était mise hors ligne mais le service worker conservait un accès réseau CDP ; le header `offline-stale` manquait alors que les pages restaient servies.
- Correction ciblée du harnais : attacher la session CDP du service worker et appliquer l'émulation offline au contexte page **et** au service worker ; aucun changement produit.
- Micro-proof final : run `35487895759` — **success**, marker `PASS_TARGETED_PREVIEW_PWA_CYCLE`.
- Preview HTTPS immuable : `https://98f242f7.nova-forge-site-public.pages.dev`.
- Service worker : `activated`, contrôleur présent, session réseau SW attachée.
- Cache observé : `modaryx-site-v120-scalable`, 27 entrées après warmup.
- Offline réel : Catalogue et Accueil servis sans erreur de navigation ; `data/catalog.json` retourne HTTP 200 avec `X-Modaryx-Cache: offline-stale` et `schemaVersion=1`.
- Reconnexion : donnée fraîche HTTP 200 sans marqueur stale ; `registration.update()` laisse le worker actif et contrôlant.
- Cette preuve ferme le **cycle automatisé HTTPS offline → online + health-check update** sur preview réelle. Elle ne remplace pas l'installation manuelle PWA sur appareil physique ni les preuves iOS/Android.

### État courant actualisé

- **TERMINÉ** — 10/10 assets compagnon et activation visuelle ciblée.
- **TERMINÉ** — preview monde vivant desktop/mobile/reduced-motion.
- **TERMINÉ** — états navigateur ciblés Recherche vide/panne/retry et Téléchargements panne/retry/verrouillé.
- **TERMINÉ sur preview HTTPS ciblée** — cycle PWA offline/online + récupération + update health-check.
- **TERMINÉ** — CodeQL historique visible fermé sur les lots précédents ; le scan du HEAD Work après fusion PR #63 est à lire séparément avant toute nouvelle conclusion de sécurité.
- **EN COURS** — finition Premium HD page par page et fermeture du registre anti-oubli.
- **PREUVE MANQUANTE** — validation artistique humaine finale.
- **PREUVE MANQUANTE** — lecteur d'écran natif, zoom natif 400 %, appareils physiques/tactile, Safari/Firefox finaux, CWV représentatifs, installation PWA manuelle sur appareil, validation juridique complète.
- **BLOQUÉ / dépendance réelle** — météo de production, téléchargements publics réels, comptes/backend, publication/modération distante, Storage Resolver, Repair Network, OS Bridge et autres capacités dépendantes explicitement tracées.
- Aucun full replay n'a été exécuté. Aucune VF / aucun 100 % déclaré.

## Prochain point logique actualisé

1. Continuer les micro-lots page par page sur les états réellement observables, sans rejouer les preuves déjà fermées.
2. Prioriser ensuite les pages/capacités locales restantes dont les états peuvent être prouvés sans backend fictif.
3. Conserver toutes les dépendances produit dans l'anti-oubli jusqu'à livraison réelle ou blocage explicitement documenté.
4. Full replay uniquement à la toute fin.

## Mise à jour canonique — Profils + états Catalogue/Communauté — 20 septembre 2026

### PR #66 — état local Profils / WebAuthn

- **TERMINÉE / fusionnée** dans Work au merge `49d11667ff4530a7ce1224008abe4b80f59b9147`.
- Candidat : `a9dd92fcf40c6e1f0d9fd800ec6ea16d6f68a52d`.
- Workflow ciblé : `MODARYX Profiles State Browser Proof` run `35488704409` — **success**.
- Marker : `PASS_TARGETED_PROFILES_STATE_BROWSER_PROOF`.
- Desktop + mobile : aucun overflow horizontal dans le périmètre observé.
- WebAuthn réel Chromium : API disponible, authentificateur plateforme non détecté, médiation conditionnelle disponible.
- La copie UI rappelle explicitement que cette détection ne prouve ni compte, ni passkey enregistrée, ni authentification réussie.
- Artefact de captures : ID `10597907697`.
- Aucun backend d'identité n'a été simulé ; comptes/authentification restent **EN COURS — capacité non livrée**.

### PR #67 — états dégradés Catalogue / Communauté

- **TERMINÉE / fusionnée** dans Work au merge `7f512ffd8ecec90e8f8da54c7ccc6fc5525fd418`.
- Premier run `35488709371` : **failure ciblée du harnais** — l'interception réseau de la page ne contournait pas le service worker, donc la panne de `data/catalog.json` n'était pas réellement injectée.
- Correction ciblée QA : `Network.setBypassServiceWorker(true)` uniquement pendant l'injection de panne ; aucun changement runtime produit.
- Micro-proof final : run `35488828426` — **success**, marker `PASS_TARGETED_CATALOG_COMMUNITY_STATES`.
- Catalogue : état zéro résultat + reset/focus prouvés ; panne de chargement garde les 3 cartes statiques, désactive les filtres, conserve les favoris locaux ; récupération réhydrate le catalogue et conserve le favori.
- Communauté : panne catalogue affiche les états d'indisponibilité sans perdre la copie locale ; récupération restaure les 3 choix de collection et 4 options de cible de contribution.
- Aucun backend, aucune publication distante et aucune synchronisation distante n'ont été simulés.

### État courant après PR #66 / #67

- **TERMINÉ** — état local Profils/WebAuthn prouvé sur desktop/mobile Chromium.
- **TERMINÉ** — états Catalogue vide/reset et panne/récupération avec favoris locaux.
- **TERMINÉ** — états Communauté catalogue indisponible/récupéré.
- **EN COURS** — finition Premium HD page par page et fermeture du registre anti-oubli.
- **BLOQUÉ / dépendance réelle** — comptes réels, publication/modération distante et autres services externes déjà tracés.
- **PREUVE MANQUANTE** — validation artistique humaine finale, lecteur d'écran natif, zoom natif 400 %, appareils physiques/tactile, Safari/Firefox finaux, CWV représentatifs, installation PWA manuelle et validation juridique complète.
- Aucun full replay exécuté.

## Prochain point logique actualisé

1. Continuer uniquement sur les états locaux encore réellement observables et non déjà prouvés.
2. Prioriser Creator Studio / états de schéma indisponible-récupéré ou autre surface locale non couverte, sans rejouer les preuves déjà vertes.
3. Conserver toutes les capacités distantes dans l'anti-oubli jusqu'à livraison réelle ou blocage documenté.
4. Ne lancer le full replay qu'à la toute fin.

## Mise à jour canonique — Creator Studio schéma fail-closed / récupération — 20 septembre 2026

### PR #69 — état schéma Creator Studio

- **TERMINÉE / fusionnée** dans Work au merge `498afa45ee95f42c91262a93315b88963a877166`.
- Candidat final : `066e0a98703fe64109970047a22c1aaa0f39255c`.
- Premier run `35489112739` : **failure ciblée du harnais**, détail `schema-unavailable-fail-closed: Uncaught`.
- Isolation : le harnais tentait d'effacer `localStorage` depuis `about:blank`, origine où cette opération n'est pas disponible ; le scénario de récupération était déjà vert.
- Correction ciblée QA : établir d'abord l'origine locale via `index.html`, puis nettoyer le brouillon ; aucun fichier runtime produit modifié.
- Micro-proof final : run `35489189427` — **success**, marker `PASS_TARGETED_STUDIO_SCHEMA_STATE`.
- Schéma indisponible : état explicite, sauvegarde/export bloqués en fail-closed, aucun brouillon persisté.
- Après récupération : brouillon valide sauvegardé localement ; `distribution.state=locked`, `downloadable=false`, `releaseReceipt=null` conservés.
- Aucun backend, aucune publication distante et aucune attestation de provenance n'ont été simulés.
- Aucun full replay exécuté.

### État courant après PR #69

- **TERMINÉ** — état Creator Studio schéma indisponible / fail-closed / récupération.
- **EN COURS** — finition Premium HD page par page et fermeture du registre anti-oubli.
- **BLOQUÉ / dépendance réelle** — publication réelle, signature distante, identité, distribution et autres services déjà tracés.
- **PREUVE MANQUANTE** — validation artistique humaine finale, lecteur d'écran natif, zoom natif 400 %, appareils physiques/tactile, Safari/Firefox finaux, CWV représentatifs, installation PWA manuelle et validation juridique complète.

## Prochain point logique actualisé

1. Continuer les états locaux encore non couverts sans répéter Recherche, Téléchargements, Profils, Catalogue, Communauté ou Creator Studio déjà fermés sur leurs scénarios ciblés.
2. Prioriser les autres pages à états réellement observables, puis la finition visuelle page par page.
3. Garder toutes les capacités dépendantes dans l'anti-oubli avec leur statut réel.
4. Full replay uniquement à la toute fin.
## Mise à jour canonique — Project Hub + Accueil états locaux — 20 septembre 2026

### PR #71 — Project Hub fallback / récupération

- **TERMINÉE / fusionnée** dans Work au merge `59a570bd25fd3fc4e2885725abb005bc1880a7c2`.
- Candidat : `c99afde064393385b51f2f861a8ca5fa180b2db1`.
- Micro-proof : run `35489515272` — **success**, marker `PASS_TARGETED_PROJECT_HUB_STATES`.
- État dégradé réellement observé : données enrichies indisponibles, fallback statique conservé.
- Récupération ciblée : retour des données sans perdre l’état local du favori.
- Aucun service distant, artefact ou compatibilité réelle n’a été simulé.

### PR #72 — Accueil données publiques fail-closed / récupération

- **TERMINÉE / fusionnée** dans Work au merge `2758d5400b9f8a3265f719a4d7c82b41bf7853fc`.
- Candidat final : `224a9ff0689c0acac514852dc15298463494a778`.
- Premier run `35489521919` : **failure ciblée du harnais**, détail `home-public-data-failure-recovery: timeout: home public-data recovery; last=null`.
- Isolation : `public-build.json` conserve volontairement `surface_digest_sha256: null`; le harnais attendait à tort un digest déclaré après récupération.
- Correction ciblée QA : le scénario exige désormais le statut public frais + catalogue récupéré, tout en conservant l’empreinte de build **indisponible** tant que le digest public reste intentionnellement absent.
- Micro-proof final : run `35489918720` — **success**, marker `PASS_TARGETED_HOME_PUBLIC_STATES`.
- En panne : catalogue fail-closed, recherche désactivée, statut public indisponible, empreinte de build indisponible.
- Après récupération : catalogue 3 cartes + recherche réactivée + statut public `network`; build toujours `unavailable` et `reported=null`, conformément au contrat réel.
- Pont Nova Forge OS : état inactif explicite, aucun protocole/exécutable/service lancé.
- Aucun full replay exécuté.

### État courant après PR #71 / #72

- **TERMINÉ** — états locaux ciblés : Recherche, Téléchargements, Profils, Catalogue, Communauté, Creator Studio, Project Hub et Accueil.
- **EN COURS** — finition Premium HD page par page et fermeture du registre anti-oubli.
- **BLOQUÉ / dépendance réelle** — comptes, publication/modération distante, artefacts/signatures, Guide connecté, Storage Resolver, Repair Network, OS Bridge réel, corpus/droits GTA VI/RDR2.
- **PREUVE MANQUANTE** — validation artistique humaine finale, lecteur d’écran natif, zoom natif 400 %, appareils physiques/tactile, Safari final, Firefox final élargi, CWV représentatifs, installation PWA manuelle, validation juridique complète.
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Ne plus rejouer les états locaux ciblés déjà fermés sans modification pertinente.
2. Passer à la finition Premium HD des surfaces statiques restantes et aux contrôles SEO/documentation réellement autonomes.
3. Fermer séparément les preuves externes lorsqu’un environnement approprié existe.
4. Conserver chaque capacité distante dans l’anti-oubli avec son statut réel ; aucune suppression implicite.
5. Full replay uniquement à la toute fin.


## Mise à jour canonique — revue statique Premium HD + anti-oubli courant — 20 septembre 2026

Cette section est plus récente que les sections précédentes et les complète sans effacer leur historique.

### Git frais et PR #74 — surfaces statiques

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après intégration : `29fab6f549c5d9192359c0e8c9cbad2d4edec39a`.
- PR #74 `chatgpt/modaryx-static-premium-review-20260920` : **TERMINÉE / fusionnée dans Work**.
- La PR #74 ne modifie aucun runtime ni aucune page publique : elle ajoute uniquement un harnais QA et son workflow ciblé.
- `main`, DNS, DNSSEC, nameservers, IONOS et configuration Cloudflare critique : inchangés.
- Aucun full replay exécuté.

### Incident ciblé puis micro-proof final

Première tentative, run `35508729216` : **failure ciblée**.

Erreur exacte :

- `games desktop: hero not visible`
- `games mobile: hero not visible`

Isolation :

- aucun overflow, aucune image cassée ni aucun contrôle coupé n'était observé sur `/games/` ;
- la page Jeux utilise volontairement la composition `.games-intro`, pas la classe générique `.hero` ;
- l'échec provenait donc d'une hypothèse trop étroite du harnais QA, pas d'une régression produit démontrée.

Correction ciblée :

- le sélecteur du harnais reconnaît désormais `.games-intro` comme composition d'ouverture de la page Jeux ;
- aucun fichier runtime produit n'a été modifié.

Micro-proof final :

- run `35508894415` — **success** ;
- marker : `PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW` ;
- surfaces : Écosystème, Sécurité, Documentation, Jeux et 404 ;
- cadres : desktop **1440×1000** + mobile **390×844** ;
- 10/10 cas : overflow horizontal **0** ;
- images cassées : **0** ;
- contrôles visibles coupés hors viewport : **0** ;
- H1 et composition d'ouverture visibles sur les 10 cas.

Les 10 captures du run corrigé ont été inspectées de façon assistée. Aucun défaut de composition bloquant n'a été isolé dans ce périmètre. Cette inspection ne remplace pas la validation artistique humaine finale.

### Registre anti-oubli courant — PR #75

La PR #75 prépare un registre courant séparé :

- `qa/MODARYX-ANTI-OUBLI-CURRENT-20260920.md` = lecture courante prioritaire ;
- `qa/MODARYX-ANTI-OUBLI.md` = historique détaillé / provenance conservée ;
- les anciens compteurs de couches, `awaiting-assets`, anciennes couvertures 16 pages et anciens états PWA/CodeQL sont explicitement marqués comme supersédés lorsqu'une preuve plus récente existe ;
- chaque idée récupérée reste classée **TERMINÉ**, **EN COURS**, **BLOQUÉ** ou **PREUVE MANQUANTE** ;
- la Master Nova Design Intelligence complète reste **PREUVE MANQUANTE / NON RÉCUPÉRÉE** et aucune entrée perdue n'est inventée.

### SEO autonome

- 404 : `noindex,nofollow` volontaire et correct ; aucun canonical artificiel ajouté.
- `/games/` : canonical courant présent.
- `/games/` reste absent de `sitemap.xml`.
- Cet écart reste **EN COURS / garde à respecter** : ne pas modifier `sitemap.xml` sans lever explicitement la protection déjà tracée autour de ce fichier.

### État courant après PR #74

- **TERMINÉ — preuve ciblée navigateur** — cinq surfaces statiques Écosystème / Sécurité / Documentation / Jeux / 404, desktop + mobile.
- **TERMINÉ sur leurs scénarios ciblés** — Recherche, Téléchargements, Profils, Catalogue, Communauté, Creator Studio, Project Hub et Accueil.
- **TERMINÉ — périmètre ciblé** — monde vivant, croissance visuelle, reduced-motion et cycle PWA HTTPS automatisé déjà documentés.
- **EN COURS** — consolidation documentaire anti-oubli PR #75 et finition Premium HD globale uniquement sur les écarts réels encore identifiés.
- **BLOQUÉ / dépendance réelle** — comptes, publication/modération distante, artefacts/signatures, météo production, Storage Resolver, Repair Network, OS Bridge réel, corpus/droits GTA VI/RDR2.
- **PREUVE MANQUANTE** — validation artistique humaine finale, lecteur d'écran natif, zoom natif 400 %, appareils physiques/tactile, Safari final, Firefox final élargi, CWV représentatifs, installation PWA manuelle, validation juridique complète et Master NDI complète.
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Intégrer le registre anti-oubli courant de la PR #75 après vérification de collision.
2. Ne pas rejouer les scénarios locaux ou la revue statique déjà verts sans modification pertinente.
3. Continuer uniquement les écarts Premium HD réellement isolés par une preuve fraîche.
4. Garder l'écart `/games/` → sitemap tracé sans modifier le fichier gardé sans autorisation explicite.
5. Fermer les preuves externes lorsque les environnements appropriés deviennent disponibles.
6. Full replay uniquement une fois, à la toute fin.


## Mise à jour canonique — PR #76 / 23 routes — 20 septembre 2026

Cette section supersède les anciens compteurs de routes et les mentions présentant encore GTA VI / RDR2 comme simples cibles futures.

### Git frais

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après PR #76 : `f3271ce468bb493b470145ec1bf61e315aab3d6a`.
- Base `main` observée lors de la vérification de ce lot : `a22a22e5590fe8aa88fc66bc8161470853ec2c15`.
- Aucun DNS, DNSSEC, nameserver, IONOS ou réglage Cloudflare critique modifié.
- Aucun full replay exécuté.

### PR #76 — GTA VI / Red Dead Redemption 2

- **TERMINÉE / fusionnée dans Work** au merge `f3271ce468bb493b470145ec1bf61e315aab3d6a`.
- Six routes éditoriales livrées :
  - `/gta-6/`
  - `/gta-6/mods/`
  - `/gta-6/guides/`
  - `/red-dead-redemption-2/`
  - `/red-dead-redemption-2/mods/`
  - `/red-dead-redemption-2/guides/`
- GTA VI : informations officielles datées et sourcées ; aucun support PC/mod, chargeur ou téléchargement inventé.
- RDR2 : repères PC officiels, taxonomie et guides ; aucun fichier distribué sans corpus autorisé.
- Aucun média Rockstar copié dans le dépôt.
- Recherche locale, fallback statique, service worker et gardes QA raccordés.

### Couverture prouvée après PR #76

- `PASS_TARGETED_SITE_FIRST_SOURCE_PROOF` — run `35509547383` — **23 pages**, failures `[]`.
- `PASS_TARGETED_BROWSER_A11Y_MICROPROOF` — run `35509547366` — **23 pages**, failures `[]`.
- `PASS_TARGETED_BROWSER_REFLOW_MICROPROOF` — run `35509547357` — **23 pages × 4 largeurs = 92 navigations**, failures `[]`.
- Les workflows automatiques PWA update/install/offline, cycle preview HTTPS, performance labo, états locaux, fichiers réels et fonctions locales déclenchés par ce bloc sont également revenus **success**.
- Cette couverture ne constitue pas un full replay final ni une validation artistique humaine globale.

### Anti-oubli — distinction courante

- **TERMINÉ — périmètre éditorial sourcé** : hubs GTA VI/RDR2, catégories et guides.
- **EN COURS — capacité non livrée** : corpus réels de mods GTA VI/RDR2, droits de redistribution, compatibilité versionnée et artefacts réels.
- Ne jamais reclasser l'absence du corpus réel comme simple preuve QA manquante.
- Le design Premium HD couvre désormais **23 routes publiques** dans les gardes source/reflow/accessibilité.

### SEO

- Les six routes nouvelles possèdent leurs canonicals dédiés.
- `/games/` et les nouvelles routes ne doivent pas être ajoutés au sitemap tant que la garde de `sitemap.xml` n'est pas explicitement levée.
- 404 conserve `noindex,nofollow`.

## Prochain point logique actualisé

1. Ne plus utiliser les anciens compteurs 16/17 pages comme état courant ; la couverture canonique est désormais 23 routes.
2. Ne pas rejouer les preuves vertes sans modification pertinente.
3. Continuer uniquement les écarts Premium HD réellement isolés par preuve fraîche.
4. Garder les corpus réels de mods, services distants et preuves externes dans leur état réel.
5. Full replay unique uniquement à la toute fin.


## Mise à jour canonique — PR #78 / #79 — sweep visuel 23 routes — 20 septembre 2026

Cette section est la lecture la plus récente pour la preuve visuelle Premium HD initiale.

### Git frais

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après PR #79 : `de093b45fa1cb1b12a07f28858bb1cf480a48bb6`.
- `main` n'a pas été modifiée par ces lots.
- Aucun sitemap, DNS, DNSSEC, nameserver, IONOS ou réglage Cloudflare critique modifié.
- Aucun full replay fonctionnel exécuté.

### PR #78 — extension visuelle GTA VI / RDR2

- **TERMINÉE / fusionnée dans Work** au merge `d953e6613572a0e1b195e5212cc997a20300230c`.
- Le harnais visuel couvre désormais les six hubs GTA VI / RDR2.
- Run `35510243999` — **success** — marker `PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW`.
- Les captures desktop 1440×1000 et mobile 390×844 des six hubs ont été inspectées de façon assistée.
- Aucun défaut bloquant de composition n'a été isolé ; aucun runtime produit n'a été modifié.

### PR #79 — balayage visuel des 23 routes

Première tentative, run `35510440300` : **failure ciblée du harnais**.

Erreur exacte :
- `project desktop: hero not visible`
- `project mobile: hero not visible`

Isolation :
- `project.html` présentait zéro overflow, zéro image cassée et zéro contrôle coupé ;
- l'index Projets utilise volontairement une première `.section` comme composition d'ouverture et non une classe hero générique ;
- aucune régression design produit n'était démontrée.

Correction ciblée QA :
- le harnais reconnaît `.project-page > .section:first-of-type` comme composition d'ouverture valide ;
- aucun fichier runtime/public n'a été modifié.

Micro-proof final :
- run `35510526508` — **success** ;
- marker `PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW` ;
- **23 routes × 2 cadres = 46 observations** ;
- desktop 1440×1000 + mobile 390×844 ;
- overflow horizontal : **0** ;
- images cassées : **0** ;
- contrôles visibles coupés : **0** ;
- H1 manquant : **0** ;
- composition d'ouverture manquante : **0** ;
- footer manquant : **0** ;
- failures : `[]`.

Les 46 captures ont été regroupées et inspectées de façon assistée. Aucun défaut visuel bloquant n'a été isolé dans l'état initial des 23 routes. Cette preuve ne remplace pas la validation artistique humaine finale, les états interactifs non déclenchés, les lecteurs d'écran natifs, les appareils physiques ou les preuves terrain.

### État Premium HD courant

- **TERMINÉ — preuve visuelle initiale ciblée** : 23 routes publiques desktop/mobile.
- **TERMINÉ — reflow ciblé** : 23 pages × 4 largeurs = 92 navigations, run `35509547357`.
- **TERMINÉ — accessibilité structurelle Chromium ciblée** : 23 pages, run `35509547366`.
- **TERMINÉ sur scénarios ciblés** : états locaux Recherche, Téléchargements, Profils, Catalogue, Communauté, Creator Studio, Project Hub et Accueil.
- **PREUVE MANQUANTE** : validation artistique humaine finale, lecteur d'écran natif, zoom natif 400 %, appareils physiques/tactile, Safari final, Firefox final élargi, CWV représentatifs, installation PWA manuelle, validation juridique complète.
- **EN COURS / capacités non livrées** : comptes, publication/modération distante, corpus réels de mods GTA VI/RDR2, Guide connecté, Storage Resolver, Repair Network et OS Bridge réel.
- **BLOQUÉ** : téléchargements publics réels sans artefacts/preuves ; météo production sans décision fournisseur/licence/attribution/confidentialité.
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Ne plus retoucher le design des 23 routes sans défaut frais reproduit ou décision artistique explicite.
2. Fermer les preuves externes et humaines lorsque les environnements appropriés sont disponibles.
3. Continuer séparément les capacités produit réellement non livrées ; ne pas les simuler.
4. Conserver le sitemap protégé inchangé tant que sa garde n'est pas explicitement levée.
5. Full replay unique uniquement à la toute fin.


## Mise à jour canonique — PR #81 / #82 — readiness + SEO — 20 septembre 2026

Cette section est la lecture la plus récente pour la readiness jeux et le SEO autonome.

### Git frais

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après PR #82 : `b0270779bedb449b0697c0a0d7c864dcc3ad764e`.
- `main` n'a pas été modifiée.
- Aucun sitemap, DNS, DNSSEC, nameserver, IONOS ou réglage Cloudflare critique modifié.
- Aucun full replay final exécuté.

### PR #81 — readiness jeux correctement séparée

- **TERMINÉE / fusionnée dans Work** au merge `9d6d15388c4276a9f873cb930085ccbe69cd60d3`.
- `game-hubs.gta6-rdr2` = `contract-ready` pour les surfaces éditoriales déjà livrées.
- `game-corpus.gta6-rdr2` = `blocked-inputs` pour les vrais mods, droits, versions et preuves de provenance.
- Le validateur vérifie aussi l'existence des six routes GTA VI/RDR2.
- Run `35511410562` — **success** :
  - `PASS_TARGETED_SITE_FIRST_SOURCE_PROOF`
  - `PASS_TARGETED_INTEGRATION_READINESS`
- Scope explicitement contractuel : aucun service manquant n'est déclaré implémenté.
- Les lanes PWA offline, fonctionnelle locale, fichiers réels et performance labo déclenchées automatiquement sur le même candidat sont également revenues **success**.

### PR #82 — contrat SEO des 23 routes

- **TERMINÉE / fusionnée dans Work** au merge `b0270779bedb449b0697c0a0d7c864dcc3ad764e`.
- Run `35511580074` — **success** :
  - `PASS_TARGETED_SITE_FIRST_SOURCE_PROOF`
  - `PASS_TARGETED_INTEGRATION_READINESS`
  - `PASS_TARGETED_SEO_CONTRACT`
- **22 pages indexables** : titre unique, description unique, canonical unique et exact.
- **404** : `noindex,nofollow`, aucun canonical artificiel.
- `robots.txt` autorise la racine.
- Toutes les URLs déjà présentes dans `sitemap.xml` correspondent à des canonicals réels.
- Le checker encadre exactement les **7 gaps sitemap connus** : `/games/` + six routes GTA VI/RDR2.
- La lane source se déclenche désormais explicitement sur `gta-6/**`, `red-dead-redemption-2/**`, `robots.txt` et `sitemap.xml`.

### État courant

- **TERMINÉ — SEO on-page ciblé** : 23 routes, avec 22 indexables + 404 noindex.
- **EN COURS / garde** : sitemap incomplet sur 7 routes ; ne pas modifier sans autorisation explicite de lever sa protection.
- **TERMINÉ — readiness éditoriale** : hubs GTA VI/RDR2.
- **EN COURS / blocked-inputs** : corpus réels de mods GTA VI/RDR2.
- **PREUVE MANQUANTE** : validations humaines et externes déjà listées.
- **EN COURS / non connectés** : comptes, publication/modération distante, Guide connecté, Storage Resolver, Repair Network, OS Bridge.
- **BLOQUÉ** : téléchargements publics réels et météo production tant que leurs entrées/décisions réelles manquent.
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Ne plus retoucher les 23 routes ni le SEO on-page sans défaut frais reproduit.
2. Conserver le sitemap gardé tel quel tant que sa protection n'est pas explicitement levée.
3. Fermer ce qui reste uniquement par vraies preuves humaines/externes ou vraies entrées produit ; ne rien simuler.
4. Garder tous les services distants dans leur état réel `not-connected` / `blocked-inputs`.
5. Full replay unique uniquement à la toute fin.


## Mise à jour canonique — PR #84 — garde anti-oubli — 20 septembre 2026

Cette section est la lecture la plus récente pour la fermeture anti-oubli automatisée.

### Git frais

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après PR #84 : `ce1368423734996137662f5d3901e52c6b8a4177`.
- `main` n'a pas été modifiée.
- Aucun sitemap, DNS, DNSSEC, nameserver, IONOS ou réglage Cloudflare critique modifié.
- Aucun full replay final exécuté.

### PR #84 — garde anti-oubli machine-enforced

- **TERMINÉE / fusionnée dans Work** au merge `ce1368423734996137662f5d3901e52c6b8a4177`.
- Nouveau checker : `qa/check-anti-oubli-current.cjs`.
- Nouveau marker : `PASS_TARGETED_ANTI_OUBLI_GATE`.
- Run `35511815106` — **success** :
  - `PASS_TARGETED_SITE_FIRST_SOURCE_PROOF`
  - `PASS_TARGETED_INTEGRATION_READINESS`
  - `PASS_TARGETED_SEO_CONTRACT`
  - `PASS_TARGETED_ANTI_OUBLI_GATE`
- Le garde protège notamment :
  - couverture courante 23 routes ;
  - SEO on-page terminé et sitemap séparé ;
  - hubs éditoriaux `contract-ready` ;
  - corpus GTA VI/RDR2 `blocked-inputs` ;
  - présence explicite des blockers humains/externes/services ;
  - rejet du retour aux anciens états 17 pages / SEO global EN COURS / hubs non livrés.
- Le run courant rapporte **24 lignes ouvertes** au sens large `EN COURS | BLOQUÉ | PREUVE MANQUANTE` ; ce nombre ne vaut pas 24 defects produit, car il regroupe capacités non connectées, décisions externes et preuves terrain manquantes.
- Les triggers `pull_request` de la lane source couvrent désormais aussi les checkers readiness, SEO, anti-oubli et leurs sources.

### État autonome courant

Aucun écart local autonome supplémentaire n'est actuellement démontré par une preuve fraîche sur le périmètre déjà couvert. Les éléments encore ouverts appartiennent à l'une des catégories suivantes :

- garde sitemap explicitement protégée ;
- vraies capacités produit non connectées / entrées manquantes ;
- décisions fournisseur/licence/confidentialité ;
- validation humaine, appareil physique, moteur navigateur ou preuve terrain ;
- source historique Master NDI non récupérée.

Cela ne constitue pas une VF ni un 100 %. Aucun de ces éléments ne doit être simulé pour augmenter le pourcentage.

## Prochain point logique actualisé

1. Ne pas créer de retouche locale sans défaut frais reproduit.
2. Conserver le sitemap inchangé tant que sa garde n'est pas explicitement levée.
3. Fermer les capacités restantes uniquement avec de vraies entrées produit/services.
4. Fermer les preuves externes sur les environnements appropriés.
5. Exécuter le full replay unique seulement lorsque les blockers réellement fermables auront été fermés.


## Mise à jour canonique — qualification fournisseur météo — 20 septembre 2026

Cette section est la lecture la plus récente pour le blocker météo production.

### Git frais avant qualification

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work de départ : `b208a988bcd9c7bc4b9d917ca2d6f852c49e163e`.
- `main` : inchangée.
- Aucun DNS, DNSSEC, nameserver, IONOS, secret ou réglage Cloudflare critique modifié.
- Aucun full replay exécuté.

### Architecture déjà en place

- saison locale + heure locale indépendantes de la chronologie mondiale partagée ;
- endpoint same-origin `/api/local-context` ;
- contexte réseau approximatif côté serveur ;
- coordonnées fournisseur arrondies à 0,1° ;
- aucune ville, code postal ou coordonnée exacte renvoyés au navigateur ;
- aucune permission GPS demandée ;
- `Permissions-Policy: geolocation=()` conservée ;
- météo fail-soft et `MODARYX_WEATHER_MODE=off` par défaut.

### Qualification officielle des fournisseurs

Document : `qa/MODARYX-WEATHER-PROVIDER-QUALIFICATION-20260920.md`.

- **WeatherAPI** : offre Free à 0 $ / 100k appels mensuels annoncée, usage commercial autorisé par les conditions ; attribution Free, clé confidentielle côté serveur et disclaimer utilisateur requis. **Candidat privilégié, non activé**.
- **Open-Meteo** : Free API explicitement non commerciale ; logs de dépannage pouvant contenir IP/coordonnées, suppression annoncée à 90 jours ; une offre commerciale reste possible séparément.
- **OpenWeather** : licence ouverte permettant le commercial mais imposant attribution + ShareAlike à la solution dérivée ; non privilégié sans validation juridique de cette contrainte.
- **Geolocation navigateur** : permission explicite requise lorsqu'elle est sollicitée ; la stratégie MODARYX sans popup GPS est conservée.

### État courant

- **TERMINÉ — qualification technique/documentaire** : options fournisseur comparées et architecture d'activation encadrée.
- **BLOQUÉ / décision externe** : activation production réelle.
- Conditions de fermeture : validation licence/confidentialité/attribution/disclaimer, choix explicite du fournisseur, secret serveur si requis, micro-proof réel du proxy, limites de cache/appels et fail-soft prouvés.
- Aucun fournisseur sélectionné contractuellement, aucune clé créée, aucune donnée météo réelle activée.
- Saison + heure locale restent opérationnelles sans météo.
- **Aucune VF / aucun 100 % déclaré.**


## Mise à jour canonique — PR #87 — Firefox 23 routes — 20 septembre 2026

Cette section est la lecture la plus récente pour la preuve Firefox.

### Git frais

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après PR #87 : `e3252d73d4ccc1f38acd12ddb7d61c97b8c809ff`.
- `main` n'a pas été modifiée.
- Aucun sitemap, DNS, DNSSEC, nameserver, IONOS, secret ou réglage Cloudflare critique modifié.
- Aucun full replay final exécuté.

### PR #87 — Firefox 23 routes

- **TERMINÉE / fusionnée dans Work** au merge `e3252d73d4ccc1f38acd12ddb7d61c97b8c809ff`.
- Run `35512379997` — **success**.
- Marker exact : `PASS_TARGETED_FIREFOX_23_ROUTE_PROOF`.
- Moteur : **Firefox 155.0** via **Playwright 1.63.0**.
- Couverture : **23 routes × 2 viewports = 46 observations**.
- Viewports : desktop 1440×1000 et mobile 390×844.
- Service worker bloqué dans cette lane pour isoler rendu/routing ; `reducedMotion: reduce` utilisé pour stabiliser les captures.
- Contrôles : navigation HTTP, document complet, largeur viewport, overflow horizontal, H1, composition d'ouverture, footer, images cassées, contrôles coupés, erreurs JavaScript non interceptées.
- Résultat : `failures: []`, zéro overflow, zéro image cassée, zéro contrôle coupé et aucune erreur JS relevée.
- Les 46 captures pleine page ont été inspectées de façon assistée ; aucun défaut visuel bloquant n'a été isolé.
- Artefact du run : `modaryx-firefox-23-route-bc5f6bf5259b4aa4be10bec24e2ca967344dec3f`, digest `sha256:698147a86e158eebc8910a11fc9f7644e2632806ae6c0de25548089d8ef03c6a`.

### Distinction navigateur

- **TERMINÉ — preuve ciblée Firefox** : 23 routes desktop/mobile.
- **PREUVE MANQUANTE — Safari final** : doit être prouvé séparément sur environnement WebKit/Safari approprié.
- Une preuve Firefox ne valide pas Safari.
- La preuve Firefox ne vaut pas appareil physique, lecteur d'écran, zoom natif 400 %, CWV terrain ni full replay final.
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Conserver Firefox fermé tant qu'aucune modification pertinente ne justifie un nouveau test.
2. Garder Safari explicitement PREUVE MANQUANTE jusqu'à preuve séparée.
3. Continuer uniquement les preuves externes/humaines ou capacités produit réellement non livrées.
4. Aucun full replay avant la toute fin.


## Mise à jour canonique — PR #89 — WebKit 23 routes — 20 septembre 2026

Cette section est la lecture la plus récente pour le préflight WebKit.

### Git frais

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work après PR #89 : `99cb2b981a58c00d6c3b625855c2c84ed47d3ce1`.
- `main` n'a pas été modifiée.
- Aucun sitemap, DNS, DNSSEC, nameserver, IONOS, secret ou réglage Cloudflare critique modifié.
- Aucun full replay final exécuté.

### PR #89 — WebKit 23 routes

- **TERMINÉE / fusionnée dans Work** au merge `99cb2b981a58c00d6c3b625855c2c84ed47d3ce1`.
- Run `35514304174` — **success**.
- Marker exact : `PASS_TARGETED_WEBKIT_23_ROUTE_PREFLIGHT`.
- Moteur : **WebKit 26.6** via **Playwright 1.63.0**.
- Couverture : **23 routes × 2 viewports = 46 observations**.
- Viewports : desktop 1440×1000 et mobile 390×844.
- Service worker bloqué pour isoler rendu/routing ; `reducedMotion: reduce` utilisé pour stabiliser la capture.
- Résultat : `failures: []`, zéro overflow horizontal, zéro image cassée, zéro contrôle coupé et aucune erreur JavaScript non interceptée relevée.
- Les 46 captures pleine page ont été inspectées de façon assistée ; aucun défaut visuel bloquant n'a été isolé.
- Artefact du run : `modaryx-webkit-23-route-6a618bcf27d86c1bb995c0fb2fb87c86e8074191`, digest `sha256:d8433bb71b307c76ccac693db23a19ecb4fed7c78a80b8099e5f24056b79210e`.

### Limite impérative

- **TERMINÉ — préflight WebKit ciblé** : signal de compatibilité moteur sur les 23 routes.
- **PREUVE MANQUANTE — Safari final** : WebKit Playwright n'est pas Safari et ne ferme pas cette preuve.
- Firefox ciblé reste séparément TERMINÉ via PR #87.
- Aucun de ces résultats ne remplace appareil physique, lecteur d'écran natif, zoom navigateur natif 400 %, CWV terrain ou full replay final.
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Conserver Firefox et le préflight WebKit fermés tant qu'aucune modification pertinente ne justifie un nouveau test.
2. Garder Safari final explicitement PREUVE MANQUANTE jusqu'à preuve Safari réelle.
3. Continuer uniquement les preuves externes/humaines ou capacités produit réellement non livrées.
4. Aucun full replay avant la toute fin.


## Mise à jour canonique — qualification backend communautaire — 20 septembre 2026

Cette section est la lecture la plus récente pour le backend communautaire.

### Git frais avant qualification

- Branche Work : `design/modaryx-premium-hd-20260914-work`.
- HEAD Work de départ : `d4db7e1884c7f27e2562d3ae003532b224180745`.
- `main` : inchangée.
- Aucun backend, binding, secret, DNS, sitemap ou réglage Cloudflare critique modifié.
- Aucun full replay exécuté.

### Qualification

Document : `qa/MODARYX-COMMUNITY-BACKEND-QUALIFICATION-20260920.md`.

- **Data plane candidat privilégié** : Pages Functions/Workers + D1 + R2 + Turnstile.
- Justification : cohérence avec l'hébergement actuel, bindings Pages natifs et paliers Free documentés.
- D1 Free documenté : 5 M lignes lues/jour, 100 k écrites/jour, 5 Go.
- R2 Free documenté : 10 Go-mois, 1 M Class A, 10 M Class B/mois, egress Internet gratuit.
- Turnstile Free : jusqu'à 20 widgets, challenges illimités.
- Workers Free : 100 k requêtes/jour.

### Identité

- **Supabase Auth = candidat qualifié, non sélectionné**.
- Free documenté : 50 k MAU, base 500 Mo, stockage 1 Go, 5 Go egress.
- RLS Postgres permet des règles d'accès par ligne.
- Les passkeys/WebAuthn existent mais sont encore **expérimentales** dans la documentation actuelle.
- Les projets Free peuvent être mis en pause après une semaine d'inactivité.
- Aucun secret/service role ne doit être exposé au frontend.
- Aucune implémentation WebAuthn maison n'est retenue comme raccourci.

### État courant

- **TERMINÉ — qualification technique/documentaire** : architectures comparées et candidat data plane identifié.
- **EN COURS — capacité non connectée** : backend communautaire réel.
- **EN COURS — identité/passkeys** : fournisseur et politique de session/récupération restent à approuver et connecter.
- **Aucun service distant simulé ou déclaré livré.**
- **Aucune VF / aucun 100 % déclaré.**

## Prochain point logique actualisé

1. Ne pas déployer le backend sans validation explicite du data plane et de l'identité.
2. Conserver les profils/publications/modération comme local-only/non connectés tant que les migrations, rôles, allow/deny, audit et politiques d'abus ne sont pas prouvés.
3. Continuer les qualifications documentaires des autres capacités uniquement lorsqu'elles réduisent un vrai blocker.
4. Aucun full replay avant la toute fin.
