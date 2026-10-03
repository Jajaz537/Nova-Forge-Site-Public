# CHECKPOINT CANONIQUE — MODARYX — 21 septembre 2026

**Statut : SOURCE DE REPRISE PRIORITAIRE — RÉCONCILIÉE AU 24 SEPTEMBRE 2026 — VF NON DÉCLARÉE**

Ce checkpoint synthétise l’état opérationnel courant de MODARYX au 21 septembre 2026. Il remplace, pour la reprise, les états plus anciens lorsque ceux-ci sont contradictoires. Il ne constitue ni une fusion vers `main`, ni une promotion production, ni une déclaration de VF.

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**
  - Nova Forge OS Public
  - Nova Forge OS Fondateur
- **MODARYX / MODARYX MODS = plateforme web**
- `getnovaforge.com` / « getnova » = ancien projet web abandonné ; références historiques seulement pour compatibilité, provenance ou protection technique.
- Aucune migration MODARYX → Nova Forge.

## 2. Git courant

- **Candidat courant de la PR #152** : `a499f505abdcff4fea3f297a83ea04198758bcc9`.
- Branche candidate : `design/modaryx-ultra-premium-global-pass2-20260922`, vers la branche Work `design/modaryx-premium-hd-20260914-work`.
- PR #152 : **ouverte, non fusionnée, mergeable** au dernier contrôle Nova.
- **20 workflows automatisés visibles sur ce HEAD : SUCCESS** au dernier contrôle Nova.
- Les dernières stabilisations CI n'ont modifié aucun rendu visuel.

- Dépôt : `Jajaz537/Nova-Forge-Site-Public`
- Branche Work : `design/modaryx-premium-hd-20260914-work`
- **HEAD Work observé avant cette maintenance documentaire** : `01718643b54171b23a066063941d17ae9cfb54f8`.
- À chaque reprise, le HEAD réel doit être revérifié dans GitHub ; le SHA inscrit ici est un point d’observation, pas une auto-référence au commit documentaire qui porte ce fichier.
- PR principale : **#12 — ouverte, draft, mergeable**
- PR #131 : **TERMINÉE / fusionnée**
- PR #132 : **TERMINÉE / fusionnée** dans Work au merge `a8a544dc8a6d8b4c435d3d2acf56d9988141bbfd`
- PR #133 : **TERMINÉE / fusionnée** — création de ce checkpoint canonique 21/09 ; merge Work `62c47f9fd46cb9183ad5f46fc24f254852fcb5cf`.
- PR #134 : **TERMINÉE / fusionnée** — garde anti-oubli du checkpoint 21/09 ; merge Work `249e7b2003865b6f2e2dd6ff4768fbd4cdcfb4b8`; micro-proof source/anti-oubli run `35635858561` — **success**.
- PR #135 : **TERMINÉE / fusionnée** — routage des sources canoniques 21/09 ; merge Work `01718643b54171b23a066063941d17ae9cfb54f8`; micro-proof source run `35636183749` — **success**.
- CodeQL du merge #133 `62c47f9fd46cb9183ad5f46fc24f254852fcb5cf` : run `35635578672` — **success**.
- CodeQL du merge #134 `249e7b2003865b6f2e2dd6ff4768fbd4cdcfb4b8` : run `35635925505` — **success**.
- CodeQL du HEAD observé `01718643b54171b23a066063941d17ae9cfb54f8` : run `35636268976` — **success**.
- Aucun full replay final exécuté.
- Aucun changement `main`, DNS, DNSSEC, nameservers ou production dans les derniers lots runtime.

## 3. Premium HD / surface publique

