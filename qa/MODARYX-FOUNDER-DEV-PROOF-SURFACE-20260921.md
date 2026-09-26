# MODARYX — micro-surface temporaire de preuve Fondateur DEV — 21 septembre 2026

Statut : **TERMINÉ — preuves runtime Fondateur acquises ; micro-surface retirée dans le candidat de fermeture**.

## Pourquoi cette surface existe

ChatGPT Work a confirmé :
- compte Fondateur Auth0 DEV attribué ;
- session `authority.role=founder` active ;
- capacités founder / administration / modération / recours visibles ;
- aucun secret/token exposé.

Les tentatives suivantes ont échoué pour une raison navigateur, pas pour une raison d'autorisation :
- appels scriptés : `TypeError: fetch is not a function` ;
- navigation top-level vers les routes API : `net::ERR_BLOCKED_BY_CLIENT`.

Le cookie MODARYX reste HttpOnly et ne doit pas être extrait.


### Échec runtime ciblé après déploiement #145

Première exécution du bouton modération :
- rôle serveur `founder` confirmé ;
- administration / modération / recours : `oui / oui / oui` ;
- session Fondateur présente ;
- aucun token/secret exposé ;
- résultat : **ÉCHEC — `origin-mismatch`** avant création du résultat de preuve ;
- recours non exécuté conformément à la procédure d'arrêt.

Cause isolée :
le garde générique comparait strictement `Origin` à `request.url.origin`. Le navigateur Work fournit un contexte de navigation Preview qui peut conserver un signal navigateur `Sec-Fetch-Site: same-origin` tout en faisant échouer cette comparaison stricte.

Correction ciblée :
- hostname serveur exact Preview toujours obligatoire ;
- HTTPS toujours obligatoire ;
- session `modaryx:founder` toujours obligatoire ;
- POST accepté uniquement si :
  - `Origin` vaut exactement `https://design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev`, **ou**
  - `Sec-Fetch-Site` vaut exactement `same-origin` ;
- `same-site` et `cross-site` ne sont jamais acceptés comme fallback.

Après cette correction, rejouer **la preuve modération seule**. Le recours reste interdit tant que modération n'est pas verte.

### Preuve runtime modération acquise — 22 septembre 2026

Après réauthentification complète du compte Fondateur DEV, la mutation modération a été exécutée via le vrai handler.

Résultat exact :
- `proof=moderation` ;
- `httpStatus=200` ;
- `moderationState=held-for-review` ;
- `publicationState=received` ;
- `receiptCreated=true` ;
- `cleanupSucceeded=true` ;
- erreur : aucune.

État : **TERMINÉ — preuve runtime modération Fondateur DEV acquise**.

La fixture et ses receipts temporaires ont été nettoyés. Aucune donnée de preuve persistante n'est revendiquée.

La modération ne doit pas être rejouée sans nouvelle raison technique.

## Route temporaire

`/founder-proof-dev`

Cette route est volontairement :
- sans JavaScript ;
- sans `fetch`, XHR ni `sendBeacon` ;
- accessible uniquement sur le hostname exact :
  `design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev` ;
- protégée par session MODARYX + permission exacte `modaryx:founder` ;
- protégée par same-origin sur POST ;
- `no-store`, `noindex`, `nofollow`, CSP `form-action 'self'`.

Hors hostname Preview stable, elle retourne 404.

## Preuve modération

Le bouton HTML :
1. crée un profil + une soumission DEV éphémères ;
2. conserve `abuse_state=passed`, `moderation_state=pending` ;
3. construit une requête JSON interne vers le **vrai handler** :
   `/api/v1/moderation/decisions` ;
4. transmet uniquement le cookie de session reçu par le navigateur au handler interne ;
5. demande une décision `hold` de catégorie `policy-violation` ;
6. exige la réauthentification récente déjà imposée par le handler réel ;
7. exige HTTP 2xx + receipt créé ;
8. supprime ensuite receipts, soumission et profil de preuve ;
9. n'affiche PASS que si le nettoyage est confirmé.

## Preuve recours

Le second bouton :
1. crée un fixture DEV éphémère avec décision + recours de preuve ;
2. appelle le **vrai handler** :
   `/api/v1/moderation/appeal-outcomes` ;
3. soumet un résultat `upheld` ;
4. exige la permission de revue des recours héritée côté Fondateur ;
5. exige la réauthentification récente ;
6. exige HTTP 2xx + outcome receipt créé ;
7. nettoie intégralement le fixture ;
8. n'affiche PASS que si le nettoyage est confirmé.

## Garanties

La surface ne retourne jamais :
- cookie ;
- token Auth0 ;
- permissions brutes ;
- secret Cloudflare ;
- secret Auth0 ;
- clé WeatherAPI ;
- clé privée de signature.

Elle affiche uniquement :
- rôle serveur ;
- capacités booléennes ;
- statut HTTP de la mutation ;
- état produit non sensible ;
- booléen receipt créé ;
- booléen nettoyage confirmé.

### Preuve runtime recours acquise — 22 septembre 2026

La mutation de recours Fondateur DEV a été exécutée via le vrai handler après confirmation de la session Fondateur et de la capacité Recours.

Résultat exact :
- `proof=appeals` ;
- `httpStatus=200` ;
- `result=upheld` ;
- `moderationState=rejected` ;
- `publicationState=received` ;
- `receiptCreated=true` ;
- `cleanupSucceeded=true` ;
- erreur : aucune.

État : **TERMINÉ — preuve runtime recours Fondateur DEV acquise**.

Les deux preuves privilégiées Fondateur sont donc acquises :
- modération : HTTP 200 + receipt créé + cleanup confirmé ;
- recours : HTTP 200 + receipt créé + cleanup confirmé.

Aucun cookie, token ou secret n'a été extrait ou affiché.

### Retrait de la micro-surface

Dans ce candidat de fermeture :
- `functions/founder-proof-dev.js` est supprimé ;
- `qa/check-founder-dev-proof-surface.cjs` devient un garde anti-résurrection qui exige l'absence de la route ;
- le workflow source conserve ce garde afin d'empêcher une réintroduction accidentelle ;
- les documents de preuve restent conservés pour historique et provenance.

La surface temporaire ne fait donc plus partie du candidat MODARYX.

## Règle de retrait

Cette surface est **temporaire**.

Les deux preuves runtime ont été acquises et le candidat de fermeture retire `functions/founder-proof-dev.js`. Le checker dédié est conservé sous forme de garde anti-résurrection. La mission Fondateur DEV ne doit être considérée fermée qu'après micro-proof verte de ce retrait et fusion du candidat dans Work.

Aucun `main`, production, DNS/DNSSEC/nameserver ni full replay.
