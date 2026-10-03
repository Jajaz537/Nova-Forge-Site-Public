# MODARYX V2 — Contrat d'interactions et d'états

**Date : 2026-10-03**
**Statut : DRAFT de conception — aucune implémentation production**

## 1. Objectif

Éviter qu'une surface soit considérée “finie” uniquement parce que son état nominal fonctionne.

Chaque parcours critique doit être conçu avec ses états transitoires, vides, dégradés, bloqués et d'erreur.

## 2. États transversaux

### Loading

Utiliser lorsque la donnée est réellement en cours de récupération.

Règles :
- conserver le contexte de page ;
- afficher la structure attendue ;
- éviter le spinner plein écran pour les opérations locales rapides ;
- ne jamais masquer indéfiniment une erreur derrière un loading.

### Skeleton

Réservé aux surfaces dont la structure est connue.

Ne pas utiliser un skeleton qui imite des données inexistantes de manière trompeuse.

### Empty

La donnée existe mais la collection est vide.

Exemples :
- aucun favori ;
- aucune collection ;
- aucune création publiée.

L'état vide doit proposer l'action utile suivante.

### No results

Une recherche/filtre a produit zéro résultat.

Doit afficher :
- requête/contexte ;
- filtres actifs ;
- action de reset ;
- alternative de recherche si pertinente.

### Error

Erreur technique ou service inaccessible.

Afficher :
- ce qui a échoué ;
- ce qui est préservé ;
- retry si l'action est sûre ;
- fallback local lorsque disponible.

### Offline

Distinguer :
- surface disponible en cache ;
- donnée potentiellement stale ;
- fonction impossible hors ligne.

### Stale

La donnée affichée est disponible mais sa fraîcheur n'est pas garantie.

Ne pas présenter stale comme current.

### Unavailable

Capacité volontairement ou techniquement indisponible.

Exemples :
- manager non connecté ;
- téléchargement verrouillé ;
- météo provider non configuré.

### Unauthorized

Utilisateur non authentifié.

Action :
- expliquer la capacité concernée ;
- proposer connexion ;
- préserver le contexte de retour.

### Forbidden

Utilisateur authentifié sans permission.

Ne pas confondre avec unauthenticated.

### Removed / Withdrawn / Revoked

Pour contenus/releases retirés.

Afficher :
- statut ;
- raison publique si disponible ;
- impact sur profil/collection ;
- pas de redistribution silencieuse.

### Quarantined / Held for review

Contenu non distribuable pendant contrôle.

### Archived / Abandoned

Le contenu reste consultable mais n'est plus activement maintenu.

### Incompatible

Compatibilité explicitement négative.

Doit être visible avant installation.

### Unverified

Absence de preuve suffisante.

Ne jamais styliser comme un succès.

### Success

Succès de l'action avec conséquence claire.

Exemples :
- ajouté à collection ;
- brouillon sauvegardé ;
- release soumise.

## 3. Recherche / catalogue

### Interactions

- recherche texte ;
- changement de jeu ;
- changement de type ;
- filtres ;
- tri ;
- view mode ;
- quick view ;
- favori ;
- ajout collection ;
- pagination/infinite load selon choix ultérieur.

### États obligatoires

- loading ;
- no results ;
- error ;
- offline/stale ;
- filtres invalides ou incompatibles ;
- reset.

### Règle

Le nombre de résultats et les filtres actifs doivent rester visibles.

## 4. Fiche contenu

### Interactions

- ouvrir média ;
- changer release ;
- voir requirements ;
- voir dépendances/conflits ;
- installer/télécharger ;
- favori ;
- collection ;
- signalement ;
- support/commentaires ;
- suivre créateur/projet.

### États critiques

- compatible ;
- incompatible ;
- unverified ;
- archived ;
- removed ;
- quarantined ;
- distribution locked ;
- manager unavailable ;
- manual download unavailable.

## 5. Installation / téléchargement

### Bouton manager

Visible comme action principale uniquement si :
- manager réellement disponible ;
- jeu supporté ;
- release distribuable ;
- dépendances satisfaisables.

Sinon afficher un état explicite.

### Manuel

Uniquement si :
- artefact public autorisé ;
- manifeste valide ;
- hash connu ;
- distribution non verrouillée.

### Après action

Afficher :
- progression réelle si mesurable ;
- succès ;
- échec ;
- rollback/état inchangé ;
- dépendance manquante.

## 6. Collection / modpack / profile

### Collection

Actions :
- ajouter/retirer ;
- réordonner si pertinent ;
- noter ;
- partager selon visibilité.

### Modpack

Actions :
- versionner ;
- vérifier dépendances ;
- installer ;
- publier.

### Profile / Loadout

Actions :
- activer/désactiver ;
- verrouiller versions ;
- importer/exporter ;
- synchroniser ;
- résoudre conflits.

### États

- local-only ;
- sync-pending ;
- synced ;
- conflict ;
- missing dependency ;
- revoked item ;
- incompatible release.

## 7. Creator Studio

### Brouillon

Sauvegarde locale ou distante selon disponibilité.

Toujours préserver le brouillon après erreur d'upload ou validation.

### Upload

États :
- sélection ;
- validation format ;
- hashing ;
- upload ;
- scan/contrôles si réels ;
- erreur ;
- retry ;
- terminé.

### Publication

États séparés :
- draft ;
- submitted ;
- held-for-review ;
- accepted ;
- published ;
- withdrawn ;
- rejected ;
- appealed.

Ne pas fusionner modération et distribution.

## 8. Compte / profil

États :
- anonymous ;
- authenticated ;
- session-expired ;
- permission-required ;
- profile-private ;
- profile-public ;
- profile-not-found.

## 9. Community

Publication :
- draft ;
- sending ;
- received ;
- moderated ;
- published ;
- removed ;
- appealed.

Commentaire/support :
- local draft si envoi impossible ;
- retry ;
- permissions ;
- rate-limit si réel.

## 10. Navigation

Desktop :
- hover ;
- focus ;
- active ;
- expanded ;
- disabled uniquement si une raison existe.

Mobile :
- drawer ouvert/fermé ;
- focus trap ;
- retour ;
- recherche accessible immédiatement.

## 11. Motion

Toute transition doit avoir une fonction :
- montrer continuité ;
- confirmer une action ;
- révéler une relation.

Aucune animation purement décorative ne doit ralentir recherche, filtres, installation ou publication.

Reduced motion :
- pas de perte d'information ;
- transitions neutralisées ou simplifiées.

## 12. Critère de passage vers high-fi

Pour chaque flow critique, les états suivants doivent être explicitement mappés avant direction artistique :

- nominal ;
- loading ;
- empty/no-results ;
- error/retry ;
- unavailable ;
- permission/auth ;
- incompatible/unverified lorsqu'applicable ;
- success.

**État : EN COURS** — contrat défini, validation humaine non exécutée.
