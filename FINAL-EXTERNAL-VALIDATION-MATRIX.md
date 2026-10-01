# MODARYX — FINAL EXTERNAL VALIDATION MATRIX

> **RÈGLE DE LECTURE COURANTE — 21 septembre 2026 :** ce fichier conserve la matrice historique créée le 16 septembre et ses réconciliations successives. Pour l’état opérationnel actuel, lire d’abord `CHECKPOINT-CANONIQUE-MODARYX-2026-09-21.md` et `qa/MODARYX-ANTI-OUBLI-CURRENT-20260920.md`, puis vérifier Git frais. Les mentions historiques « 17 pages », « comptes/backend absents », « Firefox non prouvé » ou « PWA HTTPS non prouvée » ne doivent pas être réinterprétées comme l’état courant lorsqu’une section plus récente les supersède.

Date de consolidation : 16 septembre 2026.  
Statut cible avant fermeture de cette matrice : **VF TECHNICALLY MAXIMAL CANDIDATE**.  
Cette matrice ne transforme aucune validation non exécutée en PASS.

| Élément | Raison du blocage | Prérequis | Procédure exacte de validation | Résultat attendu | Sévérité | Bloque VF officielle |
|---|---|---|---|---|---|---|
| Lecteur d’écran Windows | Aucun lecteur d’écran natif disponible dans l’environnement de recette | Windows 11, NVDA stable et Edge/Firefox | Parcourir les 17 pages sans souris ; vérifier titre, régions, liens d’évitement, menus, formulaires, erreurs, statuts live, FAQ et nom du sélecteur de fichier | Ordre et annonces compréhensibles, aucune action essentielle muette ou répétée | Haute | Oui |
| VoiceOver macOS/iOS | macOS/iOS et VoiceOver indisponibles | Mac et iPhone/iPad supportés | Rejouer les parcours Catalogue, Recherche, Studio, Communauté, Vérification et Téléchargements avec VoiceOver | Navigation cohérente, rotor exploitable, contrôles et erreurs correctement annoncés | Haute | Oui |
| Zoom natif 200 % et 400 % | Le raccourci de zoom n’a produit aucun changement mesurable dans le navigateur distant | Chrome, Edge et Firefox installés localement | Pour chaque page : zoom 200 %, puis 400 % ; vérifier reflow, contenu, focus, menus et absence de défilement bidimensionnel hors exceptions autorisées | Aucun contenu/action perdu ; lecture et ordre conservés | Haute | Oui |
| Appareils tactiles physiques | Aucun téléphone ni tablette physique pilotable | Android et iOS, petit/grand mobile, tablette portrait/paysage | Tester navigation, formulaires, clavier virtuel, rotation, cibles tactiles, scroll, PWA et reprise | Aucun chevauchement, perte de focus, cible inaccessible ou blocage par clavier virtuel | Haute | Oui |
| Firefox et Safari réels | Seul Chromium est disponible dans la recette actuelle | Versions supportées de Firefox et Safari | Ouvrir les 17 pages, rejouer les parcours principaux et vérifier CSS, stockage, Web Crypto et service worker | Parité fonctionnelle et visuelle dans les limites documentées | Haute | Oui |
| Core Web Vitals représentatifs | Navigation Timing et tailles statiques ne sont pas des LCP/CLS/INP terrain | URL de préproduction stable, profils réseau/appareil définis, Lighthouse/DevTools et collecte RUM consentie si retenue | Mesurer plusieurs navigations froides/chaudes sur mobile et desktop ; conserver médiane, dispersion et environnement | Budgets validés sans masquer une régression fonctionnelle ou accessible | Haute | Oui |
| Cycle PWA hors ligne | Un worker actif et les simulations source ne prouvent pas la déconnexion réelle | HTTPS stable, DevTools avec réseau contrôlé et stockage inspectable | Première visite, installation du worker, recharge, déconnexion, navigation autorisée, ressource absente, reconnexion, publication d’une nouvelle version et activation | Hors ligne borné, aucune ancienne version servie indéfiniment, récupération et mise à jour explicables | Haute | Oui |
| Sélection/import de fichiers | L’autorisation de sélection a été refusée par le navigateur distant | Navigateur autorisant un fichier témoin non sensible | Importer un manifeste valide puis invalide dans Studio/Communauté ; interrompre une lecture, modifier le brouillon et réessayer | Aucun brouillon récent écrasé ; erreurs et succès annoncés ; fichier jamais envoyé | Haute | Oui |
| Réception des exports | La génération a été testée, pas la présence effective sur le système utilisateur | Navigateur et dossier de téléchargement observables | Exporter Studio et Communauté ; ouvrir le JSON reçu, valider encodage, schéma et nom ; provoquer un refus de téléchargement | Fichier exact reçu ou erreur explicite sans perte du brouillon | Moyenne | Oui |
| Comptes et profils publics | Backend d’identité, politiques de récupération et sessions absents | Décisions produit/sécurité, backend, stockage, politique de données et environnement de test | Implémenter puis tester inscription, connexion, récupération, révocation, réauthentification et édition publique | Séparation profil/identité, moindre privilège, aucune clé privée exposée | Critique | Oui |
| Publication et modération | API, règles d’abus, équipe/processus et stockage distant absents | Service de publication, politique, rôles, journal d’audit et voies d’appel | Tester brouillon → soumission → contrôle → décision → appel → export des reçus | États traçables, refus sûrs, brouillon préservé, permissions respectées | Critique | Oui |
| Artefacts téléchargeables et signatures | Aucun binaire autorisé, signé et accompagné de preuves | Artefact, droits, manifeste, SHA-256, provenance, signature et canal de publication | Publier sur un canal test, vérifier identité/empreinte/signature, retrait, révocation et rollback | Seuls les artefacts complets et autorisés deviennent téléchargeables | Critique | Oui |
| Hubs GTA 6 / RDR2 | Corpus substantiel, droits des médias et décisions éditoriales non fournis | Sources actuelles, rédaction originale, droits documentés, catégories approuvées | Revue éditoriale/juridique, publication test, contrôle SEO/accessibilité/responsive et vérification de toutes les affirmations | Pages utiles, sourcées, sans compatibilité ni partenariat inventé | Haute | Oui |
| Guide connecté et pont Nova Forge OS | Services et protocole d’intégration inexistants | Contrat fonctionnel, protocole local, consentement, modèle de permissions et jeux de test | Tester absence, détection, consentement, refus, déconnexion, version incompatible et données minimales échangées | MODARYX reste autonome ; aucune session ou donnée partagée implicitement | Haute | Oui |
| Storage Resolver / Repair Network | Aucun stockage autorisé ni service de résolution | Origines, manifestes signés, politiques de cache, service et données de test | Tester copie exacte, absence, empreinte divergente, artefact révoqué, panne partielle et reprise | Aucune substitution silencieuse ; seuls identité et digest exacts permettent la récupération | Critique | Oui |
| Droits et licences des assets/contenus | La recette technique ne remplace pas une validation juridique | Inventaire des auteurs, licences et autorisations | Associer chaque asset et corpus à une preuve de droit ; faire approuver les usages et retraits | Zéro asset ou contenu publié sans droit documenté | Critique | Oui |
| Master Nova Design Intelligence complète | Le référentiel complet de 46+ entrées n’a pas été récupéré dans ce dépôt | Dernière Master NDI et décisions historiques associées | Comparer chaque décision explicitement retenue au registre anti-oubli ; mapper intégré/existant/manquant | Aucun élément retenu ne disparaît silencieusement | Haute | Oui |

