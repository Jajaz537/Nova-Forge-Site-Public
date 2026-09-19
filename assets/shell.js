// Shared entry point: every public page can initiate offline preparation.
(async () => {
  'use strict';
  if (!window.isSecureContext || !('serviceWorker' in navigator)) return;
  const scriptSource = document.currentScript?.src;
  if (!scriptSource) return;
  try {
    const workerUrl = new URL('../sw.js', scriptSource);
    if (workerUrl.origin !== location.origin) return;
    await navigator.serviceWorker.register(workerUrl, {
      scope: new URL('./', workerUrl).href,
      updateViaCache: 'none'
    });
  } catch {
    // Optional: registration failure never blocks navigation or local tools.
  }
})();

(() => {
  'use strict';
  const header = document.querySelector('.topbar') || document.querySelector('footer');
  if (!header) return;
  const key = 'nova_site_shell_preferences_v1';
  let reduced = false;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    reduced = stored.motion === 'reduced' || stored.reducedMotion === true;
  } catch {}
  const motion = document.createElement('button');
  motion.type = 'button';
  motion.className = 'motion-toggle';
  const applyMotion = () => {
    document.documentElement.toggleAttribute('data-motion-reduced', reduced);
    if (reduced) document.documentElement.dataset.motion = 'reduced';
    else delete document.documentElement.dataset.motion;
    motion.setAttribute('aria-pressed', String(reduced));
    motion.textContent = reduced ? 'Mouvement réduit' : 'Mouvement système';
  };
  motion.addEventListener('click', () => {
    reduced = !reduced;
    applyMotion();
    try {
      if (reduced) localStorage.setItem(key, JSON.stringify({ motion: 'reduced' }));
      else localStorage.removeItem(key);
    } catch {}
  });
  applyMotion();
  header.append(motion);
})();

(() => {
  'use strict';
  const header = document.querySelector('.topbar');
  const nav = header?.querySelector('nav');
  if (!header || !nav) return;
  if (!nav.id) nav.id = 'primary-navigation';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  const toggleIcon=document.createElement('span');
  toggleIcon.ariaHidden='true';
  toggle.append(toggleIcon,Object.assign(document.createElement('span'),{className:'nav-toggle-label',textContent:'Menu'}));

  const close = () => {
    header.removeAttribute('data-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = header.toggleAttribute('data-nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.hasAttribute('data-nav-open')) {
      close();
      toggle.focus();
    }
  });
  header.insertBefore(toggle, nav);
  header.setAttribute('data-nav-ready', 'true');

  const updateAnchorOffset = () => {
    document.documentElement.style.setProperty('--modaryx-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
  };
  updateAnchorOffset();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateAnchorOffset).observe(header);
  } else {
    window.addEventListener('resize', updateAnchorOffset);
  }
})();

(() => {
  'use strict';
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.querySelector('[data-product-family-note]')) return;
  const identity = footer.querySelector('div');
  if (!identity) return;
  const note = document.createElement('p');
  note.className = 'product-family-note';
  note.dataset.productFamilyNote = '';
  note.textContent = 'MODARYX MODS et Nova Forge OS sont deux produits distincts créés par la même équipe.';
  identity.append(note);
})();

(() => {
  'use strict';
  if (!document.querySelector('.modaryx-realm-hero')) return;
  const scriptSource = document.currentScript?.src;
  if (!scriptSource) return;
  const start = () => {
    const load = () => import(new URL('./real-world-sync.mjs', scriptSource).href).catch(() => {});
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, {timeout: 1400});
    else window.setTimeout(load, 180);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once: true});
})();

