# MODARYX Premium HD — état du candidat

> **SOURCE DE VÉRITÉ OPÉRATIONNELLE :** ce document conserve des preuves et états historiques attachés à leurs SHA d’origine. Il ne doit pas être utilisé seul pour déterminer le HEAD, le statut VF ou le prochain point actuel. Relire d’abord `CHECKPOINT-CANONIQUE-MODARYX-2026-09-18.md` et vérifier le HEAD Git frais avant toute écriture. Les valeurs historiques ci-dessous ne sont pas réattribuées au candidat courant.


**VF TECHNICALLY MAXIMAL CANDIDATE — aucune VF officielle annoncée.**

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

- Lecteur d'écran réel, zoom/reflow 400 %, appareils physiques et tactile réel. La passe 200 % ciblée couvre désormais six pages dans Firefox et Chromium, sans valoir recette exhaustive.
- Performance de rendu et mesures CWV sur hébergement réel ; poids statiques seulement mesurés dans `qa/PERFORMANCE-BUDGETS.md`.
- Installation PWA, cycle de mise à jour et hors ligne HTTPS réels. Le cache a des tests simulés, pas un PASS navigateur natif.
- Contraste exhaustif des gradients/transparences et état de chaque composant.
- Master NDI étendue à 46 entrées : NON RÉCUPÉRÉE ; document de 18 entrées lu.

## BLOQUÉ côté capacités publiques

Aucun artefact de téléchargement autorisé ; comptes, Guide, publication et services distants non connectés. Hubs jeux GTA6/RDR2 et corpus éditorial/médias correspondants encore manquants. Aucun de ces éléments n'est réputé terminé par la présence d'un schéma.

Une PR, un commit, un build ou une fusion ne clôture pas ces écarts. La surveillance d'achèvement ne doit pas notifier une VF à partir de ce document.

## Zoom/reflow 200 % ciblé — 19 septembre 2026

Sur le HEAD `b489b0a`, Firefox 156 et Edge/Chromium ont rendu l’accueil, le Catalogue, le Creator Studio, la Communauté, la Sécurité et l’index Jeux à deux largeurs équivalentes au reflow 200 %. Les 24 combinaisons passent sans débordement horizontal, contrôle coupé, élément interactif hors écran ni lien de menu compact masqué. Aucun défaut reproductible n’a nécessité de correction source. Preuves : `qa/zoom-reflow-20260919/README.md` et `results.json`.

Cette passe ferme seulement la lane visuelle 200 % sur ce périmètre. Le 400 %, le lecteur d’écran, le tactile, les appareils physiques et les états non exercés restent ouverts. **VF NON VALIDÉE.**

## Gate source consolidée — 16 septembre 2026

Le commit `02cb40464822bf77cd180d7ab71732b33c3d740c` clôt les contrôles autonomes actuels du dépôt. Après isolation et correction du mock DOM de métadonnées, le micro-test concerné passe avec six scénarios, puis la validation globale source passe **30/30**. Build statique : 17 pages sans erreur, 13 scripts valides, 84 empreintes conformes. Cache/PWA simulé : 34 assertions réussies, 76 fichiers locaux présents, 799981 / 800000 octets bruts et aucune modification protégée. Déploiement immuable réussi : `https://cf70d50e.nova-forge-site-public.pages.dev`.

Ce statut signifie uniquement que rien d’autre de réalisable de façon autonome dans le dépôt et l’environnement actuel n’est connu comme ouvert. Les lignes de `FINAL-EXTERNAL-VALIDATION-MATRIX.md`, les capacités sans backend/corpus/artefact/droits et les preuves natives indisponibles restent ouvertes. Elles interdisent toujours les libellés « VF officielle », « 100 % terminé » ou « validé ».

## Revue visuelle déployée — 16 septembre 2026

Le candidat `b6298ad70adecc46c3ae798543da991660f8dbac` a été déployé sur l’aperçu immuable `https://d97cce52.nova-forge-site-public.pages.dev`. Une comparaison Chromium avant/après a isolé puis corrigé le manque de profondeur du hero Profils en réutilisant l’asset Loup/Dragon existant. Communauté, Documentation, Sécurité, Téléchargements et Écosystème ont également été recapturés sur des aperçus immuables. Les fichiers et leur portée exacte sont consignés dans `review-evidence/visual-finish-20260916/README.md` au commit de preuve `d7b45d24cf0fdebf583e54167ce765988b7fbabb`.

Après la correction Profils : structure des 17 pages sans erreur, syntaxe des 13 scripts valide, 84 empreintes conformes et 34 assertions cache/PWA simulées réussies. Précache : 799981 / 800000 octets bruts ; aucune modification des fichiers d’infrastructure protégés. Ces résultats ferment l’écart visuel ciblé, mais ne prouvent toujours pas lecteur d’écran natif, appareils physiques, zoom natif 200/400 %, matrice Firefox/Safari, Core Web Vitals terrain ou cycle hors ligne HTTPS complet. **VF NON VALIDÉE.**

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

## Persistance native des trois brouillons locaux

Recette Chrome HTTPS sur `4fed30d2162e6e97e8c7b385951ad798833ca0f4`, aucune modification produit. `qa/draft-persistence-browser-20260915.json` contient sept observations Studio et quatre observations groupées Communauté, ainsi que les états initiaux et finaux.

Studio : sauvegarde valide, modification non enregistrée puis restauration de la version sauvegardée ; sauvegarde invalide bloquée sans écrasement ; sauvegarde explicite d’une révision retrouvée après rechargement ; effacement avec focus identifiant puis absence de brouillon après rechargement. Collections et contributions : sauvegardes restaurées avec leurs contenus/sélections, modifications non enregistrées écartées, tentatives invalides bloquées et anciennes copies préservées.

