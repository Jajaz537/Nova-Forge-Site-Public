# MODARYX — matrice de preuves et limites

Mise à jour documentaire : 16 septembre 2026. PR brouillon #12, branche `design/modaryx-premium-hd-20260914-work`.
Source de reprise : checkpoint canonique utilisateur, complété par les preuves Git. Dernier correctif source : `fae489a72465e140849e89b4c1b1944f9a7838f1` (vérificateur, cache v90). Les preuves antérieures conservent leur SHA et leur portée ; cette mise à jour ne les réexécute pas. Revérifier le HEAD avant toute écriture.

Cette matrice remplace les anciens « prochains blocs » devenus partiellement acquis ; elle ne remplace pas les résultats bruts et ne réattribue pas leurs mesures au dernier commit. Les dates des preuves ne constituent pas un nouveau passage global.

| Périmètre | Preuve conservée | Conclusion bornée |
|---|---|---|
| 16 pages, composition Loup/Dragon | `finish-line/README.md`, 19 captures | Revue desktop documentée, défauts Studio/Catalogue/Projets corrigés. Tous les états visuels ne sont pas certifiés. |
| Index jeux (17e page) | `games-directory-native-20260916.json` | Sur fdb51cb : entrée Catalogue, trois fiches au clavier, résultat de recherche ; quatre reflows 320/430/768/1440 sans débordement. Haut mobile et composition desktop inspectés. Démonstrations seulement. |
| Reflow initial des 16 pages | `finish-line/final-reflow.json` | 32 mesures à 320/960 ; contrôles ciblés postérieurs dans les dossiers ci-dessous. Ni zoom natif ni téléphone physique. |
| Studio, erreurs et accès correctif | `studio-errors-browser-20260915.json`, `studio-error-navigation-20260915.json` | Liste complète, correction progressive et accès clavier aux champs observés. |
| Imports différés | `import-race-checks.json`, `studio-import-state-checks.json` | Révisions de brouillon : protection contre les lectures périmées en simulation Node. Course temporelle native non prouvée. |
| Brouillons Studio/Communauté | `draft-edit-state-20260915.json`, `draft-persistence-browser-20260915.json` | Édition non sauvegardée signalée ; validation, sauvegarde et rechargement ciblés. Pas de serveur de publication. |
| Catalogue, favoris/vues | `catalog-persistence-browser-20260915.json`, `catalog-normal-after-failure-guard-20260916.json` | Dernier parcours natif sur ec835ba : filtrage, création/application/suppression de vue, retour à trois entrées ; vue de test retirée. |
| Catalogue, liens et état dégradé | `catalog-link-names-native-20260916.json`, `catalog-contract-checks.json` | Noms accessibles et reflow 320/768 observés sur 3d641a6. Contrôles désactivés après échec : preuve Node sur ec835ba, pas une panne native. |
| Fiches, droits et favoris | `project-browser-20260915.json` | Trois allers-retours favoris, droits non inventés, six mesures de reflow. Aucun artefact distribué. |
| Index projets | `project-directory-native-20260916.json` | Trois liens activés par Entrée vers les bonnes fiches ; aucun débordement dans les cadres 320/768. Pas un parcours Tab complet ni un zoom natif. |
| Recherche | `search-browser-20260915.json`, `search-recovery-native-20260916.json`, `search-contract-checks.json` | Parcours normal natif ; récupération après panne simulée uniquement. Index compacté sur ec835ba avec égalité des données vérifiée, 14 entrées conservées. |
| Profil local et essai manuel | `profile-browser-20260915.json` | Libellés français, trois réponses UI, fermeture et reflow ouvert 320/768. Aucun benchmark de jeu effectué. |
| Variantes de contribution | `submission-variants-browser-20260915.json` | Avis : notes 0/6/2,5 refusées, 5 acceptée ; commentaire : parent obligatoire ; retour Discussion sans note/parent dans le JSON. |
| Aperçus longs Communauté | `long-preview-browser-20260915.json` | Saisie 1200/8000 caractères, texte multilingue et balises littérales ; défilement clavier jusqu’en bas, reflow 320/768. Aucun import/export testé ici. |
| Détection Profils | `profile-detection-checks.json`, `profile-capabilities-browser-20260915.json` | Sept cas source ; navigateur : WebAuthn indisponible seulement, reflow 320/768. Détection partielle/complète non exercée nativement. |
| FAQ et aperçus JSON | `disclosure-browser-20260915.json` | Six panneaux : Entrée ouvre, Espace ferme ; Tab accède aux deux aperçus JSON. Quatre mesures ouvertes à 320/768 sans débordement. |
| Menus et séparation OS/web | `mobile-menu-browser-20260915.json` | Ouverture/fermeture et parcours ciblés ; lien OS optionnel inactif. |
| Mouvement réduit | `motion-browser-20260915.json` | Préférence explicite propagée aux 16 pages, CSS calculé observé ; préférence système physique non basculée. |
| Vérificateur | `verify-browser-20260915.json`, `verify-fragment-browser-20260915.json`, `verify-checks.json` | Dix groupes source sur fae489a : changement pendant lecture évite le digest ; changement pendant digest masque le résultat périmé. Ces courses restent simulées. Concordance ≠ origine ou innocuité. |
| Performance | `https-browser-diagnostics-20260915.json`, `cache-checks.json` | Cache v90 : 798679/800000 octets bruts ; budgets CSS/JS respectés par le contrôle source. Navigation Timing borné, pas de CWV ni de profiling représentatif. |
| PWA | `cache-checks.json`, contrôles source d’entrée PWA | 31 assertions source, dont échecs de lecture/ouverture du cache. Worker observé actif antérieurement ; déconnexion réelle, mise à jour/recovery toujours non prouvées. |

## Ce qui reste réellement ouvert

- **PREUVE MANQUANTE** : lecteur d’écran natif, zoom navigateur effectif 200/400 %, appareils physiques, autres moteurs ; aucun équivalent DOM n’est présenté comme ces preuves.
- **PREUVE MANQUANTE** : cycle PWA déconnecté/mise à jour/reprise, conditions réseau/cache froid maîtrisées, LCP/CLS/INP représentatifs. L’environnement de recette ne fournit pas ces contrôles.
- **EN COURS** : recette exhaustive de chaque état interactif ; les preuves ci-dessus sont ciblées et ne valent pas toutes les combinaisons d’états.
- **EN COURS / capacités absentes** : hubs GTA 6/RDR2, pages de catégories et corpus autorisé (index des trois jeux de démonstration ajouté), profils éditables/comptes, publication et modération distantes, Guide connecté, Storage Resolver/Repair Network, pont OS. Voir `MODARYX-ANTI-OUBLI.md`. Ce sont des manques produit, pas seulement des preuves externes.
- **BLOQUÉ** : distribution, artefacts et signatures publics non fournis ; téléchargements volontairement indisponibles.
- **NON RÉCUPÉRÉ** : exhaustivité de la Master NDI et de l’historique des idées retenues.

## Prochaine action utile

Tester un parcours absent de cette matrice ou intégrer un contenu/capacité dont les sources et le contrat sont réellement disponibles. Ne pas accumuler des copies de contrôles déjà acquis. Tout nouveau défaut doit être isolé, corrigé et vérifié sur son périmètre avant de continuer.

**VF NON VALIDÉE.** Aucune fusion, infrastructure ou fonction OS modifiée. Les limites fonctionnelles ne sont ni annulées ni transformées en PASS par cette consolidation.
