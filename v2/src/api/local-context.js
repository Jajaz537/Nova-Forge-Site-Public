const SAFE_WEATHER = new Set(["clear","cloud","partly-cloudy","rain","snow","fog","storm","wind"]);

function numericPart(parts,type){
  const part=parts.find(entry=>entry.type===type);
  const value=Number(part?.value);
  return Number.isFinite(value)?value:null;
}

function zonedParts(now,timeZone){
  try{
    const formatter=new Intl.DateTimeFormat("en-US",{
      timeZone:timeZone||undefined,
      month:"numeric",
      hour:"numeric",
      hourCycle:"h23"
    });
    const parts=formatter.formatToParts(now);
    return {month:numericPart(parts,"month"),hour:numericPart(parts,"hour")};
  }catch{
    const formatter=new Intl.DateTimeFormat("en-US",{month:"numeric",hour:"numeric",hourCycle:"h23"});
    const parts=formatter.formatToParts(now);
    return {month:numericPart(parts,"month"),hour:numericPart(parts,"hour")};
  }
}

export function deriveSeason(month,climateBand){
  if(!Number.isInteger(month)||month<1||month>12) return "neutral";
  if(climateBand==="tropical") return "tropical";
  const south=climateBand==="south-temperate";
  const northSeason = month===12||month<=2 ? "winter"
    : month<=5 ? "spring"
    : month<=8 ? "summer"
    : "autumn";
  if(!south) return northSeason;
  return ({winter:"summer",spring:"autumn",summer:"winter",autumn:"spring"})[northSeason];
}

export function deriveDayPhase(hour){
  if(!Number.isInteger(hour)||hour<0||hour>23) return "neutral";
  if(hour<5||hour>=22) return "night";
  if(hour<9) return "dawn";
  if(hour<17) return "day";
  return "dusk";
}

export function ambientFromPayload(payload,{now=new Date()}={}){
  const unavailable={state:"UNAVAILABLE",season:"neutral",dayPhase:"neutral",weatherCondition:"off",weatherStatus:"unavailable",weatherIntensity:0};
  if(!payload||typeof payload!=="object") return unavailable;
  const privacy=payload.privacy||{};
  if(
    privacy.exactCoordinatesReturned!==false ||
    privacy.cityReturned!==false ||
    privacy.gpsPermissionRequested!==false
  ){
    return {...unavailable,state:"PRIVACY_REJECTED"};
  }

  const timezone=typeof payload.context?.timezone==="string"?payload.context.timezone:null;
  const climateBand=typeof payload.context?.climateBand==="string"?payload.context.climateBand:"unknown";
  const {month,hour}=zonedParts(now,timezone);
  const weatherStatus=typeof payload.weather?.status==="string"?payload.weather.status:"unavailable";
  const rawCondition=typeof payload.weather?.condition==="string"?payload.weather.condition:"off";
  const weatherCondition=weatherStatus==="live"&&SAFE_WEATHER.has(rawCondition)?rawCondition:"off";
  const intensity=weatherStatus==="live"&&Number.isFinite(Number(payload.weather?.intensity))
    ? Math.min(1,Math.max(0,Number(payload.weather.intensity)))
    : 0;

  return {
    state:"CONTEXT_READY",
    source:payload.source||"unknown",
    timezone,
    climateBand,
    season:deriveSeason(month,climateBand),
    dayPhase:deriveDayPhase(hour),
    weatherStatus,
    weatherCondition,
    weatherIntensity:Number(intensity.toFixed(3)),
    attribution:weatherStatus==="live"?payload.weather?.attribution||null:null
  };
}

export async function resolveAmbientContext({
  fetchImpl=globalThis.fetch,
  now=new Date(),
  timeoutMs=2500
}={}){
  const unavailable={state:"UNAVAILABLE",season:"neutral",dayPhase:"neutral",weatherCondition:"off",weatherStatus:"unavailable",weatherIntensity:0};
  if(typeof fetchImpl!=="function") return unavailable;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const response=await fetchImpl("/api/local-context",{
      method:"GET",
      credentials:"same-origin",
      headers:{accept:"application/json"},
      cache:"no-store",
      signal:controller.signal
    });
    if(!response.ok) return unavailable;
    const type=response.headers?.get?.("content-type")||"";
    if(!/application\/json/i.test(type)) return unavailable;
    return ambientFromPayload(await response.json(),{now});
  }catch{
    return unavailable;
  }finally{
    clearTimeout(timer);
  }
}
