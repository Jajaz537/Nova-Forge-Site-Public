# MODARYX V2 — HANDOFF WORK — BUNDLE / SBOM / THIRD-PARTY — 2026-10-07

**Statut : EN COURS — exécution environnementale requise**
**Base canonique vérifiée avant handoff :** `design/modaryx-v2-blue-violet-product-20261005` @ `f2ebe61655954d39b6230112f890b8bbc0f0ec9a`

Ce runbook transforme le prochain travail logique en tranche exécutable par ChatGPT Work ou un environnement équivalent. Il ne donne aucun PASS par avance.

## 1. Garde-fous absolus

- Ne pas modifier `main`.
- Ne pas déployer.
- Ne pas toucher DNS/DNSSEC/nameservers, domaine production, Cloudflare critique, D1/R2 production, providers production, paiement ou cutover.
- Ne pas activer de tracking/cookies/provider.
- Ne pas inventer de prix, de vendeur, de rôle DSA, de licence ou de droit commercial.
- Ne jamais écraser un worktree, une branche ou des changements non commités d'un autre agent.
- Si le HEAD de `design/modaryx-v2-blue-violet-product-20261005` n'est plus `f2ebe61655954d39b6230112f890b8bbc0f0ec9a`, arrêter cette recette, relire le checkpoint canonique le plus récent et rebaser le plan sur le nouveau HEAD.
- Les assets PRODUCT avec droits manquants restent `finalReleaseAllowed=false`.

## 2. Source de build prouvée

Le candidat V2 est dans `v2/`.

`v2/package.json` :
- `build = "vite build && node scripts/prepare-sites-build.mjs"`
- React 19.2.0
- ReactDOM 19.2.0
- Vite 6.4.2
- @vitejs/plugin-react 5.0.4
- @phosphor-icons/react 2.1.10

Le script `v2/scripts/prepare-sites-build.mjs` exige et prépare :
- `dist/client/index.html`
- `worker/index.js`
- `.openai/hosting.json`
- `dist/server/index.js`
- `dist/.openai/hosting.json`
- mise à jour du shell offline `dist/client/sw-v2.js` lorsqu'il existe.

## 3. Lane A — build candidat, sans déploiement

Dans un clone/worktree propre du SHA exact :

1. enregistrer OS, architecture, `node --version`, `npm --version` et SHA Git ;
2. `cd v2` ;
3. exécuter `npm ci` sans modifier le lockfile ;
4. exécuter `npm run build` ;
5. exécuter seulement les tests ciblés nécessaires au build, notamment `npm run test:sites`, sans lancer une campagne de production ;
6. ne jamais lancer de commande de déploiement.

Si une erreur survient :
**erreur exacte → isolation → correction ciblée uniquement si elle ne change pas le produit → micro-proof → continuation**.
Toute correction source doit passer par une branche/PR séparée ; le handoff lui-même ne doit pas masquer l'échec.

## 4. Lane B — inventaire de l'artefact réellement produit

Sur `v2/dist` généré :

- produire un manifeste récursif : chemin relatif, taille, SHA-256 ;
- distinguer client / server / hosting metadata / service worker ;
- relever tous les JS, CSS, WASM, fonts, images, JSON et autres fichiers distribués ;
- signaler sourcemaps présentes ou absentes ;
- identifier les assets PRODUCT effectivement copiés/embarqués ;
- ne pas considérer une dépendance du lockfile comme redistribuée sans preuve.

Sortie attendue :
`docs/evidence/MODARYX-V2-WORK-BUNDLE-MANIFEST-20261007.json`

## 5. Lane C — dépendances, SBOM et licences

À partir de l'installation exacte réalisée par `npm ci` :

- conserver `npm ls --all --json` ou équivalent comme preuve ;
- produire un SBOM CycloneDX ou SPDX si un outil est disponible sans modifier les manifests du projet ; enregistrer le nom/version de l'outil ;
- classer les composants au minimum en `BUNDLED_OR_RUNTIME`, `BUILD_ONLY`, `UNKNOWN` sur la base de preuves ;
- récupérer pour chaque composant pertinent la version exacte, licence déclarée et fichiers `LICENSE*` / `NOTICE*` présents dans le package installé ;
- pour toute licence/notice absente localement, retrouver la source upstream correspondant exactement à la version et conserver URL + hash du texte récupéré ;
- vérifier explicitement le traitement de `caniuse-lite@1.0.30001803` déclaré `CC-BY-4.0` dans le lockfile ;
- ne pas déclarer le registre THIRD-PARTY final tant que la correspondance avec le bundle candidat n'est pas établie.

Sorties attendues :
- `docs/evidence/MODARYX-V2-WORK-SBOM-20261007.json` ou format standard équivalent ;
- `docs/evidence/MODARYX-V2-WORK-LICENSE-EVIDENCE-20261007.json` ;
- mise à jour candidate, pas PASS automatique, de `docs/MODARYX-V2-THIRD-PARTY-NOTICES-CANDIDATE-20261007.md`.

## 6. Lane D — provenance visuelle

Rechercher dans le workspace, les sources Projet accessibles et l'historique Git :
- auteur ou compte ayant créé chaque asset PRODUCT ;
- outil/générateur et version/modèle si disponible ;
- date et conditions applicables au moment de création ;
- preuve de droit de modification/redistribution/commercialisation ;
- source éditable/originale lorsqu'elle existe.

Ne jamais déduire un droit d'une simple présence dans Git, un chat, un disque ou une archive.
Conserver `PREUVE MANQUANTE` lorsqu'un maillon n'est pas prouvé.

## 7. Résultat / états autorisés

Chaque lane se termine uniquement en :
- `TERMINÉ`
- `EN COURS`
- `BLOQUÉ`
- `PREUVE MANQUANTE`

Aucun résultat de build local/preview/candidat ne vaut production.

## 8. Critère de retour vers la conversation principale

Revenir avec :
- SHA exact exécuté ;
- environnement/outils exacts ;
- commandes réellement lancées ;
- manifeste bundle ;
- SBOM ;
- preuves licences/notices ;
- delta du registre THIRD-PARTY ;
- nouvelles preuves de provenance éventuelles ;
- erreurs/blocages exacts ;
- aucune activation production.

La gate VF TECHNIQUE, la gate COMMERCIALE et la gate LEGAL/COMPLIANCE restent séparées.
