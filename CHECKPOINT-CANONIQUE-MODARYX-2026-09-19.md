# CHECKPOINT CANONIQUE — MODARYX — 19 septembre 2026

Ce document devient la source de vérité opérationnelle la plus récente pour la reprise du chantier web MODARYX sur la continuation isolée créée après épuisement du quota Work. Il ne constitue ni une fusion vers `main`, ni une promotion production, ni une déclaration de VF.

## Séparation produit

- **Nova Forge = logiciel / OS**
  - Nova Forge OS Public
  - Nova Forge OS Fondateur
- **MODARYX / MODARYX MODS = plateforme web**
- `getnovaforge.com` / « getnova » = ancien projet web abandonné ; références historiques seulement si nécessaires pour compatibilité/provenance/protection technique.
- Aucune migration MODARYX → Nova Forge.
- Les références historiques Nova Forge dans le dépôt MODARYX doivent être classifiées avant modification.

## Git — état frais avant ce checkpoint

### Branche Work / PR #12

- Dépôt : `Jajaz537/Nova-Forge-Site-Public`
- PR #12 : ouverte, brouillon, non fusionnée.
- Branche : `design/modaryx-premium-hd-20260914-work`
- HEAD observé après arrêt de Work : `f649f823856228ee51848f64d2e71299dfc307ef`
- Message du dernier commit Work : `Reframe MODARYX as a living fantasy world`
- Aucun commit Work plus récent n'était présent sur GitHub lors de la reprise.

### Continuation isolée ChatGPT

- Branche : `chatgpt/modaryx-scalable-cache-20260919`
- Base exacte : `f649f823856228ee51848f64d2e71299dfc307ef`
- HEAD avant création de ce checkpoint : `61fcf986992a50c2ac6209bda34c081fe6cb83a7`
- PR #16 : ouverte, brouillon, base = branche Work de PR #12.
- PR #16 observée fusionnable avant ce checkpoint.
- Divergence au moment de la reprise : continuation en avance sur la branche Work, sans écrasement de celle-ci.
- `main` n'a pas été modifiée.

## TERMINÉ — reprise contrôlée après arrêt Work

- Point d'arrêt Work retrouvé précisément.
- Nouvelle branche isolée créée à partir du HEAD exact de Work.
- Aucun force-push.
- Aucun écrasement de travail parallèle.
- Aucun changement DNS, DNSSEC, nameserver, IONOS ou configuration Cloudflare critique.
- Mémo anti-oubli récupéré et tracé dans `qa/MODARYX-ANTI-OUBLI.md`.

## TERMINÉ — micro-lot cache évolutif, preuve source ciblée

Le problème historique du précache quasi saturé a été isolé.

### Mesure fraîche du HEAD Work `f649f82`

- 76 fichiers uniques dans l'ancien précache.
- Total unique déterministe : **794167 octets**.
- Marge sous le seuil 800000 : **5833 octets**.
- Images/icônes : 374178 octets.
- Les deux grandes illustrations WebP représentent 367522 octets.

Cette mesure fraîche remplace les anciennes projections uniquement pour ce lot. Elle ne constitue pas une mesure réseau ou CWV.

### Architecture candidate

`sw.js` a été refactoré dans la branche isolée pour utiliser :

- un **précache cœur compact** ;
- un **runtime cache contrôlé** ;
- pages publiques connues : network-first + cache après visite ;
- métadonnées fraîches : network-first + `cache: no-store` ;
- CSS/JS publics : révalidation réseau + fallback ;
- images/assets publics : cache après première utilisation ;
- normalisation des query strings pour les assets runtime ;
- plafond de **80 entrées runtime non cœur** ;
- protection du noyau contre l'éviction ;
- nettoyage limité aux caches MODARYX et anciens caches `nova-site-shell-*` appartenant historiquement au site.

### Nouveau noyau

- 16 fichiers locaux uniques / 17 clés de cache.
- Total unique déterministe : **110457 octets**.
- Marge sous 800000 : **689543 octets**.
- Réduction du précache unique : **683710 octets**, environ **86,1 %**.
- Le seuil de 800000 est conservé ; il n'a pas été relevé pour masquer le problème.

### Micro-preuve exécutée

`node --check sw.js` : **PASS CIBLÉ**.

`node qa/check-scalable-cache.mjs` : **PASS CIBLÉ** sur la sémantique simulée :

- grandes illustrations absentes de l'install-précache ;
- futur asset public cacheable à l'usage sans ajout fichier par fichier au précache ;
- normalisation des variantes de query string ;
- page publique visitée disponible comme fallback hors ligne simulé ;
- métadonnées network-first/no-store ;
- chemin arbitraire privé non intercepté ;
- stress 100 assets runtime avec plafond final de 80 ;
- noyau non évincé ;
- nettoyage limité aux caches du site.

Cette preuve **ne vaut pas PASS PWA natif**.

## EN COURS — cache / PWA

Restent à prouver dans un vrai navigateur/environnement adapté :

- installation/activation HTTPS réelle ;
- mise à jour après nouvelle publication ;
- online → offline → online ;
- comportement cache froid/chaud ;
- quota navigateur réel ;
- éviction réelle ;
- Core Web Vitals représentatifs ;
- appareils physiques.

Le baseline externe `../site-baseline` reste sans provenance canonique récupérée. Ne pas l'inventer.

## EN COURS — direction artistique « monde vivant »

Le précédent statut « terminé » des deux illustrations majeures a été réouvert après validation humaine de la direction souhaitée.

La règle canonique est maintenant :

- le sanctuaire est la philosophie du **monde entier**, pas une petite zone isolée ;
- monde vivant, habitable, naturel, noble, monumental et cohérent ;
- château/cité qui en impose et reste lisible ;
- vrais animaux intégrés à leur habitat ;
- quelques villageois/habitants/voyageurs ;
- quelques soldats/gardes/protecteurs avec mesure ;
- héros présent seulement de temps en temps, au service du monde ;
- **aucune île flottante, aucune structure flottante, aucun objet artificiellement suspendu dans le ciel** ;
- eau bien dosée : rivières, lacs, ruisseaux, quelques cascades naturelles ; éviter la multiplication de fontaines/jets/cascades décoratives ;
- nature + architecture + vie + profondeur ;
- pas de roche grise stérile comme identité dominante ;
- cadrage artistique réellement vérifié sur mobile/tablette/desktop/grand écran.

Les deux illustrations actuelles restent **EN COURS** tant qu'elles n'ont pas été revérifiées/corrigées contre ces règles.

Document : `qa/MODARYX-LIVING-WORLD-ART-DIRECTION-20260919.md`.

## TERMINÉ — anti-oubli des dépendances récupérées

Les conditions suivantes sont maintenant tracées explicitement :

1. **OS Bridge** — après stabilisation de l'interface publique de Nova Forge OS.
2. **Storage Resolver** — lorsque le service de stockage sera disponible.
3. **Repair Network** — lorsque son protocole public sera finalisé.
4. **Backend communautaire** — lorsqu'une solution sécurisée respectant le budget de **0 €** sera prête.

Règles :

- un schéma JSON ou un état UI ne constitue pas un service livré ;
- ne pas inventer les endpoints/services manquants ;
- OS Bridge ne fusionne jamais l'identité de MODARYX avec Nova Forge OS ;
- ces quatre éléments restent suivis jusqu'à livraison réelle ou décision produit écrite.

