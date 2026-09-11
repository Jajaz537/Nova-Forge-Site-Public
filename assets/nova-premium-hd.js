(function(){
  'use strict';
  const button=document.querySelector('[data-menu-button]');
  const nav=document.querySelector('[data-primary-nav]');
  if(button&&nav){
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
  }

  const home=document.querySelector('.mx-home');
  if(!home)return;

  let polishing=false;
  const setExact=(selector,from,to)=>{
    const node=document.querySelector(selector);
    if(node&&node.textContent.trim()===from)node.textContent=to;
  };
  const polishPublicCopy=()=>{
    if(polishing)return;
    polishing=true;
    try{
      setExact('[data-smart-profile]','Analyser ce navigateur','Adapter mon expérience');
      setExact('[data-os-bridge]','État du Bridge OS','Connexion à Modaryx OS');
      setExact('[data-profile-result] .muted','Aucune analyse locale exécutée.','Aucune adaptation locale demandée.');
      setExact('.security-seal .seal-status','Fail-closed · public','Confiance · public');
      setExact('#downloads-title','Aucun build n’est publié sans preuve.','Des téléchargements officiels, vérifiables et sûrs.');
      setExact('.download-lock > strong','Publication verrouillée','Disponibilité contrôlée');
      setExact('.download-lock > small','Pas de faux bouton de téléchargement.','Les téléchargements apparaissent uniquement lorsqu’ils sont prêts.');

      document.querySelectorAll('[data-public-status-facts] strong').forEach((node)=>{
        const text=node.textContent.trim();
        if(text==='Bridge OS')node.textContent='Modaryx OS';
        if(text==='Smart Profile')node.textContent='Profil local';
        if(text==='Empreinte')node.textContent='Version';
      });
      document.querySelectorAll('[data-public-status-facts] small').forEach((node)=>{
        const text=node.textContent.trim();
        if(text==='source non empaquetée')node.textContent='en préparation';
        if(text==='navigateur local')node.textContent='adaptation locale';
      });
      document.querySelectorAll('.evidence').forEach((node)=>{
        const text=node.textContent.trim();
        if(text==='Measured')node.textContent='Mesuré';
        if(text==='Estimated')node.textContent='Estimé';
        if(text==='Unknown')node.textContent='Inconnu';
      });

      const publicMessage=document.querySelector('[data-public-status-message]');
      if(publicMessage&&/(public-only|fail-closed|pré-VF)/i.test(publicMessage.textContent)){
        publicMessage.textContent=publicMessage.textContent
          .replace(/pré-VF/gi,'en préparation')
          .replace(/public-only/gi,'publique')
          .replace(/fail-closed/gi,'protégée');
      }
      const profileCopy=document.querySelector('[data-profile-result] .muted');
      if(profileCopy&&/browser-local|Measured|Estimated|Unknown/.test(profileCopy.textContent)){
        profileCopy.textContent=profileCopy.textContent
          .replace(/browser-local/g,'locale dans le navigateur')
          .replace(/Measured/g,'Mesuré')
          .replace(/Estimated/g,'Estimé')
          .replace(/Unknown/g,'Inconnu');
      }
    }finally{
      polishing=false;
    }
  };

  polishPublicCopy();
  const observer=new MutationObserver(polishPublicCopy);
  observer.observe(home,{subtree:true,childList:true,characterData:true});
})();