- **TERMINÉ — preuve technique de non-régression visuelle ciblée** sur **23 routes publiques**, desktop + mobile ; elle prouve absence de cassure/overflow mais ne vaut pas validation artistique.
- **TERMINÉ — Firefox ciblé** sur 23 routes.
- **TERMINÉ — WebKit Playwright ciblé** sur 23 routes ; ne vaut pas Safari réel.
- **TERMINÉ — cycle PWA HTTPS automatisé ciblé** : service worker, cache, offline-stale, reconnexion/update.
- **TERMINÉ sur scénarios ciblés** — états empty/error/unavailable/retry des principales surfaces.
- **TERMINÉ — Bloc 1 artistique, passe courante validée humainement par Nova** à partir des vidéos exhaustives desktop + mobile du SHA `2b0715431faf14e7d121ea8e2654fe45dbd699fe`. Les compositions Accueil / Jeux / Communauté / Profils / Écosystème sont distinctes dans le même monde canonique ; aucun changement visuel ultérieur n'a invalidé cette décision.
- Cette validation porte sur la passe artistique courante et **ne constitue ni une VF globale ni un 100 %**.
- Une décision artistique explicite existe désormais pour cette refonte. Conserver les fonctions et preuves déjà vertes ; ne pas remplacer une composition approuvée par un visuel non validé.

## 4. Backend / communauté / profils

- **TERMINÉ — Provider DEV ciblé** : Auth0 + D1 + Turnstile, login/callback/session, profils, écritures distantes.
- **TERMINÉ — profils publics DEV ciblés** : écriture, lecture publique, fail-closed privé/inexistant.
- **TERMINÉ — communauté distante ciblée** : ingestion, surface publique modérée, suivi auteur et recours.
- **TERMINÉ — modération/publication/recours Provider DEV** : migration D1 0003, RBAC séparé, publication/retrait, recours/issue, receipts pseudonymisés.
- Production reste distincte et non activée.
- **TERMINÉ — compte Fondateur / Administrateur DEV ciblé** : code/UI et héritage serveur fusionnés via PR #142 ; **Attribution réelle Auth0 DEV acquise** avec `modaryx:founder`, `authority.role=founder` et capacités founder/administration/modération/recours confirmées. **TERMINÉ — preuve runtime modération Fondateur** : HTTP `200`, `moderationState=held-for-review`, `publicationState=received`, `receiptCreated=true`, `cleanupSucceeded=true`. **TERMINÉ — preuve runtime recours Fondateur** : HTTP `200`, `result=upheld`, `moderationState=rejected`, `publicationState=received`, `receiptCreated=true`, `cleanupSucceeded=true`. Aucune erreur finale, aucun secret/token exposé, cookie HttpOnly non extrait. Sources : `qa/MODARYX-FOUNDER-AUTH0-DEV-EVIDENCE-20260921.md` + `qa/MODARYX-FOUNDER-DEV-PROOF-SURFACE-20260921.md`.
- Les rôles web n'exposent jamais automatiquement les secrets Cloudflare, GitHub, DNS/DNSSEC, Auth0, WeatherAPI ou clés privées de signature.
- **TERMINÉ — micro-surface Fondateur DEV retirée du candidat de fermeture** : les deux preuves runtime ont été acquises ; `functions/founder-proof-dev.js` est supprimé et le checker dédié devient un garde anti-résurrection. La route ne doit jamais réapparaître dans la VF/production.

## 5. Passkeys

- **TERMINÉ — préparation/provider DEV** : configuration source et Auth0 DEV préparées.
- **PREUVE MANQUANTE** — enrôlement, reconnexion et révocation sur appareil WebAuthn compatible.
- Ne pas requalifier cette preuve appareil en simple preuve source.

## 6. Signatures / provenance / distribution

- **TERMINÉ — contrat et moteur cryptographique provider-neutral**.
- **TERMINÉ — trust-anchor gate fail-closed**.
- **TERMINÉ — chaîne de confiance distribution ciblée** : taille + octets + SHA-256 + attestation + trust anchor.
- **TERMINÉ — hardening PR #132** :
  - JWK public uniquement ;
  - aucun matériel privé/symétrique ;
  - `key_ops` compatible vérification uniquement ;
  - cohérence algorithme/courbe ;
  - `updatedAt` requis sur trust store actif ;
  - fenêtres de validité cohérentes.
