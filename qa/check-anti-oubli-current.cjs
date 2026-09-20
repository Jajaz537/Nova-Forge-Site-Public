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
  'Storage Resolver | **EN COURS — contrat acquis, service non connecté**',
  'Repair Network | **EN COURS — protocole contractuel acquis, exécution distante non connectée**',
  'PASS_TARGETED_STORAGE_REPAIR_CONTRACTS',
  'Signatures / attestations de provenance | **EN COURS — contrats provenance acquis, signer/attestation réel non connecté**',
  'PASS_TARGETED_PROVENANCE_RECEIPT_CONTRACTS',
  'Comptes / authentification / passkeys réels | **EN COURS — login/callback/session DEV réels prouvés ; passkey finale non prouvée**',
  'Profils publics éditables | **TERMINÉ — parcours DEV bout-en-bout ciblé**',
  'Publication / modération distante | **EN COURS — moteur complet codé/prouvé ; activation fournisseur DEV restante**',
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
  'Backend communautaire | **EN COURS — Provider DEV + writes réels ; moteur modération/recours codé, activation réelle restante**',
  'Endpoints profils / communauté distants | **TERMINÉ — code + micro-proofs provider DEV**',
  'PASS_TARGETED_REMOTE_WRITE_ENDPOINTS',
  'MODARYX-REMOTE-WRITE-ENDPOINTS-20260920.md',
  'Flux Auth0 BFF / session | **TERMINÉ — code + preuve provider DEV ciblée**',
  'PASS_TARGETED_AUTH_BFF_SESSION',
  'MODARYX-AUTH-BFF-SESSION-20260920.md',
  'UI compte / profil premium | **TERMINÉ — preuve ciblée de code**',
  'PASS_TARGETED_PROFILES_ACCOUNT_UI',
  'MODARYX-PROFILES-ACCOUNT-UI-20260920.md',
  'UI communauté distante modérée | **TERMINÉ — preuve ciblée de code**',
  'PASS_TARGETED_COMMUNITY_REMOTE_UI',
  'MODARYX-COMMUNITY-REMOTE-UI-20260920.md',
  'Provider DEV réel + micro-proofs bout-en-bout | **TERMINÉ — périmètre profils + ingestion communautaire**',
  'Moteur modération / publication / recours | **TERMINÉ — code + preuves ciblées ; provider réel restant**',
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
  'Sitemap des routes jeux/hubs | **EN COURS — garde explicite**'
];
for (const token of forbiddenCurrent) assert.ok(!ledger.includes(token), 'stale current state returned: ' + token);

const expectedOpen = new Map([
  ['Météo réelle production', 'BLOQUÉ'],
  ['Validation artistique humaine finale', 'PREUVE MANQUANTE'],
  ['Comptes / authentification / passkeys réels', 'EN COURS'],
  ['Publication / modération distante', 'EN COURS'],
  ['Signatures / attestations de provenance', 'EN COURS'],
  ['Téléchargements publics réels', 'BLOQUÉ'],
  ['Corpus réels de mods GTA VI / RDR2', 'EN COURS'],
  ['Storage Resolver', 'EN COURS'],
  ['Repair Network', 'EN COURS'],
  ['Backend communautaire', 'EN COURS'],
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
assert.ok(checkpoint.includes('Aucune VF / aucun 100 % déclaré.'));
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
