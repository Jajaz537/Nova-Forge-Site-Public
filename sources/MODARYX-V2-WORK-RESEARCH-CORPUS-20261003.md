# MODARYX V2 — Corpus consolidé pour étude indépendante Work

**Date d’assemblage : 2026-10-03**  
**Branche source :** `audit/modaryx-v2-legacy-boundary-20261003`  
**HEAD vérifié avant assemblage :** `517f75d368e6e794b14dc9ebcd7a5da851d795d1`

## 0. Règle d’indépendance

Ce corpus est fourni pour permettre à ChatGPT Work de mener une étude indépendante.

**Ne pas utiliser les résultats du participant humain P01 avant d’avoir terminé les simulations et l’analyse primaire.**  
Ils sont volontairement exclus de ce corpus pour éviter de biaiser les profils simulés.

Ne pas inventer de résultats humains.  
Ne pas présenter les profils simulés comme des utilisateurs réels.  
Ne pas modifier le dépôt, la production, Cloudflare, DNS, DNSSEC, IONOS ou le frontend public.

---

# 1. Identité produit

- **Nova Forge = logiciel / OS**
  - Nova Forge OS Public
  - Nova Forge OS Fondateur
- **MODARYX / MODARYX MODS = plateforme web**
- `getnovaforge.com` / « getnova » = ancien projet web abandonné
- aucune migration MODARYX → Nova Forge

MODARYX V2 est une reconstruction produit/design isolée du frontend V1.

Principe :
> aucun composant visuel, stylesheet global, shell DOM, script UI ou asset legacy n’entre automatiquement dans V2.

Le frontend V1 n’est pas la référence visuelle finale.

---

# 2. Positionnement produit

Phrase directrice :
> **l’univers est le théâtre ; le modding est l’action.**

Le lore, le royaume, le loup, le dragon, les compagnons, factions, lieux et aventures restent une couche de marque et d’ambiance.

Ils ne doivent jamais masquer les tâches produit :
- trouver un jeu ;
- trouver un mod/plugin ;
- vérifier compatibilité et prérequis ;
- choisir une version ;
- récupérer un fichier ;
- organiser ou installer une configuration ;
- suivre un créateur ;
- utiliser la communauté ;
- publier une création.

---

# 3. Colonne vertébrale de navigation

Parcours principal :

**Accueil → choisir/rechercher un jeu → hub du jeu → explorer mods/plugins → fiche création → installer/télécharger → collections → créateurs → communauté → univers MODARYX**

Navigation desktop de travail :
- Découvrir
- Jeux
- Mods & Plugins
- Collections
- Créateurs
- Communauté
- Créer

Utilitaires :
- Recherche
- Bibliothèque
- Notifications
- Compte

Navigation mobile prioritaire :
- Recherche
- Jeux
- Découvrir
- Bibliothèque
- Compte / Menu

Menu mobile complet :
- Mods & Plugins
- Collections
- Créateurs
- Communauté
- Créer
- Docs
- Sécurité

La recherche doit être accessible :
- depuis le header desktop ;
- immédiatement sur mobile ;
- dans un Game Hub ;
- dans Community lorsque le contexte le justifie.

---

# 4. Objets produit à ne pas fusionner

## Favori
Marque-page personnel léger.
- privé par défaut ;
- pas d’ordre ;
- pas de version figée ;
- pas de dépendances résolues.

## Collection
Sélection éditoriale organisée par un curateur.
- titre ;
- description ;
- visibilité ;
- liste de contenus ;
- notes ;
- ordre éditorial facultatif ;
- tags.

Une Collection n’est pas automatiquement installable.

## Modpack
Ensemble versionné et installable.
- jeu ;
- version de jeu ;
- loader/framework ;
- version du modpack ;
- dépendances ;
- versions/ranges ;
- fichiers de configuration autorisés ;
- règles d’installation ;
- historique ;
- provenance ;
- état de distribution.

