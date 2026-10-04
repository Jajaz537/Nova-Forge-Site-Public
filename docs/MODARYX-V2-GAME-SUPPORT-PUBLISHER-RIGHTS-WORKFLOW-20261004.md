# MODARYX V2 — Workflow automatique de support d’un jeu et demande éditeur

**Date : 2026-10-04**  
**Statut : ACTIF — contrat produit / automatisation production non encore implémentée**

## 1. Décision

Tout nouveau jeu ajouté à MODARYX doit passer par le même workflow, qu’il soit :

- proposé par l’équipe ;
- demandé par un membre ;
- importé depuis un catalogue ;
- ajouté dans le cadre d’un partenariat futur.

Lorsqu’une demande de support d’un jeu est **acceptée par MODARYX**, deux voies démarrent en parallèle :

1. **Support MODARYX sûr**
   - page Game Hub avec design system MODARYX ;
   - Game Atmosphere Layer originale MODARYX ;
   - nom du jeu utilisé de façon référentielle/descriptive lorsque juridiquement permis ;
   - aucun asset officiel non autorisé ;
   - aucune intégration desktop/provider non prouvée.

2. **Dossier éditeur**
   - création automatique d’un Rights Case ;
   - recherche/validation du bon canal officiel ;
   - préparation de la demande d’autorisation ;
   - envoi automatique uniquement quand le canal, le destinataire et le périmètre sont vérifiés ;
   - suivi de la réponse et application exacte des droits accordés.

Le support sûr ne doit pas être présenté comme officiel ou approuvé tant qu’aucune autorisation écrite ne le prouve.

## 2. États du workflow

### REQUESTED

Une demande existe.

Champs minimaux :
- GameId provisoire ;
- nom du jeu ;
- éditeur/développeur si connu ;
- plateforme(s) ;
- demandeur anonymisé si membre ;
- motif / intérêt ;
- date ;
- sources éventuelles.

Aucun Game Hub public n’est créé automatiquement à ce stade.

### TRIAGE

MODARYX vérifie :
- le jeu existe ;
- le type de contenu/modding est pertinent ;
- absence de doublon ;
- restrictions évidentes ;
- faisabilité produit ;
- demande communautaire ;
- risques de sécurité ou légaux connus.

### ACCEPTED_SAFE_BASELINE

La demande produit est acceptée.

Le système peut préparer :
- entrée Game ;
- page MODARYX sûre ;
- design standard MODARYX ;
- Game Atmosphere Layer 100 % originale ;
- wording indépendant ;
- disclaimer si nécessaire.

Interdit à ce stade :
- logo officiel non autorisé ;
- key art ;
- OST ;
- screenshots promo repris sans droit ;
- CTA officiel/partner ;
- installation/provider non prouvé.

### RIGHTS_CASE_CREATED

Création automatique d’un dossier dans le futur **Game Rights Registry**.

Champs :
- RightsCaseId ;
- GameId ;
- publisher ;
- trademark owner ;
- developer ;
- officialPolicyUrls ;
- fanContentPolicy ;
- modPolicy ;
- trademarkPolicy ;
- API/SDK policy ;
- commercialUsePolicy ;
- requestedScopes ;
- contactCandidates ;
- verifiedContact ;
- status ;
- evidence ;
- timestamps ;
- outboundMessages ;
- responses ;
- reviewer ;
- expiry/review date.

## 3. Recherche automatique du contact éditeur

Le système peut chercher un canal uniquement parmi des sources officielles ou vérifiables :

- site officiel éditeur ;
- page legal/licensing ;
- page press/business development ;
- formulaire de licence ;
- adresse copyright/trademark officielle ;
- documentation officielle API/modding ;
- contact fourni directement par l’éditeur.

Ne jamais envoyer vers :
- une adresse devinée ;
- un email trouvé uniquement sur un forum ;
- un profil personnel ;
- une adresse issue d’un scrape non vérifié ;
- un intermédiaire sans preuve de mandat.

États :
- `CONTACT_VERIFIED`
- `CONTACT_CANDIDATE`
- `CONTACT_NOT_FOUND`

**CONTACT_NOT_FOUND = demande non envoyée, jamais devinée.**

## 4. Demande éditeur automatique

Une fois le contact vérifié et le système outbound disponible, le workflow prépare puis envoie une demande structurée.

La demande doit contenir au minimum :

