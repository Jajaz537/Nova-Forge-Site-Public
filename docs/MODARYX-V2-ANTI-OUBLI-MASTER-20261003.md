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
| MODARYX Forge = logiciel/écosystème desktop ; MODARYX Public + MODARYX Founder = éditions actives | TERMINÉ — nomenclature canonique ; ancien nom `Nova Forge OS` retiré | CHECKPOINT / FORGE-HANDOFF-CONTRACT |
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
| Collections | TERMINÉ — contrat + capacité explicite + prototype dédié ; validation humaine globale reste EN COURS | COLLECTION-MODPACK-PROFILE / CROSS-ANALYSIS / LIVING-THRESHOLD |
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
| Anti-import CI | TERMINÉ — checker + workflow implémentés / micro-proof frais vert | FRONTEND-ISOLATION / ANTI-CONTAMINATION-GUARD-PROOF |

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
| QA visuelle archivable du prototype | TERMINÉ — export navigateur + a11y ciblée + flows + 57 captures archivées ; comparaison normalisée source + humain/screen-reader/device restent PREUVE MANQUANTE | review-evidence/.../design-qa.md |
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
- pont MODARYX Forge ; les anciennes références techniques `Nova Forge` ne sont que du legacy/provenance et ne doivent jamais être réutilisées comme nom produit actif ;
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

## 28. Test terminologique Work — état historique supersédé

**HISTORIQUE — la mission était prête ; le rapport a depuis été reçu et traité ci-dessous**

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
- **Historique :** à ce stade, **Profils de jeu** vs **Configurations de jeu** restait ouvert ; cet arbitrage est depuis **TERMINÉ** dans la section suivante.


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
- QA visuelle archivable : **TERMINÉE** pour captures/micro-proofs ; comparaison normalisée à la référence approuvée + validation humaine/screen-reader/device restent **PREUVE MANQUANTE**.

Référence : `docs/MODARYX-V2-LIVING-THRESHOLD-DESIGN-SYSTEM-20261003.md`.


## Benchmark écosystèmes modding / transfert MODARYX Forge

**TERMINÉ pour le corpus actuel — recherche retenue et tracée / veille benchmark continue jusqu'à la VF / aucune parité concurrent déclarée**

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
- `Nova Forge` / `Nova Forge OS` = historique/legacy technique uniquement ; **nom produit retiré**, jamais utilisé pour une nouvelle UI, un nouveau document produit ou une nouvelle capacité.

**Pont MODARYX ↔ MODARYX Forge : TERMINÉ — contrat web formalisé dans `docs/MODARYX-V2-FORGE-HANDOFF-CONTRACT-20261004.md` / runtime réel PREUVE MANQUANTE.**


## 29. Expansion produit accélérée — preuve consolidée 2026-10-04

**TERMINÉ pour le prototype ciblé / À MAINTENIR jusqu'à la VF**

Preuve fraîche :
- run `37161527706` — **SUCCESS**
- commit `03858bea92232b3040d76923e53d9a71d822712c`
- artifact `11288295345`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `MULTISCREEN_CAPTURE_COUNT 37`
- desktop/mobile overflow : 0
- keyboard targeted proof : 32/32

À ne plus perdre :
- Game Hub tabs réellement distincts : Aperçu / Mods & contenus / Collections / Créateurs / Guides / Activité ;
- état jeu `Catalogue consultable — téléchargement non garanti` ;
- Support != Signalement ;
- signalement utilisateur = raison + contexte + détail facultatif + brouillon local non envoyé tant que backend absent ;
- Collection != Modpack != Profil de jeu matérialisés dans le prototype ;
- Modpack non installable sans manifeste/runtime réel ;
- Profil de jeu détaillé local/private avec composants, versions, ordre, sync/manager explicites ;
- Bibliothèque : Favoris / Suivis / Collections / Profils de jeu / Recherches enregistrées ;
- Creator Studio : Dashboard / Projects / Releases / Upload / Analytics / Support / Reports / Team / Settings ;
- Compte guest-first + onboarding skippable + confidentialité privée par défaut ;
- Notifications : aucun événement/compteur distant inventé ; canaux absents explicitement indisponibles ;
- Collections, Créateurs, Community et leurs variantes mobile ont des surfaces dédiées ;
- aucun bouton `Installer avec MODARYX Forge` actif tant que le runtime n'est pas prouvé.

Toujours PREUVE MANQUANTE / externe :
- source visuelle approuvée archivable + comparaison normalisée ;
- validation humaine multi-écrans supplémentaire ;
- screen reader réel ;
- appareils physiques ;
- production V2/backend/données/connecteurs réels.

Prochain anti-oubli actif :
- offline/stale/error/retry transverses : **TERMINÉ — prototype ciblé / run 37161856917** ;
- mapping prototype → production : **TERMINÉ — document + surface-map machine-readable / run 37163081008** ;
- comparaison de stack non engageante : **TERMINÉ — aucune stack sélectionnée** ;
- root/frontend V2 production : **BLOQUÉ par gate de validation** ;
- validation humaine multi-écrans, mobile humain, référence visuelle approuvée/comparaison, screen reader et appareils physiques : **PREUVE MANQUANTE / externe** ;
- aucun cutover `main`/public avant les gates dédiés.


## 30. Benchmark actuel écosystèmes de mods — 4 octobre 2026

**TERMINÉ — recherche consolidée / intégration prototype ciblée TERMINÉE**

Document :
`docs/MODARYX-V2-CURRENT-MOD-ECOSYSTEM-BENCHMARK-20261004.md`

Écosystèmes étudiés dans cette passe :
- Nexus Mods / Vortex ;
- CurseForge ;
- Modrinth ;
- Thunderstore / r2modman ;
- Steam Workshop ;
- Bethesda Creations ;
- mod.io ;
- GameBanana ;
- Mod DB ;
- Prism Launcher ;
- Wabbajack ;
- signaux communautaires Reddit utilisés uniquement comme signaux UX.

Décisions retenues à ne pas perdre avant VF :
- toute application future d'une configuration doit afficher un **delta avant mutation** ;
- sémantique **Ajouter / Remplacer / Annuler** explicite ;
- dépendances distinguées par origine : **Choisi / Requis / Transitif / Suggéré / Inclus par curateur** ;
- politique de version : **Auto sûr / Proposer / Épinglé** ;
- mise à jour significative vers **copie/branche/profil séparé** avant promotion ;
- Library doit pouvoir accueillir un **Historique** réel, privé par défaut, uniquement quand backend/runtime le prouve ;
- Creator Studio doit distinguer la **maturité projet** (Concept / WiP / Released / Archived) du canal de release ;
- crédits/auteurs/co-auteurs/studio/assets tiers/droits doivent devenir structurés ;
- Collection reste curation ; son éventuelle application locale est une capacité distincte ;
- support d'une composition complexe relève du curateur/auteur de composition, pas automatiquement des auteurs de chaque mod ;
- source/provider doit rester distinct de l'auteur ;
- import/export doit produire un **rapport de compatibilité/pertes**, jamais une conversion silencieuse ;
- vue débutant recommandée + vue expert transparente sans graph de conflits incompréhensible.

Prototype / production :
- ces décisions sont **retenues comme exigences de conception** ;
- elles ne prouvent aucun runtime MODARYX Forge ;
- aucun téléchargement/installation/provider réel n'est simulé ;
- toute idée ajoutée au prototype doit rester explicitement démonstration/local-only lorsque les services réels sont absents.

**Matérialisation Living Threshold : TERMINÉE pour le périmètre ciblé de cette passe.**

