# MODARYX — ANTI-OUBLI COURANT CANONIQUE — 20 septembre 2026

**Base Git vérifiée avant rédaction :** `design/modaryx-premium-hd-20260914-work` @ `1b2ca020cf846cd3008cd3bbcc69f4ad18a076d9`.  
**Statut :** registre courant prioritaire pour la fermeture anti-oubli.  
**Portée :** MODARYX / MODARYX MODS uniquement. Nova Forge OS reste un produit distinct.  
**Règle :** ce document n'efface pas l'historique ; il supersède seulement les anciens états devenus obsolètes.

Aucune ligne ci-dessous ne constitue une déclaration de VF, de 100 %, de fusion vers `main` ou de validation humaine finale.

## 1. Séparation de produit et identité

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| MODARYX / MODARYX MODS = plateforme web | **TERMINÉ — contrat courant** | Identité web conservée ; aucune migration MODARYX → Nova Forge. |
| Nova Forge OS Public / Fondateur = logiciel distinct | **TERMINÉ — contrat courant** | Références web uniquement pour relation de produit ou intégration future explicite. |
| `getnovaforge.com` / getnova | **TERMINÉ — classification historique** | Ancien projet web ; références historiques conservées seulement quand nécessaires à la provenance, compatibilité ou protection technique. |
| Identité visuelle MODARYX visible sur les 23 routes | **TERMINÉ — périmètre source courant** | Le garde source rejette le libellé visible « Modaryx OS » ; la validation artistique globale reste séparée. |
| Design system Premium HD des 23 routes publiques | **EN COURS — preuve visuelle initiale acquise** | Sweep ciblé PR #79 : 23 routes × desktop/mobile, inspection assistée sans défaut bloquant isolé. Validation artistique humaine finale et preuves externes restent séparées. |

## 2. Monde vivant / Loup / Dragon

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| Environnement Premium HD séparé | **TERMINÉ** | Asset réel intégré. |
| Loup — bébé, juvénile, adolescent, jeune adulte, adulte | **TERMINÉ 5/5** | Cinq assets séparés prouvés. |
| Dragon — bébé, juvénile, adolescent, jeune adulte, adulte | **TERMINÉ 5/5** | Cinq assets séparés prouvés. |
| Activation de la croissance visuelle | **TERMINÉ — périmètre ciblé** | `visualGrowth.status=ready`, couche courante chargée à la demande, fallback conservé. |
| Preview HTTPS environnement + compagnons | **TERMINÉ — preuve ciblée déployée** | Run `35483330153`, desktop + mobile + reduced-motion. |
| Reduced motion monde vivant | **TERMINÉ — preuve ciblée déployée** | Animations/transitions neutralisées dans le cas réduit. |
| Saison + heure locale via contexte grossier | **TERMINÉ — preuve ciblée déployée** | Reality sync `cloudflare-coarse` observé avec saison/daypart. |
| Météo réelle production | **BLOQUÉ / décision externe — qualification fournisseur réalisée** | WeatherAPI = candidat privilégié non activé via proxy same-origin/secret serveur ; Open-Meteo Free = non commercial ; OpenWeather ouvert = attribution + ShareAlike. Activation toujours conditionnée à validation licence/confidentialité/attribution/disclaimer et preuve réelle. |
| Validation artistique humaine finale | **PREUVE MANQUANTE** | Les captures techniques ne remplacent pas le jugement humain final sur composition/cadrage. |

