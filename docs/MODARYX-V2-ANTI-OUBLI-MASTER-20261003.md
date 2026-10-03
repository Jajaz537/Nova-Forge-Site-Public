# MODARYX V2 — Registre anti-oubli maître

**Date : 2026-10-03**
**Statut : registre de conception V2 — aucune VF déclarée**

## 1. Règle

Aucune idée explicitement retenue n'est supprimée silencieusement.

Chaque élément doit être dans un état :
- TERMINÉ
- EN COURS
- BLOQUÉ
- PREUVE MANQUANTE

Une capacité non implémentée reste non implémentée même si son contrat est terminé.

## 2. Identité produit

| Élément | État V2 | Référence |
|---|---|---|
| MODARYX = plateforme web multigaming | TERMINÉ — conception | PRODUCT-ARCHITECTURE |
| Nova Forge OS reste distinct | TERMINÉ — contrat | CHECKPOINT |
| getnova/getnovaforge = historique | TERMINÉ — classification | LEGACY-AUDIT |
| Univers MODARYX conservé sans masquer le produit | TERMINÉ — principe | BENCHMARK / PRODUCT-ARCHITECTURE |
| Ancien front non canonique visuellement | TERMINÉ — décision | LEGACY-AUDIT |

## 3. Architecture et navigation

| Élément | État V2 | Référence |
|---|---|---|
| Découvrir | TERMINÉ — conception | PRODUCT-ARCHITECTURE |
| Jeux | TERMINÉ — conception | PRODUCT-ARCHITECTURE |
| Mods & contenus | TERMINÉ — wording produit retenu ; validation humaine globale reste EN COURS | PRODUCT-ARCHITECTURE / HUMAN-CONTENT-UMBRELLA-MINITEST-P01 / MULTIGAMING-MODDING-TERMINOLOGY-BENCHMARK / FINAL-PRODUCT-WORDING-CONTENT-UMBRELLA |
| Collections | TERMINÉ — conception | PRODUCT-ARCHITECTURE |
| Créateurs | TERMINÉ — conception | PRODUCT-ARCHITECTURE |
| Communauté | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Créer / Studio | TERMINÉ — conception | CREATOR-STUDIO |
| Bibliothèque | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Recherche globale | TERMINÉ — conception + low-fi HTML ; portée globale/contextuelle explicite | SEARCH-FILTER-DISCOVERY / CROSS-ANALYSIS |
| Navigation mobile prioritaire | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Breadcrumbs | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |

## 4. Jeux et hubs

| Élément | État V2 | Référence |
|---|---|---|
| Games index | TERMINÉ — low-fi existant | FIGMA |
| Game Hub | TERMINÉ — contrat + low-fi HTML / matérialisation Figma BLOQUÉE | GAME-HUB / LOWFI-REVIEW |
| Version active du jeu | TERMINÉ — conception | GAME-HUB |
| Types/catégories par jeu | TERMINÉ — conception | TAXONOMY |
| Statut support jeu | TERMINÉ — conception | GAME-SUPPORT-LIFECYCLE |
| Hubs editorial-only possibles | TERMINÉ — conception | GAME-SUPPORT-LIFECYCLE |
| Distribution séparée du hub éditorial | TERMINÉ — conception | GAME-SUPPORT-LIFECYCLE |

## 5. Recherche / découverte / filtres

| Élément | État V2 | Référence |
|---|---|---|
| Search local-first | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| Moteur externe optionnel | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| Applied filters toujours visibles | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| Multi-select | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| OR intra-facette / AND inter-facettes | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| Filtres contextuels par jeu/type | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| No-results utile | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| Saved searches | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |
| Quick View | TERMINÉ — conception | SEARCH-FILTER-DISCOVERY |

## 6. Types de contenu

| Élément | État V2 | Référence |
|---|---|---|
| Mod | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Plugin | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Addon | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Script | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Map | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Shader / preset | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Tool / utility | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Library / framework / loader | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Pack / resource / texture | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Patch / translation | TERMINÉ — taxonomie | CONTENT-TAXONOMY |
| Types extensibles par jeu | TERMINÉ — conception | CONTENT-TAXONOMY |

## 7. Fiche contenu / releases

