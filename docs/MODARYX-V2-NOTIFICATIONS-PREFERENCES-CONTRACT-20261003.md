# MODARYX V2 — Contrat Notifications, Préférences et Paramètres

**Date : 2026-10-03**
**Statut : conception — aucun frontend V2 implémenté**

## 1. Principe

Les notifications doivent signaler un changement utile, pas créer du bruit.

Les préférences doivent être explicites, réversibles et cohérentes entre local et distant.

## 2. Types de notifications

### Contenu suivi
- nouvelle release ;
- changement de compatibilité ;
- contenu retiré/revoked ;
- dépendance devenue indisponible.

### Community
- réponse ;
- mention ;
- support ;
- changement de modération si concerné.

### Creator Studio
- release soumise ;
- validation échouée ;
- publication ;
- retrait ;
- appeal status ;
- rapport nécessitant attention.

### Profile / Loadout
- conflit ;
- dépendance manquante ;
- update disponible ;
- sync conflict.

## 3. Priorité

Niveaux :

- critique ;
- important ;
- normal ;
- silencieux.

Exemples :
- contenu revoked dans un profil = important/critique selon impact ;
- nouvelle release suivie = normal ;
- recommandation éditoriale = silencieux/optionnel.

## 4. Centre de notifications

Fonctions :
- non lues ;
- toutes ;
- filtres par type ;
- marquer lu ;
- action contextuelle ;
- date/heure.

Chaque notification doit pointer vers une vraie surface.

## 5. Canaux

Possibles selon infrastructure réelle :
- in-app ;
- email ;
- push.

Ne pas afficher un canal comme activable s'il n'est pas connecté.

## 6. Opt-in

Par défaut :
- notifications essentielles liées à sécurité/compte selon politique ;
- notifications produit optionnelles ;
- marketing séparé.

Les préférences utilisateur doivent être respectées.

## 7. Préférences locales

Peuvent rester dans localStorage :
- densité ;
- reduced effects ;
- ambiance ;
- jeux récemment consultés ;
- filtres récents si retenus.

Ne pas stocker de secret.

## 8. Préférences distantes

Nécessitent :
- compte réel ;
- backend ;
- contrat versionné ;
- gestion de conflit.

## 9. Paramètres

Sections proposées :

- Compte
- Profil
- Confidentialité
- Notifications
- Apparence
- Accessibilité
- Library
- Manager
- Données locales

## 10. Apparence

Préférences possibles :
- thème clair/sombre si retenu ;
- effets réduits ;
- ambiance vivante ;
- densité.

Ne pas exposer une multitude de réglages qui compensent un mauvais design par défaut.

## 11. Accessibilité

Préférences :
- reduced motion ;
- contraste renforcé si implémenté ;
- taille/densité si support réel.

Le produit doit rester accessible sans configuration spéciale.

## 12. Données locales

Prévoir une surface claire pour :
- favoris locaux ;
- saved searches ;
- brouillons ;
- collections locales ;
- profiles locaux ;
- migration legacy.

Actions destructrices :
- confirmation ;
- explication ;
- export si pertinent.

## 13. Sync conflicts

Si local et distant divergent :
- expliquer ;
- comparer ;
- choisir ;
- fusionner seulement si règle sûre.

Aucune écrasement automatique silencieux.

## 14. Offline

Le centre peut afficher les notifications déjà en cache avec état de fraîcheur.

Aucune notification distante ne doit être inventée.

## 15. Mobile

Les notifications importantes doivent rester accessibles sans monopoliser l'écran.

Badges :
- uniquement si nombre réel ;
- éviter les compteurs permanents anxiogènes.

## 16. Accessibilité

- liste structurée ;
- état lu/non lu textuel ;
- actions nommées ;
- focus maintenu ;
- pas de swipe-only pour supprimer.

## 17. Gate high-fi

Avant high-fi :
- types définis ;
- priorité définie ;
- canaux réels distingués ;
- paramètres structurés ;
- sync conflicts définis ;
- mobile défini.

**État : TERMINÉ pour le contrat produit / NON IMPLÉMENTÉ volontairement.**
