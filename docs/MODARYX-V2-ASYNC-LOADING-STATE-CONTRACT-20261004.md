# MODARYX V2 — Contrat des états asynchrones et de chargement

**Date : 2026-10-04**  
**Statut : TERMINÉ — contrat UX pré-production / backend réel non implémenté**

## 1. Décision

MODARYX ne doit pas afficher des skeletons ou spinners partout par réflexe.

Un état de chargement n'existe que lorsqu'une frontière réellement asynchrone le justifie.

Le prototype local actuel reste majoritairement instantané. Il ne doit donc pas inventer une latence réseau uniquement pour montrer un skeleton.

## 2. États canoniques

- `IDLE`
- `LOADING_INITIAL`
- `LOADING_INCREMENTAL`
- `REFRESHING_STALE`
- `SUCCESS`
- `EMPTY`
- `ERROR_RECOVERABLE`
- `ERROR_BLOCKING`
- `OFFLINE_STALE`

Ces états ne sont pas tous requis sur toutes les surfaces.

## 3. Quand afficher un skeleton

Autorisé si :
- la structure de la réponse est connue ;
- la latence attendue est suffisamment longue pour éviter un flash visuel ;
- le skeleton conserve la géométrie principale de la future surface ;
- aucune donnée utile précédente n'est disponible.

Interdit si :
- les données sont locales et immédiatement disponibles ;
- un contenu précédent peut rester visible pendant un refresh ;
- la forme finale est inconnue ;
- le skeleton imiterait une donnée réelle inexistante.

## 4. Refresh et données périmées

Si une donnée précédemment chargée reste sûre à afficher :
- conserver la donnée visible ;
- exposer `REFRESHING_STALE` ;
- indiquer clairement qu'une mise à jour est en cours ;
- ne pas vider la page pour afficher un skeleton ;
- ne pas présenter une donnée périmée comme fraîche.

## 5. Accessibilité

Pour une région chargée :
- `aria-busy="true"` seulement pendant le travail réel ;
- nom accessible stable pour la région ;
- ne pas déplacer le focus vers un skeleton ;
- après succès, conserver le focus si l'action initiatrice existe toujours ;
- annoncer les erreurs actionnables ;
- ne pas spammer les live regions lors de petits refreshs.

Sous `prefers-reduced-motion: reduce` :
- aucun shimmer animé obligatoire ;
- skeleton statique ou indicateur non animé.

## 6. Performance perçue

Règles :
- ne pas afficher/masquer un skeleton pour une opération quasi instantanée ;
- préférer le rendu immédiat du shell et des données disponibles ;
- charger progressivement les zones indépendantes ;
- ne pas bloquer toute une page pour une dépendance secondaire ;
- réserver un loader plein écran à un cas où aucune structure utile ne peut être rendue.

## 7. Erreurs

`ERROR_RECOVERABLE` :
- cause lisible ;
- action réessayer ;
- état précédent conservé quand sûr ;
- retry idempotent.

`ERROR_BLOCKING` :
- aucun faux succès ;
- raison lisible ;
- chemin de sortie ou support ;
- pas de boucle de retry automatique infinie.

## 8. Offline

`OFFLINE_STALE` :
- contenu local/caché peut rester visible ;
- fraîcheur indiquée ;
- actions distantes indisponibles expliquées ;
- aucune simulation de synchronisation réussie.

## 9. États par famille de surface

### Public / découverte
Préférer :
- shell immédiat ;
- skeleton uniquement pour données réellement distantes ;
- empty state distinct de loading.

### Search / Catalog
Préférer :
- résultat précédent pendant refresh si la requête n'a pas changé de contexte de sécurité ;
- indicateur compact de mise à jour ;
- aucun faux résultat pendant loading.

### Content Detail
Préférer :
- métadonnées déjà connues immédiatement ;
- sections distantes indépendantes ;
- installation/download jamais activés avant disponibilité réelle des capacités.

### Library / Account / Creator Studio
Préférer :
- autorité serveur explicite ;
- erreurs de permission/session distinctes ;
- brouillons locaux conservés lorsque possible.

### Rights / Publisher
Préférer :
- fail closed ;
- aucune permission déduite pendant loading ;
- Registry indisponible = usages sensibles bloqués ;
- refresh ne transforme jamais un état inconnu en autorisation.

### MODARYX IA
Préférer :
- état de génération distinct d'une action outil ;
- possibilité d'annuler ;
- source/tool status séparés ;
- aucune action déclarée terminée avant résultat réel.

## 10. Anti-fake

Interdit :
- pourcentage de progression inventé ;
- ETA inventée ;
- faux “Synchronisé” ;
- faux “Installé” ;
- faux “Scanné” ;
- faux “Réponse éditeur reçue” ;
- skeleton utilisé pour masquer l'absence permanente de backend.

## 11. Production

Le backend/adapter réel doit exposer assez d'information pour distinguer :
- initial load ;
- refresh ;
- stale cache ;
- partial success ;
- retryable error ;
- terminal error ;
- offline.

## 12. État

- contrat UX : **TERMINÉ**
- skeleton production : **NON IMPLÉMENTÉ**
- backend async réel : **NON IMPLÉMENTÉ**
- mesure latence réelle : **PREUVE MANQUANTE**
- validation humaine loading/retry : **PREUVE MANQUANTE**

Conclusion :
**les loading states ne sont plus un gap de conception interne ; leur matérialisation écran par écran est volontairement différée jusqu'à l'existence d'une frontière asynchrone réelle.**
