# MODARYX V2 — Routes internes et métadonnées initiales — 2026-10-06

**État : candidat V2 uniquement / aucun redirect public ni cutover**

Le root `v2/` reçoit des URLs internes stables pour les surfaces core et les six fiches de démonstration. Le Worker ne fallback plus les routes HTML inconnues : une URL V2 inconnue reste 404.

Pour les routes connues, le Worker fournit un HTML initial avec titre et description spécifiques, tout en conservant `noindex` tant que le cutover n'est pas autorisé.

Le navigateur doit prouver l'accès direct à chaque route, la navigation SPA et le retour historique.

Cela ne crée aucun redirect V1 public, aucun canonical production et n'autorise aucun cutover.
