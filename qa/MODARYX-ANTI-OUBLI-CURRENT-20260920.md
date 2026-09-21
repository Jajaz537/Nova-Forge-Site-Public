# MODARYX — ANTI-OUBLI COURANT CANONIQUE — 20 septembre 2026

**Base Git vérifiée avant le batch Super Nova :** `design/modaryx-premium-hd-20260914-work` @ `d0be675e86b51174b834f6764fbbce40f56b67a9`.  
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
| Sitemap des routes jeux/hubs | **TERMINÉ — preuve ciblée** | PR #118 : les 22 canonicals indexables sont présents dans `sitemap.xml`, sans URL manquante, extra ni doublon ; run source initial `35541619985` — success. |
| Hubs GTA VI / RDR2, catégories et guides éditoriaux | **TERMINÉ — périmètre éditorial sourcé + readiness contractuelle** | Six routes livrées via PR #76 ; PR #81 classe `game-hubs.gta6-rdr2` en `contract-ready` et sépare `game-corpus.gta6-rdr2` en `blocked-inputs`. Aucun support PC/mod GTA VI supposé, aucun média Rockstar copié, aucun faux téléchargement. |

## 5. Capacités retenues non livrées

| Élément retenu | État courant | Condition de fermeture |
|---|---|---|
| Comptes / authentification / passkeys réels | **PREUVE MANQUANTE — appareil réel requis ; Provider DEV configuré** | La préparation source reste protégée par `qa/MODARYX-PASSKEY-PROVIDER-READINESS-20260921.md` et marker `PASS_TARGETED_PASSKEY_PROVIDER_READINESS`. Work a vérifié `d0be675e86b51174b834f6764fbbce40f56b67a9` puis activé Universal Login, Identifier First et les passkeys uniquement sur `Username-Password-Authentication`, Custom Login Page désactivée, récupération disponible et configuration DEV saine. `qa/MODARYX-PASSKEY-PROVIDER-DEV-EVIDENCE-20260921.md` trace le point d’arrêt : aucun authentificateur de plateforme dans Work, donc enrôlement/reconnexion/révocation réels restent à prouver sur appareil WebAuthn compatible. |
| Flux Auth0 BFF / session | **TERMINÉ — code + preuve provider DEV ciblée** | Le contrat source reste prouvé par `qa/MODARYX-AUTH-BFF-SESSION-20260920.md` / run `35522509780`, marker `PASS_TARGETED_AUTH_BFF_SESSION`; le provider DEV réel confirme en plus login, callback et session backend active. Cela ne vaut toujours pas cérémonie passkey finale. |
| Work Phase 2 — qualification externe | **TERMINÉ — preuve de préparation/limitation** | `qa/MODARYX-WORK-PHASE2-EXTERNAL-EVIDENCE-20260920.md` : HEAD distant canonique vérifié, zéro écriture/déploiement/compte ; points d'arrêt Safari/Auth0/Cloudflare/CWV/PWA documentés. |
| Profils publics éditables | **TERMINÉ — parcours DEV bout-en-bout ciblé** | Écriture réelle déjà prouvée ; micro-preuve Work sur HEAD `d95bbc1f48ee6dcf4d84822d614316b046c6aa8f` : passage temporaire public, GET anonyme `HTTP 200`, UI publique OK, profil non public/inexistant `HTTP 404 profile-not-found`, puis restauration en `private`. Production reste non activée et la passkey finale reste séparée. |
| UI compte / profil premium | **TERMINÉ — preuve ciblée de code** | `qa/MODARYX-PROFILES-ACCOUNT-UI-20260920.md` + run source `35523072639`, marker `PASS_TARGETED_PROFILES_ACCOUNT_UI` ; browser proof run `35523072623`, marker `PASS_TARGETED_PROFILES_STATE_BROWSER_PROOF`, vérifie le fallback statique fail-closed. |
| Publication / modération distante | **TERMINÉ — cycle Provider DEV bout-en-bout ciblé** | Migration D1 0003 appliquée en DEV, RBAC Auth0 actif, permissions `community:moderate` + `community:appeals-review` prouvées ; publication `accepted/published/distributable=true`, retrait `held-for-review/withdrawn/distributable=false`, recours `201 submitted`, issue `200 upheld`, receipts chaînés sans subject Auth0 brut. Production non activée. |
| UI communauté distante modérée | **TERMINÉ — envoi + surface publique + suivi/recours ciblés** | Base UI PR #112 : `qa/MODARYX-COMMUNITY-REMOTE-UI-20260920.md`, marker `PASS_TARGETED_COMMUNITY_REMOTE_UI` ; PR #122 ajoute la surface publique fail-closed ; PR #123 ajoute suivi auteur et recours. Candidat #123 : source `35544873531` success, Static Premium HD/Firefox/WebKit/reflow/a11y et Catalog Community States success. La preuve Provider DEV réelle du cycle modération/recours est désormais acquise séparément. |
| Signatures / attestations de provenance | **EN COURS — vérification + trust-anchor gate acquis ; signer réel non connecté** | Les contrats et le moteur cryptographique restent documentés par `qa/MODARYX-SIGNATURE-ATTESTATION-CONTRACT-20260921.md` et `qa/MODARYX-SIGNATURE-VERIFICATION-ENGINE-20260921.md`, avec markers `PASS_TARGETED_PROVENANCE_RECEIPT_CONTRACTS`, `PASS_TARGETED_SIGNATURE_ATTESTATION_CONTRACT` et `PASS_TARGETED_SIGNATURE_VERIFICATION_ENGINE`. Le batch Super Nova ajoute `data/trusted-signers.json` vide/fail-closed et `qa/MODARYX-TRUSTED-SIGNERS-GATE-20260921.md`, marker `PASS_TARGETED_TRUSTED_SIGNER_GATE` : une signature mathématiquement valide n’est fiable que si sa clé publique est explicitement approuvée, valide et non révoquée. Aucun trust anchor ni signer de production n'est publié. Le batch runtime ajoute `functions/_lib/artifact-trust.mjs` et `qa/MODARYX-DISTRIBUTION-TRUST-CHAIN-20260921.md`, marker `PASS_TARGETED_DISTRIBUTION_TRUST_CHAIN` : taille + SHA-256 des octets + sujet d’attestation + trust anchor doivent tous correspondre avant qu’un artefact signé requis puisse être considéré comme distribuable. Le hardening runtime `qa/MODARYX-RUNTIME-RESILIENCE-HARDENING-20260921.md`, marker `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING`, refuse en plus tout JWK privé/symétrique ou doté d’une capacité de signature, impose `updatedAt` au trust store actif et vérifie la cohérence des fenêtres de validité. |
| Téléchargements publics réels | **BLOQUÉ — verrou local prouvé, artefact réel absent** | run `35517484673`, marker `PASS_TARGETED_DISTRIBUTION_LOCK_CONTRACTS` protège available=false, zéro artefact, recovery fail-closed, same-origin, SHA-256 et gating de signature ; artefact autorisé + identité + provenance + signature réelle lorsque requise restent nécessaires. Le moteur `artifact-trust.mjs` compose maintenant ces contrôles en code ciblé via `PASS_TARGETED_DISTRIBUTION_TRUST_CHAIN`, sans déverrouiller `downloads.json`. |
| Corpus réels de mods GTA VI / RDR2 | **EN COURS — capacité non livrée / droits et preuves requis** | Les hubs éditoriaux sont livrés, mais le catalogue de mods reste à 0 tant qu'un corpus autorisé, versionné, attribué et vérifiable n'existe pas. |
| Storage Resolver | **EN COURS — contrat + décision + transport vérifié acquis ; service distant non connecté** | Le contrat reste protégé par `PASS_TARGETED_STORAGE_REPAIR_CONTRACTS` ; le moteur décisionnel est documenté dans `qa/MODARYX-STORAGE-REPAIR-DECISION-ENGINE-20260921.md`, marker `PASS_TARGETED_STORAGE_REPAIR_DECISION_ENGINE`. Le batch Super Nova ajoute `functions/_lib/storage-transport.mjs` + `qa/MODARYX-STORAGE-TRANSPORT-PRIMITIVE-20260921.md`, marker `PASS_TARGETED_STORAGE_TRANSPORT_PRIMITIVE` : HTTPS uniquement, limites d’octets, aucun credential/referrer, SHA-256 du manifeste et de l’artefact vérifiés avant observation. Aucun endpoint fournisseur réel n’est configuré. Le batch runtime ajoute `functions/_lib/storage-repair-orchestrator.mjs` + `qa/MODARYX-STORAGE-REPAIR-ORCHESTRATOR-20260921.md`, marker `PASS_TARGETED_STORAGE_REPAIR_ORCHESTRATOR`, qui compose transport + décision et observe en parallèle uniquement les origines éligibles. `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING` ajoute un timeout borné et le refus des cibles locales/privées évidentes côté transport public. |
| Repair Network | **EN COURS — protocole + décision + transport vérifié acquis ; exécution distante non connectée** | Le moteur décisionnel interdit substitution silencieuse et redistribution withdrawn/revoked ; `PASS_TARGETED_STORAGE_TRANSPORT_PRIMITIVE` apporte désormais la récupération HTTPS bornée et le contrôle SHA-256 des octets. Les origines/réseau de réparation réels restent absents. `PASS_TARGETED_STORAGE_REPAIR_ORCHESTRATOR` prouve en plus qu’une release withdrawn/revoked coupe la récupération réseau et qu’aucune copie non exacte n’est sélectionnée. `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING` propage la deadline réseau jusqu’à l’orchestrateur et laisse l’échec fail-closed. |
| Backend communautaire | **TERMINÉ — Provider DEV + cycle modération/recours ciblé** | D1/Auth0/Turnstile, writes, migration 0003, RBAC et permissions séparées sont prouvés en DEV ; publication/retrait, suivi auteur, recours/issue et chaîne de receipts sont validés. Production reste distincte et non activée. |
| Contrats comptes / communauté | **TERMINÉ — preuve ciblée contractuelle** | run `35517194516`, marker `PASS_TARGETED_ACCOUNT_COMMUNITY_CONTRACTS` ; contrats acquis, services réels séparés. |
| Endpoints profils / communauté distants | **TERMINÉ — code + micro-proofs provider DEV** | `qa/MODARYX-REMOTE-WRITE-ENDPOINTS-20260920.md` + `PASS_TARGETED_REMOTE_WRITE_ENDPOINTS`, complétés par `profile-write` et `community-write` réels en DEV. La publication automatique reste interdite et non livrée. |
| Fondation backend DEV | **TERMINÉ — preuve ciblée de code** | `qa/MODARYX-BACKEND-DEV-PROVISIONING-20260920.md` + run `35519643634`, marker `PASS_TARGETED_BACKEND_DEV_FOUNDATION` ; ne vaut pas provisioning fournisseur ni activation distante. |
| Préparation fournisseur DEV | **TERMINÉ — preuve ciblée provider-independent** | `qa/MODARYX-DEV-PROVIDER-READINESS-20260920.md` ; ordre D1 0001→0002→0003, hostname Turnstile, Auth0 RS256/audience et RBAC `community:moderate` + `community:appeals-review` désormais verrouillés par le checker ciblé. |
| Provider DEV réel + micro-proofs bout-en-bout | **TERMINÉ — profils + ingestion + modération/recours ciblés** | Login/callback/session, `profile-write`, `community-write`, profil public DEV, fail-closed Turnstile/hostname/session, migration 0003, RBAC, publication/retrait et recours/issue sont prouvés. Les preuves fail-closed incluent `403 turnstile-rejected`, `403 turnstile-hostname-mismatch`, `403 moderator-permission-required` et `403 appeals-review-permission-required`. |
| Moteur modération / publication / recours | **TERMINÉ — code + preuves ciblées + Provider DEV réel** | `qa/MODARYX-MODERATION-PUBLICATION-ENGINE-20260921.md` ; PR #121–#123 et run `35544873531` prouvent le code avec marker `PASS_TARGETED_MODERATION_PUBLICATION_ENGINE`. La preuve fournisseur DEV ferme migration 0003, RBAC, séparation `community:moderate` / `community:appeals-review`, publication/retrait, suivi auteur, recours/issue et chaîne de receipts. |
| Guide MODARYX connecté | **EN COURS — contrat + gate de consentement acquis ; service réel non connecté** | Contrat `schemas/modaryx-guide-connection.schema.json` documenté dans `qa/MODARYX-GUIDE-OS-BRIDGE-CONTRACT-20260921.md`, marker `PASS_TARGETED_GUIDE_OS_BRIDGE_CONTRACTS`. PR #128 ajoute `functions/_lib/integration-consent.mjs` + `qa/MODARYX-INTEGRATION-CONSENT-ENGINE-20260921.md`, marker `PASS_TARGETED_INTEGRATION_CONSENT_ENGINE` : consentement explicite, grants ⊆ scopes demandés, endpoint HTTPS, aucune session/credential partagés. Service Guide réel toujours absent. Le runtime `functions/_lib/integration-discovery.mjs` + `qa/MODARYX-INTEGRATION-DISCOVERY-RUNTIME-20260921.md`, marker `PASS_TARGETED_INTEGRATION_DISCOVERY_RUNTIME`, ajoute une découverte HTTPS bornée sans credential et conserve le consentement explicite avant activation. `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING` ajoute une deadline de découverte et refuse les cibles distantes locales/privées évidentes. |
| Pont Nova Forge OS | **EN COURS — contrat + gate de consentement acquis ; runtime OS non connecté** | PR #128 étend la protection par `PASS_TARGETED_INTEGRATION_CONSENT_ENGINE` : frontière `modaryx-web → nova-forge-os`, permissions accordées ⊆ demandées, consentement explicite, endpoint local borné, version de protocole requise, aucun account linking/session/credential implicite. Runtime Nova Forge OS toujours distinct et non connecté. `PASS_TARGETED_INTEGRATION_DISCOVERY_RUNTIME` ajoute la découverte du pont avec HTTP limité au loopback (ou HTTPS), identité produit vérifiée et activation toujours soumise au gate de consentement. `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING` borne aussi la durée de découverte du pont sans supprimer l’exception loopback explicitement prévue par le contrat. |

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
- anciens « prochain point » déjà dépassés par les PR #63 à #72 ;
- mentions « tenant Auth0/D1/Turnstile non provisionné » et « aucun login réseau prouvé » antérieures à la fermeture Provider DEV du 21 septembre 2026.

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

1. Considérer le Provider DEV ciblé comme **TERMINÉ** ; ne pas le rejouer sans modification pertinente.
2. Ne pas rejouer les preuves déjà vertes sur les 23 routes et ne pas retoucher le design sans défaut frais reproduit ou décision artistique explicite.
3. Fermer les écarts produit encore réels sans les simuler : passkey finale, corpus réels, distribution, signatures/attestations, Storage Resolver, Repair Network, Guide et pont OS selon leurs dépendances.
4. Considérer le sitemap des routes indexables comme **TERMINÉ** ; ne le rouvrir que si une nouvelle route canonique indexable est ajoutée.
5. Garder météo réelle production **BLOQUÉE** tant que licence/confidentialité/attribution/disclaimer ne sont pas validés.
6. Fermer séparément les preuves humaines/externes (lecteurs d’écran natifs, zoom 400 %, appareils physiques, Safari réel, PWA install appareil, CWV terrain, juridique) quand un environnement approprié est disponible.
7. Aucun full replay avant la toute fin.