## Profile / Loadout
Configuration utilisateur concrète.
- privée/locale par défaut ;
- releases sélectionnées ;
- activation/désactivation ;
- ordre de chargement si applicable ;
- configs ;
- sync state ;
- manager state.

Libellé UI français recommandé en cours :
**Profils de jeu**

Microcopy de travail :
**Configurations enregistrées de mods et versions**

---

# 5. ContentItem / Release / File

Ces objets doivent rester distincts.

## ContentItem
Projet/contenu principal.

## Release
Version publiée d’un ContentItem.

## File
Artefact téléchargeable lié à une Release.

Ne jamais employer Version et Fichier comme synonymes.

Libellé UI recommandé pour les artefacts d’une release :
**Fichiers de cette version**

---

# 6. Compatibilité et prérequis

Le libellé utilisateur français recommandé est :

**Compatibilité et prérequis**

Sous-sections :
- Requis
- Optionnel
- Recommandé
- Incompatible

Le terme technique `requirements` peut rester dans les routes/contrats internes.

Dimensions possibles :
- version du jeu ;
- loader ;
- plateforme ;
- client/server ;
- DLC ;
- architecture/runtime.

États de compatibilité :
- Compatible
- Partiellement compatible
- Incompatible
- Non vérifié

Niveaux de preuve :
- Mesuré
- Déclaré
- Estimé
- Inconnu

Ne pas utiliser un badge générique « Sûr » ou « Vérifié » sans dimension précise et preuve réelle.

---

# 7. Confiance / provenance / distribution

## Provenance
- Provenance vérifiée : preuve réelle disponible.
- Provenance déclarée : source déclarée mais non attestée.
- Provenance inconnue : preuve insuffisante.

## SHA-256
Prouve l’identité des bytes, pas l’innocuité.

## Signature
Prouve une relation cryptographique, pas l’absence de danger.

## Scan
N’afficher que le résultat réel d’un service réel.

## Distribution
États possibles :
- Verrouillé
- Publié
- Retiré
- Révoqué

Le terme « Disponible » doit signifier une disponibilité réelle.

Pour un jeu avec catalogue mais sans distribution prouvée, formulation de travail :
**Catalogue consultable — téléchargement non garanti**

`Distribution disponible` reste réservé aux cas où la distribution réelle est prouvée.

---

# 8. Game Hub

Le Game Hub est le pivot entre découverte globale et catalogue contextualisé.

Il doit permettre de comprendre immédiatement :
- quel jeu est consulté ;
- quelle version est active ;
- quels types de contenus existent ;
- quels contenus sont compatibles ;
- où chercher ;
- où voir collections, créateurs et guides.

Header du jeu :
- titre ;
- visuel autorisé ;
- statut de support MODARYX ;
- version active ;
- plateforme si pertinente ;
- suivi/favori si fonction réelle ;
- recherche dans ce jeu.

Onglets proposés :
- Aperçu
- Mods & Plugins
- Collections
- Créateurs
- Guides
- Activité

`Mods & Plugins` reste l’entrée primaire courte.

Microcopy de travail :
**Mods, plugins, addons, scripts, outils et autres contenus compatibles.**

Le jeu déclare les types qu’il supporte :
- mods ;
- plugins ;
- addons ;
- scripts ;
- maps ;
- shaders ;
- presets ;
- tools.

Ne pas afficher une taxonomie globale inutile à un jeu.

Blocs d’aperçu prioritaires :
1. Pour votre version
2. Populaires
3. Nouveaux
4. Récemment mis à jour
5. Types de contenus
6. Catégories
7. Collections
8. Créateurs actifs
9. Guides techniques

Un hub peut exister en mode éditorial sans corpus distribuable.

---

# 9. Fiche contenu

La fiche contenu doit répondre rapidement à :
- Qu’est-ce que ce contenu ?
- Pour quel jeu ?
- Quelle version ?
- Qui l’a créé ?
- Est-il compatible avec mon contexte ?
- Quelles dépendances sont nécessaires ?
- Quels conflits sont connus ?
- Quelle release dois-je utiliser ?
- Puis-je l’installer ou le télécharger ?
- Quel est son état de confiance/provenance ?
- Où trouver fichiers, changelog, support et permissions ?