| Élément | État V2 | Référence |
|---|---|---|
| ContentItem séparé de Release | TERMINÉ — conception | SCHEMA-PLAN / CONTENT-DETAIL |
| Compatibilité above-the-fold | TERMINÉ — conception | CONTENT-DETAIL |
| Requirements | TERMINÉ — conception | CONTENT-DETAIL |
| Dependencies | TERMINÉ — conception | CONTENT-DETAIL |
| Conflicts | TERMINÉ — conception | CONTENT-DETAIL |
| Files | TERMINÉ — conception | CONTENT-DETAIL |
| Versions | TERMINÉ — conception | CONTENT-DETAIL |
| Changelog | TERMINÉ — conception | CONTENT-DETAIL |
| Permissions/licence | TERMINÉ — conception | CONTENT-DETAIL |
| Media | TERMINÉ — conception | CONTENT-DETAIL |
| Support / issues | TERMINÉ — conception | CONTENT-DETAIL |
| Archived/removed/quarantined/revoked | TERMINÉ — conception | CONTENT-DETAIL |

## 8. Compatibilité / dépendances

| Élément | État V2 | Référence |
|---|---|---|
| compatible / partial / incompatible / unknown | TERMINÉ — conception | SCHEMA-PLAN |
| measured / declared / estimated / unknown | TERMINÉ — conception | SCHEMA-PLAN |
| Non vérifié générique interdit ; dimension obligatoire | TERMINÉ — principe humainement motivé | PRODUCT-GLOSSARY / HUMAN-TERMINOLOGY-MINITEST-P01 |
| required | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| optional | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| recommended | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| incompatible | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| replaces sans substitution silencieuse | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |

## 9. Favoris / Collections / Modpacks / Profiles

| Élément | État V2 | Référence |
|---|---|---|
| Favoris | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| Collections | EN COURS — terminologie/capacité | COLLECTION-MODPACK-PROFILE / CROSS-ANALYSIS |
| Modpacks | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| Profile / Loadout interne → **Profils de jeu** UI retenu | TERMINÉ — wording | COLLECTION-MODPACK-PROFILE / PRODUCT-GLOSSARY / FINAL-PRODUCT-WORDING-GAME-PROFILES |
| Capacité Collection explicite (sélection / installation réelle) | TERMINÉ — conception / revalidation wording | COLLECTION-MODPACK-PROFILE / CROSS-ANALYSIS |
| Conversion explicite entre objets | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| Version pinning | TERMINÉ — conception | COLLECTION-MODPACK-PROFILE |
| Sync states | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Confidentialité local/private par défaut | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |

## 10. Créateurs / équipes / Studio

| Élément | État V2 | Référence |
|---|---|---|
| Creator profile | TERMINÉ — conception | ONBOARDING-ACCOUNT-CREATOR |
| Team / Studio | TERMINÉ — conception | CREATOR-STUDIO |
| Rôles d'équipe | TERMINÉ — conception | ONBOARDING-ACCOUNT-CREATOR |
| Creator Studio dashboard | TERMINÉ — conception | CREATOR-STUDIO |
| Projects | TERMINÉ — conception | CREATOR-STUDIO |
| Releases | TERMINÉ — conception | CREATOR-STUDIO |
| Upload | TERMINÉ — conception | CREATOR-STUDIO |
| Analytics réelles seulement | TERMINÉ — conception | CREATOR-STUDIO |
| Brouillon local préservé | TERMINÉ — conception | CREATOR-STUDIO |
| Publication / modération séparées | TERMINÉ — conception | CREATOR-STUDIO |

## 11. Compte / profils / auth

| Élément | État V2 | Référence |
|---|---|---|
| Guest-first | TERMINÉ — conception | ONBOARDING-ACCOUNT-CREATOR |
| Account séparé du Public Profile | TERMINÉ — conception | ONBOARDING-ACCOUNT-CREATOR |
| Creator séparé du compte | TERMINÉ — conception | ONBOARDING-ACCOUNT-CREATOR |
| Authority séparée du rôle créateur | TERMINÉ — conception | COMMUNITY-PROFILES-DEEP-AUDIT |
| Session states | TERMINÉ — conception | ONBOARDING-ACCOUNT-CREATOR |
| Passkeys réelles | PREUVE MANQUANTE | anti-oubli historique |
| Auth backend DEV historique | TERMINÉ — preuve historique, à reconnecter V2 plus tard | anti-oubli historique |

