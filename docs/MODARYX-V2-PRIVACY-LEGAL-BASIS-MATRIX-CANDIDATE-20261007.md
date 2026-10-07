# MODARYX V2 — PRIVACY / LEGAL BASIS MATRIX — CANDIDATE — 2026-10-07

**Statut : EN COURS — bases juridiques candidates, aucune qualification finale**
**Précondition manquante : identité du responsable de traitement + finalités/configuration production finales**

## 1. Règle

Cette matrice prépare la revue RGPD. Les bases ci-dessous sont des **candidates à valider**, pas des conclusions juridiques.

Aucune durée de conservation n'est déclarée finale tant que les finalités, l'opérateur et les providers réels ne sont pas figés.

| Catégorie | Finalité candidate | Base candidate à étudier | État |
|---|---|---|---|
| Compte/profil | fournir compte, profil, préférences | contrat / mesures précontractuelles lorsque nécessaire | LEGAL_REVIEW_REQUIRED |
| Auth/session | login, session, sécurité compte | contrat + intérêt légitime sécurité selon traitement | LEGAL_REVIEW_REQUIRED |
| Créateur/équipe | publication, maintenance, rôles | contrat / CGU | LEGAL_REVIEW_REQUIRED |
| UGC/commentaires | publier/interagir | contrat / CGU | LEGAL_REVIEW_REQUIRED |
| Modération | règles, signalements, recours | contrat + obligation légale/intérêt légitime selon rôle | LEGAL_REVIEW_REQUIRED |
| Sécurité/anti-abus | fraude, bots, attaques | intérêt légitime / obligation légale selon cas | LEGAL_REVIEW_REQUIRED |
| Notifications opérationnelles | sécurité, publication, droits, support | contrat / intérêt légitime selon message | LEGAL_REVIEW_REQUIRED |
| Marketing | newsletter/offres | consentement lorsque requis | CANDIDATE |
| CWV/RUM | performance agrégée | consentement OU exemption si toutes conditions applicables sont remplies | PREUVE MANQUANTE |
| Historique propriétaire | audit/historique utilisateur | contrat / intérêt légitime selon fonction | LEGAL_REVIEW_REQUIRED |
| Droits éditeurs | preuve permissions/licences | intérêt légitime + défense de droits / obligations contractuelles | LEGAL_REVIEW_REQUIRED |
| Paiement | vente, facture, remboursement | contrat + obligations fiscales/légales | PROVIDER_MISSING |
| Support | répondre aux demandes | contrat / intérêt légitime | PROCESS_MISSING |

## 2. Cookies / traceurs

Principe P0 :
- strictement nécessaire : uniquement ce qui est indispensable et documenté ;
- analytics : OFF par défaut ;
- marketing : OFF par défaut ;
- publicité : OFF par défaut ;
- services tiers optionnels : OFF avant consentement si requis ;
- accepter/refuser avec une simplicité comparable ;
- retrait simple et accessible.

La CNIL rappelle qu'un traceur non strictement nécessaire doit pouvoir être refusé et que le refus doit être aussi facile que l'acceptation.

Une exemption de consentement pour mesure d'audience ne peut être utilisée que si l'implémentation satisfait réellement les conditions applicables.

## 3. Minimisation

À conserver :
- identifiants techniques nécessaires ;
- données fonctionnelles choisies par l'utilisateur ;
- traces de sécurité proportionnées ;
- preuves de droits strictement nécessaires.

À éviter :
- géolocalisation précise si inutile ;
- collecte cross-site/cross-device ;
- données publicitaires par défaut ;
- conservation indéfinie ;
- duplication brute des contacts éditeurs ;
- raw URLs/referrers inutiles dans RUM.

## 4. Droits utilisateur à concevoir

Avant production :
- information claire ;
- accès ;
- rectification ;
- suppression lorsque applicable ;
- export/portabilité lorsque applicable ;
- opposition lorsque applicable ;
- retrait du consentement ;
- gestion des comptes ;
- preuve du traitement de la demande.

## 5. Durées — méthode obligatoire

Pour chaque table/catégorie :
1. nécessité opérationnelle ;
2. obligation légale éventuelle ;
3. nécessité sécurité/audit ;
4. minimisation ;
5. règle de purge ;
6. anonymisation éventuelle ;
7. preuve d'exécution.

Valeurs exactes : **PREUVE MANQUANTE**.

## 6. Sous-traitants

Candidats connus :
- Auth0 ;
- Cloudflare Workers/Pages, D1, R2, Turnstile selon activation ;
- provider email/push à choisir ;
- paiement à choisir.

Avant production pour chacun :
- DPA ;
- rôles ;
- localisation/transferts ;
- sous-traitants ultérieurs ;
- rétention ;
- sécurité ;
- suppression/export.

## 7. Gate

La privacy notice finale reste BLOQUÉE jusqu'à :
- opérateur réel ;
- services production réels ;
- finalités finales ;
- bases validées ;
- durées ;
- providers/DPA ;
- droits/process ;
- cookie/CMP final si nécessaire.

## 8. Sources officielles revues le 2026-10-07

- CNIL — Cookies et traceurs : que dit la loi ?
- CNIL — FAQ cookies et autres traceurs
- RGPD / CNIL : principes de base à appliquer au traitement final

**État : MATRICE CANDIDATE TERMINÉE / VALIDATION JURIDIQUE PREUVE MANQUANTE.**
