# MODARYX — micro-preuve PWA mise à jour A → B — 19 septembre 2026

Statut : **EN COURS — micro-preuve CI requise avant intégration**.

## But

Tester le mécanisme réel de mise à jour du service worker sans modifier les fichiers produit du dépôt.

Le harnais crée une copie temporaire du candidat :

- étape A : cache courant `modaryx-site-v120-scalable`, marqueur de page A ;
- étape B : même code service worker avec un nom de cache de preuve `modaryx-site-v121-update-proof`, marqueur de page B ;
- `registration.update()` déclenche la mise à jour ;
- la phase d'activation doit supprimer l'ancien cache MODARYX ;
- après arrêt réel du serveur, l'accueil doit rester disponible hors ligne dans sa version B.

Cette preuve valide le mécanisme A→B en Chromium loopback. Elle ne remplace pas une mise à jour réelle sur preview HTTPS publique ni un appareil physique.