L’absence de données existantes a été vérifiée dans les champs et messages de restauration avant création. Seuls les témoins de recette ont été enregistrés puis supprimés ; état initial visible retrouvé pour les trois formulaires. Aucun envoi distant. La limite « sauvegarde/édition/rechargement non rejouée » du lot précédent est levée pour ces seuls parcours.

Cela ne certifie pas redémarrage complet du navigateur, appareil physique, lecteur d’écran, quota refusé natif ni cycle PWA hors ligne. Les sources et budgets restent inchangés. VF non validée ; capacités absentes du registre toujours ouvertes.

## Mouvement réduit — continuité accueil et pages secondaires

Défaut reproduit : mode réduit activé sur Catalogue (transition 0,00001 s, scroll auto), puis accueil ignorant la préférence (transition 0,16 s, scroll smooth). Cause : initialisation du réglage dépendante de .topbar, absent de l’accueil ; règles CSS explicites absentes de sa feuille chargée.

Correction `fa54d0be9eabe1606e1d098ad3abcf84d74d92d1` : initialisation séparée de la navigation, contrôle conservé dans le header secondaire et ajouté au footer de l’accueil ; styles existants déplacés vers la feuille commune, hauteur minimale conservée à 44 px. Pas de copie du contrôle de menu ni de changement artistique.

Chrome HTTPS : préférence réduite, aria-pressed=true et scroll auto observés sur les seize pages. Durées calculées et hauteurs consignées dans `qa/motion-browser-20260915.json`. Accueil sans débordement à 320/768/1280 ; contrôle mobile inspecté visuellement, activé par Entrée, retour au mode système conservé après navigation. État initial de préférence restauré.

Source : neuf contrôles entrée PWA, vingt-cinq cache, seize pages, treize scripts et 76 empreintes ; feuille commune présente sur toutes les pages. Précache 799589 octets, CSS max 69802 : budgets respectés sans mesure CWV revendiquée. Ce lot prouve le choix explicite du site ; bascule réelle de préférence OS, inventaire exhaustif des animations, appareils physiques et lecteur d’écran restent non certifiés. VF non validée.

## Menus mobiles et séparation des produits

Sur `51241fc`, Chrome HTTPS à 320 px : les deux menus passent aria-expanded false → true avec Entrée puis false avec Échap. Le lien ancré Mods ferme le menu d’accueil ; le lien Créer du menu secondaire mène au Studio. Catalogue avec menu ouvert : aucun débordement. Aucun nouveau PASS de focus après Échap n’est déduit de ces seuls états ARIA.

Correction éditoriale `dc0f8bf2f8be665786209ffcd932fca5ea28db5d` : bouton historique « État du Bridge OS » devient « Lien avec Nova Forge OS », libellé de secours « Bridge OS » devient « Pont vers Nova Forge OS ». Deux occurrences classées surface utilisateur actuelle ; clés, contrats et état non connecté inchangés. Activation Entrée observée : message de pont optionnel inactif, aucune connexion revendiquée. Accueil sans débordement à 320/768. Preuves dans `qa/mobile-menu-browser-20260915.json`.

Six contrôles métadonnées, cinq secours HTML, vingt-cinq cache ; structure/syntaxe/76 empreintes vérifiées. Cache v75, précache 799608 octets. Les tests sans rapport n’ont pas été relancés. VF non validée ; limites de recette et capacités absentes inchangées.

## Fiches — favoris partagés et droits lisibles

Chrome HTTPS sur `e8bc038` : chacune des trois fiches ajoute son favori, le catalogue le retrouve activé, puis le retrait depuis le catalogue est retrouvé sur la fiche. Seuls les trois favoris témoins initialement désactivés ont été manipulés ; tous sont revenus à false. Retour clavier au catalogue observé depuis Forge Night. États de démonstration sans téléchargement conservés.

Correction `1aeb909e02e42d2d38ea31d2aa45bdca4b65b187` : sentinel technique UNSPECIFIED-PREVIEW rendu « Non précisée — aperçu » dans les trois secours HTML et le renderer. Donnée contractuelle inchangée ; les autres licences conservent leur libellé. Les trois pages affichent le nouveau texte après publication et maintiennent « Non autorisée » pour la redistribution. Six mesures à 320/768 sans débordement. Preuves : `qa/project-browser-20260915.json`.

Quatre groupes renderer et trois scénarios cache-label réussis, vingt-cinq cache, structure/syntaxe et 76 empreintes sans erreur. Diff Git limité aux trois HTML, renderer, worker, empreintes et rapport cache ; aucune donnée contractuelle modifiée. Cache v76 : 799709 octets. Aucune preuve de synchronisation multi-onglets, de distribution, lecteur d’écran ou appareils physiques ajoutée. VF non validée.

## Profil local — contenu français, 15 septembre 2026

Présentation des observations et protocole d’essai clarifiés : Observé/Estimé/Inconnu, sauvegarde et restauration des réglages. Les codes internes Measured/Estimated/Unknown sont conservés ; aucune mesure de jeu, modification système ou persistance de résultat ajoutée. Source : `assets/app.js`.

Syntaxe, structure des 16 pages, 76 empreintes et 25 assertions cache vérifiées ; précache v77 : 799626 octets bruts, sous le budget 800000. Le résultat natif après publication reste à consigner. **EN COURS, VF non validée.**

### Preuve native du profil et consolidation

`qa/profile-browser-20260915.json` : observation du nouveau texte français dans Chrome HTTPS après propagation, trois réponses du protocole activées au clavier, fermeture, deux mesures de reflow du protocole ouvert (320/768) sans débordement. Ce sont des tests d’interface, aucun essai de jeu réel. Les branches matérielles inconnues ne sont pas certifiées.

`qa/PROOF-MATRIX-CURRENT.md` regroupe les preuves existantes et leurs limites ; `MODARYX-NEXT-BATCH.md` actualisé. Les services/corpus manquants restent explicitement ouverts et ne sont pas réduits à des preuves externes. **VF NON VALIDÉE.**

## Liens du vérificateur — empreinte invalide

