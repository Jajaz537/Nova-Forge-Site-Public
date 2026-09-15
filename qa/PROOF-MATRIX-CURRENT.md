# MODARYX — matrice de preuves et limites

15 septembre 2026. PR brouillon #12, branche `design/modaryx-premium-hd-20260914-work`.
Source de reprise : checkpoint canonique utilisateur, complété par les preuves Git. Dernier correctif source à cette consolidation : `c518b4c4bb4cec286bf258bd00a05330b712a4ad` (liens du vérificateur, cache v78). Revérifier le HEAD avant toute écriture.

Cette matrice remplace les anciens « prochains blocs » devenus partiellement acquis ; elle ne remplace pas les résultats bruts et ne réattribue pas leurs mesures au dernier commit. Les dates des preuves ne constituent pas un nouveau passage global.

| Périmètre | Preuve conservée | Conclusion bornée |
|---|---|---|
| 16 pages, composition Loup/Dragon | `finish-line/README.md`, 19 captures | Revue desktop documentée, défauts Studio/Catalogue/Projets corrigés. Tous les états visuels ne sont pas certifiés. |
| Reflow initial des 16 pages | `finish-line/final-reflow.json` | 32 mesures à 320/960 ; contrôles ciblés postérieurs dans les dossiers ci-dessous. Ni zoom natif ni téléphone physique. |
| Studio, erreurs et accès correctif | `studio-errors-browser-20260915.json`, `studio-error-navigation-20260915.json` | Liste complète, correction progressive et accès clavier aux champs observés. |
| Brouillons Studio/Communauté | `draft-edit-state-20260915.json`, `draft-persistence-browser-20260915.json` | Édition non sauvegardée signalée ; validation, sauvegarde et rechargement ciblés. Pas de serveur de publication. |
| Catalogue, favoris/vues | `catalog-persistence-browser-20260915.json` | Persistance et actions ciblées, focus de retrait/suppression ; données de test retirées. |
| Fiches, droits et favoris | `project-browser-20260915.json` | Trois allers-retours favoris, droits non inventés, six mesures de reflow. Aucun artefact distribué. |
| Recherche | `search-browser-20260915.json` | Accents, résultat vide, effacement, navigation clavier et contenu observés ; 14 entrées locales. |
| Profil local et essai manuel | `profile-browser-20260915.json` | Libellés français, trois réponses UI, fermeture et reflow ouvert 320/768. Aucun benchmark de jeu effectué. |
| FAQ et aperçus JSON | `disclosure-browser-20260915.json` | Six panneaux : Entrée ouvre, Espace ferme ; Tab accède aux deux aperçus JSON. Quatre mesures ouvertes à 320/768 sans débordement. |
| Menus et séparation OS/web | `mobile-menu-browser-20260915.json` | Ouverture/fermeture et parcours ciblés ; lien OS optionnel inactif. |
| Mouvement réduit | `motion-browser-20260915.json` | Préférence explicite propagée aux 16 pages, CSS calculé observé ; préférence système physique non basculée. |
| Vérificateur | `verify-browser-20260915.json`, `verify-fragment-browser-20260915.json` | Parcours ciblé SHA-256 ; concordance ne prouve ni origine ni innocuité. |
| Performance | `https-browser-diagnostics-20260915.json`, `cache-checks.json` | Navigation Timing borné et budgets statiques ; pas de CWV ni de profiling représentatif. |
| PWA | `cache-checks.json`, contrôles source d’entrée PWA | Cache simulé et worker observé actif ; déconnexion réelle, mise à jour/recovery toujours non prouvées. |

## Ce qui reste réellement ouvert

- **PREUVE MANQUANTE** : lecteur d’écran natif, zoom navigateur effectif 200/400 %, appareils physiques, autres moteurs ; aucun équivalent DOM n’est présenté comme ces preuves.
- **PREUVE MANQUANTE** : cycle PWA déconnecté/mise à jour/reprise, conditions réseau/cache froid maîtrisées, LCP/CLS/INP représentatifs. L’environnement de recette ne fournit pas ces contrôles.
- **EN COURS** : recette exhaustive de chaque état interactif ; les preuves ci-dessus sont ciblées et ne valent pas toutes les combinaisons d’états.
- **EN COURS / capacités absentes** : hubs GTA 6/RDR2, index jeux/catégories et corpus autorisé, profils éditables/comptes, publication et modération distantes, Guide connecté, Storage Resolver/Repair Network, pont OS. Voir `MODARYX-ANTI-OUBLI.md`. Ce sont des manques produit, pas seulement des preuves externes.
- **BLOQUÉ** : distribution, artefacts et signatures publics non fournis ; téléchargements volontairement indisponibles.
- **NON RÉCUPÉRÉ** : exhaustivité de la Master NDI et de l’historique des idées retenues.

## Prochaine action utile

Tester un parcours absent de cette matrice ou intégrer un contenu/capacité dont les sources et le contrat sont réellement disponibles. Ne pas accumuler des copies de contrôles déjà acquis. Tout nouveau défaut doit être isolé, corrigé et vérifié sur son périmètre avant de continuer.

**VF NON VALIDÉE.** Aucune fusion, infrastructure ou fonction OS modifiée. Les limites fonctionnelles ne sont ni annulées ni transformées en PASS par cette consolidation.