Micro-proof :
- run `37163931034` — **SUCCESS**
- commit capturé `226b41b40f49166c936cf7968391e0d35105b09e`
- artifact `11288409054`
- digest `sha256:0f3c73af5ab4936fc0e10cee121612cef13363b4701a313df70041164f8df60f`
- `MULTISCREEN_CAPTURE_COUNT 47`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`

Matérialisé sans backend :
- Library > Historique privé sans fausse activité ;
- dépendances avec origine ;
- version `Auto sûr / Proposer / Épinglé` ;
- update de Profil vers copie/branche avant promotion ;
- Modpack : delta + `Ajouter / Remplacer / Annuler` ;
- Creator : maturité Concept/WiP/Released/Archived ;
- crédits structurés.

Toujours à ne pas oublier / non matérialisé réellement :
- provider/source réel et sélection multi-source ;
- import/export réel + rapport de compatibilité/pertes ;
- plan avancé alimenté par données/runtime réels ;
- backend, téléchargement, installation et historique réels.

**Provider/source, interop et Plan avancé : TERMINÉ pour le prototype ciblé.**

Preuve fraîche :
- micro-proof readiness CDP : run `37164478594` — **SUCCESS** ;
- continuation Living Threshold : run `37164509544` — **SUCCESS** ;
- commit capturé : `af4972fdf65c1df8248d25fc6f5fcc1c6c88da39` ;
- artifact : `11288507788` ;
- `MULTISCREEN_CAPTURE_COUNT 51` ;
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS` ;
- `PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE`.

Matérialisé honnêtement :
- source/provider séparé de l'auteur ;
- provider réel absent explicitement ;
- Plan avancé lisible sans graphe opaque ;
- rapport import/export avec conservation des champs inconnus ;
- perte silencieuse interdite ;
- aucune importation réelle et aucun parser/connecteur simulé.

Toujours anti-oubli :
- connecteurs/providers réels ;
- parser import/export réel ;
- compatibilité/pertes mesurées sur formats réels ;
- backend/runtime MODARYX Forge ;
- validation humaine/externe.

**Prochain travail interne : poursuivre le benchmark spécialisé et ne retenir que les capacités réellement distinctes.**


## 31. Benchmark spécialisé — relations, compatibilité et handoff — 4 octobre 2026

**TERMINÉ — recherche spécialisée consolidée / intégration prototype ciblée TERMINÉE**

Document :
`docs/MODARYX-V2-SPECIALIZED-MOD-ECOSYSTEM-BENCHMARK-20261004.md`

Écosystèmes spécialisés étudiés :
- Factorio ;
- CKAN / Kerbal ;
- BeamNG ;
- Satisfactory ;
- Farming Simulator ModHub ;
- SMAPI ;
- GTA5-Mods ;
- Paradox Mods ;
- ModWorkshop / MO2 bridge ;
- tModLoader.

Décisions retenues à ne pas perdre :
- relations typées : Required / Recommended / Suggested / Supported / Conflict / ReplacedBy / Alternative ;
- **reverse dependency impact** avant disable/remove/update ;
- CompatibilityClaim multi-dimension : jeu/version/édition/plateforme/loader/channel ;
- preuve + date/fraîcheur + workaround séparés du résultat ;
- capability handshake obligatoire avant tout CTA web→MODARYX Forge ;
- raison lisible si capability absente ;
- version policy enrichie : Auto sûr / Proposer / Épinglé exact / Minimum accepté ;
- validation/modération par plateforme et crossplay séparé ;
- variantes de Release/File par édition/loader/plateforme/format ;
- type de contenu distinct du provider et du runtime ;
- Diagnostic Safe Profile conservé comme capacité future, jamais simulé comme exécuté ;
- synchro save/serveur = delta vers une référence exacte, pas simple Update All.

Peut être matérialisé honnêtement dans Living Threshold :
- types de relations ;
- dépendants inverses ;
- matrice compatibilité/fraîcheur/workaround ;
- CTA manager disabled avec raison ;
- variantes de fichier pédagogiques ;
- pipeline de validation plateforme illustratif ;
- Safe Profile indiqué indisponible.

Ne pas simuler :
- provider API réelle ;
- synchro serveur/save ;
- crossplay testé ;
- safe mode exécuté ;
- manager/runtime desktop ;
- validation plateforme réelle.

**Micro-matérialisation spécialisée : TERMINÉE pour le périmètre ciblé.**

Preuve :
- run `37164976157` — **SUCCESS**
- commit capturé `49ce52287c900e16376e4ccab84008a02a8a92e7`
- artifact `11289531194`
- digest `sha256:699e4daa8110e2182dce58eb7d0fc9fb7648114039bf411bca81d4d7f0e6db53`
- `MULTISCREEN_CAPTURE_COUNT 57`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`

Matérialisé sans prétendre à un runtime réel :
- relations Required/Recommended/Suggested/Conflict/ReplacedBy ;
- reverse dependency impact ;
- matrice de compatibilité multi-dimension ;
- fraîcheur/workaround présents comme dimensions ;
- variantes d'artefacts par édition/loader ;
- capability handshake Forge représenté par CTA disabled + raison ;
- Safe Profile disabled ;
- validation plateforme et Crossplay PREUVE MANQUANTE.

Toujours anti-oubli :
- Alternative/AnyOf et Supported à matérialiser ;
- politique Minimum accepté à matérialiser ;
- états de fraîcheur Current/Aging/Stale à matérialiser ;
- toutes les capacités réelles provider/runtime restent PREUVE MANQUANTE.

**Derniers détails du modèle spécialisé : TERMINÉS pour le prototype exploratoire.**

Preuve :
- run `37165177246` — **SUCCESS**
- commit capturé `8ecd8a139eac084348c503a65d0289d7fb30fdba`
- artifact `11289616195`
- digest `sha256:e3e680c741d79e2bb91dc94bc5b5817ea873182c9422b8dd5e71b476a4c33c76`
- `MULTISCREEN_CAPTURE_COUNT 57`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`.

Fermé au niveau modèle/prototype :
- Supported ;
- Alternative / AnyOf ;
- Minimum accepté ;
- Current / Aging / Stale / Unknown.

Toujours PREUVE MANQUANTE réelle :
- providers/connecteurs ;
- compatibilité/relations alimentées par données réelles ;
- synchronisation/save/server ;
- validation plateforme/crossplay ;
- MODARYX Forge ;
- backend et production.

**Audit interne : TERMINÉ.**

Résultat :
- aucun autre gap produit/prototype honnêtement récupérable n'a été identifié sans inventer backend, runtime, provider ou preuve humaine ;
- le contrat Web → MODARYX Forge est désormais formalisé ;
- les anciennes incohérences documentaires ont été réconciliées ;
- la veille benchmark reste continue jusqu'à la VF, mais le corpus étudié à ce jour est intégré.

Reste réellement externe/runtime :
- validation humaine multi-écrans supplémentaire ;
- mobile humain réel ;
- référence visuelle approuvée archivable + comparaison normalisée ;
- screen reader réel ;
- Safari/appareils physiques ;
- passkeys/backend/préférences distantes ;
- providers/connecteurs réels ;
- runtime MODARYX Forge ;
- PWA/upgrade/cutover production ;
- données/compatibilité/crossplay réels.

**Prochain saut significatif : lever un gate externe ou reclasser explicitement le gate avant création du root/frontend V2 production.**


## 32. Classification finale des blockers après audit interne — 4 octobre 2026

**TERMINÉ — aucun faux progrès ajouté**

### Externe / humain
- validation humaine globale ;
- validation mobile humaine ;
- référence visuelle approuvée archivable ;
- comparaison normalisée source ↔ implémentation ;
- NVDA / VoiceOver / TalkBack ;
- Safari réel ;
- appareils physiques.

### Backend / services
- passkeys réelles ;
- préférences distantes ;
- email/push ;
- données et historique réels ;
- providers/connecteurs ;
- signer / trust anchor ;
- artefacts réels de téléchargement.

### Desktop / runtime MODARYX Forge
- runtime réel ;
- transport/protocole réel ;
- receipt/signature réel ;
- installation/update/rollback réels ;
- Safe Profile réellement exécuté ;
- synchro serveur/save ;
- compatibilité alimentée par données locales réelles.

### Production / migration
- root/frontend V2 production ;
- stack finale ;
- PWA/SW V2 production ;
- migration/upgrade V1→V2 réellement testée ;
- cutover ;
- mesures Core Web Vitals production.