Défaut reproduit dans Chrome : arrivée avec `#sha256=incorrect` sans avertissement. Correction : le lien SHA-256 vide, mal formé ou indécodable affiche une erreur explicite, invalide le résultat antérieur et exige correction/effacement. Un calcul en attente ne peut publier son ancien résultat après ce changement. Aucune valeur du lien n’est injectée comme HTML.

`qa/check-verify.cjs` : neuf groupes réussis dont refus avant lecture et interruption de résultat périmé ; 25 assertions cache, structure 16 pages/13 scripts/76 empreintes réussies. Cache v78, 799939 octets bruts. Preuve native après publication à compléter ; VF NON VALIDÉE.

### Liens du vérificateur — observation native

`qa/verify-fragment-browser-20260915.json` : Chrome HTTPS confirme trois liens invalides (texte incorrect, vide, encodage invalide) en état warning avec aria-invalid ; une empreinte valide préremplit ensuite le champ en état neutre. L’annulation d’un calcul en attente reste une preuve Node ciblée, pas un scénario natif exécuté ici. Aucune preuve lecteur d’écran ajoutée. VF NON VALIDÉE.

## FAQ et aperçus JSON — états ouverts, 15 septembre 2026

Recette Chrome HTTPS sur `a4911e16e02e403a3cf97b8d952a9ae9c65066e8` : quatre FAQ et deux panneaux JSON ouverts avec Entrée puis fermés avec Espace. Tab depuis les deux résumés ouverts atteint respectivement collection-preview et submission-preview. Quatre mesures des panneaux ouverts à 320/768 sans débordement horizontal. La première tentative de mesure pendant Chargement est écartée ; résultats conservés après stabilisation.

Preuve : `qa/disclosure-browser-20260915.json`. Aucun code produit, cache ou infrastructure modifié. JSON de brouillons initiaux seulement ; longs imports arbitraires et lecteur d’écran non certifiés. **VF NON VALIDÉE**, manques fonctionnels et externes inchangés.

## Communauté — aperçus longs, 15 septembre 2026

`qa/long-preview-browser-20260915.json`, source `8daaf440c7da1d1e8b8aa382242e7c31791390d2` : description saisie de 1200 caractères sans espaces et contribution de 8000 caractères multilingues avec balises littérales. Les aperçus ne créent aucun élément enfant ; le JSON reste du texte. Ctrl+Fin atteint le bas du panneau de contribution après stabilisation (1113/1113 px). Deux mesures avec panneaux ouverts à 320/768 sans débordement horizontal.

Aucune sauvegarde effectuée ; rechargement final confirme description, titre et corps vides comme à l’entrée. Aucun code produit modifié, aucune nouvelle recette d’import/export, RTL complet ou lecteur d’écran revendiquée. **VF NON VALIDÉE.**

## Contributions — variantes natives, 15 septembre 2026

Source `653bec05706d26cc975142f1ff3de12b1b684d8b`, Chrome HTTPS : notes 0, 6 et 2,5 refusées avec focus/aria-invalid sur la note ; 5 acceptée. Parent vide du commentaire refusé avec focus ; parent au format valide accepté. Le JSON commentaire exclut titre/note ; le retour Discussion exclut note/parent. L’existence réelle d’une contribution parente n’est pas vérifiée par ce formulaire local.

Sept observations dans `qa/submission-variants-browser-20260915.json`. Aucun brouillon sauvegardé ni publié, rechargement final revenu à Discussion avec champs vides. Aucun code produit modifié. **VF NON VALIDÉE**, limites externes et capacités absentes maintenues.

## Précache — ressource historique sans consommateur

Revue sur `d16fbd4eafbd7ee881d992aa16d23b2bf775b1a9` : `assets/nova-kingdom-panorama.svg` n’apparaît que dans la liste de précache (hors empreinte), pas dans les pages, styles, scripts ou manifestes actuels. Retrait de cette seule entrée du service worker ; asset et empreinte conservés, aucune substitution de marque. Art Loup/Dragon inchangé.

Cache v79 : 69 fichiers uniques, 797554 octets bruts contre 799939 ; économie statique de 2385 octets et une requête d’installation. Estimation gzip 518464 octets. Ce gain ne constitue pas une amélioration CWV mesurée. 25 assertions cache réussies ; 16 pages/13 scripts/76 empreintes vérifiés, aucune configuration protégée modifiée. Cycle natif hors ligne/mise à jour toujours PREUVE MANQUANTE. VF NON VALIDÉE.

## Profils — détection partielle correctement signalée

Sur `01f2a9e5a70a1740138b3a33df72134ae4d0921e`, le statut final disait « Capacités locales vérifiées » même lorsqu’une API manquait ou rejetait la requête. Le résumé distingue maintenant « Détection partielle — résultat inconnu » de « Détection locale terminée ». Les résultats individuels restent inchangés ; aucune passkey ni authentification réelle n’est certifiée.

`qa/check-profile-detection.cjs` : sept scénarios simulés réussis (absence WebAuthn, réponses true/false, absence/rejet de chaque méthode). 25 assertions cache, structure des 16 pages, 13 scripts et 76 empreintes vérifiés. Précache v80 : 797664 octets. Ces preuves sont source/Node, pas une recette matérielle de connexion. VF NON VALIDÉE.

## Profils — limite native et rendu, 15 septembre 2026

`qa/profile-capabilities-browser-20260915.json` : l’environnement Chrome HTTPS ne fournit pas WebAuthn ; statut « WebAuthn indisponible » et deux capacités non testables observés. Deux mesures à 320/768 sans débordement. Les branches nouvelles détection partielle/terminée restent testées en Node uniquement : aucune fausse preuve native ajoutée. Aucun compte ni clé créé.

Matrice et prochain bloc actualisés après `5d0f3de054d17b03b4795a1cd9168bf3d92c55f0`. Ne pas tourner en boucle sur les parcours déjà couverts ou les API indisponibles. Les capacités produit absentes et les preuves externes restent ouvertes. VF NON VALIDÉE.

