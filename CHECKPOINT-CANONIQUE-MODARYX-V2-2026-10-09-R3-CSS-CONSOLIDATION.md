# CHECKPOINT-CANONIQUE — MODARYX V2 — R3 CSS CONSOLIDATION — 2026-10-09

**État opérationnel : EN COURS**. Ce checkpoint reprend le chantier technique R3 **sans remplacer** les obligations juridiques/commerciales et les registres du checkpoint `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-07-P0-RIGHTS-FR-EU.md`.

## Portée / Git
- Produit : **MODARYX Web V2**, design Premium bleu nuit/cyan/violet, **jamais V1/ancien design**.
- Dépôt : `Jajaz537/Nova-Forge-Site-Public`.
- PR de travail : [#292](https://github.com/Jajaz537/Nova-Forge-Site-Public/pull/292), **draft ouverte**.
- Branche : `design/modaryx-v2-vf-architecture-r3-20261008`.
- HEAD testé pour ce lot : `2dd3734e92275c30a4225118b8c6b254b841d6da`.
- Branche produit de référence : `design/modaryx-v2-blue-violet-product-20261005`.
- Aucun merge, main, DNS/DNSSEC/nameserver, Cloudflare prod, D1/R2 prod, paiement ou cutover.
- Ne jamais écraser un travail parallèle sans nouveau contrôle branche/SHA.

## Lots R3 terminés sur le code candidat
1. Commit `c211dd959b9e9d8a51190cb57416fbc3b645871b` : suppression groupée de **89 déclarations de même valeur** ultérieurement définies au même sélecteur et contexte ; 5 fichiers R15–R19.
2. Commit `2dd3734e92275c30a4225118b8c6b254b841d6da` : suppression groupée de **232 déclarations primitives remplacées par une déclaration ultérieure !important**, sélecteur + contexte identiques, avec exclusions conservatrices des expressions variables/modernes ; 5 fichiers R15–R19.
3. **321 déclarations consolidées** en deux commits, sans modifier le CSS VF final ni les sources d'images et sans changement de fonctionnalité.
4. Build et tests Chrome déclenchés sur chaque HEAD par GitHub Actions. Validation visuelle propriétaire exhaustive **PREUVE MANQUANTE** : ne pas la déduire des tests automatiques.

## Preuves de laboratoire — SHA `2dd3734e92275c30a4225118b8c6b254b841d6da`
- Performance Candidate Proof, run `37927953636` : **BLOQUÉ** uniquement par le contrat CSS `CSS gzip 46470 > 22000`.
- Bundle CSS gzip level-9 : **46 470 octets**, plafond **22 000** (écart **24 470**).
- Comparaison : 47 511 au point de départ, 47 390 après le premier lot, **46 470 après le deuxième**. Gain total mesuré **1 041 octets gzip**.
- Bundle JS gzip : **104 927 octets**, plafond **105 000**, marge **73 octets**.
- Desktop lab 1440×1024 : LCP **700 ms**, CLS **0.008421**, réponse route **210.9 ms**, tous sous les budgets du contrat.
- Mobile lab 390×844 : LCP **1 492 ms**, CLS **0**, réponse route **45.7 ms**, tous sous les budgets du contrat.
- Preview Root Proof : **TERMINÉ — PASS**, run `37927953555`.
- Production Candidate Root Proof : **TERMINÉ — PASS**, run `37927953540`.
- Production Rehearsal : **BLOQUÉ** par le même CSS budget, run `37927953516`.
- Ces métriques LAB ne sont pas des Core Web Vitals terrain ; la production, l'approbation esthétique et le release PASS restent ouverts.

## Prochaine tâche : optimisation architecturale, pas micro-chasse infinie
Le bundle CSS reste trop volumineux avec **23 imports** depuis `v2/src/main.jsx`. Ne pas tricher via plafond relevé, CSS différé seulement pour contourner la mesure, ou disparition de composants/design. Explorer une consolidation AST robuste et les CSS réellement spécifiques aux routes **sans dégrader FOUC, accessibilité, responsive, reduced-motion ou UX**. Refaire build mesuré, comparaisons visuelles desktop/mobile et micro-proofs frais au SHA final.

## Trois gates indépendantes
- **VF TECHNIQUE : EN COURS** — budget CSS BLOQUÉ ; visuel Premium propriétaire PREUVE MANQUANTE ; Previews et candidats PASS ciblés seulement.
- **LAUNCH-READINESS COMMERCIALE : EN COURS** — ni prix ni modèle commerciaux validés par ce lot.
- **LEGAL / COMPLIANCE : BLOQUÉ / PREUVE MANQUANTE pour lancement FR/UE** — mêmes faits manquants que checkpoint 2026-10-07 (provenance/droits assets, opérateur, contrats, privacy, DSA, taxes et revues nécessaires). Aucun PASS juridique inventé.

## Anti-oubli et séparation
MODARYX Web distinct de MODARYX OS Public/Fondateur ; « Nova Forge » provenance/legacy seulement. Aucun mélange avec écosystème jeu/site 18+. Valeur Premium, performance, inclusion, privacy by design et qualité restent obligatoires. Préserver les preuves et le legacy guard byte-locké ; .NET OS 10.0.302 inchangé.
