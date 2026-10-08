# MODARYX V2 — Root candidat de production — 2026-10-06

**État : EN COURS jusqu'à micro-preuve navigateur du SHA candidat**

Le root réel est `v2/`.

Il dérive du root preview prouvé, conserve le canon visuel Game Hub sombre bleu nuit + violet et retire du root de production les assets narratifs compagnons non utilisés (bébé dragon/loup).

Le candidat reste :
- `noindex,nofollow,noarchive` ;
- sans enregistrement automatique du Service Worker ;
- sans cutover ;
- sans donnée réelle obligatoire ;
- sans modification de `main` ou de configuration Cloudflare critique.

Le workflow ciblé doit prouver :
- build ;
- contrat root/stack ;
- accessibilité navigateur ;
- product flows ;
- 143 captures + intégrité ;
- migration V1 → V2 non destructive ;
- offline avec origine arrêtée ;
- rollback ;
- gate VF toujours BLOQUÉ tant que les autres exigences restent ouvertes.