## 12. Community / modération

| Élément | État V2 | Référence |
|---|---|---|
| Support | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Questions | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Discussions | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Studios / clubs | TERMINÉ — conception | COMMUNITY-LIBRARY-NAV |
| Signalements | TERMINÉ — conception | MODERATION-APPEALS |
| Modération | TERMINÉ — conception | MODERATION-APPEALS |
| Appeals | TERMINÉ — conception | MODERATION-APPEALS |
| Quarantine | TERMINÉ — conception | MODERATION-APPEALS |
| Permissions serveur | TERMINÉ — principe | MODERATION-APPEALS |

## 13. Confiance / provenance / distribution

| Élément | État V2 | Référence |
|---|---|---|
| Provenance | TERMINÉ — conception | TRUST-PROVENANCE-DISTRIBUTION |
| SHA-256 | TERMINÉ — conception | TRUST-PROVENANCE-DISTRIBUTION |
| Signature | TERMINÉ — conception / signer prod absent | TRUST-PROVENANCE-DISTRIBUTION |
| Scan réel seulement | TERMINÉ — conception | TRUST-PROVENANCE-DISTRIBUTION |
| Licence / droits | TERMINÉ — conception | TRUST-PROVENANCE-DISTRIBUTION |
| Distribution locked/published/withdrawn/revoked | TERMINÉ — conception | TRUST-PROVENANCE-DISTRIBUTION |
| Téléchargements réels | BLOQUÉ | artefact réel autorisé absent |
| Signer / trust anchor prod | BLOQUÉ | service/clé réel non connecté |

## 14. Installation / manager

| Élément | État V2 | Référence |
|---|---|---|
| Install with manager | TERMINÉ — contrat / runtime non connecté | INSTALL-MANAGER |
| Manual download | TERMINÉ — contrat / artefact réel requis | INSTALL-MANAGER |
| Preflight | TERMINÉ — conception | INSTALL-MANAGER |
| Dependency resolution | TERMINÉ — conception | INSTALL-MANAGER |
| Conflict resolution | TERMINÉ — conception | INSTALL-MANAGER |
| Progression réelle uniquement | TERMINÉ — conception | INSTALL-MANAGER |
| Update | TERMINÉ — conception | INSTALL-MANAGER |
| Rollback | TERMINÉ — conception | INSTALL-MANAGER |
| Runtime MODARYX Forge réel | PREUVE MANQUANTE / non implémenté | aucun runtime desktop prouvé |

## 15. Monde vivant / identité

| Élément | État V2 | Référence |
|---|---|---|
| Loup / dragon / compagnons conservés comme candidats | TERMINÉ — classification | ASSET-CLASSIFICATION |
| Univers comme couche de marque | TERMINÉ — principe | PRODUCT-ARCHITECTURE |
| Saison | TERMINÉ — capacité legacy, V2 à adapter | LEGACY-LOGIC-DEEP-AUDIT |
| Heure locale | TERMINÉ — capacité legacy, V2 à adapter | LEGACY-LOGIC-DEEP-AUDIT |
| Météo réelle | BLOQUÉ | fournisseur / confidentialité / preuve réelle |
| Reduced motion | TERMINÉ — conception | A11Y-PERF |
| Reality Context Engine séparé | TERMINÉ — conception | LEGACY-LOGIC-DEEP-AUDIT |
| Experience Adapter | TERMINÉ — conception | LEGACY-LOGIC-DEEP-AUDIT |

## 16. Notifications / préférences

| Élément | État V2 | Référence |
|---|---|---|
| Notifications in-app | TERMINÉ — conception | NOTIFICATIONS-PREFERENCES |
| Email/push | BLOQUÉ tant que service absent | NOTIFICATIONS-PREFERENCES |
| Préférences locales | TERMINÉ — conception | NOTIFICATIONS-PREFERENCES |
| Préférences distantes | EN COURS — dépend backend | NOTIFICATIONS-PREFERENCES |
| Sync conflict | TERMINÉ — conception | NOTIFICATIONS-PREFERENCES |

## 17. SEO / i18n / contenu

