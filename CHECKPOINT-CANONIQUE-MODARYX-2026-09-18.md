# CHECKPOINT CANONIQUE — MODARYX — 18 septembre 2026

Ce document remplace les états Git plus anciens pour la reprise du chantier web MODARYX. Il ne constitue ni une promotion production ni une déclaration de VF.

## Git

- Dépôt : `Jajaz537/Nova-Forge-Site-Public`
- Branche distante de la PR #12 : `design/modaryx-premium-hd-20260914-work`
- HEAD distant avant mise à jour documentaire de ce checkpoint : `18ee360ef371d1ee30a1699f51d7b25c473ac41a`
- Worktree isolé : branche locale `security/modaryx-vf-gate-20260918`
- HEAD local avant le commit de ce checkpoint : `082f503`
- Authentification : le push Git HTTPS direct reste indisponible, mais le connecteur GitHub Work authentifié a publié la chaîne en fast-forward, sans force-push.
- Intégrité : le tree distant du candidat `0e3acc1` correspond exactement au tree local attendu `a5599e7d66f61e8dccaf029ed7acde37fd6a409c`.
- Le worktree historique `modaryx-finishline` est divergent et sale ; il n’a pas été modifié.

Commits d’origine conservés sémantiquement dans la chaîne distante :

1. `3144468` — `Add MODARYX static security gate`
2. `12a954f` — `Reconcile MODARYX PWA product identity`
3. `e0d8040` — `Restore the MODARYX local preview server`
4. `bbcc9b3` — `Record the current MODARYX branch preview audit`
5. `105e2e1` — `Map the MODARYX static security gate to ASVS`
6. `082f503` — `Ignore generated Python bytecode`
7. `39a3bd1` — `Checkpoint the MODARYX VF security lane`

L’API GitHub a initialement omis trois fichiers du deuxième commit. Un commit fast-forward correctif, `0e3acc1`, a rétabli les fichiers manquants ; le contrôle de tree final est PASS. Le commit documentaire `18ee360` ajoute uniquement `qa/post-deploy-proof-20260918.json`.

## TERMINÉ avec preuve locale

- Gate source sécurité statique : 17 pages avec CSP stricte, aucun handler/script/style inline, zéro sink DOM dangereux après retrait de `innerHTML` du menu.
- Matrice de couverture ASVS adaptée à la surface statique : `qa/SECURITY-ASVS-COVERAGE.md`.
- Séparation produit dans le manifeste PWA : MODARYX web, aucune recréation de « Modaryx OS ».
- `npm run dev` réparé par `preview.mjs` ; 4 contrôles ciblés couvrent `/`, route propre, asset JS et 404.
- Suite source : **32/32 scripts PASS**, lint PASS, build PASS, 17 pages, 13 scripts et 84 empreintes valides.
- Preview de branche inspecté dans Chromium : 17/17 routes avec un `h1`, un `main`, un footer, aucune image cassée, aucun lien vide anonyme et aucun débordement horizontal au viewport contrôlé.
- Premiers écrans inspectés : accueil Loup/Dragon, Catalogue, Creator Studio, Communauté, Écosystème et Sécurité. Direction graphite/or/bleu cohérente observée.
- Preuve structurée : `qa/preview-visual-structure-20260918.json`.
- Déploiement fonctionnel prouvé : commit `0e3acc1`, URL immuable `https://747e35ca.nova-forge-site-public.pages.dev`.
- Micro-preuves post-déploiement : menu partagé/source identique, identité PWA PASS, serveur local 4/4, structure 17/17, gate sécurité PASS, 35 assertions PWA source PASS.
- Preuve post-déploiement : `qa/post-deploy-proof-20260918.json`.

## EN COURS

- Candidat VF de la PR #12 : branche distante mise à jour et déploiements Pages réussis ; la PR reste brouillon et n’est pas fusionnée.
- Réconciliation finale des preuves : la source statique et le déploiement affecté sont consolidés, mais les validations natives externes restent ouvertes.
- Durcissement CI/CD : trois constats MOYENNE documentés (`actions/checkout@v4`, cutover mutatif possible sur push, workflow HTTP/3-off sur push). Les workflows sont protégés par le harnais et n’ont pas été modifiés sans stratégie dédiée.

## BLOQUÉ

- Paramètres du compte Cloudflare : vérification humaine du navigateur Work.
- Infrastructure gelée : aucun changement SSL global, DNS, DNSSEC, nameserver, IONOS, email ou Cloudflare critique.

## PREUVE MANQUANTE

