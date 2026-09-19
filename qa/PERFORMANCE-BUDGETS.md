# MODARYX — budgets et limites de la preuve

## État courant — 16 septembre 2026

Les budgets statiques sont désormais bloquants dans `node qa/check-cache.mjs`, via `performance-limits.mjs` : précache unique ≤ 800000 octets, CSS directement déclarées ≤ 70000/page, JS directement déclaré ≤ 30000/page. Un poids manquant/invalide ou un inventaire vide échoue aussi. `node qa/check-performance-limits.mjs` vérifie dix limites et cas invalides avec données synthétiques. Aucun workflow de déploiement n’a été modifié : cette porte s’applique lorsque le script est exécuté, elle n’est pas annoncée comme une CI obligatoire.

Source produit examinée : `4fa6532720c6f1ef9c679fac523064921281d346`. Précache 799211 octets (marge 789), CSS max 69802 (marge 198), JS max 29002 (marge 998). 34 évaluations de budget et 25 assertions cache réussies. Ces marges étroites doivent être prises en compte lors des prochaines modifications. Aucun gain CWV ou de vitesse réelle n’est déduit de ces tailles.

Les sections datées ci-dessous sont historiques ; leurs anciens seuils et états ne remplacent pas cet état courant. Les API du navigateur de recette ne permettent toujours pas une qualification CWV/hors ligne complète.

Statut du lot ciblé cache : **TERMINÉ** pour la correction source et ses 21 assertions Node. Performance navigateur et fonctionnement hors ligne HTTPS : **PREUVE MANQUANTE**. Le site final reste **EN COURS**.

Périmètre : site MODARYX uniquement. Aucun changement DNS, Cloudflare, IONOS ou OS. Le script `node qa/check-cache.mjs` régénère `qa/cache-checks.json` avec la date et le SHA-256 du service worker effectivement examiné. Ce fichier de résultats est la référence chiffrée si le candidat évolue. Les simulations ne remplacent pas une validation de production.

## Mesures initiales du candidat

| Élément | Mesure statique initiale | Interprétation |
| --- | --- | --- |
| Préchargement service worker | 69 requêtes, 68 fichiers uniques ; 381 603 octets bruts | `/` et `/index.html` désignent le même fichier local mais constituent deux clés de cache. Coût engagé dès l'installation. |
| Estimation gzip du préchargement | 120 101 octets | Compression locale niveau 9 de chaque fichier ; ne mesure ni les octets réellement transférés, ni les en-têtes, ni Brotli, ni la latence. |
| Accueil, feuilles CSS | 4 fichiers ; 38 773 octets bruts | Plusieurs feuilles bloquantes, mais aucune bibliothèque ajoutée pour cet audit. |
| Pages fonctionnelles, feuilles CSS | 7 à 8 fichiers ; maximum 65 097 octets bruts | Cascade historique + raffinements. Le regroupement doit conserver l'ordre exact et faire l'objet d'une comparaison visuelle. |
| Scripts directement déclarés | Maximum 23 573 octets bruts par page | Exclut JSON chargés ensuite et autres ressources ; ce n'est pas une mesure CPU. |
| Fichiers d'infrastructure protégés | 13 sur 13 identiques à la baseline | Comparaison binaire locale, pas audit de la configuration distante. |

Les chiffres peuvent changer pendant la consolidation. Ne pas utiliser cette photographie initiale comme contrôle du HEAD final ; relancer le script après la dernière modification.

## Anomalies de cache reproduites sur le service worker initial

