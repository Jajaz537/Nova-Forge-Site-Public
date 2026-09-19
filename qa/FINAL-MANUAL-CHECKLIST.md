# MODARYX — checklist manuelle de clôture VF

Statut : **CANDIDAT VF — PREUVES EXTERNES RESTANTES**.  
Cible : preview immuable du candidat, jamais `main` ni la production. Noter pour chaque essai : date, URL, SHA si prouvé, appareil/OS/navigateur et version. Une case reste `PREUVE MANQUANTE` tant que sa preuve n'est pas jointe.

| # | Test | Action minimale | PASS attendu | Preuve minimale | Blocage actuel |
|---:|---|---|---|---|---|
| 1 | Lecteur d'écran natif | Avec NVDA + Firefox/Edge ou VoiceOver + Safari, parcourir Accueil, Catalogue, Studio, Communauté, Sécurité puis landmarks, titres, menu, CTA, formulaires/erreurs et footer sans souris. | Ordre logique ; nom, rôle et état compréhensibles ; aucune action essentielle muette ; annonces dynamiques utiles. | Vidéo courte ou journal horodaté avec lecteur/OS/navigateur et résultats par parcours. | Lecteur d'écran et OS natifs indisponibles dans Work. |
| 2 | Zoom/reflow 200 % | Régler le zoom **natif** à 200 %, puis vérifier les cinq pages critiques, menu ouvert, CTA et formulaires. | Aucun contenu/action perdu, superposé ou coupé ; navigation utilisable ; aucun scroll horizontal hors contenu intrinsèquement bidimensionnel. | Captures haut/milieu/bas d'au moins une page riche + résultat des cinq pages et version navigateur. | Zoom natif non démontrable fidèlement dans Work. |
| 3 | Zoom/reflow 400 % | Répéter le test précédent à **400 %** ; utiliser le défilement vertical et le menu compact. | Même exigence ; lecture et focus restent ordonnés, sans défilement bidimensionnel injustifié. | Captures du menu, d'un formulaire et d'une section riche + journal des cinq pages. | Zoom natif non démontrable fidèlement dans Work. |
| 4 | Firefox réel | Sur Firefox stable, ouvrir Accueil, Catalogue, Studio, Communauté, Écosystème et Sécurité ; tester menu, recherche/filtre, formulaires, stockage/export et console. | Parité fonctionnelle et visuelle ; aucune erreur console bloquante ni parcours cassé. | Version Firefox + captures des six pages + journal des actions et erreurs éventuelles. | Firefox absent de Work. |
| 5 | Safari réel | Sur Safari macOS/iOS, vérifier les six pages, menu/sticky, flex/grid, gradients/filtres, motion réduite, formulaires et viewport mobile/safe areas. | Aucun défaut bloquant de rendu, focus, toucher, formulaire ou animation. | Version macOS/iOS/Safari + captures desktop/mobile et journal ciblé. | Safari et environnement Apple absents de Work. |
| 6 | Smartphone physique | Sur iPhone/Safari ou Android/Chrome, tester portrait/paysage, toucher, scroll, menu, CTA, formulaire, clavier virtuel et retour arrière. | Cibles atteignables, pas de chevauchement/clipping, clavier non bloquant, parcours conservé. | Modèle/OS/navigateur + vidéo courte ou captures portrait/paysage. | Aucun téléphone physique pilotable dans Work. |
| 7 | Tablette physique | Si disponible, tester portrait/paysage, navigation, grilles, formulaires, toucher et rotation. | Mise en page stable ; aucune action masquée ni cible impraticable. | Modèle/OS/navigateur + captures des deux orientations. | Aucune tablette physique pilotable dans Work. |
| 8 | PWA hors ligne réel | Ouvrir la preview HTTPS, attendre l'activation du worker, contrôler Cache Storage, passer réellement hors ligne, recharger et parcourir les routes prévues puis revenir en ligne. | Routes/assets annoncés disponibles ; ressource absente traitée explicitement ; reconnexion sans blocage ni donnée présentée comme fraîche à tort. | Captures Application/Service Worker + Cache Storage + pages hors ligne/en ligne, URL et version du cache. | Contrôle réseau hors ligne réel indisponible dans Work. |
| 9 | Mise à jour PWA réelle | Sur une branche de test, charger une version A, publier une version B identifiable, observer installation/activation, recharger puis contrôler l'ancien cache. | B devient active sans ancienne version servie indéfiniment ; caches MODARYX obsolètes nettoyés, autres caches préservés. | URLs et SHA prouvés de A/B + captures états worker/caches + résultat après rechargement. | Nécessite deux déploiements contrôlés ; aucune promotion production. |
| 10 | Core Web Vitals représentatifs | Sur URL stable, exécuter au moins 3 navigations froides mobile et desktop et des interactions réelles ; séparer lab et field/RUM. Relever LCP, CLS et INP, médiane et dispersion. | Budgets projet acceptés ou écarts documentés ; aucune substitution par Navigation Timing. | Export Lighthouse/trace ou RUM, profils réseau/appareil, versions, trois mesures et médiane. | Profiler/CWV représentatifs indisponibles dans Work ; données terrain non disponibles. |

