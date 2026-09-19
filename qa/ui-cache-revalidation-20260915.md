# Révalidation des ressources UI — 15 septembre 2026

## Défaut isolé

Le HTML est demandé au réseau, tandis que les CSS et JavaScript sans empreinte dans leur URL étaient servis exclusivement depuis le cache disponible. Un ancien worker pouvait donc fournir une ancienne interface avec un nouveau document. Ce mécanisme est reproduit en simulation ; il ne prouve pas à lui seul la cause exacte de l’ancien style observé lors de la recette Communauté.

## Correction

CSS et JS déjà autorisés par la liste publique utilisent maintenant network-first avec cache HTTP no-cache (révalidation). Une erreur réseau conserve le repli vers la copie locale. Métadonnées no-store, exclusions d’URL, conservation des erreurs HTTP et isolation des caches restent inchangées. Images conservées dans leur stratégie précédente. Cache v66.

La révalidation ajoute une dépendance réseau en ligne ; aucun gain de performance ni atomicité complète d’un déploiement n’est revendiqué. Un réseau lent et le passage entre deux déploiements nécessitent une recette native. Cette correction n’est pas un remplacement d’une future chaîne d’assets portant une empreinte dans leur URL.

Référence officielle consultée : [Chrome — stratégies de cache](https://developer.chrome.com/docs/workbox/modules/workbox-strategies), qui réserve notamment l’intérêt d’un cache prioritaire durable aux ressources versionnées. Aucune dépendance Workbox ajoutée.

## Preuves ciblées

Avant correction : quatre nouvelles assertions échouent sur CSS/JS avec une ancienne copie en cache. Après correction : 25 assertions cache réussies, dont révalidation CSS/JS et secours hors ligne simulé. Neuf contrôles d’entrée PWA, six de métadonnées, structure 16 pages/13 scripts et 76 empreintes réussis. Cumul source porté de 126 à 130 contrôles ; mesures responsive comptées séparément.

EN COURS. Installation, activation et mise à jour hors ligne HTTPS en navigateur réel : PREUVE MANQUANTE. Aucune VF.
