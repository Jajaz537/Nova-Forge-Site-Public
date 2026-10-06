# MODARYX V2 — Authorizing rights decision candidate — 2026-10-06

**État : candidat manuel fail-closed / données réelles + revue juridique externe toujours OPEN**

Cette slice ajoute une route distincte pour un **grant manuel**. Elle ne modifie pas l’endpoint général `scope-decisions`, qui continue de refuser `GRANTED` et `GRANTED_WITH_LIMITS`.

Un grant n’est possible que si :
- le preflight est `ELIGIBLE_FOR_MANUAL_DECISION` ;
- la réponse est archivée et source-verified ;
- son extraction contient exactement le même scope, la même surface et le même statut ;
- l’asset est lié ;
- les conditions sont marquées satisfaites ;
- une référence de revue juridique externe existe ;
- un admin avec authentification récente fournit la confirmation exacte `AUTHORIZE_EXACT_PREFLIGHT_SCOPE`.

Le client ne peut pas fournir le scope, le statut, les territoires, les plateformes ou les conditions au moment du grant : tout est dérivé du preflight enregistré.

Un journal append-only `modaryx_v2_rights_authorizing_reviews` lie décision, preflight, réponse et digest de la référence de revue.

Cette slice ne simule aucune revue juridique et ne ferme pas les blockers de production tant qu’aucune vraie preuve éditeur / revue externe / migration distante contrôlée n’est démontrée.
