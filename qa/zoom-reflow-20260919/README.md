# MODARYX — contrôle zoom/reflow 200 % — 19 septembre 2026

## Portée

Contrôle ciblé sur le HEAD `b489b0a` de la branche candidate de la PR #12, servi localement sans modification d'infrastructure.

- moteurs : Firefox 156 et Microsoft Edge/Chromium ;
- pages : accueil, Catalogue, Creator Studio, Communauté, Sécurité et index Jeux ;
- fenêtres de référence : 1440 px desktop et 800 px responsive ;
- équivalent reflow à 200 % : largeurs CSS utiles divisées par deux, avec facteur de pixels 2 ;
- états supplémentaires : menu compact ouvert, liens du menu visibles et contenus dans le viewport ;
- contrôles : débordement horizontal du document, éléments hors viewport, contrôles dont le contenu est coupé, disponibilité des liens du menu.

## Résultat

Les 24 combinaisons page × largeur × moteur sont réussies : aucun débordement horizontal, aucun contrôle coupé, aucun élément interactif hors écran et aucun lien du menu compact masqué. Les captures ciblées de l'accueil, du Catalogue et du Creator Studio sont conservées pour les deux moteurs et les deux largeurs.

Aucun défaut reproductible n'a été trouvé dans cette portée ; aucune correction CSS ou JavaScript n'a donc été appliquée. Les résultats structurés sont dans `results.json`.

## Limites

Cette preuve ferme uniquement la passe reflow visuelle équivalente à 200 % sur les six pages et états listés. Elle ne constitue pas une validation VF, un test lecteur d'écran, un test tactile ou appareil physique, une validation de tous les états interactifs, ni une preuve à 400 %.
