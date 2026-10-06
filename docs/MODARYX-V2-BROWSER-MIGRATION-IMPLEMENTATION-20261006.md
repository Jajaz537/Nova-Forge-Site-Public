# MODARYX V2 — Migration navigateur implémentée en preview — 2026-10-06

**État : EN COURS / preuve navigateur ciblée requise**

Cette tranche implémente, dans le root isolé `v2-preview/`, la migration non destructive prévue par le contrat du 3 octobre.

Garanties :
- aucune clé legacy supprimée au premier passage ;
- namespace V2 `modaryx:v2:` ;
- marker écrit après les nouvelles valeurs ;
- reprise idempotente après interruption ;
- ancien brouillon Creator V1 laissé intact lorsqu'il ne peut pas être converti sans action explicite ;
- brouillon Creator V2 UMM v1 converti en ContentItem + Release draft verrouillée ;
- collection reste privée et ne devient jamais Modpack ;
- contribution reste local-draft / not-submitted ;
- préférences visuelles legacy non reconnues ne sont pas migrées ;
- SW preview supprime uniquement le cache legacy explicitement connu et préserve les caches inconnus ;
- aucun `clients.claim()` ;
- aucun enregistrement SW produit automatique : la registration est effectuée uniquement par la micro-preuve navigateur.

La preuve doit couvrir : navigateur neuf, navigateur legacy, offline, interruption et rollback.

Cette tranche ne modifie ni `main`, ni DNS, ni DNSSEC, ni nameservers, ni configuration Cloudflare critique et ne déclenche aucun cutover.
