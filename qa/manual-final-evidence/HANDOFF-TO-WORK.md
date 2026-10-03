# Handoff à Work quand l'environnement redémarre

## État à relire avant toute action

- PR #152
- HEAD attendu au moment de création de ce kit : `03e41855c7b51fcd499ae7aaaebf0eb21d4da493`
- Preview immuable : `https://6f813d33.nova-forge-site-public.pages.dev`
- Bloc artistique courant : TERMINÉ
- `visualGrowth.status=awaiting-assets` : état courant à conserver
- VF globale : non déclarée
- Full replay : interdit tant que les dépendances réellement requises ne sont pas fermées

## Ce que Work doit faire avec ce kit

1. Vérifier Git frais : branche, HEAD, nouveaux commits et travail parallèle.
2. Comparer ce kit à l'état canonique du dépôt.
3. Si le HEAD a changé, vérifier si la Preview et les protocoles doivent être actualisés.
4. Intégrer les fichiers dans `qa/manual-final-evidence/` uniquement si aucune collision n'existe.
5. Ne modifier aucune page produit pour cette intégration documentaire.
6. Mettre à jour checkpoint/anti-oubli uniquement si nécessaire pour pointer vers le kit, sans fermer les preuves elles-mêmes.
7. Lancer seulement les micro-proofs source/documentation/anti-oubli pertinentes.
8. Fournir SHA, diff, runs et Git propre.
9. Ne pas lancer le full replay.

## Quand les preuves utilisateur reviennent

Pour chaque campagne :

1. vérifier que la preuve correspond au bon HEAD/Preview ;
2. vérifier qu'elle n'expose aucun secret ;
3. distinguer PASS ciblé, échec et preuve incomplète ;
4. si échec : isolation → correction ciblée → micro-proof → nouvelle preuve manuelle seulement sur le périmètre affecté ;
5. ne modifier le checkpoint qu'après preuve suffisante.

## Important

Ce kit est préparatoire. Sa présence ne transforme aucune ligne `PREUVE MANQUANTE` ou `BLOQUÉ` en `TERMINÉ`.
