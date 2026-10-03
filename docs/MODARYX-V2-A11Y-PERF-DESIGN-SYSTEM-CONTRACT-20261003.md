# MODARYX V2 — Contrat accessibilité, performance et design system

**Date : 2026-10-03**
**Statut : conception / contraintes avant high‑fi**

## 1. Accessibilité — règles minimales

Référence de base : WCAG 2.2.

### Focus

- le focus clavier doit rester visible ;
- un header/footer sticky ne doit pas masquer totalement l'élément focusé ;
- l'ordre de tabulation suit l'ordre logique de lecture ;
- aucun contrôle essentiel ne doit dépendre uniquement du hover.

### Cibles tactiles

Le minimum WCAG 2.2 pour la taille de cible est de 24×24 CSS px ou un espacement équivalent.

Pour MODARYX V2, viser plus grand sur les actions fréquentes/primaires :
- boutons d'installation ;
- favoris ;
- filtres ;
- navigation mobile ;
- actions de collection.

### Contraste / état

- l'état ne doit jamais être transmis uniquement par la couleur ;
- compatible / incompatible / non vérifié doivent aussi avoir texte ou icône ;
- erreur, warning, success doivent rester compréhensibles en monochrome.

### Motion

- reduced-motion respecté ;
- aucune animation nécessaire à la compréhension ;
- pas de parallaxe obligatoire pour naviguer ;
- l'ambiance météo/saison doit pouvoir être neutralisée.

### Authentification

Les parcours de connexion doivent éviter les mécanismes inutilement cognitifs et conserver un retour clair vers la tâche interrompue.

## 2. Performance — seuils de référence

Core Web Vitals :

- **LCP ≤ 2,5 s**
- **INP ≤ 200 ms**
- **CLS ≤ 0,1**

La mesure cible doit être considérée au **75e percentile** des visites, séparée mobile/desktop lorsque possible.

Ces seuils sont un objectif de production, pas une preuve de qualité visuelle.

## 3. Conséquences design

### Hero

Éviter :
- vidéo lourde obligatoire ;
- image gigantesque non responsive ;
- plusieurs couches de blur et de textures qui retardent le LCP.

Préférer :
- image responsive ;
- poster statique ;
- décor progressif ;
- effets secondaires chargés après le contenu critique.

### Catalogue

Priorité à l'INP :
- filtres instantanés ou feedback immédiat ;
- virtualization/pagination si volumétrie élevée ;
- ne pas déclencher des recalculs massifs pour une simple sélection ;
- skeleton uniquement quand la latence est réelle.

### Images

- dimensions réservées pour éviter le CLS ;
- formats modernes ;
- variantes par breakpoint ;
- lazy load hors viewport ;
- priorité au média principal de la fiche.

### Fonts

- limiter les familles/poids ;
- fallback métriquement proche ;
- ne pas bloquer le rendu pour une police décorative.

## 4. Design system V2

Le système doit utiliser deux niveaux de tokens.

### Primitives

Exemples :
- color/neutral/050
- color/neutral/900
- space/04
- space/08
- radius/08
- duration/fast

### Sémantiques

Exemples :
- color/surface/primary
- color/surface/elevated
- color/text/primary
- color/text/muted
- color/status/success
- color/status/warning
- color/status/danger
- color/status/unverified
- space/component/card
- radius/control

La direction artistique peut changer les primitives sans casser le sens des composants.

## 5. Composants

Construire du simple vers le composé.

### Primitives interactives

- Button
- IconButton
- Input
- SearchInput
- Select
- Checkbox
- Radio
- Switch
- Chip
- Badge
- Tooltip
- Link

### Patterns de produit

- GamePicker
- GameCard
- ContentCard
- CompactContentRow
- CompatibilityBadge
- DependencyRow
- ReleaseSelector
- InstallAction
- FilterGroup
- FilterDrawer
- QuickView
- CollectionItem
- CreatorChip
- ProvenancePanel
- ModerationStatus
- EmptyState
- ErrorState

### Layout patterns

- AppHeader
- MobileNav
- GameHubHeader
- CatalogShell
- DetailDecisionPanel
- CreatorDashboardShell
- LibraryShell

Les agents et le code doivent réutiliser ces patterns plutôt que reconstruire des combinaisons ad hoc.

## 6. Propriétés fonctionnelles

Les props doivent décrire le comportement, pas l'apparence seulement.

Exemple `CompatibilityBadge` :
- state: compatible | partial | incompatible | unverified
- label
- evidenceLevel
- compact

Exemple `InstallAction` :
- managerAvailable
- manualAvailable
- distributionState
- dependencyState
- authenticated
- loading

## 7. Responsive

Les tokens/layouts doivent gérer :
- desktop large ;
- laptop ;
- tablette ;
- mobile.

Ne pas créer quatre sites différents.

Prévoir :
- densité ;
- gaps ;
- taille de texte ;
- nombre de colonnes ;
- placement des filtres ;
- navigation ;
- quick view.

## 8. Figma

Les variables sont destinées à :
- couleurs ;
- espacements ;
- rayons ;
- modes ;
- états de prototype.

Les composants servent à :
- boutons ;
- inputs ;
- cartes ;
- panneaux ;
- patterns de navigation.

Les blocs de niveau supérieur doivent être documentés pour qu'un agent ou un développeur ne devine pas leur composition.

## 9. Motion tokens

Prévoir :
- duration/instant
- duration/fast
- duration/normal
- easing/standard
- easing/emphasized

Et un mode reduced-motion.

Aucun système de motion ne doit être défini uniquement par page.

## 10. Gate avant implémentation

Avant le code du skin final :

- tokens sémantiques définis ;
- composants critiques définis ;
- états focus/hover/active/disabled/error définis ;
- comportement mobile défini ;
- reduced-motion défini ;
- stratégie image/font définie ;
- budget de performance documenté.

## 11. Budget initial proposé

À confirmer par mesure réelle lors de l'implémentation :

- LCP production : viser ≤ 2,5 s au p75 ;
- INP : viser ≤ 200 ms au p75 ;
- CLS : viser ≤ 0,1 au p75 ;
- aucun layout shift causé par média sans dimensions ;
- aucune fonction critique bloquée par l'univers vivant.

**État : TERMINÉ pour le contrat de conception / PREUVE MANQUANTE pour mesures production V2.**
