# MODARYX V2 — Revue experte IA / Terminologie — 2026-10-03

**Statut : EN COURS — revue experte, ne remplace pas les tests humains**

## 1. Objectif

Comparer :
- architecture produit ;
- glossaire ;
- critères d'acceptation ;
- script de tree testing ;
- contrats récents ;

afin d'identifier les contradictions internes avant high-fi.

## 2. Ambiguïté fermée — Collection / Modpack / Profile

### Problème observé

L'architecture initiale contenait :
- un persona curateur orienté “configuration partageable” ;
- une route `/collections/:id` décrite comme “collection/modpack/profil partageable” ;
- une homepage regroupant installation groupée, setup et profils dans un même bloc.

Cela contredisait les contrats plus récents où :
- Collection = objet éditorial ;
- Modpack = objet versionné/installable ;
- Profile/Loadout = état utilisateur concret, privé/local par défaut.

### Correction appliquée

- persona curateur recentré sur la curation ;
- routes séparées `/collections`, `/modpacks`, `/profiles/:id` ;
- profil public uniquement si partage explicite ;
- homepage sépare les trois concepts.

### État

**TERMINÉ — correction architecture**

## 3. Ambiguïté fermée — Requirements / Dependencies

### Problème observé

L'architecture utilisait :
- tab “Requirements” ;
- route `/content/:id/dependencies`.

Cela multipliait deux mots pour la même zone produit.

### Correction appliquée

Route principale :
- `/content/:id/requirements`

À l'intérieur :
- Required ;
- Optional ;
- Recommended ;
- Incompatible ;
- Dependencies comme relation structurée.

### État

**TERMINÉ — correction architecture**

## 4. Point à tester humainement — “Mods & Plugins”

### Risque

La plateforme vise aussi :
- addons ;
- scripts ;
- tools ;
- packs ;
- shaders ;
- presets ;
- frameworks/loaders.

“Mods & Plugins” est clair et court, mais peut sembler exclure le reste.

### Décision actuelle

Conserver “Mods & Plugins” comme libellé primaire de travail car il est immédiatement compréhensible, puis tester :
- si les utilisateurs y cherchent naturellement tools/addons/scripts ;
- si un libellé “Contenus” serait trop abstrait ;
- si “Mods & Ressources” serait plus inclusif mais moins précis.

### État

**PREUVE MANQUANTE — tree testing humain**

## 5. Point à tester — “Découvrir”

### Risque

“Découvrir” peut devenir :
- homepage bis ;
- feed tendance ;
- mélange contenus/collections/créateurs.

### Règle proposée

`/discover` doit être transversal et exploratoire.

`/` reste :
- comprendre MODARYX ;
- reprendre son contexte ;
- accéder rapidement au produit.

### État

**EN COURS — distinction fonctionnelle correcte, validation humaine manquante**

## 6. Point à clarifier — “Library / Bibliothèque”

### Risque

La Bibliothèque contient plusieurs objets très différents :
- favoris ;
- suivis ;
- collections ;
- modpacks ;
- profils ;
- recherches sauvegardées ;
- installations si manager connecté.

### Décision

Le mot “Bibliothèque” reste acceptable comme contenant personnel.

À l'intérieur, les sous-objets doivent rester séparés.

### Test humain

Question :
> “Où irais-tu pour retrouver une configuration précise de mods que tu as sauvegardée ?”

Attendu :
Bibliothèque → Profils / Loadouts.

### État

**PREUVE MANQUANTE**

## 7. Point à corriger dans tree testing — Collection

### Observation

La tâche :
> “Tu veux garder ce mod dans une liste pour plus tard.”

peut naturellement conduire à :
- Favori ;
- Collection.

Elle ne teste donc pas clairement le concept Collection.

### Correction recommandée

Scénario Collection :
> “Tu prépares une sélection de mods à partager ou organiser autour d'un thème.”

Scénario Favori :
> “Tu veux simplement retrouver ce mod plus tard.”

### État

**À CORRIGER dans le script de test**

## 8. Point à corriger — Profile / Loadout

Le scénario actuel :
> “sauvegarder une configuration de mods précise”

est bon mais doit mentionner :
- versions ;
- activation ;
- configuration locale

afin de ne pas être confondu avec une Collection.

### Scénario recommandé

> “Tu veux enregistrer exactement les mods et versions actifs dans une configuration de jeu que tu utilises.”

### État

**À CORRIGER**

## 9. Point à séparer — Support vs Signalement

Le scénario actuel :
> “Tu as un problème avec un contenu.”

est ambigu.

Un problème peut être :
- bug ;
- installation ;
- incompatibilité ;
- abus ;
- violation ;
- malware suspect.

### Deux tâches distinctes

Support :
> “Le mod ne fonctionne pas comme prévu et tu veux demander de l'aide.”

Signalement :
> “Tu penses que ce contenu enfreint les règles ou présente un risque et tu veux le signaler.”

### État

**À CORRIGER**

## 10. Point à renforcer — Release vs File

Les utilisateurs doivent comprendre :
- Release = version publiée ;
- File = artefact téléchargeable de cette release.

### Tâche de test recommandée

> “Tu veux revenir à la version 1.4 du mod et télécharger le fichier correspondant.”

Attendu :
Versions → Release 1.4 → Files.

### État

**PREUVE MANQUANTE**

## 11. Point à tester — statut jeu

Termes de travail :
- Éditorial uniquement
- Catalogue disponible
- Distribution disponible
- Support archivé

### Risque

“Catalogue disponible” peut être compris comme “téléchargements disponibles”.

### Test

Demander :
> “Si un jeu indique ‘Catalogue disponible’, t'attends-tu à pouvoir télécharger immédiatement ?”

Si oui, revoir le libellé.

### État

**PREUVE MANQUANTE**

## 12. Point à tester — “Non vérifié”

### Risque

L'utilisateur peut l'interpréter comme :
- dangereux ;
- simplement non testé ;
- provenance inconnue.

### Règle

Toujours préciser la dimension :
- compatibilité non vérifiée ;
- provenance non vérifiée ;
- scan non disponible.

Éviter un badge générique “Non vérifié”.

### État

**TERMINÉ — principe à appliquer**

## 13. Point à renforcer — créateur / équipe

Les écrans doivent montrer clairement :
- auteur principal ;
- équipe/studio ;
- contributeurs.

Ne pas afficher uniquement le nom d'équipe si l'attribution individuelle est nécessaire.

### État

**TERMINÉ — conception / QA future**

## 14. Point à renforcer — recherche globale

Chaque résultat doit afficher son type :
- Jeu ;
- Contenu ;
- Créateur ;
- Équipe ;
- Collection ;
- Modpack.

Sinon les résultats mixtes deviennent ambigus.

### État

**TERMINÉ — contrat existant**

## 15. Résultat de la revue

### Corrigé immédiatement
- Collection / Modpack / Profile dans architecture ;
- Requirements / Dependencies dans routes.

### À corriger dans protocole humain
- Favori vs Collection ;
- Collection vs Profile ;
- Support vs Signalement ;
- Release vs File.

### À tester humainement
- Mods & Plugins ;
- Découvrir ;
- Bibliothèque ;
- statuts de support jeu ;
- vocabulaire “Non vérifié” contextualisé.

## 16. Gate

Cette revue experte ne ferme pas :
- le tree testing humain ;
- la validation mobile ;
- la compréhension réelle par des utilisateurs externes.

Elle réduit uniquement les contradictions internes avant test.

**État : TERMINÉ pour cette passe experte / PREUVE MANQUANTE pour validation humaine.**
