# MODARYX Premium HD — état du candidat

**EN COURS — aucune VF ni validation globale complète annoncée.**

Périmètre : MODARYX / MODARYX MODS, plateforme web. Nova Forge OS est un produit distinct. PR #12, branche `design/modaryx-premium-hd-20260914-work`. Base de reprise `9084686f02af0a9b4c8d1ab879e0c8d66915caec`.

## TERMINÉ dans ce lot

- Harmonisation des seize pages : typographie, surfaces, navigation, formulaires, fil d'Ariane, footer, contenu et états.
- 144 mesures de largeur Chrome : seize pages × 320, 390, 430, 768, 960, 1024, 1280, 1440 et 1920 px ; aucun débordement horizontal observé. Détails dans `qa/responsive-final.json`.
- Textes sur fonds opaques unis contrôlés par couleurs calculées ; deux éléments décoratifs sans texte sont exclus des résultats de contraste textuel. Les fonds complexes ne sont pas certifiés (`qa/contrast-solid-surfaces.json`).
- Sept scénarios d'état, six scénarios de métadonnées, vingt-et-une assertions cache et trois contrôles de transaction stockage : réussis par Node. Ces preuves ne remplacent pas les essais navigateur/SW HTTPS.
- Recherche catalogue Ember → une entrée ; recherche inexistante → état vide explicite. Menu par Entrée, fermeture Échap, retour de focus avec outline de 3px ; préférence de mouvement réduit ; détails JSON natifs ouverts dans Chrome.
- Contrôles structurels, syntaxe JavaScript, liens/ancres locaux et empreintes : voir `qa/static-checks.json`.
- Treize fichiers protégés identiques à la baseline : aucun changement d'infrastructure.

## EN COURS

- Recette visuelle détaillée de tous les états et du contenu, cohérence finale et niveau de finition artistique.
- Parcours complets formulaires/import/export/rechargement et contrôles clavier exhaustifs.
- Réconciliation des idées retenues : `qa/MODARYX-ANTI-OUBLI.md`.

## PREUVE MANQUANTE

- Lecteur d'écran réel, zoom navigateur 200/400 %, appareils physiques, tactile réel et matrice multi-navigateurs.
- Performance de rendu et mesures CWV sur hébergement réel ; poids statiques seulement mesurés dans `qa/PERFORMANCE-BUDGETS.md`.
- Installation PWA, cycle de mise à jour et hors ligne HTTPS réels. Le cache a des tests simulés, pas un PASS navigateur natif.
- Contraste exhaustif des gradients/transparences et état de chaque composant.
- Master NDI étendue à 46 entrées : NON RÉCUPÉRÉE ; document de 18 entrées lu.

## BLOQUÉ côté capacités publiques

Aucun artefact de téléchargement autorisé ; comptes, Guide, publication et services distants non connectés. Hubs jeux GTA6/RDR2 et corpus éditorial/médias correspondants encore manquants. Aucun de ces éléments n'est réputé terminé par la présence d'un schéma.

Une PR, un commit, un build ou une fusion ne clôture pas ces écarts. La surveillance d'achèvement ne doit pas notifier une VF à partir de ce document.

## Complément de recette navigateur

- Aperçu HTTPS de branche chargé après publication du candidat ; accueil et navigation vers le Studio observés. Cela ne prouve pas l'installation PWA ni le hors ligne.
- FAQ : réponse ouverte, texte de disponibilité correctement qualifié.
- Studio local : état initial neutre, sauvegarde vide refusée et focus sur `content-id`, huit champs requis renseignés, sauvegarde confirmée, brouillon restauré après rechargement avec le nom saisi.
- Export : message de génération observé mais attente du fichier navigateur expirée après 3 secondes. **PREUVE MANQUANTE** sur la récupération effective du téléchargement ; aucun fichier reçu n'est revendiqué.
- Les derniers libellés du Studio conservent le modèle et les règles de validation existants ; tests d'état relancés avec succès.

## Recalage Loup/Dragon et correction de preuve

Les références utilisateur 02/03/01 ont été récupérées, inspectées et adaptées à MODARYX. Deux WebP originaux, accueil et portails, sont intégrés ; les anciens concepts Nova Forge ne modifient pas le branding web. Accueil mobile 390 px et desktop inspectés dans Chrome.

L'ancien cadre de contrôle limitait certaines largeurs à 1332 px. La première affirmation « jusqu’à 1920 » était donc trop large. `qa/responsive-final.json` remplace cette preuve par 144 mesures avec largeur demandée ET effective après retrait de cette limite. Aucun débordement persistant constaté. Un débordement de chargement sur project.html à 320 px a été recontrôlé après stabilisation. Cette recette de dimensions ne certifie ni tous les chevauchements ni tous les états visuels.

Les 37 contrôles ciblés Node ont été exécutés après intégration artistique. Le poids du précache est actualisé dans `qa/cache-checks.json` ; ce poids n’est pas un score de performance mesuré. Les preuves manquantes listées plus haut restent ouvertes. VF NON VALIDÉE.

## Suite ciblée — exports locaux

Studio : exceptions de préparation/export capturées, message actionnable et brouillon conservé. Studio et communauté : lien ajouté au document, retiré après activation ; libération de l’URL différée de 1 seconde. Les noms de fichiers historiques restent inchangés. Service worker v42.

Six simulations ciblées des vrais gestionnaires exécutées : succès, échec de création URL et échec du clic, pour les deux surfaces. Les 37 autres assertions/scénarios Node ont été réexécutés avec succès : total 43. Voir `qa/export-checks.json`.