## TERMINÉ — preuves antérieures conservées

Les preuves acquises avant ce checkpoint restent valables uniquement sur leur périmètre et leur commit :

- zoom/reflow 200 % Firefox + Chromium : preuve ciblée acquise ;
- responsive ciblé 390/1280 sur 17 routes : acquis du lot Work correspondant ;
- correctif Téléchargements : acquis du lot Work correspondant ;
- contrôles structurels et interactions ciblés : acquis selon leurs preuves ;
- sécurité compte : acquise sur son périmètre ;
- Full (strict) ciblé sur l'apex : preuve antérieure distincte, sans changement dans ce lot.

Aucune de ces preuves ne ferme automatiquement les validations restantes.

## PREUVE MANQUANTE / BLOQUÉ

- 400 % natif réel : PREUVE MANQUANTE.
- Lecteur d'écran natif réel : BLOQUÉ / PREUVE MANQUANTE.
- Appareils physiques : PREUVE MANQUANTE.
- PWA HTTPS offline/update réel : PREUVE MANQUANTE.
- Core Web Vitals représentatifs : PREUVE MANQUANTE.
- Baseline cache canonique : BLOQUÉ / PREUVE MANQUANTE.
- Import/export avec vrais fichiers reçus sur un système utilisateur réel : PREUVE MANQUANTE selon le périmètre antérieur.
- Master Nova Design Intelligence complète : NON RÉCUPÉRÉE / PREUVE MANQUANTE.
- Validation juridique complète, identité/contact/mentions légales si toujours absents : PREUVE MANQUANTE.

## Capacités produit non livrées à conserver dans l'anti-oubli

- hubs GTA VI / RDR2 selon données/droits/décisions disponibles ;
- comptes/profils réels ;
- publication/modération distante ;
- Storage Resolver ;
- Repair Network ;
- backend communautaire ;
- distribution réelle avec artefacts/provenance/signatures ;
- Guide connecté ;
- OS Bridge optionnel vers Nova Forge OS ;
- toute autre idée explicitement retenue et récupérée.

Ne pas transformer leur absence en simple « test externe ».

## Prochain point logique

1. Garder PR #16 isolée tant que les preuves ciblées ne sont pas suffisamment consolidées.
2. Réconcilier les documents de budget/cache avec la nouvelle architecture.
3. Valider le patch cache par inspection et micro-preuves supplémentaires sans full replay inutile.
4. Ne fusionner la continuation dans la branche Work qu'après vérification Git fraîche et absence de collision.
5. Reprendre ensuite la correction artistique réelle des illustrations selon le quality gate affiné.
6. Continuer la revue Premium HD page par page.
7. Fermer les preuves externes uniquement lorsqu'un environnement réel le permet.
8. Aucun PASS/VF final sans preuves correspondantes.

## Règles permanentes

- Aucun faux PASS.
- Aucun full replay immédiat après erreur.
- Erreur exacte → isolation → correction ciblée → micro-preuve → continuation.
- Ne pas toucher à `main` sans décision contrôlée.
- Ne pas modifier DNS, DNSSEC, nameservers, IONOS ou Cloudflare critique sans instruction explicite.
- Ne pas écraser le travail d'un autre agent/conversation.
- Utiliser autant que possible : **TERMINÉ / EN COURS / BLOQUÉ / PREUVE MANQUANTE**.

## Mise à jour post-intégration contrôlée — 19 septembre 2026

Vérification Git fraîche après la tentative d'intégration :

- la première tentative de merge de PR #16 a été refusée par GitHub car la PR était encore en brouillon (**erreur exacte 405 — Pull Request is still a draft**) ;
- aucune relance globale n'a été faite ;
- correction ciblée : PR #16 marquée prête pour revue ;
- micro-vérification : HEAD inchangé `d7c8b15a03cd82f4ec7a6f1c85b2d2f833da3d01`, base inchangée `f649f823856228ee51848f64d2e71299dfc307ef`, PR fusionnable ;
- merge ensuite réussi sans force-push.

État intégré :

- PR #16 : **TERMINÉE — fusionnée** ;
- commit de merge dans la branche Work : `450ec83cc39058f5a2d2f42173ffd32e0db40fad` ;
- branche active PR #12 : `design/modaryx-premium-hd-20260914-work` ;
- PR #12 : toujours ouverte et brouillon ;
- `main` : inchangée par ce lot ;
- infrastructure critique : inchangée.

La nouvelle architecture cache, le quality gate « monde vivant » affiné, les entrées anti-oubli récupérées et le présent checkpoint font désormais partie de la branche active de la PR #12.

### État après intégration

- **TERMINÉ** — isolation + micro-preuve source + intégration contrôlée du lot cache/documentation.
- **EN COURS** — validation navigateur HTTPS/offline réelle de la nouvelle architecture.
- **EN COURS** — correction artistique réelle des deux illustrations contre le quality gate affiné.
- **PREUVE MANQUANTE** — 400 % natif, lecteur d'écran natif, appareils physiques, CWV représentatifs et autres preuves externes déjà listées.

### Prochain point logique après intégration

1. Ne pas rejouer un full run.
2. Vérifier d'abord le déploiement/preview du nouveau HEAD si une preuve externe de branche devient disponible.
3. Effectuer ensuite uniquement les contrôles ciblés nécessaires au nouveau service worker.
4. Reprendre les illustrations : zéro île/objet flottant, eau moins répétitive, château réellement imposant, animaux réels + quelques habitants/gardes, héros occasionnel.
5. Continuer la finition Premium HD sans déclarer la VF.

## Mise à jour ciblée — empreinte `sw.js` et couverture statique — 19 septembre 2026

### Erreur isolée après intégration cache

Après l'intégration de la nouvelle architecture, `SHA256SUMS.txt` contenait encore l'ancienne empreinte SHA-256 de `sw.js` :

- ancienne valeur : `aded853aaf9777bc6efb7b1c5c98f557415c303eeb0201852a1009f02e114d61` ;
- contenu exact du nouveau blob GitHub `sw.js` : blob `cc5be375a444fd8e32ae546e628ddc0a4ddd06e2`, 6289 octets ;
- SHA-256 fraîche du contenu exact : `35fe17798188f658fc94a5f289e666f25ef7177658869ce118b921d604706873`.

Procédure appliquée : erreur exacte → isolation sur `chatgpt/modaryx-fingerprint-fix-20260919` → correction d'une seule ligne → micro-preuve → intégration contrôlée via PR #17.

Résultat :

- PR #17 : **TERMINÉE — fusionnée** ;
- commit d'intégration : `3baf4fc046f719b39b646d63862718fae5beb899` ;
- `SHA256SUMS.txt` contient désormais une seule entrée `./sw.js` et elle correspond à la nouvelle empreinte ;
- aucun autre fichier public modifié par ce micro-lot ;
- `main` et infrastructure critique inchangées.

### Micro-preuve de couverture statique de la stratégie cache

Inspection ciblée du HEAD intégré après la restructuration :

