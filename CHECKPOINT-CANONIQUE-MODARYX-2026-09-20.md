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
