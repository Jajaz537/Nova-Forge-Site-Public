# MODARYX V2 — Benchmark produit, UX et méthode de conception

**Date : 2026-10-03**  
**Statut : base de conception — aucune implémentation visuelle autorisée depuis ce document seul.**

## 1. Cible produit

MODARYX V2 n'est pas un média de news gaming.

C'est une **plateforme multigaming de contenus modifiants et communautaires** :

- mods ;
- plugins ;
- addons ;
- scripts ;
- libraries/frameworks ;
- tools ;
- resource/texture packs ;
- shaders ;
- presets ;
- maps ;
- patches ;
- traductions ;
- modpacks ;
- collections ;
- profils/configurations partageables ;
- autres types extensibles selon les jeux.

Le principe central est : **jeu → contenu compatible → compréhension → installation/gestion → communauté/créateur**.

## 2. Références étudiées

### Nexus Mods

Source : https://www.nexusmods.com/

Principes observés :

- promesse immédiatement centrée sur le modding ;
- entrée claire vers mods et upload ;
- navigation Games / Mods / Collections / Media / Community ;
- importance de l'app/installation ;
- sélection de jeux et volumétrie visibles ;
- collections comme simplification d'installation ;
- créateurs et récompenses visibles.

### CurseForge

Source : https://www.curseforge.com/games

Principes observés :

- recherche de jeu extrêmement visible ;
- catalogue de jeux triable ;
- volume de mods/téléchargements par jeu ;
- sécurité, facilité d'installation et créateurs placés dans la promesse ;
- plateforme multi-jeux à forte taxonomie.

### Modrinth

Sources :
- https://modrinth.com/
- https://modrinth.com/discover/mods

Principes observés :

- familles de contenus explicites : Mods, Resource Packs, Data Packs, Shaders, Modpacks, Plugins, Servers ;
- découverte et recherche au centre ;
- tri + filtres ;
- métadonnées importantes visibles directement dans les listes ;
- loaders/catégories/côté client-serveur visibles ;
- interface orientée produit plutôt que média.

### Steam Workshop

Sources :
- https://steamcommunity.com/workshop/
- https://steamcommunity.com/workshop/doc/

Principes observés :

- pages de navigation plus larges et previews plus grandes ;
- filtrage rapide ;
- filtres spécifiques aux types d'objets d'un jeu ;
- Quick View sans casser le parcours ;
- mobile / Steam Deck pris en compte ;
- collections partageables ;
- abonnement en masse ;
- dépendances ;
- détection de dépendances manquantes ;
- ordre de chargement ;
- recherches enregistrées.

### GameBanana

Source : https://gamebanana.com/

Principes observés :

- communauté de créateurs très visible ;
- studios de modding ;
- clubs ;
- contribution et collaboration intégrées à l'identité du produit.

### Mod DB

Sources :
- https://www.moddb.com/mods
- https://www.moddb.com/addons/latest

Principes observés :

- très large diversité de jeux/contenus ;
- catégories de contenus fines ;
- popularité récente / globale ;
- date de publication/mise à jour ;
- licence visible dans certaines listes ;
- invitation permanente aux créateurs.

## 3. Leçons produit retenues

### 3.1 Le jeu est un contexte primaire

La première question utilisateur est souvent :

> Quel jeu veux-tu modifier ?

La homepage doit permettre rapidement :

- recherche globale ;
- sélection/reprise d'un jeu ;
- découverte de jeux populaires/récents ;
- entrée vers l'écosystème d'un jeu.

### 3.2 Le type de contenu est extensible

Le modèle actuel ne doit pas figer tout en `mod`.

Prévoir un vocabulaire extensible et dépendant du jeu.

### 3.3 Recherche + filtres = cœur du produit

Socle universel :

- requête ;
- jeu ;
- type ;
- catégorie ;
- auteur ;
- date ;
- popularité ;
- note ;
- version ;
- dernière mise à jour.

Filtres contextuels :

- loader ;
- client/server ;
- DLC ;
- plateforme ;
- version du jeu ;
- dépendances ;
- compatibilité ;
- tags spécifiques au jeu.

### 3.4 La fiche de contenu est une surface critique

Elle doit fournir, selon disponibilité :

- identité du contenu ;
- jeu et type ;
- créateur/équipe ;
- version ;
- statut ;
- date de mise à jour ;
- compatibilité ;
- screenshots/vidéo ;
- description ;
- fichiers ;
- versions ;
- changelog ;
- requirements ;
- dépendances ;
- conflits ;
- instructions ;
- installation/désinstallation ;
- licence/droits ;
- provenance ;
- sécurité ;
- statistiques ;
- commentaires ;
- support/issues ;
- contenus liés.

La hiérarchie doit montrer d'abord ce qui permet la décision.

### 3.5 Collections ≠ favoris

Séparer conceptuellement :

- favoris ;
- collections éditoriales ;
- modpacks ;
- profils/configurations ;
- listes de suivi.

### 3.6 Dépendances et compatibilité doivent être visuelles

Avant installation, l'utilisateur doit comprendre :

