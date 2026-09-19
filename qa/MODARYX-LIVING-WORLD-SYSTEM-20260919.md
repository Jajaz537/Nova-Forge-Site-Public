# MODARYX — système « monde vivant » — 19 septembre 2026

Statut : **EN COURS — première couche technique intégrée sur branche isolée ; croissance visuelle individuelle des personnages encore à réaliser avec des couches séparées**.

## Décision produit approuvée

La direction visuelle générale est approuvée par l'utilisateur. À partir de ce point :

- arrêter la génération de nouvelles photos/illustrations pour chercher une autre direction ;
- conserver la composition approuvée comme référence artistique ;
- poursuivre le travail produit et technique ;
- transformer MODARYX en **monde vivant**, pas en galerie d'images figées.

Le monde doit évoluer dans le temps. Les animaux et créatures récurrents doivent grandir avec l'univers au fil des semaines/mois, sans devoir remplacer manuellement tout le site à chaque étape.

## Principe d'architecture

La croissance et les cycles sont séparés de l'illustration composite.

### 1. Chronologie partagée

`data/living-world.json` définit une horloge de monde partagée basée sur UTC, avec une date de fondation et des étapes de croissance.

La progression n'est pas attachée à un compte local : tous les visiteurs lisent la même chronologie de base.

### 2. Compagnons

Première chronologie déclarée :

- Loup : **Louveteau** au départ ; juvénile à J+45 ; adolescent à J+120 ; jeune adulte à J+270 ; adulte à J+540.
- Dragon : **Dragonneau** au départ ; juvénile à J+60 ; adolescent à J+150 ; jeune adulte à J+330 ; adulte à J+720.

Ces seuils sont des règles narratives MODARYX, pas des affirmations biologiques.

### 3. Cycle quotidien

Le moteur calcule une phase **partagée en UTC**, cohérente avec `clock.model: shared-world-utc` :

- nuit ;
- aube ;
- journée ;
- crépuscule ;
- nuit.

La phase pilote une ambiance lumineuse subtile du hero sans modifier le contrat de contenu.

### 4. Motion

La première couche dynamique ajoute :

- un mouvement très lent de profondeur sur le panorama ;
- une modulation lumineuse ambiante ;
- un signal discret indiquant que le monde évolue ;
- un état visible du loup et du dragon.

Le réglage **Mouvement réduit** et `prefers-reduced-motion` coupent les animations, mais **ne stoppent pas la chronologie ni la croissance**.

## Limite volontaire de cette première étape

Le hero actuel est une illustration composite unique. Il est donc impossible de faire grandir seulement le loup ou seulement le dragon à l'intérieur de cette image sans couches de personnages séparées.

Aucune fausse promesse : **la chronologie de croissance est désormais réelle et exploitable, mais la transformation visuelle individuelle des personnages reste EN COURS**.

La prochaine architecture visuelle doit séparer au minimum :

- décor principal ;
- loup ;
- dragon ;
- héros lorsqu'il est présent ;
- lumières/ambiances ;
- éléments de vie secondaires si nécessaire.

Ces couches pourront ensuite être animées/remplacées par étape sans régénérer tout le panorama.

## Cible finale du monde vivant

Le système devra progressivement permettre, sans surcharge :

- croissance visible des compagnons ;
- déplacement/activité discrète d'animaux ;
- villageois et gardes avec cycles d'activité ;
- variations de lumière ;
- eau et végétation avec mouvements sobres ;
- petites évolutions du village/château ;
- événements narratifs ponctuels ;
- persistance d'une chronologie commune ;
- respect strict du reduced motion ;
- fonctionnement acceptable hors ligne avec le dernier état connu.

Le but n'est pas un « fond animé ». Le but est un **univers qui évolue**.

## Première implémentation

Fichiers :

- `data/living-world.json` ;
- `assets/living-world.js` ;
- `assets/living-world.css` ;
- hooks UI dans `index.html` ;
- donnée déclarée fraîche dans `sw.js`.

Le nouveau moteur est volontairement sans backend, sans compte et sans télémétrie.

