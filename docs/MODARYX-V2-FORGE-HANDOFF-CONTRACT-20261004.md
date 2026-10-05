# MODARYX V2 — Contrat de handoff Web → MODARYX Forge

**Date : 2026-10-04**  
**Statut : TERMINÉ — contrat web préparatoire / runtime MODARYX Forge PREUVE MANQUANTE**

## 1. Séparation des responsabilités

- **MODARYX / MODARYX MODS** : découverte, fiches, recherche, collections, créateurs, communauté, publication et préparation d'intentions.
- **MODARYX Forge** : logiciel / écosystème desktop local.
- **MODARYX Public** et **MODARYX Founder** : éditions desktop distinctes.

Le site ne :
- modifie jamais directement les fichiers d'un jeu ;
- ne simule jamais une installation locale ;
- ne déduit jamais qu'un runtime Forge est présent ;
- ne transforme jamais une Collection en installation par simple clic ;
- ne transmet jamais un chemin arbitraire, une commande shell ou un secret au desktop.

## 2. Principe du handoff

Le site peut seulement préparer une **intention structurée**.

Séquence conceptuelle :

1. l'utilisateur consulte un ContentItem / Release / File sur MODARYX ;
2. le site sait quelle action serait souhaitée ;
3. une capability réelle confirme qu'un runtime Forge compatible existe ;
4. le site prépare une intention bornée ;
5. MODARYX Forge revalide localement :
   - jeu ;
   - installation ;
   - adapter ;
   - artefact ;
   - source ;
   - droits/distribution ;
   - compatibilité ;
   - dépendances/conflits ;
   - protection/restore point ;
6. Forge affiche son propre plan local ;
7. l'utilisateur confirme localement ;
8. Forge agit localement ;
9. un résultat ne peut être affiché comme réussi sur le site qu'avec une preuve/receipt réellement vérifiable.

Le site ne saute aucune étape locale de sécurité.

## 3. Capability handshake

Un CTA tel que **Ouvrir avec MODARYX Forge** ou **Préparer dans MODARYX Forge** ne peut être actif que si les dimensions suivantes sont réellement connues :

- runtime détecté ;
- version de protocole compatible ;
- édition desktop compatible si nécessaire ;
- action supportée ;
- Game adapter supporté ;
- ContentType supporté ;
- source/provider autorisé ou artefact manuel accepté ;
- distribution disponible ;
- identité Release/File résolue ;
- aucune incompatibilité de protocole bloquante.

États UI minimum :

- `UNAVAILABLE`
- `RUNTIME_NOT_DETECTED`
- `PROTOCOL_UNSUPPORTED`
- `ADAPTER_UNSUPPORTED`
- `SOURCE_UNSUPPORTED`
- `ARTIFACT_UNAVAILABLE`
- `READY_FOR_HANDOFF`
- `LOCAL_CONFIRMATION_REQUIRED`

Le prototype actuel reste volontairement en état indisponible.

## 4. Intention conceptuelle

Le payload de handoff futur doit être **déclaratif**, jamais exécutable.

Champs conceptuels :

- `schemaVersion`
- `protocolVersion`
- `intentId`
- `issuedAt`
- `expiresAt`
- `action`
- `contentId`
- `releaseId`
- `fileId`
- `gameId`
- `gameVersion` si connu
- `edition` si connue
- `platform` si connue
- `loaderOrFramework` si connu
- `sourceProviderId` si connu
- `sourceArtifactId` si connu
- `artifactSha256` si connu et attesté
- `profileId` seulement si explicitement sélectionné
- `distributionState`
- `requestedCapabilities`
- `returnContext` borné

Aucun champ manquant n'est inventé.

## 5. Actions autorisées conceptuellement

Avant runtime réel, aucune action n'est active.

Actions candidates, à versionner :

- `OPEN_CONTENT`
- `OPEN_RELEASE`
- `OPEN_PROFILE`
- `PREPARE_ADD_TO_PROFILE`
- `PREPARE_INSTALL`
- `PREPARE_UPDATE`

Même `PREPARE_INSTALL` ne signifie pas installation : elle ouvre une décision locale Forge.

Interdits :
- `RUN_COMMAND`
- `EXECUTE_SCRIPT`
- `WRITE_PATH`
- `DELETE_PATH`
- toute action transportant des arguments shell ou chemins arbitraires.

## 6. Identité d'artefact

Le handoff doit lier explicitement :

`ContentItem → Release → File → Source/provider → hash si prouvé`

Règles :
- auteur ≠ provider ;
- provider ≠ artefact ;
- Release ≠ File ;
- version affichée ≠ hash ;
- source alternative ne remplace pas silencieusement la source sélectionnée ;
- variantes édition/loader/plateforme restent distinctes.

Si le File exact n'est pas résolu, le handoff doit rester préparatoire.

## 7. Compatibilité

