# MODARYX V2 — Coffre chiffré des destinations de notification — 2026-10-06

**État : CANDIDAT IMPLÉMENTÉ / MICRO-PREUVE LOCALE VERTE / NON APPLIQUÉ À DISTANCE**

## But

Préparer email et Web Push sans mettre d’adresse email brute, d’endpoint push brut ou de secret d’abonnement dans l’outbox de livraison.

## Architecture

- migration candidate : `migrations/0015_modaryx_v2_notification_destinations.sql`
- module serveur : `functions/_lib/notification-destinations.mjs`
- API propriétaire : `/api/v1/notifications/destinations`
- chiffrement au repos : **AES-256-GCM**
- clé : secret runtime `MODARYX_NOTIFICATION_DESTINATION_KEY_B64`, 32 octets, jamais versionné
- outbox : conserve uniquement `destination_ref_digest_sha256`
- provider email candidat : **Cloudflare Email Service**
- provider push candidat : **Web Push standard + VAPID**

## Propriétés prouvées localement

- email normalisé puis chiffré avant stockage ;
- endpoint et clés Push chiffrés avant stockage ;
- aucune destination brute dans l’outbox ;
- aucune destination brute, ciphertext ou digest retourné par l’API de listing ;
- mauvaise clé => déchiffrement refusé ;
- destination révoquée => résolution refusée ;
- écriture API protégée par same-origin + authentification + Turnstile via le garde-fou d’écriture existant ;
- aucun appel réseau d’envoi n’est implémenté dans cette tranche.

## Schéma / readiness

La migration `0015` ajoute la 32e table V2 requise :
`modaryx_v2_notification_destinations`.

Le manifest D1 contrôlé devient donc :
- séquence `0001 → 0015` ;
- **15 migrations** ;
- **32 tables V2 requises** après replay local.

## Ce qui reste OPEN

Cette tranche ne ferme aucun blocker réel :
- pas d’application D1 remote ;
- pas de clé réelle configurée ;
- pas de provider activé ;
- pas d’email envoyé ;
- pas de push envoyé ;
- pas de preuve appareil réelle ;
- pas de modification DNS ;
- pas de cutover.

Toute application D1 distante reste soumise au pré-export/backup, à l’identité exacte de cible et à une autorisation explicite séparée.
