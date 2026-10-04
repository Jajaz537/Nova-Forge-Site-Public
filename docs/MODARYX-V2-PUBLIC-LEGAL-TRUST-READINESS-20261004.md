# MODARYX V2 — Public Legal & Trust Readiness

**Date : 2026-10-04**  
**Statut : CONTRAT PRODUIT — contenu juridique final PREUVE MANQUANTE**

## 1. Objet

MODARYX doit posséder une surface publique claire regroupant les informations de confiance et les documents juridiques applicables.

Ce document définit uniquement la structure produit et les états honnêtes. Il ne constitue pas un avis juridique et n'invente aucun texte légal final.

## 2. Surfaces prévues

La future surface publique doit pouvoir donner accès à :

- informations légales / opérateur ;
- confidentialité ;
- conditions d'utilisation ;
- règles communauté / UGC ;
- cookies et stockage local ;
- propriété intellectuelle / signalement ;
- sécurité / signalement de vulnérabilité ;
- support et contact.

## 3. Règle anti-faux contenu

Tant que les informations réelles ne sont pas connues ou validées :
- ne pas inventer d'identité d'opérateur ;
- ne pas inventer d'adresse ;
- ne pas inventer de représentant légal ;
- ne pas inventer de DPO ;
- ne pas inventer de durées de conservation ;
- ne pas inventer de sous-traitants ;
- ne pas inventer de finalités ou bases juridiques ;
- ne pas publier de faux texte “conforme”.

État attendu : `PREUVE_MANQUANTE` ou `LEGAL_REVIEW_REQUIRED`.

## 4. Confidentialité

Le document final devra être dérivé de l'architecture réellement déployée :
- données réellement collectées ;
- finalités réellement utilisées ;
- durées réellement configurées ;
- destinataires/sous-traitants réels ;
- transferts réels ;
- droits et canaux réels ;
- logs/télémétrie réellement actifs ;
- IA réellement active ou non.

Le prototype ne doit pas simuler une collecte distante inexistante.

## 5. Cookies / stockage

Séparer :
- cookies strictement nécessaires ;
- préférences locales ;
- analytics éventuels ;
- publicité éventuelle ;
- services tiers éventuels.

Aucun bandeau ou consentement ne doit être simulé tant que la stack production et les services réels ne sont pas sélectionnés.

## 6. UGC / communauté

Les futures conditions/règles doivent être cohérentes avec :
- publication de mods/contenus ;
- commentaires/discussions ;
- Creator Studio ;
- droits des auteurs ;
- provenance ;
- signalement ;
- modération ;
- recours ;
- fraude ;
- malware ;
- contenu interdit ;
- takedown IP.

Ne jamais promettre un mécanisme serveur qui n'existe pas encore.

## 7. Propriété intellectuelle

Réutiliser les contrats déjà préparés :
- Game Rights Registry ;
- Publisher Rights Workflow ;
- Asset Rights Provenance ;
- IP Takedown Workflow.

La surface publique de signalement IP reste PREUVE MANQUANTE tant qu'aucun backend/mailbox/case system réel n'existe.

## 8. Sécurité

La future surface doit fournir un canal réel et vérifié avant publication.

Ne pas publier :
- une adresse fictive ;
- un formulaire non relié ;
- une promesse de délai non tenue ;
- une politique de bug bounty inexistante.

## 9. MODARYX IA

Si MODARYX IA traite des données utilisateur en production, les documents publics doivent refléter exactement :
- provider(s) réellement utilisés ;
- données transmises ;
- mémoire ;
- rétention ;
- entraînement/fine-tuning éventuel ;
- permissions et outils ;
- mécanismes de désactivation disponibles.

Aucun provider n'est actuellement sélectionné.

## 10. Statuts de readiness

- `STRUCTURE_READY`
- `PRODUCT_FACTS_MISSING`
- `LEGAL_DRAFT_REQUIRED`
- `LEGAL_REVIEW_REQUIRED`
- `APPROVED_FOR_PUBLICATION`
- `PUBLISHED`
- `REVIEW_DUE`

