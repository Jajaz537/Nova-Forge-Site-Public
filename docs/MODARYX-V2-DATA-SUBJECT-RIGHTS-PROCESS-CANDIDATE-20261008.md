# MODARYX V2 — processus droits utilisateur / données — candidat — 2026-10-08

**Statut : EN COURS — contrat opératoire candidat, aucun processus production activé**

Ce document prépare la gestion des demandes liées aux données personnelles sans inventer :
- responsable de traitement ;
- DPO/contact privacy ;
- canal réel ;
- délai légal final ;
- base juridique finale ;
- règle de conservation finale ;
- provider production.

## 1. Types de demandes

Le processus doit pouvoir traiter, selon applicabilité :
- accès ;
- rectification ;
- effacement ;
- portabilité/export ;
- opposition ;
- limitation ;
- retrait du consentement ;
- fermeture de compte ;
- information sur traitements ;
- contestation d'une décision automatisée si applicable.

Chaque type reste soumis à validation juridique selon le traitement réel et le territoire.

## 2. États opératoires candidats

- `RECEIVED`
- `IDENTITY_CHECK_PENDING`
- `SCOPE_DISCOVERY`
- `LEGAL_REVIEW_REQUIRED`
- `PROCESSING`
- `WAITING_FOR_USER`
- `COMPLETED`
- `PARTIALLY_COMPLETED_WITH_REASON`
- `REJECTED_WITH_REASON`

Aucune demande ne doit être fermée uniquement parce qu'un délai interne a expiré.

## 3. Vérification d'identité

Principe :
**proportionnée au risque et à la donnée demandée.**

Préférer :
- session authentifiée ;
- re-authentification ;
- challenge sur canal déjà vérifié ;
- preuve contextuelle minimale.

Éviter par défaut :
- copie de pièce d'identité ;
- données sensibles supplémentaires ;
- collecte documentaire excessive.

Si une preuve supplémentaire est réellement nécessaire :
- finalité documentée ;
- accès restreint ;
- conservation minimale ;
- suppression après nécessité lorsque juridiquement possible.

## 4. Discovery du périmètre

Source technique actuelle :
`docs/MODARYX-V2-PRIVACY-TABLE-FIELD-REGISTER-CANDIDATE-20261007.json`.

Catégories à considérer :
- identité/profil ;
- auth/session ;
- UGC ;
- créateurs/équipes ;
- catalogue relié à un créateur ;
- collections/historique ;
- modération ;
- notifications ;
- droits/licences ;
- support ;
- RUM/CWV si activé ;
- paiement si activé.

Le mapping final table/champ → droit applicable reste **LEGAL_REVIEW_REQUIRED**.

## 5. Accès

Sortie candidate :
- données compréhensibles ;
- catégories ;
- finalités ;
- sources lorsque pertinentes ;
- destinataires/providers réels ;
- durées ou critères réels ;
- droits/process applicables.

Ne pas exposer :
- secrets ;
- credentials ;
- données d'autres personnes ;
- contrôles anti-abus sensibles ;
- informations légalement protégées.

Les exclusions doivent être motivées et validées.

## 6. Rectification

Permettre correction des données modifiables par l'utilisateur.

Distinguer :
- données déclaratives ;
- logs/audits factuels ;
- décisions/modération ;
- preuves de droits ;
- reçus sécurité.

Ne pas réécrire silencieusement un historique/audit pour simuler une rectification. Préférer correction/versionnement lorsque l'historique doit rester probant.

## 7. Effacement / fermeture

Aucune règle de hard-delete globale.

Pipeline candidat :
1. identifier compte/scope ;
2. fermer sessions actives si approprié ;
3. classifier données effaçables ;
4. classifier données à conserver temporairement/légalement ;
5. désassocier/anonymiser si adapté ;
6. propager aux providers réels ;
7. vérifier objets R2/D1/autres stores ;
8. enregistrer reçu minimal de traitement ;
9. confirmer le résultat.

Conservation de sécurité, modération, droits ou obligations légales : **LEGAL_REVIEW_REQUIRED**.

## 8. Portabilité / export

Format candidat :
- JSON machine-readable ;
- archive ZIP uniquement si plusieurs fichiers/artefacts ;
- manifeste ;
- horodatage ;
- version de schéma ;
- checksums si artefacts.

L'export doit éviter :
- données d'autres utilisateurs ;
- secrets ;
- tokens/session ;
- données internes non portables ;
- preuves protégées.

Le prototype d'export Studio/Communauté existant ne constitue pas une preuve de portabilité RGPD.

## 9. Opposition / limitation

Le processus doit pouvoir :
- enregistrer motif ;
- identifier traitement concerné ;
- suspendre une activité non essentielle lorsque juridiquement requis ;
- laisser actifs sécurité/obligations nécessaires seulement si justifiés ;
- notifier la décision.

Aucune règle automatique finale sans base juridique validée.

## 10. Retrait du consentement

Lorsque le traitement repose sur consentement :
- retrait aussi accessible que le consentement ;
- effet prospectif ;
- propagation aux providers concernés ;
- aucun service non nécessaire continué après retrait ;
- preuve minimale de changement de préférence.

Marketing/analytics non nécessaires restent OFF tant que requis.

## 11. Sous-traitants / propagation

Pour chaque provider réellement activé :
- capacité export ;
- capacité suppression ;
- SLA/process fournisseur ;
- DPA ;
- sous-traitants ultérieurs ;
- transferts ;
- confirmation d'exécution.

Providers actuels candidats :
- Cloudflare ;
- Auth0 ;
- email/push à choisir ;
- paiement à choisir.

Aucun provider absent n'est simulé.

## 12. Sécurité et audit

Journal minimal :
- request id ;
- type ;
- identité de compte pseudonymisée si possible ;
- état ;
- timestamps ;
- étapes exécutées ;
- providers concernés ;
- résultat ;
- exception/review ref.

Ne pas journaliser le contenu complet de la demande si inutile.

Accès au journal : moindre privilège.

## 13. Accessibilité

Le futur canal de demande doit être accessible :
- clavier ;
- lecteur d'écran ;
- zoom/reflow ;
- erreurs ;
- authentification ;
- pièces jointes si présentes ;
- suivi d'état.

Prévoir une alternative si un provider tiers crée une barrière.

## 14. Mesures opérationnelles

À mesurer :
- demandes par type ;
- demandes / 10k MAU ;
- temps traitement interne ;
- demandes partielles/refusées avec motif ;
- rework ;
- erreurs provider ;
- suppressions propagées ;
- exports générés ;
- incidents privacy liés au process.

Aucun objectif chiffré n'est canonique avant pilote.

## 15. Faits manquants

- responsable de traitement ;
- contact privacy/DPO si applicable ;
- canal réel ;
- délais applicables ;
- bases juridiques finales ;
- durées finales ;
- providers réels ;
- règles d'effacement par table ;
- exceptions légales ;
- format export final ;
- mécanisme d'identité ;
- revue juridique.

## 16. Gate

- contrat de processus : **TERMINÉ**
- implémentation backend : **PREUVE MANQUANTE**
- canal public : **PREUVE MANQUANTE**
- règles table→droit : **LEGAL_REVIEW_REQUIRED**
- délais finaux : **LEGAL_REVIEW_REQUIRED**
- test réel end-to-end : **PREUVE MANQUANTE**

Aucune collecte, suppression production, provider ou texte juridique final n'est activé par ce document.
