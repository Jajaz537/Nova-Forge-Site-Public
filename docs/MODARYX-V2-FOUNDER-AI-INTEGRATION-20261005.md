# MODARYX V2 — Intégration privée Nova / MODARYX IA

**Date : 2026-10-05**  
**Statut : CODE INTÉGRÉ SUR BRANCHE ISOLÉE — DÉPLOIEMENT / PREUVE FONDATEUR RÉELS ENCORE REQUIS**

## Base IA vérifiée

- Modaryx — IA Foundation **v0.136**
- SHA-256 : `930da7a8b4b3cd2ed9954ad8e9f9e796700b3a9895ac077353a1b5a4ccce468f`
- 384/384 tests PASS
- 12/12 evals PASS
- RC rehearsal PASS
- migration-scale PASS
- archive reproductible + extraction neuve PASS
- runtime Windows durci : Python >= 3.11 résolu dynamiquement ; le resolver v0.136 a été prouvé sur le runner SD avec Python 3.13.16, y compris le cas où `py -0p` fonctionne mais `py -3.13` ne résout pas l'interpréteur
- progression VF IA maintenue à **83 %**

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
