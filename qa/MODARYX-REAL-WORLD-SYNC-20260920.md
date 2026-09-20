# MODARYX — synchronisation monde réel — 20 septembre 2026

Statut : **EN COURS — candidat à prouver**.

## Décision produit approuvée

L’atmosphère de MODARYX doit pouvoir mélanger automatiquement :

- la **saison locale** de l’utilisateur ;
- son **heure locale** ;
- la **météo réelle** quand une source météo conforme est connectée ;
- la chronologie mondiale MODARYX, qui reste distincte et partagée.

L’utilisateur ne doit pas être interrompu par une demande GPS pour bénéficier de l’adaptation saisonnière.

## Architecture retenue

### 1. Couche locale sans permission GPS

Le navigateur charge le moteur après `load` / idle. Le moteur utilise en priorité le contexte même origine `/api/local-context`, puis retombe sur le fuseau horaire du navigateur.

Sur Cloudflare Pages, la Function peut lire les informations réseau approximatives déjà disponibles dans `request.cf`. Elle ne renvoie au navigateur ni ville, ni code postal, ni coordonnées exactes.

Bande climatique normalisée :

- `north-temperate` ;
- `south-temperate` ;
- `tropical`.

La saison météorologique est inversée automatiquement entre Nord et Sud. Le profil tropical ne simule pas artificiellement quatre saisons tempérées.

### 2. Heure locale

Quatre phases locales pilotent uniquement la **lentille atmosphérique** :

- aube : 05:00–08:00 ;
- jour : 08:00–18:00 ;
- crépuscule : 18:00–22:00 ;
- nuit : 22:00–05:00.

La chronologie partagée du royaume, l’âge du monde et la croissance loup/dragon restent indépendants.

### 3. Météo réelle

Le endpoint serveur prévoit des états normalisés :

`clear / cloud / rain / snow / fog / storm / wind`.

La météo réelle est **désactivée par défaut** tant qu’un fournisseur et sa licence ne sont pas validés. Le moteur reste pleinement fonctionnel pour saison + heure locale sans fournisseur météo.

L’adaptateur actuel sait normaliser Open-Meteo, mais son activation est conditionnée par `MODARYX_WEATHER_MODE` :

- `off` — défaut ;
- `open-meteo-noncommercial` — uniquement si l’usage non commercial et l’attribution sont réellement appropriés ;
- `open-meteo-commercial` — nécessite une clé commerciale.

Aucune configuration Cloudflare ou secret n’est modifié par ce lot.

### 4. Confidentialité

Si la météo est activée :

- les coordonnées réseau restent côté serveur ;
- elles sont arrondies à **0,1°** avant l’appel fournisseur ;
- l’adresse, la ville, le code postal et les coordonnées ne sont pas renvoyés au navigateur ;
- aucune permission de géolocalisation navigateur n’est demandée ;
- la politique `Permissions-Policy: geolocation=()` reste inchangée ;
- la réponse est `Cache-Control: no-store` pour éviter une mise en cache partagée d’un contexte local.

### 5. Fusion visuelle

La saison, l’heure et la météo alimentent des variables CSS séparées puis se combinent dans un filtre unique du panorama.

Quand une météo réelle est disponible, des couches légères peuvent apparaître :

- pluie ;
- neige ;
- brouillard ;
- éclairs très limités pour orage.

`prefers-reduced-motion` et le réglage MODARYX de mouvement réduit stoppent les animations.

Le système limite volontairement l’intensité : la météo réelle influence l’ambiance sans masquer la navigation, les contrôles ni les textes.

## États honnêtes

- **TERMINÉ techniquement dans le candidat** : moteur saison Nord/Sud/tropical, heure locale, fusion visuelle, fallback sans GPS, endpoint same-origin, normalisation météo, garde de confidentialité.
- **EN COURS** : preuve CI et navigateur du candidat.
- **PREUVE MANQUANTE** : exécution du endpoint sur une vraie preview Cloudflare Pages avec `request.cf`.
- **BLOQUÉ / décision externe** : activation météo réelle en production tant que fournisseur/licence/attribution ne sont pas explicitement validés.


## Qualification fournisseur production — 20 septembre 2026

La comparaison officielle est tracée dans `qa/MODARYX-WEATHER-PROVIDER-QUALIFICATION-20260920.md`.

Décision courante :

- `MODARYX_WEATHER_MODE` reste **`off` en production** ;
- WeatherAPI est le **candidat privilégié non activé** pour un scénario commercial à coût nul, uniquement via le proxy same-origin et une clé serveur confidentielle ;
- toute activation WeatherAPI exigerait attribution visible, disclaimer météo utilisateur, validation confidentialité/juridique et respect des limites de cache/appels ;
- Open-Meteo Free reste inadapté comme base d'un usage commercial garanti ;
- OpenWeather n'est pas privilégié tant que l'impact de la licence ouverte ShareAlike n'est pas juridiquement validé ;
- aucun fournisseur, secret Cloudflare, GPS navigateur ou réglage d'infrastructure n'est activé par cette qualification.

La couche saison + heure locale reste pleinement fonctionnelle sans météo réelle. Le blocker production reste **BLOQUÉ / décision externe**.
