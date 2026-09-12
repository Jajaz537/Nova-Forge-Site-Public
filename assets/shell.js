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
  const toggleIcon = document.createElement('span');
  toggleIcon.setAttribute('aria-hidden', 'true');
  const toggleLabel = document.createElement('span');
  toggleLabel.className = 'nav-toggle-label';
  toggleLabel.textContent = 'Menu';
  toggle.append(toggleIcon, toggleLabel);

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
    if (event.key === 'Escape') {
      close();
      toggle.focus();
    }
  });
  header.insertBefore(toggle, nav);

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

  // Retained idea SITE-R07: bounded, same-origin intent prefetch only.
  // It never prefetches when Save-Data is enabled or on 2G-class links.
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = String(connection?.effectiveType || '').toLowerCase();
  const constrainedNetwork = connection?.saveData === true || effectiveType === 'slow-2g' || effectiveType === '2g';
  const maxPrefetches = effectiveType === '3g' ? 1 : 4;
  const prefetched = new Set();

  const prefetchCandidate = (target) => {
    if (constrainedNetwork || prefetched.size >= maxPrefetches || document.visibilityState === 'hidden') return;
    const link = target?.closest?.('a[href]');
    if (!link || link.hasAttribute('download')) return;
    if (link.target && link.target !== '_self') return;
    const rel = new Set(String(link.rel || '').toLowerCase().split(/\s+/).filter(Boolean));
    if (rel.has('external') || rel.has('nofollow')) return;

    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.hash && `${url.origin}${url.pathname}${url.search}` === `${location.origin}${location.pathname}${location.search}`) return;
    url.hash = '';
    if (url.href === `${location.origin}${location.pathname}${location.search}` || prefetched.has(url.href)) return;

    const path = url.pathname;
    const last = path.split('/').pop() || '';
    if (last.includes('.') && !last.endsWith('.html')) return;

    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.href = url.href;
    hint.setAttribute('data-modaryx-intent-prefetch', 'true');
    document.head.append(hint);
    prefetched.add(url.href);
  };

  let hoverTimer = 0;
  document.addEventListener('mouseover', (event) => {
    const link = event.target?.closest?.('a[href]');
    if (!link) return;
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => prefetchCandidate(link), 120);
  }, {passive: true});
  document.addEventListener('mouseout', () => window.clearTimeout(hoverTimer), {passive: true});
  document.addEventListener('focusin', (event) => prefetchCandidate(event.target));
})();
