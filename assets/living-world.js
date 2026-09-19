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

  if (!statusNode && !phaseNode && !ageNode && inhabitantNodes.size === 0) return;

  const DAY_MS = 24 * 60 * 60 * 1000;
  const REQUIRED_GROWTH_ORDER = ['baby', 'juvenile', 'adolescent', 'young-adult', 'adult'];
  let timer = null;
  let config = null;

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
    let active = stages[0] || null;
    for (const stage of stages) {
      if (days >= stage.fromDay) active = stage;
      else break;
    }
    return active ? {...active, days} : null;
  }

  function dayPhaseFor(now) {
    const phases = Array.isArray(config?.dayPhases)
      ? config.dayPhases
          .filter((phase) => Number.isFinite(phase?.fromHour) && typeof phase?.id === 'string')
          .sort((a, b) => a.fromHour - b.fromHour)
      : [];
    let active = phases[0] || {id: 'day', label: 'Monde vivant'};
    for (const phase of phases) {
      if (now.getHours() >= phase.fromHour) active = phase;
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
      const stage = stageFor(inhabitant, now);
      if (!node || !stage) continue;
      node.textContent = stage.label || inhabitant.label || inhabitant.id;
      node.dataset.growthStage = stage.id;
      node.dataset.ageDays = String(stage.days);
      root.dataset[`world${inhabitant.id[0].toUpperCase() + inhabitant.id.slice(1)}Stage`] = stage.id;
    }

    if (statusNode) {
      statusNode.textContent = 'Le monde évolue avec le temps, même entre deux visites.';
      statusNode.dataset.worldReady = 'true';
    }
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
      config = data;
      render(new Date());
      schedule();
    } catch {
      if (statusNode) {
        statusNode.textContent = 'Le monde vivant est momentanément indisponible ; le contenu principal reste accessible.';
        statusNode.dataset.worldReady = 'false';
      }
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && config) render(new Date());
  });

  load();
})();