- identité de MODARYX ;
- URL/site/prototype lorsque disponible ;
- description courte de la plateforme ;
- jeu concerné ;
- nature indépendante/non affiliée actuelle ;
- modèle économique pertinent ;
- territoire prévu ;
- plateforme(s) ;
- audience visée ;
- usages déjà possibles sans asset officiel ;
- usages précis pour lesquels l’autorisation est demandée ;
- mockups ou captures privées si utiles ;
- fonctionnement prévu de MODARYX Forge si concerné ;
- politique modding/distribution envisagée ;
- procédure takedown ;
- contact légal MODARYX.

Ne jamais demander simplement :
> « Puis-je utiliser votre jeu sur mon site ? »

Demander des scopes séparés et précis.

## 5. Scopes de droits séparés

Exemples de scopes :

- `TRADEMARK_TEXT_REFERENCE`
- `OFFICIAL_LOGO`
- `OFFICIAL_KEY_ART`
- `OFFICIAL_SCREENSHOTS`
- `PRESS_KIT_MEDIA`
- `GAME_ICON`
- `OFFICIAL_FONTS`
- `AUDIO_OST`
- `MOD_LISTING`
- `MOD_HOSTING`
- `MOD_DISTRIBUTION`
- `MOD_INSTALLATION_HANDOFF`
- `API_ACCESS`
- `SDK_ACCESS`
- `DEEPLINK_TO_GAME`
- `COMMERCIAL_USE`
- `COBRANDING`
- `PARTNERSHIP_CLAIM`

Chaque scope peut avoir un statut différent.

## 6. États de demande

- `REQUEST_NOT_READY`
- `REQUEST_READY`
- `REQUEST_SENT`
- `AWAITING_RESPONSE`
- `NEEDS_MORE_INFO`
- `APPROVED`
- `APPROVED_WITH_LIMITS`
- `DECLINED`
- `NO_RESPONSE`
- `EXPIRED`
- `REVOKED`

Règles :
- **NO_RESPONSE ≠ APPROVED** ;
- permission orale non archivée ≠ permission suffisante pour scope sensible ;
- approval s’applique uniquement aux scopes, territoires, produits, durées et conditions écrites ;
- révocation/expiration doit désactiver les usages dépendants.

## 7. Envoi automatique : garde-fous

L’automatisation production doit être :

### Idempotente

Ne pas envoyer deux demandes identiques parce qu’un job a rejoué.

Clé conceptuelle :
`publisher + GameId + requestedScopes + requestVersion`

### Auditée

Enregistrer :
- destinataire ;
- source de vérification du contact ;
- contenu envoyé ;
- pièces jointes ;
- date ;
- message ID ;
- statut ;
- réponse ;
- reviewer.

### Non-spam

Par défaut :
- une demande initiale ;
- au maximum un nombre très limité de relances raisonnables ;
- arrêt immédiat sur refus ou demande de non-contact ;
- aucune séquence commerciale agressive.

### Révocable

Un administrateur MODARYX doit pouvoir :
- suspendre ;
- annuler ;
- corriger ;
- reprendre ;
- fermer un dossier.

## 8. Acceptation d’une demande membre

Parcours cible :

```
Membre demande le support d’un jeu
        ↓
REQUESTED
        ↓
Triage MODARYX
        ↓
Refus ─────────────→ raison tracée
        │
     Accepté
        ↓
ACCEPTED_SAFE_BASELINE
        ├──→ Game Hub MODARYX original
        ├──→ Game Atmosphere originale
        └──→ Rights Case automatique
                    ↓
             Contact officiel vérifié
                    ↓
             Demande éditeur
                    ↓
      ┌─────────────┼───────────────┐
      ↓             ↓               ↓
  APPROVED      LIMITED          DECLINED
      ↓             ↓               ↓
enrichissement   seulement       baseline
dans le scope    scopes permis   sûre / ou blocage
```

## 9. Si l’éditeur accepte

Le système ne débloque que les scopes autorisés.

Exemple :
- logo : Approved ;
- key art : Approved ;
- OST : Declined ;
- mod hosting : Not requested ;
- mod installation : Approved with limits.

MODARYX peut alors :
- activer les assets autorisés ;
- ajouter les crédits/mentions exigés ;
- afficher le statut officiel uniquement si réellement autorisé ;
- conserver preuve et conditions ;
- programmer revalidation avant expiration.

## 10. Si l’éditeur refuse

Un refus n’implique pas automatiquement la suppression complète du jeu.

Décision selon la portée :

### Refus d’assets / branding officiel
Rester sur :
- nom référentiel si juridiquement permis ;
- design MODARYX original ;
- aucun asset refusé.