- 17 pages publiques extraites de `PUBLIC_PAGE_PATHS` ;
- 654 références locales `href/src` inspectées ;
- 0 référence locale non couverte par l'une des catégories attendues : page publique connue, cœur précaché, donnée fraîche explicite, ou asset runtime autorisé.

Cette preuve est **ciblée et statique**. Elle ne couvre pas automatiquement les URLs construites dynamiquement par JavaScript et ne vaut pas preuve navigateur/offline réelle.

### État courant après ce micro-lot

- **TERMINÉ** — architecture cache intégrée sur la branche active PR #12 avec empreinte `sw.js` réconciliée.
- **TERMINÉ** — couverture statique `href/src` des 17 pages vérifiée sur le périmètre inspecté.
- **EN COURS** — validation PWA HTTPS réelle et comportement offline/update natif.
- **EN COURS** — correction artistique des illustrations selon le quality gate monde vivant.
- **PREUVE MANQUANTE** — validations externes précédemment listées.

## Mise à jour ciblée — fraîcheur runtime après cache évolutif — 19 septembre 2026

Risque isolé après la première intégration : les images/schémas runtime utilisaient `cache-first`. Or MODARYX remplace parfois un asset au **même chemin**, ce qui pouvait conserver une ancienne copie tant qu'aucune nouvelle version de cache n'était activée.

Correction ciblée :

- assets runtime non CSS/JS : `network-first` avec fallback cache ;
- CSS/JS : révalidation réseau conservée ;
- données fraîches : `network-first` + `cache: no-store` conservé ;
- plafond runtime 80 conservé ;
- noyau précaché inchangé ;
- aucune grande illustration réintroduite dans l'install-précache.

Micro-preuve sur le contenu exact des blobs candidats :

- `node --check sw.js` : **PASS CIBLÉ** ;
- futur asset chargé en ligne : nouvelle version réseau servie et recachée ;
- passage hors ligne : dernière copie mise en cache servie avec marque `offline-stale` ;
- plafond runtime : **80** après stress de 100 assets ;
- noyau non évincé : **PASS CIBLÉ** ;
- empreinte fraîche `sw.js` : `f27348c7b3a038cccf65eb6b5089f6d3ce07239d43accd9d70c8a5fc46c14697` ;
- `SHA256SUMS.txt` réconcilié dans le même lot.

Intégration :

- PR #18 : **TERMINÉE — fusionnée** ;
- commit d'intégration dans la branche Work : `c29736f737f005dbb90b840a4df0660bd272bd75` ;
- `main` : inchangée ;
- infrastructure critique : inchangée.

Cette preuve reste source/simulée. Installation/activation HTTPS réelle, update réel, cache froid/chaud, quotas navigateur et CWV restent **PREUVE MANQUANTE**.

## Mise à jour — monde vivant approuvé et première couche technique — 19 septembre 2026

Décision utilisateur : la direction visuelle actuelle est **approuvée**. Arrêt de la recherche par nouvelles photos/illustrations ; reprise du travail produit/technique. La cible reste un **monde vivant**, pas une suite d'images figées.

### Branche isolée

- base vérifiée avant écriture : branche PR #12 `design/modaryx-premium-hd-20260914-work` au HEAD `05eeaa250a1bbfd53cf5c45ee47d90468fae4aab` ;
- continuation : `chatgpt/modaryx-living-world-20260919` ;
- `main` non modifiée ;
- aucune infrastructure critique modifiée.

### Première implémentation monde vivant

Ajouts :

- `data/living-world.json` : chronologie partagée UTC ;
- `assets/living-world.js` : moteur de progression ;
- `assets/living-world.css` : mouvement de profondeur et lumière ambiante sobres ;
- `index.html` : état du monde visible (phase, âge du monde, loup, dragon) ;
- `sw.js` : chronologie classée comme donnée fraîche explicite ;
- `qa/MODARYX-LIVING-WORLD-SYSTEM-20260919.md` : contrat d'architecture.

Chronologie initiale :

- loup : **Louveteau** à J0, juvénile à J45, adolescent à J120, jeune adulte à J270, adulte à J540 ;
- dragon : **Dragonneau** à J0, juvénile à J60, adolescent à J150, jeune adulte à J330, adulte à J720.

Ces seuils sont narratifs et pilotés par les données ; ils ne sont pas présentés comme des affirmations biologiques.

### Mouvement et accessibilité

- cycle local nuit/aube/jour/crépuscule ;
- ambiance lumineuse et mouvement de profondeur très lents ;
- le réglage `Mouvement réduit` et `prefers-reduced-motion` désactivent les animations ;
- la chronologie et la croissance logique continuent même en reduced motion.

### Limite explicitement conservée

Le hero actuel reste une illustration composite. La progression d'âge est désormais réelle dans les données et l'UI, mais **la croissance visuelle individuelle du loup et du dragon n'est pas encore démontrée**. Pour cela, il faudra séparer décor, loup, dragon, héros et couches d'ambiance afin de pouvoir faire évoluer les personnages sans régénérer tout le panorama.

État : **EN COURS**, pas de faux PASS visuel.

### Micro-preuve ciblée

Résultat : **PASS CIBLÉ** sur le périmètre source :

- `living-world.js` compilable ;
- JSON parse + schéma valides ;
- Louveteau à J0 et transition juvénile J45 ;
- Dragonneau à J0 et transition juvénile J60 ;
- hooks home présents ;
- reduced motion présent ;
- donnée monde vivant couverte par le service worker ;
- empreintes SHA-256 de `index.html`, `sw.js`, `assets/living-world.js`, `assets/living-world.css` et `data/living-world.json` réconciliées.

Cette preuve ne vaut pas validation visuelle navigateur ni appareil physique.

### Octets

- noyau précédent : 110457 octets ;
- `index.html` : +619 octets ;
- noyau dérivé : **111076 octets** ;
- marge sous 800000 : **688924 octets** ;
- JS/CSS/JSON monde vivant runtime : **9615 octets**, hors install-précache.

### Prochain point logique

1. vérifier Git frais et l'absence de collision avec la branche Work ;
2. intégrer ce micro-lot de manière contrôlée si la branche Work n'a pas bougé ;
3. obtenir une preview navigateur réelle du monde vivant ;
4. vérifier desktop/mobile/reduced-motion sans full replay ;
5. poursuivre la séparation future des couches de personnages afin que leur croissance devienne réellement visible ;
6. continuer la finition Premium HD et les preuves externes restantes.

## Intégration contrôlée — monde vivant — 19 septembre 2026

Après micro-preuves ciblées et vérification Git fraîche :

- PR #19 : **TERMINÉE — fusionnée** ;
- commit d'intégration dans la branche active PR #12 : `8c06f45ec9c9c5f3de38c1dd6619eb312646b11a` ;
- PR #12 : toujours ouverte et brouillon ;
- `main` : inchangée ;
- aucune modification DNS/DNSSEC/nameservers/IONOS/Cloudflare critique ;
- CodeQL du commit d'intégration : **EN COURS / en file d'attente** au moment de cette mise à jour, donc aucun PASS annoncé.

État du monde vivant après intégration :

