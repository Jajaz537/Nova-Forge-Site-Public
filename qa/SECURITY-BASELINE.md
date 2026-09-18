# MODARYX — baseline sécurité source

Périmètre : candidat PR #12 à partir de `7454e13`. Cette preuve couvre uniquement les sources statiques du dépôt ; elle ne valide ni le compte Cloudflare, ni l’origine TLS, ni un navigateur/appareil externe.

## Fermé dans ce lot

- Surface actuelle : 17 pages statiques, aucun fichier Pages Functions, Worker applicatif, SSR, API ou backend dans le dépôt.
- Injections serveur, authentification distante, sessions, autorisations serveur et CSRF : **NON APPLICABLE dans l’architecture actuellement présente**. À rouvrir dès l’ajout d’un service distant.
- Les formulaires Studio et Communauté restent locaux : validation, import/export et stockage navigateur, sans publication distante.
- CSP stricte présente dans les 17 documents publics ; aucun script, style ou gestionnaire d’événement inline.
- Dernier usage de `innerHTML` retiré du menu partagé ; le libellé est construit avec des nœuds et `textContent`.
- Recherche de secrets ciblée : aucun token, mot de passe, clé privée ou affectation secrète littérale détecté. Cette recherche n’est pas une preuve d’historique Git exhaustif.

## À poursuivre

- **BLOQUÉ** : inventaire WAF, Bot Fight Mode, Security Events et paramètres TLS internes tant que le tableau Cloudflare impose la vérification humaine au navigateur Work.
- **MOYENNE / ZONE PROTÉGÉE** : `actions/checkout@v4` reste un tag mutable ; le cutover et la désactivation HTTP/3 conservent des déclencheurs `push` capables d’atteindre des opérations Cloudflare. Le harnais refuse toute modification de ces workflows dans ce lot. Durcissement à traiter séparément avec validation de l’automatisation.
- **PREUVE MANQUANTE** : historique Git complet des secrets et rotation éventuelle ; le dépôt courant seul est couvert.
- **PREUVE MANQUANTE** : CSP et headers de toutes les réponses dynamiques futures ; aucune surface dynamique n’existe actuellement.
- **PREUVE MANQUANTE** : `/.well-known/security.txt`, car aucune adresse de contact sécurité n’est validée pour publication.
- Le mode SSL global, DNS, DNSSEC, IONOS, MX et paramètres Cloudflare restent gelés et inchangés.

Preuve automatisée : `qa/check-security-baseline.py` et `qa/security-baseline-checks.json`.
