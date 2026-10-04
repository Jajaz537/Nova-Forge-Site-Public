# MODARYX IA — Architecture fondatrice professionnelle

**Date : 2026-10-04**  
**Statut : DÉCISION PRODUIT — fondations à implémenter avant toute intégration IA publique**

## 1. Vision

MODARYX IA ne doit pas être un simple chatbot greffé au site.

Cible :
- assistant natif de MODARYX ;
- spécialiste du modding, des jeux, des profils, des dépendances, des compatibilités, des droits, des workflows créateurs et du handoff vers MODARYX Forge ;
- capable d'expliquer, rechercher, diagnostiquer, préparer des actions et automatiser des workflows ;
- toujours traçable, vérifiable et limité par permissions ;
- capable de fonctionner avec plusieurs modèles/providers derrière une architecture MODARYX stable.

Principe :

> **MODARYX possède l'orchestration, les connaissances, les outils, les permissions, les évaluations et l'expérience utilisateur — pas forcément le modèle fondamental initial.**

## 2. Ce qu'il ne faut pas faire au départ

Éviter :
- entraîner immédiatement un modèle fondamental géant de zéro ;
- dépendre d'un seul fournisseur IA ;
- donner à l'IA des permissions globales ;
- laisser l'IA interpréter seule des décisions juridiques ambiguës ;
- stocker toute conversation comme mémoire permanente ;
- permettre des actions destructives sans confirmation/rollback ;
- publier des réponses sans sources quand la réponse dépend de données réelles ;
- confondre confiance du modèle et preuve.

## 3. Architecture cible

### 3.1 AI Gateway MODARYX

Couche unique entre le produit et les modèles.

Responsabilités :
- routage du modèle ;
- politiques ;
- coûts ;
- quotas ;
- timeouts ;
- retries ;
- journalisation ;
- redaction des données sensibles ;
- choix du meilleur modèle selon la tâche ;
- fallback entre providers.

Le frontend ne parle jamais directement à un fournisseur IA.

### 3.2 Model Router

Choix dynamique selon :
- complexité ;
- coût ;
- latence ;
- besoin de raisonnement ;
- besoin multimodal ;
- confidentialité ;
- disponibilité ;
- niveau de risque.

Exemples :
- modèle rapide pour classification ;
- modèle fort pour diagnostic ;
- modèle multimodal pour screenshots/logs ;
- modèle local/on-device pour tâches privées simples lorsque possible.

### 3.3 MODARYX Knowledge Layer

Sources autoritatives :
- catalogue jeux ;
- contenus/mods ;
- releases/files ;
- compatibilités ;
- profils ;
- collections ;
- documentation MODARYX ;
- politiques éditeurs ;
- Game Rights Registry ;
- MODARYX Forge capabilities ;
- support ;
- Creator Studio ;
- incidents ;
- changelogs.

Règle :
- réponse factuelle importante = provenance/source affichable ;
- donnée inconnue = Unknown, pas invention.

### 3.4 Retrieval / RAG

Le système doit récupérer uniquement les données pertinentes avant génération.

Capacités :
- recherche sémantique ;
- recherche structurée ;
- filtres jeu/version/loader/plateforme ;
- freshness ;
- provenance ;
- permissions utilisateur ;
- isolation tenant/account.

### 3.5 Tool Layer

MODARYX IA agit via outils contrôlés.

Exemples :
- rechercher un mod ;
- comparer deux versions ;
- analyser un profil ;
- détecter dépendances/conflicts ;
- préparer un delta ;
- créer un brouillon de collection ;
- préparer une release ;
- générer un Rights Case ;
- chercher un contact éditeur officiel ;
- préparer une demande ;
- ouvrir un handoff vers MODARYX Forge ;
- lire un receipt ;
- expliquer une erreur.

Chaque outil possède :
- schema strict ;
- permissions ;
- dry-run ;
- audit ;
- timeout ;
- idempotency ;
- résultat structuré.

## 4. Permission Engine

Niveaux proposés :

### READ
Lecture uniquement.

### PLAN
L'IA peut préparer une action sans l'exécuter.

### EXECUTE_SAFE
Actions réversibles/faible risque.

### EXECUTE_SENSITIVE
Confirmation explicite ou policy gate.

