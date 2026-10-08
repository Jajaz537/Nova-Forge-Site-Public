# CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06

**Date : 2026-10-06 — Europe/Paris**  
**Statut global : EN COURS — candidat V2 fortement prouvé, VF stricte non atteinte**

## 1. Périmètre

- MODARYX / MODARYX MODS = plateforme web actuelle.
- Nova Forge = logiciel / OS, hors périmètre de cette phase site-only.
- getnovaforge / getnova = ancien projet web abandonné ; aucune migration globale.
- Aucun DNS, DNSSEC, nameserver, IONOS ou réglage Cloudflare critique n'a été modifié.

## 2. Branche canonique de travail

- repo : `Jajaz537/Nova-Forge-Site-Public`
- branche : `design/modaryx-v2-blue-violet-product-20261005`
- SHA de base de ce checkpoint : `b909dc18ca8488111b4b0aba4d3bdf04bdc4cff4`
- `main` : non modifié.

## 3. Canon design actif

Référence utilisateur :
- Game Hub produit sombre ;
- bleu nuit majoritaire ;
- violet premium dosé ;
- cyan réservé aux CTA / états forts ;
- pas de bleu envahissant ;
- pas de néon généralisé ;
- ancien hero narratif classifié historique, non cible VF.

Le Game Hub et le reste de la V2 appartiennent désormais à la même famille visuelle.

## 4. Root V2 / stack

**TERMINÉ pour le candidat / production publique non promue**

- stack sélectionnée : React 19.2 + Vite 6.4 + shell Worker-compatible ;
- root réel : `v2/` ;
- preview isolée : `v2-preview/` ;
- root candidat noindex ;
- anti-contamination : vert ;
- migration navigateur V1→V2 : prouvée ;
- aucun cutover public.

## 5. Navigateur et revue surfaces

**TERMINÉ pour la preuve navigateur ciblée**

Preuves fraîches :
- matrice navigateur : **143 captures** ;
- desktop : **71 × 1440×1024** ;
- mobile : **72 × 390×844** ;
- clavier / accessibilité navigateur ciblée : PASS ;
- overflow desktop/mobile : 0 / 0 ;
- product flows page/onglet/module : PASS ;
- routes V2 profondes : PASS ;
- historique navigateur : PASS.

Revue visuelle propriétaire déléguée :
- preuve : `docs/MODARYX-V2-OWNER-DELEGATED-VISUAL-VALIDATION-20261006.md` ;
- artifact `11396297211` ;
- digest `sha256:9c4175fa8edac192620fe71beaa22d33539b0d931645666c376bf5f4bdb2c3e2` ;
- `human-multiscreen` et `human-mobile` reclassifiés en `RECLASSIFIED_OWNER_DELEGATED_AI_REVIEW` ;
- aucune prétention de session humaine externe.

Restent OPEN et non remplaçables par cette délégation :
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques.

## 6. PWA candidat

**TERMINÉ pour le candidat / production OPEN**

- hook Service Worker V2 derrière `VITE_MODARYX_PWA_PRODUCTION=1` ;
- build par défaut : aucun SW auto ;
- build activé : registration `/sw-v2.js`, scope `/`, contrôle après navigation, shell offline ;
- production réelle : non activée ;
- blocker `pwa-service-worker-production` reste OPEN.

## 7. Performance candidat

**TERMINÉ pour le laboratoire / CWV production OPEN**

Preuve labo Chrome :
- JS gzip : 99 531 octets ;
- CSS gzip : 20 143 octets ;
- desktop LCP labo : 1560 ms ;
- desktop CLS : 0 ;
- desktop route response : 57,5 ms ;
- mobile LCP labo : 648 ms ;
- mobile CLS : 0 ;
- mobile route response : 46,6 ms.

Ces mesures ne valent pas CWV p75 production.

## 8. Routes / SEO initial

**TERMINÉ pour le candidat / redirects publics OPEN**

- routes V2 internes stables ;
- deep links connus servis ;
- route inconnue V2 HTML → 404 ;
- titres/descriptions initiaux spécifiques aux routes connues ;
- candidat toujours noindex ;
- aucun redirect V1 public ;
- aucun canonical production ;
- aucun cutover.

## 8.1 Backend/auth preview DEV réel

**TERMINÉ pour le preview DEV / production OPEN**

Preuve HTTP réelle liée au déploiement Cloudflare exact du SHA `d70613a1c5d22b5745545f3547ee9b6d6dfba6be` :

- run GitHub Actions : `37432679004` — SUCCESS ;
- D1 : présent ;
- Auth0 : configuré ;
- login Auth0 : configuré ;
- Turnstile secret : configuré ;
- `remoteWritesReady = true` ;
- session sans compte : `GUEST` honnête ;
- login : redirect HTTPS externe réel ;
- `GET /api/v1/profile` sans session → 401 `authentication-required` ;
- modération/recours sans session → 401 ;
- écriture profil sans Origin → 403 `origin-required` ;
- écriture profil avec Origin mais sans session → 401.

R2 n'est pas lié sur ce preview et reste une dépendance séparée pour les usages qui l'exigent.

Cette preuve **ne ferme pas** :
- backend production ;
- auth production ;
- cérémonie passkey appareil réel.

## 9. Gate VF strict

Dernière micro-preuve :
- `VF_READINESS_STATUS BLOCKED`
- `VF_READINESS_OPEN_BLOCKER_COUNT 25`

Blocages OPEN actuels :

### validations réelles
- NVDA réel ;
- VoiceOver réel ;
- TalkBack réel ;
- Safari réel ;
- appareils physiques.

### web production
- backend réel ;
- auth/passkeys réels ;
- données/historique réels ;
- providers/connectors réels ;
- notifications email/push réelles ;
- PWA production ;
- Core Web Vitals production ;
- cutover.

### runtime MODARYX Forge
- runtime ;
- protocole transport ;
- signature receipt ;
- install/update/rollback ;
- safe profile ;
- server save sync.

### droits / légal
- registre droits jeux production ;
- découverte contacts officiels ;
- outbound éditeurs ;
- parsing réponses éditeurs ;
- validation licences ;
- revue juridique lorsque requise.

## 10. Règles de continuation

1. Site MODARYX uniquement tant que l'utilisateur maintient cette priorité.
2. Vérifier branche + SHA + changements récents avant écriture.
3. Ne jamais écraser le travail parallèle.
4. Pas de `main` sans stratégie contrôlée.
5. Après erreur : isoler → corriger ciblé → micro-preuve → continuer.
6. Aucun faux PASS production.
7. Aucun full cutover avant fermeture des dépendances réelles.
8. Ne pas modifier DNS/DNSSEC/nameservers/IONOS/Cloudflare critique sans instruction explicite.

## 11. Prochain point logique

Continuer les blockers web réellement préparables sans infrastructure critique :
1. préparer notifications/providers sans simuler de service réel ;
2. poursuivre les données V2 réelles sans transformer les fixtures en catalogue ;
3. préparer les dépendances production (R2/PWA/CWV) sans cutover ;
4. conserver passkeys appareil réel, Safari, screen-readers et appareils physiques OPEN jusqu'à preuve réelle ;
5. aucun cutover tant que les blockers production ne sont pas fermés.

**Ce checkpoint devient la source canonique MODARYX la plus récente après fusion.**
