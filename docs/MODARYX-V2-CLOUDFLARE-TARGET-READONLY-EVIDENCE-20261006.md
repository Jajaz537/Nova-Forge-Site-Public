# MODARYX V2 — Preuve Cloudflare target read-only — 2026-10-06

**État : TERMINÉ pour l'identité de cible read-only / production toujours OPEN**

## Preuve fraîche

- branche source : `chatgpt/modaryx-v2-cloudflare-target-readonly-20261006`
- SHA : `7faf34254151c21792363e350e22f63087d34cc7`
- workflow : `MODARYX V2 Cloudflare Target Read-Only Proof`
- run : `37477638283`
- job : `112317141636`
- méthodes Cloudflare : **GET uniquement**
- mutation distante : **aucune**

## Pages / bindings réellement observés

- projet Pages : `nova-forge-site-public`
- branche de production Pages déclarée : `main`
- D1 production : **aucun binding**
- D1 preview : binding `MODARYX_DB` présent
- identité cible D1 : liée au binding Pages exact ; SHA-256 de l'identifiant = `6b7632ab913b02ba55b35a024401d432749116ff4f82adf76dd275f8be244eba`
- R2 production : **aucun binding**
- R2 preview : **aucun binding**

Le GET direct du metadata D1 retourne HTTP 401 avec le token actuel. Cette permission insuffisante est enregistrée comme telle et **n'est pas transformée en preuve metadata D1**.

## Conséquence

Cette preuve ferme seulement une partie du préflight : la cible D1 preview actuellement liée au projet Pages est identifiée de façon read-only.

Elle **ne ferme pas** :
- `backend-real` ;
- `real-data-history` ;
- `providers-connectors-real` ;
- aucun blocker VF.

Avant toute application remote DEV, il reste notamment :
- sauvegarde/export pré-apply ;
- autorisation explicite ;
- permission D1 appropriée ;
- application DEV contrôlée ;
- preuves post-apply ;
- voie de restauration.

Aucun DNS, DNSSEC, nameserver, binding, migration remote, bucket R2 ou cutover n'a été modifié.
