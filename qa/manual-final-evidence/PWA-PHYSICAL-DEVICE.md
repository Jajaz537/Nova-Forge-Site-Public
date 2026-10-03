# Preuve manuelle — Installation PWA sur appareil physique

**Preview :** https://6f813d33.nova-forge-site-public.pages.dev  
**État avant test :** PREUVE MANQUANTE

## Appareil accepté

Téléphone/tablette Android ou iPhone/iPad réel. Utiliser le navigateur natif approprié :

- Android : Chrome/Edge compatible installation PWA.
- iOS/iPadOS : Safari, ajout à l'écran d'accueil.

## Procédure

1. Ouvrir `https://6f813d33.nova-forge-site-public.pages.dev` en HTTPS.
2. Vérifier qu'aucune erreur de certificat n'apparaît.
3. Installer la PWA / Ajouter à l'écran d'accueil.
4. Fermer le navigateur.
5. Lancer MODARYX depuis l'icône installée.
6. Vérifier que l'application s'ouvre correctement et que l'accueil est utilisable.
7. Naviguer vers Catalogue, Community, Profiles et Documentation.
8. Fermer puis relancer la PWA.
9. Couper temporairement le réseau.
10. Relancer ou naviguer dans une surface qui doit rester disponible hors ligne selon le comportement déjà prouvé automatiquement.
11. Rétablir le réseau.
12. Vérifier que l'application retrouve un état en ligne normal.
13. Désinstaller ensuite la PWA si désiré.

## Résultat attendu

- installation possible ;
- icône/lancement réel depuis l'écran d'accueil ;
- ouverture sans page blanche ;
- navigation principale fonctionnelle ;
- aucune confusion entre navigateur normal et PWA installée ;
- comportement offline/reconnexion cohérent avec le produit ;
- aucune donnée sensible exposée.

## Échec

- impossibilité d'installer alors que la plateforme le permet ;
- lancement sur écran blanc ;
- navigation cassée en standalone ;
- boucle d'installation ;
- PWA qui ne récupère pas après retour réseau ;
- contenu ou controls essentiels coupés.

## Preuve

Vidéo recommandée :

`pwa-install-launch-offline-online-<device>.mp4`

Captures minimales :

- option d'installation ;
- icône installée ;
- lancement standalone ;
- état offline ;
- état revenu online.

## À renvoyer

- appareil exact ;
- OS + version ;
- navigateur + version ;
- mode d'installation utilisé ;
- résultat ;
- vidéo/captures ;
- erreurs exactes éventuelles.
