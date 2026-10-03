# Preuve manuelle — Safari réel + VoiceOver

**Preview :** https://6f813d33.nova-forge-site-public.pages.dev  
**État avant test :** PREUVE MANQUANTE  
**Précondition :** Mac, iPhone ou iPad réel. WebKit Playwright ne remplace pas cette preuve.

## Safari réel — routes représentatives

- `index.html`
- `catalog.html`
- `search.html`
- `creator-studio.html`
- `community.html`
- `profiles.html`
- `documentation.html`
- `downloads.html`
- `games/index.html`
- `404.html`

### Vérifications Safari

- chargement complet ;
- aucune image cassée ;
- typographie stable ;
- navigation/menu ;
- formulaires ;
- scroll jusqu'au footer ;
- aucune superposition bloquante ;
- pas de défilement horizontal global ;
- interactions principales utilisables ;
- rotation portrait/paysage si iPhone/iPad.

## VoiceOver

1. Activer VoiceOver.
2. Ouvrir Accueil.
3. Vérifier le titre principal et les landmarks.
4. Parcourir les liens/boutons.
5. Vérifier le menu principal.
6. Faire la même chose sur Catalogue, Search, Community, Profiles et Creator Studio.
7. Tester un formulaire ou état interactif.
8. Noter mot pour mot toute annonce incohérente ou contrôle sans nom.

## Résultat attendu

Safari :
- rendu utilisable ;
- aucune casse spécifique Safari.

VoiceOver :
- ordre cohérent ;
- titres et contrôles annoncés ;
- navigation possible sans vue ;
- formulaires nommés ;
- aucun piège de focus.

## Preuve

Vidéo recommandée avec audio VoiceOver, ou enregistrement d'écran + rapport.

Noms :

- `safari-real-<device>.mp4`
- `voiceover-<device>.mp4`

## À renvoyer

- appareil ;
- version macOS/iOS/iPadOS ;
- version Safari ;
- routes testées ;
- résultat Safari ;
- résultat VoiceOver ;
- défauts exacts ;
- fichiers de preuve.
