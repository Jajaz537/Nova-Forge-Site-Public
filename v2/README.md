# MODARYX V2 — Candidat de production

Root réel V2 créé le 2026-10-06 depuis la branche design produit bleu nuit + violet.

- **Root : `v2/`**
- **Stack : React 19.2.0 + Vite 6.4.2**
- **Noindex tant que le cutover n'est pas autorisé**
- **Aucune modification de `main`**
- **Aucun DNS / DNSSEC / nameserver / réglage Cloudflare critique**
- **Service Worker présent mais non enregistré automatiquement avant le gate PWA/cutover**
- **Migration navigateur V1 → V2 non destructive**

Commandes :

```bash
npm ci
npm run build
npm run test:sites
npm run preview -- --host 127.0.0.1 --port 4178
```

La VF globale reste séparée du fait que ce root existe.