## 3. Capacités locales déjà prouvées

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| Recherche — résultats, vide, panne, retry | **TERMINÉ — preuve ciblée navigateur** | PR #64, run `35487557212`. |
| Téléchargements — panne + état verrouillé | **TERMINÉ — preuve ciblée navigateur** | PR #64 ; 0 artefact exposé, retry et focus prouvés. Aucun téléchargement réel livré. |
| PWA preview HTTPS — offline → online + donnée stale + health-check update | **TERMINÉ — preuve ciblée déployée** | PR #63, run `35487895759`, preview HTTPS réelle. |
| Profils — détection WebAuthn locale | **TERMINÉ — preuve ciblée navigateur** | PR #66, run `35488704409`. Ne vaut ni compte ni passkey inscrite. |
| Catalogue — zéro résultat, reset, panne, récupération, favori local | **TERMINÉ — preuve ciblée navigateur** | PR #67, run `35488828426`. |
| Communauté — catalogue indisponible puis récupéré | **TERMINÉ — preuve ciblée navigateur** | PR #67. Aucun backend communautaire simulé. |
| Creator Studio — schéma indisponible / fail-closed / récupération | **TERMINÉ — preuve ciblée navigateur** | PR #69, run `35489189427`. Publication distante toujours absente. |
| Project Hub — fallback puis récupération sans perte du favori | **TERMINÉ — preuve ciblée navigateur** | PR #71, run `35489515272`. |
| Accueil — panne/récupération données publiques | **TERMINÉ — preuve ciblée navigateur** | PR #72, run `35489918720`. Digest public volontairement absent reste fail-closed. |
| Smart Profile — état local indicatif | **TERMINÉ — périmètre local ciblé + contrat prouvé** | Rendu local déjà acquis ; run `35517826441`, marker `PASS_TARGETED_LOCAL_PLATFORM_CONTRACTS` verrouille browser-local, evidence measured/estimated/unknown et absence de garantie FPS/stabilité. |
| Contrats locaux collection / compatibilité / search adapter | **TERMINÉ — preuve ciblée** | run `35517826441`, marker `PASS_TARGETED_LOCAL_PLATFORM_CONTRACTS` : collection private-local par défaut, graphe actuel `demonstration` sans mesure attestée, search adapter externe optionnel/non requis, public-status local-first/fail-closed. |
| Vérificateur SHA-256 local | **TERMINÉ — périmètre local ciblé** | Calcul/comparaison locale ; une empreinte n'établit ni provenance, ni auteur, ni innocuité. |
| Imports/exports fichiers réels Chromium | **TERMINÉ — périmètre automatisé ciblé** | Matrice externe : run `35464233996`. Dialogue natif utilisateur/appareil reste distinct. |
| Accessibilité structurelle Chromium | **TERMINÉ — périmètre ciblé** | 23 pages, arbre AX/labels/skip-link ; run `35509547366`, marker `PASS_TARGETED_BROWSER_A11Y_MICROPROOF`. |
| Reflow Chromium 320/400/768/1440 | **TERMINÉ — périmètre ciblé** | 23 pages × 4 largeurs = 92 navigations ; run `35509547357`, marker `PASS_TARGETED_BROWSER_REFLOW_MICROPROOF`. |
| Performance laboratoire 5 pages × 2 profils | **TERMINÉ — périmètre ciblé** | Budgets labo respectés ; ce n'est pas du CWV terrain. |
| CodeQL PR #12 — constats historiques visibles | **TERMINÉ** | 11/11 threads historiques résolus ; run HEAD documenté `35484967852`. |

## 4. Catalogue, jeux, fiches et SEO

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| Catalogue multigaming local | **TERMINÉ — périmètre démonstration** | Trois créations de démonstration ; pas de catalogue de distribution réel. |
| Index `/games/` | **TERMINÉ — périmètre actuel** | Trois jeux de démonstration, canonical explicite, recette navigateur ciblée. |
| Fiches de créations | **TERMINÉ — périmètre local ciblé** | Fallback/récupération et navigation documentés ; galerie réelle, versions distribuées et compatibilité mesurée restent absentes. |
| SEO on-page des 23 routes | **TERMINÉ — preuve ciblée** | PR #82, run `35511580074`, marker `PASS_TARGETED_SEO_CONTRACT` : 22 pages indexables avec titres/descriptions/canonicals uniques et exacts ; 404 en `noindex,nofollow` sans canonical. |
| Sitemap des routes jeux/hubs | **EN COURS — garde explicite** | 7 URLs connues restent absentes : `/games/` + les six hubs GTA VI/RDR2. Le checker borne exactement ce gap ; ne pas modifier `sitemap.xml` sans lever explicitement sa garde. |
| Hubs GTA VI / RDR2, catégories et guides éditoriaux | **TERMINÉ — périmètre éditorial sourcé + readiness contractuelle** | Six routes livrées via PR #76 ; PR #81 classe `game-hubs.gta6-rdr2` en `contract-ready` et sépare `game-corpus.gta6-rdr2` en `blocked-inputs`. Aucun support PC/mod GTA VI supposé, aucun média Rockstar copié, aucun faux téléchargement. |

## 5. Capacités retenues non livrées

