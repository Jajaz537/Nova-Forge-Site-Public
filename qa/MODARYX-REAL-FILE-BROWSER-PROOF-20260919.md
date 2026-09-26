# MODARYX — micro-preuve navigateur fichiers réels — 19 septembre 2026

Statut : **EN COURS — micro-preuve CI requise avant intégration**.

## But

Tester les parcours d'import/export avec de vrais fichiers présents sur le système de fichiers du runner, sans confondre cette preuve avec l'utilisation manuelle du sélecteur natif.

Périmètre :

- Vérificateur : fichier texte réel + SHA-256 attendu + correspondance exacte ;
- Communauté : export puis import d'une collection JSON réelle ;
- Communauté : export puis import d'une contribution JSON réelle ;
- Creator Studio : export puis import d'un manifeste JSON réel.

Le navigateur écrit réellement les exports dans un dossier de téléchargement du runner. Les imports sont affectés aux contrôles `<input type=file>` via Chrome DevTools Protocol, puis lus par le code produit.

Limite importante : le dialogue graphique natif de sélection de fichier n'est pas piloté. Cette preuve valide la lecture/écriture de vrais fichiers dans Chromium, pas l'UX du picker OS.

## Résultat réel

Workflow : **MODARYX Real File Browser Proof**  
Run : `35464233996`  
Conclusion : **success / PASS CIBLÉ**.

Parcours observés dans Chromium headless :

- Vérificateur : vrai fichier `verify-payload.txt`, SHA-256 calculé par Node puis comparé par l'outil web, résultat **Correspondance exacte** ;
- Communauté : export réel d'une collection JSON, lecture du fichier téléchargé, réimport du même fichier, restauration du brouillon ;
- Communauté : export réel d'un avis JSON, lecture du fichier téléchargé, réimport du même fichier, restauration du brouillon ;
- Creator Studio : export réel du manifeste JSON, contrôle `distribution.state=locked`, `downloadable=false`, `releaseReceipt=null`, puis réimport et restauration.

PR #32 fusionnée par `b2674dbc9cbfe6dc84fbd550bf5754e64c7e4640`.

### Limite

Les fichiers sont bien écrits et lus sur le système de fichiers du runner, mais Chrome DevTools Protocol affecte directement le fichier au contrôle `input[type=file]`. Le dialogue graphique natif du système d'exploitation n'est donc toujours pas une preuve acquise.

