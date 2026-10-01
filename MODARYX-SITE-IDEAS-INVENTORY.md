# MODARYX MODS — Inventaire d'idées avant VF

Réconciliation du 15 septembre 2026. Source opérationnelle : `CHECKPOINT-CANONIQUE-NOVA-FORGE-MODARYX-2026-09-15.md`. **MODARYX web et Nova Forge OS sont distincts.**

Le registre détaillé avec fichiers observés, écarts et actions est `qa/MODARYX-ANTI-OUBLI.md`. Les statuts ci-dessous concernent l'idée complète, pas uniquement l'existence d'un fichier. Une lecture de code ne vaut pas validation d'usage.

| Idée retenue | État | Décision / reste à faire |
|---|---|---|
| Identité MODARYX MODS | EN COURS | Conserver marques M et assets MODARYX ; vérifier les libellés visibles et les noms accessibles. |
| Design Premium HD global | EN COURS | Harmoniser seize pages ; preuves visuelles et responsive par page avant clôture. |
| Catalogue multigaming | EN COURS | Trois entrées de démonstration, filtres et favoris présents ; contenu réel encore absent. |
| Hubs GTA 6 et RDR2 | PREUVE MANQUANTE | Routes et contenu absents ; idée retenue non annulée. Publication conditionnée aux sources, droits et contenu substantiel. |
| Autres jeux / catégories / guides | EN COURS | Modèle de données réutilisable présent ; architecture éditoriale complète absente. |
| Recherche | EN COURS | Index statique local présent ; pas de service de recherche externe revendiqué. |
| Creator Studio | EN COURS | Brouillon UMM, validation de format, sauvegarde/export locaux ; publication distante absente. |
| Profils créateurs | PREUVE MANQUANTE | Contrats et diagnostic WebAuthn présents ; édition de profil et authentification de compte absentes. |
| Communauté et collections | EN COURS | Brouillons/collections locaux exportables ; aucun backend de publication. |
| Provenance et signatures | EN COURS | Empreinte locale et états séparés présents ; pas de signature du site ni attestation des démos. |
| Smart Profile | EN COURS | Observation indicative du navigateur ; aucune mesure de performances en jeu. |
| Guide MODARYX | PREUVE MANQUANTE | Présentation conceptuelle et assistance éditoriale ; pas de moteur de Guide connecté démontré. |
| Sécurité, documentation, vérification | EN COURS | Pages existantes ; précision des limites et QA à consolider. |
| Téléchargements | BLOQUÉ | `downloads.json` : `available:false`, zéro artefact ; conserver l'état indisponible. |
| SEO jeux / catégories / mods | PREUVE MANQUANTE | Hubs retenus absents ; ne pas générer de pages vides. |
| Sitemap / robots / canoniques | EN COURS | Évaluer les liens après architecture réelle ; configuration actuelle à préserver dans ce lot. |
| Responsive / accessibilité | EN COURS | Suivi par page, largeur et parcours ; pas de conformité globale sans preuves. |
| Performance | PREUVE MANQUANTE | Architecture statique conservée ; mesures navigateur et budgets à documenter. |

## Instructions historiques révoquées

L'inventaire précédent contenait une attente DS DNSSEC IONOS et une suppression Cloudflare de `getnovaforge.com` conditionnée à DNSSEC/HTTPS. **Ce sont des traces de l'ancien chantier, pas des tâches autorisées du chantier actuel.** L'ancien projet est abandonné ; ne pas supprimer, réactiver ou migrer d'infrastructure. Conserver `OLD_DOMAIN_UNTOUCHED`.

Les mentions des branches `site/premium-hd-final-v1`, `site/supernova-premium-hd-v1` et d'une PR de cutover reflètent une inspection historique. Leur état n'est pas une preuve actuelle. Le candidat de travail est la PR brouillon #12 ; vérifier son HEAD avant mutation, ne pas fusionner l'ancienne PR en bloc.

Les noms internes `nova-*` ne sont pas automatiquement obsolètes : schémas, clés de stockage et provenance exigent une migration distincte. Une mention de Nova Forge qui décrit réellement les OS peut rester, sans fusion des identités.

## Sortie

Une idée retenue doit être reliée à une capacité réelle, intégrée avec preuve, ou rester explicitement manquante. Ce registre ne valide ni ne reporte tacitement les hubs ou services absents. La VF n'est pas déclarée prête.
