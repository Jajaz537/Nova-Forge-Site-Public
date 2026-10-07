# MODARYX V2 — OSS DEPENDENCY INVENTORY — 2026-10-07

**Statut : INVENTAIRE TECHNIQUE TERMINÉ pour `v2/package-lock.json` / revue notices & assets PREUVE MANQUANTE**

## 1. Source

- source produit : `design/modaryx-v2-blue-violet-product-20261005`
- lockfile inspecté : `v2/package-lock.json`
- lockfileVersion : 3
- packages résolus hors racine : **115**

Cet inventaire décrit ce qui est déclaré dans le lockfile. Il ne remplace pas la lecture des licences originales ni la préparation des notices requises avant distribution.

## 2. Dépendances directes V2

| Package | Version | Licence déclarée dans lockfile |
|---|---:|---|
| @phosphor-icons/react | 2.1.10 | MIT |
| @vitejs/plugin-react | 5.0.4 | MIT |
| react | 19.2.0 | MIT |
| react-dom | 19.2.0 | MIT |
| vite | 6.4.2 | MIT |

## 3. Distribution des licences déclarées

Sur les 115 packages résolus :
- MIT : **107**
- ISC : **5**
- Apache-2.0 : **1**
- BSD-3-Clause : **1**
- CC-BY-4.0 : **1**

Aucune entrée sans champ `license` n'a été observée dans ce lockfile lors de cet audit.

## 4. Point CC-BY-4.0

Le lockfile attribue `CC-BY-4.0` à `caniuse-lite`.

Ce statut exige une attention spécifique sur attribution/notices et sur ce qui est réellement redistribué dans le build final.

Ne pas déduire du lockfile seul qu'aucune action n'est nécessaire.

## 5. Build-time vs runtime

Une partie importante des packages est liée au pipeline Babel/Vite/Rollup/esbuild et peut ne pas être redistribuée telle quelle au navigateur.

Avant release :
1. générer le bundle final ;
2. identifier les éléments effectivement distribués ;
3. déterminer les obligations de notice applicables aux éléments redistribués ;
4. conserver un inventaire reproductible lié au SHA/lockfile ;
5. publier les notices nécessaires.

## 6. Assets hors npm

Ce document ne couvre pas :
- images ;
- logos ;
- polices ;
- illustrations ;
- vidéos ;
- sons ;
- assets de jeux tiers ;
- screenshots ;
- contenus/mods utilisateurs ;
- données éditoriales ;
- ressources téléchargées hors npm.

Ils restent dans le registre de provenance/droits séparé.

## 7. Gate commercial/legal

TERMINÉ :
- inventaire technique npm V2 à partir du lockfile ;
- versions directes ;
- familles de licences déclarées.

PREUVE MANQUANTE :
- vérification des textes de licence upstream ;
- fichier NOTICE/THIRD-PARTY final ;
- preuve des attributions nécessaires ;
- inventaire assets complet ;
- analyse du bundle réellement redistribué ;
- re-scan sur lockfile final de production.

## 8. Règle de release

Avant chaque release commerciale :
- lockfile figé ;
- re-scan licences ;
- comparaison avec l'inventaire précédent ;
- aucune licence nouvelle/ambiguë silencieuse ;
- notices générées/revues ;
- preuve attachée au release SHA.