- Lecteur d’écran natif, zoom natif 200/400 %, Firefox/Safari réels, appareils physiques.
- Cycle PWA réellement hors ligne et mise à jour après nouvelle publication.
- Core Web Vitals représentatifs ; Navigation Timing n’est pas utilisé comme substitut.
- Import/export avec sélecteur et fichier reçus sur un système utilisateur réel.
- Historique Git complet des secrets, paramètres Cloudflare privés, certificat d’origine Full (strict).
- Master Nova Design Intelligence complète de 46+ entrées : NON RÉCUPÉRÉE.

## Environnements

- Preview Loup/Dragon observé : `https://design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev/`
- Preview immuable fonctionnel `0e3acc1` : `https://747e35ca.nova-forge-site-public.pages.dev`
- Preview immuable de la preuve documentaire `18ee360` : `https://bd807b62.nova-forge-site-public.pages.dev`
- Production : `https://modaryxmods.com/` ; elle affiche encore une présentation antérieure et n’est pas déclarée alignée sur le candidat.
- Aucune promotion, fusion de `main` ou modification d’infrastructure effectuée.

## Prochain point exact

Fermer uniquement les preuves externes lorsqu’un environnement adapté devient réellement disponible : lecteur d’écran natif, zoom 200/400 %, Firefox/Safari, appareils physiques, cycle PWA offline/update et mesures LCP/CLS/INP représentatives. Ne pas relancer les preuves autonomes déjà vertes et ne pas substituer une simulation à ces validations.

Protocole compact exécutable : `qa/FINAL-MANUAL-CHECKLIST.md`. Statut consolidé : **CANDIDAT VF — PREUVES EXTERNES RESTANTES**. Cette mise à jour est strictement documentaire : aucun runtime, test déjà vert, déploiement de production ni paramètre d’infrastructure n’est modifié.


## Mise à jour canonique complémentaire — après micro-lot SEO

Preuve Git fraîche :

- HEAD candidat : `39903d56e8171303e861536be997e775cf2aece4`.
- Parent : `bcfce789cece940e07fcef1e5c3719ea27d6d262`.
- Micro-lot : canonical explicite de `/games/`, générateur synchronisé, manifeste PWA minifié sans changement sémantique, empreintes publiques mises à jour.
- Diff ciblé : 4 fichiers uniquement (`games/index.html`, `qa/build-games-index.py`, `site.webmanifest`, `SHA256SUMS.txt`).
- Fichiers d’infrastructure protégés `_headers`, `sitemap.xml`, `robots.txt` : inchangés.
- Calcul statique ciblé : précache brut estimé `798705 / 800000` après le lot, contre `799909 / 800000` avant. Cette valeur est un calcul déterministe sur les deux fichiers précachés modifiés ; elle ne remplace pas un nouveau replay global.
- Cloudflare Pages a confirmé un déploiement réussi de `39903d5` sur `https://b9712f72.nova-forge-site-public.pages.dev`.

### Réconciliation anti-oubli

Le statut **CANDIDAT VF — PREUVES EXTERNES RESTANTES** décrit la validation de la surface web actuellement livrée. Il ne transforme pas les capacités produit explicitement retenues mais absentes en simples tests externes.

Restent explicitement tracés comme **développement produit non livré / entrées manquantes** :

- hubs éditoriaux GTA 6 / RDR2 et catégories/corpus associés ;
- comptes et profils éditables réels ;
- publication/modération distante ;
- Storage Resolver / Repair Network ;
- distribution réelle avec artefacts autorisés, empreintes/provenance/signatures ;
- Guide connecté et pont optionnel Nova Forge OS ;
- Master Nova Design Intelligence complète non récupérée.

Aucune de ces capacités n’est déclarée réalisée par un schéma, un contrat ou un état UI « indisponible ». Une VF limitée à la surface publique actuelle exige encore les preuves externes listées plus haut. Une VF comprenant **toutes les idées historiquement retenues** exige en plus la livraison réelle de ces capacités ou une décision produit écrite de périmètre ; aucune réduction implicite n’est admise.

### Prochain point logique

1. Ne pas rejouer les audits déjà verts.
2. Fermer les preuves externes dès qu’un environnement réel les rend possibles.
3. Pour toute capacité produit retenue non livrée, n’ouvrir un lot de développement que lorsque ses données, droits, services ou décisions nécessaires existent réellement.
4. Conserver PR #12 en brouillon ; aucune fusion `main`, production ou infrastructure critique sans décision séparée.


