# MODARYX V2 — THIRD-PARTY / NOTICE CANDIDATE — 2026-10-07

**Statut : EN COURS / NON RELEASE-READY**

Source technique : `v2/package-lock.json` sur `design/modaryx-v2-blue-violet-product-20261005` à partir du HEAD `685d7fd321c06489cf8cce9adcfbcc777beb9b7c`.

## 1. Ce qui est prouvé

- 115 packages npm résolus hors racine.
- Répartition des identifiants de licence déclarés dans le lockfile :
  - MIT : 107
  - ISC : 5
  - Apache-2.0 : 1
  - BSD-3-Clause : 1
  - CC-BY-4.0 : 1
- Dépendances directes déclarées :
  - `@phosphor-icons/react@2.1.10` — MIT
  - `@vitejs/plugin-react@5.0.4` — MIT
  - `react@19.2.0` — MIT
  - `react-dom@19.2.0` — MIT
  - `vite@6.4.2` — MIT

Le registre exhaustif package/version/licence déclarée est :
`docs/MODARYX-V2-THIRD-PARTY-REGISTRY-CANDIDATE-20261007.json`.

## 2. Ce que ce fichier ne prouve pas

Le champ `license` du lockfile ne remplace pas le texte de licence upstream. Ce candidat n'autorise pas encore une distribution commerciale.

Toujours **PREUVE MANQUANTE** :
- texte de licence upstream exact par composant effectivement redistribué ;
- copyright notices à conserver ;
- obligations d'attribution ;
- distinction build-time / runtime / code réellement embarqué ;
- scan du bundle final de production ;
- assets, logos, illustrations et preuves visuelles hors npm ;
- re-scan au SHA de release.

## 3. Traitement release

Avant un PASS licences :
1. figer le lockfile du release SHA ;
2. générer le bundle final ;
3. établir la liste des composants effectivement redistribués ;
4. récupérer les textes LICENSE/NOTICE des versions exactes ;
5. produire le fichier THIRD-PARTY final et les attributions requises ;
6. faire une revue juridique si une licence ou obligation reste ambiguë.

## 4. CC-BY-4.0

`caniuse-lite@1.0.30001803` est déclaré `CC-BY-4.0` dans le lockfile.
Le statut exact de redistribution et l'attribution requise doivent être validés sur le bundle final et la source upstream. Aucune conclusion commerciale n'est tirée du seul lockfile.

## 5. Gate

- inventaire technique : **TERMINÉ** ;
- NOTICE final : **PREUVE MANQUANTE** ;
- droits assets : **PREUVE MANQUANTE** ;
- autorisation release commerciale fondée sur ce fichier seul : **BLOQUÉ**.


## 6. Preuve CI du bundle candidat — 2026-10-07

Référence :
`docs/MODARYX-V2-CI-BUNDLE-SBOM-EVIDENCE-20261007.md`.

Sur une exécution dont le delta depuis la branche produit ne contient que les workflows de preuve :
- build + `test:sites` : **TERMINÉ** ;
- bundle : **15 fichiers** ;
- SBOM CycloneDX 1.5 : **66 composants** ;
- 66 packages npm installés sur le runner sur 115 chemins package du lockfile multi-plateforme ;
- classification conservatrice : **4 BUNDLED_OR_RUNTIME / 59 BUILD_ONLY / 3 UNKNOWN** ;
- textes LICENSE/NOTICE locaux récupérés : **62/66**.

Candidats runtime/bundled prouvés par rôle :
- `@phosphor-icons/react@2.1.10` — MIT ;
- `react@19.2.0` — MIT ;
- `react-dom@19.2.0` — MIT ;
- `scheduler@0.27.0` — MIT.

`caniuse-lite@1.0.30001803` est confirmé `CC-BY-4.0` et classé **BUILD_ONLY** par la fermeture de dépendances des racines Vite/plugin React. Son texte `LICENSE` exact a été récupéré, SHA-256 :
`fd3a263fe19ed8faa9068b43abaebafc02c77897b0c6fc09abc04bb592e5f16e`.

Cette classification de rôle réduit le risque d'attribution dans le produit final mais ne remplace pas une preuve module→bundle minifié. Le NOTICE final reste donc **EN COURS** et non un PASS release.
