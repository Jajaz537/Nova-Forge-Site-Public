const REQUIRED_GROWTH_ORDER = ['baby', 'juvenile', 'adolescent', 'young-adult', 'adult'];
const STYLE_URL = './assets/living-world-visual-growth.css';

function resolveAsset(value, visual, baseURI) {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (visual?.assetPolicy?.sameOrigin !== true || typeof visual?.assetPolicy?.allowedPrefix !== 'string') return null;
  try {
    const assetUrl = new URL(value, baseURI);
    const baseUrl = new URL(baseURI);
    const prefixUrl = new URL(visual.assetPolicy.allowedPrefix, baseURI);
    if (assetUrl.origin !== baseUrl.origin || prefixUrl.origin !== baseUrl.origin) return null;
    if (!assetUrl.pathname.startsWith(prefixUrl.pathname)) return null;
    return assetUrl.href;
  } catch {
    return null;
  }
}

function slotFor(visual, inhabitantId) {
  return (visual?.slots || []).find((slot) => slot?.inhabitantId === inhabitantId) || null;
}

export function validateVisualGrowth(config, baseURI) {
  const visual = config?.visualGrowth;
  const inhabitants = Array.isArray(config?.inhabitants) ? config.inhabitants : [];
  if (!visual || visual.model !== 'layered-stage-assets-v1') return false;
  if (!['awaiting-assets', 'ready'].includes(visual.status)) return false;
  if (visual.activation !== 'atomic-current-stage' || visual.fallback !== 'composite-hero') return false;
  if (visual.assetPolicy?.loading !== 'current-stage-only' || visual.assetPolicy?.cache !== 'runtime-on-demand') return false;
  if (!Number.isFinite(visual.canvas?.width) || visual.canvas.width <= 0) return false;
  if (!Number.isFinite(visual.canvas?.height) || visual.canvas.height <= 0) return false;
  if (!Array.isArray(visual.slots) || visual.slots.length !== inhabitants.length) return false;

  const seen = new Set();
  for (const inhabitant of inhabitants) {
    const slot = slotFor(visual, inhabitant.id);
    if (!slot || seen.has(slot.inhabitantId)) return false;
    seen.add(slot.inhabitantId);
    const keys = Object.keys(slot.stages || {});
    if (keys.join('|') !== REQUIRED_GROWTH_ORDER.join('|')) return false;
    for (const stageId of REQUIRED_GROWTH_ORDER) {
      const value = slot.stages[stageId];
      if (visual.status === 'ready' && typeof value !== 'string') return false;
      if (value !== null && resolveAsset(value, visual, baseURI) === null) return false;
    }
  }

  if (visual.status === 'ready' && typeof visual.environmentAsset !== 'string') return false;
  if (visual.environmentAsset !== null && resolveAsset(visual.environmentAsset, visual, baseURI) === null) return false;
  return true;
}

function ensureStyle(document, baseURI) {
  if (document.querySelector('link[data-world-visual-growth-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(STYLE_URL, baseURI).href;
  link.dataset.worldVisualGrowthStyle = 'true';
  document.head.append(link);
}

function ensureLayers(document, hero, inhabitants, canvas) {
  let container = document.querySelector('[data-world-visual-layers]');
  if (!container) {
    container = document.createElement('div');
    container.className = 'living-world-visual-layers';
    container.dataset.worldVisualLayers = 'true';
    container.setAttribute('aria-hidden', 'true');
    hero.append(container);
  }

  const nodes = new Map();
  for (const inhabitant of inhabitants) {
    let node = container.querySelector(`[data-world-visual="${inhabitant.id}"]`);
    if (!node) {
      node = document.createElement('img');
      node.alt = '';
      node.hidden = true;
      node.width = canvas.width;
      node.height = canvas.height;
      node.dataset.worldVisual = inhabitant.id;
      container.append(node);
    }
    nodes.set(inhabitant.id, node);
  }
  return {container, nodes};
}

function defaultLoadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(url);
    image.onerror = () => reject(new Error('visual-growth-asset-load-failed'));
    image.src = url;
  });
}

export async function renderVisualGrowth({
  config,
  document,
  root = document.documentElement,
  stages,
  loadImage = defaultLoadImage
}) {
  const baseURI = document.baseURI;
  const visual = config?.visualGrowth;

  if (!validateVisualGrowth(config, baseURI)) {
    root.dataset.worldVisualGrowth = 'fallback';
    return false;
  }

  if (visual.status !== 'ready') {
    root.dataset.worldVisualGrowth = visual.status;
    return false;
  }

  const environment = document.querySelector('[data-world-environment], .modaryx-realm-art');
  const hero = document.querySelector('.modaryx-realm-hero');
  if (!environment || !hero) {
    root.dataset.worldVisualGrowth = 'fallback';
    return false;
  }

  const environmentUrl = resolveAsset(visual.environmentAsset, visual, baseURI);
  const bundle = [];
  for (const inhabitant of config.inhabitants || []) {
    const stageId = stages?.[inhabitant.id];
    const slot = slotFor(visual, inhabitant.id);
    if (!REQUIRED_GROWTH_ORDER.includes(stageId)) {
      root.dataset.worldVisualGrowth = 'fallback';
      return false;
    }
    const assetUrl = resolveAsset(slot?.stages?.[stageId], visual, baseURI);
    if (!assetUrl) {
      root.dataset.worldVisualGrowth = 'fallback';
      return false;
    }
    bundle.push({inhabitant, stageId, assetUrl});
  }

  try {
    await Promise.all([environmentUrl, ...bundle.map((item) => item.assetUrl)].map((url) => loadImage(url)));
  } catch {
    root.dataset.worldVisualGrowth = 'fallback';
    return false;
  }

  ensureStyle(document, baseURI);
  const {nodes} = ensureLayers(document, hero, config.inhabitants || [], visual.canvas);
  environment.setAttribute('src', environmentUrl);

  for (const item of bundle) {
    const node = nodes.get(item.inhabitant.id);
    node.setAttribute('src', item.assetUrl);
    node.hidden = false;
    node.dataset.visualReady = 'true';
    node.dataset.growthStage = item.stageId;
  }

  root.dataset.worldVisualGrowth = 'active';
  return true;
}
