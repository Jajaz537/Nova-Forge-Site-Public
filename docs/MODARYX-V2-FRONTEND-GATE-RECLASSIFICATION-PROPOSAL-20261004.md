# MODARYX V2 — Proposition de reclassification du gate de démarrage frontend

**Date : 2026-10-04**  
**Statut : PROPOSITION UNIQUEMENT — NON APPROUVÉE / NON ACTIVE**

## 1. But

Réduire le temps mort entre :
- un prototype exploratoire désormais très couvert ;
- et la validation externe/humaine encore manquante ;

sans transformer une preuve prototype en validation High-Fi, production ou VF.

Ce document **n'autorise aucun root V2**, aucune stack finale, aucun déploiement et aucun cutover.

## 2. Problème actuel

Le gate canonique bloque aujourd'hui le premier root/frontend V2 tant que plusieurs validations externes ne sont pas fermées :
- revue humaine multi-écrans supplémentaire ;
- mobile humain réel ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- screen readers réels ;
- appareils physiques.

Ces preuves restent nécessaires avant la finalisation High-Fi et avant le cutover.

En revanche, une partie du travail d'ingénierie pourrait techniquement avancer en preview isolée sans prétendre à la finalité visuelle.

## 3. Option A — gate strict actuel

Conserver la règle actuelle :
- aucun root/frontend production ;
- aucune stack finale ;
- attendre les preuves externes.

Avantage :
- aucune dérive de design vers le code avant validation.

Coût :
- travail d'ingénierie bloqué même sur les couches réversibles.

## 4. Option B — preview engineering isolée

**Option proposée pour décision future, pas active.**

Autoriser uniquement un root de **preview engineering** isolé et non public, avec :
- branche candidate dédiée ;
- routes preview `noindex` ;
- aucune modification de `main` ;
- aucun DNS / Pages / Workers production ;
- aucune donnée réelle requise ;
- aucune réutilisation automatique V1 ;
- assets et fixtures de démonstration strictement séparés ;
- stack explicitement sélectionnée par décision canonique avant création ;
- anti-contamination CI obligatoire ;
- rollback simple : suppression du root preview sans impact production.

Cette option ne reclassifie pas :
- High-Fi final ;
- validation humaine ;
- screen readers ;
- appareils physiques ;
- backend ;
- MODARYX Forge ;
- sécurité/auth production ;
- cutover.

## 5. Gates qui resteraient bloquants même avec l'option B

Avant exposition publique / cutover :
- validation humaine multi-écrans ;
- validation mobile réelle ;
- référence visuelle et comparaison normalisée ;
- screen readers / appareils ;
- sécurité production ;
- backend/services réels ;
- PWA/SW production ;
- migration V1→V2 ;
- performance production ;
- privacy/modération ;
- Game Rights Registry et workflows réels lorsque concernés.

## 6. Ce que le preview engineering pourrait contenir

Après décision explicite :
1. tokens sémantiques ;
2. primitives accessibles ;
3. AppHeader / MobileNav ;
4. routes shell ;
5. Games Index / Game Hub ;
6. Search / Catalog ;
7. Content Detail ;
8. Collections / Modpack / Profils ;
9. Créateurs / Community ;
10. Library ;
11. Creator Studio ;
12. Account / Settings ;
13. Game support request ;
14. Rights admin preview ;
15. adapters/fixtures séparés ;
16. contract/browser tests.

Aucun faux backend ne doit être créé pour faire paraître ces surfaces réelles.

## 7. Conditions minimales pour activer l'option B

Une décision canonique explicite doit préciser :
- que le root est **preview engineering**, pas production ;
- la stack retenue ;
- le chemin exact du root ;
- la branche de travail ;
- les budgets/perf initiaux ;
- les règles CSP/routing/storage/SW ;
- le fait que les blockers humains restent ouverts ;
- l'absence de cutover implicite.

## 8. Proposition de formulation canonique si elle est approuvée plus tard

> Le gate High-Fi reste BLOQUÉ.  
> Le gate de démarrage d'un frontend **preview engineering isolé** est RECLASSIFIÉ : autorisé sous branche dédiée, noindex, sans cutover, sans main, sans DNS/Cloudflare critique, avec anti-contamination et preuves ciblées.  
> Les validations humaines/appareils restent obligatoires avant High-Fi final et avant toute exposition production.

## 9. État

- document préparatoire : **TERMINÉ**
- décision de reclassification : **NON PRISE**
- stack : **NON SÉLECTIONNÉE**
- root preview : **NON CRÉÉ**
- production/cutover : **BLOQUÉS**

Aucune action technique ne doit être déduite de cette proposition sans approbation explicite.