| Élément retenu | État courant | Condition de fermeture |
|---|---|---|
| Comptes / authentification / passkeys réels | **EN COURS — vérification Auth0 backend codée, tenant non connecté** | Contrat compte acquis + vérificateur JWT RS256/JWKS fail-closed ajouté dans la fondation DEV. Tenant, domaine/origine, callbacks, session, récupération et vraie cérémonie passkey restent à prouver. |
| Work Phase 2 — qualification externe | **TERMINÉ — preuve de préparation/limitation** | `qa/MODARYX-WORK-PHASE2-EXTERNAL-EVIDENCE-20260920.md` : HEAD distant canonique vérifié, zéro écriture/déploiement/compte ; points d'arrêt Safari/Auth0/Cloudflare/CWV/PWA documentés. |
| Profils publics éditables | **EN COURS — contrat profil public acquis, édition distante non connectée** | Schéma profil public prouvé par run `35517194516`, marker `PASS_TARGETED_ACCOUNT_COMMUNITY_CONTRACTS` ; identité, stockage et publication réels restent requis. |
| Publication / modération distante | **EN COURS — contrats receipts + write-intent acquis, backend distant non connecté** | Receipts prouvés par run `35515669822`; brouillon local + Abuse Shield/write-intent prouvés par run `35517194516`, marker `PASS_TARGETED_ACCOUNT_COMMUNITY_CONTRACTS`. Backend sécurisé, rôles et exécution distante restent à connecter. |
| Signatures / attestations de provenance | **EN COURS — contrats provenance acquis, signer/attestation réel non connecté** | Publication receipt fail-closed prouvé par run `35515669822`, marker `PASS_TARGETED_PROVENANCE_RECEIPT_CONTRACTS`; un `receipt:` bien formé n'atteste toujours aucune authenticité. |
| Téléchargements publics réels | **BLOQUÉ — verrou local prouvé, artefact réel absent** | run `35517484673`, marker `PASS_TARGETED_DISTRIBUTION_LOCK_CONTRACTS` protège available=false, zéro artefact, recovery fail-closed, same-origin, SHA-256 et gating de signature ; artefact autorisé + identité + provenance + signature réelle lorsque requise restent nécessaires. |
| Corpus réels de mods GTA VI / RDR2 | **EN COURS — capacité non livrée / droits et preuves requis** | Les hubs éditoriaux sont livrés, mais le catalogue de mods reste à 0 tant qu'un corpus autorisé, versionné, attribué et vérifiable n'existe pas. |
| Storage Resolver | **EN COURS — contrat acquis, service non connecté** | Contrat provider-neutral v1 prouvé par run `35515388240`, marker `PASS_TARGETED_STORAGE_REPAIR_CONTRACTS` : digest + manifest binding obligatoires, alias mutable non fiable rejeté. Le service distant réel reste absent. |
| Repair Network | **EN COURS — protocole contractuel acquis, exécution distante non connectée** | Contrat fail-closed v1 prouvé par run `35515388240`, marker `PASS_TARGETED_STORAGE_REPAIR_CONTRACTS` : substitution silencieuse et redistribution révoquée interdites. Aucun réseau distant réel n'est annoncé. |
| Backend communautaire | **EN COURS — fondation DEV codée, ressources distantes non provisionnées** | Pages Functions + garde D1/R2 + Turnstile serveur + migration D1 + status API ajoutés ; aucune ressource Cloudflare réelle, aucun binding/secret, aucune écriture distante active. |
| Guide MODARYX connecté | **EN COURS — capacité non livrée** | Moteur/contrat réel ; rester distinct de Nova Guide des OS. |
| Pont Nova Forge OS | **EN COURS — dépendance Nova Forge OS** | Interface publique stabilisée, consentement et modèle de permissions ; aucun partage implicite. |

## 6. Preuves externes encore ouvertes

| Élément | État courant | Pourquoi ce n'est pas fermé |
|---|---|---|
| Lecteur d'écran natif Windows | **PREUVE MANQUANTE** | NVDA/Narrator pilotable non disponible dans la recette actuelle. |
| VoiceOver macOS/iOS | **PREUVE MANQUANTE** | Environnement Apple réel requis. |
| Zoom navigateur natif 200/400 % final | **PREUVE MANQUANTE** | La lane 400 % native reste non démontrée dans l'environnement actuel. |
| Appareils tactiles physiques | **PREUVE MANQUANTE** | Android/iOS/tablette physiques requis. |
| Firefox final élargi | **TERMINÉ — preuve ciblée** | PR #87, run `35512379997`, marker `PASS_TARGETED_FIREFOX_23_ROUTE_PROOF` : Firefox 155.0 via Playwright 1.63.0, 23 routes × desktop/mobile = 46 observations, failures `[]`; captures inspectées sans défaut visuel bloquant isolé. |
| WebKit 23 routes — préflight | **TERMINÉ — preuve ciblée moteur** | PR #89, run `35514304174`, marker `PASS_TARGETED_WEBKIT_23_ROUTE_PREFLIGHT` : WebKit 26.6 via Playwright 1.63.0, 23 routes × desktop/mobile = 46 observations, failures `[]`; captures inspectées sans défaut visuel bloquant isolé. Ne vaut pas Safari final. |
| Safari final | **PREUVE MANQUANTE** | Work Phase 2 a confirmé : Chromium intégré uniquement, aucun Safari/macOS/iOS/device lab accessible. Une preuve Safari réelle reste requise ; WebKit Playwright ne suffit pas. |
| CWV représentatifs | **PREUVE MANQUANTE** | Work Phase 2 : rapport PageSpeed frais acquis mais « Aucune donnée » utilisateur réelle/CrUX ; les excellents résultats labo ne ferment pas le terrain. |
| Installation PWA manuelle sur appareil | **PREUVE MANQUANTE** | Work Phase 2 n'expose ni dialogue d'installation démontrable, ni lancement standalone/appareil réel ; cycle HTTPS automatisé seul insuffisant. |
| Validation juridique / droits / licences | **PREUVE MANQUANTE** | Identité d'éditeur, contacts, droits et autorisations doivent venir de données réelles. |
| Master Nova Design Intelligence complète | **PREUVE MANQUANTE / NON RÉCUPÉRÉE** | Le référentiel historique complet n'est pas présent ; ne pas inventer les éléments manquants. |

