# MODARYX — ANTI-OUBLI COURANT CANONIQUE — 20 septembre 2026

**Base Git vérifiée avant rédaction :** `design/modaryx-premium-hd-20260914-work` @ `1b2ca020cf846cd3008cd3bbcc69f4ad18a076d9`.  
**Statut :** registre courant prioritaire pour la fermeture anti-oubli.  
**Portée :** MODARYX / MODARYX MODS uniquement. Nova Forge OS reste un produit distinct.  
**Règle :** ce document n'efface pas l'historique ; il supersède seulement les anciens états devenus obsolètes.

Aucune ligne ci-dessous ne constitue une déclaration de VF, de 100 %, de fusion vers `main` ou de validation humaine finale.

## 1. Séparation de produit et identité

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| MODARYX / MODARYX MODS = plateforme web | **TERMINÉ — contrat courant** | Identité web conservée ; aucune migration MODARYX → Nova Forge. |
| Nova Forge OS Public / Fondateur = logiciel distinct | **TERMINÉ — contrat courant** | Références web uniquement pour relation de produit ou intégration future explicite. |
| `getnovaforge.com` / getnova | **TERMINÉ — classification historique** | Ancien projet web ; références historiques conservées seulement quand nécessaires à la provenance, compatibilité ou protection technique. |
| Identité visuelle MODARYX visible sur les 17 routes | **TERMINÉ — périmètre source courant** | Le garde source rejette le libellé visible « Modaryx OS » ; la validation artistique globale reste séparée. |
| Design system Premium HD des 17 pages | **EN COURS** | Cohérence globale encore en finition ; aucune page n'hérite automatiquement de la preuve d'une autre. |

## 2. Monde vivant / Loup / Dragon

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| Environnement Premium HD séparé | **TERMINÉ** | Asset réel intégré. |
| Loup — bébé, juvénile, adolescent, jeune adulte, adulte | **TERMINÉ 5/5** | Cinq assets séparés prouvés. |
| Dragon — bébé, juvénile, adolescent, jeune adulte, adulte | **TERMINÉ 5/5** | Cinq assets séparés prouvés. |
| Activation de la croissance visuelle | **TERMINÉ — périmètre ciblé** | `visualGrowth.status=ready`, couche courante chargée à la demande, fallback conservé. |
| Preview HTTPS environnement + compagnons | **TERMINÉ — preuve ciblée déployée** | Run `35483330153`, desktop + mobile + reduced-motion. |
| Reduced motion monde vivant | **TERMINÉ — preuve ciblée déployée** | Animations/transitions neutralisées dans le cas réduit. |
| Saison + heure locale via contexte grossier | **TERMINÉ — preuve ciblée déployée** | Reality sync `cloudflare-coarse` observé avec saison/daypart. |
| Météo réelle production | **BLOQUÉ / décision externe** | Fournisseur, licence, attribution, confidentialité et politique produit à valider avant activation. |
| Validation artistique humaine finale | **PREUVE MANQUANTE** | Les captures techniques ne remplacent pas le jugement humain final sur composition/cadrage. |

