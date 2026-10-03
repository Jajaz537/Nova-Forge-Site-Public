# MODARYX V2 — Registre des risques

**Date : 2026-10-03**
**Statut : registre actif de conception et migration**

## 1. Règle

Un risque n'est pas fermé parce qu'il est documenté.

États utilisés :
- EN COURS
- BLOQUÉ
- PREUVE MANQUANTE
- TERMINÉ

## 2. Risques critiques

| Risque | État | Impact | Mitigation |
|---|---|---|---|
| CSS legacy contamine V2 | TERMINÉ — prévention | Très élevé | blacklist 39/39 assets code + guard CI micro-prouvé |
| Service Worker legacy sert ancien code | BLOQUÉ runtime | Très élevé | isolation requise ; migration navigateur non exécutée |
| Redirects legacy interceptent routes V2 | EN COURS | Élevé | plan de cutover prêt ; preuve runtime manquante |
| Shell/app legacy mutent le DOM | TERMINÉ — prévention | Très élevé | renderers V1 blacklistés + guard CI |
| localStorage historique pollue V2 | EN COURS | Élevé | namespace/migrator définis ; preuve navigateur manquante |
| Ancien design réapparaît | EN COURS | Très élevé | imports legacy bloqués ; validation artistique humaine encore requise |
| Faux contenu de démo perçu comme réel | EN COURS | Élevé | dataClass explicite + fixtures isolées |
| Collection/Modpack/Profile confondus | TERMINÉ — conception | Élevé | contrats séparés |
| Projet/Release confondus | TERMINÉ — conception | Élevé | schémas séparés |
| Compatibilité présentée sans preuve | EN COURS | Très élevé | CompatibilityClaim + états explicites |
| Installation manager simulée | EN COURS | Très élevé | capability detection + fallback |
| Hash/signature présentés comme “safe” | TERMINÉ — conception | Élevé | vocabulaire trust strict |
| High-fi lancé trop tôt | BLOQUÉ volontairement | Très élevé | High-Fi Gate |
| Direction artistique pilotée par ancien code | BLOQUÉ volontairement | Très élevé | prototype avant frontend |
| Wireframes incomplets | BLOQUÉ Figma | Élevé | blueprints prêts, reprise au quota |
| Tree testing non effectué | PREUVE MANQUANTE | Élevé | protocole humain prêt |
| Figma Starter quota | BLOQUÉ EXTERNE | Moyen | ne pas contourner, avancer hors Figma |
| Design “site sombre à cartes” réapparaît | EN COURS | Élevé | diversité de patterns/layouts, validation humaine |
| Univers/lore masque le produit | TERMINÉ — principe | Élevé | vocabulaire fonctionnel prioritaire |
| Monde vivant dégrade performance | EN COURS | Moyen/Élevé | fail-soft, lazy, reduced motion |
| Recherche externe devient SPOF | TERMINÉ — conception | Élevé | local-first |
| Migration v1→v2 casse consumers | EN COURS | Très élevé | matrice V1→V2 explicite + adapters ; runtime non exécuté |
| Suppression legacy trop tôt | BLOQUÉ volontairement | Élevé | rollback + conservation |
| Cutover sans rollback | BLOQUÉ volontairement | Très élevé | stratégie rollback obligatoire |
| Main modifié accidentellement | TERMINÉ pour branche actuelle | Très élevé | branche isolée + vérification SHA avant écriture |
| Travail parallèle écrasé | EN COURS permanent | Très élevé | SHA/branche avant chaque écriture |
| Faux PASS/VF | EN COURS permanent | Très élevé | états autorisés + preuves séparées |
| CWV terrain absent | PREUVE MANQUANTE | Moyen | mesures terrain après déploiement |
| Safari/appareils réels absents | PREUVE MANQUANTE | Moyen/Élevé | tests externes futurs |
| Juridique/droits incomplets | PREUVE MANQUANTE | Très élevé | aucune distribution réelle sans preuve |
| Weather provider réel absent | BLOQUÉ | Moyen | garder fallback saison/heure |
| Signer/trust anchor prod absent | BLOQUÉ | Très élevé | distribution reste verrouillée |
| Corpus réel de mods absent | BLOQUÉ partiel | Très élevé | hubs éditoriaux séparés du catalogue réel |