## 7. Finition Premium HD encore active

- **TERMINÉ — preuve visuelle initiale ciblée** — 23 routes publiques, desktop 1440×1000 + mobile 390×844 : run `35510526508`, marker `PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW`, 46 observations, zéro overflow, image cassée, contrôle coupé, H1/ouverture/footer manquant ; captures inspectées de façon assistée sans défaut bloquant isolé. Cela ne ferme pas la validation artistique humaine finale ni les états non déclenchés.
- **TERMINÉ — preuve ciblée navigateur** — surfaces statiques Écosystème / Sécurité / Documentation / Jeux / 404 : PR #74 fusionnée dans Work au merge `29fab6f549c5d9192359c0e8c9cbad2d4edec39a` ; run `35508894415`, marker `PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW` ; desktop 1440×1000 + mobile 390×844, zéro overflow, aucune image cassée ni contrôle coupé. Les captures ont été inspectées de façon assistée sans défaut bloquant isolé ; cela ne ferme pas la validation artistique humaine finale.
- **TERMINÉ — extension hubs jeux** — PR #78 fusionnée dans Work au merge `d953e6613572a0e1b195e5212cc997a20300230c` ; six hubs GTA VI/RDR2 ajoutés au harnais visuel, run `35510243999` vert, captures desktop/mobile inspectées sans défaut bloquant isolé.
- **TERMINÉ sur leurs scénarios ciblés** — états locaux Recherche, Téléchargements, Profils, Catalogue, Communauté, Creator Studio, Project Hub et Accueil. Ne pas les rejouer sans modification pertinente.

## 8. États historiques explicitement supersédés

Les mentions historiques suivantes restent conservées pour provenance mais **ne représentent plus l'état courant** :

- compteurs de couches compagnon inférieurs à 10/10 ;
- `visualGrowth.status=awaiting-assets` ;
- croissance visuelle « non activée » ;
- PWA HTTPS automatisée indiquée entièrement PREUVE MANQUANTE ;
- ancienne couverture à 16 pages ;
- anciens compteurs de cache/précache antérieurs aux mesures courantes ;
- threads CodeQL historiques encore ouverts ;
- anciens « prochain point » déjà dépassés par les PR #63 à #72.

## 9. Règle de fermeture anti-oubli avant VF

- **TERMINÉ — garde machine courante** — PR #84 fusionnée dans Work au merge `ce1368423734996137662f5d3901e52c6b8a4177` ; run `35511815106`, marker `PASS_TARGETED_ANTI_OUBLI_GATE`. La lane vérifie les états courants, bloque le retour des compteurs/états obsolètes et exige que les blockers humains, externes et services restent explicitement tracés.

Chaque idée explicitement retenue dans le registre historique courant est maintenant soit :

- **TERMINÉE** sur un périmètre prouvé ;
- **EN COURS** comme travail produit réel ;
- **BLOQUÉE** par une dépendance ou décision réelle ;
- **PREUVE MANQUANTE** lorsqu'une validation externe manque.

Aucune idée n'est supprimée implicitement pour améliorer un pourcentage. Une capacité non livrée n'est jamais requalifiée en simple test manquant. Une preuve technique locale ne devient pas une preuve native, juridique ou humaine.

**Limite d'exhaustivité :** ce registre couvre les idées explicitement récupérées dans le dépôt, les checkpoints et le registre anti-oubli actuels. La Master NDI complète étant non récupérée, l'exhaustivité historique absolue ne peut pas être revendiquée sans cette source.

## 10. Prochain point logique

1. Ne pas rejouer les preuves déjà vertes sur les 23 routes sans modification pertinente.
2. Ne pas retoucher le design sans défaut frais reproduit ou décision artistique explicite.
3. Garder le sitemap protégé inchangé tant que sa garde n'est pas explicitement levée ; seul ce gap SEO reste ouvert.
4. Conserver les corpus réels de mods et les services distants comme capacités distinctes non livrées jusqu'aux entrées réelles requises.
5. Fermer séparément les preuves humaines/externes quand un environnement approprié est disponible.
6. Aucun full replay avant la toute fin.