## 3. Capacités locales déjà prouvées

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| Recherche — résultats, vide, panne, retry | **TERMINÉ — preuve ciblée navigateur** | PR #64, run `35487557212`. |
| Téléchargements — panne + état verrouillé | **TERMINÉ — preuve ciblée navigateur** | PR #64 ; 0 artefact exposé, retry et focus prouvés. Aucun téléchargement réel livré. |
| PWA preview HTTPS — offline → online + donnée stale + health-check update | **TERMINÉ — preuve ciblée déployée** | PR #63, run `35487895759`, preview HTTPS réelle. |
| Profils — détection WebAuthn locale | **TERMINÉ — preuve ciblée navigateur** | PR #66, run `35488704409`. Ne vaut ni compte ni passkey inscrite. |
| Catalogue — zéro résultat, reset, panne, récupération, favori local | **TERMINÉ — preuve ciblée navigateur** | PR #67, run `35488828426`. |
| Communauté — catalogue indisponible puis récupéré | **TERMINÉ — preuve ciblée navigateur** | PR #67. Aucun backend communautaire simulé. |
| Creator Studio — schéma indisponible / fail-closed / récupération | **TERMINÉ — preuve ciblée navigateur** | PR #69, run `35489189427`. Publication distante toujours absente. |
| Project Hub — fallback puis récupération sans perte du favori | **TERMINÉ — preuve ciblée navigateur** | PR #71, run `35489515272`. |
| Accueil — panne/récupération données publiques | **TERMINÉ — preuve ciblée navigateur** | PR #72, run `35489918720`. Digest public volontairement absent reste fail-closed. |
| Smart Profile — état local indicatif | **TERMINÉ — périmètre local ciblé** | Rendu déployé et garde étroite documentés dans `MODARYX-NEXT-BATCH.md`; aucun benchmark/FPS garanti. |
| Vérificateur SHA-256 local | **TERMINÉ — périmètre local ciblé** | Calcul/comparaison locale ; une empreinte n'établit ni provenance, ni auteur, ni innocuité. |
| Imports/exports fichiers réels Chromium | **TERMINÉ — périmètre automatisé ciblé** | Matrice externe : run `35464233996`. Dialogue natif utilisateur/appareil reste distinct. |
| Accessibilité structurelle Chromium | **TERMINÉ — périmètre ciblé** | 17 pages, arbre AX/labels/skip-link dans la lane automatisée. |
| Reflow Chromium 320/400/768/1440 | **TERMINÉ — périmètre ciblé** | 68 navigations dans la lane automatisée. |
| Performance laboratoire 5 pages × 2 profils | **TERMINÉ — périmètre ciblé** | Budgets labo respectés ; ce n'est pas du CWV terrain. |
| CodeQL PR #12 — constats historiques visibles | **TERMINÉ** | 11/11 threads historiques résolus ; run HEAD documenté `35484967852`. |

## 4. Catalogue, jeux, fiches et SEO

| Élément retenu | État courant | Preuve / limite |
|---|---|---|
| Catalogue multigaming local | **TERMINÉ — périmètre démonstration** | Trois créations de démonstration ; pas de catalogue de distribution réel. |
| Index `/games/` | **TERMINÉ — périmètre actuel** | Trois jeux de démonstration, canonical explicite, recette navigateur ciblée. |
| Fiches de créations | **TERMINÉ — périmètre local ciblé** | Fallback/récupération et navigation documentés ; galerie réelle, versions distribuées et compatibilité mesurée restent absentes. |
| SEO des pages réellement disponibles | **EN COURS** | Canonicals présents sur les pages indexables ; 404 en `noindex,nofollow`. `/games/` n'est pas encore dans `sitemap.xml` et ce fichier ne doit pas être modifié sans lever explicitement sa garde. |
| Hubs GTA VI / RDR2, catégories et guides | **EN COURS — capacité non livrée** | Corpus substantiel, sources, droits médias et décisions éditoriales encore nécessaires. Aucune page SEO vide ne doit être créée. |

## 5. Capacités retenues non livrées

| Élément retenu | État courant | Condition de fermeture |
|---|---|---|
| Comptes / authentification / passkeys réels | **EN COURS — capacité non livrée** | Backend d'identité, politique de session/récupération et environnement de test réels. |
| Profils publics éditables | **EN COURS — capacité non livrée** | Identité, stockage et politique de publication réels. |
| Publication / modération distante | **EN COURS — capacité non livrée** | Backend sécurisé, rôles, politique d'abus, journal d'audit et voies d'appel. |
| Signatures / attestations de provenance | **EN COURS — capacité non livrée** | Service ou chaîne de preuve réelle ; un receipt saisi localement ne suffit pas. |
| Téléchargements publics réels | **BLOQUÉ** | Artefact autorisé + identité + SHA-256 + provenance + signature lorsque requise. |
| Storage Resolver | **EN COURS — dépendance service** | Stockage/résolution sécurisé et vérifiable réel. |
| Repair Network | **EN COURS — dépendance protocole** | Protocole public finalisé ; aucune réparation distante fictive. |
| Backend communautaire | **EN COURS — solution à qualifier** | Solution sécurisée compatible avec le budget retenu et politique de données. |
| Guide MODARYX connecté | **EN COURS — capacité non livrée** | Moteur/contrat réel ; rester distinct de Nova Guide des OS. |
| Pont Nova Forge OS | **EN COURS — dépendance Nova Forge OS** | Interface publique stabilisée, consentement et modèle de permissions ; aucun partage implicite. |

## 6. Preuves externes encore ouvertes

