# MODARYX V2 — Simulation experte multi-profils du tree test

**Date : 2026-10-03**  
**Statut : TERMINÉ — simulation experte uniquement, ne constitue pas une validation humaine**

## 1. But

Exécuter les 16 tâches du protocole IA sous trois perspectives simulées :

- joueur peu expérimenté ;
- joueur expérimenté en modding ;
- créateur/moddeur.

Cette passe cherche les ambiguïtés internes avant high-fi. Elle ne remplace pas un participant réel.

## 2. Méthode

Pour chaque tâche, on vérifie :

- premier niveau de navigation vraisemblable ;
- vocabulaire nécessaire ;
- risque de détour ;
- dépendance éventuelle à un terme technique ;
- conflit avec un autre objet produit.

Aucun taux de succès humain n'est inventé.

## 3. Résultats synthétiques

| Tâche | Débutant simulé | Expérimenté simulé | Créateur simulé | Risque |
|---|---|---|---|---|
| T1 Plugin jeu | Jeux → jeu | direct | direct | faible |
| T2 Compatibilité | fiche → compatibilité | direct | direct | faible |
| T3 Dépendances | peut chercher « prérequis » | direct | direct | moyen |
| T4 Conflits | peut chercher « compatibilité » | direct | direct | moyen |
| T5 Favori | direct | direct | direct | faible |
| T6 Collection | direct si « sélection » | direct | direct | faible |
| T7 Profil/Loadout | Bibliothèque probable, « Loadout » moins clair | direct | direct | moyen |
| T8 Modpack | direct si terme connu | direct | direct | moyen débutant |
| T9 Ancienne version | fiche → versions | direct | direct | faible |
| T10 Fichier | peut confondre version et fichier | direct | direct | moyen |
| T11 Créateur | recherche globale | direct | direct | faible |
| T12 Publier release | Créer → Studio | direct | direct | faible |
| T13 Support | direct | direct | direct | faible |
| T14 Signalement | direct si action distincte | direct | direct | faible |
| T15 Catalogue | risque de comprendre « téléchargeable » | risque réduit mais réel | faible | élevé |
| T16 Recherche globale | direct | direct | direct | faible |

## 4. Risques réellement utiles

### R1 — Requirements

Le terme anglais « Requirements » peut être compris par les utilisateurs expérimentés, mais reste inutilement technique pour l'interface française.

**Correction sûre :**
- libellé UI principal : **Compatibilité et prérequis** ;
- sous-sections : Requis, Optionnel, Recommandé, Incompatible ;
- le terme technique requirements peut rester dans les routes/contrats internes.

### R2 — Catalogue disponible

« Catalogue disponible » peut suggérer que le téléchargement est disponible.

**Correction sûre :**
- afficher systématiquement un complément explicatif ;
- formulation recommandée : **Catalogue consultable — téléchargement non garanti** lorsque la distribution n'est pas prouvée ;
- conserver « Distribution disponible » uniquement quand la distribution réelle est prouvée.

### R3 — Mods & Plugins

Comme entrée primaire, « Mods & Plugins » est compréhensible, mais peut sembler exclure addons, scripts et outils.

**Correction sûre :**
- conserver le libellé primaire court ;
- ajouter une microcopy ou un sous-titre explicite dans les surfaces de découverte :
  **Mods, plugins, addons, scripts, outils et autres contenus compatibles** ;
- les filtres montrent ensuite la taxonomie complète.

### R4 — Bibliothèque / Profil

« Bibliothèque » fonctionne comme contenant personnel, mais « Profil / Loadout » peut être trop technique pour un débutant.

**Correction sûre :**
- sous-navigation : **Profils de jeu** ;
- description : **Configurations enregistrées de mods et versions** ;
- conserver Profile/Loadout comme terme de domaine interne.

### R5 — Version / Fichier

Un débutant peut penser qu'une version est directement le fichier.

**Correction sûre :**
- la Release affiche clairement son identité/version ;
- les artefacts sont regroupés sous **Fichiers de cette version** ;
- ne jamais utiliser « Version » et « Fichier » comme synonymes.

## 5. Points sans correction nécessaire

La simulation ne révèle pas de contradiction interne majeure pour :

- Jeux → Game Hub ;
- Favori ;
- Collection ;
- Recherche globale ;
- Créateurs ;
- Creator Studio ;
- Support ;
- Signalement.

## 6. Décision

Aucune ambiguïté simulée ne justifie de bloquer toute la conception.

Les cinq risques ci-dessus doivent être neutralisés par microcopy/labels avant high-fi.

Le **tree testing humain reste PREUVE MANQUANTE**, mais n'est plus traité comme blocage absolu pour poursuivre la préparation technique et la direction artistique exploratoire, à condition de ne pas déclarer les termes validés humainement.

## 7. Gate

- Simulation experte multi-profils : **TERMINÉ**
- Contradictions internes graves : **AUCUNE DÉTECTÉE**
- Clarifications sûres : **À INTÉGRER**
- Validation humaine : **PREUVE MANQUANTE**
- High-fi final : ne peut pas revendiquer « validé humainement » tant que cette preuve manque.