## Mise à jour canonique — corpus hubs et limites externes

Preuve Git fraîche avant cette mise à jour documentaire :

- HEAD de branche vérifié : `85ebbbd9685cdaf3366448f25d16ab9106a10285`.
- PR #12 : ouverte, brouillon, fusionnable, non fusionnée.
- Preview immuable confirmée par Cloudflare Pages pour ce HEAD : `https://b1b14bc9.nova-forge-site-public.pages.dev`.
- Le lot précédent `39903d56e8171303e861536be997e775cf2aece4` reste le dernier changement de surface publique : canonical explicite de `/games/`, générateur synchronisé, manifeste PWA minifié sans changement sémantique, empreintes mises à jour.
- Le commit `85ebbbd9685cdaf3366448f25d16ab9106a10285` ajoute uniquement le corpus éditorial préparatoire `qa/GAME-HUBS-EDITORIAL-RESEARCH-20260918.md`.
- Aucun hub GTA VI/RDR2 n’est publié par ce lot, aucun asset tiers n’est ajouté et aucune compatibilité/mod disponible n’est inventée.

### État produit retenu

- Surface publique actuelle : **CANDIDAT VF — PREUVES EXTERNES RESTANTES**.
- Hubs GTA VI/RDR2 : corpus factuel initial préparé à partir de sources officielles ; droits médias, décision de catégories/profondeur éditoriale et catalogue réel restent **PREUVE MANQUANTE**.
- Comptes/profils réels, publication/modération distante, Storage Resolver / Repair Network, distribution réelle et Guide/pont OS restent **développement produit non livré** faute de services, données, droits ou décisions nécessaires.
- Master Nova Design Intelligence complète : **NON RÉCUPÉRÉE / PREUVE MANQUANTE**.
- Vie privée locale : documentée sur la surface actuelle.
- Identité d’éditeur, contact public, contact sécurité, mentions légales et `security.txt` : **PREUVE MANQUANTE** ; ne rien inventer.
- Historique Git complet des secrets : **PREUVE MANQUANTE** dans l’environnement actuel.
- SEO : canonical `/games/` fermé ; présence de `/games/` dans `sitemap.xml` reste tracée mais le fichier est protégé par le harnais et n’a pas été modifié sans stratégie dédiée.

### Preuves externes toujours requises

- lecteur d’écran natif ;
- zoom/reflow natif 200 % et 400 % ;
- Firefox réel ;
- Safari réel ;
- appareils physiques ;
- cycle PWA offline/update réel ;
- Core Web Vitals représentatifs ;
- import/export avec vrais fichiers reçus.

Chromium/Playwright est présent dans l’environnement courant, mais l’accès réseau à la preview Cloudflare est bloqué par la politique d’exécution ; aucune preuve navigateur externe supplémentaire n’est donc revendiquée.

### Prochain point logique

Ne pas relancer les audits déjà verts. Continuer uniquement si une nouvelle capacité externe devient disponible, si une donnée produit réelle arrive, ou si un défaut précis est isolé. Conserver PR #12 en brouillon et ne pas toucher à `main`, production, DNS, DNSSEC, IONOS, SSL ou paramètres Cloudflare critiques sans décision séparée.


## Mise à jour canonique — provenance des assets

Preuve Git fraîche avant cette mise à jour documentaire :

- HEAD de branche vérifié : `5d002455e1e59784fec72d51890e04e7d6065923`.
- Le commit ajoute uniquement `qa/ASSET-RIGHTS-PROVENANCE-20260918.md`.
- Aucun runtime, page publique, asset binaire, `main`, production ou infrastructure critique n’est modifié.

Résultat de la revue :

- aucune dépendance npm runtime tierce déclarée ;
- aucun asset Linear/Raycast/Vercel/Framer/Stripe importé ;
- les deux WebP Loup/Dragon sont documentés comme générés via ImageGen à partir de références fournies par l’utilisateur ;
- aucun média Rockstar n’a été intégré au dépôt ;
- les anciens assets `nova-*` restent classés legacy / produit distinct Nova Forge ;
- aucun fichier de police local `.woff/.woff2/.ttf/.otf` détecté dans le périmètre assets inspecté.

Statuts :

- provenance technique des assets actuels : **TERMINÉE SUR LE PÉRIMÈTRE INSPECTÉ** ;
- validation juridique complète : **PREUVE MANQUANTE** ;
- droits formels du pack de références Loup/Dragon : **PREUVE MANQUANTE** si une preuve juridique est requise ;
- identité d’éditeur, contact public, contact sécurité et mentions légales : **PREUVE MANQUANTE**.