### Historique non récupéré
- Master Nova Design Intelligence complète : **PREUVE MANQUANTE / NON RÉCUPÉRÉE** — ne pas inventer.

Décision :
- ne pas créer de nouvelles fonctionnalités décoratives simplement pour occuper le temps ;
- continuer uniquement la veille benchmark, la maintenance anti-oubli et les micro-proofs nécessaires tant que les gates externes restent fermés ;
- aucun PASS VF/High-Fi final avant fermeture appropriée.


## 33. Game Atmosphere Layer + garde-fous IP — 4 octobre 2026

**TERMINÉ — décision produit + politique préventive tracées**

Document de référence :
`docs/MODARYX-V2-GAME-ATMOSPHERE-IP-POLICY-20261004.md`

Décision retenue :
- MODARYX conserve son design system, sa navigation, sa typographie et ses composants ;
- chaque Game Hub peut recevoir une **Game Atmosphere Layer** originale adaptée au jeu ;
- l'ambiance peut changer, l'identité produit MODARYX reste dominante ;
- concept cible : **Game Atmosphere Engine**.

Garde-fous obligatoires :
- noms de jeux utilisés de façon référentielle/descriptive ;
- aucun logo officiel, key art, screenshot promotionnel, personnage, OST, police officielle ou UI copiée par défaut ;
- assets officiels uniquement avec licence/permission/preuve claire ;
- `Unknown = ne pas utiliser` ;
- ne jamais confondre contenu public sur Internet et contenu libre de droits ;
- média créateur/user-supplied séparé de l'ambiance officielle MODARYX ;
- fallback MODARYX original obligatoire ;
- support futur d'un Game Rights Registry ;
- review éditeur par éditeur ;
- takedown/IP workflow avant lancement public.

Accessibilité/performance :
- thème MODARYX uniforme disponible ;
- ambiance désactivable/réductible ;
- reduced motion ;
- aucun état essentiel porté par le décor ;
- aucun asset propriétaire auto-chargé depuis un GameId.

Avant VF, chaque ambiance doit être classée :
- Original MODARYX ;
- Licensed ;
- Restricted ;
- Unknown = BLOQUÉ ;
- Forbidden = exclu.

Toujours PREUVE MANQUANTE / à implémenter :
- Game Rights Registry réel ;
- checks CI assets/licences ;
- workflow takedown opérationnel ;
- revue juridique externe pour usages commerciaux sensibles ;
- Game Atmosphere Engine production.

**Règle permanente : mieux vaut une ambiance MODARYX originale légèrement moins littérale qu'une imitation risquée de l'identité d'un éditeur.**


## 34. Game Atmosphere Engine — matérialisation exploratoire — 4 octobre 2026

**TERMINÉ pour le prototype / garde-fous droits actifs**

Référence politique :
`docs/MODARYX-V2-GAME-ATMOSPHERE-IP-POLICY-20261004.md`

Matérialisé :
- couches d'ambiance originales MODARYX ;
- jeux fictifs uniquement dans la preuve ;
- switching d'ambiance desktop/mobile ;
- cartes Jeux avec tonalités différenciées ;
- aucun asset éditeur réel ;
- cibles tactiles corrigées à ≥44 px.

Preuve :
- micro-proof touch : run `37193592557` — **SUCCESS**
- Living Threshold : run `37193557372` — **SUCCESS**
- artifact `11299852513`
- digest `sha256:15aad746b128a0be7ae3f2b59d1529c229876a431ac78935cb95c9f4d5e70eec`
- `KEYBOARD_REACHABLE 35 / 35`
- `MULTISCREEN_CAPTURE_COUNT 59`
- `PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS`.

Règles anti-oubli :
- ne jamais créer un thème GTA/RDR/etc. avec assets officiels non autorisés ;
- le nom du jeu peut être référentiel, mais MODARYX doit rester dominant ;
- Game Rights Registry requis avant production ;
- `Unknown = ne pas utiliser` ;
- original MODARYX par défaut ;
- aucune musique/OST officielle sans licence ;
- aucun background marketing automatique à partir d'un screenshot utilisateur ;
- revue éditeur + takedown/IP requis avant lancement public ;
- thème uniforme MODARYX + reduced motion/performance fallback requis.

Toujours PREUVE MANQUANTE :
- vrais profils d'ambiance par jeux commerciaux ;
- rights registry ;
- checks CI droits/licences ;
- validation juridique externe pour usages sensibles ;
- moteur production.

**Règle permanente : une ambiance premium doit renforcer MODARYX sans imiter l'identité protégée d'un éditeur.**


## 35. MODARYX IA — fondation professionnelle — 4 octobre 2026

**DÉCISION RETENUE — à intégrer avant toute IA publique**

Référence :
`docs/MODARYX-AI-FOUNDATION-ARCHITECTURE-20261004.md`

À ne pas perdre :
- MODARYX IA = plateforme IA native, pas simple chatbot ;
- AI Gateway + routing multi-modèles ;
- RAG/Knowledge Layer ;
- outils contrôlés ;
- Permission Engine ;
- agents spécialisés ;
- evals avant release ;
- safety/prompt-injection/data-leak protections ;
- observabilité complète ;
- mémoire contrôlée ;
- site contextuel + MODARYX Forge ;
- provider independence ;
- fine-tuning seulement après mesure ;
- modèle propriétaire de fondation uniquement si avantage réel mesuré.

Cas d'usage prioritaires :
- recherche/discovery ;
- compatibilité ;
- profils/dépendances ;
- Creator Studio ;
- support ;
- Rights & Publisher workflow ;
- diagnostics MODARYX Forge.

Règles :
- pas d'action sensible silencieuse ;
- pas de faux niveau de certitude ;
- pas de décision juridique ambiguë automatisée comme approbation ;
- pas d'entraînement sur données privées par défaut ;
- pas de lancement sans eval suite.

Statut :
- architecture : TERMINÉE ;
- implémentation : PREUVE MANQUANTE / NON COMMENCÉE.


## 36. Support d’un jeu → dossier droits éditeur — 4 octobre 2026

**DÉCISION RETENUE — automatisation production à implémenter**

Référence :
`docs/MODARYX-V2-GAME-SUPPORT-PUBLISHER-RIGHTS-WORKFLOW-20261004.md`

Règles permanentes :
- toute demande de support d’un jeu passe par triage MODARYX ;
- après acceptation, la page peut exister en baseline sûre MODARYX avec ambiance originale ;
- l’acceptation crée un Rights Case ;
- la demande éditeur doit utiliser un canal officiel vérifié ;
- aucune adresse ou identité de contact devinée ;
- aucun double envoi ;
- absence de réponse = aucun droit supplémentaire ;
- seuls les scopes explicitement accordés peuvent être activés ;
- expiration, révocation ou refus rebloquent les usages concernés ;
- les droits web et les capacités MODARYX Forge restent séparés ;
- une réponse éditeur doit être transformée en scopes structurés et notifiée à l’administration ;
- l’administrateur ne doit pas avoir à interpréter seul une réponse juridique ambiguë ;
- ambiguïté ou clause inhabituelle = `LEGAL_REVIEW_REQUIRED`, usages concernés bloqués.

Statut actuel :
- contrat produit : **TERMINÉ** ;
- Game Rights Registry : **NON IMPLÉMENTÉ** ;
- moteur de workflow : **NON IMPLÉMENTÉ** ;
- outbound réel : **NON IMPLÉMENTÉ** ;
- validation automatisée de licence : **NON IMPLÉMENTÉ**.

Avant VF, ce workflow doit être implémenté et testé, ou remplacé provisoirement par un processus manuel contrôlé équivalent.


### Preuve ciblée workflow droits jeux — 4 octobre 2026

**TERMINÉ — contrat pré-production protégé par CI**

Preuve :
- run `37196259361` — **SUCCESS**
- commit capturé `038a5b0e51eea76bb6859f7ead12ed18eef20894`
- workflow `MODARYX V2 Game Rights Workflow Proof`