### BLOCKED
Jamais autorisé automatiquement.

Exemples BLOCKED sans validation :
- accepter une licence éditeur ;
- supprimer définitivement des données ;
- contourner DRM/restrictions ;
- modifier DNS/Cloudflare critique ;
- déclarer un partenariat ;
- installer un contenu non autorisé ;
- publier un asset aux droits inconnus.

## 5. MODARYX IA + droits éditeurs

MODARYX IA pourra aider le workflow droits, mais ne doit pas être autorité juridique finale.

Elle peut :
- lire politiques officielles ;
- résumer ;
- extraire scopes ;
- comparer une réponse à une demande ;
- classer clair/ambigu ;
- préparer une action.

Elle ne doit jamais :
- transformer une absence de réponse en accord ;
- étendre une licence ;
- considérer un message ambigu comme APPROVED ;
- ignorer expiration/révocation.

États :
- SAFE_AUTOMATION ;
- NEEDS_REVIEW ;
- LEGAL_REVIEW_REQUIRED ;
- DENIED.

## 6. Mémoire

La mémoire doit être explicite et contrôlée.

Séparer :
- session memory ;
- user preferences ;
- project memory ;
- account facts ;
- system facts ;
- sensitive restricted memory.

Règles :
- minimisation ;
- expiration ;
- possibilité de purge ;
- pas de mémoire globale implicite de données sensibles ;
- provenance des mémoires importantes.

## 7. Personnalisation

MODARYX IA doit comprendre :
- jeux préférés ;
- niveau débutant/expert ;
- plateformes ;
- loaders/frameworks ;
- style d'explication ;
- profils de jeu ;
- tolérance au risque ;
- préférences de notifications.

Mais jamais déduire des attributs sensibles sans nécessité.

## 8. Expérience site

Sur le site, MODARYX IA doit être contextuelle.

Exemples :
- sur Game Hub : “Quels mods sont compatibles avec ma version ?”
- sur Content Detail : “Pourquoi ce mod est incompatible ?”
- sur Profile : “Que se passe-t-il si je retire Aether Core ?”
- sur Creator Studio : “Prépare une release Beta pour 1.4.2”
- sur Rights Dashboard : “Explique les scopes accordés par cet éditeur”
- sur Library : “Crée une copie de test avant mise à jour”

L'IA doit voir le contexte de la page mais respecter les permissions.

## 9. Expérience MODARYX Forge

Le même cerveau peut servir le desktop via un contrat séparé.

Exemples :
- diagnostic local ;
- analyse logs ;
- proposition de rollback ;
- résolution de conflits ;
- safe profile ;
- vérification files/hashes ;
- préparation installation.

Aucune action locale sans capability handshake réel.

## 10. Agents spécialisés

Plutôt qu'un seul agent omnipotent, architecture recommandée :

- Game Support Agent ;
- Mod Compatibility Agent ;
- Profile Doctor ;
- Creator Copilot ;
- Rights & Publisher Agent ;
- Moderation Assistant ;
- Support Agent ;
- Forge Diagnostic Agent ;
- Search/Discovery Agent.

Un orchestrateur choisit l'agent adapté.

## 11. Evaluations obligatoires

MODARYX IA doit être construite eval-first.

Suites minimales :
- exactitude compatibilité ;
- hallucination ;
- citation/provenance ;
- dépendances/conflicts ;
- droits/licences ;
- refus sûrs ;
- permission boundaries ;
- tool selection ;
- tool arguments ;
- rollback ;
- multi-turn consistency ;
- injection/prompt injection ;
- data leakage ;
- multilingual FR/EN au minimum ;
- UX beginner/expert.

Aucune release IA importante sans regression suite.

## 12. Safety / Security

Protection contre :
- prompt injection depuis pages/mod descriptions ;
- contenus malveillants dans manifests ;
- exfiltration de secrets ;
- tool abuse ;
- actions répétées ;
- forged publisher messages ;
- poisoned knowledge entries ;
- jailbreaks vers fonctions admin.

Règle :
- contenu externe = donnée, jamais instruction système.

## 13. Observabilité