## Règles de clôture

- Une ligne ne passe à **PASS** qu’avec date, environnement, preuve et résultat reproductible.
- Un test simulé ou automatisé peut préparer une ligne, mais ne remplace jamais la validation externe décrite.
- Toute réduction du périmètre officiel exige une décision produit écrite ; elle ne peut pas être déduite de l’absence de données ou de service.
- DNS, DNSSEC, nameservers, IONOS et configuration Cloudflare critique restent hors de cette matrice et inchangés.

## Réconciliation après micro-preuves intégrées — 19 septembre 2026

Cette section actualise la portée des lignes ci-dessus sans réécrire leur historique.

### Couverture maintenant acquise

- **PWA Chromium loopback — TERMINÉ sur ce périmètre** : installation du worker, contrôle de page, offline/recovery, update A→B, nettoyage de l'ancien cache et installabilité Chromium sont couverts par les runs `35464233996`, `35465473185` et `35469301347`.
- **Imports/exports avec vrais fichiers — TERMINÉ sur ce périmètre** : Vérificateur, Communauté et Creator Studio lisent/écrivent de vrais fichiers du runner en Chromium ; run `35464233996`.
- **Accessibilité structurelle/browser Chromium — TERMINÉ sur ce périmètre** : 17 pages, arbre AX, labels, alt, skip-link et premier parcours clavier ; run `35465685575`.
- **Reflow Chromium — TERMINÉ sur les largeurs ciblées** : 17 pages × 320/400/768/1440, 68 navigations ; run `35463591149`.
- **Performance laboratoire — TERMINÉ sur 5 pages × 2 profils** : budgets labo respectés ; run `35466565740`.

### Lignes restant réellement externes