## Budget

Le noyau précaché précédent était de 110457 octets.

L'ajout visible dans `index.html` ajoute 619 octets au noyau, soit un noyau dérivé de **111076 octets** et une marge de **688924 octets** sous le seuil 800000.

Les nouvelles ressources « monde vivant » restent hors install-précache :

- `assets/living-world.js` : 4336 octets ;
- `assets/living-world.css` : 3649 octets ;
- `data/living-world.json` : 1630 octets ;
- total runtime : **9615 octets**.

Elles sont chargées à l'usage et couvertes par la stratégie runtime/fresh-data.

## Micro-preuve ciblée

Contrôle source exécuté :

- syntaxe JS compilable : PASS CIBLÉ ;
- JSON parse + schéma : PASS CIBLÉ ;
- Louveteau à J0 : PASS CIBLÉ ;
- Loup juvénile à J45 : PASS CIBLÉ ;
- Dragonneau à J0 : PASS CIBLÉ ;
- Dragon juvénile à J60 : PASS CIBLÉ ;
- hooks home présents : PASS CIBLÉ ;
- reduced motion présent : PASS CIBLÉ ;
- `data/living-world.json` couvert par le service worker : PASS CIBLÉ ;
- empreintes SHA-256 de `index.html`, `sw.js`, JS, CSS et JSON : toutes réconciliées.

Cette preuve ne vaut pas validation visuelle navigateur ni preuve d'appareil physique.

## Prochaine étape

1. intégrer ce lot après vérification Git fraîche ;
2. vérifier le rendu réel de l'état du monde et du reduced motion sur preview ;
3. conserver la composition artistique approuvée ;
4. passer ensuite de l'illustration composite aux couches dynamiques séparées pour rendre la croissance du loup/dragon réellement visible ;
5. étendre progressivement l'activité du monde sans créer un décor agité ou artificiel.

## Modèle de croissance partagé — décision canonique

Le loup et le dragon suivent désormais **exactement le même ordre de stades** :

1. bébé ;
2. juvénile ;
3. adolescent ;
4. jeune adulte ;
5. adulte.

Les noms d'espèce restent naturels dans l'interface :

- loup : **Louveteau** → Loup juvénile → Loup adolescent → Jeune adulte → Loup adulte ;
- dragon : **Dragonneau** → Dragon juvénile → Dragon adolescent → Jeune adulte → Dragon adulte.

Le rythme peut rester différent selon l'espèce. La règle canonique est donc : **mêmes stades, vitesse de croissance indépendante**.

Cette règle est maintenant déclarée dans `data/living-world.json` via `growthModel.order` et contrôlée par `assets/living-world.js`. Si un compagnon futur ne respecte pas l'ordre canonique, le moteur refuse de charger cette configuration comme valide au lieu de dériver silencieusement.

Les seuils actuels restent narratifs et configurables :

- loup : J0 / J45 / J120 / J270 / J540 ;
- dragon : J0 / J60 / J150 / J330 / J720.

Impact runtime après cette clarification :

- `assets/living-world.js` : **4985 octets** ;
- `assets/living-world.css` : **3649 octets** ;
- `data/living-world.json` : **2431 octets** ;
- total runtime monde vivant : **11065 octets**.

Le noyau install-précaché reste inchangé à **111076 octets**.



## Correction ciblée — horloge réellement partagée en UTC

Écart isolé : le contrat déclarait `shared-world-utc`, mais le calcul de phase utilisait encore `Date.getHours()`, donc l'aube/jour/crépuscule/nuit pouvait différer selon le fuseau du visiteur.

Correction :

- `worldHourFor()` utilise désormais `getUTCHours()` lorsque le modèle est `shared-world-utc` ;
- fallback local conservé uniquement pour un éventuel futur modèle non partagé ;
- le contrôle Site First exige explicitement le chemin UTC.

Conséquence : à un instant donné, tous les visiteurs reçoivent la **même phase du monde**, indépendamment de leur fuseau local. Cela aligne enfin l'ambiance visuelle avec la chronologie partagée.
