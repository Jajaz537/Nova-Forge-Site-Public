'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const ledger = fs.readFileSync(path.join(root, 'qa/MODARYX-ANTI-OUBLI-CURRENT-20260920.md'), 'utf8');
const checkpoint = fs.readFileSync(path.join(root, 'CHECKPOINT-CANONIQUE-MODARYX-2026-09-20.md'), 'utf8');
const readiness = JSON.parse(fs.readFileSync(path.join(root, 'data/integration-readiness.json'), 'utf8'));

const requiredCurrent = [
  'Design system Premium HD des 23 routes publiques',
  'SEO on-page des 23 routes | **TERMINÉ — preuve ciblée**',
  'Sitemap des routes jeux/hubs | **TERMINÉ — preuve ciblée**',
  'Hubs GTA VI / RDR2, catégories et guides éditoriaux | **TERMINÉ — périmètre éditorial sourcé + readiness contractuelle**',
  'Corpus réels de mods GTA VI / RDR2 | **EN COURS — capacité non livrée / droits et preuves requis**',
  'PASS_TARGETED_SEO_CONTRACT',
  'PASS_TARGETED_BROWSER_REFLOW_MICROPROOF',
  'PASS_TARGETED_BROWSER_A11Y_MICROPROOF',
  'PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW',
  'Firefox final élargi | **TERMINÉ — preuve ciblée**',
  'PASS_TARGETED_FIREFOX_23_ROUTE_PROOF',
  'WebKit 23 routes — préflight | **TERMINÉ — preuve ciblée moteur**',
  'PASS_TARGETED_WEBKIT_23_ROUTE_PREFLIGHT',
  'Storage Resolver | **EN COURS — contrat + décision + transport vérifié acquis ; service distant non connecté**',
  'Repair Network | **EN COURS — protocole + décision + transport vérifié acquis ; exécution distante non connectée**',
  'PASS_TARGETED_STORAGE_REPAIR_CONTRACTS',
  'Signatures / attestations de provenance | **EN COURS — vérification + trust-anchor gate acquis ; signer réel non connecté**',
  'PASS_TARGETED_PROVENANCE_RECEIPT_CONTRACTS',
  'Comptes / authentification / passkeys réels | **PREUVE MANQUANTE — appareil réel requis ; Provider DEV configuré**',
  'Profils publics éditables | **TERMINÉ — parcours DEV bout-en-bout ciblé**',
  'Publication / modération distante | **TERMINÉ — cycle Provider DEV bout-en-bout ciblé**',
  'PASS_TARGETED_ACCOUNT_COMMUNITY_CONTRACTS',
  'Téléchargements publics réels | **BLOQUÉ — verrou local prouvé, artefact réel absent**',
  'PASS_TARGETED_DISTRIBUTION_LOCK_CONTRACTS',
  'Smart Profile — état local indicatif | **TERMINÉ — périmètre local ciblé + contrat prouvé**',
  'Contrats locaux collection / compatibilité / search adapter | **TERMINÉ — preuve ciblée**',
  'PASS_TARGETED_LOCAL_PLATFORM_CONTRACTS',
  'Work Phase 2 — qualification externe | **TERMINÉ — preuve de préparation/limitation**',
  'MODARYX-WORK-PHASE2-EXTERNAL-EVIDENCE-20260920.md',
  'PASS_TARGETED_BACKEND_DEV_FOUNDATION',
  'MODARYX-BACKEND-DEV-PROVISIONING-20260920.md',
  'Backend communautaire | **TERMINÉ — Provider DEV + cycle modération/recours ciblé**',
  'Endpoints profils / communauté distants | **TERMINÉ — code + micro-proofs provider DEV**',
  'PASS_TARGETED_REMOTE_WRITE_ENDPOINTS',
  'MODARYX-REMOTE-WRITE-ENDPOINTS-20260920.md',
  'Flux Auth0 BFF / session | **TERMINÉ — code + preuve provider DEV ciblée**',
  'PASS_TARGETED_AUTH_BFF_SESSION',
  'MODARYX-AUTH-BFF-SESSION-20260920.md',
  'UI compte / profil premium | **TERMINÉ — preuve ciblée de code**',
  'PASS_TARGETED_PROFILES_ACCOUNT_UI',
  'MODARYX-PROFILES-ACCOUNT-UI-20260920.md',
  'UI communauté distante modérée | **TERMINÉ — envoi + surface publique + suivi/recours ciblés**',
  'PASS_TARGETED_COMMUNITY_REMOTE_UI',
  'MODARYX-COMMUNITY-REMOTE-UI-20260920.md',
  'Provider DEV réel + micro-proofs bout-en-bout | **TERMINÉ — profils + ingestion + modération/recours ciblés**',
  'Moteur modération / publication / recours | **TERMINÉ — code + preuves ciblées + Provider DEV réel**',
  'Guide MODARYX connecté | **EN COURS — contrat + gate de consentement acquis ; service réel non connecté**',
  'Pont Nova Forge OS | **EN COURS — contrat + gate de consentement acquis ; runtime OS non connecté**',
  'PASS_TARGETED_PASSKEY_PROVIDER_READINESS',
  'MODARYX-PASSKEY-PROVIDER-READINESS-20260921.md',
  'PASS_TARGETED_SIGNATURE_ATTESTATION_CONTRACT',
  'MODARYX-SIGNATURE-ATTESTATION-CONTRACT-20260921.md',
  'PASS_TARGETED_GUIDE_OS_BRIDGE_CONTRACTS',
  'MODARYX-GUIDE-OS-BRIDGE-CONTRACT-20260921.md',
  'PASS_TARGETED_SIGNATURE_VERIFICATION_ENGINE',
  'MODARYX-SIGNATURE-VERIFICATION-ENGINE-20260921.md',
  'PASS_TARGETED_STORAGE_REPAIR_DECISION_ENGINE',
  'MODARYX-STORAGE-REPAIR-DECISION-ENGINE-20260921.md',
  'PASS_TARGETED_INTEGRATION_CONSENT_ENGINE',
  'MODARYX-INTEGRATION-CONSENT-ENGINE-20260921.md',
  'PASS_TARGETED_TRUSTED_SIGNER_GATE',
  'MODARYX-TRUSTED-SIGNERS-GATE-20260921.md',
  'PASS_TARGETED_STORAGE_TRANSPORT_PRIMITIVE',
  'MODARYX-STORAGE-TRANSPORT-PRIMITIVE-20260921.md',
  'PASS_TARGETED_DISTRIBUTION_TRUST_CHAIN',
  'MODARYX-DISTRIBUTION-TRUST-CHAIN-20260921.md',
  'PASS_TARGETED_STORAGE_REPAIR_ORCHESTRATOR',
  'MODARYX-STORAGE-REPAIR-ORCHESTRATOR-20260921.md',
  'PASS_TARGETED_INTEGRATION_DISCOVERY_RUNTIME',
  'MODARYX-INTEGRATION-DISCOVERY-RUNTIME-20260921.md',
  'MODARYX-PASSKEY-PROVIDER-DEV-EVIDENCE-20260921.md',
  'PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING',
  'MODARYX-RUNTIME-RESILIENCE-HARDENING-20260921.md',
  'PASS_TARGETED_MODERATION_PUBLICATION_ENGINE',
  'MODARYX-MODERATION-PUBLICATION-ENGINE-20260921.md',
  '403 turnstile-rejected',
  '403 turnstile-hostname-mismatch'
];
for (const token of requiredCurrent) assert.ok(ledger.includes(token), 'anti-forget current missing: ' + token);

