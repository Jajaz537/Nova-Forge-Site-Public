(() => {
  'use strict';
  const header = document.querySelector('.topbar');
  const nav = header?.querySelector('nav');
  if (header && nav) {
    if (!nav.id) nav.id = 'primary-navigation';
    const toggle = document.createElement('button'); toggle.type='button'; toggle.className='nav-toggle'; toggle.setAttribute('aria-controls',nav.id); toggle.setAttribute('aria-expanded','false');
    const icon=document.createElement('span'); icon.setAttribute('aria-hidden','true'); const label=document.createElement('span'); label.className='nav-toggle-label'; label.textContent='Menu'; toggle.append(icon,label);
    const close=()=>{header.removeAttribute('data-nav-open');toggle.setAttribute('aria-expanded','false');};
    toggle.addEventListener('click',()=>{const open=header.toggleAttribute('data-nav-open');toggle.setAttribute('aria-expanded',String(open));});
    nav.addEventListener('click',(event)=>{if(event.target.closest('a'))close();});
    document.addEventListener('keydown',(event)=>{if(event.key === 'Escape'){close();toggle.focus();}}); header.insertBefore(toggle,nav);
    const key='nova_site_shell_preferences_v1';let reduced=false;try{const stored=JSON.parse(localStorage.getItem(key)||'{}');reduced=stored.motion==='reduced'||stored.reducedMotion===true;}catch{}
    const motion=document.createElement('button');motion.type='button';motion.className='motion-toggle';const applyMotion=()=>{document.documentElement.toggleAttribute('data-motion-reduced',reduced);if(reduced)document.documentElement.dataset.motion='reduced';else delete document.documentElement.dataset.motion;motion.setAttribute('aria-pressed',String(reduced));motion.textContent=reduced?'Mouvement réduit':'Mouvement système';};
    motion.addEventListener('click',()=>{reduced=!reduced;applyMotion();try{if(reduced)localStorage.setItem(key,JSON.stringify({motion:'reduced'}));else localStorage.removeItem(key);}catch{}});applyMotion();header.append(motion);
  }
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;const prefetchAllowed=!connection?.saveData&&!['slow-2g','2g'].includes(connection?.effectiveType||'');const prefetched=new Set();let intentTimer=0;
  const eligibleLink=(node)=>{const anchor=node?.closest?.('a[href]');if(!anchor||anchor.hasAttribute('download')||anchor.target==='_blank')return null;const url=new URL(anchor.href,document.baseURI);if(url.origin!==location.origin||url.protocol!==location.protocol)return null;if(url.pathname===location.pathname&&url.search===location.search&&url.hash)return null;return url;};
  const prefetch=(url)=>{if(!prefetchAllowed||!url||prefetched.size>=6||prefetched.has(url.href))return;const hint=document.createElement('link');hint.rel='prefetch';hint.href=url.href;hint.as='document';document.head.append(hint);prefetched.add(url.href);};
  const schedulePrefetch=(event)=>{const url=eligibleLink(event.target);if(!url)return;clearTimeout(intentTimer);intentTimer=window.setTimeout(()=>prefetch(url),140);};const cancelPrefetch=()=>clearTimeout(intentTimer);document.addEventListener('pointerover',schedulePrefetch,{passive:true});document.addEventListener('pointerout',cancelPrefetch,{passive:true});document.addEventListener('focusin',schedulePrefetch);
  const classifyBlockedResource=(value)=>{if(!value)return'none';if(value==='inline'||value==='eval')return value;if(value.startsWith('data:'))return'data';try{const url=new URL(value,document.baseURI);return url.origin===location.origin?'same-origin':'cross-origin';}catch{return'opaque';}};
  document.addEventListener('securitypolicyviolation',(event)=>{try{const key='nova-forge:csp-violations:v1';const previous=JSON.parse(sessionStorage.getItem(key)||'[]');const records=Array.isArray(previous)?previous.slice(-19):[];records.push({effectiveDirective:String(event.effectiveDirective||event.violatedDirective||'unknown').slice(0,80),disposition:String(event.disposition||'enforce').slice(0,16),blockedClass:classifyBlockedResource(String(event.blockedURI||'')),statusCode:Number.isFinite(event.statusCode)?event.statusCode:0});sessionStorage.setItem(key,JSON.stringify(records));}catch{}});
  import('./vitals-budget.mjs').catch(()=>{});
  const page=location.pathname.split('/').pop()||'index.html';if(page==='creator-studio.html')import('./creator-workbench.mjs').catch(()=>{});if(page==='profiles.html')import('./local-data-control.mjs').catch(()=>{});
})();