Avant l’action principale, afficher :
- état de compatibilité ;
- version du jeu ;
- loader/framework ;
- plateforme/environnement si pertinent ;
- dépendances obligatoires ;
- conflit majeur ;
- état de distribution ;
- provenance/confiance.

Actions possibles selon capacités réelles :
- Installer avec manager
- Télécharger manuellement
- Ajouter à Collection
- Ajouter à Profil de jeu

Ne jamais afficher une installation automatisée comme disponible si le manager/runtime n’est pas réellement connecté.

Navigation interne de travail :
- Overview / Aperçu
- Files / Fichiers
- Versions
- Compatibilité et prérequis
- Changelog
- Media
- Support / Posts
- Issues / Bugs
- Permissions

Mobile — priorité de travail :
1. identité
2. compatibilité
3. action
4. compatibilité et prérequis
5. media
6. description
7. fichiers/versions
8. support

---

# 10. Bibliothèque

La bibliothèque personnelle sépare :
- favoris ;
- suivis ;
- collections ;
- modpacks ;
- profils de jeu ;
- recherches sauvegardées ;
- installations uniquement si un manager est réellement connecté.

États :
- local-only
- sync-pending
- synced
- conflict
- unavailable

Les éléments personnels restent privés par défaut.

Sans manager connecté, MODARYX ne prétend pas connaître l’état réel des installations locales.

---

# 11. Communauté

La communauté reste centrée sur le modding.

Sections principales :
- Support
- Questions
- Discussions
- Studios / équipes
- Activité

Chaque contenu communautaire garde un contexte clair :
- jeu ;
- création ;
- collection ;
- équipe.

La Community ne doit pas devenir un réseau social générique.

Support et Signalement restent distincts :
- Support = aide, bug, installation, fonctionnement ;
- Signalement = violation, risque, abus, contenu problématique.

---

# 12. Créateurs et Creator Studio

Distinguer :
- Créateur
- Équipe / Studio
- Curateur
- Modérateur
- Administrateur
- Fondateur

Creator Studio sépare :
- Project
- Release

Scénario de publication :
**Créer → Creator Studio → Project → Releases**

Un auteur, une équipe et des contributeurs doivent être attribués clairement.

---

# 13. Recherche globale

La recherche globale peut retourner plusieurs types :
- Jeu
- Contenu
- Créateur
- Équipe
- Collection
- Modpack

Chaque résultat doit afficher son type.

La recherche dans un Game Hub est contextualisée par jeu et éventuellement version.

L’utilisateur doit pouvoir basculer explicitement vers la recherche globale sans perdre silencieusement son contexte.

---

# 14. Wireframes low-fi

## Écrans déjà couverts historiquement dans Figma

Desktop :
- Home
- Games
- Catalog
- Content Detail
- Collection
- Creator
- Creator Studio
- Library

Mobile :
- Home
- Catalog
- Content Detail

## Quatre écrans core matérialisés ensuite en low-fi HTML isolé

### Desktop Game Hub
Structure :
- navigation MODARYX ;
- identité du jeu ;
- version active ;
- support state ;
- recherche dans le jeu ;
- onglets Mods & Plugins / Collections / Créateurs / Guides ;
- Pour votre version ;
- Populaires ;
- Nouveautés ;
- Collections ;
- Créateurs actifs.

### Desktop Global Search
Structure :
- champ de recherche global ;
- tabs Tous / Jeux / Contenus / Collections / Créateurs ;
- filtres Jeu / Type / Auteur / Date / Statut / Compatibilité ;
- résultats mixtes avec type visible ;
- état fail-soft si recherche externe indisponible.

### Desktop Community
Structure :
- recherche communauté ;
- tabs Support / Questions / Discussions / Studios ;
- topics avec contexte jeu/release ;
- colonne contexte ;
- action d’aide ;
- action Signalement distincte.

