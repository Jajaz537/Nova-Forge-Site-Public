# MODARYX — Preuve Auth0 DEV du compte Fondateur — 21 septembre 2026

Statut : **EN COURS — attribution réelle acquise, preuves runtime privilégiées restantes**.

## Portée de la preuve rapportée

Cette source trace le retour de ChatGPT Work transmis dans la conversation projet.
Elle ne remplace pas un replay indépendant et ne vaut pas preuve production.

Environnement :
- tenant Auth0 : `modaryx-dev` EU ;
- portée : Preview DEV uniquement ;
- compte utilisé : compte Google DEV existant « alou » ;
- rôle Auth0 : `MODARYX Founder` ;
- permission attribuée : `modaryx:founder`.

## Preuve acquise

Après renouvellement de la session MODARYX :
- `authority.role=founder` confirmé ;
- capacité `founder=true` confirmée ;
- capacité `administration=true` confirmée ;
- capacité `moderation=true` confirmée ;
- capacité `appealsReview=true` confirmée ;
- aucun secret ni token Auth0 exposé.

Cette preuve ferme l'étape **attribution réelle du compte Fondateur Auth0 DEV**.

## Preuves runtime encore ouvertes

Les micro-preuves d'une opération de modération et d'une opération de revue des recours avec cette session Fondateur n'ont pas été exécutées.

Erreur exacte rapportée par Work :
`TypeError: fetch is not a function`.

Contexte :
- `fetch` indisponible ;
- XHR indisponible ;
- `sendBeacon` indisponible ;
- le cookie de session MODARYX reste HttpOnly et ne doit pas être extrait.

État :
**BLOQUÉ — primitives de requête scriptées absentes dans le contexte authentifié Work.**

## Voie de preuve prioritaire

Avant d'ajouter une surface temporaire, tenter les endpoints GET privilégiés existants par navigation navigateur same-origin, ce qui permet au navigateur de joindre le cookie HttpOnly sans JavaScript :

- `/api/v1/moderation/queue?limit=1`
- `/api/v1/moderation/appeals?limit=1`

Résultat attendu avec le compte Fondateur :
- HTTP 200 pour la file de modération ;
- HTTP 200 pour la file des recours ;
- aucune extraction de cookie ;
- aucun secret/token exposé.

Cette voie prouve l'héritage runtime des permissions lecture privilégiées. Elle ne remplace pas une mutation réelle si une preuve de décision privilégiée est explicitement requise.

Si une mutation réelle doit encore être démontrée et qu'aucune primitive navigateur ne le permet, alors seulement :
- ajouter une micro-surface DEV temporaire, same-origin, bornée ;
- aucune exposition de secret ;
- aucune activation production ;
- acquérir la preuve ;
- retirer immédiatement la micro-surface avant toute promotion.

Aucun full replay. Aucun `main`, DNS, DNSSEC, nameserver ou production.
