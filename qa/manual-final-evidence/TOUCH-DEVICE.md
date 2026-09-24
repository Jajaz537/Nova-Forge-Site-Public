# Preuve manuelle — Tactile sur appareil physique

**Preview :** https://6f813d33.nova-forge-site-public.pages.dev  
**État avant test :** PREUVE MANQUANTE

## Routes minimales

- `index.html`
- `catalog.html`
- `search.html`
- `creator-studio.html`
- `community.html`
- `profiles.html`
- `games/index.html`
- `gta-6/index.html`
- `red-dead-redemption-2/index.html`

## Procédure

Sur téléphone/tablette réel :

1. Ouvrir la route.
2. Utiliser **uniquement le tactile**.
3. Ouvrir et fermer le menu principal.
4. Activer plusieurs liens et boutons.
5. Tester champs, filtres, selects, toggles et formulaires disponibles.
6. Faire défiler toute la page jusqu'au footer.
7. Vérifier que les contrôles ne nécessitent pas un hover souris.
8. Vérifier qu'aucun élément fixe ne bloque durablement le contenu.
9. Passer portrait ↔ paysage sur au moins Accueil, Catalogue, Community et Profiles.
10. Tester le retour arrière du navigateur.

## Résultat attendu

- cibles tactiles actionnables ;
- aucun contrôle inaccessible ;
- pas de hover-only bloquant ;
- menu stable ;
- formulaires utilisables ;
- pas de scroll horizontal global ;
- rotation sans perte de contenu ;
- footer atteignable ;
- aucune action critique déclenchée involontairement par simple scroll.

## Échec

- bouton trop petit ou impossible à toucher ;
- menu qui se ferme/ouvre de façon incontrôlable ;
- overlay qui empêche de scroller ;
- formulaire impossible au tactile ;
- contenu inaccessible en portrait ou paysage ;
- fonctionnalité essentielle dépendant uniquement du survol.

## Preuve

Une vidéo de parcours tactile est préférable, avec au moins :

- accueil + menu ;
- catalogue ;
- formulaire/interaction ;
- rotation ;
- navigation jusqu'au footer.

Nom conseillé :

`touch-physical-<device>-03e4185.mp4`
