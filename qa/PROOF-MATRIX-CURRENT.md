# MODARYX — matrice de preuves et limites

Mise à jour documentaire : 16 septembre 2026. PR brouillon #12, branche `design/modaryx-premium-hd-20260914-work`.
Source de reprise : checkpoint canonique utilisateur, complété par les preuves Git. Dernier correctif source : `fae489a72465e140849e89b4c1b1944f9a7838f1` (vérificateur, cache v90). Les preuves antérieures conservent leur SHA et leur portée ; cette mise à jour ne les réexécute pas. Revérifier le HEAD avant toute écriture.

Cette matrice remplace les anciens « prochains blocs » devenus partiellement acquis ; elle ne remplace pas les résultats bruts et ne réattribue pas leurs mesures au dernier commit. Les dates des preuves ne constituent pas un nouveau passage global.

| Périmètre | Preuve conservée | Conclusion bornée |
|---|---|---|
| 16 pages, composition Loup/Dragon | `finish-line/README.md`, 19 captures | Revue desktop documentée, défauts Studio/Catalogue/Projets corrigés. Tous les états visuels ne sont pas certifiés. |
| Index jeux (17e page) | `games-directory-native-20260916.json` | Sur fdb51cb : entrée Catalogue, trois fiches au clavier, résultat de recherche ; quatre reflows 320/430/768/1440 sans débordement. Haut mobile et composition desktop inspectés. Démonstrations seulement. |
| Reflow initial des 16 pages | `finish-line/final-reflow.json` | 32 mesures à 320/960 ; contrôles ciblés postérieurs dans les dossiers ci-dessous. Ni zoom natif ni téléphone physique. |
| Zoom/reflow 200 % ciblé | `zoom-reflow-20260919/README.md`, `zoom-reflow-20260919/results.json` | Firefox 156 et Edge/Chromium : 24 contrôles sur six pages, deux largeurs CSS équivalentes au zoom 200 %, menu compact ouvert ; aucun débordement, contrôle coupé ou lien masqué. Preuve bornée, pas de lecteur d'écran, appareil physique, 400 % ou VF. |
| Zoom/reflow 400 % natif | tentative du 19 septembre 2026 | **PREUVE MANQUANTE** : les navigateurs pilotés imposent une largeur interne minimale d'environ 483–500 px et la tentative par facteur d'affichage n'établit pas un zoom navigateur natif à 400 %. Aucun PASS ni défaut produit n'est déduit de cette tentative. |
| Lecteur d'écran réel | inventaire de l'environnement du 19 septembre 2026 | **BLOQUÉ / PREUVE MANQUANTE** : aucun lecteur d'écran natif pilotable n'est exposé. Les contrôles DOM et clavier ne remplacent pas une session NVDA/Narrator/VoiceOver réelle. |
| Baseline du contrôle cache | `CACHE-BASELINE-CONTRACT-20260919.md` | **BLOQUÉ / PREUVE MANQUANTE** : contrat externe identifié (`../site-baseline`), mais source canonique et commit de référence absents. Aucun baseline n'a été inventé. |
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

- **PREUVE MANQUANTE** : lecteur d’écran natif, zoom/reflow 400 %, appareils physiques et tactile réel. La passe 200 % ciblée est documentée sur Firefox et Chromium ; elle ne couvre pas toutes les pages ni tous les états.
- **PREUVE MANQUANTE** : cycle PWA déconnecté/mise à jour/reprise, conditions réseau/cache froid maîtrisées, LCP/CLS/INP représentatifs. L’environnement de recette ne fournit pas ces contrôles.
- **EN COURS** : recette exhaustive de chaque état interactif ; les preuves ci-dessus sont ciblées et ne valent pas toutes les combinaisons d’états.
- **EN COURS / capacités absentes** : hubs GTA 6/RDR2, pages de catégories et corpus autorisé (index des trois jeux de démonstration ajouté), profils éditables/comptes, publication et modération distantes, Guide connecté, Storage Resolver/Repair Network, pont OS. Voir `MODARYX-ANTI-OUBLI.md`. Ce sont des manques produit, pas seulement des preuves externes.
- **BLOQUÉ** : distribution, artefacts et signatures publics non fournis ; téléchargements volontairement indisponibles.
- **NON RÉCUPÉRÉ** : exhaustivité de la Master NDI et de l’historique des idées retenues.