## Complément fonctionnel déjà tracé

Si l'import/export reste dans le périmètre du candidat, exécuter aussi avec un vrai sélecteur et un vrai dossier : importer un JSON valide puis invalide, exporter Studio et Communauté, ouvrir les fichiers reçus et vérifier nom, encodage, schéma, messages accessibles et conservation du brouillon. Joindre les fichiers témoins non sensibles et une capture du résultat. Statut actuel : **PREUVE MANQUANTE**.

## Règle de consignation

Pour chaque ligne, inscrire uniquement `PASS`, `FAIL` ou `BLOQUÉ`, avec lien vers la preuve. Un `FAIL` déclenche : erreur exacte → isolation → correction ciblée → micro-test de cette seule ligne. Aucun full replay.

## Garde-fous de sortie non couverts par les tests appareil

Ces points ne se ferment pas par un screenshot de navigateur et doivent être traités séparément avant une déclaration VF officielle.

| Sujet | État actuel | Condition de fermeture |
|---|---|---|
| Provenance technique des assets actuels | TERMINÉ sur le périmètre inspecté | Conserver `qa/ASSET-RIGHTS-PROVENANCE-20260918.md` attaché au candidat. |
| Validation juridique complète des assets/références | PREUVE MANQUANTE | Confirmer les droits nécessaires sur les références amont lorsque cette preuve est requise ; ne pas déduire la propriété juridique de la seule génération ImageGen. |
| Identité de l’éditeur/exploitant, contact public, contact sécurité, mentions légales | PREUVE MANQUANTE | Fournir les données réelles et décider les notices applicables. Ne rien inventer dans le site. |
| `/.well-known/security.txt` | PREUVE MANQUANTE | Publier uniquement lorsqu’un contact sécurité réel est validé. |
| Historique Git complet des secrets | PREUVE MANQUANTE | Exécuter un contrôle historique adapté ; la recherche du dépôt courant ne suffit pas. |
| CI/CD Cloudflare protégé | PLAN TERMINÉ / APPLICATION BLOQUÉE | Appliquer le plan `qa/CI-CD-HARDENING-PLAN-20260918.md` uniquement avec autorisation explicite, puis micro-prouver les chemins non mutatifs. |
| SEO `/games/` canonical | TERMINÉ | Canonical explicite présent et générateur synchronisé. |
| SEO `/games/` dans `sitemap.xml` | EN COURS / FICHIER PROTÉGÉ | Modifier uniquement dans un lot dédié compatible avec le baseline protégé ; ne pas neutraliser le harnais. |
| Périmètre produit historique | EN COURS | Décider explicitement si la VF signifie « surface publique actuelle » ou « toutes les capacités historiques retenues » ; aucune réduction implicite. |
| Hubs GTA VI / RDR2 | CORPUS INITIAL SOURCÉ / NON PUBLIÉ | Droits médias, catégories/profondeur éditoriale et contenu substantiel réel avant publication. |
| Comptes/profils, publication/modération, Resolver/Repair, distribution réelle, Guide/pont OS | NON LIVRÉ | Nécessitent services/données/artefacts/décisions réels ; un schéma ou un état indisponible ne vaut pas livraison. |
| Master Nova Design Intelligence complète | NON RÉCUPÉRÉE | Ne pas inventer la liste manquante ; conserver le statut PREUVE MANQUANTE. |

### Règle de décision VF

La checklist appareil peut être entièrement verte sans que ces garde-fous soient automatiquement fermés.

Avant toute déclaration **VF Premium HD**, consolider séparément :

1. preuves externes appareil/navigateur ;
2. garde-fous sécurité, légal et provenance ;
3. décision explicite de périmètre produit ;
4. état Git/PR exact du candidat ;
5. absence de blocker critique/haut confirmé.

Une preuve absente reste `PREUVE MANQUANTE`; une décision produit non prise ne doit pas être transformée en PASS.

