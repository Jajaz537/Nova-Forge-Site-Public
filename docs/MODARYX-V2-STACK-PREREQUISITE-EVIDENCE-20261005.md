# MODARYX V2 — preuve des prérequis techniques de sélection de stack

**Date : 2026-10-05**  
**Statut : EN COURS — prérequis mesurés, aucune stack finale sélectionnée**

## 1. Bundle baseline mesuré

Source :
- branche `design/modaryx-v2-blue-violet-product-20261005`
- commit visuel `cb1ed7973efec1b9a10535c6f4a85e191ecb1f56`
- workflow `MODARYX V2 Living Threshold Visual Proof`
- run `37363048084` — **SUCCESS**
- Vite `6.4.2`

Sortie production mesurée :

| Asset | Brut | Gzip |
|---|---:|---:|
| `index.html` | 0.67 kB | 0.39 kB |
| CSS principal | 108.28 kB | 19.67 kB |
| JS principal | 356.85 kB | 98.67 kB |

Conclusion :
- le prérequis `BUNDLE_BUDGET_MEASURED` est **PROVEN** ;
- cette mesure est une baseline du prototype React/Vite courant ;
- elle ne constitue pas une acceptation automatique du poids final ;
- le futur root V2 devra au minimum ne pas régresser sans justification et devra viser la réduction du JS initial sur les surfaces largement statiques.

## 2. Architecture V2

Éléments déjà stabilisés dans le dépôt :

- architecture produit V2 ;
- production surface map ;
- mapping V1 → V2 ;
- frontières adapters/modules ;
- stratégie fixtures/data ;
- plan de schéma ;
- API governance ;
- route cutover plan ;
- isolation frontend V2 ;
- storage/cache/SW migration contract.

Sources principales :
- `docs/MODARYX-V2-PRODUCT-ARCHITECTURE-20261003.md`
- `qa/modaryx-v2-production-surface-map.json`
- `docs/MODARYX-V2-ADAPTER-MODULE-BOUNDARIES-20261003.md`
- `docs/MODARYX-V2-ROUTE-CUTOVER-PLAN-20261003.md`

État : `V2_ARCHITECTURE_STABLE` = **PROVEN pour la décision de stack**.

Cela ne signifie pas que le root production existe déjà.

## 3. Exigences d'interaction

Éléments déjà matérialisés et prouvés :

- critical flows contract ;
- interaction states contract ;
- screen acceptance criteria ;
- browser product-flow proof ;
- keyboard reachability ;
- desktop/mobile overflow checks ;
- 87 captures multiscreen.

Sources :
- `docs/MODARYX-V2-INTERACTION-STATES-20261003.md`
- `docs/MODARYX-V2-CRITICAL-FLOWS-20261003.md`
- `docs/MODARYX-V2-SCREEN-ACCEPTANCE-CRITERIA-20261003.md`
- run visuel `37363048084`.

État : `INTERACTION_REQUIREMENTS_KNOWN` = **PROVEN pour la décision de stack**.

## 4. Auth/backend

Source :
`docs/MODARYX-V2-AUTH-BACKEND-STRATEGY-20261005.md`

État :
`AUTH_BACKEND_STRATEGY_DEFINED` = **PROVEN**.

## 5. Ce qui reste avant sélection finale

Toujours OPEN :

- `CORE_WIREFRAMES_COMPLETE` ;
- `HUMAN_TREE_TEST`.

La stack finale reste donc **NON SÉLECTIONNÉE**.

Aucune migration Workers/Pages, aucun root V2 et aucun changement Cloudflare critique ne sont autorisés par ce document.

**Résultat courant : 4 / 6 prérequis de sélection de stack prouvés.**