- **TERMINÉ** — chronologie partagée, croissance logique du loup/dragon, cycle journalier, ambiance dynamique sobre, reduced motion, cache et empreintes ;
- **EN COURS** — croissance visuelle individuelle réelle des personnages, car le hero demeure actuellement une image composite ;
- **PREUVE MANQUANTE** — contrôle navigateur réel de la nouvelle couche, responsive visuel ciblé, comportement reduced motion réel et appareils physiques.

La règle produit reste : MODARYX doit devenir un univers qui évolue, pas un fond animé décoratif ni une collection d'images figées.

## Décision canonique — mêmes stades pour le loup et le dragon — 19 septembre 2026

L'utilisateur confirme explicitement la règle suivante :

- **Louveteau / Dragonneau** au départ ;
- puis, pour les deux compagnons : **juvénile → adolescent → jeune adulte → adulte** ;
- même ordre de stades pour le loup et le dragon ;
- vitesse de croissance configurable indépendamment par espèce.

Implémentation isolée sur `chatgpt/modaryx-shared-growth-model-20260919` depuis le HEAD actif `062adc2758a369c3773fd7bc7829c8a534a0eed6`.

Le contrat `data/living-world.json` déclare maintenant `growthModel.order` = `baby / juvenile / adolescent / young-adult / adult` et `pace: independent-per-species`. Le moteur `assets/living-world.js` refuse une configuration où un compagnon ne respecte pas cet ordre canonique.

Micro-preuve ciblée : **PASS CIBLÉ**.

- ordre partagé déclaré : conforme ;
- ordre du loup : conforme ;
- ordre du dragon : conforme ;
- seuils de chaque espèce strictement croissants ;
- rythme déclaré indépendant ;
- validation moteur du modèle et des habitants présente ;
- empreintes SHA-256 JS/JSON réconciliées.

Le noyau précaché reste **111076 octets**. Le runtime monde vivant passe à **11065 octets**. La croissance visuelle individuelle reste **EN COURS** tant que les personnages ne sont pas séparés du panorama composite.

## Intégration contrôlée — modèle de croissance partagé — 19 septembre 2026

La règle approuvée « mêmes stades, rythme indépendant » est maintenant intégrée dans la branche active.

- PR #20 : **TERMINÉE — fusionnée** ;
- commit d'intégration : `26075d86ff06dbf254e3f766b492932ea83301c9` ;
- ordre canonique pour le loup et le dragon : **bébé → juvénile → adolescent → jeune adulte → adulte** ;
- libellés initiaux : **Louveteau** et **Dragonneau** ;
- rythme du loup et du dragon réglable séparément ;
- validation moteur active contre tout ordre divergent ;
- empreintes SHA-256 réconciliées ;
- noyau install-précaché inchangé à **111076 octets** ;
- runtime monde vivant : **11065 octets** ;
- `main` et infrastructure critique : inchangées ;
- CodeQL du commit d'intégration : **EN COURS / queued** au moment de cette mise à jour.

La croissance visuelle individuelle des personnages reste **EN COURS** tant que le panorama actuel n'est pas séparé en couches dédiées.

## Confirmation utilisateur — état à conserver — 19 septembre 2026

L'utilisateur demande explicitement de conserver comme référence de projet les décisions et résultats suivants :

### Monde vivant

- MODARYX doit être un **monde vivant**, pas une galerie d'images figées.
- La direction visuelle actuellement approuvée est conservée ; ne pas relancer de nouvelles recherches d'illustrations sans besoin précis.
- Le monde doit évoluer dans le temps : lumière, ambiance, activité discrète, animaux, habitants, gardes et évolutions progressives.
- La croissance logique du loup et du dragon est déjà intégrée.
- Ordre canonique commun : **bébé → juvénile → adolescent → jeune adulte → adulte**.
- Libellés initiaux : **Louveteau** et **Dragonneau**.
- La vitesse de croissance peut rester indépendante par espèce.
- La croissance visuelle individuelle reste **EN COURS** jusqu'à séparation des personnages et du décor en couches dédiées.

### Architecture octets / cache pour le futur

- L'ancien modèle quasi global était proche de la saturation : **794167 / 800000 octets**, soit seulement **5833 octets** de marge.
- La solution retenue est structurelle : **précache cœur compact + runtime cache contrôlé**.
- Noyau courant dérivé : **111076 octets**.
- Marge sous le garde-fou 800000 : **688924 octets**.
- Les gros visuels, le monde vivant et les futurs jeux/mods/modules ne doivent pas être ajoutés mécaniquement au précache global.
- Les contenus futurs doivent être chargés à la demande puis éventuellement mis en cache en runtime.
- Runtime cache borné à **80 entrées non cœur**.
- Le seuil **800000** reste un garde-fou ; ne pas l'augmenter arbitrairement pour masquer un problème d'architecture.
- Runtime monde vivant courant : **11065 octets**, hors install-précache.
- Objectif long terme : la croissance du catalogue, du monde vivant et des contenus ne doit plus faire grossir mécaniquement le précache cœur.

### État de preuve

- **TERMINÉ** : architecture cache structurelle intégrée ; croissance logique partagée loup/dragon intégrée.
- **EN COURS** : croissance visuelle réelle des personnages et enrichissement progressif du monde vivant.
- **PREUVE MANQUANTE** : validation PWA/offline HTTPS réelle, appareils physiques et autres preuves externes déjà listées.

Cette section doit rester une référence de reprise et ne doit pas être rétrogradée par une ancienne conversation ou une ancienne estimation.

## Priorité produit — MODARYX Site First jusqu'à VF ultra haut de gamme — 19 septembre 2026

Décision utilisateur : **terminer MODARYX en priorité avant de reprendre la finition finale des deux OS**.

Cette priorité n'autorise aucun faux 100 %. La VF ne sera déclarée qu'après fermeture réelle des preuves nécessaires.

### Lot « même équipe, produits distincts »

Objectif : permettre aux visiteurs de comprendre que MODARYX MODS et Nova Forge OS sont créés par la même équipe sans fusionner leurs identités.

Implémentation isolée sur `chatgpt/modaryx-site-first-vf-20260919`, base fraîche `3cfb2e1e3e76a3b13a957a79c38663384adb7f93`.

- `assets/shell.js` ajoute une signature discrète dans le footer commun : MODARYX MODS et Nova Forge OS sont deux produits distincts créés par la même équipe ;
- `ecosystem.html` contient désormais une section statique « Même équipe · produits distincts » ;
- aucune marque groupe/studio inventée ;
- aucun lien Nova Forge OS public inventé ;
- séparation officielle préservée : MODARYX = web, Nova Forge = logiciel/OS.

Micro-preuve : **PASS CIBLÉ** sur le périmètre source.

- syntaxe shell valide ;
- copie « même équipe / produits distincts » présente ;
- section Écosystème présente ;
- style footer présent ;
- empreintes publiques réconciliées ;
- les 17 pages publiques avaient déjà été vérifiées avec le shell, la feuille foundations et un footer sur la base ; ce lot n'en retire aucun.

### Budget après ce lot

- noyau avant : **111076 octets** ;
- delta shell + foundations : **+746 octets** ;
- noyau dérivé : **111822 octets** ;
- marge sous 800000 : **688178 octets**.

### Ordre de travail courant

