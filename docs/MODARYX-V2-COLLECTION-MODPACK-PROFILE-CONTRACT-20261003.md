# MODARYX V2 — Contrat Collections, Modpacks et Profiles

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Principe

Favori, Collection, Modpack et Profile/Loadout sont quatre objets différents.

Ils ne doivent jamais être fusionnés dans une seule notion “liste”.

## 2. Favori

Fonction :
- mémoriser rapidement un contenu.

Propriétés :
- privé par défaut ;
- très léger ;
- pas d'ordre ;
- pas de version figée ;
- pas de dépendances résolues.

## 3. Collection

Fonction :
- organiser ou recommander des contenus.

Propriétés :
- curateur ;
- titre ;
- description ;
- visibilité ;
- liste de contenus ;
- notes ;
- ordre éditorial facultatif ;
- tags.

Une Collection n'est pas automatiquement installable.

### Capacité visible

Le nom **Collection** ne suffit pas à indiquer sa capacité. L'UI doit afficher explicitement son statut, par exemple :
- **Sélection organisée** ;
- **Installation non disponible** lorsque c'est le cas ;
- une capacité d'installation uniquement si un mécanisme réel, résolu et autorisé existe.

Microcopy de travail : **Sélection organisée à partager**.

### Microcopy utilisateur

Une preuve humaine réelle montre que le mot **Collection** n'est pas nécessairement le premier terme spontané pour une sélection thématique partageable.

Conserver `Collection` comme objet produit, mais l'accompagner d'une microcopy claire, par exemple :

**Sélections de mods à organiser et partager**

Le produit peut employer « recommandations » comme langage secondaire lorsque le contexte est éditorial, sans créer un nouveau type de domaine.

## 4. Modpack

Fonction :
- distribuer un ensemble versionné et installable.

Propriétés :
- jeu ;
- version du jeu ;
- loader/framework ;
- version du modpack ;
- dépendances ;
- versions/ranges ;
- fichiers de configuration autorisés ;
- règles d'installation ;
- historique ;
- provenance ;
- état de distribution.

## 5. Profile / Loadout

**Libellé UI retenu : Profils de jeu**

Fonction :
- représenter une configuration utilisateur concrète.

Propriétés :
- privé/local par défaut ;
- releases sélectionnées ;
- activation/désactivation ;
- ordre de chargement si applicable ;
- configs ;
- sync state ;
- manager state.

Un Profile n'est pas une publication publique par défaut.

## 6. Conversion entre objets

### Favori → Collection
Autorisé explicitement.

### Collection → Modpack
Nécessite :
- choix de versions ;
- résolution dépendances ;
- compatibilité ;
- manifeste installable ;
- droits.

Jamais automatique.

### Modpack → Profile
Possible via installation réelle.

### Profile → Modpack
Possible uniquement avec vérification :
- droits ;
- redistribution ;
- versions ;
- configs partageables.

## 7. Résolution de dépendances

Le système doit distinguer :
- required ;
- optional ;
- recommended ;
- incompatible ;
- replaces.

La résolution ne doit jamais substituer silencieusement un contenu.

## 8. Conflits

Un conflit peut être :
- hard conflict ;
- version conflict ;
- loader conflict ;
- file conflict ;
- load-order conflict ;
- unknown.

La UI doit préciser ce qui est connu et ce qui ne l'est pas.

## 9. Version pinning

Pour Modpack/Profile :
- exact ;
- compatible range ;
- latest-compatible seulement si politique explicite.

Un update ne doit pas modifier silencieusement une configuration stable.

## 10. Items retirés

États :
- withdrawn ;
- revoked ;
- deleted ;
- unavailable.

Le système doit :
- conserver la trace ;
- expliquer l'impact ;
- proposer des options ;
- ne jamais redistribuer un artefact retiré.

## 11. Partage

### Collection
Peut être :
- private
- unlisted
- public

### Profil de jeu (`Profile` interne)
Privé/local par défaut.

### Modpack
Partage seulement si :
- droits ;
- distribution ;
- manifeste ;
- provenance.

## 12. Curateur et support

Une Collection doit afficher clairement :
- curateur ;
- instructions ;
- limitations connues ;
- contexte jeu/version ;
- date de dernière validation.

Si un problème provient de la composition de la Collection, le produit ne doit pas renvoyer automatiquement l'utilisateur vers chaque auteur de mod.

Le rôle du curateur dans le support doit être explicite.

## 13. Filtres Collections

Le catalogue Collections doit avoir ses propres facettes, par exemple :
- jeu ;
- version ;
- catégorie ;
- type ;
- tags ;
- nombre d'items lorsque pertinent.

Ne pas copier aveuglément les filtres du catalogue ContentItem.

## 14. Profil propre recommandé

Lors d'une installation complexe via manager, MODARYX peut recommander :
- créer un nouveau profil propre ;
- ou choisir explicitement un profil existant.

Cette recommandation dépend des capacités réelles du manager et ne doit jamais modifier un profil sans consentement.

## 15. Mobile

Collections :
- liste compacte ;
- état compatibilité ;
- notes ;
- actions principales.

Profils de jeu :
- état local/sync ;
- conflicts ;
- releases ;
- manager status.

## 16. Accessibilité

- réordonnancement non drag-only ;
- état sync textuel ;
- conflit textuel ;
- checkbox/toggles correctement labellisés ;
- confirmation pour actions destructrices.

## 17. Gate high-fi

Avant high-fi :
- objets séparés ;
- conversions définies ;
- dépendances/conflicts définis ;
- version pinning défini ;
- retrait/revocation défini ;
- confidentialité définie.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**


## Convergence P01 + Work + étude indépendante

- `Collection` reste l'objet domaine, mais son caractère éditorial / installable doit être explicite.
- `Profile/Loadout` reste interne ; **Profils de jeu** est le libellé utilisateur retenu.
- **Configurations de jeu** n'est plus une alternative UI active.
- La trouvabilité des Profils de jeu est renforcée par le Game Hub.
