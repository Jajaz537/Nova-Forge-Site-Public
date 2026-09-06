(function(){
  'use strict';
  const button=document.querySelector('[data-menu-button]');
  const nav=document.querySelector('[data-primary-nav]');
  if(!button||!nav)return;
  const setOpen=(open,restoreFocus=false)=>{
    nav.setAttribute('data-open',open?'true':'false');
    button.setAttribute('aria-expanded',open?'true':'false');
    button.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    if(restoreFocus)button.focus();
  };
  button.addEventListener('click',()=>setOpen(nav.getAttribute('data-open')!=='true'));
  nav.addEventListener('click',(event)=>{
    if(event.target.closest('a')&&window.matchMedia('(max-width:1180px)').matches)setOpen(false);
  });
  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape'&&nav.getAttribute('data-open')==='true')setOpen(false,true);
  });
  window.addEventListener('resize',()=>{
    if(!window.matchMedia('(max-width:1180px)').matches)setOpen(false);
  });
})();