### Mobile Game Hub
Structure :
- identité du jeu ;
- version accessible ;
- recherche ;
- raccourcis Mods / Collections / Guides / Créateurs ;
- Pour votre version ;
- Populaires ;
- Nouveautés ;
- Catégories ;
- Collections ;
- Créateurs.

QA mécanique low-fi déjà obtenue :
- 320 / 390 / 768 / 1440 px ;
- 4 frames présentes ;
- overflow horizontal = 0 ;
- marqueur : `PASS_V2_LOWFIT_REVIEW_MICROPROOF`.

Cette QA mécanique ne constitue pas une validation humaine.

---

# 15. 16 tâches exactes du tree test

## T1 — Plugin pour un jeu
> « Tu veux installer un plugin pour un jeu précis. Où vas-tu ? »

Chemin attendu interne, à NE PAS montrer aux profils avant leur réponse :
Jeux → Hub jeu → Mods & Plugins / recherche contextualisée.

## T2 — Compatibilité
> « Tu veux savoir si la version actuelle d'un mod fonctionne avec la version 1.21.1 de ton jeu. »

Attendu interne :
Fiche → Compatibilité / Requirements.

## T3 — Dépendance
> « Avant installation, tu veux savoir ce qu'il faut installer en plus. »

Attendu interne :
Fiche → Requirements → Required.

## T4 — Conflit
> « Tu veux vérifier ce qui risque d'entrer en conflit avec ce mod. »

Attendu interne :
Fiche → Requirements → Incompatible / Conflicts.

## T5 — Favori
> « Tu veux simplement retrouver ce mod plus tard. »

Attendu interne :
Favori.

## T6 — Collection
> « Tu prépares une sélection thématique de mods à organiser ou partager. »

Attendu interne :
Collection.

## T7 — Profil
> « Tu veux sauvegarder exactement les mods et versions actifs dans ta configuration de jeu. »

Attendu interne :
Bibliothèque → Profils / Loadouts.

## T8 — Modpack
> « Tu veux installer un ensemble versionné de mods déjà préparé pour une version précise du jeu. »

Attendu interne :
Modpacks.

## T9 — Ancienne version
> « Tu veux revenir à la version 1.4 d'un mod. »

Attendu interne :
Fiche → Versions.

## T10 — Fichier correspondant
> « Après avoir choisi la version 1.4, tu veux récupérer son fichier. »

Attendu interne :
Release 1.4 → Files.

## T11 — Créateur
> « Tu connais le nom d'un créateur et veux retrouver toutes ses créations. »

Attendu interne :
Recherche globale ou Créateurs.

## T12 — Publier une release
> « Tu as déjà un projet et tu veux publier une nouvelle version. »

Attendu interne :
Créer → Creator Studio → Project → Releases.

## T13 — Support
> « Le mod ne fonctionne pas comme prévu et tu veux demander de l'aide. »

Attendu interne :
Fiche → Support / Issues.

## T14 — Signalement
> « Tu penses qu'un contenu enfreint les règles ou présente un risque. »

Attendu interne :
Fiche → Signalement.

## T15 — Catalogue vs distribution
> « Un jeu indique “Catalogue disponible”. T'attends-tu à pouvoir télécharger immédiatement ? »

Attendu interne :
non nécessairement ; comprendre que catalogue ≠ distribution.

## T16 — Recherche globale
> « Tu veux retrouver à la fois un jeu, une collection ou un créateur depuis un seul endroit. »

Attendu interne :
Recherche globale.

---

# 16. Hypothèses critiques à challenger

## H1 — Collection / Modpack / Profile
Les utilisateurs distinguent-ils naturellement :
- sélection éditoriale ;
- ensemble installable ;
- configuration personnelle ?

## H2 — Release / File / Changelog
Les utilisateurs distinguent-ils :
- version publiée ;
- fichier de cette version ;
- historique des changements ?

## H3 — Support / Signalement
Séparent-ils :
- aide/bug ;
- violation/risque ?

