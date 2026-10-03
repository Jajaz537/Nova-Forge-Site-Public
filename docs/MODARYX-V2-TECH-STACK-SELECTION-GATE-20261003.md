# MODARYX V2 — Gate de sélection de stack technique

**Date : 2026-10-03**
**Statut : TERMINÉ — critères de décision, aucune stack/framework sélectionné**

## 1. Objectif

Empêcher qu'un agent ou une future implémentation choisisse une stack par habitude, popularité ou vitesse au détriment :

- isolation V2 ;
- performance ;
- accessibilité ;
- maintenabilité ;
- sécurité ;
- compatibilité Cloudflare ;
- supply-chain minimale.

## 2. Constat actuel

Le dépôt public n'a actuellement aucune dépendance npm applicative.

Le `package.json` historique sert surtout à :
- preview local ;
- build/check V1 ;
- validation source V1.

Cette simplicité est un avantage à préserver autant que possible.

## 3. Principes de sélection

La future stack doit :

1. supporter un build V2 totalement isolé ;
2. produire du HTML accessible et inspectable ;
3. permettre un rendu rapide sans hydration globale obligatoire ;
4. fonctionner avec Cloudflare Pages/Functions ou architecture équivalente actuelle ;
5. supporter routes V2 propres ;
6. permettre CSP stricte ;
7. limiter JavaScript client ;
8. permettre PWA/SW séparé ;
9. permettre tests unit/contract/browser ;
10. ne jamais importer les assets V1 blacklistés.

## 4. Critères bloquants

Refuser une stack si elle impose :

- `unsafe-eval` en production ;
- `unsafe-inline` généralisé ;
- runtime client massif pour pages statiques ;
- CSS global difficile à isoler ;
- dépendance obligatoire à un serveur Node long-running incompatible avec le déploiement cible ;
- routing impossible à contrôler finement ;
- Service Worker automatique opaque ;
- build qui scanne/import automatiquement tout `assets/` ;
- difficulté à pin/versionner les dépendances.

## 5. Rendu

Préférence architecturale :

- static/SSR/edge pour contenu initial ;
- progressive enhancement ;
- islands ou JS ciblé pour interactions complexes ;
- aucune hydration globale si elle n'apporte rien.

Ce n'est pas un choix de framework, mais un critère de résultat.

## 6. JavaScript client

Budget qualitatif :

- aucune dépendance client par défaut ;
- chaque bibliothèque doit justifier :
  - capacité unique ;
  - taille ;
  - sécurité ;
  - maintenance ;
  - accessibilité ;
  - alternatives natives.

## 7. CSS

Exigences :

- scope V2 ;
- tokens sémantiques ;
- aucun import V1 ;
- aucun CSS-in-JS nécessitant runtime si évitable ;
- cascade contrôlée ;
- support `prefers-reduced-motion` ;
- responsive sans duplication massive.

## 8. Routing

La stack doit permettre :

- routes V2 définies explicitement ;
- 404/410 ;
- redirects contrôlés ;
- canonical par route ;
- noindex preview ;
- absence de fallback vers pages V1.

## 9. Données

La stack ne doit pas dicter le modèle métier.

Les domain objects et adapters restent framework-agnostic.

## 10. Auth

Doit permettre :

- cookies HttpOnly ;
- callbacks backend ;
- PKCE/OAuth ;
- authority server-side ;
- CSP stricte ;
- returnTo contrôlé.

## 11. PWA

Le Service Worker V2 doit être sous notre contrôle.

Refuser toute solution qui génère automatiquement un SW sans :
- scope explicite ;
- cache manifest inspectable ;
- stratégie d'upgrade ;
- tests A→B ;
- rollback.

## 12. Images

La stack doit permettre :
- dimensions explicites ;
- responsive sources ;
- lazy loading ;
- priorité média critique ;
- absence de CDN propriétaire obligatoire.

## 13. Fonts

Préférence :
- self-hosted ou système ;
- peu de poids ;
- métriques contrôlables ;
- aucune dépendance bloquante tierce.

## 14. Tests

Doit s'intégrer avec :

- contract tests ;
- unit tests ;
- browser tests ;
- a11y ;
- anti-contamination ;
- CSP ;
- performance budgets ;
- PWA migration proofs.

## 15. Supply chain

Pour toute dépendance :

- version lockée ;
- licence vérifiée ;
- maintenance active ;
- surface d'attaque comprise ;
- pas de package inutile ;
- GitHub Actions pin SHA.

Le nombre de dépendances n'est pas un objectif en soi, mais toute dépendance doit être justifiée.

## 16. Migration V1

La stack V2 ne doit pas nécessiter de transformer le dépôt V1.

Elle doit pouvoir vivre dans un root isolé :
- `v2/`
- ou root équivalent approuvé.

## 17. Comparaison future

Avant décision, comparer au minimum :

- option native/vanilla structurée ;
- option framework statique/SSR légère ;
- option framework composant plus complète.

Comparer sur :
- performance ;
- DX ;
- accessibilité ;
- Cloudflare ;
- CSP ;
- PWA ;
- routing ;
- bundle ;
- tests ;
- maintenance ;
- supply chain.

Aucun classement n'est fait ici.

## 18. Timing de la décision

La stack finale ne doit être sélectionnée qu'après :

- wireframes core complets ;
- tree testing humain ;
- architecture V2 stabilisée ;
- exigences d'interaction connues.

Un choix précoce pourrait forcer le design à suivre la technologie.

## 19. État

- critères stack : **TERMINÉ**
- dépendances V2 : **0 sélectionnée**
- framework V2 : **NON SÉLECTIONNÉ**
- supply-chain runtime V2 : **AUCUNE**
- frontend V2 : **NON COMMENCÉ**

