# MODARYX V2 — Workflow IP / signalement de droits / takedown

**Date : 2026-10-04**  
**Statut : DÉCISION PRODUIT — contrat pré-production / backend réel non implémenté**

## 1. Objectif

MODARYX doit disposer avant lancement public d'un workflow explicite pour :
- recevoir un signalement de droits ;
- identifier précisément l'asset ou le contenu concerné ;
- préserver les preuves et la provenance ;
- empêcher une réutilisation automatique pendant l'analyse ;
- appliquer un fallback MODARYX original lorsque nécessaire ;
- tracer toute décision ;
- gérer une contestation/restauration de façon contrôlée ;
- éviter qu'une réclamation ou une réponse ambiguë soit interprétée automatiquement comme une vérité définitive.

Ce workflow ne remplace pas un avis juridique professionnel et devra être adapté aux obligations applicables selon juridiction, type de contenu et statut du service avant production.

## 2. Périmètre

Le workflow couvre notamment :
- Game Atmosphere assets ;
- logos ;
- key arts ;
- screenshots ;
- médias utilisateur/créateur ;
- médias de mods ;
- audio ;
- documentation ;
- contenus promotionnels ;
- assets de Creator Studio ;
- médias importés depuis des providers autorisés.

Il ne doit pas être limité aux seuls jeux réels.

## 3. États conceptuels

- `RECEIVED`
- `IDENTITY_OR_AUTHORITY_CHECK`
- `EVIDENCE_REVIEW`
- `CONTENT_LOCATED`
- `TEMP_RESTRICTED`
- `NEEDS_MORE_INFO`
- `LEGAL_REVIEW_REQUIRED`
- `ACTIONED`
- `REJECTED`
- `RESTORED`
- `APPEALED`
- `CLOSED`

Aucun état ne doit être confondu avec une décision juridique universelle.

## 4. Données minimales du dossier

Chaque dossier doit contenir au minimum :
- `IpCaseId` ;
- date de réception ;
- canal ;
- type de demande ;
- déclarant ;
- qualité/autorité déclarée ;
- coordonnées de retour ;
- contenu ou asset visé ;
- URL/identifiant interne ;
- jeu/projet si applicable ;
- type de droit allégué ;
- explication ;
- pièces/preuves ;
- provenance de ces pièces ;
- statut ;
- historique des actions ;
- reviewer ;
- délais/review due ;
- résultat ;
- lien vers Rights Case si pertinent ;
- lien vers contenu/mod/release/creator concerné.

Les données sensibles doivent être restreintes et minimisées.

## 5. Réception

Canaux futurs possibles :
- formulaire IP officiel MODARYX ;
- adresse email dédiée ;
- contact contractuel ;
- provider/éditeur authentifié ;
- escalade interne.

Une demande reçue doit :
- obtenir un identifiant ;
- être horodatée ;
- conserver le message original ;
- conserver les pièces sans transformation destructive ;
- être liée au contenu exact concerné.

Ne pas accepter comme vérité automatique :
- screenshot isolé ;
- faux domaine ;
- message social non vérifié ;
- document modifié ;
- simple affirmation sans contexte.

## 6. Vérification identité / autorité

MODARYX doit distinguer :
- identité déclarée ;
- identité vérifiée ;
- représentant autorisé ;
- détenteur de droits ;
- intermédiaire inconnu.

États :
- `AUTHORITY_UNVERIFIED`
- `AUTHORITY_PARTIAL`
- `AUTHORITY_VERIFIED`

Un signalement non vérifié peut être examiné pour sécurité, mais ne doit pas être transformé automatiquement en autorité juridique complète.

## 7. Localisation du contenu

Avant toute action :
- identifier l'asset exact ;
- retrouver sa provenance ;
- retrouver déclaration utilisateur/créateur ;
- retrouver licence/preuve ;
- retrouver dépendances d'affichage ;
- vérifier si l'asset est réutilisé ailleurs ;
- vérifier si une copie dérivée existe.

Le système doit pouvoir rechercher par :
- hash ;
- asset id ;
- URL ;
- ContentItem ;
- Release/File ;
- GameId ;
- Creator/Team ;
- campagne/marketing slot.

## 8. Restriction temporaire

Lorsque la politique interne exige une précaution immédiate, l'action cible doit être limitée au périmètre nécessaire.

Exemples :
- masquer l'asset contesté ;
- désactiver sa réutilisation marketing ;
- retirer du Game Atmosphere Engine ;
- remplacer par fallback MODARYX ;
- bloquer republication automatique ;
- conserver le dossier pour revue.

Ne pas :
- supprimer les preuves ;
- effacer l'historique ;
- supprimer tout un compte sans lien nécessaire ;
- étendre une restriction à des contenus non concernés sans base.

## 9. Fallback MODARYX

Pour les surfaces publiques :
- asset contesté → fallback original MODARYX ;
- aucune page critique ne doit dépendre d'un asset externe contesté ;
- navigation/compatibilité/données essentielles restent disponibles lorsque juridiquement possible ;
- ne jamais réinjecter automatiquement l'asset contesté depuis un cache ou une source externe.

## 10. Décision

Résultats conceptuels :
- `ACTION_REMOVE_OR_RESTRICT`
- `ACTION_KEEP_RESTRICTED_PENDING_REVIEW`
- `ACTION_RESTORE`
- `ACTION_REJECT_REQUEST`
- `ACTION_REQUEST_MORE_INFO`
- `ACTION_ESCALATE_LEGAL`

Une décision sensible doit conserver :
- motifs ;
- preuves ;
- reviewer ;
- timestamp ;
- portée ;
- contenu concerné ;
- actions techniques ;
- notifications envoyées ;
- possibilité de recours si applicable.

