"""Exercise the actual generator in isolated temporary directories."""
from pathlib import Path
import copy, json, shutil, subprocess, sys, tempfile
ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
checks = []
def run(payload, valid=True):
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        for name in ['qa','data','games']:
            (root/name).mkdir()
        shutil.copy(ROOT/'qa/build-games-index.py', root/'qa/build-games-index.py')
        shutil.copy(ROOT/'project.html', root/'project.html')
        (root/'data/catalog.json').write_text(json.dumps(payload), encoding='utf-8')
        target = root/'games/index.html'
        target.write_text('existing page', encoding='utf-8')
        result = subprocess.run([sys.executable, str(root/'qa/build-games-index.py')], capture_output=True, text=True, encoding='utf-8')
        if not valid:
            assert result.returncode != 0, 'Invalid data unexpectedly published'
            assert target.read_text(encoding='utf-8') == 'existing page', 'Invalid generation overwrote prior output'
            return ''
        assert result.returncode == 0, result.stderr
        html = target.read_text(encoding='utf-8')
        check = subprocess.run([sys.executable, str(root/'qa/build-games-index.py'), '--check'], capture_output=True)
        assert check.returncode == 0
        target.write_text(html+'drift', encoding='utf-8')
        check = subprocess.run([sys.executable, str(root/'qa/build-games-index.py'), '--check'], capture_output=True)
        assert check.returncode != 0 and target.read_text(encoding='utf-8') == html+'drift'
        return html
html = run(data)
assert html.count('1 fiche de démonstration') == 3
checks.append('Current catalogue generates three groups; check mode detects drift without modifying output')
payload = copy.deepcopy(data)
payload['items'].append({'public':False,'name':'PRIVATE-SENTINEL'})
assert 'PRIVATE-SENTINEL' not in run(payload)
checks.append('Private incomplete record is excluded from public output')
payload = copy.deepcopy(data)
payload['items'][0]['name'] = '<img src=x onerror=alert(1)>'
html = run(payload)
assert '&lt;img src=x onerror=alert(1)&gt;' in html and '<img src=x onerror' not in html
checks.append('Project display name is escaped as text')
payload = copy.deepcopy(data)
payload['items'].append(copy.deepcopy(payload['items'][0]))
run(payload, False)
checks.append('Duplicate project ID rejects generation and preserves the existing page')
for mutation in ['empty','path','download','game-conflict']:
    payload = copy.deepcopy(data)
    if mutation == 'empty': payload['items'] = []
    elif mutation == 'path': payload['items'][0]['id'] = '../outside'
    elif mutation == 'download': payload['items'][0]['distribution']['downloadable'] = True
    else: payload['items'][1]['game']['id'] = payload['items'][0]['game']['id']
    run(payload, False)
checks.append('Empty catalogue, invalid path, downloadable record and conflicting game identity preserve prior page')
report = {'result':'PASS','scope':'Five grouped isolated source scenarios; not browser proof','checks':checks}
(ROOT/'qa/games-generator-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n', encoding='utf-8', newline='\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
