# MODARYX V2 — Stratégie QA complète avant implémentation

**Date : 2026-10-03**
**Statut : conception QA — aucun PASS V2 déclaré**

## 1. Principe

La QA V2 doit valider séparément :

- fonction ;
- visuel ;
- accessibilité ;
- performance ;
- sécurité/confiance ;
- responsive ;
- données ;
- migration ;
- cache/PWA ;
- anti-contamination legacy.

Aucune catégorie ne valide les autres.

## 2. QA fonctionnelle

### Homepage
- recherche fonctionne ;
- jeux ouvrent le bon hub ;
- CTA créateur ouvre la bonne surface ;
- contenu recommandé respecte le contexte.

### Game Hub
- version active modifie les compatibilités ;
- recherche reste contextualisée ;
- catégories/types sont cohérents ;
- collections et créateurs pointent au bon jeu.

### Catalogue
- filtres combinables ;
- reset ;
- tri stable ;
- no-results ;
- quick view ;
- favoris ;
- ajout collection ;
- pagination/infinite loading si retenu.

### Content Detail
- release selector ;
- requirements ;
- files ;
- changelog ;
- install/manual actions ;
- states archived/withdrawn/revoked/quarantined.

### Creator Studio
- brouillon ;
- validation ;
- import/export ;
- fichiers ;
- droits ;
- provenance ;
- soumission ;
- conservation après erreur.

## 3. QA responsive

Breakpoints à couvrir au minimum :

- mobile étroit ;
- mobile large ;
- tablette portrait ;
- tablette paysage ;
- laptop ;
- desktop large.

Tester aussi des largeurs intermédiaires, pas seulement les presets.

### Critères

- pas d'overflow horizontal non intentionnel ;
- texte non coupé ;
- filtres accessibles ;
- menu utilisable ;
- focus visible ;
- CTA n'écrase pas le contenu ;
- tableaux/dépendances restent lisibles.

## 4. QA visuelle

Comparer le rendu réel aux maquettes validées.

### Vérifier

- grille ;
- spacing ;
- typographie ;
- hiérarchie ;
- alignements ;
- densité ;
- états ;
- icônes ;
- media ;
- surfaces ;
- motion.

### Méthode

- screenshots desktop/mobile ;
- diff visuel ;
- revue humaine ;
- correction ciblée.

Aucun “ça ressemble globalement” ne vaut validation.

## 5. QA accessibilité

### Automatisée

- axe ou équivalent ;
- landmarks ;
- labels ;
- aria ;
- contrastes ;
- erreurs structurelles.

### Manuelle

- clavier complet ;
- focus ;
- modals/drawers ;
- screen reader sur parcours critiques ;
- zoom 200 % / 400 % selon surface ;
- reduced motion ;
- target size ;
- orientation.

### Parcours clavier

- recherche ;
- filtres ;
- quick view ;
- fiche ;
- collection ;
- studio ;
- compte.

## 6. QA performance

### Lab

- Lighthouse ;
- traces navigateur ;
- taille JS/CSS ;
- images ;
- fonts ;
- long tasks.

### Field

Quand production/staging réel :
- LCP p75 ;
- INP p75 ;
- CLS p75.

### Régressions interdites

- hero bloque LCP ;
- filtres provoquent long tasks ;
- images causent CLS ;
- monde vivant bloque contenu critique.

## 7. QA sécurité / confiance

### Distribution

- stale = locked ;
- withdrawn = non downloadable ;
- revoked = non downloadable ;
- hash absent = action bloquée si requis ;
- droits insuffisants = action bloquée.

### Auth

- session réelle seulement ;
- permissions serveur ;
- logout ;
- expired session ;
- anti-abus indisponible ;
- profile private/public.

### Provenance

- verified nécessite receipt réel ;
- unverified distinct ;
- hash ≠ safe ;
- signature ≠ innocuité.

## 8. QA données

Tester :
- item incomplet ;
- release sans fichier ;
- type inconnu ;
- loader inconnu ;
- dépendance manquante ;
- conflit circulaire ;
- ID dupliqué ;
- version range invalide ;
- texte très long ;
- média absent.

Fail-soft ou fail-closed selon fonction.

## 9. QA recherche

- accents ;
- casse ;
- synonymes ;
- jeu ;
- créateur ;
- contenu ;
- collection ;
- no-results ;
- index local ;
- externe indisponible ;
- stale index.

Le moteur externe ne doit jamais casser la recherche core.

## 10. QA collections / profils

### Collection

- local ;
- public/unlisted si backend réel ;
- items retirés ;
- notes ;
- ordre.

### Modpack

- dependency resolution ;
- release pin ;
- conflit ;
- revoked item.

### Profile/loadout

- local-only ;
- sync-pending ;
- synced ;
- conflict ;
- rollback.

## 11. QA PWA / Service Worker

Scénarios :

1. navigateur neuf ;
2. SW V2 première installation ;
3. upgrade depuis SW legacy ;
4. offline ;
5. stale cache ;
6. update d'asset ;
7. update de HTML ;
8. SW activation interrompue ;
9. rollback.

Vérifier qu'aucun CSS/JS V1 ne réapparaît.

## 12. QA anti-contamination legacy

Tests CI/automatisés futurs :

- import blacklist CSS ;
- import blacklist JS ;
- anciennes classes ;
- ancien namespace localStorage ;
- anciennes routes ;
- anciens assets Nova visibles ;
- ancien service worker cache list ;
- templates V1.

Toute exception doit être allowlistée avec justification.

## 13. QA navigateur

Cible minimale :

- Chrome/Chromium récent ;
- Edge récent ;
- Firefox récent ;
- Safari récent si accessible ;
- iOS Safari ;
- Android Chromium.

Les comportements PWA doivent être testés selon capacités réelles de chaque moteur.

## 14. QA motion / monde vivant

Tester :

- reduced motion ;
- sans météo ;
- timezone uniquement ;
- provider live ;
- offline ;
- provider erreur ;
- nuit/jour ;
- changement saison ;
- performance faible.

Le contenu mods doit rester utilisable dans tous les cas.

## 15. QA contenu

- wording clair ;
- aucune promesse non prouvée ;
- labels fonctionnels ;
- erreurs utiles ;
- traductions futures ;
- textes longs.

## 16. Matrice de preuves

Chaque issue finale doit indiquer :

- surface ;
- viewport ;
- environnement ;
- build SHA ;
- résultat ;
- preuve ;
- blocant/non bloquant.

## 17. Règle après erreur

Toujours :

erreur exacte
→ isolation
→ correction ciblée
→ micro-proof
→ continuation.

Aucun replay global immédiat.

## 18. Full replay

Pour V2, le full replay n'est autorisé qu'en toute fin du cycle candidat, après fermeture des blockers ciblés.

Ce replay doit inclure :
- desktop ;
- mobile ;
- flows critiques ;
- a11y ;
- perf ;
- PWA ;
- anti-contamination.

## 19. États

Utiliser :

- TERMINÉ
- EN COURS
- BLOQUÉ
- PREUVE MANQUANTE

Ne pas utiliser PASS/VF tant que les preuves correspondantes ne sont pas présentes.

**État : TERMINÉ pour la stratégie QA / NON EXÉCUTÉ car frontend V2 non implémenté.**