Chrome local : brouillon de recette restauré, export activé, message « Export JSON préparé. Vérifiez les téléchargements de votre navigateur. » observé. L’attente de l’événement téléchargement expire encore après 3 secondes : réception du fichier toujours PREUVE MANQUANTE, pas de réussite native revendiquée. Aucun changement visuel ou d’infrastructure dans ce lot.

## Suite ciblée — première visite PWA

L’enregistrement du service worker ne dépend plus de `app.js` (absent de huit pages). Il est initialisé dans `shell.js`, chargé par les seize pages, avant la logique de menu. Le chemin du worker et sa portée sont résolus depuis le script partagé, y compris pour un déploiement en sous-dossier. Le contexte sécurisé et l’origine sont contrôlés ; un échec ne bloque pas les outils locaux. Cache v43.

Neuf contrôles structurels/Node VM réussis dans `qa/pwa-entry-checks.json`, avec les 21 assertions cache et les six scénarios de métadonnées réexécutés après modification. La couverture ciblée cumulée atteint 52 contrôles/scénarios ; ceci ne constitue pas 52 parcours navigateur. Installation, activation et hors ligne natifs restent PREUVE MANQUANTE.

Référence : https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register — portée d’enregistrement, contexte sécurisé et option updateViaCache. Cette option porte sur le script du worker ; elle ne désactive pas son cache de ressources.

## Suite ciblée — ordre clavier du menu d’accueil

Défaut reproduit dans Chrome à 390 px : ouverture au clavier puis Tab sautait les liens du menu et atteignait le CTA du hero. Le bouton précédait visuellement la navigation mais la suivait dans le HTML. Ordre HTML corrigé : bouton avant navigation, sans tabindex positif ni déplacement de focus artificiel. Panneau étendu à la largeur disponible, défilement vertical autorisé sur faible hauteur.

Après correction : focus visible sur « Mods » après Entrée puis Tab, Échap ferme le panneau (`aria-expanded=false`). Neuf largeurs effectives 320–1920 px recontrôlées sans débordement de l’accueil. Ces mesures complètent la matrice précédente, sans revendiquer une nouvelle recette exhaustive des seize pages. Voir `qa/menu-browser-checks.json`.

Capacités du navigateur inspectées : aucune commande de simulation réseau/hors ligne proposée. La preuve PWA hors ligne native reste ouverte. Aucun essai de lecteur d’écran, zoom ou appareil physique ajouté. Cache v44.

## Suite ciblée — recherche et HTML de secours

Les trois cartes HTML de l’accueil correspondent maintenant aux démonstrations du catalogue, sans texte de maquettage. Les quatorze liens du répertoire de recherche reprennent leur titre et résumé depuis l’index actuel ; l’ancien résumé de communauté mentionnant une modération active a été supprimé. Le titre public Profils et accès est cohérent entre page et index. Les noms techniques historiques restent inchangés.

Le filtre recherche est désactivé avant chargement de l’index et reste décrit par son état. Après chargement, il est disponible. Les compteurs recherche/catalogue exposent un statut poli et atomique. Chrome : recherche dragon → 1 résultat ; recherche inexistante → 0 résultat et état vide explicite. Aucun lecteur d’écran réel revendiqué.

Cinq contrôles source/HTML réussis dans qa/fallback-content-checks.json ; sept scénarios d’état et 21 assertions cache réexécutés. Couverture ciblée cumulée : 57 contrôles/scénarios, hors mesures de largeur. La concordance HTML/data ne remplace pas une recette navigateur JavaScript désactivé. Cache v45.

## Suite ciblée — chargement du catalogue d’accueil

Le premier rendu ne présente plus une panne pendant une requête en cours. Chargement, catalogue vide valide, filtre sans résultat et erreur sont distingués. Le filtre reste désactivé tant que les données ne sont pas disponibles ; `aria-busy` indique l’attente. Une erreur propose Réessayer, évite les requêtes concurrentes et restitue le focus au filtre après réussite ou au nouveau bouton après échec. Aucun contenu non qualifié substitué.

Six scénarios Node sur le source réel réussis : attente/réussite, liste vide, contrat invalide, nouvelle tentative et double activation, filtre sans résultat, échec répété avec retour de focus. Voir `qa/home-catalogue-checks.json`. Les six tests de métadonnées et 21 assertions cache ont été réexécutés. Couverture ciblée cumulée : 63 contrôles/scénarios ; aucun test de réseau limité natif ou lecteur d’écran ajouté. Cache v46.

Chrome local après correction : saisie Ember autorisée après chargement et une fiche affichée ; saisie zzzz → message de filtre sans résultat. Les échecs réseau et le retour de focus de Réessayer ont été vérifiés en simulation Node uniquement.

## Suite ciblée — justificatifs conditionnels du Studio

Avant correction, Mesuré sans justificatif bloquait la validation en laissant le focus sur le bouton. Les champs de mesure/provenance suivent maintenant les niveaux déclarés : required conditionnel, message de format, espaces seuls refusés, aria-invalid après tentative seulement, aide reliée et libellé accessible court. Retour à Inconnu efface l’exigence et l’erreur devenue obsolète. Les contrats et noms JSON ne changent pas.

Chrome local : Mesuré sans justificatif → focus actif sur Justificatif de mesure ; receipt:compat.example → validation locale du format. Aucun brouillon enregistré/publié par ce contrôle. Six scénarios de source réussis (qa/receipt-field-checks.json) ; sept scénarios d’état, six exports et 21 assertions cache réexécutés. Couverture ciblée cumulée : 69 contrôles/scénarios ; aucun test de lecteur d’écran réel ajouté. Cache v47.

## Suite ciblée — espacement du texte (15 septembre 2026)

Voir également le lot suivant pour l’évolution du runtime après ces mesures.

