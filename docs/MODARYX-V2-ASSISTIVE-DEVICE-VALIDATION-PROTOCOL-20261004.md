# MODARYX V2 — Protocole screen reader et appareils physiques

**Date : 2026-10-04**  
**Statut : PRÊT À EXÉCUTER — aucune preuve réelle encore déclarée**

## 1. But

Préparer les validations externes restantes du prototype Living Threshold sans inventer de résultat.

Ce protocole couvre :
- screen reader réel ;
- navigation clavier réelle ;
- mobile physique ;
- Safari réel ;
- contrôle tactile ;
- lisibilité et focus dans les compositions responsive.

Il ne remplace pas un audit WCAG complet.

## 2. Cibles minimales

Quand l'environnement est disponible, tester au minimum :

### Windows
- NVDA + navigateur moderne ;
- clavier uniquement.

### Apple
- VoiceOver + Safari sur macOS ou iOS réel.

### Android
- TalkBack + Chrome sur appareil réel.

Le protocole n'impose pas une version précise tant qu'aucune version réelle n'est enregistrée comme preuve.

## 3. Écrans critiques

- Home / Discover ;
- Games Index ;
- Game Hub ;
- Global Search ;
- Catalog ;
- Content Detail ;
- Collections ;
- Modpack ;
- Library ;
- Profil de jeu ;
- Creator Studio ;
- Community ;
- Account / Settings ;
- Notifications ;
- Signalement avec erreur de validation.

## 4. Screen reader — points à vérifier

Pour chaque écran critique :
- landmark principal identifiable ;
- titre de page annoncé ;
- ordre des headings cohérent ;
- navigation principale identifiable ;
- boutons annoncés avec nom compréhensible ;
- boutons icône avec label utile ;
- champs avec label ;
- erreurs liées au champ concerné ;
- tabs annoncées comme contrôles distincts ;
- état actif identifiable autrement que par couleur ;
- badges de compatibilité compréhensibles ;
- images décoratives non envahissantes ;
- aucune information essentielle uniquement dans un background visuel ;
- aucun contenu caché lu inutilement ;
- statut offline/error/success annoncé lorsqu'il apparaît ;
- focus envoyé logiquement après une erreur si le futur workflow le nécessite.

## 5. Clavier réel

Tester :
- Tab / Shift+Tab ;
- Enter ;
- Space ;
- Escape sur menus/modales futurs ;
- flèches si un pattern les requiert réellement.

Critères :
- aucun focus perdu ;
- aucun focus masqué par header sticky ;
- ordre logique ;
- pas de piège clavier ;
- actions essentielles accessibles sans souris ;
- menu mobile ou drawer futur refermable sans pointer.

## 6. Mobile physique

Vérifier :
- aucune zone interactive critique difficile à toucher ;
- clavier virtuel ne masque pas recherche/formulaire ;
- zoom texte raisonnable sans casser la page ;
- rotation portrait/paysage ne détruit pas l'état ;
- tabs horizontales restent accessibles ;
- CTA ne masque pas le focus ;
- scroll ne saute pas lors des filtres ;
- safe areas respectées ;
- contenu principal prioritaire avant décor ;
- images ne provoquent pas de shift visible majeur.

## 7. Safari réel

Vérifier en priorité :
- sticky header ;
- overflow horizontal ;
- select/input ;
- focus visible ;
- backdrop-filter fail-soft ;
- gradients ;
- scroll tabs ;
- `prefers-reduced-motion` ;
- comportement des unités viewport sur mobile ;
- aucun bug de layout spécifique.

## 8. Parcours screen reader prioritaires

### Découverte

`Home → Jeux → Game Hub → Recherche → Catalog → Content Detail → Compatibilité/prérequis`

### Bibliothèque

`Bibliothèque → Profils de jeu → profil → composants/versions → retour`

### Créateur

`Créer → Creator Studio → Projects → Releases → Upload indisponible → retour Dashboard`

### Modération utilisateur

`Content Detail → Signalement → soumission sans raison → erreur → correction → brouillon local non envoyé`

### Compte

`Compte → Confidentialité → Notifications → Accessibilité → Données locales`

## 9. Évidence à conserver

Pour chaque session :
- date ;
- appareil réel ;
- OS ;
- navigateur ;
- screen reader + version si connue ;
- viewport/taille écran approximative ;
- commit testé ;
- route/écran ;
- tâche ;
- résultat ;
- problème observé ;
- sévérité P0/P1/P2/P3 ;
- capture vidéo/audio seulement si autorisée et utile ;
- aucune donnée personnelle inutile.

## 10. Échecs bloquants

P0/P1 notamment si :
- action primaire inaccessible ;
- compatibilité/prérequis incompréhensibles ;
- erreur non annoncée ;
- focus piégé/perdu ;
- contenu essentiel masqué ;
- menu/navigation inaccessible ;
- écran mobile inutilisable ;
- lecteur d'écran annonce une information fausse ou ambiguë sur sécurité/installation.

## 11. Fermeture du gate

Ne jamais écrire `TERMINÉ` pour screen reader/appareils tant qu'une vraie session sur l'environnement annoncé n'a pas eu lieu.

À la fermeture :
- lister les environnements réellement testés ;
- joindre les findings ;
- corriger P0/P1 ;
- micro-proof navigateur automatisé conservé comme complément, jamais comme remplacement.

## 12. Statut actuel

- browser accessibility tree automatisé : **TERMINÉ pour micro-proof**
- keyboard/touch automatisé : **TERMINÉ pour micro-proof**
- screen reader réel : **PREUVE MANQUANTE**
- Safari réel : **PREUVE MANQUANTE**
- appareil mobile physique : **PREUVE MANQUANTE**
- VoiceOver/TalkBack/NVDA réel : **PREUVE MANQUANTE**

**État : protocole prêt / validation externe non exécutée.**
