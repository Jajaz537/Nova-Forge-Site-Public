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