| Élément | État courant | Pourquoi ce n'est pas fermé |
|---|---|---|
| Lecteur d'écran natif Windows | **PREUVE MANQUANTE** | NVDA/Narrator pilotable non disponible dans la recette actuelle. |
| VoiceOver macOS/iOS | **PREUVE MANQUANTE** | Environnement Apple réel requis. |
| Zoom navigateur natif 200/400 % final | **PREUVE MANQUANTE** | La lane 400 % native reste non démontrée dans l'environnement actuel. |
| Appareils tactiles physiques | **PREUVE MANQUANTE** | Android/iOS/tablette physiques requis. |
| Safari final + Firefox final élargi | **PREUVE MANQUANTE** | Parité finale des parcours à exécuter sur moteurs réels supportés. |
| CWV représentatifs | **PREUVE MANQUANTE** | Les budgets labo ne remplacent pas des mesures représentatives sur URL stable. |
| Installation PWA manuelle sur appareil | **PREUVE MANQUANTE** | Le cycle HTTPS automatisé est acquis ; l'expérience d'installation utilisateur réelle reste séparée. |
| Validation juridique / droits / licences | **PREUVE MANQUANTE** | Identité d'éditeur, contacts, droits et autorisations doivent venir de données réelles. |
| Master Nova Design Intelligence complète | **PREUVE MANQUANTE / NON RÉCUPÉRÉE** | Le référentiel historique complet n'est pas présent ; ne pas inventer les éléments manquants. |

## 7. Finition Premium HD encore active

- **EN COURS** — finition cohérente des 17 pages : composition, hiérarchie, surfaces, responsive, états, navigation, typographie, motion et contrôles visuels.
- **TERMINÉ — preuve ciblée navigateur** — surfaces statiques Écosystème / Sécurité / Documentation / Jeux / 404 : PR #74 fusionnée dans Work au merge `29fab6f549c5d9192359c0e8c9cbad2d4edec39a` ; run `35508894415`, marker `PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW` ; desktop 1440×1000 + mobile 390×844, zéro overflow, aucune image cassée ni contrôle coupé. Les captures ont été inspectées de façon assistée sans défaut bloquant isolé ; cela ne ferme pas la validation artistique humaine finale.
- **TERMINÉ sur leurs scénarios ciblés** — états locaux Recherche, Téléchargements, Profils, Catalogue, Communauté, Creator Studio, Project Hub et Accueil. Ne pas les rejouer sans modification pertinente.

## 8. États historiques explicitement supersédés

Les mentions historiques suivantes restent conservées pour provenance mais **ne représentent plus l'état courant** :

- compteurs de couches compagnon inférieurs à 10/10 ;
- `visualGrowth.status=awaiting-assets` ;
- croissance visuelle « non activée » ;
- PWA HTTPS automatisée indiquée entièrement PREUVE MANQUANTE ;
- ancienne couverture à 16 pages ;
- anciens compteurs de cache/précache antérieurs aux mesures courantes ;
- threads CodeQL historiques encore ouverts ;
- anciens « prochain point » déjà dépassés par les PR #63 à #72.

## 9. Règle de fermeture anti-oubli avant VF

Chaque idée explicitement retenue dans le registre historique courant est maintenant soit :

- **TERMINÉE** sur un périmètre prouvé ;
- **EN COURS** comme travail produit réel ;
- **BLOQUÉE** par une dépendance ou décision réelle ;
- **PREUVE MANQUANTE** lorsqu'une validation externe manque.

Aucune idée n'est supprimée implicitement pour améliorer un pourcentage. Une capacité non livrée n'est jamais requalifiée en simple test manquant. Une preuve technique locale ne devient pas une preuve native, juridique ou humaine.

**Limite d'exhaustivité :** ce registre couvre les idées explicitement récupérées dans le dépôt, les checkpoints et le registre anti-oubli actuels. La Master NDI complète étant non récupérée, l'exhaustivité historique absolue ne peut pas être revendiquée sans cette source.

## 10. Prochain point logique

1. Ne pas rejouer la preuve statique PR #74 sans modification pertinente.
2. Consolider le SEO autonome sans modifier les fichiers gardés/infra sans autorisation explicite ; l'écart connu `/games/` → sitemap reste tracé.
3. Continuer la finition Premium HD globale uniquement là où une preuve ou une inspection fraîche révèle un défaut réel.
4. Fermer séparément les preuves externes quand un environnement approprié est disponible et garder les capacités distantes dans leur état réel.
5. Aucun full replay avant la toute fin.
