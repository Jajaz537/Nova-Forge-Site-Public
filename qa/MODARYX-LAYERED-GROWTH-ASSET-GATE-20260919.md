# MODARYX — garde d’intégration des assets de croissance — 19 septembre 2026

Statut : **EN COURS — preuve CI requise avant intégration**.

Cette garde empêche de déclarer la croissance visuelle `ready` tant que le bundle réellement présent dans le dépôt n’est pas complet et cohérent.

En état `awaiting-assets`, l’environnement et les dix chemins de stades doivent rester `null`. Aucun chemin d’asset fictif n’est autorisé.

En état `ready`, la garde exigera :

- un environnement séparé ;
- cinq couches loup + cinq couches dragon ;
- chemins sous `./assets/living-world/` uniquement ;
- fichiers réellement présents ;
- dimensions exactement égales au canevas `1600 × 900` ;
- environnement : PNG, JPEG ou WebP reconnu ;
- couches loup/dragon : PNG ou WebP avec transparence alpha obligatoire ;
- chemins uniques.

En état `awaiting-assets`, tout fichier candidat `environment-*` déjà présent est également contrôlé sur son format lisible et ses dimensions `1600 × 900`, sans pour autant être activé.

La garde ne fabrique aucun visuel et ne remplace pas une recette humaine de cohérence artistique.