## Prochaine action utile

Tester un parcours absent de cette matrice ou intégrer un contenu/capacité dont les sources et le contrat sont réellement disponibles. Ne pas accumuler des copies de contrôles déjà acquis. Tout nouveau défaut doit être isolé, corrigé et vérifié sur son périmètre avant de continuer.

**VF NON VALIDÉE.** Aucune fusion, infrastructure ou fonction OS modifiée. Les limites fonctionnelles ne sont ni annulées ni transformées en PASS par cette consolidation.

## Nouvelles tentatives des portes externes — 16 septembre 2026

Sur le preview immuable `https://3f488769.nova-forge-site-public.pages.dev/` du commit `67989b4`, deux variantes du raccourci de zoom ont été tentées après remise à 100 %. Largeur, DPR et échelle visuelle sont restés strictement identiques : aucun zoom 200/400 % n’est revendiqué. L’inspection runtime du service worker et de CacheStorage n’est pas exposée par le contexte contrôlé, qui ne fournit pas non plus de bascule réseau hors ligne. Enfin, le sélecteur natif du Studio s’est ouvert, mais la permission d’y placer le manifeste témoin a été refusée ; aucun contournement n’a été tenté. Résultats structurés : `external-gate-attempts-20260916.json`. Ces trois lignes restent **PREUVE MANQUANTE**.

## Textes du catalogue — preuve ciblée du 16 septembre

Source `0c1c809` : dix mesures navigateur sur accueil, Catalogue et les trois fiches, cadres 320/768 px (largeurs utiles 305/753), sans débordement horizontal observé. Après chargement, les trois liens d’accueil affichent « Voir la fiche » avec un nom accessible propre au projet. Preuve : `qa/catalog-copy-native-20260916.json`. Ceci ne certifie ni lecteur d’écran, ni zoom natif, ni totalité des états visuels. Aucun runtime modifié par ce lot de preuve.

## Téléchargements — récupération et statut

Sur `59c39da` : cinq groupes Node dans `download-recovery-checks.json` distinguent erreur réseau/HTTP/contrat, disponibilité vide et copie périmée, avec nouvelle tentative non concurrente et retour du focus. `download-status-native-20260916.json` confirme le statut normal après chargement, zéro artefact et bouton masqué ; composition desktop inspectée, reflow 320/768 sans débordement. Les états de panne/récupération ne sont pas validés nativement. Cache v96, 34 assertions et 799191/800000 octets bruts ; aucune conclusion CWV.

## Mise à jour courante — Site First — 19 septembre 2026

HEAD de référence au début de cette mise à jour : `442477b69fdcb4c8f8aa38eb9bc03e80d20129b6`, branche `design/modaryx-premium-hd-20260914-work`.

Les anciennes lignes ci-dessus restent historiques pour leurs SHA respectifs. Elles ne doivent plus être utilisées pour décrire l'architecture cache courante lorsqu'elles mentionnent les anciens précaches ~798–799 kB.

### Preuve source ciblée courante

Workflow : **MODARYX Site First Targeted Source Proof**  
Run : **35461493088**  
Conclusion : **PASS CIBLÉ / success** sur le HEAD `442477b69fdcb4c8f8aa38eb9bc03e80d20129b6`.

Le contrôle lecture seule vérifie sur le checkout exact :

- 17 pages publiques présentes ;
- shell partagé, foundations, footer, skip-link, main et title sur les pages ;
- références locales `href/src` existantes ;
- absence du libellé visible historique « Modaryx OS » ;
- relation « même équipe / produits distincts » ;
- modèle de croissance partagé loup/dragon ;
- reduced motion du monde vivant ;
- runtime cache borné à 80 ;
- grandes illustrations exclues de l'install-précache ;
- précache sous le garde-fou 800000 ;
- toutes les lignes de `SHA256SUMS.txt` vérifiées contre les octets réels du checkout.

Cette preuve ne remplace ni navigateur réel, ni lecteur d'écran, ni appareil physique, ni CWV.

### Architecture cache courante

- ancien modèle mesuré : **794167 octets / 76 fichiers uniques**, marge 5833 ;
- architecture actuelle : **précache cœur compact + runtime cache contrôlé** ;
- noyau après signature « même équipe » : **111822 octets** ;
- marge sous 800000 : **688178 octets** ;
- runtime non cœur borné à **80 entrées** ;
- gros visuels et futurs jeux/mods/modules : hors précache global par défaut.