## H4 — Bibliothèque
Le mot « Bibliothèque » est-il compris comme espace personnel regroupant favoris, suivis, collections et profils ?

## H5 — Mods & Plugins
Ce libellé sert-il naturellement d’entrée pour addons/scripts/tools, ou semble-t-il exclure ces types ?

## H6 — Catalogue vs distribution
« Catalogue disponible » ou « Catalogue consultable » est-il interprété comme téléchargement possible ?

## H7 — Non vérifié
Le terme est-il compris comme :
- dangereux ;
- non testé ;
- provenance inconnue ;
- autre ?

Toujours tester la dimension précise plutôt qu’un badge générique.

---

# 17. Card sorting — cartes

À classer librement :
- Jeux
- Mods
- Plugins
- Addons
- Scripts
- Outils
- Collections
- Modpacks
- Profils / Loadouts
- Favoris
- Créateurs
- Équipes / Studios
- Communauté
- Support
- Signalements
- Versions
- Fichiers
- Dépendances
- Conflits
- Compatibilité
- Changelog
- Bibliothèque
- Recherche
- Notifications
- Creator Studio
- Paramètres
- Sécurité / Confiance
- Guides

Consigne :
> « Regroupe ces éléments de la manière qui te semble la plus naturelle. Tu peux créer autant de groupes que tu veux et leur donner le nom que tu veux. »

Ne pas donner les catégories MODARYX avant la fin.

---

# 18. Mesures du tree test

Pour chaque tâche et profil simulé :
- premier choix ;
- chemin final ;
- hésitation ;
- retour arrière plausible ;
- terme incompris ;
- chemin concurrent plausible ;
- commentaire.

Catégories d’analyse :
- succès direct simulé ;
- succès indirect simulé ;
- échec simulé ;
- ambiguïté terminologique.

**Ne pas transformer ces catégories simulées en statistiques humaines.**

---

# 19. Points de correction déjà issus de revue experte, à challenger et non à présupposer

Ces décisions existent mais Work doit les challenger indépendamment :

- `Requirements` → **Compatibilité et prérequis**
- `Profile/Loadout` côté UI → **Profils de jeu**
- fichiers d’une Release → **Fichiers de cette version**
- `Mods & Plugins` conservé comme libellé primaire avec microcopy taxonomique
- `Catalogue disponible` ne doit pas être confondu avec distribution réelle
- Collection / Modpack / Profile restent des objets différents
- Support et Signalement restent distincts
- Release et File restent distincts

Work doit dire si ses recherches et simulations convergent ou non avec ces décisions.

---

# 20. Contraintes techniques / vérité produit

Ne jamais simuler une capacité absente.

- Manager install : uniquement si manager réellement connecté.
- Téléchargement : uniquement si fichier réellement distribuable.
- Scan : uniquement résultat réel.
- Provenance : seulement preuve disponible.
- Notifications : seulement événements réels.
- Sync : ne pas afficher « synchronisé » sans service réel.
- Installation locale : ne pas prétendre la connaître sans manager.
- Aucun DNS/Cloudflare/production à modifier pendant cette étude.

---

# 21. Design / responsive / accessibilité

Cible qualité : Premium HD / VF Premium HD, mais ce terme n’est jamais une preuve de finalisation.

Le design final doit couvrir :
- cohérence ;
- responsive ;
- accessibilité ;
- composants ;
- états ;
- navigation ;
- typographie ;
- surfaces ;
- interactions ;
- motion ;
- contrôles visuels.

Accessibilité minimale prévue :
- skip link ;
- landmarks ;
- focus visible ;
- aria-current ;
- menu mobile clavier ;
- fermeture Escape ;
- labels textuels ;
- cibles tactiles suffisantes ;
- compatibilité jamais uniquement par couleur ;
- réordonnancement non drag-only.

---

# 22. Monde vivant / contexte réel

Idée approuvée à conserver pour la VF :
- saison locale ;
- météo réelle ;
- heure locale ;
- ambiance du monde MODARYX adaptée ;
- confidentialité respectée ;
- fail-soft ;
- reduced-motion.

