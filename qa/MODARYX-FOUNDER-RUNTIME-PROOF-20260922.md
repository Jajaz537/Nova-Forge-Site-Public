# MODARYX — preuve runtime Fondateur DEV — 22 septembre 2026

Statut : **TERMINÉ — modération + recours acquis ; micro-surface temporaire retirée du candidat de fermeture**.

## Contexte

- Branche Work de référence avant retrait : `design/modaryx-premium-hd-20260914-work`.
- HEAD de référence : `11d319fc38037cd944d70dba0b18902440eab58e`.
- Rôle serveur confirmé : `founder`.
- Administration / Modération / Recours : oui / oui / oui.
- Aucun token, cookie ou secret exposé.

## Modération

Après réauthentification complète :
- `proof=moderation`
- `httpStatus=200`
- `moderationState=held-for-review`
- `publicationState=received`
- `receiptCreated=true`
- `cleanupSucceeded=true`
- erreur : aucune

## Recours

- `proof=appeals`
- `httpStatus=200`
- `result=upheld`
- `moderationState=rejected`
- `publicationState=received`
- `receiptCreated=true`
- `cleanupSucceeded=true`
- erreur : aucune

## Retrait

Les deux fixtures DEV ont été nettoyées par la micro-surface.

Le candidat de fermeture :
- supprime `functions/founder-proof-dev.js` ;
- conserve l'historique dans `qa/MODARYX-FOUNDER-DEV-PROOF-SURFACE-20260921.md` ;
- transforme `qa/check-founder-dev-proof-surface.cjs` en garde anti-résurrection.

Aucune promotion `main`, aucune production, aucun DNS/DNSSEC/nameserver et aucun full replay ne font partie de cette preuve.
