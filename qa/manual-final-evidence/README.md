# MODARYX — Kit de preuves manuelles finales

**HEAD canonique vérifié :** `03e41855c7b51fcd499ae7aaaebf0eb21d4da493`  
**Preview immuable à utiliser :** https://6f813d33.nova-forge-site-public.pages.dev  
**PR #152 :** ouverte, non fusionnée  
**VF globale :** non déclarée

Ce kit prépare uniquement les preuves qui nécessitent un navigateur natif, un appareil physique, une technologie d'assistance réelle ou une entrée externe. Il ne remplace aucune preuve humaine ou appareil par une simulation.

## Règles

- Ne pas utiliser une ancienne Preview.
- Ne pas utiliser l'URL de branche si l'URL immuable ci-dessus fonctionne.
- Ne pas modifier `main`, la production, DNS, DNSSEC, nameservers ou IONOS.
- Ne pas activer `visualGrowth` : l'état attendu reste `visualGrowth.status=awaiting-assets`.
- Une anomalie visible doit être consignée ; ne pas la contourner pour obtenir un résultat vert.
- Une preuve n'est **TERMINÉE** qu'après examen de ses éléments par Nova/Work.
- En cas d'échec : noter l'erreur exacte, isoler le cas, ne pas refaire toute la campagne.

## Ordre recommandé pour l'utilisateur

1. `ZOOM-200-400.md`
2. `WINDOWS-SCREEN-READER.md`
3. `PASSKEY-REAL-DEVICE.md`
4. `PWA-PHYSICAL-DEVICE.md`
5. `TOUCH-DEVICE.md`
6. `SAFARI-VOICEOVER.md` si un appareil Apple réel est disponible
7. `EXTERNAL-DEPENDENCIES.md` pour les entrées non testables localement

Utiliser `EVIDENCE-REPORT-TEMPLATE.md` pour chaque campagne.

## Routes publiques courantes

- `index.html`
- `catalog.html`
- `search.html`
- `creator-studio.html`
- `community.html`
- `profiles.html`
- `ecosystem.html`
- `documentation.html`
- `security.html`
- `verify.html`
- `downloads.html`
- `project.html`
- `project-ember-textures.html`
- `project-balanced-latency-pack.html`
- `project-forge-night-experience.html`
- `games/index.html`
- `gta-6/index.html`
- `gta-6/mods/index.html`
- `gta-6/guides/index.html`
- `red-dead-redemption-2/index.html`
- `red-dead-redemption-2/mods/index.html`
- `red-dead-redemption-2/guides/index.html`
- `404.html`
