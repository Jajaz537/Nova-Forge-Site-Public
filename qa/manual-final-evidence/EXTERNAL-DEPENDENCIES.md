# MODARYX — Dépendances externes restantes

**HEAD de référence :** `03e41855c7b51fcd499ae7aaaebf0eb21d4da493`  
**Preview :** https://6f813d33.nova-forge-site-public.pages.dev

Ce fichier ne ferme aucun état. Il décrit uniquement l'entrée nécessaire.

| Domaine | État | Ce qui existe déjà | Ce qui manque | Fournisseur attendu | Condition de fermeture |
|---|---|---|---|---|---|
| Passkey réelle | PREUVE MANQUANTE | Provider DEV préparé | Enrôlement + reconnexion + révocation réels | Utilisateur + appareil WebAuthn | Trois phases prouvées |
| Safari réel | PREUVE MANQUANTE | Préflight WebKit ciblé vert | Test Safari natif | Mac/iPhone/iPad/device lab | Parcours Safari réel sans bloqueur |
| VoiceOver | PREUVE MANQUANTE | Accessibilité automatisée Chromium | Lecture réelle VoiceOver | Appareil Apple | Parcours AT réel documenté |
| Lecteur d'écran Windows | PREUVE MANQUANTE | AX/browser proof automatisé | NVDA/Narrator réel | Testeur Windows | Parcours AT réel documenté |
| Zoom 200/400 % | PREUVE MANQUANTE | Reflow 320/400/768/1440 automatisé | Zoom navigateur natif | Utilisateur avec navigateur natif | 23 routes revues à 200/400 % |
| Tactile physique | PREUVE MANQUANTE | Viewports mobiles automatisés | Gestes physiques | Téléphone/tablette | Parcours tactile réel |
| PWA appareil | PREUVE MANQUANTE | Cycle PWA HTTPS automatisé vert | Installation/lancement réel | Téléphone/tablette | Installation + standalone + offline/reconnexion |
| CWV terrain | PREUVE MANQUANTE | Lab performance verte | Données terrain représentatives | Trafic réel / RUM / CrUX | Fenêtre de données exploitable et représentative |
| Juridique/licences | PREUVE MANQUANTE | Garde fail-closed | Droits, licences, identité éditeur, politique juridique | Titulaires + conseil juridique | Validation documentaire explicite |
| Corpus GTA VI/RDR2 | EN COURS — ENTRÉES ABSENTES | Hubs éditoriaux + catalogue fail-closed | Corpus autorisé, versionné, attribué | Créateurs/éditeurs autorisés | Corpus réel ingéré et vérifié |
| Signer / trust anchor | BLOQUÉ | Moteur et gates cryptographiques | Clé publique de confiance, politique et signer autorisés | Autorité MODARYX | Anchor réel publié et signer prouvé |
| Artefact public autorisé | BLOQUÉ | Verrou distribution | Fichier réellement distribuable + provenance | Éditeur/créateur titulaire | Artefact versionné + hash + attestation + droits |
| Storage / Repair | BLOQUÉ | Contrats + transport/orchestrateur | Endpoints et autorisations réels | Fournisseur storage | Endpoints réels prouvés sans casser les gardes |
| Guide MODARYX | BLOQUÉ | Contrats + consent/discovery | Service réel | Équipe/service Guide | Connexion réelle avec consentement |
| Pont Nova Forge OS | BLOQUÉ | Contrat + découverte | Runtime Nova Forge OS réel | Équipe Nova Forge OS | Pont réel prouvé, produits toujours séparés |
| Météo production | BLOQUÉ | WeatherAPI readiness + fail-soft | Compte, clé, conditions, confidentialité, juridique | Fournisseur + propriétaire + juridique | Activation explicitement autorisée et micro-proof live |
| Master NDI | PREUVE MANQUANTE / NON RÉCUPÉRÉE | Fragments historiques | Référentiel canonique complet | Détenteur de la source | Source authentique récupérée ou état maintenu non récupéré |

## Format d'entrée attendu

### Juridique/licences
- document ou décision datée ;
- périmètre exact ;
- titulaire/autorité ;
- droits autorisés ;
- restrictions ;
- durée/territoire si applicable.

### Corpus réel
- origine ;
- auteur/titulaire ;
- licence ou autorisation ;
- version ;
- URL/source ;
- SHA-256 du fichier si distribué ;
- métadonnées d'attribution.

### Signer / trust anchor
- clé **publique** seulement ;
- identifiant de clé ;
- algorithme/courbe compatible ;
- période de validité ;
- politique de rotation/révocation ;
- autorité ayant approuvé la clé.

### Storage / Repair
- origine HTTPS ;
- autorisation d'usage ;
- limites ;
- politique de disponibilité ;
- aucun secret dans le dépôt.

### CWV
- source RUM ou CrUX ;
- période mesurée ;
- population/volume ;
- LCP/INP/CLS ;
- distinction claire entre terrain et laboratoire.

## Règle

Aucun de ces éléments ne doit devenir `TERMINÉ` uniquement parce qu'un document de préparation existe.