### Refus de mod hosting/distribution
- ne pas héberger/distribuer ;
- éventuellement conserver page informative/lien autorisé selon politique et revue légale.

### Interdiction large ou risque juridique élevé
- marquer `GAME_SUPPORT_BLOCKED` ;
- désactiver les capacités concernées ;
- revue juridique humaine avant publication.

Aucun contournement technique ou contractuel.

## 11. Si l’éditeur ne répond pas

Statut :
`NO_RESPONSE`

Conséquence :
- aucun nouveau droit acquis ;
- baseline MODARYX uniquement si elle reste juridiquement acceptable ;
- aucune mention « approuvé » ;
- aucune utilisation d’asset nécessitant permission.

## 12. Game Rights Registry — règle production

Pour chaque jeu :

```
GameId
Publisher
TrademarkOwner
PolicyEvidence[]
RightsScopes[]
ContactEvidence[]
OutboundRequests[]
Responses[]
Restrictions[]
Expiry
ReviewDue
SafeBaselineAllowed
EnhancedBrandingAllowed
ModHostingAllowed
ModDistributionAllowed
ForgeHandoffAllowed
```

Tout composant UI dépendant d’un droit doit pouvoir lire ce registre.

## 13. Game Atmosphere Engine

À l’acceptation du support :

### Avant autorisation
- atmosphère originale MODARYX ;
- tokens génériques ;
- aucune reproduction officielle.

### Après autorisation limitée
- seulement les assets/scopes permis.

### Après autorisation élargie
- enrichissement contrôlé ;
- MODARYX reste identifiable ;
- aucune extension implicite de la licence.

## 14. Support MODARYX Forge

Le support desktop reste séparé.

Une demande d’un éditeur pour le site ne signifie pas automatiquement :
- permission d’installer ;
- permission de distribuer ;
- permission d’héberger ;
- permission d’utiliser API/SDK ;
- permission commerciale.

Le Rights Case doit contenir des scopes séparés pour le handoff MODARYX Forge.

## 15. Messages et consentement

Un membre qui propose un jeu :
- ne contacte pas l’éditeur au nom de MODARYX ;
- ne peut pas déclarer une autorisation ;
- ne peut pas uploader une prétendue licence comme preuve définitive sans revue.

Seuls les canaux MODARYX autorisés envoient les demandes officielles.

## 16. Anti-fraude

Refuser automatiquement comme preuve suffisante :
- screenshot d’email sans headers/provenance ;
- message Discord non vérifié ;
- faux press kit ;
- domaine ressemblant à celui de l’éditeur ;
- autorisation envoyée par un compte personnel non vérifié ;
- document modifié/non signé lorsque la portée exige une preuve forte.

## 17. Confidentialité

Les coordonnées privées d’un contact éditeur :
- jamais exposées publiquement ;
- accès restreint ;
- conservation minimale ;
- respect des obligations applicables.

Les réponses de licence peuvent contenir des clauses confidentielles et doivent être stockées avec accès contrôlé.

## 18. Automatisation réelle

État actuel :
- contrat produit : **TERMINÉ** ;
- Game Rights Registry production : **NON IMPLÉMENTÉ** ;
- moteur de workflow : **NON IMPLÉMENTÉ** ;
- recherche automatique de contact officiel : **NON IMPLÉMENTÉ** ;
- outbound email/API : **NON IMPLÉMENTÉ** ;
- validation de licences : **NON IMPLÉMENTÉ**.

Donc aujourd’hui, aucune demande n’est envoyée automatiquement.

Quand le backend existe, l’automatisation ne doit activer `REQUEST_SENT` que si :
1. support produit accepté ;
2. Rights Case créé ;
3. contact officiel vérifié ;
4. template courant ;
5. scopes explicites ;
6. outbound autorisé ;
7. idempotency key absente des envois antérieurs ;
8. aucun opt-out/refus actif.

## 19. Règle de VF

Avant VF, ce workflow doit être soit :
- implémenté et testé ;
- soit explicitement réduit à un processus manuel contrôlé documenté.

Aucun jeu réel ne doit basculer vers des assets officiels sur la seule base d’une demande membre.

## 20. Décision finale

**Une demande membre peut déclencher le support d’un jeu ; une acceptation MODARYX déclenche automatiquement un Rights Case et, lorsque le système le permet de façon vérifiée, la demande d’autorisation éditeur.**

Pendant l’attente :
- MODARYX utilise sa propre identité ;
- l’ambiance reste originale ;
- aucun asset protégé non autorisé ;
- aucune fausse affiliation ;
- aucune absence de réponse transformée en accord.