## Mise à jour canonique — plan CI/CD protégé

Preuve Git fraîche avant cette mise à jour documentaire :

- HEAD de branche vérifié : `99409ea6df23ee63f6786366d62fa5e3114c59ad`.
- Le commit ajoute uniquement `qa/CI-CD-HARDENING-PLAN-20260918.md`.
- Aucun workflow protégé, `main`, secret, paramètre Cloudflare, DNS, SSL, IONOS ou production n’est modifié.

Résultat du lot :

- le tag `actions/checkout@v4` résout actuellement vers le commit officiel `11d5960a326750d5838078e36cf38b85af677262` ;
- le plan propose de l’épingler sur ce SHA dans le workflow cutover ;
- le plan propose de supprimer les déclencheurs `push` des workflows mutatifs Cloudflare concernés ;
- le workflow probe est laissé hors de ce lot car sa surface est principalement diagnostique ;
- l’application réelle reste **BLOQUÉE / AUTORISATION EXPLICITE REQUISE**, car les workflows sont une zone protégée et peuvent toucher l’infrastructure.

Statuts :

- analyse CI/CD : **TERMINÉE** ;
- plan de durcissement : **TERMINÉ** ;
- application : **BLOQUÉE** ;
- micro-preuve post-application : **PREUVE MANQUANTE**.

## Mise à jour canonique — checklist finale élargie

La checklist `qa/FINAL-MANUAL-CHECKLIST.md` inclut désormais, en plus des preuves appareil/navigateur, les garde-fous de sortie suivants :

- provenance et limites juridiques des assets ;
- identité/contact/mentions légales et `security.txt` ;
- historique Git complet des secrets ;
- application du plan CI/CD protégé ;
- écart sitemap `/games/` ;
- décision explicite du périmètre VF ;
- capacités produit historiques non livrées et Master NDI non récupérée.

Cette mise à jour est documentaire. Elle ne transforme aucun manque en PASS et ne modifie aucun runtime, workflow protégé, `main`, production ou infrastructure critique.

## Mise à jour canonique — garde anti-reprise obsolète

Les documents historiques suivants portent désormais un bandeau explicite de priorité canonique :

- `MODARYX-VF-STATUS.md`
- `MODARYX-NEXT-BATCH.md`
- `VF-TECHNICALLY-MAXIMAL-CANDIDATE.md`

Leur historique et leurs preuves par SHA sont conservés, mais leurs anciennes valeurs de HEAD, métriques ou « prochain bloc » ne doivent plus être interprétées comme l’état opérationnel courant. Toute reprise doit partir du présent CHECKPOINT-CANONIQUE puis d’une vérification Git fraîche.

## Mise à jour canonique — canari Cloudflare Full (strict)

Preuve externe reçue le 18 septembre 2026 :

- Automatic SSL/TLS global observé : activé, mode exécuté **Full** ;
- aucun changement global effectué ;
- canari : `strict-test.modaryxmods.com` ;
- projet Pages : `nova-forge-site-public` ;
- hostname Pages : **Active — SSL enabled** ;
- règle ciblée : `Canary Pages – Full strict` ;
- expression : `(http.host eq "strict-test.modaryxmods.com")` ;
- action unique : `SSL = Strict` ;
- Cloudflare Trace : règle **Matched**, action `set_config`, résultat **200 OK** ;
- page MODARYX, CSS, JavaScript et images chargés ;
- aucune boucle de redirection ;
- aucune erreur 521, 522, 525 ou 526 observée ;
- `modaryxmods.com` principal reste fonctionnel et conserve le mode global **Full** ;
- aucun autre réglage DNS, DNSSEC, mail, IONOS ou Pages modifié.

Conclusion bornée :

**PASS CIBLÉ — Full (strict) compatible sur le canari**

Ce PASS ne vaut pas basculement global du domaine principal. Toute promotion de `modaryxmods.com` en Full (strict) exige une décision séparée.

Preuve : `qa/FULL-STRICT-CANARY-PROOF-20260918.md`.

## Mise à jour canonique — bascule globale Full (strict) bloquée

Tentative contrôlée de préparation au passage global après le PASS canari :

- hostnames proxifiés relevés :
  - `modaryxmods.com` → `nova-forge-site-public.pages.dev`
  - `strict-test.modaryxmods.com` → `nova-forge-site-public.pages.dev`
  - `_domainconnect.modaryxmods.com` → `_domainconnect.ionos.com`
