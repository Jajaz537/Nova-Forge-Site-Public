# MODARYX — preuve Provider DEV passkey — 21 septembre 2026

Statut : **PREUVE APPAREIL MANQUANTE — configuration fournisseur DEV acquise, cérémonie WebAuthn réelle non démontrée**.

## Git vérifié par Work

- Branche : `design/modaryx-premium-hd-20260914-work`
- SHA vérifié avant intervention : `d0be675e86b51174b834f6764fbbce40f56b67a9`
- DEV uniquement.
- Aucun changement `main`, production, DNS/DNSSEC/nameserver.

## Résultat fournisseur réel

Work a vérifié et configuré le tenant Auth0 DEV comme suit :

- **Universal Login : activé** ;
- **Custom Login Page : désactivée** ;
- **Identifier First : activé** ;
- **Passkey : activée uniquement sur `Username-Password-Authentication`** ;
- parcours de récupération Auth0 disponible ;
- personnalisation incompatible avec le parcours retirée/désactivée ;
- configuration DEV finale saine ;
- aucune configuration temporaire restante.

## Point d'arrêt réel

La cérémonie WebAuthn n'a pas pu être exécutée dans le navigateur Work :

- authentificateur de plateforme non détecté ;
- aucun enrôlement passkey réel ;
- reconnexion passkey non testable ;
- révocation non testable sans passkey enrôlée.

État exact : **PREUVE APPAREIL MANQUANTE**.

Aucun enrôlement, succès de connexion ou révocation ne doit être déduit de la seule activation du fournisseur.

## Preuve finale requise sur appareil réel

Sur un appareil compatible WebAuthn/passkey :

1. ouvrir le flux Auth0 DEV MODARYX ;
2. enrôler une passkey avec l'authentificateur réel de l'appareil ;
3. fermer la session ;
4. se reconnecter réellement avec la passkey ;
5. vérifier le parcours de récupération ;
6. renommer la passkey si le fournisseur expose cette capacité ;
7. révoquer/supprimer la passkey ;
8. vérifier que la passkey révoquée n'est plus utilisable ;
9. consigner appareil, navigateur, date et résultat sans stocker de secret ni donnée biométrique.

La fermeture VF de cette lane exige cette preuve appareil réelle.