32 mesures Chrome, seize pages à 320 et 1280 px utiles, avec les quatre paramètres WCAG 1.4.12 surchargés : aucun débordement horizontal mesuré. Voir `qa/text-spacing-checks.json` et la feuille de recette `qa/text-spacing.css`, jamais chargée en production. Menu d’accueil ouvert inspecté séparément à 305 px utiles (iframe 320 avec scrollbar) : cinq liens lisibles, état ouvert confirmé. Aucune correction de style de production nécessaire sur ces observations limitées.

Ces mesures ne prouvent ni tous les chevauchements, ni tous les états, ni la conformité complète WCAG 1.4.12. Le raccourci de zoom natif testé n’a changé aucune largeur mesurable ; zoom 200/400 % reste PREUVE MANQUANTE. Lecteur d’écran, appareils physiques, performances réelles et PWA/offline HTTPS ne sont pas validés par ce lot. Statut global EN COURS, aucune VF. Les 32 mesures sont séparées des 69 contrôles/scénarios ciblés déjà documentés. Cache v47 inchangé : aucune ressource runtime modifiée.

## Suite ciblée — prévalidation du vérificateur (15 septembre 2026)

Lot conservé ; la suite catalogue ci-dessous actualise le cache et la couverture.

Une empreinte attendue mal formée est désormais refusée avant lecture du fichier et calcul SHA-256. Le champ reçoit le focus et aria-invalid ; une édition ou un préremplissage valide efface cet état. Sans fichier, le focus revient au sélecteur. L’empreinte reste facultative : une valeur vide permet le calcul seul, sans prétendre à une correspondance. Aucun contrat historique renommé, aucune modification d’infrastructure.

Sept scénarios dédiés réussis dans `qa/verify-checks.json`, avec digest Web Crypto Node réel et DOM simulé : absence de fichier, refus sans lecture, correction/empreinte facultative, correspondance et différence, concurrence/résultat périmé, erreur de lecture, Web Crypto absent. Chrome local : activation sans fichier confirme le sélecteur actif et l’avertissement visible. Le focus sur empreinte invalide et les calculs avec fichier ont été testés ici en Node seulement. Ce lot ne prouve pas lecteur d’écran ni fichiers physiques en navigateur.

Sept scénarios d’état existants et 21 assertions cache réexécutés, structure 16 pages/13 scripts et 76 empreintes sans erreur. Couverture ciblée cumulée : 76 scénarios/contrôles (dont les sept nouveaux), hors mesures de largeur. Cache v48 ; précache 788697 octets bruts, 516918 estimation gzip, pas une mesure de performance terrain. Statut EN COURS, aucune VF ; preuves externes précédemment listées toujours manquantes.

## Suite ciblée — focus des favoris (15 septembre 2026)

En vue Favoris uniquement, retirer la carte active transfère maintenant le focus au favori suivant, au précédent si elle était dernière, ou au champ Recherche si la liste devient vide. Un déclenchement sans focus sur ce bouton ne vole pas le focus. Les boutons Favori portent le nom du projet dans leur libellé accessible, sur cartes enrichies et secours HTML après initialisation JavaScript.

Chrome local : ajout de deux favoris de test, filtrage puis Entrée sur Ember → focus Balanced ; Entrée sur Balanced → focus catalog-query. Favoris de test retirés et filtre décoché à la fin. Aucun lecteur d’écran réel revendiqué. Six scénarios source Node réussis dans qa/catalog-focus-checks.json ; trois tests de refus du stockage et 21 assertions cache réexécutés. Structure 16 pages, 13 scripts et 76 empreintes sans erreur. Couverture ciblée cumulée 82 scénarios/contrôles, hors mesures de largeur ; cache v49, précache 789364 octets bruts (517084 estimation gzip). EN COURS, aucune VF ; les preuves externes restent ouvertes.

## Suite ciblée — contrat de recherche (15 septembre 2026)

L’index enrichi est validé intégralement avant activation du filtre : identifiant unique non vide, titre non vide, résumé textuel et termes sous forme de liste de chaînes. Une entrée mal formée conserve le répertoire HTML et laisse la recherche désactivée, au lieu d’activer un filtre susceptible de lever une exception. Un index vide valide reste distinct d’une panne. Les règles de liens existantes restent inchangées.

Cinq scénarios regroupés Node réussis dans qa/search-contract-checks.json : quatre variantes mal formées, doublons, index actuel/accents/casse/absence de résultat, index vide et erreur réseau. Sept scénarios d’état, cinq contrôles HTML/index et 21 assertions cache réexécutés. Structure des 16 pages, syntaxe des 13 scripts et 76 empreintes sans erreur. Cumul ciblé 87 scénarios/contrôles hors mesures de largeur. Cache v50 ; précache 789878 octets bruts, estimation gzip 517212. Aucune preuve navigateur ou lecteur d’écran supplémentaire revendiquée par ce lot. EN COURS, aucune VF.

## Suite ciblée — contrat du catalogue (15 septembre 2026)

Les champs nécessaires aux cartes publiques sont contrôlés avant affectation aux données de filtrage : identifiant de route unique, type, nom/version, jeu, créateur, état de compatibilité, libellés provenance/distribution, tags et rang. Une fiche publique incomplète rejette le chargement enrichi et conserve les cartes HTML. Les données non publiques sont exclues. Ce contrôle de forme ne certifie ni provenance ni compatibilité et ne remplace pas une validation de manifeste.

Six scénarios regroupés Node réussis dans qa/catalog-contract-checks.json, dont dix variantes incomplètes, doublons, exclusion non publique, index vide et contrat non pris en charge. Six scénarios de focus et trois refus de stockage réexécutés ; 21 assertions cache, structure 16 pages/13 scripts et 76 empreintes sans erreur. Couverture ciblée cumulée : 93 scénarios/contrôles hors mesures de largeur. Cache v51 ; précache 790877 octets bruts, estimation gzip 517499. Aucun nouveau test navigateur natif ou lecteur d’écran revendiqué. EN COURS, aucune VF ; validations externes toujours ouvertes.

