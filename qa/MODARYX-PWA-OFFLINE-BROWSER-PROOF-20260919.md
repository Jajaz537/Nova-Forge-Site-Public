# MODARYX — micro-preuve PWA offline Chromium — 19 septembre 2026

Statut : **EN COURS — micro-preuve CI requise avant intégration**.

## But

Valider en navigateur le service worker courant, le cache réel et une transition online → offline → online, sans assimiler le loopback de CI à une preview HTTPS publique.

Le contrôle utilise Chromium headless sur `http://127.0.0.1`, origine loopback considérée digne de confiance par Chromium pour les service workers.

Périmètre :

- installation/activation du service worker ;
- contrôle du cache `modaryx-site-v120-scalable` ;
- visites online de pages runtime ;
- passage réseau réellement offline via Chrome DevTools Protocol ;
- navigation offline sur une page visitée et sur l'accueil précaché ;
- alias Catalogue avec paramètres ;
- `data/catalog.json` offline depuis le cache avec header `X-Modaryx-Cache: offline-stale` ;
- retour online et disparition du marqueur stale.

Limites : ce n'est pas encore une preuve sur preview HTTPS publique, ni une preuve de mise à jour A→B, de quota physique ou de CWV.

## Résultats réels et corrections du harnais

### Run initial — 35464392370

Résultat : **FAIL ciblé du harnais**.

Observations utiles déjà acquises : cache créé et pages runtime insérées. Les défauts provenaient de trois hypothèses du test :

- l'état `activating` était contrôlé trop tôt ;
- l'émulation réseau CDP du target page ne garantissait pas la coupure du fetch réseau du service worker ;
- le H1 réel du Catalogue est « Explorez les projets, jeu par jeu. », pas un titre contenant le mot « Catalogue ».

Correction : attendre `activated + controller`, provoquer une vraie panne en arrêtant le serveur loopback, et contrôler la structure réelle du Catalogue.

### Run intermédiaire annulé — 35464455745

Le harnais redémarrait le serveur mais ne terminait pas explicitement le nouveau processus enfant. La concurrence CI a annulé ce run après correction ciblée du cycle de vie.

### Run 35464605422

La vraie panne réseau a fonctionné :

- service worker `activated` et contrôleur présent ;
- cache initial : 17 entrées ;
- cache après visites runtime : 33 entrées ;
- Catalogue, Studio, Jeux et `data/catalog.json` présents ;
- `data/catalog.json` hors ligne : HTTP 200 + `X-Modaryx-Cache: offline-stale` ;
- retour réseau : HTTP 200 sans marqueur stale.

Le seul FAIL restant était l'assertion textuelle erronée du titre Catalogue ; aucune correction produit.

### Run 35464664751

Échec d'initialisation Chrome `fetch failed`, isolé comme collision possible du port DevTools fixe après les runs précédents. Le harnais utilise désormais un port de debug dérivé du PID.

### Micro-preuve finale

Run : `35464732269`  
Conclusion : **success / PASS CIBLÉ**.

La preuve finale couvre en Chromium headless sur loopback fiable :

- service worker activé et contrôlant la page ;
- cache `modaryx-site-v120-scalable` réel ;
- précache de 17 entrées au démarrage ;
- cache runtime après visites ;
- arrêt réel du serveur HTTP ;
- navigation Catalogue hors ligne ;
- alias Catalogue avec paramètres hors ligne ;
- accueil précaché hors ligne ;
- donnée Catalogue hors ligne marquée `offline-stale` ;
- redémarrage du serveur ;
- récupération réseau et disparition du marqueur stale.

PR #33 fusionnée par `bc7876a1ed56cbe560e95b7383cc583fb2bef854`.

## Limites finales de cette preuve

Cette preuve ferme le comportement **browser + service worker + vraie panne réseau** sur loopback Chromium. Elle ne ferme pas :

- preview publique HTTPS ;
- mise à jour contrôlée version A → B ;
- Safari/Firefox ;
- appareil physique ;
- quota réel sous pression ;
- CWV.

