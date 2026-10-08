# MODARYX V2 — WORK HANDOFF — RÉCONCILIATION VISUELLE PREMIUM — 2026-10-08

**État : BLOQUÉ jusqu'à nouveau candidat visuel validé**
**Branche produit :** `design/modaryx-v2-blue-violet-product-20261005`
**HEAD de départ attendu :** `667c02632d9345ab9d7b194e792932c708b32529`

## 1. Décision fraîche

Le propriétaire rejette le rendu V2 courant comme ancien / type maquette.

Ne pas continuer à polir ce rendu comme s'il était le canon final.

Référence canonique :
`docs/MODARYX-V2-VISUAL-RECONCILIATION-20261008.md`

## 2. Ne pas faire

- ne pas merger PR #151/#152/#153/#161 en bloc ;
- ne pas remplacer la V2 React actuelle par l'ancien site HTML ;
- ne pas restaurer automatiquement toutes les anciennes couleurs/assets ;
- ne pas casser Game Hub, routes, backend/client, accessibilité, PWA ou protections déjà prouvées ;
- ne pas utiliser une ancienne capture comme preuve du nouveau HEAD ;
- ne pas activer de production/cutover.

## 3. Conserver la V2 fonctionnelle actuelle

Préserver :
- `v2/src/App.jsx` et sa logique de navigation/flows ;
- routes actuelles ;
- Game Hub dense et fonctionnel ;
- recherche globale ;
- jeux / contenus / collections / créateurs / communauté ;
- compte, notifications, profils ;
- composants backend reliés ;
- contrats droits/modération/privacy ;
- accessibilité clavier et structure sémantique ;
- architecture React/Vite/Workers.

La refonte doit être principalement une évolution de composition, composants visuels et CSS, avec modifications JSX seulement lorsqu'elles sont nécessaires à une composition Premium.

## 4. Sources visuelles à étudier comme bibliothèque, pas comme code à fusionner

### Premium HD historique
- PR #151 — `design/modaryx-ultra-premium-global-20260922`
- PR #152 — `design/modaryx-ultra-premium-global-pass2-20260922`
- PR #153 — `design/modaryx-canon-rebuild-nova-20260924`

À récupérer conceptuellement :
- diversité des familles de pages ;
- suppression des grands panneaux imbriqués ;
- profondeur et lumière ;
- atmosphères différentes par contexte ;
- rythme éditorial ;
- responsive réellement recomposé.

### True Finish Line
- PR #161 — `design/modaryx-true-finishline-20261002`

À étudier :
- hiérarchie du master ;
- sensation d'univers vivant ;
- relation entre grande scène et navigation ;
- qualité perçue / composition / respiration.

Ne pas importer automatiquement son architecture statique ni ses routes historiques.

## 5. Première passe à exécuter

Créer une branche depuis le HEAD produit courant.

### A. Fondations
Refondre dans la V2 actuelle :
- `v2/src/styles.css`
- `v2/src/premium-editorial.css`
- `v2/src/product-blue-violet.css`
- `v2/src/readability-polish.css`
- `v2/src/canon-topbar.css`

Objectif :
- moins de “dashboard prototype” ;
- plus de profondeur, relief, lumière, hiérarchie ;
- cartes/panneaux seulement quand fonctionnels ;
- sections plus éditoriales ;
- topbar premium mais stable/accessibile.

### B. Découvrir
La page doit devenir une vraie entrée dans MODARYX :
- visuel/ambiance forte ;
- identité de monde ;
- contenu fonctionnel visible sans paraître être une maquette ;
- CTA intégrés à la composition.

### C. Game Hub
Conserver sa structure produit mais :
- enrichir le bandeau contextuel ;
- intégrer recherche/version/CTA/profils dans une composition moins “wireframe” ;
- rendre la colonne principale et le rail plus vivants ;
- conserver densité et lisibilité.

### D. Familles secondaires
Appliquer des atmosphères distinctes :
- Jeux ;
- Mods & contenus ;
- Collections ;
- Créateurs ;
- Communauté ;
- Compte/notifications.

Ne pas dupliquer le même hero partout.

### E. Mobile
Recomposer :
- topbar ;
- hero/context banner ;
- Game Hub ;
- cartes ;
- filtres ;
- rail profils ;
- formulaires.

Aucune simple réduction desktop.

## 6. Assets

Avant d'utiliser un asset historique :
- vérifier provenance ;
- vérifier son statut PRODUCT/PREVIEW/PROOF ;
- vérifier droits commerciaux ;
- ne jamais faire passer une présence Git pour une autorisation commerciale.

Si un asset Premium historique n'est pas juridiquement réutilisable, reproduire sa **fonction visuelle** avec des assets autorisés/originaux, pas le fichier lui-même.

## 7. Micro-preuves avant revue propriétaire

Sur chaque passe :
1. `npm ci`
2. build V2
3. tests `sites`
4. route/browser checks ciblés
5. clavier/accessibilité statique/browser
6. overflow desktop/mobile
7. captures fraîches liées au SHA

Pas de full replay inutile après une erreur ciblée.

## 8. Captures obligatoires

Minimum avant décision propriétaire :
- Découvrir desktop + mobile
- Jeux desktop + mobile
- Game Hub desktop + mobile
- Mods & contenus desktop + mobile
- Collections desktop + mobile
- Créateurs desktop + mobile
- Communauté desktop + mobile
- Compte/notifications desktop + mobile

Présenter les captures fraîches, pas des captures d'une ancienne branche.

## 9. Critère de sortie

Le blocker `owner-visual-reconciliation-current` reste **BLOQUÉ** jusqu'à :
- nouveau candidat implémenté ;
- architecture V2 préservée ;
- preuves techniques ciblées vertes ;
- captures fraîches ;
- acceptation propriétaire explicite.

Ensuite seulement :
- mettre à jour le gate ;
- régénérer le ledger ;
- mettre à jour anti-oubli/checkpoint ;
- revenir aux blockers externes.

## 10. STOP

Stop avant :
- `main`
- DNS/DNSSEC/nameservers
- Cloudflare production critique
- D1/R2 production
- PSP/paiement
- PWA production
- indexability/cutover
- toute décision juridique/commerciale propriétaire non explicitement prise.