- `_domainconnect.modaryxmods.com` utilise une origine IONOS distincte ;
- le certificat d’origine de ce hostname n’a pas été validé en Full (strict) ;
- le mode global est donc resté **Full** ;
- aucune bascule globale n’a été effectuée ;
- canari Full (strict) toujours fonctionnel ;
- DNS, DNSSEC, nameservers, IONOS et mail inchangés ;
- aucun rollback nécessaire.

Statut :
- bascule globale zone entière : **BLOQUÉE / PREUVE MANQUANTE** à cause de `_domainconnect.modaryxmods.com` ;
- solution sûre identifiée : conserver le global en Full et appliquer une **Configuration Rule SSL = Strict uniquement à `modaryxmods.com`**, ce qui évite d’embarquer `_domainconnect.modaryxmods.com`.

Ne pas généraliser ce blocage au hostname principal : le canari Pages a déjà démontré la compatibilité Full (strict) sur la même origine Cloudflare Pages.

## Mise à jour canonique — Full (strict) ciblé sur l'apex

Preuve externe reçue le 18 septembre 2026 après le blocage volontaire de la bascule globale :

- règle créée : oui ;
- expression exacte : `(http.host eq "modaryxmods.com")` ;
- Cloudflare Trace apex : **Matched** ;
- statut HTTP apex : **200 OK** ;
- aucune erreur 521, 522, 525 ou 526 ;
- `_domainconnect.modaryxmods.com` ne matche pas la règle ;
- mode SSL global conservé sur **Full** ;
- Automatic SSL/TLS reste actif ;
- DNS, DNSSEC, nameservers, IONOS et mail inchangés ;
- aucun rollback nécessaire.

Contrôles HTTPS verts :
- `/`
- `/catalog.html`
- `/security.html`
- CSS
- JavaScript
- image

Conclusion bornée :

**PASS — `modaryxmods.com` utilise Full (strict) via Configuration Rule ciblée.**

Le mode global reste volontairement **Full** afin de ne pas embarquer `_domainconnect.modaryxmods.com`, origine IONOS distincte.

### Observation séparée : `/games/`

Le contrôle externe de `/games/` retourne actuellement la page 404 MODARYX normale, sans erreur TLS.

Isolation Git fraîche :
- `games/index.html` existe sur la branche candidate ;
- `games/index.html` est absent du `main` actuel `026b401328487db9382be67be194c5454ef958e6`.

Ce 404 est donc séparé du PASS TLS et cohérent avec l'état de livraison actuel. Ne pas le traiter comme une régression Full (strict).

Preuve : `qa/FULL-STRICT-APEX-PROOF-20260918.md`.

## Mise à jour canonique — durcissement CI/CD appliqué

Autorisation explicite de durcissement sécurité reçue le 18 septembre 2026.

Lot sécurité séparé créé depuis `main`, PR #13 :
`Security: harden MODARYX Cloudflare workflows`.

La PR #13 a été fusionnée sur `main` au commit :
`7cc2368e7c72d775bd6d4a9fc64da0dd641b96fd`.

Changements effectifs :
- `actions/checkout` du workflow cutover épinglé au SHA officiel vérifié `11d5960a326750d5838078e36cf38b85af677262` ;
- suppression du déclenchement `push` automatique du workflow Cloudflare cutover mutatif ;
- workflow HTTP/3 converti en `workflow_dispatch` manuel avec `status` non mutatif par défaut et `disable` explicite ;
- diagnostic probe converti en `workflow_dispatch` manuel afin que le secret Cloudflare ne soit plus exercé automatiquement sur simple push ;
- `permissions: contents: read` conservé ;
- aucune mutation DNS, DNSSEC, SSL, Pages, IONOS, mail ou valeur de secret pendant ce lot.

Micro-preuve avant fusion :
- diff borné à 3 workflows ;
- aucun déclencheur `push` restant dans ces trois workflows ;
- pin SHA checkout officiel vérifié ;
- aucun workflow Cloudflare exécuté pendant la validation ;
- PR #13 fusionnable, sans review bloquante.

La branche candidate MODARYX reprend ces fichiers depuis le nouveau `main` par merge contrôlé, sans écraser le travail produit.

Statut :
- durcissement CI/CD protégé : **TERMINÉ** ;
- déclenchements mutatifs automatiques Cloudflare : **SUPPRIMÉS** ;
- action checkout mutable : **CORRIGÉE** ;
- secret Cloudflare sur probe automatique : **SUPPRIMÉ DU CHEMIN PUSH**.

