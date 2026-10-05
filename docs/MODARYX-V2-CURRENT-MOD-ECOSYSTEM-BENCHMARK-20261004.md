# MODARYX V2 — Benchmark actuel des grands écosystèmes de mods

**Date : 2026-10-04**  
**Statut : EN COURS — recherche actuelle consolidée / décisions produit retenues à tracer avant VF**

## 1. Objectif

Étudier les meilleurs comportements actuels des plateformes, gestionnaires, launchers et écosystèmes de mods afin que MODARYX n'imite pas un concurrent, mais combine les meilleures idées avec ses propres règles :

- clarté avant action ;
- débutant guidé + expert transparent ;
- séparation web / desktop ;
- compatibilité et dépendances explicites ;
- provenance et droits ;
- profils reproductibles ;
- aucun téléchargement/installation promis sans capacité réelle ;
- aucun scraping contournant les règles d'une source.

La recherche externe ne constitue jamais une preuve d'implémentation.

## 2. Sources étudiées dans cette passe

Sources officielles et documentation courante consultées le 4 octobre 2026 :

### Nexus Mods / Vortex
- https://www.nexusmods.com/vortex
- https://www.nexusmods.com/site/about/vortex
- https://help.nexusmods.com/article/115-guidelines-for-collections
- https://help.nexusmods.com/article/164-discontinuing-the-nexus-mods-app-faq
- https://help.nexusmods.com/article/50-where-can-i-find-my-download-history

### CurseForge
- https://support.curseforge.com/support/solutions/articles/9000193488-curseforge-app-getting-started
- https://support.curseforge.com/support/solutions/articles/9000196984-installing-minecraft-modpacks
- https://support.curseforge.com/support/solutions/articles/9000196904-how-to-allocate-more-ram-to-a-modpack
- https://support.curseforge.com/support/solutions/articles/9000197912
- https://support.curseforge.com/support/solutions/articles/9000206622-how-to-update-change-a-modpack-s-version
- https://support.curseforge.com/support/solutions/articles/9000202116-modloaders-for-minecraft

### Modrinth
- https://support.modrinth.com/en/articles/8802250-modpacks-on-modrinth
- https://support.modrinth.com/en/collections/7804910-modrinth-app
- https://support.modrinth.com/en/articles/9977693-where-are-my-instances
- https://support.modrinth.com/en/articles/8797527-obtaining-modpack-permissions

### Thunderstore / r2modman
- https://wiki.thunderstore.io/mods/creating-a-package
- https://wiki.thunderstore.io/sharing-your-mods/modpacks-and-profiles
- https://thunderstore.io/c/another-crabs-treasure/p/ebkr/r2modman/

### Steam Workshop
- https://steamcommunity.com/workshop/manage
- https://steamcommunity.com/workshop/Browse/

### Bethesda Creations
- https://help.bethesda.net/app/answers/detail/a_id/36360/
- https://help.bethesda.net/app/answers/detail/a_id/33413/
- https://help.bethesda.net/app/answers/detail/a_id/63978/

### mod.io
- https://docs.mod.io/dependency-management/
- https://docs.mod.io/cppsdk/subscribing
- https://docs.mod.io/cppsdk/

### GameBanana
- https://gamebanana.com/wikis/1244
- https://gamebanana.com/collections/

### Mod DB
- https://www.moddb.com/mods
- https://www.moddb.com/addons/latest
- https://www.moddb.com/features

### Prism Launcher
- https://prismlauncher.org/
- https://www.prismlauncher.org/wiki/getting-started/create-instance/
- https://www.prismlauncher.org/wiki/getting-started/download-modpacks/
- https://www.prismlauncher.org/wiki/help-pages/instance-copy/
- https://www.prismlauncher.org/wiki/getting-started/download-mods/

