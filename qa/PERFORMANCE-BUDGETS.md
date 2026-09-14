# MODARYX — budgets et limites de la preuve

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
