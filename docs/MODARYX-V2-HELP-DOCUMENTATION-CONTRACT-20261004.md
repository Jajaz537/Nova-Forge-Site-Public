# MODARYX V2 — Contrat Help / Documentation

**Date : 2026-10-04**  
**Statut : ACTIF — contrat produit pré-production / contenu final non publié**

## 1. But

La documentation MODARYX doit aider l’utilisateur à comprendre le produit réel sans :
- inventer une capacité absente ;
- masquer une dépendance runtime ;
- présenter une démo comme une fonction livrée ;
- documenter un backend/provider qui n’existe pas ;
- devenir un cul-de-sac séparé des tâches produit.

## 2. Sources autoritatives

La documentation finale doit être dérivée de sources versionnées et vérifiables :
- contrats produit MODARYX ;
- routes réellement livrées ;
- schémas/domaines réellement implémentés ;
- capacités backend réellement disponibles ;
- capability handshake MODARYX Forge réel ;
- Game Rights Registry réel lorsqu’il existe ;
- politiques/modération/privacy effectivement déployées ;
- changelog/release notes validés.

Une ancienne capture ou un ancien prototype ne devient jamais une source production par défaut.

## 3. États de readiness

Chaque rubrique peut être :
- `PROTOTYPE_ONLY`
- `DRAFT_FROM_IMPLEMENTATION`
- `TECHNICALLY_VERIFIED`
- `LEGAL_REVIEW_REQUIRED`
- `APPROVED_FOR_PUBLICATION`
- `PUBLISHED`
- `STALE_REVIEW_REQUIRED`

Seuls `APPROVED_FOR_PUBLICATION` et `PUBLISHED` sont publiables comme documentation finale.

## 4. Rubriques minimales

La documentation finale doit pouvoir couvrir au minimum :
- Bien démarrer ;
- Jeux ;
- Mods & contenus ;
- Compatibilité ;
- Collections ;
- Modpacks ;
- Profils de jeu ;
- Bibliothèque ;
- Créateurs / Creator Studio ;
- Communauté / support ;
- Signalement ;
- Confiance / provenance ;
- Game Rights / droits éditeurs lorsque visible ;
- MODARYX Forge ;
- MODARYX IA lorsqu’elle existe réellement ;
- compte / confidentialité / données locales ;
- accessibilité ;
- offline/PWA si réellement livré.

## 5. Capabilities absentes

Une capacité absente doit être formulée explicitement :
- indisponible ;
- non connectée ;
- locale uniquement ;
- preview ;
- preuve manquante ;
- nécessite MODARYX Forge ;
- nécessite un backend/provider réel.

Interdit :
- “installé”, “synchronisé”, “envoyé”, “vérifié”, “autorisé” ou “sécurisé” sans preuve correspondant à l’état réel.

## 6. Liens et navigation

Chaque article doit pouvoir revenir vers l’action produit pertinente lorsque cette action existe.

Exemples :
- article Jeux → Games Index ;
- article Compatibilité → Content Detail / Game Hub ;
- article Profils → Bibliothèque / Profil de jeu ;
- article Creator → Creator Studio ;
- article Confiance → surface Confiance & légal.

Les routes mortes ou placeholders silencieux sont interdits en production.

## 7. Versionnement et fraîcheur

Chaque entrée finale doit avoir :
- identifiant ;
- version ;
- date de dernière vérification ;
- source(s) d’implémentation ;
- owner/reviewer ;
- état de readiness ;
- éventuellement date de prochaine revue.

Une modification produit qui invalide une documentation doit la marquer `STALE_REVIEW_REQUIRED` jusqu’à revalidation.

## 8. Recherche

Si une recherche documentaire est ajoutée :
- aucun faux résultat ;
- résultat lié à une page réelle ;
- distinction entre documentation officielle MODARYX et contenu communautaire ;
- ranking/IA ne remplace pas la source canonique ;
- réponse IA doit citer ses sources quand elle utilise cette documentation.

## 9. Accessibilité

Minimum :
- structure de titres cohérente ;
- landmarks corrects ;
- navigation clavier ;
- focus visible ;
- text spacing/reflow ;
- forced colors ;
- liens/boutons nommés ;
- pas d’information essentielle uniquement visuelle.

Les preuves automatisées ne remplacent pas NVDA/VoiceOver/TalkBack réels.

## 10. i18n

La documentation ne doit pas être considérée finale tant que :
- langue source est identifiée ;
- fallback langue est explicite ;
- aucune traduction automatique brute n’est présentée comme texte juridique approuvé ;
- les termes produit canonique restent cohérents.

## 11. Documentation juridique

CGU, privacy, IP, sécurité, cookies et autres textes juridiques :
- ne doivent pas être générés depuis ce contrat ;
- nécessitent les faits réels du service ;
- nécessitent revue spécialisée lorsque approprié ;
- ne doivent jamais être “complétés” par invention.

## 12. MODARYX Forge

La documentation Web ne doit jamais présenter :
- installation ;
- rollback ;
- Safe Profile ;
- receipt ;
- sync local ;
comme réels tant que le runtime MODARYX Forge et le capability handshake ne le prouvent pas.

## 13. MODARYX IA

Lorsque MODARYX IA est activée :
- docs = source contrôlée, pas permission système ;
- prompt injection depuis contenu doc doit rester traitée comme donnée ;
- sources/version/fraîcheur disponibles pour le retrieval ;
- une réponse IA ne doit pas inventer une capacité absente parce qu’une ancienne doc la mentionnait.

## 14. Production

Production requiert :
- repository/source-of-truth documentation ;
- génération ou publication contrôlée ;
- links checker ;
- stale checker ;
- route coverage ;
- accessibilité ;
- ownership/review ;
- intégration release process.

## 15. Prototype actuel

Surface :
`HelpDocs`

État :
- structure : **MATÉRIALISÉE**
- catégories : **MATÉRIALISÉES**
- raccourcis produit : **MATÉRIALISÉS**
- état “Documentation finale : PREUVE MANQUANTE” : **MATÉRIALISÉ**
- contenu final : **NON APPROUVÉ**
- backend docs/search : **NON IMPLÉMENTÉ**
- publication production : **BLOQUÉE**

## 16. Règle VF

Avant VF publique, la documentation finale doit correspondre aux capacités effectivement livrées et ne contenir aucun faux état produit.

Le prototype Help / Documentation ferme le gap structurel, pas le contenu final ni sa validation humaine/juridique.