const forbiddenCurrent = [
  'Design system Premium HD des 17 pages',
  'SEO des pages réellement disponibles | **EN COURS**',
  'Hubs GTA VI / RDR2, catégories et guides | **EN COURS — capacité non livrée**',
  'Safari final + Firefox final élargi | **PREUVE MANQUANTE**',
  'Comptes / authentification / passkeys réels | **EN COURS — flux BFF/session codé, tenant non provisionné**',
  'Profils publics éditables | **EN COURS — UI premium + endpoint + session BFF codés, service non provisionné**',
  'Profils publics éditables | **EN COURS — écriture profil DEV réelle prouvée ; exposition publique complète non fermée**',
  'Publication / modération distante | **EN COURS — UI d’envoi + endpoint codés, modération distante non provisionnée**',
  'Backend communautaire | **EN COURS — fondation + endpoints + session BFF codés, ressources non provisionnées**',
  'Publication / modération distante | **EN COURS — ingestion distante DEV réelle prouvée ; modération/publication finale non connectée**',
  'Backend communautaire | **EN COURS — Provider DEV réel et write path prouvés ; cycle de modération final non livré**',
  'Sitemap des routes jeux/hubs | **EN COURS — garde explicite**',
  'Publication / modération distante | **EN COURS — moteur complet codé/prouvé ; activation fournisseur DEV restante**',
  'Backend communautaire | **EN COURS — Provider DEV + writes réels ; moteur modération/recours codé, activation réelle restante**',
  'Provider DEV réel + micro-proofs bout-en-bout | **TERMINÉ — périmètre profils + ingestion communautaire**',
  'Moteur modération / publication / recours | **TERMINÉ — code + preuves ciblées ; provider réel restant**',
  'Comptes / authentification / passkeys réels | **EN COURS — login/callback/session DEV réels prouvés ; passkey finale non prouvée**',
  'Signatures / attestations de provenance | **EN COURS — contrats provenance acquis, signer/attestation réel non connecté**',
  'Guide MODARYX connecté | **EN COURS — capacité non livrée**',
  'Pont Nova Forge OS | **EN COURS — dépendance Nova Forge OS**',
  'Storage Resolver | **EN COURS — contrat acquis, service non connecté**',
  'Repair Network | **EN COURS — protocole contractuel acquis, exécution distante non connectée**',
  'Signatures / attestations de provenance | **EN COURS — contrat d’attestation/signature acquis ; signer réel non connecté**',
  'Guide MODARYX connecté | **EN COURS — contrat de connexion acquis ; service réel non connecté**',
  'Pont Nova Forge OS | **EN COURS — contrat de pont acquis ; runtime OS non connecté**',
  'Comptes / authentification / passkeys réels | **EN COURS — préparation source passkey finale acquise ; cérémonie provider/appareil réelle non prouvée**',
  'Storage Resolver | **EN COURS — contrat + moteur décisionnel acquis ; service/transport non connecté**',
  'Repair Network | **EN COURS — protocole + moteur décisionnel acquis ; exécution distante non connectée**',
  'Signatures / attestations de provenance | **EN COURS — contrat + moteur de vérification acquis ; signer réel non connecté**'
];
for (const token of forbiddenCurrent) assert.ok(!ledger.includes(token), 'stale current state returned: ' + token);