Les éléments suivants restent **PREUVE MANQUANTE** et continuent à bloquer une VF officielle :

- lecteur d'écran natif Windows et VoiceOver ;
- zoom navigateur natif 200/400 % réellement mesuré ;
- appareils tactiles physiques ;
- Safari/Firefox réels sur les parcours finaux ;
- CWV représentatifs sur une URL HTTPS stable ;
- installation PWA manuelle et cycle sur preview HTTPS publique/appareil physique ;
- dialogue graphique natif du sélecteur de fichier ;
- droits/licences et informations légales finales ;
- services produit réellement absents : comptes, publication/modération, artefacts, Guide connecté, OS Bridge, Resolver/Repair ;
- corpus/droits substantiels des hubs retenus ;
- Master NDI complète non récupérée.

Les preuves automatisées intégrées réduisent le risque mais ne doivent pas être requalifiées en preuves natives quand la matrice exige explicitement un navigateur/OS/appareil réel.



## Réconciliation canonique — 21 septembre 2026

Cette section est **plus récente** que la matrice initiale et la réconciliation du 19 septembre. Elle met à jour uniquement l’état courant ; les lignes historiques ci-dessus restent conservées pour provenance.

### TERMINÉ sur périmètre ciblé

- **Surface Premium HD** : 23 routes publiques couvertes par les preuves visuelles/browser ciblées actuelles.
- **Firefox final élargi ciblé** : 23 routes × desktop/mobile prouvées par la lane dédiée ; cela ne vaut pas Safari.
- **WebKit Playwright** : préflight 23 routes acquis ; cela ne vaut pas Safari réel.
- **PWA HTTPS automatisée** : service worker, cache, offline-stale, reconnexion/update prouvés sur preview HTTPS ciblée ; installation manuelle sur appareil reste séparée.
- **Imports/exports Chromium ciblés** : vrais fichiers du runner déjà exercés ; aucune nouvelle exigence de dialogue natif n’est déduite de cette preuve.
- **Comptes / profils Provider DEV** : login/callback/session, écritures profil, exposition publique ciblée et fail-closed privé/inexistant acquis.
- **Publication / modération / recours Provider DEV** : migration D1 0003, RBAC, publication/retrait, suivi, recours/issue et receipts ciblés acquis.
- **Signatures / attestations** : contrat, moteur de vérification, trust-anchor gate et chaîne de confiance de distribution acquis en code/preuves ciblées.
- **Storage Resolver / Repair Network** : contrats, moteur décisionnel, transport HTTPS borné et orchestrateur acquis en code/preuves ciblées.
- **Guide MODARYX / pont Nova Forge OS** : contrats, consentement/permissions, découverte runtime et hardening borné acquis en code/preuves ciblées.

### EN COURS / BLOQUÉ — dépendances réelles

- **Passkey finale** : **PREUVE MANQUANTE** sur appareil WebAuthn compatible pour enrôlement, reconnexion et révocation.
- **Signer / trust anchor réels** : **EN COURS** ; aucun signer de production ni trust anchor réel publié.
- **Téléchargements publics** : **BLOQUÉ** ; aucun artefact réel autorisé, versionné et vérifiable n’est disponible, le verrou fail-closed reste requis.
- **Corpus GTA VI / RDR2 réel** : **EN COURS** ; hubs éditoriaux présents mais corpus de mods autorisé/versionné/attribué absent.
- **Storage Resolver / Repair Network réels** : **EN COURS** ; endpoints/origines/exécution distante réels non connectés.
- **Guide MODARYX réel** : **EN COURS** ; service réel non connecté.
- **Pont Nova Forge OS réel** : **EN COURS** ; runtime Nova Forge OS réel non connecté.
- **Météo réelle production** : **BLOQUÉ / décision externe** tant que fournisseur, licence, confidentialité, attribution et disclaimer ne sont pas validés.

### PREUVE MANQUANTE — humaine / appareil / terrain

- lecteur d’écran natif Windows ;
- VoiceOver macOS/iOS ;
- zoom navigateur natif 200/400 % final ;
- appareils tactiles physiques ;
- Safari réel ;
- installation PWA manuelle sur appareil ;
- CWV terrain représentatifs ;
- validation artistique humaine finale ;
- validation juridique / droits / licences ;
- Master Nova Design Intelligence complète — **NON RÉCUPÉRÉE**.

### Règle de clôture actuelle

Aucune ligne historique ne doit rouvrir une capacité déjà fermée sur son périmètre ciblé, et aucune preuve ciblée ne doit être extrapolée en preuve appareil, humaine, juridique, terrain ou service réel. La VF officielle reste non déclarée. Le full replay final reste réservé à la toute fin.