Les anciennes lignes « cache v90/v96 ~799k » restent des preuves historiques de leurs commits, pas l'état courant.

### Monde vivant courant

- chronologie partagée : intégrée ;
- cycle nuit/aube/jour/crépuscule : intégré ;
- Louveteau et Dragonneau : même ordre de stades **bébé → juvénile → adolescent → jeune adulte → adulte** ;
- rythme indépendant par espèce : intégré ;
- croissance visuelle individuelle : **EN COURS**, car le panorama reste composite ;
- design visuel de référence : approuvé ; ne pas relancer de nouvelles recherches d'images sans besoin précis.

### Relation MODARYX / Nova Forge

- **MODARYX MODS = plateforme web** ;
- **Nova Forge OS = logiciel / OS** ;
- les deux produits : **même équipe**, identités distinctes ;
- signature discrète partagée dans le footer ;
- section statique dédiée dans Écosystème ;
- aucune marque groupe/studio ou destination OS inventée.

### Priorité de livraison

Décision utilisateur : **MODARYX Site First jusqu'à VF ultra haut de gamme**.

Restent ouverts avant une déclaration 100 % / VF :

- croissance visuelle réelle des éléments du monde vivant ;
- recette Premium HD exhaustive des 17 pages et états ;
- PWA HTTPS offline/update réelle ;
- zoom/reflow 400 % natif ;
- lecteur d'écran natif ;
- appareils physiques/tactile ;
- CWV représentatifs ;
- import/export avec vrais fichiers si maintenu dans le périmètre final ;
- identité/contact/mentions légales réels lorsqu'ils sont requis ;
- dépendances produit réelles : comptes, publication/modération, Resolver/Repair, distribution, Guide connecté, OS Bridge ;
- droits/catégories/contenu substantiel avant publication des hubs GTA VI/RDR2 ;
- Master NDI complète : toujours NON RÉCUPÉRÉE.

**VF NON VALIDÉE** malgré le PASS source ciblé.

## Micro-preuve Chromium reflow — 19 septembre 2026

PR #30 / commit d'intégration `1fd480d721ab3f5780be881da33b24c3da0a10f5`.

Le premier run navigateur ciblé `35463522362` a détecté un overflow réel de **33 px à 320 px** sur les trois fiches projet. Cause isolée : conflit de spécificité CSS sur `.project-grid:not(.project-directory)`. La correction a été limitée à la règle mobile correspondante.

Après correction :

- run navigateur `35463591149` : **success / PASS CIBLÉ** ;
- 17 pages × 320/400/768/1440 = **68 navigations** ;
- aucun overflow horizontal >1 px ;
- H1/main/footer présents ;
- menus mobiles ouverts aux largeurs étroites lorsqu'ils existent ;
- aucune exception JavaScript remontée par le contrôle ;
- reduced motion émulé sur l'accueil, animation principale désactivée ;
- run source `35463591245` : **success**.

Portée : Chromium headless sur serveur local. Cette preuve **ne ferme pas** le zoom navigateur natif 400 %, Firefox/Safari, lecteur d'écran, tactile/appareil physique, PWA réellement hors ligne ou CWV.

## Fonctions locales — micro-preuve Chromium — 19 septembre 2026

PR #31 / merge `033e3227fe9b776c4ca58c022dcceec2dbcc3c2a`.

Premier run `35463958957` : **FAIL ciblé du harnais** sur une attente `Page.loadEventFired` après changement de fragment du Vérificateur. Catalogue, Recherche, Communauté et Creator Studio étaient déjà verts. La correction a uniquement adapté le harnais à une navigation même-document.

Run corrigé `35464005629` : **success / PASS CIBLÉ**.

Périmètre réellement observé dans Chromium headless :

- filtre Catalogue + favori local + persistance ;
- Recherche locale ;
- collection Communauté locale + persistance ;
- avis local + persistance ;
- Creator Studio V2 + restauration, distribution verrouillée ;
- fragment SHA-256 invalide puis valide dans Vérificateur.

Limites : le sélecteur de fichiers natif, l'import par vrai fichier choisi par l'utilisateur et la vérification SHA-256 d'un vrai fichier restent des preuves séparées.

