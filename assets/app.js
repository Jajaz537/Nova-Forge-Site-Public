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
  let catalogueState = 'loading';
  let catalogueRequestPending = false;
  let catalogueStale = false;

  function makeBadge(text, neutral = true) {
    const badge = document.createElement('span');
    badge.className = neutral ? 'badge neutral' : 'badge';
    badge.textContent = text;
    return badge;
  }

  const evidenceLabel = (value) => value === 'measured' ? 'Mesurée' : value === 'estimated' ? 'Estimée' : 'Inconnue';

  function renderCatalogue(query = '') {
    if (!catalogRoot) return;
    catalogRoot.setAttribute('aria-busy', String(catalogueState === 'loading'));
    if (search) search.disabled = catalogueState !== 'ready';
    if (catalogueState === 'loading') {
      const loading = document.createElement('p');
      loading.className = 'muted';
      loading.textContent = 'Chargement du catalogue…';
      catalogRoot.replaceChildren(loading);
      return;
    }
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

    if (catalogueState === 'ready' && catalogueStale) {
      const notice = document.createElement('p');
      notice.className = 'muted';
      notice.textContent = 'Copie en cache : les informations du catalogue peuvent avoir changé depuis leur enregistrement.';
      catalogRoot.append(notice);
    }
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = catalogueState === 'error'
        ? 'Le catalogue ne peut pas être chargé pour le moment.'
        : catalogueItems.length
          ? 'Aucune entrée publique ne correspond à cette recherche locale.'
          : 'Aucune création publique n’est référencée pour le moment.';
      catalogRoot.append(empty);
      if (catalogueState === 'error') {
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'button';
        retry.textContent = 'Réessayer';
        retry.addEventListener('click', () => loadCatalogue(true));
        catalogRoot.append(retry);
      }
      if (!catalogueItems.length) {
        const link = document.createElement('a');
        link.className = 'text-link';
        link.href = './catalog.html';
        link.textContent = 'Ouvrir le catalogue';
        catalogRoot.append(link);
      }
    }
  }

  async function loadCatalogue(restoreFocus = false) {
    if (!catalogRoot || catalogueRequestPending) return;
    catalogueRequestPending = true;
    catalogueState = 'loading';
    renderCatalogue();
    try {
      const response = await fetch(new URL(CATALOGUE_URL, document.baseURI), { credentials: 'same-origin' });
      if (!response.ok) throw new Error('catalogue-unavailable');
      catalogueStale = response.headers?.get('X-Modaryx-Cache') === 'offline-stale';
      const payload = await response.json();
      if (payload?.schemaVersion !== 1 || payload?.dataClass !== 'demonstration' || !Array.isArray(payload.items)) throw new Error('catalogue-contract-invalid');
      catalogueState = 'ready';
      catalogueItems = payload.items.filter((item) => item?.public === true && typeof item.id === 'string');
      renderCatalogue(search?.value || '');
    } catch {
      catalogueState = 'error';
      catalogueItems = [];
      renderCatalogue();
    } finally {
      catalogueRequestPending = false;
      if (restoreFocus) {
        if (catalogueState === 'ready') search?.focus();
        else catalogRoot.querySelector('button')?.focus();
      }
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
        ? observation('Rapport de pixels', null, 'Unknown', 'unavailable', 'Non disponible')
        : observation('Rapport de pixels', dpr, 'Measured', 'browser-api', String(dpr))
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
      right.textContent = {Measured:'Observé', Estimated:'Estimé', Unknown:'Inconnu'}[item.evidence];
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
    recommendationEvidence.textContent = 'Estimé';
    recommendationRow.append(recommendationText, recommendationEvidence);
    grid.append(recommendationRow);

    const disclaimer = document.createElement('p');
    disclaimer.className = 'muted';
    disclaimer.textContent = 'Analyse locale indicative : « Observé » décrit une valeur exposée par ce navigateur, sans certifier le matériel physique. Aucun FPS ni niveau de stabilité n’est garanti.';

    const tryButton = document.createElement('button');
    tryButton.className = 'button';
    tryButton.type = 'button';
    tryButton.textContent = 'Préparer un essai borné';
    tryButton.addEventListener('click', () => {
      const existing = profilePanel.querySelector('[data-try-anyway-flow]');
      if (existing) {
        existing.remove();
        tryButton.textContent = 'Préparer un essai borné';
        return;
      }
      profilePanel.append(buildTryAnywayFlow());
      tryButton.textContent = 'Fermer le protocole d’essai';
    });

    profilePanel.replaceChildren(grid, disclaimer, tryButton);
  }

  function buildTryAnywayFlow() {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.setAttribute('data-try-anyway-flow', '');
    panel.style.marginTop = '1rem';

    const title = document.createElement('strong');
    title.textContent = 'Essai borné — aucune modification automatique';
    const intro = document.createElement('p');
    intro.className = 'muted';
    intro.textContent = 'Ce protocole ne mesure pas vos FPS et ne change aucun réglage. Il vous aide à tester manuellement une option plus ambitieuse sans transformer une estimation en garantie.';

    const steps = document.createElement('ol');
    [
      'Risque : la recommandation reste une estimation tant qu’aucune mesure réelle du jeu n’est fournie.',
      'Sauvegarde : notez vos réglages actuels et utilisez, si le jeu le permet, une sauvegarde ou un profil de configuration réversible.',
      'Test borné : limitez l’essai à une courte session reproductible (par exemple 10 minutes, même zone/scène, mêmes réglages hors variable testée).',
      'Mesure / comparaison : comparez fluidité, latence ressentie, stabilité et erreurs avec votre état de référence.',
      'Décision : conservez seulement si le résultat est acceptable ; sinon restaurez vos réglages ou baissez un seul réglage ciblé.'
    ].forEach((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      steps.append(item);
    });

    const resultLabel = document.createElement('p');
    resultLabel.className = 'muted';
    resultLabel.textContent = 'Après votre test manuel, indiquez uniquement le résultat local :';

    const actions = document.createElement('div');
    actions.className = 'actions';
    const outcome = document.createElement('p');
    outcome.className = 'muted';
    outcome.setAttribute('role', 'status');
    outcome.setAttribute('aria-live', 'polite');

    [
      ['Acceptable / stable', 'Résultat local noté : acceptable. Conservez le changement uniquement pour ce scénario testé ; cela ne devient pas une garantie générale.'],
      ['Dégradé / instable', 'Résultat local noté : dégradé. Restaurez vos réglages, puis baissez un seul réglage avant un nouvel essai.'],
      ['Inconnu / non concluant', 'Résultat local noté : non concluant. Gardez le réglage prudent ou refaites un essai plus reproductible.']
    ].forEach(([label, message]) => {
      const button = document.createElement('button');
      button.className = 'button small';
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => { outcome.textContent = message; });
      actions.append(button);
    });

    panel.append(title, intro, steps, resultLabel, actions, outcome);
    return panel;
  }

  function renderBridgeState() {
    if (!profilePanel) return;
    const title = document.createElement('strong');
    title.textContent = 'Pont local optionnel inactif';
    const copy = document.createElement('p');
    copy.className = 'muted';
    copy.textContent = 'Aucun protocole local, exécutable ou service n’a été lancé. Le pont local reste optionnel et nécessitera une action utilisateur explicite.';
    profilePanel.replaceChildren(title, copy);
  }

  function renderPublicStatus(status, stale = false) {
    if (!publicStatusMessage || !publicStatusFacts) return;
    const stage = status?.stage === 'pre-vf' ? 'pré-VF' : 'état non qualifié';
    const publicOnly = status?.principles?.public_only === true;
    const downloadAvailable = !stale && status?.distribution?.public_download_available === true;
    const bridge = status?.integrations?.nova_forge_os_bridge === 'not_connected' ? 'non connecté' : 'état non qualifié';
    const profile = status?.smart_profile?.execution === 'browser-local' ? 'navigateur local' : 'état non qualifié';
    const currentBuildNode = getPublicBuildFact();
    const buildNode = currentBuildNode?.cloneNode(true) ?? null;

    publicStatusMessage.dataset.freshness = stale ? 'offline-stale' : 'network';
    publicStatusMessage.textContent = stale
      ? 'Statut non actualisé : seule une copie hors ligne est disponible. La disponibilité actuelle des téléchargements ne peut pas être confirmée.'
      : publicOnly
      ? `MODARYX est en ${stage}. Les téléchargements restent verrouillés tant que les preuves de publication requises ne sont pas réunies. ${downloadAvailable ? 'Un téléchargement public est déclaré disponible.' : 'Aucun téléchargement public n’est déclaré disponible.'}`
      : 'Le statut public ne peut pas être confirmé pour cette version.';

    const facts = [
      ['Distribution', stale ? 'non confirmée hors ligne' : downloadAvailable ? 'déclarée disponible' : 'verrouillée'],
      ['Pont vers Nova Forge OS', bridge],
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
      if (response.headers?.get('X-Modaryx-Cache') === 'offline-stale') {
        renderPublicStatus(null, true);
        return;
      }
      if (!response.ok) throw new Error('status-unavailable');
      const status = await response.json();
      if (status?.schema !== 'nova-forge-public-site-status/v1') throw new Error('status-invalid');
      renderPublicStatus(status);
    } catch {
      publicStatusMessage.textContent = 'Statut non actualisé : le manifeste public est indisponible. Aucune disponibilité actuelle n’est confirmée.';
      publicStatusMessage.dataset.freshness = 'unavailable';
    }
  }

  function markBuildUnavailable(stale = false) {
    const buildFact = getPublicBuildFact();
    if (!buildFact) return;
    buildFact.dataset.freshness = stale ? 'offline-stale' : 'unavailable';
    delete buildFact.dataset.reported;
    const small = buildFact.querySelector('small');
    if (small) {
      small.textContent = stale ? 'Build non actualisé · copie hors ligne' : 'Empreinte de build non disponible';
      small.removeAttribute('title');
    }
  }

  async function loadPublicBuild() {
    if (!getPublicBuildFact()) return;
    try {
      const response = await fetch(new URL('./public-build.json', document.baseURI), {
        cache: 'no-cache',
        credentials: 'same-origin'
      });
      if (response.headers?.get('X-Modaryx-Cache') === 'offline-stale') {
        markBuildUnavailable(true);
        return;
      }
      if (!response.ok) throw new Error('build-unavailable');
      const build = await response.json();
      const digest = typeof build?.surface_digest_sha256 === 'string' ? build.surface_digest_sha256 : '';
      if (build?.schema !== 'nova-forge-public-site-build/v1' || build?.source_revision !== 'withheld-private-source' || !/^[0-9a-f]{64}$/.test(digest)) throw new Error('build-digest-unavailable');
      const buildFact = getPublicBuildFact();
      if (!buildFact) return;
      const small = buildFact.querySelector('small');
      if (small) {
        small.textContent = `SHA-256 déclaré ${digest.slice(0, 12)}…`;
        small.title = digest;
      }
      // Reading a claimed digest does not verify the served bytes.
      buildFact.dataset.reported = 'true';
      buildFact.dataset.freshness = 'network';
    } catch {
      markBuildUnavailable();
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

  renderCatalogue();
  Promise.allSettled([loadCatalogue(), loadPublicStatus(), loadPublicBuild()]);
  enableActiveNavigation();
  search?.addEventListener('input', (event) => renderCatalogue(event.currentTarget.value));
  bySelector('[data-smart-profile]')?.addEventListener('click', renderProfile);
  bySelector('[data-os-bridge]')?.addEventListener('click', renderBridgeState);


})();