### Wabbajack
- https://www.wabbajack.org/
- https://wiki.wabbajack.org/user_documentation/Installing%20a%20Modlist.html
- https://wiki.wabbajack.org/modlist_author_documentation/Pre-Compilation.html
- https://wiki.wabbajack.org/modlist_author_documentation/Post-Compilation.html

### Signaux communautaires consultés avec prudence
Des discussions Reddit récentes ont été utilisées uniquement comme signaux UX, jamais comme source de vérité technique :
- Vortex vs MO2 : puissance, granularité, coût cognitif des règles ;
- Modrinth/CurseForge : mise à jour en masse vs mods volontairement épinglés ;
- Thunderstore/r2modman : simplicité et visibilité des dépendances ;
- guides modded Minecraft : importance du jeu/version/loader et des sources réputées.

## 3. Leçons actuelles par écosystème

### 3.1 Nexus Mods / Vortex

Forces observées :
- intégration web → manager ;
- installation de mods/Collections en quelques actions ;
- profils indépendants ;
- updates visibles ;
- load order et résolution de conflits ;
- grande couverture multi-jeux ;
- historique de téléchargements privé et filtrable ;
- Collections comme métadonnées/références plutôt que redistribution automatique des mods.

Signal produit 2026 :
- Nexus concentre désormais son effort manager sur Vortex plutôt que maintenir deux apps concurrentes.

Risques observés dans les retours communauté :
- graphes de règles de conflits difficiles à comprendre sur gros setups ;
- coût du déploiement pour très grandes listes ;
- simplicité initiale pouvant cacher une complexité tardive.

**Leçon MODARYX :**
- une seule logique cohérente ;
- guidage simple par défaut ;
- plan expert toujours inspectable ;
- jamais créer une mécanique de conflits où l'utilisateur perd la notion de "qui gagne et pourquoi".

### 3.2 CurseForge

Forces :
- détection automatique version du jeu + modloader lors de la création de profil ;
- choix nouveau profil vs profil existant ;
- profils exportables/importables ;
- codes de partage temporaires ;
- deep-link site → application ;
- paramètres par installation/instance ;
- update d'un modpack vers **un nouveau profil** pour préserver l'ancien ;
- réparation d'installation ;
- opérations en masse ;
- incompatibilité expliquée par version/loader.

**Leçon MODARYX :**
- toute mise à jour risquée doit pouvoir créer une branche/copie avant mutation ;
- l'incompatibilité doit dire **pourquoi** ;
- la page web peut préparer une action desktop, mais ne doit jamais simuler son exécution.

### 3.3 Modrinth

Forces :
- instance comme unité centrale ;
- modpack = liste + fichiers/configuration, prêt à jouer ;
- export de l'instance en modpack ;
- formats ouverts utilisables par plusieurs outils ;
- permissions de redistribution traitées explicitement ;
- réparation/récupération d'instances documentée ;
- changelog et version restent importants.

Signal communauté :
- les utilisateurs veulent pouvoir mettre à jour beaucoup de mods **sans écraser ceux volontairement épinglés**.

**Leçon MODARYX :**
- ajouter une politique de version par élément : automatique sûre / proposer / épinglée ;
- afficher le delta avant mise à jour d'un profil ou modpack ;
- favoriser formats/manifests interopérables lorsque les droits le permettent.

### 3.4 Thunderstore / r2modman

Forces :
- package simple avec `manifest.json` ;
- version sémantique ;
- dépendances déclaratives ;
- dépendances installées automatiquement par le manager ;
- profils partageables par code ou fichier ;
- configs partageables sans embarquer systématiquement le code des mods ;
- validateur de manifeste.

Risque signalé par utilisateurs :
- une dépendance transitive peut devenir difficile à distinguer d'un mod explicitement choisi.

**Leçon MODARYX :**
- afficher séparément :
  - contenu choisi par l'utilisateur ;
  - dépendance requise ;
  - dépendance transitive ;
  - contenu suggéré ;