| Élément | État V2 | Référence |
|---|---|---|
| Canonical / sitemap / titles | TERMINÉ — conception | SEO-I18N-CONTENT |
| Indexation filtres contrôlée | TERMINÉ — conception | SEO-I18N-CONTENT |
| i18n-ready | TERMINÉ — conception | SEO-I18N-CONTENT |
| Long text | TERMINÉ — conception | SEO-I18N-CONTENT |
| États éditoriaux | TERMINÉ — conception | SEO-I18N-CONTENT |

## 18. PWA / cache / migration

| Élément | État V2 | Référence |
|---|---|---|
| SW V2 séparé | TERMINÉ — architecture / non implémenté | STORAGE-CACHE-SW |
| Cache allowlist | TERMINÉ — conception | STORAGE-CACHE-SW |
| Migration localStorage non destructive | TERMINÉ — conception | STORAGE-CACHE-SW |
| Namespace modaryx:v2 | TERMINÉ — conception | STORAGE-CACHE-SW |
| Upgrade legacy → V2 | TERMINÉ — plan / PREUVE MANQUANTE | STORAGE-CACHE-SW |
| PWA install physique | PREUVE MANQUANTE | anti-oubli historique |

## 19. Accessibilité / responsive / performance

| Élément | État V2 | Référence |
|---|---|---|
| Focus visible | TERMINÉ — conception | A11Y-PERF |
| Target size | TERMINÉ — conception | A11Y-PERF |
| Reduced motion | TERMINÉ — conception | A11Y-PERF |
| Mobile recomposé | TERMINÉ — principe | PRODUCT-ARCHITECTURE |
| Core Web Vitals budgets | TERMINÉ — objectif / mesures V2 manquantes | A11Y-PERF |
| Screen reader natif | PREUVE MANQUANTE | anti-oubli historique |
| Safari réel | PREUVE MANQUANTE | anti-oubli historique |
| Appareils physiques | PREUVE MANQUANTE | anti-oubli historique |

## 20. Isolation legacy

| Élément | État V2 | Référence |
|---|---|---|
| Aucun CSS legacy dans V2 | TERMINÉ — contrat | FRONTEND-ISOLATION |
| Aucun shell.js/app.js renderer direct | TERMINÉ — contrat | FRONTEND-ISOLATION |
| Routes V2 séparées | TERMINÉ — architecture | FRONTEND-ISOLATION |
| SW/cache V2 séparés | TERMINÉ — architecture | FRONTEND-ISOLATION |
| localStorage V2 séparé | TERMINÉ — architecture | FRONTEND-ISOLATION |
| Anti-import CI | TERMINÉ — conception / non implémenté | FRONTEND-ISOLATION |

## 21. Wireframes / design

| Élément | État V2 | Référence |
|---|---|---|
| Home desktop | TERMINÉ — low-fi | Figma |
| Games desktop | TERMINÉ — low-fi | Figma |
| Catalog desktop | TERMINÉ — low-fi | Figma |
| Content Detail desktop | TERMINÉ — low-fi | Figma |
| Collection desktop | TERMINÉ — low-fi | Figma |
| Creator desktop | TERMINÉ — low-fi | Figma |
| Creator Studio desktop | TERMINÉ — low-fi | Figma |
| Library desktop | TERMINÉ — low-fi | Figma |
| Home mobile | TERMINÉ — low-fi | Figma |
| Catalog mobile | TERMINÉ — low-fi | Figma |
| Content Detail mobile | TERMINÉ — low-fi | Figma |
| Game Hub desktop | TERMINÉ — low-fi HTML / BLOQUÉ Figma uniquement | MISSING-WIREFRAME-BLUEPRINTS / LOWFI-REVIEW |
| Global Search desktop | TERMINÉ — low-fi HTML / BLOQUÉ Figma uniquement | MISSING-WIREFRAME-BLUEPRINTS / LOWFI-REVIEW |
| Community desktop | TERMINÉ — low-fi HTML / BLOQUÉ Figma uniquement | MISSING-WIREFRAME-BLUEPRINTS / LOWFI-REVIEW |
| Game Hub mobile | TERMINÉ — low-fi HTML / BLOQUÉ Figma uniquement | MISSING-WIREFRAME-BLUEPRINTS / LOWFI-REVIEW |
| Boucle visuelle locale Chromium/Playwright | TERMINÉ — micro-preuve environnement courant ; revalider à chaque session ; `file://`/localhost bloqués, utiliser `page.set_content` | CHECKPOINT / LOWFI-REVIEW |
| High-fi final | BLOQUÉ volontairement ; exploration réversible autorisée | HIGH-FI-GATE |
| Direction artistique exploratoire | TERMINÉ — option 2 sélectionnée, palette hybride 2+3, prototype isolé | LIVING-THRESHOLD-DESIGN-SYSTEM / review-evidence |
| Design system préparatoire | TERMINÉ — tokens, composants, responsive, a11y, motion, identité documentés | LIVING-THRESHOLD-DESIGN-SYSTEM |
| QA visuelle archivable du prototype | BLOQUÉE — capture navigateur inspectée mais export fichier/comparaison normalisée manquants | review-evidence/.../design-qa.md |
| Direction artistique finale | BLOQUÉ volontairement — sélection exploratoire ≠ gel high-fi | HIGH-FI-GATE |
| Tree test humain | EN COURS — P01 réel + mini-test terminologique P01 terminés, validation globale incomplète | HUMAN-MINI-TREE-TEST-P01 / HUMAN-TERMINOLOGY-MINITEST-P01 / CROSS-ANALYSIS |