| Observation | Preuve ciblée | Correction recommandée |
| --- | --- | --- |
| Nettoyage de tous les caches de l'origine | La simulation `activate` supprime `unrelated-application-cache` | Limiter le nettoyage aux noms historiques de cache appartenant à ce site. |
| URL avec paramètres non prises en charge | `/catalog.html?game=demo` non interceptée, alors que `/catalog.html` l'est | Normaliser seulement les chemins publics connus ; conserver les paramètres dans la navigation réelle et utiliser une clé de cache publique maîtrisée. |
| URL canonique sans extension non prise en charge | `/catalog` non interceptée ; les en-têtes locaux déclarent ces routes | Ajouter les alias publics explicitement connus sans élargir le cache à des chemins privés ou arbitraires. |
| Métadonnées potentiellement anciennes | `public-build.json` et `downloads.json` déjà en cache provoquent zéro requête réseau | Préférer le réseau pour les informations d'état et de téléchargement ; préciser l'ancienneté d'un résultat réutilisé hors ligne. Les empreintes seules ne prouvent ni authenticité ni actualité. |
| Écriture après réponse sans maintien de l'événement | Le parcours navigation exécute zéro `waitUntil` | Relier les écritures de cache à la durée de vie de l'événement ; gérer les échecs d'écriture sans casser une réponse réseau disponible. |

Le contrôle reste strictement limité aux méthodes GET et aux routes publiques autorisées. Préserver cette propriété lors des corrections. Un statut réseau 404 n'est actuellement pas remplacé par l'accueil : conserver cette distinction plutôt que masquer les vraies erreurs.

L'enregistrement du service worker se trouve dans `assets/app.js`. Les pages qui ne le chargent pas n'installent pas le service worker lors d'une première visite directe ; elles peuvent être contrôlées après installation depuis une autre page. Vérifier le parcours de première visite avant de promettre une disponibilité hors ligne universelle. L'URL HTTP du prévisualiseur `terminal.local` ne satisfait pas la condition d'enregistrement HTTPS/localhost et ne peut pas démontrer cette capacité.

## Budgets proposés, non présentés comme performances obtenues

| Dimension | Budget de non-régression proposé | Vérification |
| --- | --- | --- |
| CSS directement chargées par page | ≤ 70 000 octets bruts ; toute nouvelle feuille doit être justifiée | Inventaire des ressources HTML dans le script ; contrôle visuel avant regroupement |
| JS directement chargé par page | ≤ 30 000 octets bruts | Inventaire statique ; aucune dépendance lourde ajoutée sans besoin démontré |
| Ensemble préchargé unique | ≤ 500 000 octets bruts | Liste réellement passée à `cache.addAll` et fichiers existants |
| Ressources manquantes dans le préchargement | 0 | Contrôle de l'existence de chaque fichier ; puis installation réelle HTTPS |
| Fichiers d'infrastructure protégés | 0 différence non autorisée | Comparaison binaire avec baseline vérifiée |
| Effets décoratifs permanents | Aucun nouvel effet non essentiel | Revue CSS + inspection navigateur avec reduced motion |

Ces seuils sont des recommandations adaptées à la taille actuelle, pas des standards externes ni des résultats de profiling. La comparaison des données gzip sert seulement à estimer l'ordre de grandeur.

## Preuves encore nécessaires avant déclaration finale

- Installation, activation et mise à jour sur origine HTTPS de test ; vérifier la reprise après fermeture puis réouverture du navigateur.
- Navigation hors ligne sur les seize pages, liens canoniques et variantes à paramètres ; vérifier ce qui arrive avant la première installation.
- Transition en ligne → hors ligne → en ligne et fraîcheur des métadonnées, comportement des erreurs réseau et cache saturé.
- Profilage navigateur sur appareils représentatifs : chargement initial, LCP, CLS, réactivité, tâches longues, mémoire et peinture pendant les effets.
- Essais sous réseau limité et cache froid/chaud ; mesure des octets effectivement transférés. Aucun résultat de profiling n'est revendiqué dans ce rapport.

## Correction ciblée exécutée après l'audit

