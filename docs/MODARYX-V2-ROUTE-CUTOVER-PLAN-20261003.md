# MODARYX V2 — Plan de migration des routes et cutover

**Date : 2026-10-03**
**Statut : TERMINÉ — conception uniquement, aucun cutover exécuté**

## 1. Objectif

Préparer la transition V1 → V2 sans :

- modifier `main` prématurément ;
- casser les URLs publiques ;
- réactiver getnovaforge ;
- mélanger le Service Worker V1 et le runtime V2 ;
- casser SEO, favoris ou liens externes ;
- exécuter une opération Cloudflare critique.

## 2. Principe

Le cutover se fait en quatre couches distinctes :

1. build V2 isolé ;
2. preview V2 immutable ;
3. mapping routes/redirects validé ;
4. promotion contrôlée.

Aucune couche n'autorise automatiquement la suivante.

## 3. Routes V1 à traiter

Familles historiques principales :

- /
- /catalog
- /search
- /community
- /creator-studio
- /profiles
- /project
- /project-*
- /downloads
- /security
- /verify
- /documentation
- /ecosystem
- /games/
- hubs GTA VI / RDR2

## 4. Routes V2 conceptuelles

Proposition issue de l'IA V2 :

- /
- /discover
- /games
- /games/:gameId
- /mods
- /search
- /content/:contentId
- /content/:contentId/versions
- /content/:contentId/requirements
- /collections
- /collections/:collectionId
- /modpacks/:modpackId
- /profiles/:profileId
- /creators/:handle
- /teams/:teamId
- /community
- /studio
- /library
- /account

Cette liste reste dépendante du tree testing humain.

## 5. Mapping historique

### /catalog

Candidat :
- redirect vers `/mods` ou `/discover` selon validation IA.

Aucune décision définitive avant test humain.

### /creator-studio

Candidat :
- `/studio`.

### /profiles

Attention :
- V1 mélange comptes/profils.
- V2 distingue `/account` et `/profiles/:profileId`.

Ne pas faire de redirect aveugle global.

### /project-*

Candidat :
- mapper chaque ID historique vers `/content/:contentId` si l'objet V2 existe réellement.
- sinon 410/archived/not-found explicite.

Ne jamais fabriquer un ContentItem pour préserver une ancienne URL.

### /games/

Candidat :
- `/games`.

### hubs jeu historiques

Mapper seulement si le Game Hub V2 correspondant existe et garde un contenu équivalent.

## 6. Redirect policy

Types :

- 301/308 : seulement si relation stable et prouvée ;
- 302/307 : phase temporaire/preview ;
- 404 : ressource inconnue ;
- 410 : ressource explicitement retirée/abandonnée.

Règle :
aucun redirect ne doit masquer une incompatibilité sémantique.

## 7. Canonicals SEO

Avant promotion V2 :

- un canonical par route indexable ;
- sitemap généré depuis routes V2 réelles ;
- aucune URL getnovaforge ;
- aucun canonical vers pages V1 supprimées ;
- noindex sur previews.

## 8. Service Worker

Le cutover de routes ne peut pas précéder la stratégie SW.

Ordre obligatoire :

1. identifier clients contrôlés par SW V1 ;
2. publier SW de transition ou désenregistrement contrôlé ;
3. vérifier navigateur neuf ;
4. vérifier navigateur V1 existant ;
5. vérifier offline ;
6. vérifier refresh post-upgrade ;
7. vérifier rollback.

## 9. Storage/localStorage

Ne jamais supprimer globalement.

Migration :

- lire ancien namespace seulement via migrator ;
- copier uniquement données mappables ;
- conserver backup/version ;
- écrire V2 sous `modaryx:v2:`;
- marquer migrations terminées ;
- laisser intact l'historique non reconnu.

## 10. Preview

Le preview V2 doit :

- être lié au SHA exact ;
- ne pas fallback vers ancienne PR ;
- ne pas utiliser domaine production comme preuve ;
- désactiver indexation ;
- ne pas partager un SW contaminant.

## 11. Cutover public

Préconditions minimales :

- wireframes core complets ;
- validation humaine IA ;
- high-fi validé humainement ;
- QA responsive/a11y/perf ;
- anti-contamination guard vert sur vrai root V2 ;
- browser upgrade V1→V2 prouvé ;
- SEO redirects vérifiés ;
- rollback testé ;
- preuves production requises disponibles.

## 12. Cloudflare / DNS

Aucune action DNS n'est requise pour concevoir les routes.

Interdits sans instruction explicite :

- DNS ;
- DNSSEC ;
- nameservers ;
- IONOS ;
- Cloudflare critical settings ;
- domaine Pages.

Les workflows mutateurs historiques restent hors exécution.

## 13. Rollback

Le rollback doit pouvoir :

- restaurer le build précédent ;
- restaurer les routes précédentes ;
- éviter corruption localStorage ;
- éviter boucle SW ;
- laisser les nouveaux objets V2 non destructifs.

## 14. Matrice avant cutover

| Gate | État actuel |
|---|---|
| Audit code | TERMINÉ |
| Guard anti-contamination | TERMINÉ / micro-proof guard |
| Root V2 réel | NON CRÉÉ |
| Wireframes core | EN COURS |
| Tree testing humain | PREUVE MANQUANTE |
| High-fi | BLOQUÉ |
| QA V2 runtime | NON EXÉCUTÉ |
| SW migration browser | NON EXÉCUTÉ |
| Route redirects | CONCEPTION |
| DNS/Cloudflare | INCHANGÉ |

## 15. Règle finale

Le premier changement de redirect public ne doit survenir qu'après preuve qu'une route V2 équivalente existe et fonctionne.

**État : TERMINÉ — conception, aucun changement public.**
