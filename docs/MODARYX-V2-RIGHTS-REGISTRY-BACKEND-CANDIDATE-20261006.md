# MODARYX V2 — Game Rights Registry backend candidat — 2026-10-06

**État : stockage/API candidat prouvé localement — droits production OPEN**

Cette slice transforme une partie du contrat droits en backend réel sans autoriser de droits par défaut.

Implémenté :
- migration D1 locale pour Rights Cases, décisions scope/surface et audit append-only ;
- API admin pour créer un Rights Case ;
- API admin pour enregistrer uniquement des décisions **non autorisantes** ;
- évaluateur exact scope + surface + territoire + plateforme ;
- garde DB imposant evidence/source/conditions/asset/reviewer/verifiedAt pour toute ligne autorisante ;
- lecture effective fail-closed.

Volontairement NON implémenté :
- enregistrement de `GRANTED` / `GRANTED_WITH_LIMITS` via l'API actuelle ;
- découverte de contact officiel ;
- adresse email/formulaire éditeur ;
- outbound ;
- inbound ;
- parsing de réponse ;
- validation juridique/licence ;
- scheduler expiration/révocation ;
- activation d'asset.

Ainsi, un membre ou même l'API admin candidate ne peut pas transformer une demande, un silence ou une réponse ambiguë en permission.

La migration distante n'est pas exécutée par cette change. Les blockers droits production restent OPEN.
