# MODARYX V2 — Contrat Installation et Manager

**Date : 2026-10-03**
**Statut : conception — aucun manager V2 implémenté**

## 1. Principe

MODARYX ne doit jamais simuler une capacité d'installation automatisée.

L'action principale dépend de capacités réellement disponibles.

## 2. Modes d'action

### Installer avec manager

Disponible uniquement si :
- manager réellement détecté/autorisé ;
- jeu supporté ;
- release distribuable ;
- droits respectés ;
- dépendances résolubles ;
- contexte compatible.

### Téléchargement manuel

Disponible uniquement si :
- artefact public autorisé ;
- distribution published ;
- hash requis disponible ;
- provenance minimale disponible ;
- chemin public valide.

### Ajouter à collection

Toujours distinct d'installer.

### Ajouter à profile/loadout

Disponible si le modèle de profil existe, même sans installation immédiate.

## 3. Préflight

Avant installation automatisée :

- jeu ;
- version ;
- loader/framework ;
- plateforme ;
- release ;
- dépendances ;
- conflits ;
- espace/conditions si mesurable ;
- provenance/distribution.

## 4. Dépendances

Le manager peut proposer :

- installer required ;
- installer optional si l'utilisateur choisit ;
- expliquer recommended ;
- bloquer incompatible.

Aucune dépendance “replaces” ne déclenche de substitution sans confirmation.

## 5. Conflits

Afficher :
- cause ;
- portée ;
- contenus concernés ;
- action possible.

Si le conflit n'est pas résoluble automatiquement :
- bloquer ou demander choix ;
- ne jamais masquer l'incertitude.

## 6. Progression

Si une progression réelle est mesurable, afficher :

- préparation ;
- téléchargement ;
- vérification hash ;
- installation ;
- configuration ;
- terminé.

Ne pas simuler un pourcentage arbitraire.

## 7. Erreur

En cas d'échec :

- étape exacte ;
- état conservé ;
- retry si sûr ;
- rollback si supporté ;
- log utilisateur lisible.

Le profil/loadout ne doit pas être marqué “installed” sans preuve.

## 8. Update

Types :
- update available ;
- compatible update ;
- breaking update ;
- blocked update.

Une mise à jour ne modifie pas silencieusement :
- version du jeu ;
- loader ;
- dependencies ;
- config.

## 9. Rollback

Si supporté :
- version précédente ;
- configs ;
- dependencies ;
- état profil.

Le rollback doit être explicite et vérifiable.

## 10. Manager connection

États :
- not detected ;
- available ;
- connected ;
- incompatible version ;
- permission required ;
- unavailable.

La simple présence d'un lien/protocole ne prouve pas une connexion réussie.

## 11. Browser → manager

Si deeplink/protocole futur :

- action utilisateur explicite ;
- fallback clair ;
- aucun secret dans l'URL ;
- pas d'installation silencieuse ;
- contexte minimal signé/validé si nécessaire.

## 12. Privacy

Le site ne doit pas collecter automatiquement :
- liste complète de mods locaux ;
- fichiers locaux ;
- chemins personnels

sans consentement et nécessité.

## 13. Manual install

La fiche peut fournir :
- fichier ;
- hash ;
- instructions ;
- dependencies ;
- destination générale ;
- avertissements.

Éviter les instructions ambiguës qui supposent une version du jeu.

## 14. Mobile

Sur mobile :
- ne pas afficher “Installer avec manager” si le manager n'existe pas sur la plateforme ;
- proposer save/collection/share ;
- garder téléchargement manuel uniquement si pertinent.

## 15. Security

Avant action :
- distribution state ;
- provenance ;
- hash ;
- rights ;
- warnings.

Après téléchargement :
- vérification hash locale possible.

## 16. Accessibilité

- progression textuelle ;
- erreurs annoncées ;
- confirmation accessible ;
- boutons désactivés avec explication ;
- pas de drag-only pour load order.

## 17. Gate high-fi

Avant high-fi de l'installation :
- capability states définis ;
- preflight défini ;
- dependency/conflict flow défini ;
- error/rollback défini ;
- privacy définie ;
- mobile défini.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
