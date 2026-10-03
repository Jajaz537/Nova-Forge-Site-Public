# MODARYX V2 — Glossaire produit et terminologie

**Date : 2026-10-03**
**Statut : conception — à tester humainement**

## 1. But

Éviter les ambiguïtés entre concepts techniques, produit et lore.

Les termes ci-dessous sont des libellés de travail. Ils doivent être testés, pas considérés comme définitifs sans validation humaine.

## 2. Termes fonctionnels primaires

### Jeu
Contexte principal d'un contenu.

### Mod
Modification d'un jeu.

### Plugin
Extension chargée par un framework/loader ou une application compatible.

### Addon
Extension ou contenu additionnel dont la sémantique dépend du jeu.

### Script
Contenu exécutable/interprété selon l'écosystème.

### Tool / Outil
Programme ou utilitaire qui aide à créer, gérer, installer ou modifier.

### Collection
Liste éditoriale organisée par un curateur.

### Modpack
Ensemble versionné et installable avec manifeste/contraintes.

### Profil / Loadout
Configuration utilisateur concrète, locale ou synchronisée.

### Release
Version publiée d'un ContentItem.

### Fichier
Artefact téléchargeable lié à une Release.

### Dépendance
Autre contenu requis, optionnel ou recommandé.

### Conflit
Relation connue rendant une combinaison incompatible ou risquée.

### Compatibilité
État entre une Release et un contexte précis.

## 3. États de compatibilité

- Compatible
- Partiellement compatible
- Incompatible
- Non vérifié

Ne pas utiliser “Probablement compatible” comme état principal sans méthode documentée.

## 4. Niveaux de preuve

- Mesuré
- Déclaré
- Estimé
- Inconnu

Ces niveaux décrivent la preuve, pas l'état de compatibilité lui-même.

## 5. Confiance / provenance

### Provenance vérifiée
Receipt/preuve réelle disponible.

### Provenance déclarée
Source déclarée mais non attestée.

### Provenance inconnue
Aucune preuve suffisante.

### Empreinte SHA-256
Identité des bytes.

### Signature
Relation cryptographique avec une clé/identité.

### Scan
Résultat d'un service de scan réel.

Ne pas regrouper tout sous un badge “Sûr”.

## 6. Distribution

- Verrouillé
- Publié
- Retiré
- Révoqué

Le terme “Disponible” doit signifier une disponibilité réelle.

## 7. Créateurs

### Créateur
Personne ou identité publique qui publie un projet.

### Équipe / Studio
Groupe de collaborateurs.

### Curateur
Personne qui organise une Collection.

### Modérateur
Rôle de plateforme distinct.

### Administrateur
Rôle de plateforme distinct.

### Fondateur
Rôle de plateforme distinct.

## 8. Compte et identité

### Compte
Session/authentification.

### Profil public
Identité visible.

### Identité créateur
Dimension éditoriale du profil.

### Autorité
Permissions serveur pour modération/administration.

## 9. Bibliothèque

### Favori
Marque-page personnel.

### Suivi
Abonnement aux mises à jour.

### Recherche sauvegardée
Requête + filtres mémorisés.

### Profil / Loadout
Configuration de contenus.

## 10. Installation

### Installer avec manager
Action automatisée réelle vers un manager connecté.

### Téléchargement manuel
Récupération d'un fichier autorisé.

### Ajouter à une Collection
Organisation éditoriale.

### Ajouter à un Profil
Préparation d'une configuration utilisateur.

Ne pas utiliser “Installer” pour ces trois actions différentes.

## 11. États compte/sync

- Local uniquement
- Synchronisation en attente
- Synchronisé
- Conflit
- Indisponible

## 12. Publication créateur

- Brouillon
- Soumis
- En vérification
- Accepté
- Publié
- Retiré
- Rejeté
- En appel

## 13. Support jeu

- Éditorial uniquement
- Catalogue disponible
- Distribution disponible
- Support archivé

Ces libellés doivent être testés humainement.

## 14. Termes lore secondaires

Peuvent apparaître en microcopy/ambiance :
- Royaume
- Portail
- Chronique
- Compagnon
- Faction
- Lieu

Ils ne remplacent jamais comme libellé primaire :
- Jeux
- Mods & Plugins
- Collections
- Créateurs
- Recherche
- Bibliothèque

## 15. Termes à éviter

- “Safe” sans définition précise ;
- “Verified” sans preuve réelle ;
- “Compatible” sans contexte/version ;
- “Installé” sans confirmation runtime ;
- “Synchronisé” sans service réel ;
- “Compte connecté” sur simple détection WebAuthn ;
- “Collection installable” sans manifeste/résolution.

## 16. Questions de tree testing liées au vocabulaire

Tester :
- Collection vs Profil ;
- Release vs Fichier ;
- Compatible vs Non vérifié ;
- Créateur vs Équipe ;
- Support vs Signalement ;
- Catalogue disponible vs Distribution disponible.

## 17. Gate

Avant high-fi :
- termes critiques testés ;
- synonymes principaux connus ;
- ambiguïtés corrigées ;
- lore limité à la couche de marque.

**État : TERMINÉ pour le glossaire de travail / PREUVE MANQUANTE pour validation humaine.**
