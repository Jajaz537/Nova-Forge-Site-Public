'use strict';
const width=document.querySelector('#width'),page=document.querySelector('#page'),height=document.querySelector('#height'),frame=document.querySelector('#screen'),output=document.querySelector('#measurement');
function measure(){
  try{
    const d=frame.contentDocument,e=d?.documentElement;
    if(!d?.body){output.textContent='Document indisponible';return;}
    output.textContent=JSON.stringify({page:page.value,url:frame.contentWindow.location.href,requested:Number(width.value),width:e.clientWidth,scroll:e.scrollWidth,height:e.clientHeight,contentHeight:e.scrollHeight,h1:d.querySelector('h1')?.textContent.trim(),positiveTabindex:[...d.querySelectorAll('[tabindex]')].filter(el=>Number(el.getAttribute('tabindex'))>0).length});
  }catch{output.textContent='Mesure indisponible : cadre inaccessible';}
}
const afterLayout=()=>requestAnimationFrame(()=>requestAnimationFrame(measure));
frame.addEventListener('load',afterLayout);
width.addEventListener('change',()=>{frame.width=width.value;afterLayout();});
height.addEventListener('change',()=>{frame.height=height.value;afterLayout();});
page.addEventListener('change',()=>{output.textContent='Chargement';frame.src='../'+page.value;});
document.querySelector('#measure').addEventListener('click',measure);
