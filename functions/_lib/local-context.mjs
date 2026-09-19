export function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function roundCoordinate(value, step = 0.1) {
  const number = finiteNumber(value);
  if (number === null || !Number.isFinite(step) || step <= 0) return null;
  return Math.round(number / step) * step;
}

export function climateBandForLatitude(latitude) {
  const lat = finiteNumber(latitude);
  if (lat === null) return 'unknown';
  if (Math.abs(lat) < 23.4366) return 'tropical';
  return lat < 0 ? 'south-temperate' : 'north-temperate';
}

export function coarseContextFromCf(cf = {}) {
  const latitude = finiteNumber(cf.latitude);
  const longitude = finiteNumber(cf.longitude);
  const timezone = typeof cf.timezone === 'string' && cf.timezone.includes('/')
    ? cf.timezone
    : null;

  return {
    source: latitude !== null && longitude !== null ? 'cloudflare-coarse' : 'edge-fallback',
    timezone,
    climateBand: climateBandForLatitude(latitude),
    providerCoordinates: latitude !== null && longitude !== null
      ? {
          latitude: roundCoordinate(latitude, 0.1),
          longitude: roundCoordinate(longitude, 0.1)
        }
      : null
  };
}

function clamp01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
}

function weatherConditionFromCode(code, current) {
  const snowfall = Math.max(0, Number(current?.snowfall) || 0);
  const rain = Math.max(0, Number(current?.rain) || 0);
  const precipitation = Math.max(0, Number(current?.precipitation) || 0);
  const wind = Math.max(0, Number(current?.wind_speed_10m) || 0);
  const cloud = Math.max(0, Number(current?.cloud_cover) || 0);
  const numericCode = Number(code);

  if (snowfall > 0 || (numericCode >= 71 && numericCode <= 77) || numericCode === 85 || numericCode === 86) return 'snow';
  if (numericCode >= 95) return 'storm';
  if (rain > 0 || precipitation > 0 || (numericCode >= 51 && numericCode <= 67) || (numericCode >= 80 && numericCode <= 82)) return 'rain';
  if (numericCode === 45 || numericCode === 48) return 'fog';
  if (wind >= 45) return 'wind';
  if (cloud >= 70 || numericCode === 2 || numericCode === 3) return 'cloud';
  return 'clear';
}

export function normalizeOpenMeteoCurrent(payload = {}) {
  const current = payload?.current;
  if (!current || typeof current !== 'object') {
    return {status: 'unavailable', reason: 'missing-current'};
  }

  const condition = weatherConditionFromCode(current.weather_code, current);
  const precipitation = Math.max(0, Number(current.precipitation) || 0);
  const rain = Math.max(0, Number(current.rain) || 0);
  const snowfall = Math.max(0, Number(current.snowfall) || 0);
  const wind = Math.max(0, Number(current.wind_speed_10m) || 0);

  let intensity = 0;
  if (condition === 'rain') intensity = clamp01(Math.max(precipitation, rain) / 6);
  else if (condition === 'snow') intensity = clamp01(Math.max(snowfall / 2, precipitation / 5));
  else if (condition === 'storm') intensity = clamp01(0.65 + precipitation / 15 + wind / 180);
  else if (condition === 'wind') intensity = clamp01(wind / 90);
  else if (condition === 'fog') intensity = 0.55;
  else if (condition === 'cloud') intensity = clamp01((Number(current.cloud_cover) || 0) / 100);

  return {
    status: 'live',
    condition,
    intensity: Number(intensity.toFixed(3)),
    temperatureC: finiteNumber(current.temperature_2m),
    apparentTemperatureC: finiteNumber(current.apparent_temperature),
    isDay: Number(current.is_day) === 1,
    cloudCover: finiteNumber(current.cloud_cover),
    windKph: finiteNumber(current.wind_speed_10m),
    observedAt: typeof current.time === 'string' ? current.time : null,
    attribution: {
      label: 'Open-Meteo',
      url: 'https://open-meteo.com/'
    }
  };
}
