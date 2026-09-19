# Revue visuelle cinématique MODARYX — 16 septembre 2026

Ces captures comparent la baseline déployée avant la passe cinématique et le candidat réellement rendu dans Chromium. Elles documentent les quatre premières priorités visuelles : Accueil, Catalogue, fiche projet et Creator Studio.

| Surface | Avant | Après | Portée de la preuve |
|---|---|---|---|
| Accueil — hero | `home-before.webp` | `home-after.webp` | Composition desktop du hero et présence de l’illustration Loup/Dragon |
| Catalogue — ouverture | `catalog-before.webp` | `catalog-after.webp` | Hiérarchie du hero, matière, panneau de contrat et rythme d’ouverture |
| Fiche Ember Textures | `project-before.webp` | `project-after.webp` | Composition du hero de fiche et métadonnées principales |
| Creator Studio — ouverture | `studio-before.webp` | `studio-after.webp` | Hiérarchie du hero après correction de la grille desktop |
| Communauté | `community-before.webp` | `community-after.webp` | Hero, panneau de préparation et identité Loup/Dragon |
| Jeux | `games-before.webp` | `games-after.webp` | Introduction, illustration Portails et rythme des cartes |
| Écosystème | `ecosystem-before.webp` | `ecosystem-after.webp` | Hero, panneau de règles et profondeur cinématique |
| Sécurité | `security-before.webp` | `security-after.webp` | Hero de confiance et hiérarchie des principes |
| Profils | `profiles-before.webp` | `profiles-after.webp` | Hero, panneau de disponibilité et composition |
| Téléchargements | `downloads-before.webp` | `downloads-after.webp` | Hero d’indisponibilité et contrat de publication |
| Vérificateur | `verify-before.webp` | `verify-after.webp` | Hero SHA-256 et panneau de portée de la preuve |
| Documentation | `documentation-before.webp` | `documentation-after.webp` | Hero, portée et appels à l’action |
| Recherche | `search-before.webp` | `search-after.webp` | Hero cinématique après correction de l’échelle typographique |
| 404 | `404-before.webp` | `404-after.webp` | État d’erreur global et actions de retour |

### Passe de finition après le hero

| Surface | Avant | Après | Correction prouvée |
|---|---|---|---|
| Accueil — catalogue intégré | `home-catalog-pass2-before.jpg` | `home-catalog-pass2-after.jpg` | Rythme vertical resserré, repère éditorial et cartes numérotées |
| Catalogue — filtres | `catalog-filters-pass2-before.jpg` | `catalog-filters-pass2-after.jpg` | Filtres réunis en poste de contrôle, matière et hiérarchie renforcées |
| Fiche projet — grille basse | `project-layout-pass2-before.jpg` | `project-layout-pass2-after.jpg` | Suppression du grand vide, grille 2×2 et état sans média assumé |
| Navigation globale — accueil | `home-navigation-before.jpg` | `home-navigation-after.jpg` | Taxonomie alignée sur les 17 routes : Catalogue, Créer, Communauté, Écosystème, Recherche, Sécurité, Aide |
| Profils — groupes impairs | — | `profiles-groups-deployed.jpg` | Derniers groupes étendus sans cellule vide accidentelle ; aucun débordement à 1 348 px |
| Accueil — Smart Profile | `smart-profile-before.jpg` | `smart-profile-after.jpg` | Valeurs et qualifications séparées ; état local réellement déclenché dans Chromium |

### Recaptures du candidat `f884b919`

| Surface | Capture déployée | Vérification |
|---|---|---|
| Communauté — ouverture | `community-f884b919-viewport.jpg` | Direction Loup/Dragon, panneau de préparation et hiérarchie du hero |
| Communauté — cartes et atelier | `community-f884b919-workspace.jpg` | Parcours numéroté visible et continuité avec l’atelier Collection |
| Documentation — ouverture | `documentation-f884b919-viewport.jpg` | Hero cinématique, portée numérotée et navigation contextuelle |
| Sécurité — ouverture | `security-f884b919-viewport.jpg` | Hero cinématique, principes actifs et actions principales |
| Profils — avant profondeur | `profiles-3e8caef-before.jpg` | Écart constaté : hero trop plat face aux autres surfaces |
| Profils — après profondeur | `profiles-b6298ad-after.jpg` | Matière Loup/Dragon restaurée sans nouvel asset ni changement fonctionnel |
| Téléchargements — dernier candidat | `downloads-3e8caef-viewport.jpg` | Hero, état actuel et contrat de publication revérifiés |
| Écosystème — dernier candidat | `ecosystem-3e8caef-viewport.jpg` | Hero, règles actives et parcours revérifiés |

Ces comparaisons ont été recapturées sur les déploiements immuables correspondant aux corrections. La navigation et Profils ont été vérifiés sur `https://17c68919.nova-forge-site-public.pages.dev` au commit `4f772f9`. Smart Profile a été revérifié sur `https://8b62addf.nova-forge-site-public.pages.dev` au commit `9634880`. Communauté, Documentation et Sécurité ont été revérifiées sur `https://9fdb3c34.nova-forge-site-public.pages.dev` au commit `f884b919`. Elles étendent la preuve au-delà des ouvertures, mais ne déclarent pas encore l’ensemble des pages visuellement finalisé.

Le lot a aussi été inspecté sous le hero : résultats du Catalogue, formulaire et aperçu Studio, collections, chaîne de confiance, contrat de téléchargement, outil de vérification, tâches de la documentation et parcours de l’écosystème. Les captures ci-dessus prouvent l’ouverture desktop de chaque surface ; elles ne suffisent pas à certifier tous les états et toutes les sections d’une page.

## Limites

- Captures Chromium distant, pas appareils physiques.
- Les captures ne prouvent pas un lecteur d’écran, le zoom natif ni les Core Web Vitals.
- Une page n’est pas déclarée visuellement finalisée sur la seule base de son hero.
- Le reflow a été mesuré séparément sur les 17 routes à 320 et 768 px, ainsi qu’à 320 px avec expansion synthétique de texte ; ces mesures ne remplacent pas l’inspection des appareils réels.