Le checker bloque toute régression qui ferait de `NO_RESPONSE`, `DECLINED`, `EXPIRED` ou `REVOKED` un état de permission, retirerait le contact officiel vérifié des garde-fous outbound, supprimerait l’idempotence ou fusionnerait les droits web avec MODARYX Forge.

À ne pas sur-déclarer :
- aucun email réel envoyé ;
- aucun contact éditeur réel validé ;
- aucun Game Rights Registry production ;
- aucun moteur de licence production.


## 37. Rights Dashboard — matérialisation et preuve — 4 octobre 2026

**TERMINÉ pour le prototype / production PREUVE MANQUANTE**

Preuves :
- workflow droits : run `37196259361` — **SUCCESS** ;
- Living Threshold : run `37196769573` — **SUCCESS** ;
- artifact `11301477422` ;
- digest `sha256:d9ad41faa1423c22aa986e5f6661447b029a32f1812ed63a3a096b269a0b0eb9` ;
- `KEYBOARD_REACHABLE 36 / 36` ;
- `RIGHTS_MOBILE_OVERFLOW 0` ;
- `MULTISCREEN_CAPTURE_COUNT 61` ;
- surface map : run `37196989554` — **SUCCESS**, 23 surfaces.

À ne pas perdre :
- dashboard admin séparé des surfaces publiques ;
- aucun outbound réel dans le prototype ;
- états de démonstration : APPROVED_WITH_LIMITS / AWAITING_RESPONSE / NO_RESPONSE ;
- scope absent/refusé = bloqué ;
- NO_RESPONSE ≠ autorisation ;
- MODARYX Forge = scope distinct ;
- parsing automatique d’une réponse doit produire des scopes structurés ;
- ambiguïté = LEGAL_REVIEW_REQUIRED ;
- le propriétaire MODARYX ne doit pas être forcé à interpréter seul une réponse juridique.

Toujours PREUVE MANQUANTE :
- Game Rights Registry production ;
- email/API outbound ;
- contact éditeur réel ;
- parsing de réponse réel ;
- validation de licence ;
- revue juridique externe.


## 38. Demande membre de support d’un jeu — matérialisation — 4 octobre 2026

**TERMINÉ pour le prototype local / production PREUVE MANQUANTE**

À conserver :
- entrée depuis Games Index ;
- formulaire nom du jeu + plateforme ;
- validation locale récupérable ;
- brouillon explicitement non envoyé ;
- triage MODARYX obligatoire ;
- aucun Rights Case réel créé dans le prototype ;
- aucune demande éditeur réelle envoyée ;
- après acceptation future seulement : baseline sûre + Rights Case + workflow éditeur.

Preuve :
- run `37198162015` — **SUCCESS**
- commit capturé `103aab8b82684e65020b4c9575df0f6819a69b7f`
- `FLOW_ASSERT game support request local-only triage`
- `GAME_SUPPORT_REQUEST_MOBILE_OVERFLOW 0`
- 63 captures.

Ne jamais transformer une simple demande membre en support officiel, licence, partenariat ou permission éditeur.


### Preuve ciblée contrat demande membre — 4 octobre 2026

**TERMINÉ — invariants pré-production protégés par CI**

Run :
- `37199100800` — **SUCCESS**
- `PASS_V2_GAME_SUPPORT_REQUEST_CONTRACT`

À ne jamais régresser :
- LOCAL_DRAFT n’est pas envoyé ;
- membre ≠ source d’autorisation éditeur ;
- aucun Rights Case ni outbound avant acceptation MODARYX ;
- aucun claim licence/partenariat issu du membre ;
- refus produit = aucun contact éditeur ;
- déduplication avant création Rights Case.


## 39. Réponse éditeur — interprétation automatique sûre — 4 octobre 2026

**TERMINÉ pour le contrat / production PREUVE MANQUANTE**

Preuve :
- run `37199257204` — **SUCCESS**
- `PASS_V2_PUBLISHER_RESPONSE_CONTRACT`

À ne jamais perdre :
- scope non mentionné = non accordé ;
- formulation ambiguë = revue, jamais APPROVED par inférence ;
- risque juridique = LEGAL_REVIEW_REQUIRED ;
- pas d’accord global implicite ;
- Web et MODARYX Forge séparés ;
- expiration/révocation rebloquent ;
- message brut et provenance archivés ;
- notification admin sur réponse matérielle.

Le moteur réel de réception/parsing/licence reste NON IMPLÉMENTÉ.


## 40. Triage admin avant contact éditeur — 4 octobre 2026

**TERMINÉ pour le prototype fictif / production PREUVE MANQUANTE**

Preuve :
- Living Threshold run `37199552009` — **SUCCESS**
- `FLOW_ASSERT member support triage accepted safe baseline only`
- 65 captures
- surface map run `37199924716` — **SUCCESS**

À conserver :
- demande membre → TRIAGE ;
- vérifier existence/doublon/pertinence/restrictions ;
- acceptation produit = `ACCEPTED_SAFE_BASELINE`, pas accord éditeur ;
- Rights Case seulement après acceptation produit ;
- aucun contact/outbound/asset officiel par simple acceptation locale ;
- refus produit = aucun contact éditeur.


## 41. Contact éditeur vérifié avant REQUEST_READY — 4 octobre 2026

**TERMINÉ pour le prototype/contrat — production PREUVE MANQUANTE**

Preuves :
- Living Threshold run `37201151562` — **SUCCESS** ;
- Game Rights Workflow run `37201224168` — **SUCCESS** ;
- surface map run `37201297613` — **SUCCESS** ;
- 69 captures ;
- `PUBLISHER_CONTACT_MOBILE_OVERFLOW 0` ;
- `FLOW_ASSERT publisher contact verified before request ready`.

À ne jamais perdre :
- CONTACT_CANDIDATE ne permet aucun outbound ;
- CONTACT_VERIFIED exige une provenance officielle vérifiable ;
- adresse devinée / forum seul / scrape non vérifié / intermédiaire non vérifié = interdits ;
- REQUEST_READY exige support accepté + Rights Case + contact vérifié + scopes explicites + template courant ;
- REQUEST_READY n’est pas REQUEST_SENT ;
- outbound réel reste bloqué sans backend autorisé ;
- Web et MODARYX Forge gardent leurs scopes séparés.

Toujours PREUVE MANQUANTE :
- recherche de contact réelle ;
- vérification domaine/contact réelle ;
- mailbox/outbound ;
- licence réelle.


## 42. Notifications droits éditeurs — 4 octobre 2026

**TERMINÉ pour contrat + micro-proof / backend réel PREUVE MANQUANTE**

À conserver :
- notification in-app seulement sur événement réel futur ;
- réponse éditeur reçue ;
- approval / approval with limits ;
- needs more info ;
- legal review required ;
- declined ;
- expiration/révocation ;
- lien obligatoire vers le Rights Case réel ;
- scopes exacts, jamais d’autorisation globale implicite ;
- `LEGAL_REVIEW_REQUIRED` = aucun déblocage ;
- adresse/contact/clause confidentielle non exposés ;
- badge non lu uniquement à partir de données réelles ;
- email/push uniquement quand infrastructure réelle prouvée.

Prototype :
- cartes explicitement `Démonstration · non reçue` ;
- aucune notification distante inventée ;
- aucun compteur distant inventé.

Preuves :
- contrat run `37202025942` — **SUCCESS**, `PASS_V2_RIGHTS_NOTIFICATION_CONTRACT` ;
- incident ciblé Living Threshold `37201905576` : FAIL browser a11y sur copy notification ;
- isolation micro-proof `37202147304` : FAIL sur différence de casse due à `text-transform: uppercase` ;
- correction ciblée des assertions ;
- micro-proof `37202244972` — **SUCCESS** ;
- `RIGHTS_NOTIFICATION_MOBILE_OVERFLOW 0` ;
- `PASS_V2_RIGHTS_NOTIFICATION_PREVIEW`.

Ne pas déclarer notification production tant que event bus, Rights Case deep-link, unread count, email et push réels n’existent pas.