Le coordinateur a autorisé la modification isolée de `sw.js`, candidat v39. Le nettoyage cible maintenant exclusivement les anciens noms `nova-site-shell-*`. Les pages publiques connues disposent d'alias sans extension et avec paramètres ; la clé de cache reste le chemin HTML canonique. Les autres routes, origines, méthodes et données avec paramètres ne sont pas implicitement autorisées.

Les métadonnées publiques et catalogues utilisent le réseau avec `cache: no-store`. En cas d'échec réseau, une réponse sauvegardée porte `X-Modaryx-Cache: offline-stale`. Cette marque ne constitue pas encore un avertissement visuel : les consommateurs doivent la lire avant toute présentation de fraîcheur ou validation actualisée. Sans copie, la réponse est une erreur réseau. Les HTTP 404/500 réels restent visibles. Les lectures sont restreintes au cache courant ; les écritures sont couvertes par un `waitUntil` enregistré immédiatement et une erreur de quota ne fait pas perdre une réponse réseau disponible.

`node qa/check-cache.mjs` a exécuté 21 assertions : périmètre de purge, alias publics, clé canonique, exclusions, recours réseau des métadonnées, réponses hors ligne marquées, absence de copie, HTTP 404 et erreur de quota. `node --check sw.js` a également réussi. Aucun de ces contrôles n'est une validation native du navigateur. Le rapport JSON contient le hash exact de la source examinée.

Fichiers modifiés dans ce lot : `sw.js` et les trois fichiers `qa/` autorisés. L'installation depuis les pages sans `app.js` reste un point de parcours à vérifier ; aucun HTML ni autre JavaScript n'a été changé par cette tâche.

## Révision artistique Loup/Dragon

Les poids initiaux ci-dessus précèdent les illustrations autorisées. Le JSON `cache-checks.json` donne les poids actualisés. Le budget proposé de précache passe à 800 000 octets bruts pour ces deux WebP ; cette augmentation explicite finance la direction demandée, sans mesure CWV revendiquée. Le panorama portails est chargé paresseusement dans le document ; le précache engage néanmoins son téléchargement lors de l’installation du service worker.

## Correction de première visite — v43

L’observation historique « les pages sans app.js n’installent pas le service worker » est corrigée dans le source : l’initialisation est maintenant dans shell.js sur les seize pages. Neuf tests ciblés passent ; la preuve native de première installation HTTPS reste ouverte. `updateViaCache: none` évite le cache HTTP pour la récupération du script worker, sans modifier la stratégie de cache des contenus. Voir https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register.

## Révision v66 — écarts actuels

La stratégie CSS/JS non versionnés est désormais révalidée au réseau ; détails et limites dans `ui-cache-revalidation-20260915.md`. Le total du harnais cache est de 25 assertions simulées.

Mesures actuelles : 797672 octets de précache, sous la cible proposée de 800000. Le Catalogue charge 70725 octets de CSS : **écart ouvert de 725 octets** par rapport à la cible de 70000. Les autres pages sont sous cette cible. Aucun style n’a été supprimé arbitrairement pour atteindre un chiffre. Une consolidation des feuilles doit préserver la cascade et être comparée visuellement avant adoption.

Le navigateur de recette permet d’inspecter le rendu et le DOM ; il n’expose pas ici un profiler réseau/CPU ou une commande de mise hors ligne. Les mesures ci-dessus restent des tailles de fichiers, pas des CWV ni des temps de démarrage. Les captures d’accueil montrent l’art Loup/Dragon après chargement, sans mesure fiable de sa durée.

## Budget CSS rétabli — 15 septembre 2026

949 octets de commentaires internes déplacés depuis les deux feuilles communes vers `CSS-SOURCE-NOTES.md`. Comparaison contre 93527f4 : les deux fichiers sont exactement identiques une fois ces seuls commentaires retirés. Aucune règle, valeur ou ordre de cascade modifié. Catalogue : 69776 octets CSS ; les seize pages respectent désormais la cible de 70000. Précache : 796723 octets bruts, 518825 gzip estimés. 25 assertions cache et 76 empreintes vérifiées. Ceci ferme l’écart de taille statique, sans prouver un gain de vitesse utilisateur.