- ne jamais supprimer automatiquement une dépendance devenue inutile sans plan clair/confirmation si des données locales sont concernées.

### 3.5 Steam Workshop

Forces :
- abonnement comme intention utilisateur simple ;
- Collections pouvant sauvegarder un ensemble d'abonnements ;
- application d'une Collection en mode **ajouter** ou **remplacer** ;
- partage par lien ;
- ordre local ;
- ordre automatique possible selon dépendances ;
- dépendances manquantes visibles ;
- versions de jeu supportées quand le jeu expose cette capacité.

**Leçon MODARYX :**
pour toute future application d'une Collection/Profil/Modpack :
- montrer un **dry-run / delta** ;
- proposer explicitement `Ajouter`, `Remplacer` ou `Annuler` ;
- ne jamais confondre Collection éditoriale et configuration appliquée.

### 3.6 Bethesda Creations

Forces :
- découverte et installation intégrées au jeu ;
- Bibliothèque web + in-game ;
- activation/désactivation ;
- load order ;
- retour vers une sauvegarde originale recommandé ;
- avertissement après mise à jour du jeu.

**Leçon MODARYX :**
- la simplicité maximale est possible si les capacités du jeu sont connues ;
- toujours exposer l'impact d'une mise à jour du jeu ;
- garder restore point/save protection comme concept de premier rang.

### 3.7 mod.io

Forces :
- séparation abonnement serveur / installation locale ;
- synchronisation multi-device possible ;
- dépendances récursives ;
- événements de mod management ;
- aperçu de différences entre état local et externe ;
- intégration game-native via SDK.

**Leçon MODARYX :**
- distinguer `abonné / dans la bibliothèque` de `installé sur cet appareil` ;
- modéliser le delta distant/local ;
- une dépendance serveur ne signifie pas automatiquement fichier local déjà prêt.

### 3.8 GameBanana

Forces :
- écosystème créateur très structuré :
  - Mods ;
  - Sounds ;
  - WiPs ;
  - Requests ;
  - Questions ;
  - Threads ;
  - Tools ;
  - Tutorials ;
  - Projects ;
  - Concepts ;
  - Collections ;
- règles d'auteur/ownership ;
- crédits obligatoires dès qu'un téléchargement est attaché ;
- médias obligatoires pour montrer un WiP ;
- différence claire entre travail en cours et release.

**Leçon MODARYX :**
Creator Studio doit couvrir le **cycle de vie créateur**, pas seulement "upload un fichier".

États/capacités à retenir :
- idée/concept ;
- projet ;
- WiP ;
- release ;
- support ;
- demande d'aide/request ;
- tutoriel/guide ;
- équipe/studio ;
- crédits/auteurs/droits structurés.

### 3.9 Mod DB

Forces :
- projet/mod comme hub durable ;
- news/features/files regroupés ;
- Released / Early Access / Coming / TBD visibles ;
- recherche/listes avec jeu, catégorie, popularité, note, licence selon surface ;
- forte profondeur historique.

**Leçon MODARYX :**
- distinguer **maturité du projet** de **version d'une release** ;
- permettre à un projet d'exister avant sa première release ;
- conserver changelog/news/devlog sans polluer la fiche de décision joueur.

### 3.10 Prism Launcher

Forces :
- instances réellement séparées ;
- provider choisi explicitement ;
- Modrinth + CurseForge dans le même outil ;
- mods activables/désactivables ;
- import zip / mrpack ;
- copie d'instance avec choix fins :
  - saves ;
  - options ;
  - resource packs ;
  - shaders ;
  - mods ;
  - serveurs ;
- clone/copy-on-write/hardlinks selon filesystem.

**Leçon MODARYX :**
la duplication d'un profil ne doit pas être tout-ou-rien.

Prévoir conceptuellement :
- cloner mods seulement ;
- cloner configs ;
- cloner saves ou **ne pas** les cloner ;
- cloner ressources ;
- créer une branche d'essai peu coûteuse si le filesystem/runtime le permet.

