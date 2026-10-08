# MODARYX V2 — Réconciliation visuelle propriétaire — 2026-10-08

**État canonique : BLOQUÉ jusqu'à nouveau candidat visuel + validation propriétaire fraîche**

## 1. Décision propriétaire fraîche

Le 8 octobre 2026, le propriétaire a rejeté le rendu courant de MODARYX Web comme :
- ancien design ;
- rendu de type maquette ;
- insuffisant pour la cible Premium/VF.

Cette décision est postérieure au canon visuel du 5 octobre 2026 et le **supersède pour la direction visuelle courante**.

Les preuves historiques restent conservées ; elles ne sont ni supprimées ni réécrites.

## 2. Ce qui est supersédé

Le document :
`docs/MODARYX-V2-DESIGN-CANON-20261005.md`

et les preuves associées :
- Game Hub product-first bleu/violet ;
- comparaison normalisée ;
- revue visuelle déléguée sur le candidat V2 de cette période ;

restent des **preuves historiques/provenance**, mais ne constituent plus une référence d'acceptation visuelle pour la VF courante.

Le blocker machine :
`owner-visual-reconciliation-current`
est désormais OPEN pour compatibilité du gate ; son état canonique projet est **BLOQUÉ**.

## 3. Ce qui reste à conserver absolument

La réconciliation ne doit pas revenir à une ancienne architecture statique.

Conserver de la V2 actuelle :
- architecture React/Vite/Workers ;
- routes et navigation produit actuelles ;
- Game Hub et flows fonctionnels ;
- recherche, collections, créateurs, communauté, compte, notifications ;
- backend/client et contrats déjà prouvés ;
- accessibilité structurale et comportements clavier ;
- PWA/caching/route metadata déjà prouvés ;
- protections droits/licences, modération et privacy ;
- séparation stricte de l'écosystème 18+ ;
- toutes les preuves techniques non visuelles encore valides.

## 4. Langage visuel à récupérer

Sources historiques de référence à réinterpréter, jamais à merger en bloc :
- PR #151 — `design/modaryx-ultra-premium-global-20260922`
- PR #152 — `design/modaryx-ultra-premium-global-pass2-20260922`
- PR #153 — `design/modaryx-canon-rebuild-nova-20260924`
- PR #161 — `design/modaryx-true-finishline-20261002`
- checkpoint du 21–24 septembre ayant enregistré une validation artistique humaine de la passe Premium.

Caractéristiques à retrouver :
- sensation de monde vivant et cohérent ;
- profondeur cinématique ;
- composition éditoriale plutôt que grille SaaS ;
- grandes respirations et hiérarchie typographique Premium ;
- lumière, relief, atmosphère et identité par famille de page ;
- contenu fonctionnel intégré comme objets dans le monde visuel, pas comme simple maquette de panneaux ;
- mobile recomposé, pas seulement rétréci ;
- contraste/accessibilité conservés.

## 5. Ce qu'il ne faut pas réintroduire aveuglément

Ne pas restaurer automatiquement :
- l'ancienne architecture HTML statique ;
- toutes les anciennes routes ;
- tous les anciens assets ;
- les anciennes couleurs beige/ivoire par simple copier-coller ;
- les anciens composants ou JS ;
- les anciennes preuves comme si elles couvraient le nouveau code ;
- tout visuel dont les droits commerciaux ne sont pas prouvés.

Le hero/royaume/loup/dragon historique ne doit être repris que si sa provenance et son rôle visuel sont compatibles avec le candidat courant et les droits applicables.

## 6. Matrice de réconciliation

| Surface V2 actuelle | À conserver | À réconcilier visuellement |
|---|---|---|
| Topbar | navigation, actions, accessibilité | présence Premium, matière, profondeur, hiérarchie |
| Découvrir | routes/CTA/flows | vraie entrée d'univers, pas écran SaaS |
| Game Hub | structure dense, recherche, profils | bandeau contextuel plus vivant, profondeur, objets intégrés |
| Jeux | données/états | cartes moins maquette, atmosphères distinctes |
| Mods & contenus | filtres/actions | surfaces éditoriales + média plus immersifs |
| Collections | modèle/flows | composition de collection Premium |
| Créateurs | données/flows | identité créateur plus éditoriale |
| Communauté | fonctionnalités | monde plus humain/organique |
| Compte/notifications | fonctions | traitement premium calme, moins panneau générique |
| Formulaires/admin | sécurité/états | lisibilité premium, vraie hiérarchie, pas décor gratuit |
| Mobile | fonctions/touch | recomposition dédiée, pas réduction desktop |

## 7. Critères de fermeture du blocker visuel

Le blocker `owner-visual-reconciliation-current` ne peut être fermé qu'avec :
1. architecture V2 actuelle préservée ;
2. candidat visuel réconcilié réellement implémenté ;
3. build/tests ciblés verts ;
4. captures fraîches desktop + mobile liées au SHA ;
5. aucune régression accessibilité/overflow critique ;
6. validation propriétaire explicite du nouveau rendu.

Une simple doc, un mockup, une capture d'une ancienne branche ou un PASS automatisé ne ferme pas ce blocker.

## 8. États de gates

- VF TECHNIQUE : **EN COURS**
- DIRECTION VISUELLE VF : **BLOQUÉ**
- LAUNCH-READINESS COMMERCIALE : **EN COURS**
- LEGAL / COMPLIANCE : **BLOQUÉ / PREUVE MANQUANTE**
- PRODUCTION / CUTOVER : **BLOQUÉ**

Aucun prix, paiement, provider, DNS, production ou cutover n'est modifié par cette décision.
