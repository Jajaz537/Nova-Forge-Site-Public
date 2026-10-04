# MODARYX V2 — Benchmark spécialisé des écosystèmes de mods

**Date : 2026-10-04**  
**Statut : EN COURS — recherche spécialisée consolidée / décisions distinctes à intégrer avant VF**

## 1. Objectif

Compléter le benchmark généraliste avec des écosystèmes qui ont résolu des problèmes spécifiques :

- synchronisation exacte avec un serveur ou une sauvegarde ;
- relations de dépendances plus riches ;
- compatibilité multi-dimension et fraîcheur de preuve ;
- handoff web → jeu / manager ;
- safe mode / diagnostic ;
- versions verrouillées ;
- crossplay et validation par plateforme ;
- éditions incompatibles d'un même jeu ;
- bridge manager uniquement lorsque réellement supporté.

Ces apprentissages ne transforment pas automatiquement MODARYX en clone d'un outil spécialisé.

## 2. Sources actuelles consultées

### Factorio
- https://wiki.factorio.com/Mods
- https://wiki.factorio.com/Mod_portal_API
- https://mods.factorio.com/

### CKAN / Kerbal Space Program
- https://github.com/KSP-CKAN/CKAN
- https://github.com/KSP-CKAN/CKAN/blob/master/Spec.md
- https://github.com/KSP-CKAN/CKAN/blob/master/CKAN.schema

### BeamNG.drive
- https://www.beamng.com/game/support/portal/modifications/installing-mods/
- https://beamng.com/game/support/portal/support-tools/safe-mode/
- https://www.beamng.com/game/about/faq/

### Satisfactory Modding
- https://github.com/satisfactorymodding/SatisfactoryModManager
- https://github.com/satisfactorymodding/Documentation/
- https://ficsit.app/

### Farming Simulator ModHub
- https://forum.giants-software.com/viewtopic.php?p=1646630
- https://www.farming-simulator.com/newsArticle.php?news_id=705

### Stardew Valley / SMAPI
- https://smapi.io/
- https://smapi.io/mods
- https://stardewvalleywiki.com/Modding:Mod_compatibility
- https://stardewvalleywiki.com/Modding:Modder_Guide/APIs/Update_checks

### GTA5-Mods / outils spécialisés
- https://www.gta5-mods.com/tools
- https://www.gta5-mods.com/tools/moddropv-install-any-mods-in-just-a-few-clicks
- https://www.gta5-mods.com/tools/oiv-package-installer

### Paradox Mods
- https://mods.paradoxplaza.com/

### ModWorkshop / MO2 bridge
- https://wiki.modworkshop.net/books/using-mo2-with-games/page/installation-and-setup
- https://modworkshop.net/

### tModLoader / Workshop
- documentation Workshop tModLoader / Steam Workshop, utilisée pour confirmer la séparation mods vs autres types de contenu.

## 3. Leçons spécialisées

### 3.1 Factorio — synchroniser vers une référence exacte

Factorio distingue :
- dépendance obligatoire ;
- dépendance optionnelle ;
- incompatibilité.

Le jeu peut aussi synchroniser automatiquement les mods d'un client avec ceux d'un serveur multijoueur, ainsi que certains réglages de démarrage.

Le portail expose les dépendances entrantes et sortantes, donc pas seulement « ce dont ce mod dépend », mais également « ce qui dépend de ce mod ».

**Leçons MODARYX retenues :**
- ajouter la notion de **référence cible** : profil, serveur, sauvegarde ou modpack ;
- avant toute future synchronisation, montrer le delta local ↔ référence ;
- afficher les **dépendants** avant désactivation/suppression ;
- séparer obligatoire / optionnel / incompatible ;
- ne jamais traiter une synchro comme un simple « update all ».

### 3.2 CKAN — relations de packages réellement expressives

