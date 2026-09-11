# MODARYX MODS — Inventaire d'idées avant VF

Statuts : `INTÉGRÉ`, `PARTIEL`, `À FAIRE`, `BLOQUÉ EXTERNE`.

| Axe | Statut | Décision VF |
|---|---|---|
| Identité MODARYX MODS | PARTIEL | Terminer le nettoyage public de l'ancienne marque et uniformiser logo/favicon/manifest. |
| Design Premium HD global | PARTIEL | Garder la structure/placement décidé, refaire la finition de toutes les pages au même niveau. |
| Catalogue multigaming | PARTIEL | Le faire évoluer vers une découverte par jeu, catégorie, compatibilité et confiance. |
| GTA 6 Mods | À FAIRE | Créer un hub SEO éditorial riche, architecture de catégories, guides et fiches mod. |
| Red Dead Redemption 2 Mods | À FAIRE | Créer le deuxième hub de référence sur la même architecture extensible. |
| Autres jeux | À FAIRE | Prévoir un modèle réutilisable, sans créer de pages vides. |
| Recherche | PARTIEL | Recherche globale jeu/mod/catégorie/créateur avec états compréhensibles. |
| Creator Studio | PARTIEL | Conserver le manifeste local-first et améliorer onboarding, aperçu et UX Premium HD. |
| Profils créateurs | PARTIEL | Uniformiser design, provenance, projets, collections et export local. |
| Communauté | PARTIEL | Préserver modèle local/exportable, rendre l'expérience cohérente avec le catalogue. |
| Provenance / signatures | INTÉGRÉ-PARTIEL | Conserver fail-closed, mieux exposer les preuves sans faux badge. |
| Smart Profile | PARTIEL | Garder local-only, clarifier ce qui est analysé et ce qui reste inconnu. |
| Modaryx Guide | PARTIEL | Assistance contextuelle, bornée, explicative, jamais substitut aux frontières de sécurité. |
| Sécurité | PARTIEL | Harmoniser avec le nouveau branding et renforcer lisibilité des preuves/limites. |
| Téléchargements | PARTIEL | Design final + états de version/hash/provenance explicites. |
| Documentation | PARTIEL | Repenser navigation, guides par tâche, liens vers jeux/mods/outils. |
| SEO par jeu/catégorie/mod | À FAIRE | Titres, metas, canoniques, données structurées et contenu substantiel. |
| Sitemap / robots | PARTIEL | Finaliser pour `modaryxmods.com` après architecture définitive. |
| Responsive / accessibilité | PARTIEL | QA complète clavier, contraste, mobile/tablette, reduced-motion. |
| Performance | PARTIEL | Garder le statique léger, optimiser assets et limiter animations coûteuses. |
| DNSSEC `modaryxmods.com` | BLOQUÉ EXTERNE | Attente IONOS pour publication DS ; ne bloque pas design/contenu. |
| Suppression Cloudflare `getnovaforge.com` | BLOQUÉ EXTERNE | Seulement après DNSSEC complet + preuve HTTPS fraîche. |

## Points GitHub récupérés

- Les anciennes branches `site/premium-hd-final-v1` et `site/supernova-premium-hd-v1` sont derrière `main` et n'ont plus de commits uniques à récupérer.
- La PR brouillon de cutover domaine contient encore des éléments à trier (`robots.txt`, `sitemap.xml`, documentation de cutover) et ne doit pas être fusionnée en bloc dans son état historique.
- Les noms internes historiques `nova-*` peuvent rester temporairement si leur renommage n'apporte aucun bénéfice utilisateur et risque de casser compatibilité/provenance ; aucune ancienne marque ne doit rester visible comme identité publique.

## Critère de sortie

La VF visuelle ne sera considérée prête que lorsque chaque ligne `À FAIRE` pertinente pour le lancement aura été intégrée ou explicitement remplacée par une meilleure solution, puis vérifiée sur desktop et mobile.
