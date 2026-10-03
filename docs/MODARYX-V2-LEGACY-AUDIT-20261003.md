# MODARYX V2 — Audit legacy et frontière de reconstruction

**Date : 2026-10-03**  
**Portée : MODARYX / MODARYX MODS uniquement**  
**Branche d'audit : `audit/modaryx-v2-legacy-boundary-20261003`**  
**Base vérifiée avant écriture : `main@d8d5ea5509f07c5bf5a4424293cfa404643c239f`**  
**Règle : aucun runtime, aucune production, aucun DNS/DNSSEC/nameserver/IONOS/Cloudflare critique modifié dans ce lot.**

## 1. Décision

MODARYX V2 est reconstruit comme **nouvelle surface produit**.

L'ancien front ne sert plus de référence visuelle. Il reste disponible pour historique, contrats, logique métier, sécurité, données, QA et provenance.

**Règle de liste blanche : aucun composant visuel, stylesheet, layout, script DOM ou asset legacy n'entre dans V2 sans réapprobation explicite.**

## 2. Source de reprise lue

- `CHECKPOINT-CANONIQUE-MODARYX-2026-09-21.md`
- `qa/MODARYX-ANTI-OUBLI-CURRENT-20260920.md`
- `MODARYX-SITE-IDEAS-INVENTORY.md`
- `MODARYX-SITE-ARCHITECTURE-V1.md`
- `MODARYX-DESIGN-CONTRACT.md`
- `MODARYX-VF-FINISHLINE-WORK-CHECKPOINT-2026-10.md`

Le checkpoint du 21 septembre prévaut sur les états plus anciens lorsqu'ils sont contradictoires, sauf preuve technique fraîche.

## 3. Diagnostic global

Le dépôt contient simultanément :

1. un ancien front multigaming/mods fonctionnel et très outillé ;
2. plusieurs directions artistiques successives ;
3. un front "Royaume" plus récent ;
4. des systèmes runtime utiles ;
5. des caches/PWA capables de conserver des surfaces anciennes ;
6. de nombreux workflows de preuve liés aux 23 routes historiques.

Cette coexistence est utile pour la provenance, mais elle constitue un **risque réel de contamination** si V2 est construit au-dessus sans isolation.

## 4. Risques de contamination confirmés

### 4.1 Service worker / cache — RISQUE ÉLEVÉ

`sw.js` référence encore explicitement les anciennes surfaces publiques :

- `games/index.html`
- `gta-6/*`
- `red-dead-redemption-2/*`
- `catalog.html`
- `search.html`
- `creator-studio.html`
- `profiles.html`
- `community.html`
- `project*.html`
- `ecosystem.html`
- `downloads.html`
- `documentation.html`
- `security.html`
- `verify.html`

Le précache contient aussi des couches historiques :

- `assets/tokens.css`
- `assets/nova-premium-hd.css`
- `assets/modaryx-premium-refinement.css`
- `assets/modaryx-foundations.css`
- `assets/modaryx-home-cinematic.css`
- `assets/modaryx-home-finishline.css`
- `assets/shell.js`
- `assets/app.js`
- `assets/nova-premium-hd.js`

**Décision V2 :** aucun nouveau front ne doit réutiliser ce service worker tel quel. La stratégie V2 devra prévoir une version de cache distincte, une migration/activation contrôlée et l'élimination des anciennes entrées runtime sans casser les données utiles.

### 4.2 `assets/shell.js` — LEGACY À ISOLER

Ce fichier :

- enregistre le service worker ;
- lit/écrit `localStorage` sous `nova_site_shell_preferences_v1` ;
- injecte un bouton de motion ;
- construit dynamiquement une navigation mobile sur `.topbar` ;
- injecte une note dans le footer ;
- peut charger `real-world-sync.mjs`.

**Décision V2 :** ne pas importer tel quel. Extraire seulement les comportements réellement retenus sous de nouveaux modules V2.

### 4.3 `assets/app.js` — LOGIQUE À EXTRAIRE, RENDU LEGACY INTERDIT