CKAN modélise notamment :
- `depends` ;
- `recommends` ;
- `suggests` ;
- `supports` ;
- `conflicts` ;
- `replaced_by` ;
- alternatives via `any_of` ;
- aide contextuelle lorsqu'un utilisateur doit choisir une alternative ;
- statut de release ;
- version de jeu min/max/stricte ;
- licence ;
- hash ;
- taille installée ;
- cibles d'installation ;
- champs d'extension `x_*` ignorables sans perte.

**Leçons MODARYX retenues :**
- Dependency/Conflict doit devenir une relation typée, pas un booléen ;
- distinguer **Requis / Recommandé / Suggéré / Supporté / Conflit / Remplacé par** ;
- permettre plusieurs candidats pour satisfaire un besoin, avec explication de choix ;
- préserver les champs inconnus lors d'un import compatible ;
- supporter l'obsolescence/renommage via remplacement explicite ;
- séparer statut du projet, channel de release et compatibilité jeu.

### 3.3 BeamNG — web→jeu explicite + Safe Mode

Le Repository BeamNG propose :
- abonnement/install automatique via manager en jeu ;
- bouton web capable d'ouvrir le jeu ;
- « View ingame » ;
- téléchargement manuel alternatif ;
- mise à jour via abonnement.

BeamNG propose aussi un Safe Mode qui lance le jeu avec un dossier utilisateur temporaire vide, sans mods/réglages/saves actifs pour diagnostiquer si un problème vient de l'environnement moddé.

Après certaines mises à jour, les mods peuvent être désactivés et l'utilisateur doit accepter le risque avant réactivation.

**Leçons MODARYX retenues :**
- toute future action web→desktop doit exposer sa **capacité réelle** ;
- prévoir fallback manuel lorsqu'autorisé ;
- conserver une notion de **Diagnostic propre / Safe Profile** ;
- après mise à jour majeure du jeu, préférer revalidation/réactivation contrôlée plutôt qu'activation silencieuse ;
- afficher la raison d'une désactivation post-update.

### 3.4 Satisfactory — choisi vs dépendance et verrouillage de version

Satisfactory Mod Manager distingue clairement :
- Installed : choisi directement par l'utilisateur ;
- Dependency : installé parce que requis ;
- Enabled / Disabled ;
- Compatible avec l'installation de jeu actuellement sélectionnée ;
- opérations queued.

Le manager permet également de choisir une version spécifique et de la verrouiller exactement, ou d'autoriser cette version et les versions supérieures.

**Leçons MODARYX retenues :**
- conserver l'**origine de l'intention** ;
- distinguer état installé, activé, dépendance et favori ;
- étendre la politique de version :
  - Auto sûr ;
  - Proposer ;
  - Épinglé exact ;
  - Minimum accepté ;
- la compatibilité dépend de **l'installation de jeu sélectionnée**, pas seulement du nom du jeu.

### 3.5 SMAPI — compatibilité avec preuve, workaround et fraîcheur

SMAPI maintient une liste de compatibilité indiquant notamment :
- compatible ;
- cassé ;
- obsolète ;
- workaround / instructions lorsqu'ils existent ;
- version où le mod a cassé ;
- auteur ;
- source/code.

Les update keys peuvent pointer vers plusieurs sources, avec ordre de préférence.

La liste elle-même indique aujourd'hui qu'elle n'est plus mise à jour aussi exhaustivement qu'avant, ce qui montre qu'un statut de compatibilité doit afficher sa **fraîcheur** et son niveau de confiance.

**Leçons MODARYX retenues :**
- une claim de compatibilité doit porter :
  - résultat ;
  - portée ;
  - source/preuve ;
  - date/fraîcheur ;
  - workaround éventuel ;
- afficher « compatible avec workaround » séparément de « compatible » ;
- permettre plusieurs sources de mise à jour avec ordre/priorité explicite ;
- ne jamais cacher qu'une base de compatibilité est potentiellement périmée.

### 3.6 Farming Simulator ModHub — pipeline de validation par plateforme

ModHub utilise un pipeline avec :
- self-test ;
- data/metadata check ;
- test PC ;
- test console ;
- publication selon plateforme.

Les règles incluent structure, dépendances, qualité visuelle, jouabilité et contraintes crossplay/console.