### 3.11 Wabbajack

Forces :
- reproductibilité d'une modlist complète ;
- chaque fichier doit avoir une origine ;
- installation isolée du dossier du jeu ;
- partage sans redistribuer les mods eux-mêmes ;
- fichiers externes explicitement demandés ;
- README spécifique obligatoire dans le parcours ;
- distinction liste officielle/featured vs non officielle ;
- support dédié attendu pour listes importantes.

**Leçon MODARYX :**
- provenance fichier par fichier pour les packs complexes ;
- manifest/recipe plutôt que copie illégitime ;
- étapes manuelles externes assumées quand une source ne permet pas l'automatisation ;
- ne jamais prétendre "one click" si l'utilisateur doit réellement intervenir.

## 4. Décisions produit retenues pour MODARYX V2

Les points suivants sont **retenus** parce qu'ils renforcent directement l'architecture déjà décidée sans copier l'identité d'un concurrent.

### 4.1 Application d'une configuration = delta avant mutation

Toute future action capable de modifier une configuration doit pouvoir afficher :

- ajoutés ;
- retirés ;
- versions modifiées ;
- dépendances ajoutées ;
- dépendances devenues inutiles ;
- conflits ;
- loader/framework ;
- version du jeu ;
- configuration ;
- provenance/source ;
- changement de droits/risque si pertinent.

Modes :
- Ajouter ;
- Remplacer ;
- Annuler.

Le site peut afficher/préparer ce plan ; l'application locale appartient à MODARYX Forge.

### 4.2 Dépendances avec origine d'intention

Chaque composant doit pouvoir indiquer :
- **Choisi par vous**
- **Requis par X**
- **Requis transitivement**
- **Suggéré**
- **Inclus par le curateur**

Cette distinction doit survivre dans Profile/Modpack/receipt.

### 4.3 Version pinning

Ajouter au modèle de décision :
- Auto sûr ;
- Proposer ;
- Épinglé.

Un `Update all` ne doit jamais écraser silencieusement un élément épinglé.

### 4.4 Update into branch/profile

Avant mise à jour significative d'un Modpack/Profil :
- proposer une copie/branche ;
- garder l'ancienne composition récupérable ;
- afficher les changements ;
- promouvoir seulement après validation.

### 4.5 Historique personnel

Candidat retenu pour Library :
- historique de téléchargements/actions réelles lorsqu'un backend/runtime existe ;
- privé par défaut ;
- filtrable par jeu/source/date ;
- aucune entrée démo présentée comme historique réel.

### 4.6 Cycle de vie Creator

Le modèle Creator Studio doit distinguer :
- Concept ;
- Projet/WiP ;
- Release ;
- Archived.

Compléments possibles :
- Request ;
- Guide/Tutorial ;
- Devlog.

La maturité du projet ne remplace pas le channel de release.

### 4.7 Crédits et auteurs structurés

Avant publication réelle :
- auteurs ;
- co-auteurs ;
- studio/team ;
- sources ;
- permissions ;
- licences ;
- assets tiers ;
- preuves si nécessaires.

Un champ texte libre de crédits ne suffit pas pour les cas complexes.

### 4.8 Collection ≠ application de Collection

Le site garde :
- Collection = sélection/curation.

Si MODARYX Forge sait un jour appliquer cette sélection :
- l'action devient une capacité séparée ;
- elle exige un plan/delta ;
- elle doit annoncer si le résultat devient un Profil ou un Modpack.

### 4.9 Support attaché à la composition

Pour une Collection/Modpack complexe :
- le support de composition relève du curateur/auteur de la composition ;
- ne pas rediriger automatiquement chaque problème vers les auteurs des mods composants.

### 4.10 Provider/source explicite