## Suite visuelle — zone d’import du Studio (15 septembre 2026)

Observation Chrome avant correction : le conteneur d’action d’import restait dans une seule colonne et son aide touchait le bouton. Correction : occupation des deux colonnes, disposition flexible avec espacements 12/16 px, aide typographique secondaire et retour à la ligne. Le libellé français « manifestes » est corrigé ; l’aide est reliée au bouton par aria-describedby. La logique d’import reste inchangée.

Après rechargement réel : capture desktop inspectée, bouton/aide séparés ; capture mobile inspectée, aide sous bouton et focus visible sur Identifiant public après Tab depuis Importer. Iframe de 320 px, largeur utile et scrollWidth 305 px (scrollbar native), aucun débordement horizontal mesuré. Accueil Loup/Dragon desktop également inspecté sans changement demandé par cette observation. Ces vues ne valent pas revue exhaustive des seize pages ni test physique/lecteur d’écran. Structure 16 pages/13 scripts, 76 empreintes et 21 assertions cache réussies. Cumul de scénarios inchangé (93) ; cache v52. EN COURS, aucune VF.

## Suite visuelle — ancres sous l’en-tête mobile (15 septembre 2026)

Défaut observé dans Chrome, Studio en iframe 320 px : le décalage fixe de 100 px masquait la légende Compatibilité derrière l’en-tête sur deux lignes. Le shell mesure maintenant sa hauteur et actualise une variable CSS avec ResizeObserver (repli resize) ; scroll-padding conserve un minimum de 100 px ou hauteur réelle + 20 px. Après correction, capture mobile inspectée : légende entièrement visible. Desktop : bas d’en-tête 76 px, début du fieldset 99,6875 px avant et après. La tentative de mesure automatique des six ancres dans l’iframe n’a pas abouti ; aucune validation exhaustive de ces six destinations revendiquée.

Neuf contrôles d’entrée PWA et 21 assertions cache réexécutés, structure 16 pages/13 scripts et 76 empreintes sans erreur. Cumul de scénarios inchangé (93) ; cache v53. Recette ciblée uniquement, aucun zoom natif/lecteur d’écran/appareil physique validé. EN COURS, aucune VF.

## Suite ciblée — vues enregistrées au clavier (15 septembre 2026)

Chrome local avant correction : supprimer la vue sélectionnée avec Entrée désactive le bouton et laisse BODY actif. Après correction, suppression réussie depuis le bouton actif → focus transféré au sélecteur des vues. Le transfert intervient seulement après réussite du stockage, sans voler le focus lors d’un autre mode de déclenchement.

Parcours réel rejoué : créer « Recette temporaire MODARYX » avec filtre Ember, réinitialiser, sélectionner puis appliquer la vue → recherche Ember / 1 entrée ; supprimer avec Entrée → catalog-saved-view actif. Vue de recette supprimée, sélecteur revenu à Choisir une vue…, filtres réinitialisés. Aucune vue préexistante présente ni supprimée. Trois tests source de refus du stockage, 21 assertions cache, structure 16 pages/13 scripts et 76 empreintes réussis. Cumul de scénarios automatisés inchangé (93), cache v54. Cette preuve clavier Chrome ne vaut pas test de lecteur d’écran. EN COURS, aucune VF.

## Suite ciblée — options anciennes des vues (15 septembre 2026)

L’application d’une vue vérifie désormais chaque option Type/Jeu/Compatibilité/Tri contre les options réellement présentes. Un choix disparu ou mal formé revient à Tous/Toutes ou Sélection ; un message explicite signale l’ajustement. La vue stockée n’est pas réécrite. Les champs absents utilisent les valeurs par défaut sans faux avertissement.

Quatre scénarios source Node réussis dans qa/saved-view-options-checks.json : choix valides, choix disparus, valeurs mal formées, champs omis ; immutabilité de la vue vérifiée dans chaque cas. Trois tests de refus stockage, 21 assertions cache, structure 16 pages/13 scripts et 76 empreintes réussis. Cumul ciblé 97 scénarios/contrôles hors largeurs. Cache v55. Aucun nouveau test natif navigateur ou lecteur d’écran revendiqué. EN COURS, aucune VF.

## Suite ciblée — ancienneté des données en cache (15 septembre 2026)

Catalogue et recherche lisent désormais le marqueur offline-stale déjà fourni par le service worker. Une réponse ainsi marquée affiche « Copie en cache » avec explication de l’ancienneté possible ; le message survit aux filtrages locaux. Une réponse réseau normale n’est pas qualifiée d’ancienne. Aucun changement de politique réseau ou de droits de téléchargement.

Un scénario ajouté à qa/search-contract-checks.json et deux scénarios source dans qa/catalog-cache-label-checks.json : transmission du marqueur, maintien après rendu favoris/recherche et absence sur réponse réseau. Simulation Node uniquement, aucune coupure réseau native exécutée. Six scénarios contrat catalogue, sept états et 21 assertions cache réexécutés ; structure 16 pages/13 scripts et 76 empreintes sans erreur. Cumul ciblé 100 scénarios/contrôles hors largeurs, cache v56. Le hors ligne HTTPS réel reste PREUVE MANQUANTE. EN COURS, aucune VF.

## Suite ciblée — cache sur accueil et fiches (15 septembre 2026)

L’accueil conserve un avertissement de copie en cache après filtrage, y compris sans résultat. Les fiches projet affichent une note séparée si catalogue ou graphe de relations provient du cache ancien ; une action Favori ne peut plus effacer cette qualification. Réponse réseau seule : aucune qualification d’ancienneté inventée.

