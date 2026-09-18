# MODARYX — plan de durcissement CI/CD protégé — 18 septembre 2026

Statut : **APPLIQUÉ SUR `main` — PR #13 / `7cc2368e7c72d775bd6d4a9fc64da0dd641b96fd`**.

Ce document ferme l’analyse des trois constats CI/CD classés MOYENNE sans modifier les workflows protégés, `main`, Cloudflare, DNS, SSL, IONOS ou la production.

## Périmètre

Workflows concernés :

- `.github/workflows/cloudflare-modaryx-cutover.yml`
- `.github/workflows/cloudflare-modaryx-http3-off.yml`
- `.github/workflows/cloudflare-modaryx-probe.yml`

Le harnais `qa/check-cache.mjs` considère tous les workflows GitHub comme protégés par comparaison au baseline externe. Toute modification doit donc faire l’objet d’un lot dédié, avec stratégie explicite et micro-preuve.

## Constat 1 — action tierce référencée par tag mutable

Dans `cloudflare-modaryx-cutover.yml` :

```yaml
uses: actions/checkout@v4
```

Le tag officiel `actions/checkout@v4` résout, au contrôle du 18 septembre 2026, vers :

```
11d5960a326750d5838078e36cf38b85af677262
```

Source de résolution : GitHub API officielle du dépôt `actions/checkout`, ref `refs/tags/v4`.

### Correction proposée

Remplacer uniquement :

```yaml
uses: actions/checkout@v4
```

par :

```yaml
uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
```

### Effet attendu

- réduction du risque supply-chain lié au déplacement ultérieur du tag ;
- comportement fonctionnel identique au commit actuellement ciblé par `v4` ;
- aucun changement de permission GitHub ou Cloudflare.

### Micro-preuve requise

Après modification dédiée :

1. vérifier que le SHA correspond toujours au commit officiel attendu ;
2. exécuter uniquement le chemin non mutatif `status` du workflow cutover ;
3. confirmer checkout, préflight et lecture d’état ;
4. ne déclencher aucun mode `attach-pages`, `repair-apex-pages` ou `enable-dnssec`.

Rollback : revenir à la ligne précédente si le checkout épinglé ne fonctionne pas. Aucun rollback Cloudflare ne doit être nécessaire puisque la micro-preuve doit rester en mode `status`.

## Constat 2 — cutover mutatif déclenchable sur push

Le workflow `cloudflare-modaryx-cutover.yml` accepte aujourd’hui deux familles de déclencheurs :

- `workflow_dispatch` avec choix explicite du mode ;
- `push` sur `main` lorsque `.github/cloudflare-control.json` change.

Le chemin `push` lit `.github/cloudflare-control.json` et autorise les modes :

- `status`
- `attach-pages`
- `repair-apex-pages`
- `enable-dnssec`

Trois de ces modes peuvent modifier l’infrastructure Cloudflare.

### Correction proposée

Pour le workflow mutatif, conserver **uniquement** `workflow_dispatch`.

Supprimer le déclencheur `push` et la branche de résolution automatique du mode depuis `.github/cloudflare-control.json`.

Le mode doit provenir uniquement de :

```yaml
inputs.mode
```

### Garde recommandée

- conserver `permissions: contents: read` ;
- conserver `persist-credentials: false` ;
- conserver la vérification du token et de la zone avant action ;
- conserver la liste fermée des modes autorisés ;
- idéalement associer les modes mutatifs à un GitHub Environment protégé avec approbation humaine si cette fonction est réellement configurée et disponible. Ne pas inventer cette protection si elle n’existe pas.

### Micro-preuve requise

1. YAML valide ;
2. le workflow ne contient plus de déclencheur `push` ;
3. dispatch manuel `status` uniquement ;
4. vérifier que `status` ne modifie rien ;
5. ne lancer aucun mode mutatif pendant la validation du durcissement.

Rollback : restaurer le workflow précédent si le dispatch manuel `status` n’est plus exécutable.

## Constat 3 — désactivation HTTP/3 mutative sur push

`cloudflare-modaryx-http3-off.yml` est déclenché par :

```yaml
on:
  push:
    branches: [main]
    paths:
      - '.github/cloudflare-http3-off.json'
```

Le job exécute ensuite un `PATCH` Cloudflare sur le réglage `http3`.

### Correction proposée

Le workflow ne doit pas muter Cloudflare suite à un simple push.

Deux options sûres, par ordre de préférence :

1. **désactiver le workflow mutatif historique** si HTTP/3 n’a plus de raison produit actuelle d’être forcé à `off` ;
2. si ce mécanisme doit être conservé, remplacer le `push` par `workflow_dispatch` explicite et ajouter un choix/confirmation clair de l’action.

Aucune de ces options ne doit être appliquée tant que l’intention produit/infrastructure actuelle sur HTTP/3 n’est pas confirmée.

### Micro-preuve requise

- vérifier que le workflow ne peut plus se déclencher automatiquement sur un commit `main` ;
- si conservé, exécuter d’abord un mode lecture/statut avant tout PATCH ;
- tout changement HTTP/3 réel exige une autorisation infrastructure séparée.

## Workflow diagnostic probe

`cloudflare-modaryx-probe.yml` est déclenché sur push ciblé mais les opérations inspectées sont de lecture/diagnostic : zone, Pages, DNS, CAA, résolution et HEAD HTTPS.

Le risque principal est opérationnel/quota/bruit, pas une mutation directe Cloudflare.

Décision proposée : **ne pas modifier dans le même lot** que les deux workflows mutatifs. Toute optimisation du probe doit être séparée afin de limiter la portée du changement.

## Séquence d’application future

Lorsqu’une autorisation explicite de modifier les workflows protégés est donnée :

1. vérifier branche + HEAD ;
2. isoler un worktree/branche dédiée ;
3. épingler `actions/checkout` ;
4. retirer le push mutatif du cutover ;
5. décider séparément du sort de `http3-off` ;
6. ne toucher à aucun secret ni configuration Cloudflare ;
7. micro-valider uniquement les chemins non mutatifs ;
8. réviser le diff exact ;
9. seulement ensuite proposer intégration dans PR #12 ou lot séparé.

## Conditions de PASS du durcissement

Ne pas déclarer CI/CD durci tant que :

- les workflows protégés n’ont pas effectivement reçu le correctif ;
- le nouveau YAML n’a pas été validé ;
- le chemin non mutatif n’a pas été exécuté avec succès ;
- aucun déclenchement mutatif automatique sur `push` ne subsiste pour les workflows concernés ;
- aucune modification Cloudflare non autorisée n’a été provoquée pendant la validation.

## État

- analyse des trois constats : **TERMINÉE** ;
- plan de correction : **TERMINÉ** ;
- application du correctif aux workflows protégés : **TERMINÉE** via PR #13 ;
- preuve après modification : **TERMINÉE** sur le périmètre statique/non mutatif ;
- exécution Cloudflare mutative pendant la validation : **NON**.
