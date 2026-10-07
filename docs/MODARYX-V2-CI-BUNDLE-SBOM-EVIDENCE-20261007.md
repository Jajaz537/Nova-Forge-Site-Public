# MODARYX V2 — CI BUNDLE / SBOM / LICENSE EVIDENCE — 2026-10-07

**Statut : EN COURS — preuve technique ciblée obtenue / release commerciale toujours BLOQUÉE par droits et faits externes**

## 1. Identité de la preuve

Branche produit de référence :
`design/modaryx-v2-blue-violet-product-20261005` @ `175533c149a9bdfd7e4eccd2d4983327d0d0f201`.

Preuve build :
- execution SHA : `0b28efb076744e9cd34bfd47a936a720e1b7dba0`
- GitHub Actions run : `37656319907`
- conclusion : **success**
- delta depuis la branche produit : uniquement `.github/workflows/modaryx-v2-bundle-sbom-evidence.yml`

Micro-preuve licences :
- execution SHA : `f8763c2a4db27916d3ddeac7cd703851fe15a5a0`
- GitHub Actions run : `37657179187`
- conclusion : **success**
- delta depuis la branche produit : uniquement les deux workflows de preuve CI.

Aucun changement produit, déploiement, DNS, paiement, provider ou cutover n'a été effectué.

## 2. Environnement exécuté

- runner GitHub hébergé Linux x86_64
- Node : `v22.23.3`
- npm : `10.9.9`
- installation : `npm ci`
- build : `npm run build`
- micro-tests : `npm run test:sites`

Build + tests ciblés : **TERMINÉ**.

## 3. Bundle candidat réellement produit

Le répertoire `v2/dist` contient **15 fichiers** :

| Fichier | Octets | SHA-256 |
|---|---:|---|
| `.openai/hosting.json` | 31 | `d532abb65cf9ae20634b464d954cb4a08a0de9f3cd3cdf7f9c3ec8948826d947` |
| `client/assets/GameSupportRequestPanel-B7idaXEW.js` | 9213 | `e1c45876fa666141e3c0cdda1d4d6b61dcfaac7a3b82eb1cca4420fa7cf825c2` |
| `client/assets/index-DLdgijQY.js` | 378652 | `43dd0fabfa0c751e09681154b51e335b6815a3ac51de4b6c60cdc4e7468b0331` |
| `client/assets/index-Lpxj3RTs.css` | 118155 | `672958d40974d8c60e8897b86306ae4c5c9b271429876cd2e23f669a4189aec3` |
| `client/assets/living-threshold-content-sheet.png` | 2680314 | `37ded7b5951bb1cbff0b79f93e8705e74822af958aa5777e14f510e8814b66da` |
| `client/assets/living-threshold-hero.png` | 1527079 | `55788962f70288b07bf09d2fdc779261cd3ad6a15d7399efc7b7b5f7638a031d` |
| `client/assets/modaryx-mark-192.png` | 1084 | `06b1dae65f9c0706fabc9b85a46cd3c50d7a5a5d2e6015b2be064b751d7b8189` |
| `client/assets/modaryx-mark-512.png` | 3459 | `38eb20983b8118843446d8a64dd5afa4991f43d927b41703b21b34fc30a1aa40` |
| `client/assets/modaryx-mark.svg` | 331 | `261acad337661d82075248de35bf8e8f935d5b2709b5f9dc0ebdf3740c5d1dfc` |
| `client/assets/RemoteProfileEditor-DhJavDGP.css` | 2294 | `d1df2bf29073912d6b3251b80b96bec0f53875977f4851c93e08af977d7e9178` |
| `client/assets/RemoteProfileEditor-LwacSRqJ.js` | 6406 | `e3d66754844057c1aa469b04a454b188adf277519412f28de5cbb1c764700b5b` |
| `client/index.html` | 861 | `c99d6eb5224b60dd5a10961724e30b342c809ae26464751769efb8382ab3c06f` |
| `client/manifest.webmanifest` | 907 | `f527e6dc1757798c90886404609268f5f43052b1fe83d18e17122abcd61466d3` |
| `client/sw-v2.js` | 2135 | `9bcc7cc5f796ee99742cae9c8eb34f28be101fa91c72f911a8ba4cc73aa2dff1` |
| `server/index.js` | 4126 | `9dcbf7b7a4a53cb7ecb37baa402a40e0cd3245ce33cedc00724794d7733b6584` |

Manifeste de preuve SHA-256 :
`d9e6267f936f97431c6c9ef1fa857a142806672837a8b07da9c662e47d0070c3`.

## 4. SBOM npm