`responsive-review.html` est un outil QA séparé, sans lien dans la navigation publique, sans référencement demandé et sans ajout au précache. Il ouvre les seize pages autorisées dans un cadre de largeur réglable pour poursuivre la recette sur l’aperçu HTTPS lorsque le serveur local est inaccessible. Sa présence seule n’est pas une preuve responsive.

## Première mesure navigateur HTTPS — 15 septembre 2026

Seize navigations réelles dans Chrome, après a1437aa, enregistrées dans `https-browser-diagnostics-20260915.json`. Un contrôleur service worker activé est observé pour chaque page. La mesure Navigation Timing de load est comprise entre 255,5 et 621,6 ms dans cette session séquentielle, sans cache froid ni limitation réseau contrôlés. Ce n'est pas une mesure de complétude visuelle, de chargement des éléments lazy, de données asynchrones, ni une preuve LCP/CLS/INP. Aucune conclusion de performance finale.

Ce lot ferme la vérification du fonctionnement des diagnostics et de la présence d'un contrôleur actif sur l'aperçu HTTPS. Première installation, changement de version, navigation réellement hors ligne et reprise restent PREUVE MANQUANTE.

## Mesures du lot visuel c7d91ee

`cache-checks.json` et `finish-line/source-validation.json` : CSS max 69776 octets/page, JS directement déclaré max 26968, précache 797096 octets bruts / 518897 gzip estimés ; 70 fichiers / 71 requêtes, aucune ressource manquante, 25 assertions source réussies, aucun changement des fichiers protégés. Budgets proposés actuels 70000 / 30000 / 800000 respectés. Les captures QA ne sont pas référencées par le site ni préchargées. Ce contrôle ne ferme pas les mesures CWV, peinture, CPU/GPU, mémoire, réseau réel ou cache froid.

## Architecture évolutive isolée — 19 septembre 2026

Source de départ vérifiée : branche PR #12 `design/modaryx-premium-hd-20260914-work`, HEAD `f649f823856228ee51848f64d2e71299dfc307ef`.

Le service worker de ce HEAD installait encore un ensemble quasi global. Une mesure déterministe fraîche sur l'arbre Git et la liste unique du précache donne **794167 octets / 76 fichiers uniques**. Les deux grandes illustrations WebP représentaient **367522 octets** de cet ensemble et étaient téléchargées à l'installation.

La branche isolée `chatgpt/modaryx-scalable-cache-20260919` introduit un **précache cœur + runtime cache borné**. Le noyau statique unique est estimé à **110457 octets**, soit **689543 octets de marge** sous le seuil existant de **800000**. Le seuil n'est ni supprimé ni relevé.

Le contrôle ciblé `qa/check-scalable-cache.mjs` a été exécuté après `node --check sw.js` et passe sur la sémantique simulée : grandes illustrations hors install-précache, futur asset public mis en cache après usage, page publique visitée disponible en fallback simulé, données fraîches network-first/no-store, runtime borné à 80 entrées non cœur, noyau préservé, nettoyage limité aux caches du site.

Cette évolution **ne vaut pas encore PASS PWA natif**. Restent PREUVE MANQUANTE : installation/activation HTTPS réelle, mise à jour après nouvelle publication, online → offline → online, quota navigateur, cache froid/chaud, CWV et appareils physiques. Les anciennes mesures proches de 800000 ci-dessus restent historiques pour leurs commits respectifs et ne doivent pas être utilisées comme état courant de cette branche isolée.

## Monde vivant — impact ciblé — 19 septembre 2026

Le lot `modaryx-living-world` ne réintroduit pas de médias lourds dans l'install-précache.

Dérivation depuis le noyau mesuré à 110457 octets avant ce lot :

