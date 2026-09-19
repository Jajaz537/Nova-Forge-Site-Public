# Contrat du contrôle cache — 19 septembre 2026

**BLOQUÉ / PREUVE MANQUANTE.** `qa/check-cache.mjs` attend un dossier externe frère du dépôt, exactement `../site-baseline`. Le script ne crée pas ce dossier et ne fournit aucune commande pour le générer.

Le contrat observé est le suivant :

- `_headers`, `_redirects`, `domain-cutover.json`, `robots.txt`, `sitemap.xml` et tous les fichiers `.github/**` sont comparés octet par octet avec leurs homologues dans `site-baseline` ;
- `site.webmanifest` est comparé comme JSON après retrait du seul champ `description` ;
- une absence de fichier ou une différence fait échouer le contrôle.

La dépendance apparaît dès l'introduction du script au commit `65fdb22940668b911995e10e696a3fca9d8a5cc6`. L'historique Git, la documentation QA et les dossiers frères disponibles ne désignent aucun commit, archive ou répertoire comme source canonique de `site-baseline`. Des résultats historiques réussis prouvent seulement qu'un instantané externe avait été présent lors d'exécutions antérieures ; ils ne permettent pas de le reconstruire fidèlement.

**Recommandation non appliquée :** fournir ou monter l'instantané canonique d'origine au chemin attendu, avec sa provenance et le commit qu'il représente, puis exécuter une seule fois `node qa/check-cache.mjs`. Copier le HEAD, une autre copie du site ou un commit choisi arbitrairement créerait une preuve circulaire ou modifierait le contrat ; aucune de ces options n'a été utilisée.