## Imports Communauté — préserver les modifications récentes

Source de départ `d3e8a95fd500af96ee633f54a4406f16f4526bcf`. Les lectures asynchrones de collection/contribution pouvaient remplacer un formulaire modifié pendant la lecture. Révision indépendante par formulaire : saisie, changement de fichier, suppression et import plus récent rendent l’ancien résultat inapplicable. Les erreurs d’une lecture périmée ne remplacent pas non plus le retour utilisateur récent ; copier les favoris invalide aussi un import de collection en attente.

`qa/check-import-races.cjs` : dix scénarios source avec lectures différées, dont saisie récente, nouveau fichier, suppression, import concurrent et JSON invalide. Nouvel import valide effectivement appliqué avant de vérifier que le plus ancien est ignoré. Aucun parcours natif de fichier revendiqué.

`qa/check-states.cjs` a d’abord échoué car son faux événement omettait target ; correction limitée au mock puis sept scénarios réussis. Trois contrôles stockage et 25 assertions cache réussis ; structure 16 pages/13 scripts/76 empreintes vérifiée. Cache v81 : 798369 octets bruts. Aucun changement d’infrastructure. VF NON VALIDÉE.

## Creator Studio — imports asynchrones sans écrasement

Départ `99d4e302b1a067d259615b7db8e2976096999adb`. Révision du brouillon suivie avant/après attente du schéma et lecture du fichier : un import périmé ne remplace plus les champs ou le message après saisie, changement de fichier, effacement ou nouvel import. L’intention d’import empêche également la restauration automatique tardive du brouillon sauvegardé.

`qa/studio-import-state-checks.json` : douze scénarios Node réussis, dont cinq nouveaux liés aux imports retardés. Le nouvel import concurrent est effectivement appliqué avant vérification de l’abandon de l’ancien. Simulation uniquement ; course temporelle via sélection native non prouvée. 25 assertions cache, 16 pages/13 scripts/76 empreintes vérifiés. Cache v82 : 798636 octets. VF NON VALIDÉE.

## Import natif — autorisation refusée

Tentative depuis le candidat `6cf86a2a7722237120cdf91c532252d962979391` : le sélecteur de fichiers documenté a été ouvert sur Communauté avec un fichier JSON synthétique, sans données personnelles et sans sauvegarde prévue. L’action setFiles a été rejetée par le contrôle d’autorisation du navigateur, motif retourné : permission utilisateur déclinée. Aucun contournement tenté, aucun bouton Importer ensuite activé, aucune preuve de sélection/import ajoutée.

**PREUVE MANQUANTE** : imports natifs et courses temporelles en navigateur. Les résultats Node précédents gardent leur portée simulée. Cette limite d’autorisation remplace l’hypothèse d’absence technique du sélecteur : l’API existe, son usage a été refusé pour cette destination. La reprise de ce parcours exige une autorisation navigateur effectivement accordée ; ne pas redemander ou réessayer automatiquement. Aucune modification produit/infrastructure. VF NON VALIDÉE.

## Contrats d’import — champs inconnus et types, 16 septembre 2026

Départ `b2a34a7b62113cf0a5565090f504b7e3114a183c`. Les contrats Collection/Contribution interdisent additionalProperties, mais les imports acceptaient des champs supplémentaires ; le JSON d’une contribution pouvait les afficher. Les propriétés non reconnues sont maintenant refusées avant application, ainsi que les identifiants numériques précédemment convertis en chaînes (ID et parent). Aucun schéma historique renommé, aucune migration de marque.

Douze contrôles d’import source réussis, dont deux groupes ajoutés couvrant cinq fichiers hors contrat ; brouillon courant préservé. Le premier passage a révélé un défaut de fixture concurrente (name et body ajoutés aux deux types) : fixture corrigée pour respecter chaque contrat, puis test rejoué avec succès. Douze contrôles d’états, 25 assertions cache, 16 pages/13 scripts/76 empreintes réussis. Cache v83 : 799211 octets bruts.

Les fichiers ne sont pas nettoyés silencieusement : l’import est refusé avec message. Import natif toujours bloqué par l’autorisation navigateur antérieure ; aucun nouvel essai de sélection. VF NON VALIDÉE.

## Budgets statiques bloquants — 16 septembre 2026

Le contrôle de cache mesurait les poids sans échouer sur dépassement. `qa/performance-limits.mjs` formalise les seuils déjà retenus (800000/70000/30000 octets) ; `qa/check-cache.mjs` sort maintenant en erreur en cas de dépassement, mesure invalide ou inventaire vide. Dix contrôles synthétiques de limites réussis ; 34 évaluations sur le site actuel et 25 assertions cache réussies. Précache 799211, CSS max 69802, JS max 29002.

Aucun runtime, asset, cache versionné ni workflow de déploiement modifié ; la porte est exécutée par le script, pas revendiquée comme contrôle GitHub obligatoire. Pas de preuve CWV ajoutée. VF NON VALIDÉE.

## Consolidation source et routes — 16 septembre 2026

Référence `82d958f99fe9eed064602fec45163173a6045580`. Les 26 scripts check-* ont été exécutés avec arrêt prévu au premier échec : tous terminent à code 0, sans correction supplémentaire. Résultats complets dans `qa/source-consolidated-20260916.json`. Les rapports générés sont identiques au Git sauf l’horodatage du rapport cache.

Chrome HTTPS : 16 routes ouvertes, chacune avec titre, h1 et main uniques ; aucun débordement horizontal aux largeurs desktop observées (1348/1363 px). `qa/routes-consolidated-20260916.json`. Ce ne sont pas 16 nouveaux audits visuels ni une validation de tous les chargements asynchrones. Les 30 erreurs consultées provenaient d’une extension de navigateur, pas de source MODARYX ; aucun PASS global console déduit de cet échantillon.

