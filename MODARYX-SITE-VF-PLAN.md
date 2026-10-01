# MODARYX MODS — Plan de finition Premium HD

Actualisé le 15 septembre 2026 d'après le checkpoint canonique. **Site MODARYX ; OS Nova Forge.** Le candidat est la PR brouillon #12, sans promotion implicite.

## Direction conservée

Graphite profond, métal doré/ambre et bleu Guide discret. Texte du hero à gauche, aperçu web MODARYX à droite. Hiérarchie, proportions, surfaces nuancées, bordures fines et cohérence des contrôles priment sur les effets. Motion courte, `prefers-reduced-motion` prioritaire, assets locaux, mobile recomposé. L'ancien libellé « aperçu Modaryx OS » est historique.

## Ordre de consolidation

1. Revue des idées explicitement retenues et des écarts : `qa/MODARYX-ANTI-OUBLI.md`.
2. Fondations, shell, navigation, contrôles et états communs.
3. Accueil : produit compréhensible, démonstration explicite, parcours et CTA réels.
4. Harmonisation des seize pages existantes : catalogue, recherche, Creator Studio, communauté, profils, écosystème, documentation, sécurité, téléchargements, vérification, fiches et 404.
5. Hubs GTA 6/RDR2 et modèle jeux/catégories/guides : toujours retenus, actuellement absents. Préparer un contenu substantiel et sourcé avant publication ; ne pas inventer disponibilité ou compatibilité de mods.
6. SEO adapté aux routes réellement publiées. Examiner toute modification des canoniques, sitemap, robots ou manifest séparément avant application.
7. Revue visuelle responsive, clavier, contraste, contenu, états et régression ; preuves liées au candidat exact.
8. Candidat consolidé et revue finale ; publication uniquement après autorisation applicable et preuves suffisantes.

## Limites fonctionnelles à préserver

Le catalogue est démonstratif et aucun artefact téléchargeable n'est publié. Creator Studio et communauté produisent des brouillons locaux ; la conformité JSON n'atteste pas leur provenance. Smart Profile n'est pas un benchmark. Les profils disposent de contrats et d'une détection WebAuthn, pas d'un service de comptes. Guide, pont Nova Forge, publication distante, Storage Resolver et Repair Network ne doivent pas être présentés comme connectés.

## Porte de sortie du design

Pour chaque page : état initial, modifications, responsive, accessibilité, contenu, navigation, cohérence visuelle et preuves. Statuts autorisés : **TERMINÉ / EN COURS / BLOQUÉ / PREUVE MANQUANTE**. Un build ou une PR seuls ne ferment aucune revue visuelle.

Clôturer exige la revue des seize pages, des états vide/erreur/loading/succès pertinents, des largeurs mobile/tablette/desktop, de la navigation clavier et des labels, du zoom et du mouvement réduit, des assets/droits et des liens, plus les mesures de performance effectivement exécutées. Les limites non testées restent visibles. Les idées retenues encore manquantes empêchent de déclarer la VF complète sans décision explicite.

## Infrastructure hors périmètre

La consigne historique « supprimer getnovaforge.com après DNSSEC et HTTPS » est révoquée pour ce chantier. Getnova est abandonné ; aucune suppression, activation, bascule de domaine ou modification DNS/DNSSEC/nameservers/IONOS/Cloudflare critique n'est autorisée ici. Conserver les protections `OLD_DOMAIN_UNTOUCHED` et les fichiers de déploiement.
