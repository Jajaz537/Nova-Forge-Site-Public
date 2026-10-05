# MODARYX V2 — Contrat Trust, Provenance et Distribution

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Objectif

Rendre la confiance lisible sans transformer des signaux techniques en promesses absolues.

## 2. Provenance

États :

- verified
- declared-unattested
- unknown

Si verified :
- receipt requis ;
- source affichable si autorisée ;
- date de vérification.

## 3. Hash

SHA-256 peut prouver :
- identité de bytes ;
- comparaison exacte avec une empreinte attendue.

Il ne prouve pas :
- innocuité ;
- absence de malware ;
- qualité ;
- compatibilité.

## 4. Signature

Une signature valide prouve une relation cryptographique avec une clé/identité selon le système utilisé.

Elle ne prouve pas à elle seule :
- innocuité ;
- absence de comportement indésirable ;
- qualité.

## 5. Scan

Afficher uniquement si un scan réel existe.

États possibles :
- not-scanned
- scanning
- passed
- warning
- quarantined
- unavailable

Ne jamais afficher “safe” sans politique claire et preuve correspondante.

## 6. Auteur / identité

Distinguer :
- profil public ;
- identité créateur ;
- équipe ;
- statut vérifié ;
- rôle plateforme.

Un badge créateur n'accorde aucune autorité administrative.

## 7. Licence / droits

Afficher :
- licence ;
- redistribution ;
- modification ;
- dérivés ;
- crédits ;
- usage commercial si applicable.

Absence de licence ≠ permission.

## 8. Distribution

États :
- locked
- published
- withdrawn
- revoked

Règles :
- withdrawn/revoked = non downloadable ;
- stale manifest = distribution fail-closed si fraîcheur requise ;
- fichier sans hash/provenance requise = action bloquée.

## 9. Trust panel

Sur fiche contenu/release, un panneau compact peut afficher :
- provenance ;
- auteur ;
- licence ;
- hash ;
- scan si réel ;
- signature si réelle ;
- état distribution.

Chaque signal doit avoir :
- libellé ;
- explication courte ;
- détails accessibles.

## 10. Warnings

Warnings prioritaires :
- incompatibilité ;
- dépendance manquante ;
- provenance unknown ;
- distribution locked ;
- revoked ;
- scan warning/quarantine.

Ils doivent apparaître avant une action d'installation.

## 11. Offline / stale

En offline :
- données consultables si cache ;
- freshness visible ;
- aucune action sensible simulée ;
- téléchargement verrouillé si la preuve nécessaire n'est pas fraîche.

## 12. Audit trail

Pour les événements importants :
- publication ;
- retrait ;
- révocation ;
- modification de droits ;
- moderation state.

Conserver une trace si l'infrastructure le permet.

## 13. Accessibilité

- statuts textuels ;
- icônes accompagnées de labels ;
- couleur non exclusive ;
- tooltips non essentiels ;
- détails disponibles au clavier.

## 14. Critère high-fi

Avant high-fi :
- vocabulaire de confiance stabilisé ;
- limites hash/signature/scan documentées ;
- distribution states définis ;
- warning hierarchy définie ;
- mobile prévu.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
