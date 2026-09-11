# MODARYX MODS — Site VF Premium HD

## Règle de travail

La version finale du site doit intégrer les idées produit pertinentes avant gel visuel. Le design final ne doit pas déplacer arbitrairement les blocs déjà décidés : il conserve la hiérarchie et les placements structurants, puis améliore finition, profondeur, cohérence, responsive, accessibilité et performance.

## Direction visuelle verrouillée

- Univers sombre graphite / noir profond.
- Accents métal doré / ambre forgé, avec bleu guide utilisé avec parcimonie.
- Identité MODARYX MODS nette, premium, technique et gaming sans surcharge.
- Hero : texte principal à gauche, aperçu Modaryx OS à droite.
- Barre de navigation premium et discrète en haut.
- Rythme éditorial large, grandes respirations, cartes profondes et bordures fines.
- Animations légères, respect de `prefers-reduced-motion`, aucun effet gadget.
- Pas de dépendance à des polices ou images distantes obligatoires.

## Inventaire fonctionnel à préserver / finaliser

### Déjà présent ou partiellement présent
- Catalogue multigaming.
- Creator Studio / Universal Mod Manifest.
- Profils et communauté locale/exportable.
- Provenance, signatures et états de confiance fail-closed.
- Smart Profile local.
- Modaryx Guide.
- Téléchargements, documentation, sécurité, vérification.
- Pont conceptuel avec Modaryx OS Public.

### À intégrer avant VF
- Hubs de jeux structurants : GTA 6 en pilier principal, Red Dead Redemption 2, puis architecture extensible à d’autres jeux.
- Pages `/jeu/mods/`, catégories, guides et pages de mods individuelles.
- Navigation et recherche pensées d’abord pour découvrir jeux, mods et outils.
- SEO propre par jeu/catégorie/mod, sans pages vides ou spammy.
- Données structurées utiles et cohérentes avec le contenu réellement publié.
- Mise à jour complète sitemap/robots/canoniques pour `modaryxmods.com`.
- Nettoyage final des références de marque Nova Forge visibles ou publiques ; conserver les noms internes historiques seulement lorsqu’ils protègent compatibilité/provenance.
- Design system MODARYX harmonisé sur toutes les pages, pas seulement l’accueil.
- Responsive mobile/tablette/desktop premium.
- Accessibilité clavier, contraste et réduction de mouvement.
- Budget de performance : HTML/CSS/JS statique léger, images optimisées, pas d’assets décoratifs excessifs.

## Ordre d’intégration

1. Audit complet des idées ChatGPT + GitHub + surface actuelle.
2. Architecture informationnelle jeux / mods / guides / outils.
3. Design system final MODARYX et shell global.
4. Accueil Premium HD en conservant les placements décidés.
5. Hubs GTA 6 et RDR2 + catégories / modèles de pages mod.
6. Harmonisation catalogue, recherche, Creator Studio, communauté, profils, sécurité, docs, téléchargements.
7. SEO technique, sitemap, robots, canoniques, manifest.
8. QA responsive, accessibilité, performance et régression.
9. Mise en production par changements ciblés et vérifiés.

## Infrastructure séparée

Le chantier design/contenu peut avancer pendant l’attente du DS DNSSEC IONOS. Aucune suppression de `getnovaforge.com` dans Cloudflare avant DNSSEC `modaryxmods.com` complètement validé et preuve HTTPS fraîche.
