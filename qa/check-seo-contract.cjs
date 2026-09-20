'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
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
  'games/index.html',
  'gta-6/index.html',
  'gta-6/mods/index.html',
  'gta-6/guides/index.html',
  'red-dead-redemption-2/index.html',
  'red-dead-redemption-2/mods/index.html',
  'red-dead-redemption-2/guides/index.html',
  '404.html'
];

const expectedGuardedSitemapGaps = new Set();

const one = (html, pattern, label, file) => {
  const matches = [...html.matchAll(pattern)];
  assert.equal(matches.length, 1, `${file}: expected exactly one ${label}, got ${matches.length}`);
  return matches[0][1].trim();
};

const expectedCanonical = file => {
  if (file === 'index.html') return 'https://modaryxmods.com/';
  if (file.endsWith('/index.html')) return 'https://modaryxmods.com/' + file.slice(0, -'index.html'.length);
  return 'https://modaryxmods.com/' + file.replace(/\.html$/, '');
};

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const observations = [];

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.match(html, /<html\b[^>]*\blang=["']fr["']/i, `${file}: html lang must be fr`);

  const title = one(html, /<title>([\s\S]*?)<\/title>/gi, 'title', file);
  assert.ok(title.length >= 8, `${file}: title too short`);
  assert.match(title, /MODARYX MODS/i, `${file}: title must identify MODARYX MODS`);

  if (file === '404.html') {
    const robots = one(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["'][^>]*>/gi, 'robots meta', file).toLowerCase();
    assert.ok(robots.includes('noindex') && robots.includes('nofollow'), '404.html: robots must be noindex,nofollow');
    assert.equal([...html.matchAll(/<link\s+rel=["']canonical["'][^>]*>/gi)].length, 0, '404.html: canonical must remain absent');
    observations.push({file, indexable:false, title, robots});
    continue;
  }

  assert.equal([...html.matchAll(/<meta\s+name=["']robots["'][^>]*>/gi)].length, 0, `${file}: indexable page must not declare a robots override`);
  const description = one(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/gi, 'meta description', file);
  assert.ok(description.length >= 50, `${file}: description too short`);
  const canonical = one(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi, 'canonical', file);
  assert.equal(canonical, expectedCanonical(file), `${file}: canonical mismatch`);

  assert.ok(!titles.has(title), `${file}: duplicate title with ${titles.get(title)}`);
  assert.ok(!descriptions.has(description), `${file}: duplicate description with ${descriptions.get(description)}`);
  assert.ok(!canonicals.has(canonical), `${file}: duplicate canonical with ${canonicals.get(canonical)}`);
  titles.set(title, file);
  descriptions.set(description, file);
  canonicals.set(canonical, file);
  observations.push({file,indexable:true,title,descriptionLength:description.length,canonical});
}

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /^User-agent:\s*\*$/mi);
assert.match(robots, /^Allow:\s*\/$/mi);
assert.doesNotMatch(robots, /^Disallow:\s*\/$/mi);

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/modaryxmods\.com\/[^<]*)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'sitemap: duplicate loc');
for (const url of sitemapUrls) assert.ok(canonicals.has(url), `sitemap: URL has no matching live canonical: ${url}`);

const missingFromSitemap = [...canonicals.keys()].filter(url => !sitemapUrls.includes(url)).sort();
const expectedMissing = [...expectedGuardedSitemapGaps].sort();
assert.deepEqual(missingFromSitemap, expectedMissing, 'sitemap must list every live canonical');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_SEO_CONTRACT',
  result:'PASS',
  pages:pages.length,
  indexablePages:canonicals.size,
  noindexPages:1,
  uniqueTitles:titles.size,
  uniqueDescriptions:descriptions.size,
  uniqueCanonicals:canonicals.size,
  robots:{allowRoot:true},
  sitemap:{listed:sitemapUrls.length,complete:missingFromSitemap.length===0,missing:missingFromSitemap},
  failures:[]
},null,2));
