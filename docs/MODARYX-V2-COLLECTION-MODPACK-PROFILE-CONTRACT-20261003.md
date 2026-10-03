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

### Profile
Privé/local par défaut.

### Modpack
Partage seulement si :
- droits ;
- distribution ;
- manifeste ;
- provenance.

## 12. Mobile

Collections :
- liste compacte ;
- état compatibilité ;
- notes ;
- actions principales.

Profiles :
- état local/sync ;
- conflicts ;
- releases ;
- manager status.

## 13. Accessibilité

- réordonnancement non drag-only ;
- état sync textuel ;
- conflit textuel ;
- checkbox/toggles correctement labellisés ;
- confirmation pour actions destructrices.

## 14. Gate high-fi

Avant high-fi :
- objets séparés ;
- conversions définies ;
- dépendances/conflicts définis ;
- version pinning défini ;
- retrait/revocation défini ;
- confidentialité définie.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
