# MODARYX V2 — Contrat Modération, Signalements et Appels

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Principe

La modération est une capacité distincte :
- de la publication ;
- du support ;
- de l'identité créateur ;
- des permissions d'équipe.

## 2. Objets concernés

Peuvent être signalés selon contexte :
- contenu ;
- release ;
- fichier ;
- commentaire ;
- discussion ;
- profil public ;
- collection ;
- équipe/studio.

## 3. Signalement

Un signalement doit demander :
- raison ;
- contexte ;
- détail facultatif ;
- objet concerné.

Éviter les formulaires inutilement longs.

## 4. États

- received ;
- triaged ;
- under-review ;
- actioned ;
- no-action ;
- appealed ;
- closed.

Les états internes sensibles peuvent rester non publics.

## 5. Actions de modération

Selon permission réelle :
- hide ;
- restrict ;
- quarantine ;
- remove ;
- restore ;
- request-changes.

Aucune action destructive ne doit être disponible par simple contrôle client.

## 6. Appels

Un appel doit être :
- rattaché à une décision ;
- horodaté ;
- traçable ;
- traité séparément.

L'appel ne doit pas effacer la décision précédente.

## 7. Créateur

Le créateur doit pouvoir voir :
- état public pertinent ;
- raison partageable ;
- action possible ;
- possibilité d'appel si prévue.

Ne pas exposer de données internes inutiles.

## 8. Utilisateur signalant

Afficher :
- confirmation de réception ;
- pas de promesse de résultat ;
- état si la politique permet un suivi.

## 9. Séparation Support vs Report

Support :
- problème d'installation ;
- bug ;
- question.

Report :
- abus ;
- droits ;
- malware suspect ;
- contenu interdit ;
- usurpation ;
- autre violation.

La UI doit aider à choisir le bon canal.

## 10. Sécurité critique

Pour un signal urgent lié à distribution :
- capacité de quarantine ;
- distribution verrouillée ;
- état visible sur la fiche ;
- audit trail.

Pas de retrait silencieux sans trace opérationnelle.

## 11. Permissions

Rôles possibles côté plateforme :
- moderator ;
- appeals-reviewer ;
- administrator.

Le rôle est fourni par l'autorité serveur.

## 12. Audit trail

Pour chaque action :
- actor id serveur ;
- action ;
- target ;
- timestamp ;
- reason code ;
- état précédent ;
- état suivant.

Pas de secret dans les logs.

## 13. Mobile

Permettre :
- signalement ;
- suivi ;
- réponse à demande ;
- appel.

Les actions administratives lourdes peuvent rester desktop-first si nécessaire.

## 14. Accessibilité

- raisons clairement labellisées ;
- état textuel ;
- confirmation accessible ;
- focus sur erreur ;
- aucun statut uniquement par couleur.

## 15. Gate high-fi

Avant high-fi :
- report vs support séparé ;
- états définis ;
- appels définis ;
- permissions serveur définies ;
- quarantine/distribution reliées ;
- mobile prévu.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
