'use strict';
const width=document.querySelector('#width'),page=document.querySelector('#page'),height=document.querySelector('#height'),frame=document.querySelector('#screen'),output=document.querySelector('#measurement');
function measure(){
  try{
    const d=frame.contentDocument,e=d?.documentElement;
    if(!d?.body){output.textContent='Document indisponible';return;}
    const w=frame.contentWindow,nav=w.performance.getEntriesByType('navigation')[0];
    const ms=value=>Number.isFinite(value)&&value>0?Math.round(value*100)/100:null;
    const worker=w.navigator.serviceWorker?.controller;
    output.textContent=JSON.stringify({page:page.value,url:w.location.href,requested:Number(width.value),width:e.clientWidth,scroll:e.scrollWidth,height:e.clientHeight,contentHeight:e.scrollHeight,h1:d.querySelector('h1')?.textContent.trim(),positiveTabindex:[...d.querySelectorAll('[tabindex]')].filter(el=>Number(el.getAttribute('tabindex'))>0).length,navigation:nav?{type:nav.type,domContentLoadedEndMs:ms(nav.domContentLoadedEventEnd),loadEndMs:ms(nav.loadEventEnd),responseEndMs:ms(nav.responseEnd)}:null,serviceWorker:{supported:'serviceWorker' in w.navigator,secure:w.isSecureContext,controller:worker?{script:worker.scriptURL,state:worker.state}:null},timingScope:'Single iframe navigation in this browser; not CWV, cold-cache, offline or physical-device proof'});
  }catch{output.textContent='Mesure indisponible : cadre inaccessible';}
}
const afterLayout=()=>requestAnimationFrame(()=>requestAnimationFrame(measure));
frame.addEventListener('load',afterLayout);
width.addEventListener('change',()=>{frame.width=width.value;afterLayout();});
height.addEventListener('change',()=>{frame.height=height.value;afterLayout();});
page.addEventListener('change',()=>{output.textContent='Chargement';frame.src='../'+page.value;});
document.querySelector('#measure').addEventListener('click',measure);
