# MODARYX — couverture sécurité adaptée à OWASP ASVS

Date : 18 septembre 2026. Révision source de départ : `7454e13`. Portée : site statique MODARYX de la PR #12, sans backend, API, SSR, Pages Functions ni authentification active. Cette matrice adapte les familles ASVS à la surface réellement livrée ; elle ne constitue pas une certification ASVS.

| Famille | État | Preuve actuelle | Risque / prochaine preuve |
|---|---|---|---|
| Architecture et frontière de confiance | TERMINÉ — source | 17 pages statiques ; aucun runtime serveur trouvé ; contrats distants clairement non connectés | Réouvrir avant tout ajout de Function, Worker applicatif, API ou compte |
| Authentification | NON APPLICABLE — candidat actuel | Aucun login, cookie de session, token ou route privée dans les sources | Critique dès qu’un service d’identité existe |
| Gestion des sessions | NON APPLICABLE — candidat actuel | Aucun cookie, sessionStorage de session ou backend | Critique dès qu’une session distante existe |
| Autorisation | NON APPLICABLE — candidat actuel | Toute la surface est publique ; aucune ressource privée livrée | Critique dès qu’un rôle, compte ou contenu privé existe |
| Validation, logique et injections | TERMINÉ — source statique | Validation locale testée ; zéro sink DOM dangereux ; aucune surface SQL/commande/template/XXE/SSRF serveur | Les URI déclaratives du Studio restent des données exportées, jamais récupérées par le site |
| Cryptographie | EN COURS | SHA-256 Web Crypto local et états fail-closed testés ; aucun secret client | Une empreinte seule ne prouve ni provenance ni signature ; artefacts/signatures réels absents |
| Erreurs et journalisation | TERMINÉ — périmètre local | 404 dédiée ; erreurs locales bornées ; aucun log serveur ni stack backend exposable | Revoir avec tout futur service distant |
| Protection des données | EN COURS | Aucun tracker/cookie/tiers ; brouillons et préférences dans localStorage ; contenu explicite sur la persistance locale | Validation juridique et inventaire des droits restent externes |
| Communication | PREUVE MANQUANTE — compte/infrastructure | HTTPS public et redirection HTTP→HTTPS observés ; aucune ressource mixte source | Mode origine Full (strict), paramètres Cloudflare et sous-domaines gelés/non prouvés |
| Code malveillant / supply chain | EN COURS | Aucun package runtime ni dépendance tierce du site ; recherche de secrets ciblée négative | Historique Git secrets non exhaustif ; actions GitHub tierces sur tags mutables : MOYENNE |
| Logique métier | TERMINÉ — périmètre actuel | Publication/téléchargement distants verrouillés ; états inconnus non promus ; formulaires locaux sans effet serveur | Publication, modération et artefacts restent absents, pas simulés comme livrés |
| Fichiers et ressources | EN COURS | Import local et vérification de format testés en source ; fichiers sensibles usuels renvoient 404 en production | Import/export natif et droits des assets exigent validation externe |
| API et services web | NON APPLICABLE — candidat actuel | Aucun endpoint applicatif ; fetch limités aux JSON locaux de même origine | Revoir CORS, CSRF, rate limit et BOLA à l’ajout d’une API |
| Configuration | EN COURS | CSP document stricte, `nosniff`, HSTS, frame protection et politique permissions observés | Headers du preview/production et compte Cloudflare à réconcilier ; `security.txt` sans contact validé |

## Décision de gate

- **Aucune vulnérabilité CRITIQUE ou HAUTE confirmée dans la source statique actuelle.** Cela n’est pas une preuve de sécurité globale de l’infrastructure.
- Les fonctions distantes absentes ne sont pas marquées PASS : comptes, publication, modération, signatures, stockage et réparation restent hors de la surface livrée et bloquent toute revendication de ces capacités.
- Les changements DNS, DNSSEC, nameservers, IONOS, mode SSL global et configuration Cloudflare critique restent interdits dans ce chantier.
- Les preuves externes encore requises sont maintenues dans `FINAL-EXTERNAL-VALIDATION-MATRIX.md`.

Preuves associées : `qa/SECURITY-BASELINE.md`, `qa/security-baseline-checks.json`, `qa/check-security-baseline.py`, `_headers`, CSP des 17 pages et contrôles de production consignés dans le checkpoint de travail.
