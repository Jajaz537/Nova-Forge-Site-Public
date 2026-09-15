# MODARYX — prochain bloc et conditions de clôture

Actualisé le 15 septembre 2026 après `4e8e87ce94be43f8bbf45ceb78d0bd2ec07c9d36`. PR #12, branche `design/modaryx-premium-hd-20260914-work`, brouillon. Relire le checkpoint canonique et le HEAD réel avant toute écriture.

## Acquis à conserver

- TERMINÉ pour le périmètre documenté : revue desktop des seize pages, corrections de composition, reflow initial 320/390/768/960 ; preuves et limites dans `qa/finish-line/README.md`. Cela ne certifie pas tous les états de toutes les pages.
- TERMINÉ pour les parcours ciblés : erreurs du Studio complètes, marqueurs de champs, correction progressive et accès clavier depuis les erreurs. Preuves `qa/studio-errors-browser-20260915.json` et `qa/studio-error-navigation-20260915.json`.
- TERMINÉ pour les parcours consignés : sauvegarde/rechargement des brouillons, favoris et vues Catalogue, recherche, favoris des trois fiches et mouvement réduit partagé. Références regroupées dans `qa/PROOF-MATRIX-CURRENT.md` ; aucune généralisation aux appareils ou états non testés.
- Budgets statiques contrôlés ; ils ne constituent pas un profiling utilisateur. Ne pas relancer les suites inchangées sans risque concret.

## Prochains blocs réellement ouverts

1. EN COURS — compléter la matrice des états/parcours uniquement là où les preuves existantes ne couvrent pas le comportement ; isoler tout défaut avant correction.
2. PREUVE MANQUANTE — lecteur d’écran natif, zoom observé 200/400 %, appareils physiques et autres moteurs navigateur. L’environnement présent ne permet pas de les certifier.
3. PREUVE MANQUANTE — cycle réel PWA déconnecté/mise à jour/reprise, cache froid, réseau contrôlé, LCP/CLS/INP. Le worker actif et les simulations source ne ferment pas ces preuves.
4. EN COURS — hubs GTA 6/RDR2, index jeux/catégories, corpus réel : préparer sources, droits et contenu substantiel avant intégration ; aucun support de mods présumé, aucune page vide.
5. EN COURS — capacités absentes : comptes, profils éditables, publication/modération distante, Guide connecté, Storage Resolver/Repair Network et pont OS. Les contrats existants ne sont pas des services livrés.
6. BLOQUÉ — distribution réelle : aucun artefact public, empreinte et signature de publication disponible. Conserver l’état indisponible.
7. NON RÉCUPÉRÉ — intégralité de la Master NDI et des décisions historiques ; ne pas affirmer l’anti-oubli exhaustif.

Le registre `qa/MODARYX-ANTI-OUBLI.md` conserve les capacités retenues. Les manques fonctionnels ne doivent pas être reclassés comme de simples tests externes. Aucune idée n’est annulée implicitement.

**VF NON VALIDÉE.** MODARYX reste le web ; les OS Nova Forge et toute infrastructure restent hors périmètre. Aucune fusion main ni promotion officielle déduite d’un commit ou d’un build.
