# MODARYX V2 — Matrice de readiness d'implémentation

**Date : 2026-10-03**
**Statut : conception — frontend V2 volontairement non commencé**

## 1. Principe

Une surface n'entre pas en implémentation parce qu'elle possède seulement un wireframe ou un contrat.

Chaque surface doit avoir :
- objectif ;
- données ;
- états ;
- responsive ;
- accessibilité ;
- dépendances runtime ;
- critères QA ;
- stratégie legacy.

## 2. Homepage

- Architecture : TERMINÉ
- Wireframe desktop : TERMINÉ
- Wireframe mobile : TERMINÉ
- États : TERMINÉ — conception
- Données : TERMINÉ — stratégie
- Identité vivante : EN COURS — adaptation V2 non finalisée
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 3. Games Index

- Architecture : TERMINÉ
- Wireframe : TERMINÉ
- Données Game : TERMINÉ — plan de schéma
- États : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 4. Game Hub

- Contrat : TERMINÉ
- Wireframe desktop : BLOQUÉ Figma
- Wireframe mobile : BLOQUÉ Figma
- Données : TERMINÉ — conception
- Support lifecycle : TERMINÉ
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 5. Global Search

- Contrat : TERMINÉ
- Filtres/facettes : TERMINÉ
- Wireframe : BLOQUÉ Figma
- Search local-first : TERMINÉ — principe
- SearchDocument v2 : TERMINÉ — plan
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 6. Catalogue

- Wireframe desktop : TERMINÉ
- Wireframe mobile : TERMINÉ
- Filtres : TERMINÉ — conception
- Quick View : TERMINÉ — conception
- États : TERMINÉ — conception
- Données réelles : BLOQUÉ / corpus réel requis
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 7. Content Detail

- Wireframes : TERMINÉ desktop/mobile
- Contrat : TERMINÉ
- Release/files : TERMINÉ — conception
- Compatibility/dependencies : TERMINÉ — conception
- Trust panel : TERMINÉ — conception
- Install actions : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 8. Collection

- Wireframe desktop : TERMINÉ
- Mobile blueprint détaillé : EN COURS
- Contrat : TERMINÉ
- Filters collection : TERMINÉ — conception
- Support curateur : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 9. Modpack

- Contrat : TERMINÉ
- Wireframe dédié : PREUVE MANQUANTE
- Manifest v2 : TERMINÉ — plan
- Install flow : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 10. Profile / Loadout

- Contrat : TERMINÉ
- Library integration : TERMINÉ — conception
- Wireframe dédié : PREUVE MANQUANTE
- Manager integration : BLOQUÉ runtime
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 11. Creator Profile

- Wireframe desktop : TERMINÉ
- Contrat account/creator : TERMINÉ
- Mobile : PREUVE MANQUANTE
- Données : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 12. Creator Studio

- Wireframe desktop : TERMINÉ
- Contrat : TERMINÉ
- Mobile minimal : EN COURS — conception
- Backend historique : capacité à reconnecter
- Publication workflow : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 13. Community

- Contrat : TERMINÉ
- Wireframe desktop : BLOQUÉ Figma
- Mobile : PREUVE MANQUANTE
- Backend historique : capacité à reconnecter
- Moderation/appeals : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 14. Library

- Wireframe desktop : TERMINÉ
- Mobile : PREUVE MANQUANTE
- Objets séparés : TERMINÉ
- Sync states : TERMINÉ
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 15. Account / Settings

- Contrat : TERMINÉ
- Wireframe : PREUVE MANQUANTE
- Auth/session historiques : à reconnecter
- Preferences : TERMINÉ — conception
- Notifications : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 16. Security / Trust

- Contrat : TERMINÉ
- Surface dédiée : secondaire
- Intégration dans Content Detail : TERMINÉ — conception
- Signer/trust anchor production : BLOQUÉ
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 17. Docs / Help

- Architecture : TERMINÉ — conception
- Contenu final : PREUVE MANQUANTE
- i18n/SEO : TERMINÉ — conception
- High-fi : BLOQUÉ
- Implémentation : BLOQUÉ

## 18. PWA / Offline

- Architecture : TERMINÉ — conception
- Migration SW/cache : TERMINÉ — plan
- Implémentation : BLOQUÉ jusqu'au frontend preview
- Preuve appareil : PREUVE MANQUANTE

## 19. Design System

- Low-fi primitives : TERMINÉ
- Semantic tokens : TERMINÉ — contrat
- Composants core : TERMINÉ — inventaire
- Direction artistique : BLOQUÉ
- Library high-fi : BLOQUÉ
- Code components : BLOQUÉ

## 20. Conditions globales avant premier code de skin

Doivent être fermées :

1. wireframes Game Hub / Global Search / Community / Mobile Game Hub ;
2. tree testing humain ou preuve équivalente de trouvabilité ;
3. corrections IA issues des tests ;
4. direction artistique sélectionnée ;
5. design system high-fi ;
6. prototype comparatif validé humainement.

## 21. Ce qui peut être codé avant le skin

Uniquement si nécessaire et isolé :
- tests anti-contamination ;
- validateurs de contrats ;
- mappers de données purement techniques ;
- fixtures non publiques ;
- tooling QA.

Mais même ces éléments ne doivent pas être introduits sans nécessité, branche isolée et micro-proof.

**État global : BLOQUÉ volontairement pour le frontend / conception avancée.**
