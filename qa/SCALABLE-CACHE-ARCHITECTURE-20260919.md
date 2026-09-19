# MODARYX — architecture de cache évolutive — 19 septembre 2026

Statut : **EN COURS — micro-preuve ciblée acquise, validation navigateur HTTPS/offline réelle encore requise**.

## Source de départ

- PR active : #12
- Branche Work observée au moment de l'isolation : `design/modaryx-premium-hd-20260914-work`
- HEAD Work observé : `f649f823856228ee51848f64d2e71299dfc307ef`
- Branche isolée de continuation : `chatgpt/modaryx-scalable-cache-20260919`
- Aucun changement de `main`, DNS, DNSSEC, nameserver, IONOS ou configuration Cloudflare critique.

## Problème isolé

Le service worker précachait jusque-là toutes les pages publiques, les schémas, les données, la majorité des CSS/JS et les deux grandes illustrations. Le budget de 800000 octets était donc presque saturé.

Le rapport Work mentionnait une projection de 795371/800000 après le lot artistique. Une mesure fraîche fondée sur l'arbre Git exact du HEAD `f649f82` et la liste unique effectivement installée par le service worker donne **794167 octets** pour **76 fichiers uniques**, soit **5833 octets de marge**. Cette mesure fraîche remplace la projection uniquement pour l'analyse de ce lot ; elle ne constitue pas une mesure réseau/CWV.

Répartition de l'ancien précache :

| Catégorie | Octets |
| --- | ---: |
| HTML | 154780 |
| CSS | 104491 |
| JavaScript | 113335 |
| Images / icônes | 374178 |
| JSON / schémas | 44816 |
| Autres | 2567 |
| **Total** | **794167** |

Les deux WebP majeurs représentaient à eux seuls 367522 octets et étaient téléchargés pendant l'installation du service worker, même lorsque leur chargement documentaire était différé.

## Architecture proposée et implémentée dans la branche isolée

### Précache cœur

Le lot remplace le précache monolithique par un noyau d'installation limité à :

- accueil + 404 ;
- manifeste et identité minimale ;
- CSS réellement nécessaires à l'accueil ;
- scripts communs nécessaires à l'accueil et au shell.

Les grandes illustrations ne sont plus install-précachées.

Mesure déterministe du nouveau noyau sur les blobs Git du HEAD de départ :

| Catégorie | Octets |
| --- | ---: |
| HTML | 22499 |
| CSS | 57121 |
| JavaScript | 23088 |
| Images / icônes | 5205 |
| Manifeste | 2544 |
| **Total unique** | **110457** |

Le seuil de projet reste **800000 octets**. Il n'est ni supprimé ni augmenté.

Nouvelle marge statique projetée : **689543 octets**.

Réduction du précache d'installation : **683710 octets**, soit environ **86,1 %** par rapport à la mesure fraîche de départ.

### Runtime cache contrôlé

- Les pages publiques connues restent `network-first` et sont mises en cache après consultation.
- Les métadonnées publiques sensibles à la fraîcheur restent `network-first` avec `cache: no-store`.
- Les CSS/JS publics sous `assets/` sont révalidés au réseau et disposent d'un fallback de cache.
- Les images, icônes et autres assets statiques publics sous `assets/` et `schemas/` sont mis en cache après première utilisation.
- Les paramètres de requête des assets statiques sont normalisés vers la même clé de chemin pour éviter une inflation artificielle des entrées.
- Un nouvel asset public sous `assets/` peut donc être mis en cache à l'usage sans devoir être ajouté au précache global.
- Les chemins arbitraires hors des préfixes publics autorisés ne sont pas interceptés.

### Croissance bornée

Le cache runtime est limité à **80 entrées non cœur**. Le noyau précaché est protégé de l'éviction. Les entrées runtime sont rafraîchies dans l'ordre d'insertion lorsqu'elles sont réécrites.

