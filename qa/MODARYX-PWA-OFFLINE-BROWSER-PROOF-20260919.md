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