Un scénario supplémentaire dans qa/home-catalogue-checks.json et trois dans qa/project-cache-label-checks.json ; tests source Node uniquement. Trois refus stockage, six métadonnées publiques et 21 assertions cache réexécutés ; structure 16 pages/13 scripts et 76 empreintes sans erreur. Cumul ciblé 104 scénarios/contrôles hors largeurs, cache v57. Hors ligne HTTPS réel toujours PREUVE MANQUANTE. EN COURS, aucune VF.

## Suite ciblée — préparation des relations avant affichage (15 septembre 2026)

Avant correction, un graphe mal formé pouvait lever une exception après remplacement du titre et d’autres champs, tout en annonçant un secours statique conservé. Les collections du graphe et les champs nécessaires sont maintenant contrôlés et les cartes relationnelles préparées avant mutation visible. Un échec de préparation conserve titre, champs et relations existants. Les valeurs optionnelles inconnues gardent leurs libellés explicites.

Quatre scénarios source regroupés dans qa/project-render-checks.json : quatre graphes invalides, échec de préparation de carte, données réelles et titre absent. Tests cache des fiches et refus stockage réexécutés, 21 assertions cache, structure 16 pages/13 scripts et 76 empreintes réussis. Cumul ciblé 108 scénarios/contrôles hors largeurs ; cache v58. Aucune nouvelle preuve navigateur native revendiquée. EN COURS, aucune VF.

## Consolidation — seize routes dans Chrome (15 septembre 2026)

Source 20556b8dd00a1064745c1268a8e430e4b81ec373, rapport qa/browser-routes-checks.json : les seize fichiers HTML ont été ouverts directement dans Chrome local. Chacun expose un document.title non vide, un h1 et un main uniques ; aucun dépassement scrollWidth/clientWidth aux largeurs utiles observées (1348 px, 1363 px pour 404 sans scrollbar). Liens et repères aria-current de l’en-tête recensés.

Cette recette est une preuve de chargement/navigation DOM desktop, pas une revue exhaustive de rendu ou d’interaction. Images différées non toutes attendues, vrai statut HTTP d’une URL inexistante non testé, pas de zoom natif ni de nouvelle preuve lecteur d’écran/appareil physique/HTTPS hors ligne. Les 16 observations sont distinctes des 108 scénarios source et des mesures responsive antérieures. Aucun runtime modifié, cache v58 inchangé. EN COURS, aucune VF.

## Consolidation — évitement de navigation au clavier (15 septembre 2026)

Seize parcours Chrome desktop réalisés depuis une navigation directe : premier Tab → Aller au contenu ; Entrée puis Tab → élément appartenant à main. Sur l’accueil : Explorer les mods ; sur les quinze autres pages : Accueil du fil d’Ariane. Séquence finale effectuée avec touches réelles, sans focus programmatique ; détails dans qa/keyboard-skip-checks.json au SHA source 7f391007afce45166827e1562b6fe7eb9b897173.

Ce contrôle clôt uniquement la recette Chrome desktop de ce parcours d’évitement. Il ne prouve ni l’ordre complet de tabulation, ni les lecteurs d’écran, ni le mobile ou les autres navigateurs. Aucun runtime changé, cache v58 et cumul source 108 inchangés ; ces seize parcours natifs sont comptés séparément. EN COURS, aucune VF.

## Finition contenu — libellés des relations (15 septembre 2026)

Fiches projet : les codes techniques targets/supports/tested-on sont présentés comme Cible déclarée/Compatibilité déclarée/Environnement d’évaluation déclaré. Les six types du schéma ont un libellé français ; les types de contenu affichent Mod/Pack/Expérience/Outil/Ressource. Les trois cartes HTML de secours et l’affichage enrichi concordent. Les valeurs JSON, schémas et niveaux de preuve ne changent pas ; aucun test réel n’est déduit du seul type tested-on.

Chrome local, fiche Balanced : libellés français observés avec les états Inconnue/Estimée et leurs limites. Quatre scénarios de rendu, 21 assertions cache, structure 16 pages/13 scripts et 76 empreintes réussis. Cumul source inchangé (108), cache v59. Pas de validation exhaustive de localisation/lecteur d’écran ajoutée. EN COURS, aucune VF.

## Consolidation — menus étroits au clavier (15 septembre 2026)

Seize menus ouverts avec Entrée, premier lien atteint par Tab, fermeture par Échap et focus rendu au bouton ; aria-expanded passe de true à false. Observations Chrome local dans qa/mobile-menu-keyboard-checks.json, source 4f9a3da4f95151f33de32edd15d6e6391efba446. Iframe demandée à 390 px ; largeur utile 375 px mesurée sur la dernière page.

L’activation cible le bouton via locator.press : ce lot ne prouve pas sa découverte initiale au clavier. Tab et Échap passent ensuite par le clavier natif. Pas de preuve téléphone physique, lecteur d’écran, ordre complet de tabulation ou zoom ajoutée. Seize parcours séparés des 108 scénarios source. Aucun runtime modifié, cache v59 inchangé. EN COURS, aucune VF.

## Communauté — intégrité du catalogue local (15 septembre 2026)

Les collections et contributions contrôlent maintenant les identifiants publics (type, format, unicité), les noms des créations et ceux des jeux avant affichage ou restauration des brouillons. Un catalogue mal formé bloque la validation ; aucune collection partielle n’est proposée. Les entrées non publiques restent exclues. Aucun contrat distant ou branding historique n’est migré.

Cinq scénarios Node VM dans qa/community-contract-checks.json, dont six variantes mal formées et conservation des champs/sélections simulés ; ce n’est pas une preuve de restauration réelle du stockage. Chrome local : les trois créations réelles du catalogue démonstratif apparaissent dans les cases de collection et les options de contribution. Aucun brouillon enregistré ou effacé pendant cette inspection.