1. intégrer ce lot si Git reste aligné ;
2. vérifier le HEAD intégré et les statuts de contrôle ;
3. reprendre l'accueil / monde vivant avec preuve ciblée ;
4. poursuivre la finition Premium HD des 17 pages ;
5. fermer les fonctionnalités locales ;
6. traiter les dépendances externes sans les simuler ;
7. fermer les preuves navigateur/accessibilité/appareils ;
8. seulement ensuite déclarer la VF.

Plan détaillé : `qa/MODARYX-SITE-FIRST-VF-PLAN-20260919.md`.

## Intégrations Site First et preuve source — 19 septembre 2026

### PR #21 — relation d'équipe + priorité Site First

- **TERMINÉE — fusionnée** ;
- commit d'intégration : `4e8a2f30d230fad0f5dca156f56361caecd6b564` ;
- même équipe rendue visible sans fusion des marques ;
- plan Site First ajouté ;
- noyau dérivé après lot : **111822 octets**, marge **688178**.

### PR #22 — preuve source ciblée

- **TERMINÉE — fusionnée** ;
- commit d'intégration : `442477b69fdcb4c8f8aa38eb9bc03e80d20129b6` ;
- script : `qa/check-site-first-vf.mjs` ;
- workflow lecture seule : `.github/workflows/modaryx-vf-targeted-source-proof.yml` ;
- aucun secret, aucun déploiement, aucun changement Cloudflare/DNS.

Preuve fraîche :

- workflow **MODARYX Site First Targeted Source Proof** ;
- run **35461493088** ;
- conclusion : **success / PASS CIBLÉ** ;
- portée : 17 pages, références locales, identité produit, monde vivant, service worker, budget précache, empreintes SHA-256.

CodeQL du même HEAD est encore **EN COURS** au moment de cette entrée ; aucun PASS CodeQL n'est anticipé.

### Limite

Le PASS source n'est pas un PASS VF. Les portes navigateur, accessibilité native, appareils physiques, CWV et croissance visuelle réelle restent ouvertes.

### Mise à jour CodeQL du même HEAD

Le workflow CodeQL du HEAD `442477b69fdcb4c8f8aa38eb9bc03e80d20129b6` est maintenant **TERMINÉ — success** (run `35461496530`).

Cette réussite ferme uniquement le contrôle CodeQL de ce HEAD ; elle ne change pas l'état des preuves navigateur, accessibilité, appareils, CWV ou VF.

## Correction ciblée — phase du monde partagée en UTC — 19 septembre 2026

Erreur exacte isolée : `data/living-world.json` déclarait `clock.model: shared-world-utc`, mais `assets/living-world.js` calculait encore la phase avec `Date.getHours()`. Deux visiteurs situés dans des fuseaux différents pouvaient donc voir des phases différentes au même instant, contradiction avec la chronologie partagée.

Correction isolée sur `chatgpt/modaryx-shared-utc-clock-fix-20260919`, base fraîche `b2c21c6f7620b887356bef2e2dfdbdadf15f4263` :

- `worldHourFor()` utilise `getUTCHours()` pour le modèle `shared-world-utc` ;
- fallback local conservé uniquement pour un futur modèle non partagé ;
- le contrôle Site First exige désormais explicitement le chemin UTC ;
- empreinte `assets/living-world.js` réconciliée ;
- workflow Site First étendu aux pull requests vers la branche Work pour obtenir les micro-preuves avant intégration.

Impact :

- moteur monde vivant : **5152 octets** ;
- runtime monde vivant total : **11232 octets** ;
- noyau install-précaché : inchangé à **111822 octets** ;
- `main` et infrastructure critique : inchangées.

État avant intégration : **EN COURS — micro-preuve CI à obtenir sur la PR**.

## Intégration contrôlée — horloge monde vivant partagée — 19 septembre 2026

Après correction ciblée et micro-preuve CI :

- PR #24 : **TERMINÉE — fusionnée** ;
- commit d'intégration : `f5fcbccece6b5b53a3d1028c65d8bfbb8b496b1e` ;
- workflow **MODARYX Site First Targeted Source Proof** sur la PR #24 : run `35461824549`, conclusion **success / PASS CIBLÉ** ;
- la phase du monde respecte désormais réellement `shared-world-utc` via `getUTCHours()` ;
- deux visiteurs voient la même phase du monde au même instant, indépendamment de leur fuseau local ;
- runtime monde vivant : **11232 octets** ;
- noyau install-précaché : **111822 octets** ;
- `main` et infrastructure critique : inchangées ;
- CodeQL du nouveau HEAD est **EN COURS** au moment de cette entrée.

Cette intégration ne ferme pas la croissance visuelle individuelle, la preuve navigateur réelle ni les portes externes de VF.

## Finition ciblée — interactions Premium HD des pages secondaires — 19 septembre 2026

Lot isolé sur `chatgpt/modaryx-premium-interaction-polish-20260919`, base fraîche `9b7ae6258d165db8b67df7f0dfa47ce6d735c710`.

Améliorations :

- section-nav sticky alignée sur la hauteur réelle du header ;
- hover premium réservé aux pointeurs précis ;
- état `:focus-within` pour navigation clavier ;
- compatibilité Safari renforcée pour blur et masque ;
- scroll horizontal mobile des section-nav stabilisé ;
- contrôle Site First renforcé : les 16 pages secondaires doivent charger le système cinématique partagé ;
- empreinte `modaryx-cinematic-system.css` réconciliée.

Impact runtime : **+544 octets**, aucun changement du noyau précaché (**111822 octets**).

État avant intégration : **EN COURS — PR et micro-preuve CI requises**.

## Intégration contrôlée — finition Premium HD des interactions secondaires — 19 septembre 2026

PR #25 : **TERMINÉE — fusionnée**.

Avant intégration, le premier run ciblé `35462006075` a échoué avec l'erreur exacte :

- `SHA256SUMS: mismatch assets/modaryx-cinematic-system.css` ;
- cause isolée : une seconde entrée historique sans préfixe `./` pointait vers le même fichier avec l'ancienne empreinte.

Procédure respectée :

1. erreur exacte isolée ;
2. aucun full run relancé ;
3. suppression ciblée de l'entrée dupliquée obsolète ;
4. garde ajouté pour interdire désormais les chemins SHA-256 dupliqués après normalisation ;
5. micro-preuve ciblée relancée uniquement après correction.

Micro-preuve :

- run `35462055949` : **success / PASS CIBLÉ**.

Intégration :

- commit de merge : `31ed87567b31d1c8d935b7f89a884ccae30e0df4` ;
- sticky section-nav suit la hauteur mesurée du header ;
- hover de carte réservé aux périphériques hover + pointeur précis ;
- focus-within clavier ajouté ;
- fallbacks Safari blur/mask ajoutés ;
- scroll horizontal mobile stabilisé ;
- 16 pages secondaires couvertes par le système cinématique commun ;
- empreinte CSS réconciliée et doublon SHA supprimé ;
- impact : **+544 octets runtime**, noyau install-précaché inchangé à **111822 octets** ;
- `main` et infrastructure critique : inchangées ;
- CodeQL du nouveau HEAD est **EN COURS / queued** au moment de cette entrée.

Ce lot améliore la cohérence et la robustesse Premium HD mais ne vaut pas validation visuelle finale navigateur/appareil.

## Intégration contrôlée — garde-fous structurels accessibilité — 19 septembre 2026

