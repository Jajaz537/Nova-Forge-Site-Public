# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-2304

**Date de référence : 2026-10-06 — après merge canonique du polish à 23:03 Europe/Paris**  
**Statut global : EN COURS — candidat MODARYX V2 Premium HD très avancé ; VF stricte toujours BLOQUÉE par 19 dépendances réelles**

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**
- **MODARYX / MODARYX MODS = plateforme web**
- getnovaforge/getnova = ancien projet web abandonné
- lane active : **site MODARYX uniquement**

## 2. Source Git fraîche

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche canonique : `design/modaryx-v2-blue-violet-product-20261005`
- HEAD canonique : `39c98861dfbfcc4dfee3f266e5f500a7b7a934d1`
- commit : `Merge MODARYX V2 premium readability depth polish`
- PR polish : **#219 MERGED**
- `main` : non modifié
- DNS / DNSSEC / nameservers / Cloudflare critique : non modifiés
- cutover : non exécuté

## 3. Canon visuel actuel

Direction humaine conservée :
- produit sombre **bleu nuit / quasi-noir** ;
- violet premium retenu ;
- cyan réservé aux CTA / états actifs ;
- surfaces relevées légèrement pour une meilleure lisibilité ;
- meilleure séparation cartes / lignes / rail profils ;
- pas de retour au hero narratif voyageur/loup/dragon comme cible VF ;
- pas de néon généralisé.

Le polish est implémenté comme couche finale réversible :
- `v2-preview/src/readability-polish.css`
- `v2/src/readability-polish.css`

## 4. Preuves ciblées post-polish

Candidat prouvé : `db8ebf50ba4ff593fd73b27e72075b4f8088686a`

Relation au canon :
- le canon `39c98861...` est **+1 commit** par rapport au candidat prouvé ;
- comparaison Git : **0 fichier différent** ;
- le merge canonique est donc tree-equivalent au candidat prouvé.

Runs ciblés :
- Preview Root Proof : run `37530691966` — **SUCCESS**
  - build ;
  - browser accessibility/touch ;
  - product flows ;
  - matrice multi-écrans ;
  - upload preuve.
- Production Candidate Root Proof : run `37530691998` — **SUCCESS**
  - build V2 ;
  - accessibilité navigateur ;
  - flows ;
  - **143 écrans** ;
  - migration navigateur + rollback/offline.
- Performance Candidate Proof : run `37530691986` — **SUCCESS**
- VF Readiness Gate : run `37530691854` — **SUCCESS**, sans fermeture artificielle de blocker.

Les workflows associés au candidat de polish observés avant merge étaient **37/37 SUCCESS**.

## 5. Cloudflare Pages

Déploiement de branche observé sur le HEAD canonique :
- source : `39c98861dfbfcc4dfee3f266e5f500a7b7a934d1`
- état : **SUCCESS**
- preview : `https://89b95085.nova-forge-site-public.pages.dev`

Important :
- ce succès de déploiement ne vaut **pas** cutover ;
- la racine Pages historique ne doit pas être confondue avec la cible visuelle V2 ;
- aucune promotion publique/indexabilité n'est revendiquée.

## 6. Catalogue / droits

`data/catalog.json` reste explicitement :
- `dataClass = demonstration`
- `distributionPolicy = metadata-preview-only`
- contenus Skyrim SE / Cyberpunk 2077 / Minecraft = previews verrouillées, non téléchargeables.

Les sources officielles de contact/politique déjà archivées restent des preuves candidates de démonstration uniquement.

## 7. Gate VF strict

**19 blockers OPEN — inchangé**

### Validations externes réelles — 5
- `nvda-real`
- `voiceover-real`
- `talkback-real`
- `safari-real`
- `physical-devices`

### Production web — 8
- `backend-real`
- `auth-passkeys-real`
- `real-data-history`
- `providers-connectors-real`
- `notifications-email-push-real`
- `pwa-service-worker-production`
- `core-web-vitals-production`
- `cutover`

### Droits / légal — 6
- `game-rights-registry-production`
- `official-contact-discovery`
- `publisher-outbound`
- `publisher-response-parsing`
- `license-validation`
- `legal-review-where-required`

## 8. Limites obligatoires

Aucun blocker réel ne peut être fermé par équivalence automatisée.

Toujours interdits sans preuve / approbation adaptée :
- apply D1 remote ;
- création ou binding R2 ;
- activation provider ;
- email/push réel ;
- activation PWA production ;
- collecte CWV terrain production ;
- indexabilité / cutover ;
- droits éditeur, licence ou validation juridique simulés.

## 9. Ordre de continuation

1. conserver les preuves réelles appareils prêtes ;
2. maintenir les probes production read-only alignés ;
3. D1 DEV remote uniquement après cible exacte + backup/export + **approbation explicite** ;
4. R2/providers/auth réel uniquement après approbation explicite ;
5. droits : preuves réelles + outbound/inbound réels ;
6. CWV terrain après vraie production et trafic ;
7. cutover en dernier.

**Ce checkpoint devient la source de reprise MODARYX V2 la plus récente après le polish Premium HD.**