## 43. Cycle de vie automatique des droits éditeurs — 4 octobre 2026

**TERMINÉ pour contrat + prototype / production PREUVE MANQUANTE**

À ne jamais perdre :
- ACTIVE_WITH_LIMITS ;
- EXPIRING_SOON ;
- EXPIRED ;
- REVOKED ;
- expiration et révocation rebloquent immédiatement les usages dépendants ;
- expiration proche ne crée aucun droit nouveau ;
- fallback baseline originale MODARYX lorsque juridiquement acceptable ;
- aucune réactivation silencieuse ;
- nouvelle preuve requise avant réactivation ;
- Web et MODARYX Forge restent séparés ;
- transition auditée et lock idempotent.

Preuves :
- contrat run `37204099457` — **SUCCESS**, `PASS_V2_RIGHTS_LIFECYCLE_CONTRACT` ;
- Living Threshold run `37204012017` — **SUCCESS** ;
- `FLOW_ASSERT rights lifecycle expired revoked scopes reblocked` ;
- 73 captures.

Toujours PREUVE MANQUANTE :
- scheduler réel ;
- détection expiration réelle ;
- réception révocation réelle ;
- lock production ;
- revalidation/licence réelle.


## 44. IP / takedown / fallback MODARYX — 4 octobre 2026

**TERMINÉ pour contrat + prototype / production PREUVE MANQUANTE**

À ne jamais perdre :
- canal IP/copyright avant lancement public ;
- IpCase traçable ;
- autorité déclarée ≠ autorité vérifiée ;
- asset contesté localisé précisément ;
- restriction temporaire limitée au scope ;
- preuves et provenance conservées ;
- fallback original MODARYX ;
- pas de réupload automatique ;
- LEGAL_REVIEW_REQUIRED sur ambiguïté ;
- aucune restauration automatique ;
- audit trail append-only logique ;
- cache/CDN/SW à invalider en production ;
- contacts/clauses privés non exposés publiquement ;
- détection anti-réupload jamais utilisée comme unique preuve juridique.

Preuves :
- contrat run `37204583345` — **SUCCESS**, `PASS_V2_IP_TAKEDOWN_CONTRACT` ;
- Living Threshold run `37204720263` — **SUCCESS** ;
- `FLOW_ASSERT ip takedown containment preserves evidence fallback legal escalation` ;
- 75 captures ;
- surface map run `37204857565` — **SUCCESS**.

Toujours PREUVE MANQUANTE :
- backend cases ;
- formulaire/mailbox IP ;
- cache invalidation réelle ;
- anti-réupload réel ;
- recours ;
- legal review opérationnelle ;
- validation juridique externe.


## 45. Asset rights provenance guard — 4 octobre 2026

**TERMINÉ pour le prototype / production PREUVE MANQUANTE**

À conserver :
- tout asset média doit être classifié ;
- asset non listé = bloqué ;
- Unknown = bloqué ;
- Forbidden = bloqué ;
- hash/blob change = manifest à revoir ;
- assets prototype actuels = ORIGINAL_MODARYX_DEMO / ALLOWED_PROTOTYPE_ONLY ;
- aucune URL média distante arbitraire dans Living Threshold ;
- classification prototype ne vaut jamais licence production.

Preuve :
- run `37205150007` — **SUCCESS**
- 2 assets inventoriés ;
- 0 référence média distante ;
- `PASS_V2_ASSET_RIGHTS_PROVENANCE`.

Avant production :
- provenance/licence archivable ;
- manifest/registry pour tous assets réels ;
- intégration avec Game Rights Registry ;
- extension du guard au futur root/media production.


## 46. Game Rights Registry — contrat structurel — 4 octobre 2026

**TERMINÉ pour le contrat / production PREUVE MANQUANTE**

À ne jamais perdre :
- décision = jeu + scope + surface + conditions + preuve + dates ;
- jamais `Game = APPROVED` global ;
- GRANTED / GRANTED_WITH_LIMITS seuls statuts potentiellement autorisants ;
- NO_RESPONSE / PENDING / LEGAL_REVIEW_REQUIRED / EXPIRED / REVOKED = non autorisants ;
- Web et MODARYX Forge séparés ;
- assets tiers reliés à un ScopeDecision ;
- derived flags jamais source d'autorité ;
- registry indisponible = fail closed ;
- imports anciens = non vérifiés ;
- membre ne peut pas écrire une licence ;
- MODARYX IA ne peut pas accorder sans policy gate ;
- audit append-only logique.

Preuve :
- run `37205429699` — **SUCCESS**
- 8 surfaces ;
- 18 scopes ;
- 10 statuts ;
- 14 activation guards ;
- 14 invariants ;
- `PASS_V2_GAME_RIGHTS_REGISTRY_CONTRACT`.

Toujours PREUVE MANQUANTE :
- DB/API ;
- admin CRUD réel ;
- policy engine ;
- scheduler ;
- asset linkage ;
- audit store.


## 47. MODARYX IA — preview site et contrat machine — 4 octobre 2026

**TERMINÉ pour prototype/contrat / système réel PREUVE MANQUANTE**

Preuves :
- Living Threshold run `37211271783` — **SUCCESS** ;
- 77 captures ;
- `FLOW_ASSERT modaryx ai preview no fake model or action` ;
- Assistant Contract run `37211787695` — **SUCCESS** ;
- `PASS_V2_MODARYX_AI_INTEGRATION_CONTRACT`.

À conserver avant VF :
- MODARYX IA est une surface native, pas un chatbot isolé ;
- aucune fausse réponse IA dans le prototype ;
- composer désactivé sans backend ;
- permissions en niveaux READ / PLAN / EXECUTE_SAFE / EXECUTE_SENSITIVE / BLOCKED ;
- preuve insuffisante doit rester explicite ;
- aucune permission juridique ou compatibilité certaine inventée ;
- provider independence.

Production toujours non implémentée :
- gateway ;
- modèles/providers ;
- knowledge/retrieval ;
- tools ;
- permission engine ;
- evals ;
- observabilité ;
- mémoire réelle ;
- intégration MODARYX Forge.


## 48. Publisher Outbound — transport automatique contrôlé — 4 octobre 2026

**TERMINÉ pour le contrat / transport production PREUVE MANQUANTE**

Preuve :
- run `37210953700` — **SUCCESS**
- `PUBLISHER_OUTBOUND_STATE_COUNT 11`
- `PUBLISHER_OUTBOUND_ENQUEUE_GUARD_COUNT 9`
- `PUBLISHER_OUTBOUND_INVARIANT_COUNT 10`
- `PASS_V2_PUBLISHER_OUTBOUND_CONTRACT`

À ne jamais perdre :
- REQUEST_READY n’est pas envoyé ;
- contact officiel vérifié avant queue ;
- support accepté + Rights Case + scopes + template + canal autorisé requis ;
- clé d’idempotence unique ;
- refus actif / opt-out bloque la queue ;
- transport réussi n’accorde aucun droit ;
- bounce ne déclenche jamais la recherche d’une adresse devinée ;
- retry technique conserve l’identité logique de la demande ;
- relance éditeur ≠ retry technique ;
- Web et MODARYX Forge gardent leurs scopes séparés.

Toujours PREUVE MANQUANTE :
- queue réelle ;
- provider email/API ;
- identité d’envoi ;
- webhook delivery/bounce ;
- corrélation reply ;
- audit transport production.


## 49. Publisher Inbound — réception/corrélation/provenance — 4 octobre 2026

**TERMINÉ pour contrat + prototype / production PREUVE MANQUANTE**

Preuves :
- contrat run `37214242330` — **SUCCESS**, `PASS_V2_PUBLISHER_INBOUND_CONTRACT` ;
- micro-proof run `37214564614` — **SUCCESS**, `PASS_V2_PUBLISHER_INBOUND_PREVIEW` ;
- Living Threshold run `37214829645` — **SUCCESS** ;
- 81 captures ;
- `FLOW_ASSERT publisher inbound correlation provenance fail-closed`.

