# MODARYX V2 — Game Rights Registry Contract

**Date : 2026-10-04**  
**Statut : DÉCISION PRODUIT — contrat pré-production / registre production non implémenté**

## 1. Objectif

Le **Game Rights Registry** est la source structurée qui doit empêcher MODARYX de transformer :
- une demande envoyée ;
- une absence de réponse ;
- un accord partiel ;
- une autorisation expirée ;
- ou une permission Web ;

en autorisation générale.

Il ne remplace pas les documents juridiques originaux : il enregistre leur portée de manière exploitable par le produit, avec liens de preuve et audit.

## 2. Unité de décision

La décision n'est jamais :
`Game = APPROVED`.

Elle est toujours :
`Game + RightScope + ProductSurface + Conditions + Evidence + EffectiveDates = ScopeDecision`.

Exemples :
- logo Web : GRANTED ;
- key art Web : DENIED ;
- screenshots presse Web : GRANTED_WITH_LIMITS ;
- mod hosting : NOT_REQUESTED ;
- MODARYX Forge handoff : PENDING ;
- audio/OST : FORBIDDEN ou DENIED selon preuve.

## 3. Objets

### GameRightsRegistryEntry
- `GameId`
- `GameName`
- `Publisher`
- `Developer`
- `TrademarkOwners[]`
- `PolicyEvidence[]`
- `ContactEvidence[]`
- `RightsCases[]`
- `ScopeDecisions[]`
- `Restrictions[]`
- `LastReviewedAt`
- `NextReviewDue`
- `RegistryStatus`
- `AuditRefs[]`

### ScopeDecision
- `ScopeDecisionId`
- `GameId`
- `RightScope`
- `ProductSurface`
- `Status`
- `Territories[]`
- `Platforms[]`
- `AllowedUses[]`
- `ForbiddenUses[]`
- `Conditions[]`
- `CreditsRequired[]`
- `ValidFrom`
- `ValidUntil`
- `EvidenceRefs[]`
- `SourceMessageRef`
- `Reviewer`
- `VerifiedAt`
- `RevalidationDue`
- `RevocationRef`
- `SupersedesDecisionId`

## 4. ProductSurface

Valeurs conceptuelles :
- `WEB_PUBLIC`
- `WEB_ADMIN`
- `WEB_MARKETING`
- `MODARYX_FORGE`
- `CREATOR_STUDIO`
- `API_INTEGRATION`
- `EMAIL_MARKETING`
- `SOCIAL_PROMOTION`

Une permission sur une surface ne s'étend jamais implicitement à une autre.

## 5. RightScope

Scopes minimaux :
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

## 6. Statuts de scope

- `UNKNOWN`
- `NOT_REQUESTED`
- `PENDING`
- `GRANTED`
- `GRANTED_WITH_LIMITS`
- `DENIED`
- `RESTRICTED`
- `EXPIRED`
- `REVOKED`
- `FORBIDDEN`

Seuls :
- `GRANTED`
- `GRANTED_WITH_LIMITS`

peuvent éventuellement autoriser un usage, et uniquement si tous les autres garde-fous passent.

## 7. Garde-fous d'autorisation

Un usage dépendant d'un droit ne peut être activé que si :
1. scope exact présent ;
2. surface produit couverte ;
3. statut = GRANTED ou GRANTED_WITH_LIMITS ;
4. preuve archivée ;
5. source/provenance vérifiée ;
6. date d'effet atteinte ;
7. date d'expiration non dépassée ;
8. aucune révocation active ;
9. territoire compatible si applicable ;
10. plateforme compatible si applicable ;
11. conditions remplies ;
12. aucune restriction supérieure active ;
13. asset lié au bon ScopeDecision ;
14. audit décision présent.

Un booléen dérivé comme `EnhancedBrandingAllowed=true` n'est jamais la source d'autorité.

## 8. États qui ne donnent aucun droit

Toujours non autorisants :
- UNKNOWN ;
- NOT_REQUESTED ;
- PENDING ;
- DENIED ;
- RESTRICTED hors condition remplie ;
- EXPIRED ;
- REVOKED ;
- FORBIDDEN ;
- NO_RESPONSE ;
- REQUEST_SENT ;
- AWAITING_RESPONSE ;
- LEGAL_REVIEW_REQUIRED.

## 9. Liaison des assets

Tout asset non original MODARYX doit référencer :
- `AssetId`
- `ScopeDecisionId`
- `Source`
- `Provenance`
- `BlobHash`
- `UseContext`

Si le ScopeDecision devient EXPIRED/REVOKED/DENIED :
- asset bloqué dans les contextes dépendants ;
- fallback MODARYX ;
- cache invalidation planifiée ;
- aucune réactivation automatique.

## 10. Original MODARYX

Les assets originaux MODARYX :
- restent dans leur propre provenance ;
- ne sont pas convertis en assets éditeur ;
- peuvent servir de fallback ;
- doivent quand même avoir une provenance interne suffisante pour production.

La présence d'un asset original n'autorise pas l'usage d'une marque tierce au-delà de ce qui est juridiquement permis.