Contient de la logique utile :

- catalogue ;
- recherche locale ;
- états loading/error/retry ;
- Smart Profile ;
- statuts publics ;
- comportements fail-closed.

Mais génère du DOM avec les anciennes conventions :

- `.card`
- `.button`
- `.panel`
- `.badge`
- autres classes historiques.

**Décision V2 :** préserver les contrats et algorithmes utiles ; réécrire la couche de présentation.

### 4.4 CSS global historique — RISQUE TRÈS ÉLEVÉ

Des fichiers comme `assets/nova-premium-hd.css` contiennent des sélecteurs génériques :

- `.card`
- `.button`
- `.panel`
- `.field`
- `.hero`
- `.site-footer`
- `.catalogue-shell`
- etc.

Ces règles peuvent modifier silencieusement un nouveau front.

**Décision V2 :** aucun ancien stylesheet global n'est importé dans le shell V2.

### 4.5 Build / génération — RISQUE STRUCTUREL

`package.json` exécute actuellement :

`python3 qa/build-games-index.py --check`

Le générateur `qa/build-games-index.py` reconstruit `games/index.html` à partir de `data/catalog.json` et d'un template V1.

**Décision V2 :** le build V2 doit être séparé. Les générateurs historiques restent disponibles pour provenance et QA legacy, mais ne doivent pas générer les surfaces V2.

### 4.6 Redirects — INCOMPATIBLES AVEC LA CIBLE PRODUIT V2

La surface récente redirige notamment :

- `/catalog`
- `/search`
- `/creator-studio`
- `/profiles`
- `/games/*`
- `/gta-6/*`
- `/red-dead-redemption-2/*`

vers `/` ou `/aventures`.

Or V2 doit précisément remettre au centre :

- jeux ;
- recherche ;
- catalogue ;
- créateurs ;
- fiches de contenus ;
- collections.

**Décision V2 :** ces redirects sont temporaires/legacy, pas un contrat produit V2.

### 4.7 Manifest / identité installable — À REFAIRE

Le manifest récent décrit principalement MODARYX comme Royaume/univers/personnages/terres/histoires.

**Décision V2 :** futur manifest centré sur la plateforme multigaming de mods/plugins/addons/outils, tout en conservant l'identité MODARYX.

## 5. Ce qui doit être préservé

### CONSERVER / RÉUTILISER APRÈS AUDIT

- sécurité et hardening ;
- Auth0/D1/Turnstile DEV prouvés ;
- modération/publication/recours ;
- profils publics ;
- contrats de provenance/signatures ;
- verrou de distribution fail-closed ;
- Storage Resolver / Repair Network contracts ;
- Guide / pont Nova Forge OS comme intégration distincte ;
- logique de recherche locale ;
- logique de collections ;
- universal mod manifest ;
- compatibilité/dépendances/conflits ;
- données et schémas utiles ;
- QA accessibilité/reflow/performance/PWA lorsqu'elle reste applicable ;
- monde vivant / saison / heure / reduced-motion comme couche optionnelle ;
- infrastructure GitHub ;
- historique de preuves.

### RÉUTILISER APRÈS ADAPTATION

- recherche ;
- catalogue ;
- profils ;
- communauté ;
- Creator Studio ;
- collections ;
- états UI ;
- PWA/offline ;
- real-world sync ;
- Smart Profile ;
- installation/manager futur.

### LEGACY À ISOLER

- ancien shell ;
- anciens layouts ;
- anciens styles globaux ;
- anciens composants UI ;
- anciens templates ;
- anciens générateurs de pages ;
- conventions de classes génériques ;
- narration "Royaume-first" lorsqu'elle remplace la fonction mods.

## 6. Anti-oubli V2

Les idées explicitement retenues restent à tracer et ne sont pas supprimées par la reconstruction :