**Leçons MODARYX retenues :**
- ModerationDecision / validation doit être **multi-étapes** ;
- statut de validation doit pouvoir être différent par plateforme ;
- `compatible PC` ne signifie pas automatiquement `crossplay` ;
- conserver cause d'échec et étape de pipeline ;
- séparer qualité/validation, sécurité, droits et compatibilité ;
- éviter qu'un badge « vérifié » aplatisse ces dimensions.

Les politiques économiques propres à Farming Simulator ne sont pas copiées automatiquement.

### 3.7 GTA5-Mods — édition, loader et variante de package

Les fiches modernes exposent souvent :
- versions précédentes ;
- changelog ;
- requirements ;
- instructions d'installation ;
- dépendances ;
- édition Legacy vs Enhanced ;
- loaders différents ;
- fichiers/package alternatifs.

Des outils comme OIV Package Installer valident l'édition du jeu et installent dans un dossier mod approprié.

**Leçons MODARYX retenues :**
- **Edition** devient une dimension de compatibilité distincte ;
- Loader/framework devient une dimension distincte ;
- un ContentItem peut avoir plusieurs Release/File variants pour une même version fonctionnelle ;
- l'UI doit empêcher le mélange silencieux de variantes incompatibles ;
- les instructions manuelles restent visibles lorsqu'aucun installer réel n'existe.

### 3.8 Paradox Mods — Playsets et version suggérée

Les fiches Paradox Mods exposent notamment :
- version du mod ;
- version de jeu suggérée ;
- requirements ;
- ajout à des playsets.

**Leçons MODARYX retenues :**
- renforcer la relation Game Profile / Playset comme configuration nommée ;
- version suggérée ≠ compatibilité prouvée ;
- requirements doivent rester visibles avant ajout au playset/profil.

### 3.9 ModWorkshop — bridge manager conditionnel

ModWorkshop documente une intégration MO2 où :
- un bouton manager n'apparaît que lorsqu'un mod/jeu supporte réellement l'installation automatique ;
- le manager doit être ouvert sur la bonne instance ;
- drag & drop manuel reste possible ;
- le jeu original peut rester inchangé via VFS.

Des outils communautaires montrent aussi une vue dépendances par mod et une vue agrégée par profil.

**Leçons MODARYX retenues :**
- un CTA manager doit dépendre d'une **capability handshake** réelle ;
- expliquer pourquoi le bouton n'est pas disponible ;
- proposer fallback manuel seulement s'il est autorisé ;
- prévoir vue dépendances :
  - par contenu ;
  - par profil/composition ;
- montrer statut enabled/disabled/missing dans une vue agrégée.

### 3.10 tModLoader — distinguer les types de contenu malgré un même Workshop

L'écosystème tModLoader montre qu'une même infrastructure peut contenir :
- mods ;
- resource packs ;
- worlds ;
- autres éléments Workshop.

**Leçon MODARYX retenue :**
- ne jamais déduire le ContentType du provider seul ;
- type de contenu, provider et runtime de chargement sont trois dimensions distinctes.

## 4. Décisions supplémentaires retenues

Ces décisions s'ajoutent au benchmark général.

### 4.1 DependencyRelationship typée

Cible conceptuelle :

- Required
- Recommended
- Suggested
- Supported
- Conflict
- ReplacedBy
- Alternative/AnyOf

Avec :
- parent ;
- cible ;
- version range ;
- reason ;
- evidence/source ;
- transitive ;
- userChoiceRequired ;
- helpText.

### 4.2 Reverse dependency impact

Avant disable/remove/update d'un composant :
- lister ce qui dépend de lui ;
- distinguer direct / transitif ;
- afficher l'impact avant mutation.

Le site peut matérialiser cette information ; l'action locale appartient à MODARYX Forge.

### 4.3 CompatibilityClaim enrichie

Ajouter conceptuellement :
- game ;
- gameVersion/range ;
- edition ;
- platform ;
- loader/framework ;
- channel ;
- result ;
- workaround ;
- evidence source ;
- evidence timestamp ;
- freshness state.

