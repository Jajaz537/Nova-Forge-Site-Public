# MODARYX V2 — Audit exhaustif anti-contamination — Phase 7 Pages, racine et configuration

**Date : 2026-10-03**
**Statut : EN COURS — audit exhaustif prioritaire avant frontend V2**

## 1. Périmètre inspecté

Pages HTML publiques et fichiers racine/configuration non couverts par les phases précédentes :

- 23 pages HTML / hubs V1
- fichiers `.github/*.json`
- `domain-cutover.json`
- `downloads.json`
- `public-build.json`
- `public-status.json`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `package.json`
- `preview.mjs`
- `sw.js`

## 2. Finding transversal — toutes les pages HTML V1 chargent le shell legacy

Chaque page auditée charge `assets/shell.js`.

Conséquence :

- enregistrement SW possible ;
- menu/navigation injectés par le shell ;
- préférences legacy ;
- comportements communs V1.

### Classification

Toutes les pages HTML V1 → **LEGACY VISUEL / SURFACE HISTORIQUE**

Aucune ne doit servir de base DOM au frontend V2.

## 3. Finding transversal — cascade CSS V1 sur les pages

Les pages secondaires chargent généralement une combinaison de :

- `assets/tokens.css`
- `assets/site.css`
- CSS feature
- `assets/nova-premium-hd.css`
- `assets/modaryx-foundations.css`
- `assets/modaryx-cinematic-system.css`
- parfois `assets/modaryx-pages-finishline.css`
- parfois un fix CSS dédié

### Conséquence

Le markup et la cascade sont profondément interdépendants.

### Règle

Ne pas “porter” une page en remplaçant seulement son CSS.
Le DOM V2 doit être nouveau.

## 4. Homepage

`index.html` charge en particulier :

- `shell.js`
- `app.js`
- `nova-premium-hd.js`
- `living-world.js`
- `modaryx-home-finishline.css`
- `modaryx-foundations.css`

et contient encore des références textuelles historiques Nova.

### Classification

**À BLOQUER COMME TEMPLATE V2**

## 5. Catalogue

`catalog.html` charge :

- shell legacy ;
- `catalog.js` ;
- sept couches CSS historiques.

Il contient encore trois liens de projets V1.

### Classification

**LEGACY UI / À RECONSTRUIRE**

## 6. Community

`community.html` charge :

- shell ;
- `community.js` ;
- CSS global/cinematic/community finishline.

### Classification

**LEGACY UI / À RECONSTRUIRE**

## 7. Creator Studio

`creator-studio.html` charge :

- shell ;
- `json-schema-lite.js` ;
- `creator-studio.js` ;
- CSS studio V1 ;
- cinematic/fix/pages finishline.

### Décision

Le validateur peut être extrait.
La page et son workflow DOM sont **LEGACY UI**.

## 8. Profiles

`profiles.html` charge :

- shell ;
- profiles.js ;
- official.css ;
- profiles.css ;
- global/cinematic legacy.

### Classification

**LEGACY UI**

L'auth backend peut être réutilisé, pas le DOM.

## 9. Project pages

Les trois pages :

- `project-balanced-latency-pack.html`
- `project-ember-textures.html`
- `project-forge-night-experience.html`

chargent le même renderer `project-hub.js` et la même cascade V1.

### Classification

**DEMO / LEGACY UI**

Elles ne sont pas des templates Content Detail V2.

## 10. Games directory

`games/index.html` :

- est généré par `qa/build-games-index.py` ;
- charge shell + CSS V1 ;
- contient trois routes project V1.

### Classification

**GENERATED V1 / À BLOQUER POUR V2**

## 11. GTA VI / RDR2 hubs

Les hubs/guides/mods actuels sont éditoriaux et utilisent :

- shell V1 ;
- official.css ;
- cinematic/pages finishline.

### Classification

- contenu éditorial/sources : **À REVALIDER**
- markup/styles : **LEGACY VISUEL**
- statut “hub ≠ distribution” : **RÉUTILISABLE comme principe**

## 12. Search

`search.html` charge :

- shell ;
- search.js ;
- official/search CSS ;
- cinematic ;
- search cinematic fix.

Il contient des routes projet V1.

### Classification

**LEGACY UI / SEARCH INDEX À RECONSTRUIRE**

## 13. Security / Verify / Downloads / Documentation / Ecosystem

Ces pages utilisent le shell V1 et les styles globaux/cinematic.

### À préserver conceptuellement

- explications provenance/hash/signature ;
- vérificateur local SHA-256 ;
- distribution fail-closed ;
- documentation sécurité ;
- intégrations optionnelles.

### Classification

Markup/style → **LEGACY UI**

Fonctions/contenu factuel → **À EXTRAIRE / REVALIDER**

## 14. 404

`404.html` charge shell + app + cascade V1.

### Classification

**LEGACY UI**

V2 aura sa propre page Not Found.

## 15. domain-cutover.json — finding historique critique

Ce fichier déclare encore :

