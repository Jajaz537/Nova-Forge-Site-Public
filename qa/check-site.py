"""Dependency-free structural checks. Does not replace browser or accessibility QA."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, hashlib, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(ROOT/'qa/build-games-index.py'), '--check'], check=True, stdout=subprocess.DEVNULL)
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.tags=[]; self.stack=[]; self.feed(path.read_text())
    def handle_starttag(self, name, attrs):
        values=dict(attrs)
        if name in ('input','select','textarea') and 'label' in self.stack: values['_wrapped_label']=True
        self.tags.append((name,values))
        if name not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'): self.stack.append(name)
    def handle_endtag(self, name):
        if name in self.stack: self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(name)]

public_paths=[p for p in ROOT.glob('*.html') if p.stem not in ('review','comparison')]+list((ROOT/'games').rglob('*.html'))+list((ROOT/'gta-6').rglob('*.html'))+list((ROOT/'red-dead-redemption-2').rglob('*.html'))
pages={str(p.relative_to(ROOT)):Page(p) for p in public_paths}
search_entries=json.loads((ROOT/'data/search-index.json').read_text())['entries']
search_links=[a.get('href') for t,a in pages['search.html'].tags if t=='a' and a.get('class')=='search-result']
assert len(search_links)==len(set(search_links)), 'Duplicate static search entries'
assert set(search_links)=={entry['href'] for entry in search_entries}, 'Static search fallback differs from index'
report=[]
for name,page in sorted(pages.items()):
    errors=[]; ids=[a['id'] for _,a in page.tags if 'id' in a]
    if len(ids)!=len(set(ids)): errors.append('Duplicate IDs')
    if sum(t=='h1' for t,_ in page.tags)!=1: errors.append('Expected one h1')
    if sum(t=='main' for t,_ in page.tags)!=1: errors.append('Expected one main')
    labels={a.get('for') for t,a in page.tags if t=='label'}
    for tag,attrs in page.tags:
        if tag in ('input','select','textarea') and attrs.get('type')!='hidden':
            if not(attrs.get('aria-label') or attrs.get('aria-labelledby') or attrs.get('_wrapped_label') or attrs.get('id') in labels): errors.append('Missing control label: '+str(attrs.get('id')))
        if tag=='img' and 'alt' not in attrs: errors.append('Image without alt')
        for key in ('href','src'):
            if key not in attrs: continue
            url=urlsplit(attrs[key])
            if url.scheme or url.netloc: continue
            target=((ROOT/name).parent/unquote(url.path)) if url.path else ROOT/name
            target=target.resolve()
            if target.is_dir():target=target/'index.html'
            if not target.exists():errors.append('Missing file: '+attrs[key]);continue
            target_key=str(target.relative_to(ROOT))
            if url.fragment and target_key in pages and not url.fragment.startswith('sha256='):
                if not any(a.get('id')==unquote(url.fragment) for _,a in pages[target_key].tags):errors.append('Missing anchor: '+attrs[key])
    report.append(dict(page=name,errors=errors))
scripts=[]
for p in sorted((ROOT/'assets').glob('*.js'))+[ROOT/'sw.js']:
    result=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    scripts.append(dict(file=str(p.relative_to(ROOT)),valid=result.returncode==0,error=result.stderr))
hash_errors=[];hash_count=0
for line in (ROOT/'SHA256SUMS.txt').read_text().splitlines():
    if not line.strip():continue
    digest,name=line.split(maxsplit=1);name=name.lstrip('*');hash_count+=1
    if hashlib.sha256((ROOT/name).read_bytes()).hexdigest()!=digest:hash_errors.append(name)
output=dict(scope='Static structure, JS syntax and declared file digests only',pages=report,scripts=scripts,hashes=dict(count=hash_count,errors=hash_errors))
print(json.dumps(output,ensure_ascii=False,indent=2))
raise SystemExit(bool(any(p['errors'] for p in report) or any(not s['valid'] for s in scripts) or hash_errors))
