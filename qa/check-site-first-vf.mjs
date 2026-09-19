import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const failures = [];
const pages = [
  'index.html',
  'catalog.html',
  'search.html',
  'creator-studio.html',
  'community.html',
  'profiles.html',
  'ecosystem.html',
  'documentation.html',
  'security.html',
  'verify.html',
  'downloads.html',
  'project.html',
  'project-ember-textures.html',
  'project-balanced-latency-pack.html',
  'project-forge-night-experience.html',
  '404.html',
  'games/index.html'
];

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const hashFile = (relativePath) => crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(root, relativePath)))
  .digest('hex');

const fail = (message) => failures.push(message);

function normalizeLocalReference(page, raw) {
  if (!raw || raw.startsWith('#')) return null;
  if (/^(?:https?:|mailto:|tel:|data:|javascript:|blob:|\/\/)/i.test(raw)) return null;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) return null;
  const base = new URL(page, 'https://modaryx.example/');
  const resolved = new URL(clean, base);
  if (resolved.origin !== 'https://modaryx.example') return null;
  return decodeURIComponent(resolved.pathname.replace(/^\//, ''));
}

function referenceExists(relativePath) {
  if (!relativePath) return true;
  const absolute = path.join(root, relativePath);
  if (fs.existsSync(absolute)) return true;
  return fs.existsSync(path.join(absolute, 'index.html'));
}

function attr(tag, name) {
  const match = tag.match(new RegExp('\\s' + name + '=["\\\']([^"\\\']*)["\\\']', 'i'));
  return match ? match[1] : null;
}

function visibleText(fragment) {
  return fragment
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const page of pages) {
  if (!exists(page)) {
    fail('missing public page: ' + page);
    continue;
  }

  const html = read(page);
  const nested = page.includes('/');
  const shellRef = nested ? '../assets/shell.js' : './assets/shell.js';
  const foundationRef = nested ? '../assets/modaryx-foundations.css' : './assets/modaryx-foundations.css';
  const cinematicRef = nested ? '../assets/modaryx-cinematic-system.css' : './assets/modaryx-cinematic-system.css';

  if (!html.includes('<meta charset="utf-8">')) fail(page + ': charset missing');
  if (!html.includes('name="viewport"')) fail(page + ': viewport missing');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(page + ': title missing');
  if (!html.includes('class="skip-link"')) fail(page + ': skip link missing');
  if (!html.includes('id="main"')) fail(page + ': main landmark id missing');
  if (!html.includes('class="site-footer"')) fail(page + ': shared footer missing');
  if (!html.includes(shellRef)) fail(page + ': shell.js missing');
  if (!html.includes(foundationRef)) fail(page + ': modaryx-foundations.css missing');
  if (page !== 'index.html' && !html.includes(cinematicRef)) fail(page + ': modaryx-cinematic-system.css missing');
  if (/\bModaryx OS\b/i.test(html)) fail(page + ': deprecated visible product label "Modaryx OS"');

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) fail(page + ': expected exactly one h1, found ' + h1Count);

  const idValues = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const idSet = new Set();
  for (const id of idValues) {
    if (idSet.has(id)) fail(page + ': duplicate id ' + id);
    idSet.add(id);
  }

  const labelFors = new Set(
    [...html.matchAll(/<label\b[^>]*\sfor=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1])
  );
  const wrappedControlIds = new Set(
    [...html.matchAll(/<label\b[^>]*>[\s\S]*?<(?:input|select|textarea)\b[^>]*\sid=["']([^"']+)["'][^>]*>[\s\S]*?<\/label>/gi)]
      .map((match) => match[1])
  );

  for (const img of html.match(/<img\b[^>]*>/gi) || []) {
    if (!/\salt=["'][^"']*["']/i.test(img)) {
      fail(page + ': img missing alt attribute: ' + img.slice(0, 120));
    }
  }

  for (const button of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) || []) {
    const opening = button.match(/^<button\b[^>]*>/i)?.[0] || '';
    if (!attr(opening, 'aria-label') && !visibleText(button)) {
      fail(page + ': button without accessible text');
    }
  }

  for (const anchor of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || []) {
    const opening = anchor.match(/^<a\b[^>]*>/i)?.[0] || '';
    if (!attr(opening, 'aria-label') && !visibleText(anchor)) {
      fail(page + ': link without accessible text');
    }
  }

  for (const ariaName of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
    const regex = new RegExp('\\s' + ariaName + '=["\\\']([^"\\\']+)["\\\']', 'gi');
    for (const match of html.matchAll(regex)) {
      const targets = match[1].trim().split(/\s+/).filter(Boolean);
      for (const target of targets) {
        if (!idSet.has(target)) fail(page + ': ' + ariaName + ' references missing id ' + target);
      }
    }
  }

  for (const control of html.match(/<(?:input|select|textarea)\b[^>]*>/gi) || []) {
    const id = attr(control, 'id');
    const type = attr(control, 'type');
    if (!id || type === 'hidden') continue;
    const labelled = attr(control, 'aria-label') || attr(control, 'aria-labelledby');
    if (!labelled && !labelFors.has(id) && !wrappedControlIds.has(id)) {
      fail(page + ': form control #' + id + ' has no explicit or wrapping label');
    }
  }

  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const raw of refs) {
    const local = normalizeLocalReference(page, raw);
    if (local && !referenceExists(local)) {
      fail(page + ': missing local reference ' + raw + ' -> ' + local);
    }
  }
}

