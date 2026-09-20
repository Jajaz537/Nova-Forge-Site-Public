(() => {
  'use strict';

  const WORLD_URL = './data/living-world.json';
  const root = document.documentElement;
  const statusNode = document.querySelector('[data-world-status]');
  const phaseNode = document.querySelector('[data-world-phase]');
  const ageNode = document.querySelector('[data-world-age]');
  const chronicleNode = document.querySelector('[data-world-chronicle]');
  const inhabitantNodes = new Map(
    [...document.querySelectorAll('[data-world-inhabitant]')]
      .map((node) => [node.dataset.worldInhabitant, node])
  );
  const nextStageNodes = new Map(
    [...document.querySelectorAll('[data-world-next]')]
      .map((node) => [node.dataset.worldNext, node])
  );

  if (!statusNode && !phaseNode && !ageNode && !chronicleNode && inhabitantNodes.size === 0 && nextStageNodes.size === 0) return;

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

  function ambientSignalFor(now, phase, worldDays) {
    const model = config?.ambientSignals;
    const entries = Array.isArray(model?.entries)
      ? model.entries.filter((entry) =>
          typeof entry?.id === 'string' &&
          typeof entry?.text === 'string' &&
          Array.isArray(entry?.phases) &&
          entry.phases.includes(phase.id)
        )
      : [];
    if (!entries.length) return null;

    const cadence = Number(model?.cadenceHours);
    const cadenceHours = Number.isFinite(cadence) ? Math.max(1, Math.floor(cadence)) : 3;
    const hourSlot = Math.floor(worldHourFor(now) / cadenceHours);
    const day = Number.isFinite(worldDays) ? worldDays : 0;
    return entries[(day + hourSlot) % entries.length];
  }

  function render(now = new Date()) {
    if (!config) return;

    const epoch = validDate(config?.clock?.epoch);
    const worldDays = epoch ? elapsedDays(epoch, now) : null;
    const phase = dayPhaseFor(now);
    const signal = ambientSignalFor(now, phase, worldDays);

    root.dataset.worldPhase = phase.id;
    if (worldDays !== null) root.dataset.worldAgeDays = String(worldDays);

    if (phaseNode) phaseNode.textContent = phase.label || 'Monde vivant';
    if (ageNode) {
      ageNode.textContent = worldDays === null
        ? 'Chronologie indisponible'
        : worldDays === 0
          ? 'Jour de fondation'
          : `Jour ${worldDays + 1} du monde`;
    }

    if (chronicleNode) {
      chronicleNode.textContent = signal?.text || 'Le royaume suit son rythme quotidien.';
      if (signal?.id) chronicleNode.dataset.worldSignal = signal.id;
      else delete chronicleNode.dataset.worldSignal;
    }
    if (signal?.id) root.dataset.worldSignal = signal.id;
    else delete root.dataset.worldSignal;

    for (const inhabitant of config.inhabitants || []) {
      const node = inhabitantNodes.get(inhabitant.id);
      const nextNode = nextStageNodes.get(inhabitant.id);
      const stage = stageFor(inhabitant, now);
      if (!stage) continue;

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

    if (statusNode) {
      const activity = phase.activity || 'Le monde évolue avec le temps, même entre deux visites.';
      statusNode.textContent = sourceState === 'offline-stale'
        ? `${activity} · dernière configuration connue hors ligne`
        : activity;
      statusNode.dataset.worldReady = 'true';
      statusNode.dataset.worldSource = sourceState;
    }
    root.dataset.worldSource = sourceState;
    root.dataset.worldVisualGrowth = config?.visualGrowth?.status || 'awaiting-assets';
    if (config?.visualGrowth?.status === 'ready') scheduleVisualGrowth();
  }

  let visualGrowthWaitingForLoad = false;

  function activateVisualGrowth() {
    if (config?.visualGrowth?.status !== 'ready') return;
    import(new URL('./assets/living-world-visual-growth.mjs', document.baseURI).href)
      .then((module) => module.renderVisualGrowth({
        config,
        document,
        root,
        stages: Object.fromEntries(
          (config.inhabitants || []).map((inhabitant) => [
            inhabitant.id,
            root.dataset[`world${inhabitant.id[0].toUpperCase() + inhabitant.id.slice(1)}Stage`]
          ])
        )
      }))
      .catch(() => { root.dataset.worldVisualGrowth = 'fallback'; });
  }

  function scheduleVisualGrowth() {
    const run = () => {
      visualGrowthWaitingForLoad = false;
      const activate = () => activateVisualGrowth();
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(activate, {timeout: 1500});
      } else {
        window.setTimeout(activate, 0);
      }
    };

    if (document.readyState === 'complete') {
      run();
      return;
    }
    if (visualGrowthWaitingForLoad) return;
    visualGrowthWaitingForLoad = true;
    window.addEventListener('load', () => window.setTimeout(run, 0), {once: true});
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
      const visualGrowth = data?.visualGrowth;
      if (!visualGrowth || visualGrowth.model !== 'layered-stage-assets-v1' || !['awaiting-assets', 'ready'].includes(visualGrowth.status)) {
        throw new Error('living-world-visual-growth-contract-invalid');
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
