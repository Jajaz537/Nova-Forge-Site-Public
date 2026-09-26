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
  if (numericCode === 1 || cloud >= 25) return 'partly-cloudy';
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
  else if (condition === 'partly-cloudy') intensity = clamp01(((Number(current.cloud_cover) || 0) - 20) / 60);

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


const WEATHERAPI_STORM_CODES = new Set([1087, 1273, 1276, 1279, 1282]);
const WEATHERAPI_SNOW_CODES = new Set([
  1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264
]);
const WEATHERAPI_RAIN_CODES = new Set([
  1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195,
  1198, 1201, 1204, 1207, 1240, 1243, 1246, 1249, 1252
]);
const WEATHERAPI_FOG_CODES = new Set([1030, 1135, 1147]);

function weatherApiCondition(current = {}) {
  const code = Number(current?.condition?.code);
  const precipitation = Math.max(0, Number(current?.precip_mm) || 0);
  const wind = Math.max(0, Number(current?.wind_kph) || 0);
  const cloud = Math.max(0, Number(current?.cloud) || 0);

  if (WEATHERAPI_STORM_CODES.has(code)) return 'storm';
  if (WEATHERAPI_SNOW_CODES.has(code)) return 'snow';
  if (WEATHERAPI_RAIN_CODES.has(code) || precipitation > 0) return 'rain';
  if (WEATHERAPI_FOG_CODES.has(code)) return 'fog';
  if (wind >= 45) return 'wind';
  if (code === 1006 || code === 1009 || cloud >= 70) return 'cloud';
  if (code === 1003 || cloud >= 25) return 'partly-cloudy';
  return 'clear';
}

export function normalizeWeatherApiCurrent(payload = {}) {
  const current = payload?.current;
  if (!current || typeof current !== 'object') {
    return {status: 'unavailable', reason: 'missing-current'};
  }

  const condition = weatherApiCondition(current);
  const precipitation = Math.max(0, Number(current.precip_mm) || 0);
  const wind = Math.max(0, Number(current.wind_kph) || 0);
  const cloud = Math.max(0, Number(current.cloud) || 0);

  let intensity = 0;
  if (condition === 'rain') intensity = clamp01(precipitation / 6);
  else if (condition === 'snow') intensity = clamp01(Math.max(0.35, precipitation / 5));
  else if (condition === 'storm') intensity = clamp01(0.65 + precipitation / 15 + wind / 180);
  else if (condition === 'wind') intensity = clamp01(wind / 90);
  else if (condition === 'fog') intensity = 0.55;
  else if (condition === 'cloud') intensity = clamp01(cloud / 100);
  else if (condition === 'partly-cloudy') intensity = clamp01((cloud - 20) / 60);

  return {
    status: 'live',
    condition,
    intensity: Number(intensity.toFixed(3)),
    temperatureC: finiteNumber(current.temp_c),
    apparentTemperatureC: finiteNumber(current.feelslike_c),
    isDay: Number(current.is_day) === 1,
    cloudCover: finiteNumber(current.cloud),
    windKph: finiteNumber(current.wind_kph),
    observedAt: typeof current.last_updated === 'string' ? current.last_updated : null,
    attribution: {
      label: 'WeatherAPI.com',
      url: 'https://www.weatherapi.com/'
    },
    disclaimer: 'Les informations météo sont indicatives et peuvent être inexactes localement. Ne les utilisez pas seules pour la sécurité, l’aviation, la navigation maritime ou les urgences ; consultez les services météorologiques officiels.'
  };
}
