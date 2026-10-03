# Preuve manuelle — Lecteur d'écran Windows natif

**Preview :** https://6f813d33.nova-forge-site-public.pages.dev  
**État avant test :** PREUVE MANQUANTE  
**Outils acceptables :** Narrateur Windows ou NVDA réel.

Les preuves automatisées Chromium/AX sont déjà distinctes. Cette campagne cherche le comportement réel avec une technologie d'assistance Windows.

## Routes représentatives obligatoires

- `index.html`
- `catalog.html`
- `search.html`
- `creator-studio.html`
- `community.html`
- `profiles.html`
- `documentation.html`
- `downloads.html`
- `games/index.html`
- `404.html`

Si un défaut structurel est trouvé, étendre le test aux 23 routes avant toute conclusion.

## Procédure

Pour chaque route :

1. Activer le lecteur d'écran **avant** le test.
2. Ouvrir la route.
3. Naviguer au clavier uniquement.
4. Vérifier que le premier accès utile permet d'atteindre le lien d'évitement / contenu principal.
5. Parcourir les titres et vérifier qu'un `H1` compréhensible est annoncé.
6. Parcourir les régions/landmarks principaux si l'outil le permet.
7. Tabuler dans les liens, boutons, champs, listes et menus.
8. Vérifier que le nom annoncé de chaque contrôle permet de comprendre son action.
9. Tester au moins un formulaire ou champ lorsqu'il existe.
10. Ouvrir/fermer le menu de navigation compact si présent.
11. Tester un état dynamique utile sur Catalogue, Recherche, Community ou Studio.
12. Vérifier qu'aucun changement important ne se produit uniquement visuellement sans annonce exploitable.
13. Consigner mot pour mot toute annonce incompréhensible.

## Résultat attendu

- ordre de lecture cohérent ;
- titres annoncés correctement ;
- landmarks principaux identifiables ;
- contrôles nommés ;
- aucun bouton “sans nom” ;
- focus clavier cohérent avec l'annonce ;
- skip-link utilisable ;
- messages d'état importants accessibles ;
- champs avec libellés compréhensibles ;
- pas de piège clavier ;
- navigation principale atteignable.

## Échec

- contrôle annoncé sans nom ;
- focus bloqué ;
- contenu essentiel non lu ;
- ordre de lecture incohérent au point de rendre le parcours incompréhensible ;
- état dynamique essentiel silencieux ;
- formulaire sans libellé exploitable ;
- menu impossible à piloter au clavier.

## Preuve recommandée

Une **vidéo avec audio du lecteur d'écran** est préférable. Si impossible, fournir un rapport détaillé et des captures.

Noms :

- `screenreader-home.webm`
- `screenreader-catalog.webm`
- `screenreader-search.webm`
- etc.

## À renvoyer

- Narrateur ou NVDA + version ;
- navigateur + version ;
- Windows + version ;
- routes testées ;
- anomalies exactes avec route + étape ;
- vidéos/captures ;
- résultat ciblé proposé, à valider par Nova/Work.