- **EN COURS** — signer réel et trust anchor réel non publiés.
- **BLOQUÉ** — téléchargements publics réels tant qu’un artefact autorisé, versionné, vérifiable et correctement attesté/signé n’existe pas.
- Le verrou `available=false` doit rester fail-closed tant que ces conditions ne sont pas remplies.

## 7. Storage Resolver / Repair Network

- **TERMINÉ — contrats ciblés**.
- **TERMINÉ — moteur décisionnel**.
- **TERMINÉ — primitive HTTPS bornée** avec limites d’octets, SHA-256 et absence de credentials/referrer.
- **TERMINÉ — orchestrateur ciblé** transport + décision.
- **TERMINÉ — hardening résilience** : deadline bornée, propagation timeout fail-closed, refus des cibles publiques locales/privées évidentes.
- Cette garde ne remplace pas une politique réseau fournisseur contre le DNS rebinding.
- **EN COURS** — endpoints/origines réels non connectés.
- **EN COURS** — exécution distante Repair Network non connectée.

## 8. Guide MODARYX / pont Nova Forge OS

- **TERMINÉ — contrats ciblés**.
- **TERMINÉ — gate de consentement/permissions** : consentement explicite, grants ⊆ scopes, aucune session/credential implicite.
- **TERMINÉ — runtime de découverte ciblé**.
- **TERMINÉ — hardening résilience** :
  - deadline de découverte ;
  - refus des cibles distantes locales/privées évidentes pour Guide ;
  - pont OS : HTTP uniquement sur loopback, HTTPS sinon.
- **EN COURS** — service Guide réel non connecté.
- **EN COURS** — runtime Nova Forge OS réel non connecté.
- Nova Forge OS reste un produit distinct de MODARYX.

## 9. Météo / monde vivant

- **TERMINÉ — monde vivant logique + synchronisation contexte grossier ciblés**. **EN COURS — croissance visuelle artistique séparée** : `visualGrowth.status=awaiting-assets` est l'état courant actif et doit rester fail-closed. Les assets séparés existent mais ne sont pas réactivés ; le hero composite approuvé reste actif.
- **TERMINÉ — readiness WeatherAPI ciblée** : mode `weatherapi`, proxy same-origin, clé serveur obligatoire, normalisation, attribution et disclaimer utilisateur ; aucune activation réelle.
- **BLOQUÉ / activation externe** — météo réelle production tant que compte/clé, acceptation des conditions, confidentialité/juridique et preuve réelle ne sont pas validés.
- Ne pas activer un fournisseur météo réel sans validation explicite.

## 10. Corpus / contenus réels

- **EN COURS** — corpus réels GTA VI / RDR2.
- Les hubs éditoriaux existent, mais le catalogue de mods doit rester vide tant qu’un corpus autorisé, versionné, attribué et vérifiable n’est pas disponible.
- Ne jamais inventer un support de mod, un droit média ou un contenu réel.

## 11. Preuves externes encore ouvertes

- **PREUVE MANQUANTE** — passkey : enrôlement, reconnexion et révocation sur appareil WebAuthn réel.
- **PREUVE MANQUANTE** — lecteur d’écran natif Windows.
- **PREUVE MANQUANTE** — VoiceOver macOS/iOS.
- **PREUVE MANQUANTE** — zoom navigateur natif 200/400 % final.
- **PREUVE MANQUANTE** — appareils tactiles physiques.
- **PREUVE MANQUANTE** — Safari réel.
- **PREUVE MANQUANTE** — installation PWA manuelle sur appareil.
- **PREUVE MANQUANTE** — CWV terrain représentatifs.
- **PREUVE MANQUANTE** — validation juridique / droits / licences.
- **BLOQUÉ** — signer et trust anchor réels absents.
- **BLOQUÉ** — artefact de distribution public autorisé absent.
- **PREUVE MANQUANTE / ENTRÉES ABSENTES** — corpus réels GTA VI / RDR2 autorisés, versionnés et attribués.
- **BLOQUÉ** — Storage Resolver / Repair Network réels : endpoints et autorisations externes absents.
- **BLOQUÉ** — Guide MODARYX réel non connecté.
- **BLOQUÉ** — pont Nova Forge OS réel non connecté.
- **BLOQUÉ / VALIDATION FOURNISSEUR-JURIDIQUE** — météo production non activée.
- **PREUVE MANQUANTE / NON RÉCUPÉRÉE** — Master Nova Design Intelligence complète.

