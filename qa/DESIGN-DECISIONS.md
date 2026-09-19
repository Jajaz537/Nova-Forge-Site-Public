# MODARYX — décisions et références de finition

Statut : candidat, direction artistique encore soumise à la recette complète. Aucune équivalence de qualité avec un produit tiers n'est certifiée.

## Continuité réelle

La Master NDI récupérée, datée du 12 septembre 2026, contient NDI-001 à NDI-018, et non les 46 entrées annoncées dans le brief. Version étendue : NON RÉCUPÉRÉE. Les principes applicables retenus sont les textes et états narrables (004), les signaux non exclusivement colorés (005), les fallbacks Unicode (010), les tokens communs (011), les mesures séparées des promesses (016). Les recommandations moteurs ne sont pas transposées en dépendances du site.

## Principes → décisions MODARYX

| Source | Méthode documentée | Application originale | Preuve |
|---|---|---|---|
| Linear, Charlie Aufmann / Maxime Heckel, 12 mars 2026, https://linear.app/now/behind-the-latest-design-refresh | Hiérarchie des actions, réduction du bruit, vérification dans l'interface | Navigation et pied de page cohérents, surfaces graphite, or réservé aux actions, JSON communautaire accessible par détails natifs | Méthode CONFIRMÉE ; transposition RECOMMANDATION |
| Raycast, Thomas Paul Mann, 14 mai 2026, https://www.raycast.com/blog/the-new-raycast | Reprise cohérente des composants et des interactions quotidiennes | Recherche locale explicite, retours clavier, préservation des brouillons et absence de faux succès stockage | Méthode CONFIRMÉE ; transposition RECOMMANDATION |
| Vercel, https://vercel.com/geist/introduction | Fondations communes, typographie, couleurs et composants | Échelle de surfaces existante conservée, alignements communs, focus de 3px et dimensions tactiles | Capacité CONFIRMÉE ; transposition RECOMMANDATION |
| Framer, https://www.framer.com/help/articles/troubleshooting-animation-issues/ | Respect du mouvement réduit système | Mouvement réduit prioritaire ; pas d'animation décorative continue ajoutée | Capacité CONFIRMÉE ; transposition RECOMMANDATION |
| Stripe, https://stripe.com/blog/connect-front-end-experience | Présentation produit au service d'un récit | Parcours Explorer / Créer, liens vers des outils réels et aperçus conceptuels explicitement qualifiés | Méthode historique CONFIRMÉE ; transposition RECOMMANDATION |

Ces sources ne donnent aucune permission de copier leur marque, leurs assets ou leur composition. Aucun asset tiers n'a été importé. Figma et Adobe n'ont pas été utilisés ni revendiqués dans ce lot : le rendu réel du navigateur a été la source de décision.

## Modifications observables

- Seize pages : espaces, titres, formulaires, pied de page, fil d'Ariane et surfaces harmonisés.
- Desktop 1181–1320 px : destinations principales directement visibles après vérification de largeur.
- Accueil : équilibre texte/aperçu, titres équilibrés, actions conservées dans la première composition.
- Communauté : données JSON repliables au clavier ; texte de brouillon simplifié ; aucune donnée masquée irréversiblement.
- Erreurs : refus du stockage, import invalide et métadonnées périmées n'affichent plus de réussite.

## Limites de la direction

Les démonstrations ne deviennent pas des produits distribués. Les galeries de mods restent sans médias autorisés, les hubs GTA6/RDR2 ne sont pas réalisés, et le Guide n'est pas connecté. Ces écarts restent visibles dans le registre anti-oubli. L'objectif « ultra haut de gamme » reste une exigence de recette, pas une mesure obtenue par un simple contrôle de largeur.

## Référence prioritaire Loup/Dragon — correction utilisateur

Source fournie : `Nova_Forge_5_Nouveaux_Concepts_Loup_Dragon(1).rar`. Le second envoi est identique, SHA-256 `c7592976adc53de0d5fb6f98bc1454c73d741bd0215fcd1398e047ececfb6532`. Les cinq PNG ont été extraits ; 02 (accueil), 03 (portails) et 01 (compagnons) inspectés visuellement. Les concepts OS 04/05 ne sont pas transposés en fonctionnalités web.

Cette direction remplace l'exploration intermédiaire de sculpture métallique, conservée hors du candidat. Priorité : complicité loup/dragon, citadelle et cascades, portails de pierre, anthracite, or et braise, bleu secondaire. Linear/Raycast/Vercel et les autres références restent des sources de finition uniquement. Le branding public demeure MODARYX MODS ; aucun remplacement global de contrats historiques.

Deux illustrations ont été produites avec ImageGen intégré à partir des références fournies, puis converties en WebP avec ImageMagick. Le texte et la navigation sont du HTML, séparés des images décoratives, sans animation permanente. Les visuels ne prouvent pas une fonctionnalité, une intégration jeu ou une distribution disponible. Figma et Adobe ne sont pas revendiqués.

Prompts de production : (1) panorama fidèle aux compagnons jeunes loup argenté et dragon noir/or aux yeux bleus, ensemble à droite sur une roche sombre, citadelle, cascades et montagnes au couchant, gauche calme pour texte HTML, aucun texte/logo/UI ; (2) trois portails de pierre, atelier ambre à gauche, citadelle centrale, forêt bleue à droite, monde et lumière de la référence 03, sans texte/UI/personnage additionnel.

Accueil : illustration immersive et titre éditorial serif. Écosystème : panorama des portails et trois vrais parcours Créer/Explorer/Rassembler. Les formulaires, états et contrats existants sont conservés. Les titres des seize pages partagent la famille typographique ; pas de décor lourd dans les champs ou tableaux.

- `assets/modaryx-wolf-dragon-hero.webp` : 212218 octets.

- `assets/modaryx-world-portals.webp` : 180174 octets.

## Finition d'interaction partagée — 19 septembre 2026

Lot ciblé de finition VF sur les 16 pages secondaires qui chargent `assets/modaryx-cinematic-system.css`.

Décisions :

- la navigation de section sticky suit désormais la **hauteur réellement mesurée du header** via `--modaryx-header-height`, au lieu d'un `76px` fixe ;
- les élévations au survol sont limitées aux périphériques disposant d'un **hover précis** afin d'éviter les états collants/décalages sur tactile ;
- les cartes reçoivent un état `:focus-within` premium équivalent pour le clavier, sans imposer de déplacement ;
- les surfaces avec blur ajoutent les préfixes Safari `-webkit-backdrop-filter` ;
- le voile de grille ajoute `-webkit-mask-image` ;
- la navigation horizontale mobile limite le sur-scroll et conserve le défilement tactile natif ;
- le contrôle Site First impose désormais la présence du système cinématique partagé sur toutes les pages secondaires.

Le home conserve son système visuel dédié et n'est pas forcé à charger cette feuille secondaire.