`npm sbom --sbom-format cyclonedx` : **TERMINÉ**, exit code 0.

- format : CycloneDX
- specVersion : 1.5
- composants : **66**
- SHA-256 du SBOM : `ff1c013666b93d27876ac4cf81d41e4e31fca3a0426aae9362429f56ca119e61`

Le lockfile contient 115 chemins package hors racine, mais seulement 66 composants ont été installés sur ce runner Linux ; les packages optionnels multi-plateformes non installés ne doivent pas être confondus avec la redistribution réelle de ce run.

## 5. Classification conservatrice des 66 packages installés

Micro-preuve corrigée :
- **4 BUNDLED_OR_RUNTIME**
- **59 BUILD_ONLY**
- **3 UNKNOWN**

BUNDLED_OR_RUNTIME :
- `@phosphor-icons/react@2.1.10` — MIT — LICENSE SHA-256 `6918b72504641180600cbbd4a86b0dfa9dfccf788775694325b71b9a029f6eb4`
- `react@19.2.0` — MIT — LICENSE SHA-256 `da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93`
- `react-dom@19.2.0` — MIT — même texte MIT hashé
- `scheduler@0.27.0` — MIT — même texte MIT hashé

UNKNOWN :
- `@esbuild/linux-x64@0.25.12` — MIT
- `@rollup/rollup-linux-x64-gnu@4.62.2` — MIT
- `@rollup/rollup-linux-x64-musl@4.62.2` — MIT

Les trois UNKNOWN sont des binaires natifs de tooling installés sur le runner. Leur rôle de redistribution produit n'est pas prouvé.

Répartition licences déclarées des 66 packages installés :
- MIT : 58
- ISC : 5
- Apache-2.0 : 1
- BSD-3-Clause : 1
- CC-BY-4.0 : 1

Textes LICENSE/NOTICE récupérés localement pour **62/66** packages installés.
Absence de texte local racine constatée pour les trois UNKNOWN ci-dessus et `jsesc@3.1.0` (BUILD_ONLY).

La classification est fondée sur la fermeture de dépendances des racines runtime vs build ; elle ne remplace pas une preuve source-map/metafile de chaque module inclus dans le JS minifié.

## 6. caniuse-lite

`caniuse-lite@1.0.30001803` :
- licence déclarée : **CC-BY-4.0**
- classification conservatrice : **BUILD_ONLY**
- fichier local : `LICENSE`
- SHA-256 du texte de licence : `fd3a263fe19ed8faa9068b43abaebafc02c77897b0c6fc09abc04bb592e5f16e`

Le SBOM CycloneDX confirme aussi l'identité, la version et la licence CC-BY-4.0.

Conséquence : le risque d'attribution dans le produit final est réduit par cette preuve de rôle build-only, mais la classification n'est pas présentée comme une preuve binaire absolue de non-inclusion.

## 7. Assets visuels effectivement redistribués

Le bundle candidat contient exactement cinq assets visuels PRODUCT venant de `v2/public/assets` :
- `living-threshold-content-sheet.png`
- `living-threshold-hero.png`
- `modaryx-mark-192.png`
- `modaryx-mark-512.png`
- `modaryx-mark.svg`

Cross-check avec `docs/MODARYX-V2-ASSET-RIGHTS-REGISTER-20261007.json` :
- les deux Living Threshold ont **PARTIAL_EVIDENCE** de création spécifique au prototype, mais auteur/générateur/conditions/droits commerciaux restent **PREUVE MANQUANTE** ;
- le SVG MODARYX a **PARTIAL_EVIDENCE** d'historique vectoriel in-repo, mais droits commerciaux restent **PREUVE MANQUANTE** ;
- les PNG MODARYX 192/512 restent **PREUVE MANQUANTE** pour provenance commerciale ;
- les cinq restent `finalReleaseAllowed=false`.

Les autres assets PRODUCT du registre ne sont pas prouvés comme redistribués par ce bundle exact.

## 8. Gate

- build candidat + tests Sites ciblés : **TERMINÉ**
- manifeste bundle : **TERMINÉ**
- SBOM npm candidat : **TERMINÉ**
- collecte locale LICENSE/NOTICE installée : **TERMINÉ pour 62/66 ; PREUVE MANQUANTE pour 4**
- mapping rôle packages : **EN COURS** car la preuve exacte module→bundle minifié n'est pas complète
- droits des 5 visuels redistribués : **BLOQUÉ / PREUVE MANQUANTE**
- THIRD-PARTY final release : **EN COURS**
- production : **aucun changement**

Les trois gates globales restent indépendantes.
