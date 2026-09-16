# MODARYX — prochain bloc et conditions de clôture

Actualisé le 16 septembre 2026 après `fae489a72465e140849e89b4c1b1944f9a7838f1`. PR #12, branche `design/modaryx-premium-hd-20260914-work`, brouillon. Relire le checkpoint canonique et le HEAD réel avant toute écriture.

## Validation source consolidée

26 scripts exécutés, tous à code 0 : `qa/source-consolidated-20260916.json`. Les 16 routes HTTPS présentent un titre, un h1 et un main uniques, sans débordement horizontal à la largeur desktop observée : `qa/routes-consolidated-20260916.json`. Cette observation DOM ne recertifie pas tous les états visuels ou asynchrones. Ne pas relancer ces contrôles inchangés.

Import natif : sélection de fichier refusée par le contrôle d’autorisation ; ne pas réessayer sans nouvelle autorisation effectivement accordée. Les courses d’import restent prouvées par simulation uniquement.

## Acquis à conserver

- TERMINÉ pour le périmètre documenté : revue desktop des seize pages, corrections de composition, reflow initial 320/390/768/960 ; preuves et limites dans `qa/finish-line/README.md`. Cela ne certifie pas tous les états de toutes les pages.
- TERMINÉ pour les parcours ciblés : erreurs du Studio complètes, marqueurs de champs, correction progressive et accès clavier depuis les erreurs. Preuves `qa/studio-errors-browser-20260915.json` et `qa/studio-error-navigation-20260915.json`.
- TERMINÉ pour les parcours consignés : sauvegarde/rechargement des brouillons, favoris et vues Catalogue, recherche, favoris des trois fiches et mouvement réduit partagé. Références regroupées dans `qa/PROOF-MATRIX-CURRENT.md` ; aucune généralisation aux appareils ou états non testés.
- Budgets statiques contrôlés ; ils ne constituent pas un profiling utilisateur. Ne pas relancer les suites inchangées sans risque concret.

## Prochains blocs réellement ouverts

Les parcours FAQ/JSON, contenus longs, variantes Avis/Commentaire et liens du vérificateur ont maintenant des preuves ciblées dans la matrice. Ne pas les rejouer sans modification pertinente. Pour Profils, les branches WebAuthn disponibles/partielles nécessitent un navigateur offrant réellement ces API ; ne pas simuler leur disponibilité pour revendiquer une preuve native.

1. EN COURS — compléter la matrice des états/parcours uniquement là où les preuves existantes ne couvrent pas le comportement ; isoler tout défaut avant correction.
2. PREUVE MANQUANTE — lecteur d’écran natif, zoom observé 200/400 %, appareils physiques et autres moteurs navigateur. L’environnement présent ne permet pas de les certifier.
3. PREUVE MANQUANTE — cycle réel PWA déconnecté/mise à jour/reprise, cache froid, réseau contrôlé, LCP/CLS/INP. Le worker actif et les simulations source ne ferment pas ces preuves.
4. EN COURS — hubs GTA 6/RDR2, index jeux/catégories, corpus réel : préparer sources, droits et contenu substantiel avant intégration ; aucun support de mods présumé, aucune page vide.
5. EN COURS — capacités absentes : comptes, profils éditables, publication/modération distante, Guide connecté, Storage Resolver/Repair Network et pont OS. Les contrats existants ne sont pas des services livrés.
6. BLOQUÉ — distribution réelle : aucun artefact public, empreinte et signature de publication disponible. Conserver l’état indisponible.
7. NON RÉCUPÉRÉ — intégralité de la Master NDI et des décisions historiques ; ne pas affirmer l’anti-oubli exhaustif.

Le registre `qa/MODARYX-ANTI-OUBLI.md` conserve les capacités retenues. Les manques fonctionnels ne doivent pas être reclassés comme de simples tests externes. Aucune idée n’est annulée implicitement.

**VF NON VALIDÉE.** MODARYX reste le web ; les OS Nova Forge et toute infrastructure restent hors périmètre. Aucune fusion main ni promotion officielle déduite d’un commit ou d’un build.

## Reprise ciblée après récupération de recherche

La consolidation des 26 scripts porte sur 82d958f, avant le dernier changement de recherche. Pour f4372ee, huit groupes recherche, cache/budgets et structure/empreintes ont été rejoués ; parcours normal natif confirmé dans `qa/search-recovery-native-20260916.json`. Panne/récupération native non certifiée. Éviter de réattribuer rétroactivement la consolidation à ce nouveau SHA.

Séparer la suite en trois catégories :
- Réalisable sur les sources présentes : défaut nouveau reproductible, couverture d’un état non testé, contenu existant vérifiable. Ne pas créer de changements artificiels pour prolonger la recette.
- Preuve externe ou autorisation requise : imports natifs refusés, lecteur d’écran, zoom effectif, appareils/moteurs supplémentaires, réseau/offline contrôlés et CWV représentatifs.
- Développement produit restant : corpus réel et droits des hubs, jeux/catégories, comptes/profils éditables, services de publication/modération, Guide et intégrations. Préparer un lot de développement avec son contrat et ses données ; ne pas les marquer réalisés par un schéma ou une page de présentation.

Il n’est pas établi que tout le travail autonome possible soit épuisé. Aucun pourcentage global de VF n’est calculable à partir de la seule quantité de tests.

## Point de reprise consolidé après fae489a

- TERMINÉ sur leur périmètre : catalogue (noms de liens, reflow ciblé, parcours normal des vues) ; preuves liées dans la matrice. Ne pas refaire ces parcours inchangés.
- TERMINÉ en simulation source : garde du catalogue dégradé, repli réseau si le cache est illisible, abandon du digest devenu périmé. Leur équivalent navigateur en panne reste PREUVE MANQUANTE.
- PREUVE MANQUANTE : essai de zoom par raccourci sans effet observé (largeur 1363, DPR 1 inchangés). Ne pas le présenter comme 200/400 % ; ne pas répéter le même essai sans nouvelle capacité.
- EN COURS : choisir un état non couvert ou un lot fonctionnel précisément documenté. Les hubs, comptes et services absents sont du développement restant, pas un simple travail de recette.

La consolidation des 26 scripts reste attachée à 82d958f. Les suites ciblées ultérieures ne deviennent pas rétroactivement une validation globale de fae489a. Cette mise à jour est documentaire ; aucun nouveau test exécuté pour la justifier.