Chaque réponse/action importante doit pouvoir tracer :
- modèle utilisé ;
- version prompt/policy ;
- sources ;
- outils ;
- latence ;
- coût ;
- token usage ;
- erreurs ;
- décision permission ;
- confirmation utilisateur ;
- outcome.

Logs sensibles redacted.

## 14. Qualité professionnelle

Objectifs :
- cohérence ;
- faible hallucination ;
- réponses sourcées ;
- refus compréhensibles ;
- vitesse ;
- continuité ;
- excellente UX mobile ;
- streaming ;
- recovery ;
- accessibilité ;
- internationalisation.

## 15. Model independence

MODARYX IA doit pouvoir changer de fournisseur sans réécrire le produit.

Interface conceptuelle :
- chat ;
- reasoning ;
- embeddings ;
- vision ;
- audio ;
- tools ;
- structured output.

Les providers deviennent des adapters.

## 16. Fine-tuning / modèles propres

Ordre recommandé :

### Phase A
Meilleurs modèles externes + RAG + tools + evals.

### Phase B
Fine-tuning ciblé pour :
- classification ;
- routing ;
- style MODARYX ;
- taxonomie ;
- support spécialisé.

### Phase C
Petits modèles MODARYX spécialisés/local-first pour certaines tâches.

### Phase D
Évaluer seulement ensuite si un modèle fondamental propriétaire apporte un avantage réel.

Ne pas entraîner un modèle géant uniquement pour pouvoir dire “notre IA”.

## 17. Données d'entraînement

Jamais utiliser automatiquement :
- conversations privées ;
- licences confidentielles ;
- données éditeurs ;
- contenus utilisateurs ;
- logs sensibles.

Sans base légale/consentement/politique claire.

Créer un corpus propre :
- docs MODARYX ;
- exemples synthétiques ;
- données autorisées ;
- benchmark/evals ;
- annotations internes.

## 18. Coût et performance

Budgeter :
- coût/requête ;
- coût/user/month ;
- cache ;
- batch ;
- routing ;
- petits modèles ;
- RAG avant gros modèle ;
- réponses courtes quand suffisant.

Ne jamais sacrifier sécurité/qualité juste pour économiser.

## 19. Modes utilisateurs

### Assistant
Explique et répond.

### Copilot
Prépare des actions.

### Autopilot contrôlé
Exécute uniquement workflows explicitement autorisés.

### Expert
Montre sources, décisions, graphes, receipts et détails.

Le passage en Autopilot doit être permissionné et révocable.

## 20. Interface de confiance

Chaque réponse importante peut afficher :
- Sources ;
- Confiance ;
- Données utilisées ;
- Dernière vérification ;
- Actions proposées ;
- Ce que l'IA ne sait pas.

## 21. Roadmap

### Foundation
- AI Gateway ;
- provider adapters ;
- identity/permissions ;
- RAG ;
- tool protocol ;
- eval harness ;
- safety policies ;
- observability.

### MODARYX Site
- contextual assistant ;
- search/discovery ;
- profile explanation ;
- Creator Copilot ;
- Rights Assistant.

### MODARYX Forge
- diagnostics ;
- local profile reasoning ;
- delta/rollback ;
- safe execution.

### Automation
- publisher workflows ;
- moderation triage ;
- support workflows ;
- notifications.

### Advanced
- multimodal ;
- voice ;
- local models ;
- proactive assistance with user controls.

## 22. Non-negotiables

- no fake certainty ;
- no silent destructive action ;
- no hidden publisher/legal approval ;
- no provider lock-in ;
- no unbounded agent ;
- no training on private data by default ;
- no action without audit trail ;
- no production launch without evals.

## 23. Statut

**DÉCISION PRODUIT RETENUE.**

À ce stade :
- architecture conceptuelle : définie ;
- implémentation : NON COMMENCÉE ;
- provider(s) : NON SÉLECTIONNÉS ;
- modèles : NON SÉLECTIONNÉS ;
- backend IA : NON IMPLÉMENTÉ ;
- eval suite : NON IMPLÉMENTÉ ;
- intégration site : NON IMPLÉMENTÉ ;
- intégration MODARYX Forge : NON IMPLÉMENTÉ.

La sélection technique devra être faite au moment du chantier IA avec benchmark frais, coûts, sécurité et qualité mesurés.
