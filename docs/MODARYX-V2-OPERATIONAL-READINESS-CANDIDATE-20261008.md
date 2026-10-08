# MODARYX V2 — operational readiness candidat — 2026-10-08

**État : EN COURS — exploitation réelle PREUVE MANQUANTE**

Ce registre complète la readiness technique/commerciale/juridique par ce qui manque souvent juste avant un lancement : **qui opère réellement le service quand quelque chose se passe**.

## 1. Support utilisateur

Avant lancement public, il faut un canal réel et vérifié pour :
- problème de compte ;
- bug ;
- installation/contenu ;
- plainte consommateur ;
- accessibilité ;
- paiement/refund si activé ;
- privacy/droits ;
- sécurité ;
- signalement/modération ;
- propriété intellectuelle.

Ne pas publier :
- adresse fictive ;
- téléphone fictif ;
- « support 24/7 » non opéré ;
- SLA de réponse non mesuré.

État : **PREUVE MANQUANTE**.

## 2. Fraude / abus

Threats candidats :
- takeover compte ;
- spam/bots ;
- upload malveillant ;
- malware ;
- fausse licence/provenance ;
- usurpation créateur ;
- manipulation notes/avis ;
- abuse du signalement ;
- refund/chargeback abuse si paiement ;
- abuse notifications.

Contrôles candidats :
- autorisation serveur ;
- moindre privilège ;
- rate limiting ;
- quarantine ;
- audit receipts ;
- revue manuelle à fort impact ;
- distribution fail-closed si preuve trust manquante.

Données fraude terrain : **PREUVE MANQUANTE**.

## 3. Modération opérationnelle

Le contrat produit existe déjà, mais il faut encore :
- propriétaire de file ;
- sévérité ;
- capacité réelle de moderator/appeals-reviewer ;
- modèle d'escalade juridique ;
- urgence ;
- IP/rights ;
- conservation de l'audit ;
- staffing/couverture.

État : **EN COURS / PREUVE MANQUANTE**.

## 4. Backup / restore / rollback

Règle : **un backup n'est pas prouvé tant qu'un restore n'a pas été testé**.

À prouver lorsque la production existe :
- sauvegarde D1 ;
- restore D1 ;
- stratégie R2 si activé ;
- récupération configuration/secrets ;
- rollback déploiement ;
- rollback/forward-fix migrations ;
- RPO/RTO réalistes ;
- exercice de restauration.

État : **PREUVE MANQUANTE**.

## 5. Monitoring / observability

Signaux candidats :
- disponibilité / erreurs ;
- auth failures ;
- exceptions ;
- D1/R2/provider failures ;
- delivery notifications ;
- files/modération ;
- rate-limit/security ;
- budget/coût ;
- CWV terrain seulement lorsqu'activé légalement.

Le monitoring ne doit pas devenir de l'analytics marketing silencieux.

État : **PREUVE MANQUANTE** pour production.

## 6. Incident response

La procédure privacy/breach existe séparément.

Le runbook technique doit ajouter :
- sévérité ;
- owner/escalade ;
- containment ;
- rollback ;
- préservation de preuve ;
- communication status si appropriée ;
- branche privacy/juridique si données personnelles ;
- postmortem.

Aucune astreinte réelle n'est inventée.

## 7. Release operations

Chaque release production devrait avoir :
- owner ;
- SHA/build ;
- changelog ;
- receipt ;
- rollback point ;
- smoke tests ;
- sécurité/accessibilité ;
- support brief ;
- known issues ;
- décision promotion/cutover explicite.

Le cutover reste interdit sans autorisation explicite.

## 8. Gate launch

Toujours **PREUVE MANQUANTE** :
- canal support réel ;
- ownership support ;
- ownership fraude/abus ;
- staffing modération ;
- restore testé ;
- rollback testé ;
- monitoring production ;
- escalade incident ;
- release owner.

Aucune production, provider, paiement, DNS ou cutover n'est activé par ce document.
