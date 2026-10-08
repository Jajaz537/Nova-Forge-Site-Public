# MODARYX V2 — Candidats providers notifications — 2026-10-06

**Statut : DIRECTION TECHNIQUE RETENUE / NON ACTIVÉE / NON APPROUVÉE PRODUCTION**

## Décision candidate

### Email — Cloudflare Email Service

Candidat technique : **Cloudflare Email Service**.

Raisons :
- binding d'envoi natif pour Workers ;
- cohérence avec l'infrastructure Cloudflare déjà utilisée par MODARYX ;
- pas de SDK email tiers requis dans le runtime de base ;
- état fail-closed possible tant que le binding réel n'existe pas.

Source officielle :
- https://developers.cloudflare.com/email-service/get-started/send-emails/

Cloudflare indique que l'onboarding Email Sending configure des enregistrements DNS d'authentification sur le domaine. **Aucune activation ni modification DNS n'est autorisée par ce document.**

Avant activation réelle :
- approbation explicite ;
- onboarding du domaine ;
- examen et approbation des modifications DNS ;
- binding d'envoi réel ;
- preuve de livraison réelle ;
- gestion bounce/suppression/unsubscribe applicable ;
- secrets et destinations non exposés.

### Push — Web Push standard + VAPID

Candidat technique : **Web Push standard + VAPID**.

Raisons :
- réutilise le service worker V2 ;
- API Push standard navigateur ;
- pas de Firebase requis pour le socle ;
- Cloudflare documente l'envoi Web Push depuis son runtime à l'aide de VAPID et d'une bibliothèque Web Push.

Sources officielles :
- https://developers.cloudflare.com/agents/communication-channels/webhooks/push-notifications/
- https://developer.mozilla.org/en-US/docs/Web/API/Push_API

Avant activation réelle :
- approbation explicite ;
- génération et stockage secret des clés VAPID ;
- consentement utilisateur ;
- stockage protégé des abonnements ;
- gestion unsubscribe / invalidation ;
- preuve réelle sur appareil ;
- intégration contrôlée au service worker production.

## Ce que cette décision NE fait PAS

- aucun provider production n'est activé ;
- aucun DNS n'est modifié ;
- aucune clé VAPID n'est créée ou stockée ;
- aucun email n'est envoyé ;
- aucun push n'est envoyé ;
- aucune donnée de destination brute n'est ajoutée au repo ;
- aucun blocker VF n'est fermé.

Le runtime actuel reste volontairement `NOT_IMPLEMENTED` pour email/push jusqu'à une tranche d'implémentation séparée et prouvée.
