# MODARYX — qualification fournisseur météo production — 20 septembre 2026

Statut : **BLOQUÉ / décision externe — qualification technique réalisée, aucune activation**.

## Objectif

Préparer la météo réelle de MODARYX sans casser les principes déjà approuvés :

- saison locale + heure locale sans demander le GPS ;
- météo réelle uniquement comme lentille atmosphérique non critique ;
- chronologie mondiale MODARYX distincte et partagée ;
- coordonnées précises jamais renvoyées au navigateur ;
- fournisseur appelé uniquement côté serveur via le endpoint same-origin ;
- aucun secret exposé dans le dépôt ou le code client ;
- attribution, licence, confidentialité et limites de cache respectées.

Cette qualification ne constitue ni un avis juridique ni une sélection contractuelle définitive. Les conditions des fournisseurs peuvent changer et doivent être revérifiées au moment de l'activation.

## Architecture MODARYX déjà acquise

L'implémentation courante reste provider-off par défaut :

- `MODARYX_WEATHER_MODE=off` par défaut ;
- `/api/local-context` sert d'intermédiaire same-origin ;
- contexte réseau approximatif issu de `request.cf` lorsqu'il est disponible ;
- coordonnées fournisseur arrondies à 0,1° ;
- ville, code postal et coordonnées exactes non renvoyés au navigateur ;
- aucune permission `navigator.geolocation` demandée ;
- `Permissions-Policy: geolocation=()` reste active ;
- réponse locale `Cache-Control: no-store` ;
- reduced motion conserve une expérience non animée ;
- l'absence de météo ne bloque jamais saison + heure locale.

## Fournisseurs étudiés

### WeatherAPI.com — candidat privilégié, non activé

Sources officielles consultées le 20 septembre 2026 :

- https://www.weatherapi.com/pricing.aspx
- https://www.weatherapi.com/terms.aspx

Constats documentaires :

- offre Free annoncée à 0 $ avec 100 000 appels/mois ;
- les conditions autorisent l'usage personnel **ou commercial** des données API ;
- un utilisateur Free doit créditer WeatherAPI.com comme source ;
- la clé API doit rester confidentielle et ne doit pas être exposée dans un dépôt public ou du code client sans contrôles adaptés ;
- lorsqu'une application expose les données météo à ses utilisateurs finaux, les conditions imposent un disclaimer météo clair ;
- cache autorisé : conditions courantes jusqu'à 60 minutes, prévisions jusqu'à 24 heures.

Conséquence MODARYX :

- candidat actuellement le plus compatible avec une future activation commerciale sans coût mensuel obligatoire ;
- usage uniquement **serveur → fournisseur**, derrière la Function same-origin ;
- secret Cloudflare requis avant activation, mais **aucun secret n'est créé par ce lot** ;
- attribution visible et disclaimer utilisateur requis ;
- un cache éventuel devra rester en dessous des limites contractuelles ;
- validation juridique/confidentialité finale toujours requise.

### Open-Meteo — prototype/non-commercial ou offre commerciale

Source officielle consultée le 20 septembre 2026 :

- https://open-meteo.com/en/terms

Constats documentaires :

- la Free API est limitée à l'usage non commercial ;
- attribution/licence CC BY 4.0 applicable à cette offre ;
- les logs du service gratuit peuvent contenir IP et coordonnées géographiques pour le dépannage ;
- ces logs sont annoncés comme supprimés après 90 jours ;
- l'usage commercial doit passer par une offre payante appropriée.

Conséquence MODARYX :

- bon adaptateur technique déjà présent ;
- mode gratuit non retenu comme base d'une VF pouvant être exploitée commercialement ;
- peut rester utile comme chemin de développement/non-commercial ou si une offre commerciale est explicitement choisie plus tard ;
- aucune activation actuelle.

### OpenWeather — compatible commercialement sous contraintes de licence

Source officielle consultée le 20 septembre 2026 :

- https://openweathermap.org/storage/app/media/documents/License_explainer_25%20Feb%2025.pdf