- identité MODARYX MODS ;
- catalogue multigaming ;
- recherche ;
- hubs jeux ;
- Creator Studio ;
- profils créateurs ;
- communauté ;
- collections ;
- provenance/signatures ;
- Smart Profile ;
- Guide MODARYX ;
- sécurité/documentation/vérification ;
- téléchargements lorsqu'un artefact autorisé existe ;
- SEO ;
- responsive/accessibilité ;
- performance ;
- monde vivant ;
- météo réelle seulement après validation fournisseur/juridique ;
- Nova Forge OS comme produit séparé.

Aucune fonctionnalité non récupérée ne doit être inventée.

## 7. Contrats produit déjà utiles pour V2

### Universal Mod Manifest

Le schéma actuel fournit déjà une base saine pour :

- type de contenu ;
- jeu cible ;
- versions ;
- loaders ;
- créateur ;
- compatibilité ;
- dépendances ;
- conflits ;
- droits/licence ;
- provenance ;
- fichiers ;
- SHA-256 ;
- distribution ;
- receipts.

Le vocabulaire `kind` devra probablement être élargi pour couvrir proprement les catégories V2 (plugins, addons, scripts, shaders, presets, maps, etc.) au lieu de forcer tous les contenus dans les catégories historiques.

### Collections

Le contrat distingue déjà :

- private-local ;
- unlisted ;
- public ;
- local-only ;
- sync-pending ;
- synced.

Bonne base fonctionnelle, UI à reconstruire.

### Search Adapter

La recherche locale reste le socle core ; un index externe est optionnel et ne doit pas remplacer l'identité locale du contenu. Cette règle reste saine pour V2.

## 8. Frontière technique obligatoire V2

Le nouveau front doit disposer de son propre :

- app shell ;
- namespace de composants ;
- design system ;
- tokens ;
- styles ;
- layouts ;
- navigation ;
- scripts UI ;
- manifest ;
- stratégie PWA/cache ;
- pipeline de build ;
- tests ;
- assets approuvés.

### Interdictions

- aucun `<link>` vers un ancien CSS global ;
- aucun import automatique de `shell.js` / `app.js` ;
- aucune classe générique legacy réutilisée par accident ;
- aucune génération V2 depuis un template V1 ;
- aucune route V2 masquée par un redirect legacy ;
- aucun service worker ancien considéré comme compatible par défaut.

## 9. Convention d'isolation recommandée

Pour la période de transition :

- namespace CSS/tokens : `mx2-` ou composants encapsulés ;
- modules JS V2 séparés ;
- cache PWA V2 séparé ;
- pages V2 distinctes avant cutover ;
- données/contrats partagés uniquement via interfaces explicitement documentées.

Le préfixe n'est qu'une garde temporaire : l'objectif final reste un code propre, pas une accumulation de versions.

## 10. Séquence de reconstruction

1. **Audit legacy** — présent document.
2. **Architecture informationnelle V2** — page blanche.
3. **Parcours utilisateurs** — découverte, installation, publication, collections, profils.
4. **Wireframes desktop/mobile**.
5. **Tests IA/navigation**.
6. **Direction artistique**.
7. **Design system**.
8. **Prototype haute fidélité**.
9. **Validation humaine comparative**.
10. **Nouveau front isolé**.
11. **Branchement sélectif des fonctions existantes**.
12. **Migration contrôlée PWA/cache/routes**.
13. **QA fonctionnelle/visuelle/a11y/performance**.
14. **Cutover uniquement après validation explicite**.

## 11. Critère de sortie de l'audit

L'audit peut être considéré comme suffisamment fermé pour commencer l'architecture V2 lorsque :

- toutes les sources globales de CSS/JS sont classifiées ;
- service worker/cache sont identifiés comme frontière à remplacer ;
- build/générateurs sont classifiés ;
- routes/redirects sont classifiés ;
- contrats/données à préserver sont listés ;
- anti-oubli est reporté ;
- aucune écriture runtime n'est nécessaire pour poursuivre la conception.

**État : TERMINÉ pour la frontière initiale.**  
Les détails d'implémentation seront revisités au moment du branchement V2, sans réutilisation implicite du legacy.
