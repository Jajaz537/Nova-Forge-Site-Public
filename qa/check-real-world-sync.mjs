import fs from 'node:fs';
import {
  inferClimateBandFromTimezone,
  seasonState,
  localDaypart,
  visualMix,
  localActivityLens
} from '../assets/real-world-sync.mjs';
import {
  roundCoordinate,
  climateBandForLatitude,
  coarseContextFromCf,
  normalizeOpenMeteoCurrent,
  normalizeWeatherApiCurrent
} from '../functions/_lib/local-context.mjs';

const failures=[];
const assert=(name,condition)=>{if(!condition)failures.push(name);};

assert('Sydney timezone must map south',inferClimateBandFromTimezone('Australia/Sydney')==='south-temperate');
assert('Singapore timezone must map tropical',inferClimateBandFromTimezone('Asia/Singapore')==='tropical');
assert('Paris fallback must map north',inferClimateBandFromTimezone('Europe/Paris')==='north-temperate');

assert('north January winter',seasonState(new Date('2026-01-15T12:00:00Z'),'north-temperate','UTC').season==='winter');
assert('north July summer',seasonState(new Date('2026-07-15T12:00:00Z'),'north-temperate','UTC').season==='summer');
assert('south January summer',seasonState(new Date('2026-01-15T12:00:00Z'),'south-temperate','UTC').season==='summer');
assert('south July winter',seasonState(new Date('2026-07-15T12:00:00Z'),'south-temperate','UTC').season==='winter');
assert('tropical stays tropical',seasonState(new Date('2026-07-15T12:00:00Z'),'tropical','UTC').season==='tropical');

const janStart=seasonState(new Date('2026-01-02T12:00:00Z'),'north-temperate','UTC');
const febEnd=seasonState(new Date('2026-02-27T12:00:00Z'),'north-temperate','UTC');
assert('season progress must advance',janStart.progress<febEnd.progress);

assert('dawn daypart',localDaypart(new Date('2026-01-15T06:00:00Z'),'UTC')==='dawn');
assert('day daypart',localDaypart(new Date('2026-01-15T12:00:00Z'),'UTC')==='day');
assert('dusk daypart',localDaypart(new Date('2026-01-15T19:00:00Z'),'UTC')==='dusk');
assert('night daypart',localDaypart(new Date('2026-01-15T23:00:00Z'),'UTC')==='night');

assert('latitude north band',climateBandForLatitude(52.1)==='north-temperate');
assert('latitude south band',climateBandForLatitude(-33.9)==='south-temperate');
assert('latitude tropical band',climateBandForLatitude(1.3)==='tropical');
assert('coordinate rounding',roundCoordinate(-33.8688,0.1)===-33.9);

const coarse=coarseContextFromCf({
  latitude:'52.12345',longitude:'4.98765',timezone:'Europe/Amsterdam',
  city:'ShouldNotEscape',postalCode:'0000'
});
assert('coarse source',coarse.source==='cloudflare-coarse');
assert('coarse timezone',coarse.timezone==='Europe/Amsterdam');
assert('coarse climate band',coarse.climateBand==='north-temperate');
assert('provider latitude rounded',coarse.providerCoordinates.latitude===52.1);
assert('provider longitude rounded',coarse.providerCoordinates.longitude===5);

