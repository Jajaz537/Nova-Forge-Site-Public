# MODARYX V2 — ASSET PROVENANCE EVIDENCE — 2026-10-07

**Statut : EN COURS — provenance partielle récupérée / commercial rights toujours PREUVE MANQUANTE**

## 1. Principe

L'historique Git peut prouver une chaîne interne de création/import/derivation.
Il ne suffit pas, à lui seul, à prouver la titularité des droits ni une licence commerciale.

Le registre machine-readable reste :
`docs/MODARYX-V2-ASSET-RIGHTS-REGISTER-20261007.json`.

## 2. Marque MODARYX — preuve partielle

`assets/modaryx-mark.svg` possède un historique de création/modification dans le dépôt :
- `d2547af939fe374ea9ef0b93c4fa65382b98be1f` — bascule visible vers la marque MODARYX ;
- `14142306a9d160fc2ebc01486167853bc27dcdf2` — modification géométrique du M directement dans le SVG.

Le favicon et la copie V2 utilisent le même blob que le SVG racine actuel.

**Conclusion : PARTIAL_EVIDENCE.**
L'historique de commit ne prouve pas à lui seul l'auteur juridique ni une éventuelle cession de droits.

## 3. Hero Loup/Dragon et portails — source fournie retrouvée

Le commit `c8c163799a46f8c4ec780d6a5189eb57865cb932` documente dans `qa/DESIGN-DECISIONS.md` :
- archive source fournie : `Nova_Forge_5_Nouveaux_Concepts_Loup_Dragon(1).rar` ;
- second envoi identique ;
- SHA-256 archive : `c7592976adc53de0d5fb6f98bc1454c73d741bd0215fcd1398e047ececfb6532` ;
- cinq PNG extraits ;
- références 02 (accueil), 03 (portails) et 01 (compagnons) inspectées/adaptées.

Les fichiers `assets/modaryx-wolf-dragon-hero.webp` et `assets/modaryx-world-portals.webp` sont introduits dans ce même commit.

**Conclusion : chaîne source interne PARTIELLEMENT PROUVÉE.**
Toujours manquant :
- auteur/créateur original des cinq PNG ;
- outil/générateur ;
- conditions/licence ;
- preuve de droit commercial, modification et redistribution.

## 4. Vista réduite

Le commit `806a4fe4636da907afd8a6a12e22e83a71bcabbe` indique que
`assets/modaryx-realm-vista-reduced.webp` est dérivé d'un panorama existant approuvé et que la scène/géographie n'a pas été redessinée.

**Conclusion : relation de dérivation PROUVÉE ; droits de la source toujours PREUVE MANQUANTE.**

## 5. Living Threshold V2

Le commit `33405e93bae60ccfc4b84362f3102c578d100ab9` documente :
- un prototype V2 autonome ;
- des assets « générés spécifiquement » ;
- des raster assets générés dédiés ;
- une source visuelle de vérité :
  `C:\Users\steph\.codex\generated_images\01a1033a-47d2-7910-92b8-05aa89cfb208\exec-197fd322-f242-4a81-a337-91f52572641b.png`.

Les blobs de `living-threshold-content-sheet.png` et `living-threshold-hero.png` ont ensuite été recopiés du prototype/review vers preview puis V2 produit.

**Conclusion : provenance de workflow PARTIELLEMENT PROUVÉE.**
Toujours manquant :
- générateur/modèle exact ;
- compte/outil et conditions applicables au moment de la génération ;
- éventuelles références tierces ;
- confirmation de droit commercial/redistribution.

## 6. Living-world growth layers

Les commits d'introduction ont été retrouvés pour :
- environnement premium ;
- wolf baby/juvenile/adolescent/young-adult/adult ;
- dragon baby/juvenile/adolescent/young-adult/adult.

Ces commits enregistrent les fichiers et, pour plusieurs, leurs SHA-256 dans `SHA256SUMS.txt`, mais ne documentent pas l'auteur, l'outil ou la licence.

**Conclusion : existence/intégrité historique PROUVÉE ; provenance commerciale PREUVE MANQUANTE.**

## 7. Gate

Aucun des éléments ci-dessus n'est passé en `APPROVED` pour les droits commerciaux.

Pour fermer la gate :
1. retrouver les fichiers source ou conversations/exports de génération ;
2. identifier auteur/générateur exact ;
3. conserver les conditions de licence/usage applicables à la date de création ;
4. documenter droit commercial, modification et redistribution ;
5. relier la preuve au blob/hash de l'asset final ;
6. seulement ensuite autoriser `finalReleaseAllowed=true`.

**État : EN COURS / droits commerciaux PREUVE MANQUANTE.**


---

## 7. Variantes PNG de la marque — chaîne Git directe récupérée

Le SVG courant de la marque est modifié au commit :
- `14142306a9d160fc2ebc01486167853bc27dcdf2`
- message : `fix(brand): make MODARYX site mark an unmistakable M`

Le commit immédiatement suivant :
- `2ae5bd279bd3437d74424801ff428e40bc61504c`
- parent exact : `14142306a9d160fc2ebc01486167853bc27dcdf2`
- message : `fix(brand): refresh MODARYX PNG marks with clear M`
- fichiers modifiés uniquement :
  - `assets/modaryx-mark-192.png`
  - `assets/modaryx-mark-512.png`

Cela établit une chaîne interne directe **SVG M → refresh des deux raster PNG**.

État :
- relation de dérivation de marque dans Git : **PARTIAL_EVIDENCE**
- outil de rasterisation exact : **PREUVE MANQUANTE**
- auteur/propriété juridique de la marque : **PREUVE MANQUANTE**
- clearance marque/droits commerciaux : **PREUVE MANQUANTE**
- `finalReleaseAllowed` : **false**

Les copies sous `v2/public/assets/` héritent de cette même chaîne binaire via leurs doublons déjà identifiés dans le registre.
