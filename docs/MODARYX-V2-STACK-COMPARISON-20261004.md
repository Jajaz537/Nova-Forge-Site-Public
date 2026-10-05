# MODARYX V2 — Comparaison de stack non engageante

**Date : 2026-10-04**  
**Statut : EN COURS — comparaison technique uniquement / aucune stack sélectionnée**

## 1. Règle

Ce document ne choisit pas la stack finale.

Le choix reste BLOQUÉ par le gate canonique tant que les validations humaines requises ne sont pas suffisamment fermées ou explicitement reclassifiées avec preuve.

Aucune migration Cloudflare, aucun changement DNS, aucun changement de production et aucun cutover n'est autorisé par ce document.

## 2. Contexte Cloudflare frais — octobre 2026

Documentation officielle consultée le 4 octobre 2026 :

- Cloudflare Pages — framework guides :
  https://developers.cloudflare.com/pages/framework-guides/
- Cloudflare Workers — web applications :
  https://developers.cloudflare.com/workers/framework-guides/web-apps/
- Cloudflare Workers — Astro :
  https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/
- Astro Cloudflare adapter :
  https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Workers — React + Vite :
  https://developers.cloudflare.com/workers/framework-guides/web-apps/react/
- Cloudflare Pages — static HTML :
  https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

Constat important :
- Cloudflare indique désormais que **Workers est sa plateforme principale pour construire de nouvelles applications** ;
- Pages reste disponible et supporte encore de nombreux frameworks ;
- l'adapter Cloudflare d'Astro récent a retiré le support Pages et vise Workers pour le runtime Cloudflare moderne ;
- aucun de ces faits n'autorise une migration de la production MODARYX actuelle.

## 3. Options minimales à comparer

### Option A — Vanilla / static-first + Vite léger

Principe :
- HTML/CSS/TypeScript ou JavaScript minimal ;
- routing/build explicitement contrôlés ;
- Workers ou assets statiques selon besoin ;
- aucune hydration globale.

Atouts pour MODARYX :
- surface supply-chain réduite ;
- contrôle maximal CSP / SW / routing / cache ;
- bundle client potentiellement très faible ;
- isolation legacy simple à auditer.

Risques :
- beaucoup de composants/state/routing à construire nous-mêmes ;
- Creator Studio, filtres, profils, Account et états complexes demandent davantage de code maison ;
- risque de réinventer accessibilité/state management/router.

À retenir :
- baseline de simplicité obligatoire pour comparer les autres options.

### Option B — Astro + Cloudflare Workers

Principe :
- pages static/prerender quand possible ;
- rendu on-demand uniquement où nécessaire ;
- islands JavaScript ciblées ;
- possibilité d'utiliser React/Preact/Svelte/Vue/Solid uniquement pour les îlots interactifs.

Atouts :
- correspond bien au principe MODARYX « contenu initial rapide + progressive enhancement » ;
- JavaScript client minimal par défaut ;
- routes de contenu, jeux, créateurs, collections et fiches peuvent être majoritairement static/SSR ;
- Creator Studio, filtres, recherche et compte peuvent devenir des islands ciblées ;
- Cloudflare Workers et workerd sont supportés officiellement ;
- possibilité de prerender explicite par route.

Risques :
- migration du prototype React vers une composition Astro + islands ;
- adapter/runtime supplémentaire ;
- nécessité de cadrer précisément sessions, server islands et bindings ;
- upgrade path Astro/adapter à surveiller.

### Option C — React + Vite + Cloudflare Workers

Principe :
- conserver le modèle composant React ;
- Cloudflare Vite plugin + Worker API ;
- SPA ou architecture hybride à définir.

Atouts :
- proximité maximale avec le prototype Living Threshold actuel ;
- migration conceptuelle rapide des interactions déjà éprouvées ;
- énorme écosystème de composants/tests ;
- support officiel Cloudflare Workers actuel.

Risques :
- SPA globale peut augmenter JavaScript initial si non maîtrisée ;
- HTML initial/SEO/routing demandent stratégie explicite ;
- risque d'hydration/runtime client trop large ;
- discipline nécessaire pour éviter que tout devienne client-side par facilité.

