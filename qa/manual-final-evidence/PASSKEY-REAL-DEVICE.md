# Preuve manuelle — Passkey réelle sur appareil WebAuthn

**Preview :** https://6f813d33.nova-forge-site-public.pages.dev  
**État avant test :** PREUVE MANQUANTE  
**Précondition :** un appareil/navigateur avec authentificateur WebAuthn réel (Windows Hello, téléphone compatible, clé de sécurité, etc.).

La configuration Provider DEV existe déjà ; cette preuve doit démontrer une vraie cérémonie appareil. Ne jamais simuler une passkey.

## Parcours minimal requis

### A. Enrôlement

1. Ouvrir `https://6f813d33.nova-forge-site-public.pages.dev/profiles.html`.
2. Démarrer le parcours de connexion/compte prévu par l'interface.
3. Si l'interface propose l'ajout d'une passkey, lancer l'enrôlement.
4. Accepter la demande WebAuthn sur l'appareil.
5. Vérifier que le retour sur MODARYX est réussi et que la session est active.
6. Capturer le résultat **sans afficher de secret, token ou information d'authentification sensible**.

### B. Reconnexion

1. Se déconnecter proprement.
2. Fermer l'onglet.
3. Rouvrir la Preview.
4. Relancer la connexion.
5. Utiliser la passkey réelle.
6. Confirmer l'accès au compte/profil attendu.

### C. Révocation

1. Ouvrir la gestion de sécurité/identifiants disponible pour le compte.
2. Révoquer/supprimer la passkey test.
3. Se déconnecter.
4. Vérifier que cette passkey ne permet plus la reconnexion.
5. Vérifier qu'une méthode de récupération autorisée reste disponible si le produit la prévoit.

## Si l'option passkey n'apparaît pas

Ne pas improviser. Noter :

- page exacte ;
- navigateur/appareil ;
- capture ;
- message affiché ;
- étape où le parcours s'arrête.

L'état reste **PREUVE MANQUANTE** tant que les trois phases ci-dessus ne sont pas réellement démontrées.

## Résultat attendu

- enrôlement réel accepté ;
- session valide après enrôlement ;
- reconnexion réelle par passkey ;
- révocation réelle ;
- passkey révoquée refusée ensuite ;
- aucun token/cookie secret exposé dans la preuve.

## Fichiers recommandés

`MODARYX-PASSKEY-03e4185/`

- `01-enrollement.png`
- `02-reconnexion.png`
- `03-revocation.png`
- `passkey-session.webm` si une vidéo est utilisée.

## À renvoyer

- appareil ;
- OS ;
- navigateur + version ;
- type d'authentificateur (Windows Hello / téléphone / clé physique, sans identifiant secret) ;
- résultat des trois phases ;
- captures/vidéo ;
- erreurs exactes éventuelles.
