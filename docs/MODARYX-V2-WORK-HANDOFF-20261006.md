# MODARYX V2 — Handoff Work / opérateur réel — 2026-10-06

**Source canonique : `7464b3bc8e8270737f733047804406a5cce6d48d`**  
**Candidat runtime re-probé : `ce587af7d138eedf148d5d446cacd8fb6f2235a3`**  
**Preview exact : `https://371b4eff.nova-forge-site-public.pages.dev`**  
**Checkpoint : `CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-06-1732.md`**  
**État : prêt pour exécution externe contrôlée — aucun blocker fermé par ce document**

Le candidat web interne est préparé au maximum sans mutation distante. Les **19 blockers restants** exigent maintenant une réalité externe : appareil, production, provider, éditeur ou revue juridique.

## Ordre d’exécution

1. **Validations appareils réels**
   - NVDA sur Windows réel ;
   - VoiceOver sur Apple réel ;
   - TalkBack sur Android physique ;
   - Safari réel ;
   - appareils physiques/touch ;
   - utiliser `qa/modaryx-v2-external-validation-execution-pack.json`.

2. **Production read-only**
   - conserver `/api/v1/production/readiness` et le probe GET/HEAD verts ;
   - dernier run : `37488293293`, job `112354005071` ;
   - aucun blocker fermé à partir d’un simple preflight.

3. **D1 DEV contrôlé**
   - cible exacte ;
   - backup/export pré-apply ;
   - **approbation explicite** ;
   - appliquer le manifeste D1 DEV seulement ensuite ;
   - preuve schéma + historique propriétaire + restauration.

4. **R2 / providers / auth / email-push**
   - uniquement avec sélection/configuration réelle et approbation explicite ;
   - chaque activation a sa micro-preuve ;
   - aucun changement critique Cloudflare implicite.

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
   - tous les blockers obligatoires fermés ;
   - rollback fraîchement prouvé ;
   - approbation release explicite.

## Interdictions

- aucun faux PASS ;
- aucun écran simulé déclaré appareil réel ;
- aucun navigateur automatisé déclaré Safari réel ;
- aucune approbation éditeur/juridique inventée ;
- aucune migration ou activation distante sans autorisation requise ;
- aucun `main`, DNS/DNSSEC/nameserver ou cutover implicite.

La source machine lisible est `qa/modaryx-v2-work-handoff.json`.