Aucun runtime/infrastructure modifié. Les imports natifs restent bloqués par autorisation, les autres limites externes et capacités produit absentes restent ouvertes. VF NON VALIDÉE.

## Recherche — récupération depuis la page, 16 septembre 2026

Après `3f457a2edc89d55ebd5e4166d7e30d5e0f3f266c`, ajout d’un bouton Réessayer quand l’index enrichi est indisponible. Le répertoire HTML reste accessible pendant la relance. Une seule requête peut être en attente ; le focus revient dans la recherche en cas de succès, ou sur le nouveau bouton en cas d’échec répété. Aucun service distant supplémentaire.

Huit groupes de contrôles recherche source réussis, dont récupération, déduplication et focus après nouvel échec. 25 assertions cache et budgets réussis ; structure 16 pages/13 scripts/76 empreintes vérifiée. Cache v84 : 799674 octets bruts. Panne/récupération testée en Node uniquement ; pas de panne réseau native provoquée ni de preuve lecteur d’écran ajoutée. VF NON VALIDÉE.

## Recherche après publication — 16 septembre 2026

`qa/search-recovery-native-20260916.json` sur f4372ee : index chargé, champ actif, 14 résultats ; Skyrim donne une fiche ; effacement clavier rétablit 14 résultats. Aucun bouton Réessayer lorsque le chargement réussit. Ces trois observations natives ne prouvent pas une panne/récupération réelle, encore simulée uniquement. Point de reprise clarifié en distinguant couverture source, preuves externes et développement produit absent. Aucun runtime modifié. VF NON VALIDÉE.

## Restauration différée Communauté — 16 septembre 2026

Départ `467245945927bdde16d54cde266ef0d902242c0c`. Défaut reproduit en Node avant correction : « Fresh before catalog » remplacé par « Imported » à la résolution tardive du catalogue. La restauration automatique est maintenant conditionnée à l’absence de révision du formulaire concerné. Une collection éditée n’empêche pas la restauration d’une contribution intacte, et inversement. Les copies stockées ne sont pas supprimées.

Quatorze contrôles import/restauration réussis, dont deux nouveaux cas différés ; cinq groupes contrat catalogue réussis. Le test unitaire qui extrait loadCatalog a d’abord échoué faute de revisions dans son contexte ; ajout de la dépendance dans le mock, puis réussite. 25 assertions cache/budgets, structure 16 pages/13 scripts/76 empreintes vérifiés. Cache v85 : 799740 octets. Course temporelle prouvée en simulation uniquement ; aucune nouvelle sélection native de fichier. VF NON VALIDÉE.

## Index projets — intitulés explicites, 16 septembre 2026

`ccbfdf3ee57817272fa205f4afcc0f35ac39db1b` : « Mini-hubs publics » devient « Projets de démonstration » ; les trois liens nomment chacun leur projet ; le lien technique indique « Données de compatibilité (JSON) ». Les routes, le statut démonstration, l’absence de téléchargement et l’art restent inchangés. Méta-description clarifiée.

Source : 25 assertions cache, budgets, structure 16 pages/13 scripts/76 empreintes réussis ; précache v86 : 799800 octets. 217 fichiers Git comparés au miroir, aucune différence. Chrome HTTPS a effectivement affiché les trois nouveaux libellés. La séquence suivante navigation/reflow a expiré et réinitialisé le navigateur : aucun résultat de cette séquence n’est revendiqué, responsive des nouveaux intitulés PREUVE MANQUANTE. Aucun contournement du refus d’import. VF NON VALIDÉE.

## Index projets — reprise native, 16 septembre 2026

Sur d2929d0, les trois liens explicites ont ouvert les bonnes fiches par Entrée. Reflow 320/768 : largeurs utiles 305/753, scrollWidth identique, aucun tabindex positif. Preuve `qa/project-directory-native-20260916.json`. Inspection de la portion tablette affichée : en-tête, introduction et première carte lisibles. Le contrôle interrompu précédent est complété pour ce périmètre uniquement. Une sélection h1 ambiguë dans le test a été corrigée sans modifier le produit. Pas de parcours Tab complet, appareil physique, zoom natif, lecteur d’écran, offline ni CWV ajouté. VF NON VALIDÉE.

## Cache indisponible — repli réseau, 16 septembre 2026

Départ 952f2dedac3ac0ddc86c6ab95812a76e97f05e0e. Défaut reproduit par injection d’un échec cache.match : une ressource cache-first rejetait sans tenter le réseau. readCache traite maintenant les échecs d’ouverture/lecture comme une absence d’entrée. Réseau disponible : ressource servie ; réseau et cache indisponibles : erreur réseau explicite pour les métadonnées. L’installation reste stricte : aucun succès d’installation sans précache complet.

31 assertions source cache réussies, dont six nouvelles sur les échecs match/open. Budgets statiques respectés (799800 octets bruts), fichiers protégés inchangés. Version cache v87, empreintes recalculées. Aucun test réseau/offline natif revendiqué ; VF NON VALIDÉE.

## Catalogue — liens de fiches et langage public, 16 septembre 2026

Depuis ce73e85 : liens « Voir la fiche », chacun avec un nom accessible contenant le libellé visible et le nom du projet, dans le HTML de secours et le rendu enrichi. « Fail-closed » devient « Preuves requises » ; la description technique de la première carte statique est simplifiée. Routes, données, favoris, filtres et direction Loup/Dragon inchangés.

Structure des seize pages, syntaxe des treize scripts, 76 empreintes et 31 assertions cache contrôlées sans erreur. Cache v88, 799970 octets bruts sous le budget 800000 ; marge seulement 30 octets. Aucun lecteur d’écran natif ni nouvelle recette visuelle revendiqué. VF NON VALIDÉE.

## Catalogue — noms de liens observés, 16 septembre 2026

