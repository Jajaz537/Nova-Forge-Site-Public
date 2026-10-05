# MODARYX V2 — Living Threshold / design system préparatoire

**Date : 2026-10-03**  
**Statut : EXPLORATION RÉVERSIBLE SÉLECTIONNÉE — HIGH-FI FINAL BLOQUÉ**

Ce document formalise la direction exploratoire choisie humainement parmi trois propositions. Il ne constitue ni un gel esthétique, ni une validation de production, ni une autorisation d'intégrer du code au frontend public.

## 1. Décision de direction

Base sélectionnée : **Living Threshold** (option 2).

Affinage humain : conserver la composition et l'atmosphère de l'option 2, avec une palette hybride issue des options 2 et 3.

- bleu nuit, cobalt et teal : monde, profondeur, surfaces ;
- cyan électrique : action principale, focus et compatibilité ;
- violet maîtrisé : états secondaires, profils et personnalisation ;
- ambre : lumière environnementale uniquement, jamais accent principal de contrôle.

Lecture produit : **le monde est vivant en arrière-plan ; le choix, la compatibilité et la provenance restent au premier plan.**

## 2. Raisons du choix

### Faits de recherche

- Les plateformes actuelles de modding structurent la découverte autour du jeu, des versions, des catégories et des filtres ; la compatibilité doit apparaître tôt dans le parcours. Sources : [CurseForge — Getting Started](https://support.curseforge.com/en/support/solutions/articles/9000193488-getting-started), [Modrinth — About](https://support.modrinth.com/en/articles/8800818-about-modrinth).
- Les hubs gaming contemporains emploient une navigation consolidée et une présence média forte, tout en conservant les tâches de recherche au centre. Source : [Xbox Wire — refreshed cloud gaming web experience](https://news.xbox.com/en-us/2026/01/26/try-the-new-xbox-cloud-gaming-web-experience-now-in-public-preview/).

### Inférences de design

- Une direction purement éditoriale premium était robuste mais trop proche d'un catalogue statique.
- Une direction purement technique clarifiait les statuts mais risquait d'effacer l'idée de monde vivant et de rapprocher MODARYX d'un outil système.
- L'hybride Living Threshold + Signal Foundry maintient la distinction MODARYX/Nova Forge : expérience web immersive côté MODARYX, précision technique dans les états et les décisions.

### Validation humaine obtenue

- option 2 choisie ;
- couleurs 2 + 3 demandées ;
- aucune validation High-Fi finale n'est déduite de ce choix exploratoire.

## 3. Fondations visuelles

### Couleurs sémantiques préparatoires

| Rôle | Token préparatoire | Valeur exploratoire | Usage |
|---|---|---:|---|
| Canvas | `--mx-bg` | `#07121D` | fond général |
| Surface | `--mx-surface` | `#0B1926` | panneaux et cartes |
| Surface élevée | `--mx-surface-raised` | `#102333` | contrôles, états ouverts |
| Bordure | `--mx-border` | `#21394D` | séparation structurelle |
| Texte | `--mx-text` | `#EEF5FF` | contenu principal |
| Texte secondaire | `--mx-text-muted` | `#93A9BD` | métadonnées |
| Action/focus | `--mx-accent-cyan` | `#35D6FF` | CTA, focus, lien critique |
| Profils/secondaire | `--mx-accent-violet` | `#8D6CFF` | personnalisation et état secondaire |
| Succès compatible | `--mx-state-compatible` | `#54E6C1` | état avec icône + libellé |
| Lumière monde | `--mx-world-amber` | `#FFB35C` | image/illustration seulement |

Les états ne reposent jamais uniquement sur la couleur. Contraste, libellé et pictogramme restent obligatoires.

### Typographie

- Sans-serif UI variable ou système, ouverte et compacte ; cible : Inter/Geist-like, sans dépendance définitive à ce stade.
- Échelle préparatoire : 12/14/16 pour UI, 20/24/30 pour sections, 38–52 pour titres d'écran, 56–74 uniquement pour Home éditoriale.
- Interlignage : 1.45–1.65 pour corps ; 1.0–1.15 pour display.
- Aucun traitement tout-capitales hors kicker court ; espacement des lettres renforcé uniquement pour ces kickers.

### Grille et rythme

- Desktop : grille 12 colonnes, marge fluide 3.2–6 vw, contenu maximal 1500–1600 px.
- Game Hub : zone contenu flexible + rail profils 320–340 px.
- Mobile : une colonne, marges 18 px, navigation locale horizontale explicite.
- Échelle d'espacement : 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.
- Rayons : 10 px contrôle, 14–16 px carte/panneau, 18 px média majeur.

## 4. Surfaces et composants

- **Topbar** : identité MODARYX textuelle, navigation web globale, compte et notifications.
- **Game identity band** : jeu, version, recherche contextuelle, action principale unique.
- **Local game nav** : Aperçu, Mods & contenus, Collections, Créateurs, Communauté.
- **Content card** : média, type, titre, résumé court, compatibilité + version.
- **Compatibility state** : icône, texte et couleur sémantique ; jamais un badge ambigu `Non vérifié`.
- **Profile rail** : `Mes profils pour ce jeu`, microcopy verrouillée, action de création secondaire.
- **Search/filter bar** : recherche globale ou contextuelle clairement différenciée.
- **Content Detail trust panel** : version, dépendances et source avant l'ajout au profil.
- **Empty state** : cause compréhensible + action de récupération.

États préparatoires : default, hover, focus-visible, selected, open, loading/skeleton, empty, success, incompatible, unavailable et error. Les quatre derniers nécessitent texte explicatif et voie de sortie.

## 5. Responsive

- `>= 1200 px` : trois colonnes de contenus + rail profils.
- `760–1199 px` : deux colonnes, rail repoussé sous le contenu.
- `< 760 px` : une colonne, menu global replié, CTA pleine largeur, navigation locale scrollable, rail profils après le flux principal.
- Les cibles interactives visent au moins 44 × 44 px sur mobile.
- Aucun contrôle persistant ne doit être masqué par overflow ; le défilement horizontal est réservé à la navigation locale identifiable.

## 6. Accessibilité, motion et performance

- Focus visible cyan de 3 px avec décalage ; ordre clavier identique à l'ordre visuel.
- Contraste à vérifier formellement avant gel des tokens ; aucun PASS WCAG final n'est déclaré ici.
- `prefers-reduced-motion` désactive transitions décoratives et smooth scroll.
- Motion autorisée : élévation légère, transition 160–240 ms, changement de surface ; pas de parallaxe nécessaire au sens.
- L'image monde est décorative ou possède un alt contextuel court ; l'information produit reste en HTML.
- Budgets cibles conservés : LCP ≤ 2,5 s p75, INP ≤ 200 ms, CLS ≤ 0,1.

## 7. Iconographie, illustration et identité

- Iconographie : contour cohérent, géométrie calme, poids régulier ; bibliothèque réelle, pas d'emoji ni de formes CSS improvisées.
- Illustration : paysages originaux non brandés, sans mascotte imposée, sans assets V1, sans loup/dragon ou ancien emblème réintroduit automatiquement.
- Identité : mot-symbole `MODARYX`, accent final cyan possible ; aucune reprise de la marque Nova Forge.
- Le monde vivant est une couche éditoriale secondaire, jamais une preuve de données réelles (météo, heure ou saison).

## 8. Application aux surfaces

| Surface | Application du langage |
|---|---|
| Home | hero éditorial immersif, une action principale, contenu en second plan |
| Game Hub | identité jeu + version + recherche, contenus compatibles, profils |
| Search/Catalog | grille/listes, filtres, compatibilité et version lisibles |
| Content Detail | média majeur + panneau confiance : version, dépendances, source |
| Library | continuité des jeux actifs et accès aux profils |
| Community | créateurs et collections avec atmosphère, sans perdre la provenance |
| Mobile | hiérarchie conservée, rail profils linéarisé, actions tactiles |

## 9. Prototype exploratoire

Emplacement : `review-evidence/modaryx-v2-living-threshold-prototype-20261003/`.

Le prototype est autonome, utilise des assets générés spécifiquement, et ne référence aucun CSS, shell DOM, renderer ou asset legacy. Il matérialise Home, Game Hub, Catalog, Content Detail, Library, Community et le responsive mobile. Les données sont explicitement de démonstration.

Vérifications effectuées :

- compilation Vite locale obtenue ;
- rendu navigateur desktop 1440 × 1024 inspecté ;
- navigation vers le catalogue testée ;
- fiche contenu ouverte et ajout au profil simulé ;
- viewport mobile 390 × 844 inspecté ;
- aucun overflow horizontal de page détecté (`scrollWidth` inférieur au viewport utile) ;
- aucune écriture Figma relancée.

## 10. Gates et prochain blocker

- **Figma : BLOQUÉ EXTERNE** — quota Starter inchangé, aucune relance.
- **QA visuelle formelle : BLOQUÉE** pour PASS, faute d'export fichier de la capture navigateur dans l'outil actif ; le rendu a été inspecté mais ne doit pas être présenté comme preuve archivable complète.
- **High-Fi final : BLOQUÉ** jusqu'à validation humaine multi-écrans, comparaison visuelle archivable, vérifications accessibilité/contraste et fermeture des gates décrits dans `MODARYX-V2-HIGH-FI-GATE-20261003.md`.
- **Frontend public : NON TOUCHÉ**.

Prochain point logique : revue humaine du prototype hybride sur desktop et mobile, puis correction des écarts avant toute matérialisation Figma ou implémentation produit.