## 11. ContactEvidence

Chaque contact vérifié doit conserver :
- source officielle ;
- URL/source ;
- domaine ;
- méthode de vérification ;
- date ;
- scope du contact ;
- statut ;
- reviewer.

Une adresse trouvée uniquement sur forum/social/scrape non vérifié ne passe pas en `CONTACT_VERIFIED`.

## 12. PolicyEvidence

Conserver :
- URL officielle ;
- type de politique ;
- version/date observée ;
- contenu pertinent ou snapshot/référence ;
- date de revue ;
- impact ;
- reviewer.

Une politique éditeur peut changer : `NextReviewDue` est obligatoire pour les éléments sensibles.

## 13. RightsCase

Le Registry référence les Rights Cases, mais ne confond pas :
- demande ;
- réponse ;
- scope decision ;
- asset.

Une réponse peut générer plusieurs ScopeDecisions.

## 14. Réponse partielle

Exemple fictif :
- logo : GRANTED ;
- screenshots : GRANTED_WITH_LIMITS ;
- key art : DENIED ;
- Forge handoff : NOT_REQUESTED.

Le registre ne doit jamais produire un statut global `APPROVED_ALL`.

## 15. Ambiguïté

Si une réponse ne permet pas d'extraire proprement :
- portée ;
- durée ;
- produit ;
- territoire ;
- droit ;
- conditions ;

le ScopeDecision reste non autorisant et le dossier passe :
`LEGAL_REVIEW_REQUIRED`.

## 16. Expiration / révocation

Le Registry doit intégrer :
- monitor/review due ;
- EXPIRED ;
- REVOKED ;
- SupersedesDecisionId ;
- nouvelle preuve pour réactivation.

Aucune décision ancienne ne doit redevenir active parce qu'un job a rejoué.

## 17. Dérivés produit

Le Registry peut calculer :
- `SafeBaselineAllowed`
- `EnhancedBrandingAllowed`
- `ModHostingAllowed`
- `ModDistributionAllowed`
- `ForgeHandoffAllowed`
- `CommercialUseAllowed`

Ces champs :
- sont recalculables ;
- ne sont pas des preuves ;
- doivent pointer vers les ScopeDecisions sources.

## 18. Audit

Chaque création/modification de décision :
- append event ;
- actor ;
- reason ;
- previous decision ;
- new decision ;
- evidence refs ;
- timestamp ;
- policy version.

Pas d'édition silencieuse d'une autorisation historique.

## 19. Confidentialité

Ne pas exposer publiquement :
- contacts privés ;
- clauses confidentielles ;
- correspondances complètes ;
- preuves contractuelles sensibles.

La surface publique ne montre que les mentions nécessaires.

## 20. Défaillance

Si le Registry est indisponible :
- ne pas supposer `allowed` ;
- usages dépendants sensibles fail closed ;
- baseline originale MODARYX privilégiée ;
- état explicite `RIGHTS_REGISTRY_UNAVAILABLE`.

## 21. Import / migration

Aucun ancien document ou spreadsheet ne devient permission active par import automatique.

Migration :
- importer comme `UNVERIFIED_IMPORTED_RECORD` ;
- vérifier ;
- convertir ensuite en décisions structurées.

## 22. Données membre

Un membre peut demander un jeu mais ne peut jamais écrire directement :
- GRANTED ;
- CONTACT_VERIFIED ;
- PARTNERSHIP_CLAIM ;
- licence ;
- preuve éditeur validée.

## 23. Intégration MODARYX IA

MODARYX IA peut :
- résumer ;
- extraire candidats de scopes ;
- comparer une réponse ;
- détecter manque/ambiguïté ;
- préparer une décision.

MODARYX IA ne doit pas :
- créer GRANTED sans policy gate ;
- étendre une permission ;
- ignorer une expiration ;
- transformer silence en accord.

## 24. Intégration IP / takedown

Un IpCase peut :
- pointer vers ScopeDecision ;
- restreindre temporairement l'asset ;
- déclencher revalidation ;
- conserver fallback.

Le takedown ne supprime pas l'historique du Registry.

## 25. Production status

À ce stade :
- contrat Registry : **TERMINÉ**
- database : **NON IMPLÉMENTÉ**
- API : **NON IMPLÉMENTÉ**
- admin CRUD réel : **NON IMPLÉMENTÉ**
- policy engine réel : **NON IMPLÉMENTÉ**
- scheduler/revalidation : **NON IMPLÉMENTÉ**
- asset linkage production : **NON IMPLÉMENTÉ**
- audit store réel : **NON IMPLÉMENTÉ**

## 26. Règle VF

Avant activation d'un asset officiel ou d'une capacité tierce réelle :
- ScopeDecision structure active ;
- preuve archivée ;
- audit ;
- expiry/revocation ;
- fail-closed ;
- permissions admin ;
- backup/restore ;
- revue juridique de l'implémentation et des obligations applicables.

Le Registry structure le risque ; il ne garantit pas à lui seul la conformité juridique.