Sur 3d641a6 : trois libellés visibles « Voir la fiche », chacun inclus dans son aria-label distinct. Observés avant hydratation puis après data-hydrated ; les liens enrichis incluent le suffixe Preview. Reflow du catalogue enrichi à 320/768 : largeurs utiles et scrollWidth identiques 305/753, aucun tabindex positif. Preuve `qa/catalog-link-names-native-20260916.json`. Aucun lecteur d’écran, activation des liens ni audit visuel exhaustif dans ce lot. VF NON VALIDÉE.

## Catalogue dégradé — contrôles honnêtes, 16 septembre 2026

Depuis 6c334c3, échec du catalogue enrichi : filtres, réinitialisation, sauvegarde/application de vue désactivés ; consultation des cartes, favoris et suppression des vues conservées. Sélectionner une vue ne réactive plus Appliquer lorsque les données sont absentes. Les messages distinguent l’échec en ligne du hors ligne et proposent de recharger. Aucun effacement de données locales.

Sept groupes contrat catalogue (dont dix variantes malformées et deux rejets réseau), deux scénarios de qualification cache, 31 assertions service worker et contrôles structure/empreintes réussis. Preuves Node uniquement pour la panne réseau. Index recherche compacté sans changement des données (égalité JSON vérifiée), 1578 octets économisés. Cache v89 : 798633 octets bruts. VF NON VALIDÉE.

## Catalogue — parcours normal après garde dégradée, 16 septembre 2026

Sur ec835ba, données enrichies observées dans Chrome HTTPS : filtre Minecraft 1 entrée, création d’une vue locale temporaire et activation d’Appliquer, réinitialisation 3 entrées, application 1 entrée. Vue de test supprimée, confirmation affichée, Appliquer désactivé ; réinitialisation finale à 3 entrées. `qa/catalog-normal-after-failure-guard-20260916.json`. Ce résultat protège le parcours normal concerné ; aucun échec réseau natif ni lecteur d’écran testé. VF NON VALIDÉE.

## Vérificateur — calcul périmé évité, 16 septembre 2026

Depuis 63c3f1a, changement de sélection pendant arrayBuffer : le hachage n’est plus lancé après la fin de cette lecture. Défaut reproduit avant correction : un appel digest au lieu de zéro. La lecture déjà engagée n’est pas annulée. La garde après digest reste nécessaire et conservée pour les changements pendant un calcul déjà lancé.

Dix groupes vérificateur réussis, avec Web Crypto réel dans Node pour les résultats de hachage et délais simulés pour les courses ; bouton libéré et résultat périmé masqué dans les deux phases. 31 assertions cache et budgets, structure et 76 empreintes réussis. Cache v90 : 798679 octets. Aucun gain de durée chiffré ni course native navigateur revendiqué. VF NON VALIDÉE.

## Index jeux — capacité retenue intégrée au candidat, 16 septembre 2026

Depuis e776167 : ajout de `/games/`, index statique généré depuis les trois jeux publics du catalogue de démonstration. Liens vers les fiches, entrée depuis le catalogue et la recherche (15 entrées). Pas de hubs GTA 6/RDR2, pages de catégories, corpus réel, téléchargement ou partenariat implicite. Générateur `qa/build-games-index.py`, dérive vérifiée par check-site -- le fichier généré doit rester conforme aux données.

Route indexée dans le shell/cache, alias `/games/`, `/games/index` et `/games/index.html` contrôlés. QA structurelle et budgets étendus à la 17e page et aux chemins relatifs imbriqués. Schémas JSON compactés : 7586 octets économisés et égalité JSON vérifiée, aucune clé/contrat renommé. 34 assertions cache, neuf contrôles entrée PWA, huit groupes recherche et structure 17 pages/13 scripts/77 empreintes réussis. Cache v91 : 796606 octets bruts. Aucun fichier d’infrastructure, sitemap ou robots modifié. Preuves navigateur de la nouvelle page encore à produire ; VF NON VALIDÉE.

## Index jeux — recette native et répertoire de secours

Sur fdb51cb, entrée depuis Catalogue, trois liens de fiches activés par Entrée et découverte via recherche (« Jeux du catalogue », un résultat). Quatre cadres 320/430/768/1440 sans débordement ; composition desktop et haut mobile inspectés. Preuve `qa/games-directory-native-20260916.json`, limites explicites. Un premier screenshot mobile encore rendu à 1440 a été écarté et repris après mesure stabilisée.

Correction liée : ajout du résultat Jeux au répertoire HTML de secours de la recherche ; comparaison automatisée des ensembles de liens avec l’index. Structure/génération/77 empreintes et 34 assertions cache réussies. Cache v92, 796791 octets bruts. Ces observations ne valent ni recette exhaustive de la 17e page, ni hors ligne réel, ni VF. Hubs et catégories restent ouverts.

## Parcours fiches → jeux, 16 septembre 2026

Depuis e383029 : ajout du jeu dans le fil d’Ariane des trois fiches, lien vers son ancre dans `/games/`. Mapping issu de data/catalog.json, sans modification des données ou de la distribution. Contrôle structurel des 17 pages : liens et ancres présents ; 77 empreintes et 34 assertions cache vérifiées. Cache v93 : 797039 octets. Aucun test natif de ce nouveau trajet retour revendiqué à ce stade ; VF NON VALIDÉE.

## Retour fiche → jeu — recette native, 16 septembre 2026

Sur 9f0d4f0, les trois fils d’Ariane ouverts par Entrée aboutissent aux ancres Skyrim, Cyberpunk et Minecraft attendues. Trois mesures des fiches à 320 : largeur et scrollWidth 305, aucun tabindex positif. Skyrim desktop : cible top 99,92 px sous l’en-tête à 76 px. Minecraft mobile : capture inspectée, titre et carte sous l’en-tête fixe ; mesure géométrique du cadre indisponible, aucun chiffre revendiqué. Preuve `qa/project-game-return-native-20260916.json`. Délais de lecture DOM isolés, pas de correction produit nécessaire. VF NON VALIDÉE.

