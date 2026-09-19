(() => {
  'use strict';

  const WORLD_URL = './data/living-world.json';
  const root = document.documentElement;
  const statusNode = document.querySelector('[data-world-status]');
  const phaseNode = document.querySelector('[data-world-phase]');
  const ageNode = document.querySelector('[data-world-age]');
  const inhabitantNodes = new Map(
    [...document.querySelectorAll('[data-world-inhabitant]')]
      .map((node) => [node.dataset.worldInhabitant, node])
  );
  const nextStageNodes = new Map(
    [...document.querySelectorAll('[data-world-next]')]
      .map((node) => [node.dataset.worldNext, node])
  );
  const environmentNode = document.querySelector('[data-world-environment]');
  const visualNodes = new Map(
    [...document.querySelectorAll('[data-world-visual]')]
      .map((node) => [node.dataset.worldVisual, node])
  );

  if (!statusNode && !phaseNode && !ageNode && inhabitantNodes.size === 0 && nextStageNodes.size === 0) return;

  const DAY_MS = 24 * 60 * 60 * 1000;
  const REQUIRED_GROWTH_ORDER = ['baby', 'juvenile', 'adolescent', 'young-adult', 'adult'];
  let timer = null;
  let config = null;
  let sourceState = 'fresh';

  function validDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function elapsedDays(from, now) {
    return Math.max(0, Math.floor((now.getTime() - from.getTime()) / DAY_MS));
  }

  function stageFor(inhabitant, now) {
    const bornAt = validDate(inhabitant?.bornAt);
    if (!bornAt || !Array.isArray(inhabitant?.stages)) return null;
    const days = elapsedDays(bornAt, now);
    const stages = inhabitant.stages
      .filter((stage) => Number.isFinite(stage?.fromDay) && typeof stage?.id === 'string')
      .sort((a, b) => a.fromDay - b.fromDay);
    if (!stages.length) return null;

    let activeIndex = 0;
    for (let index = 0; index < stages.length; index += 1) {
      if (days >= stages[index].fromDay) activeIndex = index;
      else break;
    }

    const active = stages[activeIndex];
    const next = stages[activeIndex + 1] || null;
    return {
      ...active,
      days,
      next,
      daysUntilNext: next ? Math.max(0, next.fromDay - days) : 0
    };
  }

  function resolveVisualAsset(value, visualGrowth = config?.visualGrowth) {
    if (typeof value !== 'string' || !value.trim()) return null;
    const policy = visualGrowth?.assetPolicy;
    if (policy?.sameOrigin !== true || typeof policy?.allowedPrefix !== 'string') return null;
    try {
      const assetUrl = new URL(value, document.baseURI);
      const prefixUrl = new URL(policy.allowedPrefix, document.baseURI);
      if (assetUrl.origin !== prefixUrl.origin) return null;
      if (!assetUrl.pathname.startsWith(prefixUrl.pathname)) return null;
      return assetUrl.href;
    } catch {
      return null;
    }
  }

  function visualSlotFor(inhabitantId, visualGrowth = config?.visualGrowth) {
    return (visualGrowth?.slots || []).find((slot) => slot?.inhabitantId === inhabitantId) || null;
  }

  function validVisualGrowth(data) {
    const visual = data?.visualGrowth;
    if (!visual || visual.model !== 'layered-stage-assets-v1') return false;
    if (!['awaiting-assets', 'ready'].includes(visual.status)) return false;
    if (visual.activation !== 'atomic-current-stage' || visual.fallback !== 'composite-hero') return false;
    if (visual.assetPolicy?.loading !== 'current-stage-only' || visual.assetPolicy?.cache !== 'runtime-on-demand') return false;
    if (!Number.isFinite(visual.canvas?.width) || !Number.isFinite(visual.canvas?.height)) return false;

    if (!Array.isArray(visual.slots) || visual.slots.length !== (data.inhabitants || []).length) return false;
    const ids = new Set();
    for (const inhabitant of data.inhabitants || []) {
      const slot = visualSlotFor(inhabitant.id, visual);
      if (!slot || ids.has(slot.inhabitantId)) return false;
      ids.add(slot.inhabitantId);
      const keys = Object.keys(slot.stages || {});
      if (keys.join('|') !== REQUIRED_GROWTH_ORDER.join('|')) return false;
      for (const stageId of REQUIRED_GROWTH_ORDER) {
        const value = slot.stages[stageId];
        if (visual.status === 'ready' && typeof value !== 'string') return false;
        if (value !== null && resolveVisualAsset(value, visual) === null) return false;
      }
    }

    if (visual.status === 'ready' && typeof visual.environmentAsset !== 'string') return false;
    if (visual.environmentAsset !== null && resolveVisualAsset(visual.environmentAsset, visual) === null) return false;
    return true;
  }

  function renderVisualGrowth(activeStages) {
    const visual = config?.visualGrowth;
    const fallback = environmentNode?.dataset.worldFallbackSrc || '';
    const environmentAsset = resolveVisualAsset(visual?.environmentAsset, visual);
    const stageAssets = new Map();
    let ready = Boolean(
      environmentNode &&
      environmentAsset &&
      visual?.status === 'ready' &&
      visual?.activation === 'atomic-current-stage'
    );

    for (const inhabitant of config?.inhabitants || []) {
      const stage = activeStages.get(inhabitant.id);
      const node = visualNodes.get(inhabitant.id);
      const slot = visualSlotFor(inhabitant.id, visual);
      const asset = stage ? resolveVisualAsset(slot?.stages?.[stage.id], visual) : null;
      if (!stage || !node || !asset) ready = false;
      stageAssets.set(inhabitant.id, {node, stage, asset});
    }

    if (!ready) {
      if (environmentNode && fallback) environmentNode.setAttribute('src', fallback);
      for (const {node, stage} of stageAssets.values()) {
        if (!node) continue;
        node.hidden = true;
        node.removeAttribute('src');
        node.dataset.visualReady = 'false';
        if (stage) node.dataset.growthStage = stage.id;
      }
      root.dataset.worldVisualGrowth = visual?.status === 'ready'
        ? 'fallback'
        : visual?.status || 'awaiting-assets';
      return;
    }

    environmentNode.setAttribute('src', environmentAsset);
    for (const {node, stage, asset} of stageAssets.values()) {
      node.setAttribute('src', asset);
      node.hidden = false;
      node.dataset.visualReady = 'true';
      node.dataset.growthStage = stage.id;
    }
    root.dataset.worldVisualGrowth = 'active';
  }

  function worldHourFor(now) {
    return config?.clock?.model === 'shared-world-utc'
      ? now.getUTCHours()
      : now.getHours();
  }

  function dayPhaseFor(now) {
    const phases = Array.isArray(config?.dayPhases)
      ? config.dayPhases
          .filter((phase) => Number.isFinite(phase?.fromHour) && typeof phase?.id === 'string')
          .sort((a, b) => a.fromHour - b.fromHour)
      : [];
    const hour = worldHourFor(now);
    let active = phases[0] || {id: 'day', label: 'Monde vivant'};
    for (const phase of phases) {
      if (hour >= phase.fromHour) active = phase;
      else break;
    }
    return active;
  }

  function render(now = new Date()) {
    if (!config) return;

    const epoch = validDate(config?.clock?.epoch);
    const worldDays = epoch ? elapsedDays(epoch, now) : null;
    const phase = dayPhaseFor(now);

    root.dataset.worldPhase = phase.id;
    if (worldDays !== null) root.dataset.worldAgeDays = String(worldDays);

    const activeStages = new Map();

    if (phaseNode) phaseNode.textContent = phase.label || 'Monde vivant';
    if (ageNode) {
      ageNode.textContent = worldDays === null
        ? 'Chronologie indisponible'
        : worldDays === 0
          ? 'Jour de fondation'
          : `Jour ${worldDays + 1} du monde`;
    }

    for (const inhabitant of config.inhabitants || []) {
      const node = inhabitantNodes.get(inhabitant.id);
      const nextNode = nextStageNodes.get(inhabitant.id);
      const stage = stageFor(inhabitant, now);
      if (!stage) continue;
      activeStages.set(inhabitant.id, stage);

      if (node) {
        node.textContent = stage.label || inhabitant.label || inhabitant.id;
        node.dataset.growthStage = stage.id;
        node.dataset.ageDays = String(stage.days);
      }

      if (nextNode) {
        const delay = stage.daysUntilNext === 1 ? '1 jour' : `${stage.daysUntilNext} jours`;
        nextNode.textContent = stage.next
          ? `Prochaine étape : ${stage.next.label} dans ${delay}`
          : 'Croissance : stade adulte';
        nextNode.dataset.growthStage = stage.id;
      }

      root.dataset[`world${inhabitant.id[0].toUpperCase() + inhabitant.id.slice(1)}Stage`] = stage.id;
    }

    renderVisualGrowth(activeStages);

    if (statusNode) {
      const activity = phase.activity || 'Le monde évolue avec le temps, même entre deux visites.';
      statusNode.textContent = sourceState === 'offline-stale'
        ? `${activity} · dernière configuration connue hors ligne`
        : activity;
      statusNode.dataset.worldReady = 'true';
      statusNode.dataset.worldSource = sourceState;
    }
    root.dataset.worldSource = sourceState;
  }

  function schedule() {
    if (timer) window.clearInterval(timer);
    const seconds = Number(config?.clock?.refreshSeconds);
    const interval = Number.isFinite(seconds) ? Math.max(30, seconds) * 1000 : 60000;
    timer = window.setInterval(() => render(new Date()), interval);
  }

  async function load() {
    try {
      const response = await fetch(new URL(WORLD_URL, document.baseURI), {
        cache: 'no-cache',
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error('living-world-unavailable');
      sourceState = response.headers?.get('X-Modaryx-Cache') === 'offline-stale'
        ? 'offline-stale'
        : 'fresh';
      const data = await response.json();
      if (data?.schemaVersion !== 1 || data?.worldId !== 'modaryx-living-world') {
        throw new Error('living-world-invalid');
      }
      const declaredOrder = Array.isArray(data?.growthModel?.order) ? data.growthModel.order : [];
      if (declaredOrder.join('|') !== REQUIRED_GROWTH_ORDER.join('|')) {
        throw new Error('living-world-growth-model-invalid');
      }
      for (const inhabitant of data.inhabitants || []) {
        const order = Array.isArray(inhabitant?.stages) ? inhabitant.stages.map((stage) => stage?.id) : [];
        if (order.join('|') !== REQUIRED_GROWTH_ORDER.join('|')) {
          throw new Error('living-world-growth-stages-invalid');
        }
      }
      if (!validVisualGrowth(data)) {
        throw new Error('living-world-visual-growth-invalid');
      }
      config = data;
      render(new Date());
      schedule();
    } catch {
      root.dataset.worldSource = 'unavailable';
      if (statusNode) {
        statusNode.textContent = 'Le monde vivant est momentanément indisponible ; le contenu principal reste accessible.';
        statusNode.dataset.worldReady = 'false';
        statusNode.dataset.worldSource = 'unavailable';
      }
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && config) render(new Date());
  });

  load();
})();