const rain=normalizeOpenMeteoCurrent({current:{
  time:'2026-09-20T00:00',weather_code:61,precipitation:2.4,rain:2.4,snowfall:0,
  cloud_cover:92,wind_speed_10m:24,temperature_2m:12,apparent_temperature:10,is_day:0
}});
assert('rain normalized live',rain.status==='live'&&rain.condition==='rain'&&rain.intensity>0);
const snow=normalizeOpenMeteoCurrent({current:{
  time:'2026-01-20T20:00',weather_code:73,precipitation:1.2,rain:0,snowfall:1.5,
  cloud_cover:100,wind_speed_10m:18,temperature_2m:-2,apparent_temperature:-6,is_day:0
}});
assert('snow normalized',snow.condition==='snow'&&snow.intensity>0);
const fog=normalizeOpenMeteoCurrent({current:{
  time:'2026-10-20T07:00',weather_code:45,precipitation:0,rain:0,snowfall:0,
  cloud_cover:100,wind_speed_10m:4,temperature_2m:8,apparent_temperature:7,is_day:1
}});
assert('fog normalized',fog.condition==='fog');
const storm=normalizeOpenMeteoCurrent({current:{
  time:'2026-08-20T16:00',weather_code:95,precipitation:5,rain:5,snowfall:0,
  cloud_cover:100,wind_speed_10m:52,temperature_2m:24,apparent_temperature:26,is_day:1
}});
assert('storm normalized',storm.condition==='storm');
const wind=normalizeOpenMeteoCurrent({current:{
  time:'2026-09-20T14:00',weather_code:0,precipitation:0,rain:0,snowfall:0,
  cloud_cover:18,wind_speed_10m:58,temperature_2m:17,apparent_temperature:15,is_day:1
}});
assert('wind normalized',wind.condition==='wind'&&wind.intensity>0);
const cloud=normalizeOpenMeteoCurrent({current:{
  time:'2026-09-20T14:00',weather_code:3,precipitation:0,rain:0,snowfall:0,
  cloud_cover:88,wind_speed_10m:12,temperature_2m:17,apparent_temperature:17,is_day:1
}});
assert('cloud normalized',cloud.condition==='cloud'&&cloud.intensity>.7);
const clearSpells=normalizeOpenMeteoCurrent({current:{
  time:'2026-09-20T14:00',weather_code:1,precipitation:0,rain:0,snowfall:0,
  cloud_cover:46,wind_speed_10m:10,temperature_2m:18,apparent_temperature:18,is_day:1
}});
assert('clear spells normalized',clearSpells.condition==='partly-cloudy'&&clearSpells.intensity>0);


const weatherApiRain=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-09-21 18:00',temp_c:15,feelslike_c:14,is_day:1,
  condition:{code:1189,text:'Moderate rain'},wind_kph:22,precip_mm:2.8,cloud:91
}});
assert('WeatherAPI rain normalized',weatherApiRain.status==='live'&&weatherApiRain.condition==='rain'&&weatherApiRain.intensity>0);
assert('WeatherAPI attribution normalized',weatherApiRain.attribution?.label==='WeatherAPI.com'&&weatherApiRain.attribution?.url==='https://www.weatherapi.com/');
assert('WeatherAPI disclaimer normalized',typeof weatherApiRain.disclaimer==='string'&&weatherApiRain.disclaimer.includes('services météorologiques officiels'));

const weatherApiSnow=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-01-21 18:00',temp_c:-3,feelslike_c:-8,is_day:0,
  condition:{code:1225,text:'Heavy snow'},wind_kph:28,precip_mm:2.2,cloud:100
}});
assert('WeatherAPI snow normalized',weatherApiSnow.condition==='snow'&&weatherApiSnow.intensity>0);

const weatherApiFog=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-10-21 07:00',temp_c:7,feelslike_c:6,is_day:1,
  condition:{code:1135,text:'Fog'},wind_kph:4,precip_mm:0,cloud:100
}});
assert('WeatherAPI fog normalized',weatherApiFog.condition==='fog');

const weatherApiStorm=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-08-21 16:00',temp_c:24,feelslike_c:27,is_day:1,
  condition:{code:1276,text:'Moderate or heavy rain with thunder'},wind_kph:54,precip_mm:6,cloud:100
}});
assert('WeatherAPI storm normalized',weatherApiStorm.condition==='storm'&&weatherApiStorm.intensity>.6);

const weatherApiCloud=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-09-21 14:00',temp_c:17,feelslike_c:17,is_day:1,
  condition:{code:1009,text:'Overcast'},wind_kph:11,precip_mm:0,cloud:95
}});
assert('WeatherAPI cloud normalized',weatherApiCloud.condition==='cloud'&&weatherApiCloud.intensity>.8);

const weatherApiPartly=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-09-21 14:00',temp_c:18,feelslike_c:18,is_day:1,
  condition:{code:1003,text:'Partly cloudy'},wind_kph:10,precip_mm:0,cloud:48
}});
assert('WeatherAPI partly-cloudy normalized',weatherApiPartly.condition==='partly-cloudy');

const weatherApiWind=normalizeWeatherApiCurrent({current:{
  last_updated:'2026-09-21 14:00',temp_c:18,feelslike_c:16,is_day:1,
  condition:{code:1000,text:'Sunny'},wind_kph:58,precip_mm:0,cloud:8
}});
assert('WeatherAPI wind normalized',weatherApiWind.condition==='wind'&&weatherApiWind.intensity>0);

