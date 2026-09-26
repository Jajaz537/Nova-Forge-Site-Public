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

## Résultat réel

Premier run `35465374096` : **FAIL ciblé du harnais** — erreur de syntaxe dans l'assertion Stage A. Correction limitée au script QA.

Deuxième run `35465415608` : **FAIL ciblé d'initialisation Chrome** — `fetch failed` avant toute observation produit. Isolation : endpoint DevTools fixe/non prêt. Correction : Chrome choisit désormais son propre port via `--remote-debugging-port=0` et le harnais lit `DevToolsActivePort`.

Micro-preuve finale : run `35465473185` — **success / PASS CIBLÉ**.

La preuve finale confirme :

- installation Stage A avec cache `modaryx-site-v120-scalable` ;
- déclenchement réel de `registration.update()` ;
- activation du cache Stage B `modaryx-site-v121-update-proof` ;
- suppression de l'ancien cache MODARYX lors de l'activation ;
- arrêt réel du serveur ;
- version B de l'accueil encore disponible hors ligne.

PR #34 fusionnée par `6871d3a52ea1ad7dd6e6d8979f146cb7f95bec2c`.

Limite : la mutation A→B reste une simulation contrôlée sur copie temporaire en Chromium loopback ; la preview HTTPS publique et les appareils physiques restent des preuves séparées.

