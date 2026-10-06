# MODARYX V2 — Décision preview engineering — 2026-10-06

**Statut : ACTIF — preview engineering isolée uniquement**

## Décision utilisateur
La phase courante porte uniquement sur le site MODARYX. L'utilisateur demande une vérification navigateur page par page, onglet par onglet et module par module, avec correction continue jusqu'à la VF.

Cette instruction active l'option B préparée dans `docs/MODARYX-V2-FRONTEND-GATE-RECLASSIFICATION-PROPOSAL-20261004.md` pour un **root de preview engineering isolé**.

## Base technique fraîche
- branche source : `design/modaryx-v2-blue-violet-product-20261005`
- commit source : `15d7a4746dda80d135188fd9921b761888e9de1e`
- preuve navigateur : run `37417080782` — SUCCESS
- clavier : `54 / 54`
- overflow desktop/mobile : `0 / 0`
- tree proxy : `1..10` PASS
- product flows : PASS
- captures navigateur : **143**
- intégrité captures : PASS

## Stack preview retenue
**React 19.2.0 + Vite 6.4.2 + Worker-compatible shell**, candidat `react-vite-cloudflare-workers`.

Raisons :
- continuité directe avec le candidat visuel déjà prouvé ;
- bundle courant mesuré sous ~100 kB gzip JS ;
- 143 captures et flows navigateur déjà exercés ;
- compatibilité avec la stratégie BFF same-origin ;
- coût de migration minimal pour fermer rapidement les surfaces produit.

Ce choix vaut pour la **preview engineering**. Il ne constitue pas encore un cutover production ni une migration Cloudflare.

## Root
Chemin : `v2-preview/`

Garde-fous :
- noindex/nofollow/noarchive ;
- aucune modification de `main` ;
- aucun DNS/DNSSEC/nameserver/Cloudflare critique ;
- aucune donnée réelle requise ;
- aucune réutilisation automatique V1 ;
- aucun faux backend ;
- preuve navigateur ciblée obligatoire.

## Reclassification limitée
Le `HUMAN_TREE_TEST` n'est pas déclaré humainement PASS. Pour **le démarrage de la preview seulement**, le proxy navigateur prouvé + l'instruction utilisateur autorisent l'ingénierie à continuer.

Restent OPEN pour la VF stricte :
- human-multiscreen ;
- human-mobile ;
- NVDA / VoiceOver / TalkBack réels ;
- Safari réel ;
- appareils physiques ;
- backend/auth/données/providers/notifications/PWA/migration/CWV/cutover réels ;
- droits/legal réels selon périmètre.

**Aucune VF finale n'est revendiquée par cette décision.**
