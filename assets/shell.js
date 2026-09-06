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
  toggle.innerHTML = '<span aria-hidden="true"></span><span class="nav-toggle-label">Menu</span>';

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
})();