États de résultat candidats :
- Compatible
- CompatibleWithWorkaround
- Partial
- Incompatible
- Unknown

Fraîcheur :
- Current
- Aging
- Stale
- Unknown

### 4.4 Capability handshake web→desktop

Un CTA tel que `Ouvrir avec MODARYX Forge` exige :
- runtime détecté ;
- version/protocole supporté ;
- jeu/adapter supporté ;
- source/distribution autorisée ;
- action réellement disponible.

Sinon :
- CTA absent ou disabled ;
- raison lisible ;
- fallback manuel si autorisé.

### 4.5 Diagnostic Safe Profile

Candidat desktop à conserver dans le modèle web :
- profil propre temporaire ;
- aucun mod actif ;
- réglages isolés si nécessaire ;
- comparaison « problème présent / absent » ;
- aucune écriture destructive.

Le site ne l'exécute pas, mais peut documenter/ouvrir la capacité si le runtime la prouve.

### 4.6 Version policy enrichie

Étendre :
- Auto sûr ;
- Proposer ;
- Épinglé exact ;
- Minimum accepté.

Aucune politique ne doit être déduite silencieusement d'une simple version.

### 4.7 Validation multi-plateforme

Un ModerationDecision ou ValidationState doit pouvoir contenir :
- plateforme ;
- étape ;
- résultat ;
- raison ;
- preuve ;
- date.

Crossplay = capacité séparée.

### 4.8 Variante de Release/File

Un même projet/release peut proposer :
- variante Edition A ;
- variante Edition B ;
- plateforme différente ;
- loader différent ;
- format/package différent.

La sélection doit être explicable et ne jamais mélanger des fichiers incompatibles.

## 5. Ce qui est déjà couvert dans Living Threshold

Déjà matérialisé :
- origine de dépendance ;
- pinning ;
- delta avant mutation ;
- source/provider séparé de l'auteur ;
- provider réel absent explicite ;
- Plan avancé ;
- profil local/private ;
- manager runtime absent ;
- compatibilité/prérequis ;
- Collection/Modpack/Profile distincts ;
- import/export sans perte silencieuse dans la démo.

## 6. Gaps prototype utiles restant

Peuvent encore être démontrés honnêtement sans backend :
1. relation Required/Recommended/Suggested/Conflict/ReplacedBy ;
2. reverse dependency impact ;
3. compatibility claim multi-dimension + fraîcheur + workaround ;
4. reasoned disabled manager CTA / capability handshake ;
5. release/file variants par édition/loader ;
6. validation multi-plateforme illustrative ;
7. état Safe Profile comme capacité indisponible/documentée.

Ne pas matérialiser comme fonction réelle :
- synchro serveur/save réelle ;
- installation desktop ;
- provider APIs ;
- scan ;
- crossplay réellement testé ;
- safe mode réellement exécuté.

## 7. Anti-patterns à éviter

- « compatible » sans version/édition/loader/source/fraîcheur ;
- dependency graph uniquement visuel sans explication textuelle ;
- supprimer un composant sans montrer ses dépendants ;
- bouton manager visible alors que le protocole n'est pas disponible ;
- confondre `installé`, `activé`, `favori`, `dépendance` ;
- badge crossplay sans preuve par plateforme ;
- écraser une variante Legacy/Enhanced ou équivalente ;
- perdre les extensions inconnues d'un manifeste ;
- traiter une recommandation comme une dépendance obligatoire ;
- supposer qu'une source de mise à jour est l'auteur ou la source d'origine.

## 8. Règle anti-oubli

Avant VF :
- chaque décision de section 4 doit être intégrée, mappée ou explicitement rejetée ;
- chaque compatibility claim doit exposer son niveau de preuve/fraîcheur ;
- chaque action manager doit être capability-driven ;
- chaque suppression/update doit pouvoir expliquer son impact ;
- aucun statut plateforme/édition/loader n'est inventé.

**État : benchmark spécialisé consolidé ; delta prototype clairement borné.**
