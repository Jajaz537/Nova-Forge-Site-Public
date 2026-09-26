# MODARYX — provenance et droits des assets — 18 septembre 2026

Statut : **REVUE DE PROVENANCE INTERNE — NE CONSTITUE PAS UN AVIS JURIDIQUE**.

Objectif : classifier les assets réellement présents dans le candidat MODARYX, distinguer les éléments internes/générés/legacy des éventuels éléments tiers, et rendre explicites les preuves encore manquantes avant une VF officielle.

## Résumé

- Aucun asset Linear, Raycast, Vercel, Framer ou Stripe n’est importé dans le candidat ; ces produits sont documentés comme références de méthode/design uniquement.
- Aucune dépendance npm runtime tierce n’est déclarée dans `package.json`.
- Les deux grands visuels Loup/Dragon MODARYX sont documentés dans `qa/DESIGN-DECISIONS.md` comme produits via ImageGen à partir d’un pack de références fourni par l’utilisateur.
- Aucun média Rockstar / GTA VI / RDR2 n’a été importé dans le corpus hubs préparatoire.
- Les anciens assets `nova-*` sont des références historiques Nova Forge ; ils ne doivent pas être rebrandés en MODARYX ni supprimés globalement sans plan de compatibilité/provenance séparé.

## Classification des assets actuels

### Identité MODARYX

- `assets/modaryx-mark.svg`
- `assets/modaryx-mark-192.png`
- `assets/modaryx-mark-512.png`

Classification : **INTERNE / PROVENANCE DÉPÔT**.

Le SVG est un dessin vectoriel simple présent dans le dépôt ; les PNG sont ses dérivés rasterisés utilisés par la PWA. Aucun crédit ou source tierce n’est attaché à ces fichiers dans le dépôt.

Limite : cette revue établit la provenance technique observée dans le dépôt, pas la propriété intellectuelle au sens juridique.

### Illustrations Premium HD MODARYX

- `assets/modaryx-wolf-dragon-hero.webp`
- `assets/modaryx-world-portals.webp`

Classification : **GÉNÉRÉ — ORIGINE DOCUMENTÉE**.

`qa/DESIGN-DECISIONS.md` indique que les deux illustrations ont été produites via ImageGen intégré, à partir des références Loup/Dragon fournies par l’utilisateur, puis converties en WebP avec ImageMagick.

État :
- origine de production : **DOCUMENTÉE** ;
- utilisation dans la surface MODARYX : **CONFIRMÉE** ;
- droits indépendants du pack de références fourni : **PREUVE MANQUANTE** si une vérification juridique formelle est exigée.

Ne pas affirmer que la simple génération règle à elle seule tous les droits pouvant concerner les références amont.

### `assets/forge-field.svg`

Classification : **INTERNE / VECTORIEL LOCAL**.

Utilisation confirmée via la feuille Premium HD et présence dans le précache. Aucun asset externe incorporé ou crédit tiers n’est identifié dans la source SVG inspectée.

État : provenance technique interne **CONFIRMÉE**, validation juridique formelle **NON EFFECTUÉE**.

### Assets Nova Forge historiques

- `assets/nova-mark.svg`
- `assets/nova-mark-192.png`
- `assets/nova-mark-512.png`
- `assets/nova-kingdom-panorama.svg`

Classification : **LEGACY / PRODUIT DISTINCT NOVA FORGE**.

Ils appartiennent à l’historique technique et visuel Nova Forge. Ils ne doivent pas être renommés, supprimés ou réaffectés à MODARYX par remplacement global.

Dans les surfaces vérifiées du candidat, les anciens marks/panorama Nova ne sont pas listés dans le précache MODARYX. Leur présence dans le dépôt ne constitue pas une fusion des marques.

## Références externes de design

Les sources Linear, Raycast, Vercel, Framer et Stripe répertoriées dans `qa/DESIGN-DECISIONS.md` sont utilisées comme références de méthode et de finition.

Classification : **RÉFÉRENCE UNIQUEMENT**.

Aucun asset, logo, composition ou fichier provenant de ces services n’est revendiqué comme importé. La documentation existante interdit explicitement d’interpréter ces références comme une permission de copier leurs marques/assets.

## Jeux et marques tierces

Les noms GTA VI, Red Dead Redemption 2, Rockstar Games, PlayStation et Xbox apparaissent uniquement dans le corpus éditorial préparatoire et/ou les recherches documentaires.

Aucun média Rockstar ou fichier de jeu n’est ajouté dans ce lot.

État :
- facts/corpus officiel : **SOURCÉ** ;
- droits de médias tiers : **PREUVE MANQUANTE** ;
- partenariat/affiliation : **NON REVENDIQUÉ** ;
- compatibilité MODARYX ou disponibilité de mods : **NON REVENDIQUÉE**.

Toute future publication d’un hub doit continuer à privilégier les assets MODARYX internes tant qu’un droit explicite sur un média tiers n’est pas documenté.

## Dépendances

`package.json` ne déclare aucune dépendance ou devDependency npm. Les scripts utilisent Node/Python disponibles dans l’environnement de build.

État : **AUCUNE DÉPENDANCE NPM TIERCE DÉCLARÉE**.

Cette observation ne remplace pas :
- la revue des outils de CI externes ;
- la revue des GitHub Actions ;
- la revue des logiciels disponibles sur les runners ;
- la revue juridique des polices système rendues par le navigateur.

## Polices

Le candidat utilise des familles de police définies par CSS et rendues via les piles disponibles côté système/navigateur. Aucun fichier de police `.woff`, `.woff2`, `.ttf` ou `.otf` n’est présent parmi les assets du dépôt inspecté.

État : **AUCUN FICHIER DE POLICE À LICENCIER DANS LE DÉPÔT INSPECTÉ**.

## PREUVE MANQUANTE / reste juridique

La VF ne doit pas présenter cette revue comme une validation juridique complète. Restent notamment :

- droits/licence du pack de références Loup/Dragon fourni par l’utilisateur, si une preuve juridique formelle est nécessaire ;
- identité légale de l’éditeur/exploitant du site ;
- contact public ;
- contact sécurité ;
- mentions légales adaptées à la juridiction applicable ;
- décision éventuelle sur politique de confidentialité séparée, conditions d’utilisation ou autres notices requises ;
- validation des futurs médias tiers avant toute intégration dans les hubs jeux.

## Décision actuelle

La surface MODARYX actuelle ne contient aucun asset tiers identifié comme copié/importé depuis les références de design citées et n’intègre aucun média Rockstar dans le nouveau corpus hubs.

Le risque droits/assets est donc **RÉDUIT ET BORNÉ**, mais pas juridiquement fermé.

Statut recommandé :
- provenance technique des assets actuels : **TERMINÉE SUR LE PÉRIMÈTRE INSPECTÉ** ;
- validation juridique complète : **PREUVE MANQUANTE**.