## Index jeux — composition des portails, 16 septembre 2026

Depuis 60299be : introduction en deux colonnes sur desktop, une colonne sur mobile, avec le visuel de portails MODARYX déjà utilisé à l’accueil. Asset inchangé, explicitement décrit comme illustration d’ambiance et non capture des jeux. Dimensions intrinsèques 1200×675, ratio préservé, aucun nouveau script ni animation. Générateur et page synchronisés.

Structure 17 pages/77 empreintes et 34 assertions cache/budgets réussies. Cache v94, 797635 octets bruts ; image déjà précachée, aucun fichier image ajouté. Recette visuelle du nouveau cadrage à effectuer après publication candidate. VF NON VALIDÉE.

## Index jeux — recette des portails

Sur 048db73 : image chargée, capture desktop inspectée (texte/image côte à côte), capture mobile 320 inspectée après défilement (trois portails entiers, légende lisible, aucun recouvrement visible). Reflow 320/768/1440 : scrollWidth égale à la largeur utile 305/753/1425. `qa/games-portals-native-20260916.json`. Ni CLS/LCP, ni appareil physique, ni zoom natif prouvés. VF NON VALIDÉE.

## Génération jeux — intégrité des données, 16 septembre 2026

Depuis a7d9025 : doublon de projet public reproduit dans un répertoire temporaire, accepté à tort par le générateur alors que le catalogue le refuse. Garde explicite ajoutée avant toute écriture. Cinq groupes de contrôles isolés réussis : trois groupes actuels et détection de dérive sans écriture, exclusion d’entrée privée incomplète, échappement des noms, refus du doublon, préservation de la page lors de données vides/chemin invalide/téléchargement actif/identité de jeu contradictoire. `qa/games-generator-checks.json`.

Mode --check réussi sur les données courantes ; page générée strictement inchangée. Aucun runtime, visuel, cache ou fichier d’infrastructure modifié ; pas de nouvelle recette navigateur nécessaire pour ce correctif du générateur. VF NON VALIDÉE.

## Descriptions publiques harmonisées, 16 septembre 2026

Depuis db808eb : trois descriptions communes aux données, à l’accueil, au catalogue et aux fiches statiques. Jargon « pipeline de métadonnées », « local-first » et « artefact publié » retiré de ces résumés, sans modifier les états de compatibilité/distribution. Les liens accueil deviennent « Voir la fiche » avec nom accessible contextualisé, comme le catalogue. Index de recherche conservé : ses résumés courts étaient déjà cohérents avec ces limites.

Sept scénarios catalogue accueil, structure 17 pages/13 scripts/77 empreintes, 34 assertions cache et budgets réussis. Cache v95 : 798035 octets bruts. Recette responsive des textes modifiés non réexécutée dans ce lot ; ne pas réattribuer les captures précédentes. VF NON VALIDÉE.

## 2026-09-16 — Reflow des textes Catalogue et accueil

TERMINÉ sur ce périmètre : dix mesures navigateur des cinq pages modifiées par `0c1c809`, aux cadres 320/768 px, sans débordement horizontal ; trois noms accessibles contextualisés observés après chargement sur l’accueil. Voir `qa/catalog-copy-native-20260916.json`. Aucun changement runtime ni nouveau test source nécessaire pour ce lot documentaire. VF NON VALIDÉE ; les limites de la matrice restent ouvertes.

## 2026-09-16 — Téléchargements : distinguer absence et panne

Défaut reproduit : un fetch rejeté affichait « Aucun téléchargement public déclaré disponible », comme une réponse valide sans fichiers. Correction : statut de chargement puis erreur explicite, bouton Réessayer, requêtes simultanées ignorées, focus rendu au statut ou au bouton après tentative. Le statut quitte le badge étroit pour un paragraphe accessible. Une copie hors ligne reste verrouillée et propose une nouvelle tentative ; aucun artefact ajouté.

Cinq groupes Node ciblés réussis (`qa/download-recovery-checks.json`) après échec initial reproduit ; six contrôles de métadonnées publiques préservés. Cache v96 : 34 assertions, 799191/800000 octets bruts ; structure 17 pages, 13 scripts, 77 empreintes vérifiée. Rendu navigateur après publication encore à observer ; récupération native après panne et lecteur d’écran PREUVE MANQUANTE. Aucune VF.

### Observation après publication de 59c39da

Statut normal, zéro artefact et bouton Réessayer masqué observés dans le navigateur. Composition de la section Disponibilité inspectée à 1348 px ; deux mesures de reflow, cadres 320/768 (utiles 305/753), sans débordement. Preuve : `qa/download-status-native-20260916.json`. Cette observation ferme le rendu normal ciblé ; elle ne ferme ni la panne native ni le cycle PWA. VF NON VALIDÉE.

## 2026-09-16 — Finish line autonome maximale, lot de préparation

Audit visuel courant des 17 pages : faux repère « Communauté » retiré de Profils ; illustration Loup/Dragon Jeux/Écosystème priorisée lors d’une visite directe ; sélecteur de fichier du vérificateur remplacé par une surface française contrôlée avec nom de fichier et focus visible. Le jargon visible « Fail closed » restant sur le vérificateur devient « Preuves requises ».

Ajout d’un stress de pseudo-localisation +35 % dans le harnais responsive. Ajout de `data/integration-readiness.json` et de son schéma : prérequis, permissions, états loading/empty/error/unavailable et portes de publication pour hubs, comptes, communauté, stockage/réparation, distribution et intégrations Guide/OS. Aucun service absent n’est présenté comme livré. La matrice `FINAL-EXTERNAL-VALIDATION-MATRIX.md` conserve les validations réellement externes et leurs procédures exactes.

Contrôles ciblés avant publication : vérificateur 10 groupes PASS, états 12 groupes PASS, générateur Jeux 5 groupes PASS, readiness 6 capacités PASS, contrats finish-line 4 groupes PASS. La recette navigateur des changements et le replay source global restent à effectuer après publication. Statut : **CANDIDAT EN COURS**, pas de VF.

