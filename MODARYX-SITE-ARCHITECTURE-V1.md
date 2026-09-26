# MODARYX MODS — Architecture publique V1

Réconciliée le 15 septembre 2026 avec `CHECKPOINT-CANONIQUE-NOVA-FORGE-MODARYX-2026-09-15.md`.
**MODARYX est la plateforme web ; Nova Forge désigne les OS Public et Fondateur distincts.**

## Surface existante

Le site reste statique et local-first. Les seize pages initiales sont : accueil, catalogue, recherche, Creator Studio, communauté, profils, écosystème, documentation, sécurité, vérification, téléchargements, fiche générique, trois fiches de démonstration et 404. Les chemins effectifs sont recensés dans `qa/MODARYX-ANTI-OUBLI.md`.

Navigation de découverte : catalogue → fiche → outils pertinents. Navigation d'assistance : documentation, sécurité, vérification. CTA principal : **Explorer les mods** ; CTA contextuel : **Créer un projet**. Aucun CTA de téléchargement actif sans artefact réellement publié dans `downloads.json`.

## Accueil — placements conservés

1. Marque et navigation en haut.
2. Promesse à gauche, aperçu web MODARYX explicitement démonstratif à droite.
3. Découverte des créations et exemples de catalogue.
4. Explication du parcours : explorer, préparer, vérifier.
5. Outils locaux, Creator Studio et collections.
6. Preuves disponibles, limites et assistance contextuelle.
7. Documentation, FAQ, états de disponibilité et footer navigable.

L'ancien libellé « Modaryx OS » décrivait historiquement l'aperçu et un pont applicatif envisagé. Il ne nomme plus un produit actuel. Le pont Nova Forge reste une intégration distincte, déclarée `not_connected` dans `public-status.json` ; il ne doit pas devenir une promesse de service connecté.

## Architecture jeux

- `/games/` : index public combinant les trois jeux du catalogue de démonstration et deux hubs éditoriaux sourcés ; la partie démonstration reste générée depuis `data/catalog.json` avec `python3 qa/build-games-index.py`.
- `/gta-6/`, `/gta-6/mods/`, `/gta-6/guides/` : hub, taxonomie et guides éditoriaux livrés ; aucun support PC/mod, chargeur, compatibilité ou téléchargement n'est inventé.
- `/red-dead-redemption-2/`, `/red-dead-redemption-2/mods/`, `/red-dead-redemption-2/guides/` : hub PC, taxonomie et guides éditoriaux livrés ; aucun fichier RDR2 n'est distribué sans corpus autorisé et vérifiable.
- Modèle extensible à d'autres jeux.

Les trois entrées de `data/catalog.json` restent Skyrim Special Edition, Cyberpunk 2077 et Minecraft, toutes classées `demonstration`. Les six routes GTA VI/RDR2 sont des surfaces éditoriales distinctes du catalogue distribué : elles utilisent du contenu original MODARYX, des liens vers des sources officielles consultées et aucun média tiers copié. Le corpus réel de mods, les droits de redistribution, la compatibilité versionnée et les téléchargements restent des capacités séparées non livrées tant que leurs preuves ne sont pas disponibles.

## Contrat d'une fiche

Nom, jeu, créateur, version, date et résumé ; aperçu autorisé ; compatibilité séparée de la provenance ; prérequis et conflits documentés ; historique et source autorisée lorsqu'ils existent. Toute information absente reste inconnue. Les fiches de démonstration ne fournissent pas de binaires.

## Frontières

Les schémas décrivent des contrats, pas des services réalisés. Le backend communautaire, la publication distante, le Storage Resolver et le Repair Network ne sont pas connectés. Le calcul SHA-256 local ne prouve ni auteur ni innocuité. Les identifiants `nova-*` de schéma, stockage et provenance sont conservés tant qu'une migration compatible n'est pas spécifiée.

`data/integration-readiness.json`, validé par `schemas/integration-readiness.schema.json` et le contrôle source dédié, regroupe les prérequis, permissions, états UI et portes de publication des capacités non connectées. Ce manifeste prépare leur intégration sans créer de faux service, faux compte, faux corpus ou faux artefact.

L'ancien projet getnova/getnovaforge.com est abandonné. Les protections `OLD_DOMAIN_UNTOUCHED` restent actives. Aucun changement DNS, DNSSEC, nameservers, IONOS ou Cloudflare critique ne découle de cette architecture.