À ne jamais perdre :
- réception ≠ corrélation ≠ provenance ≠ interprétation ;
- transport inbound ne donne aucun droit ;
- corrélation requise avant interprétation automatisée ;
- SPF/DKIM/DMARC = signaux techniques, pas autorité juridique suffisante ;
- expéditeur inconnu ne devient jamais “vérifié” par supposition ;
- pièces jointes mises en quarantaine, hashées et scannées avant usage ;
- aucune macro/script/contenu actif exécuté ;
- message brut + headers conservés ;
- provenance ambiguë/non fiable = fail closed / revue ;
- Web et MODARYX Forge séparés.

Toujours PREUVE MANQUANTE :
- mailbox/webhook réel ;
- moteur corrélation ;
- provenance réelle ;
- scanner pièces jointes ;
- parser/routing ;
- audit store production.


## 50. Tablet reflow — 4 octobre 2026

**TERMINÉ pour browser emulation / appareil réel PREUVE MANQUANTE**

Erreur exacte initiale :
- run `37215370580` : Game Hub 834×1112 → overflow horizontal **220 px** ;
- cause : topbar desktop trop large.

Correction :
- shell navigation compact pour 761–1050 px.

Preuve finale :
- run `37215965531` — **SUCCESS**
- `TABLET_REFLOW_SURFACE_COUNT 12`
- `PASS_V2_TABLET_REFLOW`
- 12 surfaces à overflow 0.

Continuation CSS :
- Living Threshold run `37215577121` — **SUCCESS**
- 81 captures ;
- keyboard `37 / 37` ;
- desktop/mobile overflow `0 / 0`.

À ne pas perdre :
- tablet doit être recomposé, pas simplement desktop compressé ;
- menu compact autorisé sur medium viewport ;
- aucune preuve browser simulée ne ferme le blocker appareil physique ;
- iPad/Safari/tactile humain restent PREUVE MANQUANTE.


## 51. Responsive matrix + narrow 320 — 4 octobre 2026

**TERMINÉ pour browser emulation / appareils réels PREUVE MANQUANTE**

Narrow 320 :
- run `37217511653` — SUCCESS
- `PASS_V2_NARROW_REFLOW_320`
- 12 surfaces à overflow 0.

Responsive matrix :
- run `37218193186` — SUCCESS
- largeurs : 360 / 430 / 768 / 1024 / 1280 / 1920
- 12 surfaces testées par largeur
- marqueurs `PASS_V2_REFLOW_VIEWPORT_<width>`.

À conserver :
- Account mobile : track `minmax(0,1fr)`, actions wrappables ;
- publisher contact actions : track `minmax(0,1fr)`, min-width 0 ;
- aucune largeur courante testée ne doit réintroduire un overflow horizontal.

Limite :
- browser automation uniquement ;
- vrai zoom utilisateur, text resize, Safari, tactile, appareils physiques et screen readers restent PREUVE MANQUANTE.


## 52. Sémantique des états actifs — 4 octobre 2026

**TERMINÉ pour navigateur automatisé / AT réel PREUVE MANQUANTE**

À conserver :
- destination principale active exposée avec `aria-current="page"` ;
- utilitaires Compte / Bibliothèque / Notifications / MODARYX IA exposent l’état courant ;
- onglets locaux et toggles exposent `aria-pressed` ;
- changement visuel actif et sémantique doivent rester synchronisés.

Preuve :
- run `37219118824` — **SUCCESS**
- `PASS_V2_ACTIVE_STATE_SEMANTICS`
- Living Threshold `37219047594` — **SUCCESS**
- 81 captures.

Ne jamais considérer cette preuve comme validation screen reader réelle.


## 53. Skip link + focus SPA + reduced motion — 4 octobre 2026

**TERMINÉ pour navigateur automatisé**

À conserver :
- skip link visible au focus ;
- destination `#main-content` unique sur l’écran monté ;
- changement de route SPA → focus contenu principal ;
- motion normale → scroll smooth ;
- `prefers-reduced-motion: reduce` → scroll auto ;
- aucune animation obligatoire pour comprendre ou atteindre une route.

Preuve :
- micro-proof final `37219490005` — **SUCCESS**
- `PASS_V2_ROUTE_FOCUS_AND_SKIP_LINK`
- Living Threshold `37219359937` — **SUCCESS**
- keyboard `38 / 38`
- 81 captures.

Screen reader et validation humaine clavier restent PREUVE MANQUANTE.


## 54. Structure accessibilité multi-surfaces — 4 octobre 2026

**TERMINÉ pour Chrome automatisé / AT réel PREUVE MANQUANTE**

À ne pas perdre :
- un landmark principal unique par surface ;
- le `h1` de page doit appartenir au landmark principal ;
- `#main-content` doit rester la cible du skip link et du focus de route ;
- pas d’ID dupliqué ;
- pas de tabindex positif ;
- contrôles visibles nommés ;
- rôles interactifs AX ciblés nommés.

Incident fermé :
- Game Hub h1 hors main détecté par run `37219723858` ;
- correction structurelle ciblée ;
- run `37219841541` — **SUCCESS**
- 15 surfaces ;
- `PASS_V2_ACCESSIBILITY_STRUCTURE_MATRIX`.

Continuation Living Threshold `37219841451` — SUCCESS, 81 captures.


## 39. Formulaires + hiérarchie de titres — preuves ciblées — 4 octobre 2026

**TERMINÉ pour prototype automatisé / AT réel PREUVE MANQUANTE**

À conserver :
- erreurs formulaire associées par `aria-invalid` / `aria-describedby` ;
- focus récupérable ;
- erreur retirée après correction ;
- hiérarchie de titres sans saut sur les 15 surfaces couvertes ;
- Content Detail : `h1` avant sous-sections dans l’ordre DOM ;
- Catalog : cartes en `h2`, autres contextes conservent leur niveau approprié.

Preuves :
- form semantics : run `37220323315` — **SUCCESS** — `PASS_V2_FORM_VALIDATION_SEMANTICS` ;
- structure matrix : run `37221433701` — **SUCCESS** — `PASS_V2_ACCESSIBILITY_STRUCTURE_MATRIX` ;
- Living Threshold : run `37221433677` — **SUCCESS**, 81 captures, keyboard 38/38.

Incident checker route-focus après correction :
- `ECONNREFUSED 127.0.0.1:9242` ;
- hardening CDP ciblé ;
- run `37221560230` — **SUCCESS**.


## 55. Text spacing reflow + navigation logo — 4 octobre 2026

**TERMINÉ pour preuves navigateur ciblées / réel humain PREUVE MANQUANTE**

À conserver :
- logo MODARYX du shell → Découvrir ;
- text spacing ne doit pas casser le reflow ;
- preuve text spacing couvre 12 surfaces à 390×844 ;
- override QA : line-height 1.5, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2em ;
- overflow horizontal 0 ;
- clipping horizontal ciblé 0.

Preuves :
- Living Threshold `37223254174` — **SUCCESS**, 81 captures, `FLOW_ASSERT MODARYX logo returns to discover` ;
- Text Spacing Reflow `37224236854` — **SUCCESS**, `PASS_V2_TEXT_SPACING_REFLOW`.

Ne jamais convertir ces preuves en :
- validation zoom navigateur réelle ;
- Safari/iOS réel ;
- screen reader réel ;
- validation humaine finale.


## 56. Help / Documentation — structure + contrat — 4 octobre 2026

**TERMINÉ pour prototype/contrat / contenu final PREUVE MANQUANTE**

À ne jamais perdre :
- aide intégrée au produit, pas un cul-de-sac ;
- documentation dérivée des capacités réellement livrées ;
- aucune capacité absente présentée comme réelle ;
- documentation finale versionnée, sourcée et fraîche ;
- stale docs → revue obligatoire ;
- docs officielles distinctes du contenu communautaire ;
- textes juridiques séparés et dérivés des faits réels ;
- MODARYX Forge documenté uniquement selon le runtime/capability handshake réel ;
- MODARYX IA ne doit pas traiter les docs comme instructions système ;
- accessibilité docs = structure, clavier, focus, reflow, forced colors + AT réel avant fermeture finale.

