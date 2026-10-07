# MODARYX V2 — ASSET PROVENANCE INVENTORY — 2026-10-07

**Statut : INVENTAIRE TERMINÉ / PROVENANCE COMMERCIALE PREUVE MANQUANTE**
**Source produit :** `design/modaryx-v2-blue-violet-product-20261005` @ `a7901c795d716d3d03897fd00c2ae91c6940a43f`

## 1. Périmètre

Extensions inspectées dans l'arbre Git :
PNG, JPG/JPEG, WEBP, SVG, ICO, polices, audio, vidéo, Blender/Rive/3D.

Résultat :
- 110 fichiers visuels/média trouvés ;
- 28 classés **candidats produit** ;
- 78 classés **preuves QA/review** ;
- 4 classés **preview** ;
- aucune police/audio/vidéo/3D/Rive trouvée dans cette passe d'extensions.

Cette classification ne vaut pas autorisation commerciale.

## 2. Assets candidats produit

### Identité MODARYX
- `assets/modaryx-mark.svg`
- `assets/modaryx-mark-192.png`
- `assets/modaryx-mark-512.png`
- `favicon.svg`
- `v2/public/assets/modaryx-mark.svg`
- `v2/public/assets/modaryx-mark-192.png`
- `v2/public/assets/modaryx-mark-512.png`

Les copies V2 utilisent les mêmes blobs que les assets racine correspondants.
`favicon.svg` partage le même blob que `assets/modaryx-mark.svg`.

**Provenance commerciale : PREUVE MANQUANTE** jusqu'à registre source/auteur/licence ou preuve de création interne.

### Living world / identité émotionnelle
- `assets/living-world/dragon-adolescent.png`
- `assets/living-world/dragon-adult.png`
- `assets/living-world/dragon-baby.png`
- `assets/living-world/dragon-juvenile.png`
- `assets/living-world/dragon-young-adult.png`
- `assets/living-world/environment-premium.jpg`
- `assets/living-world/wolf-adolescent.png`
- `assets/living-world/wolf-adult.png`
- `assets/living-world/wolf-baby.png`
- `assets/living-world/wolf-juvenile.png`
- `assets/living-world/wolf-young-adult.png`
- `assets/modaryx-realm-vista-reduced.webp`
- `assets/modaryx-wolf-dragon-hero.webp`
- `assets/modaryx-world-portals.webp`

**Provenance commerciale : PREUVE MANQUANTE.**

Ne jamais inférer depuis le rendu qu'un asset est propriétaire, libre de droits ou généré en interne.

### V2 living threshold
- `v2/public/assets/living-threshold-content-sheet.png`
- `v2/public/assets/living-threshold-hero.png`

Des blobs identiques existent dans `review-evidence/` et/ou `v2-preview/`.

**Provenance commerciale : PREUVE MANQUANTE.**

### Legacy / migration de marque
- `assets/forge-field.svg`
- `assets/nova-kingdom-panorama.svg`
- `assets/nova-mark.svg`
- `assets/nova-mark-192.png`
- `assets/nova-mark-512.png`

Classification : **LEGACY / À CLASSIFIER AVANT USAGE OU RETRAIT**.

Ne pas supprimer/renommer globalement :
- vérifier surface utilisateur actuelle ;
- compatibilité ;
- historique/preuves ;
- dépendances ;
- besoin de conservation.

## 3. Assets preview

- living-threshold-content-sheet
- living-threshold-dragon-baby
- living-threshold-hero
- living-threshold-wolf-baby

Présents sous `v2-preview/public/assets/`.

Ces fichiers sont **preview/candidat**, pas preuve production.

## 4. QA / review evidence

78 images sous `qa/` ou `review-evidence/`.

Classification :
**PROVENANCE/HISTORIQUE/PREUVE — ne pas traiter comme asset commercial simplement parce qu'elles sont dans le repo.**

Elles doivent rester préservées lorsqu'elles servent de preuve.

## 5. Registre de droits requis avant commercialisation

Pour chaque asset produit final :
- chemin ;
- SHA-256 ou blob + hash release ;
- nom stable ;
- auteur/créateur ;
- date ;
- outil/source ;
- licence ;
- droit commercial ;
- droit de modification ;
- droit de redistribution ;
- attribution ;
- restrictions ;
- preuve source conservée ;
- statut : APPROVED / BLOCKED / PREUVE MANQUANTE.

## 6. Gate

**TERMINÉ**
- inventaire des médias présents ;
- séparation produit / preview / preuve ;
- détection des doublons blob principaux ;
- classification initiale legacy.

**PREUVE MANQUANTE**
- provenance des logos MODARYX ;
- provenance living-world ;
- provenance living-threshold ;
- licences/attributions ;
- registre final d'assets.

## 7. Règle de lancement

Aucun asset produit avec provenance `PREUVE MANQUANTE` ne doit être utilisé pour justifier un PASS commercial/legal final.

Les captures QA/historiques ne doivent pas être supprimées pour nettoyer le branding.

État : **INVENTAIRE TERMINÉ / RIGHTS CLEARANCE BLOQUÉE PAR PREUVES.**
