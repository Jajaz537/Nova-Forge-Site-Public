(() => {
  'use strict';

  const CATALOGUE_URL = './data/catalog.json';
  const bySelector = (selector) => document.querySelector(selector);
  const catalogRoot = bySelector('[data-mod-catalog]');
  const search = bySelector('#mod-search');
  const profilePanel = bySelector('[data-profile-result]');
  const publicStatusMessage = bySelector('[data-public-status-message]');
  const publicStatusFacts = bySelector('[data-public-status-facts]');
  const getPublicBuildFact = () => bySelector('[data-public-build-fact]');
  let catalogueItems = [];

  function makeBadge(text, neutral = true) {
    const badge = document.createElement('span');
    badge.className = neutral ? 'badge neutral' : 'badge';
    badge.textContent = text;
    return badge;
  }

  const evidenceLabel = (value) => value === 'measured' ? 'Mesurée' : value === 'estimated' ? 'Estimée' : 'Inconnue';

  function renderCatalogue(query = '') {
    if (!catalogRoot) return;
    const term = query.trim().toLocaleLowerCase('fr');
    const rows = catalogueItems.filter((item) => {
      const searchable = [item.name, item.game?.name, item.kind, item.summary, ...(item.tags || [])].join(' ').toLocaleLowerCase('fr');
      return !term || searchable.includes(term);
    });

    catalogRoot.replaceChildren(...rows.map((item) => {
      const article = document.createElement('article');
      article.className = 'card';
      const kicker = document.createElement('p');
      kicker.className = 'card-kicker';
      kicker.textContent = item.game?.name || 'Jeu non qualifié';
      const title = document.createElement('h3');
      title.textContent = item.name;
      const copy = document.createElement('p');
      copy.textContent = item.summary;
      const meta = document.createElement('div');
      meta.className = 'card-meta';
      meta.append(makeBadge(`Compatibilité : ${evidenceLabel(item.compatibility?.evidence)}`));
      const link = document.createElement('a');
      link.className = 'text-link';
      link.href = `./project-${encodeURIComponent(item.id)}.html`;
      link.textContent = 'Voir le mini-hub';
      article.append(kicker, title, copy, meta, link);
      return article;
    }));

    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = catalogueItems.length
        ? 'Aucune entrée publique ne correspond à cette recherche locale.'
        : 'Les données du Catalogue V1 sont indisponibles. Aucun contenu alternatif n’est substitué.';
      catalogRoot.append(empty);
      if (!catalogueItems.length) {
        const link = document.createElement('a');
        link.className = 'text-link';
        link.href = './catalog.html';
        link.textContent = 'Ouvrir le Catalogue V1';
        catalogRoot.append(link);
      }
    }
  }

  async function loadCatalogue() {
    if (!catalogRoot) return;
    try {
      const response = await fetch(new URL(CATALOGUE_URL, document.baseURI), { credentials: 'same-origin' });
      if (!response.ok) throw new Error('catalogue-unavailable');
      const payload = await response.json();
      if (payload?.schemaVersion !== 1 || payload?.dataClass !== 'demonstration' || !Array.isArray(payload.items)) throw new Error('catalogue-contract-invalid');
      catalogueItems = payload.items.filter((item) => item?.public === true && typeof item.id === 'string');
      renderCatalogue(search?.value || '');
    } catch {
      catalogueItems = [];
      renderCatalogue();
    }
  }

  function observation(label, value, evidence, source, displayValue) {
    return { label, value, evidence, source, displayValue };
  }

  function renderProfile() {
    if (!profilePanel) return;
    const cores = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency > 0 ? navigator.hardwareConcurrency : null;
    const memory = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory > 0 ? navigator.deviceMemory : null;
    const dpr = Number.isFinite(window.devicePixelRatio) && window.devicePixelRatio > 0 ? window.devicePixelRatio : null;
    const width = Number.isFinite(screen.width) && screen.width > 0 ? screen.width : null;

    const observations = [
      cores === null
        ? observation('CPU logique exposé', null, 'Unknown', 'unavailable', 'Non disponible')
        : observation('CPU logique exposé', cores, 'Measured', 'browser-api', String(cores)),
      memory === null
        ? observation('Mémoire appareil exposée', null, 'Unknown', 'unavailable', 'Non disponible')
        : observation('Mémoire appareil exposée', memory, 'Estimated', 'browser-approximation', `${memory} GiB environ`),
      width === null
        ? observation('Largeur écran exposée', null, 'Unknown', 'unavailable', 'Non disponible')
        : observation('Largeur écran exposée', width, 'Measured', 'browser-api', `${width} px`),
      dpr === null
        ? observation('Device Pixel Ratio', null, 'Unknown', 'unavailable', 'Non disponible')
        : observation('Device Pixel Ratio', dpr, 'Measured', 'browser-api', String(dpr))
    ];

    const recommendation = cores && cores >= 8 && (!memory || memory >= 8)
      ? 'Profil local suggéré : Élevé'
      : cores && cores >= 4
        ? 'Profil local suggéré : Moyen'
        : 'Profil local suggéré : Faible / prudent';

    const grid = document.createElement('div');
    grid.className = 'profile-grid';
    observations.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'profile-row';
      const left = document.createElement('span');
      left.textContent = `${item.label} : ${item.displayValue}`;
      left.title = `Source : ${item.source}`;
      const right = document.createElement('span');
      right.className = 'evidence';
      right.textContent = item.evidence;
      row.append(left, right);
      grid.append(row);
    });

    const recommendationRow = document.createElement('div');
    recommendationRow.className = 'profile-row';
    const recommendationText = document.createElement('span');
    recommendationText.textContent = recommendation;
    recommendationText.title = 'Estimation locale dérivée des observations disponibles.';
    const recommendationEvidence = document.createElement('span');
    recommendationEvidence.className = 'evidence';
    recommendationEvidence.textContent = 'Estimated';
    recommendationRow.append(recommendationText, recommendationEvidence);
    grid.append(recommendationRow);

    const disclaimer = document.createElement('p');
    disclaimer.className = 'muted';
    disclaimer.textContent = 'Analyse browser-local indicative uniquement. « Measured » signifie observé via une API du navigateur pour cette session ; cela ne certifie pas le matériel physique sous-jacent. Aucun FPS ni niveau de stabilité n’est garanti.';
    profilePanel.replaceChildren(grid, disclaimer);
  }

  function renderBridgeState() {
    if (!profilePanel) return;
    const title = document.createElement('strong');
    title.textContent = 'Bridge OS inactif';
    const copy = document.createElement('p');
    copy.className = 'muted';
    copy.textContent = 'Aucun protocole local, exécutable ou service Nova Forge OS n’a été lancé. L’intégration reste optionnelle et devra nécessiter une action utilisateur explicite.';
    profilePanel.replaceChildren(title, copy);
  }

  function renderPublicStatus(status) {
    if (!publicStatusMessage || !publicStatusFacts) return;
    const stage = status?.stage === 'pre-vf' ? 'pré-VF' : 'état non qualifié';
    const publicOnly = status?.principles?.public_only === true;
    const downloadAvailable = status?.distribution?.public_download_available === true;
    const bridge = status?.integrations?.nova_forge_os_bridge === 'not_connected' ? 'non connecté' : 'état non qualifié';
    const profile = status?.smart_profile?.execution === 'browser-local' ? 'navigateur local' : 'état non qualifié';
    const currentBuildNode = getPublicBuildFact();
    const buildNode = currentBuildNode?.cloneNode(true) ?? null;

    publicStatusMessage.textContent = publicOnly
      ? `Le manifeste livré avec ce build déclare une surface ${stage}, public-only et fail-closed. ${downloadAvailable ? 'Un téléchargement public est déclaré disponible.' : 'Aucun téléchargement public n’est déclaré disponible.'}`
      : 'Le manifeste de statut ne permet pas de qualifier cette surface comme public-only.';

    const facts = [
      ['Distribution', downloadAvailable ? 'déclarée disponible' : 'verrouillée'],
      ['Bridge OS', bridge],
      ['Smart Profile', profile]
    ];

    const nodes = facts.map(([label, value]) => {
      const item = document.createElement('span');
      const strong = document.createElement('strong');
      const small = document.createElement('small');
      strong.textContent = label;
      small.textContent = value;
      item.append(strong, small);
      return item;
    });
    if (buildNode) nodes.push(buildNode);
    publicStatusFacts.replaceChildren(...nodes);
  }

  async function loadPublicStatus() {
    if (!publicStatusMessage || !publicStatusFacts) return;
    try {
      const response = await fetch(new URL('./public-status.json', document.baseURI), {
        cache: 'no-cache',
        credentials: 'same-origin'
      });
      if (!response.ok) return;
      const status = await response.json();
      if (status?.schema !== 'nova-forge-public-site-status/v1') return;
      renderPublicStatus(status);
    } catch {
      /* Le contenu statique de repli reste la source affichée. */
    }
  }

  async function loadPublicBuild() {
    if (!getPublicBuildFact()) return;
    try {
      const response = await fetch(new URL('./public-build.json', document.baseURI), {
        cache: 'no-cache',
        credentials: 'same-origin'
      });
      if (!response.ok) return;
      const build = await response.json();
      const digest = typeof build?.surface_digest_sha256 === 'string' ? build.surface_digest_sha256 : '';
      if (build?.schema !== 'nova-forge-public-site-build/v1' || build?.source_revision !== 'withheld-private-source' || !/^[0-9a-f]{64}$/.test(digest)) return;
      const buildFact = getPublicBuildFact();
      if (!buildFact) return;
      const small = buildFact.querySelector('small');
      if (small) {
        small.textContent = `SHA-256 ${digest.slice(0, 12)}…`;
        small.title = digest;
      }
      buildFact.dataset.verified = 'true';
    } catch {
      /* L’absence du manifeste de build conserve l’état fail-closed. */
    }
  }

  function enableActiveNavigation() {
    if (!('IntersectionObserver' in window)) return;
    const links = [...document.querySelectorAll('nav a[href^="#"]')];
    const entries = links
      .map((link) => ({ link, target: document.getElementById(link.getAttribute('href').slice(1)) }))
      .filter(({ target }) => target);
    if (!entries.length) return;

    const setCurrent = (id) => {
      entries.forEach(({ link, target }) => {
        if (target.id === id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver((observed) => {
      const visible = observed
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setCurrent(visible.target.id);
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 0.1, 0.35]
    });

    entries.forEach(({ target }) => observer.observe(target));
  }

  function setupMotionPreference() {
    const topbar = bySelector('.topbar');
    if (!topbar) return;
    const key = 'nova_site_shell_preferences_v1';
    let mode = 'system';

    try {
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      if (stored.motion === 'reduced') mode = 'reduced';
      else if (stored.reducedMotion === true) mode = 'reduced';
    } catch {
      mode = 'system';
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'motion-toggle';

    const apply = () => {
      if (mode === 'reduced') document.documentElement.dataset.motion = 'reduced';
      else delete document.documentElement.dataset.motion;
      button.setAttribute('aria-pressed', mode === 'reduced' ? 'true' : 'false');
      button.textContent = mode === 'reduced' ? 'Animations réduites' : 'Animations système';
    };

    button.addEventListener('click', () => {
      mode = mode === 'reduced' ? 'system' : 'reduced';
      apply();
      try {
        if (mode === 'reduced') localStorage.setItem(key, JSON.stringify({ motion: 'reduced' }));
        else localStorage.removeItem(key);
      } catch {
        /* La préférence reste fonctionnelle pour la session même sans stockage. */
      }
    });

    apply();
    topbar.append(button);
  }

  renderCatalogue();
  Promise.allSettled([loadCatalogue(), loadPublicStatus(), loadPublicBuild()]);
  enableActiveNavigation();
  setupMotionPreference();
  search?.addEventListener('input', (event) => renderCatalogue(event.currentTarget.value));
  bySelector('[data-smart-profile]')?.addEventListener('click', renderProfile);
  bySelector('[data-os-bridge]')?.addEventListener('click', renderBridgeState);

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    const serviceWorkerUrl = new URL('./sw.js', document.baseURI);
    navigator.serviceWorker.register(serviceWorkerUrl, { scope: './' }).catch(() => {
      /* L’amélioration hors-ligne est optionnelle ; le contenu reste static-first. */
    });
  }
})();
