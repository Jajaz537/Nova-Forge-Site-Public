import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE = 'https://modaryxmods.com';
const INDEXABLE = [
  'index.html',
  'catalog.html',
  'community.html',
  'creator-studio.html',
  'documentation.html',
  'downloads.html',
  'ecosystem.html',
  'profiles.html',
  'project.html',
  'project-balanced-latency-pack.html',
  'project-ember-textures.html',
  'project-forge-night-experience.html',
  'search.html',
  'security.html',
  'verify.html',
  'games/index.html'
];

const failures = [];
const pages = [];

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function capture(html, re) {
  return html.match(re)?.[1]?.trim() || '';
}

function fail(message) {
  failures.push(message);
}

for (const relative of INDEXABLE) {
  const html = read(relative);
  const title = capture(html, /<title>([^<]+)<\/title>/i);
  const description = capture(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i);
  const canonical = capture(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
  const ogUrl = capture(html, /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["'][^>]*>/i);

  if (!title) fail(relative + ': missing title');
  if (!description) fail(relative + ': missing meta description');
  if (!canonical.startsWith(BASE + '/')) fail(relative + ': canonical outside MODARYX domain or missing: ' + canonical);
  if (canonical !== ogUrl) fail(relative + ': canonical / og:url mismatch');
  pages.push({relative, title, description, canonical, ogUrl});
}

const canonicals = pages.map((page) => page.canonical);
if (new Set(canonicals).size !== canonicals.length) {
  fail('duplicate canonical URL detected');
}

const sitemap = read('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
if (new Set(sitemapUrls).size !== sitemapUrls.length) {
  fail('sitemap contains duplicate URLs');
}

const expected = new Set(canonicals);
const actual = new Set(sitemapUrls);
for (const url of expected) {
  if (!actual.has(url)) fail('sitemap missing canonical: ' + url);
}
for (const url of actual) {
  if (!expected.has(url)) fail('sitemap exposes URL without an indexable page contract: ' + url);
}

const notFound = read('404.html');
if (!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(notFound)) {
  fail('404.html: noindex robots directive missing');
}
if (/<link\s+rel=["']canonical["']/i.test(notFound)) {
  fail('404.html: must not publish a canonical URL');
}

const robots = read('robots.txt');
if (!/^User-agent:\s*\*$/mi.test(robots) || !/^Allow:\s*\/$/mi.test(robots)) {
  fail('robots.txt: public crawling contract drifted');
}

const result = {
  marker: failures.length ? 'FAIL_TARGETED_SEO_SURFACE' : 'PASS_TARGETED_SEO_SURFACE',
  indexablePages: pages.length,
  sitemapUrls: sitemapUrls.length,
  gamesIndexed: sitemapUrls.includes(BASE + '/games/'),
  pages,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
