const SEASON_LABELS = {
  winter: 'hiver',
  spring: 'printemps',
  summer: 'été',
  autumn: 'automne',
  tropical: 'cycle tropical'
};

const WEATHER_LABELS = {
  clear: 'ciel dégagé',
  cloud: 'ciel couvert',
  'partly-cloudy': 'éclaircies',
  rain: 'pluie',
  snow: 'neige',
  fog: 'brouillard',
  storm: 'orage',
  wind: 'vent soutenu',
  unavailable: 'météo indisponible'
};

const DAYPART_LABELS = {
  dawn: 'aube locale',
  day: 'journée locale',
  dusk: 'soirée locale',
  night: 'nuit locale'
};

function clamp01(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : 0;
}

export function inferClimateBandFromTimezone(timezone = '') {
  const tz = String(timezone);
  const tropical = [
    'Asia/Singapore','Asia/Jakarta','Asia/Kuala_Lumpur','Asia/Manila',
    'Africa/Nairobi','Africa/Lagos','America/Bogota','America/Panama',
    'America/Costa_Rica','America/Guayaquil'
  ];
  if (tropical.some((item) => tz === item || tz.startsWith(item + '/'))) return 'tropical';

  const south = [
    'Australia/','Pacific/Auckland','Pacific/Chatham','America/Argentina/',
    'America/Santiago','America/Montevideo','Africa/Johannesburg',
    'Africa/Maputo','Africa/Windhoek'
  ];
  if (south.some((item) => item.endsWith('/') ? tz.startsWith(item) : tz === item)) return 'south-temperate';
  return 'north-temperate';
}

export function zonedParts(date = new Date(), timezone = null) {
  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  };
  if (timezone) options.timeZone = timezone;
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(date);
  const value = (type) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
    hour: value('hour'),
    minute: value('minute')
  };
}

function seasonQuarter(month) {
  return Math.floor((month % 12) / 3) % 4;
}

function seasonBounds(year, month) {
  const quarter = seasonQuarter(month);
  const starts = [12, 3, 6, 9];
  const startMonth = starts[quarter];
  let startYear = year;
  if (quarter === 0 && month < 12) startYear -= 1;
  const endMonth = quarter === 0 ? 3 : startMonth + 3;
  const endYear = quarter === 0 ? startYear + 1 : startYear;
  return {
    start: Date.UTC(startYear, startMonth - 1, 1),
    end: Date.UTC(endYear, endMonth - 1, 1)
  };
}

export function seasonState(date = new Date(), climateBand = 'north-temperate', timezone = null) {
  const parts = zonedParts(date, timezone);
  if (climateBand === 'tropical') {
    return {season: 'tropical', nextSeason: 'tropical', progress: 0};
  }

  const names = climateBand === 'south-temperate'
    ? ['summer', 'autumn', 'winter', 'spring']
    : ['winter', 'spring', 'summer', 'autumn'];
  const quarter = seasonQuarter(parts.month);
  const bounds = seasonBounds(parts.year, parts.month);
  const localDate = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  const progress = clamp01((localDate - bounds.start) / (bounds.end - bounds.start));
  return {
    season: names[quarter],
    nextSeason: names[(quarter + 1) % names.length],
    progress: Number(progress.toFixed(4))
  };
}

export function localDaypart(date = new Date(), timezone = null) {
  const {hour} = zonedParts(date, timezone);
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'dusk';
  return 'night';
}

