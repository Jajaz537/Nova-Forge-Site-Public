# MODARYX V2 — Fermeture des dépendances entrantes legacy

**Date : 2026-10-03**
**Statut : TERMINÉ — première fermeture opérationnelle avant guard CI**

## 1. Objectif

Identifier les dépendances entrantes capables de réintroduire la V1 dans un futur runtime V2.

## 2. Chaîne critique shell / Service Worker

### `assets/shell.js`

Chargé par les 23 pages publiques V1 auditée.

Il enregistre :

`sw.js`

### `sw.js`

Le Service Worker historique connaît explicitement :

- les pages V1 ;
- les routes projet V1 ;
- les hubs V1 ;
- les CSS/JS legacy ;
- les données V1.

Il précache notamment des styles/scripts historiques et peut reprendre le contrôle via :

- `skipWaiting()`
- `clients.claim()`

### Conclusion

**Toute page V2 servie sous le même scope sans isolation SW serait exposée à contamination/cache legacy.**

## 3. Chaîne living-world

### `assets/living-world.js`

Référence :

- `data/living-world.json`
- `assets/living-world-visual-growth.mjs`

### `assets/living-world-visual-growth.mjs`

Injecte dynamiquement :

- `assets/living-world-visual-growth.css`

et attend encore des sélecteurs DOM legacy :
- `.modaryx-realm-hero`
- `.modaryx-realm-art`

### Conclusion

Le modèle temporel/états peut être extrait.
Le runtime DOM/renderer historique est **à bloquer**.

## 4. Chaîne recherche

### `assets/search.js`

Consomme :

- `data/search-index.json`

Ce search-index contient routes/pages/projets V1.

### Conclusion

Le moteur local-first est réutilisable conceptuellement.
Le fichier `search.js` + index V1 ne doivent pas être importés.

## 5. Chaîne project hub

### `assets/project-hub.js`

Consomme :

- `data/catalog.json`
- `data/compatibility-graph.json`

Ces datasets sont explicitement de démonstration / V1.

### Conclusion

Le renderer est legacy.
Les données servent de fixture historique uniquement.

## 6. Catalogue / community / app

Les scripts historiques dépendent du catalogue V1 de démonstration :

- `assets/app.js`
- `assets/catalog.js`
- `assets/community.js`

### Conclusion

La logique utile doit être extraite en modules purs.
Aucun de ces scripts ne doit être chargé tel quel.

## 7. CSS vers assets legacy

Les CSS historiques référencent directement des visuels monde/realm, notamment :

- `modaryx-wolf-dragon-hero.webp`
- `modaryx-world-portals.webp`
- `modaryx-realm-vista-reduced.webp`
- `forge-field.svg`

Le fichier `modaryx-home-finishline.css` référence aussi plusieurs feuilles historiques.

### Conclusion

Importer un ancien CSS pourrait réintroduire automatiquement :
- anciens visuels ;
- anciens tokens ;
- ancien layout ;
- anciennes couches de marque.

## 8. Build / QA entrant

### `package.json`

Le pipeline actuel appelle :

- `qa/build-games-index.py`
- `qa/check-site.py`
- `qa/run-final-source-validation.py`

### Conclusion

Un futur `npm run build` V2 ne doit pas réutiliser le pipeline racine actuel sans séparation.

## 9. Manifest / sitemap / status

### `site.webmanifest`

Contient des shortcuts V1.

### `sitemap.xml`

Liste les routes V1/hubs actuels.

### `public-status.json`

Décrit le runtime/statut V1.

### `public-build.json`

Décrit un candidat historique.

### Conclusion

Ils doivent avoir des équivalents V2 dédiés.

## 10. Domaine historique

`domain-cutover.json` référence encore :

`getnovaforge.com`

### Conclusion

**Blacklist stricte MODARYX V2.**

Aucun outil V2 ne doit lire ce fichier pour déterminer le domaine courant.

## 11. Assets identité

Les assets Nova historiques ne sont pas actuellement nécessaires au produit MODARYX V2 :

- `nova-mark*`
- `nova-kingdom-panorama.svg`

### Conclusion

Blacklist d'import V2.

## 12. Assets living-world présents mais non activés

Les 10 couches compagnons + l'environnement existent physiquement.

Mais `data/living-world.json` reste à :
- `awaiting-assets`
- paths null.

### Conclusion

Leur présence physique ne vaut pas autorisation d'import.

## 13. Fermeture des dépendances critiques

| Source legacy | Dépendance | Risque | Action V2 |
|---|---|---|---|
| shell.js | sw.js | reprise de contrôle/cache | BLOQUER |
| sw.js | pages/CSS/JS V1 | contamination runtime | REMPLACER |
| living-world.js | visual-growth.mjs | renderer DOM V1 | EXTRAIRE logique |
| visual-growth.mjs | visual-growth.css | style legacy injecté | BLOQUER |
| search.js | search-index.json | routes V1 | RECONSTRUIRE |
| project-hub.js | catalog + compatibility | demo/V1 | FIXTURES seulement |
| app/catalog/community | catalog.json | demo/V1 | EXTRAIRE |
| CSS finishline/cinematic | assets realm | retour identité V1 | BLOQUER |
| package.json | build/checks V1 | validation mauvaise architecture | PIPELINE V2 séparé |
| site.webmanifest | shortcuts V1 | navigation V1 | MANIFEST V2 |
| sitemap.xml | routes V1 | SEO V1 | SITEMAP V2 |
| domain-cutover.json | getnovaforge.com | mauvaise cible domaine | BLOQUER |

## 14. État

- dépendances entrantes critiques : **TERMINÉ**
- couverture dépôt : **TERMINÉ — 525/525**
- blacklist : **TERMINÉ — draft opérationnel**
- allowlist machine-readable : **À CRÉER**
- guard CI : **À CRÉER**
- frontend V2 : **BLOQUÉ volontairement**

