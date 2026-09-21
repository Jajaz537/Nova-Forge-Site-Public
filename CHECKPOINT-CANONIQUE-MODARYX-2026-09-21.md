# CHECKPOINT CANONIQUE — MODARYX — 21 septembre 2026

**Statut : SOURCE DE REPRISE PRIORITAIRE — VF NON DÉCLARÉE**

Ce checkpoint synthétise l’état opérationnel courant de MODARYX au 21 septembre 2026. Il remplace, pour la reprise, les états plus anciens lorsque ceux-ci sont contradictoires. Il ne constitue ni une fusion vers `main`, ni une promotion production, ni une déclaration de VF.

## 1. Séparation officielle

- **Nova Forge = logiciel / OS**
  - Nova Forge OS Public
  - Nova Forge OS Fondateur
- **MODARYX / MODARYX MODS = plateforme web**
- `getnovaforge.com` / « getnova » = ancien projet web abandonné ; références historiques seulement pour compatibilité, provenance ou protection technique.
- Aucune migration MODARYX → Nova Forge.

## 2. Git courant

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

- **TERMINÉ — preuve visuelle ciblée** sur **23 routes publiques**, desktop + mobile.
- **TERMINÉ — Firefox ciblé** sur 23 routes.
- **TERMINÉ — WebKit Playwright ciblé** sur 23 routes ; ne vaut pas Safari réel.
- **TERMINÉ — cycle PWA HTTPS automatisé ciblé** : service worker, cache, offline-stale, reconnexion/update.
- **TERMINÉ sur scénarios ciblés** — états empty/error/unavailable/retry des principales surfaces.
- **PREUVE MANQUANTE** — validation artistique humaine finale.
- Ne pas retoucher le design sans défaut frais reproduit ou décision artistique explicite.

## 4. Backend / communauté / profils

- **TERMINÉ — Provider DEV ciblé** : Auth0 + D1 + Turnstile, login/callback/session, profils, écritures distantes.
- **TERMINÉ — profils publics DEV ciblés** : écriture, lecture publique, fail-closed privé/inexistant.
- **TERMINÉ — communauté distante ciblée** : ingestion, surface publique modérée, suivi auteur et recours.
- **TERMINÉ — modération/publication/recours Provider DEV** : migration D1 0003, RBAC séparé, publication/retrait, recours/issue, receipts pseudonymisés.
- Production reste distincte et non activée.

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

- **TERMINÉ** — monde vivant, croissance visuelle et synchronisation contexte grossier ciblés.
- **BLOQUÉ / décision externe** — météo réelle production tant que fournisseur, licence, confidentialité, attribution et disclaimer ne sont pas validés.
- Ne pas activer un fournisseur météo réel sans validation explicite.

## 10. Corpus / contenus réels

- **EN COURS** — corpus réels GTA VI / RDR2.
- Les hubs éditoriaux existent, mais le catalogue de mods doit rester vide tant qu’un corpus autorisé, versionné, attribué et vérifiable n’est pas disponible.
- Ne jamais inventer un support de mod, un droit média ou un contenu réel.

## 11. Preuves externes encore ouvertes

- **PREUVE MANQUANTE** — lecteur d’écran natif Windows.
- **PREUVE MANQUANTE** — VoiceOver macOS/iOS.
- **PREUVE MANQUANTE** — zoom navigateur natif 200/400 % final.
- **PREUVE MANQUANTE** — appareils tactiles physiques.
- **PREUVE MANQUANTE** — Safari réel.
- **PREUVE MANQUANTE** — installation PWA manuelle sur appareil.
- **PREUVE MANQUANTE** — CWV terrain représentatifs.
- **PREUVE MANQUANTE** — validation juridique / droits / licences.
- **PREUVE MANQUANTE / NON RÉCUPÉRÉE** — Master Nova Design Intelligence complète.

## 12. Micro-preuves runtime les plus récentes

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
3. Fermer uniquement les dépendances réelles encore ouvertes quand un environnement adapté existe :
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
5. Ne pas toucher à `main`, DNS/DNSSEC/nameservers, IONOS ou production sans instruction explicite.
6. **Full replay unique uniquement à la toute fin**, après fermeture de tous les blockers ciblés.
7. Aucune VF / aucun 100 % tant que les preuves requises ne sont pas acquises.

## 15. Règle de reprise

Pour toute nouvelle conversation ou agent :

> Lire ce checkpoint en priorité, puis vérifier GitHub frais. En cas de contradiction avec un état plus ancien, ce checkpoint prévaut sauf preuve technique fraîche contraire. Ne jamais reconstruire l’état depuis d’anciens chats si cette source fournit déjà l’information.