21 assertions cache et trois refus de stockage réexécutés sans erreur. Cumul source 113 scénarios/contrôles ; cache v60. Les 70 fichiers préchargés représentent 795050 octets bruts, 518875 octets gzip estimés, sans mesure de performance réelle. EN COURS, aucune VF ; limites externes inchangées.

## Contributions — focus des erreurs (15 septembre 2026)

Une validation, sauvegarde ou tentative d’export invalide dirige maintenant le focus vers le champ concerné et lui donne aria-invalid. L’aperçu pendant la saisie ne déplace pas le focus. Une saisie, un changement de type, un import valide ou une remise à zéro retire les anciens marqueurs avant nouvelle validation. Les contraintes locales restent identiques ; « Note de la review » devient « Note de l’avis » sans modifier le contrat review.

Cinq scénarios source Node VM dans qa/submission-focus-checks.json : aperçu passif, cible manquante, contenu blanc, note/parent conditionnels et retour à un brouillon valide. Chrome local : validation avec cible absente, focus sur Contenu ciblé, aria-invalid=true et message « Choisissez un contenu du catalogue public » observés. Aucun enregistrement local effectué. Lecture par synthèse vocale non exécutée.

Contrat Communauté (5), exports (6), cache (21), structure 16 pages/13 scripts et 76 empreintes vérifiés. Cumul source 118 scénarios/contrôles ; cache v61. EN COURS, aucune VF. Les essais externes et la revue exhaustive restent ouverts.

## Collections — focus des erreurs (15 septembre 2026)

Sauvegarde et export de collection dirigent maintenant le focus vers l’identifiant, le nom ou la description invalide et activent aria-invalid. L’aperçu reste passif. La saisie, un import valide ou une suppression locale réussie retirent les anciens marqueurs. Une indisponibilité du catalogue reste une erreur système, sans désigner un champ utilisateur comme fautif.

Cinq scénarios Node VM dans qa/collection-focus-checks.json. Chrome local : nom remplacé temporairement par des espaces, tentative de sauvegarde bloquée, focus sur Nom et aria-invalid=true observés ; valeur initiale remise et marqueur retiré à la saisie. Aucune sauvegarde réussie ni suppression pendant cet essai. Contrat Communauté (5), exports (6), cache (21), structure 16 pages/13 scripts et 76 empreintes vérifiés sans erreur.

Cumul source 123 scénarios/contrôles ; cache v62. EN COURS, aucune VF ; lecteur d’écran, appareils physiques, zoom natif, performances réelles et hors ligne HTTPS restent sans preuve nouvelle.

## Communauté — états vide et indisponible (15 septembre 2026)

Un catalogue vide explique désormais la possibilité de préparer une collection vide. Le sélecteur des contributions distingue absence de contenu, indisponibilité et choix disponibles. Une erreur de chargement explique la reprise et la conservation de la copie locale ; le terme technique fail-closed disparaît de ces messages publics. Aucun droit de publication ou téléchargement modifié.

Trois scénarios de rendu Node VM dans qa/community-empty-checks.json : vide valide, chargement échoué et retour des choix. Contrat Communauté (5), cache (21), structure 16 pages/13 scripts et 76 empreintes vérifiés. Aucune panne réseau réelle ni nouvelle preuve navigateur revendiquée. Cumul source 126, cache v63. EN COURS, aucune VF ; les preuves externes restent ouvertes.

## Revue visuelle Communauté — 15 septembre 2026

Deux captures actuelles de l’aperçu HTTPS et notes dans qa/visual-community-20260915/REVIEW.md. Panneau « Règles actives » ambigu pour des services futurs : remplacé par les actions locales disponibles, publication future explicitée. Cartes et métadonnée clarifiées, marque MODARYX conservée. Grille desktop des deux champs courts de collection préparée à partir de 900 px ; une colonne sous ce seuil.

Structure, scripts, empreintes, index/secours et cache prévalidés. Cumul source 126 inchangé ; cache v64. Le rendu après correction et la nouvelle grille responsive restent PREUVE MANQUANTE tant que l’aperçu accessible n’expose pas cette révision. EN COURS, aucune VF. Direction Loup/Dragon de l’accueil et des portails non modifiée.

Suivi du même lot : textes et grille desktop observés sur l’aperçu HTTPS, deux captures après correction ajoutées. Après actualisation, champs identifiant/nom alignés et actions visibles dans la fenêtre. Première visite : ancien style encore visible ; cause exacte non isolée. Responsive étroit de cette grille et cohérence pendant mise à jour restent PREUVE MANQUANTE. Aucun PASS hors ligne ou VF ajouté.

## Consolidation contenu et cache — 15 septembre 2026

`4e278ebce718c2892f138e611ed358aba3cc611b` : Profils, Sécurité et Téléchargements clarifiés. Trois captures pleine page de l’aperçu HTTPS inspectées après publication ; hiérarchie desktop et états indisponibles conservés. CTA vers les conditions de publication activé, titre non masqué par le header. Voir `qa/secondary-content-20260915.md`. Accueil Loup/Dragon également observé après chargement de ses images ; aucune identité fusionnée.

`6bd5f1821c3c9cd756a01cd7e65d806baa9576ee` : anciens CSS/JS servis depuis le cache malgré une ressource réseau plus récente, mécanisme reproduit en simulation. Révalidation des ressources UI non versionnées, avec repli local après échec réseau. Quatre assertions d’abord en échec puis réussies ; harnais cache 25, cumul source 130. Entrée PWA (9), métadonnées (6), structure et 76 empreintes revérifiées. Voir `qa/ui-cache-revalidation-20260915.md`.

