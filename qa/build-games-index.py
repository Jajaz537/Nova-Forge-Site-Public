"""Build the public games directory from the existing demonstration catalogue."""
from pathlib import Path
from html import escape
import json, re, sys
ROOT = Path(__file__).resolve().parents[1]
payload = json.loads((ROOT/'data/catalog.json').read_text())
assert payload['schemaVersion'] == 1 and payload['dataClass'] == 'demonstration'
games = {}
for item in payload['items']:
    if item.get('public') is not True:
        continue
    game = item['game']
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', game['id'])
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['id'])
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
source = (ROOT/'project.html').read_text()
source = source.replace('Fiches des trois projets de démonstration MODARYX MODS.', 'Les jeux représentés dans le catalogue de démonstration MODARYX MODS et leurs fiches.')
source = source.replace('<title>Projets —', '<title>Jeux —').replace('href="./','href="../').replace('src="./','src="../')
start, end = source.index('  <main '), source.index('  </main>') + len('  </main>')
main = '''  <main id="main" class="project-page">
    <nav class="page-trail" aria-label="Fil d’Ariane"><a href="../index.html">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">Jeux</span></nav>
    <section class="section games-intro" aria-labelledby="games-title"><div><p class="eyebrow">Les univers du catalogue</p><h1 id="games-title">Un jeu. Vos prochaines explorations.</h1><p class="section-intro">Retrouvez les jeux représentés dans nos fiches de démonstration. Ces projets illustrent les outils MODARYX : ils ne constituent ni des fichiers distribués, ni une compatibilité testée.</p></div><figure class="games-art"><img src="../assets/modaryx-world-portals.webp" width="1200" height="675" alt="" decoding="async"><figcaption>Univers visuel MODARYX · illustration d’ambiance</figcaption></figure></section>
    <section class="project-grid project-directory" aria-label="Jeux représentés">'''+''.join(parts)+'''</section>
    <section class="section" aria-labelledby="games-next"><p class="eyebrow">Explorer en confiance</p><h2 id="games-next">Choisir une fiche, comprendre ses limites.</h2><p class="section-intro">Le catalogue permet de comparer les types de projets et leurs niveaux de preuve. Un jeu présent ici n’implique aucun partenariat avec son éditeur.</p><div class="actions"><a class="button" href="../catalog.html">Filtrer le catalogue</a><a class="button" href="../security.html">Comprendre les preuves</a></div></section>
  </main>'''
source = source[:start] + main + source[end:]
if '--check' in sys.argv:
    assert (ROOT/'games/index.html').read_text() == source, 'Regenerate with python3 qa/build-games-index.py'
else:
    (ROOT/'games').mkdir(exist_ok=True)
    (ROOT/'games/index.html').write_text(source)
print(f'{len(games)} jeux, {sum(len(g["items"]) for g in games.values())} fiches : games/index.html')
