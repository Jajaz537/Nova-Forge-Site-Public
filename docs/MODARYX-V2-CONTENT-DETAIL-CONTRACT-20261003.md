# MODARYX V2 — Contrat de fiche contenu

**Date : 2026-10-03**
**Statut : conception — aucune implémentation V2**

## 1. Rôle

La fiche contenu est la surface de décision la plus importante de MODARYX V2.

Elle doit permettre à l'utilisateur de répondre rapidement à :

- Qu'est-ce que ce contenu ?
- Pour quel jeu ?
- Quelle version ?
- Qui l'a créé ?
- Est-il compatible avec mon contexte ?
- Quelles dépendances sont nécessaires ?
- Quels conflits sont connus ?
- Quelle release dois-je utiliser ?
- Puis-je l'installer ou le télécharger ?
- Quel est son état de confiance/provenance ?
- Où trouver les fichiers, changelog, support et permissions ?

## 2. Above the fold

### Identité

Afficher :

- titre ;
- jeu ;
- type de contenu ;
- auteur / équipe ;
- dernière release ;
- canal stable/beta/alpha/legacy ;
- dernière mise à jour.

### Zone décision

Afficher avant l'action principale :

- état de compatibilité ;
- version du jeu ;
- loader/framework ;
- plateforme/environnement si pertinent ;
- dépendances obligatoires ;
- conflit majeur ;
- état distribution ;
- provenance/confiance.

### Action principale

Selon capacités réelles :

- Installer avec manager ;
- Télécharger manuellement ;
- Ajouter à collection ;
- Ajouter à profil/loadout.

L'action automatisée ne doit jamais apparaître comme disponible si le manager/runtime n'est pas réellement connecté.

## 3. Navigation interne

Structure proposée :

- Overview
- Files
- Versions
- Compatibilité et prérequis
- Changelog
- Media
- Support / Posts
- Issues / Bugs
- Permissions

L'ordre peut varier selon le type de contenu, mais Files/Requirements/Versions doivent rester faciles à trouver.

## 4. Overview

Doit contenir :

- résumé court ;
- description structurée ;
- features ;
- instructions importantes ;
- limitations ;
- installation simplifiée ;
- configuration ;
- désinstallation si nécessaire.

Ne pas enterrer :
- dépendances ;
- compatibilité ;
- conflits
dans de longs paragraphes de description.

## 5. Compatibilité et prérequis

Séparer explicitement :

### Requis
Indispensable.

### Optionnel
Améliore ou étend le contenu.

### Recommandé
Non obligatoire mais recommandé.

### Incompatible
Conflit ou combinaison non supportée.

Chaque relation doit montrer :
- contenu cible ;
- range de version ;
- raison ;
- état de vérification si disponible.

## 6. Files

Chaque fichier/release doit exposer :

- nom ;
- version ;
- canal ;
- taille ;
- date ;
- SHA-256 ;
- type ;
- statut de scan/sécurité seulement si réel ;
- provenance ;
- distribution state.

### États

- available ;
- locked ;
- withdrawn ;
- revoked ;
- quarantined ;
- archived.

Un fichier revoked ou quarantined ne doit pas rester présenté comme téléchargeable.

## 7. Versions

L'utilisateur doit pouvoir :

- voir la dernière version ;
- voir l'historique ;
- comparer date/canal ;
- identifier la version compatible avec son jeu ;
- revenir à une ancienne release si elle reste distribuable.

Ne pas supprimer visuellement les anciennes versions sans raison.

## 8. Changelog

Structuré par release.

Afficher :
- version ;
- date ;
- changements ;
- fixes ;
- breaking changes ;
- migration notes si nécessaire.

Éviter un changelog géant en texte libre sans hiérarchie.

## 9. Permissions & licence

Afficher clairement :

- licence ;
- redistribution ;
- modification ;
- mirrors ;
- dérivés ;
- usage commercial si applicable ;
- crédits requis ;
- source/provenance.

Les permissions ne doivent pas être déduites de l'absence de texte.

## 10. Sécurité / confiance

### Affichable si réel

