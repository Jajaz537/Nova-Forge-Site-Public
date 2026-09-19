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