PR #26 : **TERMINÉE — fusionnée**.

Premier run ciblé `35462211868` : **FAIL ciblé**.

Erreur exacte :

- huit contrôles du catalogue étaient signalés « sans label explicite ».

Isolation :

- les huit contrôles étaient en réalité correctement imbriqués dans des éléments `<label>` ;
- le défaut appartenait donc au nouveau vérificateur source, pas au produit.

Correction ciblée :

- le contrôle reconnaît désormais les deux formes valides : `label[for]` et contrôle imbriqué dans `<label>` ;
- aucun HTML produit modifié pour masquer le problème de preuve.

Micro-preuve après correction :

- run `35462254451` : **success / PASS CIBLÉ**.

Intégration :

- commit de merge : `a6b5e86c5f2c22a7d7614707044e9fd7ef83bd30` ;
- le contrôle Site First vérifie maintenant sur les 17 pages : un H1 unique, IDs uniques, attributs alt, noms accessibles statiques des liens/boutons, références ARIA existantes et étiquetage structurel des contrôles de formulaire ;
- cette preuve source ne remplace toujours pas NVDA/Narrator/VoiceOver ni les appareils physiques ;
- `main` et infrastructure critique : inchangées.

## Candidat ciblé — progression visible du monde vivant — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-visible-growth-status-20260919`, base fraîche `44913db21ddc5cadcd5cd9e214435fcd095a7efb`.

Ajouts :

- prochain stade visible du Louveteau et du Dragonneau avec délai calculé ;
- libellés d'activité liés aux phases partagées du monde ;
- statut du monde exposé comme `role=status` / `aria-live=polite` ;
- transition de lumière plus douce entre les phases ;
- empreintes des quatre fichiers publics modifiés réconciliées ;
- contrôle Site First renforcé pour empêcher la perte de ces hooks.

Budget candidat :

- noyau dérivé : **112068 octets** ;
- marge : **687932 octets** ;
- runtime monde vivant : **12531 octets**.

État : **EN COURS — micro-preuve CI requise avant intégration**.

La croissance physique du loup/dragon dans l'image reste **EN COURS** : ce lot rend la progression temporelle visible sans prétendre que l'illustration composite est déjà découpée en couches.

## Intégration contrôlée — jalons visibles du monde vivant — 19 septembre 2026

PR #27 : **TERMINÉE — fusionnée**.

Micro-preuve préalable :

- workflow **MODARYX Site First Targeted Source Proof** ;
- run `35462522870` ;
- conclusion : **success / PASS CIBLÉ** sur le HEAD candidat `c5c2aa354fa0e13b454131be436f2998728cf939`.

Intégration :

- commit de merge : `7ee4f3e54ab0c1d890babe9a2344d7177360df15` ;
- prochain stade et délai visibles pour Louveteau et Dragonneau ;
- libellés d'activité de phase partagés ;
- statut du monde en `role=status` / `aria-live=polite` ;
- transition lumineuse de phase adoucie ;
- empreintes publiques réconciliées ;
- noyau install-précaché dérivé : **112068 octets** ;
- marge sous 800000 : **687932 octets** ;
- runtime monde vivant : **12531 octets** ;
- `main` et infrastructure critique : inchangées.

État :

- **TERMINÉ** — progression temporelle lisible publiquement ;
- **EN COURS** — transformation physique du loup et du dragon, qui nécessite toujours la séparation de l'illustration composite en couches ;
- **PREUVE MANQUANTE** — recette navigateur réelle de cette nouvelle présentation et portes externes déjà listées.

Aucun PASS CodeQL n'est attribué au nouveau HEAD tant qu'un run correspondant n'est pas observé.

## Candidat ciblé — fondations reflow et contraste — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-reflow-contrast-foundations-20260919`, base fraîche `a545e6a3dc2f97c0e2e16d0d0f5b411e97159542`.

Objectif : avancer la recette Premium HD des 17 pages sans prétendre fermer les preuves natives.

Ajouts source :

- garde globale contre le débordement horizontal ;
- médias et contenus longs repliables ;
- boutons/liens/badges/nav/footer compatibles avec lignes multiples ;
- garde dédiée petits écrans ≤400px ;
- règles `forced-colors` ;
- règles `prefers-reduced-transparency` ;
- contrôle Site First renforcé pour empêcher leur régression ;
- empreinte foundations réconciliée.

Budget candidat dérivé :

- foundations : **10735 octets** ;
- noyau : **113993 octets** ;
- marge sous 800000 : **686007 octets**.

État : **EN COURS — micro-preuve CI requise avant intégration**.

Important : ce lot ne transforme pas une garde source en preuve de zoom natif 400 %, lecteur d'écran, Windows High Contrast ou appareil physique.

## Intégration contrôlée — fondations reflow + contraste — 19 septembre 2026

PR #28 : **TERMINÉE — fusionnée**.

Micro-preuve préalable :

- workflow **MODARYX Site First Targeted Source Proof** ;
- run `35463076727` ;
- conclusion : **success / PASS CIBLÉ**.

Intégration :

- commit de merge : `949210c61cb0e37874438eba49152763e6bc8c64` ;
- garde globale contre le débordement horizontal ;
- médias fluides ;
- contenus longs, boutons, liens, badges, navigation et footer autorisés à revenir à la ligne ;
- garde spécifique ≤400px ;
- règles `forced-colors` ;
- règles `prefers-reduced-transparency` ;
- empreinte foundations réconciliée ;
- noyau dérivé : **113993 octets** ;
- marge sous 800000 : **686007 octets** ;
- `main` et infrastructure critique : inchangées.

État de preuve :

- **TERMINÉ** — garde-fous source reflow/contraste ;
- **PREUVE MANQUANTE** — zoom natif 400 %, Windows High Contrast, lecteur d'écran et appareils physiques ;
- aucun faux PASS natif n'est attribué à ce lot.

## Candidat ciblé — métadonnées canonical + Open Graph — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-seo-metadata-finishline-20260919`, base fraîche `2fae96d80a736a5eab4322295a7e2b2a53892bb1`.

Le lot harmonise les pages indexables secondaires avec l'accueil :

- canonical explicite sur les routes publiques sans extension, cohérent avec le sitemap existant ;
- `og:type=website` ;
- `og:locale=fr_FR` ;
- `og:site_name=MODARYX MODS` ;
- titre et description Open Graph dérivés du titre/description propres à chaque page ;
- `og:url` aligné sur le canonical ;
- la 404 conserve `noindex` et ne reçoit pas de canonical artificiel ;
- empreintes des pages modifiées réconciliées ;
- contrôle Site First renforcé contre métadonnées manquantes/dupliquées.

Aucun fichier du noyau précaché n'est modifié : noyau **113993 octets**, marge **686007 octets**.

État : **EN COURS — micro-preuve CI requise avant intégration**.

## Intégration contrôlée — canonical + Open Graph — 19 septembre 2026

PR #29 : **TERMINÉE — fusionnée**.

Micro-preuve préalable :

- workflow **MODARYX Site First Targeted Source Proof** ;
- run `35463339884` ;
- conclusion : **success / PASS CIBLÉ**.

Intégration :

