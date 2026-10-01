# MODARYX — plan Site First vers VF ultra haut de gamme — 19 septembre 2026

Statut : **EN COURS — priorité produit explicite : terminer MODARYX avant de reprendre la finition finale des OS**.

Ce plan ne déclare pas MODARYX à 100 %. Il fixe l'ordre de fermeture des écarts jusqu'à ce que chaque élément soit soit **TERMINÉ**, soit explicitement **BLOQUÉ / PREUVE MANQUANTE** avec une dépendance réelle documentée.

## Objectif

Amener **MODARYX / MODARYX MODS**, plateforme web distincte de Nova Forge OS, à une **VF ultra haut de gamme** avec :

- identité visuelle cohérente et premium ;
- monde vivant réellement évolutif ;
- responsive robuste ;
- accessibilité ;
- navigation et états complets ;
- performance et cache évolutifs ;
- sécurité et provenance explicites ;
- contenu public honnête ;
- aucune capacité distante simulée ;
- preuves navigateur/appareil appropriées avant déclaration finale.

## Priorité actuelle

### 1. TERMINÉ — architecture de croissance future

- précache cœur compact ;
- runtime cache borné ;
- nouvelles ressources hors précache global par défaut ;
- garde-fou 800000 conservé ;
- monde vivant logique loup/dragon ;
- mêmes stades de croissance, rythmes indépendants ;
- reduced motion respecté dans l'architecture ;
- empreintes publiques maintenues.

### 2. TERMINÉ — relation d'équipe clarifiée sans fusion de marques

Règle :

- **MODARYX MODS = plateforme web** ;
- **Nova Forge OS = logiciel / OS**, éditions Public et Fondateur ;
- les deux produits sont créés par la **même équipe** ;
- ils partagent un niveau d'exigence premium mais pas le même habillage ni la même identité.

Implémentation de ce lot :

- signature d'équipe discrète injectée par le shell commun dans les footers ;
- section statique « Même équipe · produits distincts » dans `ecosystem.html` ;
- aucune nouvelle marque de groupe inventée ;
- aucun lien public Nova Forge OS inventé tant qu'une destination officielle n'est pas établie.

### 3. EN COURS — monde vivant visible

La chronologie est réelle, mais la croissance visuelle individuelle demande encore des couches séparées.

À fermer :

- décor ;
- loup ;
- dragon ;
- héros occasionnel ;
- lumière/ambiance ;
- éléments de vie secondaires.

Ne pas régénérer de nouvelles photos pour changer de direction : le design visuel approuvé reste la référence.

### 4. EN COURS — finition Premium HD page par page

Reprendre les 17 pages publiques actuelles et fermer, page par page :

- hiérarchie visuelle ;
- cohérence des composants ;
- états hover/focus/active/disabled/loading/empty/error/unavailable ;
- responsive mobile/tablette/desktop/grand écran ;
- densité, rythme vertical et typographie ;
- contrastes et focus ;
- navigation clavier ;
- motion sobre et reduced motion ;
- absence de coupure/overflow ;
- cohérence des surfaces et cartes.

Aucune page n'hérite automatiquement d'une preuve d'une autre page.

### 5. EN COURS — fonctionnalités locales réellement disponibles

Fermer les comportements locaux existants :

- catalogue ;
- recherche ;
- favoris/collections ;
- Creator Studio ;
- import/export JSON ;
- vérification SHA-256 ;
- Smart Profile ;
- pages projet ;
- statuts publics.

Les erreurs doivent suivre : **erreur exacte → isolation → correction ciblée → micro-preuve**.

### 6. BLOQUÉ / dépendances externes réelles

Ces capacités ne doivent jamais être simulées pour atteindre artificiellement 100 % :

- comptes/authentification réels — backend d'identité requis ;
- publication/modération distante — backend sécurisé requis ;
- Storage Resolver — service de stockage réel requis ;
- Repair Network — protocole public final requis ;
- backend communautaire — solution sécurisée compatible avec budget 0 € requise ;
- distribution réelle — artefacts, provenance, empreintes et signatures requises ;
- OS Bridge — interface publique Nova Forge OS stabilisée requise ;
- hubs éditoriaux nécessitant contenus/droits non récupérés — sources et droits requis.

Leur état reste suivi jusqu'à livraison réelle ou décision produit écrite.

## Preuves finales encore requises

Avant une déclaration **VF 100 %** :

- navigateur HTTPS réel sur le HEAD candidat ;
- PWA install/update/offline/online réelle ;
- cache froid/chaud ;
- responsive visuel ciblé ;
- 400 % natif réel ;
- lecteur d'écran natif ;
- appareils physiques ;
- CWV représentatifs ;
- contrôle final des empreintes/provenance ;
- anti-oubli complet ;
- validation qu'aucune capacité bloquée n'est présentée comme disponible.

## Budget du lot « même équipe »

Base avant ce lot : noyau **111076 octets**.

Ajouts au noyau :

- `assets/shell.js` : +502 octets ;
- `assets/modaryx-foundations.css` : +244 octets.

Nouveau noyau dérivé : **111822 octets**.

Marge sous le garde-fou 800000 : **688178 octets**.

La section statique ajoutée à `ecosystem.html` n'est pas ajoutée à l'install-précache global ; elle suit la stratégie page/runtime.

## Micro-preuve ciblée du lot

- syntaxe `assets/shell.js` : PASS CIBLÉ ;
- relation « même équipe / produits distincts » présente dans le shell : PASS CIBLÉ ;
- section statique Écosystème : PASS CIBLÉ ;
- style de signature commun : PASS CIBLÉ ;
- empreintes `shell.js`, `modaryx-foundations.css`, `ecosystem.html` réconciliées : PASS CIBLÉ ;
- couverture partagée connue : 17/17 pages chargeaient déjà `shell.js`, `modaryx-foundations.css` et un footer sur la base ; ce lot ne retire aucun de ces imports.

Cette micro-preuve n'est pas une validation visuelle navigateur.

## Ordre de continuation automatique

1. intégrer le lot « même équipe » si Git reste aligné ;
2. vérifier les statuts/preview du HEAD intégré ;
3. fermer les contrôles ciblés de l'accueil + monde vivant ;
4. poursuivre la revue page par page ;
5. fermer les fonctions locales ;
6. fermer les preuves externes dès qu'un environnement adapté est disponible ;
7. ne déclarer 100 % / VF qu'après fermeture réelle des gates correspondants.
