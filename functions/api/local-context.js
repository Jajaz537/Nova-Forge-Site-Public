import {
  coarseContextFromCf,
  normalizeOpenMeteoCurrent,
  normalizeWeatherApiCurrent
} from '../_lib/local-context.mjs';

const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
});

function weatherEndpoint(mode) {
  if (mode === 'weatherapi') return 'https://api.weatherapi.com/v1/current.json';
  if (mode === 'open-meteo-noncommercial') return 'https://api.open-meteo.com/v1/forecast';
  if (mode === 'open-meteo-commercial') return 'https://customer-api.open-meteo.com/v1/forecast';
  return null;
}

function weatherModeRequiresKey(mode) {
  return mode === 'weatherapi' || mode === 'open-meteo-commercial';
}

const WEATHER_PROVIDER_TIMEOUT_MS = 3500;

async function fetchWeather(context, coarse) {
  const mode = context.env?.MODARYX_WEATHER_MODE || 'off';
  const endpoint = weatherEndpoint(mode);
  if (!endpoint) return {status: 'not-connected', reason: 'provider-not-configured'};
  if (!coarse.providerCoordinates) return {status: 'unavailable', reason: 'coarse-location-unavailable'};

  if (weatherModeRequiresKey(mode) && !context.env?.MODARYX_WEATHER_API_KEY) {
    return {status: 'unavailable', reason: 'provider-api-key-missing'};
  }

  const url = new URL(endpoint);
  if (mode === 'weatherapi') {
    url.searchParams.set('key', context.env.MODARYX_WEATHER_API_KEY);
    url.searchParams.set(
      'q',
      coarse.providerCoordinates.latitude + ',' + coarse.providerCoordinates.longitude
    );
    url.searchParams.set('aqi', 'no');
  } else {
    url.searchParams.set('latitude', String(coarse.providerCoordinates.latitude));
    url.searchParams.set('longitude', String(coarse.providerCoordinates.longitude));
    url.searchParams.set(
      'current',
      'temperature_2m,apparent_temperature,is_day,precipitation,rain,snowfall,weather_code,cloud_cover,wind_speed_10m'
    );
    url.searchParams.set('timezone', 'auto');
    if (mode === 'open-meteo-commercial') {
      url.searchParams.set('apikey', context.env.MODARYX_WEATHER_API_KEY);
    }
  }

  try {
    const response = await fetch(url, {
      headers: {'accept': 'application/json'},
      signal: AbortSignal.timeout(WEATHER_PROVIDER_TIMEOUT_MS)
    });
    if (!response.ok) return {status: 'unavailable', reason: 'provider-http-' + response.status};
    const payload = await response.json();
    return mode === 'weatherapi'
      ? normalizeWeatherApiCurrent(payload)
      : normalizeOpenMeteoCurrent(payload);
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return {status: 'unavailable', reason: 'provider-timeout'};
    }
    return {status: 'unavailable', reason: 'provider-fetch-failed'};
  }
}

export async function onRequestGet(context) {
  const coarse = coarseContextFromCf(context.request.cf || {});
  const weather = await fetchWeather(context, coarse);

  return json({
    schemaVersion: 1,
    source: coarse.source,
    privacy: {
      exactCoordinatesReturned: false,
      cityReturned: false,
      postalCodeReturned: false,
      gpsPermissionRequested: false,
      providerCoordinatesRoundedDegrees: coarse.providerCoordinates ? 0.1 : null
    },
    context: {
      timezone: coarse.timezone,
      climateBand: coarse.climateBand
    },
    weather
  });
}