EN COURS. Les tailles statiques restent sous 800000 octets précachés, mais le Catalogue dépasse la cible CSS de 725 octets. La consultation rapide des quinze routes secondaires confirme leurs titres et repères DOM ; une propriété de feuille de style non exploitable dans l’outil a été écartée comme preuve de chargement. Elle ne remplace ni une comparaison visuelle exhaustive ni la recette responsive.

PREUVE MANQUANTE : responsive des derniers textes/grille, états visuels exhaustifs, lecteur d’écran, zoom natif, appareils physiques, multi-navigateurs, performance réelle et cycle PWA HTTPS hors ligne/mise à jour. Hubs, corpus et services absents restent consignés dans le registre anti-oubli. Aucune validation globale finale ni VF déclarée.

## Reprise HTTPS après a1437aa — 15 septembre 2026

État actuel : **EN COURS, aucune VF**. Les paragraphes antérieurs restent des observations datées ; les nouvelles preuves ci-dessous ne valident pas rétroactivement tous les états.

- Budget CSS Catalogue fermé au commit 0747005 : 69776 octets, précache 796723 octets. Aucun changement de règle CSS.
- 36 mesures responsive ajoutées au commit a1437aa pour Communauté, Profils, Sécurité et Téléchargements, neuf largeurs par page : `qa/responsive-changed-pages-20260915.json`.
- `qa/https-browser-diagnostics-20260915.json` : seize navigations Chrome sur l'aperçu HTTPS, données Navigation Timing réelles et contrôle par un service worker activé sur les seize pages. Événement load observé entre 255,5 et 621,6 ms, un échantillon par page dans cette session. Cache non contrôlé ; aucun gain de performance, CWV, LCP/CLS/INP ou résultat appareil physique déduit. Aucune preuve de cycle hors ligne/mise à jour ajoutée.
- `qa/verify-browser-20260915.json` : fichier témoin abc effectivement sélectionné et haché dans Chrome. Correspondance, divergence, invalidation après saisie, hash mal formé avec focus/aria-invalid et calcul seul observés. Absence de fichier également vérifiée. L'effacement par le pilote n'avait pas changé la valeur ; essai écarté puis effacement clavier réellement observé. Aucune preuve de lecteur d'écran ou de gros fichiers ajoutée.

La recette HTTPS est donc accessible ; l'ancien blocage du serveur local ne bloque plus ces contrôles. Restent notamment : lecteur d'écran, zoom natif, appareils physiques/multi-navigateurs, états visuels exhaustifs, réseau/cache froid, cycle PWA hors ligne et mise à jour. Hubs et services non livrés demeurent explicitement ouverts dans l'anti-oubli. Aucun code produit ni infrastructure modifié par cette reprise de preuves.

## Vérificateur — association des erreurs, 15 septembre 2026

Correction produit `2f1820d544f74fd6a1577122d5b0eef1140a8b56` : les deux champs sont reliés au résultat par aria-describedby ; fichier absent marqué aria-invalid ; modification de l'empreinte seule ne retire pas l'erreur du fichier ; sélection d'un fichier retire ce marqueur. Sept scénarios Node renforcés et 25 assertions cache réussis. Les empreintes des trois sources modifiées sont actualisées (76 contrôlées), cache v67, précache 796985 octets. Structure et syntaxe sans erreur.

Chrome HTTPS après publication : aria-describedby=verify-result observé sur les champs ; clic sans fichier affiche le message et place le focus sur le sélecteur ; aria-invalid=true reste présent après saisie de l'empreinte. Un délai de lecture groupée a nécessité une nouvelle inspection DOM ; seules les observations effectivement obtenues sont retenues. Effacement du marqueur après sélection : vérifié par Node, pas rejoué dans Chrome sur ce commit. Lecteur d'écran toujours PREUVE MANQUANTE.

Essai de zoom via raccourci navigateur : largeur observée 1348 px avant/après, aucun changement démontré ; ce test est exclu des preuves de zoom 200/400 %. Aucun statut VF ajouté.

## Finish line — revue consolidée du 15 septembre 2026

Corrections `05d8e79` puis `c7d91ee` : champs Studio alignés, catalogue tablette recomposé, index projets équilibré, disponibilité publique clarifiée, harnais responsive protégé contre l’attribution au mauvais document.

Revue desktop des seize pages et preuves : `qa/finish-line/README.md`. 22 scripts source réussis ; 32 contrôles finaux à 320/960 sans débordement et 15 contrôles ciblés des trois compositions corrigées. Budgets statiques respectés : CSS max 69776, JS max 26968, précache 797096 octets. 19 captures archivées hors précache.

Cycle PWA réellement déconnecté, lecteur d’écran, zoom natif, appareils physiques et CWV restent PREUVE MANQUANTE. Les fonctions absentes du registre anti-oubli restent également ouvertes : ce ne sont pas uniquement des preuves externes. **VF NON VALIDÉE ; PR brouillon.**

## Studio — erreurs complètes et correction progressive, 15 septembre 2026

Correction c2b251b54ef306c4ea1ed90c8f9a229cd78a7af2 : une soumission vide annonçait huit erreurs mais ne présentait que les trois premières. Liste complète construite avec textContent, conteneur sémantiquement compatible, champs nativement invalides marqués aria-invalid après demande de validation et marqueurs retirés après correction. Règles métier et sauvegardes inchangées ; cache v70.

Chrome HTTPS : validation par Entrée, focus au premier champ invalide, huit erreurs/huit marqueurs, puis sept après correction d’un champ, puis message de conformité du format et zéro marqueur après complétion. Aucun brouillon enregistré ni publié. Trois mesures du même état d’erreur à 320/390/768 : aucun débordement horizontal. Liste complète inspectée visuellement à 768. Preuves : qa/studio-errors-browser-20260915.json.