Preuves :
- contrat : run `37229486530` — **SUCCESS**
- `HELP_DOCS_STATE_COUNT 7`
- `HELP_DOCS_TOPIC_COUNT 16`
- `HELP_DOCS_INVARIANT_COUNT 11`
- `PASS_V2_HELP_DOCUMENTATION_CONTRACT`
- surface map run `37229378669` — **SUCCESS**, **26 surfaces**
- Living Threshold run `37228199151` — **SUCCESS**
- artifact `11312597804`
- digest `sha256:a67562f537c087e56417367be5c8f2b1da5268bd21d045dbbfc9196a0d4ab45d`
- `KEYBOARD_REACHABLE 40 / 40`
- 85 captures.

Toujours PREUVE MANQUANTE :
- contenu final production ;
- repository/pipeline docs ;
- search docs ;
- link/stale checking production ;
- validation humaine ;
- AT/appareils ;
- revue juridique des textes qui le nécessitent.


## 57. Modération / signalements / appels — 4 octobre 2026

**TERMINÉ pour contrat + prototype / production PREUVE MANQUANTE**

À ne jamais perdre :
- Support ≠ Signalement ;
- objets signalables contextualisés ;
- états received / triaged / under-review / actioned / no-action / appealed / closed ;
- hide/restrict/quarantine/remove/restore/request-changes = actions serveur ;
- aucun contrôle client seul ne peut effectuer une action destructive ;
- appel rattaché à la décision précédente ;
- appel n’efface jamais l’historique ;
- rôle moderator / appeals-reviewer / administrator fourni par l’autorité serveur ;
- audit trail actor/action/target/timestamp/reason/previous/next ;
- reporter : réception sans promesse de résultat ;
- créateur : uniquement raison/état partageables ;
- mobile : report/tracking/response/appeal ;
- statut textuel, pas couleur seule.

Preuves :
- contract run `37230196601` — **SUCCESS**, `PASS_V2_MODERATION_APPEALS_CONTRACT` ;
- Living Threshold `37230093681` — **SUCCESS**, 87 captures ;
- `FLOW_ASSERT moderation appeals preserves server authority and prior decision` ;
- accessibility run `37230250723` — **SUCCESS**, structure/touch/forced colors incluent moderation ;
- keyboard run `37230361038` — **SUCCESS**, moderation 24/24 ;
- text spacing `37230028555` — SUCCESS ;
- narrow 320 `37230036543` — SUCCESS ;
- tablet `37230040694` — SUCCESS ;
- surface map `37230139266` — SUCCESS, 27 surfaces.

Incident checker fermé :
- `37230089556` : `ECONNREFUSED 127.0.0.1:9243` avant assertions ;
- correction readiness Chrome ciblée ;
- micro-proof `37230250723` vert.

Toujours PREUVE MANQUANTE :
- report backend ;
- moderation backend ;
- role authority ;
- quarantine/remove/restore ;
- audit store ;
- appeal backend ;
- notifications réelles ;
- validation humaine / AT / appareils.


## 58. SEO / i18n / contenu — preuve contrat — 4 octobre 2026

**TERMINÉ pour le contrat / production PREUVE MANQUANTE**

Preuve :
- run `37230817511` — **SUCCESS**
- `SEO_I18N_EDITORIAL_STATE_COUNT 5`
- `SEO_I18N_INVARIANT_COUNT 12`
- `PASS_V2_SEO_I18N_CONTENT_CONTRACT`.

À conserver :
- preview toujours noindex ;
- title unique / description / canonical / URL lisible pour surfaces indexables finales ;
- sitemap ;
- pages removed explicites ;
- données structurées seulement exactes ;
- filtres/facettes sans explosion d’URLs indexables ;
- Game Hub actif indexé uniquement si support réel le justifie ;
- aucun faux chiffre ou compatibilité non prouvée dans snippets ;
- UI MODARYX distincte des contenus créateurs/communautaires ;
- textes longs / pluriels / dates/nombres / langues multiples ;
- contenu créateur peut rester dans langue originale ;
- recherche accent-insensitive ;
- texte juridique traduit = approbation requise.

Toujours PREUVE MANQUANTE :
- canonicals production ;
- sitemap ;
- routing removed/410 ;
- schema.org production ;
- pipeline localisation ;
- revue SEO production.


## 59. Prototype security sinks / inline styles — 4 octobre 2026

**TERMINÉ pour le prototype source**

À conserver :
- aucune référence distante dans le checker ciblé ;
- aucun sink dangereux ciblé ;
- aucun style inline React dans la source Living Threshold ciblée ;
- règles media/targets déplacées vers le CSS ;
- objectif : faciliter une future CSP stricte sans `unsafe-inline` généralisé.

Preuve :
- run `37231081387` — **SUCCESS**
- commit `50d1d2aab8146aea5e6a63189c262497c73c2df3`
- `PROTOTYPE_SECURITY_REMOTE_REFERENCE_COUNT 0`
- `PROTOTYPE_SECURITY_DANGEROUS_SINK_COUNT 0`
- `PROTOTYPE_SECURITY_INLINE_STYLE_COUNT 0`
- `PASS_V2_PROTOTYPE_SECURITY_SINKS`.

Ne jamais convertir ce micro-proof en certification sécurité production.


## 60. CSP / headers / rich text — contrat machine — 4 octobre 2026

**TERMINÉ pour le contrat / runtime PREUVE MANQUANTE**

Preuve :
- run `37232040196` — **SUCCESS**
- `PASS_V2_CSP_HEADERS_RICH_TEXT_CONTRACT`.

À ne pas perdre :
- CSP stricte self-first ;
- no global unsafe-inline ;
- no unsafe-eval ;
- rich text plain text par défaut ;
- sanitize allowlist avant render ;
- protocoles liens user http/https seulement ;
- SW V2 isolé ;
- preview noindex et Report-Only avant enforcement ;
- COOP/COEP/CORP seulement après compatibilité réelle.

Aucun header public réel n'a été modifié par cette preuve.


## 61. Notifications / préférences — contrat machine — 4 octobre 2026

**TERMINÉ pour le contrat / backend PREUVE MANQUANTE**

Preuve :
- run `37232212946` — **SUCCESS**
- `PASS_V2_NOTIFICATIONS_PREFERENCES_CONTRACT`.

À conserver :
- pas de fausse notification distante ;
- canaux email/push indisponibles sans infra réelle ;
- marketing séparé avec opt-in ;
- compteur réel uniquement ;
- sync conflict explicite, jamais écrasement silencieux ;
- notification droits rattachée à un événement réel ;
- aucune clause confidentielle ou contact privé exposé ;
- `LEGAL_REVIEW_REQUIRED` n'accorde aucun scope.


## 62. Onboarding / compte / créateur — contrat machine — 4 octobre 2026

**TERMINÉ pour le contrat / services réels PREUVE MANQUANTE**

Preuve :
- run `37232342904` — **SUCCESS**
- `PASS_V2_ONBOARDING_ACCOUNT_CREATOR_CONTRACT`.

À ne pas perdre :
- guest-first ;
- onboarding optionnel et skippable ;
- compte ≠ profil public ≠ capacité créateur ;
- données privées par défaut ;
- partage explicite ;
- rôles team côté serveur ;
- états session explicites ;
- passkey configurée seulement après preuve réelle ;
- pas de marketing par défaut ;
- erreurs de sauvegarde sans perte silencieuse.


## 63. Gouvernance API — contrat machine — 4 octobre 2026

**TERMINÉ pour le contrat / runtime PREUVE MANQUANTE**

Preuve :
- run `37232488908` — **SUCCESS**
- `PASS_V2_API_GOVERNANCE_CONTRACT`.

À ne pas perdre :
- versionnement explicite ;
- dépréciation documentée avec migration ;
- champs stables sans changement sémantique silencieux ;
- clients frontend centralisés ;
- protocoles Forge versionnés et négociés ;
- webhooks signés/idempotents/replay-protected ;
- contract tests + anciennes/nouvelles fixtures + rollback avant évolution stable.