const mix=visualMix('winter','night',snow);
assert('winter night mix dims',mix.day.bright<1);
assert('snow weather mix exists',mix.weather.bright>=1);

const stormActivity=localActivityLens({season:'summer',daypart:'day',weather:storm});
const nightActivity=localActivityLens({season:'winter',daypart:'night',weather:{status:'not-connected'}});
const clearSummerActivity=localActivityLens({season:'summer',daypart:'day',weather:{status:'live',condition:'clear',intensity:0}});
assert('storm activity shelters kingdom',stormActivity.text.includes('abrités'));
assert('night activity strengthens lanterns',nightActivity.text.includes('Lanternes'));
assert('clear summer activity uses season rhythm',clearSummerActivity.text.includes('marchés plus animés'));

const functionSource=fs.readFileSync(new URL('../functions/api/local-context.js',import.meta.url),'utf8');
const weatherCss=fs.readFileSync(new URL('../assets/real-world-sync.css',import.meta.url),'utf8');
const headers=fs.readFileSync(new URL('../_headers',import.meta.url),'utf8');
assert('function must not return exact coordinates',functionSource.includes('exactCoordinatesReturned: false'));
assert('function must not return city',functionSource.includes('cityReturned: false')&&!functionSource.includes('context.request.cf.city'));
assert('function must not request GPS',functionSource.includes('gpsPermissionRequested: false'));
assert('site permissions policy keeps geolocation disabled',headers.includes('geolocation=()'));
assert('weather provider defaults off',functionSource.includes("MODARYX_WEATHER_MODE || 'off'"));
assert('WeatherAPI provider mode exists',functionSource.includes("mode === 'weatherapi'")&&functionSource.includes('https://api.weatherapi.com/v1/current.json'));
assert('WeatherAPI key is server-side env only',functionSource.includes('MODARYX_WEATHER_API_KEY')&&!fs.readFileSync(new URL('../assets/real-world-sync.mjs',import.meta.url),'utf8').includes('MODARYX_WEATHER_API_KEY'));
assert('WeatherAPI provider requires key',functionSource.includes('weatherModeRequiresKey(mode)'));
assert('WeatherAPI disables AQI payload',functionSource.includes("url.searchParams.set('aqi', 'no')"));
assert('provider coordinates are rounded before weather request',functionSource.includes('providerCoordinates.latitude'));
assert('wind visual layer exists',weatherCss.includes('data-local-weather=wind')&&weatherCss.includes('mx-wind-sweep'));
assert('cloud visual layer exists',weatherCss.includes('data-local-weather=cloud')&&weatherCss.includes('mx-cloud-drift'));
assert('clear-spell visual layer exists',weatherCss.includes('data-local-weather=partly-cloudy')&&weatherCss.includes('mx-clear-spell'));
assert('reduced motion disables weather transitions',weatherCss.includes('real-world-weather-layer{transition:none!important}'));
assert('reality sync must not rewrite shared chronicle',!fs.readFileSync(new URL('../assets/real-world-sync.mjs',import.meta.url),'utf8').includes("[data-world-chronicle]"));

console.log(JSON.stringify({
  marker:failures.length?'FAIL_TARGETED_REAL_WORLD_SYNC':'PASS_TARGETED_REAL_WORLD_SYNC',
  seasons:{
    northJanuary:seasonState(new Date('2026-01-15T12:00:00Z'),'north-temperate','UTC'),
    southJanuary:seasonState(new Date('2026-01-15T12:00:00Z'),'south-temperate','UTC'),
    tropical:seasonState(new Date('2026-01-15T12:00:00Z'),'tropical','UTC')
  },
  weather:{rain:rain.condition,snow:snow.condition,fog:fog.condition,storm:storm.condition,wind:wind.condition,cloud:cloud.condition,clearSpells:clearSpells.condition},
  weatherApi:{rain:weatherApiRain.condition,snow:weatherApiSnow.condition,fog:weatherApiFog.condition,storm:weatherApiStorm.condition,wind:weatherApiWind.condition,cloud:weatherApiCloud.condition,partlyCloudy:weatherApiPartly.condition},
  activities:{storm:stormActivity.text,night:nightActivity.text,summer:clearSummerActivity.text},
  privacy:{gps:false,exactCoordinatesReturned:false,providerRoundedDegrees:0.1},
  failures
},null,2));
if(failures.length)process.exitCode=1;