export function visualMix(season, daypart, weather = {}) {
  const seasonMix = {
    winter: {sat: 0.9, bright: 0.97, sepia: 0.01},
    spring: {sat: 1.06, bright: 1.02, sepia: 0.01},
    summer: {sat: 1.08, bright: 1.04, sepia: 0.035},
    autumn: {sat: 1.02, bright: 0.99, sepia: 0.085},
    tropical: {sat: 1.08, bright: 1.02, sepia: 0.02}
  }[season] || {sat: 1, bright: 1, sepia: 0};

  const dayMix = {
    dawn: {bright: 0.94, contrast: 1.02},
    day: {bright: 1, contrast: 1},
    dusk: {bright: 0.9, contrast: 1.04},
    night: {bright: 0.78, contrast: 1.08}
  }[daypart] || {bright: 1, contrast: 1};

  const condition = weather?.status === 'live' ? weather.condition : 'unavailable';
  const weatherMix = {
    clear: {sat: 1, bright: 1, contrast: 1},
    cloud: {sat: 0.94, bright: 0.94, contrast: 1.02},
    'partly-cloudy': {sat: 1.01, bright: 1.01, contrast: 1.01},
    rain: {sat: 0.86, bright: 0.86, contrast: 1.05},
    snow: {sat: 0.9, bright: 1.04, contrast: 1.01},
    fog: {sat: 0.88, bright: 0.98, contrast: 0.88},
    storm: {sat: 0.78, bright: 0.76, contrast: 1.12},
    wind: {sat: 0.97, bright: 0.98, contrast: 1.02},
    unavailable: {sat: 1, bright: 1, contrast: 1}
  }[condition] || {sat: 1, bright: 1, contrast: 1};

  return {season: seasonMix, day: dayMix, weather: weatherMix};
}

function styleLink(document) {
  if (document.querySelector('link[data-real-world-sync-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./real-world-sync.css', import.meta.url).href;
  link.dataset.realWorldSyncStyle = 'true';
  document.head.append(link);
}

function weatherLayer(document) {
  const hero = document.querySelector('.modaryx-realm-hero');
  if (!hero) return null;
  let layer = hero.querySelector('[data-real-weather-layer]');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'real-world-weather-layer';
    layer.dataset.realWeatherLayer = '';
    layer.setAttribute('aria-hidden', 'true');
    hero.insertBefore(layer, hero.firstChild);
  }
  layer.hidden = false;
  return layer;
}

function intensityLabel(value) {
  const intensity = clamp01(value);
  if (intensity < 0.25) return 'légère';
  if (intensity < 0.65) return 'modérée';
  return 'marquée';
}

export function localActivityLens(state = {}) {
  const weather = state.weather?.status === 'live' ? state.weather.condition : 'unavailable';
  const time = {
    dawn: 'Premiers ateliers et chemins reprennent',
    day: 'Routes, jardins et ateliers restent actifs',
    dusk: 'Lanternes renforcées · retours vers les quartiers habités',
    night: 'Lanternes et veille renforcées · déplacements plus calmes'
  }[state.daypart] || 'Le royaume adapte son rythme local';

  const weatherText = {
    storm: 'activités extérieures réduites · passages abrités privilégiés',
    rain: 'marchés et travaux se replient sous couvert',
    snow: 'chemins surveillés · activités rapprochées des foyers',
    fog: 'circulation ralentie · veilleurs aux carrefours',
    wind: 'étals protégés · traversées exposées réduites',
    cloud: 'activité normale sous lumière diffuse',
    'partly-cloudy': 'activité extérieure maintenue pendant les éclaircies'
  }[weather] || '';

  const seasonText = {
    winter: 'foyers et ateliers plus présents',
    spring: 'jardins et sentiers reprennent',
    summer: 'jardins, quais et marchés plus animés',
    autumn: 'récoltes et ateliers plus actifs',
    tropical: 'activité extérieure étalée autour des zones ombragées'
  }[state.season] || '';

  const pieces = [time, weatherText || seasonText].filter(Boolean);
  return {
    id: [state.daypart || 'local', weather, state.season || 'season'].join('-'),
    text: pieces.join(' · ')
  };
}

function describe(state) {
  const season = SEASON_LABELS[state.season] || state.season;
  const daypart = DAYPART_LABELS[state.daypart] || state.daypart;
  if (state.weather?.status === 'live') {
    const weather = WEATHER_LABELS[state.weather.condition] || state.weather.condition;
    const qualifier = ['rain','snow','storm','wind'].includes(state.weather.condition)
      ? ' ' + intensityLabel(state.weather.intensity)
      : '';
    return 'Automatique · ' + season + ' · ' + daypart + ' · ' + weather + qualifier;
  }
  return 'Automatique · ' + season + ' · ' + daypart + ' · météo réelle non connectée';
}