Constats documentaires :

- la licence ouverte autorise l'usage commercial ;
- attribution à OpenWeather requise ;
- ShareAlike annoncé pour une solution dérivée utilisant les données/API sous cette licence ouverte ;
- des licences business peuvent supprimer cette obligation selon l'offre.

Conséquence MODARYX :

- moins compatible par défaut avec la posture actuelle de source privée / produit propriétaire tant qu'une validation juridique n'a pas confirmé l'impact ShareAlike ;
- non retenu comme candidat privilégié à ce stade.

## Géolocalisation navigateur

Source de référence :

- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

L'API Geolocation du navigateur exige un contexte sécurisé et une permission utilisateur lorsqu'elle est sollicitée. MODARYX conserve donc la stratégie approuvée : **pas de popup GPS pour l'ambiance automatique**.

Une future option GPS explicite ne pourrait être envisagée que comme choix volontaire distinct, jamais comme prérequis de l'expérience.

## Décision technique courante

1. Production : **`MODARYX_WEATHER_MODE=off`**.
2. Saison locale + heure locale : continuent de fonctionner sans fournisseur.
3. WeatherAPI : **candidat privilégié, non sélectionné / non activé**.
4. Open-Meteo : adaptateur existant conservé ; Free API non retenue pour un usage commercial garanti.
5. OpenWeather : non privilégié tant que l'impact ShareAlike n'est pas juridiquement qualifié.
6. Aucun changement Cloudflare, secret, DNS ou permission GPS.
7. Aucun fournisseur ne doit être activé avant :
   - validation des conditions/licence ;
   - validation confidentialité et politique de données ;
   - validation attribution + disclaimer ;
   - création contrôlée du secret serveur si nécessaire ;
   - micro-proof du proxy same-origin avec données réelles ;
   - contrôle des limites d'appels/cache ;
   - preuve que l'échec fournisseur reste fail-soft.

## Condition de fermeture du blocker

Le statut **BLOQUÉ / décision externe** ne peut passer à TERMINÉ que lorsqu'un fournisseur a été explicitement accepté et que l'activation a été prouvée avec les garde-fous ci-dessus. La simple existence d'un adaptateur ou d'un compte gratuit ne suffit pas.


## Revalidation et readiness WeatherAPI — 21 septembre 2026

Sources officielles revérifiées :
- WeatherAPI pricing : usage commercial annoncé sur le plan Free, 100 000 appels/mois ;
- WeatherAPI terms : attribution obligatoire sur le plan Free, clé API confidentielle, disclaimer utilisateur obligatoire, cache courant limité à 60 minutes ;
- WeatherAPI documentation : endpoint `/v1/current.json`, authentification par clé, localisation par latitude/longitude et codes de condition officiels téléchargeables.

Readiness locale ajoutée sans activation :
- nouveau mode `MODARYX_WEATHER_MODE=weatherapi` ;
- appel fournisseur uniquement dans `functions/api/local-context.js` ;
- secret `MODARYX_WEATHER_API_KEY` requis côté serveur ;
- requête avec coordonnées déjà arrondies par le contexte coarse ;
- normalisation WeatherAPI vers `clear / cloud / partly-cloudy / rain / snow / fog / storm / wind` ;
- attribution `WeatherAPI.com` renvoyée au client uniquement avec la météo normalisée ;
- disclaimer météo utilisateur inclus avec les données WeatherAPI live ;
- aucune donnée `location` du fournisseur n'est renvoyée au navigateur ;
- mode par défaut toujours `off`.
- timeout fournisseur borné à 3,5 s côté serveur ; dépassement → `weather.status=unavailable`, `reason=provider-timeout`, sans bloquer saison + heure locale ;

État : **TERMINÉ — readiness WeatherAPI en code ciblé ; BLOQUÉ — compte/clé/acceptation contractuelle et preuve réelle non fournis**.

Marker ciblé attendu : `PASS_TARGETED_WEATHERAPI_READINESS`.