Micro-preuves source : nouveau test du rendu 5 assertions, reçus 6, exports 6, cache 25 ; structure 16 pages, syntaxe 13 scripts et 76 empreintes sans erreur. Précache 797776 octets. Ces résultats ne valent pas certification par lecteur d’écran ni preuve de zoom natif.

EN COURS : VF non validée. Les preuves externes et fonctions non livrées du registre anti-oubli restent ouvertes. Aucun changement de direction Loup/Dragon, d’OS ou d’infrastructure.

## Studio — accès direct aux champs en erreur

Correction `565e821a6257af23efc5c980c4a2a992162b99e6` : liens nommés dans le résumé pour les dix chemins de validation explicitement associés aux champs ; messages non associés conservés en texte. Aucun mapping déduit pour un chemin inconnu. Soulignement, hauteur minimale 24 px et espacement des erreurs. Cache v71, précache 798622 octets.

Huit liens de formulaire vide activés avec Entrée dans Chrome HTTPS : focus sur les huit champs correspondants et contour solid observé. Les coordonnées lues immédiatement pendant le défilement ne constituent pas une preuve de visibilité ; seul le dernier champ a été réinspecté après stabilisation et dans la fenêtre. Trois contrôles responsive 320/390/768 sans débordement. Source : neuf assertions du renderer, six reçus, six exports, vingt-cinq cache ; structure/syntaxe/empreintes sans erreur. Voir `qa/studio-error-navigation-20260915.json`. Lecteur d’écran et ordre exhaustif de tabulation non certifiés par ces tests.

La revue desktop des seize pages reste documentée dans `qa/finish-line/README.md`. Ce lot améliore le parcours de correction ; il ne ferme ni les fonctions absentes, ni les validations externes, ni la VF.

## Brouillons — messages de validation et sauvegarde périmés

Correction `e2a43e37f626b218d526f2cb9240e97b95333ecf` : défaut reproduit dans Chrome, une contribution validée puis vidée conservait « Brouillon local valide » alors que son aperçu indiquait « incomplet ». Les modifications de contribution, type, collection et Studio affichent désormais un état non sauvegardé. Les sélections de fichiers d’import ne déclarent pas à elles seules une modification du contenu. Même message non réassigné à chaque frappe pour éviter les mutations inutiles de la région de statut.

Sept observations Chrome HTTPS documentées dans `qa/draft-edit-state-20260915.json` : retrait du succès périmé, revalidation bloquante avec focus, changement de type, édition de collection et sélection, Studio après erreur et après succès. Aucun brouillon enregistré, exporté ou publié pendant ce contrôle. Quatre mesures responsive, deux pages à 320/768, aucun débordement. Une première lecture de l’ancienne révision pendant publication a été écartée.

Régressions source exécutées : focus contributions 5 groupes, focus collections 5 groupes, stockage 3, exports 6, résumé Studio 9 assertions, cache 25 ; structure 16 pages, syntaxe 13 scripts et 76 empreintes sans erreur. Cache v72 ; précache 799390 octets, marge 610 sous le budget 800000. CSS maximal 69776 octets, JS déclaré maximal 28592 octets : mesures statiques, pas CWV.

EN COURS — VF non validée. Persistance réelle sauvegarde/édition/rechargement non rejouée par ce lot ; preuves externes et capacités absentes inchangées.

## Recherche — parcours et descriptions publiques

Commit produit `a0c8a39b4ded8a89262b746d602f14be695ac8f4` : quatre résumés rendus accessibles sans jargon fail-closed/receipt/artefact ; index JSON et secours HTML synchronisés, clés et contrats inchangés. Les démonstrations restent explicitement non téléchargeables et non attestées.

`qa/search-browser-20260915.json` : Chrome HTTPS, mêmes deux résultats pour CRÉER/creer, état vide sans perte de focus, retour aux quatorze résultats par effacement clavier, navigation Entrée vers le Studio. Après modification : nouveaux textes observés, ancien terme fail-closed sans résultat ; deux mesures à 320/768 et état vide à 320 sans débordement. L’appel d’effacement initial resté sans effet est exclu ; aucune panne du site déduite de cet appel pilote.

Six groupes de scénarios source recherche, cinq contrôles secours HTML, vingt-cinq assertions cache ; structure/syntaxe et 76 empreintes sans erreur. Cache v73 : 799420 octets précachés, marge 580 sous le budget proposé. Pas de nouvelle preuve de panne réseau réelle, lecteur d’écran, cycle hors ligne ou VF.

## Catalogue — persistance et focus natifs

Recette Chrome HTTPS sur `06f8bf8643e743940358ca13f8bb29eee91135ab`, sans modification produit : favori témoin conservé après rechargement ; retrait du dernier favori sous filtre donne zéro entrée et focus recherche ; vue nommée avec filtre Skyrim conservée après rechargement puis appliquée avec une entrée ; suppression clavier remet le focus au sélecteur des vues.

État initial vide vérifié avant toute écriture locale : trois favoris faux, aucune vue. Seules les données créées pour la recette sont supprimées. Dernier rechargement : trois entrées, favoris faux, aucune vue, état visible initial retrouvé. Preuves détaillées : `qa/catalog-persistence-browser-20260915.json`.

Ce lot ferme ces cinq parcours natifs ciblés. Il ne prouve ni redémarrage complet du navigateur, ni stockage saturé/refusé dans Chrome, ni synchronisation multi-onglets, lecteur d’écran, appareil physique ou cycle hors ligne. Les refus de stockage restent couverts par les preuves source précédentes. Aucun changement de cache, d’asset, de marque, d’OS ou d’infrastructure ; VF non validée.