Cette limite est un garde-fou de nombre d'entrées, pas une preuve de quota navigateur ou de taille réseau. Une validation réelle de quota/éviction dans un navigateur reste nécessaire avant toute déclaration finale.

### Nettoyage

L'activation ne supprime que :

- les anciens caches `nova-site-shell-*` historiques appartenant à ce site ;
- les anciennes versions `modaryx-site-*`.

Les caches étrangers à MODARYX ne sont pas supprimés.

## Micro-preuve ciblée

Un contrôle Node isolé a été exécuté sur la logique candidate :

- syntaxe de `sw.js` : PASS ;
- noyau d'installation : 17 clés de requête, 16 fichiers locaux uniques ;
- grandes illustrations absentes du précache d'installation : PASS ;
- mise en cache runtime d'un futur asset public sous `assets/` sans ajout à une allowlist fichier par fichier : PASS ;
- normalisation des variantes de query string : PASS ;
- page publique visitée disponible comme fallback hors ligne simulé : PASS ;
- métadonnées toujours network-first/no-store : PASS ;
- chemin privé arbitraire non intercepté : PASS ;
- stress 100 assets runtime avec plafond final de 80 entrées : PASS ;
- noyau non évincé : PASS ;
- nettoyage limité aux caches MODARYX/legacy du site : PASS.

Script ajouté : `qa/check-scalable-cache.mjs`.

Cette preuve est une **micro-preuve de sémantique source**. Elle ne remplace pas :

- installation/activation réelle HTTPS ;
- bascule online → offline → online ;
- mise à jour réelle du service worker ;
- cache froid/chaud ;
- quotas navigateur ;
- Core Web Vitals ;
- appareils physiques.

## Décision sur le seuil 800000

Aucune augmentation du seuil n'est justifiée à ce stade.

Avec un noyau d'environ 110457 octets, le seuil historique redevient un garde-fou très large au lieu d'une barrière quasi saturée. Toute future réévaluation devra être documentée et mesurée, pas utilisée pour masquer une architecture trop lourde.

## Prochaine preuve

1. Exécuter `node qa/check-scalable-cache.mjs` dans un checkout complet de la branche.
2. Exécuter les contrôles source existants compatibles sans inventer `site-baseline`.
3. Déployer uniquement sur preview de branche si l'intégration est décidée.
4. Vérifier installation, mise à jour, navigation visitée hors ligne, reprise réseau et non-régression visuelle dans un navigateur réel.
5. Ne déclarer aucun PASS natif pour les points non observés.

## Raffinement ciblé — fraîcheur des assets runtime

Une inspection après la première intégration a isolé un risque : les images/schémas runtime utilisaient `cache-first`. Or MODARYX remplace parfois un asset au **même chemin**. Sans changement de version du cache, une ancienne copie pouvait donc rester servie trop longtemps.

Correction ciblée :

- CSS/JS : restent `network-first` avec révalidation explicite ;
- images, icônes, fontes et schémas publics runtime : passent à `network-first` avec fallback cache ;
- les données fraîches explicites restent `network-first` + `cache: no-store` ;
- aucune ressource lourde n'est réintroduite dans le précache d'installation.

Micro-preuve exécutée sur le contenu exact des blobs GitHub candidats :

- `node --check sw.js` : PASS CIBLÉ ;
- premier chargement d'un futur asset : réseau + cache ;
- deuxième chargement en ligne avec contenu serveur modifié : la nouvelle version est servie puis remplace la copie runtime ;
- chargement hors ligne ensuite : fallback sur la **dernière** copie mise en cache ;
- plafond runtime 80 et protection du noyau toujours verts ;
- empreinte `sw.js` candidate : `f27348c7b3a038cccf65eb6b5089f6d3ce07239d43accd9d70c8a5fc46c14697` ;
- `SHA256SUMS.txt` réconcilié dans le même lot.

Cette preuve reste simulée/source. Le navigateur HTTPS réel demeure PREUVE MANQUANTE.