- commit de merge : `7bb0963091fe52fd98bf141734eaa584faee8335` ;
- canonical explicite harmonisé sur les routes publiques des pages indexables ;
- Open Graph harmonisé : type, locale, site_name, title, description, url ;
- `og:url` aligné sur le canonical ;
- 404 conservée en `noindex` sans canonical artificiel ;
- empreintes des pages modifiées réconciliées ;
- contrôle Site First renforcé contre métadonnées manquantes/dupliquées ;
- noyau install-précaché inchangé à **113993 octets** ;
- marge sous 800000 : **686007 octets** ;
- `main` et infrastructure critique : inchangées.

État : **TERMINÉ** sur la cohérence source des métadonnées ; validation de rendu des cartes sociales externes non revendiquée.

## Candidat ciblé — micro-preuve navigateur reflow — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-browser-reflow-microproof-20260919`, base fraîche `b555d337f983518effa6a2c8e77a4380f8493fef`.

Ajouts QA uniquement :

- `qa/check-browser-reflow.mjs` ;
- `.github/workflows/modaryx-browser-reflow-microproof.yml` ;
- `qa/MODARYX-BROWSER-REFLOW-MICROPROOF-20260919.md`.

Le contrôle vise 17 pages × 4 largeurs (320/400/768/1440), soit 68 navigations Chromium headless, et vérifie reflow, H1/main/footer, exceptions runtime, menu mobile et reduced motion.

Aucun fichier produit n'est modifié par ce lot.

État : **EN COURS — micro-preuve CI à exécuter sur la PR**.

Cette preuve ne remplace pas zoom natif 400 %, Firefox/Safari, lecteur d'écran, appareil physique, PWA offline ou CWV.

## Intégration contrôlée — micro-preuve Chromium reflow — 19 septembre 2026

PR #30 : **TERMINÉE — fusionnée**.

Premier run ciblé `35463522362` : **FAIL ciblé**.

Erreur exacte :

- trois fiches projet débordaient horizontalement de **33 px à 320 px** ;
- toutes les autres pages/largeurs contrôlées étaient sans overflow.

Isolation :

- `.project-grid:not(.project-directory)` imposait la grille desktop ;
- la règle mobile utilisait seulement `.project-grid` ;
- la spécificité supérieure de la règle desktop empêchait l'écrasement à 320 px.

Correction ciblée :

- règle mobile alignée sur `.project-grid:not(.project-directory)` ;
- grille projet forcée à une seule colonne sous 820 px ;
- delta CSS : **+24 octets runtime** ;
- aucun full replay lancé.

Micro-preuves après correction :

- navigateur Chromium : run `35463591149` — **success / PASS CIBLÉ** ;
- source Site First : run `35463591245` — **success / PASS CIBLÉ** ;
- navigateur : **68 navigations** sur 17 pages aux largeurs 320/400/768/1440 ;
- 0 overflow horizontal >1 px ;
- H1/main/footer présents ;
- menus mobiles contrôlés aux largeurs étroites ;
- aucune exception JS détectée ;
- reduced motion émulé : panorama principal sans animation.

Intégration :

- commit de merge : `1fd480d721ab3f5780be881da33b24c3da0a10f5` ;
- aucun changement de `main`, DNS, Cloudflare critique ou autre infrastructure.

Limites conservées : **PREUVE MANQUANTE** pour zoom natif 400 %, lecteur d'écran, Firefox/Safari, appareils physiques, PWA offline réelle et CWV.

## Candidat ciblé — preuve navigateur des fonctions locales — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-local-functional-browser-proof-20260919`, base fraîche `f0646934d148f88c0cf5108fb65e8cda48645d58`.

Ajouts QA uniquement :

- `qa/check-local-functional-browser.mjs` ;
- `.github/workflows/modaryx-local-functional-browser-proof.yml` ;
- `qa/MODARYX-LOCAL-FUNCTIONAL-BROWSER-PROOF-20260919.md`.

Périmètre :

- catalogue : filtre + favori local + persistance ;
- recherche locale ;
- collection et contribution Communauté avec persistance ;
- brouillon Creator Studio V2 avec distribution verrouillée ;
- validation des fragments SHA-256 du Vérificateur.

État : **EN COURS — micro-preuve CI requise avant intégration**.

Limites : aucun backend simulé ; import/export par vrai fichier utilisateur reste **PREUVE MANQUANTE**.

## Intégration contrôlée — fonctions locales Chromium — 19 septembre 2026

PR #31 : **TERMINÉE — fusionnée**.

Premier run ciblé `35463958957` : **FAIL ciblé**.

Erreur exacte :

- `verify-fragment-validation: timeout waiting for Page.loadEventFired`.

Isolation :

- le second changement de SHA-256 ne rechargeait pas la page : il s'agissait d'une navigation même-document par fragment ;
- Catalogue, Recherche, Communauté et Creator Studio étaient déjà **PASS CIBLÉ** ;
- aucun défaut produit n'a été attribué à cette erreur de harnais.

Correction ciblée :

- test du Vérificateur via changement réel de `location.hash` et gestionnaire `hashchange` existant ;
- aucun fichier produit modifié ;
- aucun full replay.

Micro-preuve après correction :

- run `35464005629` — **success / PASS CIBLÉ**.

Fonctions observées :

- Catalogue : filtre + favori local + persistance ;
- Recherche : index local ;
- Communauté : collection locale + avis local + restauration ;
- Creator Studio : brouillon V2 + restauration, distribution toujours verrouillée ;
- Vérificateur : fragment SHA-256 invalide puis valide.

Intégration :

- merge `033e3227fe9b776c4ca58c022dcceec2dbcc3c2a` ;
- `main`, backend et infrastructure critique inchangés.

Reste **PREUVE MANQUANTE** : vrai parcours import/export avec fichiers utilisateur, sélecteur natif, lecture SHA-256 d'un vrai fichier et portes externes VF.

## Candidat ciblé — fichiers réels import/export — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-real-file-browser-proof-20260919`, base fraîche `c57fe107a63fcfd7d35bb534415d8e4b6f6490d9`.

Ajouts QA uniquement :

- `qa/check-real-file-browser.mjs` ;
- `.github/workflows/modaryx-real-file-browser-proof.yml` ;
- `qa/MODARYX-REAL-FILE-BROWSER-PROOF-20260919.md`.

Périmètre :

- Vérificateur : vrai fichier + SHA-256 ;
- Communauté : collection exportée/importée en vrai JSON ;
- Communauté : contribution exportée/importée en vrai JSON ;
- Creator Studio : manifeste exporté/importé en vrai JSON.

Le navigateur écrit et relit des fichiers réels du runner. Le dialogue graphique natif du sélecteur de fichier n'est pas piloté et reste une preuve distincte.

État : **EN COURS — micro-preuve CI requise avant intégration**.

## Intégration contrôlée — fichiers réels Chromium — 19 septembre 2026

PR #32 : **TERMINÉE — fusionnée**.

Micro-preuve :

- workflow **MODARYX Real File Browser Proof** ;
- run `35464233996` ;
- conclusion : **success / PASS CIBLÉ**.

Preuves obtenues :