const shell = read('assets/shell.js');
new Function(shell);
if (!shell.includes('MODARYX MODS et Nova Forge OS sont deux produits distincts créés par la même équipe.')) {
  fail('shared shell: same-team product relationship missing');
}
if (!shell.includes('data-product-family-note') && !shell.includes('productFamilyNote')) {
  fail('shared shell: product-family de-duplication hook missing');
}

const ecosystem = read('ecosystem.html');
if (!ecosystem.includes('id="family"')) fail('ecosystem: same-team section missing');
if (!ecosystem.includes('Même équipe · produits distincts')) fail('ecosystem: same-team heading missing');
if (!ecosystem.includes('MODARYX MODS et Nova Forge OS sont créés par la même équipe, mais restent deux produits séparés.')) {
  fail('ecosystem: explicit brand separation copy missing');
}

const foundations = read('assets/modaryx-foundations.css');
for (const guard of [
  'html,body{max-width:100%;overflow-x:clip}',
  '@media(max-width:400px)',
  '@media(forced-colors:active)',
  '@media(prefers-reduced-transparency:reduce)',
  'white-space:pre-wrap',
  'overflow-wrap:anywhere'
]) {
  if (!foundations.includes(guard)) fail('foundations: reflow/contrast guard missing: ' + guard);
}

const cinematic = read('assets/modaryx-cinematic-system.css');
if (!cinematic.includes('top:calc(var(--modaryx-header-height,76px) + 8px)')) {
  fail('cinematic system: sticky section nav does not follow measured header height');
}
if (!cinematic.includes('@media(hover:hover) and (pointer:fine)')) {
  fail('cinematic system: hover elevation is not restricted to precise hover devices');
}
if (!cinematic.includes('.card:focus-within')) fail('cinematic system: keyboard focus-within premium state missing');
if (!cinematic.includes('-webkit-backdrop-filter')) fail('cinematic system: Safari backdrop-filter fallback missing');
if (!cinematic.includes('-webkit-mask-image')) fail('cinematic system: Safari mask-image fallback missing');
if (!cinematic.includes('overscroll-behavior-inline:contain')) {
  fail('cinematic system: mobile section-nav overscroll containment missing');
}

const living = JSON.parse(read('data/living-world.json'));
const expectedStages = ['baby', 'juvenile', 'adolescent', 'young-adult', 'adult'];
if (living?.growthModel?.order?.join('|') !== expectedStages.join('|')) {
  fail('living world: canonical shared stage order mismatch');
}
if (living?.growthModel?.pace !== 'independent-per-species') {
  fail('living world: independent pacing contract missing');
}
for (const phase of living?.dayPhases || []) {
  if (typeof phase?.activity !== 'string' || !phase.activity.trim()) {
    fail('living world: phase activity label missing for ' + (phase?.id || 'unknown'));
  }
}
for (const inhabitant of living?.inhabitants || []) {
  const order = (inhabitant?.stages || []).map((stage) => stage?.id);
  if (order.join('|') !== expectedStages.join('|')) {
    fail('living world: ' + (inhabitant?.id || 'unknown') + ' stage order mismatch');
  }
  for (let i = 1; i < (inhabitant?.stages || []).length; i += 1) {
    if (!(inhabitant.stages[i].fromDay > inhabitant.stages[i - 1].fromDay)) {
      fail('living world: ' + (inhabitant?.id || 'unknown') + ' thresholds are not strictly increasing');
    }
  }
}

