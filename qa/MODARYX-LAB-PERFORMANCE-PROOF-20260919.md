# MODARYX — micro-preuve performance labo Chromium — 19 septembre 2026

Statut : **TERMINÉ — PASS CIBLÉ laboratoire Chromium ; portée limitée au protocole documenté**.

Périmètre ciblé : accueil, catalogue, Creator Studio, Communauté et hubs Jeux, en profils mobile 390 px / CPU ×4 et desktop 1440 px / CPU ×2, réseau laboratoire limité.

Le contrôle observe LCP, CLS, tâches longues, FCP, DOMContentLoaded, load, nombre de requêtes et octets transférés. Budgets du harnais : LCP ≤ 2500 ms, CLS ≤ 0,10, tâches longues ≤ 5, load ≤ 5000 ms.

Cette preuve est un **signal laboratoire reproductible**, pas une mesure Core Web Vitals réelle sur utilisateurs. Elle ne ferme donc pas la preuve CWV représentative.

## Résultats et correction ciblée

Le premier run `35465864883` a échoué sur quatre écarts :

- accueil mobile : LCP **2912 ms** ;
- accueil desktop : LCP **2844 ms** ;
- catalogue desktop : CLS **0,1399** ;
- jeux desktop : CLS **0,1347**.

Le run diagnostic `35465974453` a identifié le LCP de l'accueil comme `IMG.modaryx-realm-art` et les sources de déplacement du Catalogue autour du hero/main/controls/navigation.

Après une première correction, le run `35466131162` restait rouge. L'isolation suivante a montré que le fallback pré-JavaScript de la navigation forçait les nav desktop en seconde ligne avant l'initialisation de `shell.js`, provoquant un reflow. Le fallback a été borné aux largeurs réellement concernées.

Le run `35466417012` a confirmé la fermeture du CLS Catalogue, mais l'accueil restait au-dessus du budget LCP. Le visuel `modaryx-world-portals.webp`, situé sous la ligne de flottaison, concurrençait encore le hero. Sa requête est désormais différée jusqu'après `load` + période idle, sans changer l'image ni la direction visuelle.

## Micro-preuve finale

Run `35466565740` : **success / PASS CIBLÉ**.

Mesures principales :

- accueil mobile : LCP **2012 ms**, CLS **0**, load **1975,4 ms** ;
- accueil desktop : LCP **1964 ms**, CLS **0,0024**, load **1922,9 ms** ;
- catalogue mobile : LCP **1804 ms**, CLS **0** ;
- catalogue desktop : LCP **1828 ms**, CLS **0** ;
- Creator Studio mobile/desktop : LCP **1876 / 1824 ms** ;
- Communauté mobile/desktop : LCP **1900 / 1876 ms** ;
- Jeux mobile : LCP **876 ms**, CLS **0**.

Tous les budgets du harnais sont respectés sur les cinq pages et les deux profils.

Les autres contrôles déclenchés sur le même candidat sont également **success** : source Site First, reflow, accessibilité Chromium, fonctions locales, PWA offline et PWA update A→B.

Cette preuve reste strictement une **preuve laboratoire Chromium**. Elle ne remplace pas des Core Web Vitals réels et représentatifs.

