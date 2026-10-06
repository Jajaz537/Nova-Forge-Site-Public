import {backendState} from "./backend-config.mjs";

function nonEmpty(value){
  return typeof value==="string"&&value.trim()?value.trim():null;
}

function weatherState(env={}){
  const mode=nonEmpty(env.MODARYX_WEATHER_MODE)||"off";
  const provider=mode==="weatherapi"?"WeatherAPI.com"
    : mode==="open-meteo-commercial"?"Open-Meteo commercial"
    : mode==="open-meteo-noncommercial"?"Open-Meteo non-commercial"
    : null;
  const requiresSecret=mode==="weatherapi"||mode==="open-meteo-commercial";
  const secretConfigured=Boolean(nonEmpty(env.MODARYX_WEATHER_API_KEY));
  const configured=Boolean(provider)&&(!requiresSecret||secretConfigured);
  return {
    kind:"weather",
    provider,
    mode,
    configured,
    activationState:mode==="off"?"OFF":configured?"CONFIGURED_NOT_PRODUCTION_APPROVED":"CONFIG_MISSING",
    serverSideOnly:true,
    exactLocationReturned:false,
    browserGpsRequired:false,
    legalState:mode==="weatherapi"?"EXTERNAL_ACCEPTANCE_AND_ATTRIBUTION_REQUIRED"
      : mode==="open-meteo-commercial"?"COMMERCIAL_TERMS_REQUIRED"
      : mode==="open-meteo-noncommercial"?"NON_COMMERCIAL_ONLY"
      : "NO_PROVIDER_SELECTED"
  };
}

export function providerRegistryState(env={}){
  const backend=backendState(env);
  const weather=weatherState(env);
  const authReady=backend.auth0.loginConfigured;
  const turnstileReady=backend.turnstile.secretConfigured&&backend.turnstile.siteKeyConfigured;
  const r2Ready=backend.bindings.r2;
  return {
    schemaVersion:1,
    environment:"runtime-current",
    productionApproval:"OPEN",
    privacy:{secretsReturned:false,exactWeatherCoordinatesReturned:false,browserGpsRequired:false},
    connectors:{
      auth:{kind:"identity",provider:"Auth0",configured:authReady,state:authReady?"CONFIGURED":"NOT_CONFIGURED"},
      antiAbuse:{kind:"anti-abuse",provider:"Cloudflare Turnstile",configured:turnstileReady,state:turnstileReady?"CONFIGURED":"NOT_CONFIGURED"},
      artifactStorage:{kind:"artifact-storage",provider:"Cloudflare R2",configured:r2Ready,state:r2Ready?"CONFIGURED":"NOT_CONFIGURED"},
      weather,
      email:{kind:"email",provider:null,configured:false,state:"NOT_IMPLEMENTED"},
      push:{kind:"push",provider:null,configured:false,state:"NOT_IMPLEMENTED"}
    }
  };
}