Le site peut transmettre des claims, mais Forge doit les revalider avant mutation.

Dimensions :
- jeu ;
- version ;
- édition ;
- plateforme ;
- loader/framework ;
- channel ;
- résultat ;
- workaround ;
- source de preuve ;
- date/fraîcheur.

Une claim `Unknown`, `Stale` ou non attestée ne devient jamais compatible par le seul handoff.

## 8. Dépendances et conflits

Le site peut transmettre un graphe/plan informatif versionné.

Relations possibles :
- Required
- Recommended
- Suggested
- Supported
- Conflict
- ReplacedBy
- Alternative/AnyOf

Forge recalcule les impacts localement.

Le site ne décide jamais seul :
- load order ;
- fichier gagnant ;
- suppression d'une dépendance ;
- résolution d'une alternative ;
- désactivation d'un dépendant.

## 9. Collection / Modpack / Profil

### Collection
Une Collection reste une curation web.

Elle ne produit pas automatiquement un handoff installable.

### Modpack
Un Modpack peut préparer un handoff seulement si :
- manifeste réel ;
- artefacts résolvables ;
- droits ;
- compatibilité ;
- runtime capable.

### Profil de jeu
Un Profil peut être une cible locale si :
- l'utilisateur l'a choisi ;
- son identité est comprise par Forge ;
- aucune donnée privée n'est exposée inutilement au web.

## 10. Confirmation locale obligatoire

Le site ne peut pas pré-accepter :
- écriture de fichiers ;
- suppression ;
- remplacement ;
- update ;
- rollback ;
- modification de save ;
- changement de load order.

MODARYX Forge doit conserver une confirmation locale pour toute mutation à risque.

## 11. Sécurité du transport

Le transport réel reste **NON SÉLECTIONNÉ**.

Avant sélection :
- threat model obligatoire ;
- origin binding ;
- nonce anti-rejeu ;
- expiration courte ;
- validation stricte du schéma ;
- allowlist d'actions ;
- aucune commande arbitraire ;
- aucun secret/token dans URL ou logs ;
- aucun chemin local envoyé par le site ;
- aucune redirection `returnTo` ouverte ;
- limites de taille ;
- journalisation sans données sensibles.

Un custom URL scheme, localhost bridge ou mécanisme OS natif ne doit pas être choisi par habitude.

## 12. Confidentialité

Le handoff transmet le minimum nécessaire.

À ne jamais exposer au site sans nécessité/consentement :
- chemin local du jeu ;
- nom de compte OS ;
- inventaire complet des fichiers locaux ;
- saves ;
- profils privés non sélectionnés ;
- tokens providers ;
- logs système bruts.

## 13. Résultat / receipt

Le site ne doit pas afficher **Installé**, **Mis à jour** ou **Rollback réussi** sur simple redirection.

Un résultat futur doit inclure au minimum :
- `intentId`
- état
- action réellement appliquée
- identité artefact
- timestamp
- édition Forge
- référence receipt
- mécanisme d'authenticité/validation

États conceptuels :
- `REJECTED`
- `CANCELLED`
- `PREPARED`
- `COMPLETED`
- `FAILED_RECOVERABLE`
- `ROLLED_BACK`

Le mécanisme d'authenticité du receipt est **PREUVE MANQUANTE** tant que le runtime n'existe pas.

## 14. UX web

Si handoff indisponible :
- bouton absent ou disabled ;
- raison lisible ;
- aucune promesse “one click” ;
- fallback manuel uniquement si autorisé par la source/distribution.

Si handoff prêt :
- expliquer ce qui va s'ouvrir ;
- ne pas annoncer que l'installation est faite ;
- remettre la décision finale au desktop.

## 15. Versioning

- le schéma web et le protocole desktop doivent être versionnés séparément ;
- unknown field : ignorer/préserver selon contrat, jamais crash ou interprétation arbitraire ;
- breaking change : nouvelle version explicite ;
- Forge trop ancien : état `PROTOCOL_UNSUPPORTED`, pas fallback dangereux.

## 16. États de preuve actuels

- contrat web : **TERMINÉ**
- capability handshake UI de démonstration : **TERMINÉ — prototype**
- transport réel : **PREUVE MANQUANTE**
- runtime Forge : **PREUVE MANQUANTE**
- protocole réel : **PREUVE MANQUANTE**
- signature/receipt réel : **PREUVE MANQUANTE**
- installation réelle : **PREUVE MANQUANTE**
- backend sync site ↔ desktop : **PREUVE MANQUANTE**

## 17. Gate

Ce contrat autorise :
- design ;
- schemas/policies ;
- fixtures honnêtes ;
- tests fail-closed.

Il n'autorise pas :
- lancement d'un bridge local ;
- custom protocol ;
- installation ;
- connexion aux OS ;
- cutover production.

**État : TERMINÉ — contrat web préparatoire / implémentation réelle différée avec MODARYX Forge.**