Seul `APPROVED_FOR_PUBLICATION` ou `PUBLISHED` peut être présenté comme document final.

## 11. Prototype

Une surface de démonstration peut afficher :
- catégories ;
- états ;
- éléments manquants ;
- dépendances de production.

Elle doit afficher explicitement :
`Prototype noindex — aucun texte juridique final n'est simulé.`

## 12. Gate VF

Avant VF publique :
- identité opérateur réelle : requise ;
- politiques adaptées aux services réellement déployés : requises ;
- canaux support/IP/sécurité réels : requis ;
- revue juridique adaptée au périmètre final : PREUVE MANQUANTE tant qu'elle n'a pas été obtenue ;
- liens footer fonctionnels : requis ;
- aucune page placeholder présentée comme finale.

## 13. État actuel

- structure produit : **TERMINÉE**
- contenu juridique réel : **NON RÉDIGÉ / PREUVE MANQUANTE**
- identité opérateur : **PREUVE MANQUANTE**
- stack/services finaux : **NON SÉLECTIONNÉS / NON IMPLÉMENTÉS**
- public IP intake : **NON IMPLÉMENTÉ**
- security contact : **PREUVE MANQUANTE**
- legal review : **PREUVE MANQUANTE**


## 14. Matérialisation prototype + preuves ciblées

**TERMINÉ pour la structure et le prototype / contenu juridique final PREUVE MANQUANTE**

Surface matérialisée :
- entrée footer `Confiance & légal` ;
- page publique de readiness ;
- 8 catégories structurées ;
- états honnêtes `PREUVE MANQUANTE / PRODUCT_FACTS_MISSING / LEGAL_DRAFT_REQUIRED` ;
- bannière explicite : `Prototype noindex — aucun texte juridique final n'est simulé.` ;
- aucun opérateur, DPO, adresse, durée de conservation, sous-traitant, canal sécurité ou texte légal final inventé.

Preuve Living Threshold :
- run `37227306023` — **SUCCESS**
- commit capturé `63868585bfc89b24eb2c138a0e64889932de69b8`
- artifact `11312436153`
- digest `sha256:dabf001e15e97608b988105de220a6743bca97664dcbe530303aabb1cbeea1be`
- `KEYBOARD_REACHABLE 39 / 39`
- desktop/mobile overflow `0 / 0`
- `MULTISCREEN_CAPTURE_COUNT 83`.

Preuves accessibilité / reflow :
- Accessibility Structure Matrix run `37227306134` — **SUCCESS**
  - `A11Y_STRUCTURE_SURFACE_COUNT 16`
  - `PASS_V2_KEYBOARD_REACHABILITY_MATRIX`
  - `PASS_V2_FOCUS_VISIBLE_MATRIX`
  - `TOUCH_MATRIX_SURFACE_COUNT 16`
  - `FORCED_COLORS_SURFACE_COUNT 13`
- Text spacing run `37227306076` — **SUCCESS**
  - `TEXT_SPACING_SURFACE_COUNT 13`
  - public-trust overflow `0`, clipped text `0`
- Narrow 320 run `37227306114` — **SUCCESS**
  - `NARROW_REFLOW_SURFACE_COUNT 13`
- Tablet run `37227306108` — **SUCCESS**
  - `TABLET_REFLOW_SURFACE_COUNT 13`.

Surface map :
- run `37227011707` — **SUCCESS**
- `SURFACE_MAP_COUNT 25`
- `UNRESOLVED_RUNTIME_COUNT 6`
- `PASS_V2_PRODUCTION_SURFACE_MAP`.

Cette preuve valide la **surface de readiness**, pas :
- le contenu légal final ;
- l'identité opérateur ;
- la conformité juridique ;
- les canaux de contact réels ;
- la publication production.
