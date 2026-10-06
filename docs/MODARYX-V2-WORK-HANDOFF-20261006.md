# MODARYX V2 — Handoff Work / opérateur réel — 2026-10-06

**Source exacte : `fc2c3513bde941e0aa9751b987eefa6de3e71643`**  
**État : prêt pour exécution externe contrôlée — aucun blocker fermé par ce document**

Le candidat web interne est largement préparé. Les **19 blockers restants** exigent maintenant une réalité externe : appareil, production, provider, éditeur ou revue juridique.

## Ordre d'exécution

1. **Validations appareils réels**
   - NVDA sur Windows réel ;
   - VoiceOver sur Apple réel ;
   - TalkBack sur Android physique ;
   - Safari réel ;
   - appareils physiques/touch.
   - utiliser `qa/modaryx-v2-external-validation-execution-pack.json`.

2. **Production read-only**
   - garder `/api/v1/production/readiness` et le probe GET/HEAD verts ;
   - ne fermer aucun blocker à partir d'un simple preflight.

3. **D1 DEV contrôlé**
   - cible exacte ;
   - backup/export pré-apply ;
   - approbation explicite ;
   - appliquer le manifeste D1 DEV seulement ensuite ;
   - preuve schéma + historique propriétaire + restauration.

4. **R2 / providers / auth / email-push**
   - uniquement avec sélection/configuration réelle et approbation explicite ;
   - chaque activation doit avoir sa micro-preuve ;
   - pas de changement critique Cloudflare implicite.

5. **Droits / légal**
   - sources officielles réelles ;
   - destination éditeur vérifiée ;
   - outbound réel ;
   - réponse réelle mise en quarantaine ;
   - validation licence/scope ;
   - revue juridique réelle lorsque nécessaire.

6. **CWV terrain**
   - collecte approuvée et réellement activée ;
   - trafic production réel ;
   - LCP/INP/CLS p75.

7. **Cutover en dernier**
   - seulement lorsque tous les blockers obligatoires sont fermés ;
   - rollback fraîchement prouvé ;
   - approbation release explicite.

## Interdictions

- aucun faux PASS ;
- aucun écran simulé déclaré « appareil réel » ;
- aucun navigateur automatisé déclaré « Safari réel » ;
- aucune approbation éditeur/juridique inventée ;
- aucune migration ou activation distante sans l'autorisation requise ;
- aucun `main`, DNS/DNSSEC/nameserver ou cutover implicite.

La source machine lisible est `qa/modaryx-v2-work-handoff.json`.
