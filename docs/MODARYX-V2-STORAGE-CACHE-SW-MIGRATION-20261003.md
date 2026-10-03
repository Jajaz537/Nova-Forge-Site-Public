# MODARYX V2 — Critères de migration localStorage, cache et Service Worker

**Date : 2026-10-03**
**Statut : conception technique — aucune migration exécutée**

## 1. Objectif

Empêcher l'ancien site de contaminer V2 tout en conservant les données utiles de l'utilisateur lorsque leur format est compris et valide.

## 2. localStorage — inventaire connu

Clés historiques observées :

- `nova-forge:catalog:favorites:v1`
- `nova-forge:catalog:saved-views:v1`
- `nova-forge:creator:draft:v1`
- `nova-forge:creator:draft:v2`
- `nova-forge:community:collection:v1`
- `nova-forge:community:submission:v1`
- `nova_site_shell_preferences_v1`

## 3. Nouvelle politique de namespace

Nouvelles clés V2 proposées :

- `modaryx:v2:favorites`
- `modaryx:v2:saved-searches`
- `modaryx:v2:creator-draft`
- `modaryx:v2:collection-drafts`
- `modaryx:v2:community-draft`
- `modaryx:v2:preferences`

Aucune nouvelle clé web V2 ne doit utiliser `nova-forge:`.

## 4. Règles de migration localStorage

Pour chaque clé :

1. détecter l'ancien format ;
2. parser dans un bloc fail-safe ;
3. valider strictement ;
4. convertir vers le modèle V2 ;
5. écrire la nouvelle clé ;
6. enregistrer un marker de migration ;
7. conserver l'ancienne clé jusqu'à preuve d'une migration correcte ;
8. ne jamais supprimer l'ancien contenu lors du même événement que la première migration.

## 5. Favoris

### Ancien

Liste d'IDs de contenu.

### V2

Peut rester simple si les IDs restent stables.

Si un ID n'existe plus :
- ne pas l'afficher comme contenu actif ;
- conserver une trace locale optionnelle pour diagnostic ;
- ne pas remapper vers un autre contenu sans preuve.

## 6. Saved views → Saved searches

L'ancien objet mémorise :
- q
- kind
- game
- evidence
- sort
- favoritesOnly

V2 doit convertir uniquement les filtres qui ont un équivalent clair.

Exemple :
- `kind=pack` ne doit pas devenir automatiquement `modpack` si la sémantique est ambiguë.

Les filtres non mappables sont abandonnés avec état explicite de migration partielle.

## 7. Creator draft

L'ancien Draft V2 contient un Universal Mod Manifest v1 verrouillé.

Migration V2 :
- valider UMM v1 ;
- mapper vers ContentItem + Release draft ;
- conserver rights/provenance/files ;
- convertir relations ;
- maintenir distribution locked ;
- ne jamais créer de publication ou release receipt.

## 8. Collection

Ancienne collection :
- local-only ;
- private-local ;
- itemIds.

Migration :
- Collection V2 privée ;
- items = contentId ;
- aucune release pin inventée ;
- aucun modpack créé automatiquement.

## 9. Community submission

Ancien brouillon :
- discussion/review/comment ;
- local-only ;
- local-draft ;
- not-submitted.

Migration :
- conserver brouillon local ;
- ne jamais envoyer automatiquement ;
- ne jamais rattacher un auteur distant sans session réelle.

## 10. Preferences

Les préférences shell historiques doivent être inspectées champ par champ.

Ne pas migrer :
- classes visuelles ;
- anciennes préférences de layout ;
- choix de theme spécifiques à l'ancien design

sauf si un équivalent V2 est explicitement défini.

Préférences potentiellement migrables :
- reduced motion ;
- choix d'ambiance si encore pertinent.

## 11. Service Worker actuel

Le SW legacy précache des routes/assets anciens.

### Risque

Un navigateur déjà visité peut :
- servir ancien CSS ;
- servir ancien JS ;
- servir anciennes pages ;
- continuer à répondre hors ligne après le nouveau déploiement.

## 12. Migration SW V2

Étapes futures :

1. publier V2 preview sans prendre le contrôle production ;
2. créer un nouveau cache name distinct ;
3. vérifier installation fraîche ;
4. vérifier upgrade depuis SW legacy ;
5. à `activate`, supprimer uniquement les caches explicitement listés comme legacy ;
6. conserver les caches inconnus si leur propriété n'est pas prouvée ;
7. `clients.claim()` uniquement si la stratégie de cutover est validée ;
8. tester reload, offline, navigation et rollback.

## 13. Cache Storage

### Interdiction

Pas de suppression :
- `caches.keys().forEach(delete)`

sans allowlist/denylist précise.

### V2

Chaque cache doit avoir :
- nom ;
- version ;
- owner ;
- contenu attendu ;
- politique de purge.

## 14. HTTP / CDN cache

Au cutover futur :

- assets fingerprintés ;
- HTML avec politique adaptée ;
- Service Worker versionné ;
- manifest versionné ;
- aucune modification Cloudflare critique sans instruction explicite.

Le cache CDN ne doit pas être “réparé” par purge globale sans diagnostic.

## 15. Manifest PWA

L'ancien manifest royaume-first ne doit pas être servi comme manifeste V2.

Le futur manifest V2 doit avoir :
- nom MODARYX ;
- description produit ;
- icons approuvées ;
- start_url V2 ;
- scope correct ;
- shortcuts utiles uniquement si implémentés.

## 16. Rollback

Avant migration réelle :

- snapshot des clés concernées ;
- mapping documenté ;
- rollback du code ;
- ancien SW disponible ;
- ancienne route disponible.

Une migration de données utilisateur doit être monotone et non destructive au premier passage.

## 17. Tests obligatoires

### Navigateur neuf

- aucun ancien cache ;
- aucune ancienne préférence.

### Navigateur legacy

- ancien SW actif ;
- anciens caches ;
- anciennes clés localStorage.

### Offline

- V2 affiche ce qui est réellement disponible ;
- téléchargement/distribution reste fail-closed si stale.

### Upgrade interrompu

- migration localStorage à moitié ;
- activation SW interrompue ;
- reload pendant migration.

Le résultat doit rester récupérable.

## 18. Definition of Done

La migration n'est validée que si :

- anciennes clés reconnues ou laissées intactes ;
- nouvelles clés correctes ;
- aucun faux succès de migration ;
- ancien SW ne sert plus de CSS/JS V1 sur V2 ;
- offline reste cohérent ;
- rollback démontré ;
- aucune donnée utilisateur perdue pendant les micro-tests.

**État : TERMINÉ pour le contrat / NON IMPLÉMENTÉ volontairement.**