- Vérificateur : vrai fichier + SHA-256 exact ;
- Communauté : collection JSON exportée, lue, puis réimportée ;
- Communauté : avis JSON exporté, lu, puis réimporté ;
- Creator Studio : manifeste JSON exporté, lu, puis réimporté ;
- distribution Studio restée `locked`, `downloadable=false`, `releaseReceipt=null`.

Intégration :

- merge `b2674dbc9cbfe6dc84fbd550bf5754e64c7e4640` ;
- aucun fichier produit modifié par ce lot QA ;
- `main`, backend et infrastructure critique inchangés.

État :

- **TERMINÉ** — lecture/écriture de vrais fichiers via les fonctions web en Chromium ;
- **PREUVE MANQUANTE** — dialogue graphique natif du sélecteur de fichier OS.

## Candidat ciblé — PWA offline Chromium — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-pwa-offline-browser-proof-20260919`, base fraîche `9b2e5da59ec5ef8d53f7f125a9207f4cac59d52b`.

Ajouts QA uniquement :

- `qa/check-pwa-offline-browser.mjs` ;
- `.github/workflows/modaryx-pwa-offline-browser-proof.yml` ;
- `qa/MODARYX-PWA-OFFLINE-BROWSER-PROOF-20260919.md`.

Le contrôle vise un vrai service worker Chromium sur loopback, des caches navigateur réels et la transition online → offline → online.

État : **EN COURS — micro-preuve CI requise avant intégration**.

Même en cas de PASS, la preview HTTPS publique et la mise à jour A→B resteront des preuves séparées.

## Intégration contrôlée — PWA offline Chromium — 19 septembre 2026

PR #33 : **TERMINÉE — fusionnée**.

La mise au point a suivi la procédure erreur exacte → isolation → correction ciblée → micro-preuve, sans full replay.

Écarts de harnais isolés successivement :

- attente trop précoce de l'activation SW ;
- émulation réseau CDP page insuffisante pour garantir la panne du fetch SW ;
- processus serveur redémarré non terminé ;
- assertion textuelle Catalogue incorrecte ;
- port DevTools fixe susceptible de collision.

Aucun de ces points n'a nécessité une modification produit.

Micro-preuve finale :

- run `35464732269` — **success / PASS CIBLÉ** ;
- service worker activé et contrôlant ;
- cache initial **17 entrées** ;
- cache runtime observé après visites ;
- vraie panne réseau par arrêt du serveur ;
- Catalogue + alias avec paramètres disponibles offline ;
- accueil précaché disponible offline ;
- `data/catalog.json` offline avec `X-Modaryx-Cache: offline-stale` ;
- retour online réussi et donnée de nouveau fraîche.

Intégration :

- merge `bc7876a1ed56cbe560e95b7383cc583fb2bef854` ;
- aucun changement produit dans ce lot QA ;
- `main`, Cloudflare/DNS et infrastructure critique inchangés.

État :

- **TERMINÉ** — comportement PWA offline/recovery ciblé en Chromium loopback ;
- **PREUVE MANQUANTE** — preview publique HTTPS, update A→B, appareils physiques, autres navigateurs, quota réel et CWV.

## Candidat ciblé — mise à jour PWA A → B — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-pwa-update-proof-20260919`, base fraîche `bd9c5fa9f7267070a853f7b7b7f799721a6ecd25`.

Ajouts QA uniquement :

- `qa/check-pwa-update-browser.mjs` ;
- `.github/workflows/modaryx-pwa-update-browser-proof.yml` ;
- `qa/MODARYX-PWA-UPDATE-BROWSER-PROOF-20260919.md`.

Le harnais copie le candidat dans un dossier temporaire, installe l'étape A, transforme uniquement la copie temporaire en étape B, déclenche `registration.update()`, exige l'activation du nouveau cache et la suppression de l'ancien, puis arrête réellement le serveur et exige que la version B soit disponible hors ligne.

État : **EN COURS — micro-preuve CI requise avant intégration**.

Aucun fichier produit, `main`, DNS ou Cloudflare critique n'est modifié par ce lot.

## Intégration contrôlée — mise à jour PWA A → B — 19 septembre 2026

PR #34 : **TERMINÉE — fusionnée**.

Procédure d'erreur respectée sans full replay :

- run `35465374096` : FAIL syntaxe du harnais → correction ciblée ;
- run `35465415608` : FAIL initialisation DevTools avant observation produit → port Chrome auto-assigné via `DevToolsActivePort` ;
- run `35465473185` : **success / PASS CIBLÉ**.

Résultat :

- Stage A installée avec cache v120 ;
- update explicite vers Stage B ;
- nouveau cache activé ;
- ancien cache nettoyé ;
- serveur réellement arrêté ;
- version B disponible offline.

Merge : `6871d3a52ea1ad7dd6e6d8979f146cb7f95bec2c`.

État :

- **TERMINÉ** — mécanique A→B ciblée en Chromium loopback ;
- **PREUVE MANQUANTE** — update sur preview HTTPS publique et appareil physique ;
- aucun fichier produit, `main`, DNS ou Cloudflare critique modifié par ce lot.

## Candidat ciblé — micro-preuve accessibilité Chromium — 19 septembre 2026

Branche isolée : `chatgpt/modaryx-browser-a11y-microproof-20260919`, base fraîche `9283afd4aecf78a4ac5ef53291d980185e37ab5c`.

Ajouts QA uniquement :

- `qa/check-browser-a11y.mjs` ;
- `.github/workflows/modaryx-browser-a11y-microproof.yml`.

Le contrôle ouvre les 17 pages publiques dans Chromium headless et vérifie : un H1 unique, `#main`, skip-link vers `#main`, IDs dupliqués, images sans `alt`, contrôles de formulaire sans label explicite, contrôles interactifs sans nom dans l'arbre d'accessibilité Chromium, premier focus clavier sur le skip-link et activation clavier vers `#main`.

État : **EN COURS — micro-preuve CI requise avant intégration**.

Cette preuve ne remplace pas un lecteur d'écran natif ni une validation humaine complète.

## Intégration contrôlée — accessibilité Chromium — 19 septembre 2026

PR #35 : **TERMINÉE — fusionnée**.

Premier run `35465633037` : **FAIL ciblé du harnais**.

Erreur exacte :

- le contrôle source considérait à tort comme non labellisés les champs inclus directement dans un `<label>` ;
- l'arbre d'accessibilité Chromium indiquait pourtant déjà **0 contrôle interactif sans nom accessible**.

Isolation :

- champs Catalogue : labels englobants valides ;
- cases Communauté générées : labels englobants valides ;
- aucun défaut produit démontré.

Correction ciblée :

- le harnais accepte désormais `el.closest('label')` ;
- aucun fichier produit modifié ;
- aucun full replay.

Micro-preuve finale :

- run `35465685575` — **success / PASS CIBLÉ** ;
- 17 pages contrôlées ;
- H1 unique, main, skip-link, IDs, alt, labels, arbre AX et premier parcours clavier contrôlés ;
- 0 contrôle interactif sans nom accessible détecté.

Merge : `6966eb52a4fe1bc6a5deea5c75a4f3df4395805e`.

État :

- **TERMINÉ** — micro-preuve accessibilité structurelle/browser Chromium ;
- **PREUVE MANQUANTE** — lecteur d'écran natif et validation humaine complète ;
- aucun changement produit, `main`, DNS ou Cloudflare critique.