## 11. Ambiguïté

Si :
- autorité incertaine ;
- documents contradictoires ;
- licence complexe ;
- conflit de juridictions ;
- clause contractuelle ambiguë ;
- contre-réclamation sérieuse ;
- impact commercial élevé ;

alors :
`LEGAL_REVIEW_REQUIRED`

Aucun asset ne doit être réactivé automatiquement pendant cette phase si sa réactivation dépend précisément de l'ambiguïté non résolue.

## 12. Contestation / recours

Le workflow doit permettre :
- réponse du créateur/utilisateur concerné ;
- nouvelles preuves ;
- révision ;
- restauration si appropriée ;
- maintien de restriction si nécessaire ;
- fermeture tracée.

États :
`APPEALED → EVIDENCE_REVIEW → RESTORED / ACTIONED / LEGAL_REVIEW_REQUIRED`.

## 13. Anti-réupload

Après restriction d'un asset :
- conserver hash/signature/provenance ;
- empêcher le réupload identique automatique lorsque la politique l'exige ;
- détecter alias/renommage simple si techniquement faisable ;
- ne jamais utiliser un système de détection comme unique preuve juridique ;
- prévoir faux positifs et revue.

## 14. Cache / CDN / PWA

Une action de restriction doit prévoir :
- invalidation ou expiration contrôlée des copies distribuées ;
- Service Worker V2 ;
- caches navigateur ;
- thumbnails ;
- CDN ;
- variantes responsive ;
- dérivés.

Cette partie reste non implémentée tant que la production V2 n'existe pas.

## 15. Notifications

Notifications possibles :
- accusé de réception ;
- demande d'information ;
- restriction temporaire ;
- décision ;
- recours ;
- restauration ;
- fermeture.

Aucune notification ne doit :
- divulguer un contact privé ;
- exposer une clause confidentielle ;
- affirmer une violation juridique si la décision ne le permet pas ;
- transformer un état temporaire en décision finale.

## 16. Audit trail

Chaque transition doit être append-only au niveau logique :
- event id ;
- case id ;
- ancien état ;
- nouvel état ;
- acteur ;
- source ;
- raison ;
- timestamp ;
- evidence refs ;
- action technique ;
- résultat.

Les corrections d'erreurs ne doivent pas supprimer l'événement précédent.

## 17. Intégration Game Rights Registry

Si le dossier concerne un asset éditeur/licencié :
- relier au Rights Case ;
- vérifier scope ;
- vérifier expiration/révocation ;
- mettre à jour restriction si nécessaire ;
- ne pas étendre la conclusion à d'autres scopes sans preuve.

## 18. Intégration Creator / UGC

Pour un média utilisateur/créateur :
- déclaration de droits à l'upload ;
- provenance ;
- auteur/source distincts ;
- accès au dossier limité ;
- workflow de contestation ;
- historique conservé ;
- pas de réutilisation marketing MODARYX automatique.

## 19. Garde-fous automatiques

Le futur moteur doit empêcher :
- suppression de preuve ;
- restauration sans état autorisant ;
- reupload automatique d'un asset restreint ;
- activation d'un asset `Unknown` ;
- extension d'une décision à tout un jeu sans scope ;
- suppression silencieuse d'un Rights Case ;
- auto-clôture d'un cas `LEGAL_REVIEW_REQUIRED`.

## 20. États automatiques permis

Automatisation faible risque :
- créer dossier ;
- lier contenu ;
- extraire métadonnées ;
- calculer hash ;
- rechercher provenance ;
- appliquer un fallback préapprouvé ;
- préparer notifications ;
- planifier review due.

Automatisation sensible :
- restriction étendue ;
- restauration ;
- conclusion contractuelle ;
- décision juridique ;
- sanction compte ;
- suppression définitive.

Les actions sensibles doivent passer par policy gate approprié.

## 21. SLA / priorités

Le système futur peut prioriser selon :
- risque de diffusion ;
- type d'asset ;
- volume ;
- présence d'une licence ;
- sécurité ;
- urgence contractuelle ;
- statut officiel du déclarant.

Aucun délai précis n'est figé ici : il devra être défini selon obligations applicables et capacité opérationnelle avant production.

## 22. Confidentialité

Restreindre :
- identité du déclarant ;
- coordonnées ;
- licences ;
- clauses ;
- pièces ;
- correspondances.

Les surfaces publiques ne montrent que ce qui est nécessaire.

## 23. Métriques internes

Exemples :
- dossiers ouverts ;
- temps de première revue ;
- dossiers LEGAL_REVIEW_REQUIRED ;
- restrictions actives ;
- restaurations ;
- doublons ;
- réuploads bloqués ;
- erreurs/faux positifs.

Ne jamais afficher publiquement une métrique qui révèle un litige confidentiel.

## 24. Production status

À ce stade :
- contrat : **TERMINÉ**
- backend de cases : **NON IMPLÉMENTÉ**
- formulaire public réel : **NON IMPLÉMENTÉ**
- email IP réel : **NON IMPLÉMENTÉ**
- cache invalidation production : **NON IMPLÉMENTÉ**
- anti-reupload production : **NON IMPLÉMENTÉ**
- legal review workflow réel : **NON IMPLÉMENTÉ**

## 25. Règle VF

Avant exposition publique d'assets utilisateur/éditeur dépendant de ce workflow :
- canal IP opérationnel ;
- ownership du workflow ;
- stockage/audit ;
- restriction/fallback ;
- notifications ;
- procédure de recours ;
- sécurité/confidentialité ;
- revue juridique externe des obligations applicables.

Le prototype ou le contrat ne vaut pas conformité juridique finale.