## 2026-09-16 — Langage public et conditions de publication

Accueil, Documentation et Écosystème : « Preuves requises », « Service non connecté » et explications françaises remplacent le jargon visible fail-closed/backend. Métadonnées Sécurité et Téléchargements clarifiées. Contrats et identifiants techniques conservés ; absence de services toujours explicite. Structure 17 pages, 13 scripts, 77 empreintes vérifiée ; 34 assertions cache réussies, v97, 799145/800000 octets. Aucun test fonctionnel inchangé rejoué. Reflow des trois corps de page modifiés à confirmer après publication ; aucun statut VF.

### Contrôle après d575f4c

Trois mesures navigateur à 320 px (305 px utiles) sur Accueil, Documentation et Écosystème : aucun débordement horizontal observé. Nouveaux libellés présents dans le DOM : deux « Preuves requises » sur l’accueil, un en Documentation, trois « Service non connecté » sur Écosystème. Preuve `qa/public-language-native-20260916.json`. Portée limitée au reflow étroit et aux textes déployés ; pas de nouvelle certification visuelle exhaustive, zoom ou lecteur d’écran.

## 2026-09-16 — VF TECHNICALLY MAXIMAL CANDIDATE

Revue post-publication sur `76cbe6d` : les concepts Portails Loup/Dragon sont effectivement rendus sur Jeux et Écosystème ; le sélecteur de fichier français du vérificateur et son focus visible sont observés ; Profils n'identifie plus Communauté comme destination courante.

Stress pseudo-localisé +35 % : 34 mesures, 17 pages à 320/768 px, zéro débordement horizontal, zéro `tabindex` positif, service worker activé sur 34/34. Revue desktop consolidée : 17/17 routes avec titre, h1 et main uniques, aucune image cassée, aucun identifiant dupliqué et aucun débordement observé. Preuves : `qa/pseudolocalization-browser-20260916.json` et `qa/final-browser-review-20260916.json`.

Replay source global exécuté une seule fois : 30 scripts, 30 PASS, 0 échec (`qa/final-source-validation.json`). `npm run lint` et `npm run build` PASS : 17 pages, 13 scripts, 80 empreintes, index Jeux conforme. Cache : 34 assertions PASS, 799990/800000 octets bruts, estimation gzip 520627 ; marge de 10 octets à préserver.

Statut : **VF TECHNICALLY MAXIMAL CANDIDATE**. Ce statut clôt le travail autonome démontrable dans l'environnement courant ; il ne constitue ni une VF officielle ni un 100 %. Les validations natives/externes et les capacités sans données, services, droits ou décisions restent dans `FINAL-EXTERNAL-VALIDATION-MATRIX.md` et `VF-TECHNICALLY-MAXIMAL-CANDIDATE.md`.

## 2026-09-16 — Réouverture de la finition visuelle cinématique

Le statut technique précédent ne valait pas validation visuelle. Une nouvelle revue par captures a confirmé que plusieurs surfaces restaient trop proches d’une maquette fonctionnelle après le hero. Le chantier visuel a donc été rouvert avec le hero Loup/Dragon comme niveau de référence.

Depuis `71c4664`, l’Accueil utilise une composition cinématique dédiée. Depuis `4ff12e0`, les pages Catalogue, fiches, Creator Studio, Communauté, Jeux, Écosystème, Sécurité, Profils, Téléchargements, Vérificateur, Documentation, Recherche et 404 partagent une couche de matière, de profondeur, de rythme et d’états interactifs. Les scripts et contrats fonctionnels n’ont pas été réécrits. Deux défauts trouvés par les captures ont été corrigés : grille Creator Studio cassée puis débordante sous 900 px, et titre Recherche coupé en desktop.

Preuves bornées avant/après : `review-evidence/visual-finish-20260916/`. Les ouvertures desktop de l’Accueil, du Catalogue, des fiches, du Studio et des dix surfaces secondaires y sont comparées à la baseline historique. Mesures après correction : 17/17 routes sans débordement horizontal à 320 et 768 px ; 17/17 à 320 px avec expansion synthétique +35 %. Ce sont des mesures Chromium distant, pas des appareils physiques, un zoom natif ou une validation lecteur d’écran.

Dernier contrôle source du lot : 34 assertions cache PASS, 796081/800000 octets précachés au commit `3d5ccfc`; contrats Recherche huit groupes PASS ; Téléchargements cinq groupes PASS. Le lot de preuves visuelles est archivé séparément après ce commit. **Aucune page n’est déclarée visuellement finalisée sur la seule base de son hero ; VF officielle toujours non validée.**

## 2026-09-16 — Navigation globale et preuve Profils déployée

Depuis `4f772f9`, l’accueil emploie la même taxonomie de navigation que les seize autres routes publiques. Le CTA d’en-tête redondant est retiré ; Téléchargements reste accessible dans le contenu et le footer. Contrôle statique : une seule variante de navigation et une seule variante de footer sur 17 routes, aucun lien local mort.

Le déploiement immuable `https://17c68919.nova-forge-site-public.pages.dev` a été inspecté en Chromium. La navigation tient sans collision au cadre observé de 1 348 px. La correction Profils de `a722a28` est enfin prouvée déployée : les derniers groupes impairs occupent la largeur prévue, sans cellule vide accidentelle ; largeur utile et scrollWidth égales à 1 348 px.

Build et structure PASS, 84 empreintes valides, 34 assertions cache PASS, précache 799 842/800 000 octets. Captures avant/après et preuve Profils archivées dans `review-evidence/visual-finish-20260916/` au commit `c497d03`. Documentation, FAQ, liens de poursuite et footer ont aussi été inspectés sans nouveau défaut produit isolé. **VF officielle toujours non validée** : limites externes et états asynchrones non observés inchangés.