- compatible ;
- partiellement compatible ;
- incompatible ;
- non vérifié ;
- dépendances requises ;
- dépendances optionnelles ;
- conflits ;
- version du jeu ;
- loader/framework ;
- DLC.

### 3.7 Créateurs = persona de premier rang

Prévoir :

- profil créateur ;
- équipe/studio ;
- rôles ;
- publication ;
- versions ;
- analytics ;
- commentaires/support ;
- droits/licence ;
- revenus/récompenses si retenus plus tard.

### 3.8 Quick View / progressive disclosure

Pour accélérer l'exploration :

- aperçu rapide depuis les résultats ;
- informations essentielles sans ouvrir une page complète ;
- actions rapides : favori, collection, installer/télécharger selon droits.

## 4. Méthode UX retenue

### Information Architecture

Références NN/g :
- https://www.nngroup.com/articles/ia-study-guide/
- https://www.nngroup.com/articles/card-sorting-tree-testing-differences/
- https://www.nngroup.com/articles/tree-testing/

Règles :

1. card sorting pour découvrir les regroupements et libellés possibles ;
2. architecture proposée ;
3. tree testing pour vérifier la trouvabilité ;
4. correction avant high fidelity.

### Prototypage

Références Figma :
- https://www.figma.com/fr-fr/prototypes/
- https://help.figma.com/hc/fr/articles/15339657135383-Guide-des-variables-dans-Figma

Règles :

- prototype avant développement lourd ;
- composants interactifs ;
- variables/tokens ;
- états ;
- logique conditionnelle lorsque nécessaire ;
- desktop et mobile conçus ensemble.

## 5. Pipeline studio MODARYX V2

1. Recherche continue.
2. Benchmark.
3. Audit legacy.
4. Personas et jobs-to-be-done.
5. Inventaire des objets métier.
6. Architecture informationnelle.
7. Parcours critiques.
8. Card sorting.
9. Tree testing.
10. Wireframes low-fi.
11. Tests de compréhension.
12. Direction artistique.
13. Design tokens.
14. Design system.
15. Maquettes haute fidélité.
16. Prototype interactif.
17. Tests d'usage.
18. Critique comparative avec références.
19. Validation humaine.
20. Implémentation front isolée.
21. Branchement sélectif des capacités existantes.
22. QA fonctionnelle.
23. QA visuelle.
24. Accessibilité.
25. Performance.
26. Tests navigateurs/appareils.
27. Migration cache/PWA/routes.
28. Cutover contrôlé.
29. Veille et amélioration continue.

## 6. Principes de placement

Chaque écran doit être conçu à partir de :

1. intention principale de l'utilisateur ;
2. information nécessaire à la décision ;
3. action primaire ;
4. actions secondaires ;
5. détails progressifs.

### Homepage

Priorité :

1. comprendre le produit ;
2. trouver un jeu ou un contenu ;
3. reprendre un jeu récemment utilisé ;
4. découvrir des contenus ;
5. découvrir collections/créateurs ;
6. comprendre sécurité/confiance ;
7. percevoir l'univers MODARYX sans perdre la tâche.

### Hub jeu

Priorité :

1. identité du jeu ;
2. recherche dans ce jeu ;
3. catégories/types disponibles ;
4. contenus populaires/récents ;
5. collections ;
6. guides/compatibilité si utiles ;
7. créateurs actifs.

### Catalogue

Priorité :

1. recherche ;
2. filtres ;
3. tri ;
4. nombre de résultats ;
5. résultats lisibles ;
6. quick view ;
7. sauvegarde de recherche/filtres plus tard.

### Fiche contenu

Priorité :

1. titre + jeu + type + auteur ;
2. compatibilité/statut ;
3. action principale ;
4. média ;
5. résumé ;
6. fichiers/versions ;
7. dépendances/conflits ;
8. changelog ;
9. description détaillée ;
10. communauté/support ;
11. provenance/licence/sécurité.

## 7. Direction artistique : règle de non-confusion

L'univers MODARYX reste un différenciateur majeur, mais :

> l'univers est le théâtre ; le modding est l'action.

Les éléments royaume/compagnons/saisons/météo/heure/factions ne doivent jamais cacher :

- recherche ;
- jeu ;
- compatibilité ;
- installation ;
- créateur ;
- fichier ;
- dépendance ;
- sécurité.

## 8. Règles de qualité

Aucune surface n'est considérée réussie parce qu'elle est seulement :

- responsive ;
- sans overflow ;
- accessible en automatisé ;
- techniquement verte ;
- visuellement cohérente.

La validation requiert aussi :

- compréhension immédiate ;
- hiérarchie ;
- désirabilité ;
- identité ;
- efficacité ;
- comparaison avec les meilleurs patterns du marché ;
- validation humaine.

## 9. Veille continue

Chaque nouvelle idée est classée :

- **À INTÉGRER** — bénéfice net démontré ;
- **À TESTER** — hypothèse prometteuse ;
- **À ÉCARTER** — complexité, duplication ou bénéfice insuffisant.

Aucune tendance ou nouveauté n'est intégrée automatiquement.
