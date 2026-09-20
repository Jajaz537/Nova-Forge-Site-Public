'use strict';
const width=document.querySelector('#width'),page=document.querySelector('#page'),height=document.querySelector('#height'),pseudo=document.querySelector('#pseudo'),frame=document.querySelector('#screen'),output=document.querySelector('#measurement');
const reviewPagePaths=new Map([
  ['index.html','../index.html'],
  ['catalog.html','../catalog.html'],
  ['games/index.html','../games/index.html'],
  ['community.html','../community.html'],
  ['creator-studio.html','../creator-studio.html'],
  ['documentation.html','../documentation.html'],
  ['downloads.html','../downloads.html'],
  ['ecosystem.html','../ecosystem.html'],
  ['profiles.html','../profiles.html'],
  ['project.html','../project.html'],
  ['project-balanced-latency-pack.html','../project-balanced-latency-pack.html'],
  ['project-ember-textures.html','../project-ember-textures.html'],
  ['project-forge-night-experience.html','../project-forge-night-experience.html'],
  ['search.html','../search.html'],
  ['security.html','../security.html'],
  ['verify.html','../verify.html'],
  ['404.html','../404.html']
]);
const selectedReviewPath=()=>reviewPagePaths.get(page.value)||'../index.html';
const selectedReviewUrl=()=>new URL(selectedReviewPath(),location.href).href;
const pseudoText=value=>{
  const source=String(value||''),trimmed=source.trim();
  if(!trimmed)return source;
  const accented=trimmed.replace(/[aA]/g,'à').replace(/[eE]/g,'ë').replace(/[iI]/g,'ï').replace(/[oO]/g,'ô').replace(/[uU]/g,'ü');
  const padding=' ·'.repeat(Math.max(1,Math.ceil(trimmed.length*.35/2)));
  return source.replace(trimmed,'⟦'+accented+padding+'⟧');
};
function applyPseudo(d){
  if(!pseudo.checked||d.documentElement.dataset.pseudoLocalized==='true')return;
  const walker=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{if(!node.parentElement?.closest('script,style,noscript,code,pre,svg'))node.nodeValue=pseudoText(node.nodeValue);});
  d.querySelectorAll('[placeholder],[aria-label],[title]').forEach(node=>['placeholder','aria-label','title'].forEach(name=>{const value=node.getAttribute(name);if(value)node.setAttribute(name,pseudoText(value));}));
  d.documentElement.dataset.pseudoLocalized='true';
}
function measure(){
  try{
    const d=frame.contentDocument,e=d?.documentElement;
    if(!d?.body){output.textContent='Document indisponible';return;}
    const w=frame.contentWindow;
    const canonical=path=>path.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
    const expected=new URL(selectedReviewPath(),location.href).pathname;
    if(canonical(w.location.pathname)!==canonical(expected)||d.readyState!=='complete'){
      output.textContent='Chargement : mesure différée jusqu’au document demandé';return;
    }
    applyPseudo(d);
    const nav=w.performance.getEntriesByType('navigation')[0];
    const ms=value=>Number.isFinite(value)&&value>0?Math.round(value*100)/100:null;
    const worker=w.navigator.serviceWorker?.controller;
    output.textContent=JSON.stringify({page:page.value,url:w.location.href,requested:Number(width.value),width:e.clientWidth,scroll:e.scrollWidth,height:e.clientHeight,contentHeight:e.scrollHeight,pseudoLocalized:d.documentElement.dataset.pseudoLocalized==='true',h1:d.querySelector('h1')?.textContent.trim(),positiveTabindex:[...d.querySelectorAll('[tabindex]')].filter(el=>Number(el.getAttribute('tabindex'))>0).length,navigation:nav?{type:nav.type,domContentLoadedEndMs:ms(nav.domContentLoadedEventEnd),loadEndMs:ms(nav.loadEventEnd),responseEndMs:ms(nav.responseEnd)}:null,serviceWorker:{supported:'serviceWorker' in w.navigator,secure:w.isSecureContext,controller:worker?{script:worker.scriptURL,state:worker.state}:null},timingScope:'Single iframe navigation in this browser; pseudo-localization is a synthetic layout stress, not a translation or device proof'});
  }catch{output.textContent='Mesure indisponible : cadre inaccessible';}
}
const afterLayout=()=>requestAnimationFrame(()=>requestAnimationFrame(measure));
frame.addEventListener('load',afterLayout);
width.addEventListener('change',()=>{frame.width=width.value;afterLayout();});
height.addEventListener('change',()=>{frame.height=height.value;afterLayout();});
page.addEventListener('change',()=>{output.textContent='Chargement';frame.src=selectedReviewUrl();});
pseudo.addEventListener('change',()=>{output.textContent='Chargement';frame.src=selectedReviewUrl();});
document.querySelector('#measure').addEventListener('click',measure);