## 12. Micro-preuves runtime les plus récentes

Candidat PR #152 `a499f505abdcff4fea3f297a83ea04198758bcc9` :

- **20 workflows automatisés visibles : SUCCESS**, contrôle GitHub frais effectué par Nova ;
- Preview HTTPS PWA Cycle `36048593459` — **success** ;
- Preview Visual Capture `36048593662` — **success** ;
- PWA Update Browser `36048593583` — **success** ;
- Browser Accessibility `36048593449` — **success** ;
- validation artistique humaine de la passe vidéo `2b07154` conservée, car aucun commit ultérieur n'a modifié visiblement le rendu.

Candidat `9bd769e927bc07ff5ea2cd40054cfdec0c30f610` :

- `MODARYX Site First Targeted Source Proof` — run `35631864195` — **success**
- `MODARYX Local Functional Browser Proof` — run `35631864027` — **success**
- marker : `PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING`

HEAD Work observé avant maintenance documentaire :

- `01718643b54171b23a066063941d17ae9cfb54f8`
- CodeQL — run `35636268976` — **success**
- source routing / anti-oubli le plus récent : run `35636183749` — **success**

## 13. Anti-oubli

Le registre courant reste `qa/MODARYX-ANTI-OUBLI-CURRENT-20260920.md`.

Toute idée explicitement retenue doit rester dans l’un des états :

- **TERMINÉ**
- **EN COURS**
- **BLOQUÉ**
- **PREUVE MANQUANTE**

Ne jamais supprimer implicitement un blocker pour améliorer un pourcentage. Une preuve source ne vaut pas preuve appareil, humaine, juridique ou terrain.

## 14. Prochain point logique

1. Vérifier Git frais avant toute écriture.
2. Ne pas rejouer les preuves déjà vertes sans modification pertinente.
3. Considérer le **Bloc 1 artistique de la passe courante comme TERMINÉ**, sans déclarer la VF globale et sans réactiver les couches Loup/Dragon séparées ; conserver `visualGrowth.status=awaiting-assets`.
4. Fermer uniquement les dépendances réelles encore ouvertes quand un environnement adapté existe :
   - passkey appareil ;
   - signer / trust anchor réel ;
   - artefact de distribution autorisé ;
   - corpus réel ;
   - Storage/Repair réels ;
   - Guide réel ;
   - pont Nova Forge OS réel ;
   - météo si la décision fournisseur est validée ;
   - preuves humaines/appareils/terrain.
4. Après erreur : **erreur exacte → isolation → correction ciblée → micro-proof → continuation**.
6. Ne pas toucher à `main`, DNS/DNSSEC/nameservers, IONOS ou production sans instruction explicite.
7. **Full replay unique uniquement à la toute fin**, après fermeture de tous les blockers ciblés.
8. Aucune VF / aucun 100 % tant que les preuves requises ne sont pas acquises.

## 15. Règle de reprise

Pour toute nouvelle conversation ou agent :

> Lire ce checkpoint en priorité, puis vérifier GitHub frais. En cas de contradiction avec un état plus ancien, ce checkpoint prévaut sauf preuve technique fraîche contraire. Ne jamais reconstruire l’état depuis d’anciens chats si cette source fournit déjà l’information.

