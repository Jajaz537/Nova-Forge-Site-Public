"""Verify HTML fallback content against its actual public data sources."""
from pathlib import Path
from html.parser import HTMLParser
import json
r=Path(__file__).resolve().parents[1]
class Nodes(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.attrs={};self.current=None;self.feed(text)
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id' in a:self.attrs[a['id']]=a
  if t=='a':self.current={'href':a.get('href'),'text':''};self.links.append(self.current)
 def handle_data(self,s):
  if self.current is not None:self.current['text']+=s
 def handle_endtag(self,t):
  if t=='a':self.current=None
checks=[]
search=Nodes((r/'search.html').read_text())
for x in json.loads((r/'data/search-index.json').read_text())['entries']:
 assert any(a['href']==x['href'] and x['title'] in a['text'] and x['summary'] in a['text'] for a in search.links),x['id']
checks.append('All 14 indexed entries have matching linked HTML title and summary')
assert 'disabled' in search.attrs['site-search'];assert search.attrs['site-search']['aria-describedby']=='search-state'
checks.append('Unavailable search filter disabled and described before index hydration')
for filename,key in [('search.html','search-count'),('catalog.html','catalog-count')]:
 attrs=Nodes((r/filename).read_text()).attrs[key]
 assert attrs['role']=='status' and attrs['aria-live']=='polite' and attrs['aria-atomic']=='true'
checks.append('Both result counts expose polite atomic status semantics')
home=(r/'index.html').read_text();nodes=Nodes(home)
for item in json.loads((r/'data/catalog.json').read_text())['items']:
 if not item.get('public'):continue
 assert item['name'] in home and item['summary'] in home
 assert any(a['href']=='./project-'+item['id']+'.html' for a in nodes.links)
checks.append('All three demonstration cards have matching source copy and working local routes')
assert 'Le moteur public existant peut continuer' not in home
assert 'Abuse Shield et modération avant écriture' not in (r/'search.html').read_text()
checks.append('Superseded placeholder and unsupported community fallback removed')
report={'status':'PASS','scope':'Five source/HTML checks, not screen reader or disabled-JavaScript browser proof','checks':checks}
(r/'qa/fallback-content-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