## 22. Capacités historiques à ne pas perdre

À conserver/tracer lors du branchement V2 :

- auth/session DEV ;
- profils publics ;
- community write/modération ;
- founder/admin authority MODARYX ;
- provenance/signatures ;
- téléchargement fail-closed ;
- Storage Resolver ;
- Repair Network ;
- Guide MODARYX ;
- pont MODARYX Forge (références techniques/historiques `Nova Forge` à classifier avant migration) ;
- vérificateur SHA-256 ;
- PWA offline/stale ;
- Smart Profile ;
- accessibility/reflow QA ;
- SEO guards ;
- CodeQL/security guards.

Aucune de ces capacités n'est automatiquement “V2-ready” simplement parce qu'elle a existé dans V1.

## 23. Sources historiques non récupérées

### Master Nova Design Intelligence complète
**PREUVE MANQUANTE / NON RÉCUPÉRÉE**

Ne pas inventer ses éléments absents.

## 24. Règle de fermeture

Avant toute VF V2 :

1. chaque ligne de ce registre doit être TERMINÉE, BLOQUÉE explicitement hors scope avec décision humaine, ou PREUVE MANQUANTE clairement assumée ;
2. aucune idée retenue ne doit disparaître silencieusement ;
3. aucun état de conception ne doit être confondu avec implémentation ;
4. aucun PASS technique ne valide l'esthétique ;
5. aucun prototype ne valide la production ;
6. aucun full replay avant fermeture ciblée des blockers.

**État du registre : TERMINÉ pour la consolidation actuelle / À MAINTENIR jusqu'à la VF.**


## 25. Benchmark terminologique multi-gaming / modding

**TERMINÉ — recherche externe**

Document :
`docs/MODARYX-V2-MULTIGAMING-MODDING-TERMINOLOGY-BENCHMARK-20261003.md`

Résultats à ne pas oublier :
- **Profils de jeu** reste défendable et préféré par P01 ;
- **Collection** reste valable mais sa capacité d'installation doit être explicite ;
- **Bibliothèque** est cohérente avec les conventions gaming ;
- **Mods & Plugins** n'est pas assez large comme parapluie final ;
- **Mods & contenus** est le libellé UI retenu par décision produit ;
- **Non vérifié** générique reste interdit.


## 27. Test terminologique indépendant assistant

**TERMINÉ — simulation IA 6 profils × 6 questions**

Document : `docs/MODARYX-V2-ASSISTANT-INDEPENDENT-TERMINOLOGY-TEST-20261003.md`.

Ne remplace pas une preuve humaine.

## 28. Test terminologique Work

**PREUVE MANQUANTE — mission prête / rapport non reçu**

Le protocole Work doit rester indépendant de P01 et du test assistant jusqu'à son propre verdict.


## 27. Rapport Work terminologique indépendant

**TERMINÉ — 6 profils × 6 questions / 36 simulations**

Source reçue : **Rapport indépendant — Test terminologique MODARYX V2**.

Indépendance déclarée : P01 et test assistant non consultés avant rédaction des résultats.

Analyse croisée finale :
`docs/MODARYX-V2-FINAL-TERMINOLOGY-CROSS-ANALYSIS-P01-ASSISTANT-WORK-20261003.md`