## 16. Reprise externe contrôlée — 21 septembre 2026

- Git frais vérifié sur `design/modaryx-premium-hd-20260914-work` au SHA `18761119719f339ff9bda22ffb79bd30a66b74ed`, merge de la PR #138 WeatherAPI readiness. Aucun changement parallèle observé au moment du contrôle.
- WeatherAPI : aucun compte DEV déjà authentifié n’est disponible dans Work ; la page fournisseur demande une connexion. Aucun `MODARYX_WEATHER_MODE` ni `MODARYX_WEATHER_API_KEY` n’est configuré dans l’environnement Cloudflare Pages Preview. Aucun compte, secret ou acceptation contractuelle n’a été créé.
- Micro-preuve Preview réelle : `GET /api/local-context` retourne `HTTP 200`, `weather.status=not-connected` et `weather.reason=provider-not-configured`, avec `Cache-Control: no-store` et sans coordonnées exactes, ville, code postal ni demande GPS. Le repli fail-soft est donc réellement prouvé ; les données WeatherAPI live, leur normalisation, attribution et disclaimer restent **BLOQUÉES** faute de compte/clé et de validation contractuelle/juridique.
- Passkey : **PREUVE MANQUANTE** maintenue ; Work ne détecte aucun authentificateur de plateforme compatible et aucune cérémonie n’a été simulée.
- Safari/macOS/iOS, lecteur d’écran natif, installation PWA sur appareil et zoom navigateur natif 400 % : **PREUVE MANQUANTE** maintenue ; l’environnement Work expose uniquement son navigateur Chromium intégré.
- CWV terrain : **PREUVE MANQUANTE** maintenue. La tentative PageSpeed Insights API a renvoyé `HTTP 429 RESOURCE_EXHAUSTED` (`RATE_LIMIT_EXCEEDED`) et l’interface n’a livré aucune donnée terrain exploitable. Aucun résultat Lighthouse labo n’a été substitué.
- Signer/trust anchor, artefact public autorisé, corpus GTA VI/RDR2, Storage/Repair, Guide MODARYX et pont Nova Forge OS : états inchangés ; aucune ressource, autorisation ou endpoint réel supplémentaire n’a été fourni.
- Validation juridique et droits/licences : **PREUVE MANQUANTE** maintenue. L'ancienne mention de validation artistique manquante est supersédée par la validation humaine Nova de la passe vidéo `2b07154` ; cela ne ferme pas la VF globale.
- Compte Fondateur Auth0 DEV : attribution `modaryx:founder`, session `authority.role=founder` et les deux mutations privilégiées sont désormais acquises. Les anciens blocages `fetch`/XHR/`sendBeacon`, `origin-mismatch` et `reauthentication-required` sont historiques et ont été fermés par la micro-surface temporaire sécurisée, son correctif d'origine et une réauthentification complète.
- Aucun full replay, aucune activation production et aucun changement `main`, DNS/DNSSEC, nameservers ou IONOS.


## Mise à jour canonique — 22 septembre 2026 — preuve runtime Fondateur

- **TERMINÉ — modération Fondateur DEV** : `proof=moderation`, HTTP `200`, `held-for-review`, `received`, receipt créé, cleanup confirmé, aucune erreur.
- L'échec précédent `reauthentication-required` a été résolu par une réauthentification complète ; aucun changement de code n'a été nécessaire pour cette étape.
- **TERMINÉ — recours Fondateur DEV** : `proof=appeals`, HTTP `200`, `result=upheld`, `moderationState=rejected`, `publicationState=received`, receipt créé, cleanup confirmé, aucune erreur.
- **TERMINÉ — retrait candidat de la micro-surface** : `functions/founder-proof-dev.js` supprimé ; checker converti en garde anti-résurrection. La fermeture définitive de ce lot exige la micro-proof source verte et la fusion dans Work.
- Aucun full replay, aucun `main`, aucune production, aucun DNS/DNSSEC/nameserver.


