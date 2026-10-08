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


## 9. Candidat courant implémenté — Premium reconciliation R2

Produit :
- PR #269
- merge SHA : `cf7d7e6eb922f160e2125554a50134249025be7f`
- source candidat : `c9d7024c1fb69762c5a1d546a42713c6900e93c2`

Portée :
- architecture React/Vite/Workers conservée ;
- aucun nouveau provider, backend, entitlement, dépendance ou asset ;
- couche visuelle R2 ajoutée en dernier ;
- anciens overrides qui imposaient le rendu compact/no-hero retirés ;
- surfaces internes réconciliées vers davantage de profondeur et hiérarchie éditoriale.

Preuve fraîche :
- run `37732973675` : **success**
- artifact `11530203934`
- digest `sha256:262890fc81ea30b5ef20e0a51d67ec88dd318198c9dd569fb5b72afa5b8ea7ad`
- captures : **16**
  - 8 desktop 1440×1024
  - 8 mobile 390×844
- build V2 : **TERMINÉ**
- tests sites : **TERMINÉ**

Référence machine :
`docs/MODARYX-V2-PREMIUM-RECONCILIATION-R2-EVIDENCE-20261008.json`.

Inspection assistant :
**TERMINÉE en support uniquement**. Le candidat corrige clairement l'ancien rendu plat/maquette, mais cette inspection **ne remplace pas** l'acceptation propriétaire.

État du blocker :
- candidat implémenté : **TERMINÉ**
- captures fraîches : **TERMINÉ**
- acceptation propriétaire : **PREUVE MANQUANTE**
- `owner-visual-reconciliation-current` : **BLOQUÉ / OPEN**

Aucun PASS VF final n'est déclaré.


## 10. Candidat Premium reconciliation R3 — profondeur éditoriale

Produit :
- PR #271
- merge SHA : `d0570433bd75088fd7bff3eb05162fa82f8123b5`
- source candidat : `48f8ca0ae929210b20641f14ef21b546cdf04cae`

Portée :
- architecture React/Vite/Workers conservée ;
- aucun nouvel asset ;
- aucune nouvelle dépendance ;
- aucun backend/route/data/entitlement modifié ;
- couche `premium-reconciliation-r3.css` chargée en dernier ;
- Games / Collections / Créateurs / Mods réorganisés vers une composition éditoriale asymétrique ;
- Communauté rendue plus organique ;
- navigation Compte rendue plus discrète ;
- mobile recomposé séparément.

Preuve fraîche :
- run `37737395752` : **success**
- job `113179958047`
- artifact `11532601192`
- digest `sha256:0ac583c63e27a9d3a31939f1bded63c47b2f63cc7aedcc10bd74915a74bdbbbf`
- captures : **16**
  - 8 desktop 1440×1024
  - 8 mobile 390×844
- build V2 : **TERMINÉ**
- tests sites : **TERMINÉ**

Inspection assistant : **TERMINÉE en support uniquement**.
La R3 réduit davantage l'effet catalogue/dashboard constaté sur la R2, mais ne remplace pas l'acceptation propriétaire.

État :
- candidat R3 implémenté : **TERMINÉ**
- captures fraîches : **TERMINÉ**
- `owner-visual-reconciliation-current` : **BLOQUÉ / OPEN**
- acceptation propriétaire : **PREUVE MANQUANTE**

Aucun PASS VF final n'est déclaré.


## 11. Candidat courant — Premium Living Atlas R16

Produit :
- PR #282
- merge SHA : `4a993d94a386ac0fd5cc8dcb27bd0482c1a2dcda`
- source candidat : `994aeeae317015fbfb6d8d271655d00b4ef2f250`

Direction :
- R15 remplace la grammaire visuelle répétitive par des scènes éditoriales asymétriques ;
- R16 différencie les familles de pages avec des atmosphères distinctes ;
- Découvrir / Game Hub conservent la signature loup + dragon ;
- Jeux / Mods / Collections / Créateurs exploitent des scènes différentes de la planche Living Threshold ;
- Communauté devient plus organique et moins "carte SaaS" ;
- Compte reste volontairement plus calme et privé ;
- mobile est recomposé séparément.

Preuves fraîches :
- R15 : run `37767448754`, job `113278446863`, **success**, 16 captures ;
- R15 artifact `11545606513`, digest `sha256:ff8edeaa2cb37c12e88571c2c1298e2672c442762b64db8381258c87baefc3f2` ;
- R16 : run `37768198037`, job `113280917134`, **success**, 16 captures ;
- R16 artifact `11545572439`, digest `sha256:e95ac03ded1b316ed3c743418aa68778f9f691ef6590e2da58c7a3ff062ee72f` ;
- build V2 : **TERMINÉ** ;
- `test:sites` : **TERMINÉ**.

Inspection assistant :
**TERMINÉE en support uniquement**. R16 est matériellement plus différencié que R14/R15, notamment sur Jeux/Mods/Collections/Créateurs mobile et Communauté/Compte desktop.

Cette inspection ne remplace pas la décision propriétaire.

État :
- candidat R16 implémenté : **TERMINÉ**
- captures fraîches : **TERMINÉ**
- `owner-visual-reconciliation-current` : **BLOQUÉ / OPEN**
- acceptation propriétaire : **PREUVE MANQUANTE**

Référence machine :
`docs/MODARYX-V2-PREMIUM-RECONCILIATION-R16-EVIDENCE-20261008.json`.

Aucun PASS VF final n'est déclaré.