À retenir :
- **Mods & contenus** converge P01 + assistant + Work ;
- **Collection**, **Bibliothèque** et l'interdiction de **Non vérifié** convergent ;
- **Profils de jeu** vs **Configurations de jeu** reste le seul arbitrage terminologique majeur ouvert.


## Décision finale Profils de jeu

**TERMINÉ — wording produit**

- UI : **Profils de jeu**
- microcopy : **Configurations enregistrées de mods, versions et réglages.**
- Game Hub : **Mes profils pour ce jeu**
- domaine interne : `Profile/Loadout`

Référence : `docs/MODARYX-V2-FINAL-PRODUCT-WORDING-GAME-PROFILES-20261003.md`.

## Décision finale — parapluie de contenus

**TERMINÉ — wording produit**

- UI : **Mods & contenus**
- microcopy : **Mods, plugins, addons, scripts, maps, shaders, presets, outils et autres contenus pour vos jeux.**
- **Mods & Plugins** n'est plus le parapluie universel.
- validation humaine globale : **EN COURS**
- High-Fi final : reste **BLOQUÉ**

Référence : `docs/MODARYX-V2-FINAL-PRODUCT-WORDING-CONTENT-UMBRELLA-20261003.md`.

## Direction artistique exploratoire — Living Threshold hybride

**TERMINÉ — sélection et prototype réversibles / HIGH-FI BLOQUÉ**

- option humaine retenue : **Living Threshold** ;
- affinage humain : couleurs des options 2 et 3 ;
- cyan = action/compatibilité, violet = profils/secondaire, ambre = lumière du monde uniquement ;
- prototype autonome : `review-evidence/modaryx-v2-living-threshold-prototype-20261003/` ;
- aucun import CSS/DOM/renderer/asset V1 ;
- aucun frontend public, DNS, Cloudflare ou production modifié ;
- Figma reste **BLOQUÉ EXTERNE** ;
- QA formelle reste **BLOQUÉE** jusqu'à preuve visuelle archivable et comparaison normalisée.

Référence : `docs/MODARYX-V2-LIVING-THRESHOLD-DESIGN-SYSTEM-20261003.md`.


## Benchmark écosystèmes modding / transfert MODARYX Forge

**EN COURS — recherche retenue et tracée / aucune parité concurrent déclarée**

Document :
`docs/MODARYX-V2-MODDING-ECOSYSTEM-BENCHMARK-TRANSFER-20261003.md`

Références étudiées notamment : ModDropV, Vortex/Nexus, Mod Organizer 2, Prism Launcher, ATLauncher, Thunderstore/r2modman, Modrinth, Wabbajack, OpenIV/OIV, Reloaded-II, CurseForge, mod.io, Steam Workshop, Bethesda Creations et outils spécialisés apportant une capacité distincte.

À ne pas oublier avant VF :
- compatibilité, release, dépendances et conflits lisibles avant toute action ;
- Collection != Modpack != Profil de jeu ;
- profils partageables sous forme de recette/manifeste respectant les droits ;
- revue du delta avant acceptation d'une mise à jour de profil partagé ;
- Creator Studio : projet, releases, fichiers, dépendances, conflits, compatibilité, droits, provenance et packaging ;
- connecteurs/adapters autorisés, jamais de scraping universel contournant les restrictions ;
- provenance, intégrité, scan, compatibilité, droits, modération et distribution restent des dimensions séparées ;
- installation locale, protection, rollback et receipt appartiennent à **MODARYX Forge**, pas au navigateur ;
- un CTA `Installer avec MODARYX Forge` reste interdit tant que le runtime et le pont d'intégration ne sont pas réellement prouvés ;
- benchmark continu jusqu'à la VF : nouvelle idée retenue = intégrer, mapper vers équivalent prouvé ou rejeter explicitement.

### Nomenclature produit retenue

- **MODARYX Forge** = logiciel / écosystème desktop ;
- **MODARYX Public** = édition publique ;
- **MODARYX Founder** = édition Founder ;
- **MODARYX / MODARYX MODS** = plateforme web ;
- `Nova Forge` = historique/legacy technique jusqu'à classification ; aucun remplacement global aveugle.

**Pont MODARYX ↔ MODARYX Forge : EN COURS — contrat à formaliser / runtime PREUVE MANQUANTE.**