## Mise à jour canonique — 22 septembre 2026 — hero approuvé / direction artistique

- HEAD Work après PR #149 : `14650dd7d0cb1a501ccc88e6f9caa112b4eda550`.
- **TERMINÉ — correction du remplacement intempestif du hero** : l’accueil ne remplace plus après ~2,2 s le composite approuvé `assets/modaryx-wolf-dragon-hero.webp` par `environment-premium.jpg` + couches compagnon non validées.
- Cause fermée : `visualGrowth.status=ready` avait été activé avant validation artistique humaine des couches séparées.
- État courant : `visualGrowth.status=awaiting-assets`, environnement/couches de croissance non actifs ; chronologie, croissance logique, contexte local/météo et reduced-motion restent actifs.
- PR #149 : fusionnée dans Work au merge `14650dd7d0cb1a501ccc88e6f9caa112b4eda550`.
- Candidat final #149 : Source Proof, Local Functional, PWA, Real File, Lab Performance, Preview Visual, Firefox 23 routes, WebKit 23 routes, contrat croissance, asset gate, offline state et chronique : **success**.
- Preview Visual confirme desktop/mobile/reduced-motion : hero `modaryx-wolf-dragon-hero.webp`, zéro couche compagnon active, `worldVisualGrowth=awaiting-assets`, reality sync active.
- **TERMINÉ — Bloc 1 artistique, passe courante** : la passe vidéo exhaustive `2b07154` a été validée humainement par Nova. Les corrections techniques ultérieures n'ont pas modifié visiblement le rendu. `visualGrowth.status=awaiting-assets` reste actif.

### Règle vidéo permanente jusqu’à la VF — 2026-09-24

- Toute passe artistique importante suit obligatoirement : correction → micro-preuves → nouveau Preview → vidéos desktop et mobile fraîches → analyse visuelle humaine par Nova.
- Les deux vidéos doivent correspondre exactement au SHA et au Preview livrés ; une vidéo antérieure devient caduque après toute modification visuelle importante.
- La couverture minimale comprend les 23 routes publiques, les pages longues jusqu’au footer, les menus, formulaires, filtres, états interactifs accessibles et les viewports desktop/mobile.
- Les checks automatisés restent des preuves techniques uniquement et ne valent jamais validation artistique.
- État artistique courant : **TERMINÉ — dernière passe vidéo exhaustive examinée et acceptée par Nova**. Cette acceptation ne vaut pas VF globale.
- Ne jamais réactiver les couches de croissance visuelle avant validation humaine explicite de la nouvelle composition.

## Mise à jour canonique — 24 septembre 2026 — kit de preuves manuelles finales

- **TERMINÉ — préparation documentaire uniquement** : le kit `qa/manual-final-evidence/` fournit les protocoles utilisateur/appareil, la matrice des dépendances externes, le modèle de rapport, le handoff et un manifeste borné au candidat `03e41855c7b51fcd499ae7aaaebf0eb21d4da493` et à sa Preview immuable `https://6f813d33.nova-forge-site-public.pages.dev`.
- Les protocoles préparés ne valent aucune exécution : passkey réelle, Safari, VoiceOver, lecteur d'écran Windows, zoom natif 200/400 %, tactile physique, PWA appareil et CWV terrain restent **PREUVE MANQUANTE**.
- Juridique/licences et Master Nova Design Intelligence restent **PREUVE MANQUANTE** ; corpus GTA VI/RDR2 reste **EN COURS — ENTRÉES ABSENTES** ; signer/trust anchor, artefact public autorisé, Storage/Repair réels, Guide MODARYX réel, pont Nova Forge OS réel et météo production restent **BLOQUÉS**.
- Aucun état externe n'est artificiellement fermé. Aucun full replay n'a été lancé. La VF globale reste non déclarée et `visualGrowth.status=awaiting-assets` reste actif.