À retenir :
- option à forte continuité prototype, mais elle doit prouver qu'elle respecte les budgets client/perf.

## 4. Critères de comparaison obligatoires

Chaque option doit être notée plus tard sur :

- isolation V2 ;
- HTML initial accessible ;
- routing explicite ;
- 404/410/redirects ;
- CSP stricte ;
- absence de `unsafe-eval` ;
- contrôle Service Worker ;
- namespace storage V2 ;
- bundle JavaScript initial ;
- progressive enhancement ;
- SEO/canonical/sitemap ;
- Cloudflare Workers ;
- preview SHA immutable ;
- tests browser/a11y ;
- image strategy ;
- fonts ;
- auth cookies HttpOnly / PKCE ;
- adapters backend ;
- Creator Studio ;
- search/filter responsiveness ;
- PWA migration ;
- rollback ;
- supply-chain ;
- DX/maintenabilité ;
- migration depuis le prototype Living Threshold.

## 5. Critères disqualifiants

Rejeter une option si elle impose ou pousse fortement vers :

- hydration globale sans besoin ;
- Service Worker opaque/non contrôlable ;
- CSS global non isolable ;
- import automatique des assets V1 ;
- routing fallback qui peut servir V1 ;
- `unsafe-eval` en production ;
- `unsafe-inline` généralisé ;
- runtime Node long-running requis ;
- dépendance propriétaire obligatoire pour images/fonts ;
- difficulté à produire une preview immutable liée à un SHA.

## 6. Cloudflare Pages vs Workers

### Production actuelle

Ne rien changer.

Pages / Cloudflare existant reste inchangé tant qu'aucune stratégie contrôlée n'est autorisée.

### V2 future

Workers doit être évalué comme cible de premier rang parce que la documentation Cloudflare actuelle le présente comme plateforme principale pour les nouvelles applications.

Cela ne signifie pas :
- migration immédiate ;
- changement DNS ;
- changement de nameserver ;
- modification du projet Pages courant ;
- suppression de Pages ;
- cutover.

Toute transition éventuelle devra suivre le plan routes/SW/storage/rollback existant.

## 7. Compatibilité avec l'architecture MODARYX

### Pages majoritairement contenu

Candidates naturels pour static/prerender :
- Discover ;
- Games Index ;
- Game Hub contenu public ;
- Content Detail public ;
- Collections publiques ;
- Créateurs publics ;
- Docs/Help.

### Interactions ciblées

Candidates naturels pour enhancement/islands/client :
- recherche ;
- filtres catalogue ;
- quick view ;
- profils ;
- bibliothèque personnelle ;
- compte/préférences ;
- Creator Studio ;
- brouillons locaux ;
- notifications ;
- formulaires support/report.

La stack finale doit permettre cette séparation sans forcer tout le site dans le même mode de rendu.

## 8. Relation avec Living Threshold

Le prototype React/Vite est une référence comportementale.

Il ne décide pas de la stack.

Les composants déjà mappés dans :
`docs/MODARYX-V2-LIVING-THRESHOLD-PRODUCTION-MAPPING-20261004.md`

doivent pouvoir être transposés dans l'option choisie.

## 9. Travail restant avant décision finale

À fermer avant sélection canonique :
- validation humaine multi-écrans supplémentaire ;
- validation mobile humaine réelle ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- décision sur l'importance réelle de SSR/on-demand par surface ;
- stratégie auth/backend V2 précise ;
- budget bundle chiffré au prototype de stack ;
- micro-spike isolé comparatif si nécessaire.

## 10. Décision actuelle

**AUCUNE STACK SÉLECTIONNÉE.**

Shortlist technique actuelle :
1. vanilla/static-first + Vite léger ;
2. Astro + Cloudflare Workers ;
3. React + Vite + Cloudflare Workers.

Cette shortlist remplit la comparaison minimale exigée par le gate technique sans préempter la décision finale.

**État : TERMINÉ pour la comparaison préparatoire / choix final BLOQUÉ.**