## 64. Registre consolidé contrats pré-production — 4 octobre 2026

**TERMINÉ — 19 contrats protégés par une preuve commune**

Incident fermé proprement :
- run initial `37232662714` : checker async fichier manquant ;
- isolation : unique checker manquant ;
- correction ciblée : ajout `qa/check-v2-async-loading-contract.mjs` ;
- continuation `37232747869` — **SUCCESS**.

Preuve :
- 19 contrats ;
- 19 checkers verts ;
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Règle :
le registry prouve la cohérence des contrats, jamais la disponibilité d'un service production.


## 65. Public trust — contrat machine — 4 octobre 2026

**TERMINÉ pour le contrat / publication PREUVE MANQUANTE**

Preuve :
- public trust run `37233036635` — **SUCCESS**
- `PASS_V2_PUBLIC_TRUST_CONTRACT`
- registry run `37233086517` — **SUCCESS**
- 20 contrats consolidés.

À ne pas perdre :
- aucune identité légale ou coordonnée réelle inventée ;
- placeholder ≠ texte final ;
- canaux publics doivent réellement exister ;
- privacy doit refléter l'architecture déployée ;
- disclosures IA doivent refléter les providers actifs ;
- publication seulement après approbation réelle.


## 61. Route / cutover — garde-fou machine — 4 octobre 2026

**TERMINÉ pour le contrat / exécution réelle PREUVE MANQUANTE**

Preuve consolidée :
- run `37235052411` — **SUCCESS**
- `PASS_V2_ROUTE_CUTOVER_CONTRACT`
- `CONTRACT_REGISTRY_PASS route-cutover`
- registry : 21 contrats.

À ne pas perdre :
- build V2 isolé ;
- preview immutable liée au SHA ;
- mapping redirects validé avant promotion ;
- aucun redirect global aveugle ;
- 404/410 conservés lorsque sémantiquement corrects ;
- aucun canonical getnovaforge ;
- preview noindex ;
- SW V1→V2 avec ordre de migration/rollback ;
- aucune suppression globale du storage ;
- namespace V2 `modaryx:v2:` ;
- aucune action DNS/Cloudflare critique sans instruction explicite ;
- production et `main` restent intacts avant promotion contrôlée.

Toujours non exécuté :
- root V2 ;
- redirects réels ;
- migration SW browser ;
- cutover ;
- DNS/Cloudflare.


## 62. Registry contrats pré-production — 35 contrats — 4 octobre 2026

**TERMINÉ pour les invariants machine / production PREUVE MANQUANTE**

Run consolidé :
- `37235820192` — **SUCCESS**
- `PREPRODUCTION_CONTRACT_COUNT 35`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

Nouveaux contrats inclus :
- storage/cache/SW migration ;
- trust/provenance/distribution ;
- install manager ;
- frontend isolation ;
- threat model ;
- a11y/perf/design system ;
- game support lifecycle ;
- Game Hub ;
- search/filter/discovery ;
- Content Detail ;
- Collection/Modpack/Profile ;
- Creator Studio ;
- Community/Library/navigation ;
- critical flows.

À ne jamais déduire de ce PASS :
- backend réel ;
- auth réelle ;
- service worker production ;
- MODARYX Forge réel ;
- distribution réelle ;
- validation humaine/appareil ;
- High-Fi final ;
- VF.


## 63. VF readiness gate — 32 blockers ouverts — 4 octobre 2026

**TERMINÉ pour le garde-fou machine / VF BLOQUÉE**

Preuve :
- run `37235975698` — **SUCCESS**
- `VF_READINESS_OPEN_BLOCKER_COUNT 32`
- `VF_READINESS_STATUS BLOCKED`
- `PASS_V2_VF_READINESS_GATE`.

Règle :
aucun PASS prototype, navigateur, contrat, PR ou surface-map ne peut transformer automatiquement l'état en VF.

Le passage à `READY` est interdit tant qu'un blocker requis des catégories suivantes reste ouvert :
- humain/appareil ;
- web production ;
- MODARYX Forge runtime ;
- droits/légal.


## 64. Architecture/data/schema/states — preuve machine — 4 octobre 2026

**TERMINÉ pour les contrats / runtime PREUVE MANQUANTE**

Run consolidé :
- `37236188453` — **SUCCESS**
- `PREPRODUCTION_CONTRACT_COUNT 39`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

À conserver :
- frontières UI/application/domain/adapters ;
- aucune dépendance domain au navigateur/CSS/Auth0/Cloudflare ;
- aucune fixture technique en production ;
- démonstration toujours explicite ;
- schémas v2 séparés et versionnés ;
- ContentItem ≠ Release ;
- Collection ≠ Modpack ≠ Profile ;
- états dégradés/transitoires obligatoires ;
- stale ≠ current ;
- unauthorized ≠ forbidden ;
- unverified ≠ success ;
- aucune progression ou capacité runtime simulée.


## 65. QA strategy + risk register — 41 contrats — 4 octobre 2026

**TERMINÉ pour les invariants / preuves finales distinctes**

Run :
- `37236335418` — **SUCCESS**
- `PREPRODUCTION_CONTRACT_COUNT 41`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

À ne pas oublier :
- chaque catégorie QA valide uniquement sa propre catégorie ;
- pas de full replay après erreur ciblée ;
- CWV terrain seulement après mesure réelle ;
- risque documenté ≠ fermé ;
- cutover exige rollback ;
- humain/appareils ne peuvent pas être simulés ;
- faux PASS/VF interdit.


## 66. Acceptance / architecture / taxonomie / mapping — 45 contrats — 4 octobre 2026

**TERMINÉ pour les contrats / runtime PREUVE MANQUANTE**

Run :
- `37236534430` — **SUCCESS**
- `PREPRODUCTION_CONTRACT_COUNT 45`
- `PASS_V2_PREPRODUCTION_CONTRACT_REGISTRY`.

À conserver :
- screen acceptance global gate ;
- architecture produit fonctionnelle avant lore ;
- taxonomie extensible par jeu ;
- agrégats non traités comme fichiers ordinaires ;
- V1 immuable ;
- aucun mapping qui invente une donnée absente ;
- catalog demo = fixture only ;
- search index V1 reconstruit pour V2 ;
- migrations localStorage/routes explicites et non destructives.


## 67. Naming / wording canonique — 46 contrats — 4 octobre 2026

**TERMINÉ pour le contrat / humain global PREUVE MANQUANTE**

Preuve :
- run `37236723146` — **SUCCESS**
- `PASS_V2_NAMING_WORDING_CONTRACT`
- registry : 46 contrats.

À ne jamais perdre :
- MODARYX web ≠ MODARYX Forge desktop ;
- éditions = MODARYX Public / MODARYX Founder ;
- Nova Forge OS reste retiré comme nom produit actif ;
- getnovaforge reste historique/abandonné ;
- Mods & contenus ;
- Profils de jeu ;
- Mes profils pour ce jeu ;
- Configurations enregistrées de mods, versions et réglages. ;
- Non vérifié générique interdit ;
- MODARYX IA jamais présentée active sans runtime réel.


## 68. Forge handoff + stack gate — 48 contrats — 4 octobre 2026

**TERMINÉ pour les garde-fous / implémentation réelle PREUVE MANQUANTE**

Run :
- `37236949498` — **SUCCESS**
- `PASS_V2_FORGE_HANDOFF_CONTRACT`
- `PASS_V2_TECH_STACK_SELECTION_GATE_CONTRACT`
- registry : 48 contrats.

À conserver :
- handoff web = intention structurée, jamais commande locale ;
- handshake + revalidation Forge + confirmation locale ;
- aucun Installed/Updated/Rollback réussi sans receipt vérifiable ;
- transport Forge non sélectionné ;
- aucune stack choisie tant que le gate canonique bloque ;
- aucun root V2 créé par inertie ;
- strict CSP / SW contrôlé / preview SHA / isolation legacy obligatoires.