- scan passé ;
- scan partiel ;
- quarantined ;
- signature valide ;
- hash ;
- provenance ;
- auteur vérifié.

### Règle

Un SHA-256 prouve l'identité de bytes, pas l'innocuité.

Une signature prouve une relation cryptographique, pas qu'un fichier est sans danger.

## 11. Media

- screenshots ;
- vidéos ;
- galerie ;
- comparaison avant/après si pertinente.

Les media ne doivent pas pousser toutes les informations décisionnelles sous la ligne de flottaison.

## 12. Support

Selon capacités :

- Posts
- Comments
- Questions
- Bugs/Issues
- Support links

L'utilisateur doit être orienté vers les informations existantes avant de créer un doublon de bug.

## 13. Creator

La fiche doit permettre de :

- ouvrir profil ;
- voir équipe ;
- autres créations ;
- suivre si fonction réelle.

Ne pas utiliser le nombre de followers comme substitut à la sécurité ou à la qualité.

## 14. Compatibilité

Un badge compact doit résumer :

- Compatible
- Partiellement compatible
- Incompatible
- Non vérifié

Mais le détail doit être accessible.

### Dimensions possibles

- version jeu ;
- loader ;
- plateforme ;
- client/server ;
- DLC ;
- architecture/runtime.

## 15. Installation

### Manager

Avant installation :
- version cible ;
- dépendances ;
- conflicts ;
- action réelle.

Pendant :
- progression réelle ;
- erreur ;
- retry/rollback.

Après :
- installé ;
- profil concerné ;
- version installée.

### Manuel

Afficher :
- fichier ;
- hash ;
- instructions ;
- destination ;
- dépendances.

## 16. Mobile

Priorité mobile :

1. identité ;
2. compatibilité ;
3. action ;
4. compatibilité et prérequis ;
5. media ;
6. description ;
7. files/versions ;
8. support.

Un CTA sticky est acceptable uniquement s'il ne masque pas :
- focus ;
- contenu ;
- erreurs.

## 17. Desktop

Une colonne décisionnelle latérale peut regrouper :
- version ;
- compatibilité ;
- action ;
- provenance ;
- favoris/collection.

Le contenu principal garde :
- media ;
- overview ;
- tabs.

## 18. États obligatoires

- loading ;
- unavailable ;
- archived ;
- removed ;
- quarantined ;
- withdrawn ;
- revoked ;
- incompatible ;
- unverified ;
- offline/stale ;
- auth-required ;
- manager unavailable ;
- manual unavailable.

## 19. Anti-patterns

Interdits :

- gros bouton Download avant la compatibilité et les prérequis ;
- compatibilité uniquement dans la description ;
- dépendances seulement au moment de l'erreur ;
- mélange projet/release/fichier ;
- métriques gonflées ou fictives ;
- scan présenté comme garantie absolue ;
- onglet important caché dans un menu secondaire obscure.

## 20. Critère high-fi

La maquette high-fi de la fiche ne peut démarrer qu'après validation de :

- above-the-fold décisionnel ;
- structure compatibilité/prérequis ;
- files/releases ;
- états de confiance ;
- responsive ;
- actions manager/manual ;
- support/permissions.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**


## 21. Clarifications terminologiques sûres

- Le terme de route/contrat interne `requirements` reste autorisé techniquement.
- Le libellé utilisateur français est **Compatibilité et prérequis**.
- Les artefacts d'une Release sont présentés sous **Fichiers de cette version** pour éviter la confusion Release/Fichier.

**État : intégré suite à simulation experte multi-profils ; validation humaine toujours PREUVE MANQUANTE.**


## Preuve humaine P01 — avertissements proactifs

Le participant réel P01 attend que MODARYX prévienne automatiquement lorsqu'un mod peut entrer en conflit avec un autre mod/plugin.

Décision de conception : avant installation ou téléchargement, faire remonter proactivement les informations critiques connues : dépendance obligatoire, conflit connu, version requise et incompatibilité majeure.

La section **Compatibilité et prérequis** garde le détail, mais les risques critiques ne doivent pas être enfouis dans un onglet secondaire.

**État : À INTÉGRER dans les futurs wireframes/high-fi.**