const expectedOpen = new Map([
  ['Météo réelle production', 'BLOQUÉ'],
  ['Validation artistique humaine finale', 'PREUVE MANQUANTE'],
  ['Comptes / authentification / passkeys réels', 'PREUVE MANQUANTE'],
  ['Signatures / attestations de provenance', 'EN COURS'],
  ['Téléchargements publics réels', 'BLOQUÉ'],
  ['Corpus réels de mods GTA VI / RDR2', 'EN COURS'],
  ['Storage Resolver', 'EN COURS'],
  ['Repair Network', 'EN COURS'],
  ['Guide MODARYX connecté', 'EN COURS'],
  ['Pont Nova Forge OS', 'EN COURS'],
  ["Lecteur d'écran natif Windows", 'PREUVE MANQUANTE'],
  ['VoiceOver macOS/iOS', 'PREUVE MANQUANTE'],
  ['Zoom navigateur natif 200/400 % final', 'PREUVE MANQUANTE'],
  ['Appareils tactiles physiques', 'PREUVE MANQUANTE'],
  ['Safari final', 'PREUVE MANQUANTE'],
  ['CWV représentatifs', 'PREUVE MANQUANTE'],
  ["Installation PWA manuelle sur appareil", 'PREUVE MANQUANTE'],
  ['Validation juridique / droits / licences', 'PREUVE MANQUANTE'],
  ['Master Nova Design Intelligence complète', 'PREUVE MANQUANTE']
]);

