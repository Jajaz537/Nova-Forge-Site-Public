# MODARYX V2 — comparaison visuelle normalisée du Game Hub canonique

**Date : 2026-10-05**  
**Statut : PROVEN — comparaison structurelle normalisée / pas de claim pixel-perfect**

## Référence humaine

Capture approuvée par l'utilisateur le 5 octobre 2026 :

- nom conversation : `Image ChatGPT 5 oct. 2026, 19_33_06.png`
- dimensions : **1487 × 1058**
- SHA-256 : `9d7a709fe5091aeee3f7f1755f8883991a739a281e8d1c4a2034b5614dad380e`

Décision associée :
`docs/MODARYX-V2-DESIGN-CANON-20261005.md`

## Candidat comparé

Branche :
`design/modaryx-v2-blue-violet-product-20261005`

Commit visuel :
`cb1ed7973efec1b9a10535c6f4a85e191ecb1f56`

Workflow :
`MODARYX V2 Living Threshold Visual Proof`

Run :
`37363048084` — **SUCCESS**

Artifact :
`11366899033`

Digest artifact :
`sha256:4206f5d073aa6eb04d89e5eb6af618e4b5a2b835aacf294f693cd6b04031d512`

Capture desktop :
- dimensions : **1440 × 1024**
- SHA-256 : `6b93bc1f9ba5b2c34e3e40e76e574b7bb1fecf99af8dbeb96919f1cdde7adeb7`

## Normalisation

Les deux captures ont un ratio pratiquement identique :
- référence : ~1.4055 ;
- candidat : 1.40625.

La comparaison porte donc sur la structure relative, la hiérarchie et la famille visuelle, et non sur un diff pixel-à-pixel dépendant des assets/images de démonstration.

## Éléments alignés

Le candidat reproduit la structure canonique validée :

- topbar MODARYX sombre ;
- navigation principale Découvrir / Jeux / Mods & contenus / Collections / Créateurs / Communauté ;
- bouton Démonstration ;
- bandeau contextuel de jeu ;
- vignette jeu à gauche ;
- titre + version ;
- recherche dans le jeu ;
- CTA Explorer les contenus ;
- second onglet visible comme **Pour votre version** ;
- contenu principal sous le bandeau ;
- liste desktop dense sur une colonne ;
- rail droit **Mes profils pour ce jeu** ;
- quatre profils : Exploration / Graphismes / Gameplay / Immersion ;
- palette bleu nuit + violet premium.

## Différences intentionnelles / non bloquantes

- nom fictif actuel : Aetherlands au lieu d'Aurelian Vale ;
- illustrations originales MODARYX différentes de la capture de référence ;
- contenu textuel de démonstration propre au prototype ;
- quelques utilitaires supplémentaires restent accessibles pendant la migration afin de ne pas casser les flows prouvés ;
- la comparaison ne revendique pas une copie pixel-perfect ni l'usage d'assets éditeurs.

## Conclusion

La **famille structurelle et visuelle** choisie humainement est maintenant matérialisée et prouvée par capture fraîche sur le code courant.

Cette preuve ferme uniquement le blocker `normalized-visual-comparison`.

Elle ne ferme pas :
- `human-multiscreen` ;
- `human-mobile` ;
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques ;
- gates backend/production/cutover.

**Résultat : PASS_NORMALIZED_VISUAL_COMPARISON_STRUCTURE**