Quand un contenu existe chez plusieurs providers :
- source sélectionnée visible ;
- provider ne doit pas être confondu avec auteur ;
- version/artefact exact lié à la source ;
- pas de "fusion magique" de fichiers qui semblent identiques.

### 4.11 Import/export interopérable

Quand légal et techniquement possible :
- accepter manifests/formats ouverts ;
- préserver les informations inconnues plutôt que les jeter ;
- rapporter ce qui ne peut pas être importé ;
- ne jamais convertir silencieusement en perdant versions/configs/droits.

### 4.12 Simple + expert

Vue recommandée :
- `Prêt`
- `2 dépendances requises`
- `1 élément épinglé`
- `Aucun conflit critique`

Vue avancée :
- graph/dépendances ;
- load order ;
- fichiers ;
- versions ;
- sources ;
- hashes ;
- décisions ;
- delta ;
- logs/receipt.

## 5. Éléments à éviter explicitement

- règles de conflits devenant un graphe incompréhensible ;
- "Update all" qui ignore les éléments épinglés ;
- dépendances automatiques impossibles à distinguer des choix utilisateur ;
- collection présentée comme installable sans manifeste/runtime ;
- redistribution de fichiers tiers par facilité ;
- faux "one click" masquant des étapes manuelles ;
- UI qui cache l'origine d'un fichier ;
- deux applications concurrentes officielles qui divisent l'effort sans nécessité ;
- réseau social générique qui dilue le modding ;
- statistiques de popularité utilisées comme substitut à la qualité/compatibilité ;
- projets créateurs forcés à attendre une release pour exister.

## 6. Delta avec le prototype Living Threshold actuel

Déjà bien couvert :
- Collection / Modpack / Profil distincts ;
- compatibilité/prérequis ;
- état manager/runtime absent ;
- Library structurée ;
- Creator Studio ;
- Support != Signalement ;
- provenance/scan/compatibilité séparés ;
- profils local/private ;
- services absents non simulés ;
- error/retry/offline ;
- surfaces mobile dédiées.

À approfondir dans le prototype ou le futur root :
1. **Library > Historique** réel/private-ready ;
2. **project maturity** Concept / WiP / Released / Archived ;
3. **structured credits/authors** dans Creator Studio ;
4. **dependency origin** choisi/requis/transitif/suggéré ;
5. **version pinning** Auto sûr / Proposer / Épinglé ;
6. **delta preview** pour Modpack/Profile/Collection appliquée ;
7. **Add vs Replace semantics** ;
8. **update into branch/profile** ;
9. **provider/source selection** dans les cas multi-source ;
10. **support ownership** d'une composition ;
11. **import/export compatibility report** ;
12. **advanced plan** sans graph spaghetti.

Ces éléments sont des exigences/candidats retenus de conception. Aucun runtime d'installation n'est déclaré.

## 7. Signaux communautaires à ne pas surinterpréter

Retours Reddit récents convergent sur plusieurs tensions :
- Vortex apprécié pour le guidage, MO2 pour le contrôle direct ;
- gros modlists exigent performance et transparence ;
- mise à jour en masse doit respecter les exceptions/pins ;
- r2modman est souvent apprécié pour sa légèreté ;
- les utilisateurs veulent connaître clairement loader/version/source.

Ces signaux sont utiles pour l'UX, mais ne remplacent pas :
- mesures ;
- tests humains MODARYX ;
- documentation officielle ;
- preuves techniques.

## 8. Règle anti-oubli

Avant VF :
- chaque décision retenue de la section 4 doit être :
  - matérialisée ;
  - ou mappée vers une capacité réelle ;
  - ou explicitement reportée/rejetée avec décision humaine ;
- aucune source externe n'autorise un scraping ou une redistribution interdite ;
- aucune statistique/compatibilité externe ne doit être inventée ;
- aucun manager/runtime desktop ne doit être simulé par le site.

**État : benchmark actuel consolidé ; delta produit identifié ; intégration anti-oubli requise.**