const livingJs = read('assets/living-world.js');
new Function(livingJs);
if (!livingJs.includes("config?.clock?.model === 'shared-world-utc'")) {
  fail('living world: shared UTC clock model is not handled by the engine');
}
if (!livingJs.includes('now.getUTCHours()')) {
  fail('living world: shared UTC phase does not use UTC hours');
}
if (!livingJs.includes('nextStageNodes') || !livingJs.includes('daysUntilNext')) {
  fail('living world: visible companion growth milestones are not wired');
}
const utcProbe = new Date('2026-09-19T23:30:00Z');
if (utcProbe.getUTCHours() !== 23) fail('living world proof: UTC probe is not deterministic');

const livingCss = read('assets/living-world.css');
if (!livingCss.includes('prefers-reduced-motion')) fail('living world: prefers-reduced-motion guard missing');
if (!livingCss.includes('html[data-motion=reduced]')) fail('living world: explicit reduced-motion guard missing');
if (!livingCss.includes('.world-growth-next')) fail('living world: visible growth milestone style missing');
if (!livingCss.includes('transition:filter 2.4s ease')) fail('living world: phase filter transition missing');

const index = read('index.html');
for (const hook of [
  'data-world-phase',
  'data-world-age',
  'data-world-inhabitant="wolf"',
  'data-world-inhabitant="dragon"',
  'data-world-next="wolf"',
  'data-world-next="dragon"',
  'data-world-status'
]) {
  if (!index.includes(hook)) fail('index: living-world hook missing: ' + hook);
}
if (!index.includes('data-world-status role="status" aria-live="polite"')) {
  fail('index: living-world status is not exposed as a polite live status');
}

const sw = read('sw.js');
if (!sw.includes('const MAX_RUNTIME_ENTRIES = 80')) {
  fail('service worker: runtime entry cap is not 80');
}
if (!sw.includes("'./data/living-world.json'")) {
  fail('service worker: living-world data is not in fresh public paths');
}

const precacheStart = sw.indexOf('const PRECACHE_PATHS');
const freshStart = sw.indexOf('const FRESH_PUBLIC_PATHS');
const precacheSection = sw.slice(precacheStart, freshStart);
if (precacheStart < 0 || freshStart < 0 || !precacheSection.startsWith('const PRECACHE_PATHS')) {
  fail('service worker: PRECACHE_PATHS section missing');
}

for (const heavy of ['./assets/modaryx-wolf-dragon-hero.webp', './assets/modaryx-world-portals.webp']) {
  if (precacheSection.includes("'" + heavy + "'")) {
    fail('service worker: heavyweight art returned to install precache: ' + heavy);
  }
}

const precacheRequests = [...precacheSection.matchAll(/'\.\/([^']*)'/g)]
  .map((match) => match[1] || 'index.html');
const precacheFiles = [...new Set(precacheRequests.map((item) => item === '' ? 'index.html' : item))];
let precacheBytes = 0;
for (const relativePath of precacheFiles) {
  if (!exists(relativePath)) {
    fail('service worker: precache file missing: ' + relativePath);
    continue;
  }
  precacheBytes += fs.statSync(path.join(root, relativePath)).size;
}
if (precacheBytes > 800000) {
  fail('service worker: precache budget exceeded: ' + precacheBytes + ' > 800000');
}

const checksumLines = read('SHA256SUMS.txt')
  .split(/\r?\n/)
  .map((line) => line.trimEnd())
  .filter(Boolean);

let checksumCount = 0;
const checksumPaths = new Set();
for (const line of checksumLines) {
  const match = line.match(/^([0-9a-f]{64})\s{2}(.+)$/);
  if (!match) {
    fail('SHA256SUMS: malformed line: ' + line);
    continue;
  }

  const expected = match[1];
  const rawPath = match[2];
  const relativePath = rawPath.replace(/^\.\//, '');

  if (checksumPaths.has(relativePath)) {
    fail('SHA256SUMS: duplicate normalized path ' + relativePath);
  }
  checksumPaths.add(relativePath);

  if (!exists(relativePath)) {
    fail('SHA256SUMS: listed file missing: ' + rawPath);
    continue;
  }

  const actual = hashFile(relativePath);
  if (actual !== expected) {
    fail('SHA256SUMS: mismatch ' + rawPath + ' expected=' + expected + ' actual=' + actual);
  }
  checksumCount += 1;
}

const result = {
  marker: failures.length ? 'FAIL_TARGETED_SITE_FIRST_SOURCE_PROOF' : 'PASS_TARGETED_SITE_FIRST_SOURCE_PROOF',
  pages: pages.length,
  structuralA11yChecks: true,
  checksumCount,
  precacheUniqueFiles: precacheFiles.length,
  precacheRequests: precacheRequests.length,
  precacheBytes,
  precacheBudget: 800000,
  precacheMargin: 800000 - precacheBytes,
  runtimeEntryCap: 80,
  livingWorldStages: expectedStages,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
