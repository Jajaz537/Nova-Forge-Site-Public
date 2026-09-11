# MODARYX MODS — Architecture publique V1

## Navigation principale

1. Mods
2. Jeux
3. Créer
4. Communauté
5. Sécurité
6. Documentation

CTA principal : `Explorer les mods`.
CTA secondaire contextuel : `Créer un projet` ou `Télécharger Modaryx OS Public` lorsque réellement disponible.

## Accueil — placement conservé

1. Header / navigation.
2. Hero : promesse à gauche, aperçu Modaryx OS à droite.
3. Rail de confiance.
4. Bloc jeux phares.
5. Bloc catalogue / mods en vedette.
6. Bloc Modaryx OS / expérience unifiée.
7. Bloc sécurité & provenance.
8. Bloc Creator Studio / créateurs.
9. Bloc Modaryx Guide.
10. Bloc communauté.
11. Téléchargements / documentation.
12. Footer riche avec navigation et informations de confiance.

## Architecture jeux

- `/games/` : index jeux.
- `/gta-6/` : hub jeu.
- `/gta-6/mods/` : hub mods GTA 6.
- `/gta-6/mods/<categorie>/` : catégories substantielles uniquement.
- `/gta-6/guides/` : guides d'installation, compatibilité et sécurité lorsque publiables.
- `/red-dead-redemption-2/` : hub jeu.
- `/red-dead-redemption-2/mods/` : hub mods RDR2.
- Même modèle extensible à d'autres jeux sans générer de pages vides.

## Fiche mod

- Nom + jeu + créateur.
- Galerie/aperçu local ou autorisé.
- Version, date, compatibilité.
- Résumé clair.
- Provenance, hash/signature lorsque disponible.
- État de confiance séparé de la compatibilité.
- Installation / prérequis / conflits connus.
- Historique des versions.
- Téléchargement ou source/mirror autorisé.
- Liens vers mods similaires et catégories pertinentes.

## Règles de qualité

- Pas de faux contenu ni de faux volume de catalogue.
- Pas de page SEO vide créée uniquement pour un mot-clé.
- Les informations inconnues restent explicitement inconnues.
- Le design final doit être cohérent entre accueil, catalogue, hubs jeux, fiches mods et outils.