- `index.html` : 18431 → 19050 octets, soit **+619 octets** dans le noyau ;
- nouveau noyau dérivé : **111076 octets** ;
- marge sous 800000 : **688924 octets**.

Ressources nouvelles chargées en runtime, donc hors install-précache :

- `assets/living-world.js` : **4336 octets** ;
- `assets/living-world.css` : **3649 octets** ;
- `data/living-world.json` : **1630 octets** ;
- total runtime : **9615 octets**.

Le JSON de chronologie est classé comme donnée fraîche explicite ; les CSS/JS restent couverts par le cache runtime. Le lot ne relève pas le seuil de 800000.

### Modèle de croissance partagé — mise à jour runtime

La clarification « mêmes stades, rythme indépendant » ne modifie pas le noyau install-précaché : **111076 octets**, marge **688924 octets** sous 800000.

Les deux fichiers runtime concernés ont grandi légèrement pour déclarer et valider le modèle canonique :

- `assets/living-world.js` : **4985 octets** ;
- `assets/living-world.css` : **3649 octets** ;
- `data/living-world.json` : **2431 octets** ;
- total runtime monde vivant : **11065 octets**.

Cette hausse runtime de 1450 octets n'est pas ajoutée au précache d'installation.

## Signature d'équipe partagée — impact ciblé — 19 septembre 2026

Le lot « même équipe, produits distincts » ajoute uniquement une signature légère au shell commun et son style.

- noyau avant ce lot : **111076 octets** ;
- `assets/shell.js` : **+502 octets** ;
- `assets/modaryx-foundations.css` : **+244 octets** ;
- nouveau noyau dérivé : **111822 octets** ;
- marge sous 800000 : **688178 octets**.

La section statique ajoutée à `ecosystem.html` reste une page runtime et ne réintroduit pas un précache global.

### Horloge monde vivant réellement partagée — impact runtime

Correction ciblée : le contrat `shared-world-utc` est maintenant respecté par le moteur de phase.

- `assets/living-world.js` : **5152 octets** ;
- `assets/living-world.css` : **3649 octets** ;
- `data/living-world.json` : **2431 octets** ;
- total runtime monde vivant : **11232 octets**.

Delta par rapport au lot précédent : **+167 octets runtime**. Le noyau install-précaché reste **111822 octets** après la signature d'équipe ; aucune ressource lourde n'est réintroduite.

## Finition d'interaction secondaire — impact runtime — 19 septembre 2026

`assets/modaryx-cinematic-system.css` passe de **9672** à **10216 octets**, soit **+544 octets**.

Cette feuille reste chargée en runtime sur les pages secondaires et n'est pas ajoutée au noyau install-précaché. Le noyau reste donc **111822 octets**, marge **688178 octets** sous le garde-fou 800000.

## Monde vivant — jalons de croissance visibles — 19 septembre 2026

Le lot de visibilité de progression ajoute les prochains jalons du loup et du dragon dans le panneau du monde vivant et des libellés d'activité par phase.

- `index.html` : **19050 → 19296 octets**, soit **+246 octets** dans le noyau ;
- noyau dérivé : **112068 octets** ;
- marge sous 800000 : **687932 octets** ;
- `assets/living-world.js` : **5991 octets** ;
- `assets/living-world.css` : **3792 octets** ;
- `data/living-world.json` : **2748 octets** ;
- runtime monde vivant total : **12531 octets**.

Aucun visuel lourd n'est ajouté au précache global.

## Fondations reflow + contraste — impact candidat — 19 septembre 2026

`assets/modaryx-foundations.css` : **8810 → 10735 octets**, soit **+1925 octets**.

Cette feuille appartient au noyau install-précaché. À partir du noyau courant de 112068 octets, le noyau dérivé candidat devient **113993 octets**, soit une marge de **686007 octets** sous 800000.

La micro-preuve CI doit confirmer la mesure réelle du précache avant intégration.