const tableLines = ledger.split(/\r?\n/).filter(line => line.startsWith('|'));
for (const [label, state] of expectedOpen) {
  const line = tableLines.find(item => item.startsWith('| ' + label + ' |'));
  assert.ok(line, 'anti-forget open item missing: ' + label);
  assert.ok(line.includes('**' + state), 'anti-forget state changed without gate update: ' + label);
}

const byId = new Map(readiness.capabilities.map(item => [item.id, item]));
assert.equal(byId.get('game-hubs.gta6-rdr2')?.state, 'contract-ready');
assert.equal(byId.get('game-corpus.gta6-rdr2')?.state, 'blocked-inputs');
assert.equal(byId.get('accounts.profiles')?.state, 'not-connected');
assert.equal(byId.get('distribution.artifacts')?.state, 'distribution-locked');
assert.equal(byId.get('integrations.guide-os-bridge')?.state, 'not-connected');

assert.ok(checkpoint.includes('## Mise à jour canonique — PR #81 / #82 — readiness + SEO — 20 septembre 2026'));
assert.ok(checkpoint.includes('## Mise à jour canonique — Provider DEV réel — 21 septembre 2026'));
assert.ok(checkpoint.includes('TERMINÉ — Provider DEV réel et micro-proofs bout-en-bout ciblés'));
assert.ok(checkpoint.includes('## Mise à jour canonique — PR #118 — sitemap complet — 21 septembre 2026'));
assert.ok(checkpoint.includes('TERMINÉ — sitemap MODARYX complet sur les 22 canonicals indexables'));
assert.ok(checkpoint.includes('## Mise à jour canonique — micro-preuve profil public DEV — 21 septembre 2026'));
assert.ok(checkpoint.includes('TERMINÉ — parcours profil public DEV bout-en-bout ciblé'));
assert.ok(checkpoint.includes('## Mise à jour canonique — PR #121 à #123 — modération, publication et recours — 21 septembre 2026'));
assert.ok(checkpoint.includes('TERMINÉ — moteur modération / publication / recours en code avec preuves ciblées'));
assert.ok(checkpoint.includes('5403b265f3fd3300960db476ffbbe9bce1f0649c'));
assert.ok(checkpoint.includes('## Mise à jour canonique — activation DEV modération / publication / recours — 21 septembre 2026'));
assert.ok(checkpoint.includes('TERMINÉ — activation fournisseur DEV réelle du moteur modération / publication / recours avec micro-preuves bout-en-bout ciblées'));
assert.ok(checkpoint.includes('70c023a15525def9ead6ac8b6787389e7e6a62de'));
assert.ok(checkpoint.includes('moderator-permission-required'));
assert.ok(checkpoint.includes('appeals-review-permission-required'));
assert.ok(checkpoint.includes('## Mise à jour canonique — PR #126 — préparation multi-rôle des écarts pré-VF — 21 septembre 2026'));
assert.ok(checkpoint.includes('PASS_TARGETED_PASSKEY_PROVIDER_READINESS'));
assert.ok(checkpoint.includes('PASS_TARGETED_SIGNATURE_ATTESTATION_CONTRACT'));
assert.ok(checkpoint.includes('PASS_TARGETED_GUIDE_OS_BRIDGE_CONTRACTS'));
assert.ok(checkpoint.includes('35606102721'));
assert.ok(checkpoint.includes('a63684d7ffc6d4cebd86926b8bf252e258624f84'));
assert.ok(checkpoint.includes('## Mise à jour canonique — PR #128 — moteurs de confiance pré-VF — 21 septembre 2026'));
assert.ok(checkpoint.includes('PASS_TARGETED_SIGNATURE_VERIFICATION_ENGINE'));
assert.ok(checkpoint.includes('PASS_TARGETED_STORAGE_REPAIR_DECISION_ENGINE'));
assert.ok(checkpoint.includes('PASS_TARGETED_INTEGRATION_CONSENT_ENGINE'));
assert.ok(checkpoint.includes('35607369026'));
assert.ok(checkpoint.includes('cd21d60f2ee6dc00b3b70f2bd46a616e4d52fa30'));
assert.ok(checkpoint.includes('## Mise à jour canonique — batch Super Nova passkey / trust / transport — 21 septembre 2026'));
assert.ok(checkpoint.includes('PREUVE MANQUANTE — cérémonie WebAuthn réelle sur appareil compatible, reconnexion, récupération et révocation'));
assert.ok(checkpoint.includes('PASS_TARGETED_TRUSTED_SIGNER_GATE'));
assert.ok(checkpoint.includes('PASS_TARGETED_STORAGE_TRANSPORT_PRIMITIVE'));
assert.ok(checkpoint.includes('35610823157'));
assert.ok(checkpoint.includes('d0be675e86b51174b834f6764fbbce40f56b67a9'));
assert.ok(checkpoint.includes('Aucune VF / aucun 100 % déclaré.'));
assert.ok(checkpoint.includes('## Mise à jour canonique — PR #131 — runtime multi-lane confiance / réparation / découverte — 21 septembre 2026'));
assert.ok(checkpoint.includes('PASS_TARGETED_DISTRIBUTION_TRUST_CHAIN'));
assert.ok(checkpoint.includes('PASS_TARGETED_STORAGE_REPAIR_ORCHESTRATOR'));
assert.ok(checkpoint.includes('PASS_TARGETED_INTEGRATION_DISCOVERY_RUNTIME'));
assert.ok(checkpoint.includes('35630267754'));
assert.ok(checkpoint.includes('cb5ecbac68a88a6feb1f0fe516b12f0349284d4a'));
assert.ok(checkpoint.includes('89e31e938b2eec2b6e3af3ea5679ead1d2b770a2'));
assert.ok(checkpoint.includes('## Mise à jour canonique — PR #132 — durcissement résilience runtime — 21 septembre 2026'));
assert.ok(checkpoint.includes('PASS_TARGETED_RUNTIME_RESILIENCE_HARDENING'));
assert.ok(checkpoint.includes('35631864195'));
assert.ok(checkpoint.includes('9bd769e927bc07ff5ea2cd40054cfdec0c30f610'));
assert.ok(checkpoint.includes('a8a544dc8a6d8b4c435d3d2acf56d9988141bbfd'));
assert.ok(checkpoint.includes('Full replay unique uniquement à la toute fin.'));

const openRows = tableLines.filter(line => /\*\*(?:EN COURS|BLOQUÉ|PREUVE MANQUANTE)/.test(line));
console.log(JSON.stringify({
  marker:'PASS_TARGETED_ANTI_OUBLI_GATE',
  result:'PASS',
  currentRoutes:23,
  readiness:{
    editorialHubs:byId.get('game-hubs.gta6-rdr2')?.state,
    gameCorpus:byId.get('game-corpus.gta6-rdr2')?.state
  },
  protectedOpenItems:[...expectedOpen.keys()],
  openRows:openRows.length,
  failures:[]
},null,2));
