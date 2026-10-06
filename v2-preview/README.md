# MODARYX V2 — Preview engineering

Root isolé créé le 2026-10-06 depuis le candidat produit bleu nuit + violet.

- **Pas production**
- **Noindex**
- **Pas de cutover**
- **Pas de DNS/Cloudflare critique**
- **Aucune donnée réelle nécessaire**

Commandes :

```bash
npm ci
npm run build
npm run test:sites
npm run preview -- --host 127.0.0.1 --port 4175
```

La preuve navigateur complète est pilotée par le workflow `MODARYX V2 Preview Root Proof`.
