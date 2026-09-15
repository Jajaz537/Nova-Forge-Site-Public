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

32 mesures Chrome, seize pages à 320 et 1280 px utiles, avec les quatre paramètres WCAG 1.4.12 surchargés : aucun débordement horizontal mesuré. Voir `qa/text-spacing-checks.json` et la feuille de recette `qa/text-spacing.css`, jamais chargée en production. Menu d’accueil ouvert inspecté séparément à 305 px utiles (iframe 320 avec scrollbar) : cinq liens lisibles, état ouvert confirmé. Aucune correction de style de production nécessaire sur ces observations limitées.

Ces mesures ne prouvent ni tous les chevauchements, ni tous les états, ni la conformité complète WCAG 1.4.12. Le raccourci de zoom natif testé n’a changé aucune largeur mesurable ; zoom 200/400 % reste PREUVE MANQUANTE. Lecteur d’écran, appareils physiques, performances réelles et PWA/offline HTTPS ne sont pas validés par ce lot. Statut global EN COURS, aucune VF. Les 32 mesures sont séparées des 69 contrôles/scénarios ciblés déjà documentés. Cache v47 inchangé : aucune ressource runtime modifiée.