## 2.1 Threat model

Document :
`docs/MODARYX-V2-THREAT-MODEL-20261003.md`

État :
- threat model conception : **TERMINÉ** ;
- CSP/header policy V2 : **EN COURS** ;
- sanitizer/rich-text policy : **À DÉFINIR si rich text** ;
- supply-chain V2 : **EN COURS — dépendances non choisies** ;
- runtime security proof : **PREUVE MANQUANTE** tant que V2 n'existe pas.

## 3. Risques UX

| Risque | État | Mitigation |
|---|---|---|
| Navigation trop large | EN COURS | tree testing |
| Trop de filtres | EN COURS | filtres contextuels + progressive disclosure |
| Fiche trop dense | EN COURS | zone décision + tabs |
| Dépendances invisibles | TERMINÉ — conception | Requirements first-class |
| Mobile = desktop compressé | TERMINÉ — principe | composition dédiée |
| CTA sticky masque focus | TERMINÉ — contrat | QA a11y |
| Quick View remplace fiche | TERMINÉ — principe | Quick View limitée |
| Trop de badges | EN COURS | hiérarchie de statut |
| Trop de motion | TERMINÉ — contrat | motion fonctionnelle + reduced motion |
| Trop de cartes | EN COURS | utiliser listes/tables/sections selon tâche |

## 4. Risques créateurs

| Risque | État | Mitigation |
|---|---|---|
| Upload détruit brouillon | TERMINÉ — contrat | sauvegarde locale |
| Licence ignorée | TERMINÉ — contrat | étape obligatoire |
| Dépendances en texte libre | TERMINÉ — contrat | éditeur structuré |
| Modération confondue avec publication | TERMINÉ — contrat | états séparés |
| Équipe = autorité plateforme | TERMINÉ — contrat | rôles séparés |
| Analytics fictives | TERMINÉ — contrat | métriques réelles seulement |

## 5. Risques installation

| Risque | État | Mitigation |
|---|---|---|
| Mauvaise instance du jeu | TERMINÉ — conception | instance explicite |
| Mauvais profil | TERMINÉ — conception | choisir/créer profil |
| Update casse config | TERMINÉ — contrat | preflight + rollback |
| Dépendance remplacée silencieusement | TERMINÉ — contrat | confirmation |
| Progression fictive | TERMINÉ — contrat | progression mesurable seulement |
| Profil marqué installé sans preuve | TERMINÉ — contrat | confirmation runtime |

## 6. Risques confiance

| Risque | État | Mitigation |
|---|---|---|
| “verified” sans receipt | TERMINÉ — contrat | receipt obligatoire |
| stale cache réactive download | TERMINÉ — contrat | fail-closed |
| signature non trusted | EN COURS | trust anchor gate |
| scan absent présenté comme passé | TERMINÉ — contrat | état not-scanned |
| auteur populaire assimilé à sûr | TERMINÉ — principe | métriques séparées |

## 7. Risques de gouvernance

| Risque | État | Mitigation |
|---|---|---|
| API cassée sans migration | TERMINÉ — conception | versioning/deprecation |
| Schéma v1 modifié en place | BLOQUÉ volontairement | v2 séparé |
| Identities Nova Forge/MODARYX fusionnées | TERMINÉ — séparation | checkpoint + guards |
| Idées perdues | EN COURS permanent | anti-oubli maître |
| Recherche nouvelle intégrée aveuglément | TERMINÉ — méthode | À INTÉGRER/À TESTER/À ÉCARTER |

## 8. Critère de revue

Ce registre doit être revu :
- avant ouverture high-fi ;
- avant premier code V2 ;
- avant preview ;
- avant cutover ;
- avant VF.

**État : TERMINÉ pour la création initiale / À MAINTENIR.**
