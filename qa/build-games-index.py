"""Build the public games directory from the existing demonstration catalogue."""
from pathlib import Path
from html import escape
import json, re, sys
ROOT = Path(__file__).resolve().parents[1]
payload = json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
assert payload['schemaVersion'] == 1 and payload['dataClass'] == 'demonstration'
games = {}
project_ids = set()
for item in payload['items']:
    if item.get('public') is not True:
        continue
    game = item['game']
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', game['id'])
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['id'])
    if item['id'] in project_ids:
        raise ValueError('Duplicate public project ID: ' + item['id'])
    project_ids.add(item['id'])
    group = games.setdefault(game['id'], {'name': game['name'], 'items': []})
    assert group['name'] == game['name']
    assert item['distribution']['downloadable'] is False
    group['items'].append(item)
assert games, 'Do not publish an empty directory'
parts = []
for key, game in sorted(games.items(), key=lambda pair: pair[1]['name'].casefold()):
    count = len(game['items'])
    cards = ''.join(f'<li><a class="button" href="../project-{item["id"]}.html">{escape(item["name"])}</a></li>' for item in game['items'])
    parts.append(f'<article class="project-section" id="{key}"><p class="eyebrow">{count} fiche'+('s' if count != 1 else '')+f' de démonstration</p><h2>{escape(game["name"])}</h2><p>Consultez le projet, sa compatibilité déclarée et ses limites. Aucun fichier à télécharger.</p><ul class="game-projects">{cards}</ul></article>')
source = (ROOT/'project.html').read_text(encoding='utf-8')
source = source.replace('Fiches des trois projets de démonstration MODARYX MODS.', 'Jeux représentés dans le catalogue de démonstration et hubs éditoriaux GTA VI / Red Dead Redemption 2, sans fichiers distribués.')
source = source.replace('<title>Projets —', '<title>Jeux —', 1)
source = source.replace('</title>', '</title>\n  <link rel="canonical" href="https://modaryxmods.com/games/">', 1)
source = source.replace('href="./','href="../').replace('src="./','src="../')
start, end = source.index('  <main '), source.index('  </main>') + len('  </main>')
main = '''  <main id="main" class="project-page">
    <nav class="page-trail" aria-label="Fil d’Ariane"><a href="../index.html">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">Jeux</span></nav>
    <section class="section games-intro" aria-labelledby="games-title"><div><p class="eyebrow">Les univers du catalogue</p><h1 id="games-title">Un jeu. Vos prochaines explorations.</h1><p class="section-intro">Retrouvez les jeux représentés dans nos fiches de démonstration. Ces projets illustrent les outils MODARYX : ils ne constituent ni des fichiers distribués, ni une compatibilité testée.</p></div><figure class="games-art"><img src="../assets/modaryx-world-portals.webp" width="1200" height="675" alt="" loading="eager" fetchpriority="high" decoding="async"><figcaption>Univers visuel MODARYX · illustration d’ambiance</figcaption></figure></section>
    <section class="project-grid project-directory" aria-label="Jeux représentés">'''+''.join(parts)+'''</section>
    <section class="section" id="editorial-hubs" aria-labelledby="editorial-hubs-title"><div class="section-heading"><div><p class="eyebrow">Hubs éditoriaux sourcés</p><h2 id="editorial-hubs-title">Deux univers préparés sans faux catalogue.</h2></div><span class="badge">Sources officielles</span></div><p class="section-intro">Ces hubs apportent des repères, catégories et guides utiles. Ils n’ajoutent aucun fichier distribué et n’inventent aucune compatibilité absente des sources officielles.</p><div class="cards"><article class="card"><p class="card-kicker">À venir · 19 novembre 2026</p><h3>Grand Theft Auto VI</h3><p>Hub éditorial fondé sur les informations officielles Rockstar actuellement publiées ; aucun support PC ou mod n’est supposé.</p><a class="text-link" href="../gta-6/">Ouvrir le hub GTA VI →</a></article><article class="card"><p class="card-kicker">PC officiel</p><h3>Red Dead Redemption 2</h3><p>Hub PC avec taxonomie de mods, guides de préparation et distribution MODARYX explicitement fermée tant que le corpus autorisé manque.</p><a class="text-link" href="../red-dead-redemption-2/">Ouvrir le hub RDR2 →</a></article></div></section>
    <section class="section" aria-labelledby="games-next"><p class="eyebrow">Explorer en confiance</p><h2 id="games-next">Choisir une fiche, comprendre ses limites.</h2><p class="section-intro">Le catalogue permet de comparer les types de projets et leurs niveaux de preuve. Un jeu présent ici n’implique aucun partenariat avec son éditeur.</p><div class="actions"><a class="button" href="../catalog.html">Filtrer le catalogue</a><a class="button" href="../security.html">Comprendre les preuves</a></div></section>
  </main>'''
source = source[:start] + main + source[end:]
if '--check' in sys.argv:
    assert (ROOT/'games/index.html').read_text(encoding='utf-8') == source, 'Regenerate with python3 qa/build-games-index.py'
else:
    (ROOT/'games').mkdir(exist_ok=True)
    (ROOT/'games/index.html').write_text(source, encoding='utf-8', newline='\n')
print(f'{len(games)} jeux, {sum(len(g["items"]) for g in games.values())} fiches : games/index.html')
