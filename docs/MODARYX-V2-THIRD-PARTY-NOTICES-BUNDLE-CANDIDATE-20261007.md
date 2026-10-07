# MODARYX V2 — THIRD-PARTY NOTICES — BUNDLE CANDIDATE — 2026-10-07

**Statut : EN COURS / CANDIDATE / NON RELEASE-READY**

Baseline du bundle prouvé :
`175533c149a9bdfd7e4eccd2d4983327d0d0f201`.

Preuve exacte module → chunks :
- run GitHub Actions `37657712033`
- Vite 6.4.2 / Rollup `chunk.modules`
- packages npm présents dans les chunks client : **4**
- worker serveur : aucun import npm tiers.

Ce fichier couvre le périmètre npm redistribué prouvé de ce candidat. Il ne couvre pas les droits des assets visuels, qui restent un blocker séparé.

## @phosphor-icons/react 2.1.10

Licence : MIT

Fichier source de licence installé :
- `LICENSE`
- SHA-256 : `6918b72504641180600cbbd4a86b0dfa9dfccf788775694325b71b9a029f6eb4`

MIT License

Copyright (c) 2020 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## React 19.2.0 / ReactDOM 19.2.0 / Scheduler 0.27.0

Licence : MIT

Les trois packages installés contiennent un texte `LICENSE` identique :
- SHA-256 : `da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93`

MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## caniuse-lite

`caniuse-lite@1.0.30001803` est installé dans l'environnement de build et déclaré CC-BY-4.0.

Preuves :
- LICENSE local SHA-256 `fd3a263fe19ed8faa9068b43abaebafc02c77897b0c6fc09abc04bb592e5f16e`
- `CANIUSE_LITE_IN_CHUNKS false` dans la preuve Rollup/Vite.

Classification pour ce candidat : **BUILD_ONLY / non observé dans les chunks client**.

Il n'est donc pas inclus dans le présent NOTICE de composants npm redistribués, mais sa preuve de licence build-time reste conservée dans le dossier d'audit.

## Blockers restant avant THIRD-PARTY final

- figer le SHA de release réel ;
- reproduire la preuve module→bundle sur ce SHA si le code/lockfile change ;
- attacher ce NOTICE au packaging réel selon la forme de distribution retenue ;
- fermer les droits commerciaux des cinq assets PRODUCT présents dans le bundle ;
- revue finale des autres contenus non-npm distribués.

Les cinq assets visuels du bundle restent `finalReleaseAllowed=false`. Ce document ne les autorise pas.
