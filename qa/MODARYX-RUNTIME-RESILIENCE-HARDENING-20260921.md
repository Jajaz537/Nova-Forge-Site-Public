# MODARYX — durcissement résilience runtime — 21 septembre 2026

Statut : **TERMINÉ — hardening source ciblé ; services réels inchangés**.

Ce batch ferme trois classes de risque transversales sur les lanes déjà livrées.

## Trust anchors

Le registre runtime refuse désormais explicitement tout JWK contenant du matériel privé ou symétrique, toute capacité de signature dans `key_ops`, une forme de clé incompatible avec l’algorithme, un trust store actif sans `updatedAt` daté et les fenêtres de validité incohérentes.

Aucune clé de production n’est ajoutée.

## Storage Resolver / Repair

Le transport distant possède désormais une échéance bornée et retourne `transport-timeout` au lieu de pouvoir rester suspendu indéfiniment.

Les cibles HTTPS manifestement locales ou privées sont refusées par la primitive publique. Cette garde couvre les littéraux et noms locaux évidents ; elle ne remplace pas une politique réseau fournisseur contre le DNS rebinding.

L’orchestrateur propage la même limite de temps et reste fail-closed si une origine ne répond pas.

## Guide MODARYX

La découverte distante Guide reçoit également un délai borné et refuse les cibles locales/privées évidentes. Le pont Nova Forge OS conserve son exception locale volontaire : HTTP n’est accepté que sur loopback, conformément au contrat existant.

## Preuve

Marker : `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING`.

La micro-preuve utilise uniquement des données et transports injectés ; elle ne publie aucun signer réel et ne connecte aucun Storage, Repair Network, Guide ou runtime Nova Forge OS.
