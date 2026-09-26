# MODARYX — primitive de transport Storage/Repair — 21 septembre 2026

Statut : **TERMINÉ — transport HTTPS borné et vérification de digest en code ; service distant réel toujours non connecté**.

## Implémentation

- `functions/_lib/storage-transport.mjs`
- `qa/check-storage-transport-primitive.mjs`

Cette couche complète le moteur décisionnel sans inventer un fournisseur.

Elle sait :

- refuser les URL non HTTPS ;
- effectuer un GET sans credentials et sans referrer ;
- imposer une limite maximale d'octets ;
- hacher les octets reçus en SHA-256 ;
- refuser tout digest divergent ;
- vérifier séparément le manifeste et l'artefact ;
- produire une observation prête à être transmise au moteur décisionnel Storage/Repair.

Marker : `PASS_TARGETED_STORAGE_TRANSPORT_PRIMITIVE`.

## Limite

La micro-preuve utilise un transport injecté en mémoire. Aucun endpoint Storage Resolver, miroir, R2 externe ou Repair Network réel n'est revendiqué comme connecté.

La fermeture réelle exige encore des origines autorisées réelles et leur configuration opérationnelle.
