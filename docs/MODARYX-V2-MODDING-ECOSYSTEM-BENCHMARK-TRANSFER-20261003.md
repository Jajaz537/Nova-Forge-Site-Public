# MODARYX V2 — Transfert benchmark écosystèmes de modding

**Date : 2026-10-03**  
**Statut : EN COURS — recherche transférée vers exigences produit / aucune VF déclarée**

## 1. Séparation produit

- **MODARYX / MODARYX MODS** = plateforme web.
- **MODARYX Forge** = logiciel / écosystème desktop.
- **MODARYX Public** = édition publique.
- **MODARYX Founder** = édition Founder.
- Les références techniques/historiques `Nova Forge` restent legacy/compatibilité jusqu'à classification ; aucun renommage global aveugle.

Le site ne doit pas réimplémenter un moteur d'installation desktop. Il doit préparer, décrire, distribuer et déclencher une installation via MODARYX Forge seulement lorsqu'un runtime réel et un contrat d'intégration sont prouvés.

## 2. Références benchmarkées

Leçons issues notamment de :
- ModDropV et installateurs spécialisés GTA ;
- Vortex / Nexus Collections ;
- Mod Organizer 2 ;
- Prism Launcher ;
- ATLauncher ;
- Thunderstore / r2modman ;
- Modrinth ;
- Wabbajack ;
- OpenIV / OIV ;
- Reloaded-II ;
- CurseForge ;
- mod.io ;
- Steam Workshop ;
- Bethesda Creations ;
- autres outils spécialisés apportant une capacité distincte.

Cette veille reste permanente. Une idée issue d'un outil concurrent n'est pas automatiquement obligatoire ; elle devient obligatoire avant VF seulement si elle est explicitement retenue.

## 3. Ce que le site doit apprendre de ces écosystèmes

### 3.1 Découverte et décision avant installation

Le site doit rendre immédiatement lisibles :
- jeu ;
- type de contenu ;
- créateur ;
- version/release ;
- compatibilité ;
- dépendances ;
- conflits connus ;
- plateforme/loader si pertinent ;
- provenance ;
- état de distribution ;
- capacité réelle : consultation seule / téléchargement manuel / installation via MODARYX Forge.

Aucune carte ou CTA ne doit promettre une installation que le runtime n'est pas capable d'exécuter.

### 3.2 Projet, release, fichier

Conserver la séparation :
- projet / ContentItem ;
- release/version ;
- fichier/artefact ;
- dépendances/conflits ;
- claims de compatibilité.

Un fichier téléchargeable ne doit jamais devenir implicitement une preuve de compatibilité.

### 3.3 Profils, collections et modpacks

Retenir des meilleurs gestionnaires :
- **Collection** = sélection/curation, pas automatiquement installable ;
- **Modpack** = ensemble installable seulement si manifeste réel ;
- **Profil de jeu** = configuration personnelle de mods, versions et réglages ;
- le partage doit utiliser des manifestes/recettes reproductibles et respecter les droits de distribution ;
- lorsqu'une mise à jour de profil partagé existe, montrer le delta avant acceptation.

### 3.4 Creator Studio

Le site doit pouvoir accueillir, lorsque les contrats réels existent :
- création de projet ;
- métadonnées ;
- versions/releases ;
- fichiers ;
- dépendances ;
- conflits ;
- compatibilité ;
- changelog ;
- droits/licence ;
- provenance/signature ;
- canaux de release si pertinents ;
- manifeste/installateur déclaratif produit par MODARYX Forge ou format partagé ;
- prévisualisation/validation avant publication ;
- publication vers MODARYX sans réinventer les contraintes spécifiques de chaque jeu.

### 3.5 Sources et connecteurs

Principes :
- adapters/connecteurs autorisés plutôt que scraping universel ;
- respecter API, licences, rémunération et droits des créateurs ;
- enregistrer la provenance/source même pour un import manuel ;
- lorsqu'un jeu ou une plateforme possède déjà une installation native fiable, MODARYX peut orchestrer/rediriger plutôt que dupliquer ;
- le site doit distinguer disponibilité de la fiche, disponibilité du fichier et possibilité réelle d'installation.

### 3.6 Confiance

Ne jamais fusionner dans un badge générique :
- provenance ;
- intégrité/hash ;
- signature ;
- scan de sécurité ;
- compatibilité ;
- droits/licence ;
- modération ;
- statut de distribution.

Le libellé générique `Non vérifié` reste interdit.

### 3.7 UX débutant + expert

Le site doit présenter une lecture simple :
- `Compatible avec votre version`
- `2 dépendances requises`
- `1 conflit connu`
- `Installation disponible avec MODARYX Forge`

Puis permettre d'ouvrir le détail :
- releases ;
- fichiers ;
- dépendances ;
- sources ;
- claims de compatibilité ;
- provenance ;
- décisions de confiance.

## 4. Pont MODARYX ↔ MODARYX Forge

Cible conceptuelle :
1. l'utilisateur choisit un contenu sur MODARYX ;
2. le site vérifie qu'une action est autorisée et réellement disponible ;
3. il transmet une identité d'artefact/version/source et le contexte du jeu ;
4. MODARYX Forge effectue localement preflight, protection, résolution, consentement, installation, receipt et rollback ;
5. le site ne simule jamais cette réussite ;
6. les retours éventuels de statut doivent être explicites, minimaux et respectueux de la confidentialité.

Le protocole réel reste **PREUVE MANQUANTE** tant qu'aucun runtime d'intégration n'est prouvé.

## 5. Matrice anti-oubli site

| Leçon benchmark | État V2 |
|---|---|
| Compatibilité/version visibles avant action | TERMINÉ — conception |
| Dépendances/conflits de premier rang | TERMINÉ — conception |
| Projet / release / fichier séparés | TERMINÉ — conception |
| Collection / Modpack / Profil séparés | TERMINÉ — conception |
| Installation via manager uniquement si runtime réel | TERMINÉ — contrat / runtime PREUVE MANQUANTE |
| Pont MODARYX → MODARYX Forge | EN COURS — contrat à formaliser / runtime PREUVE MANQUANTE |
| Profils partageables/reproductibles | EN COURS — conception à compléter |
| Revue du delta d'un profil partagé | PREUVE MANQUANTE |
| Creator Studio métadonnées/releases/fichiers | TERMINÉ — conception |
| Packaging/installateur déclaratif partagé | EN COURS — dépend MODARYX Forge |
| Connecteurs sources autorisés | EN COURS — gouvernance/adapters |
| Orchestration de plateformes natives | PREUVE MANQUANTE |
| Provenance/intégrité/scan/compatibilité séparés | TERMINÉ — conception |
| Benchmark continu outils/sites de modding | EN COURS jusqu'à VF |

## 6. Règle de fermeture

Avant VF :
- aucune ligne retenue ne disparaît silencieusement ;
- le site ne déclare jamais une capacité desktop sur simple existence d'une maquette ;
- un bouton `Installer avec MODARYX Forge` exige un runtime prouvé ;
- aucune restriction de source ne doit être contournée ;
- aucune donnée de démonstration ne doit être présentée comme mesure réelle ;
- toute nouvelle idée benchmarkée est soit intégrée, soit mappée vers un équivalent prouvé, soit explicitement rejetée.

**État : EN COURS — transfert benchmark tracé ; pont réel MODARYX ↔ MODARYX Forge et preuves d'intégration restent à fermer.**
