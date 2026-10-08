# MODARYX V2 — procédure incident sécurité / violation de données — candidat — 2026-10-08

**État : EN COURS — validation privacy/juridique et exercice end-to-end PREUVE MANQUANTE**

## Base officielle revue

La CNIL rappelle qu'une violation de données doit être documentée en interne. Lorsqu'elle présente un risque pour les droits et libertés, une notification à l'autorité peut être requise dans les meilleurs délais et, si possible, au plus tard dans les 72 heures après prise de connaissance ; en cas de risque élevé, une information des personnes peut également être requise.

Références officielles revues le 2026-10-08 :
- CNIL — Violations de données personnelles : les règles à suivre ;
- CNIL — Notifier une violation de données personnelles ;
- RGPD article 33.

**L'applicabilité concrète, le niveau de risque, le point de départ du délai, les exceptions et le contenu final des notifications restent PREUVE MANQUANTE — validation privacy/juridique requise.**

## Processus opérationnel candidat

### 1. Détection

Créer immédiatement un `incidentId` et enregistrer :
- heure de détection ;
- source du signal ;
- systèmes potentiellement touchés ;
- propriétaire de l'investigation ;
- état personnel-data : oui / non / inconnu.

Ne pas attendre la qualification juridique pour contenir un incident actif.

### 2. Containment

Selon le cas :
- couper le chemin d'exposition ;
- révoquer/rotater secrets ou sessions affectés ;
- préserver les journaux et preuves ;
- empêcher de nouveaux accès ;
- ne pas effacer les éléments nécessaires à l'investigation.

### 3. Qualification

Évaluer séparément :
- confidentialité ;
- intégrité ;
- disponibilité ;
- catégories de données ;
- nombre approximatif de personnes/enregistrements ;
- sensibilité ;
- facilité d'identification ;
- conséquences plausibles ;
- portée fournisseur/sous-traitant ;
- durée de l'exposition.

### 4. Décision privacy/juridique

Documenter :
- heure de « prise de connaissance » candidate ;
- responsable/opérateur concerné ;
- reviewer privacy/juridique ;
- niveau de risque retenu ;
- décision de notification à l'autorité ;
- décision d'information des personnes ;
- justification.

Aucune notification automatique n'est activée par ce processus.

### 5. Notifications si requises

Conserver les reçus de preuve :
- autorité ;
- personnes concernées ;
- provider/sous-traitant/controller lorsque requis.

Les communications doivent être minimisées, factuelles et ne pas exposer de secrets techniques inutiles.

### 6. Récupération

Prouver :
- correction ciblée ;
- restauration/rollback ;
- rotation éventuelle ;
- monitoring post-incident ;
- mesures de protection utilisateur si nécessaires.

### 7. Postmortem

Conserver :
- cause racine ;
- chronologie ;
- décisions ;
- actions correctives ;
- responsables et échéances ;
- modifications security/privacy ;
- raison de clôture.

## Gate avant lancement

PREUVE MANQUANTE :
- identité du responsable de traitement ;
- point de contact privacy/DPO ou équivalent ;
- astreinte/escalade ;
- clauses incident providers ;
- procédure de notification autorité adaptée au territoire ;
- template utilisateur ;
- exercice tabletop end-to-end ;
- preuve que le registre incident peut être produit/exporté de façon sécurisée.

Aucune production, notification réelle, suppression de données ou provider n'est activé par ce document.