Exemple conceptuel :
hiver + nuit + neige réelle → ambiance froide, neige légère, lanternes plus visibles.

Cette couche ne doit pas gêner les tâches produit ni devenir nécessaire pour comprendre l’interface.

---

# 23. État de maturité

Déjà terminé au niveau conception :
- audit legacy complet ;
- anti-contamination ;
- architecture produit ;
- taxonomie ;
- principaux contrats produit ;
- parcours critiques ;
- états ;
- low-fi ;
- QA mécanique des 4 écrans supplémentaires ;
- revue experte IA/terminologie.

Encore non prouvé :
- validation humaine globale ;
- direction artistique finale ;
- high-fi final ;
- frontend V2 de production.

Figma est actuellement bloqué par quota Starter pour de nouvelles écritures.

Miro n’est pas disponible dans l’organisation actuelle.

Une preuve humaine P01 existe dans la conversation principale, mais elle est volontairement exclue ici pour préserver l’indépendance de l’étude Work.

---

# 24. Sources canoniques d’origine

Ce corpus consolide les décisions de travail provenant notamment de :

- `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-03.md`
- `docs/MODARYX-V2-HUMAN-IA-TEST-KIT-20261003.md`
- `docs/MODARYX-V2-PRODUCT-GLOSSARY-20261003.md`
- `docs/MODARYX-V2-IA-TERMINOLOGY-EXPERT-REVIEW-20261003.md`
- `docs/MODARYX-V2-COMMUNITY-LIBRARY-NAV-CONTRACT-20261003.md`
- `docs/MODARYX-V2-COLLECTION-MODPACK-PROFILE-CONTRACT-20261003.md`
- `docs/MODARYX-V2-CONTENT-DETAIL-CONTRACT-20261003.md`
- `docs/MODARYX-V2-GAME-HUB-CONTRACT-20261003.md`
- `docs/MODARYX-V2-MISSING-WIREFRAME-BLUEPRINTS-20261003.md`
- `docs/MODARYX-V2-WIREFRAME-COVERAGE-20261003.md`
- `docs/MODARYX-V2-HIGH-FI-GATE-20261003.md`
- `docs/MODARYX-V2-ANTI-OUBLI-MASTER-20261003.md`

En cas de contradiction, le checkpoint canonique V2 le plus récent et les corrections plus récentes de la branche priment.

---

# 25. Mission Work à exécuter avec ce corpus

1. Rechercher des sources externes actuelles sur les modèles mentaux et le vocabulaire des utilisateurs de plateformes de modding.
2. Créer au minimum cinq profils fondés sur la recherche :
   - débutant ;
   - expérimenté ;
   - créateur/moddeur ;
   - curateur/utilisateur collections/modpacks ;
   - utilisateur mobile peu technique.
3. Exécuter les 16 tâches à l’aveugle :
   - ne pas montrer le chemin attendu avant la réponse du profil ;
   - enregistrer premier choix, chemin, hésitation, termes ambigus et chemins concurrents.
4. Produire les **80 résultats bruts** : 16 tâches × 5 profils.
5. Challenger spécifiquement :
   - Favori / Collection / Modpack / Profil ;
   - Release / Fichier ;
   - Compatibilité et prérequis ;
   - Support / Signalement ;
   - Catalogue / Distribution ;
   - Bibliothèque ;
   - Mods & Plugins ;
   - recherche globale / contextualisée ;
   - Créateur / Équipe.
6. Séparer explicitement :
   - faits sourcés ;
   - inférences ;
   - simulations IA.
7. Ne produire aucune fausse statistique humaine.
8. Ne modifier aucun fichier produit ni configuration.
9. Rendre :
   - sources ;
   - profils ;
   - 80 simulations brutes ;
   - convergences ;
   - ambiguïtés ;
   - incertitudes ;
   - propositions de correction non appliquées.

**Fin du corpus consolidé.**
