# MODARYX V2 — Intégration privée Nova / MODARYX IA

**Date : 2026-10-05**  
**Statut : CODE INTÉGRÉ SUR BRANCHE ISOLÉE — DÉPLOIEMENT / PREUVE FONDATEUR RÉELS ENCORE REQUIS**

## Base IA vérifiée

- Modaryx — IA Foundation **v0.145**
- SHA-256 : `33f585a9b73cbed046159709d3683edcdae14c2e1d87e158a54eb803035b29aa`
- 400/400 tests PASS
- 12/12 evals PASS
- RC rehearsal PASS
- migration-scale PASS
- archive reproductible + extraction neuve PASS
- runtime Windows durci : Python >= 3.11 résolu dynamiquement ; P2 est désormais fermé à 10/10 après qualification formelle Qwen3 4B sur SD/GTX 1070 et évaluation indépendante du bundle cible. Deux campagnes PresentMon réelles sur Pax Dei ont été capturées ; elles ne valent pas encore crédit P1 car les shaders étaient encore actifs et le harnais v0.144 avait un défaut de passage JSON. Foundation v0.145 corrige ce harnais et est installée byte-exacte sur SD ; le retry stable post-shaders reste requis. STT, TTS et vision sont PASS sur le PC cible ; P8 est fermé après assessment indépendant du bundle scellé. Les preuves public denial et absence de secret navigateur sont PASS ; la preuve Founder privée de bout en bout reste requise.
- progression VF IA validée à **86 %**

## Intégration site ajoutée

Le site réutilise l'authentification serveur existante :
- session `modaryx_session` HttpOnly/Secure ;
- identité issue du backend ;
- permission obligatoire `modaryx:founder`.

Routes privées ajoutées :
- `GET /api/founder/ai/status`
- `GET /api/founder/ai/capabilities`
- `POST /api/founder/ai/chat`

Le backend site :
- signe le protocole `modaryx-founder-bridge-v1` en HMAC-SHA256 ;
- inclut le SHA-256 exact du body dans la signature ;
- garde la clé HMAC uniquement dans les secrets serveur ;
- exige HTTPS hors loopback ;
- interdit les writes cross-origin ;
- borne les réponses ;
- ne fournit aucun proxy de cible arbitraire.

## Surface UI

En environnement public, le bouton Nova/MODARYX IA est absent par défaut. Il n'apparaît qu'après une vraie session serveur dont `authority.capabilities.founder === true`.

L'exception loopback (`localhost`, `127.0.0.1`, `::1`) conserve uniquement le preview QA historique, sans activer le backend réel.

## Gate restant

Cette intégration de code **ne vaut pas encore la preuve finale d'intégration site**. Le point VF correspondant reste bloqué tant que ne sont pas réellement configurés et vérifiés :
1. l'auth Founder sur le déploiement Modaryx ;
2. `MODARYX_AI_BRIDGE_URL` vers un transport HTTPS/tunnel authentifié ;
3. `MODARYX_AI_BRIDGE_KEY_HEX` comme secret serveur ;
4. une requête réelle depuis le site déployé jusqu'au bridge Nova sur le PC Fondateur ;
5. une preuve que l'accès public/non-Founder reste refusé.

Aucun pourcentage VF n'est ajouté par ce commit.