## Métadonnées SEO/sociales — impact cache — 19 septembre 2026

Le lot canonical/Open Graph modifie uniquement les pages secondaires indexables. Il ne modifie ni `index.html`, ni `404.html`, ni les ressources du noyau install-précaché.

Le noyau reste donc **113993 octets**, marge **686007 octets** sous 800000. Les métadonnées supplémentaires suivent le chargement normal des pages.

## Fermeture ciblée performance laboratoire — 19 septembre 2026

Le lot performance modifie quatre fichiers du noyau par rapport à la base Work `52c2af892694e98dd1560a8a0e371cd7d2574835` :

- `index.html` : **+115 octets** ;
- `assets/modaryx-foundations.css` : **+112 octets** ;
- `assets/modaryx-home-cinematic.css` : **+115 octets** ;
- `assets/app.js` : **+642 octets**.

Delta noyau : **+984 octets**.

Noyau dérivé : **114977 octets**.  
Marge sous le garde-fou 800000 : **685023 octets**.

Le gain laboratoire provient surtout de l'ordre/priorité de chargement et de la stabilité du layout, pas d'une hausse du budget. Le gros visuel `modaryx-world-portals.webp` reste hors précache d'installation et sa requête d'accueil est différée après le chargement critique.

Run final `35466565740` : **PASS CIBLÉ laboratoire**, avec LCP accueil **2012 ms mobile / 1964 ms desktop** et CLS Catalogue desktop **0**.

Ces chiffres ne sont pas des CWV réels utilisateurs.

## Monde vivant — état de fraîcheur offline — impact runtime

Ajout de l'état explicite `fresh / offline-stale / unavailable` :

- `assets/living-world.js` : **6490 octets** ;
- `assets/living-world.css` : **4049 octets** ;
- `data/living-world.json` : **2748 octets** ;
- runtime monde vivant total : **13287 octets**.

Delta par rapport au lot précédent : **+756 octets runtime**. Aucun de ces octets n'entre dans le précache cœur ; le noyau reste **114977 octets** avant toute autre modification du présent lot.

## Contrat visuel en couches — impact candidat — 19 septembre 2026

Évolution runtime du monde vivant :

- `assets/living-world.js` : **11048 octets** ;
- `assets/living-world.css` : **5012 octets** ;
- `data/living-world.json` : **3647 octets** ;
- total runtime monde vivant : **19707 octets** ;
- delta runtime : **+6420 octets**.

Ces trois fichiers restent hors du précache cœur.

`index.html` gagne **352 octets** pour les slots visuels et le fallback d'environnement. Noyau candidat dérivé : **115329 octets**, soit une marge de **684671 octets** sous 800000.

Aucun asset de croissance lourd n'est ajouté au précache. Les futurs assets de stades suivent la politique `runtime-on-demand` et `current-stage-only`.

### Correction du coût critique — croissance visuelle en couches

La première variante ajoutait **+6420 octets** au runtime monde vivant chargé sur l'accueil et **+352 octets** à `index.html`. Le run labo `35470244794` a échoué sur l'accueil mobile avec **LCP 3100 ms**.

Après isolation :

- `index.html` revient à **19411 octets**, soit **0 octet de delta** par rapport à la base ;
- `assets/living-world.css` revient à **4049 octets** ;
- `assets/living-world.js` : **7439 octets** ;
- `data/living-world.json` : **3647 octets** ;
- runtime monde vivant chargé courant : **15135 octets**, delta **+1848 octets** ;
- module dormant `living-world-visual-growth.mjs` : **6071 octets** ;
- CSS dormant `living-world-visual-growth.css` : **1009 octets** ;
- ces deux fichiers ne sont demandés qu'après passage explicite à `visualGrowth.status=ready`.

Le noyau install-précaché revient donc à **114977 octets**, marge **685023 octets** sous 800000. La micro-preuve performance doit confirmer cette correction avant fusion.