- canonicalOrigin = `https://getnovaforge.com`
- alias `www.getnovaforge.com`
- activation requirements historiques.

### Risque

Très élevé si une automatisation V2 le prend comme source actuelle.

### Classification

**HISTORIQUE / À BLOQUER POUR MODARYX V2**

Il ne doit jamais piloter le domaine MODARYX actuel.

## 16. fichiers .github de contrôle Cloudflare

- `.github/cloudflare-control.json`
- `.github/cloudflare-http3-off.json`
- `.github/cloudflare-probe.json`

Ce sont des intents/raisons pour opérations infra historiques.

### Classification

**HISTORIQUE / INFRA CONTROL**

Ne pas exécuter ni modifier sans instruction explicite.

## 17. site-vf-session.json

Contient :

- `mode: suite-lami`
- goal Premium HD
- phase inventory-and-architecture
- preserve placements

### Risque

Ce fichier est un état historique et ne doit pas être utilisé comme source canonique face au nouveau checkpoint V2.

### Classification

**HISTORIQUE**

## 18. downloads.json

Encore namespacé :

- `nova-forge-public-downloads/v1`
- `official-site`
- pre-vf

et sans artefact publié.

### Classification

**V1 HISTORIQUE / DISTRIBUTION LOCK**

À préserver comme preuve historique du verrou, pas comme contrat V2 final.

## 19. public-build.json

Encore :

- `nova-forge-public-site-build/v1`
- stage design-candidate-not-promoted.

### Classification

**HISTORIQUE / À REMPLACER POUR V2**

## 20. public-status.json

Encore :

- `nova-forge-public-site-status/v1`
- V1 routes ;
- smart_profile ;
- community local draft ;
- integrations historiques.

### Classification

**HISTORIQUE / À REMPLACER PAR UN STATUS V2**

Ne pas exposer ce contrat comme source de vérité V2.

## 21. Sitemap

Le sitemap actuel est MODARYX et liste 22 URLs V1/hubs.

### Classification

**SEO V1 / À RECONSTRUIRE**

V2 devra générer son sitemap depuis ses routes réellement indexables.

## 22. robots.txt

Simple :
- User-agent *
- Allow /

### Classification

**RÉUTILISABLE comme baseline**

À compléter seulement selon stratégie SEO finale.

## 23. site.webmanifest

Marque MODARYX correcte, mais shortcuts V1 :

- catalog.html
- search.html
- creator-studio.html
- profiles.html
- community.html
- ecosystem.html
- downloads.html
- security.html
- verify.html
- documentation.html

### Classification

**À RECONSTRUIRE POUR V2**

Les icônes doivent être revalidées avant reuse final.

## 24. package.json

Scripts actuels :

- dev → preview V1
- build → games generator + check-site V1
- lint → check-site V1
- test → full source validator V1

### Classification

**V1 PIPELINE / À NE PAS UTILISER COMME PIPELINE V2**

## 25. preview.mjs

Bonnes propriétés :

- root confinement ;
- no-store ;
- nosniff ;
- extension fallback ;
- loopback par défaut.

### Classification

**RÉUTILISABLE COMME OUTIL LOCAL**

À condition de servir un répertoire V2 isolé et de ne pas prouver à lui seul le comportement production.

## 26. Service Worker

Le finding Phase 1 est reconfirmé par inspection complète.

Le SW :

- connaît explicitement toutes les pages V1 ;
- précache CSS/JS legacy ;
- supprime anciens caches `nova-site-shell-*` / `modaryx-site-*` ;
- `skipWaiting()` ;
- `clients.claim()` ;
- runtime-cache `assets/` et `schemas/`.

### Risque particulier V2

Un nouveau frontend partageant le même scope pourrait être immédiatement contrôlé par ce SW.

### Classification

**À BLOQUER / REMPLACER AVANT PREVIEW V2 SUR MÊME ORIGINE**

## 27. SHA256SUMS

Fichier de digests historiques.

### Classification

**RÉUTILISABLE comme mécanisme**, mais devra être régénéré pour les artefacts V2 concernés.

Ne pas considérer les hashes V1 comme preuve de la V2.

## 28. Dependabot

Workflow de dépendances GitHub Actions hebdomadaire.

### Classification

**RÉUTILISABLE**

## 29. Conclusion HTML/racine

Le risque de contamination ne vient pas d'un seul fichier :

> Toute la surface HTML V1 repose sur un shell, un Service Worker et une cascade CSS communs.

Par conséquent, une “migration progressive page par page” dans le même shell serait risquée.

La stratégie isolée V2 est confirmée comme nécessaire.

## 30. Gate

Avant premier preview frontend V2 :

- aucune page HTML V1 utilisée comme template runtime ;
- aucun shell.js V1 ;
- aucun SW V1 ;
- aucun CSS V1 ;
- aucun domain-cutover getnova ;
- nouveau manifest ;
- nouveau status contract ;
- sitemap V2 ;
- pipeline V2 indépendant.

**État Phase 7 : TERMINÉ pour pages/racine/configuration. Audit global : EN COURS.**
