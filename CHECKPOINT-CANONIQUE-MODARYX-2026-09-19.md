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