function applyRoot(root, state) {
  const mix = visualMix(state.season, state.daypart, state.weather);
  root.dataset.realitySync = 'active';
  root.dataset.realitySource = state.source;
  root.dataset.localClimate = state.climateBand;
  root.dataset.localSeason = state.season;
  root.dataset.localSeasonNext = state.nextSeason;
  root.dataset.localDaypart = state.daypart;
  root.dataset.localWeather = state.weather?.status === 'live' ? state.weather.condition : 'unavailable';
  root.style.setProperty('--mx-season-progress', String(state.seasonProgress));
  root.style.setProperty('--mx-season-sat', String(mix.season.sat));
  root.style.setProperty('--mx-season-bright', String(mix.season.bright));
  root.style.setProperty('--mx-season-sepia', String(mix.season.sepia));
  root.style.setProperty('--mx-day-bright', String(mix.day.bright));
  root.style.setProperty('--mx-day-contrast', String(mix.day.contrast));
  root.style.setProperty('--mx-weather-sat', String(mix.weather.sat));
  root.style.setProperty('--mx-weather-bright', String(mix.weather.bright));
  root.style.setProperty('--mx-weather-contrast', String(mix.weather.contrast));
  root.style.setProperty('--mx-weather-intensity', String(clamp01(state.weather?.intensity)));
}

function attributionNode(document, weather) {
  const host = document.querySelector('[data-real-world-context]')?.parentElement;
  if (!host) return;
  let link = host.querySelector('[data-weather-attribution]');
  if (weather?.status !== 'live' || !weather.attribution?.url) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('a');
    link.dataset.weatherAttribution = '';
    link.className = 'world-weather-attribution';
    link.rel = 'noreferrer';
    link.target = '_blank';
    host.append(link);
  }
  link.href = weather.attribution.url;
  link.textContent = 'Météo : ' + (weather.attribution.label || 'source externe');
}

function disclaimerNode(document, weather) {
  const host = document.querySelector('[data-real-world-context]')?.parentElement;
  if (!host) return;
  let note = host.querySelector('[data-weather-disclaimer]');
  if (weather?.status !== 'live' || !weather.disclaimer) {
    note?.remove();
    return;
  }
  if (!note) {
    note = document.createElement('p');
    note.dataset.weatherDisclaimer = '';
    note.className = 'world-weather-disclaimer';
    host.append(note);
  }
  note.textContent = weather.disclaimer;
}

export async function resolveRealityContext({
  document = globalThis.document,
  now = new Date(),
  contextOverride = null
} = {}) {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  let payload = contextOverride;
  let source = 'browser-timezone';

  if (!payload && document) {
    try {
      const response = await fetch(new URL('./api/local-context', document.baseURI), {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: {'accept': 'application/json'}
      });
      if (response.ok) {
        const candidate = await response.json();
        if (candidate?.schemaVersion === 1) {
          payload = candidate;
          source = candidate.source || 'edge-coarse';
        }
      }
    } catch {}
  }

  const timezone = payload?.context?.timezone || browserTimezone;
  const climateBand = payload?.context?.climateBand && payload.context.climateBand !== 'unknown'
    ? payload.context.climateBand
    : inferClimateBandFromTimezone(timezone);
  const season = seasonState(now, climateBand, timezone);
  const weather = payload?.weather || {status: 'not-connected', reason: 'provider-not-configured'};

  return {
    source,
    timezone,
    climateBand,
    season: season.season,
    nextSeason: season.nextSeason,
    seasonProgress: season.progress,
    daypart: localDaypart(now, timezone),
    weather
  };
}

export async function applyRealitySync({
  document = globalThis.document,
  now = new Date(),
  contextOverride = null
} = {}) {
  if (!document?.documentElement || !document.querySelector('.modaryx-realm-hero')) return null;
  styleLink(document);
  const state = await resolveRealityContext({document, now, contextOverride});
  applyRoot(document.documentElement, state);

  const contextNode = document.querySelector('[data-real-world-context]');
  if (contextNode) contextNode.textContent = describe(state);
  const activity = localActivityLens(state);
  const activityNode = document.querySelector('[data-local-world-activity]');
  if (activityNode) {
    activityNode.textContent = activity.text;
    activityNode.dataset.localActivity = activity.id;
  }
  document.documentElement.dataset.localActivity = activity.id;
  attributionNode(document, state.weather);
  disclaimerNode(document, state.weather);

  weatherLayer(document);
  return state;
}

if (typeof document !== 'undefined' && document.querySelector('.modaryx-realm-hero')) {
  applyRealitySync().catch(() => {
    document.documentElement.dataset.realitySync = 'fallback';
  });
}
